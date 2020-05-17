import messaging from '@react-native-firebase/messaging';
import NotifService from './NotifService';
import rootNavigation from './rootNavigation';
import { PermissionsAndroid, AppState, Alert, NativeModules , NativeEventEmitter } from 'react-native'

let activityStarter;
let eventEmitter;

     activityStarter = NativeModules.ActivityStarter;
     eventEmitter = new NativeEventEmitter(activityStarter);
let id = 1;
export default async (message) => {
  
  try {
    const isVideoCallNotification = message.data.videoNotification;
   
    if(isVideoCallNotification === '1') {
     
    }
    
    const notitificationId = id + 1;
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      if(remoteMessage.data.navigationKeyPT) {
        rootNavigation.navigate(remoteMessage.data.navigationKeyPT);
      }
    });
    
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log(remoteMessage);
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          if(remoteMessage.data.navigationKeyPT) {
            rootNavigation.navigate(remoteMessage.data.navigationKeyPT);
          } // e.g. "Settings"
        }
      });

    Promise.resolve();
  } catch (e) {
    return Promise.resolve();
  }
}