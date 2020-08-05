import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Input, Left, Right, Icon } from 'native-base';
import { logout } from '../../providers/auth/auth.actions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage, FlatList, ImageBackground, Alert, Linking } from 'react-native';
import { getReferalPoints, getCurrentVersion } from '../../providers/profile/profile.action';
import { catagries } from '../../providers/catagries/catagries.actions';
import { MAP_BOX_PUBLIC_TOKEN, IS_ANDROID, MAX_DISTANCE_TO_COVER, CURRENT_PRODUCT_VERSION_CODE } from '../../../setup/config';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { NavigationEvents } from 'react-navigation'
import { store } from '../../../setup/store';
import { getAllChats, SET_LAST_MESSAGES_DATA, SET_VIDEO_SESSION, RESET_INCOMING_VIDEO_CALL } from '../../providers/chat/chat.action'
import CurrentLocation from './CurrentLocation';
const VideoConultationImg = require('../../../../assets/images/videConsultation.jpg');
const pharmacyImg = require('../../../../assets/images/pharmacy.jpg');
const BloodImg = require('../../../../assets/images/blood.png');
const ReminderImg = require('../../../../assets/images/reminder.png');
const LabTestImg = require('../../../../assets/images/lab-test.png');
const HomeTestImg = require('../../../../assets/images/hometest.jpg');
const LabTestImgs = require('../../../../assets/images/Lab-tests.png');
const hospitalLogoImg = require('../../../../assets/images/hospital.png');
const publicForum = require('../../../../assets/images/public_forum.png');
import OfflineNotice from '../../../components/offlineNotice';
import { fetchUserMarkedAsReadedNotification } from '../../providers/notification/notification.actions';
import ConnectyCube from 'react-native-connectycube';
import { CallService, CallKeepService } from '../VideoConsulation/services';
MapboxGL.setAccessToken(MAP_BOX_PUBLIC_TOKEN);
import NotifService from '../../../setup/NotifService';
import FastImage from 'react-native-fast-image'
import { translate } from '../../../setup/translator.helper';
import { authorizeConnectyCube, setUserLoggedIn } from '../VideoConsulation/services/video-consulting-service';
import NextAppoinmentPreparation from './nextAppoinmentPreparation'
class Home extends Component {

