
import { postService, getService, putService} from '../../../setup/services/httpservices';


export async function getPopularCities() {
    try {
  
      let endPoint = '/location/popular_cities'
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

  export async function getPopularCityAreas(fromPinCode, toPinCode) {
    try {
  
      let endPoint = `/location/popular_cities/from/${fromPinCode}/to/${toPinCode}/areas`
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