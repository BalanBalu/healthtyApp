import React, { Component } from 'react';
import { Container, Content, Text, Button, Toast, Item, List, ListItem, Card, Input, Left, Segment, CheckBox, View, Radio, Footer, FooterTab, Icon, Right } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TouchableOpacity, Platform, Modal } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import ImagePicker from 'react-native-image-crop-picker';
import { fetchUserProfile, getCurrentVersion } from '../../providers/profile/profile.action';
import { userFiledsUpdate, logout } from '../../providers/auth/auth.actions';
import Spinner from '../../../components/Spinner';
import { Loader } from '../../../components/ContentLoader';
import { SERVICE_TYPES } from '../../../setup/config'
import { getHomeHealthCareUserAddress } from '../../common';
import { hasLoggedIn } from '../../providers/auth/auth.actions';
import AwesomeAlert from 'react-native-awesome-alerts';
import { connect } from 'react-redux';
const USER_FIELDS = "first_name,last_name,mobile_no,email,address,delivery_address,home_healthcare_address"

class HomeHealthCareAddressChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            medicineDetails: [],
            deliveryAddressArray: [],
            email: '',
            mobileNo: '',
            fullName: '',
            selectedAddressData: null,
            isLoading: true,
            itemSelected: 0,
            deliveryDetails: null,
            medicineTotalAmount: 0,
            pickupOPtionEnabled: true,
            pharmacyInfo: null,
            isPrescription: false,
            prescriptionDetails: null,
            isH1Product: false,
            h1ProductData: [],

            selectedAddressIndex: -1,
            addressList: []
        };
    }

    async componentDidMount() {
        try {
            const { navigation } = this.props;
            const isLoggedIn = await hasLoggedIn(this.props);
            if (!isLoggedIn) {
                navigation.navigate('login');
                return
            }
            await this.getUserInfo();
        } catch (error) {
            console.error(error)
        }
    }
    getUserInfo = async () => {
        try {
            this.setState({ isLoading: true })
            const userId = await AsyncStorage.getItem('userId');
            const userInfoResp = await fetchUserProfile(userId, USER_FIELDS);
            if (userInfoResp && Object.keys(userInfoResp).length) {
                const fullName = userInfoResp.first_name + " " + userInfoResp.last_name;
                const mobileNo = userInfoResp.mobile_no;
                const userAddress = userInfoResp.address && userInfoResp.address;
                const homeHealthCareAddress = userInfoResp.home_healthcare_address && userInfoResp.home_healthcare_address.length ? userInfoResp.home_healthcare_address : [];
                homeHealthCareAddress.unshift(userAddress);
                this.setState({ fullName, mobileNo, addressList: homeHealthCareAddress })
            }
        } catch (Ex) {
            console.log('Ex is getting on Fetch User Information in Home Health Address list page===>', Ex.message)
            return {
                success: false,
                statusCode: 500,
                error: Ex,
                message: `Exception while getting on Fetch User Information in Home Health Address list page  : ${Ex.message}`
            }
        }
        finally {
            this.setState({ isLoading: false })
        }
    }
    onPressGoToCategoriesPage = () => {
        this.props.navigation.setParams({ 'hasReloadAddress': false });
        const userAddressInfo = this.state.selectedAddressData;
        delete userAddressInfo._id;
        this.props.navigation.navigate("Categories", { fromNavigation: SERVICE_TYPES.HOME_HEALTHCARE, userAddressInfo })
    }
    onPressGoToLocPage = () => {
        this.props.navigation.setParams({ 'hasReloadAddress': false });
        const screen = 'MapBox';
        const addressType = { addressType: SERVICE_TYPES.HOME_HEALTHCARE }
        this.props.navigation.navigate(screen, { screen, navigationOption: 'Home Healthcare Address List', addressType })
    }
    async backNavigation() {
        const { navigation } = this.props;
        const updatedNewAddress = navigation.state.params && navigation.state.params.userAddressInfo && navigation.state.params.userAddressInfo.home_healthcare_address;
        const hasReloadAddress = navigation.state.params && navigation.state.params.hasReloadAddress;
        if (hasReloadAddress && updatedNewAddress) {
            await this.getUserInfo();
        };
    }
    render() {
        const { addressList, selectedAddressIndex, selectedAddressData, isLoading } = this.state
        if (isLoading) return <Loader style='list' />;
        return (
            <Container style={{ flex: 1 }}>
                <Content style={{ backgroundColor: '#F5F5F5', padding: 10, flex: 1 }}>
                    <NavigationEvents
                        onWillFocus={payload => { this.backNavigation(payload) }}
                    />
                    <View style={{ marginTop: 10, marginBottom: 10 }} >
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3', alignSelf: 'center' }}>MY ADDRESS</Text>
                    </View>
                    <View>
                        <FlatList
                            data={addressList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) =>
                                <View style={{ backgroundColor: '#fff' }}>
                                    <Row style={{ borderBottomWidth: 0.3, paddingBottom: 10, marginTop: 5, marginLeft: 5, justifyContent: 'center', borderBottomColor: 'gray' }}>
                                        <Col size={1} style={{ justifyContent: 'center' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={selectedAddressIndex === index}
                                                onPress={() => this.setState({ selectedAddressIndex: index, selectedAddressData: item })} />
                                        </Col>
                                        <Col size={9} style={{ justifyContent: 'center' }}>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 13, fontWeight: '400', marginTop: 2, }}>{this.state.fullName || null}</Text>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 13, marginTop: 2, color: '#4c4c4c' }}>{getHomeHealthCareUserAddress(item.address)}</Text>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 13, marginTop: 2 }}>{'Mobile -' + (this.state.mobileNo || 'No Number')}</Text>
                                        </Col>
                                    </Row>
                                </View>
                            } />
                    </View>
                    <Button transparent onPress={() => this.onPressGoToLocPage()}>
                        <Icon name='add' style={{ color: 'gray' }} />
                        <Text uppercase={false} style={styles.customText}>ADD NEW ADDRESS</Text>
                    </Button>
                </Content>

                <Footer style={{ backgroundColor: '#7E49C3', }}>
                    <Row>
                        <Col style={{ marginRight: 40 }} >
                            <Button success style={{ borderRadius: 10, marginTop: 10, marginLeft: 45, height: 40, justifyContent: 'center' }}
                                onPress={() => selectedAddressIndex !== -1 ? this.onPressGoToCategoriesPage() : null}
                                testID='clickButtonToPaymentReviewPage'>
                                <Row style={{ justifyContent: 'center', }}>
                                    <Text style={{ marginLeft: -25, marginTop: 2, fontWeight: 'bold', justifyContent: 'center', alignItems: 'center' }}>{selectedAddressIndex !== -1 ? 'NEXT' : 'SELECT ADDRESS'}</Text>
                                </Row>
                            </Button>
                        </Col>
                    </Row>
                </Footer>
            </Container >
        )
    }

}

