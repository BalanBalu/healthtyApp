import messaging from '@react-native-firebase/messaging';
import rootNavigation from './rootNavigation';
import NotifService from './NotifService';
import { IS_IOS } from './config';
let id = 1;
export default async (message) => {
  console.log(message);
  try {
    const isVideoCallNotification = message.data.videoNotification;
    if(IS_IOS) {
       let title, body;
       if(message.notification) {
         title = message.notification.title;
         body = message.notification.body;
       } else {
          title = message.data.title;
          body = message.data.body;
       }
       NotifService.localNotif(title, body)
    }

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