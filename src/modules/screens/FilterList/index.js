import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ScrollView, ProgressBar, Switch, CheckBox } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import StarRating from 'react-native-star-rating';


class FilterList extends Component {
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
                        <Title style={{ fontFamily: 'opensans-semibold' }}>Filter List</Title>

                    </Body>
                    <Right />
                </Header>
                <Content style={styles.bodyContent}>



                    <Card style={{ padding: 5 }}>
                        <CardItem header bordered>
                            <Text>Availability Time</Text>
                        </CardItem>
                        <CardItem >
                            <Body>
                                <Grid style={{ margintop: 10 }}>
                                    <Row>
                                        <Col style={{ width: '60%' }}>
                                            <Text style={styles.customText}>Availability Today</Text>

                                        </Col>
                                        <Col style={{ width: '20%' }}>
                                            <Text style={styles.customText}>45 mins</Text>
                                        </Col>
                                        <Col style={{ width: '20%' }}>
                                            <Switch></Switch>
                                        </Col>
                                    </Row>
                                </Grid>



                                <Grid style={{ marginTop: 10 }}>
                                    <Row>
                                        <Col style={{ width: '60%' }}>
                                            <Text style={styles.customText}>Next 3 Days</Text>

                                        </Col>
                                        <Col style={{ width: '20%' }}>
                                            {/* <Text style={styles.customText}>45 mins</Text> */}
                                        </Col>
                                        <Col style={{ width: '20%' }}>
                                            <Switch></Switch>
                                        </Col>
                                    </Row>
                                </Grid>

                            </Body>
                        </CardItem>

                    </Card>



                    <Card style={{ borderRadius: 10 }}>
                        <CardItem header bordered>
                            <Text>Dentist</Text>
                        </CardItem>
                        <CardItem style={{ paddingLeft: 0, paddingRight: 0 }}>