const bookAppointmentDataState = ({ bookAppointmentData } = state) => ({ bookAppointmentData })
export default connect(bookAppointmentDataState)(HomeHealthCareAddressChange)

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#ffffff',
    },
    bodyContent: {
        padding: 0
    },
    customImage: {
        height: 50,
        width: 90,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    curvedGrid: {
        width: 250,
        height: 250,
        borderRadius: 125,
        marginTop: -135,
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#745DA6',
        transform: [
            { scaleX: 2 }
        ],
        position: 'relative',
        overflow: 'hidden',
    },
    loginButton: {
        marginTop: 12,
        backgroundColor: '#775DA3',
        borderRadius: 5,
    },
    normalText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
    },
    labelTop:
    {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#000',
    },
    customText: {
        marginLeft: 10,
        fontFamily: 'OpenSans',
        fontSize: 13,
        marginTop: 2,
        color: 'gray'
    },
    customSubText: {
        marginLeft: 2,
        fontFamily: 'OpenSans',
        fontSize: 13,
        marginTop: 3,
        color: 'gray'
    },
    transparentLabel: {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'OpenSans',
        margin: 2,
        fontSize: 13
    },
    addressLabel: {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'OpenSans',
        margin: 2,
        fontSize: 13
    },
    buttonTouch: {
        flexDirection: 'row',
        borderRadius: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },

});



