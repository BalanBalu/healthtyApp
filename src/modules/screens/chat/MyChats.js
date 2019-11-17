import React, { Component } from 'react';
import { Container, Content, View, Text,Thumbnail,Row,Col, Toast } from 'native-base';
import {StyleSheet, FlatList, AsyncStorage , TouchableOpacity} from 'react-native'
import { hasLoggedIn } from "../../providers/auth/auth.actions";
import {
    getAllChats
} from '../../providers/chat/chat.action';
import {
    renderDoctorImage, renderProfileImage
} from '../../common';
import { getRelativeTime } from '../../../setup/helpers'
import { possibleChatStatus } from '../../../Constants/Chat';
import { SERVICE_TYPES } from '../../../setup/config'

class MyChats extends Component {
    constructor(props) {
        super(props)
        this.state = {
            myChatList: [],
            isLoading: false
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
    this.getAllChatsByUserId(userId)
    
}
getAllChatsByUserId = async(userId) => {
  try {
    this.setState({ isLoading: true });
    const chatList = await getAllChats(userId);
    if(chatList.success === true) {
        this.setState({ myChatList: chatList.data })
    } else {
        Toast.show({
            text: chatList.message, 
            duration: 3000,
            type: 'danger'
        })
    }
  } catch (error) {
        Toast.show({
            text: 'Something went wrong' +error, 
            duration: 3000,
            type: 'danger'
        })
  }  finally {
    this.setState({ isLoading: false });
  }
}
    getUserOrDoctorDataToDisplay = (convoData) => {
        let obj = {
            name : convoData.doctorInfo && (convoData.doctorInfo.prefix ? convoData.doctorInfo.prefix + '.' : '') + convoData.doctorInfo.doctor_name,
            profileImage: renderDoctorImage(convoData.doctorInfo),
            status: convoData.status,
            doctorInfo: convoData.doctorInfo,
            userInfo : convoData.userInfo,
            chat_id: convoData.conversation_id_chat
        }
        if(convoData.conversationLstSnippet && convoData.conversationLstSnippet.messages && convoData.conversationLstSnippet.messages[0]) {
            const lstMessageData = convoData.conversationLstSnippet.messages[0];
            obj.message = lstMessageData.message;
            obj.messageUpdated_time = getRelativeTime(lstMessageData.created_at) 
        } else {
            if(convoData.status === possibleChatStatus.PAYMENT_IN_PROGRESS) {
                obj.message = 'Payment is not completed, Please Complete your Payment and Continue',
                obj.messageUpdated_time = getRelativeTime(convoData.last_chat_updated)
            }
            if(convoData.status === possibleChatStatus.PENDING) {
                obj.message = `You have Initiated the Chat with ${(convoData.doctorInfo.prefix ? convoData.doctorInfo.prefix + '. ' : '')} ${convoData.doctorInfo.doctor_name} Please Wait for Approval`;
                obj.messageUpdated_time = getRelativeTime(convoData.last_chat_updated)
            }
        }
        return  obj
    }
 
    render() {
        const { myChatList } = this.state;
    return (
        <Container>
            <Content>
              <FlatList 
                data={myChatList}
                extraData={myChatList}
                renderItem={( { item })=>
                  item ? 
                    this.renderChatInfo( this.getUserOrDoctorDataToDisplay(item)) 
                  : null
                } keyExtractor={(item, index) => index.toString()}/>
            </Content>
            </Container>
        )
    }
    renderChatInfo(item) {
    return <TouchableOpacity onPress={()=> 
            this.props.navigation.navigate('IndividualChat', 
            { chatInfo: {
                chat_id: item.chat_id,
                doctorInfo: item.doctorInfo, 
                userInfo: item.userInfo
              }
            })
        }>
     <Row style={styles.rowStyle}>
                <Col style={{width:'15%'}}>
                    <Thumbnail square source={item.profileImage}/>
                    <View style={styles.circle} />
                </Col>
                <Col style={{width:'85%',marginTop:5,marginLeft:15}}>
                    <Row>
                        <Text style={styles.docname}>{item.name}</Text>
                        <Text style={styles.date}>{item.messageUpdated_time}</Text>
                    </Row>
                    <Row>
                        <Col style={{width:'80%'}}>
                            <Text style={styles.status}>{item.message} </Text>
                        </Col>
                        {/* <Col style={{width:'20%'}}>
                            <Text style={styles.msg}>{item.msg}</Text>
                        </Col> */}
                    </Row>
                </Col>
            </Row>
        </TouchableOpacity>
    }

}

export default MyChats

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
    borderRadius:30,
    backgroundColor:'#7E49C3',
    width:'35%',
    textAlign:'center'
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
rowStyle:{
    borderBottomColor:'gray',
    borderBottomWidth:0.5,
    marginLeft:10,
    marginRight:10,
    paddingTop:10,
    paddingBottom:10
}

})