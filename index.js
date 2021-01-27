/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry } from 'react-native';
import App from './src/setup';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import pushBackgroud from './src/setup/backgroundpush'
messaging().setBackgroundMessageHandler(async remoteMessage => pushBackgroud(remoteMessage));
AppRegistry.registerComponent(appName, () => App);
