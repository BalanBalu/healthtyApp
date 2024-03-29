// App Imports
import { store} from '../../../setup/store';
import {
  SET_USER, LOGIN_REQUEST, LOGIN_RESPONSE, LOGOUT, LOGIN_HAS_ERROR, AUTH_REQUEST, AUTH_HAS_ERROR, AUTH_RESPONSE, OTP_CODE_GENERATED, NEW_PASSWORD,
  REDIRECT_NOTICE, RESET_REDIRECT_NOTICE,APP_LOADED
} from './auth.actions';

// Initial State
export const userInitialState = {
  message: null,
  isLoading: false,
  isAuthenticated: false,
  details: null,
  success: false,
  userId: null,
  isPasswordChanged: false,
  redirectNotice: {},
  needToRedirect: false,
  isOTPGenerated: false,
  appLoaded: false
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
    case AUTH_REQUEST:
      return {
        ...state,
        isLoading: action.isLoading
      }
    case AUTH_HAS_ERROR:
      return {
        ...state,
        success: false,
        message: action.message,
        isLoading: false,
        isAuthenticated: false,
      }

    case AUTH_RESPONSE:
      return {
        ...state,
        success: true,
        isLoading: false,
        message: action.message,
        userId: action.userId || null
      }

    case LOGIN_REQUEST:
      return {
        ...state,
        message: null,
        isLoading: action.isLoading,
        isAuthenticated: false

      }
    case LOGIN_HAS_ERROR:
      return {
        ...state,
        message: action.message,
        isLoading: false
      }

    case LOGIN_RESPONSE:
      return {
        ...state,
        message: action.message,
        isLoading: false,
        success: true
      }
    case OTP_CODE_GENERATED:
      return {
        ...state,
        isLoading: false,
        isOTPGenerated: true,
        userId: action.userId,
      }
    case NEW_PASSWORD:
      return {
        ...state,
        isLoading: false,
        isPasswordChanged: action.isPasswordChanged,
      }
    case REDIRECT_NOTICE:
      return {
        ...state,
        redirectNotice: action.redirectNotice,
        needToRedirect: true
      }
    case RESET_REDIRECT_NOTICE:
      return {
        ...state,
        redirectNotice: {},
        needToRedirect: false
      }
    case LOGOUT:
      return userInitialState;
    case APP_LOADED: 
        return {
          ...state,
          appLoaded: true
        }    
      
  

    default:
      return state;
  }
}



