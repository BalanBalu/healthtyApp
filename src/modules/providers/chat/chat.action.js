import { postService, getService, putService } from '../../../setup/services/httpservices';
export const SET_LAST_MESSAGES_DATA = 'CHAT/LAST_MESSAGES_DATA' 
export const fetchAvailableDoctors4Chat = async (request) => {
    try {
        let endPoint = '/chat/availability';
       
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
export const createChat = async (request) => {
    try {
        let endPoint = '/chat';
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

export const updateChat = async (chatId, request) => {
    try {
        let endPoint = '/chat/'+ chatId;
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

export const getAllChats = async (userId, request) => {
    try {
        let endPoint = '/chat/user/'+ userId;
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

export const updateChatUpdatedTime = async(chatId) => {
    try {
        let endPoint = '/chat/'+ chatId +'/update/time';
        let response = await putService(endPoint, {});
        let respData = response.data;
        return respData;
    } catch (error) {
        
    }
}

