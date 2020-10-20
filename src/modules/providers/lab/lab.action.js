import { postService, getService, putService } from '../../../setup/services/httpservices';

/*get Popular Medicine*/
export async function getLabTestCateries(coordinates) {
    try {
        var endPoint = 'lab-test/categories?location=' + encodeURIComponent(coordinates);
        console.log("endPoint", endPoint)
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

export const getLapAppointments = async (userId, filters) => {
    try {
        let endPoint = 'lab-test/appointments/user/' + userId + '?startDate=' + filters.startDate + '&endDate=' + filters.endDate;
        if (filters.reviewInfo) {
            endPoint = endPoint + '&reviewInfo=1'
        }
        console.log(endPoint);

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

export async function getCategories() {
    try {
        let endPoint = 'lab-test/labCategories';
        let response = await getService(endPoint);
        let respData = response.data;
        return respData;
    } catch (e) {
        return {
            success: false,
            message: e
        }
    }
}

export async function updateLapAppointment(appointmentId, requestData, isLoading = true) {
    try {
        let endPoint = 'lab-test/appointments/' + appointmentId
        console.log("endPoint", endPoint)
        let response = await putService(endPoint, requestData);
        let respData = response.data;

        return respData;
    } catch (e) {
        return {
            message: 'exception' + e,
            success: false
        }
    }
}

export const validateAppointment = async (userId, availabilityId, filters) => {
    try {
        let endPoint = 'lab-test/appointments/' + userId + '/' + availabilityId + '?startDate=' + filters.startDate + '&endDate=' + filters.endDate;
        console.log(endPoint);
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


export const getLapTestPaymentDetails = async (paymentId) => {
    try {
        let endPoint = '/payment/' + paymentId;
        console.log(endPoint)
        let response = await getService(endPoint);
        let respData = response.data;
        if (respData.error || respData.success == false) {
            return {
                success: respData.success,
                message: respData.error,
            }
        } else {
            return respData;
        }

    } catch (e) {
        return {
            success: false,
            message: 'Exception Occured' + e
        };
    }
}


export const getLabAppointmentById = async (appointmentId) => {
    try {
        let endPoint = 'lab-test/appointments/' + appointmentId
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


export async function insertAppointment(data) {
    try {
        let endPoint = 'lab-test/appointments';
        let response = await postService(endPoint, data);
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



export async function insertReviews(userId, insertUserReviews) {
    try {
        let endPoint = 'lab-test/user/' + userId + '/labReview';
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


export async function getUserReviews(type, Id) {
    try {
        let endPoint = 'lab-test/user/' + type + '/' + Id;
        console.log("endPoint", endPoint)
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
