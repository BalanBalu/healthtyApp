
import {
    SET_PATIENT_WISH_LIST_LAB_IDS, SET_WISHLIST_LAB_COUNT_BY_IDS, SET_REVIEWS_COUNT_BY_LAB_IDS, SET_SINGLE_LAB_ITEM_DATA, SET_LAB_LIST_ITEM_DATA, SET_LAB_LIST_ITEM_PREVIOUS_DATA
} from './labTestBookAppointment.action'

export const commonInitialState = {
    message: null,
    isLoading: false,
    patientWishListLabIds: [],
    wishListCountByLabIds: {},
    reviewCountsByLabIds: {},
    singleLabItemData: {},
    labListItemData: [],
    labPreviousData:[],
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
        case SET_REVIEWS_COUNT_BY_LAB_IDS:
            return {
                ...state,
                reviewCountsByLabIds: action.data
            }
        case SET_SINGLE_LAB_ITEM_DATA:
            return {
                ...state,
                singleLabItemData: action.data
            }
        case SET_LAB_LIST_ITEM_PREVIOUS_DATA:
            return {
                ...state,
                labPreviousData: action.data
            }
        case SET_LAB_LIST_ITEM_DATA:
            return {
                ...state,
                labListItemData: action.data
            }
        default: return state;
    }
}  