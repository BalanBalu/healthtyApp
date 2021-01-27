import { NavigationActions } from 'react-navigation';
import * as React from 'react';
let _container; // eslint-disable-line

const isMountedRef = React.createRef();
const navigationRef = React.createRef();

function setContainer(container) {
  _container = container;
}

function getContainerRef() {
  return isMountedRef.current && navigationRef.current 
}
function navigate(routeName, params) {
    if (isMountedRef.current && navigationRef.current) {
      navigationRef.current.dispatch(
        NavigationActions.navigate({
          type: 'Navigation/NAVIGATE',
          routeName,
          params,
        }));
      return true;
   } else {
      return false; 
   }
}

export default {
  setContainer,
  navigate,
  getContainerRef,
  isMountedRef,
  navigationRef,
  

};