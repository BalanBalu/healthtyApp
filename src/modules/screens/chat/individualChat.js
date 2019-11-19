import React, { Component } from 'react';
import { Container, Content, View, Text,Right, Item,Input,Card,Grid,Left,Icon,Thumbnail, Spinner,Footer, Radio,Row,Col,Form,Button, } from 'native-base';
import {StyleSheet,TextInput,ImageBackground, FlatList, ScrollView, AsyncStorage, TouchableOpacity ,Image} from 'react-native'
import {
    renderDoctorImage, renderProfileImage
} from '../../common';

import SocketIOClient from 'socket.io-client';
import { CHAT_API_URL } from '../../../setup/config';
import axios from 'axios';
import { getRelativeTime } from '../../../setup/helpers';
import { possibleChatStatus } from '../../../Constants/Chat';

class IndividualChat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chat_id: null, 
            doctorInfo: null, 
            userInfo: null,
            userId: null,
            messages: [],
            typing: '',
            messageRecieveCount: 0,
            status: null
        }
        this.onReceivedMessage = this.onReceivedMessage.bind(this);
        this.onSend = this.onSend.bind(this);
        this.setTyping = this.setTyping.bind(this);
    }
   async componentDidMount() {
        const {  chat_id, doctorInfo, userInfo , status} = this.props.navigation.getParam('chatInfo')
        this.props.navigation.setParams({
            appBar: {
                title: doctorInfo.doctor_name,
                profile_image: renderDoctorImage(doctorInfo)
            }
        });
        const userId = await AsyncStorage.getItem('userId');
        this.setState({ chat_id, doctorInfo, userInfo, userId, status });
      
        this.socket = SocketIOClient(CHAT_API_URL, {
                query: {
                   member_id: userId 
                }
        });
        const conversationId = chat_id;
        this.socket.on(conversationId +'-message', this.onReceivedMessage);
        this.getMessages();
    }
    getMessages = async () => {
        const { chat_id , messageRecieveCount} = this.state;
        console.log(chat_id)
        let resp = await axios.get(`${CHAT_API_URL}/api/conversation/${chat_id}/messages`);
        let respBody = resp.data; 
        console.log(respBody);
        this.setState({
            messages: respBody.data,
            messageRecieveCount: messageRecieveCount + 1
        })
        this.scrollToBottom();
        
    }
   /* componentDidUpdate() {
        setTimeout(function() {
          this.scrollView.scrollToEnd();
        }.bind(this))
    } */

    onSend = async() => {
        const { chat_id, typing , userId, messages} = this.state;
        if(!typing) return false; 
        const messageRequest = {
            "conversation_id": chat_id,
            "member_id": userId,
            message: typing
        }
        axios.post(CHAT_API_URL + '/api/message', messageRequest);
       /* const previouseMessage =  messages;
        messageRequest.created_at = new Date();
        previouseMessage.unshift(messageRequest);
        this.setState({
            typing: '',
            messages: previouseMessage
        }); */
    }
    setTyping(text) {
        this.socket.emit('userTyping', { message: 'User is typing'} );
        this.setState({ typing: text })
    }
    onReceivedMessage(mess) {
        const previouseMessage =  this.state.messages;
        const { messageRecieveCount } = this.state;
        previouseMessage.unshift(mess);
        this.setState({
            typing: '',
            messages: previouseMessage,
            messageRecieveCount: messageRecieveCount + 1
        });
        this.scrollToBottom();
    }
