import { smartHealthGetService, smartHealthPostService, smartHealthPutService } from '../../../setup/services/httpservices';
export async function getPolicyByPolicyNo(policyNo) {
    try {
        let endPoint = 'policy/by-policyNo?pno=' + policyNo;
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

