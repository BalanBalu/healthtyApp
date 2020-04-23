import React, { Component } from 'react';
import { Container, Content, Text, Button, Toast, Item, List, ListItem, Card, Input, Left, Segment, CheckBox, View, Radio, Footer, FooterTab } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TouchableOpacity, Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { RadioButton, Checkbox } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';
import { fetchUserProfile } from '../../../providers/profile/profile.action';
import { dateDiff } from '../../../../setup/helpers';
import { getAddress } from '../../../common'
import { InsertAppointment } from '../../../providers/lab/lab.action';


class labConfirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            itemSelected: 'itemOne',
            selfChecked: true,
            othersChecked: false,
            gender: 'M',
            patientType: [],
            selectedType: [true, false],
            patientdetails: [],
            email: '',
            mobile_no: '',
            full_name: '',
            gender: '',
            age: '',
            itemSelected: 'TEST_TO_HOME',
            packageDetails: {}

        };
    }
    async componentDidMount() {
        const packageDetails = navigation.getParam('packageDetails') || [];
        if (packageDetails != undefined) {
            this.setState({ packageDetails})
        }
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

    }
    getUserProfile = async () => {
        try {
            let fields = "first_name,last_name,gender,dob,mobile_no,address,delivery_address"
            let userId = await AsyncStorage.getItem('userId');
            let result = await fetchUserProfile(userId, fields);
            let patientdetails = [];
            if (result) {

                if (result.delivery_address) {
                    let userAddressData = {
                        full_name: result.first_name + " " + result.last_name,
                        mobile_no: result.mobile_no,
                        gender: result.gender,
                        age: parseInt(dateDiff(result.dob, new Date(), 'years')),
                        address: result.delivery_address[0].address
                    }
                    patientdetails.push(userAddressData);
                } else if (result.address.address) {
                    let userAddressData = {
                        full_name: result.first_name + " " + result.last_name,
                        mobile_no: result.mobile_no,
                        gender: result.gender,
                        age: dateDiff(result.dob, new Date(), 'years'),
                        address: result.address.address
                    }
                    patientdetails.unshift(userAddressData);
                }
                await this.setState({ patientdetails })
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    editProfile(screen, addressType) {
        this.props.navigation.navigate(screen, { screen: screen, navigationOption: 'labConfirmation', addressType:'lab_delivery_Address' })
    }

    addPatientData = async () => {
        if (!this.state.name || !this.state.age) {
            this.setState({ errMsg: '* Kindly fill all the fields' })
        } else {
            this.setState({ errMsg: '' })
            let temp = this.state.patientdetails;
            temp.push({
                full_name: this.state.name,
                age: parseInt(this.state.age),
                gender: this.state.gender
            });
            await this.setState({ patientdetails: temp, updateButton: false });
            await this.setState({ name: null, age: null, });

        }
    }
    amountPaid() {
        const { packageDetails, patientdetails, itemSelected } = this.state;

        let totalAmount;
        if (itemSelected == 'TEST_TO_HOME') {
            totalAmount = ((packageDetails.packageAmount * patientdetails.length) + (packageDetails.extra_charges))
            return totalAmount
        }
        else {
            totalAmount = (packageDetails.packageAmount * patientdetails.length)
            return totalAmount
        }

    }

    proceedToLabTestAppointment = async () => {
        const { patientdetails, packageDetails } = this.state
        try {
            let patientData=[];
           this.state.patientdetails.map(ele=>{
               patientData.push({ patient_name: ele.full_name, patient_age:ele.age})
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
                fee: packageDetails.packageAmount,
                startTime: packageDetails.startTime,
                endTime: packageDetails.endTime,
                status: "PENDING",
                status_by: "USER",
                booked_from: "Mobile",
                // payment_id: paymentId


            };
            let response = await InsertAppointment(requestData);
            if (response.success) {
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

        }
        catch (e) {
            
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }



    render() {
        const { patientType, name, age, gender, patientdetails, itemSelected, packageDetails } = this.state;

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
                                            <Checkbox color="#775DA3"
                                                status={this.state.selectedType[0] ? 'checked' : 'unchecked'}
                                                onPress={() => { this.selectPatientType(0, 'Self'); }}
                                            />
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000' }}>Self</Text>
                                        </Row>
                                    </Col>
                                    <Col size={3}>
                                        <Row style={{ alignItems: 'center' }}>
                                            <Checkbox color="#775DA3"
                                                status={this.state.selectedType[1] ? 'checked' : 'unchecked'}
                                                onPress={() => { this.selectPatientType(1, 'Others'); }}
                                            />
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000' }}>Others</Text>
                                        </Row>
                                    </Col>
                                    <Col size={4}>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {patientType == 'Others' ?
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

                        {patientType == 'Others' ?
                            <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                <TouchableOpacity style={styles.touchStyle} onPress={() => this.addPatientData()}>
                                    <Text style={styles.touchText}>Add patient</Text>
                                </TouchableOpacity>
                            </Row> : null}
                    </View>

                    <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Patient Details</Text>

                        <FlatList
                            data={patientdetails}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) =>
                                <View>
                                    <Row style={{ marginTop: 10, }}>
                                        <Col size={10}>
                                            <Row>
                                                <Col size={2}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', fontWeight: '500' }}>Name</Text>
                                                </Col>
                                                <Col size={.5}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', fontWeight: '500' }}>-</Text>
                                                </Col>
                                                <Col size={7.5}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000' }}>{item.full_name}</Text>

                                                </Col>
                                            </Row>
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
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000' }}>{item.age} years</Text>

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
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 14, fontWeight: '500' }}>Test from home<Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#909090' }}>(Test Result)</Text></Text>
                                </Col>
                                <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                    <RadioButton value={'TEST_TO_HOME'} />
                                </Col>
                            </Row>
                            {itemSelected === 'TEST_TO_HOME' ?
                                <View>
                                    <Row style={{ marginTop: 5 }}>
                                        <Col size={5}>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Delivery Address</Text>
                                        </Col>
                                        <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => this.editProfile('MapBox', 'lab_delivery_Address')}>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#ff4e42' }}>Add new Address</Text>
                                            </TouchableOpacity>
                                        </Col>
                                    </Row>
                                    {/* <FlatList
                                    data={patientdetails}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) =>
                                          
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '300', marginTop: 5 }}>{item.full_name}</Text> */}
                                    <Row style={{ borderBottomColor: '#909090', borderBottomWidth: 0.3, paddingBottom: 15 }}>

                                        <Col size={10}>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2, color: '#6a6a6a' }}>{getAddress(patientdetails[0])}</Text>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2 }}>{'Mobile -' + (patientdetails[0] && patientdetails[0].mobile_no || 'Nil')}</Text>
                                        </Col>
                                        {/* <Col size={1} style={{ justifyContent: 'center' }}>
                                                {/* <RadioButton.Group
                                                >
                                                    <RadioButton value={this.state.itemSelected == 'itemTwo'} />
                                                </RadioButton.Group> */}
                                        {/* </Col>
                                       
                                    } />  */}
                                    </Row>
                                </View> :
                                null}
                        </View>

                        <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                            <Row>
                                <Col size={7}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 14, fontWeight: '500' }}>Pick up at Lab<Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#909090' }}>(Test Result)</Text></Text>
                                </Col>
                                <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                    <RadioButton value={'PICKUP_AT_LAP'} />
                                </Col>
                            </Row>
                        </View>
                    </RadioButton.Group>
                    {itemSelected === 'PICKUP_AT_LAP' ?
                        <View>
                            <Row>
                                <Col size={5}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Store Address</Text>
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
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#8dc63f' }}>{'(' + (patientdetails.length) + " person)"}</Text>
                                </Text>

                            </Col>
                            <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>₹ {(packageDetails.packageAmount * patientdetails.length)}</Text>
                                {/* <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>₹ {packageDetails.packageAmount}</Text> */}

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
                        {itemSelected === 'TEST_TO_HOME' ?
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
                                <TouchableOpacity >
                                    <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#000', fontWeight: '400' }}>{itemSelected == 'TEST_TO_HOME' ? 'Cash On Laptest' : 'Cash on Pickup'} </Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#8dc63f' }}>
                                <TouchableOpacity onPress={() => this.proceedToLabTestAppointment()}>
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

export default labConfirmation;

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