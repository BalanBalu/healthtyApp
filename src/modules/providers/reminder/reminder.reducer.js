// App Imports
import { SET_REMINDER_DATA, } from './reminder.action'
// Initial State
export const commonInitialState = {
    reminderResponse: {
        success: false,
        message: null, 
        data: []
    }
}

// State
export default (state = commonInitialState, action) => {
  switch (action.type) {
    case SET_REMINDER_DATA:
      return {
        ...state,
        reminderResponse: action.data
     }
    default:
      return state
  }
}
