import { postService, getService, putService, deleteService, inventoryPostService, inventoryGetService, inventoryPutService, inventoryDeleteService } from '../../../setup/services/httpservices';




export async function getSuggestionMedicines(keyword, data, isLoading = true) {
  try {
    let endPoint = 'products/search?s=' + keyword;
    let response = await inventoryGetService(endPoint);

    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}


export async function searchRecentItemsByPharmacy(limit) {
  try {
    let endPoint = '/products/top-search-product?l='+limit;
    let response = await inventoryGetService(endPoint);

    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}
export async function getMedicinesSearchList(keyword, pagination, isLoading = true) {
  try {
    console.log(typeof keyword)
    let endPoint = '/products/search/pagination?s=' + keyword + '&p=' + pagination + '&c=' + 10;
    console.log(endPoint);

    let response = await inventoryGetService(endPoint);
    console.log('hi==================')
    console.log(JSON.stringify(response.data))
    let respData = response.data.content;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}
export async function getProductDetailById(medicineId) {
  try {

    let endPoint = `/products/detail/${medicineId}`;
    console.log(endPoint)
    let response = await inventoryGetService(endPoint);
    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

export async function getAllPromotions() {
  try {
    let endPoint = 'promotions';
    let response = await inventoryGetService(endPoint);
    console.log(JSON.stringify(response))
    // let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}
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

export async function getMedicineOrderList(userId, pagination, count) {
  try {

    let endPoint = `transaction/order/user/${userId}?p=${pagination}&c=${10}`;
    let response = await inventoryGetService(endPoint);
    console.log('req========================')
    let respData = response.data.content

    return respData;
  } catch (e) {
    console.log('hi======')
    console.log(e)
    return {
      message: 'exception' + e,
      success: false
    }
  }
}
export async function getAvailableStockForListOfProducts(productIds) {
  try {

    let endPoint = `/products/available-stocks?ids=${productIds}`;
    let response = await inventoryGetService(endPoint);
    console.log('req========================')
    let respData = response.data

    return respData;
  } catch (e) {
    console.log('hi======')
    console.log(e)
    return {
      message: 'exception' + e,
      success: false
    }
  }
}



/* Medicine Order details */

export async function getMedicineOrderDetails(orderId) {
  try {

    let endPoint = `/transaction/order/${orderId}`;
    console.log(endPoint);
    let response = await inventoryGetService(endPoint);
    console.log(response);
    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}


export async function getOrderTracking(orderNumber) {
  try {

    let endPoint = `/transaction/track/${orderNumber}`;
    console.log(endPoint);
    let response = await inventoryGetService(endPoint);
    console.log(response);
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

export async function deletePrescriptionByUserId(userId) {
  try {

    let endPoint = '/medicine_orders/prescription/user/'+userId
    console.log(endPoint);
    let response = await deleteService(endPoint);
    console.log(JSON.stringify(response.data))
    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}



export async function getMedicinesSearchListByPharmacyId(pharmacyId, pagination,isLoading = true) {
  try {
    let endPoint = `/products/pharmacy/${pharmacyId}?p=${pagination}&c=${10}`;
    let response = await inventoryGetService(endPoint);
    let respData = response.data.content;
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
    if (user_id) {
      var endPoint = '/recommendation/recentOrNearByPharmacies?user_id=' + user_id + '&location=' + encodeURIComponent(coordinates);
    } else {
      var endPoint = '/recommendation/recentOrNearByPharmacies?location=' + encodeURIComponent(coordinates);
    }

    console.log(endPoint);
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

/*get Popular Medicine*/
export async function getPopularMedicine(userId, coordinates) {
  try {
    if (userId) {
      var endPoint = '/recommendation/recentOrPapularHealthCareProducts?user_id=' + userId + '&location=' + encodeURIComponent(coordinates);
    } else {
      var endPoint = '/recommendation/recentOrPapularHealthCareProducts?location=' + encodeURIComponent(coordinates);
    }
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
    let endPoint = '/transaction';
    console.log(endPoint)
    let response = await inventoryPutService(endPoint, data);
    console.log(JSON.stringify(response))
    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}


export async function updateTopSearchedItems(pid) {
  try {
    let endPoint = `/products/top-search-product/${pid}`;
    console.log(endPoint)
    let response = await inventoryPutService(endPoint, data);
    
  
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

    let endPoint = '/medicine/' + medicine_id + '/reviews?limit=2';
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
/*Get medicine reviews */
export async function getAllMedicineReviews(medicine_id) {
  try {

    let endPoint = '/medicine/' + medicine_id + '/reviews';
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

    let endPoint = '/medicine/' + medicine_id + '/reviewsCount';
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




export async function getPurcharseRecomentation(data) {
  try {

    let endPoint = '/medicine/purcharse/recomentation';

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
export async function getmedicineAvailableStatus(data, isLoading = true) {
  try {
    let endPoint = 'medicine/add_to_card/medicine_verification';
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

export async function upDateOrderData(data) {
  try {
    let endPoint = '/transaction/cancel-order';
    let response = await inventoryPutService(endPoint, data);

    let respData = response.data;
    console.log('updateData====================================')
    console.log(JSON.stringify(respData))
    return respData;

  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}
export async function capturePayment(paymentId) {
  try {
    let endPoint = '/payment/capture/' + paymentId;
    let response = await putService(endPoint, data);

    let respData = response.data;
    console.log('capturePayment====================================')
    console.log(JSON.stringify(respData))
    return respData;

  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

export async function getUploadPrescription(userId) {
  try {
    let endPoint = '/medicine_orders/prescription/user/' + userId;
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



export async function getOrderUserReviews(user_id, order_id) {
  try {
    let endPoint = '/medicine_orders/user/' + user_id + '/order_review/' + order_id
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
export async function InsertOrderReviews(user_id, data) {
  try {
    let endPoint = '/transaction/review'
    let response = await inventoryPutService(endPoint, data);
    let respData = response.data;
    return respData;

  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}

export async function removePrescriptionImage(prescriptionData, userId) {
  try {

    let endPoint = '/medicine_orders/prescription/' + prescriptionData.prescription_image_id + '/user/' + userId
    let response = await deleteService(endPoint);
    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}