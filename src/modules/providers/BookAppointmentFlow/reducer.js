
import {
    SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
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
    doctorInfoListAndSlotsData: [],
    singleDoctorItemData: null,
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
        case SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA:
            return {
                ...state,
                doctorInfoListAndSlotsData: action.data
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