import React, { Component } from 'react';
import { Container, Content, Text ,Segment, Button, Card, List, ListItem, Right, Thumbnail, Body, Icon, Toast, Footer} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, } from 'react-native';
import StarRating from 'react-native-star-rating';
import { formatDate, addMoment, getMoment } from '../../../setup/helpers';
import {  fetchAvailabilitySlots, 
          insertDoctorsWishList, 
          SET_SINGLE_DOCTOR_DATA, 
          SET_PATIENT_WISH_LIST_DOC_IDS, 
          SET_FAVORITE_DOCTOR_COUNT_BY_IDS, 
          getDoctorFaviouteList , 
          getPatientWishList ,
          getDoctorsReviewsCount,
          addToWishListDoctor,
          getMultipleDoctorDetails
        } from '../../providers/bookappointment/bookappointment.action';
import moment from 'moment';
import { renderDoctorImage, getDoctorSpecialist, getDoctorEducation } from '../../common';
import { store } from '../../../setup/store';
import HospitalLocation from './HospitalLocation';
import Reviews from '../Reviews'
const NO_OF_SLOTS_SHOULD_SHOW_PER_SLIDE = 3;
import { Loader } from '../../../components/ContentLoader';
processedDoctorDetailsAndSlotData = null;
showedHospitalDoctorId = null;
selectedSlotLocationShowed = null;
selectedSlotFee = null;
showedFee = null;


fields = "first_name,last_name,prefix,professional_statement,gender,specialist,education,language,gender_preference,experience,profile_image";
class BookAppoinment extends Component {
  processedAvailabilityDates = [];
  constructor(props) {
    super(props)

    this.state = {
      selectedSlotItem: null,
      isLoading: true  ,
      pressTab: 1,   
      selectedDate: formatDate(new Date(),'YYYY-MM-DD'),
      selectedSlotIndex: -1,
      sliderPageIndex: 0,
      doctorData: {
        prefix: null,
        slotData: {}
      },
      doctorDetails : null,
      showedFee: undefined,
      doctorId: null,
      slotDatesToShow : [],
      isAvailabilityLoading: false
    }

  }

 

  async componentDidMount() {
    const { navigation } = this.props;
    const availabilitySlots = navigation.getParam('fetchAvailabiltySlots') || false;
    this.setState({ isLoading: true });
    let startDateMoment =getMoment(new Date());
    let endDateMoment = addMoment(this.state.selectedDate, 7, 'days')
    if(availabilitySlots) {
      
      const doctorId = navigation.getParam('doctorId') || false;
      
    
      getDoctorFaviouteList(doctorId);
      getDoctorsReviewsCount(doctorId);
      await this.getdoctorDetails(doctorId);
     
      let userId = await AsyncStorage.getItem('userId');
      if(userId) {
        getPatientWishList(userId);
      }
      this.setState({doctorId:doctorId});
      await this.getAvailabilitySlots(doctorId, startDateMoment, endDateMoment);
      await this.getLocationDataBySelectedSlot(this.state.doctorData.slotData[this.state.selectedDate],this.state.doctorData.slotData, this.state.selectedSlotIndex);
    } else {
        this.processedAvailabilityDates =  navigation.getParam('processedAvailabilityDates');
        const { bookappointment: {  singleDoctorData } } = this.props;
        this.processedDoctorDetailsAndSlotData = singleDoctorData;
        this.getLocationDataBySelectedSlot(singleDoctorData.slotData[this.state.selectedDate],singleDoctorData.slotData, this.state.selectedSlotIndex)
        let doctorDetails = {
          ...singleDoctorData
        }
        delete doctorDetails.slotData;
        delete doctorDetails.location;
        await this.setState({ doctorId: singleDoctorData.doctorId, doctorData: singleDoctorData, doctorDetails });
        console.log(this.state.doctorDetails);
    }
    this.setState({ isLoading: false, slotDatesToShow : this.slotDatesToShow });
  }
  
   
 
 
  /*FromAppointment list(Get availability slots)*/
  async getAvailabilitySlots(fromAppointmentDoctorId, startDate, endDate) {
    console.log('started loading get availability');
    this.setState({ isAvailabilityLoading: true });
        try {
          let totalSlotsInWeek = {
            startDate: formatDate(startDate, 'YYYY-MM-DD'),
            endDate: formatDate(endDate, 'YYYY-MM-DD')
        }
        let resultData = await fetchAvailabilitySlots(fromAppointmentDoctorId, totalSlotsInWeek);
        if (resultData.success) {
          for (let docCount = 0; docCount < resultData.data.length; docCount++) { 
            let doctorSlotData = resultData.data[docCount];
            if (this.processedDoctorDetailsAndSlotData) {
              for (var key in doctorSlotData.slotData) {
                if (this.processedDoctorDetailsAndSlotData.slotData[key] === undefined) {
                    this.processedDoctorDetailsAndSlotData.slotData[key] = doctorSlotData.slotData[key]
                }
              }
            } else {
                let doctorDetailsData = this.state.doctorDetails; //this.doctorDetailsMap.get(doctorSlotData.doctorId)
                let obj = {
                  ...doctorDetailsData,
                  slotData: doctorSlotData.slotData,
                }
                
                this.processedDoctorDetailsAndSlotData = obj;
            }
          }
          this.enumarateDates(startDate, endDate)
          store.dispatch({
             type: SET_SINGLE_DOCTOR_DATA,
             data: this.processedDoctorDetailsAndSlotData
          })
          console.log(this.processedDoctorDetailsAndSlotData);
          await this.setState({ doctorData: this.processedDoctorDetailsAndSlotData });
        }
        } catch (error) {
            console.log(error);
        } finally {
          this.setState({ isAvailabilityLoading : false })
        }
        
}

enumarateDates(startDate, endDate) {
  
  let now = startDate.clone();
  while (now.isSameOrBefore(endDate)) {
    this.processedAvailabilityDates.push(now.format('YYYY-MM-DD'));
    now = now.add(1, 'day');
  }
  console.log(this.processedAvailabilityDates);
}

