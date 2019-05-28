export const REQUEST = 'BOOK_APPOINTMENT/REQUEST'
export const RESPONSE = 'BOOK_APPOINTMENT/RESPONSE'
export const ERROR = 'BOOK_APPOINTMENT/ERROR'
// export const DOCTORLIST_REQUEST = 'BOOK_APPOINTMENT/DOCTORLIST_REQUEST'
// export const DOCTORLIST_ERROR = 'BOOK_APPOINTMENT/DOCTORLIST_RESPONSE'
// export const DOCTORLIST_RESPONSE = 'BOOK_APPOINTMENT/DOCTORLIST_RESPONSE'
// export const REVIEW_REQUEST = 'BOOK_APPOINTMENT/REVIEW_REQUEST'
// export const REVIEW_RESPONSE = 'BOOK_APPOINTMENT/REVIEW_RESPONSE'
// export const REVIEW_ERROR = 'BOOK_APPOINTMENT/REVIEW_ERROR'

import { postService, getService } from '../../../setup/services/httpservices';
import { store } from '../../../setup/store';


/* Search Services and category Module  */
export async function searchDoctorList(userId, searchInputvalues, isLoading = true) {
  try {

    store.dispatch({
      type: REQUEST,
      isLoading
    })
    // console.log(searchInputvalues+'searchInputvalues');
    let endPoint = 'user/' + userId + '/filters/doctors';
    let response = await postService(endPoint, searchInputvalues);
     console.log(JSON.stringify(response)+'searchDoctorList API rspnse');
    let respData = response.data;

    if (respData.error || !respData.success) {
      store.dispatch({
        type: ERROR,
        message: respData.error
      })
    } else {
     
      store.dispatch({
        type: RESPONSE,
        message: respData.message
      })
      return respData;
    }

  } catch (e) {
    store.dispatch({
      type: ERROR,
      message: e + ' Occured! Please Try again'
    });
  }
}

/*get doctor availability for patient view doctor profile */
export async function viewdoctorProfile (doctorIds, isLoading = true) {
  try {
    store.dispatch({
      type: REQUEST,
      isLoading 
    })     
    let endPoint = 'doctors/' + doctorIds + '/availabilitySlots'
   console.log(endPoint);   
    let response = await getService(endPoint); 
    let respData = response.data;    
    if(respData.error || !respData.success) {
      console.log('availability error')
      store.dispatch({
        type:ERROR,
        message: respData.error
      })
    } else {
          console.log('response');
      store.dispatch({
        type:RESPONSE,
        isLoading: false,
        success: true,
        message: respData.message
      })
      return respData;
    }
    return respData;

  } catch (e) {
    store.dispatch({
      type:ERROR,
      message: e
    });
  }
}

/*get userReviews*/

export async function viewUserReviews(id,type, isLoading = true) {
  try {
    store.dispatch({
      type: REQUEST,
      isLoading 
    })     
    let endPoint = 'user/reviews/'+type+ '/' +id
   console.log(endPoint);   
    let response = await getService(endPoint);
    console.log("review response");
    console.log(response); 
    let respData = response.data;    
    if(respData.error || !respData.success) {
      console.log('review error')
      store.dispatch({
        type:ERROR,
        message: respData.error
      })
    } else {   
      console.log('review response');
      store.dispatch({        
        type:RESPONSE,
        isLoading:false,
        success: true,     
        message: respData.message
      })
      return respData;
    }
    return respData;
    
  } catch (e) {
    store.dispatch({
      type:ERROR,
      message: e
      }); 
  }  
}

/*get doctor details*/
export const bindDoctorDetails = async (doctorId, fields, isLoading = true) => {
  try {
    store.dispatch({
      type:REQUEST,
      isLoading
    })
    let endPoint = 'doctor/' + doctorId + '?fields=' + fields;
    console.log(endPoint);
    let response = await getService(endPoint);
    let respData = response.data;
    if (respData.error || respData.success == false) {
      console.log('doctor profile error');
      console.log(response);
      store.dispatch({
        type:ERROR,
        message: respData.error,
      })
    } else {
      console.log('doctor profile response');
      store.dispatch({
        type:RESPONSE,
        isLoading: false,
        success: true
      })
    }
    return respData;
  } catch (e) {
    console.log(e.message);
    store.dispatch({
      type:ERROR,
      message: e,
    })
  }
}







  
  
  
  
  
  
