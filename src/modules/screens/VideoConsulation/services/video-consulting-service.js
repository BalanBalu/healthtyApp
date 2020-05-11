
import { postService, getService, putService } from '../../../../setup/services/httpservices';
import { SET_USER_LOOGED_IN_CONNECTYCUBE } from '../../../providers/chat/chat.action';
import { store } from '../../../../setup/store';
import { AuthService } from './index';
export const SET_LAST_MESSAGES_DATA = 'CHAT/LAST_MESSAGES_DATA';

export const fetchAvailableDoctors4Video = async (docIds) => {
    try {
        
        let endPoint = 'video-consulting/public/available/doctors?day=' + new Date().getDay();
        if(docIds) {
            endPoint = endPoint + '&doctorIds=' + docIds
        }
        console.log(endPoint);
        let response = await getService(endPoint);
        let respData = response.data;
        return respData;
    } catch (e) {
        return {
            success: false,
            message: e + ' Occured! Please Try again'
        }
    }
}

export const createVideoConsuting = async (request) => {
    try {
        let endPoint = 'video-consulting/consultation/';
        let response = await postService(endPoint, request);
        let respData = response.data;
        return respData;
    } catch (e) {
        return {
            success: false,
            message: e + ' Occured! Please Try again'
        }
    }
}

export const getVideoConsuting = async (userId) => {
    try {
        let endPoint = 'video-consulting/consultation/user/' + userId;
        let response = await getService(endPoint);
        let respData = response.data;
        return respData;
    } catch (e) {
        return {
            success: false,
            message: e + ' Occured! Please Try again'
        }
    }
}


export const updateVideoConsuting = async (consultationId, request) => {
    try {
        let endPoint = 'video-consulting/consultation/' + consultationId;
        let response = await putService(endPoint, request);
        let respData = response.data;
        return respData;
    } catch (e) {
        return {
            success: false,
            message: e + ' Occured! Please Try again'
        }
    }
}
export const sendNotification = async (doctorId, request) => {
    try {
        let endPoint = 'video-consulting/connectycube/notification/doctor/' + doctorId;
        console.log(endPoint);
        console.log(request);
        let response = await postService(endPoint, request);
        let respData = response.data;
        console.log(respData);
        return respData;
    } catch (e) {
        console.log(e);
        return {
            success: false,
            message: e + ' Occured! Please Try again'
        }
    }
}
export const authorizeConnectyCube = async (userId) => {
    let fields = "user_id,connectycube"
    let endPoint = 'user/' + userId + '?fields=' + fields;

    let response = await getService(endPoint);
    let respData = response.data;
    if(respData.success === true) {
       const result = respData.data;
        if(result.connectycube) {
           const resp = await AuthService.loginToConnctyCube(userId, result.connectycube);
           console.log('CoonectyCube LoggedIn Response' , resp);
           return resp;
        }
    }
    return false;
  }
  
  
export const setUserLoggedIn = () => {
    store.dispatch({
        type: SET_USER_LOOGED_IN_CONNECTYCUBE,
    });
}