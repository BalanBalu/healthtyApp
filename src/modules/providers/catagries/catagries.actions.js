import { postService, getService } from '../../../setup/services/httpservices';

import { store } from '../../../setup/store';
import axios from 'axios';
export const CATAGRIES_REQUEST = 'CATAGRIES/CATAGRIES_REQUEST'
export const CATAGRIES_RESPONSE = 'CATAGRIES/CATAGRIES_RESPONSE'
export const CATAGRIES_ERROR = 'CATAGRIES/CATAGRIES_ERROR'

export async function getSpecialistDataSuggestions(type, SuggestionReqData) {
  try {
    // let endPoint = 'doctor/searchKeys/'+userId +'/'+keyWord;   // old path
    let endPoint = 'V2/doctor/search/' + type; // new path
    let response = await postService(endPoint, SuggestionReqData);
    let respData = response.data;
 
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

export async function catagries(searchQueries = 'services=0') {
  try {
    if(store.getState().categories.fullCategoryFetched === true) {
     
      return store.getState().categories.response;
    }
    let endPoint = 'category_services'
    if (searchQueries !== '') {
      endPoint = endPoint + '?' + searchQueries;
    }
    let response = await getService(endPoint);
    let respData = response.data;

    if(respData.success === true) {
      store.dispatch({
        type: CATAGRIES_RESPONSE,
        isLoading: false,
        success: true,
        message: respData.message,
        response: respData 
      })
    }
    return respData;



  } catch (e) {
    store.dispatch({
      type: CATAGRIES_ERROR,
      message: e
    });
  }
}


