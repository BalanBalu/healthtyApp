import React from 'react';
import { View, Text, Dimensions, StyleSheet, StatusBar, Image } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {
  SET_CONNECTION_STATUS
} from '../modules/providers/profile/profile.action';
import { translate } from '../setup/translator.helper';
import { store } from '../setup/store';

const { width = {} } = Dimensions.get('window');

RenderOffline = () => {
  return (
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      <StatusBar
        animated={true}
        backgroundColor="#000000"
        barStyle={'light-content'}
      />
      <Image source={require('../../assets/images/Offline.png')} style={{ height: 15, width: 15 }} tintColor='#ffffff' />

      <Text style={styles.text}>{'  '}{translate("No Internet connection")}</Text>
    </View>
  );
}
RenderOnline = () => {
  return (
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      <StatusBar
        animated={true}
        backgroundColor='#000000'
        barStyle={'light-content'}
      />
      <Image source={require('../../assets/images/Online.png')} style={{ height: 15, width: 15 }} tintColor='#ffffff' />

      <Text style={styles.text}> {translate(" We are back Online ")}...</Text>
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



  changeNetworkState = async (isConnected) => {
    if (isConnected.isConnected == true) {
      if (store.getState().user.appLoaded) {
        this.setState({ connectionStatus: "Online" })
        store.dispatch({
          type: SET_CONNECTION_STATUS,
          data: "online",
        });

        setTimeout(() => {
          if (this.state.connectionStatus === 'Online') {
            this.setState({ connectionStatus: "" })
          }
        }, 2000);
      }
    }
    else {
      this.setState({ connectionStatus: "Offline" })
      store.dispatch({
        type: SET_CONNECTION_STATUS,
        data: "offline",
      });
    }
  };

  render() {

    const { connectionStatus } = this.state;

    if (connectionStatus == 'Offline') return <RenderOffline />
    else if (connectionStatus == 'Online') return <RenderOnline />
    else return (
      <View>
        <StatusBar
          animated={true}
          backgroundColor='#979ba1'
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: 20,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    // top: 55
    flexDirection: 'row'
  },
  text: {
    color: '#fff',
    fontSize: 13,
  }
});

export default OfflineNotice
