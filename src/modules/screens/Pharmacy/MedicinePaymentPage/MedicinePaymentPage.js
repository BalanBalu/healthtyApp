import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image } from 'react-native';

class MedicinePaymentPage extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
    }

    render() {


        return (

            <Container style={styles.container}>

                <Content style={styles.bodyContent}>

                    <Grid style={styles.curvedGrid}>

                    </Grid>

                    <Item style={{ bottom: 100, borderBottomWidth: 0, marginTop: -80 }}>
                        <Row >
                            <Col style={{ width: '10%', marginTop: 'auto', marginBottom: 'auto', alignItems: 'center' }}>
                                <Icon name="arrow-back" style={{ color: 'white' }}></Icon>
                            </Col>
                            <Col style={{ width: '80%', marginTop: 'auto', marginBottom: 'auto', alignItems: 'center' }}>

                                <Item style={{ borderBottomWidth: 0 }}>

                                    <Text style={{ fontFamily: 'OpenSans', color: '#fff' }}>Paracetamal tablets</Text>
                                </Item>

                            </Col>
                            <Col style={{ width: '10%' }}>
                            </Col>

                        </Row>

                    </Item>

                    <Card transparent style={{ marginTop: -70 }}>
                        <Grid >
                            <Col style={{ width: '30%', alignItems: 'center' }}>
                                <Text style={styles.normalText}>Date</Text>
                            </Col>
                            <Col style={{ width: '40%', alignItems: 'center' }}>
                            </Col>
                            <Col style={{ width: '30%', alignItems: 'center' }}>
                                <Text style={styles.normalText}>Jan 24,2019</Text>
                            </Col>
                        </Grid>

                        <Grid style={{ marginTop: 10 }}>
                            <Col style={{ width: '30%', alignItems: 'center' }}>
                                <Text style={styles.normalText}>TotalBill</Text>
                            </Col>
                            <Col style={{ width: '40%', alignItems: 'center' }}>
                            </Col>
                            <Col style={{ width: '30%', alignItems: 'center' }}>
                                <Text style={styles.normalText}>Rs.100</Text>
                            </Col>
                        </Grid>
                    </Card>



                    <Card transparent style={{ padding: 10, marginTop: 60 }}>
                        <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 16, padding: 5 }}>AddressInfo</Text>
                        <Segment>
                            <Button first active>
                                <Text uppercase={false}>DefaultAddress</Text>
                            </Button>
                            <Button>
                                <Text uppercase={false}>AddNewAddress</Text>
                            </Button>

                        </Segment>

                        <Grid style={{ marginTop: 10 }}>
                            <Col>
                                <Text style={styles.labelTop}>First Name</Text>
                                <Input placeholder="First Name" style={styles.transparentLabel} />
                            </Col>
                            <Col>
                                <Text style={styles.labelTop}>Last Name</Text>
                                <Input placeholder="Last Name" style={styles.transparentLabel} />
                            </Col>


                        </Grid>


                        <Grid style={{ marginTop: 5 }}>
                            <Col>
                                <Text style={styles.labelTop}>E-mail</Text>
                                <Input placeholder="E-mail" style={styles.transparentLabel} />
                            </Col>
                            <Col>
                                <Text style={styles.labelTop}>Phone</Text>
                                <Input placeholder="Phone" style={styles.transparentLabel} />
                            </Col>

                        </Grid>
                        <Grid style={{ marginTop: 5 }}>
                            <Col>
                                <Text style={styles.labelTop}>Phone</Text>
                                <Textarea style={styles.transparentLabel} rowSpan={2}>Address</Textarea>

                            </Col>
                        </Grid>



                        <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 16, padding: 5 }}>PaymentInfo</Text>
                        <Segment>
                            <Button first active>
                                <Text uppercase={false}>DefaultCard</Text>
                            </Button>
                            <Button>
                                <Text uppercase={false}>AddNewCard</Text>
                            </Button>

                        </Segment>


                        <Grid style={{ padding: 5, margin: 10 }}>
                            <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }}>
                                <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} /></Col>


                            <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }}>
                                <Image source={{ uri: 'https://s3.amazonaws.com/peoplepng/wp-content/uploads/2018/03/20133416/Free-Credit-Card-Visa-And-Master-Card-PNG-Transparent-Image-1024x668.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} /></Col>


                            <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }}>
                                <Image source={{ uri: 'https://cdn.freebiesupply.com/logos/large/2x/cirrus-3-logo-png-transparent.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} /></Col>

                        </Grid>

                        <Grid style={{ marginTop: 5 }}>
                            <Col>
                                <Text style={styles.labelTop}>CardHolderName</Text>
                                <Input placeholder="CardHolderName" style={styles.transparentLabel} />

                            </Col>
                        </Grid>

                        <Grid style={{ marginTop: 5 }}>
                            <Col>
                                <Text style={styles.labelTop}>CardNumber</Text>
                                <Input placeholder="CardNumber" style={styles.transparentLabel} />
                            </Col>
                        </Grid>
                        <Grid style={{ marginTop: 5 }}>
                            <Col>
                                <Text style={styles.labelTop}>CVV</Text>
                                <Input placeholder="CVV" style={styles.transparentLabel} />
                            </Col>
                            <Col>
                                <Text style={styles.labelTop}>ExpiredDate</Text>
                                <Input placeholder="ExpiredDate" style={styles.transparentLabel} />
                            </Col>

                        </Grid>

                        <Item style={{ borderBottomWidth: 0, margintop: 5 }}>
                            <CheckBox checked={true} color="green"  ></CheckBox>
                            <Text style={{ marginLeft: 15, color: 'gray', fontFamily: 'OpenSans' }}>Save creditcard Information</Text>
                        </Item>

                        <Button onPress={() => this.props.navigation.navigate('MedicinePaymentResult')} block style={styles.loginButton}><Text>Continue</Text></Button>
                    </Card>
                </Content>

            </Container>

        )
    }

}


export default MedicinePaymentPage


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
        height: 800,
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
    }
});