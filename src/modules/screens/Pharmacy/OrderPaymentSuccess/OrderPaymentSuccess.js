import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image } from 'react-native';
import {primaryColor} from '../../../../setup/config'

class OrderPaymentSuccess extends Component {
    constructor(props) {
        super(props)
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

                                    <Text style={{ fontFamily: 'OpenSans', color: '#fff' }}>CONFIRMATION</Text>
                                </Item>

                            </Col>
                            <Col style={{ width: '10%' }}>
                            </Col>

                        </Row>

                    </Item>


                    <Card transparent style={{ padding: 10, marginTop: 60 }}>

                        <Card style={{ borderRadius: 10, padding: 10 }}>

                            <Grid style={{ padding: 5, margin: 10 }}>
                                <Col style={{ width: '25%', alignItems: 'center' }}>
                                    <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} />
                                </Col>

                                <Col style={{ width: '25%', alignItems: 'center' }}>

                                </Col>

                                <Col style={{ width: '50%', alignItems: 'center', marginTop: 10 }}>
                                    <Text style={styles.labelTop}> 9988 5643 2156</Text>
                                </Col>
                            </Grid>

                            <Grid style={{ marginTop: 10 }}>
                                <Image source={{ uri: 'https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Tick_Mark_Circle-512.png' }} style={styles.customImage} />
                            </Grid>



                            <Text style={{ marginTop: 20, fontFamily: 'OpenSans', color: 'gray', textAlign: 'center' }}> Your Confirmation Is Successful</Text>
                        </Card>

                        <Button block style={styles.loginButton}><Text>Home</Text></Button>
                    </Card>
                </Content>

            </Container>

        )
    }

}

export default OrderPaymentSuccess


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
        flex: 1
    },

    bodyContent: {
        padding: 0,
        flex: 1
    },
    customImage: {
        height: 60,
        width: 60,
        marginLeft: 'auto',
        marginRight: 'auto',

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
        backgroundColor: primaryColor,
        borderRadius: 5,
    },

    labelTop:
    {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#000',


    },

});