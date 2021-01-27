import axios from 'axios';
import { API_URL ,INVENTORY_API_URL} from '../config';

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
export const uploadMultiPart = async(endPoint,formData) => {
   
   var req = {
      method: 'PUT',
      url: API_URL+endPoint,
      data: formData,
      headers: {
      'content-type': `multipart/form-data; boundary=${formData._boundary}`,
      },
  }
  const response = await axios(req)
  return response;

}
export const updateUploadMultiPart = async(endPoint,formData) => {
   
   var req = {
      method: 'POST',
      url: API_URL+endPoint,
      data: formData,
      headers: {
      'content-type': `multipart/form-data; boundary=${formData._boundary}`,
      },
  }
  console.log(req)
  const response = await axios(req)
  console.log(response)
  return response;

}
export const inventryPostService = async(endPoint, data) => {
   let fullPath =  INVENTORY_API_URL + endPoint;
   let resp = await axios.post(fullPath, data)
   return resp;
}

export const inventoryGetService = async(endPoint) => {
   let fullPath =  INVENTORY_API_URL + endPoint;
   let resp = await axios.get(fullPath)
   return resp;
}
export const inventoryPutService = async(endPoint, data) => {
   let fullPath =  INVENTORY_API_URL + endPoint;
   let resp = await axios.put(fullPath, data)
   return resp;
}
export const inventoryDeleteService = async(endPoint, data) => {
   let fullPath =  INVENTORY_API_URL + endPoint;
   let resp = await axios.delete(fullPath, data)
   return resp;
}
