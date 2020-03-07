import { postService, getService, putService } from '../../../setup/services/httpservices';

/* Search Medicine in pharmacy module  */
export async function getSearchedMedicines(keyword, isLoading = true) {
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


/* Medicine Order List */

export async function getMedicineOrderList(userId) {
  try {

    let endPoint = 'ordersDetails?userId=' + userId;
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

    let endPoint = '/getpharmacy/' + pharmacy_id
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

export async function getSelectedMedicineDetails(medicineId, pharmacyId) {
  try {

    let endPoint = '/medicine/' + medicineId + '/pharmacy/' + pharmacyId;
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


export async function getSuggestionMedicines (keyword,data, isLoading = true) {
  try {
    let endPoint = 'medicines/suggestions/'+keyword;
    let response = await postService(endPoint, data);

    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}
export async function getMedicinesSearchList (data, isLoading = true) {
  try {
    let endPoint = '/medicines/search/healthCareProducts';
    let response = await postService(endPoint, data);

    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

/*get Near by pharmacy list*/
export async function getNearOrOrderPharmacy(userId, coordinates) {
  try {
    let endPoint = '/recommedation/recentOrNearByPharmacies?userId=' + userId + '&location=' + coordinates;
    console.log(endPoint)
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

/*get Popular Medicine*/
export async function getPopularMedicine(userId) {
  try {
    let endPoint = '/recommedation/recentOrPapularHealthCareProducts?userId=' + userId;
    console.log(endPoint)
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

