import { postService, getService, putService, deleteService } from '../../../setup/services/httpservices';
export const SET_PATIENT_FAVORITE_COUNTS_OF_HOSPITAL_ADMIN_IDS = 'BOOK/PATIENT_FAVORITE_COUNTS_OF_HOSPITAL_ADMIN_IDS';
export const SET_HOSPITAL_FAVORITE_COUNTS_OF_HOSPITAL_ADMIN_IDS = 'BOOK/HOSPITAL_FAVORITE_COUNTS_OF_HOSPITAL_ADMIN_IDS';
import { store } from '../../../setup/store';


export async function serviceOfSearchByHospitalDetails(reqData, skipCount, limit) {
  try {
    const endPoint = `hospital/Near_by_hospital?skip=${skipCount}&limit=${limit}`;
    let response = await postService(endPoint, reqData);
    // console.log('response===>', JSON.stringify(response))
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



export const serviceOfGetFavoriteListCount4PatientService = async (userId) => {
  try {
    const endPoint = 'user/wishList/hospital/' + userId;
    const response = await getService(endPoint);
    let result = response.data;
    if (result.success) {
      let wishListHospitalAdminIds = [];
      result.data.forEach(item => {
        wishListHospitalAdminIds.push(item.hospitalInfo.hospital_admin_id)
      })
      store.dispatch({
        type: SET_PATIENT_FAVORITE_COUNTS_OF_HOSPITAL_ADMIN_IDS,
        data: wishListHospitalAdminIds
      })
    }
    return result;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}


export const addFavoritesToHospitalByUserService = async (userId, hospitalAdminId) => {
  try {
    const { hospitalBookAppointmentData: { patientFavoriteListCountOfHospitalAdminIds, hospitalFavoriteListCountOfHospitalAdminIds } } = store.getState();
    if (userId) {
      const reqData4updateWishList = {
        active: !patientFavoriteListCountOfHospitalAdminIds.includes(hospitalAdminId)
      };
      const updateResponse = await updateFavoritesToHospitalByUser(userId, hospitalAdminId, reqData4updateWishList);
      if (updateResponse.success) {
        if (reqData4updateWishList.active) {
          hospitalFavoriteListCountOfHospitalAdminIds[hospitalAdminId] = hospitalFavoriteListCountOfHospitalAdminIds[hospitalAdminId] ? hospitalFavoriteListCountOfHospitalAdminIds[hospitalAdminId] + 1 : 1
          patientFavoriteListCountOfHospitalAdminIds.push(hospitalAdminId)
        } else {
          hospitalFavoriteListCountOfHospitalAdminIds[hospitalAdminId] = hospitalFavoriteListCountOfHospitalAdminIds[hospitalAdminId] ? hospitalFavoriteListCountOfHospitalAdminIds[hospitalAdminId] - 1 : 0
          const indexOfHospitalAdminId = patientFavoriteListCountOfHospitalAdminIds.indexOf(hospitalAdminId);
          patientFavoriteListCountOfHospitalAdminIds.splice(indexOfHospitalAdminId, 1);
        }
        store.dispatch({
          type: SET_PATIENT_FAVORITE_COUNTS_OF_HOSPITAL_ADMIN_IDS,
          data: patientFavoriteListCountOfHospitalAdminIds
        })
        store.dispatch({
          type: SET_HOSPITAL_FAVORITE_COUNTS_OF_HOSPITAL_ADMIN_IDS,
          data: hospitalFavoriteListCountOfHospitalAdminIds
        })
      }
      return updateResponse;
    }
  }
  catch (Ex) {
    console.log('Ex is getting on update Wish list details for Hospital====>', Ex)
    return {
      success: false,
      statusCode: 500,
      error: Ex,
      message: `Exception while getting on update WishList for Hospital : ${Ex}`
    }
  }
}



export async function updateFavoritesToHospitalByUser(userId, hospitalAdminId, reqData4updateWishList) {
  try {
    const endPoint = 'user/wishList/' + userId + '/hospital/' + hospitalAdminId;
    const response = await putService(endPoint, reqData4updateWishList);
    const respData = response.data;
    return respData;
  }
  catch (Ex) {
    console.log('Ex is getting on update Wish list details for Hospital====>', Ex)
    return {
      success: false,
      statusCode: 500,
      error: Ex,
      message: `Exception while getting on update WishList for Hospital : ${Ex}`
    }
  }
}


export const serviceOfGetHospitalFavoriteListCount4Pat = async (hospitalAdminId) => {
  try {
    const { hospitalBookAppointmentData: { hospitalFavoriteListCountOfHospitalAdminIds } } = store.getState();
    const endPoint = '/wishListCount/' + hospitalAdminId + '/hospital';
    const response = await getService(endPoint);
    const favoritesList = response.data;
    if (favoritesList.success) {
      for (i = 0; i < favoritesList.data.length; i++) {
        hospitalAdminId = favoritesList.data[i].wishList.hospital_admin_id;
        hospitalFavoriteListCountOfHospitalAdminIds[hospitalAdminId] = hospitalFavoriteListCountOfHospitalAdminIds[hospitalAdminId] ? hospitalFavoriteListCountOfHospitalAdminIds[hospitalAdminId] + 1 : 1
      }
      store.dispatch({
        type: SET_HOSPITAL_FAVORITE_COUNTS_OF_HOSPITAL_ADMIN_IDS,
        data: hospitalFavoriteListCountOfHospitalAdminIds
      })
    }
    return favoritesList;
  }
  catch (Ex) {
    console.log('Ex is getting on fetch total WishList for Hospital====>', Ex.message)
    return {
      success: false,
      statusCode: 500,
      error: Ex,
      message: `Exception while getting on fetch total WishList for Hospital : ${Ex.message}`
    }
  }
}
