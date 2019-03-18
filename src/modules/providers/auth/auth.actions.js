import * as httpService from '../../../setup/services/httpservices';
import { AsyncStorage } from 'react-native';
export const LOGIN_REQUEST = 'AUTH/LOGIN_REQUEST'
export const LOGIN_HAS_ERROR = 'AUTH/LOGIN_RESPONSE'
export const LOGIN_RESPONSE = 'AUTH/LOGIN_RESPONSE'
export const SET_USER = 'AUTH/SET_USER'
export const LOGOUT = 'AUTH/LOGOUT'
import { store } from '../../../setup/store'


export async function login(userCredentials, isLoading = true) {
      try {
        
        store.dispatch({
          type: LOGIN_REQUEST,
          isLoading 
        }) 
        
        let endPoint = 'auth/signIn'
        let response = await httpService.post(endPoint, userCredentials);
       
        let respData = response.data;
        
           
        if(respData.error && respData.success == false) {
          store.dispatch({
            type: LOGIN_HAS_ERROR,
            message: respData.error
          })
          //console.log(respData);  
        } else {   
         
          const token = respData.token;
          
          await setDoctorLocally(token, respData.data);
          
          store.dispatch({
            type: LOGIN_RESPONSE,
            message: respData.message
          })
          console.log('comint here manw');
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

export function logout() {
  AsyncStorage.removeItem('token')
  AsyncStorage.removeItem('doctor')
  AsyncStorage.removeItem('doctorId')
    
  store.dispatch({
    type: LOGOUT
  })
  
}

// Set user token and info locally (AsyncStorage)
export function setDoctorLocally(token, doctorData) {
    // Set token
   
    AsyncStorage.setItem('token', token)
    AsyncStorage.setItem('doctorId', doctorData.doctorId)
    AsyncStorage.setItem('doctor', JSON.stringify(doctorData))
    store.dispatch({
      type: SET_USER,
      details: doctorData
    })
       
}