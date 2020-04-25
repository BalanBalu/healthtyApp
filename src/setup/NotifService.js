import PushNotification from 'react-native-push-notification';
import { FIREBASE_SENDER_ID } from './config'
import { AsyncStorage, Alert } from 'react-native';
import { userFiledsUpdate } from '../modules/providers/auth/auth.actions';
import { store } from './store';
import { SET_INCOMING_VIDEO_CALL } from '../modules/providers/chat/chat.action';
let tokenData;
let navigationProps;
class NotifService {

  constructor() {
   
  }
  initNotification(props) {
    navigationProps = props;
    console.log("Coming here");
    this.configure();
    this.checkPermission(function(cb) {
        console.log('Perminssion is '  + JSON.stringify(cb));
    })
    this.lastId = 0;
  }

  configure( gcm = FIREBASE_SENDER_ID) {
    console.log(gcm)
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister:(token) => this.onRegister(token), //this._onRegister.bind(this),
        
      // (required) Called when a remote or local notification is opened or received
      onNotification: (notif) => this.onNotification(notif), //this._onNotification,

      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: gcm,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
    });
  }

  localNotif() {
    this.lastId++;
    PushNotification.localNotification({
      /* Android Only Properties */
      ticker: "My Notification Ticker", // (optional)
      autoCancel: true, // (optional) default: true
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
      smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
      subText: "This is a subText", // (optional) default: none
      color: "red", // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: 'some_tag', // (optional) add tag to message
      group: "group", // (optional) add group to message
      ongoing: false, // (optional) set whether this is an "ongoing" notification

      /* iOS only properties */
      alertAction: 'view', // (optional) default: view
      category: null, // (optional) default: null
      userInfo: null, // (optional) default: null (object containing additional notification data)

      /* iOS and Android properties */
      title: "Local Notification", // (optional)
      message: "My Notification Message", // (required)
      playSound: false, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
    });
  }

  scheduleNotif(subText, bigText, scheduleTime) {
    PushNotification.localNotificationSchedule({
      date: new Date(Date.now() + (30 * 1000)), // in 30 secs

      /* Android Only Properties */
      ticker: "My Notification Ticker", // (optional)
      autoCancel: true, // (optional) default: true
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
      smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: bigText,
      subText: subText, // (optional) default: none
      color: "blue", // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      // tag: 'some_tag', // (optional) add tag to message
      // group: "group", // (optional) add group to message
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      priority: "high", // (optional) set notification priority, default: high
      // visibility: "private", // (optional) set notification visibility, default: private
      importance: "high", // (optional) set notification importance, default: high
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
      ignoreInForeground: false, 
      /* iOS only properties */
      alertAction: 'view', // (optional) default: view
      category: 'Reminder', // (optional) default: null
      userInfo: {}, // (optional) default: null (object containing additional notification data)

      /* iOS and Android properties */
      title: subText, // (optional)
      message: bigText, // (required)
      playSound: true, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    });
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  cancelNotif() {
    PushNotification.cancelLocalNotifications({id: ''+this.lastId});
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }

  onRegister = async (token) => {
    console.log('On Register TOken ===> ', token);
    tokenData = token;
   
  }
  
  updateDeviceToken = async(userId) => {
    if(tokenData) {
    const updatedDeviceToken  = await AsyncStorage.getItem('updatedDeviceToken');
    let deviceToken = tokenData.token;
    let mergedTokenWithUserId = String(userId) + '_' + String(deviceToken).substr(0, 15);
    if(!updatedDeviceToken) {
      this.callApiToDeviceToken(userId, deviceToken, mergedTokenWithUserId); 
    }
    else if (mergedTokenWithUserId !== updatedDeviceToken) {
      this.callApiToDeviceToken(userId, deviceToken, mergedTokenWithUserId); 
    }
   }
  }
  callApiToDeviceToken = async (userId, deviceToken, mergedTokenWithUserId) => {
    try {
      let requestData = {
        device_token: deviceToken,
      }
      let updateResponse = await userFiledsUpdate(userId, requestData);
      console.log('updateResponse==>', updateResponse)
      if (updateResponse.success == true) {
        
         AsyncStorage.setItem('updatedDeviceToken', mergedTokenWithUserId);
      }
    } catch (e) {
      console.log(e);
    }
  }
  onNotification(notificationStr) {
     const notification = JSON.parse(JSON.stringify(notificationStr));
     if(notification.videoNotification == '1') {
      store.dispatch({
        type: SET_INCOMING_VIDEO_CALL,
        data: true,
     });
    } 
    // console.log("NOTIFICATION:", notification);
  }
  subcribeToPushNotificationConnectyCube() {
  
   /* if(tokenData) {
    const params = {
      // for iOS VoIP it should be 'apns_voip'
      notification_channel: Platform.OS === 'ios' ? 'apns' : 'gcm',
      device: {
        platform: Platform.OS,
        udid: getUniqueId()
      },
      push_token: {
        environment: 'production', // __DEV__ ? 'development' : 'production',
        client_identification_sequence: tokenData.token,
        bundle_identifier: "com.medflic"
      }
    }
    console.log('Param of Push==> ', params)
    ConnectyCube.pushnotifications.subscriptions.create(params)
    .then(result => {
     
      console.log('Created the Push Notifiation', navigationProps);
      // alert('Created the Push Notifiation' + JSON.stringify(result));
      // RootNavigation.navigate('My Chats', {});
      // NavigationDispatch(NavigationActions.navigate({routeName: 'My Chats'}));
    })
    .catch(error => {
      console.log(error);
      alert('Error on Alert' + JSON.stringify(error));
    });
    } */
  }
 /*
 sendConnectyCubeNotification = (userIds, payload) => {
  const pushParameters = {
    notification_type: "push",
    user: { ids: [ 9876543217 ] }, // recipients.
    environment: 'production', // __DEV__ ? 'development' : 'production',
    message: ConnectyCube.pushnotifications.base64Encode(payload)
  }
  alert(JSON.stringify(pushParameters));
  ConnectyCube.pushnotifications.events.create(pushParameters).then(result => {
      alert('Send an alert Message'+  JSON.stringify(result));
  }).catch(error => {
    console.log('Push Failed-===>', error);
    alert('Push Send failed:' + JSON.stringify(error))
  }); 
} */
}

 
export default (new NotifService());