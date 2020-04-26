import { compose, combineReducers } from 'redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import user from '../modules/providers/auth/auth.reducer';
import chat from '../modules/providers/chat/chat.reducer';
import common from '../modules/providers/common/common.reducer';
import profile from '../modules/providers/profile/profile.reducer';
import bookappointment from '../modules/providers/bookappointment/bookappointment.reducer';
import notification from '../modules/providers/notification/notification.reducer';
import reminder from '../modules/providers/reminder/reminder.reducer'
const rootReducer = combineReducers({
    user,
    common,
    profile,
    bookappointment,
    notification,
    chat,
    reminder
});

export const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk),
    )
  )
  //console.log(store.getState());