
import { postService, getService, putService } from '../../../../setup/services/httpservices';
export const SET_LAST_MESSAGES_DATA = 'CHAT/LAST_MESSAGES_DATA' 
export const fetchAvailableDoctors4Video = async (request) => {
    try {
        let endPoint = 'video-consulting/public/available/doctors';
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