
import {

    SET_PATIENT_FAVORITE_COUNTS_OF_HOSPITAL_ADMIN_IDS,
    SET_HOSPITAL_FAVORITE_COUNTS_OF_HOSPITAL_ADMIN_IDS,
} from './action'

export const hospitalBookAppointmentData = {
    message: null,
    isLoading: false,
    patientFavoriteListCountOfHospitalAdminIds: [],
    hospitalFavoriteListCountOfHospitalAdminIds: {},
}
// State
export default (state = hospitalBookAppointmentData, action) => {
    switch (action.type) {
        case SET_PATIENT_FAVORITE_COUNTS_OF_HOSPITAL_ADMIN_IDS:
            return {
                ...state,
                patientFavoriteListCountOfHospitalAdminIds: action.data
            }
        case SET_HOSPITAL_FAVORITE_COUNTS_OF_HOSPITAL_ADMIN_IDS:
            return {
                ...state,
                hospitalFavoriteListCountOfHospitalAdminIds: action.data
            }
        default:
            return state;

    }
}  