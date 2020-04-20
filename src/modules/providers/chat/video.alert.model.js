import React, { Component } from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import {
  View,
  } from 'react-native';
import RootNavigation from '../../../setup/rootNavigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import PropTypes from 'prop-types'
// import {
//   setLoadingOverlay,
//   clearLoadingOverlay,
//   popModalFromStack
// } from '../../../actions'

// class ConfirmSendModal extends React.Component {
 

//   render() {
//     const { isIncomingCall } = this.props
//     return (
//     <AwesomeAlert
//         show={isIncomingCall}
//         showProgress={false}
//         title={`Incoming call from ${initiatorName}`}
//         closeOnTouchOutside={false}
//         closeOnHardwareBackPress={true}
//         showCancelButton={true}
//         showConfirmButton={true}
//         cancelText="Reject"
//         confirmText="Accept"
//         cancelButtonColor="red"
//         confirmButtonColor="green"
//         onCancelPressed={this._onPressReject}
//         onConfirmPressed={this._onPressAccept}
//         onDismiss={this.hideInomingCallModal}
//         alertContainerStyle={{zIndex: 1}}
//         titleStyle={{fontSize: 21}}
//         cancelButtonTextStyle={{fontSize: 18}}
//         confirmButtonTextStyle={{fontSize: 18}}
//       />
//     )
//   }
// }

// ConfirmSendModal.propTypes = {
//   isVisible: PropTypes.bool.isRequired,
// }

// const componentStyles = StyleSheet.create({
//   modalWrapper: { width: 300, height: 300, zIndex: 2 }
// })

// const mapStateToProps = () => {}

// const mapDispatchToProps = dispatch => ({
//   clearLoadingOverlay: () => dispatch(clearLoadingOverlay()),
//   setLoadingOverlay: props => dispatch(setLoadingOverlay(props)),
//   popModalFromStack: () => dispatch(popModalFromStack())
// })

// export default connect(mapStateToProps, mapDispatchToProps)(ConfirmSendModal)

/*
export default class IncomingVideoCallAlert extends React.Component {
    static incomingVideoCallAlertInstance
  
    constructor(props) {
      super(props)
  
      this.state = {
        visible: false,
        text: ""
      }
  
      IncomingVideoCallAlert.incomingVideoCallAlertInstance = this;
    }
  
    static show(text) {
      this.incomingVideoCallAlertInstance._show(text)
    }
  
  
    _show(text) {
      this.setState({ visible: true,  text })
    }
    _onPressReject() {
         RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: true, onPressAccept: false  });
    }
    _onPressAccept() {
        RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: false, onPressAccept: true })
    }
  
render() {
    return (
        this.state.visible ? 

            <AwesomeAlert
                show={this.state.visible}
                showProgress={false}
                title={`Incoming Video call`}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={true}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Reject"
                confirmText="Accept"
                cancelButtonColor="red"
                confirmButtonColor="green"
                onCancelPressed={() => {
                    this.setState({ visible: false, text: '' });
                    this._onPressReject();
                }}
                onConfirmPressed={() => {
                    this.setState({ visible: false, text: '' });
                    this._onPressAccept()
                }}
                onDismiss={() => {
                    this.setState({ visible: false, text: '' });
                    this._onPressReject();
                }}
                alertContainerStyle={{zIndex: 1}}
                titleStyle={{fontSize: 21}}
                cancelButtonTextStyle={{fontSize: 18}}
                confirmButtonTextStyle={{fontSize: 18}}
            />
            : null
        )
    }
  }
  */
 class IncomingVideoCallAlert extends Component {
    _onPressReject() {
      RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: true, onPressAccept: false  });
    }
    _onPressAccept() {
      RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: false, onPressAccept: true })
    }


  render() {
    const { chat : { incomingVideoCall  }, onPressReject, onPressAccept } = this.props
    console.log('Video Alert Props===>', this.props);
    return (
            <AwesomeAlert
                show={incomingVideoCall }
                showProgress={false}
                title={`Incoming Video call`}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={true}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Reject"
                confirmText="Accept"
                cancelButtonColor="red"
                confirmButtonColor="green"
                onCancelPressed={() => {
                    onPressReject();
                }}
                onConfirmPressed={() => {
                    onPressAccept()
                }}
                onDismiss={() => {
                    onPressReject();
                }}
                
                alertContainerStyle={{zIndex: 2}}
                titleStyle={{fontSize: 21}}
                cancelButtonTextStyle={{fontSize: 18}}
                confirmButtonTextStyle={{fontSize: 18}}
            />
    )
  }
}
const mapStateToProps = (state) => { 
  return {
    chat: state.chat
  }
 }
const mapDispatchToProps = dispatch => { 
  return ({
    onPressAccept: () => dispatch(() => { 
      console.log('Accepted');
      RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: false, onPressAccept: true });
    }),
    onPressReject: () => dispatch(() => {
      console.log('Rejected')
      RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: true, onPressAccept: false  });
    })
  })
}
export default connect(mapStateToProps, mapDispatchToProps)(IncomingVideoCallAlert)