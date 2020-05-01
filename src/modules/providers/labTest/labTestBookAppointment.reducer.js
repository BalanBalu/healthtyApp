
import {
    SET_PATIENT_WISH_LIST_LAB_IDS,
    SET_WISHLIST_LAB_COUNT_BY_IDS,
} from './labTestBookAppointment.action'

export const commonInitialState = {
    message: null,
    isLoading: false,
    patientWishListLabIds: [],
    wishListCountByLabIds: {},
}

export default (state = commonInitialState, action) => {
    switch (action.type) {
        case SET_PATIENT_WISH_LIST_LAB_IDS:
            return {
                ...state,
                patientWishListLabIds: action.data
            }
        case SET_WISHLIST_LAB_COUNT_BY_IDS:
            return {
                ...state,
                wishListCountByLabIds: action.data
            }
        default: return state;
    }
}  