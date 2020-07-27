import { postService, getService, putService } from '../../../setup/services/httpservices';

export const SET_BOOK_APP_SLOT_DATA = 'BOOK_APP/SLOTDATA';
export const SET_BOOK_APP_DOCTOR_DATA = 'BOOK_APP/DOCTORDATA';
export const SET_SELECTED_DATE = 'BOOK_APP/SELECTED_DATE';
export const SET_SINGLE_DOCTOR_DATA = 'BOOK_APP/SINGLE_DOCTOR_DATA';
export const SET_PATIENT_WISH_LIST_DOC_IDS = 'BOOK/PATIENT_WISH_LIST_DOC_IDS';
export const SET_FAVORITE_DOCTOR_COUNT_BY_IDS = 'BOOK/FAVORITE_DOCTOR_COUNT_BY_IDS';
export const SET_DOCTORS_RATING_BY_IDS = 'BOOK/DOCTORS_RATING_BY_IDS';
export const SET_FILTERED_DOCTOR_DATA = 'BOOK/FILTERED_DOCTOR_DATA';
export const SET_PATIENT_LOCATION_DATA = 'BOOK/SET_PATIENT_LOCATION_DATA';
import { store } from '../../../setup/store';


/*  get All Sponsors data details from Sponsors collection*/
export const getAllDoctorsActiveSponsorDetails = async (doctorIds) => {
  try {
    let endPoint = 'sponsor/withoutAuth/' + doctorIds + '?active_sponsor=true';
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


/* Update Sponsor Viewers Counts */
export async function updateSponsorViewCount(userId, sponsorIds) {
  try {
    let endPoint = 'updateSponsorViewers/' + userId
    let response = await putService(endPoint, sponsorIds);
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
    console.log(e);
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
    console.log("searchInputvalues");
    console.log(searchInputvalues);
    let respData = response.data;
    console.log(respData);
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
    let endPoint = 'doctors/' + 'availabilitySlots?startDate=' + dateFilter.startDate + '&endDate=' + dateFilter.endDate;
    if (patientGender) endPoint + '&gender=' + patientGender;

    let response = await postService(endPoint, doctorIds);
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

    let resultReview = response.data;
    if (resultReview.success) {
      const { bookappointment: { reviewsByDoctorIds } } = store.getState();
      for (i = 0; i < resultReview.data.length; i++) {
        reviewsByDoctorIds[resultReview.data[i]._id] = resultReview.data[i];
      }
      store.dispatch({
        type: SET_DOCTORS_RATING_BY_IDS,
        data: reviewsByDoctorIds
      })
    }

    return resultReview;


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
    if (filters.on_going_appointment) {
      endPoint += '&on_going_appointment=1'
    }

    if (filters.limit) {
      endPoint = endPoint + '&skip=' + filters.skip + '&limit=' + filters.limit + '&sort=' + filters.sort;
    }
    if(filters.reviewInfo){
      endPoint = endPoint + '&reviewInfo=1'
    }

    if(filters.prepareAppointment) {
      endPoint = endPoint + '&prepareAppointment=1'
    }
    console.log(endPoint);
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

/*get multiple doctor details*/
export const getMultipleDoctorDetailsV2 = async (doctorIds, fields, isLoading = true) => {
  try {
    let endPoint = '/doctors/multiple/details?fields=' + fields;
    let response = await postService(endPoint, doctorIds);
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

export async function appointmentDetails(appointmentId, isLoading = true) {
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
    let endPoint = 'appointment/' + appointmentId
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

/* Get Patient Total Favourite Doctors List  */
export const getPatientWishList = async (userId) => {
  try {
    let endPoint = 'user/wishList/' + userId;
    let response = await getService(endPoint);
    let result = response.data;
    if (result.success) {
      let wishListDoctorsIds = [];
      result.data.forEach(element => {
        wishListDoctorsIds.push(element.doctorInfo.doctor_id)
      })
      console.log(wishListDoctorsIds);
      store.dispatch({
        type: SET_PATIENT_WISH_LIST_DOC_IDS,
        data: wishListDoctorsIds
      })
    }
    return result;
  } catch (e) {
    console.log(e.message);
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

export const getDoctorFaviouteList = async (doctorId) => {
  try {
    let endPoint = 'doctor/wishList/' + doctorId;

    let response = await getService(endPoint);
    let resultFavList = response.data;
    favouriteListCountByDoctorIds = {};
    if (resultFavList.success) {

      for (i = 0; i < resultFavList.data.length; i++) {
        doctorId = resultFavList.data[i].wishList.doctor_id;

        if (favouriteListCountByDoctorIds[doctorId]) {
          favouriteListCountByDoctorIds[doctorId] = favouriteListCountByDoctorIds[doctorId] + 1
        } else {
          favouriteListCountByDoctorIds[doctorId] = 1;
        }
      }
      console.log(favouriteListCountByDoctorIds);
      store.dispatch({
        type: SET_FAVORITE_DOCTOR_COUNT_BY_IDS,
        data: favouriteListCountByDoctorIds
      })
    }

    return resultFavList;
  } catch (e) {
    console.log(e.message);
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

export const addToWishListDoctor = async (doctorId, userId) => {
  try {
    const { bookappointment: { patientWishListsDoctorIds, favouriteListCountByDoctorIds } } = store.getState();
    let result = null;
    console.log(patientWishListsDoctorIds);
    let requestData = {
      active: !patientWishListsDoctorIds.includes(doctorId)
    };

    if (userId) {
      result = await insertDoctorsWishList(userId, doctorId, requestData);
      //   console.log('result'+JSON.stringify(result));
      if (result.success) {
        if (requestData.active) {
          if (favouriteListCountByDoctorIds[doctorId]) {
            favouriteListCountByDoctorIds[doctorId] = favouriteListCountByDoctorIds[doctorId] + 1;
          } else {
            favouriteListCountByDoctorIds[doctorId] = 1
          }
          patientWishListsDoctorIds.push(doctorId)
        } else {
          if (favouriteListCountByDoctorIds[doctorId]) {
            favouriteListCountByDoctorIds[doctorId] = favouriteListCountByDoctorIds[doctorId] - 1;
          } else {
            favouriteListCountByDoctorIds[doctorId] = 0;
          }
          let indexOfDoctorIdOnPatientWishList = patientWishListsDoctorIds.indexOf(doctorId);
          patientWishListsDoctorIds.splice(indexOfDoctorIdOnPatientWishList, 1);
        }
        store.dispatch({
          type: SET_PATIENT_WISH_LIST_DOC_IDS,
          data: patientWishListsDoctorIds
        })
        store.dispatch({
          type: SET_FAVORITE_DOCTOR_COUNT_BY_IDS,
          data: favouriteListCountByDoctorIds
        })
      }
      return result;
    }
  }
  catch (e) {
    console.log(e);
  }
}

export async function insertDoctorsWishList(userId, doctorId, requestData) {
  try {

    let endPoint = 'user/wishList/' + userId + '/' + doctorId
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

export async function getLocations(reqQueryFromAndToPinCodes) {
  try {

    let endPoint = 'hospital/locations'
    if (reqQueryFromAndToPinCodes) {
      endPoint = endPoint + '?fromPinCode=' + reqQueryFromAndToPinCodes.fromPinCode + '&toPinCode=' + reqQueryFromAndToPinCodes.toPinCode
    }
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



export async function getPharmacyLocations(reqQueryFromAndToPinCodes) {
  try {

    let endPoint = 'pharmacies/locations'
    if (reqQueryFromAndToPinCodes) {
      endPoint = endPoint + '?fromPinCode=' + reqQueryFromAndToPinCodes.fromPinCode + '&toPinCode=' + reqQueryFromAndToPinCodes.toPinCode
    }
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



export const getPaymentInfomation = async (paymentId) => {
  try {

    let endPoint = '/payment/' + paymentId;

    let response = await getService(endPoint);

    let respData = response.data;

    if (respData.error || respData.success == false) {
      return {
        success: respData.success,
        message: respData.error,
      }
    } else {

      return respData;

    }

  } catch (e) {

    return {
      success: false,
      message: 'Exception Occured' + e
    };
  }
}
export async function prepareAppointmentUpdate(appointmentId, requestData) {
  try {
    let endPoint = 'prepare/appointment/' + appointmentId
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



export async function fetchEmrData(appointmentId) {
  try {

    let endPoint = '/appointments/electrical_medical_records/' + appointmentId
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
export const getappointmentDetails = async (appointmentId, prepareAppointment) => {
  try {
    let endPoint = 'appointment/' + appointmentId  
    if(prepareAppointment)
    {
      endPoint = endPoint +  '?prepareAppointment=1'
    }
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