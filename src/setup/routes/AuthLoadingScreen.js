import React from 'react';
import {
  AsyncStorage, Text, View
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
      // <View style={{ marginTop: -40, }}>
    <View>
        {data != null ?
          < Text style={{ position: 'absolute', backgroundColor: 'red', color: 'white', borderRadius: 5, height: 20, textAlign: 'center' }
          }> {data}</Text > : null}</View>
    )
  }
}

export default AuthLoadingScreen;