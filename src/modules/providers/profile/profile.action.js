export const PROFILE_REQUEST = 'PROFILE/PROFILE_REQUEST'
export const PROFILE_RESPONSE = 'PROFILE/PROFILE_RESPONSE'
export const PROFILE_ERROR = 'PROFILE/PROFILE_ERROR'
import { store } from '../../../setup/store'
import { getService } from '../../../setup/services/httpservices';

/*get doctor profile*/
export async function userProfile (userId, fields, isLoading = true) {
  try {
    store.dispatch({
      type: PROFILE_REQUEST,
      isLoading 
    })     
    let endPoint = 'user/' + userId + '?fields=' + fields;  
    console.log(endPoint);   
    let response = await getService(endPoint); 
    console.log(response);
   
    let respData = response.data;
    
    if(respData.error || !respData.success) {
      store.dispatch({
        type: PROFILE_ERROR,
        message: respData.error
      })
    } else {   
      store.dispatch({
        type: PROFILE_RESPONSE,
        isLoading:false,
        success: true,     
        message: respData.message
      })
      return respData.data;
    }
    
  } catch (e) {
    store.dispatch({
      type: USER_PROFILE_HAS_ERROR,
      message: e
      }); 
  }  
}

  
  
  
  
  
  
