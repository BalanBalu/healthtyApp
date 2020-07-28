import { FORUM_RESPONSE, FORUM_ERROR } from './forum.action';

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
      
      case FORUM_RESPONSE:
        return {
          ...state,
          message: action.message,
          isLoading: false,
          success: true
        }
  
      case FORUM_ERROR:
        return {
          ...state,
          message: action.message,
          isLoading: false
        }
  
  
      default:
        return state;
    }
  }