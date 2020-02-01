import { Platform } from 'react-native';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';
export const API_URL = 'http://localhost:3000/api/';
export const CATEGORY_BASE_URL = API_URL.substring(0, API_URL.length - 4) + 'images/category/';
export const CHAT_API_URL = 'https://medflic.com:3200';

export const MAP_BOX_TOKEN = 'sk.eyJ1IjoidmFpcmFpc2F0aGlzaCIsImEiOiJjand4NWV2djQwZGFkNDNtejhkYXVwbW0zIn0.SxLkBv_NwpDKUIl-e499rg';
export const MAP_BOX_PUBLIC_TOKEN = 'pk.eyJ1IjoidmFpcmFpc2F0aGlzaCIsImEiOiJjanZhMjBrZHMwdW16NGVtamFhNnE4aDIwIn0.s629-J2w7AeQITCLhdl0pw'
export const RAZOR_KEY = 'rzp_live_W02W7tRBxZMRsk';
export const BASIC_DEFAULT = {
    email : 'sathishkrish20@gmail.com',
    mobile_no: '9164932823'
}
export const FIREBASE_SENDER_ID = "607089059424";
export const SERVICE_TYPES = {
    APPOINTMENT: 'APPOINTMENT',
    CHAT:'CHAT'
}
export const MAX_DISTANCE_TO_COVER = 30000; // in meters Doctor Can be search Within in the AREA
export const MAX_PERCENT_APPLY_BY_CREDIT_POINTS = 25;