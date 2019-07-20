import {getService} from '../../../setup/services/httpservices';

/*get medicine list*/
export async function getMedicineDetails() {
    try {
      console.log("try");
      let endPoint = '/medicine/fullDetails?limit=8'
      console.log(endPoint);
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