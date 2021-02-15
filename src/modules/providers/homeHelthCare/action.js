import { postService, getService, putService } from '../../../setup/services/httpservices';

export async function serviceOfGetHealthcareAppointmentList(userId, reqQueryData) {
    try {
        let endPoint = 'home_healthcare/appointment/user/' + userId + '?startDate=' + reqQueryData.startDate + '&endDate=' + reqQueryData.endDate;
        if (reqQueryData.limit) {
            endPoint = endPoint + '&skip=' + reqQueryData.skip + '&limit=' + reqQueryData.limit + '&sort=' + reqQueryData.sort;
        }
        if (reqQueryData.reviewInfo) {
            endPoint = endPoint + '&reviewInfo=1'
        }
        const response = await getService(endPoint);
        const respData = response.data;
        return respData;
    } catch (e) {
        return {
            message: 'exception' + e,
            success: false
        }
    }
}

export async function getHomeTestappointmentByID(appointmentId) {
    try {
        const endPoint = 'home_healthcare/appointments/' + appointmentId;
        const response = await getService(endPoint);
        const respData = response.data;
        return respData;
    } catch (Ex) {
        return {
            success: false,
            statusCode: 500,
            error: Ex,
            message: `Exception while getting on Update Doctor Home Test appointment details : ${Ex.message}`
        }
    }
}

export async function updateDocHomeTestappointment(appointmentId, reqData) {
    try {
        const endPoint = 'home_healthcare/appointments/' + appointmentId;
        const response = await putService(endPoint, reqData);
        const respData = response.data;
        return respData;
    } catch (Ex) {
        return {
            success: false,
            statusCode: 500,
            error: Ex,
            message: `Exception while getting on Update Doctor Home Test appointment details : ${Ex.message}`
        }
    }
}


export async function insertReviews(userId, insertUserReviews) {
    try {
        let endPoint = '/doctor/home_healthcare/user/' + userId;
        let response = await postService(endPoint, insertUserReviews);
        let respData = response.data;
        return respData;
    }
    catch (e) {
        return {
            message: 'exception' + e,
            success: false
        }
    }
}


export async function getUserReviews4homeTest(type, Id) {
    try {
        let endPoint = '/doctor/home_healthcare/user/' + type + '/' + Id;
        let response = await getService(endPoint);
        let respData = response.data;
        return respData;

    } catch (e) {
        return {
            message: 'exception' + e,
            success: false
        }
    }
}

