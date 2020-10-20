import {smartHealthGetService,smartHealthPostService,smartHealthPutService  } from '../../../setup/services/httpservices';
export async function getInsuranceData() {
    try {
        let endPoint = '/enquiry-list' ;
        let response = await smartHealthGetService(endPoint);
        let respData = response.data;
        return respData;

    } catch (e) {
        return {
            message: 'exception' + e,
            success: false
        }
    }
}

export async function sendInsuranceInterests(data) {
    try {
        let endPoint = '/enquiry' ;
        let response = await smartHealthPostService(endPoint, data);
        let respData = response.data;
        return respData;
    } catch (e) {
        return {
            message: 'exception' + e,
            success: false
        }
    }
}