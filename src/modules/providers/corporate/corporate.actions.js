import { postService, putService, getService, smartHealthGetService ,postServiceExternal} from '../../../setup/services/httpservices';
import {getCorporateUserEcardDetailsEndpoint,getECardLinkEndpoint} from '../../../setup/services/corporateEndpoint';
import {AuthId} from '../../../setup/config'



export async function getCorporateUserEcardDetails(bodyData) {
    try {
    let  endpoint=getCorporateUserEcardDetailsEndpoint;
    let data=bodyData

    data.AuthId=AuthId;
  
    let resp = await postServiceExternal(endpoint,data)
  
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
      let endPoint = 'member-detail/'+empCode;
  
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
    let  endpoint=getECardLinkEndpoint;
    let data=bodyData;
    data.AuthId=AuthId;
   
    let resp = await postServiceExternal(endpoint,data)
  
  return resp.data
    } catch (Ex) {
     
      return {
        success: false,
        statusCode: 500,
        error: Ex,
      }
    }
  }