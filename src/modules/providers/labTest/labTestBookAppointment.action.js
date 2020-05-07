import { getService, putService } from '../../../setup/services/httpservices';

export const SET_PATIENT_WISH_LIST_LAB_IDS = 'LAB/SET_PATIENT_WISH_LIST_LAB_IDS';
export const SET_WISHLIST_LAB_COUNT_BY_IDS = 'LAB/SET_WISHLIST_LAB_COUNT_BY_IDS';
export const SET_REVIEWS_COUNT_BY_LAB_IDS = 'LAB/SET_REVIEWS_COUNT_BY_LAB_IDS';
export const SET_SINGLE_LAB_ITEM_DATA = 'LAB/SET_SINGLE_LAB_ITEM_DATA';
import { store } from '../../../setup/store';



export const getTotalReviewsCount4LabTestService = async (labIds) => {
    try {
        const endPoint = 'lab-test/user/reviewsCount/' + labIds;
        const response = await getService(endPoint);
        const reviewCountRes = response.data;
        if (reviewCountRes.success) {
            const { LabTestData: { reviewCountsByLabIds } } = store.getState();
            const reviewCountList = reviewCountRes.data;
            if (reviewCountList.length != 0) {
                for (i = 0; i < reviewCountList.length; i++) {
                    reviewCountsByLabIds[reviewCountList[i]._id] = reviewCountList[i];
                }
            }
            store.dispatch({
                type: SET_REVIEWS_COUNT_BY_LAB_IDS,
                data: reviewCountsByLabIds
            })
            // console.log('reviewCountsByLabIds=====>', reviewCountsByLabIds);
        }
        return reviewCountRes;

    } catch (Ex) {
        console.log('Ex is getting on get Reviews count for Lab====>', Ex)
        return {
            success: false,
            statusCode: 500,
            error: Ex,
            message: `Exception while getting on Reviews count for Lab : ${Ex}`
        }
    }
}



export const getTotalWishList4LabTestService = async (labId) => {
    try {
        const endPoint = 'lab-test/wishList/' + labId;
        const response = await getService(endPoint);
        const favoritesList = response.data;
        if (favoritesList.success) {
            wishListCountByLabIds = {};
            for (i = 0; i < favoritesList.data.length; i++) {
                labId = favoritesList.data[i].wishList.lab_id;
                wishListCountByLabIds[labId] = wishListCountByLabIds[labId] ? wishListCountByLabIds[labId] + 1 : 1
            }
            store.dispatch({
                type: SET_WISHLIST_LAB_COUNT_BY_IDS,
                data: wishListCountByLabIds
            })
        }
        return favoritesList;
    }
    catch (Ex) {
        console.log('Ex is getting on fetch total WishList for Lab====>', Ex)
        return {
            success: false,
            statusCode: 500,
            error: Ex,
            message: `Exception while getting on fetch total WishList for Lab : ${Ex}`
        }
    }
}
export const addFavoritesToLabByUserService = async (userId, labId) => {
    try {
        const { LabTestData: { patientWishListLabIds, wishListCountByLabIds } } = store.getState();
        if (userId) {
            const reqData4updateWishList = {
                active: !patientWishListLabIds.includes(labId)
            };
            const updateResponse = await updateFavoritesToLabByUser(userId, labId, reqData4updateWishList);
            //   console.log('updateResponse'+JSON.stringify(updateResponse));
            if (updateResponse.success) {
                if (reqData4updateWishList.active) {
                    wishListCountByLabIds[labId] = wishListCountByLabIds[labId] ? wishListCountByLabIds[labId] + 1 : 1
                    patientWishListLabIds.push(labId)
                } else {
                    wishListCountByLabIds[labId] = wishListCountByLabIds[labId] ? wishListCountByLabIds[labId] - 1 : 0
                    const indexOfLabId = patientWishListLabIds.indexOf(labId);
                    patientWishListLabIds.splice(indexOfLabId, 1);
                }
                store.dispatch({
                    type: SET_PATIENT_WISH_LIST_LAB_IDS,
                    data: patientWishListLabIds
                })
                store.dispatch({
                    type: SET_WISHLIST_LAB_COUNT_BY_IDS,
                    data: wishListCountByLabIds
                })
            }
            return updateResponse;
        }
    }
    catch (Ex) {
        console.log('Ex is getting on update Wish list details for Lab====>', Ex)
        return {
            success: false,
            statusCode: 500,
            error: Ex,
            message: `Exception while getting on update WishList for Lab : ${Ex}`
        }
    }
}

export async function updateFavoritesToLabByUser(userId, labId, reqData4updateWishList) {
    try {
        const endPoint = 'lab-test/user/wishList/' + userId + '/' + labId
        const response = await putService(endPoint, reqData4updateWishList);
        const respData = response.data;
        return respData;
    }
    catch (Ex) {
        console.log('Ex is getting on update Wish list details for Lab====>', Ex)
        return {
            success: false,
            statusCode: 500,
            error: Ex,
            message: `Exception while getting on update WishList for Lab : ${Ex}`
        }
    }
}


/* Get Patient total Favorites LabTest list  */
export const getWishList4PatientByLabTestService = async (userId) => {
    try {
        const endPoint = 'lab-test/user/wishList/' + userId;
        const response = await getService(endPoint);
        // console.log('getPatientWishList response===>', response);
        const result = response.data;
        if (result.success) {
            const wishListLabIdsArry = result.data.map(item => item.labInfo.lab_id)
            // console.log('wishListLabIdsArry  map=====>', wishListLabIdsArry);
            store.dispatch({
                type: SET_PATIENT_WISH_LIST_LAB_IDS,
                data: wishListLabIdsArry
            })
        }
        return result;
    } catch (Ex) {
        console.log('Ex is getting on get Wish list details for Patient====>', Ex)
        return {
            success: false,
            statusCode: 500,
            error: Ex,
            message: `Exception while getting on WishList for Patient : ${Ex}`
        }
    }
}