// App Imports
import { isEmpty } from '../../../setup/helpers';
import { SET_USER, LOGIN_REQUEST, LOGIN_RESPONSE, LOGOUT, LOGIN_HAS_ERROR } from './auth.actions';

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

    case LOGOUT:
      return userInitialState;

    default:
      return state;
  }
}
