import React, { Component } from 'react';
import { Container, Content, Text, Button, Toast, Item, List, ListItem, Card, Input, Left, Segment, CheckBox, View, Radio, Footer, FooterTab, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TouchableOpacity, Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { RadioButton, Checkbox } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';
import { fetchUserProfile } from '../../../providers/profile/profile.action';
import { dateDiff } from '../../../../setup/helpers';
import { getAddress } from '../../../common'
import { insertAppointment } from '../../../providers/lab/lab.action';
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
        const packageDetails = navigation.getParam('packageDetails') || {};
        console.log("packageDetails", packageDetails)
        if (packageDetails != undefined) {
            this.setState({ packageDetails })
        }
        /* let packageDetails = {
             "lab_id": "5e7d9676ebd1650d14355677",
             "lab_test_categories_id": "5e78d0c127490f934d10de70",
             "lab_test_descriptiion": "genral",
             "fee": 1000,
             "lab_name": "ARROW",
             "category_name": "Allergy Profile",
             "extra_charges": 50,
             "appointment_starttime": "2020-04-30T18:00:00.000Z",
             "appointment_endtime": "2020-04-30T18:30:00.000Z",
             "mobile_no": "98076540211",
             "location": {
                 "coordinates": [
                     13.104802,
                     80.208888
                 ],
                 "type": "Point",
                 "address": {
                     "no_and_street": "1",
                     "address_line_1": "Villivakkam",
                     "district": "Chennai",
                     "city": "Chennai",
                     "state": "Tamil Nadu",
                     "country": "India",
                     "pin_code": "60010"
                 }
             },
         } */
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
            console.log("result", result)
            let patientAddress = [], patientDetails = [];

            this.defaultPatientDetails = {
                type: 'self',
                full_name: result.first_name + " " + result.last_name,
                gender: result.gender,
                age: parseInt(dateDiff(result.dob, new Date(), 'years'))
            }

            if (result.delivery_address) {
                let userAddressData = {
                    mobile_no: result.delivery_address[0].mobile_no,
                    coordinates: result.delivery_address[0].coordinates,
                    type: result.delivery_address[0].type,
                    address: result.delivery_address[0].address
                }
                patientAddress.push(userAddressData);
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
            console.log("patient Address ", this.state.patientAddress)
            console.log("data", this.defaultPatientDetails)
            // this.onChangeSelf()

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
        console.log("this.state.selfChecked::: ", this.state.selfChecked)
        console.log("this.state.othersChecked::: ", this.state.othersChecked)

        if (this.state.selfChecked == true) {
            patientDetails.unshift(this.defaultPatientDetails)
            console.log("::::", patientDetails)
        }
        else if (this.state.selfChecked == false) {
            this.state.patientDetails.shift(this.defaultPatientDetails)
            console.log("this.state.patientDetails:::shift", this.state.patientDetails)

        }
        this.setState({ patientDetails })
    }

    onChangeCheckBox = async () => {
        console.log("this.state.selfChecked::: ", this.state.selfChecked)
        console.log("this.state.othersChecked::: ", this.state.othersChecked)
        console.log("::::", this.defaultPatientDetails)
        console.log("this.state.patientDetails", this.state.patientDetails)

        if (this.state.othersChecked == true) {
            this.addPatientData()
        }
        if (this.state.othersChecked == false) {
            this.state.patientDetails.map(ele => {
                if (ele.type = 'others') {
                    this.state.patientDetails.pop(this.state.patientDetails)
                }
            })
        }
        await this.setState({ patientDetails })
        console.log("this.state.patientDetails:", this.state.patientDetails)
    }





    addPatientData = async () => {
        if (!this.state.name || !this.state.age || !this.state.gender) {
            this.setState({ errMsg: '* Kindly fill all the fields' })
        } else {
            let temp;
            // if (this.state.selfChecked == true) {
            //     temp = this.state.defaultPatientDetails;
            // }
            // else {
            //     temp = this.state.patientDetails;

            // }

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
        let { patientDetails, packageDetails, selectedAddress, itemSelected } = this.state
        try {
            if (itemSelected === 'TEST_AT_HOME' && selectedAddress == null) {
                Toast.show({
                    text: 'kindly chosse Address',
                    type: 'warning',
                    duration: 3000
                })
                return false;
            } else {
                selectedAddress = packageDetails.location;
            }
            console.log("address", selectedAddress)
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
                lab_test_descriptiion: packageDetails.lab_test_descriptiion,
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
                status: paymentMode === 'cash' ? "PENDING" : 'BOOKING_IN_PROGRESS',
                status_by: "USER",
                booked_from: "Mobile",
            };
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
                let response = await insertAppointment(requestData);
                response.labTestAppointmentId = response.labTestAppointmentId;
                this.props.navigation.navigate('paymentPage', {
                    service_type: SERVICE_TYPES.LAB_TEST,
                    bookSlotDetails: requestData,
                    amount: packageDetails.fee
                });
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
                                          
                                             <CheckBox style={{borderRadius:5}}
                                             status={this.state.selfChecked ? true : false}
                                               checked={this.state.selfChecked}
                                               onPress={async () => { await this.setState({ selfChecked: !this.state.selfChecked }), this.onChangeSelf() }}
                                             />
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000',marginLeft:20 }}>Self</Text>
                                        </Row>
                                    </Col>
                                    <Col size={3}>
                                        <Row style={{ alignItems: 'center' }}>
                                             <CheckBox style={{borderRadius:5}}
                                             status={this.state.othersChecked ? true : false}
                                               checked={this.state.othersChecked}
                                               onPress={async () => { await this.setState({ othersChecked: !this.state.othersChecked }), this.onChangeCheckBox() }}
                                               />
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000' ,marginLeft:20}}>Others</Text>
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
                                    <RadioButton.Group
                                        onValueChange={value => this.setState({ gender: value })}
                                        value={gender}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <RadioButton value="M" style={{ fontSize: 10 }} />
                                            <Text style={{
                                                fontFamily: 'OpenSans', fontSize: 12, marginTop: 10
                                            }}>Male</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                                            <RadioButton value="F" />
                                            <Text style={{
                                                fontFamily: 'OpenSans', fontSize: 12, marginTop: 10
                                            }}>Female</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                                            <RadioButton value="O" />
                                            <Text style={{
                                                fontFamily: 'OpenSans', fontSize: 12, marginTop: 10
                                            }}>Others</Text>
                                        </View>
                                    </RadioButton.Group>
                                </View>
                            </View> : null}
                        {this.state.errMsg ? <Text style={{ paddingLeft: 10, fontSize: 10, fontFamily: 'OpenSans', color: 'red' }}>{this.state.errMsg}</Text> : null}

                        {othersChecked == true ?
                            <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                <TouchableOpacity style={styles.touchStyle} onPress={() => this.addPatientData()}>
                                    <Text style={styles.touchText}>Add patient</Text>
                                </TouchableOpacity>
                            </Row> : null}
                    </View>

                    <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Patient Details</Text>
                        {/* {othersChecked || (selfChecked && othersChecked) ? */}
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


                    <RadioButton.Group onValueChange={value => this.setState({ itemSelected: value })}
                        value={itemSelected}  >
                        <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                            <Row>
                                <Col size={7}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 14, fontWeight: '500' }}>Test at home<Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#909090' }}>(Test Result)</Text></Text>
                                </Col>
                                <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                    <RadioButton value={'TEST_AT_HOME'} />
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
                                            <TouchableOpacity onPress={() => this.editProfile('MapBox', 'delivery_Address')}>
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
                                                        <RadioButton.Group style={{ marginTop: 2 }} onValueChange={value => this.setState({ selectedAddress: value })}

                                                            value={this.state.selectedAddress}  >
                                                            <RadioButton value={item} />
                                                        </RadioButton.Group>
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

                                    <RadioButton value={'TEST_AT_LAP'} />
                                </Col>
                            </Row>
                        </View>
                    </RadioButton.Group>
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










                    {/* <Grid style={styles.curvedGrid}>

                    </Grid>
                    <View style={{ marginTop: -95, height: 100 }}>
                        <Row style={{paddingLeft:10,paddingRight:10 }}>
                            <Col style={{ width: '35%', alignItems: 'flex-start' }}>
                                <Text style={styles.normalText}>Date</Text>
                            </Col>
                            <Col style={{ width: '20%', alignItems: 'center' }}>
                            </Col>
                            <Col style={{ width: '45%', alignItems: 'flex-end' }}>
                                <Text style={styles.normalText}>{currentDate}</Text>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: -28,paddingLeft:10,paddingRight:10 }}>
                            <Col style={{ width: '35%', alignItems: 'flex-start', }}>
                                <Text style={styles.normalText}>TotalBill</Text>
                            </Col>
                            <Col style={{ width: '20%', alignItems: 'center' }}>
                            </Col>
                            <Col style={{ width: '45%', alignItems: 'flex-end',  }}>
                                <Text style={styles.normalText}>Rs.100</Text>
                            </Col>
                        </Row>
                    </View>

                    <Card transparent style={{ padding: 10, marginTop: 20, }}>
                        <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 18, padding: 5 }}>Address Info</Text>
                        <Segment>
                            <Button active={this.state.activePage === 1} style={{borderLeftColor:'#fff',borderLeftWidth:1}}
                                onPress={this.selectComponent(1)}><Text uppercase={false}>Default Address</Text>

                            </Button>
                            <Button active={this.state.activePage === 2}
                                onPress={this.selectComponent(2)}><Text uppercase={false}>Add New Address</Text>

                            </Button>
                        </Segment>
                        <Content padder>
                            {this.renderSelectedComponent()}

                        </Content>
                    </Card> */}
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