import React,{ Component }  from 'react';
import RoutesHome from './routes/appRouterHome';
//import RoutesLogin from './routes/appRouterLogin';
import { Provider } from 'react-redux';
import { store } from './store'
import { StyleProvider, Root, Toast } from 'native-base';
import getTheme from '../theme/components';
import material from '../theme/variables/material';
import { AsyncStorage, Alert , YellowBox } from 'react-native';
import { FIREBASE_SENDER_ID , CHAT_API_URL } from './config'
import { userFiledsUpdate } from '../modules/providers/auth/auth.actions';
//import firebase from 'react-native-firebase';
import { fetchUserMarkedAsReadedNotification } from '../modules/providers/notification/notification.actions';
import { SET_LAST_MESSAGES_DATA } from '../modules/providers/chat/chat.action';
import NotifService from './NotifService';
import SocketIOClient from 'socket.io-client';
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);
export default class App extends Component {
  userId = null;  
  constructor(props) {
      super(props);
      this.state = {
        senderId: FIREBASE_SENDER_ID
      };
      this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  } 
  async componentDidMount() {  
      const userId = await AsyncStorage.getItem('userId');
      if(userId) {
        this.userId =  userId;
        this.initializeSocket(userId);
      }
      setInterval(() => {
      this.getMarkedAsReadedNotification();
     },10000)
     //this.checkPermission();
  }

  initializeSocket(userId) {
    this.socket = SocketIOClient(CHAT_API_URL, {
      query: {
         member_id: userId 
      },
      autoConnect: true, 
      reconnectionDelay: 1000, 
      reconnection: true, 
      transports: ['websocket'], 
      agent: false, // [2] Please don't set this to true upgrade: false, 
    });
    this.socket.on(userId +'-member-message', this.onReceivedMessage);
  }
  onReceivedMessage = (recievedMessage) => {
    const recievedConvesationId = recievedMessage.conversation_id;
    console.log('On Recieve from APP.js');
    const myChatList = store.getState().chat.myChatList;
    if(this.userId && recievedMessage.member_id !== this.userId) {
      myChatList.some(element => {
      if(recievedConvesationId === element.conversation_id_chat) {
        const conversationLstSnippet = element.conversationLstSnippet;
        if(!conversationLstSnippet.messageInfo) {
          conversationLstSnippet['messageInfo'] = {};
        }
          let lastMessage = {
              created_at: recievedMessage.created_at,
              member_id: recievedMessage.member_id,
              message: recievedMessage.message,
          }
          element.conversationLstSnippet.messageInfo.unreadCount = element.conversationLstSnippet.messageInfo.unreadCount ? element.conversationLstSnippet.messageInfo.unreadCount + 1 : 1
          element.last_chat_updated = recievedMessage.created_at;
          element.conversationLstSnippet.messageInfo.latestMessage = lastMessage;
        
        return true;
      }
    })
      store.dispatch({
        type: SET_LAST_MESSAGES_DATA,
        data: myChatList
      })
    }
  }
  getMarkedAsReadedNotification = async () => {
    try {
      let userId = await AsyncStorage.getItem('userId');
     
      fetchUserMarkedAsReadedNotification(userId);
    }
    catch (e) {
      console.log(e)
    }
  }
 /* async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            console.log('fcmToken: ' +  fcmToken)
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }*/
onRegister=async(token)=> {
    const userId = await AsyncStorage.getItem('userId');
    const isDeviceTokenUpdated = await AsyncStorage.getItem('isDeviceTokenUpdated');
    let deviceToken=token.token;
  if(isDeviceTokenUpdated !='true' && userId !=null){
    if (deviceToken != null) 
      this.updateDeviceToken(userId, deviceToken);  // update Unique Device_Tokens 
  }
}

  updateDeviceToken = async (userId, deviceToken) => {
    try {
      let requestData = {
        device_token: deviceToken,
      }
      userFiledsUpdate(userId, requestData);
      AsyncStorage.setItem('isDeviceTokenUpdated', 'true');
      } catch (e) {
      console.log(e);
    }
  }

  onNotif(notif) {
    console.log(notif);
    Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    Alert.alert("Permissions", JSON.stringify(perms));
  }
  render() {
   
   
      return (
       
      
        <Provider store={store} key="provider">
        <Root>   
        <StyleProvider style={getTheme(material)}>
            <RoutesHome />
          
           </StyleProvider>  
           </Root>
        </Provider>
      )
    }
  }