import React, {useState} from 'react';
import {FlatList, ImageBackground, Pressable} from 'react-native';
import {View, Text, Item, Icon} from 'native-base';
import {styles} from './styles';
import {GlobalStyles} from '../../../Constants/GlobalStyles';

import StarRating from 'react-native-star-rating';
import DateTimePicker from 'react-native-modal-datetime-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { formatDate } from '../../../setup/helpers';

const getNoOfColumns = (length) => {
  let noOfCol = Math.floor(length / 2.5);
  return noOfCol;
};



const DoctorConsultation = (props) => {
  const [starCount, setStarCount] = useState(4);
  const[isVisible, setIsVisibleTrue] = useState(false)
  const [buttonSelected, setButtonSelected] = useState(0);
  const [dateOfConsulting, setDateOfConsulting] = useState('');


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

  const goToPaymentReview = () => {
    props.navigation.navigate(
      'Payment Review',
    );
  }


  const onPressConfirmDateValue = (date) => {
    setIsVisibleTrue(false)
    setDateOfConsulting(date)
  };
  const onCancelPicker = () => {
    setIsVisibleTrue(false)
  };

  const timeSelect = (itemID) => {
    setButtonSelected(itemID);
  };

  const renderItem = ({item}) => (
    <Pressable onPress={() => timeSelect(item.id)}>
      <View
        style={
          item.id === buttonSelected
            ? [styles.bookingOpen, {borderWidth: 2, borderColor: '#43b4a5'}]
            : [styles.bookingOpen]
        }>
        <Text>{item.title}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.outerContainer]}>
      <View style={[styles.topCurve]}></View>
      <View style={[styles.whiteCard]}>
        <View style={[GlobalStyles.flexRowJustifyCenter]}>
          <ImageBackground
            style={[styles.picCircle]}
            borderRadius={80}
            source={require('../../../../assets/images/docSample.jpg')}></ImageBackground>
        </View>
        <View
          style={[
            GlobalStyles.flexRowJustifyCenter,
            GlobalStyles.mt2,
            GlobalStyles.fontBold,
            {fontSize: 40},
          ]}>
          <Text
            style={[
              GlobalStyles.fontSize5,
              {color: '#128283', fontWeight: 'bold'},
            ]}>
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
          <Text style={[GlobalStyles.fontSize4, {color: 'rgba(0,0,0,0.4)'}]}>
            Dentist | 2 years experience
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={[GlobalStyles.flexRowJustifyCenter]}>
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
        <View style={styles.divider} />

        <View
          style={[
            GlobalStyles.flexRowAlignBaseline,
            styles.scheduleText,
            GlobalStyles.mt1,
          ]}>
              <Item regular style={{ borderRadius: 6, height: 35, padding: 10 }}>
              <Pressable
                style={{ flexDirection: 'row' }}
                isVisible={isVisible}
                onPress={() => setIsVisibleTrue(true)}
                testID="chooseDateOfConsulting">
                <Icon name="md-calendar" />
                <Text>
                {dateOfConsulting
                    ? formatDate(dateOfConsulting, 'DD/MM/YYYY')
                    : 'Date of Consulting'}
                  
                </Text>
                <DateTimePicker
                  mode={'date'}
                  //  minimumDate={subTimeUnit(new Date(), 7, 'days')}
                  //  maximumDate={new Date()}
                  value={dateOfConsulting}
                  isVisible={isVisible}
                  onConfirm={onPressConfirmDateValue}
                  onCancel={onCancelPicker}
                />
              </Pressable>
            </Item>
          {/* <Text style={{fontWeight: 'bold'}}>Schedule Consultation</Text> */}
        </View>
        <View
          style={[GlobalStyles.flexRowJustifySpaceEvenly, {marginLeft: 40}]}>
          <FlatList
            numColumns={getNoOfColumns(DATA.length)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={DATA}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={[styles.divider, GlobalStyles.mb1]} />
        <View style={[GlobalStyles.flexRowJustifyCenter]}>
          <Pressable onPress={() => goToPaymentReview()}>
            <View
              style={[
                styles.callNowButton,
                GlobalStyles.flexRowAlignCenter,
                GlobalStyles.mt3,
              ]}>
              <MaterialIcons
                name={'attach-money'}
                style={{fontSize: 25, color: '#128283'}}
              />
              <Text style={[styles.callNowButtonText]}>
                <View></View>Pay and Consult
              </Text>
            </View>
          </Pressable>
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
      </View>
    </View>
  );
};

export default DoctorConsultation;
