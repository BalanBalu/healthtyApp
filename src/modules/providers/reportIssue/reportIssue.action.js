import { postService, getService, putService } from '../../../setup/services/httpservices';

export async function insertReportIssue(data = true) {
  try {

    let endPoint = '/report';

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
export async function upDateReportIssue(reportedId, replyProviderId, data, isLoading = true) {
  try {

    let endPoint = '/report/' + reportedId + '/' + replyProviderId;

    let response = await putService(endPoint, data);
  
    let respData = response.data;
    return respData;
  } catch (e) {
    return {
      message: 'exception' + e,
      success: false
    }
  }
}
export async function getUserRepportDetails(type, reporterId, reportedId, replyData) {
  try {
    let endPoint = 'report/' + type + '/' + reporterId + '/' + reportedId;
    if (replyData == true) {
      endPoint += '?replyData=1'
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
