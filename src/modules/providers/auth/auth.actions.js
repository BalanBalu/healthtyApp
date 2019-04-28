import { postService,putService } from '../../../setup/services/httpservices';
import { AsyncStorage } from 'react-native';
export const LOGIN_REQUEST = 'AUTH/LOGIN_REQUEST'
export const LOGIN_HAS_ERROR = 'AUTH/LOGIN_RESPONSE'
export const LOGIN_RESPONSE = 'AUTH/LOGIN_RESPONSE'
export const SET_USER = 'AUTH/SET_USER'
export const LOGOUT = 'AUTH/LOGOUT'
export const OTP_CODE_GENERATED = 'AUTH/OTP_CODE'
export const AUTH_REQUEST = 'AUTH_API_REQUEST'
export const AUTH_HAS_ERROR = 'AUTH_HAS_ERROR' 
export const AUTH_RESPONSE = 'AUTH_RESPONSE' 
export const NEW_PASSWORD = 'AUTH/NEW_PASSWORD'; 
import { store } from '../../../setup/store';
import axios from 'axios';
  


export async function login(userCredentials, isLoading = true) {
      try {
        
        store.dispatch({
          type: LOGIN_REQUEST,
          isLoading 
        }) 
    
        let endPoint = 'auth/signIn'
        let response = await postService(endPoint, userCredentials);
       
        let respData = response.data;
        
           
        if(respData.error || !respData.success) {
          store.dispatch({
            type: LOGIN_HAS_ERROR,
            message: respData.error
          })
        } else {   
         
          const token = respData.token;
          setUserLocally(token, respData.data);
          
          store.dispatch({
            type: LOGIN_RESPONSE,
            message: respData.message
          })
          return true;
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
  let respData = response.data;
    console.log(response);
    if(!respData.success || respData.error){
      store.dispatch({
        type: AUTH_HAS_ERROR,
        message: respData.error|| respData.message       
      })
      return;
    }
    
      store.dispatch({
        type: AUTH_RESPONSE,
        message: respData.message       
      });
      store.dispatch({
        type: NEW_PASSWORD,
        isPasswordChanged: true       
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
export function setUserLocally(token, userData) {
    // Set token
   
    AsyncStorage.setItem('token', token)
    AsyncStorage.setItem('userId', userData.userId)
    AsyncStorage.setItem('user', JSON.stringify(userData))
    axios.defaults.headers.common['x-access-token'] = token;
    axios.defaults.headers.common['userId'] = userData.userId;
    
    store.dispatch({
      type: SET_USER,
      details: userData
    })
       
}

// Signup for Patient
export async function signUp(credentialData){
  try{
    store.dispatch({
      type: AUTH_REQUEST,
      isLoading: true
    })
    let endPoint = 'auth/signUp/';
    let response = await postService(endPoint, credentialData); 
    let respData = response.data;
    
    if(respData.error || !respData.success) {             
      console.log(respData);
      store.dispatch({
        type: AUTH_HAS_ERROR,
        message: respData.error || respData.message
      })
      return
    } else {
        store.dispatch({
         type: AUTH_RESPONSE,
         message: respData.message,
         userId : respData.userId
      })
    }     
  }catch(ex){
    store.dispatch({
      type: AUTH_HAS_ERROR,
      message: 'Expeption Occured' + ex
    })
    console.log(ex.message);
  }
}

// Update fields for Patient
export async function userFiledsUpdate(credentialData, data){
  try{
    store.dispatch({
      type: AUTH_REQUEST,
      isLoading: true
    })
    let endPoint = 'user/'+ data;
    let response = await putService(endPoint, credentialData); 
    let respData = response.data;
   
    if(respData.error) {             
      console.log(respData);
      store.dispatch({
        type: AUTH_HAS_ERROR,
        message: respData.message
      })
    }else{        
        store.dispatch({
        type: AUTH_RESPONSE,
        isLoading: false,
        message: respData.message
      })
    }     
  }catch(ex){
    store.dispatch({
      type: AUTH_HAS_ERROR,
      message: ex.message,
      details:ex
    })
    console.log(ex.message);
  }
}
