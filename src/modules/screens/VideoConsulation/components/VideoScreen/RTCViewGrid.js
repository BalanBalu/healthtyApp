import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RTCView} from 'react-native-connectycube';
import {CallService} from '../../services';
import CallingLoader from './CallingLoader';

export default ({streams}) => {
  const RTCViewRendered = ({userId, stream}) => {
    console.log(stream);
    if (stream) {
      return (
        <RTCView
          objectFit="cover"
          style={styles.blackView}
          key={userId}
          streamURL={stream.toURL()}
        />
      );
    }
    else {
    return (
      <View style={styles.blackView}>
        <CallingLoader name={CallService.getUserById(userId, 'name')} />
      </View>
    );
    }
  };

  const streamsCount = streams.length;
  console.log('Stream Count ' , streams)
  let RTCListView = null;

  switch (streamsCount) {
    case 1:
      RTCListView = (
        <RTCViewRendered
          userId={streams[0].userId}
          stream={streams[0].stream}
        />
      );
      break;

    case 2:
      RTCListView = (
        <View style={styles.inColumn}>
          <View style={streams[0].userId === 'localStream' ? styles.forLocalUser : styles.forRemoteUser } >
        
          <RTCViewRendered
            userId={streams[0].userId}
            stream={streams[0].stream}
          />
          </View>
          <View style={streams[1].userId === 'localStream' ? styles.forLocalUser : styles.forRemoteUser }>
         
          <RTCViewRendered
            userId={streams[1].userId}
            stream={streams[1].stream}
          />
          </View>
        </View>
      );
      break;

    case 3:
      RTCListView = (
        <View style={styles.inColumn}>
          <View style={styles.inRow}>
            <RTCViewRendered
              userId={streams[0].userId}
              stream={streams[0].stream}
            />
            <RTCViewRendered
              userId={streams[1].userId}
              stream={streams[1].stream}
            />
          </View>
          <RTCViewRendered
            userId={streams[2].userId}
            stream={streams[2].stream}
          />
        </View>
      );
      break;

    case 4:
      RTCListView = (
        <View style={styles.inColumn}>
          <View style={styles.inRow}>
            <RTCViewRendered
              userId={streams[0].userId}
              stream={streams[0].stream}
            />
            <RTCViewRendered
              userId={streams[1].userId}
              stream={streams[1].stream}
            />
          </View>
          <View style={styles.inRow}>
            <RTCViewRendered
              userId={streams[2].userId}
              stream={streams[2].stream}
            />
            <RTCViewRendered
              userId={streams[3].userId}
              stream={streams[3].stream}
            />
          </View>
        </View>
      );
      break;

    default:
      break;
  }

  return <View style={styles.blackView}>{RTCListView}</View>;
};

const styles = StyleSheet.create({
  blackView: {
    flex: 1,
    backgroundColor: 'black',
  },
  inColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  inRow: {
    flex: 1,
    flexDirection: 'row',
  },
  forLocalUser: {
    height: 180,
    width: 120,
    top: 10,
    right: 10, 
    alignSelf: 'flex-end',
    position: 'absolute',
    
  },
  forRemoteUser: {
    height: '100%'
  }
});
