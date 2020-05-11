/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry, NativeModules} from 'react-native';
import App from './src/setup';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import rootNavigation from './src/setup/rootNavigation';
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    if(remoteMessage.data && remoteMessage.data.videoNotification == '1') {
       // rootNavigation.navigate('Home');
    }
    Promise.resolve();
});
AppRegistry.registerComponent(appName, () => App);
