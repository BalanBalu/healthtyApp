import React, { Component } from 'react';
import { Container, Content, Text, Button, Toast, View, Footer, Icon } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import { fetchUserProfile } from '../../providers/profile/profile.action';
import { userFiledsUpdate } from '../../providers/auth/auth.actions';
import { Loader } from '../../../components/ContentLoader';
import { SERVICE_TYPES } from '../../../setup/config'
import { hasLoggedIn } from '../../providers/auth/auth.actions';
import ConfirmPopup from '../../../components/Shared/ConfirmPopup';
import {primaryColor, secondaryColor, secondaryColorTouch} from '../../../setup/config';

import RenderUserAddressList from './RenderUserAddressList';
const USER_FIELDS = "first_name,last_name,mobile_no,email,address,delivery_address,home_healthcare_address"

export default class HomeHealthCareAddressChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileNo: '',
            fullName: '',
            selectedAddressData: null,
            isLoading: true,
            selectedAddressIndex: -1,
            addressList: [],
            isVisibleDeletePop: false,
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
                if (userAddress) {
                    userAddress.active = true;
                    userAddress.address_type = 'DEFAULT';
                    homeHealthCareAddress.unshift(userAddress);

                }
                const addressList = homeHealthCareAddress.filter(ele => ele.active === true);
                this.setState({ fullName, mobileNo, addressList })
            }
        } catch (Ex) {
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

    removeSelectedUserAddress = async () => {
        try {
            this.setState({ isLoading: true });
            const { selectedDeletedAddressData, addressList, selectedAddressData, selectedAddressIndex } = this.state;
            selectedDeletedAddressData.active = false;
            const reqAddressData = { home_healthcare_address: selectedDeletedAddressData }
            const userId = await AsyncStorage.getItem('userId');
            const updateResp = await userFiledsUpdate(userId, reqAddressData);
            if (updateResp.success) {
                const findIndex = addressList.findIndex(ele => String(ele._id) === String(selectedDeletedAddressData._id))
                addressList.splice(findIndex, 1);
                if (selectedAddressData && selectedAddressData.length) {  // when user select the any address then delete that respected Item then it is not stored in state.
                    const findSelectedAddressIndex = selectedAddressData.findIndex(ele => String(ele._id) === String(selectedDeletedAddressData._id))
                    if (findSelectedAddressIndex >= 0) {
                        selectedAddressData.splice(findSelectedAddressIndex, 1);
                    }
                }
                this.setState({ addressList, selectedAddressData, selectedAddressIndex: -1, isLoading: false });
            }
            else {
                Toast.show({
                    text: updateResp.message,
                    type: 'danger',
                    duration: 3000,
                })
            }
        } catch (Ex) {
            console.log('Exception Occurred on Delete User Address' + Ex.message),
                Toast.show({
                    text: 'Exception Occurred on ' + Ex.message,
                    type: 'danger',
                    duration: 5000
                })
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    /* Renders the User Active Address list  */
    renderUserAddressList(item, index) {
        return (
            <View>
                <RenderUserAddressList
                    item={item}
                    extraData={{ index, selectedAddressIndex: this.state.selectedAddressIndex, navigation: this.props.navigation, mobileNo: this.state.mobileNo, fullName: this.state.fullName }}
                    onPressEnabledDeleteAddressItemPop={(selectedDeletedAddressData, selectedDeletedIndex) => this.setState({ isVisibleDeletePop: true, selectedDeletedAddressData, selectedDeletedIndex })}
                    onPressRadioBtnToSelectAddressItem={(selectedAddressData, selectedAddressIndex) => this.setState({ selectedAddressData, selectedAddressIndex })}
                >
                </RenderUserAddressList>
            </View>
        )
    }
    render() {
        const { addressList, selectedAddressIndex, isVisibleDeletePop, isLoading } = this.state
        if (isLoading) return <Loader style='list' />;
        return (
            <Container style={{ flex: 1 }}>
                <Content style={{ backgroundColor: '#F5F5F5', padding: 10, flex: 1 }}>
                    <NavigationEvents
                        onWillFocus={payload => { this.backNavigation(payload) }}
                    />
                    <View style={{ marginTop: 10, marginBottom: 10 }} >
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: primaryColor, alignSelf: 'center',fontWeight:'700' }}>MY ADDRESS</Text>
                    </View>
                    <View>
                        <FlatList
                            data={addressList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => this.renderUserAddressList(item, index)}
                        />
                    </View>
                    <Row style={{alignItems:'center',justifyContent:'center',marginTop:10}}>
                    <TouchableOpacity transparent onPress={() => this.onPressGoToLocPage()} style={{marginBottom:25,alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:10}}>
                        <Icon name='add' style={{ color: primaryColor,fontSize:35,}} />
                        <Text uppercase={false} style={styles.customText}>ADD NEW ADDRESS</Text>
                    </TouchableOpacity>
                    </Row>
                   
                </Content>
                <ConfirmPopup
                    warningMessageText={'Are you sure you want to delete this Address !'}
                    confirmButtonText={'Confirm'}
                    confirmButtonStyle={styles.confirmButton}
                    cancelButtonStyle={styles.cancelButton}
                    cancelButtonText={'Cancel'}
                    confirmButtonAction={() => {
                        this.removeSelectedUserAddress();
                        this.setState({ isVisibleDeletePop: false })
                    }}
                    cancelButtonAction={() => this.setState({ isVisibleDeletePop: !isVisibleDeletePop })}
                    visible={isVisibleDeletePop} />
                <Footer style={{ backgroundColor: primaryColor, }}>
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
        fontSize: 15,
        color: primaryColor
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



