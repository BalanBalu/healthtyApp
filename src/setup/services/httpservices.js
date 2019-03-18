import axios from 'axios';
import { API_URL } from '../config';

export async function post(endPoint, data) {
   let fullPath =  API_URL + endPoint;
   return await axios.post(fullPath, data)
}