    locationUpdatedCount = 0;
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false,
            catagary: [],
            categryCount: 0,
            AppoinmentData: [],
            updatedDate: '',
            AppointmentId: '',
            doctorInfo: {}
        };
    }

    navigetToCategories() {
        this.props.navigation.navigate('Categories', {
            data: this.state.data
        })
    }



    doLogout() {
        logout();
        this.props.navigation.navigate('login');
    }
    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    checkForUserProfile(res) {

        if (res.hasOtpNotVerified === true) {
            this.props.navigation.navigate('renderOtpInput', { loginData: { userEntry: res.mobile_no || res.email }, navigateBackToHome: true });
        }
        else if (res.updateBasicDetails === true) {
            this.props.navigation.navigate('UpdateUserDetails');
        }
    }
    async componentDidMount() {
        try {
            this.initialFunction();
            this._setUpListeners();
            NotifService.initNotification(this.props.navigation);
            if (IS_ANDROID) {
                let productConfigVersion = await getCurrentVersion("CURRENT_PATIENT_MEDFLIC_VERSION")
                console.log(productConfigVersion)
                if (productConfigVersion.success) {
                    if (CURRENT_PRODUCT_VERSION_CODE !== productConfigVersion.data[0].value.version_code) {
                        await this.updateAppVersion(productConfigVersion);
                    } else {
                        this.otpAndBasicDetailsCompletion();
                    }
                }
                else {
                    this.otpAndBasicDetailsCompletion();
                }
            } else
                this.otpAndBasicDetailsCompletion();

        } catch (ex) {
            console.log(ex)
        }
    }

    otpAndBasicDetailsCompletion = async () => {
        try {
            let userId = await AsyncStorage.getItem("userId");
            if (userId) {
                let res = await getReferalPoints(userId);
                if (res.updateMobileNo === true) {
                    this.props.navigation.navigate('UpdateContact', { updatedata: {} });
                    Toast.show({
                        text: 'Plase Update Your Mobile Number and Continue',
                        duration: 3000,
                        type: 'warning'
                    })
                }
                else if (res.hasProfileUpdated == false) {
                    if (res.hasOtpNotVerified === true) {
                        this.props.navigation.navigate('renderOtpInput', {
                            loginData: { userEntry: res.mobile_no },
                            navigateBackToHome: true
                        });
                        return;
                    }

                    Alert.alert(
                        "Alert",
                        "Your profile is not completed!Update to continue",
                        [
                            {
                                text: "Skip",
                                onPress: () => {
                                    console.log("Cancel Pressed");
                                },
                                style: "cancel"
                            },
                            {
                                text: "Update", onPress: () => {
                                    AsyncStorage.setItem('ProfileCompletionViaHome', '1'),
                                        this.checkForUserProfile(res)

                                }

                            }
                        ],
                        { cancelable: false }
                    );
                }
            }
        } catch (ex) {
            console.log(ex)
        }
    }
    initialFunction = async () => {
        try {
            this.getCatagries();
            CurrentLocation.getCurrentPosition();
            let userId = await AsyncStorage.getItem("userId");
            if (userId) {
                const { notification: { notificationCount }, navigation } = this.props
                navigation.setParams({
                    notificationBadgeCount: notificationCount
                });
                this.getAllChatsByUserId(userId);
                this.getMarkedAsReadedNotification(userId);
            }
        }
        catch (ex) {
            console.log(ex)
        }
    }


    updateAppVersion = async (productConfigVersion) => {
        if (productConfigVersion.data[0].value.force_update == true) {
            Alert.alert(
                "Please Upgrade Your Application !",
                "Update Medflic application to Newer Version",
                [
                    {
                        text: "UPDATE", onPress: () => {
                            console.log('OK Pressed')
                            Linking.openURL("https://play.google.com/store/apps/details?id=com.ads.medflic&hl=en")
                        }
                    }
                ],
                { cancelable: false }
            );
        } else {
            Alert.alert(
                "Please Upgrade Your Application !",
                "Update Medflic application to Latest Version",
                [
                    {
                        text: "Skip",
                        onPress: () => {
                            this.otpAndBasicDetailsCompletion();
                            console.log("Cancel Pressed");
                        },
                        style: "cancel"
                    },
                    {
                        text: "UPDATE", onPress: () => {
                            console.log('OK Pressed')
                            Linking.openURL("https://play.google.com/store/apps/details?id=com.ads.medflic&hl=en")
                        }

                    }
                ],
                { cancelable: false }
            );
        }
    }

    getCatagries = async () => {
        try {
            const searchQueris = 'services=0&skip=0&limit=9';
            let result = await catagries(searchQueris);

            if (result.success) {
                this.setState({ catagary: result.data, categryCount: this.state.categryCount + 1 })
            }
        } catch (e) {
            console.log(e);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    getAllChatsByUserId = async (userId) => {
        try {
            console.log('Calling getAllChatsByUserId');
            const chatList = await getAllChats(userId);
            console.log('Got the data', chatList);
            if (chatList.success === true) {
                store.dispatch({
                    type: SET_LAST_MESSAGES_DATA,
                    data: chatList.data
                })
                console.log(chatList.data);
            }
        } catch (error) {
            Toast.show({
                text: 'Something went wrong' + error,
                duration: 3000,
                type: 'danger'
            })
        }
    }

    navigateToCategorySearch(categoryName) {
        const { bookappointment: { locationCordinates } } = this.props;
        this.props.navigation.navigate("Doctor Search List", {   // New Enhancement Router path
            inputKeywordFromSearch: categoryName,
            locationDataFromSearch: {
                type: 'geo',
                "coordinates": locationCordinates,
                maxDistance: MAX_DISTANCE_TO_COVER
            }
        })
        // let serachInputvalues = [{
        //     type: 'category',
        //     value: categoryName
        // },
        // {
        //     type: 'geo',
        //     value: {
        //         coordinates: locationCordinates,
        //         maxDistance: MAX_DISTANCE_TO_COVER
        //     }
        // }]
        // this.props.navigation.navigate('Doctor List', { resultData: serachInputvalues })
    }

    getMarkedAsReadedNotification = async (userId) => {
        try {
            await fetchUserMarkedAsReadedNotification(userId);
            const { notification: { notificationCount }, navigation } = this.props
            navigation.setParams({
                notificationBadgeCount: notificationCount
            });
        }
        catch (e) {
            console.log(e)
        }
    }
    backNavigation = async (navigationData) => {
        try {
            let userId = await AsyncStorage.getItem('userId')
            if (userId) {
                ConnectyCube.videochat.onCallListener = this._onCallListener;
                ConnectyCube.videochat.onRemoteStreamListener = this._onRemoteStreamListener;
                ConnectyCube.videochat.onStopCallListener = this._onStopCallListener;
                ConnectyCube.videochat.onRejectCallListener = this._onRejectCallListener;
                this.getMarkedAsReadedNotification(userId);
            }
        } catch (e) {
            console.log(e)
        }
    }

    /*      
        Video Calling Service             
    */
    async _setUpListeners() {
        let userId = await AsyncStorage.getItem('userId')
        const { chat: { loggedIntoConnectyCube } } = this.props;
        if (userId && loggedIntoConnectyCube === false) {
            this.authorized = await authorizeConnectyCube();
            console.log('loggedIntoConnectyCube ' + loggedIntoConnectyCube + ' Authorized: ' + this.authorized);
            if (this.authorized) {
                ConnectyCube.videochat.onCallListener = this._onCallListener;
                ConnectyCube.videochat.onRemoteStreamListener = this._onRemoteStreamListener;
                ConnectyCube.videochat.onStopCallListener = this._onStopCallListener;
                ConnectyCube.videochat.onRejectCallListener = this._onRejectCallListener;
                setTimeout(() => {
                    setUserLoggedIn();
                }, 5000)

            }
        }
    }
    _onCallListener = (session, extension) => {

        CallService.processOnCallListener(session)
            .then(() => this.showInomingCallModal(session, extension))
            .catch(this.hideInomingCallModal);
    };
    _onRemoteStreamListener = async (session, userId, stream) => {
        console.log('Stream Sathish', stream);
        console.log(userId);
        await store.dispatch({
            type: SET_VIDEO_SESSION,
            data: {
                userId: userId,
                stream: stream
            }
        })
    };
    _onStopCallListener = (session, userId, extension) => {
        const isStoppedByInitiator = session.initiatorID === userId;

        CallService.processOnStopCallListener(userId, isStoppedByInitiator)
            .then(() => {
                if (isStoppedByInitiator) {
                    store.dispatch({
                        type: SET_VIDEO_SESSION,
                        data: null
                    });
                    CallService.setSession(null);
                    CallService.setExtention(null);
                    store.dispatch({
                        type: RESET_INCOMING_VIDEO_CALL,
                    })
                }
            })
            .catch(
                store.dispatch({
                    type: RESET_INCOMING_VIDEO_CALL,
                }));
    };
    _onRejectCallListener = (session, userId, extension) => {
        CallService.processOnRejectCallListener(session, userId, extension)
            .then(() => {
                store.dispatch({
                    type: SET_VIDEO_SESSION,
                    data: null
                });
                CallService.setSession(null);
                CallService.setExtention(null);
            })
            .catch(store.dispatch({
                type: RESET_INCOMING_VIDEO_CALL,
            }));
    };

    showInomingCallModal = (session, extension) => {
        CallService.setSession(session);
        CallService.setExtention(extension);
        CallKeepService.displayIncomingCall('12345', 'Doctor');
    };




    render() {
        const { bookappointment: { patientSearchLocationName, isSearchByCurrentLocation, locationUpdatedCount }, navigation } = this.props;

        if (locationUpdatedCount !== this.locationUpdatedCount) {
            navigation.setParams({
                appBar: {
                    locationName: patientSearchLocationName,
                    locationCapta: isSearchByCurrentLocation ? 'You are searching Near by Hospitals' : 'You are searching Hospitals on ' + patientSearchLocationName
                }
            });
            this.locationUpdatedCount = locationUpdatedCount;

        }
        return (

            <Container style={styles.container}>
                <OfflineNotice />
                <Content keyboardShouldPersistTaps={'handled'} style={styles.bodyContent}>
                    <NavigationEvents
                        onWillFocus={payload => { this.backNavigation(payload) }}
                    />
                    <Row style={styles.SearchRow}>
                        <Col size={0.9} style={styles.SearchStyle}>
                            <Icon name="ios-search" style={{ color: '#fff', fontSize: 20, padding: 2 }} />
                        </Col>
                        <Col size={8.1} style={{ justifyContent: 'center', }}>
                            <Input
                                onFocus={() => { this.props.navigation.navigate("RenderSuggestionList") }}
                                placeholder="Search for Symptoms/Services,etc"
                                style={styles.inputfield}
                                placeholderTextColor="#e2e2e2"
                                editable={true}
                                underlineColorAndroid="transparent"
                            />
                        </Col>
                    </Row>

                    <Grid style={{ flex: 1, marginLeft: 10, marginRight: 20, marginTop: 10 }}>
                        <Col style={{ width: '50%', }}>
                            <TouchableOpacity onPress={() =>
                                this.props.navigation.navigate("Video and Chat Service")
                            }>
                                <Card style={{ borderRadius: 2, overflow: 'hidden' }}>
                                    <Row style={styles.rowStyle}>
                                        <Image
                                            source={VideoConultationImg}
                                            style={{
                                                width: '100%', height: '100%', alignItems: 'center'
                                            }}
                                        />
                                    </Row>
                                    <Row style={styles.secondRow}>
                                        <Col style={{ width: '100%', }}>
                                            <Text style={styles.mainText}>{translate('Chat and Video')}</Text>
                                            <Text style={styles.subText}>{translate('Consult doctors through chat or video')}</Text>
                                        </Col>

                                    </Row>
                                </Card>
                            </TouchableOpacity>
                        </Col>


                        <Col style={{ width: '50%', marginLeft: 5 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Medicines")}>
                                <Card style={{ borderRadius: 2, overflow: 'hidden' }}>
                                    <Row style={styles.rowStyle}>
                                        <Image
                                            source={pharmacyImg}
                                            style={{
                                                width: '100%', height: '100%', alignItems: 'center'
                                            }}
                                        />
                                    </Row>
                                    <Row style={styles.secondRow}>
                                        <Col style={{ width: '100%', }}>
                                            <Text style={styles.mainText}>{translate('Pharmacy')}</Text>
                                            <Text style={styles.subText}>{translate('Get medicines delivered to home')} </Text>
                                        </Col>
                                    </Row>
                                </Card>
                            </TouchableOpacity>
                        </Col>

                    </Grid>
                    <Grid style={{ flex: 1, marginLeft: 10, marginRight: 20, }}>
                        <Col style={{ width: '50%' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Home Health Care")}>
                                <Card style={{ borderRadius: 2, overflow: 'hidden' }}>
                                    <Row style={styles.rowStyle}>
                                        <Image
                                            source={HomeTestImg}
                                            style={{
                                                width: '100%', height: '100%', alignItems: 'center'
                                            }}
                                        />
                                    </Row>
                                    <Row style={styles.secondRow}>
                                        <Col style={{ width: '100%', }}>
                                            <Text style={styles.mainText}>{translate('Home Health Care')}</Text>
                                            <Text style={styles.subText}>{translate('Get Doctor Consultation at Your Home')} </Text>
                                        </Col>

                                    </Row>
                                </Card>
                            </TouchableOpacity>
                        </Col>
                        <Col style={{ width: '50%', marginLeft: 5 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Lab Test')} >
                                <Card style={{ borderRadius: 2, overflow: 'hidden' }}>
                                    <Row style={styles.rowStyle}>
                                        <Image
                                            source={LabTestImgs}
                                            style={{
                                                width: '100%', height: '100%', alignItems: 'center'
                                            }}
                                        />
                                    </Row>
                                    <Row style={styles.secondRow}>
                                        <Col style={{ width: '100%', }}>
                                            <Text style={styles.mainText}>{translate('Book Lab tests')}</Text>
                                            <Text style={styles.subText}>Book Full Body Lab Test from The Safety Of Your Home</Text>
                                        </Col>

                                    </Row>
                                </Card>
                            </TouchableOpacity>
                        </Col>
                    </Grid>
                    <Grid style={{ flex: 1, marginLeft: 10, marginRight: 14, }}>
                        <Row style={{ marginTop: 5 }}>
                            <Col size={5}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("Hospitals")}>
                                    <Card style={{ padding: 5, borderRadius: 2 }}>
                                        <Row>
                                            <Col size={7.5} style={{ justifyContent: 'center' }}>
                                                <Text style={styles.mainText}>{translate('Hospitals')}</Text>
                                            </Col>
                                            <Col size={2.5}>
                                                <Image
                                                    source={hospitalLogoImg}
                                                    style={{
                                                        width: 35, height: 35, alignItems: 'center'
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </Card>
                                </TouchableOpacity>
                            </Col>
                            <Col size={5} style={{ marginLeft: 5 }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("Public Forum")} >
                                    <Card style={{ padding: 5, borderRadius: 2 }}>
                                        <Row>
                                            <Col size={7.5} style={{ justifyContent: 'center' }}>
                                                <Text style={styles.mainText}>{translate('Public Forum')} </Text>
                                            </Col>
                                            <Col size={2.5}>
                                                <Image
                                                    source={publicForum}
                                                    style={{
                                                        width: 35, height: 35, alignItems: 'center'
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </Card>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 5 }}>
                            <Col size={5}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("Reminder")}>
                                    <Card style={{ padding: 5, borderRadius: 2 }}>
                                        <Row>
                                            <Col size={7.5} style={{ justifyContent: 'center' }}>
                                                <Text style={styles.mainText}>{translate('Medicine Reminder')}</Text>
                                            </Col>
                                            <Col size={2.5}>
                                                <Image
                                                    source={ReminderImg}
                                                    style={{
                                                        width: 35, height: 35, alignItems: 'center'
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </Card>
                                </TouchableOpacity>
                            </Col>
                            <Col size={5} style={{ marginLeft: 5 }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("Blood Donors")} >
                                    <Card style={{ padding: 5, borderRadius: 2 }}>
                                        <Row>
                                            <Col size={7.5} style={{ justifyContent: 'center' }}>
                                                <Text style={styles.mainText}>{translate('Blood Donors')} </Text>
                                            </Col>
                                            <Col size={2.5}>

                                                <Image
                                                    source={BloodImg}
                                                    style={{
                                                        width: 35, height: 35, alignItems: 'center'
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </Card>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </Grid>
                    <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 20 }}>
                        <Row style={{ marginTop: 10, marginBottom: 5 }}>
                            <Left>
                                <Text style={styles.mainHead}>{translate('Categories')}</Text>
                            </Left>
                            <Right>
                                <TouchableOpacity onPress={() => this.navigetToCategories()} style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 5, paddingTop: 5, borderRadius: 5, color: '#fff', flexDirection: 'row' }}>
                                    <Text style={{ color: '#775DA3', fontSize: 13, textAlign: 'center', fontWeight: 'bold' }}>{translate('View All')}</Text>
                                </TouchableOpacity>
                            </Right>
                        </Row>

                        <View>
                            <Row style={{ marginLeft: -5, marginTop: -10 }}>
                                <FlatList
                                    numColumns={3}
                                    data={this.state.catagary}
                                    extraData={this.state.categryCount}
                                    renderItem={({ item, index }) =>
                                        <Col style={styles.maincol}>
                                            <TouchableOpacity onPress={() => this.navigateToCategorySearch(item.category_name)}
                                                style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: 5, paddingBottom: 5 }}>
                                                <FastImage
                                                    source={{ uri: item.imageBaseURL + item.category_id + '.png' }}
                                                    style={{
                                                        width: 50, height: 50, alignItems: 'center'
                                                    }}
                                                />
                                                <Text style={{ fontSize: 10, textAlign: 'center', fontWeight: '200', marginTop: 5, paddingLeft: 5, paddingRight: 5, paddingTop: 1, paddingBottom: 1 }}>{item.category_name}</Text>
                                            </TouchableOpacity>
                                        </Col>
                                    }
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </Row>


                        </View>

                        <Row style={{ marginTop: 10, marginBottom: 5 }}>
                            <Left>
                                <Text style={styles.mainHead}>{translate('Refer and Earn!')} </Text>
                            </Left>
                        </Row>
                        <View>
                            <Card style={{ borderRadius: 10, }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("EarnReward")}>
                                    <Row style={{ height: 60, width: '100%', overflow: 'hidden', backgroundColor: "#fff", borderRadius: 10, }}>
                                        <Col style={{ width: '70%', }}>
                                            <ImageBackground
                                                source={require('../../../../assets/images/bg.png')}
                                                style={{
                                                    width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'
                                                }}
                                            >
                                                <Text style={styles.innerText}>Invite People And Get Cash Rewards Upto Rs.100 /-</Text>
                                            </ImageBackground>
                                        </Col>
                                        <Col style={{ width: '30%', }}>

                                            <Image
                                                source={require('../../../../assets/images/imagebgshape.png')}
                                                style={{
                                                    width: '130%', height: '130%', marginTop: -10, marginLeft: -18
                                                }}
                                            />


                                        </Col>
                                    </Row>
                                </TouchableOpacity>
                            </Card>
                            <NextAppoinmentPreparation
                                navigation={this.props.navigation}
                            />
                        </View>




                    </View>

                </Content>
            </Container>
        )
    }

}

function homeState(state) {

    return {
        bookappointment: state.bookappointment,
        chat: state.chat,
        profile: state.profile,
        notification: state.notification

    }
}
export default connect(homeState)(Home)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 5
    },
    textcenter: {
        fontSize: 15,
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'OpenSans'
    },

    column:
    {
        width: 'auto',
        borderRadius: 10,
        margin: 5,
        padding: 5,
        paddingBottom: 20,


    },

    columns:
    {
        width: '33.33%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 10,
        margin: 5,
        padding: 5,
        paddingBottom: 25,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 5

    },

    customImage: {
        height: 70,
        width: 70,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },


    pharmImage: {
        height: 50,
        width: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        // borderColor: '#fff',
        // borderWidth: 2,
        // borderRadius: 10,
        //padding:30


    },
    titleText: {
        fontSize: 15,
        fontWeight: 'bold',
        padding: 5,
        backgroundColor: '#775DA3',
        borderRadius: 20,
        color: 'white',
        width: "95%",
        textAlign: 'center',
        fontFamily: 'OpenSans',

    },

    offerText: {
        fontSize: 15,
        padding: 5,
        backgroundColor: 'gray',
        borderRadius: 20,
        color: 'white',
        width: "93%",
        textAlign: 'center',
        fontFamily: 'OpenSans',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10,
        fontWeight: 'bold'
    },

    offerText1: {
        fontSize: 15,
        padding: 5,
        backgroundColor: 'red',
        borderRadius: 20,
        color: 'white',
        width: "93%",
        textAlign: 'center',
        fontFamily: 'OpenSans',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 8,
        fontWeight: 'bold'
    },
    SearchRow: {
        backgroundColor: 'white',
        borderColor: '#000',
        borderWidth: 0.5,
        height: 35,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 5, borderRadius: 20
    },
    SearchStyle: {
        backgroundColor: '#7E49C3',
        width: '85%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRightColor: '#000',
        borderRightWidth: 0.5,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20
    },
    inputfield: {
        color: 'gray',
        fontFamily: 'OpenSans',
        fontSize: 12,
        padding: 5,
        paddingLeft: 10
    },
    wrapper: {
        marginTop: 5,
        borderRadius: 2
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },

    mainHead: {
        fontFamily: 'OpenSans',
        fontSize: 15,
        fontWeight: 'bold'
    },
    innerText: {
        color: '#775DA3',
        fontSize: 14,
        textAlign: 'left',
        marginLeft: 15,
        lineHeight: 20,
        fontWeight: '500',

    },
    maincol: {
        alignItems: "center",
        justifyContent: "center",
        borderColor: 'gray',
        borderRadius: 5,
        flexDirection: 'row',
        borderWidth: 0.1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 1,
        padding: 1,
        marginTop: 15,
        marginLeft: 11,
        marginBottom: 1,
        width: '29.5%',
        flexDirection: 'row',
        backgroundColor: '#fff',


    },
    rowStyle: {
        height: 100,
        width: '100%',
        overflow: 'hidden',
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center'
    },
    secondRow: {
        paddingTop: 10,
        paddingBottom: 10,
        width: '100%',
        height: 80,
        borderTopColor: '#000',
        borderTopWidth: 0.3,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainText: {
        fontSize: 10,
        textAlign: 'center',
        fontWeight: '500'
    },
    subText: {
        fontSize: 10,
        marginTop: 5,
        textAlign: 'center',
    }
});