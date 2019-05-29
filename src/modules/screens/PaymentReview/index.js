import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, AsyncStorage, TouchableOpacity, View } from 'react-native';
import { bookAppointment } from '../../providers/bookappointment/bookappointment.action';



class PaymentReview extends Component {
    constructor(props) {
        super(props)

        this.state = {
            bookSlotDetails: {},
        }

    }
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }
    async componentDidMount() {
        const { navigation } = this.props;
        const bookSlotDetails = navigation.getParam('resultconfirmSlotDetails');
        await this.setState({ bookSlotDetails: bookSlotDetails });
    }

    confirmPayLater = async () => {

        const userId = await AsyncStorage.getItem('userId');
        let objectData = {
            userId: userId,
            doctorId: this.state.bookSlotDetails.doctorId,
            description: "Bones Pain",
            startTime: this.state.bookSlotDetails.slotData.slotDate + 'T' + this.state.bookSlotDetails.slotData.slotTime + '.000Z',
            endTime: this.state.bookSlotDetails.slotData.slotDate + 'T' + this.state.bookSlotDetails.slotData.slotEndTime + '.000Z',
            status: "PENDING",
            status_by: "Patient",
            statusUpdateReason: "something",
            hospital_id: this.state.bookSlotDetails.slotData.location.hospital_id,
            booked_from: "Mobile"
        }

        let resultData = await bookAppointment(objectData);
        // console.log(JSON.stringify(resultData) + 'response for confirmPayLater ');
        if (resultData.success) {
            alert("Appointment Book Successfully");

        }
    }

    render() {
        const { user: { isLoading } } = this.props;
        const { bookSlotDetails } = this.state;
        return (

            <Container style={styles.container}>
                {/* <Header style={{ backgroundColor: '#7E49C3', fontFamily: 'opensans-semibold' }}>
                    <Left  >
                        <Button Button transparent onPress={() => this.props.navigation.navigate('home')}>
                            <Icon name="arrow-back" style={{ color: '#fff' }}></Icon>
                        </Button>

                    </Left>
                    <Body>
                        <Title style={{ fontFamily: 'opensans-semibold' }}>Review</Title>

                    </Body>

                </Header>
 */}
                <Content style={styles.bodyContent}>


                    <Grid style={{ borderBottomWidth: 0.3, color: 'gray', padding: 10, marginLeft: 10 }}>
                        <Row>
                            <Col style={{ width: '90%' }}>

                                <Text style={styles.customizedText} note>Date And Time</Text>
                                <Text style={styles.customizedText}>{bookSlotDetails.slotData && bookSlotDetails.slotData.slotDate}</Text>
                                <Text note style={styles.customizedText}>{bookSlotDetails.slotData && bookSlotDetails.slotData.slotTime} to {bookSlotDetails.slotData && bookSlotDetails.slotData.slotEndTime}</Text>
                                <Text note style={styles.customizedText}></Text>

                            </Col>
                            <Col style={{ width: '10%' }}>
                                <Icon name="ios-arrow-dropright" />
                            </Col>
                        </Row>


                    </Grid>

                    <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                        <Row>
                            <Col style={{ width: '90%' }}>
                                <Text note style={styles.customizedText}>Doctor</Text>

                                <Text style={styles.customizedText}>{this.state.bookSlotDetails.doctorName}</Text>

                            </Col>
                            <Col style={{ width: '10%' }}>
                                <Icon name="ios-arrow-dropright" />
                            </Col>
                        </Row>
                    </Grid>



                    <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                        <Row>
                            <Col style={{ width: '90%' }}>
                                <Text style={styles.customizedText}>Address</Text>
                                <Text note style={styles.customizedText}>
                                    {bookSlotDetails.slotData && bookSlotDetails.slotData.location.location.address.no_and_street},</Text>
                                <Text note style={styles.customizedText}>{bookSlotDetails.slotData && bookSlotDetails.slotData.location.location.address.address_line_1},</Text>
                                <Text note style={styles.customizedText}>{bookSlotDetails.slotData && bookSlotDetails.slotData.location.location.address.address_line_2}</Text>
                            </Col>
                            <Col style={{ width: '10%' }}>
                                <Icon name="ios-arrow-dropright" />
                            </Col>
                        </Row>

                    </Grid>


                    <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                        <Row>
                            <Col style={{ width: '90%' }}>
                                <Text style={styles.customizedText}>Apply Coupons</Text>

                                <ListItem noBorder>
                                    <Left>
                                        <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '80%', height: 50, borderRadius: 10 }} />
                                    </Left>
                                    {/* <Body>
                                        <Text style={styles.customizedText}>Paypal</Text>
                                    </Body> */}
                                </ListItem>
                            </Col>
                            <Col style={{ width: '10%' }}>
                                <Icon name="ios-arrow-dropright" />
                            </Col>
                        </Row>

                    </Grid>



                    <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                        <Row>
                            <Col style={{ width: '90%' }}>
                                <Text style={styles.customizedText}>fee</Text>

                            </Col>
                            <Col style={{ width: '90%' }}>
                                <Text style={styles.customizedText}>{bookSlotDetails.slotData && bookSlotDetails.slotData.fee}</Text>
                            </Col>

                        </Row>

                        <Row style={{ marginTop: 10 }}>
                            <Col style={{ width: '90%' }}>
                                <Text style={styles.customizedText}>Total fee</Text>


                            </Col>
                            <Col style={{ width: '10%' }}>
                                <Text style={styles.customizedText}>300</Text>

                            </Col>
                        </Row>
                    </Grid>
                    <Button block success style={{ borderRadius: 6, marginLeft: 6 }} onPress={this.confirmPayLater}>
                        <Text uppercase={false} >payLater</Text>

                    </Button>
                </Content>

            </Container>

        )
    }

}

function loginState(state) {

    return {
        user: state.user
    }
}
export default connect(loginState, { login, messageShow, messageHide })(PaymentReview)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',

    },

    bodyContent: {

    },

    customizedText: {
        fontFamily: 'OpenSans',
        fontSize: 15
    }
});