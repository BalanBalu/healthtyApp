import AsyncStorage from '@react-native-async-storage/async-storage';
export const PROFILE_REQUEST = 'PROFILE/PROFILE_REQUEST'
export const PROFILE_RESPONSE = 'PROFILE/PROFILE_RESPONSE'
export const PROFILE_ERROR = 'PROFILE/PROFILE_ERROR'
export const REVIEWS_REQUEST = 'PROFILE/REVIEWS_REQUEST'
export const REVIEWS_RESPONSE = 'PROFILE/REVIEWS_RESPONSE'
export const REVIEWS_ERROR = 'PROFILE/REVIEWS_ERROR';
export const AVAILABLE_CREDIT_POINTS = 'PROFILE/AVAILABLE_CREDIT_POINTS';
export const SET_REFER_CODE = 'PROFILE/SET_REFER_CODE';
export const SET_USER_DATA_FOR_PREPARATION = 'PROFILE/SET_USER_DATA_FOR_PREPARATION';
export const SET_CORPORATE_DATA='PROFILE/SET_CORPORATE_DATA'
export const SET_MEMBER_POLICY_INFO='PROFILE/SET_MEMBER_POLICY_INFO';
export const SET_MEMBER_TPA_DATA='PROFILE/SET_MEMBER_TPA_DATA';


import { store } from '../../../setup/store'
import { getService, putService, postService,smartHealthGetService } from '../../../setup/services/httpservices';
import { AuthService } from '../../screens/VideoConsulation/services';
import NotifService from '../../../setup/NotifService';
import { SET_USER } from '../auth/auth.actions';
/*get doctor profile*/
export async function fetchUserProfile(userId, fields, isLoading = true) {
  try {
    store.dispatch({
      type: PROFILE_REQUEST,
      isLoading
    })
    let endPoint = 'user/' + userId + '?fields=' + fields;

    let response = await getService(endPoint);
    let respData = response.data;



    if (respData.error || !respData.success) {
      store.dispatch({
        type: PROFILE_ERROR,
        message: respData.error
      })
      return respData;
    } else {
      store.dispatch({
        type: PROFILE_RESPONSE,
        details: respData.data
      })
      //storeBasicProfile(respData.data)
      return respData.data
    }

  } catch (e) {
 
    store.dispatch({
      type: PROFILE_ERROR,
      message: e
    });
    return {
      success: false,
      message: e
    }
  }
}

export function storeBasicProfile(result) {
  AsyncStorage.setItem('basicProfileData', JSON.stringify({
    first_name: result.first_name,
    last_name: result.last_name,
    middle_name:result.middle_name||' ',
    dob: result.dob,
    profile_image: result.profile_image,
    gender: result.gender,
    mobile_no: result.mobile_no,
    email: result.email
  }))
}



// get user reviews

export async function userReviews(id, type, isLoading = true) {
  try {
    store.dispatch({
      type: REVIEWS_REQUEST,
      isLoading
    })
    let endPoint = 'user/reviews/' + type + '/' + id;
    
    let response = await getService(endPoint);


    let respData = response.data;

    if (respData.error || !respData.success) {
      store.dispatch({
        type: REVIEWS_ERROR,
        message: respData.error
      })
    } else {
      store.dispatch({
        type: REVIEWS_RESPONSE,
        isLoading: false,
        success: true,
        message: respData.message
      })
    }
    return response.data;
  } catch (e) {
    store.dispatch({
      type: REVIEWS_ERROR,
      message: e
    });
  }
}


export async function insertLikesDataForReviews(reviewId, reviewerId, reactionData, isLoading = true) {
  try {
    let endPoint = 'review/reaction/' + reviewId + '/' + reviewerId;
    let response = await putService(endPoint, reactionData);
    
    let respData = response.data;
    

    return respData;
  }
  catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

export async function bloodDonationList(data) {
  try {
    let endPoint = '/bloodDonors';
    let response = await postService(endPoint, data);
    let respData = response.data;
    return respData;
  }
  catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}




export async function bloodDonationFilter(data) {
  try {
    let endPoint = '/bloodDonors/filters';
    let response = await postService(endPoint, data);
   
    let respData = response.data;
   
    return respData;
  }
  catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

/*Get app current version  */
export async function getCurrentVersion(type) {
  try {
    let endPoint = '/admin/productConfig/' + type;
    let response = await getService(endPoint);
    let respData = response.data;
    return respData;

  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}


export const getReferalPoints = async (userId) => {
  let fields = "credit_points,is_mobile_verified,refer_code,email,mobile_no,first_name,last_name,dob,is_corporate_user"
  let result = await fetchUserProfile(userId, fields);
 
 
  if (result) {
    store.dispatch({
      type: AVAILABLE_CREDIT_POINTS,
      credit_points: result.credit_points || 0
    })
    if (result.refer_code) {
      store.dispatch({
        type: SET_REFER_CODE,
        data: result.refer_code
      })
    }
    NotifService.updateDeviceToken(userId);
   
    if (result.mobile_no == undefined) {
      if (result.is_corporate_user) {
        return {
          hasProfileUpdated: false,
          updateMobileNo: false
        }
      } else {
        return {
          hasProfileUpdated: false,
          updateMobileNo: true
        }
      }
    }
    else if (!result.is_mobile_verified) {
      if (result.is_corporate_user) {
        return {
          hasProfileUpdated: false,
          hasOtpNotVerified: false,
          mobile_no: result.mobile_no,
          email: result.email
        }
      } else {
        return {
          hasProfileUpdated: false,
          hasOtpNotVerified: true,
          mobile_no: result.mobile_no,
          email: result.email
        }
      }
    }

    else if (result.first_name == undefined || result.last_name == undefined || result.dob == undefined) {
      return {
        hasProfileUpdated: false,
        updateBasicDetails: true
      }

    }

    else {
      return {
        hasProfileUpdated: true
      }
    }
  }

}



export function setUserDataForPreparation(result) {
  store.dispatch({
    type: SET_USER_DATA_FOR_PREPARATION,
    data: result
  })
}


export async function getCorporateUserFamilyDetails(empCode) {
  try {
    let endPoint = 'employee/' + empCode;
    let response = await smartHealthGetService(endPoint);
    let respData = response.data;
    return respData;

  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}


export async function getPolicYDetailsByid(corporateUserId) {
  try {
    let endPoint = 'policy/employee/' + corporateUserId;
    let response = await smartHealthGetService(endPoint);
    let respData = response.data;
    return respData;

  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}



//medicalRecords
export async function getMedicalRecords(userId,skip,limit,searchKey) {
  try {
    let endPoint = `/appointments/electrical_medical_records/user/${userId}`;
    
    if(limit){
      endPoint=endPoint+`?skip=${skip}&limit=${limit}`
    }
    if (searchKey) {
      endPoint=endPoint+`?searchKey=${searchKey}`
    }

    let response = await getService(endPoint);
    let respData = response.data;
    return respData;

  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}
