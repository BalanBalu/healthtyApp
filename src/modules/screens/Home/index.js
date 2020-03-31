import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Input, Left, Right, Icon } from 'native-base';
import { logout } from '../../providers/auth/auth.actions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage, FlatList, ImageBackground, Alert, Linking } from 'react-native';

import { getReferalPoints, getCurrentVersion } from '../../providers/profile/profile.action';
import { catagries, getSpecialistDataSuggestions } from '../../providers/catagries/catagries.actions';
import { MAP_BOX_PUBLIC_TOKEN, IS_ANDROID, MAX_DISTANCE_TO_COVER, CURRENT_PRODUCT_VERSION_CODE } from '../../../setup/config';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { NavigationEvents } from 'react-navigation'
import { store } from '../../../setup/store';
import { getAllChats, SET_LAST_MESSAGES_DATA, SET_VIDEO_SESSION } from '../../providers/chat/chat.action'
import CurrentLocation from './CurrentLocation';
const bloodImg = require('../../../../assets/images/blood.jpeg');
const chatImg = require('../../../../assets/images/Chat.jpg');
const pharmacyImg = require('../../../../assets/images/pharmacy.jpg');
import OfflineNotice from '../../../components/offlineNotice';
import { toDataUrl } from '../../../setup/helpers';
import { fetchUserMarkedAsReadedNotification } from '../../providers/notification/notification.actions';
import ConnectyCube from 'react-native-connectycube';
import { CallService } from '../VideoConsulation/services';
// import VideoScreen from '../VideoConsulation/components/VideoScreen/index';
MapboxGL.setAccessToken(MAP_BOX_PUBLIC_TOKEN);

const debounce = (fun, delay) => {
    let timer = null;
    return function (...args) {
        const context = this;
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fun.apply(context, args);
        }, delay);
    };
}

class Home extends Component {
    
    locationUpdatedCount = 0;
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false,
            catagary: [],
            searchValue: null,
            totalSpecialistDataArry: [],
            visibleClearIcon: '',
            categryCount: 0
        };
        this.callSuggestionService = debounce(this.callSuggestionService, 500);
        this._setUpListeners();

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
            const coronoTestStatus = await AsyncStorage.getItem('coronoTested');
            if (coronoTestStatus === '1') { } else {
                this.props.navigation.navigate('CORONO Status');
            }
            this.initialFunction();
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
                res = await getReferalPoints(userId);
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
                this.getMarkedAsReadedNotification(userId)
                
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
                            Linking.openURL("https://play.google.com/store/apps/details?id=com.medflic&hl=en")
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
                            Linking.openURL("https://play.google.com/store/apps/details?id=com.medflic&hl=en")
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
                for (let i = 0; i < result.data.length; i++) {
                    const item = result.data[i];
                    const imageURL = item.imageBaseURL + item.category_id + '.png';
                    const base64ImageDataRes = await toDataUrl(imageURL)
                    result.data[i].base64ImageData = base64ImageDataRes;
                }
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

        let serachInputvalues = [{
            type: 'category',
            value: categoryName
        },
        {
            type: 'geo',
            value: {
                coordinates: locationCordinates,
                maxDistance: MAX_DISTANCE_TO_COVER
            }
        }]
        this.props.navigation.navigate('Doctor List', { resultData: serachInputvalues })
    }
    count = 0;
    callSuggestionService = async (enteredText) => {
        console.log('clicked :' + this.count++)
        const userId = await AsyncStorage.getItem('userId');
        const { bookappointment: { locationCordinates } } = this.props;
        locationData = {
            "coordinates": locationCordinates,
            "maxDistance": MAX_DISTANCE_TO_COVER
        }

        let specialistResultData = await getSpecialistDataSuggestions(userId, enteredText, locationData);
        // console.log('specialistResultData.data' + JSON.stringify(specialistResultData.data))
        if (specialistResultData.success) {
            this.setState({
                totalSpecialistDataArry: specialistResultData.data,
                searchValue: enteredText,
            });
        } else {

            this.setState({
                totalSpecialistDataArry: [],
                searchValue: enteredText
            });
        }
    }
    /* Filter the Specialist and Services on Search Box  */

    SearchKeyWordFunction = async (enteredText) => {
        await this.setState({ visibleClearIcon: enteredText })
        this.callSuggestionService(enteredText);  // Call the Suggestion API with Debounce method
    }

    clearTotalText = () => {
        this.setState({ visibleClearIcon: null, totalSpecialistDataArry: null, searchValue: null })
    };

    itemSaperatedByListView = () => {
        return (
            <View
                style={{
                    padding: 4,
                    borderBottomColor: 'gray',
                    borderBottomWidth: 0.5
                }}
            />
        );
    };
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
                this.getMarkedAsReadedNotification(userId);
            }
        } catch (e) {
            console.log(e)
        }
    }

