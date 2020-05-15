import messaging from '@react-native-firebase/messaging';
import NotifService from './NotifService';
import rootNavigation from './rootNavigation';

export default async (message) => {
  try {
    const isVideoCallNotification = message.data.videoNotification;
   
    if(isVideoCallNotification === '1') {
      NotifService.localNotif({
        ...message.data, 
        tag: 'VIDEO_NOTIFICATION'
      });
    }
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