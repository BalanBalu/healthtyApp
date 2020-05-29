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
import moment from 'moment';
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
    const sorted = Array.from(availablityMap.values()).sort((eleA,eleB ) => {
        const eleAVa = this.getMinVideoChatConsultFee(eleA);
        const eleBVa = this.getMinVideoChatConsultFee(eleB);
        return eleAVa - eleBVa;
    })
    this.setState({ availableVideoDoctors: sorted, isLoading: false})
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
        console.log(fee);
        let freeService = false;
         if(fee == 0) {
            freeService = true;
        }
        debugger
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
            if(freeService === true) {
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
     if(fee == 0) {
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
        if(freeService === true) {
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
       if(item && item.currentAvailabilityData) {
            return item.currentAvailabilityData.fee
       } else {
           return ''
       }
   }
   getChatFee(item) {
       if(item.chat_service_config && item.chat_service_config.chat_fee) {
           return item.chat_service_config.chat_fee;
       } else {
           return ''
       }
   }
   getMinVideoChatConsultFee(item) {
        let videoFee = null;
        let chatFee = null;
        console.log(item);
        if(item && item.availabilityData && item.availabilityData[0]) {
            videoFee = Number(item.availabilityData[0].fee);
        } 
        if(item.chat_service_config) {
            if(item.chat_service_config.chat_fee !== undefined && item.chat_service_config.chat_fee !== null && item.chat_service_config.chat_fee !== '') {
                chatFee = Number(item.chat_service_config.chat_fee);
            }
        }
        if(videoFee !== null && chatFee !== null) {
            return Math.min(videoFee, chatFee)
        }
        if(videoFee !== null) {
            return videoFee;
        } 
        if(chatFee !== null) {
            return chatFee;
        }
   }
   getDoctorCategory(item) {
    if(item.specialist) {
       let specialist =  item.specialist.map(ele => ele.category);
       return specialist.join(', ');
    }
    return ''
   }
   checkAnySeriveFreeFor2ShowPremiumBatch(item) {
    if ( (item && item.availabilityData && item.availabilityData[0] && item.availabilityData[0].fee == 0 ) 
        || (item && item.chat_service_config && item.chat_service_config.chat_fee == 0 ) 
    ) {
       return true;
    }
    return false;
   }

   checkBothSeriveFreeFor2ShowPremiumBatch(item) {
    if ( (item && item.availabilityData && item.availabilityData[0] && item.availabilityData[0].fee == 0 ) 
        && (item && item.chat_service_config && item.chat_service_config.chat_fee == 0 ) 
    ) {
       return true;
    }
    return false;
   }
   getNextAvailabiltyData(item) {
        const currentDay = new Date().getDay();
        if(item.availabilityData[0]) {
            let startTime = String(item.availabilityData[0].start_time).split(':');
            const timing = new Date(); 
            timing.setUTCHours(startTime[0]);
            timing.setUTCMinutes(startTime[1]);
            timing.setUTCSeconds(1);
            const timeAfterFormat = moment(timing).format('HH:mm A')
            
            if(Number(item.availabilityData[0].day) >= currentDay) {
                

                return moment().startOf('w').add(Number(item.availabilityData[0].day), 'd').
                format('MMM DD, YYYY') + ' ' + timeAfterFormat
            } else {
                return moment().startOf('w').add(1, 'week').add(Number(item.availabilityData[0].day), 'd')
                .format('MMM DD, YYYY') + ' ' + timeAfterFormat
            }
        }
        
   }
   renderAvailableDoctors(item) {
       const isPremium = this.checkAnySeriveFreeFor2ShowPremiumBatch(item);
       const isBothPremium = this.checkBothSeriveFreeFor2ShowPremiumBatch(item);
       const isVideoFree = this.getVideoConsultFee(item) === 0;
       const isChatFree = item.chat_service_config && item.chat_service_config.chat_fee == 0; //&& Number(item.chat_service_config.chat_fee) === 0;
       
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
                                        <Col size={6}>
                                        <Text style={styles.docname}>{item.prefix || ''} {item.first_name || ''} {item.last_name || ''}{'  '}</Text>
                                        </Col>
                                        <Col size={4}>
                                        <Row style={{justifyContent:'center'}}>
                                        {isPremium === true ? 
                                        <Text style={{ paddingLeft: 5, paddingRight: 5, fontSize: 10, fontFamily: 'OpenSans', marginLeft: 5, backgroundColor: '#8EC63F',borderRadius:10,color:'#fff',height:15,marginTop:3}}>
                                            SPONSORED</Text> : null }
                                            </Row>
                                        </Col>
                                        
                                           
                                    </Row>
                                    <Row style={{ marginTop: 2 }}>
                                        <Text style={styles.docname}>{ ''} 
                                            <Text note style={styles.status}>{ this.getDoctorCategory(item) }</Text>
                                        </Text>
                                    </Row>
                                
                                    <Row>
                                    { isBothPremium === true ?
                                        <Col style={{ width: '45%'}}>
                                            <Row>
                                            <Col size={1}>
                                            <Icon name="ios-checkmark" style={{
                                                fontSize:30,color:'#8EC63F',
                                                marginTop:6}}/>
                                                </Col>
                                                <Col size={9}  style={{justifyContent:'center'}}>
                                                    <Text style={{color: '#8EC63F', fontSize: 12,  
                                                        fontWeight: 'bold', 
                                                        fontFamily: 'OpenSans', 
                                                        marginLeft: 2,
                                                        marginTop:6}
                                                    }>Free Consultation !</Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                    : null}
                                     {item.availableForChat === true ? 
                                      <Col style={[ isBothPremium ?  { width: '25%'} : {  width: '35%'  } , { marginRight: 5}]}>
                                            <TouchableOpacity onPress={() => this.onBookButtonPress4PaymentChat(item.doctor_id, item.chat_service_config.chat_fee)}
                                                style={ isBothPremium ? styles.ButtonStyle : isChatFree ? styles.ButtonStyleSponsor : styles.ButtonStyle}>
                                                <Icon name="ios-chatboxes" style={!isBothPremium && isChatFree ?  { color: '#FFFFFF', fontSize: 15, marginTop: 2 }:  { color: '#5A89B6', fontSize: 15, marginTop: 2 } } />
                                                <Text  style={ isBothPremium && isChatFree ? styles.TextStyle  : isChatFree ? styles.SponsorText : styles.TextStyle  }>
                                                  {isBothPremium ? 'Chat' : isChatFree ? 'Free Consult' :  `Chat - ₹ ${item.chat_service_config.chat_fee}` }</Text>
                                            </TouchableOpacity>
                                        </Col> 
                                       : null }
                                        
                                       {item.availableForVideo === true && item.hasCurrentlyAvailable === true ? 
                                          <Col style={isBothPremium ? {width: '25%'  } :  { width: '35%' } }>
                                            <TouchableOpacity onPress={() => this.onBookButtonPress4PaymentVideo(item.doctor_id, this.getVideoConsultFee(item))}
                                                style={isBothPremium ? styles.ButtonStyle : isVideoFree ? styles.ButtonStyleSponsor : styles.ButtonStyle}>
                                                <Icon name="ios-videocam" style={!isBothPremium && isVideoFree ? { color: '#FFFFFF', fontSize: 15, marginTop: 2 } : { color: '#5A89B6', fontSize: 15, marginTop: 2 }} />
                                                <Text style={isBothPremium ? styles.TextStyle  : isVideoFree ? styles.SponsorText :  styles.TextStyle  }> 
                                                    { isBothPremium ? 'Video' : isVideoFree ? 'Free Consult' : `Video - ₹ ${this.getVideoConsultFee(item)}`}
                                                </Text>
                                            </TouchableOpacity>
                                          </Col> 
                                        :  
                                       null } 
                                       
                                    
                                    </Row>
                                    {item.availableForVideo === true && item.hasCurrentlyAvailable === false ? 
                                        <Row style={{ marginTop: 5 ,  width: '100%'}}>
                                            <Button disabled style={{height: 30,   borderRadius: 10, backgroundColor: '#6e5c7b' }}>
                                            <Icon name="ios-videocam" style={ { color: '#FFFFFF', fontSize: 15 }} />
                                            <Text style={{ marginLeft: -20, fontSize: 10 }}>next Available on {this.getNextAvailabiltyData(item)}</Text>
                                            {/*nextAvailableDate ? <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 15 }}>Next Availability On {nextAvailableDate}</Text> : <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 16 }}> No Availablity for Next 7 Days</Text>*/}
                                            </Button>
                                        </Row> : null }
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
    },
    ButtonStyle:{
        textAlign: 'center', 
        borderColor: '#5A89B6', 
        borderWidth: 1, 
        marginTop: 10, 
        borderRadius: 20, 
        height: 25, 
        justifyContent: 'center',
        flexDirection: 'row',
        paddingLeft:6,
        paddingRight:6,
        paddingTop:2,
        paddingBottom:2,
    },
    ButtonStyleSponsor:{
        textAlign: 'center', 
        backgroundColor : '#8EC63F',
        borderColor: '#8EC63F', 
        borderWidth: 1, 
        marginTop: 10, 
        justifyContent: 'center',
        borderRadius: 20, 
        height: 25, 
        
        flexDirection: 'row',
        paddingLeft:6,
        paddingRight:6,
        paddingTop:2,
        paddingBottom:2,
    },
    SponsorText:{
        textAlign: 'center', 
        color: '#FFFFFF', 
        fontSize: 8, 
        fontWeight: 'bold', 
        fontFamily: 'OpenSans', 
        marginTop:4,
        marginLeft: 4,
        
    },
    TextStyle:{
        textAlign: 'center', 
        color: '#5A89B6', 
        fontSize: 10, 
        fontWeight: 'bold', 
        fontFamily: 'OpenSans', 
        marginLeft: 4,
        marginTop:4
    }

})