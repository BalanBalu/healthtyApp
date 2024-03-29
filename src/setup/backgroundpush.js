import messaging from '@react-native-firebase/messaging';
import rootNavigation from './rootNavigation';
import NotifService from './NotifService';
import { reomveEvent } from './calendarEvent'
import { IS_IOS } from './config';
let id = 1;
export default async (message) => {

  try {
    const isVideoCallNotification = message.data.videoNotification;
    if (message.data && message.data.additionalParameters) {
      let additionalData = JSON.parse(message.data.additionalParameters)
      if (additionalData.user_appointment_event_id) {
       await reomveEvent(additionalData.user_appointment_event_id);
     
      }

    }

    if (IS_IOS) {
      let title, body;
      if (message.notification) {
        title = message.notification.title;
        body = message.notification.body;
      } else {
        title = message.data.title;
        body = message.data.body;
      }
      NotifService.localNotif(title, body)
    }

    if (isVideoCallNotification === '1') {

    }

    const notitificationId = id + 1;
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage.data.navigationKeyPT) {
        rootNavigation.navigate(remoteMessage.data.navigationKeyPT);
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          if (remoteMessage.data.navigationKeyPT) {
            rootNavigation.navigate(remoteMessage.data.navigationKeyPT);
          } // e.g. "Settings"
        }
      });

    Promise.resolve();
  } catch (e) {
    return Promise.resolve();
  }
}