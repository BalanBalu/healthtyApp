import {  getService, putService} from '../../../setup/services/httpservices';

export async function addReminderdata(userId,data) {
    try {
      
      let endPoint = 'medicine/medicineRemainder/' + userId;
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