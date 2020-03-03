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
      
      let endPoint = '/medicine/detailsList?limit=4'
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

  export async function getMedicineOrderList(userId) {
    try {
      
      let endPoint = 'ordersDetails?userId='+userId;
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


/*get pharmacy list*/
export async function getpharmacy(pharmacy_id) {
  try {
    
    let endPoint = '/getpharmacy/'+ pharmacy_id
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

/*get all pharmacy list*/
export async function getAllPharmacy() {
  try {

    let endPoint = '/getpharmacy'
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

