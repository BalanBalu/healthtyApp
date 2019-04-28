// App Imports
import { isEmpty } from '../../../setup/helpers';
import { SET_USER, LOGIN_REQUEST, LOGIN_RESPONSE, LOGOUT, LOGIN_HAS_ERROR, AUTH_REQUEST, AUTH_HAS_ERROR, AUTH_RESPONSE  } from './auth.actions';

// Initial State
export const userInitialState = {
  message: null,
  isLoading: false,
  isAuthenticated: false,
  details: null,
  success:false,
  userId:null
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
        isAuthenticated:false,
      }
   
    case AUTH_RESPONSE:
    return {
      ...state,
      success: true,        
      isLoading: action.isLoading,
      message: action.message,
      userId:action.userId
    }

    case LOGIN_REQUEST:
      return {
        ...state,
        message: null,
        isLoading: action.isLoading,
        isAuthenticated:false

      }

    case LOGIN_RESPONSE:
      return {
        ...state,
        message: action.message,
        isLoading: false,
        success: true
      }
    case LOGIN_HAS_ERROR:
      return {
        ...state,
        message: action.error,
        isLoading: false
      }

    case LOGOUT:
      return userInitialState;

    default:
      return state;
  }
}
