import axios from 'axios';
import { API_URL } from '../config';

export const postService = async(endPoint, data) => {
   let fullPath =  API_URL + endPoint;
   let resp = await axios.post(fullPath, data)
   return resp;
}

export const getService = async(endPoint) => {
   let fullPath =  API_URL + endPoint;
   let resp = await axios.get(fullPath)
   return resp;
}
export const putService = async(endPoint, data) => {
   let fullPath =  API_URL + endPoint;
   let resp = await axios.put(fullPath, data)
   return resp;
}
export const deleteService = async(endPoint, data) => {
   let fullPath =  API_URL + endPoint;
   let resp = await axios.delete(fullPath, data)
   return resp;
}