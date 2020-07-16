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
  export async function forumInsertAnswer(data) {
    try {
      let endPoint = '/publicforum/answer';
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
  export async function getAllPublicForumDetails() {
    try {
      let endPoint = '/getAllPublicForumDetails/' ;
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
  export async function getForumQuestionAndAnswerDetails(questionId) {
    try {
      let endPoint = '/getForumQuestionAndAnswerDetails/' + questionId;
      console.log(endPoint);
      let response = await postService(endPoint);
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
  export async function searchSuggestionsForQuestionsAndAnswers(keyword) {
    try {
      let endPoint = '/publicforum/getSuggestionsFromQuestionsAndAnswers/' + keyword;
      console.log(endPoint);
      let response = await postService(endPoint);
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
 