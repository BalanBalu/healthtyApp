export const PROFILE_REQUEST = 'PROFILE/PROFILE_REQUEST'
export const PROFILE_RESPONSE = 'PROFILE/PROFILE_RESPONSE'
export const PROFILE_ERROR = 'PROFILE/PROFILE_ERROR'
export const REVIEWS_REQUEST = 'PROFILE/REVIEWS_REQUEST'
export const REVIEWS_RESPONSE = 'PROFILE/REVIEWS_RESPONSE'
export const REVIEWS_ERROR = 'PROFILE/REVIEWS_ERROR'
import { store } from '../../../setup/store'
import { getService } from '../../../setup/services/httpservices';

/*get doctor profile*/
export async function fetchUserProfile(userId, fields, isLoading = true) {
  try {
    store.dispatch({
      type: PROFILE_REQUEST,
      isLoading 
    })     
    let endPoint = 'user/' + userId + '?fields=' + fields;  
    
    let response = await getService(endPoint); 
    let respData = response.data;
    
    if(respData.error || !respData.success) {
      store.dispatch({
        type: PROFILE_ERROR,
        message: respData.error
      })
      return respData.data;
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
    console.log(e);
    store.dispatch({
      type: PROFILE_ERROR,
      message: e
      }); 
  }  
}


// get user reviews

export async function userReviews (id,type, isLoading = true) {
  try {
    store.dispatch({
      type: REVIEWS_REQUEST,
      isLoading 
    })     
    let endPoint = 'user/reviews/'+type+'/'+id;  
    console.log(endPoint);   
    let response = await getService(endPoint); 
    
   
    let respData = response.data;
    
    if(respData.error || !respData.success) {
      store.dispatch({
        type: REVIEWS_ERROR,
        message: respData.error
      })
    } else {   
      store.dispatch({
        type: REVIEWS_RESPONSE,
        isLoading:false,
        success: true,     
        message: respData.message
      })
    }
    return response.data;
  } catch (e) {
    store.dispatch({
      type: REVIEWS_ERROR,
      message: e
      }); 
  }  
}

  
  
  
  
  
  
