import { Platform } from 'react-native';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';

/*** Change ON Prod Start ***/

export const API_URL = 'https://medflic-api.aopks.com/api/';
export const CATEGORY_BASE_URL = API_URL.substring(0, API_URL.length - 4) + 'images/category/';
export const CHAT_API_URL = 'https://chat-qa-api.aopks.com';

export const MAP_BOX_TOKEN = 'sk.eyJ1IjoidmFpcmFpc2F0aGlzaCIsImEiOiJjand4NWV2djQwZGFkNDNtejhkYXVwbW0zIn0.SxLkBv_NwpDKUIl-e499rg';
export const MAP_BOX_PUBLIC_TOKEN = 'pk.eyJ1IjoidmFpcmFpc2F0aGlzaCIsImEiOiJjanZhMjBrZHMwdW16NGVtamFhNnE4aDIwIn0.s629-J2w7AeQITCLhdl0pw'
export const RAZOR_KEY = 'rzp_test_HoaTilDmiHfZnE';
export const FIREBASE_SENDER_ID = "630872953526";
export const CONNECTY_CUBE = [{
    appId: 2051,
    authKey: 'hmpBVUDtnMBEry-',
    authSecret: '9bdGzyhSuGGRwOt',
  },
  {
    debug: {
        mode: 0
    },
  }
]
export const CURRENT_PRODUCT_VERSION_CODE = 18;

/*** Change ON Prod End ***/
export const ANDROID_BUNDLE_IDENTIFIER = 'com.ads.medflic';
export const ANDROID_VIDEO_CALL_ACTIVITY_NAME = 'ExampleActivity'
export const BASIC_DEFAULT = {
    email : 'sathishkrish20@gmail.com',
    mobile_no: '9164932823'
}

export const SERVICE_TYPES = {
    APPOINTMENT: 'APPOINTMENT',
    CHAT:'CHAT',
    PHARMACY: 'PHARMACY',
    VIDEO_CONSULTING: 'VIDEO_CONSULTING',
    LAB_TEST: 'LAB_TEST'
}
export const MAX_DISTANCE_TO_COVER = 30000; // in meters Doctor Can be search Within in the AREA
export const PHARMACY_MAX_DISTANCE_TO_COVER = 10000;
export const MAX_PERCENT_APPLY_BY_CREDIT_POINTS = 25;

