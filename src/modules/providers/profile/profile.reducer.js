import {  PROFILE_REQUEST, PROFILE_RESPONSE, PROFILE_ERROR } from './profile.action';

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
  
  
  
  
  