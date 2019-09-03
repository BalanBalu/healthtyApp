


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
        return respData;

    } catch (e) {
        return {
            type: NOTIFICATION_HAS_ERROR,
            message: e + ' Occured! Please Try again'
        }
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
export const fetchUserMarkedAsReadedNotification = async (userId) => {
    try {

        let endPoint = '/notifications/' + userId + '?mark_as_readed=true';

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
            let count=respData.data.length
         notificationId= respData.data.map(element => {

               return element._id

            }).join(',')
            store.dispatch({
                type: NOTIFICATION_RESPONSE,
                message: respData.message,
                notificationIds: notificationId,
                notificationCount: count
            })


        }
        return respData;

    } catch (e) {
       
        store.dispatch({
            type: NOTIFICATION_HAS_ERROR,
            message: e + ' Occured! Please Try again'
        });
    }


}

