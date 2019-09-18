import React,{ Component }  from 'react';
import RoutesHome from './routes/appRouterHome';
//import RoutesLogin from './routes/appRouterLogin';
import { Provider } from 'react-redux';
import { store } from './store'
import { StyleProvider, Root } from 'native-base';
import getTheme from '../theme/components';
import material from '../theme/variables/material';
import { AsyncStorage, Text } from 'react-native';
import { setDoctorLocally } from '../modules/providers/auth/auth.actions';

import { fetchUserNotification, UpDateUserNotification, fetchUserMarkedAsReadedNotification } from '../../src/modules/providers/notification/notification.actions';
export default class App extends Component {
    constructor(props) {
      super(props);
  } 
  componentDidMount() {
      setInterval(() => {
      this.getMarkedAsReadedNotification();
     },1000)
   
  }

  getMarkedAsReadedNotification = async () => {
    try {
      let userId = await AsyncStorage.getItem('userId');
     
      fetchUserMarkedAsReadedNotification(userId);
    }
    catch (e) {
      console.log(e)
    }
  
  }
  render() {
   
   
      return (
       
      
        <Provider store={store} key="provider">
        <Root>   
        <StyleProvider style={getTheme(material)}>
            <RoutesHome />
          
           </StyleProvider>  
           </Root>
        </Provider>
      )
    }
  }