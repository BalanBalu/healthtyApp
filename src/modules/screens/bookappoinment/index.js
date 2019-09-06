import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3,Segment, Button, Card, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ScrollView, Item, Toast,DatePicker } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, FlatList, AsyncStorage } from 'react-native';
import StarRating from 'react-native-star-rating';
import { formatDate, dateDiff, addMoment } from '../../../setup/helpers';
import {  fetchAvailabilitySlots,viewUserReviews, bindDoctorDetails } from '../../providers/bookappointment/bookappointment.action';
import Mapbox from './Mapbox';
import { Loader } from '../../../components/ContentLoader';
import moment from 'moment';
import { renderProfileImage } from '../../common';


let slotMap=new Map();

class BookAppoinment extends Component {
  processedAvailabilityDates = [];
  constructor(props) {
    super(props)

    this.state = {
      item: {
        name: '',
        no_and_street: '',
        city: '',
        state: '',
        pin_code: ''
      },
      qualification: '',
      data: {},
     
      reviewdata: null,
      doctordata: {
        prefix: null
      },
      selectedSlotIndex:0,
      selectedSlotItem: null,
      fromBookAgainSelectedSlotItem:'',
      doctorId: '',
      reviews_length: '',
      doctorId:'',
      currentDate:formatDate(new Date(),'YYYY-MM-DD'), 
      isLoading: true     
    }

  }

 

  async componentDidMount() {

    const { navigation } = this.props;
    const availabilitySlots = navigation.getParam('fetchAvailabiltySlots')||false;

    if(availabilitySlots) {
      let endDateMoment = addMoment(this.state.currentDate, 7, 'days')
      const doctorId = navigation.getParam('doctorId')|| false;
  
      await this.setState({doctorId:doctorId});
      console.log("doctorId");
      await this.getAvailabilitySlots(doctorId, moment(new Date()), endDateMoment);
    } else {
      let doctorDetails = navigation.getParam('doctorDetails');
      const slotList = navigation.getParam('slotList');
      console.log('slotList'+JSON.stringify(slotList));
      await this.setState({ doctorId: doctorDetails.doctorId });
      if(slotList) {
      if(slotList.length !== 0) {
        let firstAvailableIndex = 0; 
         for(let slotListIndex = 0; slotListIndex < slotList.length; slotListIndex++) {
            console.log(slotList[slotListIndex]);
            if(slotList[slotListIndex].isSlotBooked === false) {
              firstAvailableIndex = slotListIndex;
              break;
            }
         }
         console.log(firstAvailableIndex);
        await this.setState({item: { 
          name:slotList[firstAvailableIndex].location.name,
          no_and_street: slotList[firstAvailableIndex].location.location.address.no_and_street,
          city: slotList[firstAvailableIndex].location.location.address.city,
          state: slotList[firstAvailableIndex].location.location.address.state,
          pin_code: slotList[firstAvailableIndex].location.location.pin_code
        },
          selectedSlotItem: slotList[firstAvailableIndex], 
          doctorDetails, slotList, 
          selectedSlotIndex: firstAvailableIndex
        });
      }
    }
  }
  await this.getdoctorDetails(this.state.doctorId);
  await this.getUserReviews(this.state.doctorId);
  this.setState({ isLoading: false });
  }


