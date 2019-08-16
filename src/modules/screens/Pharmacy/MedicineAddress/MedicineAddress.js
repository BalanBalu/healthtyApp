import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View, Radio } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
class MedicineAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        var address = [{
            name: 'bala', email: 'balan@gmail.com', Ph: 7234567780, housename: 'kkr', PO: 'ambattur',
            city: 'chennai', Pincode: 600053
        }, {
            name: 'balu', email: 'balu@gmail.com', Ph: 8234567780, housename: 'ppr', PO: 'ambattur',
            city: 'chennai', Pincode: 600053,
        }]

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
                                <Text style={styles.normalText}>Jan 24,2019</Text>
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
                        <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 16, padding: 5 }}>AddressInfo</Text>
                        <Segment>
                            <Button first active>
                                <Text uppercase={false}>DefaultAddress</Text>
                            </Button>
                            <Button>
                                <Text uppercase={false}>AddNewAddress</Text>
                            </Button>

                        </Segment>
                        <FlatList
                            data={address}
                            renderItem={
                                ({ item }) =>
                                    <Card style={{ padding: 10, marginTop: 20 }}>

                                        <Row>
                                            <Col style={{ width: '6%' }}>
                                                <Radio selected={false} />
                                            </Col>
                                            <Col style={{ width: '95%' }}>
                                                <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginLeft: 20, marginTop: 3, fontWeight: 'bold' }}>{item.name}</Text>
                                            </Col>
                                        </Row>
                                        <Text style={styles.customText}>{item.email}</Text>
                                        <Text style={styles.customText}>{item.Ph}</Text>


                                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginLeft: 40, marginTop: 4, fontWeight: 'bold' }}>Delivery Address</Text>


                                        <Row>
                                            <Text style={styles.customText}>{item.housename}
                                            </Text>
                                            <Text style={styles.customSubText}>{item.PO}
                                            </Text>
                                        </Row>
                                        <Row>
                                            <Text style={styles.customText}>{item.city}</Text>
                                            <Text style={styles.customSubText}>Pincode:{item.Pincode}</Text>
                                        </Row>




                                    </Card>
                            } />

                        {/* <Grid style={{ marginTop: 10 }}>
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
                        <Button onPress={() => this.props.navigation.navigate('MedicinePaymentResult')} block style={styles.loginButton}><Text>Continue</Text></Button> */}
                    </Card>

                </Content>
            </Container >
        );
    }
}

export default MedicineAddress;

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
});