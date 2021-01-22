import { postService, putService, getService, smartHealthGetService, smartHealthPostService, smartHealthPutService } from '../../../setup/services/httpservices';
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
export const APP_LOADED = 'APP/LOADED';
import { NOTIFICATION_RESET } from '../notification/notification.actions'
import { AuthService } from '../../screens/VideoConsulation/services'
import { store } from '../../../setup/store';
import axios from 'axios';



export async function ServiceOfgetMobileAndEmailOtpServicesFromProductConfig(productConfigTypes) {
  try {
    const endPoint = 'admin/productConfig/multiple/' + productConfigTypes;
    const response = await getService(endPoint);
    return response.data;
  } catch (Ex) {

    return {
      success: false,
      statusCode: 500,
      error: Ex,
      message: `Exception while occurred on Get Email and Mobile Otp product config details : ${Ex}`
    }
  }
}

export async function generateOtpForEmailAndMobile(reqData, userId) {
  try {
    let endPoint = '/auth/generateOtpForEmailAndMobile/' + userId;
    let response = await postService(endPoint, reqData);
    let responseData = response.data;
    return responseData
  } catch (e) {
    console.log(e);
  }
}

export async function verifyOtpForEmailAndMobileNo(reqData) {
  try {
    let endPoint = '/auth/verifyOtpForEmailAndMobileNo'
    let response = await postService(endPoint, reqData);
    let responseData = response.data;
    return responseData
  }
  catch (e) {
    console.log(e);
  }
}



export async function generateOtpCodeForCreateAccount(reqData) {
  try {
    let endPoint = 'auth/generateOtpForCreateAccount'
    let response = await postService(endPoint, reqData);
    let responseData = response.data;
    return responseData
  } catch (e) {
    console.log(e);
  }
}

