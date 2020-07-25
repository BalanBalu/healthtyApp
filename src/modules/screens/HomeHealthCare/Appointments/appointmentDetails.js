import React, { PureComponent } from 'react';
import { Container, Content, Text, Toast, Button, ListItem, Card, Thumbnail, List, Item, Input, Left, Right, Icon, CardItem } from 'native-base';
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage, FlatList, ImageBackground, Alert, Linking } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid'
import StarRating from 'react-native-star-rating';
import styles from '../Styles'


class AppointmentDetails extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: 0,
        }
    }


    render() {
        const data = [{ token_no: 1234, name: 'Nurse Hamington MBBS', date: "Sunday,June 28-2020  11:10 am" }]
        const patientDetails = [{ name: 'Marie Curie', Age: 26, gender: 'Female' }, { name: 'Johnson', Age: 26, gender: 'Male' }]

        return (
            <Container>
                <Content style={{ margin: 10 }}>
                    <View style={{ marginBottom: 20 }}>
                        <Card style={{
                            borderRadius: 10,
                        }}>
                            <Grid style={styles.cardItem}>
                                <Row style={{ justifyContent: 'flex-end', marginRight: 10, marginTop: 10 }}>

                                    <Text style={{ textAlign: 'right', fontSize: 14, }} >{"Ref no :" + "12345678"}</Text>

                                </Row>
                                <Row style={{ marginLeft: 10, marginRight: 10 }}>
                                    <Col style={{ width: '22%', justifyContent: 'center', marginTop: 10 }}>
                                        <TouchableOpacity>
                                            <Thumbnail circular source={require('../../../../../assets/images/profile_male.png')} style={{ height: 60, width: 60 }} />
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: '77%', marginTop: 10 }}>
                                        <Row>
                                            <Col size={9}>
                                                <Text style={styles.Textname} >Nurse Hamington MBBS</Text>
                                                <Text note style={{ fontSize: 13, fontFamily: 'OpenSans', fontWeight: 'normal', color: '#4c4c4c' }}>M.D.S</Text>
                                                <Text style={styles.specialistTextStyle} >Primary Care Doctor,Dentist,Psychiatrist,Cosmetology,Veterinary </Text>
                                            </Col>
                                            <Col size={1}>
                                            </Col>
                                        </Row>
                                        <Row style={{ alignSelf: 'flex-start' }}>

                                        </Row>
                                        {/* <Text style={styles. cardItemText2}>{getUserGenderAndAge(data && data.userInfo)}</Text>  */}
                                    </Col>
                                </Row>
                            </Grid>
                            <Grid style={{ marginTop: 10 }}>
                                <Row>
                                    <Col size={6}>
                                        <Row style={{ marginTop: 10, marginLeft: 5 }} >
                                            <Text style={styles.subText1}>Experience</Text>
                                            <Text style={styles.subText2}>-</Text>
                                            <Text note style={styles.subText2}>2 Months</Text>
                                        </Row>
                                        <Row style={{ marginTop: 10, marginLeft: 5 }}>
                                            <Text style={styles.subText1}>Payment Method</Text>
                                            <Text style={styles.subText2}>-</Text>
                                            <Text note style={styles.subText2}>Net Banking</Text>
                                        </Row>
                                    </Col>
                                    <Col size={3}>
                                        <Text style={{ marginLeft: 16, fontSize: 15, fontFamily: 'OpenSans', fontWeight: 'bold', color: 'green' }}>ONGOING</Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col size={4}>
                                        <Row style={{ marginTop: 10 }}>

                                            <Text note style={styles.subText3}>Do you want to accept ?</Text>
                                        </Row>
                                    </Col>
                                    <Col size={3}>
                                        <Row style={{ marginTop: 10 }}>
                                            <Button style={[styles.postponeButton, { backgroundColor: '#6FC41A' }]} onPress={() => this.updateAppointmentStatus(data, 'APPROVED')}>
                                                <Text style={styles.ButtonText}>ACCEPT</Text>
                                            </Button>
                                        </Row>
                                    </Col>
                                    <Col size={3}>
                                        <Row style={{ marginTop: 10 }}>
                                            <Button danger style={[styles.postponeButton]} onPress={() => this.navigateCancelAppoointment()}>
                                                <Text capitalise={true} style={styles.ButtonText}>CANCEL</Text>
                                            </Button>
                                        </Row>
                                    </Col></Row>
                            </Grid>
                            <CardItem footer style={styles.cardItem2}>
                                <Grid>
                                    <Row style={{ marginRight: 5 }} >
                                        <Col style={{ width: '50%', }}>
                                            <Row>
                                                <Icon name='md-calendar' style={styles.iconStyle} />
                                                <Text style={styles.timeText}>29th Jun,2020</Text>
                                            </Row>
                                        </Col>
                                        <Col style={{ width: '50%', marginLeft: 5, }}>
                                            <Row>
                                                <Icon name="md-clock" style={styles.iconStyle} />
                                                <Text style={styles.timeText}>11:00 am - 11:10 am</Text>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Grid>
                            </CardItem>
                        </Card>
                        <Grid>
                            <Row style={styles.rowStyle}>
                                <Col size={6}>
                                    <TouchableOpacity style={styles.appoinmentPrepareStyle} onPress={() => { this.props.navigation.navigate('PrepareAppointmentWizard', { AppointmentId: appointmentId, DoctorData: doctorData, Data: data.doctorInfo }) }}>

                                        <Text style={styles.touchableText1}>Appointment Preparation</Text>

                                    </TouchableOpacity>
                                </Col>
                                <Col size={4} style={{ marginLeft: 5 }}>
                                    <TouchableOpacity style={styles.appoinmentPrepareStyle2} onPress={() => this.navigateToBookAppointmentPage()} testID='navigateBookingPage'>
                                        <Text style={styles.touchableText1}>	Book Again</Text>
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                            <View style={{ marginTop: 10 }}>
                                <Row style={styles.rowSubText}>
                                    <Col style={{ width: '8%', paddingTop: 5 }}>
                                        <Icon name="ios-medkit" style={{ fontSize: 20, }} />
                                    </Col>
                                    <Col style={{ width: '92%', paddingTop: 5 }}>
                                        <Text style={styles.innerSubText}>Disease</Text>
                                        <Text note style={styles.subTextInner1}>ds</Text>
                                    </Col>
                                </Row>
                                <Row style={styles.rowSubText}>
                                    <Col style={{ width: '8%', paddingTop: 5 }}>
                                        <Icon name="ios-pin" style={{ fontSize: 20, }} />
                                    </Col>
                                    <Col style={{ width: '92%', paddingTop: 5 }}>
                                        <Text style={styles.innerSubText}>Patient Address</Text>
                                        <Text note style={styles.subTextInner1}> 67/B 2nd Road,Ambattur,Chennai -600051</Text>
                                    </Col>
                                </Row>
                                <Row style={styles.rowSubText}>
                                    <Col style={{ width: '8%', paddingTop: 5 }}>
                                        <Icon name="ios-pin" style={{ fontSize: 20, }} />
                                    </Col>
                                    <Col style={{ width: '92%', paddingTop: 5 }}>
                                        <Text style={styles.innerSubText}>Patient Details</Text>
                                        <FlatList
                                            data={patientDetails}
                                            renderItem={({ item, index }) =>
                                                <View style={styles.PatientDetailList} >
                                                    <Row >
                                                        <Col size={8}>
                                                            <Row>

                                                                <Col size={2}>
                                                                    <Text style={styles.commonText}>Name</Text>
                                                                </Col>
                                                                <Col size={.5}>
                                                                    <Text style={styles.commonText}>-</Text>
                                                                </Col>
                                                                <Col size={8}>
                                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#4c4c4c' }}>{item.name}</Text>

                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col size={10}>
                                                            <Row>

                                                                <Col size={2}>
                                                                    <Text style={styles.commonText}>Age</Text>
                                                                </Col>
                                                                <Col size={.5}>
                                                                    <Text style={styles.commonText}>-</Text>
                                                                </Col>
                                                                <Col size={8}>
                                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#4c4c4c' }}>{(item.Age) + ' - ' + (item.gender)}</Text>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </View>
                                            } />
                                    </Col>
                                </Row>
                                <Row style={styles.rowSubText}>
                                    <Col style={{ width: '8%', paddingTop: 5 }}>
                                        <Icon name="ios-document" style={{ fontSize: 20, }} />
                                    </Col>
                                    <Col style={{ width: '92%', paddingTop: 5 }}>
                                        <Text style={styles.innerSubText}>Payment Report</Text>

                                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 10 }}>
                                            <TouchableOpacity

                                                block success
                                                style={styles.reviewButton
                                                }>
                                                <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}>
                                                    Report Issue
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Col>
                                </Row>
                                <Row style={styles.rowSubText}>
                                    <Col style={{ width: '8%', paddingTop: 5 }}>
                                        <Icon name="ios-medkit" style={{ fontSize: 20, }} />
                                    </Col>
                                    <Col style={{ width: '92%', paddingTop: 5 }}>
                                        <Text style={styles.innerSubText}>Review</Text>

                                        <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                                            disabled={false}
                                            maxStars={5}
                                        //   rating={reviewData[0] && reviewData[0].overall_rating}
                                        />
                                        <Text note style={styles.subTextInner1}>0</Text>
                                    </Col>
                                </Row>
                                <Row style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                                    <Col style={{ width: '8%', paddingTop: 5 }}>
                                        <Icon name="ios-cash" style={{ fontSize: 20, }} />
                                    </Col>
                                    <Col style={{ width: '92%', paddingTop: 5 }}>
                                        <Text style={styles.innerSubText}>Payment Info</Text>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col style={{ width: '60%' }}>
                                                <Text style={styles.downText}>Total Fee
                                                 </Text>
                                            </Col>
                                            <Col style={{ width: '15%' }}>
                                                <Text style={styles.downText}>-</Text>
                                            </Col>
                                            <Col style={{ width: '25%' }}>
                                                <Text note style={styles.downText}>{"Rs." + 0 + "/-"}</Text>
                                            </Col>
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col style={{ width: '60%' }}>
                                                <Text style={styles.downText}>Payment Made
                                             </Text>
                                            </Col>
                                            <Col style={{ width: '15%' }}>
                                                <Text style={styles.downText}>-</Text>
                                            </Col>
                                            <Col style={{ width: '25%' }}>
                                                <Text note style={styles.downText}>{"Rs." + 0 + "/-"}</Text>
                                            </Col>
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col style={{ width: '60%' }}>
                                                <Text style={styles.downText}>Payment Due
                                              </Text>
                                            </Col>
                                            <Col style={{ width: '15%' }}>
                                                <Text style={styles.downText}>-</Text>
                                            </Col>
                                            <Col style={{ width: '25%' }}>
                                                <Text note style={styles.downText}>{"Rs." + 0 + "/-"}</Text>
                                            </Col>
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col style={{ width: '60%' }}>
                                                <Text style={styles.downText}>Payment Method
                                            </Text></Col>
                                            <Col style={{ width: '15%' }}>
                                                <Text style={styles.downText}>-</Text>
                                            </Col>
                                            <Col style={{ width: '25%' }}>
                                                <Text note style={styles.downText}> 0</Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </View>
                        </Grid>
                    </View>
                </Content>
            </Container>
        )
    }
}

export default AppointmentDetails