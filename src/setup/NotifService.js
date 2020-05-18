import PushNotification from 'react-native-push-notification';
import { FIREBASE_SENDER_ID, IS_IOS } from './config'
import { AsyncStorage, Alert } from 'react-native';
import { userFiledsUpdate } from '../modules/providers/auth/auth.actions';
import messaging from '@react-native-firebase/messaging';
import rootNavigation from './rootNavigation';
import backgroundpush from './backgroundpush';
let tokenData;
let navigationProps;
class NotifService {

  constructor() {
   
  }
  initNotification(props) {
    navigationProps = props;
    this.configure();
   
    messaging().requestPermission().then((result) => {
      console.log('result ---- of Permission', result);
      this.messageListener = messaging().onMessage((message) => backgroundpush(message));
      messaging().getToken().then(fcmToken => {
        if (fcmToken) {
          tokenData = { token : fcmToken };
          console.log('fcmToken: ',  fcmToken);
        }
      });
    })
    this.lastId = 0;
  }

  async requestUserPermission() {
    const settings = await messaging().requestPermission();
    
    if (settings) {
      console.log('Permission settings:', settings);
      return settings;
    }
   
  }
  

  configure( gcm = FIREBASE_SENDER_ID) {
    console.log(gcm)
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
     // onRegister:(token) => this.onRegister(token), //this._onRegister.bind(this),
        
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

  localNotif(subText, bigText, options = {
    color: 'blue',
    tag: 'medflic',
    group: 'medflic_group',
    ongoing: false,
    importance: 'high',
    fullScreenIntent: false,
    priority: 'high',
    category: 'Medflic',
    sound: 'default',
    actions: ''
  }) {
    this.lastId++;
    PushNotification.localNotification({
      /* Android Only Properties */
      id: ''+this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      ticker:  subText || ' ', // (optional)
      autoCancel: true, // (optional) default: true
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
      smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: bigText || ' ', // (optional) default: "message" prop
      // subText: "This is a subText", // (optional) default: none
      color: options.color || "blue", // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: options.tag || 'MEDFLIC', // (optional) add tag to message
      group: options.group || 'Medflic', // (optional) add group to message
      ongoing: options.ongoing || false, // (optional) set whether this is an "ongoing" notification

      /* iOS only properties */
      alertAction: 'view', // (optional) default: view
      category: options.category || 'MEDFLIC', // (optional) default: null
      userInfo: {}, // (optional) default: null (object containing additional notification data)

      /* iOS and Android properties */
      title: subText || ' ', // (optional)
      message: bigText || 'Medflic Notification', // (required)
      playSound: true, // (optional) default: true
      soundName: options.sound || 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: IS_IOS ? this.lastId : ''+ this.lastId, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      actions: options.actions || '',  // (Android only) See the doc for notification actions to know more
      fullScreenIntent: options.fullScreenIntent || false,
    });
  }

  scheduleNotif(subText, bigText, scheduleTime, options = {
    color: 'blue',
    tag: 'medflic',
    group: 'medflic_group',
    ongoing: false,
    importance: 'high',
    fullScreenIntent: false,
    priority: 'high',
    category: 'Medflic',
    visibility: 'private'
  }) {
    PushNotification.localNotificationSchedule({
      date: scheduleTime, // in 30 secs
      fullScreenIntent: options.fullScreenIntent,
      /* Android Only Properties */
      ticker: subText, // (optional)
      autoCancel: true, // (optional) default: true
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
      smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: bigText,
      subText: subText, // (optional) default: none
      color: options.color || "blue", // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: options.tag || 'medflic', // (optional) add tag to message
      group: options.group || 'medflic_group', // (optional) add group to message
      ongoing: options.ongoing || false,  // (optional) set whether this is an "ongoing" notification
      priority: options.priority || 'high', // (optional) set notification priority, default: high
      visibility:  options.visibility || 'private' , // (optional) set notification visibility, default: private
      importance: options.importance || 'high', // (optional) set notification importance, default: high
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
      ignoreInForeground: false, 
      /* iOS only properties */
      alertAction: 'view', // (optional) default: view
      category: options.category || 'MEDFLIC', // (optional) default: null
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
    console.log('deviceToken', deviceToken)
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
     console.log(notificationStr);
     const notification = JSON.parse(JSON.stringify(notificationStr));
     if(notification.tag == 'VIDEO_NOTIFICATION') {
        if(notification.action === 'Accept') {
          this.onVideoCallAcceptNotification();
        } 
        if(notification.action === 'Reject') {
          this.onVideoCallRejectNotification();
        }
      }
    console.log("NOTIFICATION:", notification);
    
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

  onVideoCallAcceptNotification() {
    rootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: false, onPressAccept: true });
  };

  onVideoCallRejectNotification() {
    rootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: true, onPressAccept: false });
  }
}

 
export default (new NotifService());