  /*Get doctor Qualification details*/
  getdoctorDetails = async (doctorId) => {
    console.log("doctor" + doctorId);
    console.log(fields+'fields');
    let resultDoctorDetails = await getMultipleDoctorDetails(doctorId, fields);
    console.log('resultDoctorDetails'+JSON.stringify(resultDoctorDetails))
    if (resultDoctorDetails.success) {
        await this.setState({ doctorDetails : resultDoctorDetails.data[0]});
    }
  }
  onSegemntClick(index){
      this.setState({pressTab: index})
  }

  noAvailableSlots() {    
    return (
      <View style={{alignItems:'center'}}>
         <Text style={{ marginTop: 10, fontSize:15,borderColor:'gray',borderRadius:5,alignItems:'center'}} >No slots available </Text>
      </View>
    )
  }

  haveAvailableSlots(slotsData) {
    let { selectedSlotIndex } = this.state;
    return (
      // <Row>
      //   <Col style={{width:'8%'}}></Col>
       
      <FlatList
        numColumns={4}
        data={slotsData}
        extraData={[this.state.selectedDate,this.state.selectedSlotIndex]}
        renderItem={( { item, index }) =>
       <Col style={{width:'25%'}}>
        <TouchableOpacity disabled={item.isSlotBooked} 
              style={item.isSlotBooked ? styles.slotBookedBgColor : selectedSlotIndex === index ? 
                     styles.slotSelectedBgColor : styles.slotDefaultBgColor} 
              onPress={() => this.onSlotItemPress(item, index )}>
         <Text style={item.isSlotBooked ? styles.slotBookedTextColor : selectedSlotIndex === index ? styles.slotBookedTextColor : styles.slotDefaultTextColor}> {formatDate(item.slotStartDateAndTime, 'hh:mm A')} </Text>
        {/* item.isSlotBooked ? <Text style={styles.slotBookedTextColor}>Booked</Text> : null */}
        </TouchableOpacity>
       </Col>
       } 
      keyExtractor={(item, index) => index.toString()}/>
     // <Col style={{width:'8%'}}></Col></Row>
   )
}

addToWishList = async (doctorId) => {
  try {
       let userId = await AsyncStorage.getItem('userId');
       let result = await addToWishListDoctor(doctorId, userId);
       if(result)
        Toast.show({
            text: result.message,
            type: "success",
            duration: 3000,
        })
        this.setState( { refreshCount : this.state.refreshCount + 1});
}
  catch (e) {
      console.log(e);
  }
}

getLocationDataBySelectedSlot(slotDataForTheSelectedDay, wholeSlotData, slotIndex) {
  
  let  selectedSlotIndex = slotIndex >= 0 ? slotIndex : 0;
  
  if(slotDataForTheSelectedDay === undefined) {
    console.log('Selected Slot For the day is Undefined');
    slotDataForTheSelectedDay = wholeSlotData[Object.keys(wholeSlotData)[0]]
  }
  if(slotDataForTheSelectedDay) {
    this.selectedSlotLocationShowed  = slotDataForTheSelectedDay[selectedSlotIndex].location;
    this.selectedSlotFee  = slotDataForTheSelectedDay[selectedSlotIndex].fee;
  }
  return this.selectedSlotLocationShowed;
}
slidePrevious = async () => {
  let sliderPageIndex  = this.state.sliderPageIndex || 0;
  if(sliderPageIndex !== 0) {
      sliderPageIndex = sliderPageIndex - 1;
      await this.setState({sliderPageIndex}) 
      //this.getAvailabilityDateSliderData(doctorId)
  }
}
slideNext = async () => {
  let sliderPageIndex  = this.state.sliderPageIndex || 0;
  sliderPageIndex = sliderPageIndex + 1;
      await this.setState({sliderPageIndex}) 
      
     // this.getAvailabilityDateSliderData(doctorId)
}
getAvailabilityDateSliderData = () => {
  let sliderPageIndex  = this.state.sliderPageIndex || 0;
  let startingDataCount = sliderPageIndex * NO_OF_SLOTS_SHOULD_SHOW_PER_SLIDE;
  
  let endingDataCount = startingDataCount + NO_OF_SLOTS_SHOULD_SHOW_PER_SLIDE;
  let startDate = moment().add(startingDataCount, 'days');
  let now = startDate.clone();
  let availabiltySliderDates = [];
  for(let dateCount = startingDataCount; dateCount < endingDataCount; dateCount++ ) {
      availabiltySliderDates.push(now.format('YYYY-MM-DD'));
      now = now.add(1, 'day');
  }
  return availabiltySliderDates
}

/* Change the Date using Date Picker */
onDateChanged(date) {

  let { selectedDate, selectedSlotIndex, selectedSlotItem }  = this.state;
     
  selectedDate = date;
  selectedSlotIndex = -1;
  selectedSlotItem = null;
  
  this.setState({ selectedDate, selectedSlotIndex, selectedSlotItem});
  if (this.processedAvailabilityDates.includes(selectedDate) === false) {
     let endDateMoment = addMoment(getMoment(selectedDate), 7, 'days');
     this.getAvailabilitySlots(this.state.doctorId, getMoment(selectedDate), endDateMoment);
  }
}
async onSlotItemPress( item, index) {

  const { doctorData, selectedDate } = this.state;
  console.log(item);  
  let currentHostpitalId = item.location.hospital_id;
  let previouslyShowedHospitalId = this.selectedSlotLocationShowed.hospital_id;
  
    this.setState({ selectedSlotItem : item , selectedSlotIndex : index });
    this.getLocationDataBySelectedSlot(doctorData.slotData[selectedDate], doctorData.slotData, index);
      
    this.selectedSlotFee = item.fee;
 console.log( item);
 if(currentHostpitalId !== previouslyShowedHospitalId && (item.fee != this.showedFee)) {
    if(this.showedFee != null) {
      Toast.show({
        text: 'Appointment Fee and Hospital Location Updated',
        type:'warning',
        duration: 3000
      });
    }
    this.showedFee = item.fee
 } else if((item.fee != this.showedFee)) {
      if(this.showedFee != null) {
        Toast.show({
           text: 'Appointment Fee Updated',
           type:'warning',
           duration: 3000
        });
      }
      this.showedFee = item.fee
  } else if(currentHostpitalId !== previouslyShowedHospitalId) {
      Toast.show({
         text: 'Hospital Location Changed',
         type:'warning',
         duration: 3000
      });
  } 
}
onPressContinueForPaymentReview(doctorData, selectedSlotItem) {
  console.log(selectedSlotItem);   
  if(!selectedSlotItem) {
      Toast.show({
          text: 'Please Select a Slot to continue booking',
          type : 'warning',
          duration: 3000
      })
      return;
  }
  doctorData.doctorName = doctorData.first_name + ' ' + doctorData.last_name;
  doctorData.doctorId = doctorData.doctor_id;
  var confirmSlotDetails = {
      ...doctorData,
      slotData: selectedSlotItem
  };
  this.props.navigation.navigate('Payment Review', { resultconfirmSlotDetails: confirmSlotDetails })
 }


