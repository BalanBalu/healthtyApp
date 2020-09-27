import { AsyncStorage } from 'react-native'
import ConnectyCube from 'react-native-connectycube';
import {store} from '../../../../setup/store';
import { setUserLoggedIn, authorizeConnectyCube } from './video-consulting-service';
import { CallService, CallKeepService, AuthService } from './index';
import { SET_VIDEO_SESSION, RESET_INCOMING_VIDEO_CALL } from '../../../providers/chat/chat.action';

export default class CallProcessSetupService {
    constructor() {
      this._setUpListeners();
    }
  

    async _setUpListeners() {
      AuthService.init();
      let userId = await AsyncStorage.getItem('userId')
      const { chat: { loggedIntoConnectyCube } } = store.getState();
      if (userId && loggedIntoConnectyCube === false) {
          this.authorized = await authorizeConnectyCube();
          console.log('loggedIntoConnectyCube ' + loggedIntoConnectyCube + ' Authorized: ' + this.authorized);
          if (this.authorized) {
              ConnectyCube.videochat.onCallListener = this._onCallListener;
              ConnectyCube.videochat.onRemoteStreamListener = this._onRemoteStreamListener;
              ConnectyCube.videochat.onStopCallListener = this._onStopCallListener;
              ConnectyCube.videochat.onRejectCallListener = this._onRejectCallListener;
              setTimeout(() => {
                  setUserLoggedIn();
              }, 5000)
          }
      }
  }

  _onCallListener = (session, extension) => {
    console.log('Listening On Call listener....');
    CallService.processOnCallListener(session)
        .then(() => this.showIncomingCallModal(session, extension))
        .catch(this.hideIncomingCallModal);
  };

  showIncomingCallModal = (session, extension) => {
    console.log('Showing Incoming Call..');
    CallService.setSession(session);
    CallService.setExtention(extension);
    CallKeepService.displayIncomingCall('12345', 'Doctor');
  };
  
  hideIncomingCallModal = () => {
      console.log('On Hiding Incoming Model');
  }

  _onRemoteStreamListener = async (session, userId, stream) => {
    console.log('Streaming...', stream);
    console.log(userId);
    await store.dispatch({
        type: SET_VIDEO_SESSION,
        data: {
            userId: userId,
            stream: stream
        }
    })
  };

  _onStopCallListener = (session, userId, extension) => {
    console.log('Stopping the Call...');
    const isStoppedByInitiator = session.initiatorID === userId;

    CallService.processOnStopCallListener(userId, isStoppedByInitiator)
        .then(() => {
            if (isStoppedByInitiator) {
                store.dispatch({
                    type: SET_VIDEO_SESSION,
                    data: null
                });
                CallService.setSession(null);
                CallService.setExtention(null);
                store.dispatch({
                    type: RESET_INCOMING_VIDEO_CALL,
                })
            }
        })
        .catch(() => {
          store.dispatch({
            type: RESET_INCOMING_VIDEO_CALL,
          })
        });
  };

  _onRejectCallListener = (session, userId, extension) => {
    console.log('Rejecting the Call....');
    CallService.processOnRejectCallListener(session, userId, extension)
        .then(() => {
            store.dispatch({
                type: SET_VIDEO_SESSION,
                data: null
            });
            CallService.setSession(null);
            CallService.setExtention(null);
        })
        .catch(() => {
          store.dispatch({
            type: RESET_INCOMING_VIDEO_CALL,
          })
        });
  };

}