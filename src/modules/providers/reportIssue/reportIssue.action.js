import { postService, getService, putService} from '../../../setup/services/httpservices';

export async function insertReportIssue(userId,data, isLoading = true) {
    try {
      
      let endPoint = 'report/' + userId;
      
      let response = await postService(endPoint, data);
        console.log(response)
      let respData = response.data;
      return respData;
    } catch (e) {
      return {
        message: 'exception' + e,
        success: false
      }
    }
  }
  