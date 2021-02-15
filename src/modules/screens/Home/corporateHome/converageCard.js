import React from 'react';
import {Text, View} from 'native-base';
import {TouchableHighlight} from 'react-native-gesture-handler';
import styles from './styles';
import {
  PreAuthDrawing,
  ClaimStatusDrawing,
  PolicyCoverageDrawing,
  ClaimInitiationDrawing,
  InsuranceRenewalDrawing,
} from './svgDrawings';
import {primaryColor, secondaryColorTouch} from '../../../../setup/config';

export const CoverageCard = props => {
  const {navigation} = props;
  return (
    <View
      style={{
        // height: 300,
        flex: 1,
        marginTop: 6,
      }}>
      <Text style={styles.headingText}>Coverage</Text>

      <View style={styles.flexRow}>
        <TouchableHighlight
          style={styles.rectBox}
          activeOpacity={0.6}
          underlayColor={secondaryColorTouch}
          onPress={() => navigation('preAuthList')}>
          <View>
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
              }}>
              <PreAuthDrawing />
              <Text style={styles.boxText}>Pre Auth</Text>
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

              <Text style={styles.boxText}>Claim Status</Text>
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

              <Text style={styles.boxText}>Policy Cover</Text>
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

              <Text style={styles.inititationText1}>Claim</Text>
              <Text style={styles.initiationText2}>Initiation</Text>
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
        style={styles.rectBox}
            activeOpacity={0.6}
            underlayColor={secondaryColorTouch}
            onPress={() => navigation('InsuranceRenewal')}>
        <View >
          
            <View
              style={{
                alignItems: 'center',
                marginTop: 4,
              }}>
              <InsuranceRenewalDrawing />

              <Text style={styles.insuranceRenewalText}>Insurance Renewal</Text>
            </View>
         
        </View>

        </TouchableHighlight>

        <View style={[styles.rectBoxNone]} />
      </View>
    </View>
  );
};
