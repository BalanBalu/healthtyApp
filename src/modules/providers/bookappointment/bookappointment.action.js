export const BOOK_APPOINTMENT_REQUEST = 'BOOK_APPOINTMENT/BOOK_APPOINTMENT_REQUEST'
export const BOOK_APPOINTMENT_RESPONSE = 'BOOK_APPOINTMENT/BOOK_APPOINTMENT_RESPONSE'
export const BOOK_APPOINTMENT_ERROR = 'BOOK_APPOINTMENT/BOOK_APPOINTMENT_ERROR'
import { store } from '../../../setup/store'
import { getService } from '../../../setup/services/httpservices';

/*get doctor availability for patient view doctor profile */
export async function viewdoctorProfile (doctorIds,slotOfWeek, isLoading = true) {
  try {
    store.dispatch({
      type: BOOK_APPOINTMENT_REQUEST,
      isLoading 
    })     
    let endPoint = 'doctors/' + doctorIds + '/availabilitySlots?'+ 'startDate=' + slotOfWeek.startDate + '&endDate=' + slotOfWeek.endDate
   console.log(endPoint);   
    let response = await getService(endPoint); 
    let respData = response.data;    
    if(respData.error || !respData.success) {
      console.log('error')
      store.dispatch({
        type: PROFILE_ERROR,
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

  
  
  
  
  
  
