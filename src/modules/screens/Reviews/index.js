import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ScrollView, ProgressBar } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { userReviews } from '../../providers/profile/profile.action';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import StarRating from 'react-native-star-rating';


class Reviews extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data:[],            
            starCount: 3.5,
            
            // doctor_id: "5cbd58b07045a106541d5999"
                    }
                }
                componentDidMount(){
                 this.getUserReview();
                }
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }
    getUserReview = async () => {

        let doctor_id = await AsyncStorage.getItem('doctorId');
         // let doctorId = "5ca47f4dd32d2b731c40bef3";
         try{
           let result = await userReviews(doctor_id, 'doctor');
           console.log(result.data[0].comments);
            if (result.success) {            
             this.setState({ data: result.data[0] })
            }
        }   
        catch (e) {
            console.log(e)
        }   
    }  
    
    render() {
        const { user: { isLoading } } = this.props;
         const { data } = this.state;
        return (

            <Container style={styles.container}>
                <Header style={{ backgroundColor: '#7E49C3', fontFamily: 'opensans-semibold' }}>
                    <Left>
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
                                    <Text style={{ fontFamily: 'opensans-regular' }}> Kumar </Text>
                                    <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 100 }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={this.state.starCount}
                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    />
                                    <Text note> {data.comments}  </Text>
                                                                       
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


                    {/* <Card style={{ padding: 5, borderRadius: 10 }}>
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
                    </Card> */}




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