import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, View, Segment } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

class MedicineCheckout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addressVisible: false
        }
    }

    // deliveryPressed() {
    //     this.setState({ addressVisible: !this.state.addressVisible })
    // }

    addressRender() {
        return (
            <Card transparent>
                <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 18, padding: 5 }}>AddressInfo</Text>
                <Segment style={{ borderRadius: 5, marginTop: 5 }}>
                    <Button first active>
                        <Text uppercase={false}>DefaultAddress</Text>
                    </Button>
                    <Button>
                        <Text uppercase={false}>AddNewAddress</Text>
                    </Button>

                </Segment>

                <Grid style={{ marginTop: 10 }}>
                    <Col>
                        <Text style={{ fontSize: 16, fontFamily: 'OpenSans', marginLeft: 5 }}>First Name</Text>
                        <Input placeholder="First Name" style={styles.transparentLabel} />
                    </Col>
                    <Col>
                        <Text style={{ fontSize: 16, fontFamily: 'OpenSans', marginLeft: 5 }}>Last Name</Text>
                        <Input placeholder="Last Name" style={styles.transparentLabel} />
                    </Col>


                </Grid>


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
                        <Text style={{ fontSize: 16, fontFamily: 'OpenSans' }}> Delivery Address</Text>
                        <Textarea style={styles.transparentLabel} rowSpan={2}>Address</Textarea>

                    </Col>
                </Grid>

            </Card>

        )
    }

    render() {
        const { addressVisible } = this.state
        return (
            <Container style={styles.container}>

                <Content >

                    <Grid style={styles.curvedGrid}>

                    </Grid>

                    <Grid style={{ marginTop: -100, height: 100 }}>
                        <Row>
                            {/* <Col style={{ width: '10%', marginTop: 'auto', marginBottom: 'auto', alignItems: 'center' }}>
                                <Icon name="arrow-back" style={{ color: 'white' }}></Icon>
                            </Col> */}
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
                                    this.setState({
                                        addressVisible: !this.state.addressVisible
                                    })
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

                        <Text style={{ fontFamily: 'OpenSans', fontSize: 18, marginLeft: 15, fontWeight: "bold", marginTop: 40 }}>Notes</Text>
                        <Form style={{ padding: 5 }}>
                            <Textarea rowSpan={2} bordered placeholder="DeliveryInfo If Needed" style={{ borderRadius: 10, marginTop: 10, padding: 10, height: 80 }} />
                        </Form>


                        <Button onPress={() => this.props.navigation.navigate('MedicinePaymentPage')} block style={styles.CheckoutButton}><Text style={{
                            fontFamily: 'OpenSans', fontSize: 15,
                            fontWeight: "bold"
                        }}>Proceed to pay</Text></Button>

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
    }
});