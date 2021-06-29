import React, { useState, useEffect } from 'react';
import { TouchableHighlight, StyleSheet, Image } from 'react-native';
import { View, Text } from 'native-base'
import { primaryColor, secondaryColor, secondaryColorTouch } from '../../../../setup/config';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
import { translate } from "../../../../setup/translator.helper"



export const TransactionHistoryCard = (props) => {
  const [count, setCount] = useState('en');

  const { navigation } = props;
  useEffect(() => {
    selected_Language();
  })
  async function selected_Language() {
    try {
      let setDefaultLanguage = await AsyncStorage.getItem('setDefaultLanguage');
      if (setDefaultLanguage) {
        setCount(setDefaultLanguage)
      }
    }
    catch (e) {
      console.log(e)
    }
    finally {

    }
  }

  return (
    <View
      style={{
        marginTop: 6,
        // height: 300,
        flex: 1,
      }}>
      <Text style={styles.headingText}>{translate("Transaction History")}</Text>

      <View style={styles.flexRow}>
        <TouchableHighlight activeOpacity={0.6}
          underlayColor={secondaryColorTouch} style={styles.rectBox} onPress={() => navigation('My Lab Test Appointments')}>
          <View >
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
              }}>
              <LabTestDrawing />
              <Image source={require('../../../../../assets/images/corporateHomePageIcons/transactionNewIcon.png')} style={{ height: 23, width: 23, position: 'absolute', top: 30, right: 20 }} />
              {(count === 'ta') || (count === 'ma') ? <Text style={styles.boxTextSmall}>{translate("Lab Test")}</Text> : <Text style={styles.boxText}>{translate("Lab Test")}</Text>}
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight activeOpacity={0.6}
          underlayColor={secondaryColorTouch} style={styles.rectBox} onPress={() => navigation('My Appointments')}>
          <View >
            <View
              style={{
                alignItems: 'center',
                marginTop: 13.5,
              }}>
              <HospitalDrawing />
              <Image source={require('../../../../../assets/images/corporateHomePageIcons/transactionNewIcon.png')} style={{ height: 23, width: 23, position: 'absolute', top: 31, right: 10 }} />
              {(count === 'ta') || (count === 'ma') ? <Text style={styles.boxTextSmall}>{translate("Hospital")}</Text> : <Text style={styles.boxText}>{translate("Hospital")}</Text>}
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight activeOpacity={0.6}
          underlayColor={secondaryColorTouch} style={styles.rectBox} onPress={() => navigation('My Appointments')}>
          <View >
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
              }}>
              <ConsultationDrawing />
              <Image source={require('../../../../../assets/images/corporateHomePageIcons/transactionNewIcon.png')} style={{ height: 23, width: 23, position: 'absolute', top: 32, right: 30 }} />
              {(count === 'ta') || (count === 'ma') ? <Text style={styles.boxTextSmall}>{translate("Consultation")}</Text> : <Text style={styles.boxText}>{translate("Consultation")}</Text>}

            </View>
          </View>
        </TouchableHighlight>
      </View>
      <View style={[styles.flexRow, { marginVertical: 15, marginRight: 110 }]}>
        <TouchableHighlight activeOpacity={0.6}
          underlayColor={secondaryColorTouch} style={styles.rectBox} onPress={() => navigation('My Home Healthcare Appointments')}>
          <View >
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
              }}>
              {/* <HomeTestDrawing /> */}
              <Image source={require('../../../../../assets/images/corporateHomePageIcons/HomeTestDesign.png')} style={{ height: 63, width: 45, marginTop: -3 }} />

              <Image source={require('../../../../../assets/images/corporateHomePageIcons/transactionNewIcon.png')} style={{ height: 23, width: 23, position: 'absolute', top: 35.5, right: 11 }} />
              {(count === 'ta') || (count === 'ma') ? <Text style={[styles.boxTextSmall, { marginTop: -1 }]}>{translate("Home Care")}</Text> : <Text style={styles.boxText}>{translate("Home Care")}</Text>}

            </View>
          </View>
        </TouchableHighlight>
        {/* <TouchableHighlight  activeOpacity={0.6}
            underlayColor={secondaryColorTouch} style={styles.rectBox} onPress={() => navigation('My Chats')}>
        <View >
          <View
            style={{
              alignItems: 'center',
              marginTop: 10,
            }}>
            <MyChatsDrawing />
            <Image source={require('../../../../../assets/images/corporateHomePageIcons/transactionNewIcon.png')} style={{height:23,width:23,position:'absolute',top:31,right:17}} />

            <Text style={styles.boxText}>Chat Consult</Text>
          </View>
        </View>
        </TouchableHighlight> */}
        <TouchableHighlight activeOpacity={0.6}
          underlayColor={secondaryColorTouch} style={styles.rectBox} onPress={() => navigation('My Video Consultations')}>
          <View >
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
              }}>
              <VideoConsultDrawing />
              <Image source={require('../../../../../assets/images/corporateHomePageIcons/transactionNewIcon.png')} style={{ height: 23, width: 23, position: 'absolute', top: 31, right: 15 }} />
              {(count === 'ta') || (count === 'ma') ? <Text style={styles.boxTextSmall}>{translate("Tele Consult")}</Text> : <Text style={styles.boxText}>{translate("Tele Consult")}</Text>}
            </View>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
}
