import { Platform } from 'react-native';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';

export const API_URL = 'http://192.168.1.3:3000/api/';
export const CATEGORY_BASE_URL = API_URL.replace('/api/', '/') + 'images/category/'
export const MAP_BOX_TOKEN = 'sk.eyJ1IjoidmFpcmFpc2F0aGlzaCIsImEiOiJjand4NWV2djQwZGFkNDNtejhkYXVwbW0zIn0.SxLkBv_NwpDKUIl-e499rg';
export const MAP_BOX_PUBLIC_TOKEN = 'pk.eyJ1IjoidmFpcmFpc2F0aGlzaCIsImEiOiJjanZhMjBrZHMwdW16NGVtamFhNnE4aDIwIn0.s629-J2w7AeQITCLhdl0pw'
export const RAZOR_KEY = 'rzp_test_Cq2ADxwBVYKNlL';
export const BASIC_DEFAULT = {
    email : 'sathishkrish20@gmail.com',
    mobile_no: '9164932823'
}
