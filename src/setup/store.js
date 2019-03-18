import { compose, combineReducers } from 'redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import user from '../modules/providers/auth/auth.reducer';
import common from '../modules/providers/common/common.reducer';
const rootReducer = combineReducers({
    user,
    common
    
});

export const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk),
    )
  )
  //console.log(store.getState());