import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Card, Item, CardItem, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ProgressBar, DatePicker } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, FlatList, AsyncStorage, TouchEvent, Dimensions } from 'react-native';
import StarRating from 'react-native-star-rating';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import Modal from "react-native-modal";
import { searchDoctorList, viewdoctorProfile, bindDoctorDetails, viewUserReviews } from '../../providers/bookappointment/bookappointment.action';
import { formatDate, getFirstDay, getLastDay, findArrayObj } from '../../../setup/helpers';
import { Loader } from '../../../components/ContentLoader'

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
            doctordata: {},
            qualification: '',
            reviewdata: null,
            confirm_button: true,
            getSearchedDoctorIds: null,
            isLoading: false
        }
    }

    confirmAppointmentPress = (confirmedSlot) => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
        this.props.navigation.navigate('Payment Review', { resultconfirmSlotDetails: this.state.confirmSlotDetails })
    };

    componentDidMount() {
        this.getPatientSearchData();
    }

    /* get the Doctor Id's list from Search Module  */
    getPatientSearchData = async () => {
        this.setState({ isLoading: true });
        const { navigation } = this.props;
        const searchedInputvalues = navigation.getParam('resultData');
        let startDate = getFirstDay(new Date(), 'week');
        let endDate = getLastDay(new Date(), 'week');

        const userId = await AsyncStorage.getItem('userId');
        let resultData = await searchDoctorList(userId, searchedInputvalues);
        // console.log(JSON.stringify(resultData+'response for searchDoctorList '));
        this.setState({ isLoading: false });
        if (resultData.success) {
            let doctorIds = resultData.data.map((element) => {
                return element.doctor_id
            }).join(',');
            this.setState({ getSearchedDoctorIds: doctorIds });
            this.getavailabilitySlots(this.state.getSearchedDoctorIds, startDate, endDate);
        }
    }

    /* get the  Doctors Availablity Slots */
    getavailabilitySlots = async (getSearchedDoctorIds, startDate, endDate) => {
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
            }
        } catch (e) {
            console.log(e);
        }
    }


    /* Change the Date from Date Picker */
    onDateChanged(date) {
        let selectedDate = formatDate(date, 'YYYY-MM-DD');
        let startDate = getFirstDay(new Date(date), 'week');
        let endDate = getLastDay(new Date(date), 'week');
        this.setState({ selectedDate: selectedDate, getStartDateOfTheWeek: startDate, getEndDateOfTheWeek: endDate, });
        if (!this.state.doctorDetails[selectedDate]) {
            this.getavailabilitySlots(this.state.getSearchedDoctorIds, startDate, endDate);
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
                    hospitalLocations[index].hospitalSlotArray.push(element)
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
        console.log(selectedHospitalData);
    }

    /* Get user Reviews*/
    getUserReviews = async (doctorId) => {
        let resultReview = await viewUserReviews(doctorId, 'doctor');
        if (resultReview.success) {
            this.setState({ reviewdata: resultReview.data });
        }
    }

    /*Get doctor education and Degree details*/
    getdoctorDetails = async (doctorId) => {
        let fields = "specialist,education";
        let resultDoctorDetails = await bindDoctorDetails(doctorId, fields);
        // console.log('resultDoctorDetails'+JSON.stringify(resultDoctorDetails))
        if (resultDoctorDetails.success) {
            this.setState({ doctordata: resultDoctorDetails.data });

            /*Doctor degree */
            if (resultDoctorDetails.data.education) {
                let sample = this.state.doctordata.education.map((val) => {
                    return val.degree;
                }).join();
                this.setState({ qualification: sample });
            }
        }
    }

    /* Click the Slots oand Book Appointment on Popup page */
    onBookSlotsPress = async (item, index) => {
        debugger
        this.setState({ confirm_button: false });
        var confirmSlotDetails = {};
        confirmSlotDetails = this.state.singleDataWithDoctorDetails;
        confirmSlotDetails.slotData = item;
        await this.setState({ selectedSlotIndex: index, confirmSlotDetails: confirmSlotDetails });
        // console.log(JSON.stringify(this.state.confirmSlotDetails));
    }

    navigateToBookAppointmentPage(doctorAvailabilityData) {
        
        const doctorDetails = doctorAvailabilityData;
        const slotData = doctorAvailabilityData.slotData[this.state.selectedDate]
        this.props.navigation.navigate('Book Appointment', { doctorDetails: doctorDetails, slotList: slotData })
    }

    noAvailableSlots() {
        return (
            <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, justifyContent: 'center', alignItems: 'center' }} > No slots available on Today! Plss Select the next Date! </Text>
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
        const { isLoading, qualification, singleDataWithDoctorDetails, singleHospitalDataSlots, reviewdata } = this.state;
        let start = 0;
        return (

            <Container style={styles.container}>

                <Content style={styles.bodyContent}>

                    {isLoading ?
                        <Loader style='list' />
                        : null}

                    <Card>
                        <Grid>
                            <Row>
                                <Col style={{ width: '20%' }}>
                                    <Button transparent>
                                        <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: 'gray' }}>TopRated
                                    </Text>
                                        <Icon name='ios-arrow-down' style={{ color: 'gray', marginLeft: '-3%' }} />
                                    </Button>
                                </Col>
                                <Col style={{ width: '2%' }}>

                                </Col>

                                <Col style={{ width: '56%', alignItems: 'center' }}>



                                    <Item>
                                        {/* <Button transparent onPress={() => navigation.navigate('Filters')}>
                                            <Icon name='arrow-dropleft' style={{ color: 'gray' }} />
                                        </Button> */}
                                        <DatePicker style={styles.transparentLabel}
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
                                        {/* <Button transparent onPress={() => navigation.navigate('Filters')}>
                                            <Icon name='arrow-dropright' style={{ color: 'gray' }} />
                                        </Button> */}

                                    </Item>

                                </Col>
                                <Col style={{ width: '2%' }}>

                                </Col>
                                <Col style={{ width: '20%', marginLeft: '-5%', alignItems: 'flex-start' }}>

                                    <Button transparent onPress={() => navigation.navigate('Filters')}>
                                        <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: 'gray' }}>Filter
                                    </Text>
                                        <Icon name='ios-funnel' style={{ color: 'gray', marginLeft: '-3%' }} />
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>

                    </Card>

                    <Card style={{ padding: 5, borderRadius: 10 }}>
                        <FlatList
                            data={this.state.doctorDetails}
                            extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) =>
                                <List>

                                    <ListItem avatar onPress={() => this.navigateToBookAppointmentPage(item)}>
                                        <Left>
                                            {
                                                item.profile_image != undefined
                                                    ? <Thumbnail square source={item.profile_image.imageURL} style={{ height: 60, width: 60 }} />
                                                    : <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 80, width: 80 }} />
                                            }

                                        </Left>
                                        <Body>
                                            <Text style={{ fontFamily: 'OpenSans' }}>{item.doctorName}</Text>
                                            {item.slotData[this.state.selectedDate] ?

                                                <View>

                                                    {item.slotData[this.state.selectedDate][0].location ?
                                                        <Grid>
                                                            <Col style={{ width: '10%' }}>
                                                                <Icon name='pin' style={{ fontSize: 20, fontFamily: 'OpenSans', color: 'gray' }}></Icon>
                                                            </Col>
                                                            <Col style={{ width: '90%' }}>
                                                                <Text note style={{ fontFamily: 'OpenSans', }}>{item.slotData[this.state.selectedDate][0].location.location.address.no_and_street}</Text>
                                                                <Text note style={{ fontFamily: 'OpenSans' }}>{item.slotData[this.state.selectedDate][0].location.location.address.city}</Text>
                                                                <Text note style={{ fontFamily: 'OpenSans' }}>{item.slotData[this.state.selectedDate][0].location.location.address.state}</Text>
                                                            </Col>
                                                        </Grid>
                                                        : null}

                                                    <Text note style={{ fontFamily: 'OpenSans', color: 'gray' }}>Rs {item.slotData[this.state.selectedDate][0].fee}</Text>

                                                </View>

                                                : null}

                                        </Body>
                                        <Right>
                                            <Icon name='heart' style={{ color: 'red', fontSize: 25 }}></Icon>
                                        </Right>
                                    </ListItem>

                                    <Grid>
                                        <Row>
                                            <ListItem>
                                                <ScrollView horizontal={true}>

                                                    {item.slotData[this.state.selectedDate] == undefined ? this.noAvailableSlots() : this.haveAvailableSlots(item, item.slotData[this.state.selectedDate])}

                                                </ScrollView>
                                            </ListItem>
                                        </Row>
                                    </Grid>
                                </List>
                            } />
                    </Card>
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
                                            <Text note style={{ fontFamily: 'OpenSans' }}>{qualification}</Text>
                                        </Item>
                                    </Col>


                                    <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={reviewdata && reviewdata[0].overall_rating}
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
                                        <Text uppercase={false} >Confirm Appoinment</Text>

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