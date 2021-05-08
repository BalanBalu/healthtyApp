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

export async function getInsuranceById(id) {
    try {
        let endPoint = '/insurers/' + id;
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

export async function createMemberInsurance(reqBodyData) {
    try {
        const endpoint = 'member-wallet';
        const resp = await smartHealthPostService(endpoint, reqBodyData)
        return resp.data
      } catch (Ex) {
        return {
          success: false,
          statusCode: 500,
          error: Ex.message,
        }
      }
}

export async function getInsuranceByMemberId(memberId,page,limit) {
    try {
        let endPoint = 'member-wallet/page?memberId='+memberId+'&p='+page+'&l='+limit;
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

export async function getInsuranceCompanyNameList(memberId,page,limit) {
    try {
        const endPoint = 'insurance';
        let response = await smartHealthGetService(endPoint);
        return response;
    } catch (e) {
        return {
            message: 'exception' + e,
            success: false
        }
    }
}

export async function arrangeCallbackAction(name,insuranceName) {
    try {
      let endPoint = 'member-wallet/renewal-insurance?name=' + name+'&insuranceName='+insuranceName;
      let response = await smartHealthPostService(endPoint);
      return response.data;
    } catch (e) {
  
      return {
        message: 'exceptio1n' + e,
        success: false
      }
    }
  }
  
  export async function arrangeCallbackActionForBuyInsurance(name,insuranceName) {
    try {
      let endPoint = 'member-wallet/renewal-buy_insurance?name=' + name+'&insuranceName='+insuranceName;
      let response = await smartHealthPostService(endPoint);
      return response.data;
    } catch (e) {
  
      return {
        message: 'exceptio1n' + e,
        success: false
      }
    }
  }

