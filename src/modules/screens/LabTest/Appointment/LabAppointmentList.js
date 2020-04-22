import React, { Component } from 'react';
import {
    Container, Content, Text, Button, Item, Card, List, ListItem, Left, Right,
    Thumbnail, Body, Icon, Toast, View, CardItem
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, AsyncStorage, TouchableOpacity, Modal } from 'react-native';
import StarRating from 'react-native-star-rating';
import { FlatList } from 'react-native-gesture-handler';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { NavigationEvents } from 'react-navigation';
import Spinner from "../../../../components/Spinner";
import noAppointmentImage from "../../../../../assets/images/noappointment.png";
import { formatDate, addTimeUnit, subTimeUnit, statusValue } from "../../../../setup/helpers";
import { getLapAppointments, getCategories } from '../../../providers/lab/lab.action'
import { hasLoggedIn } from "../../../providers/auth/auth.actions";

class LabAppointmentList extends Component {
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
                startDate: new Date().toUTCString(),
                endDate: addTimeUnit(new Date(), 1, "years").toUTCString(),
            };
            let result = await getLapAppointments(userId, filters);
            if (result.success) {
                result = result.data;
                console.log("result", result)
                result.sort(function (firstDateValue, secondDateValue) {
                    return firstDateValue.appointment_starttime < secondDateValue.appointment_starttime ? -1 : 0
                })
                console.log(result)
                this.setState({
                    upComingData: result,
                    data: result,
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
                startDate: subTimeUnit(new Date(), 1, "years").toUTCString(),
                endDate: addTimeUnit(new Date(), 1, 'millisecond').toUTCString(),
            };
            let result = await getLapAppointments(userId, filters);
            if (result.success) {
                result = result.data;
                console.log("result", result)
                result.sort(function (firstDateValue, secondDateValue) {
                    return firstDateValue.appointment_starttime < secondDateValue.appointment_starttime ? -1 : 0
                })
                console.log(result)
                this.setState({
                    pastData: result,
                    data: result,
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
        console.log("index", index)
        let data = []
        this.setState({
            selectedIndex: index,
        });
        if (index === 0) {
            if (this.state.upComingData.length == 0) {
                await this.upCommingAppointment()
            } else {
                data = this.state.upComingData
            }

        } else {
            if (this.state.pastData.length == 0) {
                await this.pastAppointment()
                data = this.state.pastData

            }
            else {
                data = this.state.pastData
            }

        }

        this.setState({
            ...this.state,
            data

        });
    };

    render() {
        const { data, selectedIndex,isLoading } = this.state;
        return (
            <Container style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => { this.pageRefresh(payload) }}
                />
                <Content style={styles.bodyContent}>
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
                            (
                                data.length === 0 ? (
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
                                    <Button style={[styles.bookingButton, styles.customButton]}>
                                        <Text style={{ fontFamily: 'Opensans', fontSize: 15, fontWeight: 'bold' }}>Book Now</Text>
                                    </Button>
                                </Item>
                            </Card>
                        ) :
                            <FlatList
                                data={data}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) =>
                                    <Card transparent style={styles.cardStyle}>
                                        <TouchableOpacity onPress={() =>
                                            this.props.navigation.navigate("LabAppointmentInfo", {
                                                data: item, selectedIndex: selectedIndex
                                            })
                                        } testID='navigateLabAppointmentInfo'>
                                            {item.token_no ?
                                                <Text style={{ textAlign: 'right', fontSize: 14, marginTop: -5 }} >{"Ref no :" + item.token_no}</Text>
                                                : null}
                                            <Row style={{ marginTop: 10 }}>
                                                <Col size={2}>
                                                    <Thumbnail circular source={require('../../../../../assets/images/profile_male.png')} style={{ height: 60, width: 60 }} />
                                                </Col>
                                                <Col size={8}>
                                                    <Row style={{ borderBottomWidth: 0 }}>
                                                        <Text style={styles.nameText}>
                                                            {item.labInfo.lab_name}
                                                        </Text>

                                                    </Row>
                                                    <Row style={{ borderBottomWidth: 0, marginTop: 5 }}>
                                                        <Text
                                                            style={styles.subText}
                                                        >
                                                            {item.lab_test_descriptiion}
                                                        </Text>
                                                        <StarRating
                                                            fullStarColor="#FF9500"
                                                            starSize={15}
                                                            containerStyle={{
                                                                width: 80,
                                                                marginLeft: "auto",
                                                                marginTop: 3
                                                            }}
                                                            disabled={false}
                                                            maxStars={5}
                                                        />
                                                    </Row>

                                                    <Row style={{ borderBottomWidth: 0 }}>
                                                        <Text style={{ fontFamily: "OpenSans", fontSize: 13, color: statusValue[item.appointment_status].color, fontWeight: 'bold' }}>{statusValue[item.appointment_status].text}</Text>
                                                    </Row>

                                                    <Text style={{ fontFamily: "OpenSans", fontSize: 11 }} note>
                                                        {formatDate(item.appointment_starttime, "dddd,MMMM DD-YYYY  hh:mm a")} </Text>
                                                    {selectedIndex == 1 ?
                                                       (<Row style={{ borderBottomWidth: 0, marginTop: 5 }}>
                                                            <Right style={(styles.marginRight = -2)}>
                                                                <Button
                                                                    style={styles.shareButton}
                                                                    onPress={() => this.navigateAddReview(item, index)}

                                                                    testID='navigateInsertReview'
                                                                >
                                                                    <Text style={styles.bookAgain1}>

                                                                        Add Review
																</Text>
                                                                </Button></Right>

                                                            <Right style={(styles.marginRight = 5)}>

                                                                <Button style={styles.bookingButton} onPress={() => this.navigateToBookAppointmentPage(item)}>
                                                                    <Text style={styles.bookAgain1} testID='navigateBookAppointment'>
                                                                        Book Again
																</Text>
                                                                </Button>
                                                            </Right>
                                                        </Row>)
                                                        : null}
                                                </Col>
                                            </Row>
                                        </TouchableOpacity>
                                    </Card>
                                } />
                            )}
                    </View>
                </Content>
            </Container>
        )

    }
}

export default LabAppointmentList


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 10

    },
    bookingButton: {
        marginTop: 10,
        backgroundColor: "#775DA3",
        marginRight: 1,
        borderRadius: 10,
        width: "auto",
        height: 30,
        color: "white",
        fontSize: 12,
        textAlign: "center"
    },
    bookAgain1: {
        fontSize: 13,
        fontFamily: 'OpenSans',
        fontWeight: 'bold'
    },
    shareButton: {
        marginTop: 10,
        backgroundColor: "gray",
        marginRight: 1,
        borderRadius: 10,
        width: "auto",
        height: 30,
        color: "white",
        fontSize: 12,
        textAlign: "center"
    },
    cardStyle: {
        borderBottomWidth: 0.3,
        paddingBottom: 10,
        marginTop: 10
    },
    refText: {
        textAlign: 'right',
        fontSize: 14,
        marginTop: -5
    },
    nameText: {
        fontFamily: "OpenSans",
        fontSize: 15,
        fontWeight: 'bold'
    },
    subText: {
        fontFamily: "OpenSans",
        fontSize: 14,
        width: '60%'
    },
    statusText: {
        fontFamily: "OpenSans",
        fontSize: 13,
        color: 'green',
        fontWeight: 'bold'
    }

})

