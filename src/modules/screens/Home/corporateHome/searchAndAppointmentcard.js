import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Image, FlatList, Linking, Alert } from 'react-native';
import { View, Text } from 'native-base';
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
import { TouchableHighlight } from 'react-native-gesture-handler';
import { primaryColor, secondaryColor, secondaryColorTouch } from '../../../../setup/config';
import { requestCalendarPermissions, createCalendar } from '../../../../setup/calendarEvent';
import RNCalendarEvents from "react-native-calendar-events";
import { translate } from "../../../../setup/translator.helper"
import AsyncStorage from '@react-native-async-storage/async-storage';


export const SearchAndAppointmentCard = props => {
  const [count, setCount] = useState(0);
  const { navigation } = props;
  const navigateToSettings = () => {
    Linking.openSettings();
  }
  useEffect(() => {
    selected_Language();
  })
  async function selected_Language() {
    try {
      let selectedLanguage = await AsyncStorage.getItem("selectedLanguage");
      let selectedLang = JSON.parse(selectedLanguage);
      let Data = setCount(selectedLang.index)
      
    }
    catch (e) {
      console.log(e)
    }
    finally {

    }
  }
  const navigateBycalenderPermission = async () => {
    const permissionResult = await requestCalendarPermissions()
    console.log("permissionResult", permissionResult)
    if (permissionResult === 'authorized') {
      createCalendar();
      const { navigation } = props;
      navigation("Categories")
    }
    else {
      let status = await RNCalendarEvents.checkPermissions((readOnly = false));
      // console.log("status",status)
      if (status === 'restricted') {
        Alert.alert(
          'Alert',
          "Calendar permission is necessary to proceed, You want to give permission now in settings page",
          [
            {
              text: 'ALLOW',
              onPress: () => navigateToSettings(),
            }
          ],



          { cancelable: false }


        );
        // alert("Calendar permission")
        // Linking.openSettings();
      }
    }

  }
  return (
    <View
      style={{
        // height: 300,
        flex: 1,
        marginTop: 6,
        // marginTop: -15
      }}>
      <Text style={styles.headingText}>{translate("Search & Book Appointment")}</Text>

      <View style={styles.flexRow}>

        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor={secondaryColorTouch}
          style={styles.rectBox}

          onPress={() => navigateBycalenderPermission()}>
          <View>
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
              }}>
              <ConsultationDrawing />
              {(count === 1) || (count === 2) ? <Text style={styles.boxTextSmall}>{translate("Consultation")}</Text> : <Text style={styles.boxText}>{translate("Consultation")}</Text>}
            </View>
          </View>
        </TouchableHighlight>
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
              {(count === 1) || (count === 2) ? <Text style={styles.boxTextSmall}>{translate("Lab Test")}</Text> : <Text style={styles.boxText}>{translate("Lab Test")}</Text>}
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
              <Image source={require('../../../../../assets/images/corporateHomePageIcons/HomeTestDesign.png')} style={{ height: 63, width: 45, marginTop: -3 }} />
              {(count === 1) || (count === 2) ? <Text style={[styles.boxTextSmall,{marginTop:-5}]}>{translate("Home Care")}</Text> : <Text style={styles.boxText}>{translate("Home Care")}</Text>}
            </View>
          </View>
        </TouchableHighlight>
      </View>
      <View style={{ marginLeft: 8, justifyContent: 'space-around', marginVertical: 1, marginTop: 15 }}>
        {/*       
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
        </TouchableHighlight> */}
        <TouchableHighlight
          style={styles.rectBox}
          activeOpacity={0.6}
          underlayColor={secondaryColorTouch}
          // onPress={() => navigation('Video and Chat Service')}>
          onPress={() => navigateBycalenderPermission()}>

          <View>
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
              }}>
              <VideoConsultDrawing />
              {(count === 1) || (count === 2) ? <Text style={styles.boxTextSmall}>{translate("Tele Consult")}</Text> : <Text style={styles.boxText}>{translate("Tele Consult")}</Text>}
            </View>
          </View>
        </TouchableHighlight>
        <View style={[styles.rectBoxNone]} />
      </View>
    </View>
  );
};