  render() {

    const { bookappointment: { patientWishListsDoctorIds, favouriteListCountByDoctorIds, reviewsByDoctorIds } } = this.props;
    const { qualification, doctorData, isLoading, selectedDate, selectedSlotItem, pressTab } = this.state;
    
   
    return (
<Container style={styles.container}>
{isLoading ?
   <Loader style='appointment' /> : 
<Content style={styles.bodyContent} contentContainerStyle={{ flex: 0 ,padding:10}}>
      
      <Card style={{  borderBottomWidth: 2 }}>
     
          <Grid >
            <Row >
              <Col style={{width:'5%',marginLeft:20,marginTop:10}}>
                  <Thumbnail square source={renderDoctorImage(doctorData)} style={{ height: 60, width: 60 }} />
               </Col>
               <Col style={{width:'78%'}}>
                  <Row style={{marginLeft:55,marginTop:10}}>
                     <Text style={{ fontFamily: 'OpenSans',fontSize:12,fontWeight:'bold'}}>{(doctorData.prefix ? doctorData.prefix + '. ' : '') + (doctorData.first_name || '') + ' ' + (doctorData.last_name || '')}</Text>
                  </Row>
                  <Row style={{marginLeft:55,}}>
                     <Text note  style={{ fontFamily: 'OpenSans',marginTop:-20 ,fontSize:11}}>{(getDoctorEducation(doctorData.education)) + ', ' +  getDoctorSpecialist(doctorData.specialist)}</Text>
                  </Row>
                  
               </Col>
                <Col style={{width:'17%'}}>
                   <Icon name="heart" onPress={()=>this.addToWishList(doctorData.doctor_id)} 
                      style={patientWishListsDoctorIds.includes(doctorData.doctor_id) ? {  color: '#B22222', fontSize:20 ,marginTop:10} : {  color: '#000000', fontSize:20 ,marginTop:10}}>
                    </Icon>
                   {/* <Row>
                     <Text style={{ fontFamily: 'OpenSans',marginTop:20,fontSize:12,marginLeft:5 }}> 2.6km</Text>
                   </Row> */}
                 </Col> 
             </Row>
           
             <Row style={{marginBottom:10}}>
                  <Col style={{width:"25%",marginTop:15,}}>        
                   <Text note style={{ fontFamily: 'OpenSans',fontSize:12,textAlign:'center' }}> Experience</Text>
                   <Text style={{ fontFamily: 'OpenSans',fontSize:12,fontWeight:'bold',textAlign:'center' }}> {doctorData.calulatedExperience ? doctorData.calulatedExperience.year + ' Yrs' : 'N/A'}</Text>
                  </Col>
                  <Col style={{width:"25%",marginTop:15,}}>
                    <Text note style={{ fontFamily: 'OpenSans',fontSize:12,textAlign:'center' }}> Rating</Text>
                          <View style={{flexDirection:'row',textAlign:'center',marginLeft:30}}>
                            <StarRating 
                              fullStarColor='#FF9500' 
                              starSize={12} width={85} 
                              containerStyle={{marginTop:2}} 
                                      disabled={true}
                                      rating={1}
                                      maxStars={1}/>
                            <Text style={{ fontFamily: 'OpenSans',fontSize:12,fontWeight:'bold',textAlign:'center' }}>{reviewsByDoctorIds[doctorData.doctor_id] ? ' '+ reviewsByDoctorIds[doctorData.doctor_id].average_rating : ' 0' }</Text>
                          </View>
                  </Col>
                          <Col style={{width:"25%",marginTop:15,}}>
                          
                          <Text note style={{ fontFamily: 'OpenSans',fontSize:12,textAlign:'center'}}> Favourite</Text>
                          <Text style={{ fontFamily: 'OpenSans',fontSize:12,fontWeight:'bold',textAlign:'center' }}> { favouriteListCountByDoctorIds[doctorData.doctor_id] ? favouriteListCountByDoctorIds[doctorData.doctor_id] : 0  }</Text>


                          </Col>
                          <Col style={{width:"25%",marginTop:15,}}>
                              <Text note style={{ fontFamily: 'OpenSans',fontSize:12,textAlign:'center' }}> Fees</Text>
                              <Text  style={{ fontFamily: 'OpenSans',fontSize:12,fontWeight:'bold',textAlign:'center' }}>{'\u20B9'}{this.selectedSlotFee}</Text>
                          </Col>
                      </Row>

                      {/* <Row style={{borderTopColor:'#000',borderTopWidth:0.5,padding:5,width:'100%',marginLeft:0,marginRight:0}}>
                        <Col style={{width:'33.33%',alignItems:'center',marginTop:10,borderRightColor:'#000',borderRightWidth:1}}>
                        <Icon  style={{fontSize:30}} name="ios-call"/>
                        </Col>
                        <Col style={{width:'33.33%',alignItems:'center',marginTop:10,borderRightColor:'#000',borderRightWidth:1}}>
                        <Icon  style={{fontSize:30}} name="ios-more"/>
                        </Col>
                        <Col style={{width:'33.33%',alignItems:'center',marginTop:10,}}>
                        <Icon  style={{fontSize:30}} name="ios-videocam"/>
                        </Col>
                      </Row> */}
                  </Grid>
            </Card>
       <Row style={{marginLeft:5,marginRight:5}}>
         <Segment>
           <Button first style={[{width:'33.33%',borderBottomWidth:4,alignItems:'center'}, pressTab === 1 ? { borderBottomColor:'#775DA3' } : { borderBottomColor:'#000' }  ] } onPress={()=>{this.onSegemntClick(1)}}>
             <Text style={{color:'#000',fontSize:12,fontFamily:'OpenSans',textAlign:'center',marginLeft:20}}>About</Text>
           </Button>
           <Button style={[{width:'33.33%',borderBottomWidth:4,alignItems:'center'} , pressTab === 2 ? { borderBottomColor:'#775DA3' } : { borderBottomColor:'#000' }]} onPress={()=>{this.onSegemntClick(2)}}>
             <Text style={{color:'#000',fontSize:12,fontFamily:'OpenSans',textAlign:'center',marginLeft:20}}>Reviews</Text>
           </Button>
           <Button last active style={[{width:'33.33%',borderBottomColor:'#000',borderBottomWidth:4,alignItems:'center'}, pressTab === 3 ? { borderBottomColor:'#775DA3' } : { borderBottomColor:'#000', }]} onPress={()=>{this.onSegemntClick(3)}}>
             <Text style={{color:'#000',fontSize:12,fontFamily:'OpenSans',marginLeft:20,textAlign:'center'}}>Services</Text>
           </Button>
         </Segment>
      </Row>

  {this.state.pressTab === 1 ? 
   <Content>
    {doctorData.professional_statement ?    
    <View>
      <View style={{marginLeft:5,marginRight:5}}>
        <Text note style={{ fontFamily: 'OpenSans',fontSize:12, }}>Description</Text>
        <Text style={{fontFamily:'OpenSans',fontSize:12}}>{doctorData.professional_statement}</Text>
      </View> 
      <Row style={{marginLeft:5,marginRight:5,paddingBottom:5}}>
        <Right><Text style={{ fontFamily: 'OpenSans',fontSize:15,color:'#775DA3' }}></Text></Right>
      </Row>
    </View> : null }
 


    <View>
      <Row style={{marginTop:10}}>
        <Text style={{fontSize:13,fontFamily:'OpenSans'}}>Select appoinment date and time</Text>
      </Row>
      {/*  <Row style={{marginLeft:'auto',marginRight:'auto'}}  >
          <Col style={{width:'8%'}}>
             <Icon name='ios-arrow-back' onPress={() => this.slidePrevious()} style={{fontSize:25,marginTop:25}}/>
          </Col> 
          this.getAvailabilityDateSliderData().map(date => {
            
             let availableslotData = doctorData.slotData ? doctorData.slotData[date] ? doctorData.slotData[date] : [] : [];
             let selectDate = this.state.selectedDate;
             console.log(availableslotData);
               return (
                <Col style={{width:'28%',}} key={date}>
                   <TouchableOpacity style={[styles.availabilityBG, selectDate === date ? { backgroundColor:'#775DA3' } : { backgroundColor:'#ced6e0' } ]} 
                      onPress={() => this.onDateChanged(date)}>
                        <Text style={[{textAlign:'center',fontSize:12,fontFamily:'OpenSans'}, selectDate === date ? { color:'#fff' } : { color:'#000' } ] }>{formatDate(moment(date), 'ddd, DD MMM')}</Text>
                       <Text style={[{textAlign:'center',fontSize:10,fontFamily:'OpenSans'}, selectDate === date ? { color:'#fff' } : { color:'#000' } ] }>{ availableslotData.length === 0 ? 'No Slots Available' : availableslotData.length + ' Slots Available' }</Text>
                     </TouchableOpacity>
                </Col>
              ) 
          }) }
          <Col style={{width:'8%'}}>
              <Icon name='ios-arrow-forward' onPress={()=>this.slideNext()} style={{fontSize:25,marginTop:25,marginLeft:5,marginRight:5}}/>
          </Col>
      </Row> */}

      {this.renderDatesOnFlatlist(doctorData.slotData, selectedDate)}
                                             

      {  
        doctorData.slotData[selectedDate] !== undefined ?
          this.haveAvailableSlots(doctorData.slotData[selectedDate]) 
          : this.noAvailableSlots()
      }

        <View style={{borderTopColor:'#000',borderTopWidth:0.5,marginTop:10}}>
           <Row style={{marginTop:10}}>
             <Text note style={{fontSize:12,fontFamily:'OpenSans'}}>Selected Appointment on</Text>
           </Row>
             <Row style={{marginTop:5}}>
               <Col style={{width:'40%'}}>
                 <Text style={{ marginTop: 2, marginBottom: 2, color:'#000',fontSize:12,fontFamily:'OpenSans'}}>{ selectedSlotItem ? formatDate(selectedSlotItem.slotStartDateAndTime, 'ddd DD MMM, h:mm a') : null }</Text>
               </Col>
              <Col style={{width:'35%'}}></Col>
              <Col style={{width:'25%'}}>
                {/* <TouchableOpacity onPress={() => { console.log('......Pressing....'); this.onPressContinueForPaymentReview(doctorData, selectedSlotItem) }}
                      style={{backgroundColor:'green', borderColor: '#000', marginTop:10, height: 30, borderRadius: 20,justifyContent:'center', marginLeft:5,marginRight:5,marginTop:-5 }}>
                      <Text style={{color:'#fff',fontSize:12,fontWeight:'bold',fontFamily:'OpenSans', justifyContent: 'center', alignItems : 'center', marginLeft:'35%', marginTop:-5, marginBottom : -5 }}>Book</Text>
                 </TouchableOpacity>  
                */}
              </Col>
           </Row>
        </View>
      </View>

       {this.renderHospitalLocation(this.selectedSlotLocationShowed, doctorData.doctorId)}
      
      {doctorData.awards ? 
        <View style={{marginLeft:5,marginRight:5,borderTopColor:'gray',borderTopWidth:0.7,marginBottom:5}}>
          <Row style={{marginTop:10}}>
            <Icon name='ios-medkit' style={{fontSize:20}}/>
            <Text style={{ fontFamily: 'OpenSans',fontSize:13,fontWeight:'bold',marginLeft:10,marginTop:1 }}>Awards</Text>
          </Row>
         <FlatList
           data={doctorData.awards || []}
           extraData={doctorData.awards}
           renderItem={({ item }) =>
            <Text style={{ fontFamily: 'OpenSans',fontSize:13,marginLeft:26}}>{item}</Text>
         } keyExtractor={(item, index) => index.toString()}/> 
        </View> : null }
 
      <View style={{marginLeft:5,marginRight:5,borderTopColor:'gray',borderTopWidth:1,}}>
        <Row style={{marginTop:10}}>
        <Icon name='ios-medkit' style={{fontSize:20}}/>
        <Text  style={{ fontFamily: 'OpenSans',fontSize:13,fontWeight:'bold',marginLeft:10,marginTop:1 }}>Language Spoken</Text>
      </Row>
        <Row style={{marginLeft:20}}>
   
     <FlatList
       data={doctorData.language}
       extraData={doctorData.language}
       horizontal={true}
       renderItem={ ({ item }) =>
         <View style={{marginLeft:10}}>
            <View style={{ borderColor: '#000', borderWidth:1, marginTop:10, height: 25, borderRadius: 10,justifyContent:'center'  }}>
             <Text style={{color:'#000', fontSize:12,fontWeight:'bold',fontFamily:'OpenSans', padding : 3 }}>{item}</Text>
           </View> 
        </View>  
     } keyExtractor={(item, index) => index.toString()} />
   </Row>
   </View> 

  </Content> : null }  

    {this.state.pressTab==2 ? <Reviews doctorId={doctorData.doctor_id}/> : null }
    
    {this.state.pressTab === 3 ?        
      <Content>
        <FlatList
          data={doctorData.specialist}
          extraData={doctorData.specialist}
          renderItem={ ({ item }) =>
           <Card style={{ backgroundColor: '#ffffff', borderRadius: 10}}>
            <List>
              <ListItem avatar>
                <Body>
                  <Text numberOfLines={1} style={{fontFamily:'OpenSans-Bold',fontSize:14}}> {item.category} </Text>
                  <Text style={{ fontSize: 12,  marginTop:5,fontFamily:'OpenSans',fontSize:12 }}>  {item.service} </Text>
                  
                </Body>
              </ListItem>
                      
            </List>
           </Card>} keyExtractor={(item, index) => index.toString()} />
      </Content> : null} 

        </Content> }

              <Footer style={{ backgroundColor: '#7E49C3', }}>
                  <Row>
                    <Col style={{ marginRight: 40 }} >
                      <Button success style={{ borderRadius: 10, marginTop: 10, marginLeft: 45, height: 40, justifyContent: 'center' }} 
                          onPress={()=> this.onPressContinueForPaymentReview(doctorData, selectedSlotItem)} 
                          testID='clickButtonToPaymentReviewPage'>
                        <Row style={{ justifyContent: 'center', }}>
                            <Text style={{ marginLeft: -25, marginTop: 2, fontWeight : 'bold', justifyContent: 'center', alignItems: 'center' }}>BOOK APPOINTMENT</Text>
                        </Row>               
                      </Button>
                    </Col>
                  </Row>
              </Footer>
        </Container>
    )

  }
  
