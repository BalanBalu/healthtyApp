import React from 'react';
import {
  AsyncStorage, Text, View
} from 'react-native';
import { setUserLocally, APP_LOADED } from '../../modules/providers/auth/auth.actions';
import { store } from '../store';
import SplashScreen from 'react-native-splash-screen';
class AuthLoadingScreen extends React.Component {
   constructor (props) {
    super(props);
    this._bootstrapAsync();
  }
  
  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const token = await AsyncStorage.getItem('token')
    if (token && token !== 'undefined' && token !== '') {
      const user = JSON.parse(await AsyncStorage.getItem('user'))
      if (user) {
        await setUserLocally(token, user);
      }
    }
    this.props.navigation.navigate(token ? 'App' : 'App');
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
         backgroundColor: '#7357a2'
       }}>
     </View>
  }
}

export default AuthLoadingScreen;