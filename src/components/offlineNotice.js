import React from 'react';
import { View, Text, NetInfo, Dimensions, StyleSheet } from 'react-native';
const { width={} } = Dimensions.get('window');

RenderOffline = () => {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>could not connect to Internet</Text>
    </View>
  );
}
RenderOnline = () => {
  return (
    <View style={styles.onlineContainer}>
      <Text style={styles.offlineText}> We are back...Online</Text>
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
    NetInfo.isConnected.addEventListener('connectionChange', this.changeNetworkState);

    NetInfo.isConnected.fetch().done((isConnected) => {
      if (isConnected == true) {
        this.setState({ connectionStatus: "Online" });
        setTimeout(() => {
          this.setState({ connectionStatus: "" })
        }, 2000);
      }
      else this.setState({ connectionStatus: "Offline" })

    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.changeNetworkState);
  }

  changeNetworkState = (isConnected) => {
    if (isConnected == true) {
      this.setState({ connectionStatus: "Online" })
      setTimeout(() => {
        this.setState({ connectionStatus: "" })
      }, 2000);
    }
    else this.setState({ connectionStatus: "Offline" })
  };

  render() {
    const { connectionStatus } = this.state;
    if (connectionStatus == 'Offline') return <RenderOffline />
    if (connectionStatus == 'Online') return <RenderOnline />
    return null;
  }
}
const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
  },
  onlineContainer: {
    backgroundColor: '#00b300',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
  },
  offlineText: {
    color: '#fff'
  }
});

export default OfflineNotice
