export const BOOK_APPOINTMENT_REQUEST = 'BOOK_APPOINTMENT/BOOK_APPOINTMENT_REQUEST'
export const BOOK_APPOINTMENT_RESPONSE = 'BOOK_APPOINTMENT/BOOK_APPOINTMENT_RESPONSE'
export const BOOK_APPOINTMENT_ERROR = 'BOOK_APPOINTMENT/BOOK_APPOINTMENT_ERROR'
export const REVIEW_REQUEST = 'BOOK_APPOINTMENT/REVIEW_REQUEST'
export const REVIEW_RESPONSE = 'BOOK_APPOINTMENT/REVIEW_RESPONSE'
export const REVIEW_ERROR = 'BOOK_APPOINTMENT/REVIEW_ERROR'
export const PROFILE_REQUEST = 'PROFILE/PROFILE_REQUEST'
export const PROFILE_RESPONSE = 'PROFILE/PROFILE_RESPONSE'
export const PROFILE_ERROR = 'PROFILE/PROFILE_ERROR'
import { store } from '../../../setup/store'
export const DOCTORLIST_REQUEST = 'BOOK_APPOINTMENT/DOCTORLIST_REQUEST'
export const DOCTORLIST_ERROR = 'BOOK_APPOINTMENT/DOCTORLIST_RESPONSE'
export const DOCTORLIST_RESPONSE = 'BOOK_APPOINTMENT/DOCTORLIST_RESPONSE'
export const APPOINTMENT_REQUEST = 'BOOK_APPOINTMENT/APPOINTMENT_REQUEST'
export const APPOINTMENT_RESPONSE = 'BOOK_APPOINTMENT/APPOINTMENT_RESPONSE'
export const APPOINTMENT_ERROR = 'BOOK_APPOINTMENT/APPOINTMENT_ERROR'
import { postService, getService } from '../../../setup/services/httpservices';

/*get doctor availability for patient view doctor profile */

/* Search Services and category Module  */
export async function searchDoctorList(userId, searchInputvalues, isLoading = true) {
  try {

    store.dispatch({
      type: DOCTORLIST_REQUEST,
      isLoading
    })
    // console.log(searchInputvalues+'searchInputvalues');
    let endPoint = 'user/' + userId + '/filters/doctors';
    let response = await postService(endPoint, searchInputvalues);
     console.log(JSON.stringify(response)+'searchDoctorList API rspnse');
    let respData = response.data;

    if (respData.error || !respData.success) {
      store.dispatch({
        type: DOCTORLIST_ERROR,
        message: respData.error
      })
    } else {
     
      store.dispatch({
        type: DOCTORLIST_RESPONSE,
        message: respData.message
      })
      return respData;
    }

  } catch (e) {
    store.dispatch({
      type: DOCTORLIST_ERROR,
      message: e + ' Occured! Please Try again'
    });
  }
}

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
      console.log('availability error')
      store.dispatch({
        type: BOOK_APPOINTMENT_ERROR,
        message: respData.error
      })
    } else {   
      console.log('availability response');
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

export async function viewUserReviews(type, id, isLoading = true) {
  try {
    store.dispatch({
      type: REVIEW_REQUEST,
      isLoading 
    })     
    let endPoint = 'user/reviews/'+type+ '/' +id
   console.log(endPoint);   
    let response = await getService(endPoint);
    console.log("review response");
    console.log(response); 
    let respData = response.data;   
    console.log(respData); 
 
    if(respData.error || !respData.success) {
      console.log('review error')
      store.dispatch({
        type: REVIEW_ERROR,
        message: respData.error
      })
    } else {   
      console.log('review response');
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
//user appointment status\

export const appointment = async(userId, filters, isLoading = true) => {
  try{    
    store.dispatch({
      type:BOOK_APPOINTMENT_REQUEST,
      isLoading 
    })       
    let endPoint = 'doctor/appointment/user' +'/'+userId + '?startDate=' + filters.startDate + '&endDate=' + filters.endDate;
    //let endPoint = 'appointments/user/' + userId + '?startDate=' + filters.startDate + '&endDate=' + filters.endDate;
    
     console.log(endPoint);

      let response = await getService(endPoint);
      console.log(response)
      
      let respData = response.data;
      console.log(respData);
      if(respData.error || respData.success == false) {         
        store.dispatch({
        type: BOOK_APPOINTMENT_ERROR,
        message: respData.error})
      } else {            
          store.dispatch({
          type: BOOK_APPOINTMENT_RESPONSE,           
          isLoading:false,
          success: true
        })         
      }
      return respData; 
  }catch (e){       
    console.log(e.message);  
      store.dispatch({
      type: BOOK_APPOINTMENT_ERROR,
      message: e
      })  
  }
}

export const getUserAppointments = async(userId, filters) => {
  try{    
      let endPoint = 'appointments/user/' + userId + '?startDate=' + filters.startDate + '&endDate=' + filters.endDate;
      
      let response = await getService(endPoint);
      let respData = response.data;
      console.log(respData);
      return respData; 
  }catch (e){       
    console.log(e.message);  
      store.dispatch({
      type: BOOK_APPOINTMENT_ERROR,
      message: e
      })  
  }
}


/*get doctor details*/
export const bindDoctorDetails = async (doctorId, fields, isLoading = true) => {
  try {
    store.dispatch({
      type: PROFILE_REQUEST,
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
        type: PROFILE_ERROR,
        message: respData.error,
      })
    } else {
      console.log('doctor profile response');
      store.dispatch({
        type: PROFILE_RESPONSE,
        isLoading: false,
        success: true
      })
    }
    return respData;
  } catch (e) {
    console.log(e.message);
    store.dispatch({
      type: PROFILE_ERROR,
      message: e,
    })
  }
}

/* Get Appointment details */

export async function appointmentDetails (doctorId, appointmentId, isLoading = true) {
  try {
    store.dispatch({
      type: APPOINTMENT_REQUEST,
      isLoading 
    })     
    let endPoint = 'doctor/' + doctorId + '/appointment/' + appointmentId
   console.log(endPoint);   
    let response = await getService(endPoint); 
    let respData = response.data;    
    if(respData.error || !respData.success) {
      console.log('availability error')
      store.dispatch({
        type: APPOINTMENT_ERROR,
        message: respData.error
      })
    } else {   
      console.log('availability response');
      store.dispatch({        
        type: APPOINTMENT_RESPONSE,
        isLoading:false,
        success: true,     
        message: respData.message
      })
      return respData;
    }
    return respData;
    
  } catch (e) {
    store.dispatch({
      type: APPOINTMENT_ERROR,
      message: e
      }); 
  }  
}





  
  
  
  
  
  
