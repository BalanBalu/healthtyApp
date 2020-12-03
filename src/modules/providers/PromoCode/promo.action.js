import { getService, putService,postService } from '../../../setup/services/httpservices';


export const getPromodataList = async (data) => { 
    try {
    let endPoint = "admin/promo_code";
    let response =  await getService(endPoint);
    let resData = response.data
    return resData
}
catch(e){
    return{
        message: "exception" + e,
        success: false
    }
}
}


export const validatePromoCode = async (data) => { 
    try {
    let endPoint = "admin/promo_code/validate";
    let response =  await postService(endPoint,data);
    let resData = response.data
    return resData
}
catch(e){
    return{
        message: "exception" + e,
        success: false
    }
}
}

export const applyPromoCode = async (data) => { 
    try {
    let endPoint = "admin/promo_code/apply";
    let response =  await postService(endPoint,data);
    let resData = response.data
    return resData
}
catch(e){
    return{
        message: "exception" + e,
        success: false
    }
}
}

export const getPromodataLists = async (data) => { 
    try {
    let endPoint = "/admin/promoCode";
    let response =  await postService(endPoint,data);
    let resData = response.data
    return resData
}
catch(e){
    return{
        message: "exception" + e,
        success: false
    }
}
}

