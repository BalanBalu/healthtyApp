import React, { Component } from 'react';
import { Container, Form, Content, Text, Toast, Button, ListItem, CheckBox, Radio, Card, Thumbnail, List, Item, Input, Left, Right, Icon, Footer, FooterTab } from 'native-base';
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage, Platform, FlatList, ImageBackground, Alert, Linking, TextInput } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import styles from '../Styles'
import { hasLoggedIn } from '../../../providers/auth/auth.actions';
import { fetchUserProfile } from '../../../providers/profile/profile.action';
import { formatDate } from '../../../../setup/helpers';
import { renderDoctorImage, getDoctorEducation, getDoctorSpecialist, getUserGenderAndAge } from '../../../common';
import Spinner from '../../../../components/Spinner';
import { SERVICE_TYPES } from '../../../../setup/config';
import BookAppointmentPaymentUpdate from '../../../providers/bookappointment/bookAppointment';
import { PayBySelection, POSSIBLE_PAY_METHODS } from '../../PaymentReview/PayBySelection';
import { POSSIBLE_FAMILY_MEMBERS, TestDetails } from '../../PaymentReview/testDeatils';

class HomeTestConfirmation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bookSlotDetails: {},
            isLoading: false,
            isCheckedOthers: false,
            isCheckedSelf: true,
            gender: 'M',
            full_name: '',
            age: '',
            patDetailsArray: [],
            patDetails: {},
            isCorporateUser: false,
            selectedPayBy: POSSIBLE_PAY_METHODS.SELF,
            familyMembersSelections: [],

            isCheckedFamilyWithPay: false,
            selectedPatientTypes: [POSSIBLE_FAMILY_MEMBERS.SELF],
            familyDetailsData: [],
            enteredDiseaseText: ''
        }

    }

    async componentDidMount() {
        const { navigation } = this.props;
        const isLoggedIn = await hasLoggedIn(this.props);
        if (!isLoggedIn) {
            navigation.navigate('login');
            return
        }
        this.getPatientInfo();
        const bookSlotDetails = navigation.getParam('resultconfirmSlotDetails');
        const isCorporateUser = await AsyncStorage.getItem('is_corporate_user') === 'true';
        await this.setState({ bookSlotDetails: bookSlotDetails, isCorporateUser: isCorporateUser });
    }

    getPatientInfo = async () => {
        try {
            const fields = "first_name,last_name,gender,dob,mobile_no,address,delivery_address,home_healthcare_address"
            const userId = await AsyncStorage.getItem('userId');
            const patInfoResp = await fetchUserProfile(userId, fields);
            this.setState({ patDetails: patInfoResp });
        }
        catch (Ex) {
            console.log('Ex is getting Get Patient Info in Payment preview page', Ex.message);
        }
    }



    addPatientList = async (patDetails) => {
        console.log(' Patient Details Length --> ' + patDetails.length);
        console.log(patDetails);
        const patDetailsArray = patDetails.map(ele => {
            const othersDetailsObj = {
                ...ele,
                type: ele.type,
                full_name: ele.name || ele.full_name,
                age: parseInt(ele.age),
                gender: ele.gender
            }
            return othersDetailsObj
        })
        await this.setState({ patDetailsArray, updateButton: false, errMsg: '' });

    }
    onPressOthersCheckBox = async () => {
        const { isCheckedOthers, patDetailsArray } = this.state;
        if (isCheckedOthers) {
            this.addPatientList()
        }
        if (!isCheckedOthers) {
            var removedOfOthersData = patDetailsArray.filter(ele => ele.type === 'self');
            this.setState({ patDetailsArray: removedOfOthersData, errMsg: '' })
        }
    }

    async onPressConfirmProceedPayment() {
        debugger
        const { selectedPatientTypes, bookSlotDetails, patDetailsArray, enteredDiseaseText } = this.state;
        const findFamilyDetailsInPatDetailsArray = patDetailsArray.find(item => item.type === 'others');
        if (selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY) && !findFamilyDetailsInPatDetailsArray) {
            Toast.show({
                text: 'You have selected family details, kindly add family members to continue',
                type: 'warning',
                duration: 3000
            })
            return false;
        }
        if (!patDetailsArray.length) {
            Toast.show({
                text: 'Kindly select Self or Add other patient details',
                type: 'warning',
                duration: 3000
            })
            return false;
        }
        if (!enteredDiseaseText) {
            Toast.show({
                text: 'Kindly enter your Reason for Checkup ',
                type: 'warning',
                duration: 3000
            })
            return false;
        }
        let patientData = [];
        patDetailsArray.map(ele => {
            patientData.push({ patient_name: ele.full_name, patient_age: ele.age, gender: ele.gender })
        });

        bookSlotDetails.patient_data = patientData;
        const finalAmountBySelectedPersons = bookSlotDetails.slotData && bookSlotDetails.slotData.fee ? (bookSlotDetails.slotData.fee * patDetailsArray.length) : 0;
        const amount = finalAmountBySelectedPersons;
        bookSlotDetails.slotData.fee = finalAmountBySelectedPersons;
        this.props.navigation.navigate('paymentPage', { service_type: SERVICE_TYPES.HOME_HEALTHCARE, bookSlotDetails: bookSlotDetails, amount, patientInfo: this.state.patDetails })
    }
    async onPressPayAtHome() {
        const { selectedPatientTypes, bookSlotDetails, patDetailsArray, enteredDiseaseText } = this.state;
        const findFamilyDetailsInPatDetailsArray = patDetailsArray.find(item => item.type === 'others');
        if (selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY) && !findFamilyDetailsInPatDetailsArray) {
            Toast.show({
                text: 'You have selected family details, kindly add family members to continue',
                type: 'warning',
                duration: 3000
            })
            return false;
        }
        if (!patDetailsArray.length) {
            Toast.show({
                text: 'Kindly select Self or Add other patient details',
                type: 'warning',
                duration: 3000
            })
            return false;
        }
        if (!enteredDiseaseText) {
            Toast.show({
                text: 'Kindly enter your Reason for Checkup ',
                type: 'warning',
                duration: 3000
            })
            return false;
        }
        this.setState({ isLoading: true, spinnerText: "We are Booking your Appoinmtent" })
        let patientData = [];
        patDetailsArray.map(ele => {
            patientData.push({ patient_name: ele.full_name, patient_age: ele.age, gender: ele.gender })
        })
        debugger
        const finalAmountBySelectedPersons = bookSlotDetails.slotData && bookSlotDetails.slotData.fee ? (bookSlotDetails.slotData.fee * patDetailsArray.length) : 0;
        bookSlotDetails.slotData.fee = finalAmountBySelectedPersons;
        bookSlotDetails.patient_data = patientData;
        const userId = await AsyncStorage.getItem('userId');
        this.BookAppointmentPaymentUpdate = new BookAppointmentPaymentUpdate();
        let response = await this.BookAppointmentPaymentUpdate.updatePaymentDetails(true, {}, 'cash', bookSlotDetails, SERVICE_TYPES.HOME_HEALTHCARE, userId, 'cash');
        debugger
        console.log('Book Appointment Payment Update Response ');
        if (response.success) {
            debugger
            this.props.navigation.navigate('paymentsuccess', { successBookSlotDetails: bookSlotDetails, paymentMethod: 'Cash', tokenNo: response.tokenNo, isFromHomeHealthCareConfirmation: true, patientInfo: this.state.patDetails });
        } else {
            Toast.show({
                text: response.message,
                type: 'warning',
                duration: 3000
            })
        }
        debugger

        this.setState({ isLoading: false, spinnerText: ' ' });
    }

    render() {
        const { bookSlotDetails, patDetails, errMsg, isLoading, spinnerText, isCheckedSelf, isCheckedOthers, name, age, gender, patDetailsArray, isCorporateUser, isCheckedFamilyWithPay } = this.state;
        const extraCharges = bookSlotDetails.extraCharges || 0;
        const amountBySelectedPersons = bookSlotDetails.slotData && bookSlotDetails.slotData.fee ? (bookSlotDetails.slotData.fee * patDetailsArray.length) : 0;
        const finalPaidAmount = amountBySelectedPersons + extraCharges;
        return (
            <Container>
                <Content style={{ backgroundColor: '#F5F5F5', padding: 10 }}>
                    <Spinner
                        visible={isLoading}
                        textContent={spinnerText}
                    />
                    <View style={{ paddingBottom: 50 }}>
                        <View style={{ backgroundColor: '#fff', padding: 10 }}>
                            <Row>
                                <Col size={1.6}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderDoctorImage(bookSlotDetails), title: 'Profile photo' })}>
                                        <Image source={renderDoctorImage(bookSlotDetails)} style={{ height: 50, width: 50 }} />
                                    </TouchableOpacity>
                                </Col>
                                <Col size={8.4}>
                                    <Text style={styles.docName}>{(bookSlotDetails.prefix ? bookSlotDetails.prefix + '. ' : '') + (bookSlotDetails.first_name || '') + ' ' + (bookSlotDetails.last_name || '')} {getDoctorEducation(bookSlotDetails.education)}</Text>
                                    <Text style={styles.specialist}>{getDoctorSpecialist(bookSlotDetails.specialist)}</Text>
                                </Col>
                            </Row>
                            {bookSlotDetails.slotData ?
                                <View style={{ marginTop: 10 }}>

                                </View>
                                : null}
                        </View>
                        <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 10 }}>
                            <Row>
                                <Col size={4}>
                                    <Text style={styles.subHead}>Appointment Date</Text>
                                </Col>
                                <Col size={6}>
                                    <Row style={{ justifyContent: 'flex-end', marginTop: 1 }}>
                                        <Icon name="md-calendar" style={{ fontSize: 15, color: '#0054A5' }} />
                                        <Text style={{
                                            marginLeft: 4,
                                            fontFamily: 'OpenSans',
                                            color: '#0054A5',
                                            fontSize: 13,
                                        }}>{bookSlotDetails.slotData && formatDate(bookSlotDetails.slotData.slotDate, 'Do MMMM, YYYY')}</Text>
                                    </Row>
                                </Col>
                            </Row>
                        </View>
                        <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 10 }}>
                            <Row>
                                <Col size={3}>
                                    <Text style={styles.subHead}>Home Address</Text>
                                </Col>
                                <Col size={7}>
                                    {/* <Row style={{ justifyContent: 'flex-end', marginTop: 1 }}>
                                        <TouchableOpacity  >
                                            <Text style={styles.changeText}>Change</Text>
                                        </TouchableOpacity>
                                    </Row> */}
                                </Col>
                            </Row>
                            <Text style={styles.homeAdressTexts}> {patDetails.first_name + '-' + patDetails.last_name}</Text>
                            {
                                patDetails.home_healthcare_address && patDetails.home_healthcare_address.address ?
                                    <Text style={styles.homeAdressTexts}>{patDetails.home_healthcare_address.address.no_and_street + ' , ' +
                                        patDetails.home_healthcare_address.address.address_line_1 + ' , ' +
                                        patDetails.home_healthcare_address.address.city + ' - ' + patDetails.home_healthcare_address.address.pin_code}</Text>
                                    :
                                    null}
                            <Text style={styles.homeAdressTexts}>
                                Mobile - {patDetails.mobile_no || 'No number'}
                            </Text>
                        </View>

                        <PayBySelection
                            isCorporateUser={isCorporateUser}
                            selectedPayBy={this.state.selectedPayBy}
                            onSelectionChange={(mode) => {
                                this.addPatientList(this.selfPatientData);
                                this.setState({ selectedPayBy: mode, selectedPatientTypes: [POSSIBLE_FAMILY_MEMBERS.SELF], familyMembersSelections: [] });
                            }} />

                        <TestDetails
                            isCorporateUser={isCorporateUser}
                            navigation={this.props.navigation}
                            singlePatientSelect={false}
                            familyMembersSelections={this.state.familyMembersSelections}
                            changeFamilyMembersSelections={(familyMemberSelections) => this.setState({ familyMembersSelections: familyMemberSelections })}
                            onSelectionChange={(patientTypes) => {
                                this.setState({ selectedPatientTypes: patientTypes })
                            }}
                            selectedPatientTypes={this.state.selectedPatientTypes}
                            familyDetailsData={this.state.patDetailsArray}
                            payBy={this.state.selectedPayBy}
                            addPatientDetails={(data, setSelfPatientData) => {
                                if (setSelfPatientData === true) {
                                    this.selfPatientData = data
                                }
                                this.addPatientList(data);
                            }}
                        />

                        <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 10 }}>
                            <Row>
                                <Icon name="create" style={{ fontSize: 15, color: '#000' }} />
                                <Text style={styles.subTextBilling}> Your Reason For Checkup</Text>
                            </Row>
                            <Form style={{ marginRight: 1, marginLeft: -13 }}>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <TextInput
                                        onChangeText={(enteredDiseaseText) => {
                                            const bookSlotDetails = { ...this.state.bookSlotDetails }
                                            bookSlotDetails.diseaseDescription = enteredDiseaseText;
                                            this.setState({ enteredDiseaseText, bookSlotDetails })
                                        }}
                                        multiline={true} placeholder="Write Reason...."
                                        placeholderTextColor={'#909498'}
                                        style={styles.textInput} />
                                </Item>
                            </Form>
                        </View>

                        <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 10 }}>
                            <Row>
                                <Icon name="ios-cash" style={{ fontSize: 15, color: '#784EBC' }} />
                                <Text style={styles.subTextBilling}> Billing Details</Text>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col>
                                    <Text style={{ fontSize: 12, fontFamily: 'OpenSans', color: '#909498' }}>Consultation Fees</Text>
                                </Col>
                                <Col>
                                    <Text style={styles.rupeesText}>{'\u20B9'}{Number(amountBySelectedPersons).toFixed(2)}</Text>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col>
                                    <Text style={{ fontSize: 12, fontFamily: 'OpenSans', color: '#909498' }}>Charges </Text>
                                </Col>
                                <Col>
                                    <Text style={styles.redRupesText}>{'\u20B9'} 0.00</Text>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: 10 }}>
                                <Col>
                                    <Text style={{ fontSize: 12, fontFamily: 'OpenSans', }}>Amount to be Paid</Text>
                                </Col>
                                <Col>
                                    <Text style={styles.rupeesText}>{'\u20B9'} {Number(finalPaidAmount).toFixed(2)}</Text>
                                </Col>
                            </Row>
                        </View>
                    </View>




                    {/*   <View style={{ marginBottom: 30 }}>
                        <View style={{ backgroundColor: '#fff', padding: 10 }}>
                            <View>
                                <Text style={styles.subHead}>For Whom do you need to take up the Checkup?</Text>

                                <Row style={{ marginTop: 5 }}>
                                    <Col size={10}>
                                        <Row>
                                            <Col size={3}>
                                                <Row style={{ alignItems: 'center' }}>
                                                    <CheckBox style={{ borderRadius: 5 }}
                                                        checked={isCheckedSelf}
                                                        onPress={async () => {
                                                            await this.setState({ isCheckedSelf: !isCheckedSelf }),
                                                                this.onPressSelfCheckBox()
                                                        }}
                                                    />
                                                    <Text style={styles.firstCheckBox}>Self</Text>
                                                </Row>
                                            </Col>
                                            <Col size={3}>
                                                <Row style={{ alignItems: 'center' }}>
                                                    <CheckBox style={{ borderRadius: 5 }}
                                                        checked={isCheckedOthers}
                                                        onPress={async () => {
                                                            await this.setState({ isCheckedOthers: !isCheckedOthers }),
                                                                this.onPressOthersCheckBox()
                                                        }}
                                                    />
                                                    <Text style={styles.firstCheckBox}>Others</Text>
                                                </Row>
                                            </Col>
                                            <Col size={4}>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </View>
                            {isCheckedOthers ?
                                <View style={{ marginTop: 10, marginLeft: 8 }}>
                                    <Text style={styles.subHead}>Add other patient's details</Text>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col size={6}>
                                            <Row>
                                                <Col size={2}>
                                                    <Text style={styles.nameAndAge}>Name</Text>
                                                </Col>
                                                <Col size={8} >
                                                    <Input placeholder="Enter patient's name" style={styles.inputText}
                                                        returnKeyType={'next'}
                                                        keyboardType={"default"}
                                                        value={name}
                                                        onChangeText={(name) => this.setState({ name })}
                                                        blurOnSubmit={false}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col size={4} style={{ marginLeft: 5 }}>
                                            <Row>
                                                <Col size={2}>
                                                    <Text style={styles.nameAndAge}>Age</Text>
                                                </Col>
                                                <Col size={7}>
                                                    <Input placeholder="Enter patient's age" style={styles.inputText}
                                                        returnKeyType={'done'}
                                                        keyboardType="numeric"
                                                        value={age}
                                                        onChangeText={(age) => this.setState({ age })}
                                                        blurOnSubmit={false}
                                                    />
                                                </Col>
                                                <Col size={1}>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <View style={{ marginTop: 10, borderBottomWidth: 0, flexDirection: 'row' }}>
                                        <Text style={{
                                            fontFamily: 'OpenSans', fontSize: 14, marginTop: 3
                                        }}>Gender</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={gender === "M" ? true : false}
                                                onPress={() => this.setState({ gender: "M" })} />
                                            <Text style={styles.genderText}>Male</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={gender === "F" ? true : false}
                                                onPress={() => this.setState({ gender: "F" })} />
                                            <Text style={styles.genderText}>Female</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={gender === "O" ? true : false}
                                                onPress={() => this.setState({ gender: "O" })} />
                                            <Text style={styles.genderText}>Others</Text>
                                        </View>
                                    </View>
                                </View> : null}
                            {errMsg ? <Text style={{ paddingLeft: 10, fontSize: 12, fontFamily: 'OpenSans', color: 'red' }}>{errMsg}</Text> : null}
                            {isCheckedOthers ?
                                <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                                    <TouchableOpacity style={styles.touchStyle} onPress={() => this.addPatientList()}>
                                        <Text style={styles.touchText}>Add patient</Text>
                                    </TouchableOpacity>
                                </Row> : null}

                            <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 10 }}>
                                <Text style={styles.subHead}>Patient Details</Text>
                                <FlatList
                                    data={patDetailsArray}
                                    extraData={patDetailsArray}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) =>
                                        <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.2, paddingBottom: 10 }}>
                                            <Row style={{ marginTop: 10, }}>
                                                <Col size={8}>
                                                    <Row>
                                                        <Col size={2}>
                                                            <Text style={styles.commonText}>Name</Text>
                                                        </Col>
                                                        <Col size={.5}>
                                                            <Text style={styles.commonText}>-</Text>
                                                        </Col>
                                                        <Col size={7}>
                                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000' }}>{item.full_name}</Text>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col size={0.5}>
                                                    <TouchableOpacity onPress={() => this.onPressRemoveIcon(item, index)}>
                                                        <Icon active name='ios-close' style={{ color: '#d00729', fontSize: 18 }} />
                                                    </TouchableOpacity>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col size={10}>
                                                    <Row>
                                                        <Col size={2}>
                                                            <Text style={styles.commonText}>Age</Text>
                                                        </Col>
                                                        <Col size={.5}>
                                                            <Text style={styles.commonText}>-</Text>
                                                        </Col>
                                                        <Col size={7.5}>
                                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#000' }}>{(item.age) + ' - ' + getUserGenderAndAge(item)}</Text>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </View>
                                    } />

                            </View>
                            <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 10 }}>
                                <Row>
                                    <Col size={3}>
                                        <Text style={styles.subHead}>Home Address</Text>
                                    </Col>
                                    <Col size={7}>
                                        <Row style={{ justifyContent: 'flex-end', marginTop: 1 }}>
                                            <TouchableOpacity  >
                                                <Text style={styles.changeText}>Change</Text>
                                            </TouchableOpacity>
                                        </Row>

                                    </Col>
                                </Row>
                                <Text note style={styles.homeAdressTexts}> {patDetails.first_name + '-' + patDetails.last_name}</Text>
                                {patDetails.address && patDetails.address.address ?
                                    <Text note style={styles.homeAdressTexts}>{patDetails.address.address.no_and_street + ' , ' +
                                        patDetails.address.address.address_line_1 + ' , ' +
                                        patDetails.address.address.city + ' - ' + patDetails.address.address.pin_code}</Text>
                                    : null}
                                <Text note style={styles.homeAdressTexts}>
                                    Mobile - {patDetails.mobile_no || 'No number'}
                                </Text>
                            </View>
                            <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 10 }}>
                                <Text style={styles.subHead}>Test Details</Text>
                                <Row style={{ marginTop: 10 }}>
                                    <Col size={1.5}>
                                        <TouchableOpacity >
                                            <Thumbnail circle source={renderDoctorImage(bookSlotDetails)} style={{ height: 40, width: 40, borderRadius: 60 / 2 }} />
                                        </TouchableOpacity>
                                    </Col>
                                    <Col size={8.5}>
                                        <Text style={styles.nameDetails}>{(bookSlotDetails.prefix ? bookSlotDetails.prefix + '. ' : '') + (bookSlotDetails.first_name || '') + ' ' + (bookSlotDetails.last_name || '')}</Text>
                                        <Text note style={styles.doctorDegreeText}>{(getDoctorEducation(bookSlotDetails.education)) + ' ' + getDoctorSpecialist(bookSlotDetails.specialist)}</Text>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 5 }}>
                                    <Col size={6}>
                                        <Text note style={styles.nameDetails}>Doctor Fees <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#8dc63f' }}>{'(' + patDetailsArray.length + ' persons' + ')'} </Text></Text>
                                    </Col>
                                    <Col size={4}>
                                        <Text style={[styles.rightAmountText, { color: '#8dc63f' }]}>₹ {amountBySelectedPersons}</Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col size={6}>
                                        <Text note style={styles.nameDetails}>Extra Charges</Text>
                                    </Col>
                                    <Col size={4}>
                                        <Text style={styles.rightAmountText}>₹{bookSlotDetails.extra_charges || 0}</Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col size={6}>
                                        <Text style={[styles.nameDetails, { fontWeight: '500' }]}>Amount to be Paid </Text>
                                    </Col>
                                    <Col size={4}>
                                        <Text style={[styles.rightAmountText, { color: '#8dc63f' }]}>₹ {finalPaidAmount}</Text>
                                    </Col>
                                </Row>
                            </View>
                        </View>
                    </View>
                                */}
                </Content>
                <Footer style={
                    Platform.OS === "ios" ?
                        { height: 30 } : { height: 45 }}>
                    <FooterTab>
                        <Row>
                            {this.state.selectedPayBy === POSSIBLE_PAY_METHODS.SELF ?
                                <>
                                    <Col size={5} style={styles.totalAmount}>
                                        <TouchableOpacity onPress={() => this.onPressPayAtHome()} >
                                            <Text style={styles.totalAmountText}>Pay at Home</Text>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col size={5} style={styles.proceedButton}>
                                        <TouchableOpacity onPress={() => this.onPressConfirmProceedPayment()} >
                                            <Text style={styles.proceedButtonText}>Proceed</Text>
                                        </TouchableOpacity>
                                    </Col>
                                </>
                                :
                                <Col size={5} style={styles.proceedButton}>
                                    <TouchableOpacity onPress={() => this.onPressPayAtHome()} >
                                        <Text style={styles.proceedButtonText}>Book Appointment</Text>
                                    </TouchableOpacity>
                                </Col>
                            }
                        </Row>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

export default HomeTestConfirmation

