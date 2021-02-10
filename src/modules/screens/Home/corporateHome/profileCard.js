import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {primaryColor} from '../../../../setup/config'

import {Icon, Card} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {getMemberNameWithStatus} from './corporateFunction';

// export const CorporateProfileCard = (props) => {
//   const { data } = props;
//   return (
//     <View>
//       {data !== null &&
//       <Grid >
//         <Card style={{ width: '100%' }}>
//           <Row style={{ padding: 10 }}>
//             <Col size={2} >
//               <TouchableOpacity >
//                 <FastImage source={require('../../../../../assets/images/male_user.png')} style={{ height: 70, width: 70 }} />
//               </TouchableOpacity>
//             </Col>
//             <Col size={8} >
//               <Text style={styles.userName}>{`${getMemberNameWithStatus(data)}`}</Text>
//               <Text style={{ lineHeight: 20, fontFamily: 'OpenSans', fontSize: 14, color: '#909090' }}>{data.insuranceCompany}</Text>
//             </Col>
//           </Row>
//           <Row style={{marginBottom:10,marginRight:10}}>
//             <Col size={5} style={{ justifyContent: 'center', alignItems: 'center' }}>
//   <Text style={{ fontFamily: 'OpenSans', fontSize: 14 }}>Card Number : <Text style={{ fontFamily: 'OpenSans', fontSize: 13, fontWeight: '200', color: '#B0B0B0' }}>{data.memberId}</Text> </Text>
//             </Col>
//             <Col size={5} style={{ justifyContent: 'center', alignItems: 'center' }}>
//   <Text style={{ fontFamily: 'OpenSans', fontSize: 13 }}  ellipsizeMode="tail"
//               numberOfLines={1}>Policy Number : <Text style={{ fontFamily: 'OpenSans', fontSize: 13, fontWeight: '200', color: '#B0B0B0' }} >{data.policyNo}</Text></Text>
//             </Col>
//           </Row>

//         </Card>
//       </Grid>}
//     </View>
//   );
// }

export const CorporateProfileCard = props => {
  const {data} = props;
  return (
    <View
      style={{
        height: 140,
        flex: 1,
        marginTop: 10,
        marginBottom: 0,
        marginHorizontal: 12,
        // marginLeft: 12,
        // marginRight: 12,
      }}>
      <Text
        style={{
          color: '#424242',
          fontSize: 21,
          fontFamily: 'openSans, sans-serif',
          fontWeight: '40',
        }}>
        Hello,
      </Text>
      <Text
        style={{
          color: '#424242',
          fontSize: 21,
          fontWeight: '700',
        }}>
        Srimathi Bala Krishnan
      </Text>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 17, color: '#79797A', marginTop: 10}}>
          Policy No:{' '}
        </Text>
        <Text style={{fontSize: 17, color: '#79797A', marginTop: 10}}>075672367236237237</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 17, color: '#79797A', marginTop: 5}}>Card No: </Text>
        <Text style={{fontSize: 17, color: '#79797A', marginTop: 5}}>0123</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userName: {
    color: primaryColor,
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 5,
  },
  mainCol: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 0.1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    padding: 1,
    marginTop: 15,
    marginLeft: 11,
    marginBottom: 1,
    width: '20%',
    backgroundColor: '#fafafa',
  },
});
