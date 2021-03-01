import React from 'react';
import {TouchableOpacity,Image} from 'react-native';
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
      <Text style={styles.headingText}>Search & Book Appointment</Text>

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
              {/* <HomeTestDrawing /> */}
              <Image source={require('../../../../../assets/images/corporateHomePageIcons/HomeTestDesign.png')} style={{height:63,width:45,marginTop:-3}}/>
              <Text style={[styles.boxText,{marginTop:-3}]}>Home Care</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
      <View style={[styles.flexRow, {marginTop: 15}]}>
      
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

              <Text style={styles.boxText}>Chat Consult</Text>
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
         <View style={[styles.rectBoxNone]} />
      </View>
    </View>
  );
};
