
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Title, Left, Body, Card, View, Text, Content, Col, Icon } from 'native-base';

class Notification extends Component {
    render() {
        return (
            < Container style={styles.container} >
                <Content>
                    <Header style={{ backgroundColor: '#7f49c3' }}>
                        <Left>
                            <Icon size={30} color={'#fff'} name={'arrow-back'} />
                        </Left>
                        <Body>
                            <Title style={{ fontFamily: 'OpenSans', }} >Notifications</Title>
                        </Body>
                    </Header>

                    {/* <Card style={{ borderRadius: 5, padding: 10, width: 'auto', height: 580, justifyContent: 'center' }}> */}


                    {/* <Card style={{ borderWidth: 1, borderColor: '#c9cdcf', width: 80, height: 80, backgroundColor: '#f5e6ff', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                            <Icon style={{ marginLeft: 3, marginLeft: 'auto', marginRight: 'auto', fontSize: 40 }} name={'notifications-off'} />


                        </Card>
                        <Text style={{ marginLeft: 25, marginLeft: 'auto', marginRight: 'auto', fontWeight: 'bold', marginTop: 5 }}>

                            No  Notifications
                             </Text> */}

                    {/* </Card> */}
                    <Card style={{ borderRadius: 5, width: 'auto', }}>
                        <View style={{ borderWidth: 1, borderColor: '#c9cdcf', marginTop: 10 }} />

                        <View style={{ backgroundColor: '#f5e6ff', }}>
                            <Col>
                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans',
                                    marginLeft: 300, marginTop: 5
                                }}>1 day</Text>

                            </Col>

