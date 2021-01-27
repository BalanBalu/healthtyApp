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

  render() {
    const { chat : { incomingVideoCall, onVideoScreen }, onPressReject, onPressAccept } = this.props
    
    if(onVideoScreen) {
        return null;
    }
    return (
     
        <Modal
          animationType="slide"
          transparent={true}
          visible={incomingVideoCall}
          onRequestClose={() => {
              Alert.alert("Modal has been closed.");
        }}>
           <View
        style={[styles.container, { backgroundColor: 'rgba(0, 0, 0, 0.25)' }]}
      > 
       
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
                this.setState({ visibleCount : this.state.visibleCount + 1 }) 
                onPressAccept();
              }}
            >
            <Text style={styles.textStyle}>  Accept  </Text>
              
          </TouchableHighlight>
            </View> 
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
      
      hideIncomingVideoModal(dispatch);
      RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: false, onPressAccept: true });
    }),
    onPressReject: () => dispatch(() => {
    
      hideIncomingVideoModal(dispatch)
      RootNavigation.navigate('VideoScreen', { isIncomingCall: true, onPressReject: true, onPressAccept: false  });
    })
  })
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
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