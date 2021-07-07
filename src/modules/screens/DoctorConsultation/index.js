import React, {useState} from 'react';
import {ImageBackground} from 'react-native';
import {View, Text} from 'native-base';
import {styles} from './styles';
import {GlobalStyles} from '../../../Constants/GlobalStyles';
import StarRating from 'react-native-star-rating';

const DoctorConsultation = () => {
  const [starCount, setStarCount] = useState(4);

  return (
    <View style={[styles.outerContainer]}>
      <View style={[styles.topCurve]}></View>
      <View style={[styles.whiteCard]}>
        <View style={[GlobalStyles.flexRowJustifyCenter]}>
          <ImageBackground
            style={[styles.picCircle]}
            borderRadius={80}
            source={require('../../../../assets/images/loginBG.jpeg')}></ImageBackground>
        </View>
        <View
          style={[
            GlobalStyles.flexRowJustifyCenter,
            GlobalStyles.mt2,
            GlobalStyles.fontBold,
            {fontSize: 40},
          ]}>
          <Text style={[GlobalStyles.fontSize5, {color: '#128283'}]}>
            Sachin Tendulkar
          </Text>
        </View>
        <View
          style={[
            GlobalStyles.flexRowJustifyCenter,
            GlobalStyles.mt1,
            GlobalStyles.fontBold,
            {fontSize: 40},
          ]}>
          <Text style={[GlobalStyles.fontSize4, {color: 'rgba(0,0,0,0.7)'}]}>
            Dentist
          </Text>
        </View>
        <View style={[GlobalStyles.flexRowJustifyCenter, GlobalStyles.mt2]}>
          <StarRating
            starSize={30}
            fullStarColor={'orange'}
            disabled={false}
            maxStars={5}
            rating={starCount}
            selectedStar={(rating) => setStarCount(rating)}
          />
          <Text style={[GlobalStyles.ml2, {color: 'rgba(0,0,0,0.5)', top: 4}]}>
            4.0 of 344 reviews
          </Text>
        </View>
        <View style={[GlobalStyles.flexRowJustifyCenter]}>
          <Text
            style={[
              GlobalStyles.fontSize4,
              {color: 'rgba(0,0,0,0.3)'},
              GlobalStyles.mt3,
              {fontStyle: 'italic'},
            ]}>
            doctor last online 5 hours ago
          </Text>
        </View>
        <View style={[GlobalStyles.flexRowJustifyCenter]}>
          <View
            style={[
              styles.callNowButton,
              GlobalStyles.flexRowAlignCenter,
              GlobalStyles.mt3,
            ]}>
            <Text style={[styles.callNowButtonText]}>Call Now</Text>
          </View>
        </View>
        <View style={[GlobalStyles.flexRowJustifySpaceEvenly]}>
          <View style={[styles.bookingOpen]}>
            <Text>Hello</Text>
          </View>
          <View style={[styles.bookingOpen]}>
            <Text>Hello</Text>
          </View>
          <View style={[styles.bookingOpen]}>
            <Text>Hello</Text>
          </View>
          <View style={[styles.bookingOpen]}>
            <Text>Hello</Text>
          </View>
          <View style={[styles.bookingOpen]}>
            <Text>Hello</Text>
          </View>
          
        </View>
      </View>
    </View>
  );
};

export default DoctorConsultation;
