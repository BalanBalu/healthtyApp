import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import StarRating from 'react-native-star-rating';


class PaymentPage extends Component {
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
                        <Title style={{ fontFamily: 'opensans-semibold' }}>Payment</Title>

                    </Body>
                    <Right ><Text style={{ color: '#fff' }}> Add New</Text></Right>
                </Header>

                <Content style={styles.bodyContent}>

                    <H3 style={styles.paymentHeader}>Payment </H3>

                    <Grid style={styles.gridNew}>

                        <Text style={styles.paymentText}>Choose Your Payment Method</Text>


                        <Row >
                            <Col style={{ width: '33.33%', alignItems: 'center' }}>
                                <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '100%', height: 50, borderradius: 10 }} />
                                <ListItem noBorder>
                                    <CheckBox checked={true} color="#4ED963" style={{ marginTop: 10 }}></CheckBox>
                                </ListItem>

                            </Col>
                            <Col style={{ width: '33.33%', alignItems: 'center' }}>
                                <Image source={{ uri: 'https://cdn.freebiesupply.com/logos/large/2x/cirrus-3-logo-png-transparent.png' }} style={{ width: '100%', height: 50, borderradius: 10 }} />
                                <ListItem noBorder>
                                    <CheckBox checked={true} color="#4ED963" style={{ marginTop: 10 }}></CheckBox>
                                </ListItem>
                            </Col>
                            <Col style={{ width: '33.33%', alignItems: 'center' }}>
                                <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '100%', height: 50, borderradius: 10 }} />
                                <ListItem noBorder>
                                    <CheckBox checked={true} color="#4ED963" style={{ marginTop: 10 }}></CheckBox>
                                </ListItem>
                            </Col>
                        </Row>

                    </Grid>



                    <Grid style={styles.gridEntry}>
                        <Row>
                            <Input placeholder="Card Number" style={styles.transparentLabel} />
                        </Row>
                        <Row>
                            <Input placeholder="Card Holder " style={styles.transparentLabel} />
                        </Row>

                        <Row>
                            <Col style={{ width: '50%', paddingRight: 5 }}>
                                <Input placeholder="Expired Date " style={styles.transparentLabel} />
                            </Col>
                            <Col style={{ width: '50%', paddingLeft: 5 }}>
                                <Input placeholder="CVV " style={styles.transparentLabel} />
                            </Col>
                        </Row>

                        <Row style={{ marginTop: 10 }}>

                            <Col style={{ width: '10%' }}>
                                <CheckBox checked={true} color="#4ED963" />

                            </Col>
                            <Col style={{ width: '90%' }}>

                                <Text style={{ fontFamily: 'OpenSans', color: 'gray' }}>Save Credit Information</Text>
                            </Col>






                        </Row>

                    </Grid>


                </Content>
                <Footer style={{ backgroundColor: '#fff' }}>
                    <Left></Left>
                    <Body></Body>
                    <Right>
                        <Button transparent><Text style={{ color: '#66A3F2', fontSize: 15, fontFamily: 'OpenSans' }}>Pay Later</Text></Button>
                    </Right>
                </Footer>
            </Container>

        )
    }

}

function loginState(state) {

    return {
        user: state.user
    }
}
export default connect(loginState, { login, messageShow, messageHide })(PaymentPage)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',

    },

    bodyContent: {

    },

    paymentHeader:
    {
        fontFamily: 'opensans - semibold',
        borderColor: '#000',
        backgroundColor: 'white',
        borderWidth: 1,
        width: 130,
        textAlign: 'center',
        borderRadius: 5,
        padding: 10,
        margin: 10,
        color: 'gray',
        fontSize: 18

    },

    paymentText: {
        fontFamily: 'OpenSans',
        color: 'gray',
        textAlign: 'center',
        fontSize: 15,
        padding: 10
    },

    gridNew: {
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        padding: 15,
        marginTop: 10
    },
    gridEntry:
    {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
    },
    transparentLabel: {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'OpenSans',
    }

});