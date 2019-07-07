import {Platform} from 'react-native';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';

export const API_URL = 'http://10.12.0.204:8080/api/';