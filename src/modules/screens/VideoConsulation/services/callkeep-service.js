import React, { useState, useEffect } from 'react';

import RNCallKeep from 'react-native-callkeep';
import { PermissionsAndroid, AppState, Alert, NativeModules , NativeEventEmitter } from 'react-native'
import { IS_ANDROID, ANDROID_BUNDLE_IDENTIFIER, IS_IOS, ANDROID_VIDEO_CALL_ACTIVITY_NAME } from '../../../../setup/config';
import RootNavigation from '../../../../setup/rootNavigation';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../../../../setup/store';
import { SET_INCOMING_VIDEO_CALL, SET_INCOMING_VIDEO_CALL_VIA_BACKGROUND } from '../../../providers/chat/chat.action';
import SajjadLaunchApplication  from 'react-native-launch-application';

let activityStarter;
let eventEmitter;
if(IS_ANDROID) {
     activityStarter = NativeModules.ActivityStarter;
     eventEmitter = new NativeEventEmitter(activityStarter);
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

  setupCallkeep = () => {
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
              additionalPermissions: [ PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, PermissionsAndroid.PERMISSIONS.CAMERA ]
            },
        }).then((res) => {
            console.log('res of Permission '+ res);
        }).catch(err => {
            console.log('Errror Permission '+ err);
        })
      }
        // if (IS_ANDROID) {
        //         RNCallKeep.setAvailable(true);
        // }
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
            if(IS_ANDROID) {
                console.log('...Coming to Correct Condition with Backgroud....');
                if (RootNavigation.getContainerRef()) {
                    activityStarter.navigateToExample();
                } else {
                    SajjadLaunchApplication.open(ANDROID_BUNDLE_IDENTIFIER);
                    var interval = setInterval(() => {
                        if (RootNavigation.getContainerRef()) {
                            console.log('Excuting to Navigate To Video Screen...');
                            activityStarter.navigateToExample();
                            clearInterval(interval);
                        }
                    },100);
                    console.log('Excuting on Android with ' +  AppState.currentState);
              //  RNCallKeep.displayIncomingCall(this.uuid, String(6333662), 'Medflic Doctor' );
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
    onAnswerCallAction = () => {
            console.log('ON Answer Event');
            if (!RootNavigation.getContainerRef()) {
                console.log('On Reference False');
                store.dispatch({
                    type: SET_INCOMING_VIDEO_CALL,
                    data: true
                });
                store.dispatch({
                    type: SET_INCOMING_VIDEO_CALL_VIA_BACKGROUND,
                });
            } else {
                RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: false, onPressAccept: true });
            }
    }
    onRejectCallAction = () => {
        console.log('On Reject the Incoming Call...');
        RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: true, onPressAccept: false });
        RNCallKeep.endAllCalls();
        if(IS_ANDROID) {
            activityStarter.endVideoCallScreen();
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
                eventEmitter.addListener('callActionChange', (param) =>  {
                    console.log('Action Result Param', param);
                    if(param === 'accepted') {
                        this.onAnswerCallAction();
                    } else if(param === 'declined') {
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