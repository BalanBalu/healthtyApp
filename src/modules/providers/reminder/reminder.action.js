import {  getService, putService} from '../../../setup/services/httpservices';

export async function addReminderdata(userId,data) {
    try {
      
      let endPoint = '/reminder/user/' + userId;
      let response = await putService(endPoint, data);
      console.log('response'+response);
      let respData = response.data;
      return respData;
    } catch (e) {
      return {
        message: 'exception' + e,
        success: false
      }
    }
  }

  export async function getReminderData(userId) {
    try {
      
      let endPoint = '/reminder/user/' + userId;
      let response = await getService(endPoint);
      console.log('response'+response);
      let respData = response.data;
      return respData;
    } catch (e) {
      return {
        message: 'exception' + e,
        success: false
      }
    }
  }

  
export async function getAllMedicineDataBySuggestion(keyword) {
  try {
    let endPoint = '/reminder/medicines/suggestion/' + keyword;
    let response = await getService(endPoint);
    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}