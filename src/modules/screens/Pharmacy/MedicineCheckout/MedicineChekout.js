import React, { Component } from 'react';
import { Container, Content, Text, Radio, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, View, Segment } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, AsyncStorage, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { fetchUserProfile } from '../../../providers/profile/profile.action';

class MedicineCheckout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            deliveryArray: [],
            activePage: 1,
            addressVisible: false

        }
    }

    clickedHomeDelivery = async () => {
        patientFields = "first_name,last_name,mobile_no,email,address,delivery_Address"
        let userId = await AsyncStorage.getItem('userId');
        let patientResult = await fetchUserProfile(userId, patientFields);
        // console.log('patientResult' + JSON.stringify(patientResult))
        if (patientResult !== null) {

            let deliveryArray = patientResult.delivery_Address;
            if(deliveryArray==undefined)
            deliveryArray=[];
            let defaultAddressObject = {
                fullName: patientResult.first_name + " " + patientResult.last_name,
                email: patientResult.email,
                mobile_no: patientResult.mobile_no,
                address: patientResult.address.address
            }
            
                deliveryArray.unshift(defaultAddressObject);
           
            console.log('deliveryArray' + JSON.stringify(deliveryArray));

            await this.setState({ deliveryArray: deliveryArray, addressVisible: true })
        }
    }

    selectComponent = (activePage) => () => this.setState({ activePage })

    renderSelectedComponent = () => {

        if (this.state.activePage === 1) {
            return (
                <View style={{ marginTop: 5, marginLeft: 2 }}>
                    <Text style={{ fontSize: 20, fontFamily: 'OpenSans', fontWeight: 'bold' }} >Select a Delivery address</Text>
                    <Card style={{ padding: 10 }}>

                        <FlatList
                            data={this.state.deliveryArray}
                            extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) =>

                                <Row>
                                    <View style={{ justifyContent: "center" }}>
                                        <Radio selected={true} />
                                    </View>
                                    <View>

                                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginLeft: 20, marginTop: 3, fontWeight: 'bold' }}>{item.fullName}</Text>
                                        <Text style={{ fontSize: 13, fontFamily: 'OpenSans', marginLeft: 20, marginTop: 3 }}>{item.email}</Text>
                                        <Text style={{ fontSize: 13, fontFamily: 'OpenSans', marginLeft: 20, marginTop: 3 }}>{item.mobile_no}</Text>
                                        <View>

                                            <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginLeft: 15, marginTop: 4, fontWeight: 'bold' }}>Delivery Address</Text>

                                            {item.address ?
                                                <View>
                                                    <Text note style={styles.customText}>{item.address.no_and_street + ', '
                                                        + item.address.address_line_1 + ', '
                                                        + item.address.address_line_2},</Text>
                                                    <Text note style={styles.customText}>{item.address.city + ', ' + item.address.pin_code},</Text>
                                                </View> : null
                                            }
                                        </View>
                                    </View>
                                </Row>
                            } />
                    </Card>
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

                </Card>
            )
        }
    }

    addressRender() {
        const { patientData } = this.state
        return (
            <Card transparent>
                <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 18, padding: 5 }}>AddressInfo</Text>
                <Segment style={{ borderRadius: 5, marginTop: 5 }}>
                    <Button active={this.state.activePage === 1}
                        onPress={this.selectComponent(1)}><Text uppercase={false}>Address</Text>

                    </Button>
                    <Button active={this.state.activePage === 2}
                        onPress={this.selectComponent(2)}><Text uppercase={false}>AddNewAddress</Text>

                    </Button>
                </Segment>
                <Content padder>
                    {this.renderSelectedComponent()}
                </Content>
            </Card>

        )
    }

    render() {
        const { addressVisible } = this.state
        return (
            <Container style={styles.container}>

                <Content>
                    <Grid style={styles.curvedGrid}>

                    </Grid>

                    <Grid style={{ marginTop: -100, height: 100 }}>
                        <Row>

                            <View style={{ width: '80%', marginTop: 'auto', marginBottom: 'auto', alignItems: 'center' }}>

                                <Item style={{ borderBottomWidth: 0 }}>

                                    <Text style={{ fontFamily: 'OpenSans', color: '#fff', marginLeft: 80 }}>Paracetamal tablets</Text>
                                </Item>

                            </View>
                            <Col style={{ width: '10%' }}>
                            </Col>

                        </Row>

                    </Grid>

                    <Card transparent style={{ padding: 5, marginTop: 40 }}>
                        <Text style={styles.boldText}>Delivery</Text>
                        <Grid style={{ marginTop: 5 }}>

                            <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }}>
                                <TouchableOpacity onPress={() => {
                                    this.clickedHomeDelivery()

                                }}>
                                    <Row>
                                        <Right>
                                            <Icon name="checkmark-circle" style={{ color: '#D92B4B' }}></Icon>
                                        </Right>
                                    </Row>

                                    <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />
                                    <Text style={styles.normalText}>home delivery</Text>
                                </TouchableOpacity>
                            </Col>

                            <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }}>
                                <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />
                                <Text style={styles.normalText}>In store Pickup</Text>
                            </Col>
                        </Grid>

                        {addressVisible == true ? this.addressRender() : null}

                        <Text style={{ fontFamily: 'OpenSans', fontSize: 18, marginLeft: 15, fontWeight: "bold", marginTop: 10 }}>Notes</Text>
                        <Form style={{ padding: 5 }}>
                            <Textarea rowSpan={2} bordered placeholder="DeliveryInfo If Needed" style={{ borderRadius: 10, marginTop: 10, padding: 10, height: 80 }} />
                        </Form>

                        <Button block style={styles.CheckoutButton} onPress={() => this.props.navigation.navigate('OrderPaymentPreview',{data: this.state.deliveryArray})} testID='navigateToPaymentReviewPage'>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 15, fontWeight: "bold" }}> Proceed to pay </Text>
                        </Button>

                    </Card>
                </Content>

            </Container>

        )
    }

}

export default MedicineCheckout

const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 0
    },
    customImage: {
        height: 90,
        width: 90,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    customText:
    {
        marginLeft: 20,
        fontFamily: 'OpenSans',
        fontSize: 13,
        marginTop: 3,
        color: '#000'
    },
    curvedGrid:
    {
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

    normalText:
    {
        fontFamily: 'OpenSans',
        fontSize: 16,
        color: 'green',
        fontWeight: 'bold'
    },

    boldText:
    {
        fontFamily: 'OpenSans',
        fontSize: 18,
        color: '#000',
        marginLeft: 15,
        fontWeight: "bold"
    },

    CheckoutButton: {
        marginTop: 40,
        backgroundColor: '#775DA3',
        borderRadius: 5,

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