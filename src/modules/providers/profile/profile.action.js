import { AsyncStorage } from 'react-native';
export const PROFILE_REQUEST = 'PROFILE/PROFILE_REQUEST'
export const PROFILE_RESPONSE = 'PROFILE/PROFILE_RESPONSE'
export const PROFILE_ERROR = 'PROFILE/PROFILE_ERROR'
export const REVIEWS_REQUEST = 'PROFILE/REVIEWS_REQUEST'
export const REVIEWS_RESPONSE = 'PROFILE/REVIEWS_RESPONSE'
export const REVIEWS_ERROR = 'PROFILE/REVIEWS_ERROR'

import { store } from '../../../setup/store'
import { getService, putService,postService } from '../../../setup/services/httpservices';

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
   

    
    if(respData.error || !respData.success) {
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
    console.log(e);
    store.dispatch({
      type: PROFILE_ERROR,
      message: e
      }); 
      return {
        success : false,
        message: e
      }
  }  
}

export function storeBasicProfile(result) { 
  AsyncStorage.setItem('basicProfileData', JSON.stringify({
    first_name: result.first_name,
    last_name: result.last_name,
    dob: result.dob,
    profile_image: result.profile_image,
    gender: result.gender,
    mobile_no :result.mobile_no,
    email: result.email
  }))
}

// get user reviews

export async function userReviews (id,type, isLoading = true) {
  try {
    store.dispatch({
      type: REVIEWS_REQUEST,
      isLoading 
    })     
    let endPoint = 'user/reviews/'+type+'/'+id;  
    console.log(endPoint);   
    let response = await getService(endPoint); 
    
   
    let respData = response.data;
    
    if(respData.error || !respData.success) {
      store.dispatch({
        type: REVIEWS_ERROR,
        message: respData.error
      })
    } else {   
      store.dispatch({
        type: REVIEWS_RESPONSE,
        isLoading:false,
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


export async function insertLikesDataForReviews(reviewId, reviewerId,reactionData, isLoading = true) {
  try {
    let endPoint = 'review/reaction/'+reviewId+'/'+reviewerId;  
    let response = await putService(endPoint, reactionData); 
    console.log('response'+response);
    let respData = response.data;
    console.log('respData'+JSON.stringify(respData));

    return respData;   
  }
   catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  } 
}
  
export async function bloodDonationList() {
  try {
    let endPoint = '/blood_doners';  
    let response = await getService(endPoint); 
    console.log('response'+response);
    let respData = response.data;
    console.log('respData'+JSON.stringify(respData));

    return respData;   
  }
   catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  } 
}
  




export async function bloodDonationFilter() {
  try {
    let endPoint = '/blood_donors_details';  
    let response = await getService(endPoint); 
    console.log('response'+response);
    let respData = response.data;
    console.log('respData'+JSON.stringify(respData));

    return respData;   
  }
   catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  } 
}
export async function getfilteredBloodList(Data) {
  try {
    let endPoint = '/bloodDonors/location';    
    let response = await postService(endPoint,Data);
    let respData = response.data;
    console.log('respData'+JSON.stringify(respData))
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}


 

  
  
  
  
  
