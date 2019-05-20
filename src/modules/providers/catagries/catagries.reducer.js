import {  CATAGRIES_REQUEST, CATAGRIES_RESPONSE, CATAGRIES_ERROR } from './catagries.actions';

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
      
      case CATAGRIES_REQUEST:
        return {
          ...state,
          message: null,
          isLoading: action.isLoading,
  
        }
  
      case CATAGRIES_RESPONSE:
        return {
          ...state,
          message: action.message,
          isLoading: false,
          success: true
        }
  
      case CATAGRIES_ERROR:
        return {
          ...state,
          message: action.message,
          isLoading: false
        }
  
  
      default:
        return state;
    }
  }
  
  
  