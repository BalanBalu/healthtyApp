import { postService, getService, putService } from '../../../setup/services/httpservices';

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
