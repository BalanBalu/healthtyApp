import React, { useState, useEffect } from 'react';

import RNCallKeep from 'react-native-callkeep';
import { PermissionsAndroid, AppRegistry, NativeModules, AppState  } from 'react-native'
import { IS_ANDROID, ANDROID_BUNDLE_IDENTIFIER } from '../../../../setup/config';
import RootNavigation from '../../../../setup/rootNavigation';
import { v4 as uuidv4 } from 'uuid';
import SajjadLaunchApplication from 'react-native-launch-application';
import { store } from '../../../../setup/store';
import { SET_INCOMING_VIDEO_CALL } from '../../../providers/chat/chat.action';

export default class CallKeepService {

    setupCallkeep = () => {
       try {
        
        RNCallKeep.setup({
            ios: {
              appName: 'Medflic',
              supportsVideo: true,
            },
            android: {
              alertTitle: 'Permissions required',
              alertDescription: 'This application needs to access your phone accounts',
              cancelButton: 'Cancel',
              okButton: 'ok',
            //  imageName: ''
             // additionalPermissions: [PermissionsAndroid.PERMISSIONS.Location]
            },
        });
        
            if (IS_ANDROID) {
                  RNCallKeep.setAvailable(true);
            }
          
        } catch (error) {
           console.error('Error while Setting to be Available ', error)
        }
        this.setupListeners();
     
    }
   /* startCall = (uuid, handle, contactIdentifier, handleType, hasVideo) => {
       if(IS_ANDROID) {
            RNCallKeep.startCall(uuid, handle, contactIdentifier,);
       } else {
            RNCallKeep.startCall(uuid, handle, contactIdentifier, handleType, hasVideo);
       }
    } */

    displayIncomingCall = (handleNumber, handlerName) => {
        this.uuid = uuidv4();
        this.handleNumber = handleNumber;
        this.handlerName = handlerName;
        if(AppState.currentState === 'active') {
            store.dispatch({
                type: SET_INCOMING_VIDEO_CALL,
                data: true
            })
        } else {
            if(IS_ANDROID) {
                RNCallKeep.displayIncomingCall(this.uuid, String(handleNumber), handlerName );
            } else {
                RNCallKeep.displayIncomingCall(this.uuid, String(handleNumber), handlerName, 'generic', true );
            }
        }
    }
    endCall = () => {
        if(this.uuid) {
            RNCallKeep.endCall(this.uuid);
            this.uuid = null;
        }
    }
    rejectCall() {
        if(this.uuid) {
            RNCallKeep.rejectCall(this.uuid);
            this.uuid = null;
            
        }
    }
    endCallByRemoteUser = (reason) => {
        if(this.uuid) {
            RNCallKeep.reportEndCallWithUUID(this.uuid, reason);
            this.uuid = null;
        }
    }
    
   

    //  EVENTS ///
    onAnswerCallAction = () => {
        console.log('ON Answer Event');
        if(IS_ANDROID) {
            RNCallKeep.setCurrentCallActive(this.uuid);
            SajjadLaunchApplication.open(ANDROID_BUNDLE_IDENTIFIER);
            // this.endCall();
        }
         RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: false, onPressAccept: true });
    }
    onRejectCallAction = () => {
        console.log('On Reject the Incoming Call...');
        RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: true, onPressAccept: false });
    }

   
        setupListeners = () => {
            RNCallKeep.addEventListener('answerCall', this.onAnswerCallAction);
           // RNCallKeep.addEventListener('didPerformDTMFAction', didPerformDTMFAction);
           // RNCallKeep.addEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
           // RNCallKeep.addEventListener('didPerformSetMutedCallAction', didPerformSetMutedCallAction);
           // RNCallKeep.addEventListener('didToggleHoldCallAction', didToggleHoldCallAction);
              RNCallKeep.addEventListener('endCall', this.onRejectCallAction);
        
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