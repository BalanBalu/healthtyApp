import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import StarRating from 'react-native-star-rating';


class PaymentReview extends Component {
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
        const { user: { isLoading } } = this.props;
        const { loginErrorMsg } = this.state;
        return (

            <Container style={styles.container}>
                <Header style={{ backgroundColor: '#7E49C3', fontFamily: 'opensans-semibold' }}>
                    <Left  >
                        <Button Button transparent onPress={() => this.props.navigation.navigate('home')}>
                            <Icon name="arrow-back" style={{ color: '#fff' }}></Icon>
                        </Button>

                    </Left>
                    <Body>
                        <Title style={{ fontFamily: 'opensans-semibold' }}>Review</Title>

                    </Body>

                </Header>

                <Content style={styles.bodyContent}>


                    <Grid style={{ borderBottomWidth: 0.3, color: 'gray', padding: 10, marginLeft: 10 }}>
                        <Row>
                            <Col style={{ width: '90%' }}>

                                <Text style={styles.customizedText} note>Date And Time</Text>

                                <Text style={styles.customizedText}>Monday,October24</Text>

                                <Text note style={styles.customizedText}>10.00 AM</Text>
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

                                <Text style={styles.customizedText}>Adam Gilchrist</Text>

                                <Text note style={styles.customizedText}>10.00 AM</Text>
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

                                <Text note style={styles.customizedText}>Netaji street,</Text>
                                <Text note style={styles.customizedText}>No 20 Annanagar,</Text>
                                <Text note style={styles.customizedText}>Chennai</Text>
                            </Col>
                            <Col style={{ width: '10%' }}>
                                <Icon name="ios-arrow-dropright" />
                            </Col>
                        </Row>

                    </Grid>


                    <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                        <Row>
                            <Col style={{ width: '90%' }}>
                                <Text style={styles.customizedText}>Payment Method</Text>

                                <ListItem noBorder>
                                    <Left>
                                        <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '80%', height: 50, borderRadius: 10 }} />
                                    </Left>
                                    <Body>
                                        <Text style={styles.customizedText}>Paypal</Text>
                                    </Body>
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
                                <Text style={styles.customizedText}>Fee</Text>


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

                        <Row style={{ marginTop: 10 }}>
                            <Col style={{ width: '90%' }}>
                                <Text style={styles.customizedText}>Reserved fee</Text>


                            </Col>
                            <Col style={{ width: '10%' }}>
                                <Text style={styles.customizedText}>200</Text>

                            </Col>
                        </Row>


                    </Grid>
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