  renderHospitalLocation = (hopitalLocationData, doctorId) => {
      console.log(doctorId);
      console.log(hopitalLocationData);
      if(!hopitalLocationData) {
        return null;
      } 
      let doctorIdHospitalId = doctorId + '-' + hopitalLocationData.hospital_id;
      console.log(doctorIdHospitalId);
      return hopitalLocationData ? <HospitalLocation number={doctorIdHospitalId} hopitalLocationData={hopitalLocationData} /> : null 
  }
  renderDatesOnFlatlist(slotData, selectedDate ) {
    const reducer = (accumulator, currentValue) => { 
      if(!currentValue.isSlotBooked)
         return 1 + accumulator;
      else 
         return accumulator    
     }
    return ( 
        <FlatList
        horizontal={true}
        data={this.processedAvailabilityDates}
        extraData={[this.state]}
        onEndReachedThreshold={1}
        onEndReached={({ distanceFromEnd }) => {
          
            let endIndex = this.processedAvailabilityDates.length;
            let lastProcessedDate = this.processedAvailabilityDates[endIndex - 1];
            let startMoment = getMoment(lastProcessedDate).add(1,'day');
            let endDateMoment = addMoment(lastProcessedDate, 7, 'days')
            if(this.state.isAvailabilityLoading === false)
              this.getAvailabilitySlots(this.state.doctorId, startMoment, endDateMoment);
        }}
     renderItem={({ item }) => 
      <Col style={{ width:100, justifyContent: 'center' }}>
        <TouchableOpacity  style={[styles.availabilityBG, selectedDate === item ? { backgroundColor:'#775DA3' } : { backgroundColor:'#ced6e0' } ]} 
          onPress={() => this.onDateChanged( item )}>
           <Text style={[{textAlign:'center',fontSize:12,fontFamily:'OpenSans'}, selectedDate === item ? { color:'#fff' } : { color:'#000' } ] }>{formatDate(moment(item), 'ddd, DD MMM')}</Text>
           <Text style={[{textAlign:'center',fontSize:10,fontFamily:'OpenSans'}, selectedDate === item ? { color:'#fff' } : { color:'#000' } ] }>{ slotData[item] ? slotData[item].reduce(reducer, 0) + ' Slots Available' : 'No Slots Available' }</Text>
        </TouchableOpacity>
      </Col>   
    } keyExtractor={(item, index) => index.toString()} />
    )
}

}

