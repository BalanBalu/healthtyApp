import React from 'react';
import {
  AsyncStorage, Text, View
} from 'react-native';
import { setUserLocally, APP_LOADED } from '../../modules/providers/auth/auth.actions';
import { store } from '../store';
import SplashScreen from 'react-native-splash-screen';
import {CURRENT_APP_NAME,MY_SMART_HEALTH_CARE} from '../config'
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
    let  user=null
    if (token && token !== 'undefined' && token !== '') {
       user = JSON.parse(await AsyncStorage.getItem('user'))
      if (user) {
        await setUserLocally(token, user);
      }
    }
    const isCorporateUser = await AsyncStorage.getItem('is_corporate_user') === 'true';
    this.setState({ CorporateUser:isCorporateUser })
    const { CorporateUser } = this.state
    if (CURRENT_APP_NAME === MY_SMART_HEALTH_CARE) {
      if (CorporateUser === true) {
        this.props.navigation.navigate('CorporateHome');
      } if (user) {
        this.props.navigation.navigate('Home'); 
      } else {
        this.props.navigation.navigate('login');
      }
    }else {
      this.props.navigation.navigate('Home');  
    }
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