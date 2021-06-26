import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import { primaryColor, secondaryColor } from '../../../../setup/config'
import { FamilyData } from './svgDrawings';
// import { translate } from "../../../../setup/translator.helper"
import styles from './styles';

export const ProfileFamilyCard = props => {
  const [count, setCount] = useState('en');
  const { navigation, translate } = props;
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
    <TouchableHighlight activeOpacity={0.6}
      underlayColor="#fff" onPress={() => navigation('E Card')}>
      <View
        style={styles.commonCardDesignment}>
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
              fontFamily: 'opensans-bold',
              fontSize: 18,
            }}>
            {translate('Family')}
          </Text>
          {(count == 'ta') || (count == 'ma') ?
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Roboto',
                fontSize: 11,
                lineHeight: 24,
              }}>
              {translate('View E card and family')} {'\n'}{translate('profile from here')}{' '}
            </Text> : <Text
              style={{
                color: '#fff',
                fontFamily: 'Roboto',
                fontSize: 13,
                lineHeight: 24,
              }}>
              {translate('View E card and family')} {'\n'}{translate('profile from here')}{' '}
            </Text>
          }

        </View>
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
        {/* <Image
          source={require('../../../../../assets/images/group.png')}
          style={{height: 60, width: 140, position: 'absolute', right: 5, top: 68}}
        /> */}
        <View style={{ position: 'absolute', right: 20, top: -160 }}>
          <FamilyData />
        </View>

      </View>
    </TouchableHighlight>
  );
};
