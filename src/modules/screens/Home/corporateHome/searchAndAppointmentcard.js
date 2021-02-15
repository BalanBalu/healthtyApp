import React from 'react';
import {TouchableOpacity} from 'react-native';
import {View, Text} from 'native-base';
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
  VideoConsultDrawing,
} from './svgDrawings';

import styles from './styles';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {primaryColor, secondaryColor, secondaryColorTouch} from '../../../../setup/config';

export const SearchAndAppointmentCard = props => {
  const {navigation} = props;

  return (
    <View
      style={{
        // height: 300,
        flex: 1,
        marginTop: 6,
        // marginTop: -15
      }}>
      <Text style={styles.headingText}>Search & Book Appoinment</Text>

      <View style={styles.flexRow}>
      <TouchableHighlight
      style={styles.rectBox}
            activeOpacity={0.6}
            underlayColor={secondaryColorTouch}
            onPress={() => navigation('Lab Test')}>
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
        <TouchableHighlight
            activeOpacity={0.6}
            underlayColor={secondaryColorTouch}
            style={styles.rectBox}
            onPress={() => navigation('NetworkHospitals')}>
        <View>
          
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

        <TouchableHighlight
         activeOpacity={0.6}
         underlayColor={secondaryColorTouch}
          style={styles.rectBox}
          
          onPress={() => navigation('Categories')}>
          <View>
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
      <View style={[styles.flexRow, {marginTop: 15}]}>
        <TouchableHighlight
         activeOpacity={0.6}
         underlayColor={secondaryColorTouch}
          style={styles.rectBox}
         
          onPress={() => navigation('Home Healthcare Address List')}>
          <View>
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
        <TouchableHighlight
          style={styles.rectBox}
          activeOpacity={0.6}
          
          underlayColor='#B1D9D9'
          number={0.1}
          onPress={() => navigation('Video and Chat Service')}>
          <View>
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
        <TouchableHighlight
          style={styles.rectBox}
          activeOpacity={0.6}
          underlayColor={secondaryColorTouch}
          onPress={() => navigation('Video and Chat Service')}>
          <View>
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
};