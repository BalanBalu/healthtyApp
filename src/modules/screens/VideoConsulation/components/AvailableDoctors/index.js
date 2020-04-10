import React, { Component } from 'react';
import { Container, Content, View, Text, Item,Input, Thumbnail,Icon, Radio,Row,Col,Form,Button, Toast } from 'native-base';
import {StyleSheet,TextInput, AsyncStorage , TouchableOpacity } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import { hasLoggedIn } from "../../../../providers/auth/auth.actions";
import {
    renderDoctorImage,
} from '../../../../common';
import Spinner from '../../../../../components/Spinner';
import {
    fetchAvailableDoctors4Video, createVideoConsuting
} from '../../services/video-consulting-service';
import { POSSIBLE_VIDEO_CONSULTING_STATUS } from '../../constants';
import { possibleChatStatus } from '../../../../../Constants/Chat';
import { SERVICE_TYPES } from '../../../../../setup/config';
import {
    searchDoctorList
} from '../../../../providers/bookappointment/bookappointment.action';
import {
    fetchAvailableDoctors4Chat, createChat
} from '../../../../providers/chat/chat.action';
import BookAppointmentPaymentUpdate from '../../../../providers/bookappointment/bookAppointment';
import { AuthService } from '../../services'
class AvailableDoctors4Video extends Component {
    constructor(props) {
        super(props)
        this.userId = null;
        this.state = {
            availableChatDoctors: [],
            availableVideoDoctors: [],
            isLoading: true
        }
        this.bookAppointmentPaymentUpdate = new BookAppointmentPaymentUpdate();
    }
async componentDidMount() {
    const isLoggedIn = await hasLoggedIn(this.props);
    if (!isLoggedIn) {
        this.props.navigation.navigate("login");
        return;
    }
    this.userId = await AsyncStorage.getItem("userId");
    this.callVideAndChat()
   
}
async callVideAndChat(doctorIds) {
    this.setState({ isLoading: true })
    let availablityMap = new Map()
    let [ availableDocsVideo, availableDocsChat ] = await Promise.all([
        this.getDoctorAvailableDoctorData(doctorIds).catch(ex => { console.log(ex);return [] } ),
        this.getDoctorAvailableDoctorDataChat(doctorIds).catch(ex => { console.log(ex); return [] }),
    ])
    console.log('availableDocsChat==>,', availableDocsChat);
    availableDocsVideo.forEach(doc => {
        doc.availableForVideo = true;
        availablityMap.set(doc.doctor_id, doc);
    });
    availableDocsChat.forEach(docChat => {
        docChat.availableForChat = true;
        if (availablityMap.has(docChat.doctor_id)) {
            let docData = availablityMap.get(docChat.doctor_id);
            docData.availableForChat = true;
            docData.chat_service_config = docChat.chat_service_config;
            availablityMap.set(docChat.doctor_id, docData);
        } else {
            availablityMap.set(docChat.doctor_id, docChat);
        }
    })
    this.setState({ isLoading: false })

    this.setState({ availableVideoDoctors: Array.from(availablityMap.values()) })
}
 searchAvailableDoctorsByKeywords = async(searchKeyword) => {
    try {
        this.setState({ isLoading: true })
      const searchedInputValues = [
        {
            type: 'category',
           value: searchKeyword 
        },
        {
           type: 'service',
           value: searchKeyword
        },
        {
           type: 'symptoms',
           value: [ searchKeyword ]
        }
      ];
      let resultData = await searchDoctorList(this.userId, searchedInputValues);
      if (resultData.success) {
        let doctorIds = resultData.data.map((element) => {
            return element.doctor_id
        });
        console.log(doctorIds);
        this.callVideAndChat(doctorIds);// for getting multiple Doctor details,Reviews ,ReviewCount,etc....
      } else {
          console.log('Coming to no symptoms Found');
          this.setState({ isLoading: false, availableChatDoctors: [], availableVideoDoctors: [] })
      }
    } catch (error) {
        console.log('Error on searchAvailableDoctorsByKeywords', error)
    } finally {
        this.setState({ isLoading: false })
    }
 }


