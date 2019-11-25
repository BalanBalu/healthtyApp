import { Platform } from 'react-native';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';
export const API_URL = 'http://medflic-1802539957.ap-south-1.elb.amazonaws.com:3000/api/';
export const CATEGORY_BASE_URL = API_URL.substring(0, API_URL.length - 4) + 'images/category/';
export const CHAT_API_URL = 'http://medflic-1802539957.ap-south-1.elb.amazonaws.com:3200';

export const MAP_BOX_TOKEN = 'sk.eyJ1IjoidmFpcmFpc2F0aGlzaCIsImEiOiJjand4NWV2djQwZGFkNDNtejhkYXVwbW0zIn0.SxLkBv_NwpDKUIl-e499rg';
export const MAP_BOX_PUBLIC_TOKEN = 'pk.eyJ1IjoidmFpcmFpc2F0aGlzaCIsImEiOiJjanZhMjBrZHMwdW16NGVtamFhNnE4aDIwIn0.s629-J2w7AeQITCLhdl0pw'
export const RAZOR_KEY = 'rzp_test_Cq2ADxwBVYKNlL';
export const BASIC_DEFAULT = {
    email : 'sathishkrish20@gmail.com',
    mobile_no: '9164932823'
}
export const FIREBASE_SENDER_ID = "607089059424";
export const SERVICE_TYPES = {
    APPOINTMENT: 'APPOINTMENT',
    CHAT:'CHAT'
}

