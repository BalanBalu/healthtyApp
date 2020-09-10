import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image'
import { Icon, Card } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';


export const CorporateProfileCard = (props) => {
  return (
    <View>
      <Grid >
        <Card style={{ width: '100%' }}>
          <Row style={{ padding: 10 }}>
            <Col size={2.5} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity >
                <FastImage source={require('../../../../../assets/images/male_user.png')} style={{ height: 70, width: 70 }} />
              </TouchableOpacity>
            </Col>
            <Col size={7.5} style={{ justifyContent: 'center', }}>
              <Text style={styles.userName}>Hello Mr.K BalaBaskar</Text>
              <Text style={{ lineHeight: 20, fontFamily: 'OpenSans', fontSize: 14, color: '#909090' }}>M/S Ensign Insurance Brokers Private Limited</Text>
            </Col>
          </Row>
          <Row style={{ marginTop: 5 }}>
            <Col size={5} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'OpenSans', fontSize: 14 }}>Card Number : <Text style={{ fontFamily: 'OpenSans', fontSize: 13, fontWeight: '200', color: '#B0B0B0' }}>3928931E </Text> </Text>
            </Col>
            <Col size={5} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'OpenSans', fontSize: 13 }}>Policy Number : <Text style={{ fontFamily: 'OpenSans', fontSize: 13, fontWeight: '200', color: '#B0B0B0' }}>304000060</Text></Text>
            </Col>
          </Row>
          <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center', padding: 5, backgroundColor: '#E4D1FE', marginTop: 10 }}>Last Visited On 04th Sept,2020 At 04:36 PM </Text>
        </Card>
      </Grid>
    </View>
  );
}

const styles = StyleSheet.create({
  userName: {
    color: '#7F49C3',
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: '700'

  },
  mainCol: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 0.1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    padding: 1,
    marginTop: 15,
    marginLeft: 11,
    marginBottom: 1, width: '20%', backgroundColor: '#fafafa',
  }
});