 getDoctorAvailableDoctorData = async(doctorIds) => {
    try {
         if(doctorIds) {
            doctorIds = doctorIds.join(',')
         }
         const availableDocData = await fetchAvailableDoctors4Video(doctorIds);
         if (availableDocData.success === true) {
           return availableDocData.data;
         }
    } catch (error) {
            console.log(error);
            return [];
    }
    return [];
 }
 getDoctorAvailableDoctorDataChat = async (doctorIds) => {
    console.log('doctorIds' + JSON.stringify(doctorIds));
    try {
        let request = {};
        if(doctorIds) { 
            request = {
                doctor_ids: doctorIds
            }
        }
        const availableDocData = await fetchAvailableDoctors4Chat(request);
        if (availableDocData.success === true) {
            return availableDocData.data
        }
    } catch (error) {
        return []
    }
    return []
}
onBookButtonPress4PaymentChat = async (doctorId, fee) => {
    try {
        this.setState({ isLoading: true });
        const amount = fee;

        const createChatRequest = {
            user_id: this.userId,
            doctor_id: doctorId,
            status: possibleChatStatus.PAYMENT_IN_PROGRESS,
            fee: fee,
            status_by: 'USER',
            statusUpdateReason: 'NEW CONVERSATION',
            day: new Date().getDay()
        }
        const createChatResponse = await createChat(createChatRequest)
        this.setState({ isLoading: false });
        if (createChatResponse.success) {
            console.log(createChatResponse);
            if(fee === 0) {
                const bookSlotDetails = {
                    doctorId: doctorId,
                    fee: amount,
                    chatId: createChatResponse.conversation_id
                }
                let response = await this.bookAppointmentPaymentUpdate.updatePaymentDetails(true, {}, 'cash', bookSlotDetails, SERVICE_TYPES.CHAT, this.userId, 'cash');
                if(response.success) {
                    this.props.navigation.navigate('SuccessChat', { manualNaviagationPage : 'Home' });
                    Toast.show({
                        text: 'Your Chat Consultation Request Success. We will notify Doctor',
                        type: 'success',
                        duration: 3000
                    });
                    AuthService.signup(this.userId);
                } else {
                    Toast.show({
                        text: 'We could not Process Your Video Consultation Request at this time. Please Try again later',
                        type: 'success',
                        duration: 3000
                    });
                }
            }  else {
                this.props.navigation.navigate('paymentPage', {
                    service_type: SERVICE_TYPES.CHAT,
                    bookSlotDetails: {
                        doctorId: doctorId,
                        fee: amount,
                        chatId: createChatResponse.conversation_id
                    }, amount: amount
                });
         } 
        } else {
            Toast.show({
                text: createChatResponse.message,
                duration: 3000,
                type: 'danger'
            })
        }
    } catch (error) {
        Toast.show({
            text: 'Excption Occured' + error,
            duration: 3000,
            type: 'danger'
        })
    }

}
 onBookButtonPress4PaymentVideo = async(doctorId, fee) => {
  try {
    
     this.setState({ isLoading: true });
     const amount = fee;
     let freeService = false;
     if(fee === 0) {
        freeService = true;
     }
      
     const videoConsultRequest = {
        user_id: this.userId,
        doctor_id: doctorId,
        status: POSSIBLE_VIDEO_CONSULTING_STATUS.PAYMENT_IN_PROGRESS,
        fee: fee,
        status_by: 'USER',
        statusUpdateReason: 'NEW VIDEO CONSULTATION'
     }
     const createVideoConsultingResponse = await createVideoConsuting(videoConsultRequest)
     this.setState({ isLoading: false });
     if(createVideoConsultingResponse.success) {
        console.log(createVideoConsultingResponse);
        if(fee === 0) {
            videoConsultRequest.status = POSSIBLE_VIDEO_CONSULTING_STATUS.PENDING;
            const bookSlotDetails  = {
                doctorId : doctorId,
                fee: amount,
                consultationId: createVideoConsultingResponse.consultationId    
            }
           
            let response = await this.bookAppointmentPaymentUpdate.updatePaymentDetails(true, {}, 'cash', bookSlotDetails, SERVICE_TYPES.VIDEO_CONSULTING, this.userId, 'cash');
            if(response.success) {
                this.props.navigation.navigate('SuccessChat', { manualNaviagationPage : 'Home' });
                Toast.show({
                    text: 'Your Video Consultation Request Success. We will notify the Doctor',
                    type: 'success',
                    duration: 3000
                });
                AuthService.signup(this.userId);
            } else {
                Toast.show({
                    text: 'We could not Process Your Video Consultation Request at this time. Please Try again later',
                    type: 'success',
                    duration: 3000
                });
            }
            console.log('AfterVIdeo Creating', response)
        } else {
            this.setState({ isLoading: false });
            this.props.navigation.navigate('paymentPage', { 
                service_type: SERVICE_TYPES.VIDEO_CONSULTING,
                bookSlotDetails: {
                    doctorId : doctorId,
                    fee: amount,
                    consultationId: createVideoConsultingResponse.consultationId    
                }, amount: amount }
        );
        }
     } else { 
        this.setState({ isLoading: false });
        Toast.show({
            text: createVideoConsultingResponse.message,
            duration: 3000,
            type: 'danger'
        })
     }
    
 } catch (error) {
      Toast.show({
        text: 'Excption Occured'  +error,
        duration: 3000,
        type: 'danger'
      })
  }
  finally {
    this.setState({ isLoading: false });
  }
    
 }
   getVideoConsultFee(item) {
       if(item && item.availabilityData && item.availabilityData[0]) {
            return item.availabilityData[0].fee
       } else {
           return ''
       }
   }
   getDoctorCategory(item) {
    if(item.specialist) {
       let specialist =  item.specialist.map(ele => ele.category).join(', ')
       return  specialist.slice(0, specialist.length - 1)
    }
    return ''
   }
   checkAnySeriveFreeFor2ShowPremiumBatch(item) {
    if ( (item && item.availabilityData && item.availabilityData[0] && item.availabilityData[0].fee === 0 ) 
        || (item && item.chat_service_config && item.chat_service_config.chat_fee === 0 ) 
    ) {
       return true;
    }
    return false;
   }
   renderAvailableDoctors(item) {
       const isPremium = this.checkAnySeriveFreeFor2ShowPremiumBatch(item);
       
        return (
            <Row style={styles.RowStyle}>
                <Col style={{ width: '20%' }}>
                    <Thumbnail source={renderDoctorImage(item)}
                            style={{ width: 60, height: 60, position: 'relative', borderRadius: 60 / 2 }}
                    />
                    <View style={styles.circle} />
                        {isPremium === true ? 
                            <Thumbnail source={require('../../../../../../assets/images/viplogo.png')}
                                style={{ width: 25, height: 25, position: 'absolute', borderRadius: 50 / 2, marginTop: 45, marginLeft: 35 }}
                            /> : null }
                        </Col>

                                <Col style={{ width: '80%' }}>
                                    <Row>
                                        <Text style={styles.docname}>{item.prefix || ''} {item.first_name || ''} {item.last_name || ''}{'  '}
                                        {isPremium === true ? 
                                        <Text style={{ paddingLeft: 5, paddingRight: 5, fontSize: 10, fontFamily: 'OpenSans', marginLeft: 5, backgroundColor: '#F3EBF8', justifyContent: 'space-between' }}>
                                            {'  '}SPONSORED{'  '}</Text> : null }
                                        </Text>
                                    </Row>
                                    <Row style={{ marginTop: 2 }}>
                                        <Text style={styles.docname}>{ 'Specialist in '} 
                                            <Text note style={styles.status}>{ this.getDoctorCategory(item) }</Text>
                                        </Text>
                                    </Row>
                                
                                    <Row>
                                       {item.availableForChat === true ? <Col style={ { width: '40%' } }>
                                            <TouchableOpacity onPress={() => this.onBookButtonPress4PaymentChat(item.doctor_id, item.chat_service_config.chat_fee)}
                                                style={{ textAlign: 'center', borderColor: '#5A89B6', borderWidth: 1, marginTop: 10, borderRadius: 20, height: 25, justifyContent: 'center', flexDirection: 'row' }}>
                                                <Icon name="ios-call" style={{ color: '#5A89B6', fontSize: 15, marginTop: 5 }} />
                                                <Text style={{ textAlign: 'center', color: '#5A89B6', fontSize: 12, padding: 3, fontWeight: 'bold', fontFamily: 'OpenSans', marginLeft: 2 }}>{ item.chat_service_config.chat_fee === 0 ? 'Free Consult' :  `Chat - ₹ ${item.chat_service_config.chat_fee}` }</Text>
                                            </TouchableOpacity>
                                        </Col> : null }
                                        
                                       {item.availableForVideo === true  ? <Col style={{ marginLeft: 10, width: '40%' }}>
                                            <TouchableOpacity onPress={() => this.onBookButtonPress4PaymentVideo(item.doctor_id, this.getVideoConsultFee(item))}
                                                style={{ textAlign: 'center', borderColor: '#5A89B6', borderWidth: 1, marginTop: 10, borderRadius: 20, height: 25, justifyContent: 'center', flexDirection: 'row' }}>
                                                <Icon name="ios-videocam" style={{ color: '#5A89B6', fontSize: 15, marginTop: 5 }} />
                                                <Text style={{ textAlign: 'center', color: '#5A89B6', fontSize: 12, padding: 3, fontWeight: 'bold', fontFamily: 'OpenSans', marginLeft: 2 }}> {this.getVideoConsultFee(item) === 0 ? 'Free Consult' : `Video - ₹ ${this.getVideoConsultFee(item)}`}</Text>
                                            </TouchableOpacity>
                                        </Col> : null } 
                                    </Row>
                                </Col>


                                {/* <Col style={{ width: '15%' }}>
                                    <Row>
                                        <Col style={{ alignItems: 'center' }}>
                                            <Text style={styles.msgStyle}>{'\u20B9'}{this.getVideoConsultFee(item)}</Text>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ alignItems: 'center', marginTop: -25 }}>
                                            <TouchableOpacity onPress={() => this.onBookButtonPress4Payment(item.doctor_id, item.chat_service_config.chat_fee)}
                                                style={{ textAlign: 'center', backgroundColor: 'green', borderColor: '#000', marginTop: 10, borderRadius: 20, height: 25, justifyContent: 'center' }}>
                                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, padding: 3, fontWeight: 'bold', fontFamily: 'OpenSans' }}>Chat</Text>
                                            </TouchableOpacity>
                                        </Col>
                                    </Row>
                                </Col> */}
                            </Row>
                )
   }
    render() {
        const { availableVideoDoctors, keyword, isLoading } = this.state;
        return (
          <Container>
            <Content>
            <Spinner
					visible={isLoading} 
                />
                <View style={{backgroundColor: '#7E49C3'}}> 
                    <View style={{marginTop:20}}>
                        <Text style={styles.SubText}>Search for Doctors</Text>
    
                        <Row style={styles.SearchRow}>
                        
                          <Col size={9.1} style={{justifyContent:'center',}}> 
                            <Input 
                                placeholder="Search for Symptoms,Categories,etc"
                                style={styles.inputfield}
                                onChangeText={(text)=> this.setState({ keyword: text })}
                                placeholderTextColor="gray"
                                keyboardType={'email-address'}
                                underlineColorAndroid="transparent"
                                blurOnSubmit={false}
                            />
                            </Col>
                            <Col size={0.9} style={{justifyContent:'center',borderRightRadius:10}}> 
                               <TouchableOpacity onPress={()=> this.searchAvailableDoctorsByKeywords(keyword)} style={styles.SearchStyle}>
                                 <Icon name="ios-search" style={{ color: '#fff', fontSize:20,padding:2}} />
                               </TouchableOpacity>
                            </Col>
                        </Row>                    
                    </View>
                    </View>
               
                    {availableVideoDoctors.length === 0 && isLoading === false ?
					<View style={{ alignItems: 'center', justifyContent: 'center', height: 450 }}>
						<Text style={{ fontFamily: "OpenSans", fontSize: 15, marginTop: "10%", textAlign: 'center' }} note>
							No Doctors Found for your Search
						</Text>
                    </View>
              :   
              <FlatList
                        style={{ marginTop: 10 }}
                        extraData={availableVideoDoctors}
                        data={availableVideoDoctors}
                        renderItem={({ item }) =>
                                this.renderAvailableDoctors(item)
                        }
                        keyExtractor={(item, index) => index.toString()} />
                    }
            </Content>
        </Container>
      )
    }
}

