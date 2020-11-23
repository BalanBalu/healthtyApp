import React, { Component } from 'react';
import { Container, Content, View, Text, Right, Item, Input, Card, Grid, Left, Icon, Thumbnail, Spinner, Footer, Radio, Row, Col, Form, Button, } from 'native-base';
import { StyleSheet, TextInput, ImageBackground, FlatList, ScrollView, AsyncStorage, TouchableOpacity, YellowBox, Keyboard } from 'react-native'
import {
    renderDoctorImage, renderProfileImage,getName
} from '../../common';
import SocketIOClient from 'socket.io-client';
import { CHAT_API_URL } from '../../../setup/config';
import axios from 'axios';
import { getRelativeTime, dateDiff, formatDate } from '../../../setup/helpers';
import { possibleChatStatus } from '../../../Constants/Chat';
import { connect } from 'react-redux';
import { store } from '../../../setup/store';

import { SET_LAST_MESSAGES_DATA, updateChatUpdatedTime, insertPushNotification } from '../../providers/chat/chat.action';
import { NavigationEvents } from "react-navigation";
YellowBox.ignoreWarnings(['Remote debugger']);
class IndividualChat extends Component {
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = {
            conversation_id: null,
            doctorInfo: null,
            userInfo: null,
            userId: null,
            messages: [],
            typing: '',
            messageRecieveCount: -1,
            status: null,
            height: 0
        }
        this.onReceivedMessage = this.onReceivedMessage.bind(this);
        this.onSend = this.onSend.bind(this);
        this.setTyping = this.setTyping.bind(this);
    }
    onWillBlur() {
        this._isMounted = false;
        const { conversation_id, status, messageRecieveCount, messages } = this.state;
        const { conversationLstSnippet, index, chat_id } = this.props.navigation.getParam('chatInfo');
        const { chat: { myChatList } } = this.props;
        if (messageRecieveCount > 0) {


            if (conversationLstSnippet) {
                if (!conversationLstSnippet.messageInfo) {
                    conversationLstSnippet['messageInfo'] = {};
                }
                const lastMessageOnState = messages[0];
                let lastMessage = {
                    created_at: lastMessageOnState.created_at,
                    member_id: lastMessageOnState.member_id,
                    message: lastMessageOnState.message
                }
                myChatList[index].last_chat_updated = lastMessageOnState.created_at;
                myChatList[index].conversationLstSnippet.messageInfo.latestMessage = lastMessage;
                myChatList[index].status = status
                myChatList[index].conversationLstSnippet.messageInfo.unreadCount = 0;
                store.dispatch({
                    type: SET_LAST_MESSAGES_DATA,
                    data: myChatList
                })
                this.updateMessagesAsReaded();
                updateChatUpdatedTime(chat_id);

            }
        } else {
            if (conversationLstSnippet) {
                if (!conversationLstSnippet.messageInfo) {
                    conversationLstSnippet['messageInfo'] = {};
                }
                if (myChatList[index].conversationLstSnippet.messageInfo.unreadCount > 0) {
                    this.updateMessagesAsReaded();
                    myChatList[index].conversationLstSnippet.messageInfo.unreadCount = 0;
                }
                store.dispatch({
                    type: SET_LAST_MESSAGES_DATA,
                    data: myChatList
                })
            }
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        const { conversation_id, doctorInfo, userInfo, status } = this.props.navigation.getParam('chatInfo');
        this.props.navigation.setParams({
            appBar: {
                title: doctorInfo.doctor_name,
                profile_image: renderDoctorImage(doctorInfo)
            }
        });
        const userId = await AsyncStorage.getItem('userId');

        this.setState({ conversation_id, doctorInfo, userInfo, userId, status, messageRecieveCount: this.state.messageRecieveCount + 1 });

        this.socket = SocketIOClient(CHAT_API_URL, {
            query: {
                member_id: userId
            },
            autoConnect: true,
            reconnectionDelay: 1000,
            reconnection: true,
            transports: ['websocket'],
            agent: false, // [2] Please don't set this to true upgrade: false, 
            rejectUnauthorized: false
        });
        this.socket.on(conversation_id + '-message', this.onReceivedMessage);

        this.getMessages();
    }

    getMessages = async () => {
        const { conversation_id, messageRecieveCount } = this.state;
        console.log(conversation_id)
        let resp = await axios.get(`${CHAT_API_URL}/api/conversation/${conversation_id}/messages`);
        let respBody = resp.data;
        this.setState({
            messages: respBody.data,
            messageRecieveCount: messageRecieveCount + 1
        })
        console.log(respBody);
        this.scrollToBottom();

    }
    /* componentDidUpdate() {
         setTimeout(function() {
           this.scrollView.scrollToEnd();
         }.bind(this))
     } */

    onSend = async () => {
        const { conversation_id, typing, userId, messages, doctorInfo,userInfo } = this.state;

        if (!typing) return false;
        setTimeout(async () => {

            const messageRequest = {
                "conversation_id": conversation_id,
                "member_id": userId,
                message: typing
            }
            const newMessage = {
                conversation_id: conversation_id,
                created_at: new Date().toISOString(),
                member_id: userId,
                message: typing,
                readers: [userId],
                updated_at: new Date().toISOString(),
            }
            const previouseMessage = this.state.messages;
            const { messageRecieveCount } = this.state;
            previouseMessage.unshift(newMessage);
            await this.setState({
                typing: '',
                messages: previouseMessage,
                messageRecieveCount: messageRecieveCount + 1,
            });
            console.log('Coming here', + this.state.typing);
            let pushNotificationRequest = {
                user_id: userId,
                chat_id: conversation_id,
                doctor_id: doctorInfo.doctor_id,
                sender_name:userInfo.user_name,
                reciever_type: "DOCTOR",
                message: typing
            }
            if (this._isMounted) {
                 axios.post(CHAT_API_URL + '/api/message', messageRequest);
                 insertPushNotification(pushNotificationRequest)

            }
        })
        /* const previouseMessage =  messages;
         messageRequest.created_at = new Date();
         previouseMessage.unshift(messageRequest);
         this.setState({
             typing: '',
             messages: previouseMessage
         }); */
    }
    setTyping(text) {
        this.socket.emit('userTyping', { message: 'User is typing' });
        this.setState({ typing: text })
    }
    onReceivedMessage(mess) {
        console.log('Reving from Private Chat', mess);
        const { messageRecieveCount, userId } = this.state;
        if (mess.member_id !== userId) {
            const previouseMessage = this.state.messages;
            if (previouseMessage.length === 0) {
                this.setState({ status: possibleChatStatus.APPROVED });
            }
            previouseMessage.unshift(mess);
            this.setState({
                typing: '',
                messages: previouseMessage,
                messageRecieveCount: messageRecieveCount + 1,
            });
        }
        this.scrollToBottom();
    }
    scrollToBottom() {
        if (this.flatList_Ref) {

            this.flatList_Ref.scrollToOffset({
                offset: 0,
                animated: true
            });
        }
    }

    updateMessagesAsReaded = async () => {
        try {
            const { conversation_id, userId } = this.state;
            let endPoint = `${CHAT_API_URL}/api/readers/conversation/${conversation_id}/member/${userId}`;
            axios.put(endPoint, {});
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        const { messages, userId, doctorInfo, userInfo, status } = this.state;
        console.log(messages);
        console.log('userId: ' + userId);
        return (
            <Container>

                <NavigationEvents
                    onWillBlur={payload => this.onWillBlur()}
                />
                <FlatList
                    data={messages}
                    style={{ marginBottom: this.state.height - 20 }}
                    inverted
                    extraData={this.state.messageRecieveCount}
                    ref={ref => {
                        this.flatList_Ref = ref;  // <------ ADD Ref for the Flatlist 
                    }}
                    renderItem={({ item }) =>
                        <View>
                            {item.member_id === userId ?
                                <Item style={styles.mainItem}>
                                    <Right>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Card style={{ borderRadius: 10, backgroundColor: '#7E49C3', }}>
                                                <Text style={styles.textstyle}>{item.message}</Text>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 8, color: 'gray', bottom: 0, right: 0, textAlign: 'right', color: '#fff', padding: 5, }}>
                                                    {formatDate(item.created_at, "MMM DD, YYYY  hh:mm:ss A")}
                                                </Text>
                                            </Card>
                                            <Thumbnail circle source={renderProfileImage(userInfo)} />
                                        </View>
                                    </Right>
                                </Item>

                                :
                                <Item style={styles.mainItem1}>
                                    <Left>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Thumbnail circle source={renderDoctorImage(doctorInfo)} />
                                            <Card style={{ borderRadius: 10, backgroundColor: '#fff', }}>
                                                <Text style={styles.textstyle2}>{item.message}</Text>
                                                <Text style={{
                                                    fontFamily: 'OpenSans',
                                                    fontSize: 8,
                                                    color: 'gray',
                                                    bottom: 0,
                                                    right: 0,
                                                    textAlign: 'right',
                                                    padding: 5
                                                }}>
                                                    {formatDate(item.created_at, "MMM DD, YYYY  hh:mm:ss A")}
                                                </Text>
                                            </Card>
                                        </View>
                                    </Left>
                                </Item>
                            }
                        </View>

                    } keyExtractor={(item, index) => index.toString()}
                />


                <Footer style={styles.footerStyle}>
                    {status === possibleChatStatus.APPROVED ?
                        <Row style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            {/* <Col style={styles.col1}>
                    <View style={styles.circle}>
                       <Icon name="ios-camera" style={{ color: '#7E49C3', fontSize:25,padding:2}} />
                    </View>
                  </Col> */}
                            <Col size={1.3} style={{ justifyContent: 'center', alignContent: 'center' }}>
                            </Col>
                            <Col size={7} style={styles.col2}>

                                <TextInput
                                    placeholder="Start Conversation..."
                                    multiline={true}
                                    onContentSizeChange={(event) => {
                                        this.setState({ height: Math.min(120, event.nativeEvent.contentSize.height) })
                                    }}
                                    style={[styles.default, { height: Math.max(40, this.state.height) }]}
                                    value={this.state.typing}
                                    placeholder="Start Conversation..."
                                    returnKeyType={'done'}
                                    onChangeText={(text) => this.setTyping(text)}
                                    placeholderTextColor="gray"
                                    underlineColorAndroid="transparent"
                                    blurOnSubmit={false}
                                    onSubmitEditing={this.onSend}
                                    clearButtonMode='while-editing'
                                />

                            </Col>
                            <Col size={2.5} style={{ justifyContent: 'center', alignContent: 'center' }}>
                                <TouchableOpacity
                                    disabled={this.state.typing.length === 0}
                                    style={[styles.circle, { marginLeft: 10 }]}>
                                    <Icon name="ios-send"
                                        style={{
                                            color: '#fff', fontSize: 30, padding: 2,
                                            transform: [{ rotate: '45deg' }]
                                        }}
                                        onPress={this.onSend}
                                    />
                                </TouchableOpacity>
                            </Col>




                        </Row> :
                        <Row>
                            <Col style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#7E49C3', fontSize: 15, padding: 2, textAlign: 'center' }}>{this.getInActiveChatMessageByStatus(status)}</Text>
                            </Col>
                        </Row>
                    }

                </Footer>
            </Container>
        )
    }
    getInActiveChatMessageByStatus(status) {
        if (status === possibleChatStatus.CANCELED) {
            return 'Your Chat has cancelled by the Doctor, and Your Amount will get Refunded to your Original Mode of Payment'
        } else if (status === possibleChatStatus.CLOSED) {
            return 'Your Chat has been Completed. Hope You will get well soon, Thank you for choosing our Service '
        } else if (status === possibleChatStatus.PAYMENT_IN_PROGRESS) {
            return 'Your Payment is not Completed, please complete your payment to start the chat with doctor'
        } else if (status === possibleChatStatus.PENDING) {
            return 'Kindly wait for the doctors approval. Thank you !'
        }else if (status === possibleChatStatus.COMPLETED) {
            return 'Conversation Completed'
        }
    }
}


