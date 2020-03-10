import React, { Component } from 'react';
import { Container, Content, View, Text, Item,Input, Spinner,Thumbnail,Icon, Radio,Row,Col,Form,Button, Toast } from 'native-base';
import {StyleSheet,TextInput, AsyncStorage , TouchableOpacity } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import { hasLoggedIn } from "../../providers/auth/auth.actions";
import {
    searchDoctorList
} from '../../providers/bookappointment/bookappointment.action';
import {
    fetchAvailableDoctors4Chat, createChat
} from '../../providers/chat/chat.action';
import {
    renderDoctorImage,
} from '../../common';
import { possibleChatStatus } from '../../../Constants/Chat';
import { SERVICE_TYPES } from '../../../setup/config'
class AvailableDoctors4Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            availableChatDoctors: [],
            userId: null
        }
    }
async componentDidMount() {
    const isLoggedIn = await hasLoggedIn(this.props);
    if (!isLoggedIn) {
        this.props.navigation.navigate("login");
        return;
    }
    let userId = await AsyncStorage.getItem("userId");
    this.setState({ userId });
    await new Promise.all([
        this.searchAvailableDoctorsByKeywords('Primary'),
    ]);
}
 searchAvailableDoctorsByKeywords = async(searchKeyword) => {
    const userId = await AsyncStorage.getItem('userId');
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
    let resultData = await searchDoctorList(userId, searchedInputValues);
    if (resultData.success) {
        let doctorIds = resultData.data.map((element) => {
            return element.doctor_id
        });
        console.log(doctorIds);
        this.getDoctorAvailableDoctorData(doctorIds);// for getting multiple Doctor details,Reviews ,ReviewCount,etc....
    } else {
        console.log('Coming to no symptoms Found');
        this.setState({ isLoading: false, availableChatDoctors: [] })
    }
 }
 getDoctorAvailableDoctorData = async(doctorIds) => {
        console.log('doctorIds' + JSON.stringify(doctorIds));
        const request = {
            doctor_ids: doctorIds
        }
       const availableDocData = await fetchAvailableDoctors4Chat(request);
       if(availableDocData.success === true) {
        availableDocData.data.map(ele => {
            const category = ele.specialist.map(item => item.category)
                .filter((value, index, self) => self.indexOf(value) === index)
            ele.category = category.join(', ');
            return ele;
        })
           this.setState({ availableChatDoctors: availableDocData.data })
       }
       console.log('availableDocData');
       console.log(availableDocData);
 }

 onBookButtonPress4Payment = async(doctorId, fee) => {
    try {
     this.setState({ isLoading: true });
     const { userId } = this.state;
     const amount = fee;
      
     const createChatRequest = {
        user_id: userId,
        doctor_id: doctorId,
        status: possibleChatStatus.PAYMENT_IN_PROGRESS,
        fee: fee,
        status_by: 'USER',
        statusUpdateReason: 'NEW CONVERSATION'
     }
     const createChatResponse = await createChat(createChatRequest)
     this.setState({ isLoading: false });
     if(createChatResponse.success) {
        console.log(createChatResponse);
        this.props.navigation.navigate('paymentPage', { 
            service_type: SERVICE_TYPES.CHAT, 
            bookSlotDetails: { 
                doctorId : doctorId,
                fee: amount,
                chatId: createChatResponse.conversation_id    
            }, amount: amount }
        );
     } else {
        Toast.show({
            text: createChatResponse.message,
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
    
 }
     render() {
        const { availableChatDoctors, keyword } = this.state;
        return (
          <Container>
            <Content>
                
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
               

              <FlatList
                style={{marginTop: 10}}
                extraData={availableChatDoctors}    
                data={availableChatDoctors}
                renderItem={({item}) =>
                 <Row style={styles.RowStyle}>
                   <Col style={{width:'15%'}}>
                       <Thumbnail source={renderDoctorImage(item)} 
                            style={{width:50,height:50,position:'relative',borderRadius:50/2}}
                        />
                       <View style={styles.circle} />
                    </Col>
                   
                    <Col style={{width:'70%'}}>
                      <Row>
                         <Col style={{width:'75%'}}>
                            <Text style={styles.docname}>{item.prefix || ''} {item.first_name || ''} {item.last_name || ''}</Text>
                        </Col>
                      </Row>
                      <Row>
                        <Col style={{width:'100%'}}>
                            <Text style={styles.status}>{item.category}</Text>
                        </Col>
                      </Row>
                    </Col>
                    
                    
                    <Col style={{width:'15%' }}>
                        <Row>
                            <Col style={{alignItems:'center'}}>
                                <Text style={styles.msgStyle}>{'\u20B9'}{item.chat_service_config.chat_fee}</Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => this.onBookButtonPress4Payment(item.doctor_id, item.chat_service_config.chat_fee)} 
                                    style={{ textAlign: 'center', backgroundColor: 'green', borderColor: '#000', marginTop: 10, borderRadius: 20, height: 25, justifyContent: 'center' }}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12,padding: 3, fontWeight: 'bold', fontFamily: 'OpenSans' }}>Chat</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </Col>
                 </Row>
              }
              keyExtractor={(item, index) => index.toString()}/>
            </Content>
        </Container>
      )
    }
}

export default AvailableDoctors4Chat

const styles = StyleSheet.create({

    docname:{
        fontFamily:'OpenSans',
        fontSize:14,
        fontWeight:'bold'
    },
    date:{
        fontFamily:'OpenSans',
        fontSize:12,
        color:'gray',
        marginLeft:15,
        marginTop:3
    },
    status:{
        fontFamily:'OpenSans',
        fontSize:14,
        color:'gray'
    },
    msg:{
        fontFamily:'OpenSans',
        fontSize:14,
        color:'#fff',
        borderRadius:50,
        backgroundColor:'blue',
        width:'35%',
        textAlign:'center'
    },
    msgStyle:{
        fontFamily:'OpenSans',
        fontSize:12,
        color:'blue',
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: 10/2,
        backgroundColor: 'green',
        position:'absolute',
        marginLeft:40,
        marginTop:5
    },
    RowStyle:{
        borderBottomColor:'gray',
        borderBottomWidth:0.5,
        marginLeft:10,
        marginRight:10,
        paddingTop:10,
        paddingBottom:10
    },
    SubText:{
        color:'#FFF',
        fontFamily:'OpenSans',
        fontSize:14,
        fontWeight:'bold',
        marginLeft:20
    },
    SearchRow:{
        backgroundColor: 'white', 
        borderColor: '#000', 
        borderRadius: 20,
        height:30,
        marginRight:20,
        marginLeft:20,
        marginTop:10 ,
        marginBottom: 20
    },
    inputfield:{
        color: 'gray', 
        fontFamily: 'OpenSans', 
        fontSize: 10, 
        padding:5,
        paddingLeft:10
    },
    SearchStyle:{
        backgroundColor:'#7E49C3',
        width:'85%',
        alignItems:'center',
        borderTopRightRadius:20,
        borderBottomRightRadius:20,
        marginTop: 2, 
        marginBottom: 2
    }

})