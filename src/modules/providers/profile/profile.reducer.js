import { PROFILE_REQUEST, PROFILE_RESPONSE, PROFILE_ERROR, REVIEWS_REQUEST, REVIEWS_RESPONSE, REVIEWS_ERROR, AVAILABLE_CREDIT_POINTS, SET_REFER_CODE, SET_USER_DATA_FOR_PREPARATION, SET_CORPORATE_DATA } from './profile.action';

// Initial State
export const initialState = {
  message: null,
  isLoading: false,
  details: null,
  success: false,
  availableCreditPoints: 0,
  primary_care_physician_info: {
    hospital_name: null,  // Corresponding State Variable 
    physician_name: null,
    contact_number: null,
  },
  general_health_info: null,
  is_user_meet_doctor_before: true,
  reason_for_visit: {
    description: null,
    any_other_concerns: null
  },
  general_health_info: null,
  past_health_condition: [],
  first_name: null,
  dob: null,
  gender: null,
  marital_status: null,
  blood_group: null,
  secondary_mobile: "",
  having_any_allergies: [{
    allergy_name: null,
    allergy_reaction: null
  }],
  taking_medications: [{
    medicine_name: null,
    medicine_dosage: null
  }],
  family_conditions: [{
    person_name: null,
    family_person_who: null
  }],
  allergy_info: [],
  medical_procedure: null,
  social_history: {
    sexually_active: false,
    drink_alcohol: false,
    smoke: false,
    use_recreational_drugs: false,
    use_caffeinated_drink: undefined,
    physically_or_verbally_hurt_you: false,
    exercise: false,
    corporateData: []
  }
}

// State
export default (state = initialState, action) => {
  switch (action.type) {

    case PROFILE_REQUEST:
      return {
        ...state,
        message: null,
        isLoading: action.isLoading,

      }

    case PROFILE_RESPONSE:
      return {
        ...state,
        message: action.message,
        isLoading: false,
        success: true
      }

    case PROFILE_ERROR:
      return {
        ...state,
        message: action.message,
        isLoading: false
      }

    case REVIEWS_REQUEST:
      return {
        ...state,
        message: null,
        isLoading: action.isLoading,

      }

    case REVIEWS_RESPONSE:
      return {
        ...state,
        message: action.message,
        isLoading: false,
        success: true
      }

    case REVIEWS_ERROR:
      return {
        ...state,
        message: action.message,
        isLoading: false
      }
    case AVAILABLE_CREDIT_POINTS:
      return {
        ...state,
        availableCreditPoints: action.credit_points
      }
    case SET_REFER_CODE:
      return {
        ...state,
        refer_code: action.data
      }
    case SET_USER_DATA_FOR_PREPARATION:
      return {
        ...state,
        primary_care_physician_info: action.data.primary_care_physician_info,  // Corresponding Right side  API Variable left sside State Variable 
        general_health_info: action.data.general_health_info,
        is_user_meet_doctor_before: action.data.is_user_meet_doctor_before || initialState.is_user_meet_doctor_before,
        reason_for_visit: action.data.reason_for_visit || initialState.reason_for_visit,
        general_health_info: action.data.general_health_info,
        past_health_condition: action.data.past_health_condition,
        first_name: action.data.first_name,
        dob: action.data.dob,
        gender: action.data.gender || initialState.gender,
        marital_status: action.data.marital_status,
        blood_group: action.data.blood_group || initialState.blood_group,
        secondary_mobile: action.data.secondary_mobile || initialState.secondary_mobile,
        having_any_allergies: action.data.having_any_allergies,
        taking_medications: action.data.taking_medications,
        family_conditions: action.data.family_conditions,
        allergy_info: action.data.allergy_info || initialState.allergy_info,
        medical_procedure: action.data.medical_procedure,
        social_history: action.data.social_history
      }
    case SET_CORPORATE_DATA:
     
      return {
        ...state,
        corporateData: action.data
      }
    default:
      return state;
  }
}




