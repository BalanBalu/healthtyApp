import React, {useState} from 'react';
import {Text} from 'react-native';
import {View} from 'native-base';
import {styles} from './styles';
import {GlobalStyles} from '../../../Constants/GlobalStyles';

const DoctorConsultation = () => {
  const [count, setCount] = useState(10);

  return (
    <View style={[styles.outerContainer]}>
      <View style={[styles.topCurve]}></View>
      <View style={[styles.whiteCard]}>
        <View style={[GlobalStyles.flexRowJustifyCenter]}>
        <View style={[styles.picCircle]}></View>
        </View>
       
      </View>
    </View>
  );
};

export default DoctorConsultation;
