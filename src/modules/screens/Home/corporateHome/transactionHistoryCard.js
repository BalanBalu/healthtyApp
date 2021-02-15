import React from 'react';
import { TouchableHighlight, StyleSheet } from 'react-native';
import {View, Text} from 'native-base'
import {primaryColor, secondaryColor, secondaryColorTouch} from '../../../../setup/config';

import {
  PreAuthDrawing,
  ClaimStatusDrawing,
  PolicyCoverageDrawing,
  ClaimInitiationDrawing,
  InsuranceRenewalDrawing,
  LabTestDrawing,
  HospitalDrawing,
  ConsultationDrawing,
  MyChatsDrawing,
  HomeTestDrawing,
  VideoConsultDrawing
} from './svgDrawings';

import styles from './styles'



export const TransactionHistoryCard = (props) => {
  const {navigation} = props;
  
  return (
    <View
      style={{
        marginTop: 6,
        // height: 300,
        flex: 1,
      }}>
      <Text style={styles.headingText}>Transaction History</Text>

      <View style={styles.flexRow}>
        <TouchableHighlight  activeOpacity={0.6}
            underlayColor={secondaryColorTouch} style={styles.rectBox} onPress={() => navigation('My Lab Test Appointments')}>
          <View >
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
              }}>
              <LabTestDrawing />
              <Text style={styles.boxText}>Lab Test</Text>
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight  activeOpacity={0.6}
            underlayColor={secondaryColorTouch} style={styles.rectBox} onPress={() => navigation('My Appointments')}>
        <View >
          <View
            style={{
              alignItems: 'center',
              marginTop: 13.5,
            }}>
            <HospitalDrawing />

            <Text style={styles.boxText}>Hospital</Text>
          </View>
        </View>
        </TouchableHighlight>
        <TouchableHighlight  activeOpacity={0.6}
            underlayColor={secondaryColorTouch} style={styles.rectBox} onPress={() => navigation('My Appointments')}>
          <View >
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
              }}>
              <ConsultationDrawing />

              <Text style={styles.boxText}>Consultation</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
      <View style={[styles.flexRow, {marginVertical: 15}]}>
        <TouchableHighlight  activeOpacity={0.6}
            underlayColor={secondaryColorTouch} style={styles.rectBox} onPress={() => navigation('My Home Healthcare Appointments')}>
          <View >
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
              }}>
              <HomeTestDrawing />
              <Text style={styles.boxText}>Home Test</Text>
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight  activeOpacity={0.6}
            underlayColor={secondaryColorTouch} style={styles.rectBox} onPress={() => navigation('My Chats')}>
        <View >
          <View
            style={{
              alignItems: 'center',
              marginTop: 10,
            }}>
            <MyChatsDrawing />

            <Text style={styles.boxText}>My Chats</Text>
          </View>
        </View>
        </TouchableHighlight>
        <TouchableHighlight  activeOpacity={0.6}
            underlayColor={secondaryColorTouch} style={styles.rectBox} onPress={() => navigation('Video and Chat Service')}>
          <View >
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
              }}>
              <VideoConsultDrawing />

              <Text style={styles.boxText}>Video Consult</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
}
