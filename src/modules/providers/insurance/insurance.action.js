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