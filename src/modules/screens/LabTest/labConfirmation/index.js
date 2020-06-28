import React, { Component } from 'react';
import { Container, Content, Text, Button, Toast, Item, List, ListItem, Card, Input, Left, Segment, CheckBox, View, Radio, Footer, FooterTab, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TouchableOpacity, Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import { fetchUserProfile } from '../../../providers/profile/profile.action';
import { dateDiff } from '../../../../setup/helpers';
import { getAddress } from '../../../common'
import { hasLoggedIn } from '../../../providers/auth/auth.actions';
import { insertAppointment, updateLapAppointment } from '../../../providers/lab/lab.action';
import { getUserGenderAndAge } from '../CommonLabTest'
import { SERVICE_TYPES } from '../../../../setup/config'
import BookAppointmentPaymentUpdate from '../../../providers/bookappointment/bookAppointment';
let patientDetails = [];
class LabConfirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            itemSelected: 'itemOne',
            selfChecked: false,
            othersChecked: false,
            gender: 'M',
            patientType: [],
            selectedType: [false, false],
            patientDetails: [],
            patientAddress: [],
            defaultPatientDetails: [],
            email: '',
            mobile_no: '',
            full_name: '',
            gender: '',
            age: '',
            itemSelected: 'TEST_AT_LAP',
            packageDetails: {},
            selectedAddress: null,


        };
    }
    async componentDidMount() {
        const { navigation } = this.props;
        const isLoggedIn = await hasLoggedIn(this.props);
        if (!isLoggedIn) {
            navigation.navigate('login');
            return
        }
        const packageDetails = navigation.getParam('packageDetails') || {};
        if (packageDetails != undefined) {
            this.setState({ packageDetails })
        }
        this.setState({ packageDetails })
        await this.getUserProfile();
    }

    backNavigation(navigationData) {
        if (navigationData.action) {
            if (navigationData.action.type === 'Navigation/NAVIGATE') {
                this.getUserProfile()
            }
        }
    }

    selectPatientType = (Index, selectType) => {
        let tempArray = this.state.selectedType;
        tempArray[Index] = !this.state.selectedType[Index];
        this.setState({ selectedType: tempArray });
        let array = this.state.patientType;
        if (tempArray[Index] == true) {
            array.splice(Index, 0, selectType);
        } else {
            let deSelectedIndex = this.state.patientType.indexOf(selectType);
            array.splice(deSelectedIndex, 1);
        }
        this.setState({ patientType: array });
        console.log("patientType", this.state.patientType)
    }
    getUserProfile = async () => {
        try {
            let fields = "first_name,last_name,gender,dob,mobile_no,address,delivery_address"
            let userId = await AsyncStorage.getItem('userId');
            let result = await fetchUserProfile(userId, fields);
            let patientAddress = [], patientDetails = [];

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
            console.log("data", this.defaultPatientDetails)
            console.log("patientAddress", this.state.patientAddress)

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
    onChangeSelf = async () => {
        console.log("Start:::", this.state.patientDetails.length);
        if (this.state.selfChecked == true && patientDetails.length == 0) {
            patientDetails.unshift(this.defaultPatientDetails)
        }
        else if (this.state.selfChecked == false) {
            this.state.patientDetails.shift(this.defaultPatientDetails)
        }
        this.setState({ patientDetails })
        console.log("self:::", this.state.patientDetails);

    }

    onChangeCheckBox = async () => {
        if (this.state.othersChecked == true) {
            this.addPatientData()
        }
        if (this.state.othersChecked == false) {
            this.state.patientDetails.map(ele => {
                if (ele.type == 'others') {
                    this.state.patientDetails.pop(this.state.patientDetails)
                }
            })
            this.setState({ errMsg: '' })

        }
        await this.setState({ patientDetails })
    }





    addPatientData = async () => {
        if (!this.state.name || !this.state.age || !this.state.gender) {
            this.setState({ errMsg: '* Kindly fill all the fields' })
        } else {
            let temp;
            this.setState({ errMsg: '' })
            temp = this.state.patientDetails;

            temp.push({
                type: 'others',
                full_name: this.state.name,
                age: parseInt(this.state.age),
                gender: this.state.gender
            });
            await this.setState({ patientDetails: temp, updateButton: false });
            await this.setState({ name: null, age: null, gender: null });

        }
    }
    amountPaid() {
        const { packageDetails, patientDetails, itemSelected } = this.state;
        let totalAmount = 0;
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


    proceedToLabTestAppointment = async (paymentMode) => {
        let { patientDetails, packageDetails, selectedAddress, itemSelected, errMsg } = this.state
        try {
            console.log("errMsg", errMsg)
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
            this.setState({ isLoading: true });
            const userId = await AsyncStorage.getItem('userId')

            let requestData = {
                user_id: userId,
                patient_data: patientData,
                lab_id: packageDetails.lab_id,
                lab_name: packageDetails.lab_name,
                lab_test_categories_id: packageDetails.lab_test_categories_id,
                lab_test_description: packageDetails.lab_test_description,
                fee: packageDetails.fee,
                startTime: packageDetails.appointment_starttime,
                endTime: packageDetails.appointment_endtime,
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
            if (packageDetails.appointment_status == 'PAYMENT_FAILED') {
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
                    this.setState({ isLoading: false });
                }

            } else {
                let response = {};
                if (packageDetails.appointment_status == 'PAYMENT_FAILED') {
                    console.log("requestData", requestData)
                    let updateData = {
                        labId: requestData.lab_id,
                        userId: userId,
                        startTime: requestData.startTime,
                        endTime: requestData.endtime,
                        status: requestData.status,
                        statusUpdateReason: "NEW_BOOKING",
                        status_by: requestData.status_by
                    }
                    response = await updateLapAppointment(packageDetails.appointment_id, updateData);

                } else {
                    response = await insertAppointment(requestData);

                    console.log("response", response);

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
    removePatientData(item, index) {
        let temp = this.state.patientDetails
        temp.splice(index, 1);
        this.setState({ patientDetails: temp });
    }


    render() {
        const { data, name, age, gender, patientDetails, itemSelected, packageDetails, patientAddress, selfChecked, othersChecked, defaultPatientDetails } = this.state;

        return (
            <Container>
                <NavigationEvents
                    onWillFocus={payload => { this.backNavigation(payload); }}
                />
                <Content style={{ backgroundColor: '#F5F5F5', padding: 10 }}>

                    <View style={{ backgroundColor: '#fff', padding: 10 }}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>For Whom do you need to take up the test?</Text>

                        <Row style={{ marginTop: 5 }}>
                            <Col size={10}>
                                <Row>
                                    <Col size={3}>
                                        <Row style={{ alignItems: 'center' }}>

                                            <CheckBox style={{ borderRadius: 5 }}
                                                status={this.state.selfChecked ? true : false}
                                                checked={this.state.selfChecked}
                                                onPress={async () => { await this.setState({ selfChecked: !this.state.selfChecked }), this.onChangeSelf() }}
                                            />
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', marginLeft: 20 }}>Self</Text>
                                        </Row>
                                    </Col>
                                    <Col size={3}>
                                        <Row style={{ alignItems: 'center' }}>
                                            <CheckBox style={{ borderRadius: 5 }}
                                                status={this.state.othersChecked ? true : false}
                                                checked={this.state.othersChecked}
                                                onPress={async () => { await this.setState({ othersChecked: !this.state.othersChecked }), this.onChangeCheckBox() }}
                                            />
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', marginLeft: 20 }}>Others</Text>
                                        </Row>
                                    </Col>
                                    <Col size={4}>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {othersChecked == true ?
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Add other patient's details</Text>
                                <Row style={{ marginTop: 10 }}>
                                    <Col size={6}>
                                        <Row>
                                            <Col size={2}>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', marginTop: 5 }}>Name</Text>
                                            </Col>
                                            <Col size={8} >
                                                <Input placeholder="Enter patient's name" style={{ backgroundColor: '#f2f2f2', color: '#000', fontSize: 10, height: 33, }}
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
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', marginTop: 5 }}>Age</Text>
                                            </Col>
                                            <Col size={8}>
                                                <Input placeholder="Enter patient's age" style={{ backgroundColor: '#f2f2f2', color: '#000', fontSize: 10, height: 33, }}
                                                    returnKeyType={'done'}
                                                    keyboardType="numeric"
                                                    value={age}
                                                    onChangeText={(age) => this.setState({ age })}
                                                    blurOnSubmit={false}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>


                                <View style={{ marginTop: 5, borderBottomWidth: 0, flexDirection: 'row' }}>
                                    <Text style={{
                                        fontFamily: 'OpenSans', fontSize: 12, marginTop: 10
                                    }}>Gender</Text>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={gender === "M" ? true : false}
                                            onPress={() => this.setState({ gender: "M" })} />
                                        <Text style={{
                                            fontFamily: 'OpenSans', fontSize: 12, marginLeft: 10
                                        }}>Male</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={gender === "F" ? true : false}
                                            onPress={() => this.setState({ gender: "F" })} />
                                        <Text style={{
                                            fontFamily: 'OpenSans', fontSize: 12, marginLeft: 10
                                        }}>Female</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={gender === "O" ? true : false}
                                            onPress={() => this.setState({ gender: "O" })} />
                                        <Text style={{
                                            fontFamily: 'OpenSans', fontSize: 12, marginLeft: 10
                                        }}>Others</Text>
                                    </View>
                                </View>

                                {this.state.errMsg ? <Text style={{ paddingLeft: 10, fontSize: 10, fontFamily: 'OpenSans', color: 'red' }}>{this.state.errMsg}</Text> : null}

                            </View> : null}

                        {othersChecked == true ?
                            <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                <TouchableOpacity style={styles.touchStyle} onPress={() => this.addPatientData()}>
                                    <Text style={styles.touchText}>Add patient</Text>
                                </TouchableOpacity>
                            </Row> : null}
                    </View>

                    <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Patient Details</Text>
                        <FlatList
                            data={patientDetails}
                            extraData={patientDetails}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) =>
                                <View>
                                    <Row style={{ marginTop: 10, }}>
                                        <Col size={8}>
                                            <Row>
                                                <Col size={2}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', fontWeight: '500' }}>Name</Text>
                                                </Col>
                                                <Col size={.5}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', fontWeight: '500' }}>-</Text>
                                                </Col>
                                                <Col size={7}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000' }}>{item.full_name}</Text>

                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col size={0.5}>
                                            <TouchableOpacity onPress={() => this.removePatientData(item, index)}>
                                                <Icon active name='ios-close' style={{ color: '#d00729', fontSize: 18 }} />
                                            </TouchableOpacity>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col size={10}>
                                            <Row>
                                                <Col size={2}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', fontWeight: '500' }}>Age</Text>
                                                </Col>
                                                <Col size={.5}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', fontWeight: '500' }}>-</Text>
                                                </Col>
                                                <Col size={7.5}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000' }}>{(item.age) + ' - ' + getUserGenderAndAge(item)}</Text>

                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </View>
                            } />

                    </View>



                    <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                        <Row>
                            <Col size={7}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 14, fontWeight: '500' }}>Test at home<Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#909090' }}>(Test Result)</Text></Text>
                            </Col>
                            <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                <Radio
                                    standardStyle={true}
                                    selected={itemSelected === 'TEST_AT_HOME' ? true : false}
                                    onPress={() => this.setState({ itemSelected: 'TEST_AT_HOME' })} />
                            </Col>
                        </Row>
                    </View>
                    {itemSelected === 'TEST_AT_HOME' ?
                        <View>
                            {patientAddress.length != 0 ?
                                <Row style={{ marginTop: 5 }}>
                                    <Col size={5}>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Save Address</Text>
                                    </Col>
                                    <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                        <TouchableOpacity onPress={() => this.editProfile('MapBox', 'lab_delivery_Address')}>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#ff4e42' }}>Add new Address</Text>
                                        </TouchableOpacity>
                                    </Col>
                                </Row> : null}
                            {patientAddress.length != 0 ?
                                <FlatList
                                    data={patientAddress}
                                    extraData={patientAddress}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) =>
                                        <View style={{ backgroundColor: '#fff' }}>
                                            <Row style={{ borderBottomColor: '#909090', borderBottomWidth: 0.3, paddingBottom: 15 }}>

                                                <Col size={10}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2, color: '#6a6a6a' }}>{getAddress(item)}</Text>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2 }}>{'Mobile -' + (item.mobile_no || 'Nil')}</Text>
                                                </Col>
                                                <Col size={1} style={{ justifyContent: 'center' }}>
                                                    <Radio
                                                        standardStyle={true}
                                                        selected={this.state.selectedAddress === item ? true : false}
                                                        onPress={() => this.setState({ selectedAddress: item })} />
                                                </Col>
                                            </Row>
                                        </View>
                                    } /> :

                                <Button transparent onPress={() => this.editProfile('MapBox', null)}>
                                    <Icon name='add' style={{ color: 'gray' }} />
                                    <Text uppercase={false} style={styles.customText}>Add Address</Text>
                                </Button>}
                        </View> : null}

                    <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                        <Row>
                            <Col size={7}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 14, fontWeight: '500' }}>Test at Lab<Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#909090' }}>(Test Result)</Text></Text>
                            </Col>
                            <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>


                                <Radio
                                    standardStyle={true}
                                    selected={itemSelected === 'TEST_AT_LAP' ? true : false}
                                    onPress={() => this.setState({ itemSelected: 'TEST_AT_LAP' })} />
                            </Col>
                        </Row>
                    </View>

                    {itemSelected === 'TEST_AT_LAP' ?
                        <View>
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
                        {/* <Row style={{ marginTop: 5 }}>
                            <Col size={8}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#6a6a6a' }}>Tax</Text>
                            </Col>
                            <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#ff4e42', textAlign: 'right' }}>₹ 50.00</Text>

                            </Col>
                        </Row> */}
                        {itemSelected === 'TEST_AT_HOME' ?
                            <Row style={{ marginTop: 5 }}>
                                <Col size={8}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#6a6a6a' }}>Extra Charges</Text>
                                </Col>
                                <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#ff4e42', textAlign: 'right' }}>₹{packageDetails.extra_charges ? packageDetails.extra_charges : 0}</Text>

                                </Col>
                            </Row> : null}
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
                            <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                                <TouchableOpacity onPress={() => this.proceedToLabTestAppointment('cash')}>
                                    <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#000', fontWeight: '400' }}>{itemSelected == 'TEST_AT_HOME' ? 'Cash On Home' : 'Cash on Lab'} </Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#8dc63f' }}>
                                <TouchableOpacity onPress={() => this.proceedToLabTestAppointment('online')}>
                                    <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#fff', fontWeight: '400' }}>Proceed</Text>
                                </TouchableOpacity>
                            </Col>
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