  /*FromAppointment list(Get availability slots)*/
  async getAvailabilitySlots(fromAppointmentDoctorId, startDate, endDate) {
    console.log("getAvailabilty");    
        let totalSlotsInWeek = {
            startDate: formatDate(startDate, 'YYYY-MM-DD'),
            endDate: formatDate(endDate, 'YYYY-MM-DD')
        }
        let resultData = await fetchAvailabilitySlots(fromAppointmentDoctorId, totalSlotsInWeek);
        
        if (resultData.success) {
          let slotData = resultData.data[0].slotData
          this.setState({slotList: slotData[formatDate(startDate,'YYYY-MM-DD')]});
          console.log(this.state.slotList);
          this.enumarateDates(startDate, endDate)
          await this.displaylocation();          
          for(var key in slotData){           
            slotMap.set(key,slotData[key]);
         }
      }
}
/*Display the location details*/
displaylocation=async()=>{
  if(this.state.slotList) {
    console.log("slotList");
    await this.setState({item:{
       
      name:this.state.slotList[0].location.name,
      no_and_street:this.state.slotList[0].location.location.address.no_and_street,
      city:this.state.slotList[0].location.location.address.city,
      state:this.state.slotList[0].location.location.address.state,
      pin_code:this.state.slotList[0].location.location.pin_code
    },
    
    selectedSlotItem:this.state.slotList[0], 
    });
  }

}

enumarateDates(startDate, endDate) {
  debugger
  let now = startDate.clone();
  while (now.isSameOrBefore(endDate)) {
    this.processedAvailabilityDates.push(now.format('YYYY-MM-DD'));
    now = now.add(1, 'day');
  }
  console.log(this.processedAvailabilityDates);
}

/* Change the Date using Date Picker */
  onDateChanged(date) {
      console.log(date);      
      let selectedDate = formatDate(date, 'YYYY-MM-DD');
    if(this.processedAvailabilityDates.includes(selectedDate)) {
      console.log('selectedDate'+selectedDate);
      this.setState({ selectedDate: selectedDate });
      if(slotMap.has(selectedDate)) {
        console.log("slotMap");
        let temp = slotMap.get(selectedDate);
        this.setState({slotList:temp})
        console.log('slotList'+JSON.stringify(this.state.slotList));
        this.displaylocation();
        console.log("display location");

      } else {
        this.setState({slotList: []})
      }
    } else {
      debugger
      let endDateMoment = addMoment(date, 7, 'days')
      this.getAvailabilitySlots(this.state.doctorId, moment(date), endDateMoment);
    } 
  }

  relativeTimeView(review_date) {
    try {
        var postedDate = review_date;
        var currentDate = new Date();
        var relativeDate = dateDiff(postedDate, currentDate, 'days');
        // console.log('difference : ' + relativeDate);
        if (relativeDate > 30) {
            return formatDate(review_date, "DD-MM-YYYY")
        } else {
            return moment(review_date, "YYYYMMDD").fromNow();
        }
    }
    catch (e) {
        console.log(e)
    }
}

  /*Get doctor Qualification details*/
  getdoctorDetails = async (doctorId) => {
    console.log("doctor");
    let fields = "first_name,last_name,prefix,professional_statement,language,gender,specialist,education,profile_image";
    console.log(fields+'fields');
    let resultDoctorDetails = await bindDoctorDetails(doctorId, fields);
    console.log('resultDoctorDetails'+JSON.stringify(resultDoctorDetails))
    if (resultDoctorDetails.success) {
      this.setState({ doctordata: resultDoctorDetails.data});
      console.log(JSON.stringify(this.state.doctordata)+'doctordata');
      /*Doctor degree*/
      if (resultDoctorDetails.data.education) {

        let temp = this.state.doctordata.education.map((val) => {
          return val.degree;
        }).join();
        this.setState({ qualification: temp });
      }
    }
  }


  /* Get user Reviews*/
  getUserReviews = async (doctorId) => {
    console.log(" get reviews");
    let resultReview = await viewUserReviews('doctor', doctorId, '?limit=2');
    console.log('resultReview : ' + JSON.stringify (resultReview));
    if (resultReview.success) {
      this.setState({ reviewdata: resultReview.data });
      this.setState({ reviews_length: this.state.reviewdata.length });//  reviews length
    }

  }


  /*On pressing  slot*/
  onSlotPress(item, index) {

    this.setState({
      item: {
        name: item.location.name,
        no_and_street: item.location.location.address.no_and_street,
        city: item.location.location.address.city,
        state: item.location.location.address.state,
        pin_code: item.location.location.pin_code
      }, 
    })
    this.setState({ selectedSlotIndex: index,  selectedSlotItem: item });

  }
  navigateToPaymentReview() {
    debugger
    var confirmSlotDetails = {
      doctorId: this.state.doctordata.doctor_id,
      doctorName: this.state.doctordata.first_name + ' ' + this.state.doctordata.last_name,
      slotData: this.state.selectedSlotItem
    }
    this.props.navigation.navigate('Payment Review', { resultconfirmSlotDetails: confirmSlotDetails })
  }

