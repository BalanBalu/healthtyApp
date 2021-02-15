import React from 'react';
import {
  AsyncStorage, Text, View
} from 'react-native';
import { setUserLocally, APP_LOADED } from '../../modules/providers/auth/auth.actions';
import { store } from '../store';
import {primaryColor} from '../../setup/config'

import SplashScreen from 'react-native-splash-screen';
import {CURRENT_APP_NAME,MY_SMART_HEALTH_CARE,MY_MEDFLIC} from '../config';

class AuthLoadingScreen extends React.Component {
   constructor (props) {
    super(props);
    this.state = {
      CorporateUser: false
  };
    this._bootstrapAsync();
  }
  
  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const token = await AsyncStorage.getItem('token')
    if (token && token !== 'undefined' && token !== '') {
      user = JSON.parse(await AsyncStorage.getItem('user'));
      if (user) {
        await setUserLocally(token, user);
      }
    }
    const isCorporateUser = await AsyncStorage.getItem('is_corporate_user') === 'true';
    this.setState({ CorporateUser:isCorporateUser })
   
    this.props.navigation.navigate(CURRENT_APP_NAME === MY_MEDFLIC?'App':CURRENT_APP_NAME === MY_SMART_HEALTH_CARE&&token?'SmApp':'Auth');
    
    SplashScreen.hide();
    store.dispatch({
      type: APP_LOADED
    })
  };



  render() {
     return <View 
        style={{
         flex: 1,
         justifyContent: 'center',
         alignItems: 'center',
         backgroundColor: primaryColor
       }}>
     </View>
  }
}

export default AuthLoadingScreen;