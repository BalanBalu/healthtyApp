import { postService, getService, putService} from '../../../setup/services/httpservices';

/* Search Medicine in pharmacy module  */
export async function getSearchedMedicines (keyword, isLoading = true) {
  try {
    let endPoint = 'medicine/keyword';
    let response = await postService(endPoint, keyword);

    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

/*get medicine list*/
export async function getMedicineDetails() {
    try {
      
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

  /*Search Pharmacy in Upload Prescription Page*/
  export async function searchPharmacyByName(keyword) {
    try {      
      let endPoint = '/medicine/pharmacy/keyword'
      console.log(endPoint);
      let response = await postService(endPoint, keyword);
      let respData = response.data;
      return respData;  
    } catch (e) {
      return {
        message: 'exception' + e,
        success: false
      }
    }
  }

  /* Medicine Order List */

  export async function getMedicineOrderList(user_id) {
    try {
      
      let endPoint = 'ordersDetails/' + user_id + '&fields='+ order_items;
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




  