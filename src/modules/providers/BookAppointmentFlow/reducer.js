
import {
    SET_BOOK_APP_SLOT_DATA,
    SET_BOOK_APP_DOCTOR_DATA,
    SET_SELECTED_DATE,
    SET_SINGLE_DOCTOR_ITEM_DATA,
    SET_PATIENT_FAVORITE_COUNTS_OF_DOCTOR_IDS,
    SET_DOC_FAVORITE_COUNTS_OF_DOCTOR_IDS,
    SET_DOC_REVIEW_COUNTS_OF_DOCTOR_IDS,
    SET_FILTERED_DOCTOR_DATA,
    SET_PATIENT_LOCATION_DATA
} from './action'

export const bookAppointmentData = {
    message: null,
    isLoading: false,
    selectedDate: null,
    doctorData: [],
    singleDoctorItemData: null,
    slotData: [],
    patientFavoriteListCountOfDoctorIds: [],
    docFavoriteListCountOfDoctorIDs: {},
    docReviewListCountOfDoctorIDs: {},
    filteredDoctorData: [],
    patientSearchLocationName: null,
    locationCordinates: null,
    isSearchByCurrentLocation: true,
    locationUpdatedCount: 0
}
// State
export default (state = bookAppointmentData, action) => {
    switch (action.type) {
        case SET_BOOK_APP_SLOT_DATA:
            return {
                ...state,
                slotData: action.data
            }
        case SET_BOOK_APP_DOCTOR_DATA:
            return {
                ...state,
                doctorData: action.data
            }
        case SET_SELECTED_DATE:
            return {
                ...state,
                selectedDate: action.data
            }
        case SET_SINGLE_DOCTOR_ITEM_DATA:
            return {
                ...state,
                singleDoctorItemData: action.data
            }
        case SET_PATIENT_FAVORITE_COUNTS_OF_DOCTOR_IDS:
            return {
                ...state,
                patientFavoriteListCountOfDoctorIds: action.data
            }
        case SET_DOC_FAVORITE_COUNTS_OF_DOCTOR_IDS:
            return {
                ...state,
                docFavoriteListCountOfDoctorIDs: action.data
            }
        case SET_DOC_REVIEW_COUNTS_OF_DOCTOR_IDS:
            return {
                ...state,
                docReviewListCountOfDoctorIDs: action.data
            }
        case SET_FILTERED_DOCTOR_DATA:
            return {
                ...state,
                filteredDoctorData: action.data
            }
        case SET_PATIENT_LOCATION_DATA: {
            locationUpdatedCount = bookAppointmentData.locationUpdatedCount + 1;
            bookAppointmentData.locationUpdatedCount = locationUpdatedCount;
            return {
                ...state,
                locationCordinates: action.center,
                patientSearchLocationName: action.locationName,
                isSearchByCurrentLocation: action.isSearchByCurrentLocation,
                locationUpdatedCount: locationUpdatedCount
            }
        }
        default:
            return state;

    }
}  