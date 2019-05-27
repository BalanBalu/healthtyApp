import {
  BOOK_APPOINTMENT_REQUEST, BOOK_APPOINTMENT_RESPONSE, BOOK_APPOINTMENT_ERROR,
  APPOINTMENT_REQUEST, APPOINTMENT_RESPONSE, APPOINTMENT_ERROR ,  PROFILE_REQUEST,
  PROFILE_RESPONSE, PROFILE_ERROR
} from './bookappointment.action';

// Initial State
export const initialState = {
  message: null,
  isLoading: false,
  details: null,
  success: false,
  condition: false

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
    case APPOINTMENT_REQUEST:
      return {
        ...state,
        message: null,
        isLoading: action.isLoading,
        condition: false
      }

    case APPOINTMENT_RESPONSE:
      return {
        ...state,
        message: action.message,
        isLoading: false,
        success: true,
        condition: action.condition
      }

    case APPOINTMENT_ERROR:
      return {
        ...state,
        message: action.message,
        isLoading: false
      }
      case PROFILE_REQUEST:
        return {
          ...state,
          message: null,
          isLoading: action.isLoading,
  
        }
  
      case PROFILE_RESPONSE:
        return {
          ...state,
          message: action.message,
          isLoading: false,
          success: true
        }
  
      case PROFILE_ERROR:
        return {
          ...state,
          message: action.message,
          isLoading: false
        }
  

    default:
      return state;
  }
}