  noAvailableSlots() {    
    return (
      <View style={{alignItems:'center'}}>
      <Text style={{ fontSize:15,borderColor:'gray',borderRadius:5,alignItems:'center'}} >No slots are available </Text>
      </View>
        )
  }

  haveAvailableSlots() {

    let { selectedSlotIndex } = this.state;
    return (


      <FlatList
        style={{ margin: 10 }}
        numColumns={3}
        data={this.state.slotList}
        extraData={this.state}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) =>
          <TouchableOpacity disabled={item.isSlotBooked === true ? true : false} style={item.isSlotBooked  === true ? styles.slotBookedBg : selectedSlotIndex === index ? styles.slotSelectedBg : styles.slotDefaultBg}
            onPress={() => this.onSlotPress(item, index)}>
            <Row style={{ width: '100%', alignItems: 'center' }}>
              <Col style={{ width: '70%', alignItems: 'center' }}>
                <Text style={styles.multipleStyles}>
                  {formatDate(item.slotStartDateAndTime, 'hh:mm')}</Text>
              </Col>
              <Col style={styles.customPadge}>
                <Text style={{ color: 'white', fontFamily: 'OpenSans', fontSize: 12 }}>
                  {formatDate(item.slotStartDateAndTime, 'A')}</Text>
              </Col>
            </Row>
          </TouchableOpacity>
        } />
    )
  }

  render() {
    const { navigation } = this.props;
    const { qualification, doctordata, isLoading } = this.state;
    const availabilitySlots = navigation.getParam('availabilitySlots')||false;

    const BookAppoinment =[{name:'Dr.John Williams',Degree:'MBBS, MD-DNB,Ophthalmology',Experience:'12 yrs',Rating:'4.3',Favourite:'75%',
    Fees:'250'}]

    return (
<Container style={styles.container}>
<Content style={styles.bodyContent} contentContainerStyle={{ flex: 0 ,padding:10}}>
      
      <Card style={{  borderBottomWidth: 2 }}>
     
          <Grid >
            <Row >
              <Col style={{width:'5%',marginLeft:20,marginTop:10}}>
                  <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 60, width: 60 }} />
               </Col>
               <Col style={{width:'78%'}}>
                  <Row style={{marginLeft:55,marginTop:10}}>
                     <Text style={{ fontFamily: 'OpenSans',fontSize:12,fontWeight:'bold'}}>Dr.John Williams</Text>
                  </Row>
                  <Row style={{marginLeft:55,}}>
                     <Text note  style={{ fontFamily: 'OpenSans',marginTop:2 ,fontSize:11}}>MBBS, MD-DNB,Ophthalmology</Text>
                  </Row>
                  {/* <Row style={{marginLeft:55,}}>
                 
                     <Text style={{ fontFamily: 'OpenSans',marginTop:5,fontSize:12,fontWeight:'bold' }}>
                       Seesha Hospital
                     </Text>
                  </Row> */}
               </Col>
                <Col style={{width:'17%'}}>
                   <Icon name="heart" 
                      style={ {  color: '#B22222', fontSize:20 ,marginTop:10}}>

                      </Icon>
                   {/* <Row>
                     <Text style={{ fontFamily: 'OpenSans',marginTop:20,fontSize:12,marginLeft:5 }}> 2.6km</Text>
                   </Row> */}
                 </Col> 
             </Row>
           
             <Row style={{marginBottom:10}}>
                 <Col style={{width:"25%",marginTop:15,}}>        
                   <Text note style={{ fontFamily: 'OpenSans',fontSize:12,textAlign:'center' }}> Experience</Text>
                   <Text style={{ fontFamily: 'OpenSans',fontSize:12,fontWeight:'bold',textAlign:'center' }}> 12 yrs</Text>
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
                                              maxStars={1}
                                          />
                                         
                          <Text style={{ fontFamily: 'OpenSans',fontSize:12,fontWeight:'bold',textAlign:'center' }}> 4.3</Text>
                          </View>
                          
                  </Col>
                          <Col style={{width:"25%",marginTop:15,}}>
                          
                          <Text note style={{ fontFamily: 'OpenSans',fontSize:12,textAlign:'center'}}> Favourite</Text>
                          <Text style={{ fontFamily: 'OpenSans',fontSize:12,fontWeight:'bold',textAlign:'center' }}> 75%</Text>


                          </Col>
                          <Col style={{width:"25%",marginTop:15,}}>
                              <Text note style={{ fontFamily: 'OpenSans',fontSize:12,textAlign:'center' }}> Fees</Text>
                              <Text  style={{ fontFamily: 'OpenSans',fontSize:12,fontWeight:'bold',textAlign:'center' }}>{'\u20B9'}250</Text>
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
<Segment >
          <Button first style={{width:'33.33%',borderBottomColor:'#775DA3',borderBottomWidth:4,alignItems:'center'}}>
            <Text style={{color:'#000',fontSize:12,fontFamily:'OpenSans',textAlign:'center',marginLeft:20}}>About</Text>
          </Button>
          <Button style={{width:'33.33%',borderBottomColor:'#000',borderBottomWidth:4,alignItems:'center'}}>
            <Text style={{color:'#000',fontSize:12,fontFamily:'OpenSans',textAlign:'center',marginLeft:20}}>Reviews</Text>
          </Button>
          <Button last active style={{width:'33.33%',borderBottomColor:'#000',borderBottomWidth:4,alignItems:'center'}}>
            <Text style={{color:'#000',fontSize:12,fontFamily:'OpenSans',marginLeft:20,textAlign:'center'}}>Awards</Text>
          </Button>
        </Segment>
           
