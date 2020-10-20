// Actions Types
import { uploadMultiPart,postService } from '../../../setup/services/httpservices';
export const MESSAGE_SHOW = 'COMMON_MESSAGE_SHOW'
export const MESSAGE_HIDE = 'COMMON_MESSAGE_HIDE'

// Actions
export function messageShow(message) {
  return { type: MESSAGE_SHOW, message }
}

export function messageHide() {
  return { type: MESSAGE_HIDE }
}
export async function uploadImage(imageData, endPoint, appendForm) {
  try {
    console.log('endpoiint===========')
    console.log(endPoint)
    var formData = new FormData();
    console.log(imageData)
    if (Array.isArray(imageData) && imageData.length != 0) {
      imagePath.map((ele) => {
        formData.append('medicine', {
          uri: ele.path,
          type: 'image/jpeg',
          name: 'photo.jpg'
        });
      });
    } else {
      formData.append('medicine', {
        uri: imageData.path,
        type: 'image/jpeg',
        name: 'photo.jpg'
      });
    }


    var res = await uploadMultiPart(endPoint, formData);

    return res.data

  } catch (e) {

    return {
      message: 'exception' + e,
      success: false
    }
  }
}



export async function createEmrUpload(data, isLoading = true) {
  try {
    let endPoint = '/electrical_medical_records';
    let response = await postService(endPoint, data);
    console.log('response' + response);
    let respData = response.data;
    console.log('respData' + JSON.stringify(respData));

    return respData;
  }
  catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}


