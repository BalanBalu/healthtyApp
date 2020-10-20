import React, { Component } from 'react';
import { Container, Content, Text, Button, Toast, Item, List, ListItem, Card, Input, Left, Segment, CheckBox, View, Radio, Footer, FooterTab, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TouchableOpacity, Platform, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import { fetchUserProfile } from '../../../providers/profile/profile.action';
import { dateDiff, formatDate, subTimeUnit } from '../../../../setup/helpers';
import { getAddress } from '../../../common'
import { hasLoggedIn } from '../../../providers/auth/auth.actions';
import { insertAppointment, updateLapAppointment, validateAppointment } from '../../../providers/lab/lab.action';
import { getUserGenderAndAge } from '../../CommonAll/functions'
import { SERVICE_TYPES } from '../../../../setup/config'
import BookAppointmentPaymentUpdate from '../../../providers/bookappointment/bookAppointment';
import DateTimePicker from "react-native-modal-datetime-picker";
import LabHeader from './Header';
import moment from 'moment';
import { PayBySelection, POSSIBLE_PAY_METHODS } from '../../PaymentReview/PayBySelection';
import { POSSIBLE_FAMILY_MEMBERS, TestDetails } from '../../PaymentReview/testDeatils';
import PatientAddress from '../../../elements/PaymentReviewScreen/PatientAddress';


let patientDetails = [], totalAmount = 0;
class LabConfirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            patientDetails: [],
            patientAddress: [],
            defaultPatientDetails: {},
            mobile_no: '',
            itemSelected: 'TEST_AT_LAP',
            packageDetails: props.navigation.getParam('packageDetails') || {},
            selectedAddress: null,
            buttonEnable: false,
            isTimePickerVisible: false,
            pickByStartTime: moment().startOf('day').toDate(),
            startTime: moment().startOf('day').toDate(),
            isDateTimePickerVisible: false,
            startDatePlaceholder: false,
            isCorporateUser: false,
            selectedPayBy: POSSIBLE_PAY_METHODS.SELF,
            familyMembersSelections: [],
            selectedPatientTypes: [POSSIBLE_FAMILY_MEMBERS.SELF],
        };

    }
    async componentDidMount() {
        const { navigation } = this.props;
        const isLoggedIn = await hasLoggedIn(this.props);
        if (!isLoggedIn) {
            navigation.navigate('login');
            return
        }
        const isCorporateUser = await AsyncStorage.getItem('is_corporate_user') === 'true';
        this.setState({ isCorporateUser });
        console.log('packageDetails', this.state.packageDetails);
        await this.getUserProfile();
    }

    backNavigation(navigationData) {
        if (navigationData.action) {
            if (navigationData.action.type === 'Navigation/NAVIGATE') {
                this.getUserProfile()
            }
        }
    }


    getUserProfile = async () => {
        try {
            this.setState({ isLoading: true });

            let fields = "first_name,last_name,gender,dob,mobile_no,address,delivery_address"
            let userId = await AsyncStorage.getItem('userId');
            let result = await fetchUserProfile(userId, fields);
            let patientAddress = [];

            this.defaultPatientDetails = {
                type: 'self',
                full_name: result.first_name + " " + result.last_name,
                gender: result.gender,
                age: parseInt(dateDiff(result.dob, new Date(), 'years'))
            }

            if (result.delivery_address) {
                patientAddress = result.delivery_address
            }
            if (result.address.address) {
                let userAddressData = {
                    mobile_no: result.mobile_no,
                    coordinates: result.address.coordinates,
                    type: result.address.type,
                    address: result.address.address
                }
                patientAddress.unshift(userAddressData);
            }
            await this.setState({ patientAddress, data: result })

        }
        catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    editProfile(screen, addressType) {
        addressType = { addressType: addressType, mobile_no: this.state.mobile_no, full_name: this.state.full_name }
        this.props.navigation.navigate(screen, { screen: screen, navigationOption: 'labConfirmation', addressType: addressType })
    }

    addPatientData = async (patDetails) => {
        const patientDetails = patDetails.map(ele => {
            const othersDetailsObj = {
                ...ele,
                type: ele.type,
                full_name: ele.name || ele.full_name,
                age: parseInt(ele.age),
                gender: ele.gender
            }
            return othersDetailsObj
        })
        await this.setState({ patientDetails, updateButton: false, errMsg: '' });
    }
    amountPaid() {
        const { packageDetails, patientDetails, itemSelected } = this.state;

        if (packageDetails.fee != undefined) {
            if (itemSelected == 'TEST_AT_HOME') {
                totalAmount = ((packageDetails.fee * patientDetails.length) + (packageDetails.extra_charges))
                return totalAmount
            }
            else {
                totalAmount = (packageDetails.fee * patientDetails.length)
                return totalAmount
            }
        }
        return totalAmount;
    }

    validateAppointment = async (paymentMode) => {
        const { packageDetails: { selectedSlotItem: { slotDate, availabilityId, slotEndDateAndTime, slotStartDateAndTime } }, startDatePlaceholder, pickByStartTime } = this.state

        try {
            const userId = await AsyncStorage.getItem('userId')
            if (!startDatePlaceholder) {
                Toast.show({
                    text: 'Kindly select your appointment time',
                    type: 'warning',
                    duration: 3000
                })
                return false;
            } else {
                let startTimeByFormate = formatDate(pickByStartTime, 'HH:mm:ss')
                let startTime = moment(slotDate + 'T' + startTimeByFormate)
                this.setState({ startTime })
            }
            let filters = {
                startDate: subTimeUnit(slotStartDateAndTime, 1, "second").toISOString(),
                endDate: subTimeUnit(slotEndDateAndTime, 1, "second").toISOString(),
            }

            let response = await validateAppointment(userId, availabilityId, filters);

            if (response.success == false) {
                this.timeText = formatDate(response.data[0].appointment_starttime, 'hh:mm A')
                Alert.alert(
                    "Appointment Warning",
                    `You already booked for the same Lab on ${this.timeText}, You want to book the appointment to continue`,
                    [
                        { text: "Cancel" },
                        {
                            text: "Continue", onPress: () => this.proceedToLabTestAppointment(paymentMode),
                        }
                    ],
                );
                return
            } else {
                this.proceedToLabTestAppointment(paymentMode);
            }

        } catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    proceedToLabTestAppointment = async (paymentMode) => {
        let { patientDetails, packageDetails, selectedAddress, itemSelected, errMsg, startTime } = this.state
        try {
            if (patientDetails.length == 0) {
                Toast.show({
                    text: 'Kindly select or add patient details',
                    type: 'warning',
                    duration: 3000
                })
                return false;
            }
            if (errMsg) {
                Toast.show({
                    text: 'Kindly fill other patient details',
                    type: "warning",
                    duration: 3000
                });
                return false;
            }
            if (itemSelected === 'TEST_AT_HOME' && selectedAddress == null) {
                Toast.show({
                    text: 'Kindly chosse Address',
                    type: 'warning',
                    duration: 3000
                })
                return false;
            } else {
                selectedAddress = packageDetails.location;
            }
            let patientData = [];
            this.state.patientDetails.map(ele => {
                patientData.push({ patient_name: ele.full_name, patient_age: ele.age, gender: ele.gender })
            })
            this.setState({ isLoading: true, buttonEnable: true });
            const userId = await AsyncStorage.getItem('userId')

            let requestData = {
                user_id: userId,
                availability_id: packageDetails.availability_id || packageDetails.selectedSlotItem.availabilityId || ' ',
                patient_data: patientData,
                lab_id: packageDetails.lab_id,
                lab_name: packageDetails.lab_name,
                lab_test_categories_id: packageDetails.lab_test_categories_id,
                lab_test_description: packageDetails.lab_test_description,
                fee: totalAmount,
                startTime: startTime || packageDetails.appointment_starttime,
                location: {
                    coordinates: selectedAddress.coordinates,
                    type: selectedAddress.type,
                    address: {
                        no_and_street: selectedAddress.address.no_and_street || ' ',
                        address_line_1: selectedAddress.address.address_line_1,
                        district: selectedAddress.address.district,
                        city: selectedAddress.address.city,
                        state: selectedAddress.address.state,
                        country: selectedAddress.address.country,
                        pin_code: selectedAddress.address.pin_code
                    }
                },
                status: paymentMode === 'cash' ? "PENDING" : 'PAYMENT_IN_PROGRESS',
                status_by: "USER",
                booked_from: "Mobile",
            };
            if (packageDetails.appointment_status == 'PAYMENT_FAILED' || packageDetails.appointment_status == 'PAYMENT_IN_PROGRESS') {
                requestData.labTestAppointmentId = packageDetails.appointment_id;
            }
            if (paymentMode === 'cash') {
                this.BookAppointmentPaymentUpdate = new BookAppointmentPaymentUpdate();
                let response = await this.BookAppointmentPaymentUpdate.updatePaymentDetails(true, {}, 'cash', requestData, SERVICE_TYPES.LAB_TEST, userId, 'cash');
                if (response.success) {
                    this.props.navigation.navigate('SuccessChat', { manualNaviagationPage: 'Home' });
                    Toast.show({
                        text: 'Appointment has Succcessfully Requested',
                        type: "success",
                        duration: 3000
                    });
                }
                else {
                    Toast.show({
                        text: response.message,
                        type: "danger",
                        duration: 3000
                    });
                    this.setState({ isLoading: false, buttonEnable: false });
                }

            } else {
                let response = {};
                if (packageDetails.appointment_status == 'PAYMENT_FAILED' || packageDetails.appointment_status == 'PAYMENT_IN_PROGRESS') {
                    let updateData = {
                        labId: requestData.lab_id,
                        availability_id: requestData.availability_id,
                        userId: userId,
                        startTime: requestData.startTime,
                        endTime: requestData.endtime,
                        status: requestData.status,
                        statusUpdateReason: "NEW_BOOKING",
                        status_by: requestData.status_by
                    }
                    response = await updateLapAppointment(packageDetails.appointment_id, updateData);
                    if (response.success === true) {
                        requestData.labTestAppointmentId = response.appointmentId;
                        this.props.navigation.navigate('paymentPage', {
                            service_type: SERVICE_TYPES.LAB_TEST,
                            bookSlotDetails: requestData,
                            amount: totalAmount
                        });
                    } else {
                        Toast.show({
                            text: response.message,
                            duration: 3000,
                        })
                    }

                } else {
                    response = await insertAppointment(requestData);
                    if (response.success === true) {
                        requestData.labTestAppointmentId = response.appointmentId;
                        this.props.navigation.navigate('paymentPage', {
                            service_type: SERVICE_TYPES.LAB_TEST,
                            bookSlotDetails: requestData,
                            amount: packageDetails.fee
                        });
                    } else {
                        Toast.show({
                            text: response.message,
                            duration: 3000,
                        })
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
            Toast.show({
                text: 'Exception While Creating the Appointment' + e,
                type: "danger",
                duration: 3000
            });
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    handleDatePicked = date => {
        const { packageDetails: { selectedSlotItem: { slotEndDateAndTime, slotStartDateAndTime } } } = this.state;
        const currentDate = new Date();
        let startDate = new Date(slotStartDateAndTime);//setDateTime(slotStartDateAndTime, date);
        const endDate = new Date(slotEndDateAndTime);// setDateTime(slotEndDateAndTime, date);
        date = setDateTime(slotStartDateAndTime, date)
        startDate =  currentDate > startDate ? currentDate : startDate;
        const valid = startDate <= date && endDate >= date;
        if (date <= currentDate) {
            Toast.show({
                text: 'Your selected time is not valid, Please try again',
                duration: 2000,
                type: 'danger'
            });
            this.setState({ isTimePickerVisible: false });
            return;

        }
        if (valid === false) {
            Toast.show({
                text: 'Please choose the time between ' + getTimeWithMeredian(startDate) + ' and ' + getTimeWithMeredian(endDate),
                duration: 2000,
                type: 'danger'
            });
            this.setState({ isTimePickerVisible: false });
            return;

        } else {
            this.setState({ isTimePickerVisible: false, pickByStartTime: date, startDatePlaceholder: true });
        }

        function setDateTime(dateStr, customTime) {
            const date = new Date(dateStr);
            date.setHours(customTime.getHours())
            date.setMinutes(customTime.getMinutes());
            date.setSeconds(1)
            return date;
        }
        function getTimeWithMeredian(dateTime) {
            var currentDate = new Date(dateTime);
            var hour = currentDate.getHours();
            var meridiem = hour >= 12 ? "PM" : "AM";
            const currentTime = addZeroIfNeeded((hour + 11) % 12 + 1) + ":" + addZeroIfNeeded(currentDate.getMinutes()) + ' ' + meridiem;
            function addZeroIfNeeded(time) {
                return time <= 9 ? '0' + time : time;
            }
            return currentTime;
        }
    }
    render() {
        const { patientDetails, itemSelected, packageDetails, patientAddress, buttonEnable, isCorporateUser } = this.state;

        return (
            <Container>
                <NavigationEvents
                    onWillFocus={payload => { this.backNavigation(payload); }}
                />
                <Content style={{ backgroundColor: '#F5F5F5', padding: 10 }}>
                    <LabHeader packageDetails={packageDetails}
                        onDatePickerPressed={() => this.setState({ isTimePickerVisible: !this.state.isTimePickerVisible })}
                        hideStartDatePlaceholder={this.state.startDatePlaceholder}
                        minimumDate={this.state.packageDetails && this.state.packageDetails.selectedSlotItem && new Date(this.state.packageDetails.selectedSlotItem.slotStartDateAndTime)}
                        maximumDate={this.state.packageDetails && this.state.packageDetails.selectedSlotItem && new Date(this.state.packageDetails.selectedSlotItem.slotEndDateAndTime)}
                        dateTime={this.state.pickByStartTime}
                        isVisible={this.state.isTimePickerVisible}
                        onTimeConfirm={this.handleDatePicked}
                        onTimePickerCancel={() => this.setState({ isTimePickerVisible: !this.state.isTimePickerVisible })}
                    />

                    <PayBySelection
                        isCorporateUser={isCorporateUser}
                        selectedPayBy={this.state.selectedPayBy}
                        onSelectionChange={(mode) => {
                            this.addPatientData(this.selfPatientData);
                            this.setState({ selectedPayBy: mode, selectedPatientTypes: [POSSIBLE_FAMILY_MEMBERS.SELF], familyMembersSelections: [] });
                        }} />


                    <TestDetails
                        isCorporateUser={isCorporateUser}
                        navigation={this.props.navigation}
                        singlePatientSelect={false}
                        familyMembersSelections={this.state.familyMembersSelections}
                        selectedPatientTypes={this.state.selectedPatientTypes}
                        familyDetailsData={this.state.patientDetails}
                        payBy={this.state.selectedPayBy}
                        changeFamilyMembersSelections={(familyMemberSelections) => this.setState({ familyMembersSelections: familyMemberSelections })}
                        onSelectionChange={(patientTypes) => {
                            this.setState({ selectedPatientTypes: patientTypes })
                        }}
                        addPatientDetails={(data, setSelfPatientData) => {
                            if (setSelfPatientData === true) {
                                this.selfPatientData = data
                            }
                            this.addPatientData(data);
                        }} />

                    <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                        <Row size={12}>

                            <Col size={5} style={{ flexDirection: 'row' }}>
                                <Radio
                                    standardStyle={true}
                                    selected={itemSelected === 'TEST_AT_LAP' ? true : false}
                                    onPress={() => this.setState({ itemSelected: 'TEST_AT_LAP' })} />

                                <Text style={{ fontFamily: 'OpenSans', fontSize: 14, fontWeight: '500', paddingTop: 2, paddingLeft: 5 }}>Test at Lab</Text>

                            </Col>

                            <Col size={5} style={{ flexDirection: 'row' }}>
                                <Radio
                                    standardStyle={true}
                                    selected={itemSelected === 'TEST_AT_HOME' ? true : false}
                                    onPress={() => this.setState({ itemSelected: 'TEST_AT_HOME' })} />
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 14, fontWeight: '500', paddingTop: 2, paddingLeft: 5 }}>Test at home </Text>
                            </Col>

                            <Col size={2} />




                        </Row>
                    </View>
                    {itemSelected === 'TEST_AT_HOME' ?
                        <PatientAddress
                            patientAddress={patientAddress}
                            onPressAddNewAddress={() => this.editProfile('MapBox', 'lab_delivery_Address')}
                            selectedAddress={this.state.selectedAddress}
                            onChangeAddress={(item) => this.setState({ selectedAddress: item })}
                        />
                        : null}

                    {itemSelected === 'TEST_AT_LAP' ?
                        <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                            <Row>
                                <Col size={5}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Lab Address</Text>
                                </Col>
                                <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                </Col>
                            </Row>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '300', marginTop: 5 }}>{packageDetails.lab_name}</Text>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2, color: '#6a6a6a' }}>{getAddress(packageDetails.location)}</Text>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2 }}>{'Mobile -' + (packageDetails.mobile_no || 'Nil')}</Text>
                        </View> :
                        null}

                    <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Package Details</Text>
                        <Row style={{ marginTop: 10 }}>
                            <Col size={8}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#6a6a6a' }}>{packageDetails.category_name}
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#8dc63f' }}>{'(' + (patientDetails.length) + " person)"}</Text>
                                </Text>

                            </Col>
                            <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>₹ {packageDetails.fee ? (packageDetails.fee * patientDetails.length) : 0}</Text>


                            </Col>
                        </Row>

                        {itemSelected === 'TEST_AT_HOME' ?
                            <Row style={{ marginTop: 5 }}>
                                <Col size={8}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#6a6a6a' }}>Charges for Home Test</Text>
                                </Col>
                                <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#ff4e42', textAlign: 'right' }}>₹{packageDetails.extra_charges ? packageDetails.extra_charges : 0}</Text>
                                </Col>
                            </Row>
                            : null}
                        <Row style={{ marginTop: 10 }}>
                            <Col size={8}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '500' }}>Amount to be Paid</Text>
                            </Col>
                            <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>₹{this.amountPaid()}</Text>

                            </Col>
                        </Row>
                    </View>

                </Content>
                <Footer style={
                    Platform.OS === "ios" ?
                        { height: 30 } : { height: 45 }}>
                    <FooterTab>
                        <Row>
                            {this.state.selectedPayBy === POSSIBLE_PAY_METHODS.SELF ?
                                <>
                                    <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                                        <TouchableOpacity disabled={buttonEnable} onPress={() => packageDetails.appointment_status == undefined ?
                                            this.validateAppointment('cash') : this.proceedToLabTestAppointment('cash')}>
                                            <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#000', fontWeight: '400' }}>{itemSelected == 'TEST_AT_HOME' ? 'Cash On Home' : 'Cash on Lab'} </Text>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#8dc63f' }}>
                                        <TouchableOpacity disabled={buttonEnable} onPress={() => packageDetails.appointment_status == undefined ?
                                            this.validateAppointment('online') : this.proceedToLabTestAppointment('online')}>
                                            <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#fff', fontWeight: '400' }}>Proceed</Text>
                                        </TouchableOpacity>
                                    </Col>
                                </> :
                                <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#8dc63f' }}>
                                    <TouchableOpacity disabled={buttonEnable} onPress={() => packageDetails.appointment_status == undefined ?
                                        this.validateAppointment('cash') : this.proceedToLabTestAppointment('cash')}>
                                        <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#fff', fontWeight: '400' }}>{'Book Appointment'} </Text>
                                    </TouchableOpacity>
                                </Col>
                            }
                        </Row>
                    </FooterTab>
                </Footer>
            </Container >
        );
    }
}

