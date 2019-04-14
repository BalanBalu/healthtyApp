import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ScrollView, ProgressBar } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import StarRating from 'react-native-star-rating';


class Reviews extends Component {
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
                        <Title style={{ fontFamily: 'opensans-semibold' }}>More Reviews</Title>

                    </Body>
                    <Right />
                </Header>
                <Content style={styles.bodyContent}>




                    <Card style={{ padding: 5, borderRadius: 10 }}>
                        <List>
                            <ListItem avatar noBorder>
                                <Left>
                                    <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 60, width: 60 }} />
                                </Left>
                                <Body>
                                    <Text style={{ fontFamily: 'opensans-regular' }}>Kumar Pratik</Text>
                                    <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 100 }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={this.state.starCount}
                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    />
                                    <Text note>I was facing baldness because of which I looked older than my age.....  </Text>



                                    <Grid style={{ marginTop: 5 }}>
                                        <Row>
                                            <Col style={{ width: '30%' }} >
                                                <Item style={{ borderBottomWidth: 0 }}><Icon name='heart' style={{ color: 'red', fontSize: 20 }}></Icon><Text style={{ fontFamily: 'opensans-regular', fontSize: 12, color: 'gray' }}>Like</Text>
                                                </Item>
                                            </Col>
                                            <Col style={{ width: '30%' }}>
                                                <Item style={{ borderBottomWidth: 0 }}><Icon name='text' style={{ color: 'red', fontSize: 20 }}></Icon><Text style={{ fontFamily: 'opensans-regular', fontSize: 12, color: 'gray' }}>Comment</Text>
                                                </Item>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </Body>
                                <Right>
                                    <Text note>3hrs </Text>
                                </Right>


                            </ListItem>

                        </List>
                    </Card>


                    <Card style={{ padding: 5, borderRadius: 10 }}>
                        <List>
                            <ListItem avatar noBorder>
                                <Left>
                                    <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 60, width: 60 }} />
                                </Left>
                                <Body>
                                    <Text style={{ fontFamily: 'opensans-regular' }}>Kumar Pratik</Text>
                                    <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 100 }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={this.state.starCount}
                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    />
                                    <Text note>I was facing baldness because of which I looked older than my age.....  </Text>



                                    <Grid style={{ marginTop: 5 }}>
                                        <Row>
                                            <Col style={{ width: '30%' }} >
                                                <Item style={{ borderBottomWidth: 0 }}><Icon name='heart' style={{ color: 'red', fontSize: 20 }}></Icon><Text style={{ fontFamily: 'opensans-regular', fontSize: 12, color: 'gray' }}>Like</Text>
                                                </Item>
                                            </Col>
                                            <Col style={{ width: '30%' }}>
                                                <Item style={{ borderBottomWidth: 0 }}><Icon name='text' style={{ color: 'red', fontSize: 20 }}></Icon><Text style={{ fontFamily: 'opensans-regular', fontSize: 12, color: 'gray' }}>Comment</Text>
                                                </Item>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </Body>
                                <Right>
                                    <Text note>3hrs </Text>
                                </Right>


                            </ListItem>

                        </List>
                    </Card>


                    <Card style={{ padding: 5, borderRadius: 10 }}>
                        <List>
                            <ListItem avatar noBorder>
                                <Left>
                                    <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 60, width: 60 }} />
                                </Left>
                                <Body>
                                    <Text style={{ fontFamily: 'opensans-regular' }}>Kumar Pratik</Text>
                                    <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 100 }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={this.state.starCount}
                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    />
                                    <Text note>I was facing baldness because of which I looked older than my age.....  </Text>



                                    <Grid style={{ marginTop: 5 }}>
                                        <Row>
                                            <Col style={{ width: '30%' }} >
                                                <Item style={{ borderBottomWidth: 0 }}><Icon name='heart' style={{ color: 'red', fontSize: 20 }}></Icon><Text style={{ fontFamily: 'opensans-regular', fontSize: 12, color: 'gray' }}>Like</Text>
                                                </Item>
                                            </Col>
                                            <Col style={{ width: '30%' }}>
                                                <Item style={{ borderBottomWidth: 0 }}><Icon name='text' style={{ color: 'red', fontSize: 20 }}></Icon><Text style={{ fontFamily: 'opensans-regular', fontSize: 12, color: 'gray' }}>Comment</Text>
                                                </Item>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </Body>
                                <Right>
                                    <Text note>3hrs </Text>
                                </Right>


                            </ListItem>

                        </List>
                    </Card>


                    <Card style={{ padding: 5, borderRadius: 10 }}>
                        <List>
                            <ListItem avatar noBorder>
                                <Left>
                                    <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 60, width: 60 }} />
                                </Left>
                                <Body>
                                    <Text style={{ fontFamily: 'opensans-regular' }}>Kumar Pratik</Text>
                                    <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 100 }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={this.state.starCount}
                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    />
                                    <Text note>I was facing baldness because of which I looked older than my age.....  </Text>



                                    <Grid style={{ marginTop: 5 }}>
                                        <Row>
                                            <Col style={{ width: '30%' }} >
                                                <Item style={{ borderBottomWidth: 0 }}><Icon name='heart' style={{ color: 'red', fontSize: 20 }}></Icon><Text style={{ fontFamily: 'opensans-regular', fontSize: 12, color: 'gray' }}>Like</Text>
                                                </Item>
                                            </Col>
                                            <Col style={{ width: '30%' }}>
                                                <Item style={{ borderBottomWidth: 0 }}><Icon name='text' style={{ color: 'red', fontSize: 20 }}></Icon><Text style={{ fontFamily: 'opensans-regular', fontSize: 12, color: 'gray' }}>Comment</Text>
                                                </Item>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </Body>
                                <Right>
                                    <Text note>3hrs </Text>
                                </Right>


                            </ListItem>

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
export default connect(loginState, { login, messageShow, messageHide })(Reviews)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',

    },

    bodyContent: {
        padding: 5
    },


});