                            <Grid style={{ marginTop: 10 }}>
                                <Row>
                                    <Col style={{ width: '50%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />
                                            <Body>
                                                <Text style={styles.customText}>Dental consultation</Text>
                                            </Body>
                                        </ListItem>

                                    </Col>
                                    <Col style={{ width: '50%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />
                                            <Body>
                                                <Text style={styles.customText}>Dental consultation</Text>
                                            </Body>
                                        </ListItem>
                                    </Col>

                                </Row>

                                <Row>
                                    <Col style={{ width: '50%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />
                                            <Body>
                                                <Text style={styles.customText}>Dental consultation</Text>
                                            </Body>
                                        </ListItem>

                                    </Col>
                                    <Col style={{ width: '50%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />
                                            <Body>
                                                <Text style={styles.customText}>Dental consultation</Text>
                                            </Body>
                                        </ListItem>
                                    </Col>

                                </Row>
                            </Grid>






                        </CardItem>

                    </Card>





                    <Card style={{ borderRadius: 10 }}>
                        <CardItem header bordered>
                            <Text>Language</Text>
                        </CardItem>
                        <CardItem style={{ paddingLeft: 0, paddingRight: 0 }} >





                            <Grid style={{ marginTop: 10 }}>
                                <Row>
                                    <Col style={{ width: '33.33%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />
                                            <Body>
                                                <Text style={styles.customText}>tamil</Text>
                                            </Body>
                                        </ListItem>

                                    </Col>
                                    <Col style={{ width: '33.33%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />
                                            <Body>
                                                <Text style={styles.customText}>English</Text>
                                            </Body>
                                        </ListItem>
                                    </Col>

                                    <Col style={{ width: '33.33%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />
                                            <Body>
                                                <Text style={styles.customText}>French</Text>
                                            </Body>
                                        </ListItem>
                                    </Col>

                                </Row>


                                <Row>
                                    <Col style={{ width: '33.33%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />
                                            <Body>
                                                <Text style={styles.customText}>tamil</Text>
                                            </Body>
                                        </ListItem>

                                    </Col>
                                    <Col style={{ width: '33.33%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />
                                            <Body>
                                                <Text style={styles.customText}>English</Text>
                                            </Body>
                                        </ListItem>
                                    </Col>

                                    <Col style={{ width: '33.33%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />
                                            <Body>
                                                <Text style={styles.customText}>French</Text>
                                            </Body>
                                        </ListItem>
                                    </Col>

                                </Row>

                                <Row>
                                    <Col style={{ width: '33.33%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />
                                            <Body>
                                                <Text style={styles.customText}>tamil</Text>
                                            </Body>
                                        </ListItem>

                                    </Col>
                                    <Col style={{ width: '33.33%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />
                                            <Body>
                                                <Text style={styles.customText}>English</Text>
                                            </Body>
                                        </ListItem>
                                    </Col>

                                    <Col style={{ width: '33.33%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />
                                            <Body>
                                                <Text style={styles.customText}>French</Text>
                                            </Body>
                                        </ListItem>
                                    </Col>

                                </Row>

                            </Grid>






                        </CardItem>

                    </Card>








                    <Card style={{ borderRadius: 10 }}>
                        <CardItem header bordered>
                            <Text>Gender</Text>
                        </CardItem>
                        <CardItem style={{ paddingLeft: 0, paddingRight: 0 }}>



                            <Grid style={{ marginTop: 10 }}>
                                <Row>
                                    <Col style={{ width: '80%' }}>
                                        <ListItem noBorder>

                                            <Body>
                                                <Text style={styles.customText}>male</Text>
                                            </Body>
                                        </ListItem>

                                    </Col>
                                    <Col style={{ width: '20%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />

                                        </ListItem>
                                    </Col>



                                </Row>


                                <Row>
                                    <Col style={{ width: '80%' }}>
                                        <ListItem noBorder>
                                            <Body>
                                                <Text style={styles.customText}>Female</Text>
                                            </Body>
                                        </ListItem>

                                    </Col>
                                    <Col style={{ width: '20%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />

                                        </ListItem>
                                    </Col>



                                </Row>


                                <Row>
                                    <Col style={{ width: '80%' }}>
                                        <ListItem noBorder>
                                            <Body>
                                                <Text style={styles.customText}>Others</Text>
                                            </Body>
                                        </ListItem>

                                    </Col>
                                    <Col style={{ width: '20%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />

                                        </ListItem>
                                    </Col>



                                </Row>


                            </Grid>






                        </CardItem>

                    </Card>





                    <Card style={{ borderRadius: 10 }}>
                        <CardItem header bordered>
                            <Text>Work Experience</Text>
                        </CardItem>
                        <CardItem style={{ paddingLeft: 0, paddingRight: 0 }}>





                            <Grid style={{ marginTop: 10 }}>
                                <Row>
                                    <Col style={{ width: '50%' }}>
                                        <ListItem noBorder>

                                            <Body>
                                                <Button style={styles.expButton}><Text style={{ fontFamily: 'opensans - regular' }}> Any</Text></Button>
                                            </Body>
                                        </ListItem>

                                    </Col>
                                    <Col style={{ width: '50%' }}>
                                        <ListItem noBorder>
                                            <Button style={styles.expButton}><Text style={{ fontFamily: 'opensans - regular' }}>0-5</Text></Button>
                                        </ListItem>
                                    </Col>



                                </Row>


                                <Row>
                                    <Col style={{ width: '50%' }}>
                                        <ListItem noBorder>

                                            <Body>
                                                <Button style={styles.expButton}><Text style={{ fontFamily: 'opensans - regular' }}> 5-10</Text></Button>
                                            </Body>
                                        </ListItem>

                                    </Col>
                                    <Col style={{ width: '50%' }}>
                                        <ListItem noBorder>
                                            <Button style={styles.expButton}><Text style={{ fontFamily: 'opensans - regular' }}>10-15</Text></Button>
                                        </ListItem>
                                    </Col>



                                </Row>


                                <Row>
                                    <Col style={{ width: '50%' }}>
                                        <ListItem noBorder>

                                            <Body>
                                                <Button style={styles.expButton}><Text style={{ fontFamily: 'opensans - regular' }}> 15-20</Text></Button>
                                            </Body>
                                        </ListItem>

                                    </Col>
                                    <Col style={{ width: '50%' }}>
                                        <ListItem noBorder>
                                            <Button style={styles.expButton}><Text style={{ fontFamily: 'opensans - regular' }}>20-25</Text></Button>
                                        </ListItem>
                                    </Col>



                                </Row>

                            </Grid>






                        </CardItem>

                    </Card>






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
export default connect(loginState, { login, messageShow, messageHide })(FilterList)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',

    },

    bodyContent: {
        padding: 5
    },

    customText: {
        fontFamily: 'opensans-regular',
        color: 'gray',
        fontSize: 13
    },
    expButton: {
        height: 40,
        width: '100%',
        borderRadius: 15,
        backgroundColor: '#7E49C3',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'opensans-regular',
    }


});