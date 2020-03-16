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

    let endPoint = 'medicine/ordersDetails?userId=' + userId;
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



/* Medicine Order details */

export async function getMedicineOrderDetails(order_id , userId) {
  try {

    let endPoint = '/medicine/order/'+ order_id + '/user/' + userId ;
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


export async function getSuggestionMedicines(keyword, data, isLoading = true) {
  try {
    let endPoint = 'medicines/suggestions/' + keyword;
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
export async function getMedicinesSearchList(data, isLoading = true) {
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
export async function getMedicinesSearchListByPharmacyId(pharmacyId, isLoading = true) {
  try {
    let endPoint = '/medicines/pharmacy/' + pharmacyId;
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


/*get Near by pharmacy list*/
export async function getNearOrOrderPharmacy(user_id, coordinates) {
  try {
    let endPoint = '/recommedation/recentOrNearByPharmacies?user_id=' + user_id + '&location=' + coordinates;
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
    let endPoint = '/recommedation/recentOrPapularHealthCareProducts?user_id=' + userId;
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

export async function createMedicineOrder(data) {
  try {
    let endPoint = '/medicine/order';
    console.log(endPoint)
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

/*Get medicine reviews */
export async function getMedicineReviews(medicine_id) {
  try {

    let endPoint = '/medicine/reviews/' + medicine_id;
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

/*Insert medicine reviews */
export async function InsertMedicineReviews(userId, data) {
  try {

    let endPoint = '/medicine/review/' + userId;
    console.log(endPoint);
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

/*Get medicine reviews count*/
export async function getMedicineReviewsCount(medicine_id) {
  try {

    let endPoint = '/medicine/reviewsCount/' + medicine_id;
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


