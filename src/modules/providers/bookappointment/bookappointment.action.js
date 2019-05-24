export const BOOK_APPOINTMENT_REQUEST = 'BOOK_APPOINTMENT/BOOK_APPOINTMENT_REQUEST'
export const BOOK_APPOINTMENT_RESPONSE = 'BOOK_APPOINTMENT/BOOK_APPOINTMENT_RESPONSE'
export const BOOK_APPOINTMENT_ERROR = 'BOOK_APPOINTMENT/BOOK_APPOINTMENT_ERROR'
export const DOCTORLIST_REQUEST = 'BOOK_APPOINTMENT/DOCTORLIST_REQUEST'
export const DOCTORLIST_ERROR = 'BOOK_APPOINTMENT/DOCTORLIST_RESPONSE'
export const DOCTORLIST_RESPONSE = 'BOOK_APPOINTMENT/DOCTORLIST_RESPONSE'
import { postService, getService } from '../../../setup/services/httpservices';
import { store } from '../../../setup/store';


/* Search Services and category Module  */
export async function searchDoctorList(userId, searchInputvalues, isLoading = true) {
  try {

    store.dispatch({
      type: DOCTORLIST_REQUEST,
      isLoading
    })
    // console.log(searchInputvalues+'searchInputvalues');
    let endPoint = 'user/' + userId + '/filters/doctors'
    let response = await postService(endPoint, searchInputvalues);
    // console.log(JSON.stringify(response)+'searchDoctorList API rspnse');
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

/*get doctor availability for patient view doctor profile */
export async function viewdoctorProfile(doctorIds, slotOfWeek, isLoading = true) {
  try {
    store.dispatch({
      type: BOOK_APPOINTMENT_REQUEST,
      isLoading
    })
    let endPoint = 'doctors/' + doctorIds + '/availabilitySlots?' + 'startDate=' + slotOfWeek.startDate + '&endDate=' + slotOfWeek.endDate
    console.log(endPoint);
    let response = await getService(endPoint);
    let respData = response.data;
    if (respData.error || !respData.success) {
      console.log('error')
      store.dispatch({
        type: PROFILE_ERROR,
        message: respData.error
      })
    } else {
      console.log('response');
      store.dispatch({
        type: BOOK_APPOINTMENT_RESPONSE,
        isLoading: false,
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







