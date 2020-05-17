import { Toast } from 'native-base';
import ConnectyCube from 'react-native-connectycube';
import InCallManager from 'react-native-incall-manager';
import Sound from 'react-native-sound';
import { sendNotification } from './video-consulting-service';
import { CallKeepService , REMOTE_USER_END_CALL_REASONS} from './index';
import {  AppState  } from 'react-native';
import { store } from '../../../../setup/store';
import { IS_ANDROID } from '../../../../setup/config';
export default class CallService {
 static MEDIA_OPTIONS = {audio: true, video: {facingMode: 'user'}};

  _session = null;
  _extension = null;
  mediaDevices = [];

  outgoingCall = new Sound(require('../../../../../assets/sounds/dialing.mp3'));
  incomingCall = new Sound(require('../../../../../assets/sounds/incoming.mp3'));
  endCall =      new Sound(require('../../../../../assets/sounds/end_call.mp3'));

  showToast = text => {
    if(AppState.currentState === 'active') {
      Toast.show({
        text: text,
        type:'success',
        duration: 4000
      })
    }
  };

  getUserById = (userId, key) => {
    const user = 'Doctor';
    return user;
  };

  setMediaDevices() {
    return ConnectyCube.videochat.getMediaDevices().then(mediaDevices => {
      console.log('=======Setting THE Media Devices =============');
      console.log(mediaDevices);
      this.mediaDevices = mediaDevices;
    });
  }

  setSession(session) {
    this._session = session;
  }
  getSession() {
    return this._session;
  }
  setExtention(extension) {
    this._extension = extension
  }
  getExtention() {
    return this._extension;
  }

  acceptCall = session => {
    this.stopSounds();
    this._session = session;
    this.setMediaDevices();

    return this._session
      .getUserMedia(CallService.MEDIA_OPTIONS)
      .then(stream => {
        this._session.accept({});
        return stream;
      });
  };

  startCall = ids => {
    const options = {};
    const type = ConnectyCube.videochat.CallType.VIDEO; // AUDIO is also possible

    this._session = ConnectyCube.videochat.createNewSession(ids, type, options);

    this.setMediaDevices();
    this.playSound('outgoing');

    return this._session
      .getUserMedia(CallService.MEDIA_OPTIONS)
      .then(stream => {
        this._session.call({});
        return stream;
      });
  };
  sendVideoCallingNotification = (medflicUserOrDoctorId) => {
      sendNotification(medflicUserOrDoctorId, {
        session: {
            ID:  this._session.ID,
          }
      });
  }

  stopCall = () => {
    this.stopSounds();
    CallKeepService.endCall();
    if (this._session) {
      this.playSound('end');
      this._session.stop({});
      ConnectyCube.videochat.clearSession(this._session.ID);
      this._session = null;
      this.mediaDevices = [];
    }
  };

  rejectCall = (session, extension) => {
    this.stopSounds();
    if(session) {
      session.reject(extension);
      CallKeepService.rejectCall();
    }
  };
  
  setAudioMuteState = mute => {
    if (mute) {
      this._session.mute('audio');
    } else {
      this._session.unmute('audio');
    }
  };

  switchCamera = localStream => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  };

  setSpeakerphoneOn = flag => {
    InCallManager.setSpeakerphoneOn(flag)
  };
  setMicrophoneMute = flag => {
    InCallManager.setMicrophoneMute(flag)
  };
  
  setKeepScreenOn = flag => {
    InCallManager.setKeepScreenOn(flag);
  }
  
  processOnUserNotAnswerListener(userId) {
    return new Promise((resolve, reject) => {
      if (!this._session) {
        reject();
      } else {
        const userName = this.getUserById(userId, 'name');
        const message = `${userName} did not answer`;
        CallKeepService.endCallByRemoteUser(REMOTE_USER_END_CALL_REASONS.REMOTE_USER_DID_NOT_ANSWER);
        this.showToast ?  this.showToast(message) : null;
        resolve();
      }
    });
  }

  processOnCallListener(session) {
    return new Promise((resolve, reject) => {
      if (session.initiatorID === session.currentUserID) {
        reject();
      }
      const inIncomingCallViaBackgroudState = store.getState().chat.incomingVideoCallViaBackgrondState;
      if (this._session && inIncomingCallViaBackgroudState === false ) {
        console.log('is Busy.....');
        this.rejectCall(session, {busy: true});
        CallKeepService.endCall();
        reject();
      }

      this.playSound('incoming');

      resolve();
    });
  }

  processOnAcceptCallListener(session, userId, extension = {}) {
    return new Promise((resolve, reject) => {
      if (userId === session.currentUserID) {
        this._session = null;
        CallKeepService.endCallByRemoteUser(REMOTE_USER_END_CALL_REASONS.REMOTE_USER_ENDED_CALL);
        this.showToast ?  this.showToast('You have accepted the call on other side') : null;
        reject();
      } else {
        const userName = this.getUserById(userId, 'name');
        const message = `${userName} accepted the call`;
        this.showToast ? this.showToast(message) : null;
        this.stopSounds();

        resolve();
      }
    });
  }

  processOnRejectCallListener(session, userId, extension = {}) {
    return new Promise((resolve, reject) => {
      if (userId === session.currentUserID) {
        this._session = null;
        this.showToast ? this.showToast('You have rejected the call on other side') : null;
        CallKeepService.endCallByRemoteUser(REMOTE_USER_END_CALL_REASONS.CALL_FAILED);
        reject();
      } else {
        const userName = this.getUserById(userId, 'name');
        const message = extension.busy
          ? `${userName} is busy`
          : `${userName} rejected the call request`;
        CallKeepService.endCallByRemoteUser(REMOTE_USER_END_CALL_REASONS.CALL_FAILED);
        this.showToast ? this.showToast(message) : null;
        resolve();
      }
    });
  }

  processOnStopCallListener(userId, isInitiator) {
    return new Promise((resolve, reject) => {
      this.stopSounds();

      if (!this._session) {
        CallKeepService.endCall();
        reject();
      } else {
        const userName = this.getUserById(userId, 'name');
        const message = `${userName} ${
          isInitiator ? 'stopped' : 'left'
        } the call`;
        CallKeepService.endCallByRemoteUser(REMOTE_USER_END_CALL_REASONS.REMOTE_USER_ENDED_CALL);
        this.showToast ? this.showToast(message) : null;
        resolve();
      }
    });
  }

  processOnRemoteStreamListener = () => {
    return new Promise((resolve, reject) => {
      if (!this._session) {
        reject();
      } else {
        resolve();
      }
    });
  };

  playSound = type => {
    switch (type) {
      case 'outgoing':
        this.outgoingCall.setNumberOfLoops(-1);
        this.outgoingCall.play();
        break;
      case 'incoming':
        if(AppState.currentState === 'active' || IS_ANDROID ) {
          this.incomingCall.setNumberOfLoops(-1);
          this.incomingCall.setVolume(1).play();
        }
        break;
      case 'end':
        this.endCall.play();
        break;

      default:
        break;
    }
  };

  stopSounds = () => {
    if (this.incomingCall.isPlaying()) {
      this.incomingCall.pause();
    }
    if (this.outgoingCall.isPlaying()) {
      this.outgoingCall.pause();
    }
  };

  async getWiredPlugedIn() {
  
    const isPluged =  await InCallManager.getIsWiredHeadsetPluggedIn();
    return isPluged
  }
}