export async function verifyOtpCodeForCreateAccount(reqData) {
  try {
    let endPoint = 'auth/verifyOtpForCreateAccount'
    let response = await postService(endPoint, reqData);
    let responseData = response.data;
    return responseData
  }
  catch (e) {
    console.log(e);
  }
}


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
    let endPoint = 'auth/requestCodeFP'
    let response = await postService(endPoint, reqData);

    let responseData = response.data
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
    return responseData
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
    let responseData = response.data
    if (response.data.success == true) {
      store.dispatch({
        type: NEW_PASSWORD,
        newPassword: true,
        message: response.data.message
      })
    }
    store.dispatch({
      type: AUTH_HAS_ERROR,
      error: response.data.error || response.data.message
    })
    return responseData
  }
  catch (e) {
    console.log(e);
    store.dispatch({
      type: AUTH_HAS_ERROR,
      message: e + ' Occured! Please Try again'
    });
  }

}
//
export async function updateSmartHealthNewPassword(data) {
  try {
    let endPoint = 'auth/change_password';
    let response = await smartHealthPutService(endPoint, data);
    let respData = response.data;

    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

/*Change Password*/
export async function updateNewPassword(data) {
  try {
    let endPoint = 'auth/changeNewPassword';
    let response = await putService(endPoint, data);
    let respData = response.data;

    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}



export async function logout() {


  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
  await AsyncStorage.removeItem('userId');
  await AsyncStorage.removeItem('profile');
  await AsyncStorage.removeItem('isLoggedIn');
  await AsyncStorage.removeItem('basicProfileData');
  await AsyncStorage.removeItem('updatedDeviceToken');
  await AsyncStorage.removeItem('ProfileCompletionViaHome');
  await AsyncStorage.removeItem('is_corporate_user');
  await AsyncStorage.removeItem('relationship')

  store.dispatch({
    type: LOGOUT
  }),
    store.dispatch({
      type: NOTIFICATION_RESET
    })
  AuthService.logout();
}


// Set user token and info locally (AsyncStorage)
export async function setUserLocally(token, userData) {
  try {
    if (userData.is_corporate_user) {
      await AsyncStorage.setItem('is_corporate_user', 'true')
    }
    await AsyncStorage.setItem('token', token)
    await AsyncStorage.setItem('userId', userData.userId)
    await AsyncStorage.setItem('isLoggedIn', 'true');
    AsyncStorage.setItem('user', JSON.stringify(userData))
    axios.defaults.headers.common['x-access-token'] = token;
    axios.defaults.headers.common['userId'] = userData.userId;

    AsyncStorage
    store.dispatch({
      type: SET_USER,
      details: userData
    })
  } catch (e) {
    console.log(e)
  }

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
/*Get post office name and details */
export async function getPostOffNameAndDetails(pincode) {
  try {

    let fullPath = 'pincode/' + pincode;

    let response = await getService(fullPath);
    return response.data;
  } catch (e) {
    console.log(e);
    return {
      message: 'exception' + e,
      success: false
    }
  }
}



export async function updatePrimaryContact(userId, data) {
  try {
    let endPoint = 'user/' + userId + '/primary_contact';
    let response = await putService(endPoint, data);
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

    let response = await putService(endPoint, data);
    let respData = response.data;

    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

// Update email id for Patient
export async function userEmailUpdate(userId, data, type) {
  try {
    let endPoint = '/user/updateEmail/' + userId + '/' + type;
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


export async function getAllCompanyList() {
  try {
    let endPoint = 'corporates';
    let response = await smartHealthGetService(endPoint);

    return response.data;
  } catch (e) {

    return {
      message: 'exceptio1n' + e,
      success: false
    }
  }
}

export async function verifyEmployeeDetails(empCode, authCode) {
  try {
    let endPoint = `member-detail/${empCode}/${authCode}`;

    let response = await smartHealthGetService(endPoint);

    return response.data;
  } catch (e) {

    return {
      message: 'exception' + e.message,
      success: false
    }
  }
}


export async function SmartHealthlogin(userCredentials, isLoading = true) {
  try {

    store.dispatch({
      type: LOGIN_REQUEST,
      isLoading
    })

    let endPoint = 'auth/member-login'
    let req = {
      userId: userCredentials.userEntry,
      password: userCredentials.password
    }


    let response = await smartHealthPostService(endPoint, req);

    if (response && response.data && response.data.access_token) {
      await AsyncStorage.setItem('smartToken', response.data.access_token)
      let ends = 'member-detail/memberId/by-email?email=' + userCredentials.userEntry;

      let res = await smartHealthGetService(ends);
    
      if (res && res.data && res.data[0]) {
        let reqData = res.data[0]
       
        if (reqData.relationship) {
          await AsyncStorage.setItem('relationship', reqData.relationship)
        }
        let reqBody = {
          type: 'user',
          email: reqData.emailId,
          password: userCredentials.password,
          gender: reqData.gender === 'Male' ? 'M' : reqData.gender === 'Female' ? 'F' : 'O',
          dob: reqData.dob,
          is_corporate_user: true,
          corporate_member_id: userCredentials.userEntry,
          employee_code: reqData.employeeId,
          first_name: reqData.firstName,
          last_name: reqData.lastName,
          address: {
            type: 'Point',
            address: {
              no_and_street: reqData.address1 || '1',
              address_line_1: reqData.address2 || ' ',
              district: reqData.district || 'district',
              city: reqData.city,
              state: reqData.state,
              country: reqData.countryCode,
              pin_code: String(reqData.pinCode)
            }
          }

        }
        if (reqData.mobile) {
          reqBody.mobile_no = reqData.mobile
        }

        let insertEndPoint = 'auth/smart_health/signUp';
        let signUpResult = await postService(insertEndPoint, reqBody);


        if (signUpResult.data.success) {
          await AsyncStorage.setItem('memberId', reqData.memberId)
          changePasswordEndPoint = 'member-users/member-id?id=' + reqData.memberId
          console.log(changePasswordEndPoint)
          let forgotResult = await smartHealthGetService(changePasswordEndPoint)

          if (forgotResult && forgotResult.data && forgotResult.data.forceToChangePassword) {
            await AsyncStorage.setItem('forceToChangePassword', 'true')
          }
          const token = signUpResult.data.token;
          signUpResult.data.data.is_corporate_user = true;
          await setUserLocally(token, signUpResult.data.data);

          store.dispatch({
            type: LOGIN_RESPONSE,
            message: respData.data.message
          })

        } else {
          store.dispatch({
            type: LOGIN_HAS_ERROR,
            message: "Invalid Login Credentials"
          })
        }


      }


    } else {
      store.dispatch({
        type: LOGIN_HAS_ERROR,
        message: "Invalid Login Credentials"
      })
    }






    return true

  } catch (e) {

    store.dispatch({
      type: LOGIN_HAS_ERROR,
      message: "Invalid Login Credentials"
    });
  }
}



