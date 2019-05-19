import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Card, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ScrollView, Item, DatePicker } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, FlatList } from 'react-native';
import StarRating from 'react-native-star-rating';
import { viewdoctorProfile } from '../../providers/bookappointment/bookappointment.action';
import { formatDate, getFirstDay, getLastDay } from '../../../setup/helpers';


class BookAppoinment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      item: {
        name:'',
        no_and_street: '',
        city: '',
        state: '',
        pin_code: ''
      },
      slotList: [],
      availableSlotData: [],
      getStartDateOfTheWeek: formatDate(new Date(), 'YYYY-MM-DD'),
      getEndDateOfTheWeek: formatDate(new Date(), 'YYYY-MM-DD'),
      doctorId: '5ce01ae8d28ab8073515a6f6',
      starCount: 3.5,
      qualification: '',
      specialism:'',
      data: {},
      pickDate: formatDate(new Date(), 'YYYY-MM-DD'),
      isLoading: false,
      toggleButton: true,
      toggleButtonColour: 'gray',
      selectedSlotIndex: -1
    }
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  componentDidMount() {
    currentDate = formatDate(new Date(), 'YYYY-MM-DD');
    let startDate = getFirstDay(new Date(), 'week');
    console.log(startDate + 'startDate');
    let endDate = getLastDay(new Date(), 'week');
    console.log(endDate + 'endDate');
    this.getAvailability(currentDate, startDate, endDate);
  }

  /*get availability slots for the week*/
  getAvailability = async (currentDate, startDate, endDate) => {
    let slotOfWeek = {
      startDate: formatDate(startDate, 'YYYY-MM-DD'),
      endDate: formatDate(endDate, 'YYYY-MM-DD')
    }
    let result = await viewdoctorProfile(this.state.doctorId, slotOfWeek);
    console.log(result);

    if (result.success) {
      console.log("success");
      this.setState({ data: result.data[0] });
      this.setState({ slotList: result.data[0].slotData[formatDate(currentDate, 'YYYY-MM-DD')] });
      console.log(JSON.stringify(this.state.slotList) + '>>>>>' + 'hai');
      /*Doctor degree*/
      if (result.data[0].education) {
        let temp = this.state.data.education.map((val) => {
          return val.degree;
        }).join(',');
        this.setState({ qualification: temp });
      }
      /*Doctor category*/
      if(result.data[0].specialist){
      let specialistArray=this.state.data.specialist.map((value)=>{
        return value.category;
      }).join();
     this.setState({specialism:specialistArray})
    }
  }
  }


  onSlotPress(item, index) {

    console.log("coming to slotpress");
    this.setState({
      item: {
        name:item.location.name,
        no_and_street: item.location.location.address.no_and_street,
        city: item.location.location.address.city,
        state: item.location.location.address.state,
        pin_code: item.location.location.pin_code
      }
    })
    this.setState({selectedSlotIndex : index});
    this.state.slotList[index].bg = 'transparent';
    this.setState({ toggleButton: false });
    this.setState({ toggleButtonColour: 'red' });
    console.log(this.state.slotList);
  }


  noAvailableSlots() {
    return (
      <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, justifyContent: 'center', alignItems: 'center' }} >No slots available </Text>
      </Item>
    )
  }

  haveAvailableSlots() {
    let { selectedSlotIndex } = this.state;
    return (
      <FlatList
        style={{margin : 10}}
        numColumns={3}
        data={this.state.slotList}
        extraData={this.state}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) =>
            
            
              <TouchableOpacity style={ selectedSlotIndex === index ? styles.slotSelectedBg : styles.slotDefaultBg}
                onPress={() => this.onSlotPress(item, index)}>
                <Row style={{ width: '100%', alignItems: 'center' }}>
                <Col style={{ width: '70%', alignItems: 'center' }}>
                <Text uppercase={false} style={ selectedSlotIndex === index ? styles.multipleStyles : styles.slotDefault}>
                  {formatDate(item.slotStartDateAndTime, 'hh:mm')}</Text>
                </Col>
                <Col style={styles.customPadge}>
                  <Text style={{color: 'white', fontFamily: 'OpenSans', fontSize: 12}}>
                  {formatDate(item.slotStartDateAndTime, 'A')}</Text>
                </Col>
                </Row>
              </TouchableOpacity>
            
        } />
    )
  }
  async onDateChanged(date) {
    let currentDate = formatDate(date, 'YYYY-MM-DD');
    let startDate = getFirstDay(new Date(date), 'week');
    let endDate = getLastDay(new Date(date), 'week');
    this.setState({ currentDate: currentDate, getStartDateOfTheWeek: startDate, getEndDateOfTheWeek: endDate, });  // Set the selected date in Calender
    if (!this.state.slotList[formatDate(date, 'YYYY-MM-DD')]) {
      this.getAvailability(currentDate, startDate, endDate);
    }
    else {
      console.log("test");
      if (this.state.slotList[formatDate(date, 'YYYY-MM-DD')]) {
        this.setState({ data: this.state.slotList[formatDate(date, 'YYYY-MM-DD')] });
        console.log(JSON.stringify(this.state.slotList) + 'hai');
      }
    }
  }

  render() {
    const { data, qualification,specialism } = this.state;
    return (

      <Container style={styles.container}>
        <Content style={styles.bodyContent}>

          <Grid style={{ backgroundColor: '#7E49C3', height: 200 }}>

          </Grid>

          <Card style={styles.customCard}>
            <List>
              <ListItem thumbnail noBorder>

                <Left>
                  <Thumbnail square source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 86, width: 86 }} />

                </Left>
                <Body>
                  <Text>{data.doctorName ? data.doctorName : ''}</Text>

                  <Text>{qualification}</Text>
                  <Text note>{specialism}</Text>
                </Body>

              </ListItem>

              <Grid>
                <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text style={styles.topValue}> Rs 45.. </Text>
                  <Text note style={styles.bottomValue}> Hourly Rate </Text>
                </Col>

                <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text style={styles.topValue}>24 </Text>
                  <Text note style={styles.bottomValue}> Reviews </Text>
                </Col>

                <Col style={{ backgroundColor: 'transparent', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text style={styles.topValue}>824 </Text>
                  <Text note style={styles.bottomValue}> patients </Text>
                </Col>
              </Grid>

              <Grid style={{ marginTop: 5 }}>
                <Col style={{ width: 270, }}>

                  <Button disabled={this.state.toggleButton} block style={{ borderRadius: 10}}>
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
            <View >
              <Item style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', marginTop: 10, borderRadius: 5, height: 45, marginLeft: 18 }}>
                <Icon name='calendar' style={{ paddingLeft: 20, color: '#775DA3' }} />

                <DatePicker style={styles.transparentLabel}

                  // defaultDate={this.state.pickDate}
                  locale={"en"}
                  timeZoneOffsetInMinutes={undefined}
                  animationType={"fade"}
                  androidMode={"default"}
                  placeHolderText={'Pick the date'}
                  textStyle={{ color: "#5A5A5A" }}
                  placeHolderTextStyle={{ color: "#5A5A5A" }}
                  onDateChange={date => { this.onDateChanged(date); }}
                  disabled={false}
                  testID='datePicked' />
              </Item>
              {this.state.data == null ? this.noAvailableSlots() : this.haveAvailableSlots()}



            </View>
          </Card>


          <Grid>
            <Row>
              <Thumbnail square source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.logo} />
            </Row>

            <Row>

              <Grid style={{ borderBottomColor: 'gray', borderBottomWidth: 0.5, padding: 10 }}>
                <Col style={{ width: 180 }}>
                  <Row>
                    <Col>
                      <Text > Distance </Text>
                      <Text note > 10 km</Text>
                    </Col>
                    <Col>
                      <Text > Time </Text>
                      <Text note> 13.00 am</Text>
                    </Col>
                  </Row>
                </Col>

                <Col>

                </Col>

                <Col >
                  <Col style={{ marginLeft: 5, justifyContent: 'center' }} >

                    <Icon name="paper-plane" style={{ color: 'blue', fontSize: 20, marginLeft: 'auto', marginRight: 5, borderColor: 'gray', borderWidth: 1, padding: 10, borderRadius: 50, }} />


                  </Col>
                </Col>
              </Grid>
            </Row>

          </Grid>

          <Card transparent style={{ margin: 20 ,backgroundColor:'#ecf0f1'}}>
          <Card>
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

          </Card>
           

          
          <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>

              <Text style={styles.subtitlesText}>Professional Statement</Text>
              <List>
                <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: 10 }}>
                  <Left >

                  </Left>
                  <Body>

                    <Text style={styles.customText}>
                      The medical doctor CV example below is designed to show you how to properly format and organize your CV, as well as what information to include, such as your hobbies and interests, work history, and a professional summary. Once you’ve familiarized yourself with the structure, you can draft your own tailored CV.
                  </Text>

                  </Body>

                </ListItem>

              </List>


            </Card>



            <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>


              <Grid>
                <Col style={{ width: '10%' }}>
                  <Icon name="apps" style={styles.customIcon}></Icon>
                </Col>
                <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                  <Text style={styles.titlesText}>Service</Text></Col>

              </Grid>


              <List>
                <ListItem avatar noBorder style={{ borderRightWidth: 8, borderColor: "#8C4F2B", marginBottom: 10, marginRight: 15 }}>
                  <Left >
                  </Left>
                  <Body>
                    <Text style={styles.rowText}>
                      psychiotherephy

 </Text>
                    <Text style={styles.rowText}>
                      psychiotherephy

 </Text>

                    <Text style={styles.rowText}>
                      psychiotherephy

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
                  <Text style={styles.titlesText}>Specialization</Text></Col>

              </Grid>


              <List>
                <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
                  <Left >
                  </Left>
                  <Body>
                    <Text style={styles.rowText}>
                      psychiotherephy

 </Text>
                    <Text style={styles.rowText}>
                      psychiotherephy

 </Text>

                    <Text style={styles.rowText}>
                      psychiotherephy

 </Text>

                  </Body>

                </ListItem>

              </List>

            </Card>




            <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>


              <Grid>
                <Col style={{ width: '10%' }}>
                  <Icon name="apps" style={styles.customIcon}></Icon>
                </Col>
                <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                  <Text style={styles.titlesText}>Hospital Network</Text></Col>

              </Grid>


              <List>
                <ListItem avatar noBorder style={{ borderRightWidth: 8, borderColor: "#8C4F2B", marginBottom: 10, marginRight: 15 }}>
                  <Left >
                  </Left>
                  <Body>

                    <Grid>
                      <Col style={{ width: '40%' }}>
                        <Text style={styles.rowText}>
                          ADS Hospitals

 </Text>
                      </Col>
                      <Col style={{ width: '30%' }}>
                      </Col>
                      <Col style={{ width: '30%' }}>

                        <Text style={styles.rowText}>
                          Mon-Sat

 </Text>
                      </Col>
                    </Grid>

                    <Grid >
                      <Col style={{ width: '90%', alignItems: 'center', borderColor: 'gray', borderWidth: 1, padding: 5, borderRadius: 5 }}>
                        <Text style={styles.rowText}>
                          81/3 middle street</Text>

                        <Text style={styles.rowText}>
                          nehru street</Text>


                        <Text style={styles.rowText}>
                          Annanagar-40</Text>
                      </Col>
                      <Col style={{ width: '10%' }}></Col>
                    </Grid>

                    <Grid>
                      <Col style={{ width: '40%' }}>
                        <Text style={styles.rowText}>
                          ADS Hospitals

 </Text>
                      </Col>
                      <Col style={{ width: '30%' }}>
                      </Col>
                      <Col style={{ width: '30%' }}>

                        <Text style={styles.rowText}>
                          Mon-Sat

 </Text>
                      </Col>
                    </Grid>

                    <Grid>
                      <Col style={{ width: '90%', alignItems: 'center', borderColor: 'gray', borderWidth: 1, padding: 5, borderRadius: 5 }}>
                        <Text style={styles.rowText}>
                          81/3 middle street</Text>

                        <Text style={styles.rowText}>
                          nehru street</Text>


                        <Text style={styles.rowText}>
                          Annanagar-40</Text>
                      </Col>
                      <Col style={{ width: '10%' }}></Col>
                    </Grid>

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
                  <Text style={styles.titlesText}>Languages speaks By Doctor</Text></Col>

              </Grid>


              <List>
                <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
                  <Left >
                  </Left>
                  <Body>
                    <Text style={styles.rowText}>
                      Tamil
               
