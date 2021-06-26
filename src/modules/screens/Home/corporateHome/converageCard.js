import React, { useState, useEffect } from 'react';
import { Text, View } from 'native-base';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import {
  PreAuthDrawing,
  ClaimStatusDrawing,
  PolicyCoverageDrawing,
  ClaimInitiationDrawing,
  HospitalDrawing,
  InsuranceRenewalDrawing
} from './svgDrawings';
import { primaryColor, secondaryColorTouch } from '../../../../setup/config';
import CurrentLocation from '../CurrentLocation';
import { translate } from "../../../../setup/translator.helper";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const CoverageCard = props => {
  const [count, setCount] = useState('en');
  const { navigation } = props;
  const navigationTo = () => {
    CurrentLocation.getCurrentPosition();
    navigation('NetworkHospitals')
  }
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
        // height: 300,
        flex: 1,
        marginTop: 6,
      }}>
      <Text style={styles.headingText}>{translate("Coverage")}</Text>

      <View style={styles.flexRow}>
        <TouchableHighlight
          style={styles.rectBox}
          activeOpacity={0.6}
          underlayColor={secondaryColorTouch}
          onPress={() => navigation('PreAuthList')}>
          <View>
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
              }}>
              <PreAuthDrawing />
              {(count === 'ta') || (count === 'ma') ? <Text style={styles.boxTextSmall}>{translate("Pre Auth")}</Text> : <Text style={styles.boxText}>{translate("Pre Auth")}</Text>}
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.rectBox}
          activeOpacity={0.6}
          underlayColor={secondaryColorTouch}
          onPress={() => navigation('PolicyStatus')}>
          <View>
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
              }}>
              <ClaimStatusDrawing />
              {(count === 'ta') || (count === 'ma') ? <Text style={styles.boxTextSmall}>{translate("Claim Status")}</Text> : <Text style={styles.boxText}>{translate("Claim Status")}</Text>}
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.rectBox}
          activeOpacity={0.6}
          underlayColor={secondaryColorTouch}
          onPress={() => navigation('PolicyCoverage')}>
          <View>
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
              }}>
              <PolicyCoverageDrawing />
              {(count === 'ta') || (count === 'ma') ? <Text style={styles.boxTextSmall}>{translate("Policy Cover")}</Text> : <Text style={styles.boxText}>{translate("Policy Cover")}</Text>}
            </View>
          </View>
        </TouchableHighlight>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 15,
        }}>
        <TouchableHighlight
          style={styles.rectBox}
          activeOpacity={0.6}
          underlayColor={secondaryColorTouch}
          onPress={() => navigation('ClaimIntimationList')}>
          <View>
            <View
              style={{
                alignItems: 'center',
                marginTop: 3,
              }}>
              <ClaimInitiationDrawing />
              {(count === 'ta') || (count === 'ma') ? <Text style={styles.boxTextSmall}>{translate("Claim Intimation")}</Text> : <Text style={styles.boxText}>{translate("Claim Intimation")}</Text>}
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor={secondaryColorTouch}
          style={styles.rectBox}
          onPress={() => navigationTo()}>
          <View>

            <View
              style={{
                alignItems: 'center',
                marginTop: 13.5,
              }}>
              <HospitalDrawing />
              {(count === 'ta') || (count === 'ma') ? <Text style={styles.boxTextSmall}>{translate("Network Hospital")}</Text> : <Text style={styles.boxText}>{translate("Network Hospital")}</Text>}
            </View>

          </View>
        </TouchableHighlight>
        <View style={[styles.rectBoxNone]} />
      </View>
    </View>
  );
};
