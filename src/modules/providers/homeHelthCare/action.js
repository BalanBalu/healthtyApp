import { postService, getService, putService } from '../../../setup/services/httpservices';

export async function getAppointment4Healthcare(userId, filters, isLoading = true) {
    try {
        const endPoint = 'home_healthcare/appointment/user/' + userId + '?startDate=' + filters.startDate + '&endDate=' + filters.endDate;;
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
        console.log('Ex is getting on Update Doctor Home Test appointment details====>', Ex.message)
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
        console.log(reqData);

        const endPoint = 'home_healthcare/appointments/' + appointmentId;
        const response = await putService(endPoint, reqData);
        const respData = response.data;
        return respData;
    } catch (Ex) {
        console.log('Ex is getting on Update Doctor Home Test appointment details====>', Ex.message)
        return {
            success: false,
            statusCode: 500,
            error: Ex,
            message: `Exception while getting on Update Doctor Home Test appointment details : ${Ex.message}`
        }
    }
}






