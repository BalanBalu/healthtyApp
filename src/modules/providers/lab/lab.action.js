import { postService, getService, putService } from '../../../setup/services/httpservices';

/*get Popular Medicine*/
export async function getLabTestCateries(coordinates) {
    try {
        var endPoint = 'lab-test/categories?location=' + coordinates;
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

export const getLapAppointments = async (user_id, filters) => {
    try {
        let endPoint = 'labappointments/user/' + user_id + '?startDate=' + filters.startDate + '&endDate=' + filters.endDate;
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
        let endPoint = 'labappointments/' + appointmentId
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
