import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import StarRating from 'react-native-star-rating';


class PaymentSuccess extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userEntry: '',
            password: '',
            loginErrorMsg: ''
        }
        this.state = {
            starCount: 3.5
        };
    }
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    render() {
        const { navigation } = this.props;
        const { loginErrorMsg } = this.state;
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
                                    <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.userImage} />
                                </Body>


                            </Row>

                            <Row style={{ marginTop: 20 }}>
                                <Col style={{ alignItems: 'center' }}>
                                    <Text style={styles.customizedText}>Adam Gilchrist</Text>

                                    <Text note style={styles.customizedText}>Accident And Emergency</Text>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: 20 }}>
                                <Col style={{ alignItems: 'center' }}>
                                    <Text style={styles.customizedText} note>Date And Time</Text>

                                    <Text style={styles.customizedText}>Monday,October24</Text>

                                    <Text note style={styles.customizedText}>10.00 AM</Text>
                                </Col>

                            </Row>

                            <Row style={{ marginTop: 20 }}>
                                <Col style={{ alignItems: 'center' }}>

                                    <Text style={styles.customizedText}>Address</Text>

                                    <Text note style={styles.customizedText}>Netaji street,</Text>
                                    <Text style={styles.customizedText}>No 20 Annanagar, Chennai</Text>
                                    <Text note style={styles.customizedText}>0.30 mins away</Text>
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