export default AvailableDoctors4Video

const styles = StyleSheet.create({

    docname: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        fontWeight: 'bold'
    },
    date: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: 'gray',
        marginLeft: 15,
        marginTop: 3
    },
    status: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: 'gray'
    },
    msg: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#fff',
        borderRadius: 50,
        backgroundColor: 'blue',
        width: '35%',
        textAlign: 'center'
    },
    msgStyle: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: 'blue',
    },
    circle: {
        width: 12,
        height: 12,
        borderRadius: 12 / 2,
        backgroundColor: 'green',
        position: 'absolute',
        marginLeft: 45,
        marginTop: 5
    },
    RowStyle: {
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 10,
        paddingBottom: 10
    },
    SubText: {
        color: '#FFF',
        fontFamily: 'OpenSans',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 20
    },
    SearchRow: {
        backgroundColor: 'white',
        borderColor: '#000',
        borderRadius: 20,
        height: 30,
        marginRight: 20,
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 20
    },
    inputfield: {
        color: 'gray',
        fontFamily: 'OpenSans',
        fontSize: 10,
        padding: 5,
        paddingLeft: 10
    },
    SearchStyle: {
        backgroundColor: '#7E49C3',
        width: '85%',
        alignItems: 'center',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        marginTop: 2,
        marginBottom: 2
    }

})