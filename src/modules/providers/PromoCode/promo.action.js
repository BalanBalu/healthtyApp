export const getPromodataList= async (data)=>{
    try {
    let endPoint = "/admin/promoCode";
    let response =  await postService(endPoint,data);
    console.log("response"+response)
    console.log(JSON.stringify(response))
    let resData = response.data
    console.log(JSON.stringify(resData))
    return resData
}
catch(e){
    return{
        message: "exception" + e,
        success: false
    }
}
}