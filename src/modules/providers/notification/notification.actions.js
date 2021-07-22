


import { postService, putService, getService, smartHealthGetService, smartHealthPostService, smartHealthPutService, postServiceExternal, smartHealthDeleteService } from '../../../setup/services/httpservices';

export const NOTIFICATION_REQUEST = 'NOTIFICATION/NOTIFICATION_REQUEST'
export const NOTIFICATION_HAS_ERROR = 'NOTIFICATION/NOTIFICATION_HAS_ERROR'
export const NOTIFICATION_RESPONSE = 'NOTIFICATION/NOTIFICATION_RESPONSE'
export const NOTIFICATION_RESET = 'NOTIFICATION/NOTIFICATION_RESET'
import { store } from '../../../setup/store';



/* Get Patient Notification List  */
export const fetchUserNotification = async (userId,page,limit) => {
    try {
        let endPoint = 'notification/by-receiverId?receiverId='+userId +'&p='+ page +'&l='+limit;
        let response = await smartHealthGetService(endPoint);
        let respData = response.data;
        if(response.status === 200){
            store.dispatch({
                type: NOTIFICATION_RESET,
              })
        }
        return respData;

    } catch (e) {
        return {
            type: NOTIFICATION_HAS_ERROR,
            message: e + ' Occured! Please Try again'
        }
    }


}

// put services
export const UpDateUserNotification = async (data) => {
    try {

        let endPoint = 'notification/by-notificationIds';
        let response = await smartHealthPutService(endPoint,data);
        let respData = response.data;
        return respData;
    } catch (e) {
        
        return {
            message: 'exception' + e,
            success: false
        }
    }
}


export const fetchUserMarkedAsReadedNotification = async (userId) => {
    try {

        let endPoint = 'notification/by-receiverId/viewed?receiverId=' + userId;

        let response = await smartHealthGetService(endPoint);
        let respData = response.data;
       
        store.dispatch({
            type: NOTIFICATION_REQUEST,
            message:  'Get all notifications successfully '
        })
        if (response.status != 200) {
            store.dispatch({
                type: NOTIFICATION_HAS_ERROR,
                message:'Occured! Please Try again'
            });

        } else {
            let count = respData.length
            
            let notificationIds = respData.map(element => {
                return element._id;
       }).join(',')

            store.dispatch({
                type: NOTIFICATION_RESPONSE,
                message: 'Get all notifications successfully ',
                notificationIds:notificationIds,
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