scrollToBottom() {
    if(this.flatList_Ref) {
        this.flatList_Ref.scrollToOffset({ 
            offset: 0,
            animated: true 
        });
    }
}
render() {
    const { messages, userId, doctorInfo, userInfo, status } = this.state;
    return (
     <Container>
       <Content>
           
           <View style={{height:550,justifyContent:'center',alignItems:'center'}}>
          
           <Image
source={require('../../../../assets/animation/request.gif')}
style={{width:'100%',height:'100%',marginTop:-200}}/>
 
 <View style={{marginTop:-100}}>
               <Text style={{fontFamily:'OpenSans',fontSize:16,textAlign:'center',lineHeight:25,}}>Mr.Gladstan wants to chat with you about his mentioned reason</Text>
           </View>
           </View>
            {/* <ImageBackground source={require('../../../../assets/images/statebank.png')} style={{flex:1, width: null, height: null,}}> */}
            {/* <FlatList 
                data={messages}
                extraData={this.state.messageRecieveCount}
                inverted
                ref={ref => {
                    this.flatList_Ref = ref;  // <------ ADD Ref for the Flatlist 
                }}
                renderItem={( { item }) =>
              <View>   
                {item.member_id === userId ? 
                 <Item style={styles.mainItem}>
                    <Right>
                     <Item style={{borderBottomWidth:0}}>
                        <View style={styles.viewStyle}>
                           <Text style={{fontFamily:'OpenSans',fontSize:8,color:'gray'}}>{getRelativeTime(item.created_at)}</Text>
                        </View>
                        <View style={styles.viewStyle}>
                           <Card style={{borderRadius:10,backgroundColor:'#7E49C3',}}>
                            <Text style={styles.textstyle}>{item.message}</Text>
                           </Card>
                        </View>
                        <View style={styles.viewStyle}>
                           <Thumbnail square source={ renderProfileImage(userInfo) }/>
                        </View>
                     </Item> 
                    </Right>
                </Item> 

                :     
                <Item style={styles.mainItem}>
                  <Left>
                    <Item style={{borderBottomWidth:0}}>  
                        <View style={styles.viewStyle}>
                            <Thumbnail square source={ renderDoctorImage(doctorInfo) }/>
                        </View>
                         
                        <View style={styles.viewStyle}>
                            <Card style={{borderRadius:10,backgroundColor:'#fff',}}>
                                <Text style={styles.textstyle2}>{item.message}</Text>
                            </Card>
                        </View>
                        <View style={styles.viewStyle}>
                          <Text style={{fontFamily:'OpenSans',fontSize:8,color:'gray'}}>{getRelativeTime(item.created_at)}</Text>
                        </View>
                    </Item>
                  </Left>   
                </Item>
            }
                </View>
                 
                } keyExtractor={(item, index) => index.toString()}
            /> */}

            {/* </ImageBackground> */}
           
            <Row style={{position: 'absolute', left: 0, right: 0, bottom: 0}}>
           <Right style={{marginRight:10}}>
            <Button style={{backgroundColor:'red',borderRadius:5,height:30}}>
                   <Text style={styles.buttonText}>CLOSE</Text>
                   </Button>
            </Right>
            </Row>
            </Content>
             <Footer style={styles.footerStyle}>
                {/* {status === possibleChatStatus.APPROVED ?  
                <Row style={{alignItems:'center',justifyContent:'center'}}>
                
                    
                <Col style={styles.col2}>
                  <Row style={styles.SearchRow}>
                    <Col size={9} style={{justifyContent:'center',}}> 
                      <Input 
                          placeholder="Start conversation..."
                          style={styles.inputfield}
                          value={this.state.typing}
                          returnKeyType={'done'}
                          onChangeText={(text) => this.setTyping(text)}
                          placeholderTextColor="gray"
                          underlineColorAndroid="transparent"
                          blurOnSubmit={false}
                          onSubmitEditing={() => this.onSend() }
                      />
                    </Col>
                 
                  </Row>
                </Col>
                <TouchableOpacity
                    disabled={this.state.typing.length === 0}
                    style={[styles.circle, { marginLeft: 10 }]}>
                    <Icon name="ios-send" 
                        style={{ color: '#7E49C3', fontSize:30,padding:2,
                        transform: [{ rotate: '45deg'}]}}
                        onPress={this.onSend}
                    />
                </TouchableOpacity>
                </Row> : 
                <Row>
                    <Col style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                        <Text  style={{ color: '#FFF', fontSize:18,padding:2, alignSelf: 'center', alignItems: 'center' }}>{this.getInActiveChatMessageByStatus(status)}</Text>
                    </Col>
                </Row>
            }  */}
             <Row style={{justifyContent:'center',}}>
                <Button  style={styles.cancelButton} >
                    <Text style={styles.buttonText}>CANCEL</Text>
                </Button>
                 <Button  style={styles.approveButton} >
                       <Text style={styles.buttonText}>APPROVED</Text>
                 </Button>
             </Row>
            </Footer>
           </Container>
        )
    }
    getInActiveChatMessageByStatus(status) {
        if(status === possibleChatStatus.CANCELED) {
            return 'Your Chat has cancelled by the Doctor, and Your Amount will get Refunded to your Original Mode of Payment'
        } else if(status === possibleChatStatus.CLOSED) {
            return 'Your Chat has been Completed. Hope You will get well soon, Thank you for choosing our Service '
        } else if(status === possibleChatStatus.PAYMENT_IN_PROGRESS) {
            return 'Your Payment is not Completed, please complete your payment to start the chat with doctor'
        } else if(status === possibleChatStatus.PENDING) {
            return 'You have initiated the chat, please wait for Doctor Approval. thank you for your patience'
        }
    }
}

export default IndividualChat

const styles = StyleSheet.create({

  circle: {
        width: 35,
        height: 35,
        borderRadius: 35/2,
        backgroundColor: '#fff',
        alignItems:'center',
        justifyContent:'center'
    },
    SearchRow:{
        backgroundColor: 'white', 
        borderColor: '#000', 
        borderRadius: 20,
        height:35,
    },
    inputfield:{
        color: 'gray', 
        fontFamily: 'OpenSans', 
        fontSize: 10, 
        padding:5,
        paddingLeft:10
    },
    viewStyle:{
        justifyContent:'center',
        padding:2
    },
    mainItem:{
        marginLeft:10,
        marginRight:10,
        marginTop:10,
        borderBottomWidth:0,
          
       
    },
    textstyle:{
        fontFamily:'OpenSans',
        fontSize:10,
        color:'#fff',
        padding:10
    },
    textstyle2:{
        fontFamily:'OpenSans',
        fontSize:10,
        color:'#000',
        padding:10
    },
    footerStyle:{
        backgroundColor: '#7E49C3',
        justifyContent:'center' 
    },
    col1:{
        width:'15%',
        justifyContent:'center',
        alignItems:'center'
    },
    col2:{
        width:'70%',
        justifyContent:'center',
        alignItems:'center' 
    },
    buttonText:{
        fontFamily:'OpenSans',
        fontSize:16,
        color:'#fff',
        textAlign:'center',
        fontWeight:'bold'
      },
      cancelButton:{
        borderRadius:10,
        height:40,
        marginTop:8,
        padding:30,
        backgroundColor:'#4765FF'
      },
      approveButton:{
        borderRadius:10,
        height:40,
        marginTop:8,
        padding:20,
        marginLeft:20,
        backgroundColor:'#6FC41A'
      },

})