// Actions Types
import { uploadMultiPart } from '../../../setup/services/httpservices';
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
    console.log(imageData)
    if (Array.isArray(imageData) && imageData.length != 0) {
      imagePath.map((ele) => {
        formData.append(appendForm, {
          uri: ele.path,
          type: 'image/jpeg',
          name: 'photo.jpg'
        });
      });
    } else {
      formData.append(appendForm, {
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

