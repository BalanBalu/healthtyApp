import React, {Component} from 'react';
import {FlatList, ImageBackground, Pressable} from 'react-native';
import {View, Text, Item, Icon,Spinner,Button} from 'native-base';
import {styles} from './styles';
import {GlobalStyles} from '../../../Constants/GlobalStyles';
import {Col, Row} from 'react-native-easy-grid';
import StarRating from 'react-native-star-rating';
import DateTimePicker from 'react-native-modal-datetime-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {formatDate,addTimeUnit} from '../../../setup/helpers';
import {fetchAvailabilitySlots} from '../../providers/BookAppointmentFlow/action';
import { NegativeAppointmentDrawing } from '../../screens/Home/corporateHome/svgDrawings';
import ModalPopup from '../../../components/Shared/ModalPopup';
import {translate} from '../../../setup/translator.helper';
import { Loader } from '../../../components/ContentLoader';
import {
  renderDoctorImage,
  getDoctorEducation,
  getAllSpecialist,
  getUserGenderAndAge,
  toastMeassage,
  getDoctorExperience
} from '../../common';

const getNoOfColumns = (length) => {
  let noOfCol = Math.floor(length / 2.5);
  return noOfCol;
};

class DoctorConsultation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      starCount: '',
      isVisibleDatePicker: false,
      buttonSelected: 0,
      selectedDate: formatDate(new Date(), 'YYYY-MM-DD'),
      isLoading: true,
      availableSlots:[],
      isSlotBooked:false,
      refreshCount: 1,
      selectedIndex: -1,
      errorMsg: '',
      hospitalInfo:{},


    };
  }

  async componentDidMount() {
    let reqData4BookAppPage= this.props.navigation.getParam('reqData4BookAppPage');
   if(reqData4BookAppPage){
    await this.setState({hospitalInfo:reqData4BookAppPage.singleDoctorItemData.hospitalInfo,
      doctorData:reqData4BookAppPage.singleDoctorItemData,doctorId:reqData4BookAppPage.doctorId,
      hospitalId:reqData4BookAppPage.singleDoctorItemData&&reqData4BookAppPage.singleDoctorItemData.hospitalInfo&&reqData4BookAppPage.singleDoctorItemData.hospitalInfo._id?reqData4BookAppPage.singleDoctorItemData.hospitalInfo._id:null,
      isLoading: false,})
   } 
   let fromHistoryPage= this.props.navigation.getParam('fromHistoryPage')||false;
   if(fromHistoryPage){
    let reqData4HistoryPage= this.props.navigation.getParam('reqData4HistoryPage');
    await this.setState({
      hospitalInfo:reqData4HistoryPage.hospitalInfo,
      doctorData:reqData4HistoryPage.doctorInfo,
      doctorId:reqData4HistoryPage.doctorId,
      hospitalId:reqData4HistoryPage.hospitalInfo&&reqData4HistoryPage.hospitalInfo._id?reqData4HistoryPage.hospitalInfo._id:null,
      isLoading: false,})
   }
    await this.getAvailabilitySlots(this.state.selectedDate);

  }

  async getAvailabilitySlots(selectedDate) {
    try {
      // this.setState({isLoading: true});
      let resultData = await fetchAvailabilitySlots(
        this.state.doctorId,
        this.state.hospitalId,
        selectedDate,
      );
      if (resultData.success) {
        this.setState({data: resultData.data[0],slotData:resultData.data[0].slotData});
             
        if (this.state.slotData[selectedDate] != undefined) {
          await this.setState({ availableSlots: this.state.slotData[selectedDate] });
        }
      }
      this.setState({isLoading: false});
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({isLoading: false});
    }
  }

  onPressConfirmDateValue = (date) => {
    try {
      this.setState({isVisibleDatePicker: false, selectedIndex: -1,selectedDate: formatDate(date, 'YYYY-MM-DD')});
      this.getAvailabilitySlots(this.state.selectedDate);
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  };

  goToPaymentReview = () => {
    if (this.state.selectedIndex==-1) {
      this.setState({
        errorMsg: 'Please Select your appointment time',
        isModalVisible: true,
      });
      return false;
    }
    let obj={
      selectedSlot:this.state.selectedSlot,
      doctorDetails:this.state.data,
      hospitalInfo:this.state.hospitalInfo
    }
    this.props.navigation.navigate('Payment Review',{bookAppointment:obj});
    
   };

  onSelectedSlot = (item, index) => {
     this.setState({selectedSlot:item,selectedIndex: index}) 
  };
  noAvailableSlots() {
    return (
      <Row style={{ justifyContent: 'center', marginTop: 20 }}>
        <Button disabled style={{ alignItems: 'center', borderRadius: 10, backgroundColor: '#6e5c7b' }}>
          <Text>No Slots Available</Text>
          {/*nextAvailableDate ? <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 15 }}>Next Availability On {nextAvailableDate}</Text> : <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 16 }}> No Availablity for Next 7 Days</Text>*/}
        </Button>
      </Row>
    )
  }

  render() {
    const {isVisibleDatePicker, selectedDate,doctorData, data,isLoading,availableSlots,selectedIndex,errorMsg,isModalVisible} = this.state;
    return (
      <View style={[styles.outerContainer]}>
        <View style={[styles.topCurve]}></View>
        {isLoading ? <Loader style='list' /> :  

        <View style={[styles.whiteCard]}>
          <View style={[GlobalStyles.flexRowJustifyCenter]}>
            <ImageBackground
              style={[styles.picCircle]}
              borderRadius={80}
              source={doctorData&&doctorData.profileImage?renderDoctorImage(doctorData):null}></ImageBackground>
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
              {`${doctorData&&doctorData.firstName?doctorData.firstName+' ':''} ${doctorData&&doctorData.lastName?doctorData.lastName+' ':''}`}
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
            {doctorData&&doctorData.experience?(getDoctorExperience(doctorData.experience)+' Experience'):''}
            </Text>
          </View>
          {/* <View style={styles.divider} />
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
        <View style={styles.divider} /> */}

        <Text style={[styles.scheduleText,{fontWeight: 'bold',marginTop:10}]}>Schedule Consultation</Text>

          <View
            style={[
              GlobalStyles.flexRowAlignBaseline,
              styles.scheduleText,
              GlobalStyles.mt1,
            ]}>

            <Item regular style={{borderRadius: 6, height: 35, padding: 10}}>
              <Pressable
                style={{flexDirection: 'row'}}
                isVisible={isVisibleDatePicker}
                onPress={() =>
                  this.setState({isVisibleDatePicker: !isVisibleDatePicker})
                }
                testID="chooseDateOfConsulting">
                <Icon name="md-calendar" />
                <Text>
                  {selectedDate
                    ? formatDate(selectedDate, 'DD/MM/YYYY')
                    : 'Date of Consulting'}
                </Text>
                <DateTimePicker
                  mode={'date'}
                  minimumDate={addTimeUnit(new Date(),1,'day')}
                  maximumDate={addTimeUnit(new Date(), 1, 'month')}
                  value={selectedDate}
                  isVisible={isVisibleDatePicker}
                  onConfirm={this.onPressConfirmDateValue}
                  onCancel={() =>
                    this.setState({isVisibleDatePicker: !isVisibleDatePicker})
                  }
                />
              </Pressable>
            </Item>

          </View>
          {availableSlots&&availableSlots.length!=0?
          <View
            style={[GlobalStyles.flexRowJustifySpaceEvenly, {marginLeft: 40}]}>
            <FlatList
              numColumns={3}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={availableSlots}
              extraData={[availableSlots,selectedIndex]}

              renderItem={({ item, index }) =>
              <Pressable onPress={() => this.onSelectedSlot(item,index)}>
                <View
                  style={
                    selectedIndex === index 
                      ? [styles.bookingOpen, {borderWidth: 2, borderColor: '#43b4a5'}]
                      : [styles.bookingOpen]
                  }>
                  <Text>{formatDate(item.slotStartDateAndTime, 'hh:mm A')}</Text>
                </View>
              </Pressable>
            }
              keyExtractor={(item) => item.id}
            />
          </View>:(
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                // marginTop: 250
              }}>
              <NegativeAppointmentDrawing/>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: 15,
                  marginTop: "10%",
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}>
                {'No Slots Available'}
              </Text>
            </View>
          )}
          <View style={[styles.divider, GlobalStyles.mb1]} />
         
          <View style={[GlobalStyles.flexRowJustifyCenter]}>
            <Pressable onPress={() => this.goToPaymentReview()}>
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
          {/* <View style={[GlobalStyles.flexRowJustifyCenter]}>
            <Text
              style={[
                GlobalStyles.fontSize4,
                {color: 'rgba(0,0,0,0.3)'},
                GlobalStyles.mt3,
                {fontStyle: 'italic'},
              ]}>
              doctor last online 5 hours ago
            </Text>
          </View> */}
        </View>}
        <View style={{flex: 1}}>
            <ModalPopup
              errorMessageText={errorMsg}
              closeButtonText={translate('CLOSE')}
              closeButtonAction={() =>
                this.setState({isModalVisible: !isModalVisible})
              }
              visible={isModalVisible}
            />
          </View>
      </View>
    );
  }
}
export default DoctorConsultation;