</Row>
<View style={{marginLeft:5,marginRight:5}}>
<Text note style={{ fontFamily: 'OpenSans',fontSize:12, }}>Description</Text>
<Text style={{fontFamily:'OpenSans',fontSize:12}}>Dr. James expert is ab avid learner and expert in performing Laser treatment.He has various national and international publications on his name</Text>
</View>
<Row style={{marginLeft:5,marginRight:5,paddingBottom:5}}>
  <Right><Text style={{ fontFamily: 'OpenSans',fontSize:15,color:'#775DA3' }}>More</Text></Right>
</Row>
<View style={{marginLeft:5,marginRight:5,borderTopColor:'gray',borderTopWidth:0.7,paddingBottom:5}}>
  <Row style={{marginTop:10}}>
  <Icon name='ios-time' style={{fontSize:20}}/>
  <Text  style={{ fontFamily: 'OpenSans',fontSize:13,fontWeight:'bold',marginLeft:10,marginTop:1 }}>Available Tomorrow</Text>
  </Row>
  <Text  style={{ fontFamily: 'OpenSans',fontSize:13,marginLeft:26}}>9:00 am - 1:00 pm</Text>

</View>
<View style={{marginLeft:5,marginRight:5,borderTopColor:'gray',borderTopWidth:0.7,}}>
  <Row style={{marginTop:10}}>
  <Icon name='ios-home' style={{fontSize:20}}/>
  <Text  style={{ fontFamily: 'OpenSans',fontSize:13,fontWeight:'bold',marginLeft:10,marginTop:1 }}>Manipal Hospital </Text>
  </Row>
  <Text  style={{ fontFamily: 'OpenSans',fontSize:13,marginLeft:26}}>560, 3rd Floor,9th A Main,Domlur </Text>
  <Card transparent style={{ margin: 20, backgroundColor: '#ecf0f1' }}>

        {this.state.slotList!==undefined?
       <Card style={ { height: 250 }}>
        {this.state.selectedSlotItem !== null  ? <Mapbox hospitalLocation={this.state.selectedSlotItem}/>  : null }        
        <List>
          <ListItem avatar>
            <Left>
              <Icon name="locate" style={{ color: '#7E49C3', fontSize: 20 }}></Icon>
            </Left>
            <Body>

              <Text note style={{fontFamily:'OpenSans',fontSize:12}}>{this.state.item.name}</Text>
              <Text note style={{fontFamily:'OpenSans',fontSize:12}}>{this.state.item.no_and_street}</Text>
              <Text note style={{fontFamily:'OpenSans',fontSize:12}}>{this.state.item.city}</Text>
              <Text note style={{fontFamily:'OpenSans',fontSize:12}}>{this.state.item.state}</Text>
              <Text note style={{fontFamily:'OpenSans',fontSize:12}}>{this.state.item.pin_code}</Text>

            </Body>
            
          </ListItem>
        </List>
      </Card>:null}
      </Card>
