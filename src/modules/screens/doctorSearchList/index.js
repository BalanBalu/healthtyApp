import React, { Component } from 'react';
import { Container, Content, Text, Title,Toast, Header, H3, Button, Card, Item, CardItem, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ProgressBar, DatePicker } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, FlatList, AsyncStorage, TouchEvent, Dimensions } from 'react-native';
import StarRating from 'react-native-star-rating';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import Modal from "react-native-modal";
import { insertDoctorsWishList, searchDoctorList, viewdoctorProfile, getMultipleDoctorDetails, getDoctorsReviewsCount, viewUserReviews,viewUserReviewCount } from '../../providers/bookappointment/bookappointment.action';
import { formatDate, getFirstDay, getLastDay, findArrayObj } from '../../../setup/helpers';
import { Loader } from '../../../components/ContentLoader';
import { RenderHospitalAddress } from '../../common';

class doctorSearchList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isModalVisible: false,
            starCount: 0,
            doctorDetails: [],
            selectedDate: formatDate(new Date(), 'YYYY-MM-DD'),
            singleHospitalDataSlots: {
                _id: null,
                hospitalLocationData: {},
                hospitalSlotArray: []
            },
            singleDataWithDoctorDetails: {},
            selectedSlotIndex: -1,
            selectedDoctorHospitalLocations: [],
            confirmSlotDetails: {},
            doctorData: [],
            searchedResultData: [],
            reviewData: null,
            confirm_button: true,
            getSearchedDoctorIds: null,
            nextAvailableSlotDate:'',
            isLoading: false,
            wishListColor:false,
        }
    }

    confirmAppointmentPress = (confirmedSlot) => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
        this.props.navigation.navigate('Payment Review', { resultconfirmSlotDetails: this.state.confirmSlotDetails })
    };
    navigateToFilters() {
        this.props.navigation.navigate('Filters', { doctorData: this.state.doctorData })
    }
    componentDidMount() {
        this.getPatientSearchData();
    }
  

    /* Insert Doctors Favourite Lists  */
    addToWishList = async (doctorId,index) => {
        try {
          let requestData = {
          active:true
          };
          let userId = await AsyncStorage.getItem('userId');
          let result = await insertDoctorsWishList(userId, doctorId, requestData);
        //   console.log('result'+JSON.stringify(result));
    
          if (result.success) {
            Toast.show({
                text: result.message,
                type: "success",
                duration: 3000,
            })
             this.setState({ wishListColor: true });    
          }
        }
        catch (e) {
          console.log(e);
        }
      }
     


    /* get the Doctor Id's list from Search Module  */
    getPatientSearchData = async () => {
        this.setState({ isLoading: true });
        const { navigation } = this.props;
        const searchedInputValues = navigation.getParam('resultData');
        // console.log('searchedInputValues'+JSON.stringify(searchedInputValues));
        let startDate = getFirstDay(new Date(), 'week');
        let endDate = getLastDay(new Date(), 'week');

        const userId = await AsyncStorage.getItem('userId');
        let resultData = await searchDoctorList(userId, searchedInputValues);
        await this.setState({ searchedResultData: resultData.data });
      
        if (resultData.success) {
            let doctorIds = resultData.data.map((element) => {
                return element.doctor_id
            }).join(',');
            this.setState({ getSearchedDoctorIds: doctorIds });
            this.getAvailabilitySlots(this.state.getSearchedDoctorIds, startDate, endDate);
            this.getDoctorAllDetails(this.state.getSearchedDoctorIds);// for getting multiple Doctor details,Reviews ,ReviewCount,etc....
        }
    }

    async getDoctorAllDetails(DoctorIds) {
        await new Promise.all([
            this.getDoctorDetails(DoctorIds),
            this.getPatientReviews(DoctorIds),
        ])
        this.setState({ isLoading: false });
      }

    /* get the  Doctors Availability Slots */
    getAvailabilitySlots = async (getSearchedDoctorIds, startDate, endDate) => {
        this.setState({ isLoading: true });
        try {
            let totalSlotsInWeek = {
                startDate: formatDate(startDate, 'YYYY-MM-DD'),
                endDate: formatDate(endDate, 'YYYY-MM-DD')
            }
            let resultData = await viewdoctorProfile(getSearchedDoctorIds, totalSlotsInWeek);
            this.setState({ isLoading: false });
            if (resultData.success) {
                this.setState({ doctorDetails: resultData.data });
                console.log(resultData.data);
            }
        } catch (e) {
            console.log(e);
        }
    }


    /* Change the Date from Date Picker */
    onDateChanged(date) {
        this.setState({ isLoading: true });
        let selectedDate = formatDate(date, 'YYYY-MM-DD');
        let startDate = getFirstDay(new Date(date), 'week');
        let endDate = getLastDay(new Date(date), 'week');
        this.setState({ selectedDate: selectedDate, getStartDateOfTheWeek: startDate, getEndDateOfTheWeek: endDate, });
        if (!this.state.doctorDetails[selectedDate]) {
            this.getAvailabilitySlots(this.state.getSearchedDoctorIds, startDate, endDate);
            this.getDoctorAllDetails(this.state.getSearchedDoctorIds);
        }
        else {
            if (this.state.doctorDetails[selectedDate]) {
                this.setState({ doctorDetails: this.state.doctorDetails[selectedDate] });
            }
        }
    }

    /* Click the Slots from Doctor List page */
    onSlotPress = async (doctorData, selectedSlotItem, availableSlots, selectedSlotIndex) => {
        var selectedHospitalId = selectedSlotItem.location.hospital_id;
        let hospitalLocations = [];
        let tempHospitalArray = [];

        await this.setState({ singleDataWithDoctorDetails: doctorData });
        if (availableSlots[0].location.hospital_id === selectedHospitalId) {
            var confirmSlotDetails = {};
            confirmSlotDetails = this.state.singleDataWithDoctorDetails;
            confirmSlotDetails.slotData = selectedSlotItem;
            this.props.navigation.navigate('Payment Review', { resultconfirmSlotDetails: confirmSlotDetails })
        } else {
            availableSlots.forEach(element => {
                if (!tempHospitalArray.includes(element.location.hospital_id)) {
                    tempHospitalArray.push(element.location.hospital_id);
                    hospitalLocations.push({
                        _id: element.location.hospital_id,
                        hospitalLocationData: element.location,
                        hospitalSlotArray: [element]
                    });
                } else {
                    let index = tempHospitalArray.indexOf(element.location.hospital_id);
                    hospitalLocations[index].hospitalSlotArray.push(element);
                    this.getDoctorDetails(this.state.singleDataWithDoctorDetails.doctorId);
                    this.getPatientReviews(this.state.singleDataWithDoctorDetails.doctorId);
                }
            })
            await this.setState({ selectedDoctorHospitalLocations: hospitalLocations });
            await this.onClickedHospitalName(selectedHospitalId);
            await this.setState({ isModalVisible: true })
        }
    }
    /* Click the Hospital location and names from Book Appointment Popup page */
    onClickedHospitalName = async (hospitalId) => {
        let selectedHospitalData = findArrayObj(this.state.selectedDoctorHospitalLocations, '_id', hospitalId);
        await this.setState({ singleHospitalDataSlots: selectedHospitalData });
    }

    /* Get Patients Reviews*/
    reviewMap = new Map();
    getPatientReviews = async (doctorIds) => {
        let resultReview = await getDoctorsReviewsCount(doctorIds);
        // console.log('resultReview'+JSON.stringify(resultReview));
        debugger
        if (resultReview.success) {
        
            this.setState({ reviewData: resultReview.data });

            for (i = 0; i < resultReview.data.length; i++) {
                this.reviewMap.set(resultReview.data[i]._id, resultReview.data[i]) // total_rating
                //this.state.doctorDetails[i].overall_rating = this.state.reviewData[i].overall_rating;  //for Bind the "Stars Reviews" for multiple Doctors
            }
            console.log(this.reviewMap);
        }
    }

    /*Get doctor specialist and Degree details*/
    doctorSpecialitesMap = new Map();
    getDoctorDetails = async (doctorIds) => {
        let fields = "specialist,education,language,gender_preference,experience";
        let resultDoctorDetails = await getMultipleDoctorDetails(doctorIds, fields);
        if (resultDoctorDetails.success) {
            this.setState({ doctorData: resultDoctorDetails.data });
            console.log(resultDoctorDetails.data);
            for (i = 0; i < resultDoctorDetails.data.length; i++) {
                this.doctorSpecialitesMap.set(resultDoctorDetails.data[i].doctor_id, resultDoctorDetails.data[i]) // total_rating
                //this.state.doctorDetails[i].category = this.state.doctorData[i].specialist[i].category;  //for Bind the "Category Name" for multiple Doctors.
            }
        }
    }
    getDoctorSpecialist(doctorId) {
        if(this.doctorSpecialitesMap.has(doctorId)) {
           if(this.doctorSpecialitesMap.get(doctorId).specialist) {
              return this.doctorSpecialitesMap.get(doctorId).specialist[0] ? this.doctorSpecialitesMap.get(doctorId).specialist[0].category : ''
           }
           return '';
        }  
        return '';
    }

    /* Click the Slots and Book Appointment on Popup page */
    onBookSlotsPress = async (item, index) => {
        this.setState({ confirm_button: false });
        var confirmSlotDetails = {};
        confirmSlotDetails = { ...this.state.singleDataWithDoctorDetails };
        confirmSlotDetails.slotData = item;
        await this.setState({ selectedSlotIndex: index, confirmSlotDetails: confirmSlotDetails });
    }

    navigateToBookAppointmentPage(doctorAvailabilityData) {
       console.log('comsdasdas');
        const doctorDetails = doctorAvailabilityData;
        const slotData = doctorAvailabilityData.slotData[this.state.selectedDate]
        this.props.navigation.navigate('Book Appointment', { doctorDetails: doctorDetails, slotList: slotData })
    }



    noAvailableSlots(slotData) {
        let nextAvailableDate;
        for (let nextAvailableSlotDate of Object.keys(slotData)) {
            if(this.state.selectedDate < nextAvailableSlotDate) {
                nextAvailableDate = nextAvailableSlotDate;
                break;
            }
        }
        return (
            <Col style={{ alignSelf: 'center' }}>
            <Button style={{ borderColor: 'blue', borderRadius: 20, backgroundColor: 'gray' }}>
                <Text>Next Available Date : {nextAvailableDate}</Text>
            </Button>
            </Col>
        )
    }
    noDoctorsAvailable() {
        return (
            <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, justifyContent: 'center', alignItems: 'center' }} > No Doctors available! </Text>
            </Item>
        )
    }

    haveAvailableSlots(doctorData, slotsData) {

        return (
            <FlatList
                numColumns={10}
                data={slotsData}
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                    <Col style={{ col: '25%', padding: 5 }}>
                        <Button primary style={styles.timeButton} onPress={() => { this.onSlotPress(doctorData, item, slotsData, index) }}>
                            <Text note style={{ fontFamily: 'OpenSans', color: 'white' }}>{formatDate(item.slotStartDateAndTime, 'hh:mm')}</Text>
                        </Button>
                    </Col>

                } />
        )
    }

    render() {
        const { navigation } = this.props;
        const { isLoading, searchedResultData, categories, singleDataWithDoctorDetails, singleHospitalDataSlots, reviewData } = this.state;
        return (

            <Container style={styles.container}>

                <Content style={styles.bodyContent}>

                    {isLoading ?
                        <Loader style='list' />
                        : null}

                    <Card style={{ borderRadius: 7 }}>
                        <Grid>
                            <Row>
                                <Col style={{ width: '30%' }}>
                                    <Button transparent >
                                        <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: 'gray', fontSize: 13, textAlign: 'center' }}>Top Rated
                                    </Text>
                                        <View style={{ marginRight: "auto", marginLeft: 'auto' }}>
                                            <Icon name='ios-arrow-down' style={{ color: 'gray', marginLeft: '-3%', fontSize: 21 }} />
                                        </View>
                                    </Button>
                                </Col>

                                <View
                                    style={{
                                        borderLeftWidth: 2,
                                        borderLeftColor: 'whitesmoke',
                                    }}
                                />
                                <Col style={{ width: '40%', alignItems: 'center' }}>



                                    <View style={{ marginLeft: 10, flex: 1, flexDirection: 'row' }}>

                                        <DatePicker
                                            locale={"en"}
                                            timeZoneOffsetInMinutes={undefined}
                                            animationType={"fade"}
                                            androidMode={"default"}
                                            placeHolderText={this.state.selectedDate}
                                            textStyle={{ color: "#5A5A5A" }}
                                            placeHolderTextStyle={{ color: "#5A5A5A" }}
                                            onDateChange={date => { this.onDateChanged(date); }}
                                            disabled={false}
                                            testID='datePicked' />
                                        <View style={{ marginTop: 10, marginLeft: '-1%' }}>
                                            <Icon name='ios-arrow-down' style={{ color: 'gray', marginLeft: '5%', fontSize: 21 }} />
                                        </View>

                                    </View>

                                </Col>
                                <View
                                    style={{
                                        borderLeftWidth: 2,
                                        borderLeftColor: 'whitesmoke',
                                    }}
                                />
                                <Col style={{ alignItems: 'flex-start' }}>

                                    <Button transparent onPress={() => this.navigateToFilters()}>
                                        <Icon name='ios-funnel' style={{ color: 'gray' }} />

                                        <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: 'gray', fontSize: 13, marginLeft: '-30%' }}>Filter
                                    </Text>
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>

                    </Card>
                    {searchedResultData == null ? this.noDoctorsAvailable() :
                        <FlatList
                            data={this.state.doctorDetails}
                            extraData={this.state}
                            style={{ borderBottomWidth: 0 }}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) =>

                                <Card style={{ padding: 5, borderRadius: 10, borderBottomWidth: 2 }}>
                                    <List>
                                        <ListItem avatar onPress={() => this.navigateToBookAppointmentPage(item)}>
                                            <Left>
                                                {
                                                    item.profile_image != undefined
                                                        ? <Thumbnail square source={item.profile_image.imageURL} style={{ height: 60, width: 60 }} />
                                                        : <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 80, width: 80 }} />
                                                }

                                            </Left>
                                            <Body style={{ margin: 'auto' }}>
                                                <Text style={{ fontFamily: 'OpenSans' }}>{item.doctorName}</Text>
                                                {item.slotData[this.state.selectedDate] ?
                                                    <View>
                                                         <Grid style={{ marginTop: 5 }}>
                                                        <Col> 
                                                             <Text style={{ fontFamily: 'OpenSans-SemiBold', color: '#282727', fontSize: 12 }}>{this.getDoctorSpecialist(item.doctorId)}  - Fee: ₹{item.slotData[this.state.selectedDate][0].fee}</Text>  
                                                        </Col>
                                                        </Grid>
                                                        {item.slotData[this.state.selectedDate][0].location ?
                                                            <RenderHospitalAddress 
                                                                hospitalAddress={item.slotData[this.state.selectedDate][0].location} 
                                                                hospotalNameTextStyle= {{fontFamily: 'OpenSans-SemiBold'}}
                                                                textStyle={{ fontFamily: 'OpenSans'}}
                                                                gridStyle={{ marginTop: 5 }}
                                                                renderHalfAddress={true}
                                                            />
                                                            : null}
                                                        <Grid style={{ marginTop: 5 }}>
                                                            <Col style={{ width: '40%', marginBottom: 8, marginTop: 5 }}>

                                                                <StarRating fullStarColor='#FF9500' starSize={14} width={85} containerStyle={{ width: 80 }}
                                                                    disabled={true}
                                                                    maxStars={5}
                                                                    rating={ this.reviewMap.get(item.doctorId) ? this.reviewMap.get(item.doctorId).average_rating : 0}
                                                                />
                                                            </Col>
                                                            <Col style={{ width: '60%', marginLeft: 5 }}>
                                                                <Text style={{fontFamily: 'OpenSans', paddingLeft: 5, color: 'gray', fontSize: 15 }}>{this.reviewMap.get(item.doctorId) ? Number(this.reviewMap.get(item.doctorId).total_rating).toFixed(0): '' } </Text>
                                                            </Col>
                                                        </Grid>

                                                    </View>
                                                    : //condition
                                                    <View>
                                                        <Grid>
                                                           
                                                            <Col>
                                                                <Text note style={{ fontFamily: 'OpenSans' }}>{this.getDoctorSpecialist(item.doctorId)}</Text>
                                                            </Col>
                                                        </Grid>
                                                        <Grid style={{ marginTop: 5 }}>
                                                           <Row>
                                                            <Col style={{ width: '40%'}}>

                                                                <StarRating fullStarColor='#FF9500' starSize={13} width={80} containerStyle={{ width: 80 }}
                                                                    disabled={false}
                                                                    maxStars={5}
                                                                    rating={item.overall_rating}
                                                                />
                                                            </Col>

                                                            <Col style={{ width: '60%' }}>
                                                                <Text>{item.average_rating}</Text>
                                                            </Col>
                                                        </Row>

                                                            
                                                        </Grid>

                                                    </View>}

                                            </Body>

                                            <Right>
                                                
                                                <Icon name='heart' type='Ionicons'
                                                style={this.state.wishListColor===true?{color:'red',fontSize: 25}:{color:'gray',fontSize: 25}}
                                                  onPress={() => this.addToWishList(item.doctorId,index)} ></Icon>
                                            </Right>

                                        </ListItem> 

                                        <Grid>
                                            <Row>
                                                <ListItem>
                                                    <ScrollView horizontal={true}>

                                                        {item.slotData[this.state.selectedDate] == undefined ? this.noAvailableSlots(item.slotData) : this.haveAvailableSlots(item, item.slotData[this.state.selectedDate])}

                                                    </ScrollView>
                                                </ListItem>
                                            </Row>
                                        </Grid>
                                    </List>
                                </Card>
                            } />
                    }
                </Content>


                <Modal isVisible={this.state.isModalVisible} >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                        <Card style={{ padding: 7, borderRadius: 10, height: 420 }}>
                            <ListItem noBorder>
                                <Left></Left>
                                <Body>
                                    <Text style={{ marginLeft: -50, fontFamily: 'OpenSans', fontSize: 15, color: 'gray' }}>Confirmation</Text></Body>
                                <Right>

                                    <Button iconRight transparent onPress={() => {
                                        this.setState({ isModalVisible: !this.state.isModalVisible });
                                    }}>
                                        <Icon name='ios-close' style={{ fontSize: 25, marginTop: -5 }}></Icon>
                                    </Button>
                                </Right>
                            </ListItem>

                            <Grid>
                                <Col style={{ width: '20%' }}>

                                    <FlatList numColumns={1}
                                        data={this.state.selectedDoctorHospitalLocations}
                                        extraData={this.state}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) =>

                                            <TouchableOpacity onPress={() => this.onClickedHospitalName(item._id)}>
                                                <Grid style={{ marginTop: 45 }}>
                                                    <Text style={styles.newText}>{item.hospitalLocationData.name}</Text>
                                                </Grid>
                                            </TouchableOpacity>
                                        } />

                                </Col>
                                <Col style={{ width: '10%' }}>
                                    <Row style={{ marginTop: 60 }}>
                                        <Text style={styles.roundText}></Text>
                                    </Row>
                                    <Row style={{ marginTop: 60 }}>
                                        <Text style={styles.roundText}></Text>
                                    </Row>
                                </Col>

                                <Col style={{ width: '70%', borderLeftWidth: 1, borderColor: '#F2889B', paddingLeft: 10 }}>

                                    <Col style={{ width: '75%' }}>
                                        <Text style={{ fontFamily: 'OpenSans' }}>{singleDataWithDoctorDetails.doctorName}</Text>
                                        <Item style={{ borderBottomWidth: 0 }}>
                                            <Text note style={{ fontFamily: 'OpenSans' }}>{categories}</Text>
                                        </Item>
                                    </Col>


                                    <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={reviewData && reviewData[0].overall_rating}
                                    />
                                    <Grid>
                                        <Col>
                                            <Text note style={{ fontFamily: 'OpenSans' }}>Address </Text>
                                            <Text note style={{ fontFamily: 'OpenSans' }}>{singleHospitalDataSlots.hospitalLocationData.name}</Text>
                                            {singleHospitalDataSlots.hospitalLocationData.location ?
                                                <View>
                                                    <Text note style={{ fontFamily: 'OpenSans' }}>{singleHospitalDataSlots.hospitalLocationData.location.address.no_and_street}</Text>
                                                    <Text note style={{ fontFamily: 'OpenSans' }}>{singleHospitalDataSlots.hospitalLocationData.location.address.city}</Text>
                                                    <Text note style={{ fontFamily: 'OpenSans' }}>{singleHospitalDataSlots.hospitalLocationData.location.address.state}</Text>
                                                </View> : null}
                                        </Col>

                                    </Grid>

                                    <Grid >
                                        <View >
                                            <FlatList numColumns={3}
                                                data={this.state.singleHospitalDataSlots.hospitalSlotArray}
                                                extraData={this.state}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({ item, index }) =>

                                                    <TouchableOpacity style={this.state.selectedSlotIndex === index ? styles.slotSelectedBg : styles.slotDefaultBg}
                                                        onPress={() => this.onBookSlotsPress(item, index)}>
                                                        <Row style={{ width: '100%', alignItems: 'center' }}>
                                                            <Col style={{ width: '80%', alignItems: 'center' }}>
                                                                <Text style={{ color: 'white', fontFamily: 'OpenSans', fontSize: 10 }}>
                                                                    {formatDate(item.slotStartDateAndTime, 'hh:mm')}</Text>
                                                            </Col>
                                                            <Col style={styles.customPadge}>
                                                                <Text style={{ color: 'white', fontFamily: 'OpenSans', fontSize: 8 }}>
                                                                    {formatDate(item.slotStartDateAndTime, 'A')}</Text>
                                                            </Col>
                                                        </Row>
                                                    </TouchableOpacity>
                                                }
                                            />
                                        </View>
                                    </Grid>

                                    <Button block success disabled={this.state.confirm_button} style={{ borderRadius: 10, marginLeft: 10 }} onPress={this.confirmAppointmentPress}>
                                        <Text uppercase={false} >Confirm Appointment</Text>

                                    </Button>

                                </Col>
                            </Grid>
                        </Card>

                        <Button title="Hide modal" onPress={this.confirmAppointmentPress} />
                    </View>
                </Modal>

            </Container>
        )
    }

}

function loginState(state) {

    return {
        user: state.user
    }
}
export default connect(loginState, { login, messageShow, messageHide })(doctorSearchList)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',

    },

    bodyContent: {
        padding: 5
    },

    timeButton: {
        height: 35,
        width: 75,
        fontFamily: 'OpenSans',
        fontSize: 12,
        borderRadius: 15,
        textAlign: 'center',
        backgroundColor: '#7E49C3'
    },

    slotDefaultBg: {
        backgroundColor: '#2652AC',
        borderRadius: 5,
        width: '30%',
        height: 30,
        margin: 5
    },
    slotSelectedBg: {
        backgroundColor: '#808080',
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

});