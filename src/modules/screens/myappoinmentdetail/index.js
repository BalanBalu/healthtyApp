import React, { Component } from 'react';
import {
    Container, Content, View, Text, Title, Header, H3, Button, Item, Card,
    CardItem, List, ListItem, Left, Right, Thumbnail, Segment,
    Body, Icon, ScrollView
} from 'native-base';
import { StyleSheet, Image, AsyncStorage, FlatList } from 'react-native';
import StarRating from 'react-native-star-rating';

import { userReviews } from '../../providers/profile/profile.action';
import { formatDate } from '../../../setup/helpers';
import { Col, Row, Grid } from 'react-native-easy-grid';
import SegmentedControlTab from "react-native-segmented-control-tab";
class myappoinmentdetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            isLoading: false,
            selectedIndex: 0
        }
    }

    handleIndexChange = index => {
        this.setState({
            ...this.state,
            selectedIndex: index
        });
    };

    render() {


        return (

            <View style={styles.container}>
                <SegmentedControlTab
                    values={["Upcoming", "Past"]}
                    selectedIndex={this.state.selectedIndex}
                    onTabPress={this.handleIndexChange}
                    activeTabStyle={{ backgroundColor: '#775DA3', borderColor: '#775DA3' }}
                    tabStyle={{ borderColor: '#775DA3' }}

                />



                <Card style={{ padding: 5, borderRadius: 10, height: 150, marginTop: 10 }}>
                    <List>
                        <ListItem avatar noBorder onPress={() => this.props.navigation.navigate('AppointmentInfo')}>
                            <Left>
                                <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 60, width: 60 }} />
                            </Left>
                            <Body>
                                <Text style={{ fontFamily: 'OpenSans' }}>Kumar Pratik</Text>

                                <Text style={{ fontFamily: 'opensans-regular', fontSize: 14 }}>Dentist.....  </Text>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={{ fontFamily: 'opensans-regular', fontSize: 12 }} note>Saturday. </Text>

                                    <Text style={{ fontFamily: 'opensans-regular', fontSize: 12 }} note>April-13 </Text>
                                    <Text style={{ fontFamily: 'opensans-regular', fontSize: 12 }} note>10.00 AM</Text>
                                </Item>

                                <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 100 }}
                                    disabled={false}
                                    maxStars={5}
                                    rating={this.state.starCount}
                                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                                />
                                <Grid>
                                    <Row>
                                        <Col style={{ width: '10%' }}>

                                        </Col>
                                        <Col style={{ width: '90%' }}>
                                            <Row>
                                                <Button style={styles.bookingButton}>
                                                    <Text uppercase={false} >Book Again</Text>
                                                </Button>
                                                <Button style={styles.shareButton}>
                                                    <Text uppercase={false}>Share</Text>
                                                </Button>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Grid>
                            </Body>
                        </ListItem>
                    </List>
                </Card>



                <Card style={{ padding: 5, borderRadius: 10, height: 150, marginTop: 10 }}>
                    <List>
                        <ListItem avatar noBorder onPress={() => this.props.navigation.navigate('AppointmentInfo')}>
                            <Left>
                                <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 60, width: 60 }} />
                            </Left>
                            <Body>
                                <Text style={{ fontFamily: 'OpenSans' }}>Kumar Pratik</Text>

                                <Text style={{ fontFamily: 'opensans-regular', fontSize: 14 }}>Dentist.....  </Text>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={{ fontFamily: 'opensans-regular', fontSize: 12 }} note>Saturday. </Text>

                                    <Text style={{ fontFamily: 'opensans-regular', fontSize: 12 }} note>April-13 </Text>
                                    <Text style={{ fontFamily: 'opensans-regular', fontSize: 12 }} note>10.00 AM</Text>
                                </Item>

                                <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 100 }}
                                    disabled={false}
                                    maxStars={5}
                                    rating={this.state.starCount}
                                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                                />
                                <Grid>
                                    <Row>
                                        <Col style={{ width: '10%' }}>

                                        </Col>
                                        <Col style={{ width: '90%' }}>
                                            <Row>
                                                <Button style={styles.bookingButton}>
                                                    <Text uppercase={false} >Book Again</Text>
                                                </Button>
                                                <Button style={styles.shareButton}>
                                                    <Text uppercase={false}>Share</Text>
                                                </Button>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Grid>
                            </Body>
                        </ListItem>
                    </List>
                </Card>
            </View>


        );
    }
}



export default myappoinmentdetail
const styles = StyleSheet.create({
    container:
    {
        backgroundColor: '#ffffff',
        margin: 10
    },
    bodyContent: {
        padding: 5
    },
    bookingButton: {
        marginTop: 12,
        backgroundColor: '#775DA3',
        marginLeft: 15,
        borderRadius: 5,
        width: 110,
        height: 40,
        color: 'white',
        fontSize: 12,
        textAlign: 'center'
    },
    shareButton: {
        marginTop: 12,
        backgroundColor: 'gray',
        marginLeft: 15,
        borderRadius: 5,
        width: 110,
        height: 40,
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
        justifyContent: 'center'
    },
});