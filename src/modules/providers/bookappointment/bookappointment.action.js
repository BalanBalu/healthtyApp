export const BOOK_APPOINTMENT_REQUEST = 'BOOK_APPOINTMENT/BOOK_APPOINTMENT_REQUEST'
export const BOOK_APPOINTMENT_RESPONSE = 'BOOK_APPOINTMENT/BOOK_APPOINTMENT_RESPONSE'
export const BOOK_APPOINTMENT_ERROR = 'BOOK_APPOINTMENT/BOOK_APPOINTMENT_ERROR'
export const REVIEW_REQUEST = 'BOOK_APPOINTMENT/REVIEW_REQUEST'
export const REVIEW_RESPONSE = 'BOOK_APPOINTMENT/REVIEW_RESPONSE'
export const REVIEW_ERROR = 'BOOK_APPOINTMENT/REVIEW_ERROR'

import { store } from '../../../setup/store'
import { getService } from '../../../setup/services/httpservices';

/*get doctor availability for patient view doctor profile */
export async function viewdoctorProfile (doctorIds, isLoading = true) {
  try {
    store.dispatch({
      type: BOOK_APPOINTMENT_REQUEST,
      isLoading 
    })     
    let endPoint = 'doctors/' + doctorIds + '/availabilitySlots'
   console.log(endPoint);   
    let response = await getService(endPoint); 
    let respData = response.data;    
    if(respData.error || !respData.success) {
      console.log('error')
      store.dispatch({
        type: BOOK_APPOINTMENT_ERROR,
        message: respData.error
      })
    } else {   
      console.log('response');
      store.dispatch({        
        type: BOOK_APPOINTMENT_RESPONSE,
        isLoading:false,
        success: true,     
        message: respData.message
      })
      return respData;
    }
    return respData;
    
  } catch (e) {
    store.dispatch({
      type: BOOK_APPOINTMENT_ERROR,
      message: e
      }); 
  }  
}

/*get userReviews*/

export async function viewUserReviews(id,type, isLoading = true) {
  try {
    store.dispatch({
      type: REVIEW_REQUEST,
      isLoading 
    })     
    let endPoint = '/user/reviews/'+type+ '/' +id
   console.log(endPoint);   
    let response = await getService(endPoint);
    console.log("hai");
    console.log(response); 
    let respData = response.data;    
    if(respData.error || !respData.success) {
      console.log('error')
      store.dispatch({
        type: REVIEW_ERROR,
        message: respData.error
      })
    } else {   
      console.log('response');
      store.dispatch({        
        type: REVIEW_RESPONSE,
        isLoading:false,
        success: true,     
        message: respData.message
      })
      return respData;
    }
    return respData;
    
  } catch (e) {
    store.dispatch({
      type: REVIEW_ERROR,
      message: e
      }); 
  }  
}






  
  
  
  
  
  
