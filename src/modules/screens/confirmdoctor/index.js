import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Card, Item, CardItem, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ProgressBar } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Image, TouchableOpacity, View, FlatList } from 'react-native';
import StarRating from 'react-native-star-rating';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from "react-native-modal";

class confirmdoctor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userEntry: '',
            password: '',
            loginErrorMsg: ''
        }
        this.state = {
            starCount: 3.5,
            isModalVisible: false
        };
    }
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

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
                        <Title style={{ fontFamily: 'opensans-semibold' }}>Confirm Doctor</Title>

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
                            <Col style={{ col: '33.33%', alignItems: 'center', marginTop: 10 }}>

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
                                        <Icon name='locate' style={{ fontSize: 20, fontFamily: 'opensans-regular', color: 'gray' }}></Icon>
                                        <Text note style={{ fontFamily: 'opensans-regular' }}>Anna Nagar,chennai </Text>
                                    </Item>

                                    <Item style={{ borderBottomWidth: 0 }}>
                                        <Text note style={{ fontFamily: 'opensans-regular' }}>Dentist </Text>

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
                                        <Icon name='locate' style={{ fontSize: 20, fontFamily: 'opensans-regular', color: 'gray' }}></Icon>
                                        <Text note style={{ fontFamily: 'opensans-regular' }}>Anna Nagar,chennai </Text>
                                    </Item>

                                    <Item style={{ borderBottomWidth: 0 }}>
                                        <Text note style={{ fontFamily: 'opensans-regular' }}>Dentist </Text>

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

                        </List>

                    </Card>

                    <Button success block title="Hide modal" onPress={this.toggleModal} ></Button>


                    <Modal isVisible={this.state.isModalVisible} >
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                            <Card style={{ padding: 7, borderRadius: 10, height: 370 }}>
                                <ListItem noBorder>
                                    <Left></Left>
                                    <Body>
                                        <Text style={{ marginLeft: -50, fontFamily: 'opensans-regular', fontSize: 15, color: 'gray' }}>Confirmation</Text></Body>
                                    <Right>
                                        <Icon name="close-circle" style={{ fontSize: 25, marginTop: -5 }}></Icon>
                                    </Right>
                                </ListItem>

                                <Grid>
                                    <Col style={{ width: '20%' }}>
                                        <Grid>
                                            <Col>
                                                <Text style={styles.newText}>welcome</Text>
                                                <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 50, width: 50 }} />
                                            </Col>
                                        </Grid>
                                        <Item style={{ marginTop: -25 }}></Item>

                                        <Grid style={{ marginTop: 45 }}>
                                            <Col>
                                                <Text style={styles.newText}>Welcome</Text>
                                                <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 50, width: 50 }} />
                                            </Col>
                                        </Grid>
                                    </Col>
                                    <Col style={{ width: '10%' }}>
                                        <Row style={{ marginTop: 60 }}>
                                            <Text style={styles.roundText}></Text>
                                        </Row>
                                        <Row style={{ marginTop: 60 }}>
                                            <Text style={styles.roundText}></Text>
                                        </Row>
                                    </Col>

                                    <Col style={{ width: '70%', borderLeftWidth: 1, borderColor: '#F2889B', paddingLeft: 10, marginLeft: -18 }}>

                                        <Text style={styles.newText}>chennai corporation hospitals</Text>
                                        <Grid >
                                            <Col style={{ width: '25%' }}>
                                                <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 50, width: 50, marginLeft: 'auto', marginRight: 'auto' }} />
                                            </Col>
                                            <Col style={{ width: '75%' }}>
                                                <Text style={{ fontFamily: 'opensans-regular' }}>Kumar Pratik</Text>
                                                <Item style={{ borderBottomWidth: 0 }}>
                                                    <Icon name='locate' style={{ fontSize: 20, fontFamily: 'opensans-regular', color: 'gray' }}></Icon>
                                                    <Text note style={{ fontFamily: 'opensans-regular' }}>Anna Nagar,chennai </Text>
                                                </Item>
                                            </Col>
                                        </Grid>


                                        <Grid >
                                            <Col>
                                                <Text note style={{ fontFamily: 'opensans-regular' }}>Address </Text>
                                                <Text note style={{ fontFamily: 'opensans-regular' }}>81/3,Anna Nagar,chennai-40 </Text>
                                            </Col>

                                        </Grid>

                                        <Grid >
                                            <View >
                                                <FlatList numColumns={3}
                                                    data={[
                                                        {
                                                            "day": 0,
                                                            "dayName": "9.00 am",
                                                            "start_time": "09:00:00",
                                                            "end_time": "09:30:00"
                                                        },
                                                        {
                                                            "day": 0,
                                                            "dayName": "9.00 am",
                                                            "start_time": "10:00:00",
                                                            "end_time": "10:30:00"
                                                        },
                                                        {
                                                            "day": 0,
                                                            "dayName": "9.00 am",
                                                            "start_time": "12:00:00",
                                                            "end_time": "13:00:00"
                                                        },
                                                        {
                                                            "day": 0,
                                                            "dayName": "9.00 am",
                                                            "start_time": "13:00:00",
                                                            "end_time": "14:00:00"
                                                        }
                                                    ]}
                                                    renderItem={({ item }) => <Item style={{ borderBottomWidth: 0, alignItems: 'center' }}><Col style={{ width: '32%', alignItems: 'center', marginLeft: 3 }}><Button style={{ backgroundColor: '#775DA3', borderRadius: 5, width: 65, height: 30, margin: 2 }}><Text uppercase={false} style={{ fontFamily: 'opensans-regular', fontSize: 8, color: 'white' }}>{item.dayName}</Text></Button></Col></Item>}
                                                />
                                            </View>
                                        </Grid>



                                        <Button block success style={{ borderRadius: 10, marginLeft: 10 }} onPress={this.toggleModal}>
                                            <Text uppercase={false} >Confirm Appoinment</Text>

                                        </Button>

                                    </Col>
                                </Grid>
                            </Card>

                            <Button title="Hide modal" onPress={this.toggleModal} />
                        </View>
                    </Modal>

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
export default connect(loginState, { login, messageShow, messageHide })(confirmdoctor)


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
    },
    roundText:
    {
        height: 15,
        width: 15,
        backgroundColor: '#F2889B',
        borderRadius: 8,
        marginLeft: 'auto',
        marginRight: 'auto'
    },

    newText:
    {
        fontSize: 14,
        color: '#F2889B',
        fontFamily: 'opensans-semibold',

    }


});