function chatState(state) {
    return {
        chat: state.chat
    }
}
export default connect(chatState)(IndividualChat)
const styles = StyleSheet.create({

    circle: {
        width: 35,
        height: 35,
        borderRadius: 35 / 2,
        backgroundColor: '#7E49C3',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputfield: {
        color: 'gray',
        fontFamily: 'OpenSans',
        fontSize: 14,
        padding: 5,
        paddingLeft: 10,

    },
    viewStyle: {
        justifyContent: 'center',
        padding: 2,
    },
    mainItem: {
        marginLeft: 150,
        marginTop: 10,
        borderBottomWidth: 0,
        paddingRight: 10


    },
    mainItem1: {
        marginRight: 150,
        marginTop: 10,
        borderBottomWidth: 0,
        paddingLeft: 10


    },
    textstyle: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#fff',
        padding: 1,
        lineHeight: 20,

    },
    textstyle2: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#000',
        padding: 1,
        lineHeight: 20,

    },
    footerStyle: {
        backgroundColor: '#fff',
        justifyContent: 'center',

    },
    col1: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    col2: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    default: {
        backgroundColor: 'white',
        borderColor: '#000',
        borderRadius: 20,
        padding: 15,
        maxHeight: 120,
        borderWidth: 0.5,
        width: 250,
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center'


    }
})