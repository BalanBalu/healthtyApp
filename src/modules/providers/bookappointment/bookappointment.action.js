import { postService, getService, putService } from '../../../setup/services/httpservices';



/* Book the Doctor Appointment module  */
export async function bookAppointment(bookSlotDetails, isLoading = true) {
  try {
    let endPoint = 'doctor/appointment';
    let response = await postService(endPoint, bookSlotDetails);
    // console.log(JSON.stringify(response) + 'bookAppointment API rspnse');
    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

/* Search Services and category Module  */
export async function searchDoctorList(userId, searchInputvalues, isLoading = true) {
  try {
    let endPoint = 'user/' + userId + '/filters/doctors';
    let response = await postService(endPoint, searchInputvalues);
    console.log(JSON.stringify(response) + 'searchDoctorList API rspnse');
    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}
/* user gives Rate and Reviews */

export async function addReview(userId,insertUserReviews, isLoading = true) {
  try {
    let endPoint = '/user/'+ userId + '/review';
    console.log(endPoint+'endPoint');

    let response = await postService(endPoint, insertUserReviews);
    let respData = response.data;
    console.log(JSON.stringify(respData) + 'respData');

    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}
/*get doctor availability for patient view doctor profile */

export async function viewdoctorProfile(doctorIds, isLoading = true) {
  try {
    let endPoint = 'doctors/' + doctorIds + '/availabilitySlots'
    let response = await getService(endPoint);
    //console.log('get Avalblty API Response'+JSON.stringify(response))
    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

/*get userReviews*/

export async function viewUserReviews(type,id,isLoading = true) {
  try {
    let endPoint = 'user/reviews/'+ type+ '/'+id
    let response = await getService(endPoint);
    let respData = response.data;
    return respData;

  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}
/* get Patient Reviews count */
export async function viewUserReviewCount(doctorId, isLoading = true) {
  try {
    let endPoint = 'user/reviewsCount/' + doctorId
    let response = await getService(endPoint);
    let respData = response.data;
    return respData;

  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

//user appointment status\

export const appointment = async (userId, filters, isLoading = true) => {
  try {
    let endPoint = 'doctor/appointment/user' + '/' + userId + '?startDate=' + filters.startDate + '&endDate=' + filters.endDate;
    let response = await getService(endPoint);
    let respData = response.data;
    return respData;
  } catch (e) {
    console.log(e.message);
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

export const getUserAppointments = async (userId, filters) => {
  try {
    let endPoint = 'appointments/user/' + userId + '?startDate=' + filters.startDate + '&endDate=' + filters.endDate;
    let response = await getService(endPoint);
    let respData = response.data;
    return respData;
  } catch (e) {
    console.log(e.message);
    return {
      message: 'exception' + e,
      success: false
    }
  }
}


/*get doctor details*/
export const bindDoctorDetails = async (doctorId, fields, isLoading = true) => {
  try {
    let endPoint = 'doctor/' + doctorId + '?fields=' + fields;
    console.log(endPoint + 'doctor endpoint');
    let response = await getService(endPoint);
    console.log(JSON.stringify(response) + 'response');
    let respData = response.data;
    return respData;
  } catch (e) {
    console.log(e.message);
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

/*get multiple doctor details*/
export const getMultipleDoctorDetails = async (doctorIds, fields, isLoading = true) => {
  try {
    let endPoint = 'doctors/' + doctorIds + '?fields=' + fields;
    let response = await getService(endPoint);
    // console.log(JSON.stringify(response) + 'response');
    let respData = response.data;
    return respData;
  } catch (e) {
    console.log(e.message);
    return {
      message: 'exception' + e,
      success: false
    }
  }
}


/* Get Appointment details */

export async function appointmentDetails(doctorId, appointmentId, isLoading = true) {
  try {
    let endPoint = 'doctor/' + doctorId + '/appointment/' + appointmentId
    let response = await getService(endPoint);
    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

/* Update Appoiontment Status */

export async function appointmentStatusUpdate(doctorId, appointmentId, requestData, isLoading = true) {
  try {
    let endPoint = 'doctor/' + doctorId + '/appointment/' + appointmentId
    let response = await putService(endPoint, requestData);
    let respData = response.data;
    console.log('respData'+JSON.stringify(respData))
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}











