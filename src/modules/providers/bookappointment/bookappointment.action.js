import { postService, getService, putService} from '../../../setup/services/httpservices';

export const SET_BOOK_APP_SLOT_DATA = 'BOOK_APP/SLOTDATA';
export const SET_BOOK_APP_DOCTOR_DATA = 'BOOK_APP/DOCTORDATA';
export const SET_SELECTED_DATE = 'BOOK_APP/SELECTED_DATE';

/* Book the Doctor Appointment module  */
export async function bookAppointment(bookSlotDetails, isLoading = true) {
  try {
    let endPoint = 'appointment';
    let response = await postService(endPoint, bookSlotDetails);

    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

export async function validateBooking(reqDataValidate) {
  try {
    console.log(reqDataValidate);
    let endPoint = 'appointment/validate';
    let response = await postService(endPoint, reqDataValidate);
    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

export async function createPaymentRazor(paymentData) {
  try {
    let endPoint = 'razor/payment';
    let response = await postService(endPoint, paymentData);
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

export async function addReview(userId, insertUserReviews, isLoading = true) {
  try {
    let endPoint = '/user/' + userId + '/review';
    let response = await postService(endPoint, insertUserReviews);
    let respData = response.data;

    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}
/*get doctor availability for patient view doctor profile */

export async function fetchAvailabilitySlots(doctorIds, dateFilter, patientGender) {
  try {
    let endPoint = 'doctors/' + doctorIds + '/availabilitySlots?startDate=' + dateFilter.startDate + '&endDate='+ dateFilter.endDate;
    if(patientGender)   endPoint + '&gender='+ patientGender;
    console.log(endPoint);
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

/*get userReviews*/

export async function viewUserReviews(type, id, limit) {
  try {
    let endPoint = 'user/reviews/' + type + '/' + id + limit;
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

export async function getDoctorsReviewsCount(doctorIds) {
  try {
    let endPoint = 'user/reviewsCount/' + doctorIds;
    let response = await getService(endPoint);
    console.log('response' + response);
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

/*get multiple doctor details*/
export const getMultipleDoctorDetails = async (doctorIds, fields, isLoading = true) => {
  try {
    let endPoint = 'doctors/' + doctorIds + '?fields=' + fields;
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


/* Get Appointment details */

export async function appointmentDetails( appointmentId, isLoading = true) {
  try {
    let endPoint = 'appointment/' + appointmentId
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
    let endPoint =  'appointment/' + appointmentId
    let response = await putService(endPoint, requestData);
    let respData = response.data;

    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}



/* Insert Doctors  Favourite List */

export async function insertDoctorsWishList(userId, doctorId, requestData) {
  try {

    let endPoint = 'user/wishList/' + userId + '/' + doctorId
    let response = await putService(endPoint, requestData);
    let respData = response.data;
    // console.log('respData'+JSON.stringify(respData))
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}
/* Get Patient Total Favourite Doctors List  */
export const getPatientWishList = async (userId) => {
  try {
    let endPoint = 'user/wishList/' + userId;
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
// //get doctordetails using appointment Id notification page
// export const getAppointmentDetails = async (appointmentId) => {
//   try {
//     let endPoint = '/appointment/' + appointmentId;
//     console.log(endPoint)
//     let response = await getService(endPoint);
//     let respData = response.data;
//     return respData;
//   } catch (e) {
//     console.log(e.message);
//     return {
//       message: 'exception' + e,
//       success: false
//     }
//   }
// }


