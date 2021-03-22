import React from 'react';
import { View, TouchableOpacity,TouchableHighlight,Text, Image,Linking } from 'react-native';
import {Card} from 'native-base';

import Svg, { Path } from 'react-native-svg';
import { primaryColor, secondaryColor } from '../../../../setup/config'
import { ContactUsImage } from './svgDrawings';
import styles from './styles'
import { Col, Row, Grid } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { translate } from "../../../../setup/translator.helper"

export const ContactUsCard = props => {
  const { navigation,data } = props;
  const  dialCall = (number) => {
    let phoneNumber = '';
    if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
    else { phoneNumber = `telprompt:${number}`; }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <TouchableHighlight activeOpacity={0.6}
      underlayColor="#fff" onPress={() => navigation('ContactUs')}>
      <View
        style={{
          marginTop: 6,
          // height: 300,
          flex: 1,
        }}>
        {/* <Text style={styles.headingText}>Contact Details</Text> */}
        <View

          style={{
            backgroundColor: primaryColor,
            height: 135,
            borderRadius: 22,
            marginTop: 0,
            marginBottom: 5,
            marginHorizontal: 10,
            position: 'relative',
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginLeft: 20,
              marginTop: 15,
            }}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'OpenSans',
                fontSize: 18,
                fontWeight: '700',
              }}>
              {translate("Help line")}
          </Text>
          <TouchableOpacity onPress={() =>{dialCall(data&&data.value ? data.value : '') }} style={{paddingRight:20}}>
            <View  style={{ flexDirection: 'row' }}>
              <MaterialIcons name="phone" style={{ fontSize: 15, color: '#fff',marginTop:5 }} />
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'OpenSans',
                  fontSize: 15,
                  lineHeight: 24,
                  marginLeft:5
                }}>{ data&&data.value ? data.value : ''}</Text>
               
            </View>
            </TouchableOpacity>
          </View>
          
          <Row style={{ marginTop: 10, marginLeft: 20 }}>
            <TouchableOpacity style={{ borderRadius: 15, borderColor: '#fff', borderWidth: 1, paddingHorizontal: 5, height: 25, justifyContent: 'center', flexDirection: 'row' }} onPress={() => navigation('ContactUs')}>
              <Text style={{ color: '#fff', textAlign: 'center' }}>{translate("Contact Us")}</Text>
              <MaterialIcons name="keyboard-arrow-right" style={{ color: '#fff', fontSize: 20, }} />

            </TouchableOpacity>
          </Row>

          <View style={{ position: 'absolute', top: 0, right: -11.5 }}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="192.099"
              height="135.165"
              viewBox="0 0 194.099 155.165">
              <Path
                id="Path_5183"
                data-name="Path 5183"
                d="M731.328,89.558V193.773c0,14.069-8.41,25.475-18.785,25.475H537.229c1.332-15.262,8.316-59.808,44.717-75.579,44.213-19.141,38.56-79.586,38.56-79.586h92.037C722.917,64.083,731.328,75.489,731.328,89.558Z"
                transform="translate(-537.229 -64.083)"
                fill="#b1d9d9"
              />
            </Svg>
          </View>
          <View style={{position:'absolute',right:15,top:35 }}>
            <ContactUsImage />
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};
