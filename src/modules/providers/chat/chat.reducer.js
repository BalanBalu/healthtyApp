// App Imports
import { SET_LAST_MESSAGES_DATA, SET_VIDEO_SESSION, 
  SET_INCOMING_VIDEO_CALL, RESET_INCOMING_VIDEO_CALL, 
   SET_USER_LOOGED_IN_CONNECTYCUBE, 
   SET_INCOMING_VIDEO_CALL_VIA_BACKGROUND, RESET_INCOMING_VIDEO_CALL_VIA_BACKGROUND, SET_ON_VIDEO_SCREEN
  } from './chat.action'
// Initial State
export const commonInitialState = {
    myChatList: [],
    session: null,
    incomingVideoCall: false,
    onPressReject: false,
    onPressAccept: false,
    loggedIntoConnectyCube: false,
    incomingVideoCallViaBackgrondState: false,
    onVideoScreen: false
}

// State
export default (state = commonInitialState, action) => {
  switch (action.type) {
    case SET_LAST_MESSAGES_DATA:
      return {
        ...state,
        myChatList: sortChatListByUpdatedDate(action.data)
    
      }
    case SET_VIDEO_SESSION:
    
      return {
        ...state,
        session: action.data
      }
    case SET_INCOMING_VIDEO_CALL:
      
      if(action.data) {
        return {
          ...state,
          incomingVideoCall: true
        }
      }

      
      case RESET_INCOMING_VIDEO_CALL: 
        return {
         ...state,
         incomingVideoCall: false,
        } 
      case SET_USER_LOOGED_IN_CONNECTYCUBE: 
        return {
         ...state,
         loggedIntoConnectyCube: true,
      } 
      case SET_INCOMING_VIDEO_CALL_VIA_BACKGROUND: 
        return {
         ...state,
         incomingVideoCallViaBackgrondState: true,
      }
      case RESET_INCOMING_VIDEO_CALL_VIA_BACKGROUND: 
        return {
         ...state,
         incomingVideoCallViaBackgrondState: false,
      }
      case SET_ON_VIDEO_SCREEN: 
        return {
         ...state,
         onVideoScreen: action.data,
      }
        
    default:
      return state
  }
}


sortChatListByUpdatedDate = (data) => {
   return data.sort((a, b) => {
       let lastUpdatedDateA;
       let lastUpdatedDateB;
       if(a.conversationLstSnippet && a.conversationLstSnippet.messages && a.conversationLstSnippet.messages[0]) {
        lastUpdatedDateA = a.conversationLstSnippet.messages[0].created_at
       } else {
        lastUpdatedDateA = a.last_chat_updated;
       }
       if(b.conversationLstSnippet && b.conversationLstSnippet.messages && b.conversationLstSnippet.messages[0]) {
        lastUpdatedDateB = b.conversationLstSnippet.messages[0].created_at
       } else {
        lastUpdatedDateB = b.last_chat_updated;
       }
       return new Date(lastUpdatedDateB) - new Date(lastUpdatedDateA)
    })
    
}