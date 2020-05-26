import { postService, getService } from '../../../setup/services/httpservices';
import { AsyncStorage } from 'react-native';
import { store } from '../../../setup/store';
import axios from 'axios';
export const CATAGRIES_REQUEST = 'CATAGRIES/CATAGRIES_REQUEST'
export const CATAGRIES_RESPONSE = 'CATAGRIES/CATAGRIES_RESPONSE'
export const CATAGRIES_ERROR = 'CATAGRIES/CATAGRIES_ERROR'

export async function getSpecialistDataSuggestions(type, keyWord, locationData) {
  try {
    // let endPoint = 'doctor/searchKeys/'+userId +'/'+keyWord;   // old path
    let endPoint = 'V2/doctor/search/' + type + '/' + keyWord; // new path

    let response = await postService(endPoint, locationData);
    let respData = response.data;
    // console.log('respData'+JSON.stringify(respData))
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

export async function catagries(searchQueries = '') {
  try {
    store.dispatch({
      type: CATAGRIES_REQUEST,
    })
    let endPoint = 'category_services'
    if (searchQueries !== '') {
      endPoint = endPoint + '?' + searchQueries;
    }
    console.log(endPoint);
    let response = await getService(endPoint);
    let respData = response.data;

    // console.log(respData);
    store.dispatch({
      type: CATAGRIES_RESPONSE,
      isLoading: false,
      success: true,
      message: respData.message
    })
    return respData;



  } catch (e) {
    store.dispatch({
      type: CATAGRIES_ERROR,
      message: e
    });
  }
}


