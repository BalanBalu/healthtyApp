import {
    NOTIFICATION_REQUEST, NOTIFICATION_RESPONSE, NOTIFICATION_HAS_ERROR,
} from '../notification/notification.actions';
export const notificationState = {
    message: null,
    isLoading: false,
    isAuthenticated: false,
    details: null,
    success: false,
    notificationCount: null,
    
    
}
// State
export default (state = notificationState, action) => {
    switch (action.type) {
       
        case NOTIFICATION_REQUEST:

            return {
                ...state,
                isLoading: action.isLoading
            }
        case NOTIFICATION_HAS_ERROR:

            return {
                ...state,
                success: false,
                message: action.message,
                isLoading: false,
                isAuthenticated: false,
            }

        case NOTIFICATION_RESPONSE:

            return {
                ...state,
                success: true,
                isLoading: false,
                message: action.message,
                notification: action.details,
                notificationCount: action.notificationCount

            }

        default:
            return state;
    }
}



