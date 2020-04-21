import React, { Component } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import RootNavigation from '../../../setup/rootNavigation';
import { connect } from 'react-redux';
import { hideIncomingVideoModal } from './chat.action';

class IncomingVideoCallAlert extends Component {
   constructor(props) {
     super(props)
     this.state = {
        visibleCount: 1
     }
   }
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={incomingVideoCall}
          onRequestClose={() => {
              Alert.alert("Modal has been closed.");
        }}>
       
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Incoming Call from Doctor!</Text>
            <View style={{ flexDirection: 'row' }}> 
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#FF6347" }}
              onPress={() => {
                this.setState({ visibleCount : this.state.visibleCount + 1 })
                onPressReject();
              }}
            >
            <Text style={styles.textStyle}>  Reject  </Text>
            </TouchableHighlight>
            
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#228B22", marginLeft: 10 }}
              onPress={() => {
                  onPressAccept();
              }}
            >
            <Text style={styles.textStyle}>  Accept  </Text>
              
          </TouchableHighlight>
            </View> 
          </View>
        </View>
      </Modal>
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
      hideIncomingVideoModal(dispatch);
      RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: false, onPressAccept: true });
    }),
    onPressReject: () => dispatch(() => {
      console.log('Rejected');
      hideIncomingVideoModal(dispatch)
      RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: true, onPressAccept: false  });
    })
  })
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(IncomingVideoCallAlert)