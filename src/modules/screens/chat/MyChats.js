import React, { Component } from 'react';
import { Container, Content, View, Text,Thumbnail,Row,Col, Toast } from 'native-base';
import {StyleSheet, FlatList, AsyncStorage , TouchableOpacity, BackHandler} from 'react-native'
import { NavigationEvents } from "react-navigation";
import { hasLoggedIn } from "../../providers/auth/auth.actions";

import {
    getAllChats, SET_LAST_MESSAGES_DATA
} from '../../providers/chat/chat.action';
import {
    renderDoctorImage, renderProfileImage
} from '../../common';
import { getRelativeTime } from '../../../setup/helpers'
import { possibleChatStatus } from '../../../Constants/Chat';
import { SERVICE_TYPES } from '../../../setup/config'
import { connect } from 'react-redux';
import { store } from '../../../setup/store';


class MyChats extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
            isLoading: false,
            refreshCountByBack: 0
        }
    }
async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    const isLoggedIn = await hasLoggedIn(this.props);
    const { navigation } = this.props;
    if (!isLoggedIn) {
        this.props.navigation.navigate("login");
        return;
    }
    let userId = await AsyncStorage.getItem("userId");
    this.setState({ userId });
    const fromSuccessPage = navigation.getParam('fromSuccessPage') || false
    this.getAllChatsByUserId(userId)
    
    
}
removeBackHandlerListerner () {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
}
onBackPress = () => {
    const { dispatch, navigation } = this.props;
    if (navigation.index === 0) {
      return false;
    }
    navigation.navigate('Home');
    return true;
  };
getAllChatsByUserId = async(userId) => {
  try {
    this.setState({ isLoading: true });
    const chatList = await getAllChats(userId);
  
    if(chatList.success === true) {
        store.dispatch({
            type: SET_LAST_MESSAGES_DATA,
            data: chatList.data
        })
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
            chat_id: convoData.chat_id,
            name : convoData.doctorInfo && (convoData.doctorInfo.prefix ? convoData.doctorInfo.prefix + '.' : '') + convoData.doctorInfo.doctor_name,
            profileImage: renderDoctorImage(convoData.doctorInfo),
            status: convoData.status,
            doctorInfo: convoData.doctorInfo,
            userInfo : convoData.userInfo,
            conversation_id: convoData.conversation_id_chat,
            conversationLstSnippet: convoData.conversationLstSnippet,
        }
        if(convoData.conversationLstSnippet && convoData.conversationLstSnippet.messageInfo && convoData.conversationLstSnippet.messageInfo.latestMessage) {
            const lstMessageData = convoData.conversationLstSnippet.messageInfo.latestMessage;
            obj.message = lstMessageData.message;
            obj.messageUpdated_time = getRelativeTime(lstMessageData.created_at);
            obj.unreadCount = convoData.conversationLstSnippet.messageInfo.unreadCount
        } else {
            if(convoData.status === possibleChatStatus.PAYMENT_IN_PROGRESS) {
                obj.message = 'Payment is not completed.Please complete your payment to continue',
                obj.messageUpdated_time = getRelativeTime(convoData.last_chat_updated)
            }
            if(convoData.status === possibleChatStatus.PENDING) {
                obj.message = `You have initiated a chat request with ${(convoData.doctorInfo.prefix ? convoData.doctorInfo.prefix + '. ' : '')} ${convoData.doctorInfo.doctor_name} Please wait for the approval.`;
                obj.messageUpdated_time = getRelativeTime(convoData.last_chat_updated)
            }
            if(convoData.status === possibleChatStatus.COMPLETED) {
                obj.message = `Conversation Completed`;
                obj.messageUpdated_time = getRelativeTime(convoData.last_chat_updated)
            }
        }
        return  obj
    }
 
    render() {
        const { chat: { myChatList } } = this.props;
        const { refreshCountByBack, isLoading } = this.state;
       
    return (
        <Container>
            <NavigationEvents
              onDidFocus={payload => this.state.refreshCountByBack = this.state.refreshCountByBack + 1 }
              onWillBlur={payload => this.removeBackHandlerListerner()}
            />
            <Content>
            {myChatList.length === 0 && isLoading === false ?
					<View style={{ alignItems: 'center', justifyContent: 'center', height: 450 }}>
						<Text style={{ fontFamily: "OpenSans", fontSize: 15, marginTop: "10%", textAlign: 'center' }} note>
							No Conversations
						</Text>
                    </View> : 
              <FlatList 
                data={myChatList}
                extraData={[myChatList,refreshCountByBack ]}
                renderItem={( { item, index })=>
                  item ? 
                    this.renderChatInfo(this.getUserOrDoctorDataToDisplay(item), index) 
                  : null
                } keyExtractor={(item, index) => index.toString()}/>
            }
            </Content>
            </Container>
        )
    }
    renderChatInfo(item, index) {
        return <TouchableOpacity onPress={()=> 
            this.props.navigation.navigate('IndividualChat', 
            { chatInfo: {
                ...item,
                index: index
              }
            })
        }>
     <Row style={styles.rowStyle}>
                <Col style={{width:'15%'}}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: item.profileImage, title: 'Profile photo' })}>
                    <Thumbnail circle source={item.profileImage}/>
                    </TouchableOpacity>
                    <View style={styles.circle} />
                </Col>
                <Col style={{width:'85%',marginTop:5,marginLeft:15}}>
                    <Row>
                        <Col  size={7}>
                        <Text style={styles.docname} ellipsizeMode="tail" numberOfLines={1}>{item.name}</Text>
                        </Col>
                        <Col  size={3}>
                        <Text style={styles.date}>{item.messageUpdated_time}</Text>

                        </Col>
                    </Row>
                    <Row>
                        <Col style={{width:'80%'}}>
                            <Text style={[styles.status, item.unreadCount > 0 ? { fontWeight : 'bold' } : { fontWeight: 'normal' } ]}>{item.message} </Text>
                        </Col>

                        {item.unreadCount > 0 ? <Col style={{width:'20%'}}>
                            <Text style={styles.msg}>{item.unreadCount}</Text>
                        </Col> : null }
                    </Row>
                </Col>
            </Row>
        </TouchableOpacity>
    }

}
function chatState(state) {
    return {
        chat: state.chat
    }
}
export default connect(chatState)(MyChats)

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