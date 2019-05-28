import {  BOOK_APPOINTMENT_REQUEST, BOOK_APPOINTMENT_RESPONSE, BOOK_APPOINTMENT_ERROR } from './bookappointment.action';

// Initial State
export const initialState = {
    message: null,
    isLoading: false,
    details: null,
    success: false
  }

  // State
export default (state = initialState, action) => {
    switch (action.type) {
      
      case BOOK_APPOINTMENT_REQUEST:
        return {
          ...state,
          message: null,
          isLoading: action.isLoading,
  
        }
  
      case BOOK_APPOINTMENT_RESPONSE:
        return {
          ...state,
          message: action.message,
          isLoading: false,
          success: true
        }
  
      case BOOK_APPOINTMENT_ERROR:
        return {
          ...state,
          message: action.message,
          isLoading: false
        }
  
  
      default:
        return state;
    }
  }
  
  
  
  
  