</View>
<View style={{marginLeft:5,marginRight:5,borderTopColor:'gray',borderTopWidth:0.7,marginBottom:5}}>
  <Row style={{marginTop:10}}>
  <Icon name='ios-medkit' style={{fontSize:20}}/>
  <Text  style={{ fontFamily: 'OpenSans',fontSize:13,fontWeight:'bold',marginLeft:10,marginTop:1 }}>Services</Text>
  </Row>
  <Text  style={{ fontFamily: 'OpenSans',fontSize:13,marginLeft:26}}>vitreoretinal Surgery</Text>
  <Text  style={{ fontFamily: 'OpenSans',fontSize:13,marginLeft:26}}>Cataract Surgery</Text>

</View>
<View style={{marginLeft:5,marginRight:5,borderTopColor:'gray',borderTopWidth:1,}}>
  <Row style={{marginTop:10}}>
  <Icon name='ios-medkit' style={{fontSize:20}}/>
  <Text  style={{ fontFamily: 'OpenSans',fontSize:13,fontWeight:'bold',marginLeft:10,marginTop:1 }}>Language Spoken</Text>
  </Row>
  <Row style={{marginLeft:20}}>
  <TouchableOpacity 
    
       style={{ borderColor: '#000',borderWidth:1, marginTop:10, height: 25, borderRadius: 10,justifyContent:'center' ,padding:10 }}>
  <Text style={{color:'#000',fontSize:12,fontWeight:'bold',fontFamily:'OpenSans'}}>English</Text>
   </TouchableOpacity>   
   <TouchableOpacity 
    
       style={{ borderColor: '#000',borderWidth:1, marginTop:10, height: 25, borderRadius: 10,justifyContent:'center' ,padding:10,marginLeft:10 }}>
  <Text style={{color:'#000',fontSize:12,fontWeight:'bold',fontFamily:'OpenSans'}}>Hindi</Text>
   </TouchableOpacity> 
   <TouchableOpacity 
    
       style={{ borderColor: '#000',borderWidth:1, marginTop:10, height: 25, borderRadius: 10,justifyContent:'center'  ,padding:10,marginLeft:10}}>
  <Text style={{color:'#000',fontSize:12,fontWeight:'bold',fontFamily:'OpenSans'}}>Tamil</Text>
   </TouchableOpacity> 

  </Row>
  
<Row style={{justifyContent:'center',alignItems:'center',marginTop:20,}}>
<TouchableOpacity 
    
    style={{backgroundColor:'#775DA3', borderColor: '#000',  height: 30, borderRadius: 10,justifyContent:'center'  ,padding:10,marginLeft:10}}>
