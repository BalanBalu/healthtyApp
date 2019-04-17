// App Imports
import { isEmpty } from '../../../setup/helpers';
import { SET_USER, LOGIN_REQUEST, LOGIN_RESPONSE, LOGOUT, LOGIN_HAS_ERROR, OTP_CODE_GENERATED, NEW_PASSWORD, AUTH_REQUEST, AUTH_HAS_ERROR, AUTH_RESPONSE } from './auth.actions';

// Initial State
export const userInitialState = {
  message: null,
  isLoading: false,
  isAuthenticated: false,
  details: null
}

// State
export default (state = userInitialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        isAuthenticated: true,
        details: action.details
      }

    case LOGIN_REQUEST:
      return {
        ...state,
        message: null,
        isLoading: action.isLoading
      }

    case LOGIN_RESPONSE:
      return {
        ...state,
        message: action.message,
        isLoading: false
      }
    case LOGIN_HAS_ERROR:
      return {
        ...state,
        message: action.error,
        isLoading: false
      }

      case AUTH_HAS_ERROR:  
      return {
        ...state,
        message: action.error,
        isLoading: false
    }

    case AUTH_REQUEST:
      return {
        ...state,        
        isLoading: action.isLoading
      }
    case OTP_CODE_GENERATED:
      return {
        ...state,
        isLoading:false,
        isOTPGenerated: true,
        userId:action.userId,
        otpCode: action.otpCode 
      }  
    case NEW_PASSWORD:
      return {
        ...state,
        isLoading:false, 
        isAuthenticated: true,   
        isPasswordChanged: action.newPassword,
        message: action.message
      }

    case AUTH_RESPONSE:
      return {
        ...state,        
        isLoading: action.isLoading,
        message: action.message,
        isAuthenticated: true
      }

      case LOGOUT:
      return userInitialState;

    default:
      return state;
     }
}


   
  