import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, } from 'react-native';

class MedicineCheckout extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
    }
    render() {


        return (

            <Container style={styles.container}>

                <Content >

                    <Grid style={styles.curvedGrid}>

                    </Grid>

                    <Grid style={{ marginTop: -150, height: 100 }}>
                        <Row>
                            <Col style={{ width: '10%', marginTop: 'auto', marginBottom: 'auto', alignItems: 'center' }}>
                                <Icon name="arrow-back" style={{ color: 'white' }}></Icon>
                            </Col>
                            <Col style={{ width: '80%', marginTop: 'auto', marginBottom: 'auto', alignItems: 'center' }}>

                                <Item style={{ borderBottomWidth: 0 }}>

                                    <Text style={{ fontFamily: 'opensans-regular', color: '#fff' }}>Paracetamal tablets</Text>
                                </Item>

                            </Col>
                            <Col style={{ width: '10%' }}>
                            </Col>

                        </Row>

                    </Grid>
                    <Card transparent style={{ padding: 10, marginTop: 60 }}>

                        <Text style={styles.boldText}>Quantity</Text>
                        <Item style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', marginTop: 10, borderRadius: 5 }}>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }}
                                placeholder="Select your SIM"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"

                            >
                                <Picker.Item label="1" value="key0" />
                                <Picker.Item label="2" value="key1" />

                            </Picker>
                        </Item>

                        <Text style={styles.boldText}>Delivery</Text>
                        <Grid >

                            <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }}>
                                <Row>
                                    <Right>
                                        <Icon name="checkmark-circle" style={{ color: '#D92B4B' }}></Icon>
                                    </Right>
                                </Row>

                                <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />
                                <Text style={styles.normalText}>home delivery</Text>
                            </Col>

                            <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }}>
                                <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />
                                <Text style={styles.normalText}>In store Pickup</Text>
                            </Col>
                        </Grid>


                        <Text style={styles.boldText}>Prescription</Text>
                        <Grid >

                            <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }}>


                                <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />
                                <Text style={styles.normalText}>once</Text>
                            </Col>

                            <Col style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Item style={{ borderWidth: 0, marginLeft: 'auto', marginRight: 'auto' }}>

                                    <Button style={styles.loginButton}><Text style={{ fontFamily: 'opensans-regular', fontSize: 14, color: '#fff' }}>upload</Text></Button>
                                </Item>
                            </Col>
                        </Grid>


                        <Text style={styles.boldText}>Notes</Text>
                        <Form>
                            <Textarea rowSpan={2} bordered placeholder="DeliveryInfo If Needed" style={{ borderRadius: 10 }} />
                        </Form>

                        <Grid style={{ marginTop: 10 }}>
                            <Col style={{ width: '30%' }}>
                                <Text style={styles.normalText}>Total</Text>
                            </Col>
                            <Col style={{ width: '40%', alignItems: 'center' }}>
                            </Col>
                            <Col style={{ width: '30%', alignItems: 'center' }}>
                                <Text style={styles.boldText}>Rs.100</Text>
                            </Col>
                        </Grid>

                        <Button block style={styles.loginButton}><Text>Checkout</Text></Button>

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
export default connect(homeState)(MedicineCheckout)


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
        height: 800,
        marginLeft: -200,
        marginTop: -600,
        position: 'relative',
        bottom: 0,
        overflow: 'hidden',
        backgroundColor: '#745DA6'
    },

    normalText:
    {
        fontFamily: 'opensans-regular',
        fontSize: 16,
        color: 'green',
        fontWeight: 'bold'
    },

    boldText:
    {
        fontFamily: 'opensans-regular',
        fontSize: 16,
        color: '#000',
        marginLeft: 20,
        fontWeight: "bold"
    },

    loginButton: {
        marginTop: 12,
        backgroundColor: '#775DA3',
        borderRadius: 5,
    },
});