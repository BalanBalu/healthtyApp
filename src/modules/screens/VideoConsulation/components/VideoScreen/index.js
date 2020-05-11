import React from 'react';
import {SafeAreaView, StatusBar, BackHandler,  NativeModules, NativeEventEmitter, DeviceEventEmitter  } from 'react-native';
import ConnectyCube from 'react-native-connectycube';
import AwesomeAlert from 'react-native-awesome-alerts';
import RTCViewGrid from './RTCViewGrid';
import {CallService, CallKeepService } from '../../services';
import ToolBar from './ToolBar';
import { store } from '../../../../../setup/store';
import { connect } from 'react-redux';
import { SET_VIDEO_SESSION, RESET_INCOMING_VIDEO_CALL } from '../../../../providers/chat/chat.action';
import { Toast } from 'native-base';

 class VideoScreen extends React.Component {
  constructor(props) {
    super(props);

    this._session = null;  
    this._extension = null;

    this.steamSubscribeLoadedUsers = [];
    this.opponentsIds = props.navigation.getParam('opponentsIds') || [];
    
    this.state = {
      localStream: null,
      remoteStreams: [],
      selectedUsersIds: [],
      isActiveSelect: true,
      isActiveCall: false,
      isIncomingCall: false,
    };
    this.callToUser = props.navigation.getParam("callToUser") || false;
    this._setUpListeners();
  }
  componentDidMount() {
    
    CallService.setKeepScreenOn(true);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    if(this.callToUser) {
      userMedflicNdConnecticubeData = this.props.navigation.getParam("videoConsulationData");
      console.log(userMedflicNdConnecticubeData);
      if(userMedflicNdConnecticubeData.doctorInfo && userMedflicNdConnecticubeData.doctorInfo.connectycube) {
        CallService.setKeepScreenOn(true);
        const connectyCubeUserId = userMedflicNdConnecticubeData.doctorInfo.connectycube.connectycube_id;
        this.selectUser(connectyCubeUserId);
        this.startCall([ connectyCubeUserId ], userMedflicNdConnecticubeData.doctorInfo.doctor_id)
      } else {
        alert('We are Not able connect to the user at this time');
      }
    }

    const { navigation } = this.props;
    const isIncomingCall = navigation.getParam('isIncomingCall') || false;
    if(isIncomingCall) {
      this.showInomingCallModal(CallService.getSession());
      this._extension = CallService.getExtention();
    }
    Toast.show({
      text: 'Please Use Your Speaker Phone, as we are not supporting Wiredphone yet',
      duration: 3000,
      type: 'warning'
    })
    store.subscribe(() => {
      const { chat: { session } } = this.props;
      if(session && this.steamSubscribeLoadedUsers.indexOf(session.userId) === -1) {
          this.setRemoteListener(session.userId, session.stream);
          this.steamSubscribeLoadedUsers.push(session.userId);
      }
    });
  }

  componentWillUnmount() {
    CallService.setKeepScreenOn(false);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentWillMount() {
  }
  componentDidUpdate(prevProps, prevState) {
    const currState = this.state;

    if (
      prevState.remoteStreams.length === 1 &&
      currState.remoteStreams.length === 0
    ) {
      CallService.stopCall();
     // CallKeepService.endCall();
      this.resetState();
      this.navigateToHome();
     
    }
  }

  showInomingCallModal = session => {
   this._session = session;
   const { navigation } = this.props;
    const onPressReject = navigation.getParam('onPressReject') || false;
    const onPressAccept = navigation.getParam('onPressAccept') || false;
   console.log('State of onPressReject:' + onPressReject);
   console.log('State of onPressAccept:' + onPressAccept);
    if(onPressReject === true) {
     this._onPressReject();
   } if(onPressAccept === true ) {
      this._onPressAccept()
   }
   store.dispatch({
     type: RESET_INCOMING_VIDEO_CALL
   });
   if(onPressAccept === false && onPressReject === false ) {
     this.setState({isIncomingCall: true});
   }
  };

  hideInomingCallModal = () => {
    this._session = null;
    this.setState({isIncomingCall: false});
  };

  selectUser = userId => {
    this.setState(prevState => ({
      selectedUsersIds: [...prevState.selectedUsersIds, userId],
    }));
  };

  unselectUser = userId => {
    this.setState(prevState => ({
      selectedUsersIds: prevState.selectedUsersIds.filter(id => userId !== id),
    }));
  };

  closeSelect = () => {
    this.setState({isActiveSelect: false});
  };

  setOnCall = () => {
    this.setState({isActiveCall: true});
  };

  initRemoteStreams = opponentsIds => {
    const emptyStreams = opponentsIds.map(userId => ({
      userId,
      stream: null,
    }));

    this.setState({remoteStreams: emptyStreams});
  };

  updateRemoteStream = (userId, stream) => {
    this.setState(({remoteStreams}) => {
      const updatedRemoteStreams = remoteStreams.map(item => {
        if (item.userId === userId) {
          return {
            userId, 
            stream
          };
        }

        return {userId: item.userId, stream: item.stream};
      });

      return {remoteStreams: updatedRemoteStreams};
    });
  };

  removeRemoteStream = userId => {
    this.setState(({remoteStreams}) => ({
      remoteStreams: remoteStreams.filter(item => item.userId !== userId),
    }));
  };

  setLocalStream = stream => {
    this.setState({localStream: stream});
  };

  resetState = () => {
    this.setState({
      localStream: null,
      remoteStreams: [],
      selectedUsersIds: [],
      isActiveSelect: true,
      isActiveCall: false,
    });
    this.steamSubscribeLoadedUsers = [];
    store.dispatch({
      type: SET_VIDEO_SESSION,
      data: null
    })
  };

  _setUpListeners() {
   // ConnectyCube.videochat.onCallListener = this._onCallListener;
    ConnectyCube.videochat.onAcceptCallListener = this._onAcceptCallListener;
    ConnectyCube.videochat.onRejectCallListener = this._onRejectCallListener;
    ConnectyCube.videochat.onStopCallListener = this._onStopCallListener;
    ConnectyCube.videochat.onUserNotAnswerListener = this._onUserNotAnswerListener;
    ConnectyCube.videochat.onRemoteStreamListener = this._onRemoteStreamListener;
  }

  _onPressAccept = () => {
    CallService.acceptCall(this._session).then(stream => {
      const {opponentsIDs, initiatorID, currentUserID} = this._session;
      const opponentsIds = [initiatorID, ...opponentsIDs].filter(
        userId => currentUserID !== userId,
      );
      this.initRemoteStreams(opponentsIds);
      this.setLocalStream(stream);
      this.closeSelect();
      this.hideInomingCallModal();
      
    });
  };

  _onPressReject = () => {
    CallService.rejectCall(this._session, this._extension);
    this.hideInomingCallModal();
    this.navigateToHome();
  };
  navigateToHome() {
    this.props.navigation.navigate('Home')
  }

  // _onCallListener = (session, extension) => {
   
  //   CallService.processOnCallListener(session)
  //     .then(() => this.showInomingCallModal(session))
  //     .catch(this.hideInomingCallModal);
  // };

  _onAcceptCallListener = (session, userId, extension) => {
    
    CallService.processOnAcceptCallListener(session, userId, extension)
      .then(this.setOnCall)
      .catch(this.hideInomingCallModal);
  };

  _onRejectCallListener = (session, userId, extension) => {
    CallService.processOnRejectCallListener(session, userId, extension)
      .then(() => this.removeRemoteStream(userId))
      .catch(this.hideInomingCallModal);
  };

  _onStopCallListener = (session, userId, extension) => {
    const isStoppedByInitiator = session.initiatorID === userId;

    CallService.processOnStopCallListener(userId, isStoppedByInitiator)
      .then(() => {
        if (isStoppedByInitiator) {
           this.resetState();
        } else {
          this.removeRemoteStream(userId);
        }
      })
      .catch(this.hideInomingCallModal);
  };

  _onUserNotAnswerListener = (session, userId) => {
    CallService.processOnUserNotAnswerListener(userId)
      .then(() => this.removeRemoteStream(userId))
      .catch(this.hideInomingCallModal);
  };

  _onRemoteStreamListener = (session, userId, stream) => {
 
    CallService.processOnRemoteStreamListener(userId)
      .then(() => {
        this.updateRemoteStream(userId, stream);
        this.setOnCall();
      })
      .catch(this.hideInomingCallModal);
  };
  setRemoteListener(userId, stream) {
    CallService.processOnRemoteStreamListener(userId)
      .then(() => {
        this.updateRemoteStream(userId, stream);
        this.setOnCall();
      })
      .catch(this.hideInomingCallModal);
  }
  startCall = (selectedUsersIds, doctorId) => {
    if (selectedUsersIds.length === 0) {
      CallService.showToast('Select at less one user to start Videocall');
    } else {
      this.closeSelect();
      this.initRemoteStreams(selectedUsersIds);
      CallService.startCall(selectedUsersIds).then((stream) => {
        this.setLocalStream(stream)
        CallService.sendVideoCallingNotification(doctorId);
      });
    }
  };
  render() {
    const {
      localStream,
      remoteStreams,
      selectedUsersIds,
      isActiveSelect,
      isActiveCall,
      isIncomingCall,
    } = this.state;
    
    /*  
      TODO: Incoming Call from Doctor Name to be implement
      const initiatorName = isIncomingCall
      ? CallService.getUserById(this._session.initiatorID, 'name')
      : '';
    
    */
    const initiatorName = isIncomingCall
      ? CallService.getUserById(this._session.initiatorID, 'name')
      : '';
    const localStreamItem = localStream
      ? [{userId: 'localStream', stream: localStream}]
      : [];
    const streams = [...remoteStreams, ...localStreamItem];
    CallService.setSpeakerphoneOn(remoteStreams.length > 0);
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <RTCViewGrid streams={streams} />
        
        <ToolBar
          selectedUsersIds={selectedUsersIds}
          localStream={localStream}
          isActiveSelect={isActiveSelect}
          isActiveCall={isActiveCall}
          closeSelect={this.closeSelect}
          initRemoteStreams={this.initRemoteStreams}
          setLocalStream={this.setLocalStream}
          resetState={this.resetState}
        />
        <AwesomeAlert
          show={isIncomingCall}
          showProgress={false}
          title={`Incoming call from ${initiatorName}`}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={true}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Reject"
          confirmText="Accept"
          cancelButtonColor="red"
          confirmButtonColor="green"
          onCancelPressed={this._onPressReject}
          onConfirmPressed={this._onPressAccept}
          onDismiss={this.hideInomingCallModal}
          alertContainerStyle={{zIndex: 1}}
          titleStyle={{fontSize: 21}}
          cancelButtonTextStyle={{fontSize: 18}}
          confirmButtonTextStyle={{fontSize: 18}}
        />
      </SafeAreaView>
    );
  }
}

function homeState(state) {

  return {
      chat: state.chat,
  }
}
export default connect(homeState)(VideoScreen)