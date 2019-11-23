// App Imports
import { SET_LAST_MESSAGES_DATA } from './chat.action'

// Initial State
export const commonInitialState = {
    myChatList: []
}

// State
export default (state = commonInitialState, action) => {
  switch (action.type) {
    case SET_LAST_MESSAGES_DATA:
      return {
        ...state,
        myChatList: sortChatListByUpdatedDate(action.data)
    
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
       console.log(lastUpdatedDateA);
       console.log(lastUpdatedDateB);
       return new Date(lastUpdatedDateB) - new Date(lastUpdatedDateA)
    })
    
}