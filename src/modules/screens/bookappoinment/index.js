import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Card, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ScrollView, Item, Toast,DatePicker } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, FlatList, AsyncStorage } from 'react-native';
import StarRating from 'react-native-star-rating';
import { formatDate,addMoment } from '../../../setup/helpers';
import {  fetchAvailabilitySlots,viewUserReviews, bindDoctorDetails } from '../../providers/bookappointment/bookappointment.action';
import Mapbox from './Mapbox';
import { Loader } from '../../../components/ContentLoader';
import moment from 'moment';

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
      console.log("if")
      let endDateMoment = addMoment(this.state.currentDate, 7, 'days')
      const doctorId = navigation.getParam('doctorId')|| false;
      await this.setState({doctorId:doctorId});
      console.log("doctorId");
      await this.getAvailabilitySlots(doctorId, moment(new Date()), endDateMoment);
    }else {
      let doctorDetails = navigation.getParam('doctorDetails');
      const slotList = navigation.getParam('slotList');
      console.log('slotList'+JSON.stringify(slotList));
      await this.setState({ doctorId: doctorDetails.doctorId });
      if(slotList) {
      if(slotList.length !== 0) { 
        await this.setState({item:{ 
          name:slotList[0].location.name,
          no_and_street: slotList[0].location.location.address.no_and_street,
          city: slotList[0].location.location.address.city,
          state: slotList[0].location.location.address.state,
          pin_code: slotList[0].location.location.pin_code
        },
          selectedSlotItem:slotList[0], 
          doctorDetails, slotList, 
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

  /*Get doctor Qualification details*/
  getdoctorDetails = async (doctorId) => {
    console.log("doctor");
    let fields = "first_name,last_name,prefix,professional_statement,language,specialist,education,profile_image";
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
    let resultReview = await viewUserReviews('doctor',doctorId);
    console.log(resultReview.data);
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
          <TouchableOpacity disabled={item.isSlotBooked === true ? true : false} style={selectedSlotIndex === index ? styles.slotSelectedBg : item.isSlotBooked === false ? styles.slotDefaultBg : styles.slotBookedBg}
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

    return (
      <Container style={styles.container}>
        {isLoading ?
                        <Loader style='appointment' />
                        : 
        <Content style={styles.bodyContent} contentContainerStyle={{ flex: 0 }}>        

          <Grid style={{ backgroundColor: '#7E49C3', height: 200 }}>

          </Grid>
          <Card style={styles.customCard}>
            <List>
              <ListItem thumbnail noBorder>

                <Left>
                  {
                    doctordata.profile_image != undefined ?
                      <Thumbnail style={styles.profileImage} source={{uri:doctordata.profile_image.imageURL}} /> :
                      <Thumbnail style={styles.profileImage} source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} />}
                </Left>
                <Body>
                  <Text>{doctordata.prefix ? doctordata.prefix : 'Dr. ' + doctordata.first_name}</Text>
                  <Text>{qualification}</Text>
                </Body>

              </ListItem>

              <Grid>
                <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text style={styles.topValue}>{(this.state.slotList && this.state.slotList.length > 0) ? 'Rs.' + this.state.slotList[0].fee + '/-' : '/-'}</Text>
                  <Text note style={styles.bottomValue}>Rate</Text>
                </Col>

                <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text style={styles.topValue}>{(this.state.reviews_length != '') ? this.state.reviews_length : 'No Reviews'}</Text>
                  <Text note style={styles.bottomValue}> Reviews </Text>
                </Col>

              </Grid>

              <Grid style={{ marginTop: 5 }}>
                <Col style={{ width: 270, }}>

                  <Button  block onPress={() => this.navigateToPaymentReview()} style={{ borderRadius: 10 }}>
                    <Text uppercase={false}>Book Appoinment</Text>
                  </Button>

                </Col>
                <Col style={{ marginLeft: 5, justifyContent: 'center' }} >

                  <Icon name="heart" style={{ color: 'red', fontSize: 25, borderColor: 'gray', borderWidth: 1, padding: 10, borderRadius: 10, marginLeft: 'auto', marginRight: 'auto' }} />


                </Col>
              </Grid>

            </List>

          </Card>

          <Card>

          {availabilitySlots?
          <Item style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', marginTop: 10, borderRadius:5,width:'50%'}}>
          <Icon name='calendar' style={{ paddingLeft:15, color: '#775DA3' }} />
          <DatePicker
              locale={"en"}
              timeZoneOffsetInMinutes={undefined}
              animationType={"fade"}
              androidMode={"default"}
              placeHolderText={this.state.currentDate}
              textStyle={{ color: "#5A5A5A" }}
              placeHolderTextStyle={{ color: "#5A5A5A" }}
              onDateChange={date => { this.onDateChanged(date); }}
              disabled={false}
              testID='datePicked' />
          </Item>:null}

            <View style={{marginTop:10,marginBottom:15}}>
              {this.state.slotList === undefined ? this.noAvailableSlots() : this.haveAvailableSlots()}
            </View>
          </Card>
          
          <Card transparent style={{ margin: 20, backgroundColor: '#ecf0f1' }}>

             {this.state.slotList!==undefined?
             <Card style={ { height: 250 }}>
              {this.state.selectedSlotItem !== null  ? <Mapbox hospitalLocation={this.state.selectedSlotItem}/>  : null }        
              <List>
                <ListItem avatar>
                  <Left>
                    <Icon name="locate" style={{ color: '#7E49C3', fontSize: 25 }}></Icon>
                  </Left>
                  <Body>

                    <Text note>{this.state.item.name}</Text>
                    <Text note>{this.state.item.no_and_street}</Text>
                    <Text note>{this.state.item.city}</Text>
                    <Text note>{this.state.item.state}</Text>
                    <Text note>{this.state.item.pin_code}</Text>

                  </Body>
                  
                </ListItem>
              </List>
            </Card>:null}

          

            <Card style={{ margin: 10, padding: 10, borderRadius: 10 }}>
              <Text style={styles.titleText}>Reviews</Text>

              <List>
                {this.state.reviewdata !== null ?
                  <FlatList
                    data={this.state.reviewdata}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) =>
                      <ListItem avatar>

                        <Left>
                          {item.userInfo.profile_image!=undefined?
                          <Thumbnail square source={item.userInfo.profile_image.imageURL} style={{ height: 86, width: 86 }} /> :
                          <Thumbnail square source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 40, width: 40 }} />
                          }
                        </Left>
                        <Body>
                          <Text>{((typeof item.userInfo.first_name || typeof item.userInfo.last_name) !== 'undefined') ? item.userInfo.first_name + '' + item.userInfo.last_name : 'Medflic User'}</Text>
                          <Text note>3hrs.</Text>
                          <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                            disabled={false}
                            maxStars={5}
                            rating={item.overall_rating} />
                          <Text note style={styles.customText}>{(typeof item.comments != 'undefined') ? item.comments : 'No Comments'}</Text>
                        </Body>
                      </ListItem>
                    } />
                  : <Text style={{ alignItems: 'center' }} >No Reviews Were found</Text>}
              </List>
              <Grid>
                <Col style={{ width: '50%' }}></Col>
                <Col style={{ width: '50%' }}>

                  {this.state.reviewdata !== null ?
                    <Button iconRight transparent onPress={() => this.props.navigation.navigate('Reviews', { doctorId : this.state.doctorId})}>
                      <Icon name='add' />
                      <Text style={styles.customText}>More Reviews</Text>
                    </Button> : null}
                </Col>
              </Grid>

            </Card>


            {(typeof doctordata.professional_statement != 'undefined') ?

              <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>

                <Text style={styles.subtitlesText}>Professional Statement</Text>
                <List>
                  <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: 10 }}>
                    <Left >

                    </Left>
                    <Body>

                      <Text style={styles.customText}>
                        {doctordata.professional_statement}
                      </Text>
                    </Body>
                  </ListItem>
                </List>
              </Card> : null}


            {(typeof doctordata.specialist != 'undefined') ?

              <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>
                <Grid style={{ margin: 5 }}>
                  <Col style={{ width: '10%' }}>
                    <Icon name="apps" style={styles.customIcon}></Icon>
                  </Col>
                  <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                    <Text style={styles.titlesText}>Specialization</Text></Col>
                </Grid>


                <List>
                  <FlatList
                    data={this.state.doctordata.specialist}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) =>
                      <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
                        <Left >
                        </Left>
                        <Body>
                          <Text style={styles.rowText}>
                            {item.category}
                          </Text>
                        </Body>
                      </ListItem>
                    } /></List>

              </Card> : null}




            {(typeof doctordata.specialist != 'undefined') ?

              <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>
                <Grid>
                  <Col style={{ width: '10%' }}>
                    <Icon name="apps" style={styles.customIcon}></Icon>
                  </Col>
                  <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                    <Text style={styles.titlesText}>Service</Text></Col>
                </Grid>
                <List>
                  <FlatList
                    data={this.state.doctordata.specialist}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) =>

                      <ListItem avatar noBorder style={{ borderRightWidth: 8, borderColor: "#8C4F2B", marginBottom: 10, marginRight: 15 }}>
                        <Left >
                        </Left>
                        <Body>
                          <Text style={styles.rowText}>{item.service}</Text>
                        </Body>
                      </ListItem>
                    } /></List>
              </Card> : null}



            {(typeof doctordata.language != 'undefined') ?

              <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>

                <Grid style={{ margin: 5 }}>
                  <Col style={{ width: '10%' }}>
                    <Icon name="apps" style={styles.customIcon}></Icon>
                  </Col>
                  <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                    <Text style={styles.titlesText}>Languages speaks By Doctor</Text></Col>

                </Grid>


                <List>
                  <FlatList
                    data={this.state.doctordata.language}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) =>

                      <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
                        <Left >
                        </Left>
                        <Body>
                          <Text style={styles.rowText}>{item}</Text>

                        </Body>

                      </ListItem>

                    } /></List>

              </Card> : null}


            {/* <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>


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
 */}
            <Button block success onPress={() => this.navigateToPaymentReview()} style={{ borderRadius: 10 }}>
              <Text uppercase={false}>Confirm Appoinment</Text>
            </Button>


          </Card>
       
       </Content>
}
      </Container>

    )

  }

}

function loginState(state) {

  return {
    user: state.user
  }
}
export default connect(loginState)(BookAppoinment)


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