export default LabConfirmation;

const styles = StyleSheet.create({

    container:
    {
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
    timeText: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        marginTop: 3,
        fontWeight: 'bold'
    },
    TouchStyle1: {
        borderRadius: 5,
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    timeDetail: {
        fontFamily: 'OpenSans',
        fontSize: 13,
        marginLeft: 5
    },
    iconstyle1: {
        marginTop: 5,
        fontSize: 20,
        color: '#13C100'
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
    normalText:
    {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
    },
    startenddatetext: {
        marginTop: 5,
        marginBottom: 5,
        fontFamily: 'OpenSans',
        fontSize: 13,
        textAlign: 'center',
        marginLeft: 5
    },

    labelTop:
    {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#000',


    },
    customText:
    {
        marginLeft: 10,
        fontFamily: 'OpenSans',
        fontSize: 13,
        marginTop: 3,
        color: 'gray'
    },
    customSubText:
    {
        marginLeft: 2,
        fontFamily: 'OpenSans',
        fontSize: 13,
        marginTop: 3,
        color: 'gray'
    },
    transparentLabel:
    {

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

    addressLabel:
    {

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
    touchStyle: {
        backgroundColor: '#7F49C3',
        borderRadius: 1,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 5,
        paddingTop: 5
    },
    touchText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#fff',
        textAlign: 'center'
    },
});