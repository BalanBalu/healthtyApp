import {  REQUEST, RESPONSE, ERROR } from './bookappointment.action';

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
      
      case REQUEST:
        return {
          ...state,
          message: null,
          isLoading: action.isLoading,
  
        }
  
      case RESPONSE:
        return {
          ...state,
          message: action.message,
          isLoading: false,
          success: true
        }
  
      case ERROR:
        return {
          ...state,
          message: action.message,
          isLoading: false
        }
  
  
      default:
        return state;
    }
  }
  
  
  
  
  