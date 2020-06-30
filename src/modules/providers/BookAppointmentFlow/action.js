import { postService, getService, putService } from '../../../setup/services/httpservices';

export const SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA = 'BOOK_APP/DOCTOR_INFO_LIST_AND_SLOTS_DATA';
export const SET_SINGLE_DOCTOR_ITEM_DATA = 'BOOK_APP/SINGLE_DOCTOR_ITEM_DATA';
export const SET_PATIENT_FAVORITE_COUNTS_OF_DOCTOR_IDS = 'BOOK/PATIENT_FAVORITE_COUNTS_OF_DOCTOR_IDS';
export const SET_DOC_FAVORITE_COUNTS_OF_DOCTOR_IDS = 'BOOK/DOC_FAVORITE_COUNTS_OF_DOCTOR_IDS';
export const SET_DOC_REVIEW_COUNTS_OF_DOCTOR_IDS = 'BOOK/DOC_REVIEW_COUNTS_OF_DOCTOR_IDS';
export const SET_FILTERED_DOCTOR_DATA = 'BOOK/FILTERED_DOCTOR_DATA';
export const SET_PATIENT_LOCATION_DATA = 'BOOK/SET_PATIENT_LOCATION_DATA';
import { store } from '../../../setup/store';

/*  Get multiple doctor details  */
export const getMultipleDoctorDetails = async (doctorIds, fields) => {
    try {
        const endPoint = 'doctors/' + doctorIds + '?fields=' + fields;
        const response = await getService(endPoint);
        const respData = response.data;
        return respData;
    } catch (Ex) {
        console.log('Ex is getting on get  multiple Doctor details====>', Ex)
        return {
            success: false,
            statusCode: 500,
            error: Ex,
            message: `Exception while getting on get multiple Doctor details : ${Ex}`
        }
    }
}

/* Update Sponsor Viewers Counts */
export async function serviceOfUpdateDocSponsorViewCountByUser(userId, sponsorIds) {
    try {
        const endPoint = 'updateSponsorViewers/' + userId
        const response = await putService(endPoint, sponsorIds);
        const respData = response.data;
        return respData;
    } catch (Ex) {
        console.log('Ex is getting on update Doctor sponsor view count by user====>', Ex)
        return {
            success: false,
            statusCode: 500,
            error: Ex,
            message: `Exception while getting on update Doctor sponsor view count by user : ${Ex}`
        }
    }
}


export const searchByDocDetailsService = async (type, activeSponsor, reqData, skipCount, limit) => {
    try {
        const endPoint = `V2/doctor/search/${type}?active_sponsor=${activeSponsor}&skip=${skipCount}&limit=${limit}`;
        const response = await postService(endPoint, reqData);
        const respData = response.data;
        return respData;
    } catch (ex) {
        return {
            success: false,
            message: `Error Occurred on :${ex.message}`
        }
    }
}


export async function fetchDoctorAvailabilitySlotsService(doctorIds, dateFilter, patientGender) {
    try {
        const endPoint = 'doctors/' + 'availabilitySlots?startDate=' + dateFilter.startDate + '&endDate=' + dateFilter.endDate;
        if (patientGender) endPoint + '&gender=' + patientGender;
        const response = await postService(endPoint, doctorIds);
        const respData = response.data;
        return respData;
    } catch (Ex) {
        console.log('Ex is getting on fetchAvailabilitySlots for Doctor====>', Ex)
        return {
            success: false,
            statusCode: 500,
            error: Ex,
            message: `Exception while getting on fetchAvailabilitySlots for Doctor : ${Ex}`
        }
    }
}



export const serviceOfGetTotalReviewsCount4Doctors = async (doctorIds) => {
    try {
        const endPoint = 'user/reviewsCount/' + doctorIds;
        const response = await getService(endPoint);
        const reviewCountRes = response.data;
        if (reviewCountRes.success) {
            const { bookAppointmentData: { docReviewListCountOfDoctorIDs } } = store.getState();
            const reviewCountList = reviewCountRes.data;
            if (reviewCountList.length != 0) {
                for (i = 0; i < reviewCountList.length; i++) {
                    docReviewListCountOfDoctorIDs[reviewCountList[i]._id] = reviewCountList[i];
                }
            }
            store.dispatch({
                type: SET_DOC_REVIEW_COUNTS_OF_DOCTOR_IDS,
                data: docReviewListCountOfDoctorIDs
            })
            // console.log('docReviewListCountOfDoctorIDs=====>', docReviewListCountOfDoctorIDs);
        }
        return reviewCountRes;

    } catch (Ex) {
        console.log('Ex is getting on get Reviews count for Doctor====>', Ex)
        return {
            success: false,
            statusCode: 500,
            error: Ex,
            message: `Exception while getting on Reviews count for Doctor : ${Ex}`
        }
    }
}




