import React, {useState} from 'react';
import {FlatList, ImageBackground, Pressable} from 'react-native';
import {View, Text} from 'native-base';
import {styles} from './styles';
import {GlobalStyles} from '../../../Constants/GlobalStyles';
import StarRating from 'react-native-star-rating';



const getNoOfColumns = (length) => { 
  let noOfCol = Math.floor(length / 2.5)
  return noOfCol
}

const DoctorConsultation = () => {
  const [starCount, setStarCount] = useState(4);

  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: '4.00 PM',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: '5.00 PM',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: '6.00 PM',
    },
    {
      id: '58694dsa0f-3da1-471f-bd96-145571e29d72',
      title: '6.00 PM',
    },
    {
      id: '58694vvdsdsfa0f-3da1-471f-bd96-145571e29d72',
      title: '9.00 PM',
    },
    {
      id: '58ds694a0f-3da1-471sjndsf-bd96-145571e29d72',
      title: '8.00 PM',
    },
    {
      id: '58694a0f-3da1-471cxkf-bd96-145571e29d72',
      title: '6.00 PM',
    },
    {
      id: '5869b4a0f-3da1-471dsnjnjlf-bd96-145571e29d72',
      title: '4.00 PM',
    },
  ];

  

  
  const renderItem = ({ item }) => (
    
    <View style={styles.bookingOpen}>
      <Text>{item.title}</Text>
    </View>
    
  );

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
          <Text style={[GlobalStyles.fontSize5, {color: '#128283', fontWeight: 'bold'}]}>
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
          <Pressable>
          <View
            style={[
              styles.callNowButton,
              GlobalStyles.flexRowAlignCenter,
              GlobalStyles.mt3,
            ]}>
            <Text style={[styles.callNowButtonText]}>Call Now</Text>
          </View>
          </Pressable>
        </View>
        <View style={[GlobalStyles.flexRowAlignBaseline, styles.scheduleText]}>
          <Text style={{fontWeight: 'bold'}}>Schedule Consultation</Text>
        </View>
        <View style={[GlobalStyles.flexRowJustifySpaceEvenly, {marginLeft: 40}]}>
        <FlatList
        numColumns={getNoOfColumns(DATA.length)}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={DATA}
        renderItem={renderItem}
        // keyExtractor={item => item.id}
      />
          
        </View>
      </View>
    </View>
  );
};

export default DoctorConsultation;
