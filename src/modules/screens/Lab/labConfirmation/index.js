import React, { Component } from 'react';
import { Container, Content, Text, Button, Toast, Item, List, ListItem, Card, Input, Left, Segment, CheckBox, View, Radio, Footer, FooterTab } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TouchableOpacity, Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { RadioButton, Checkbox } from 'react-native-paper';


class labConfirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            itemSelected: 'itemOne',
            checked: false,
            gender: 'M',

        };
    }

    deliveryChoose() {
        this.setState({ homeDelivery: true })
    }
    pickUpStoreChoose() {
        this.setState({ pickUpStore: true })
    }

    render() {
        const { currentDate } = this.state
        const { checked, gender } = this.state;
        const detail = [{ name: 'S.Mukesh Kannan(Male)', age: 26 }, { name: 'U.Ajay Kumar(Male)', age: 26 }]
        const patientdetails = [{ name: 'S.Mukesh Kannan', address: 'No 67, Gandhi taurrent,OT Bus Stand,Ambattur - 600051', Mobile: '9865224832' }, { name: 'S.Mukesh Kannan', address: 'No 67, Gandhi taurrent,OT Bus Stand,Ambattur - 600051', Mobile: '9865224832' }]
        return (
            <Container>
                <Content style={{ backgroundColor: '#F5F5F5', padding: 10 }}>

                    <View style={{ backgroundColor: '#fff', padding: 10 }}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>For Whom do you need to take up the test?</Text>

                        <Row style={{ marginTop: 5 }}>
                            <Col size={10}>
                                <Row>
                                    <Col size={3}>
                                        <Row style={{ alignItems: 'center' }}>
                                            <Checkbox color="#775DA3"
                                                status={checked ? 'checked' : 'unchecked'}
                                                onPress={() => { this.setState({ checked: !checked }); }}
                                            />
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000' }}>Self</Text>
                                        </Row>
                                    </Col>
                                    <Col size={3}>
                                        <Row style={{ alignItems: 'center' }}>
                                            <Checkbox color="#775DA3"
                                                status={checked ? 'checked' : 'unchecked'}
                                                onPress={() => { this.setState({ checked: !checked }); }}
                                            />
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000' }}>Others</Text>
                                        </Row>
                                    </Col>
                                    <Col size={4}>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Add other patient's details</Text>
                            <Row style={{ marginTop: 10 }}>
                                <Col size={6}>
                                    <Row>
                                        <Col size={2}>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', marginTop: 5 }}>Name</Text>
                                        </Col>
                                        <Col size={8} >
                                            <Input placeholder="Enter patient's name" style={{ backgroundColor: '#f2f2f2', color: '#f2f2f2', fontSize: 10, height: 33, }}
                                                returnKeyType={'next'}
                                                keyboardType={"number-pad"}
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
                                            <Input placeholder="patient's age" style={{ backgroundColor: '#f2f2f2', color: '#f2f2f2', fontSize: 10, height: 33, }}
                                                returnKeyType={'next'}
                                                keyboardType={"number-pad"}
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
                        </View>

                        <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <TouchableOpacity style={styles.touchStyle}>
                                <Text style={styles.touchText}>Add patient</Text>
                            </TouchableOpacity>
                        </Row>
                    </View>

                    <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Patient Details</Text>

                        <FlatList
                            data={detail}
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
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000' }}>{item.name}</Text>

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




                    <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                        <Row>
                            <Col size={7}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 14, fontWeight: '500' }}>Home Delivery <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#909090' }}>(Test Result)</Text></Text>
                            </Col>
                            <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                <RadioButton.Group onValueChange={value => this.setState({ itemSelected: 'itemOne' })}
                                    value={this.state.itemSelected == 'itemOne'}  >
                                    <RadioButton value={this.state.itemSelected == 'itemOne'} />
                                </RadioButton.Group>
                            </Col>
                        </Row>
                        {this.state.itemSelected === 'itemOne' ?
                            <View>
                                <Row style={{ marginTop: 5 }}>
                                    <Col size={5}>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Delivery Address</Text>
                                    </Col>
                                    <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                        <TouchableOpacity>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#ff4e42' }}>Add new Address</Text>
                                        </TouchableOpacity>
                                    </Col>
                                </Row>
                                <FlatList
                                    data={patientdetails}
                                    renderItem={({ item }) =>
                                        <Row style={{ borderBottomColor: '#909090', borderBottomWidth: 0.3, paddingBottom: 10 }}>
                                            <Col size={9}>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '300', marginTop: 5 }}>{item.name}</Text>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2, color: '#6a6a6a' }}>{item.address}</Text>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2 }}>Mobile - {item.Mobile}</Text>
                                            </Col>
                                            <Col size={1} style={{ justifyContent: 'center' }}>
                                                <RadioButton.Group
                                                >
                                                    <RadioButton value={this.state.itemSelected == 'itemTwo'} />
                                                </RadioButton.Group>
                                            </Col>
                                        </Row>
                                    } />

                            </View> :
                            null}
                    </View>

                    <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                        <Row>
                            <Col size={7}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 14, fontWeight: '500' }}>Pick up at Lab<Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#909090' }}>(Test Result)</Text></Text>
                            </Col>
                            <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                <RadioButton.Group onValueChange={value => this.setState({ itemSelected: 'itemTwo' })}
                                >
                                    <RadioButton value={this.state.itemSelected == 'itemTwo'} />
                                </RadioButton.Group>
                            </Col>
                        </Row>
                        {this.state.itemSelected === 'itemTwo' ?
                            <View>
                                <Row>
                                    <Col size={5}>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Store Address</Text>
                                    </Col>
                                    <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                    </Col>
                                </Row>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '300', marginTop: 5 }}>Apollo Pharmacy</Text>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2, color: '#6a6a6a' }}>No 67, Gandhi taurrent,OT Bus Stand,Ambattur - 600051</Text>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2 }}>Mobile - 9865224832</Text>
                            </View> :
                            null}

                    </View>
                    <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Package Details</Text>
                        <Row style={{ marginTop: 10 }}>
                            <Col size={8}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#6a6a6a' }}>Full body check up test
                               <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#8dc63f' }}>(1 person)</Text>
                                </Text>

                            </Col>
                            <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>₹ 180.00</Text>

                            </Col>
                        </Row>
                        <Row style={{ marginTop: 5 }}>
                            <Col size={8}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#6a6a6a' }}>Tax</Text>
                            </Col>
                            <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#ff4e42', textAlign: 'right' }}>₹ 50.00</Text>

                            </Col>
                        </Row>
                        <Row style={{ marginTop: 5 }}>
                            <Col size={8}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#6a6a6a' }}>Delivery charges</Text>
                            </Col>
                            <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#ff4e42', textAlign: 'right' }}>₹ 26.00</Text>

                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col size={8}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '500' }}>Amount to be Paid</Text>
                            </Col>
                            <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>₹ 256.00</Text>

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
                                    <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#000', fontWeight: '400' }}>Total - ₹ 256.00</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#8dc63f' }}>
                                <TouchableOpacity>
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