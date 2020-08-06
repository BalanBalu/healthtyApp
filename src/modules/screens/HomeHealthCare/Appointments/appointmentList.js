import React, { PureComponent } from 'react';
import { Container, Content, Text, Toast, Button, ListItem, Card, Thumbnail, List, Item, Input, Left, Right, Icon } from 'native-base';
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage, FlatList, ImageBackground, Alert, Linking } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Col, Row, Grid } from 'react-native-easy-grid'
import SegmentedControlTab from "react-native-segmented-control-tab";
import styles from '../Styles'
import StarRating from "react-native-star-rating";
import { getAppointment4Healthcare } from '../../../providers/homeHelthCare/action'
import { formatDate, addTimeUnit, subTimeUnit, statusValue, getAllId } from "../../../../setup/helpers";
import { hasLoggedIn } from "../../../providers/auth/auth.actions";
import { renderDoctorImage, getAllEducation, getAllSpecialist, getName, getUserLocation } from '../../../common'
import noAppointmentImage from "../../../../../assets/images/noappointment.png";
import Spinner from "../../../../components/Spinner";
import { getMultipleDoctorDetails } from "../../../providers/bookappointment/bookappointment.action";
import InsertReview from '../Reviews/insertReviews';

class AppointmentList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false,
            selectedIndex: 0,
            upComingData: [],
            pastData: [],
            userId: null,
            loading: true,
            modalVisible: false,
            reviewData: {},
            reviewIndex: -1


        }
    }
    async componentDidMount() {
        await this.setState({ isLoading: true })
        const isLoggedIn = await hasLoggedIn(this.props);
        if (!isLoggedIn) {
            this.props.navigation.navigate("login");
            return;
        }
        this.upCommingAppointment();
    }


    pageRefresh = async (navigationData) => {
        if (navigationData.action) {
            await this.setState({
                isLoading: true
            })
            if (navigationData.action.type === 'Navigation/BACK' || navigationData.action.type === 'Navigation/NAVIGATE' || navigationData.action.type === 'Navigation/POP') {
                if (this.state.selectedIndex == 0) {
                    await this.upCommingAppointment();

                } else {
                    await this.pastAppointment();

                }
            }
        }

    }

    upCommingAppointment = async () => {
        try {
            this.setState({ isLoading: true })
            let userId = await AsyncStorage.getItem("userId");
            let filters = {
                startDate: new Date().toISOString(),
                endDate: addTimeUnit(new Date(), 1, "years").toISOString(),
            };
            let result = await getAppointment4Healthcare(userId, filters);
            if (result.success) {
                let doctorInfo = new Map();
                result = result.data;

                let doctorIds = getAllId(result)
                let speciallistResult = await getMultipleDoctorDetails(doctorIds, "specialist,education,prefix,profile_image,gender");

                speciallistResult.data.forEach(doctorData => {
                    let educationDetails = ' ';
                    let speaciallistDetails = '';

                    if (doctorData.education != undefined) {
                        educationDetails = getAllEducation(doctorData.education)
                    }
                    if (doctorData.specialist != undefined) {
                        speaciallistDetails = getAllSpecialist(doctorData.specialist)
                    }

                    doctorInfo.set(doctorData.doctor_id, {
                        degree: educationDetails,
                        specialist: speaciallistDetails,
                        prefix: doctorData.prefix,
                        profile_image: doctorData.profile_image,
                        gender: doctorData.gender
                    })
                });

                let upcommingInfo = [];
                result.map(doctorData => {
                    let details = doctorInfo.get(doctorData.doctor_id)
                    upcommingInfo.push({
                        appointmentResult: doctorData,
                        specialist: details.specialist,
                        degree: details.degree,
                        prefix: details.prefix,
                        profile_image: details.profile_image
                    });
                })
                upcommingInfo.sort(function (firstVarlue, secandValue) {
                    return firstVarlue.appointmentResult.appointment_starttime < secandValue.appointmentResult.appointment_starttime ? -1 : 0
                })

                this.setState({
                    upComingData: upcommingInfo,
                    data: upcommingInfo,
                    isLoading: false
                });
            }

        } catch (ex) {
            console.log(ex);
        } finally {
            this.setState({
                isLoading: false
            })

        }
    }

    pastAppointment = async () => {
        try {
            this.setState({ isLoading: true })
            let userId = await AsyncStorage.getItem("userId");
            let filters = {
                startDate: subTimeUnit(new Date(), 1, "years").toISOString(),
                endDate: subTimeUnit(new Date(), 1, 'days').toISOString(),
                reviewInfo: true
            };
            let result = await getAppointment4Healthcare(userId, filters);
            if (result.success) {
                result = result.data;
                let doctorInfo = new Map();
                let doctorIds = getAllId(result)
                let speciallistResult = await getMultipleDoctorDetails(doctorIds, "specialist,education,prefix,profile_image,gender");

                speciallistResult.data.forEach(doctorData => {

                    let educationDetails = ' ',
                        speaciallistDetails = '';

                    if (doctorData.education != undefined) {
                        educationDetails = getAllEducation(doctorData.education)
                    }
                    if (doctorData.specialist != undefined) {
                        speaciallistDetails = getAllSpecialist(doctorData.specialist)
                    }
                    doctorInfo.set(doctorData.doctor_id, {
                        degree: educationDetails,
                        specialist: speaciallistDetails.toString(),
                        prefix: doctorData.prefix,
                        profile_image: doctorData.profile_image,
                        gender: doctorData.gender
                    })
                });
                let pastDoctorDetails = [];
                result.map((doctorData, index) => {
                    let details = doctorInfo.get(doctorData.doctor_id)

                    pastDoctorDetails.push({
                        appointmentResult: doctorData,
                        specialist: details.specialist,
                        degree: details.degree,
                        prefix: details.prefix,
                        profile_image: details.profile_image
                    });
                }
                )
                pastDoctorDetails.sort(function (firstDateValue, secondDateValue) {
                    return firstDateValue.appointment_starttime > secondDateValue.appointment_starttime ? -1 : 0
                })
                this.setState({
                    pastData: pastDoctorDetails,
                    data: pastDoctorDetails,
                    isLoading: false
                });

            }

        } catch (ex) {
            console.log(ex);
        } finally {
            this.setState({
                isLoading: false
            })

        }
    }


    handleIndexChange = async (index) => {
        let data = []
        await this.setState({
            selectedIndex: index,
        });

        if (index === 0) {
            if (this.state.upComingData.length == 0) {
                await this.upCommingAppointment()
            } else {
                data = this.state.upComingData
            }

        } else if (index === 1) {
            if (this.state.pastData.length == 0) {
                await this.pastAppointment()
                data = this.state.pastData
            }
            else {
                data = this.state.pastData
            }
        }

        await this.setState({
            ...this.state,
            data

        });
    };
    navigateAddReview(item, index) {
        this.setState({
            modalVisible: true, reviewData: item.appointmentResult, reviewIndex: index
        })
    }

    async getvisble(val) {
        this.setState({ modalVisible: false });
        if (val.updatedVisible == true) {
            await this.pastAppointment();
        }
    }


    render() {
        // const data = [{ token_no: 1234, name: 'Nurse Hamington MBBS', date: "Sunday,June 28-2020  11:10 am" }]
        const { data, selectedIndex, isLoading } = this.state;

        return (
            <Container>
                <Content style={{ margin: 10 }}>
                    <NavigationEvents
                        onWillFocus={payload => { this.pageRefresh(payload) }}
                    />
                    <Card transparent>
                        <SegmentedControlTab
                            tabsContainerStyle={{
                                width: 250,
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginTop: "auto"
                            }}
                            values={["Upcoming", "Past"]}
                            selectedIndex={this.state.selectedIndex}
                            onTabPress={this.handleIndexChange}
                            activeTabStyle={{
                                backgroundColor: "#775DA3",
                                borderColor: "#775DA3"
                            }}
                            tabStyle={{ borderColor: "#775DA3" }} />
                    </Card>
                    <View style={{ marginTop: 5 }}>
                        {isLoading == true ?
                            (
                                <Spinner
                                    color="blue"
                                    style={[styles.containers, styles.horizontal]}
                                    visible={true}
                                    size={"large"}
                                    overlayColor="none"
                                    cancelable={false}
                                />
                            ) :
                            (data.length === 0 ? (
                                <Card transparent style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: "20%"
                                }}>
                                    <Thumbnail
                                        square
                                        source={noAppointmentImage}
                                        style={{ height: 100, width: 100, marginTop: "10%" }}
                                    />

                                    <Text style={{
                                        fontFamily: "OpenSans",
                                        fontSize: 15,
                                        marginTop: "10%"
                                    }}>No appoinments are scheduled
								</Text>
                                    <Item style={{ marginTop: "15%", borderBottomWidth: 0 }}>
                                        <Button style={[styles.bookingButton, styles.customButton]} testID='navigateToHome'>
                                            <Text style={{ fontFamily: 'Opensans', fontSize: 15, fontWeight: 'bold' }}>Book Now</Text>
                                        </Button>
                                    </Item>
                                </Card>
                            ) :
                                <FlatList
                                    data={data}
                                    renderItem={({ item, index }) =>
                                        <Card transparent style={styles.cardStyle}>
                                            <TouchableOpacity onPress={() =>
                                                this.props.navigation.navigate("HomeHealthcareAppointmentDetail", {
                                                    data: item.appointmentResult, selectedIndex: selectedIndex
                                                })}
                                                testID='navigateLabAppointmentInfo'>

                                                <Text style={styles.tokenText} >{"Ref no :" + item.appointmentResult.token_no}</Text>

                                                <Row style={{ marginTop: 10 }}>
                                                    <Col size={2}>
                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderDoctorImage(item), title: 'Profile photo' })}>
                                                            <Thumbnail
                                                                circular
                                                                source={renderDoctorImage(item)}
                                                                style={{ height: 60, width: 60 }}
                                                            />
                                                        </TouchableOpacity>
                                                    </Col>
                                                    <Col size={8}>
                                                        <Row style={{ borderBottomWidth: 0 }}>
                                                            <Col size={9}>
                                                                <Text style={styles.nameText}>{(item.prefix != undefined ? item.prefix + ' ' : '') + getName(item.appointmentResult.doctorInfo)}</Text>
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ borderBottomWidth: 0 }}>
                                                            <Text
                                                                style={{ fontFamily: "OpenSans", fontSize: 14, width: '60%' }}
                                                            >
                                                                {item.specialist}
                                                            </Text>

                                                            {selectedIndex == 1 &&
                                                                item.appointmentResult.reviewInfo != undefined && item.appointmentResult.reviewInfo.overall_rating !== undefined && (

                                                                    <StarRating
                                                                        fullStarColor="#FF9500"
                                                                        starSize={15}
                                                                        containerStyle={{
                                                                            width: 80,
                                                                            marginLeft: "auto",
                                                                        }}
                                                                        disabled={false}
                                                                        maxStars={5}
                                                                        rating={item.appointmentResult.reviewInfo.overall_rating}

                                                                    />
                                                                )}
                                                        </Row>
                                                        <Text style={styles.mainText}>{item.degree}</Text>
                                                        <Text style={[styles.mainText, { color: '#7F49C3' }]}>Visit home address :</Text>
                                                        <Text style={styles.subinnerText} note>{getUserLocation(item.appointmentResult.userInfo)}</Text>
                                                        <Text style={[styles.mainText, { color: '#7F49C3' }]}>Visited On :</Text>
                                                        <Text style={styles.subinnerText} note>
                                                            {formatDate(item.appointmentResult.appointment_date, "dddd,MMMM DD-YYYY")} </Text>
                                                        <Row>
                                                            <Col size={4} style={{ justifyContent: 'center' }}>
                                                                <Text style={{ fontFamily: "OpenSans", fontSize: 13, color: statusValue[item.appointmentResult.appointment_status].color, fontWeight: 'bold' }} note>{statusValue[item.appointmentResult.appointment_status].text}</Text>
                                                                {/* <Text style={styles.completedText}>{item.appointment_status}</Text> */}
                                                            </Col>
                                                           
                                                        </Row>
                                                        {selectedIndex == 1 &&
                                                            item.appointmentResult.appointment_status == "COMPLETED" && (item.appointmentResult.is_review_added == undefined || item.appointmentResult.is_review_added == false) ? (
                                                                <Row style={{ borderBottomWidth: 0 }}>
                                                                    <Right style={(styles.marginRight = -2)}>
                                                                        <Button style={styles.shareButton}
                                                                            onPress={() => this.navigateAddReview(item, index)}
                                                                            testID='navigateInsertReview'>
                                                                            <Text style={styles.bookAgain1}>Add Review</Text>
                                                                        </Button>
                                                                    </Right>

                                                                    <Right style={(styles.marginRight = 5)}>
                                                                        <Button style={styles.bookingButton} onPress={() => this.navigateToBookAppointmentPage(item)}>
                                                                            <Text style={styles.bookAgain1} testID='navigateBookAppointment'>Book Again</Text>
                                                                        </Button>
                                                                    </Right>
                                                                </Row>

                                                            ) : (
                                                                selectedIndex === 1 && (


                                                                    <Row style={{ borderBottomWidth: 0 }}>
                                                                        <Right style={(styles.marginRight = 10)}>
                                                                            <Button style={styles.bookingButton} onPress={() => this.navigateToBookAppointmentPage(item)} testID='navigateBookingPage'>
                                                                                <Text style={styles.bookAgain1}>
                                                                                    Book Again
																		           </Text>
                                                                            </Button>
                                                                        </Right>
                                                                    </Row>

                                                                )
                                                            )}
                                                    </Col>
                                                </Row>
                                            </TouchableOpacity>
                                        </Card>
                                    } />
                            )}
                        {this.state.modalVisible === true ?
                            <InsertReview
                                props={this.props}
                                data={this.state.reviewData}
                                popupVisible={(data) => this.getvisble(data)}
                            />


                            : null}

                    </View>
                </Content>
            </Container>
        )
    }
}

export default AppointmentList

