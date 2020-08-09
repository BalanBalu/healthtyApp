import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { store } from '../setup/store';
const { width={} } = Dimensions.get('window');

RenderOffline = () => {
  return (
    <View style={[styles.container, { backgroundColor: '#b52424' }]}>
      <Text style={styles.text}>No Internet connection</Text>
    </View>
  );
}
RenderOnline = () => {
  return (
    <View style={[styles.container, { backgroundColor: '#00b300' }]}>
      <Text style={styles.text}> We are back Online...</Text>
    </View>
  );
}
class OfflineNotice extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      connectionStatus: ""
    }
  }

  componentDidMount() {
      NetInfo.addEventListener(this.changeNetworkState);
  }

  componentWillUnmount() {
  }

  changeNetworkState = (isConnected) => {
    if (isConnected.isConnected == true) {
      if(store.getState().user.appLoaded) {
        this.setState({ connectionStatus: "Online" })
        setTimeout(() => {
          this.setState({ connectionStatus: "" })
        }, 2000);
      }
    }
    else {
      this.setState({ connectionStatus: "Offline" })
    }
  };

  render() {
    const { connectionStatus } = this.state;
    if (connectionStatus == 'Offline') return <RenderOffline />
    if (connectionStatus == 'Online') return <RenderOnline />
    return null
  }
}
const styles = StyleSheet.create({
  container: {
    height: 40,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 55
  },
  text: {
    color: '#fff',
    fontSize: 16,
  }
});

export default OfflineNotice