<Text style={{color:'#fff',fontSize:15,fontWeight:'bold',fontFamily:'OpenSans',textAlign:'center',padding:50}}>Book</Text>
</TouchableOpacity> 
</Row>
</View>

                      </Content>
                      </Container>
  









      // <Container style={styles.container}>
              //   {isLoading ?
      //                   <Loader style='appointment' />
      //                   : 
      //   <Content style={styles.bodyContent} contentContainerStyle={{ flex: 0 }}>        

      //     <Grid style={{ backgroundColor: '#7E49C3', height: 200 }}>

      //     </Grid>
      //     <Card style={styles.customCard}>
      //       <List>
      //         <ListItem thumbnail noBorder>

      //           <Left>
      //             {
      //               doctordata.profile_image != undefined ?
      //                 <Thumbnail style={styles.profileImage} source={{uri:doctordata.profile_image.imageURL}} /> :
      //                 <Thumbnail style={styles.profileImage} source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} />}
      //           </Left>
      //           <Body>
      //             <Text>{doctordata.prefix ? doctordata.prefix  : 'Dr. ' + doctordata.first_name}</Text>
      //             <Text>{qualification}</Text>
      //             <Text>{doctordata.gender?'Gender:   ' + doctordata.gender:''}</Text>

      //           </Body>

      //         </ListItem>

      //         <Grid>
      //           <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
      //             <Text style={styles.topValue}>{(this.state.slotList && this.state.slotList.length > 0) ?  '\u20B9' + this.state.slotList[0].fee + '/-' : '/-'}</Text>
                 
      //           </Col>

      //           <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
      //           <Text note style={styles.bottomValue}> Reviews </Text>

      //             <Text style={styles.topValue}>{(this.state.reviews_length != '') ? this.state.reviews_length : 'N/A'}</Text>
      //           </Col>

      //         </Grid>

      //         <Grid style={{ marginTop: 5 }}>
      //           <Row>
      //                             <Col style={{width:'80%'}}>

      //             <Button  block onPress={() => this.navigateToPaymentReview()} style={{ borderRadius: 10 }}>
      //               <Text uppercase={false}>Book Appoinment</Text>
      //             </Button>

      //           </Col>
      //           <Col style={{ marginLeft: 5, justifyContent: 'center',width:'20%' }} >
      //             <Icon name="heart" style={{ color: 'red', fontSize: 25, borderColor: 'gray', borderWidth: 1, padding: 10, borderRadius: 10, marginLeft: 'auto', marginRight: 'auto' }} />
      //           </Col>
      //           </Row>

      //         </Grid>

      //       </List>

      //     </Card>

      //     <Card>

      //     {availabilitySlots?
      //     <Item style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', marginTop: 10, borderRadius:5,width:'50%'}}>
      //     <Icon name='calendar' style={{ paddingLeft:15, color: '#775DA3' }} />
      //     <DatePicker
      //         locale={"en"}
      //         timeZoneOffsetInMinutes={undefined}
      //         animationType={"fade"}
      //         androidMode={"default"}
      //         placeHolderText={this.state.currentDate}
      //         textStyle={{ color: "#5A5A5A" }}
      //         placeHolderTextStyle={{ color: "#5A5A5A" }}
      //         onDateChange={date => { this.onDateChanged(date); }}
      //         disabled={false}
      //         testID='datePicked' />
      //     </Item>:null}

      //       <View style={{marginTop:10,marginBottom:15}}>
      //         {this.state.slotList === undefined ? this.noAvailableSlots() : this.haveAvailableSlots()}
      //       </View>
      //     </Card>
          
      //     <Card transparent style={{ margin: 20, backgroundColor: '#ecf0f1' }}>

      //        {this.state.slotList!==undefined?
      //        <Card style={ { height: 250 }}>
      //         {this.state.selectedSlotItem !== null  ? <Mapbox hospitalLocation={this.state.selectedSlotItem}/>  : null }        
      //         <List>
      //           <ListItem avatar>
      //             <Left>
      //               <Icon name="locate" style={{ color: '#7E49C3', fontSize: 25 }}></Icon>
      //             </Left>
      //             <Body>

      //               <Text note>{this.state.item.name}</Text>
      //               <Text note>{this.state.item.no_and_street}</Text>
      //               <Text note>{this.state.item.city}</Text>
      //               <Text note>{this.state.item.state}</Text>
      //               <Text note>{this.state.item.pin_code}</Text>

      //             </Body>
                  
      //           </ListItem>
      //         </List>
      //       </Card>:null}

          

      //       {/* <Card style={{ margin: 10, padding: 10, borderRadius: 10 }}>
      //       <Text  style={{fontWeight:'bold', fontSize:18}}>Reviews</Text> */}
      //        <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>
      //           <Grid style={{ margin: 5 }}>
      //             <Col style={{ width: '10%' }}>
      //               <Icon name="apps" style={styles.customIcon}></Icon>
      //             </Col>
      //             <Col style={{ width: '90%', alignItems: 'flex-start' }}>
      //               <Text style={styles.titlesText}>Reviews</Text></Col>
      //           </Grid>

      //         <List>
      //           {this.state.reviewdata !== null ?
      //             <FlatList
      //               data={this.state.reviewdata}
      //               extraData={this.state}
      //               keyExtractor={(item, index) => index.toString()}
      //               renderItem={({ item, index }) =>
      //                 <ListItem avatar>

           
      //                   <Left>
      //                     <Thumbnail style={{ marginLeft: -10, height: 50, width: 50 }} square source={renderProfileImage(item.userInfo)} />
      //                      </Left>
      //                   <Body>
      //                     {/* <Text>{((typeof item.userInfo.first_name || typeof item.userInfo.last_name) !== 'undefined') ? item.userInfo.first_name + ' ' + item.userInfo.last_name : 'Medflic User'}</Text> */}
      //                     <Text numberOfLines={1} >{((typeof item.userInfo.first_name || typeof item.userInfo.last_name) !== 'undefined') ? item.userInfo.first_name + ' ' + item.userInfo.last_name : 'Medflic User'}</Text>

      //                     <Text style={{ fontSize: 12, marginLeft: -5, marginTop:5 }}>  {this.relativeTimeView(item.review_date)} </Text>
      //                    <View style={{marginTop:5}}>
      //                     <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }} 
      //                       disabled={false}
      //                       maxStars={5}
      //                       rating={item.overall_rating} />
      //                       </View>
      //                     <Text note style={styles.customText}>{(typeof item.comments != 'undefined') ? item.comments : 'No Comments'}</Text>
      //                   </Body>
      //                 </ListItem>
      //               } />
      //             : <Text style={{ alignItems: 'center' }} >No Reviews Were found</Text>}
      //         </List>
      //         <Grid>
      //           <Col style={{ width: '50%' }}></Col>
      //           <Col style={{ width: '50%' }}>

      //             {this.state.reviewdata !== null ?
      //               <Button testID="reviewNavigateButton" iconRight transparent onPress={() => this.props.navigation.navigate('Reviews', { reviewDoctorId : this.state.doctorId})}>
      //                 <Icon name='add' />
      //                 <Text  style={styles.customText}>More Reviews</Text>
      //               </Button> : null}
      //           </Col>
      //         </Grid>

      //      </Card>


      //       {(typeof doctordata.professional_statement != 'undefined') ?

      //         <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>

      //           <Text style={styles.subtitlesText}>Professional Statement</Text>
      //           <List>
      //             <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: 10 }}>
      //               <Left >

      //               </Left>
      //               <Body>

      //                 <Text style={styles.customText}>
      //                   {doctordata.professional_statement}
      //                 </Text>
      //               </Body>
      //             </ListItem>
      //           </List>
      //         </Card> : null}


      //       {(typeof doctordata.specialist != 'undefined') ?

      //         <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>
      //           <Grid style={{ margin: 5 }}>
      //             <Col style={{ width: '10%' }}>
      //               <Icon name="apps" style={styles.customIcon}></Icon>
      //             </Col>
      //             <Col style={{ width: '90%', alignItems: 'flex-start' }}>
      //               <Text style={styles.titlesText}>Specialization</Text></Col>
      //           </Grid>


      //           <List>
      //             <FlatList
      //               data={this.state.doctordata.specialist}
      //               keyExtractor={(item, index) => index.toString()}
      //               renderItem={({ item }) =>
      //                 <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
      //                   <Left >
      //                   </Left>
      //                   <Body>
      //                     <Text style={styles.rowText}>
      //                       {item.category}
      //                     </Text>
      //                   </Body>
      //                 </ListItem>
      //               } /></List>

      //         </Card> : null}




      //       {(typeof doctordata.specialist != 'undefined') ?

      //         <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>
      //           <Grid>
      //             <Col style={{ width: '10%' }}>
      //               <Icon name="apps" style={styles.customIcon}></Icon>
      //             </Col>
      //             <Col style={{ width: '90%', alignItems: 'flex-start' }}>
      //               <Text style={styles.titlesText}>Service</Text></Col>
      //           </Grid>
      //           <List>
      //             <FlatList
      //               data={this.state.doctordata.specialist}
      //               keyExtractor={(item, index) => index.toString()}
      //               renderItem={({ item }) =>

      //                 <ListItem avatar noBorder style={{ borderRightWidth: 8, borderColor: "#8C4F2B", marginBottom: 10, marginRight: 15 }}>
      //                   <Left >
      //                   </Left>
      //                   <Body>
      //                     <Text style={styles.rowText}>{item.service}</Text>
      //                   </Body>
      //                 </ListItem>
      //               } /></List>
      //         </Card> : null}



      //       {(typeof doctordata.language != 'undefined') ?

      //         <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>

      //           <Grid style={{ margin: 5 }}>
      //             <Col style={{ width: '10%' }}>
      //               <Icon name="apps" style={styles.customIcon}></Icon>
      //             </Col>
      //             <Col style={{ width: '90%', alignItems: 'flex-start' }}>
      //               <Text style={styles.titlesText}>Languages speaks By Doctor</Text></Col>

      //           </Grid>


      //           <List>
      //             <FlatList
      //               data={this.state.doctordata.language}
      //               keyExtractor={(item, index) => index.toString()}
      //               renderItem={({ item }) =>

      //                 <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
      //                   <Left >
      //                   </Left>
      //                   <Body>
      //                     <Text style={styles.rowText}>{item}</Text>

      //                   </Body>

      //                 </ListItem>

      //               } /></List>

      //         </Card> : null}


            /* <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>


              <Grid>
                <Col style={{ width: '10%' }}>
                  <Icon name="apps" style={styles.customIcon}></Icon>
                </Col>
                <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                  <Text style={styles.titlesText}>Awards</Text></Col>

              </Grid>


              <List>
                <ListItem avatar noBorder style={{ borderRightWidth: 8, borderColor: "#8C4F2B", marginBottom: 10, marginRight: 15 }}>
                  <Left >
                  </Left>
                  <Body>
                    <Text style={styles.rowText}>
                     Awards1
 </Text>
                    <Text style={styles.rowText}>
                    Awards2
 </Text>

                  

                  </Body>

                </ListItem>

              </List>

            </Card>


            <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>


<Grid style={{ margin: 5 }}>
  <Col style={{ width: '10%' }}>
    <Icon name="apps" style={styles.customIcon}></Icon>
  </Col>
  <Col style={{ width: '90%', alignItems: 'flex-start' }}>
    <Text style={styles.titlesText}>Board Certifications</Text></Col>

</Grid>


<List>
  <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
    <Left >
    </Left>
    <Body>
      <Text style={styles.rowText}>
      certificate1
 
</Text>
      <Text style={styles.rowText}>
     certificate2
  </Text>  
    </Body>
  </ListItem>
</List>
</Card>
//  */
//             <Button block success onPress={() => this.navigateToPaymentReview()} style={{ borderRadius: 10 }}>
//               <Text uppercase={false}>Confirm Appoinment</Text>
//             </Button>


//           </Card>
       
//        </Content>
// }
//       </Container>

    )

  }

}

function bookAppointmentState(state) {

  return {
    user: state.bookAppointmentData
  }
}
export default connect(bookAppointmentState)(BookAppoinment)


const styles = StyleSheet.create({

  container:
  {
    backgroundColor: '#ffffff',
  },

  bodyContent: {
    // paddingLeft: 20,
    // paddingRight: 20,

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
  }

});