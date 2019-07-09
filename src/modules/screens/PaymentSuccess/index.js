import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import { formatDate } from '../../../setup/helpers';

class PaymentSuccess extends Component {
    constructor(props) {
        super(props)

        this.state = {
            successBookSlotDetails: {},
        }
    }

    async componentDidMount() {
        const { navigation } = this.props;
        const successBookSlotDetails = navigation.getParam('successBookSlotDetails');
        await this.setState({ successBookSlotDetails: successBookSlotDetails });
    }
    render() {
        const { navigation } = this.props;
        const { successBookSlotDetails } = this.state;
        return (

            <Container style={styles.container}>
               
                <Content style={styles.bodyContent}>

                    <Grid style={{ alignItems: 'center' }}>
                        <Row>
                            <Col style={{ alignItems: 'center' }}>
                                <Icon name='ios-checkmark' style={{ color: 'green', fontSize: 50, alignItems: 'center' }}></Icon>
                                <H3 style={{ textAlign: 'center', fontFamily: 'OpenSans' }}> Success</H3>
                                <Text note style={{ textAlign: 'center', fontFamily: 'OpenSans' }}> Thank You For Choosing Our Service And Trust Our Doctors To Take Care Your Health</Text>
                            </Col>
                        </Row>
                    </Grid>

                    <Card style={{ padding: 15, borderRadius: 10, marginTop: 10 }}>
                        {/* <Right>
                            <Icon name='create' style={{ color: 'gray', fontSize: 20, }}></Icon>
                        </Right> */}
                        <Grid>
                            <Row>
                                <Body>
                                {
                                                successBookSlotDetails.profile_image != undefined
                                                    ? <Thumbnail square source={successBookSlotDetails.profile_image.imageURL} style={{ height: 60, width: 60 }} />
                                                    : <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 80, width: 80 }} />
                                            }
                                </Body>
                            </Row>

                            <Row style={{ marginTop: 20 }}>
                                <Col style={{ alignItems: 'center' }}>
                                    <Text style={styles.customizedText}>{successBookSlotDetails.doctorName}</Text>

                                </Col>
                            </Row>

                            <Row style={{ marginTop: 20 }}>
                                <Col style={{ alignItems: 'center' }}>
                                    <Text style={styles.customizedText} note>Date And Time</Text>
                                    <Text style={styles.customizedText}>{successBookSlotDetails.slotData && successBookSlotDetails.slotData.slotDate}</Text>
                                    <Text style={styles.customizedText}>{successBookSlotDetails.slotData && formatDate(successBookSlotDetails.slotData.slotStartDateAndTime, 'hh:mm a')}</Text>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: 20 }}>
                                <Col style={{ alignItems: 'center' }}>
                                    <Text style={styles.customizedText}>Address</Text>
                                    <Text style={styles.customizedText}>{successBookSlotDetails.slotData && successBookSlotDetails.slotData.location.name}</Text>
                      
                                    <Text note style={styles.customizedText}>{successBookSlotDetails.slotData && successBookSlotDetails.slotData.location.location.address.no_and_street},</Text>
                                    <Text note style={styles.customizedText}>{successBookSlotDetails.slotData && successBookSlotDetails.slotData.location.location.address.city},</Text>
                                    <Text note style={styles.customizedText}>{successBookSlotDetails.slotData && successBookSlotDetails.slotData.location.location.address.state}</Text>
                                    <Text note style={styles.customizedText}>{successBookSlotDetails.slotData && successBookSlotDetails.slotData.location.location.address.pin_code}</Text>
                               
                                </Col></Row>

                        </Grid>

                    </Card>
                    <Button block success style={{ marginTop: 10, borderRadius: 20 }} onPress={()=> navigation.navigate('Home') }><Text style={styles.customizedText}> Home </Text></Button>
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
export default connect(loginState, { login, messageShow, messageHide })(PaymentSuccess)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',

    },

    bodyContent: {
        padding: 30

    },
    customizedText: {
        fontFamily: 'OpenSans',
        fontSize: 16
    },
    userImage:
    {
        height: 60,
        width: 60,
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        padding: 10,
        borderRadius: 30,
        borderColor: '#f1f1f1',
        borderWidth: 5,

    }
});