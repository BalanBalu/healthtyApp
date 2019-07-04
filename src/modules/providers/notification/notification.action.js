


import { postService, getService, putService } from '../../../setup/services/httpservices';




/* Get Patient Notification List  */
export const fetchUserNotification = async (userId) => {
    try {

        let endPoint = '/notifications/' + userId;
        let response = await getService(endPoint);
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
// put services
export const UpDateUserNotification = async (updateNode, notificationIds) => {
    try {

        let endPoint = '/notifications/status/' + updateNode + '/' + notificationIds;
        console.log(endPoint)
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


