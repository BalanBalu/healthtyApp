


import { postService, getService, putService } from '../../../setup/services/httpservices';

export const NOTIFICATION_REQUEST = 'NOTIFICATION/NOTIFICATION_REQUEST'
export const NOTIFICATION_HAS_ERROR = 'NOTIFICATION/NOTIFICATION_HAS_ERROR'
export const NOTIFICATION_RESPONSE = 'NOTIFICATION/NOTIFICATION_RESPONSE'
import { AsyncStorage } from 'react-native';
import { store } from '../../../setup/store';

/* Get Patient Notification List  */
export const fetchUserNotification = async (userId) => {
    try {
       
        let endPoint = '/notifications/' + userId;
            
        let response = await getService(endPoint);
        let respData = response.data;
        store.dispatch({
            type: NOTIFICATION_REQUEST,
            message: respData.message
        })
        if (respData.error || !respData.success) {
            store.dispatch({
                type: NOTIFICATION_HAS_ERROR,
                message: e + ' Occured! Please Try again'
            });
            
        } else {
            let count = 0, notification = [];
            respData.data.forEach(element => {
               
                if (element.mark_as_viewed == false) {
                    console.log(element)
                    notification.push(element._id)
                    count++;
                }

            });
            store.dispatch({
                type: NOTIFICATION_RESPONSE,
                message: respData.message,
                details: respData.data,
                notificationIds: notification,
                notificationCount: count 
            })
              

        }
        return respData;

    } catch (e) {
        console.log(e);
        store.dispatch({
            type: NOTIFICATION_HAS_ERROR,
            message: e + ' Occured! Please Try again'
        });
    }


}
// put services
export const UpDateUserNotification = async (updateNode, notificationIds) => {
    try {

        let endPoint = '/notifications/status/' + updateNode + '/' + notificationIds;

        let response = await putService(endPoint);
        let respData = response.data;
        return respData;
    } catch (e) {
        console.log(e.message);
        return {
            message: 'exception' + e,
            success: false
        }
    }
}

export function setnotification(notificationData) {

    AsyncStorage.setItem('notificationCount', notificationData)





}
