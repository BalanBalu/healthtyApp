import { postService, getService, putService, deleteService } from '../../../setup/services/httpservices';


export async function getNearByHospitals(type, data) {
  try {
    if (type === "pinCode") {
      var endPoint = '/hospital/Near_by_hospital?pinCode=' + data;
    }
    if (type === "location") {
      var endPoint = '/hospital/Near_by_hospital?location=' + encodeURIComponent(data);
    }
    // console.log('===>', endPoint)
    let response = await getService(endPoint);
    let respData = response.data;
    return respData;
  } catch (e) {
    console.log(e);
    return {
      message: 'exception' + e,
      success: false
    }
  }
}
