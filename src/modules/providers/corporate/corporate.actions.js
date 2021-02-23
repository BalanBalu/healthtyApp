import { postService, putService, getService, smartHealthGetService, smartHealthPostService, smartHealthPutService, postServiceExternal } from '../../../setup/services/httpservices';
import { getCorporateUserEcardDetailsEndpoint, getECardLinkEndpoint } from '../../../setup/services/corporateEndpoint';
import { AuthId } from '../../../setup/config'



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
    console.log(`empCode`, empCode);
    let endPoint = 'member-detail/member-family-member?emp_code=' + empCode
    let response = await smartHealthGetService(endPoint);
    console.log(`response`, response);

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

export async function createPreAuth(bodyData) {
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

export async function getPreAuthListByEmpCodeAndPolicyNo(policyNo,empCode,page,limit) {
  try {
    let endPoint = 'pre-auth/policy/employeeId?policyNo='+policyNo+'&empId='+empCode+'&p='+page+'&l='+limit;
console.log(endPoint)
    let response = await smartHealthGetService(endPoint);
    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}


export async function getClaimsDataByPayerCode(payer_code, policy_no,page, limit) {
  try {
    let endPoint = 'claim-data?payerCode=' + payer_code + '&policyno=' + policy_no + '&p=' + page + '&l=' + limit;
    console.log(`endPoint`, endPoint);
    
    let response = await smartHealthGetService(endPoint);
    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}
export async function getClaimIntimationWithPagination(searchText,employeeId,policyNo,page,limit) {
  try {
    let endPoint;
    if (searchText){
      endPoint = 'claim-intimation/page?searchText=' + searchText +'&empId='+employeeId+ '&policyNo='+policyNo+'&p=' + page + '&l=' + limit;
    }else{
      endPoint = 'claim-intimation/page?empId='+employeeId+ '&policyNo='+policyNo+'&p=' + page + '&l=' + limit;
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
    let endPoint ='tpa-master/tpaCode?tpaCode=' + tpaCode
    let response = await smartHealthGetService(endPoint);
    return response.data;
  } catch (e) {
    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}
