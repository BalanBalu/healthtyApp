import { postService, putService } from '../../../setup/services/httpservices';
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
export const REDIRECT_NOTICE = 'AUTH/REDIRECT_NOTICE';
export const RESET_REDIRECT_NOTICE = 'AUTH/RESET_REDIRECT_NOTICE';
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


    if (respData.error || !respData.success) {
      store.dispatch({
        type: LOGIN_HAS_ERROR,
        message: "Invalid Login Credentials"
      })
    } else {
      console.log('token:' + JSON.stringify(respData))
      const token = respData.token;
     await setUserLocally(token, respData.data);

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
    if (response.error || response.success == false) {
      store.dispatch({
        type: LOGIN_HAS_ERROR,
        message: response.error || response.message
      })
      return;
    }
    store.dispatch({
      type: OTP_CODE_GENERATED,
      userId: response.data.userId
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

/*Forgot Password*/
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
    if (!respData.success || respData.error) {
      store.dispatch({
        type: AUTH_HAS_ERROR,
        message: respData.error || respData.message
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
  catch (e) {
    console.log(e);
    store.dispatch({
      type: AUTH_HAS_ERROR,
      message: e + ' Occured! Please Try again'
    });
  }

}

/*Change Password*/
export async function updateNewPassword(data) {
  try {
    let endPoint = 'auth/changeNewPassword';
    let response = await putService(endPoint, data);
    console.log('response' + JSON.stringify(response));
    let respData = response.data;
    console.log('respData' + JSON.stringify(respData))
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}



export async function logout() {
  console.log('is Coming here ');

  await AsyncStorage.removeItem('token')
  await AsyncStorage.removeItem('user')
  await AsyncStorage.removeItem('userId')
  await AsyncStorage.removeItem('profile')
  store.dispatch({
    type: LOGOUT
  })
}


// Set user token and info locally (AsyncStorage)
export async function  setUserLocally(token, userData) {
  // Set token

  await AsyncStorage.setItem('token', token)
  await AsyncStorage.setItem('userId', userData.userId)
  AsyncStorage.setItem('user', JSON.stringify(userData))
  axios.defaults.headers.common['x-access-token'] = token;
  axios.defaults.headers.common['userId'] = userData.userId;
  AsyncStorage
  store.dispatch({
    type: SET_USER,
    details: userData
  })

}
export const hasLoggedIn = async (props) => {
  const token = await AsyncStorage.getItem('token')
  const userId = await AsyncStorage.getItem('userId')
  if (token === undefined || userId === undefined || token === null || userId === null) {
    if (props) {
      let navigation = props.navigation;
      if (navigation.state) {
        debugger
        let stateParams = navigation.state.params;
        console.log(stateParams);
        let routeName = navigation.state.routeName;
        store.dispatch({
          type: REDIRECT_NOTICE,
          redirectNotice: {
            routeName,
            stateParams
          }
        })
        AsyncStorage.setItem('redirect', 'true')
      }
    }
    return false;
  }
  return true;
}

// Signup for Patient
export async function signUp(credentialData) {
  try {
    store.dispatch({
      type: AUTH_REQUEST,
      isLoading: true
    })
    let endPoint = 'auth/signUp/';
    let response = await postService(endPoint, credentialData);
    let respData = response.data;

    if (respData.error || !respData.success) {
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
        userId: respData.userId
      })
    }
  } catch (ex) {
    store.dispatch({
      type: AUTH_HAS_ERROR,
      message: 'Expeption Occured' + ex
    })
    console.log(ex.message);
  }
}

// Update fields for Patient
export async function userFiledsUpdate(userId, data) {
  try {
    let endPoint = 'user/' + userId;
    let response = await putService(endPoint, data);


    await AsyncStorage.removeItem('profile');
    return response.data;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

/*Update User Profile Picture*/
export async function updateProfilePicture(userId, data) {
  try {
    let endPoint = 'user/' + userId + '/upload/profile'
    console.log(endPoint);
    let response = await putService(endPoint, data);
    let respData = response.data;
    console.log('respData' + JSON.stringify(respData))
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}







