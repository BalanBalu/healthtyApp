import React, { Component } from 'react';
import { Container, Content, Text, Button, Toast, Item, List, ListItem, Card, Input, Left, Segment, CheckBox, View, Radio } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { fetchUserProfile } from '../../../providers/profile/profile.action';
import { userFiledsUpdate, logout } from '../../../providers/auth/auth.actions';
import Spinner from '../../../../components/Spinner';
import { formatDate } from '../../../../setup/helpers';


class OrderPaymentAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            medicineDetails: null,
            deliveryAddressArray: [],
            activePage: 1,
            currentDate: formatDate(new Date(), 'MMMM D, YYYY'),
            selectedRadioButton: [true],
            deliveryAddressData: [],
            email: '',
            mobile_no: '',
            no_and_street: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            pin_code: '',
            isFocusKeyboard: false,
            isLoading: false,
        };
    }

    async componentDidMount() {
        const { navigation } = this.props;
        const medicineDetails = navigation.getParam('medicineDetails');
        await this.setState({ medicineDetails: medicineDetails })
        console.log('this.state.medicineDetails' + JSON.stringify(this.state.medicineDetails))
        this.clickedHomeDelivery();
    }

    clickedHomeDelivery = async () => {

        patientFields = "first_name,last_name,mobile_no,email,address,delivery_Address"
        let userId = await AsyncStorage.getItem('userId');
        this.setState({ isLoading: true });
        let patientResult = await fetchUserProfile(userId, patientFields);
        // console.log('patientResult' + JSON.stringify(patientResult))
        if (patientResult !== null) {
            this.setState({ isLoading: false });

            let deliveryAddressArray = patientResult.delivery_Address;
            if (deliveryAddressArray == undefined)
                deliveryAddressArray = [];
            let defaultAddressObject = {
                fullName: patientResult.first_name + " " + patientResult.last_name,
                email: patientResult.email,
                mobile_no: patientResult.mobile_no,
                address: patientResult.address.address
            }
            deliveryAddressArray.unshift(defaultAddressObject);
            await this.setState({ deliveryAddressArray: deliveryAddressArray })

        }
    }
    selectComponent = (activePage) => () => this.setState({ activePage })


    selectAddressRadioButton = async (radioIndex, addressValue) => {
        let sampleArray = this.state.selectedRadioButton;
        sampleArray[sampleArray.indexOf(true)] = !sampleArray[sampleArray.indexOf(true)]
        sampleArray[radioIndex] = !this.state.selectedRadioButton[radioIndex];
        await this.setState({ selectedRadioButton: sampleArray, deliveryAddressData: addressValue });
    }

    updateNewAddressMethod = async () => {
        const userId = await AsyncStorage.getItem('userId')
        let requestData = {
            delivery_Address: [{
                email: this.state.email,
                mobile_no: this.state.mobile_no,
                address: {
                    no_and_street: this.state.no_and_street,
                    address_line_1: this.state.address_line_1,
                    address_line_2: this.state.address_line_2,
                    // city: this.state.city,
                    pin_code: this.state.pin_code
                }
            }
            ]
        };
        let response = await userFiledsUpdate(userId, requestData);
        console.log(response);

        if (response.success) {
            Toast.show({
                text: 'Your New Address has been Inserted',
                type: "success",
                duration: 3000
            });
            await this.setState({ activePage: 1 })
            this.clickedHomeDelivery();
        }
        else {
            Toast.show({
                text: response.message,
                type: "danger",
                duration: 3000
            });
        }
    }



    renderSelectedComponent = () => {
        const { deliveryAddressArray, deliveryAddressData, isLoading } = this.state

        if (this.state.activePage === 1) {
            return (

                <View style={{ marginTop: 5, marginLeft: 2 }}>
                    <Spinner color="blue"
                        visible={isLoading} />
                    <Text style={{ fontSize: 20, fontFamily: 'OpenSans', fontWeight: 'bold' }} >Select a Delivery address</Text>

                    <FlatList
                        data={deliveryAddressArray}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) =>
                            <Card style={{ padding: 10, marginTop: 20 }}>
                                <TouchableOpacity onPress={() => this.selectAddressRadioButton(index, item)}>
                                    <Row>
                                        <Col style={{ width: '6%' }}>
                                            <Radio
                                                selected={this.state.selectedRadioButton[index]} color="green"
                                            />

                                        </Col>
                                        <Col style={{ width: '95%' }}>
                                            {item.fullName != undefined ? <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginLeft: 20, marginTop: 3, fontWeight: 'bold' }}>{item.fullName}</Text> :
                                                <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginLeft: 20, marginTop: 3, fontWeight: 'bold' }}>{deliveryAddressArray[0].fullName}</Text>

                                            }
                                        </Col>
                                    </Row>
                                    <Text style={styles.customText}>{item.email}</Text>
                                    <Text style={styles.customText}>{item.mobile_no}</Text>
                                    {item.address ?
                                        <View>
                                            <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginLeft: 40, marginTop: 4, fontWeight: 'bold' }}>Delivery Address</Text>
                                            <Row>
                                                <Text style={styles.customText}>{item.address.no_and_street}
                                                </Text>
                                                <Text style={styles.customSubText}>{item.address.address_line_1 + ', ' + item.address.address_line_2}
                                                </Text>
                                            </Row>
                                            <Row>
                                                <Text style={styles.customText}>{item.address.city}</Text>
                                                <Text style={styles.customSubText}>Pincode:{item.address.pin_code}</Text>
                                            </Row>
                                        </View>
                                        : null}
                                </TouchableOpacity>
                            </Card>
                        } />
                    <Button onPress={() => this.props.navigation.navigate('OrderPaymentPreview'
                        // ,{deliveryAddressData:deliveryAddressData}
                    )} block style={styles.loginButton}><Text>Proceed to Pay</Text></Button>

                </View>
            )
        }
        else {
            return (
                <Card transparent>
                    <Grid style={{ marginTop: 5 }}>
                        <Col>
                            <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginLeft: 5 }}>E-mail</Text>

                            <Input
                                placeholder="E-mail"
                                style={styles.transparentLabel}
                                value={this.state.email}
                                keyboardType={'email-address'}
                                returnKeyType={'next'}
                                onChangeText={email => this.setState({ email })}
                                autoCapitalize='none'
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.mobile_no._root.focus(); }}
                                testID="enterNo&Street"

                            />

                        </Col>
                        <Col>
                            <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginLeft: 5 }}>Phone</Text>
                            <Input
                                placeholder="Phone_No"
                                style={styles.transparentLabel}
                                value={this.state.mobile_no}
                                ref={(input) => { this.mobile_no = input; }}
                                keyboardType={'phone-pad'}
                                returnKeyType={'next'}
                                onChangeText={mobile_no => this.setState({ mobile_no })}
                                autoCapitalize='none'
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.no_and_street._root.focus(); }}
                                testID="enterNo&Street"

                            />
                        </Col>
                    </Grid>
                    <Grid style={{ marginTop: 5 }}>
                        <Col>
                            <Text style={{ fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold', }}> Delivery Address</Text>
                            <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginTop: 15 }}> Door_No and Street </Text>

                            <Input
                                placeholder="Enter Door_No ,Street"
                                style={styles.addressLabel}
                                value={this.state.no_and_street}
                                ref={(input) => { this.no_and_street = input; }}
                                keyboardType={'default'}
                                returnKeyType={'next'}
                                onChangeText={no_and_street => this.setState({ no_and_street })}
                                autoCapitalize='none'
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.address_line_1._root.focus(); }}
                                testID="enterNo&Street"

                            />
                        </Col>
                    </Grid>
                    <Grid style={{ marginTop: 5 }}>
                        <Col>
                            <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginTop: 10 }}> City Or Town </Text>
                            <Input
                                placeholder="Enter City name"
                                style={styles.addressLabel}
                                ref={(input) => { this.address_line_1 = input; }}
                                value={this.state.address_line_1}
                                keyboardType={'default'}
                                returnKeyType={'next'}
                                onChangeText={address_line_1 => this.setState({ address_line_1 })}
                                autoCapitalize='none'
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.address_line_2._root.focus(this.setState({ isFocusKeyboard: true })); }}
                                testID="enterAddressLine1"
                            />

                        </Col>
                    </Grid>
                    <Grid style={{ marginTop: 5 }}>
                        <Col>
                            <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginTop: 10 }}> State and Country </Text>
                            <Input
                                placeholder="Enter State and Country"
                                style={styles.addressLabel}
                                ref={(input) => { this.address_line_2 = input; }}
                                value={this.state.address_line_2}
                                keyboardType={'default'}
                                returnKeyType={'next'}
                                onChangeText={address_line_2 => this.setState({ address_line_2 })}
                                autoCapitalize='none'
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.pin_code._root.focus(this.setState({ isFocusKeyboard: true })); }}
                                testID="enterAddressLine2"
                            />
                        </Col>
                    </Grid>
                    <Grid style={{ marginTop: 5 }}>
                        <Col>
                            <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginTop: 10 }}> Pin Code </Text>
                            <Input
                                placeholder="Enter Pin code"
                                style={styles.transparentLabel}
                                value={this.state.pin_code}
                                autoFocus={this.state.isFocusKeyboard}
                                ref={(input) => { this.pin_code = input; }}
                                keyboardType="numeric"
                                returnKeyType={'next'}
                                onChangeText={pin_code => this.setState({ pin_code })}
                                autoCapitalize='none'
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.updateNewAddressMethod() }}
                                testID="enterPincode"
                            />
                        </Col>
                    </Grid>
                    <Button onPress={() => this.updateNewAddressMethod()} block style={styles.loginButton}><Text>Continue</Text></Button>

                </Card>
            )
        }
    }
    render() {
        const { currentDate } = this.state

        return (
            <Container>
                <Content>
                    <Grid style={styles.curvedGrid}>

                    </Grid>
                    <View style={{ marginTop: -95, height: 100 }}>
                        <Row>
                            <Col style={{ width: '30%', alignItems: 'center' }}>
                                <Text style={styles.normalText}>Date</Text>
                            </Col>
                            <Col style={{ width: '30%', alignItems: 'center' }}>
                            </Col>
                            <Col style={{ width: '40%', alignItems: 'center' }}>
                                <Text style={styles.normalText}>{currentDate}</Text>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: -28 }}>
                            <Col style={{ width: '30%', alignItems: 'center', marginLeft: 12 }}>
                                <Text style={styles.normalText}>TotalBill</Text>
                            </Col>
                            <Col style={{ width: '40%', alignItems: 'center' }}>
                            </Col>
                            <Col style={{ width: '30%', alignItems: 'center', marginLeft: -30 }}>
                                <Text style={styles.normalText}>Rs.100</Text>
                            </Col>
                        </Row>
                    </View>

                    <Card transparent style={{ padding: 10, marginTop: 20, }}>
                        <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 18, padding: 5 }}>AddressInfo</Text>
                        <Segment >
                            <Button active={this.state.activePage === 1}
                                onPress={this.selectComponent(1)}><Text uppercase={false}>DefaultAddress</Text>

                            </Button>
                            <Button active={this.state.activePage === 2}
                                onPress={this.selectComponent(2)}><Text uppercase={false}>AddNewAddress</Text>

                            </Button>
                        </Segment>
                        <Content padder>
                            {this.renderSelectedComponent()}

                        </Content>
                    </Card>
                </Content>
            </Container >
        );
    }
}

export default OrderPaymentAddress;

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
        marginTop:-135,
        marginLeft:'auto',
        marginRight:'auto',
        backgroundColor: '#745DA6',
        transform: [
          {scaleX: 2}
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
        fontSize: 16,
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
        marginLeft: 40,
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
    }
});