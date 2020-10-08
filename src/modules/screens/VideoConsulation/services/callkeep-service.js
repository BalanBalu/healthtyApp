import RNCallKeep from 'react-native-callkeep';
import { PermissionsAndroid, AppState, Alert, NativeModules , NativeEventEmitter } from 'react-native'
import { IS_ANDROID, ANDROID_BUNDLE_IDENTIFIER, IS_IOS, ANDROID_VIDEO_CALL_ACTIVITY_NAME } from '../../../../setup/config';
import RootNavigation from '../../../../setup/rootNavigation';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../../../../setup/store';
import { SET_INCOMING_VIDEO_CALL, SET_INCOMING_VIDEO_CALL_VIA_BACKGROUND } from '../../../providers/chat/chat.action';
import SajjadLaunchApplication  from 'react-native-launch-application';
import PushNotification from 'react-native-push-notification';
import NotifService from '../../../../setup/NotifService';
const INCOMING_CALL_SCREEN_THRESHHOLD_API_VERSION = 28;
let activityStarter;
let eventEmitter;
if(IS_ANDROID) {
     activityStarter = NativeModules.ActivityStarter;
     eventEmitter = new NativeEventEmitter(activityStarter);
}
const CALL_SCREEN_ACTIONS = {
    ACCEPTED: 'ACCEPTED',
    DECLINED: 'DECLINED'
} 
const randomNumber = () => {
    const possible = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let rand = '';
    for (var i = 1; i <= 25; i++) {
        if(i % 5 === 0) {
            rand += '-';
        }
        rand += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return rand;
}

export default class CallKeepService {

  setupCallkeep = async() => {
    try {
      if (IS_IOS) {
        RNCallKeep.setup({
            ios: {
              appName: 'Medflic',
              supportsVideo: true,
            },
            android: {
              alertTitle: 'Permissions required',
              alertDescription: 'Medflic is need a Permission to Show the Incoming Video Call Request',
              cancelButton: 'Cancel',
              okButton: 'ok',
              additionalPermissions: [ PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.SYSTEM_ALERT_WINDOW, PermissionsAndroid.PERMISSIONS.USE_FULL_SCREEN_INTENT ]
            },
        }).then((res) => {
            console.log('res of Permission '+ res);
        }).catch(err => {
            console.log('Errror Permission '+ err);
        })
      }
     if (IS_ANDROID) {
            console.log('hasAlreadyPermissionGrantedToShowVideoScreen ', await activityStarter.hasAlreadyPermissionGrantedToShowVideoScreen());
            if(await activityStarter.hasAlreadyPermissionGrantedToShowVideoScreen() === false) {
                console.log('Overlay Permission False, So Requesting Once');
                Alert.alert(
                    "Permission to Display Incoming Call Screen",
                    "Medflic Requires a Permission to Display Incoming Call Screen for Video Consultation Service",
                    [{
                        text: "Ok", 
                        onPress: () => {
                            console.log('OK Pressed')
                            activityStarter.getPermissionForOverLay();
                        }
                    }],
                    { cancelable: false }
                );
            }
        }

    } catch (error) {
           console.error('Error while Setting to be Available ', error)
        }
        this.setupListeners();
     
    }

    displayIncomingCall = async (handleNumber, handlerName) => {
        this.uuid = IS_ANDROID ? randomNumber() : uuidv4();
        this.handleNumber = handleNumber;
        this.handlerName = handlerName;
        console.log('AppState.currentState: ==> ', AppState.currentState);
        if(AppState.currentState === 'active') {
            if(IS_IOS) {   // Enable THese Condition when we set for Cusotm Activity once all of them tested
                store.dispatch({
                    type: SET_INCOMING_VIDEO_CALL,
                    data: true
                })
            } else if(IS_ANDROID && await activityStarter.getActivityNameAsPromise() !== ANDROID_VIDEO_CALL_ACTIVITY_NAME) {
                store.dispatch({
                    type: SET_INCOMING_VIDEO_CALL,
                    data: true
                })
            }
        } else {
            console.log('Is IS_ANDROID ', IS_ANDROID);
            if(IS_ANDROID) {
                console.log('...Coming to Correct Condition with Background....' + AppState.currentState);
                const buildAPIVersion = await activityStarter.androidBuildAPIVersion();
                console.log(buildAPIVersion);
            
                if(buildAPIVersion >= INCOMING_CALL_SCREEN_THRESHHOLD_API_VERSION) {
                    console.log(`Android API Version ${INCOMING_CALL_SCREEN_THRESHHOLD_API_VERSION} or Higher`)
                    NotifService.localNotif('Medflic: New Video Call from Doctor', 'Doctor is Calling You', {
                        tag: 'VIDEO_NOTIFICATION',
                        ongoing: true,
                        fullScreenIntent: true
                    });
                } else {
                    if (RootNavigation.getContainerRef()) {
                        console.log('Navigation Container is already Present....');
                        PushNotification.navigateToIncomingCallScreen();
                    } else {
                        SajjadLaunchApplication.open(ANDROID_BUNDLE_IDENTIFIER);
                        console.log('Navigation Container is  Not Present....');
                        var interval = setInterval(() => {
                            if (RootNavigation.getContainerRef()) {
                                console.log('Excuting to Navigate To Video Screen...');
                                PushNotification.navigateToIncomingCallScreen();
                                clearInterval(interval);
                            }
                        },100);
                        console.log('Excuting on Android with ' +  AppState.currentState);
                    }
                }
            } else {
                RNCallKeep.displayIncomingCall(this.uuid, String(handleNumber), 'Medflic Doctor', 'generic', true );
            }
        }
    }
    endCall = () => {
        if(this.uuid) {
            RNCallKeep.endCall(this.uuid);
            this.uuid = null;
        }
        if(IS_ANDROID) {
            activityStarter.endVideoCallScreen();
        }
        RNCallKeep.endAllCalls();
    }
    rejectCall() {
        if(this.uuid) {
            RNCallKeep.rejectCall(this.uuid);
            this.uuid = null;
        }
        if(IS_ANDROID) {
            activityStarter.endVideoCallScreen();
        }
        RNCallKeep.endAllCalls();
    }
    endCallByRemoteUser = (reason) => {
        if(this.uuid) {
            RNCallKeep.reportEndCallWithUUID(this.uuid, reason);
            this.uuid = null;
        }
        RNCallKeep.endAllCalls();
        if(IS_ANDROID) {
            activityStarter.endVideoCallScreen();
        }
    }

    //  EVENTS ///
    onAnswerCallAction = async () => {
            console.log('ON Answer Event');
            if(IS_ANDROID) {
                if (RootNavigation.getContainerRef()) {
                    RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: false, onPressAccept: true });
                } else {
                    const buildAPIVersion = await activityStarter.androidBuildAPIVersion();
                    console.log(buildAPIVersion);
                    if(buildAPIVersion >= INCOMING_CALL_SCREEN_THRESHHOLD_API_VERSION) {
                        SajjadLaunchApplication.open(ANDROID_BUNDLE_IDENTIFIER);
                        console.log('Navigation Container is  Not Present....');
                        var interval = setInterval(() => {
                            if (RootNavigation.getContainerRef()) {
                                console.log('Excuting to Navigate To Video Screen...');
                                RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: false, onPressAccept: true });
                                clearInterval(interval);
                            }
                        },100);
                    } else {
                        RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: false, onPressAccept: true });
                    }
                }
            } else {
                if (!RootNavigation.getContainerRef()) {
                    console.log('On Reference False');
                    store.dispatch({
                        type: SET_INCOMING_VIDEO_CALL,
                        data: true
                    });
                 
                } else {
                    RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: false, onPressAccept: true });
                }
        }
        store.dispatch({
            type: SET_INCOMING_VIDEO_CALL_VIA_BACKGROUND,
        });  
    }
    onRejectCallAction = async () => {
        console.log('On Reject the Incoming Call...');
        RNCallKeep.endAllCalls();
        if(IS_ANDROID) {
            if (RootNavigation.getContainerRef()) {
                RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: true, onPressAccept: false });
            } else {
                const buildAPIVersion = await activityStarter.androidBuildAPIVersion();
                if(buildAPIVersion >= INCOMING_CALL_SCREEN_THRESHHOLD_API_VERSION) {
                    SajjadLaunchApplication.open(ANDROID_BUNDLE_IDENTIFIER);
                    console.log('Navigation Container is  Not Present....');
                    var interval = setInterval(() => {
                        if (RootNavigation.getContainerRef()) {
                            console.log('Excuting to Navigate To Video Screen...');
                            RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: true, onPressAccept: false });
                            clearInterval(interval);
                        }
                    },100);
                } else {
                    RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: true, onPressAccept: false });
                }
            }
        } else {
            if (!RootNavigation.getContainerRef()) {
                console.log('On Reference False');
                store.dispatch({
                    type: SET_INCOMING_VIDEO_CALL,
                    data: true
                });
            } else {
                RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: true, onPressAccept: false });
            }
        }
    }

   
        setupListeners = () => {
            RNCallKeep.addEventListener('answerCall', this.onAnswerCallAction);
           // RNCallKeep.addEventListener('didPerformDTMFAction', didPerformDTMFAction);
           // RNCallKeep.addEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
           // RNCallKeep.addEventListener('didPerformSetMutedCallAction', didPerformSetMutedCallAction);
           // RNCallKeep.addEventListener('didToggleHoldCallAction', didToggleHoldCallAction);
              RNCallKeep.addEventListener('endCall', this.onRejectCallAction);
              if(IS_ANDROID) {
               /* eventEmitter.addListener('callActionChange', (param) =>  {
                    console.log('Action Result Param', param);
                    if(param === 'accepted') {
                        this.onAnswerCallAction();
                    } else if(param === 'declined') {
                        this.onRejectCallAction();
                    }
                }); */
                PushNotification.onFullScreenIntentActionRegister((result) => {
                    console.log(result);
                    if(result === CALL_SCREEN_ACTIONS.ACCEPTED ) {
                        this.onAnswerCallAction();
                    } else if(result === CALL_SCREEN_ACTIONS.DECLINED) {
                        this.onRejectCallAction();
                    }
                });
            } 
        
            return () => {
                RNCallKeep.removeEventListener('answerCall', this.onAnswerCallAction);
                // RNCallKeep.removeEventListener('didPerformDTMFAction', didPerformDTMFAction);
                // RNCallKeep.removeEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
                // RNCallKeep.removeEventListener('didPerformSetMutedCallAction', didPerformSetMutedCallAction);
                // RNCallKeep.removeEventListener('didToggleHoldCallAction', didToggleHoldCallAction);
                RNCallKeep.removeEventListener('endCall', this.onRejectCallAction);
            }
      }
    
}  