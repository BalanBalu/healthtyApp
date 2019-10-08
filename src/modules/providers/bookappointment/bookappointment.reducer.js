
import { 
  SET_BOOK_APP_SLOT_DATA, 
  SET_BOOK_APP_DOCTOR_DATA, 
  SET_SELECTED_DATE, 
  SET_SINGLE_DOCTOR_DATA, 
  SET_PATIENT_WISH_LIST_DOC_IDS,
  SET_FAVORITE_DOCTOR_COUNT_BY_IDS,
  SET_DOCTORS_RATING_BY_IDS,
  SET_FILTERED_DOCTOR_DATA,
  SET_PATIENT_LOCATION_DATA
 } from './bookappointment.action'

export const bookAppointmentData = {
    message: null,
    isLoading: false,
    selectedDate: null,
    doctorData: [],
    singleDoctorData : null,
    slotData: [],
    patientWishListsDoctorIds : [],
    favouriteListCountByDoctorIds : {},
    reviewsByDoctorIds : {}, 
    filteredDoctorData : [],
    patientSearchLocationName: null,
    locationCordinates: null,
    isSearchByCurrentLocation: true
  }
  // State
  export default (state = bookAppointmentData, action) => {
    switch (action.type) {
      case SET_BOOK_APP_SLOT_DATA:
        return {
          ...state,
          slotData: action.data
        }
      case SET_BOOK_APP_DOCTOR_DATA:
        return {
          ...state,
          doctorData: action.data
        }
      case SET_SELECTED_DATE:
        return {
          ...state,
          selectedDate: action.data
        }
      case SET_SINGLE_DOCTOR_DATA:
        return {
          ...state,
          singleDoctorData: action.data
        }
      case SET_PATIENT_WISH_LIST_DOC_IDS:
        return {
          ...state,
          patientWishListsDoctorIds: action.data
        }
      case SET_FAVORITE_DOCTOR_COUNT_BY_IDS:
        return {
          ...state,
          favouriteListCountByDoctorIds: action.data
        }  
      case SET_DOCTORS_RATING_BY_IDS:
        return {
          ...state,
          reviewsByDoctorIds: action.data
        }
      case SET_FILTERED_DOCTOR_DATA:
        return {
            ...state,
            filteredDoctorData: action.data
        }
      case SET_PATIENT_LOCATION_DATA: {
        return {
          ...state,
          locationCordinates: action.center,
          patientSearchLocationName: action.locationName,
          isSearchByCurrentLocation: action.isSearchByCurrentLocation
        }
      }    
      default:
        return state;
           
    }
}  