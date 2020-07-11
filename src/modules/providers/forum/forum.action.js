import {getService, postService} from '../../../setup/services/httpservices';

export async function forumInsertQuestion(data) {
    try {
      let endPoint = '/publicforum/question';
      console.log(endPoint);
      let response = await postService(endPoint,data);
      console.log('response', response);
      let respData = response.data;
      return respData;
    } catch (e) {
      return {
        message: 'exception' + e,
        success: false
      }
    }
  }