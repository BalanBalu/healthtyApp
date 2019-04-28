import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Card, Item, CardItem, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ProgressBar } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import StarRating from 'react-native-star-rating';
import { ScrollView } from 'react-native-gesture-handler';


class doctorSearchList extends Component {
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
                        <Title style={{ fontFamily: 'opensans-semibold' }}>Filter Doctor</Title>

                    </Body>
                    <Right />
                </Header>
                <Content style={styles.bodyContent}>

                    <Card>
                        <Grid><Row>
                            <Col style={{ col: '33.33%', alignItems: 'center' }}>

                                <Button transparent>
                                    <Text note uppercase={false} style={{ fontFamily: 'opensans-regular', color: 'gray' }}>TopRated</Text>
                                    <Icon name='ios-arrow-down' style={{ color: 'gray' }} />
                                </Button>
                            </Col>
                            <Col style={{ col: '33.33%', alignItems: 'center' }}>

                                <Button transparent>
                                    <Text note uppercase={false} style={{ fontFamily: 'opensans-regular', color: 'gray' }}>Fri 27</Text>
                                    <Icon name='ios-arrow-down' style={{ color: 'gray' }} />
                                </Button>
                            </Col>
                            <Col style={{ col: '33.33%', alignItems: 'center' }}>

                                <Button transparent >
                                    <Text note uppercase={false} style={{ fontFamily: 'opensans-regular', color: 'gray' }}>Filter</Text>
                                    <Icon name='ios-funnel' style={{ color: 'gray' }} />
                                </Button>
                            </Col>
                        </Row></Grid>

                    </Card>




                    <Card style={{ padding: 5, borderRadius: 10 }}>
                        <List>
                            <ListItem avatar >
                                <Left>
                                    <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 80, width: 80 }} />
                                </Left>
                                <Body>
                                    <Text style={{ fontFamily: 'opensans-regular' }}>Kumar Pratik</Text>
                                    <Item style={{ borderBottomWidth: 0 }}>
                                        <Icon name='pin' style={{ fontSize: 20, fontFamily: 'opensans-regular', color: 'gray' }}></Icon>
                                        <Text note style={{ fontFamily: 'opensans-regular' }}>Anna Nagar,chennai </Text>
                                    </Item>

                                    <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 100 }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={this.state.starCount}
                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    />
                                    <Text note style={{ fontFamily: 'opensans-regular', color: 'gray' }}>Rs 400</Text>
                                </Body>
                                <Right>
                                    <Icon name='heart' style={{ color: 'red', fontSize: 25 }}></Icon>
                                </Right>
                            </ListItem>



                            <Grid>
                                <Row>
                                    <ListItem>
                                        <ScrollView horizontal={true}>
                                            <Col style={{ col: '25%', padding: 5 }}>

                                                <Button primary style={styles.timeButton}>
                                                    <Text note style={{ fontFamily: 'opensans-regular', color: 'white' }}>1 pm</Text>
                                                </Button>
                                            </Col>

                                            <Col style={{ col: '25%', padding: 5 }}>

                                                <Button primary style={styles.timeButton}>
                                                    <Text note style={{ fontFamily: 'opensans-regular', color: 'white' }}>2 pm</Text>
                                                </Button>
                                            </Col>

                                            <Col style={{ col: '25%', padding: 5 }}>

                                                <Button primary style={styles.timeButton}>
                                                    <Text note style={{ fontFamily: 'opensans-regular', color: 'white' }}>3 pm</Text>
                                                </Button>
                                            </Col>
                                            <Col style={{ col: '25%', padding: 5 }}>

                                                <Button primary style={styles.timeButton}>
                                                    <Text note style={{ fontFamily: 'opensans-regular', color: 'white' }}>4 pm</Text>
                                                </Button>
                                            </Col>
                                            <Col style={{ col: '25%', padding: 5 }}>

                                                <Button primary style={styles.timeButton}>
                                                    <Text note style={{ fontFamily: 'opensans-regular', color: 'white' }}>5 pm</Text>
                                                </Button>
                                            </Col>

                                        </ScrollView>
                                    </ListItem>
                                </Row>
                            </Grid>


                        </List>



                    </Card>


                    <Card style={{ padding: 5, borderRadius: 10 }}>
                        <List>
                            <ListItem avatar >
                                <Left>
                                    <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 80, width: 80 }} />
                                </Left>
                                <Body>
                                    <Text style={{ fontFamily: 'opensans-regular' }}>Kumar Pratik</Text>
                                    <Item style={{ borderBottomWidth: 0 }}>
                                        <Icon name='pin' style={{ fontSize: 20, fontFamily: 'opensans-regular', color: 'gray' }}></Icon>
                                        <Text note style={{ fontFamily: 'opensans-regular' }}>Anna Nagar,chennai </Text>
                                    </Item>

                                    <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 100 }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={this.state.starCount}
                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    />
                                    <Text note style={{ fontFamily: 'opensans-regular', color: 'gray' }}>Rs 400</Text>
                                </Body>
                                <Right>
                                    <Icon name='heart' style={{ color: 'red', fontSize: 25 }}></Icon>
                                </Right>
                            </ListItem>



                            <Grid>
                                <Row>
                                    <ListItem>
                                        <ScrollView horizontal={true}>
                                            <Col style={{ col: '25%', padding: 5 }}>

                                                <Button primary style={styles.timeButton}>
                                                    <Text note style={{ fontFamily: 'opensans-regular', color: 'white' }}>1 pm</Text>
                                                </Button>
                                            </Col>

                                            <Col style={{ col: '25%', padding: 5 }}>

                                                <Button primary style={styles.timeButton}>
                                                    <Text note style={{ fontFamily: 'opensans-regular', color: 'white' }}>2 pm</Text>
                                                </Button>
                                            </Col>

                                            <Col style={{ col: '25%', padding: 5 }}>

                                                <Button primary style={styles.timeButton}>
                                                    <Text note style={{ fontFamily: 'opensans-regular', color: 'white' }}>3 pm</Text>
                                                </Button>
                                            </Col>
                                            <Col style={{ col: '25%', padding: 5 }}>

                                                <Button primary style={styles.timeButton}>
                                                    <Text note style={{ fontFamily: 'opensans-regular', color: 'white' }}>4 pm</Text>
                                                </Button>
                                            </Col>
                                            <Col style={{ col: '25%', padding: 5 }}>

                                                <Button primary style={styles.timeButton}>
                                                    <Text note style={{ fontFamily: 'opensans-regular', color: 'white' }}>5 pm</Text>
                                                </Button>
                                            </Col>

                                        </ScrollView>
                                    </ListItem>
                                </Row>
                            </Grid>


                        </List>



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
export default connect(loginState, { login, messageShow, messageHide })(doctorSearchList)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',

    },

    bodyContent: {
        padding: 5
    },

    timeButton: {
        height: 35,
        width: 75,
        fontFamily: 'opensans-regular',
        fontSize: 12,
        borderRadius: 15,
        textAlign: 'center',
        backgroundColor: '#7E49C3'
    }


});