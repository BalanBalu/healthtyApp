import {Platform} from 'react-native';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';

export const API_URL = 'http://192.168.1.3:3200/api/';