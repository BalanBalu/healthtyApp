
import { SET_BOOK_APP_SLOT_DATA, SET_BOOK_APP_DOCTOR_DATA, SET_SELECTED_DATE, SET_SINGLE_DOCTOR_DATA } from './bookappointment.action'

export const bookAppointmentData = {
    message: null,
    isLoading: false,
    selectedDate: null,
    doctorData: [],
    singleDoctorData : null,
    slotData: []
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
      default:
        return state;
           
    }
}  