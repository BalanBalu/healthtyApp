import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image } from 'react-native';

class MedicinePaymentResult extends Component {
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

                                    <Text style={{ fontFamily: 'opensans-regular', color: '#fff' }}>CHECKOUT</Text>
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

                        <Grid>
                            <Col style={{ alignItems: 'center', width: '20%' }}>
                                <Text style={styles.badgeText}>1</Text>
                            </Col>
                            <Col style={{ alignItems: 'center', width: '60%' }}>
                                <Text style={{ fontFamily: 'opensans-regular', fontWeight: 'bold', fontSize: 18, padding: 5 }}>ContactInfo</Text>
                            </Col>
                            <Col style={{ alignItems: 'center', width: '20%' }}>
                                <Text style={{ fontFamily: 'opensans-regular', color: 'red', marginTop: 5 }}>Edit</Text>
                            </Col>
                        </Grid>

                        <Card style={{ borderRadius: 10, padding: 10 }}>
                            <Grid style={{ marginTop: 10 }}>
                                <Form>
                                    <Text style={styles.labelTop}>
                                        Name
                             </Text>
                                    <Text style={styles.customText}>
                                        Sourav Ganguly
                             </Text>
                                </Form>
                            </Grid>


                            <Grid>
                                <Form style={{ marginTop: 10 }}>
                                    <Text style={styles.labelTop}>
                                        Phone No
                             </Text>
                                    <Text style={styles.customText}>
                                        9986754321
                             </Text>
                                </Form>
                            </Grid>


                            <Grid>
                                <Form style={{ marginTop: 10 }}>
                                    <Text style={styles.labelTop}>
                                        Phone No
                             </Text>
                                    <Text style={styles.customText}>
                                        theivamagan@gmail.com
                             </Text>
                                </Form>
                            </Grid>


                            <Grid>
                                <Form style={{ marginTop: 10 }}>
                                    <Text style={styles.labelTop}>
                                        Address
                             </Text>
                                    <Text style={styles.customText}>
                                        81/3, northern east street,
                                        Annannagar,
                                        chennai-40
                             </Text>
                                </Form>
                            </Grid>

                        </Card>

                        <Grid style={{ marginTop: 10 }}>
                            <Col style={{ alignItems: 'center', width: '20%' }}>
                                <Text style={styles.badgeText}>1</Text>
                            </Col>
                            <Col style={{ alignItems: 'center', width: '60%' }}>
                                <Text style={{ fontFamily: 'opensans-regular', fontWeight: 'bold', fontSize: 18, padding: 5 }}>PaymentInfo</Text>
                            </Col>
                            <Col style={{ alignItems: 'center', width: '20%' }}>
                                <Text style={{ fontFamily: 'opensans-regular', color: 'red', marginTop: 5 }}>Edit</Text>
                            </Col>
                        </Grid>

                        <Card style={{ borderRadius: 10, padding: 10 }}>


                            <Grid style={{ marginTop: 10 }}>
                                <Col style={{ width: '25%', alignItems: 'center' }}>
                                    <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} /></Col>
                                <Col style={{ width: '75%' }}>
                                    <Text style={styles.labelTop}> you will need to confirm the payment after the formation of order</Text>
                                </Col>
                            </Grid>

                            <Grid>
                                <Col>
                                    <Form style={{ marginTop: 10 }}>
                                        <Text style={styles.labelTop}>
                                            CARDHOLDER NAME
                             </Text>
                                        <Text style={styles.customText}>
                                            SOURAV GANGULY
                             </Text>
                                    </Form>
                                </Col>

                                <Col>
                                    <Form style={{ marginTop: 10 }}>
                                        <Text style={styles.labelTop}>
                                            CARD NUMBER
                             </Text>
                                        <Text style={styles.customText}>
                                            9876 5432 7865 1234
                             </Text>
                                    </Form>
                                </Col>
                            </Grid>

                            <Grid>
                                <Col>
                                    <Form style={{ marginTop: 10 }}>
                                        <Text style={styles.labelTop}>
                                            CVV
                             </Text>
                                        <Text style={styles.customText}>
                                            21/12
                             </Text>
                                    </Form>
                                </Col>

                                <Col>
                                    <Form style={{ marginTop: 10 }}>
                                        <Text style={styles.labelTop}>
                                            EXPIRED DATE
                             </Text>
                                        <Text style={styles.customText}>
                                            24/6
                             </Text>
                                    </Form>
                                </Col>
                            </Grid>
                        </Card>

                        <Grid style={{ marginTop: 10 }}>
                            <Col style={{ alignItems: 'center', width: '20%' }}>
                                <Text style={styles.badgeText}>1</Text>
                            </Col>
                            <Col style={{ alignItems: 'center', width: '60%' }}>
                                <Text style={{ fontFamily: 'opensans-regular', fontWeight: 'bold', fontSize: 18, padding: 5 }}>Your Order</Text>
                            </Col>
                            <Col style={{ alignItems: 'center', width: '20%' }}>
                                <Text style={{ fontFamily: 'opensans-regular', color: 'red', marginTop: 5 }}>Edit</Text>
                            </Col>
                        </Grid>

                        <Card style={{ marginTop: 10, padding: 5 }}>
                            <Grid >

                                <Col style={{ width: '20%' }}>
                                    <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} />
                                </Col>
                                <Col style={{ width: '50%', justifyContent: 'center' }}>
                                    <Text style={styles.labelTop}>Alive easy open athritis tablets</Text>
                                </Col>
                                <Col style={{ width: '10%', justifyContent: 'center' }}>
                                    <Text style={styles.labelTop}>X 2</Text>
                                </Col>
                                <Col style={{ width: '20%', justifyContent: 'center' }}>
                                    <Text style={styles.labelTop}>RS.300</Text>
                                </Col>
                            </Grid>
                        </Card>
                        <Card style={{ marginTop: 10, padding: 5 }}>
                            <Grid >

                                <Col style={{ width: '20%' }}>
                                    <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} />
                                </Col>
                                <Col style={{ width: '50%', justifyContent: 'center' }}>
                                    <Text style={styles.labelTop}>Alive easy open athritis tablets</Text>
                                </Col>
                                <Col style={{ width: '10%', justifyContent: 'center' }}>
                                    <Text style={styles.labelTop}>X 2</Text>
                                </Col>
                                <Col style={{ width: '20%', justifyContent: 'center' }}>
                                    <Text style={styles.labelTop}>RS.300</Text>
                                </Col>
                            </Grid>
                        </Card>



                    </Card>
                </Content>
                <Footer>
                    <FooterTab style={{ backgroundColor: '#7E49C3' }}>
                        <Button >
                            <Icon name="apps" />
                        </Button>
                        <Button>
                            <Icon name="chatbubbles" />
                        </Button>
                        <Button >
                            <Icon active name="notifications" />
                        </Button>
                        <Button>
                            <Icon name="person" />
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>

        )
    }

}

function homeState(state) {

    return {
        user: state.user
    }
}
export default connect(homeState)(MedicinePaymentResult)


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
        fontFamily: 'opensans-regular',
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold'
    },
    customText:
    {
        fontFamily: 'opensans-regular',
        fontSize: 16,
        color: '#2F3940',
        fontWeight: 'bold'
    },
    labelTop:
    {
        fontFamily: 'opensans-regular',
        fontSize: 14,
        color: 'gray',

    },
    transparentLabel:
    {

        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'opensans-regular',
        margin: 2,
    },
    badgeText:
    {
        height: 30,
        width: 30,
        backgroundColor: 'red',
        borderRadius: 15,
        color: '#fff',
        paddingLeft: 10,
        paddingTop: 5

    }
});