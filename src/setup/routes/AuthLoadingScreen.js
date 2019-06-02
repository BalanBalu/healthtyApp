import React from 'react';
import {
  AsyncStorage,
} from 'react-native';
import { setUserLocally  } from '../../modules/providers/auth/auth.actions';

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
    return null;
  }
}
export default AuthLoadingScreen;