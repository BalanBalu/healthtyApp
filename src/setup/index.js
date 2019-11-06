import React,{ Component }  from 'react';
import RoutesHome from './routes/appRouterHome';
//import RoutesLogin from './routes/appRouterLogin';
import { Provider } from 'react-redux';
import { store } from './store'
import { StyleProvider, Root, Toast } from 'native-base';
import getTheme from '../theme/components';
import material from '../theme/variables/material';
import { AsyncStorage, Alert } from 'react-native';
import { FIREBASE_SENDER_ID } from './config'
import { userFiledsUpdate } from '../modules/providers/auth/auth.actions';
//import firebase from 'react-native-firebase';
import { fetchUserMarkedAsReadedNotification } from '../../src/modules/providers/notification/notification.actions';
import NotifService from './NotifService';
export default class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        senderId: FIREBASE_SENDER_ID
      };
      this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  } 
  componentDidMount() {  
      setInterval(() => {
      this.getMarkedAsReadedNotification();
     },1000)
     //this.checkPermission();
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
 /* async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            console.log('fcmToken: ' +  fcmToken)
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }*/
  onRegister=async(token)=> {
    const userId = await AsyncStorage.getItem('userId');
    const isDeviceTokenUpdated = await AsyncStorage.getItem('isDeviceTokenUpdated');
    let deviceToken=token.token;
if(isDeviceTokenUpdated !='true' && userId !=null){
  if (deviceToken != null) this.updateDeviceToken(userId, deviceToken);  // update Unique Device_Tokens 
}
  }

  updateDeviceToken = async (userId, deviceToken) => {
    try {
      let requestData = {
        device_token: deviceToken,
      }
      let response = await userFiledsUpdate(userId, requestData);
      // console.log('device_token response'+JSON.stringify(response));
      if (response.success) {
        await AsyncStorage.setItem('isDeviceTokenUpdated', 'true');
        Toast.show({
          text: 'Device Token updated successfully',
          type: "success",
          duration: 1000
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  onNotif(notif) {
    console.log(notif);
    Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    Alert.alert("Permissions", JSON.stringify(perms));
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