function bookApppointmentState(state) {
  return {
      bookappointment: state.bookappointment
  }
}
export default connect(bookApppointmentState)(BookAppoinment)


const styles = StyleSheet.create({

  container:
  {
    backgroundColor: '#ffffff',
  },

  bodyContent: {
    // paddingLeft: 20,
    // paddingRight: 20,

  },
  availabilityBG: {
    textAlign:'center',
    borderColor: '#000', 
    marginTop:10, 
    height: 50,
    borderRadius: 5, 
    justifyContent:'center', 
    marginRight:5, 
    paddingLeft:5, 
    paddingRight:5
},

  logo: {
    height: 80,
    width: 80,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10
  },

  customCard: {
    borderRadius: 20,
    padding: 15,
    marginTop: -180,
    marginLeft: 20,
    marginRight: 20,

  },
  topValue: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  bottomValue:
  {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  multipleStyles:
  {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: 'white'
  },
  slotDefaultBg: {
    backgroundColor: 'pink',
    borderRadius: 5,
    width: '30%',
    height: 30,
    margin: 5
  },
  slotBookedBg: {
    backgroundColor: 'gray',
    borderRadius: 5,
    width: '30%',
    height: 30,
    margin: 5
  },
  slotSelectedBg: {
    backgroundColor: '#2652AC',
    borderRadius: 5,
    width: '30%',
    height: 30,
    margin: 5
  },
  customPadge: {
    backgroundColor: 'green',
    alignItems: 'center',
    width: '30%'
  },
  customText:
  {
    fontFamily: 'OpenSans',
    color: '#000',
    fontSize: 14,
    marginTop:5
  },
  commentText:
  {
    fontFamily: 'OpenSans',
    color: '#000',
    fontSize: 12,
    marginTop:5
  },
  reviewText:
  {
    fontFamily: 'OpenSans',
    color: '#000',
    fontSize: 12,
    marginTop:5,
    marginLeft:-20
  },
  subtitlesText: {
    fontSize: 15,
    margin: 10,
    color: '#F2889B',
    fontFamily: 'opensans-semibold',

  },
  titlesText: {
    fontSize: 15,
    color: '#F2889B',
    fontFamily: 'opensans-semibold',

  },
  profileImage:
    {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 25,
        height: 80,
        width: 80,
        borderColor: '#f5f5f5',
        borderWidth: 2,
        borderRadius: 50
    },
  customIcon:
  {
    height: 30,
    width: 30,
    backgroundColor: 'gray',
    color: 'white',
    borderRadius: 8,
    fontSize: 19,
    paddingLeft: 8,
    paddingRight: 6,
    paddingTop: 6,
    paddingBottom: 6

  },
  rowText:
  {
    fontFamily: 'OpenSans',
    color: '#000',
    fontSize: 14,
    margin: 5
  },
  slotBookedBgColor: {
    textAlign:'center',
    backgroundColor:  '#A9A9A9', //'#775DA3',
    borderColor: '#000', 
    marginTop:10, height: 30, 
    borderRadius: 5, 
    justifyContent:'center', 
    marginRight:5,
    paddingLeft:5,
    paddingRight:5
},
slotSelectedBgColor: {
    textAlign:'center',
    backgroundColor: '#775DA3',
    borderColor: '#000', 
    marginTop:10, height: 30, 
    borderRadius: 5, 
    justifyContent:'center', 
    marginRight:5,
    paddingLeft:5,
    paddingRight:5
},
slotBookedTextColor: {
    textAlign:'center',
    color:'#fff',
    fontSize:12,
    fontFamily:'OpenSans'
},
slotDefaultBgColor: {
  textAlign:'center',
  backgroundColor:'#ced6e0', 
  borderColor: '#000', 
  marginTop:10, 
  height: 30, 
  borderRadius: 5, 
  justifyContent:'center' ,
  marginRight:5,
  paddingLeft:5,
  paddingRight:5
},
slotDefaultTextColor : {
  textAlign:'center',
  color:'#000',
  fontSize:12,
  fontFamily:'OpenSans'
},

});