/*      
    Video Calling Service             
*/
    _setUpListeners() {
       ConnectyCube.videochat.onCallListener = this._onCallListener;
       // ConnectyCube.videochat.onAcceptCallListener = this._onAcceptCallListener;
       // ConnectyCube.videochat.onRejectCallListener = this._onRejectCallListener;
        // ConnectyCube.videochat.onStopCallListener = this._onStopCallListener;
        // ConnectyCube.videochat.onUserNotAnswerListener = this._onUserNotAnswerListener;
        ConnectyCube.videochat.onRemoteStreamListener = this._onRemoteStreamListener;
      }
      _onCallListener = (session, extension) => {
       
        CallService.processOnCallListener(session)
          .then(() => this.showInomingCallModal(session))
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
      
      showInomingCallModal = session => {
            CallService.setSession(session);
            this.props.navigation.navigate('VideoScreen', { isIncomingCall: true })
      };
     

    render() {
        const { fromAppointment } = this.state;
        const { bookappointment: { patientSearchLocationName, locationCordinates, isSearchByCurrentLocation, locationUpdatedCount }, navigation } = this.props;

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
                            <TouchableOpacity style={{ justifyContent: 'center' }}>
                                <Icon name="ios-search" style={{ color: '#fff', fontSize: 20, padding: 2 }} />
                            </TouchableOpacity>
                        </Col>
                        <Col size={8.1} style={{ justifyContent: 'center', }}>
                            <Input
                                placeholder="Search for Symptoms/Services,etc"
                                style={styles.inputfield}
                                placeholderTextColor="#e2e2e2"
                                keyboardType={'email-address'}
                                autoFocus={fromAppointment}
                                value={this.state.visibleClearIcon}
                                onChangeText={enteredText => this.SearchKeyWordFunction(enteredText)}
                                underlineColorAndroid="transparent"
                                blurOnSubmit={false}
                            />
                        </Col>
                        <Col size={1.0} style={{ justifyContent: 'center' }}>
                            {this.state.visibleClearIcon != '' ?
                                <Button transparent onPress={() => this.clearTotalText()} style={{ justifyContent: 'flex-start', marginLeft: -10 }}>
                                    <Icon name="ios-close" style={{ fontSize: 25, color: 'gray' }} />
                                </Button>
                                : null}
                        </Col>

                    </Row>





                    {this.state.searchValue != null ?
                        <FlatList
                            data={this.state.totalSpecialistDataArry ? [{ value: 'All Doctors in ' + (isSearchByCurrentLocation === true ? 'Your Location' : patientSearchLocationName), type: ' ' }].concat(this.state.totalSpecialistDataArry) : [{ value: 'All Doctors in ' + (isSearchByCurrentLocation === true ? 'Your Location' : patientSearchLocationName), type: ' ' }]}
                            extraData={[this.state.searchValue, this.state.totalSpecialistDataArry]}
                            ItemSeparatorComponent={this.itemSaperatedByListView}
                            renderItem={({ item, index }) => (
                                <Row
                                    onPress={() => {
                                        let requestData = [{
                                            type: 'geo',
                                            value: {
                                                coordinates: locationCordinates,
                                                maxDistance: MAX_DISTANCE_TO_COVER
                                            }
                                        }]
                                        if (index !== 0) {
                                            requestData.push({
                                                type: item.type,
                                                value: item.type === 'symptoms' ? [item.value] : item.value
                                            })
                                        }
                                        this.props.navigation.navigate("Doctor List", { resultData: requestData })
                                    }}
                                >
                                    <Col size={7}>
                                        <Text style={{ marginTop: 2, fontFamily: 'OpenSans', fontSize: 12, color: '#775DA3', paddingLeft: 10, }}>{item.value}</Text>
                                        {item.address ? <Text style={{ marginTop: 2, fontFamily: 'OpenSans', fontSize: 12, color: '#9c9b9f', paddingLeft: 10, }}>{item.address}</Text> : null}

                                    </Col>
                                    <Col size={3}>
                                        <Text uppercase={true} style={{ color: 'gray', marginTop: 2, marginRight: 10, color: '#775DA3', fontSize: 12, fontFamily: 'OpenSans-Bold', paddingLeft: 10, }}>{item.type}</Text>
                                    </Col>
                                </Row>
                            )}
                            enableEmptySections={true}
                            style={{ marginTop: 10 }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        : null}


                    <Grid style={{ flex: 1, marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                        <Col style={{ width: '33.33%', }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Blood Donors")}>
                                <Card style={{ borderRadius: 10, overflow: 'hidden' }}>
                                    <Row style={{ height: 100, width: '100%', overflow: 'hidden', backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={bloodImg}
                                            style={{
                                                width: '100%', height: '100%', alignItems: 'center'
                                            }}
                                        />
                                    </Row>
                                    <Row style={{ padding: 10, height: 65, width: '100%', borderTopColor: '#000', borderTopWidth: 0.3, backgroundColor: '#fff', paddingTop: 5, justifyContent: 'center' }}>
                                        <Col style={{ width: '100%' }}>
                                            <Text style={{ fontSize: 10, textAlign: 'center', fontWeight: 'bold' }}>Available Blood Donors</Text>
                                            <Text style={{ fontSize: 10, marginTop: 5, textAlign: 'center', }}> donate blood </Text>

                                        </Col>
                                    </Row>
                                </Card>
                            </TouchableOpacity>
                        </Col>

                        <Col style={{ width: '33.33%', }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Chat Service")}>
                                <Card style={{ borderRadius: 10, overflow: 'hidden' }}>
                                    <Row style={{ height: 100, width: '100%', overflow: 'hidden', backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={chatImg}
                                            style={{
                                                width: '100%', height: '100%', alignItems: 'center'
                                            }}
                                        />
                                    </Row>
                                    <Row style={{ padding: 10, height: 65, width: '100%', borderTopColor: '#000', borderTopWidth: 0.3, backgroundColor: '#fff', paddingTop: 5, justifyContent: 'center' }}>
                                        <Col style={{ width: '100%', }}>
                                            <Text style={{ fontSize: 10, textAlign: 'center', fontWeight: 'bold' }}> Chat</Text>
                                            <Text style={{ fontSize: 10, marginTop: 5, textAlign: 'center', }}> Chat with Top doctor</Text>
                                        </Col>

                                    </Row>
                                </Card>
                            </TouchableOpacity>
                        </Col>
                        <Col style={{ width: '33.33%', }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Medicines")}>
                                <Card style={{ borderRadius: 10, overflow: 'hidden' }}>
                                    <Row style={{ height: 100, width: '100%', overflow: 'hidden', backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={pharmacyImg}
                                            style={{
                                                width: '100%', height: '100%', alignItems: 'center'
                                            }}
                                        />
                                    </Row>
                                    <Row style={{ padding: 10, height: 65, width: '100%', borderTopColor: '#000', borderTopWidth: 0.3, backgroundColor: '#fff', paddingTop: 5, justifyContent: 'center' }}>
                                        <Col style={{ width: '100%', }}>
                                            <Text style={{ fontSize: 10, textAlign: 'center', fontWeight: 'bold' }}> Pharmacy</Text>
                                            <Text style={{ fontSize: 10, marginTop: 5, textAlign: 'center', }}> Medicine and Health</Text>
                                        </Col>

                                    </Row>
                                </Card>
                            </TouchableOpacity>
                        </Col>
                    </Grid>
                    <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 20 }}>
                        <Row style={{ marginTop: 5, marginBottom: 5 }}>
                            <Left>
                                <Text style={styles.mainHead}>Categories</Text>
                            </Left>
                            <Right>
                                <TouchableOpacity onPress={() => this.navigetToCategories()} style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 5, paddingTop: 5, borderRadius: 5, color: '#fff', flexDirection: 'row' }}>
                                    <Text style={{ color: '#775DA3', fontSize: 13, textAlign: 'center', fontWeight: 'bold' }}>View All</Text>
                                </TouchableOpacity>
                            </Right>
                        </Row>

                        <View>
                            <Row >
                                <FlatList
                                    numColumns={3}
                                    data={this.state.catagary}
                                    extraData={this.state.categryCount}
                                    renderItem={({ item, index }) =>
                                        <Col style={styles.maincol}>

                                            <TouchableOpacity onPress={() => this.navigateToCategorySearch(item.category_name)}
                                                style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: 5, paddingBottom: 5, }}>

                                                <Row style={{ height: 45, width: '100%', justifyContent: 'center', alignItems: 'center', }} >
                                                    <Image
                                                        source={{ uri: item.base64ImageData /*item.imageBaseURL + item.category_id + '.png' */ }}
                                                        style={{
                                                            width: 50, height: 50, alignItems: 'center'
                                                        }}
                                                    />
                                                </Row>
                                                <Row style={{ height: 40, width: '100%', justifyContent: 'center', alignItems: 'center', }} >
                                                    <Text style={{ fontSize: 10, textAlign: 'center', fontWeight: '200', marginTop: 5, paddingLeft: 5, paddingRight: 5, paddingTop: 1, paddingBottom: 1 }}>{item.category_name}</Text>
                                                </Row>
                                            </TouchableOpacity>

                                        </Col>
                                    }
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </Row>
                        </View>

                        <Row style={{ marginTop: 10, marginBottom: 5 }}>
                            <Left>
                                <Text style={styles.mainHead}>Refer and Earn!</Text>
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
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderColor: 'gray',
        borderRadius: 5,
        flexDirection: 'row',
        borderWidth: 0.1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        padding: 1,
        marginLeft: 5,
        marginRight: 8,
        marginTop: 8,
        width: '30%',
        flexDirection: 'row',
    }
});