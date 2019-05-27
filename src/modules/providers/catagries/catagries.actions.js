import { postService,getService } from '../../../setup/services/httpservices';
import { AsyncStorage } from 'react-native';
import { store } from '../../../setup/store';
import axios from 'axios';
export const CATAGRIES_REQUEST = 'CATAGRIES/CATAGRIES_REQUEST'
export const CATAGRIES_RESPONSE = 'CATAGRIES/CATAGRIES_RESPONSE'
export const CATAGRIES_ERROR = 'CATAGRIES/CATAGRIES_ERROR'


export async function catagries ( isLoading = true) {
  try {
    store.dispatch({
      type: CATAGRIES_REQUEST,
      isLoading 
    })     
    let endPoint = 'category_services'
 // console.log(endPoint);   
    let response = await getService(endPoint); 
    let respData = response.data;    
   
     // console.log(respData);
      store.dispatch({        
        type: CATAGRIES_RESPONSE,
        isLoading:false,
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
  

