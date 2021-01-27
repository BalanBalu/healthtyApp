import {getService, postService} from '../../../setup/services/httpservices';
import { store } from '../../../setup/store';
import axios from 'axios';
export const FORUM_RESPONSE = 'FORUM/FORUM_RESPONSE'
export const FORUM_ERROR = 'FORUM/CATAGRIES_ERROR'
export async function forumInsertQuestion(data) {
    try {
      let endPoint = '/publicforum/question';
      let response = await postService(endPoint,data);
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
      let response = await postService(endPoint,data);
      let respData = response.data;
      return respData;
    } catch (e) {
      return {
        message: 'exception' + e,
        success: false
      }
    }
  }
  export async function getAllPublicForumDetails(inputText,skip,limit) {
    try {
          let endPoint = '/getAllPublicForumDetails?q=1';
          if (inputText) {
            endPoint = endPoint + '&searchQuery=' + inputText;
          }
          if (skip) {
            endPoint = endPoint + '&skip=' + skip;
          }
          if (limit) {
            endPoint = endPoint + '&limit=' + limit;
          }
        let response = await getService(endPoint);
        let respData = response.data;
        store.dispatch({
          type: FORUM_RESPONSE,
          isLoading: false,
          success: true,
          message: respData.message
        })
      return respData;
    } catch (e) {
      store.dispatch({
        type: FORUM_ERROR,
        message: e
      });
    }
  }
  
  export async function getForumQuestionAndAnswerDetails(questionId) {
    try {
      let endPoint = '/getForumQuestionAndAnswerDetails/' + questionId;
      let response = await postService(endPoint);
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
      let response = await postService(endPoint);
      let respData = response.data;
      return respData;
    } catch (e) {
      return {
        message: 'exception' + e,
        success: false
      }
    }
  }
 