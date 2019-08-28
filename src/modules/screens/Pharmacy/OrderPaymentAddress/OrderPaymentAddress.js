import React, { Component } from 'react';
import { Container, Content, Text, Button, Item, List, ListItem, Card, Input, Left, Segment, CheckBox, View, Radio } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { fetchUserProfile } from '../../../providers/profile/profile.action';
import { formatDate } from '../../../../setup/helpers';


class OrderPaymentAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            medicineDetails: null,
            deliveryAddressArray: [],
            activePage: 1,
            currentDate: formatDate(new Date(), 'MMMM D, YYYY'),
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
        let patientResult = await fetchUserProfile(userId, patientFields);
        // console.log('patientResult' + JSON.stringify(patientResult))
        if (patientResult !== null) {

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
            console.log('deliveryAddressArray' + JSON.stringify(deliveryAddressArray));

            await this.setState({ deliveryAddressArray: deliveryAddressArray })
        }
    }
    selectComponent = (activePage) => () => this.setState({ activePage })

    renderSelectedComponent = () => {

        if (this.state.activePage === 1) {
            return (
                <View style={{ marginTop: 5, marginLeft: 2 }}>
                    <Text style={{ fontSize: 20, fontFamily: 'OpenSans', fontWeight: 'bold' }} >Select a Delivery address</Text>

                    <FlatList
                        data={this.state.deliveryAddressArray}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) =>
                            <Card style={{ padding: 10, marginTop: 20 }}>

                                <Row>
                                    <Col style={{ width: '6%' }}>
                                        <Radio selected={true} />
                                    </Col>
                                    <Col style={{ width: '95%' }}>
                                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginLeft: 20, marginTop: 3, fontWeight: 'bold' }}>{item.fullName}</Text>
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
                            </Card>
                        } />
                </View>
            )
        }
        else {
            return (
                <Card transparent>
                    <Grid style={{ marginTop: 5 }}>
                        <Col>
                            <Text style={{ fontSize: 16, fontFamily: 'OpenSans', marginLeft: 5 }}>E-mail</Text>
                            <Input placeholder="E-mail" style={styles.transparentLabel} />
                        </Col>
                        <Col>
                            <Text style={{ fontSize: 16, fontFamily: 'OpenSans', marginLeft: 5 }}>Phone</Text>
                            <Input placeholder="Phone" style={styles.transparentLabel} />
                        </Col>
                    </Grid>
                    <Grid style={{ marginTop: 5 }}>
                        <Col>
                            <Text style={{ fontSize: 16, fontFamily: 'OpenSans', fontWeight: 'bold', marginLeft: 5 }}> Delivery Address</Text>
                            <Text style={{ fontSize: 16, fontFamily: 'OpenSans', marginTop: 8 }}> Door_No and Street </Text>
                            <Input placeholder="Enter Door_No ,Street" style={styles.addressLabel} />
                        </Col>
                    </Grid>
                    <Grid style={{ marginTop: 5 }}>
                        <Col>
                            <Text style={{ fontSize: 16, fontFamily: 'OpenSans', marginTop: 8 }}> City Or Town </Text>
                            <Input placeholder="Enter City name" style={styles.addressLabel} />
                        </Col>
                    </Grid>
                    <Grid style={{ marginTop: 5 }}>
                        <Col>
                            <Text style={{ fontSize: 16, fontFamily: 'OpenSans', marginTop: 8 }}> State and Country </Text>
                            <Input placeholder="Enter State and Country" style={styles.addressLabel} />
                        </Col>
                    </Grid>
                    <Grid style={{ marginTop: 5 }}>
                        <Col>
                            <Text style={{ fontSize: 16, fontFamily: 'OpenSans', marginTop: 8 }}> Pin Code </Text>
                            <Input placeholder="Enter Pin code" style={styles.addressLabel} />
                        </Col>
                    </Grid>
                    <Button onPress={() => this.props.navigation.navigate('MedicinePaymentResult')} block style={styles.loginButton}><Text>Continue</Text></Button>

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
                    <View style={{ marginTop: -85, height: 100 }}>
                        <Row>
                            <Col style={{ width: '30%', alignItems: 'center' }}>
                                <Text style={styles.normalText}>Date</Text>
                            </Col>
                            <Col style={{ width: '40%', alignItems: 'center' }}>
                            </Col>
                            <Col style={{ width: '30%', alignItems: 'center' }}>
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
        borderRadius: 800,
        width: '200%',
        height: 690,
        marginLeft: -200,
        marginTop: -600,
        position: 'relative',
        bottom: 0,
        overflow: 'hidden',
        backgroundColor: '#745DA6'
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