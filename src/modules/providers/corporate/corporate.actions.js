import { postService, putService, getService, smartHealthGetService, smartHealthPostService, smartHealthPutService, postServiceExternal, smartHealthDeleteService } from '../../../setup/services/httpservices';
import { getCorporateUserEcardDetailsEndpoint, getECardLinkEndpoint } from '../../../setup/services/corporateEndpoint';
import { AuthId } from '../../../setup/config'
import AsyncStorage from '@react-native-async-storage/async-storage';
export const LOGIN_REQUEST = 'AUTH/LOGIN_REQUEST'
export const LOGIN_HAS_ERROR = 'AUTH/LOGIN_RESPONSE'
export const LOGIN_RESPONSE = 'AUTH/LOGIN_RESPONSE'
import { store } from '../../../setup/store';
import {setUserLocally} from '../../providers/auth/auth.actions'


/*  Search by Network hospitals for Corporate User */
export async function serviceOfSearchByNetworkHospitalDetails(reqData, skipCount, limit) {
  try {
    let endPoint = 'master-hospitals/search/page?';
 
    if (skipCount) {
      endPoint = `${endPoint}p=${skipCount}&`;
    }
    if (limit) {
      endPoint = `${endPoint}l=${limit}&`;
    }
    const response = await smartHealthPostService(endPoint,reqData);
    return response.data;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}


export async function getCorporateUserEcardDetails(bodyData) {
  try {
    let endpoint = getCorporateUserEcardDetailsEndpoint;
    let data = bodyData

    data.AuthId = AuthId;

    let resp = await postServiceExternal(endpoint, data)

    return resp.data
  } catch (Ex) {

    return {
      success: false,
      statusCode: 500,
      error: Ex,
    }
  }
}




export async function getCorporateEmployeeDetailsById(empCode) {
  try {
    let endPoint = 'member-detail/member-family-member?emp_code=' + empCode
    let response = await smartHealthGetService(endPoint);
    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}



export async function getEcardLink(bodyData) {
  try {
    let endpoint = 'member-detail/e-card'


    let resp = await smartHealthPostService(endpoint, bodyData)

    return resp.data
  } catch (Ex) {
    return {
      success: false,
      statusCode: 500,
      error: Ex,
    }
  }
}

export async function serviceOfSubmitPreAuthReq(bodyData) {
  try {
    let endpoint = 'pre-auth'


    let resp = await smartHealthPostService(endpoint, bodyData)

    return resp.data
  } catch (Ex) {

    return {
      success: false,
      statusCode: 500,
      error: Ex,
    }
  }
}
export async function serviceOfClaimIntimation(reqBodyData) {
  try {
    const endpoint = 'claim-intimation';
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
export async function getMemberDetailsByEmail(emailId) {
  try {
    let endPoint = 'member-detail/memberId/by-email?email=' + emailId;
    let response = await smartHealthGetService(endPoint);
    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}






export async function getPolicyDetailsByPolicyNo(policyNo) {
  try {
    let endPoint = 'policy/by-policyNo?pno=' + policyNo;
    let response = await smartHealthGetService(endPoint);

    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}

export async function serviceOfGetPreAuthList(policyNo, empCode, page, limit) {
  try {
    const endPoint = 'pre-auth/policy/employeeId?policyNo=' + policyNo + '&empId=' + empCode + '&p=' + page + '&l=' + limit;
    const response = await smartHealthGetService(endPoint);
    return response.data;
  } catch (e) {
    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}


export async function getClaimsDataByPayerCode(payer_code, policy_no,empId, page, limit) {
  try {
    let endPoint = 'claim-data?payerCode=' + payer_code + '&policyno=' + policy_no+'&eid=' + empId + '&p=' + page + '&l=' + limit;
    console.log("endPoint",endPoint)
    let response = await smartHealthGetService(endPoint);
    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}


export async function getMemberDetailsByPolicyNo(policyNo) {
  try {
    let endPoint= 'member-detail/by-policyNo-and-relationship/?policyNo=' + policyNo;
    let response = await smartHealthGetService(endPoint);
    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}

export async function getFamilyMembersByPolicyNoeWithPagination(searchText, policyNo, page, limit) {
  try {
    let endPoint;
    if (searchText) {
      endPoint = 'member-family-details/family-member-by-policyNo/page?searchText=' + searchText + '&policyNo=' + policyNo + '&p=' + page + '&l=' + limit;
    } else {
      endPoint = 'member-family-details/family-member-by-policyNo/page?policyNo=' + policyNo + '&p=' + page + '&l=' + limit;
    }
    let response = await smartHealthGetService(endPoint);
    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}

export async function getClaimIntimationWithPagination(searchText, employeeId, policyNo, page, limit) {
  try {
    let endPoint;
    if (searchText) {
      endPoint = 'claim-intimation/page?searchText=' + searchText + '&empId=' + employeeId + '&policyNo=' + policyNo + '&p=' + page + '&l=' + limit;
    } else {
      endPoint = 'claim-intimation/page?empId=' + employeeId + '&policyNo=' + policyNo + '&p=' + page + '&l=' + limit;
    }
    let response = await smartHealthGetService(endPoint);
    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}

export async function serviceOfUpdateClaimIntimation(reqBodyData) {
  try {
    const endpoint = 'claim-intimation';
    const resp = await smartHealthPutService(endpoint, reqBodyData)
    return resp.data
  } catch (Ex) {
    return {
      success: false,
      statusCode: 500,
      error: Ex.message,
    }
  }
}

export async function serviceOfUpdatePreAuthDocs(reqBodyData) {
  try {
    const endpoint = 'pre-auth';
    const resp = await smartHealthPutService(endpoint, reqBodyData)
    return resp.data
  } catch (Ex) {
    return {
      success: false,
      statusCode: 500,
      error: Ex.message,
    }
  }
}


export async function getTpaInfoByTpaCode(tpaCode) {
  try {
    let endPoint = 'tpa-master/tpaCode?tpaCode=' + tpaCode
    let response = await smartHealthGetService(endPoint);
    return response.data;
  } catch (e) {
    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}

export async function getCorporateHelpLineNumber() {
  try {
    let endPoint = 'setting/key?key=' + "HELP_LINE_NUMBER"
    let response = await smartHealthGetService(endPoint);
    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}
export async function getCorporateHelpLineEmail() {
  try {
    let endPoint = 'setting/key?key=' + "HELP_LINE_EMAIL"
    let response = await smartHealthGetService(endPoint);
    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}


export async function postContactDetails(bodyData) {
  try {
    let endpoint = 'contact-us-request/create-request'


    let resp = await smartHealthPostService(endpoint, bodyData)

    return resp.data
  } catch (Ex) {

    return {
      success: false,
      statusCode: 500,
      error: Ex,
    }
  }
}

export async function getFamilyMemDetails(memberPolicyNo, employeeId) {
  try {
    let endpoint = 'member-family-details/byPolicyNoByEmpId?policyNo='+memberPolicyNo+'&empId='+employeeId
    let resp = await smartHealthGetService(endpoint)

    return resp.data
  } catch (Ex) {

    return {
      success: false,
      statusCode: 500,
      error: Ex,
    }
  }
}

export async function addFamilyMembersDetails(data) {
  try {
    let endPoint = 'member-family-details';
    let response = await smartHealthPostService(endPoint,data);
    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}

export async function familyMemberIdExist(memberId,policyNo) {
  try {
    let endPoint = 'member-family-details/familyMemberId/exist?memberId='+memberId+'&policyNo='+policyNo;
    let response = await smartHealthGetService(endPoint);
    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}

export async function memberEmailValidation(emailId,memberId) {
  try {
    let endPoint = 'member-detail/email/exist?email-id='+emailId+'&memberId='+memberId;
    let response = await smartHealthGetService(endPoint);
    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}

export async function updateFamilyMembersDetails(data) {
  try {
    let endPoint = 'member-family-details';
    let response = await smartHealthPutService(endPoint,data);
    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}
export async function deleteFamilyMembersDetails(id) {
  try {
    let endPoint = 'member-family-details?id='+id;
    let response = await smartHealthDeleteService(endPoint);
    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}


export async function serviceOfGenerateOtp4UpdateMemberEmail(bodyData) {
  try {
    const endpoint = 'auth/member/send-update-email-otp'
    const resp = await smartHealthPostService(endpoint, bodyData)
    return resp.data
  } catch (Ex) {

    return {
      success: false,
      statusCode: 500,
      error: Ex,
    }
  }
}

export async function generateOTPForLoginWithOtp(userId) {
  try {
    const endpoint = 'auth/generate-otp-member-login?userId='+userId;
    console.log("endpoint",endpoint)
    const resp = await smartHealthPostService(endpoint)
    return resp.data
  } catch (Ex) {

    return {
      success: false,
      statusCode: 500,
      error: Ex,
    }
  }
}

export async function verifyMemberLoginWithOtp(reqData) {
  try {
    const endpoint = 'auth/login-with-otp';
    console.log("reqData",reqData)
    const response = await smartHealthPostService(endpoint,reqData)
    if (response && response.data && response.data.access_token) {
      await AsyncStorage.setItem('smartToken', response.data.access_token)
      let ends = 'member-detail/memberId/by-email?email=' + response.data.userId;
       let res = await smartHealthGetService(ends);
       if (res && res.data && res.data[0]) {
         let reqData = res.data[0];
         const loggedUsersData={
           is_corporate_user : true
         }
         if(reqData&& reqData.emailId){
           loggedUsersData.email=reqData.emailId
         }
         if(reqData&& reqData.mobile){
           loggedUsersData.mobile_no=reqData.mobile
         }
         if (reqData.relationship) {
           await AsyncStorage.setItem('relationship', reqData.relationship)
         }
            await AsyncStorage.setItem('memberId', reqData.memberId)
           await AsyncStorage.setItem('memberEmailId', reqData.emailId)
           await AsyncStorage.setItem('memberPolicyNo', reqData.policyNo)
           await AsyncStorage.setItem('employeeCode', reqData.employeeId)
           const token = response.data.access_token;
           await setUserLocally(token, loggedUsersData);
           store.dispatch({
             type: LOGIN_RESPONSE,
             message: "Successfully Logged in"
           })
       }
       else{
       store.dispatch({
         type: LOGIN_HAS_ERROR,
         message: "Invalid Login Credentials"
       })
     }
     } else {
       store.dispatch({
         type: LOGIN_HAS_ERROR,
         message: "Invalid Login Credentials"
       })
     }
     return true
 
  } catch (Ex) {

    return {
      success: false,
      statusCode: 500,
      error: Ex,
    }
  }
}


export async function serviceOfVerifyOtpCode4UpdateEmail(bodyData) {
  try {
    const endpoint = 'auth/member/update-email'
    const resp = await smartHealthPostService(endpoint, bodyData)
    return resp.data
  } catch (Ex) {
    return {
      success: false,
      statusCode: 500,
      error: Ex,
    }
  }
}

export async function createClaimSubmission(reqBodyData) {
  try {
    const endpoint = 'claim-submission';
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
export async function updateClaimSubmission(reqBodyData) {
  try {
    const endpoint = 'claim-submission';
    const resp = await smartHealthPutService(endpoint, reqBodyData)
    return resp.data
  } catch (Ex) {
    return {
      success: false,
      statusCode: 500,
      error: Ex.message,
    }
  }
}

export async function getClaimSubmissionById(id) {
  try {
    const endpoint = 'claim-submission/by-id?'+id;
    const resp = await smartHealthGetService(endpoint, reqBodyData)
    return resp.data
  } catch (Ex) {
    return {
      success: false,
      statusCode: 500,
      error: Ex.message,
    }
  }
}


export async function getListByTpaCode(tpaCode) {
  try {
    const endpoint = 'tpa/code'+tpaCode;
    const resp = await smartHealthGetService(endpoint)
    return resp.data
  } catch (Ex) {
    return {
      success: false,
      statusCode: 500,
      error: Ex.message,
    }
  }
}
