import React, { Component } from 'react';
import RoutesHome from './routes/appRouterHome';
import { Provider } from 'react-redux';
 import NavigationService from './rootNavigation';
import { store } from './store'
import { StyleProvider, Root, Toast } from 'native-base';
import getTheme from '../theme/components';
import material from '../theme/variables/material';
import { AsyncStorage, Alert, YellowBox, I18nManager, Text } from 'react-native';
import { FIREBASE_SENDER_ID, CHAT_API_URL } from './config'
import { fetchUserMarkedAsReadedNotification } from '../modules/providers/notification/notification.actions';
import { SET_LAST_MESSAGES_DATA } from '../modules/providers/chat/chat.action';
import SocketIOClient from 'socket.io-client';
import { AuthService , CallKeepService, CallProcessSetupService } from '../modules/screens/VideoConsulation/services/index';
import VideoAlertModel from '../modules/providers/chat/video.alert.model';
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
  'Warning: Slider has been extracted from react-native core ',
  'Warning: ViewPagerAndroid has been extracted from react-nati',
  'Warning: Async Storage has been extracted from react-native core and ',
  'Warning: NetInfo has been extracted from react-native core and will',
  'Animated: `useNativeDriver` was not specified. This is',
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation'
]);
import { setI18nConfig, translate  } from './translator.helper';
import * as RNLocalize from "react-native-localize";
import OfflineNotice from '../components/offlineNotice';


export default class App extends Component {
  userId = null;
  constructor(props) {
    super(props);
    this.state = {
      senderId: FIREBASE_SENDER_ID
    };
    setI18nConfig();
    NavigationService.isMountedRef.current = false;
    
  }

  async componentDidMount() {
    NavigationService.isMountedRef.current = true;
    const userId = await AsyncStorage.getItem('userId');
   // AuthService.init();
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
    if (userId) {
      this.userId = userId;
      this.initializeSocket(userId);
    }
    setInterval(() => {
      this.getMarkedAsReadedNotification();
    }, 10000);
    //this.checkPermission();
  }
  componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig();
    this.forceUpdate();
  };


  initializeSocket(userId) {
    this.socket = SocketIOClient.connect(CHAT_API_URL, {
      query: {
        member_id: userId
      },
      autoConnect: true,
      reconnectionDelay: 1000,
      reconnection: true,
      transports: ['websocket'],
      agent: false, // [2] Please don't set this to true upgrade: false, 
    });
    this.socket.on(userId + '-member-message', (message) => {
      this.onReceivedMessage(message)
    });
  }
  onReceivedMessage = (recievedMessage) => {
    const recievedConvesationId = recievedMessage.conversation_id;
    const myChatList = store.getState().chat.myChatList;
    if (this.userId && recievedMessage.member_id !== this.userId) {
      myChatList.some(element => {
        if (recievedConvesationId === element.conversation_id_chat) {
          const conversationLstSnippet = element.conversationLstSnippet;
          if (!conversationLstSnippet.messageInfo) {
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

  


  
  render() {
    return (
      <Provider store={store} key="provider">
        <Root>
        <VideoAlertModel> </VideoAlertModel>
        
          <StyleProvider style={getTheme(material)}>
              <RoutesHome ref={NavigationService.navigationRef}> 
            </RoutesHome> 
          </StyleProvider>
          <OfflineNotice/>
        </Root>
      </Provider>
    )
  }
}