                            <Col style={{}}>

                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans', marginTop: 5,
                                    color: '#000', marginLeft: 20, marginRight: 20
                                }}> Appointment  booked Sucessfully and your date is 7th june 2020  </Text>



                            </Col>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: '#c9cdcf' }} />
                        <View >
                            <Col>
                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans',
                                    marginLeft: 300, marginTop: 5
                                }}>1 day</Text>

                            </Col>

                            <Col style={{}}>

                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans', marginTop: 5,
                                    color: '#000', marginLeft: 20, marginRight: 20
                                }}> Appointment  booked Sucessfully and your date is 7th june 2020  </Text>



                            </Col>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: '#c9cdcf' }} />
                        <View >
                            <Col>
                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans',
                                    marginLeft: 300, marginTop: 5
                                }}>1 day</Text>

                            </Col>

                            <Col style={{}}>

                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans', marginTop: 5,
                                    color: '#000', marginLeft: 20, marginRight: 20
                                }}> Appointment  booked Sucessfully and your date is 7th june 2020  </Text>



                            </Col>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: '#c9cdcf' }} />
                        <View >
                            <Col>
                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans',
                                    marginLeft: 300, marginTop: 5
                                }}>1 day</Text>

                            </Col>

                            <Col style={{}}>

                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans', marginTop: 5,
                                    color: '#000', marginLeft: 20, marginRight: 20
                                }}> Appointment  booked Sucessfully and your date is 7th june 2020  </Text>



                            </Col>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: '#c9cdcf' }} />
                        <View style={{ backgroundColor: '#f5e6ff' }}>
                            <Col>
                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans',
                                    marginLeft: 300, marginTop: 5
                                }}>1 day</Text>

                            </Col>

                            <Col style={{}}>

                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans', marginTop: 5,
                                    color: '#000', marginLeft: 20, marginRight: 20
                                }}> Appointment  booked Sucessfully and your date is 7th june 2020  </Text>



                            </Col>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: '#c9cdcf' }} />
                        <View style={{ backgroundColor: '#f5e6ff' }}>
                            <Col>
                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans',
                                    marginLeft: 300, marginTop: 5
                                }}>1 day</Text>

                            </Col>

                            <Col style={{}}>

                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans', marginTop: 5,
                                    color: '#000', marginLeft: 20, marginRight: 20
                                }}> Appointment  booked Sucessfully and your date is 7th june 2020  </Text>



                            </Col>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: '#c9cdcf' }} />
                        <View >
                            <Col>
                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans',
                                    marginLeft: 300, marginTop: 5
                                }}>1 day</Text>

                            </Col>

                            <Col style={{}}>

                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans', marginTop: 5,
                                    color: '#000', marginLeft: 20, marginRight: 20
                                }}> Appointment  booked Sucessfully and your date is 7th june 2020  </Text>



                            </Col>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: '#c9cdcf' }} />
                        <View style={{ backgroundColor: '#f5e6ff' }}>
                            <Col>
                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans',
                                    marginLeft: 300, marginTop: 5
                                }}>1 day</Text>

                            </Col>

                            <Col style={{}}>

                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans', marginTop: 5,
                                    color: '#000', marginLeft: 20, marginRight: 20
                                }}> Appointment  booked Sucessfully and your date is 7th june 2020  </Text>



                            </Col>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: '#c9cdcf' }} />
                        <View >
                            <Col>
                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans',
                                    marginLeft: 300, marginTop: 5
                                }}>1 day</Text>

                            </Col>

                            <Col style={{}}>

                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans', marginTop: 5,
                                    color: '#000', marginLeft: 20, marginRight: 20
                                }}> Appointment  booked Sucessfully and your date is 7th june 2020  </Text>



                            </Col>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: '#c9cdcf' }} />
                        <View style={{ backgroundColor: '#f5e6ff' }}>
                            <Col>
                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans',
                                    marginLeft: 300, marginTop: 5
                                }}>1 day</Text>

                            </Col>

                            <Col style={{}}>

                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans', marginTop: 5,
                                    color: '#000', marginLeft: 20, marginRight: 20
                                }}> Appointment  booked Sucessfully and your date is 7th june 2020  </Text>



                            </Col>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: '#c9cdcf' }} />
                        <View style={{ backgroundColor: '#f5e6ff' }}>
                            <Col>
                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans',
                                    marginLeft: 300, marginTop: 5
                                }}>1 day</Text>

                            </Col>

                            <Col style={{}}>

                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans', marginTop: 5,
                                    color: '#000', marginLeft: 20, marginRight: 20
                                }}> Appointment  booked Sucessfully and your date is 7th june 2020  </Text>



                            </Col>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: '#c9cdcf' }} />
                        <View style={{ backgroundColor: '#f5e6ff' }}>
                            <Col>
                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans',
                                    marginLeft: 300, marginTop: 5
                                }}>1 day</Text>

                            </Col>

                            <Col style={{}}>

                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans', marginTop: 5,
                                    color: '#000', marginLeft: 20, marginRight: 20
                                }}> Appointment  booked Sucessfully and your date is 7th june 2020  </Text>



                            </Col>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: '#c9cdcf' }} />
                        <View style={{ backgroundColor: '#f5e6ff' }}>
                            <Col>
                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans',
                                    marginLeft: 300, marginTop: 5
                                }}>1 day</Text>

                            </Col>

                            <Col style={{}}>

                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans', marginTop: 5,
                                    color: '#000', marginLeft: 20, marginRight: 20
                                }}> Appointment  booked Sucessfully and your date is 7th june 2020  </Text>



                            </Col>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: '#c9cdcf' }} />
                        <View style={{ backgroundColor: '#f5e6ff' }}>
                            <Col>
                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans',
                                    marginLeft: 300, marginTop: 5
                                }}>1 day</Text>

                            </Col>

                            <Col style={{}}>

                                <Text style={{
                                    fontSize: 15, fontFamily: 'OpenSans', marginTop: 5,
                                    color: '#000', marginLeft: 20, marginRight: 20
                                }}> Appointment  booked Sucessfully and your date is 7th june 2020  </Text>



                            </Col>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: '#c9cdcf' }} />

                    </Card>

                </Content>
            </Container >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 5

    },

    card: {
        width: 'auto',
        borderRadius: 100

    },
    title: {
        paddingLeft: 40, paddingTop: 10

    },




})
export default Notification



