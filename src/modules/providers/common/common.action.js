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
    var formData = new FormData();
    if (Array.isArray(imageData) && imageData.length != 0) {
      imageData.map((ele) => {
        formData.append(appendForm||'medicine', {
          uri: ele.path,
          type: 'image/jpeg',
          name: 'photo.jpg'
        });
      });
    } else {
      formData.append(appendForm||'medicine', {
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
    let respData = response.data;
    return respData;
  }
  catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}