</Text>
                    <Text style={styles.rowText}>
                      English
                
</Text>

                    <Text style={styles.rowText}>
                      French
                
</Text>

                  </Body>

                </ListItem>

              </List>

            </Card>


            <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>


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

<Card style={{ margin: 10, padding: 10, borderRadius: 10 }}>

<List>
  <Text style={styles.titleText}>Reviews</Text>

  <ListItem avatar>
    <Left>
      <Thumbnail square source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 40, width: 40 }} />
    </Left>
    <Body>
      <Text>Kumar Pratik</Text>

      <Text note>3hrs.</Text>
      <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
        disabled={false}
        maxStars={5}
        rating={this.state.starCount}
        selectedStar={(rating) => this.onStarRatingPress(rating)}

      />
      <Text note style={styles.customText}>this is a good clinic to check basic problems like fever,cold..etc..</Text>
    </Body>

  </ListItem>

  <ListItem avatar>
    <Left>
      <Thumbnail square source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 40, width: 40 }} />
    </Left>
    <Body>
      <Text>Kumar Pratik</Text>

      <Text note>3hrs.</Text>
      <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
        disabled={false}
        maxStars={5}
        rating={this.state.starCount}
        selectedStar={(rating) => this.onStarRatingPress(rating)}

      />
      <Text note style={styles.customText}>this is a good clinic to check basic problems like fever,cold..etc..</Text>
    </Body>

  </ListItem>
  <Button iconRight transparent block onPress={()=> this.props.navigation.navigate('Reviews')}>
    <Icon name='add' />
    <Text style={styles.customText}>More Reviews</Text>
  </Button>
</List>
</Card>



<Button block success style={{ borderRadius: 10 }}>
                    <Text uppercase={false}>Confirm Appoinment</Text>

                  </Button>


          </Card>
        </Content>
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
  slotDefault : {
    fontFamily: 'OpenSans', 
    fontSize: 12, 
    color: 'white'
  },
  slotDefaultBg: {
    backgroundColor: '#775DA3', 
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
    backgroundColor:'green',
    alignItems:'center',
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