export const ServiceOfGetDoctorFavoriteListCount4Pat = async (doctorId) => {
    try {
        const { bookAppointmentData: { docFavoriteListCountOfDoctorIDs } } = store.getState();
        const endPoint = 'doctor/wishList/' + doctorId;
        const response = await getService(endPoint);
        const favoritesList = response.data;
        if (favoritesList.success) {
            // docFavoriteListCountOfDoctorIDs = {};
            for (i = 0; i < favoritesList.data.length; i++) {
                doctorId = favoritesList.data[i].wishList.doctor_id;
                docFavoriteListCountOfDoctorIDs[doctorId] = docFavoriteListCountOfDoctorIDs[doctorId] ? docFavoriteListCountOfDoctorIDs[doctorId] + 1 : 1
            }
            store.dispatch({
                type: SET_DOC_FAVORITE_COUNTS_OF_DOCTOR_IDS,
                data: docFavoriteListCountOfDoctorIDs
            })
        }
        return favoritesList;
    }
    catch (Ex) {
        console.log('Ex is getting on fetch total WishList for Doctor====>', Ex.message)
        return {
            success: false,
            statusCode: 500,
            error: Ex,
            message: `Exception while getting on fetch total WishList for Doctor : ${Ex.message}`
        }
    }
}

export const addFavoritesToDocByUserService = async (userId, doctorId) => {
    try {
        const { bookAppointmentData: { patientFavoriteListCountOfDoctorIds, docFavoriteListCountOfDoctorIDs } } = store.getState();
        if (userId) {
            const reqData4updateWishList = {
                active: !patientFavoriteListCountOfDoctorIds.includes(doctorId)
            };
            const updateResponse = await updateFavoritesToDoctorByUser(userId, doctorId, reqData4updateWishList);
            //   console.log('updateResponse'+JSON.stringify(updateResponse));
            if (updateResponse.success) {
                if (reqData4updateWishList.active) {
                    docFavoriteListCountOfDoctorIDs[doctorId] = docFavoriteListCountOfDoctorIDs[doctorId] ? docFavoriteListCountOfDoctorIDs[doctorId] + 1 : 1
                    patientFavoriteListCountOfDoctorIds.push(doctorId)
                } else {
                    docFavoriteListCountOfDoctorIDs[doctorId] = docFavoriteListCountOfDoctorIDs[doctorId] ? docFavoriteListCountOfDoctorIDs[doctorId] - 1 : 0
                    const indexOfDoctorId = patientFavoriteListCountOfDoctorIds.indexOf(doctorId);
                    patientFavoriteListCountOfDoctorIds.splice(indexOfDoctorId, 1);
                }
                store.dispatch({
                    type: SET_PATIENT_FAVORITE_COUNTS_OF_DOCTOR_IDS,
                    data: patientFavoriteListCountOfDoctorIds
                })
                store.dispatch({
                    type: SET_DOC_FAVORITE_COUNTS_OF_DOCTOR_IDS,
                    data: docFavoriteListCountOfDoctorIDs
                })
            }
            return updateResponse;
        }
    }
    catch (Ex) {
        console.log('Ex is getting on update Wish list details for Doctor====>', Ex)
        return {
            success: false,
            statusCode: 500,
            error: Ex,
            message: `Exception while getting on update WishList for Doctor : ${Ex}`
        }
    }
}


export async function updateFavoritesToDoctorByUser(userId, doctorId, reqData4updateWishList) {
    try {
        const endPoint = 'user/wishList/' + userId + '/' + doctorId;
        const response = await putService(endPoint, reqData4updateWishList);
        const respData = response.data;
        return respData;
    }
    catch (Ex) {
        console.log('Ex is getting on update Wish list details for Doctor====>', Ex)
        return {
            success: false,
            statusCode: 500,
            error: Ex,
            message: `Exception while getting on update WishList for Doctor : ${Ex}`
        }
    }
}


/* Get Patient Total Favourite Doctors List  */
export const getFavoriteListCount4PatientService = async (userId) => {
    try {
        let endPoint = 'user/wishList/' + userId;
        let response = await getService(endPoint);
        let result = response.data;
        if (result.success) {
            let wishListDoctorsIds = [];
            result.data.forEach(element => {
                wishListDoctorsIds.push(element.doctorInfo.doctor_id)
            })
            store.dispatch({
                type: SET_PATIENT_FAVORITE_COUNTS_OF_DOCTOR_IDS,
                data: wishListDoctorsIds
            })
        }
        return result;
    } catch (e) {
        console.log(e.message);
        return {
            message: 'exception' + e,
            success: false
        }
    }
}