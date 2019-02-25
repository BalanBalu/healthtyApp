// Imports
import axios from 'axios'
import { AsyncStorage } from 'react-native'
import queryBuilder from 'gql-query-builder'

// App Imports
import { routeApi } from '../../../setup/routes'
import { MESSAGE_SHOW } from '../../common/api/actions'

// Actions Types
export const LOGIN_REQUEST = 'AUTH/LOGIN_REQUEST'
export const LOGIN_HAS_ERROR = 'AUTH/LOGIN_RESPONSE'
export const LOGIN_RESPONSE = 'AUTH/LOGIN_RESPONSE'
export const SET_USER = 'AUTH/SET_USER'
export const LOGOUT = 'AUTH/LOGOUT'

// Actions

// Register a user
export function register(userDetails) {
  return dispatch => {
    return axios.post(routeApi, queryBuilder({
      type: 'mutation',
      operation: 'userSignup',
      variables: userDetails,
      fields: ['id', 'name', 'email']
    }))
  }
}

// Login a user using credentials
export function login(userCredentials, isLoading = true) {
  console.log('userCredentials');
  return dispatch => {
    dispatch({
      type: LOGIN_REQUEST,
      isLoading
    })

    dispatch({
      type: MESSAGE_SHOW,
      message: 'Signing you in, please wait...'
    })
    var loginAPI = routeApi + 'user/signin';
    console.log(loginAPI);
    return axios.post(loginAPI,userCredentials)
      .then(response => {
        let message = 'Please try again.'
        console.log(response.data);
        var responseData = response.data;
        if (responseData.success === false || response.data.error) {
              message = responseData.error
            dispatch({
              type: LOGIN_HAS_ERROR,
              message: message
            })
        } else if (responseData.success) {
          const token = responseData.jwt;
          const user = String(responseData.data.userId);
          console.log(user);  
          dispatch(setUser(token, user))

          setUserLocally(token, user)

          message = 'Logged in successfully.'
        }

        dispatch({
          type: MESSAGE_SHOW,
          message
        })

        dispatch({
          type: LOGIN_RESPONSE,
          error: message
        })
      })
      .catch(error => {
        console,log(error);
        dispatch({
          type: LOGIN_RESPONSE,
          error: 'Please try again'
        })
      })
  }
}

// Log out user and remove token from local (AsyncStorage)
export function logout() {
  return dispatch => {
    unsetUserLocally()

    dispatch({
      type: LOGOUT
    })
  }
}

// Set a user after login or using local (AsyncStorage) token
export function setUser(token, user) {
  if (token) {
    axios.defaults.headers.common['X-TOKEN'] = token;
  } else {
    delete axios.defaults.headers.common['X-TOKEN'];
  }
    return { type: SET_USER, user }
}

// Set user token and info locally (AsyncStorage)
export function setUserLocally(token, user) {
  // Set token
  AsyncStorage.setItem('token', token)
  AsyncStorage.setItem('userId', user)
  AsyncStorage.setItem('user', JSON.stringify(user))
}

// Unset user token and info locally (AsyncStorage)
export function unsetUserLocally() {
  // Remove token
  AsyncStorage.removeItem('token')
  AsyncStorage.removeItem('user')
  AsyncStorage.removeItem('userId')
}
