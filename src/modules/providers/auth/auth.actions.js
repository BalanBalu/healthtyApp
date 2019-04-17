import { postService } from '../../../setup/services/httpservices';
import { AsyncStorage } from 'react-native';
export const LOGIN_REQUEST = 'AUTH/LOGIN_REQUEST'
export const LOGIN_HAS_ERROR = 'AUTH/LOGIN_RESPONSE'
export const LOGIN_RESPONSE = 'AUTH/LOGIN_RESPONSE'
export const SET_USER = 'AUTH/SET_USER'
export const LOGOUT = 'AUTH/LOGOUT'
export const OTP_CODE_GENERATED = 'AUTH/OTP_CODE'
export const NEW_PASSWORD = 'AUTH/NEW_PASSWORD'
export const AUTH_REQUEST = 'AUTH_API_REQUEST'
export const AUTH_HAS_ERROR = 'AUTH_HAS_ERROR' 
export const AUTH_RESPONSE = 'AUTH_RESPONSE' 

import { store } from '../../../setup/store'


export async function login(userCredentials, isLoading = true) {
      try {
        
        store.dispatch({
          type: LOGIN_REQUEST,
          isLoading 
        }) 
        console.log('comint here manw');
        let endPoint = 'auth/signIn'
        let response = await postService(endPoint, userCredentials);
       
        let respData = response.data;
        
           
        if(respData.error && respData.success == false) {
          store.dispatch({
            type: LOGIN_HAS_ERROR,
            message: respData.error
          })
          //console.log(respData);  
        } else {   
         
          const token = respData.token;
          
          setDoctorLocally(token, respData.data);
          
          store.dispatch({
            type: LOGIN_RESPONSE,
            message: respData.message
          })
          console.log('Logged In Success');
          return true;
          //console.log(store.getState()); 
        }
        
      } catch (e) {
        store.dispatch({
          type: LOGIN_HAS_ERROR,
          message: e + ' Occured! Please Try again'
        }); 
      }     
}



export async function generateOTP(reqData) {
  try {
     store.dispatch({
      type: AUTH_REQUEST,
      isLoading: true 
    })
    console.log('comign to Generate OTP after dispathc');
    let endPoint = 'auth/requestCodeFP'
    let response = await postService(endPoint, reqData);  
    if(response.error|| response.success == false) {
      store.dispatch({
        type: LOGIN_HAS_ERROR,
        message: response.error || response.message
      })
      return;
    }
    store.dispatch({
      type: OTP_CODE_GENERATED,
      otpCode: response.data.otp,
      userId:response.data.userId  
    })
      return
  } catch (e) {
    console.log(e);
    store.dispatch({
      type: AUTH_HAS_ERROR,       
      message: e + ' Occured! Please Try again'
    }); 
  }     
}

export async function changePassword(reqData) {
try {
  store.dispatch({
    type: AUTH_REQUEST,
    isLoading: true 
  })
  let endPoint = 'auth/changePassword/'
  let response = await postService(endPoint, reqData);
    console.log(response);
    if( response.data.success == true) {
      store.dispatch({
        type: NEW_PASSWORD,
        newPassword: true       
      })  
    }
      store.dispatch({
        type: AUTH_HAS_ERROR,
        error: response.data.error||response.data.message       
      })  
  }
  catch (e) 
  {
    console.log(e);
    store.dispatch({      
      type: AUTH_HAS_ERROR,
      message: e + ' Occured! Please Try again'
    }); 
  }     

}

export function logout() {
  AsyncStorage.removeItem('token')
  AsyncStorage.removeItem('user')
  AsyncStorage.removeItem('userId')
    
  store.dispatch({
    type: LOGOUT
  })
  
}

// Set user token and info locally (AsyncStorage)
export function setDoctorLocally(token, userData) {
    // Set token
   
    AsyncStorage.setItem('token', token)
    AsyncStorage.setItem('userId', userData.userId)
    AsyncStorage.setItem('user', JSON.stringify(userData))
    store.dispatch({
      type: SET_USER,
      details: userData
    })
       
}