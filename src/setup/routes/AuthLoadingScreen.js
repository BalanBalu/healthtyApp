import React from 'react';
import {
  AsyncStorage, Text
} from 'react-native';
import { setUserLocally } from '../../modules/providers/auth/auth.actions';
import { store } from '../store';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
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
   
    console.log('authloading router')
   
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
   
    this.props.navigation.navigate(token ? 'App' : 'App');
  };
  render() {


    const data = store.getState().notification.notificationCount;
    console.log(data)
    console.log('.............................................')
    // return null;
    return (
      < Text style={{ position: 'absolute', backgroundColor: 'red', color: 'white', borderRadius: 20, marginLeft: 10, padding: 2, marginTop: -7 }
      }> {data}</Text >
    )
  }
}
export default AuthLoadingScreen;