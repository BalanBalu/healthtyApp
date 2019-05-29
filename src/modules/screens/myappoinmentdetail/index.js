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
            selectedIndex: 0,
            upComingData: [1, 2, 3, 4],
            pastData: []
        }
    }
    componentDidMount() {
        this.setState({ data: this.state.upComingData });
    }

    handleIndexChange = index => {
        let data = index === 0 ? this.state.upComingData : this.state.pastData
        this.setState({
            ...this.state,
            selectedIndex: index,
            data
        });
    };

    render() {
        const { data } = this.state;

        return (

            <View style={styles.container}>
                <SegmentedControlTab tabsContainerStyle={{ width: 250, marginLeft: 'auto', marginRight: 'auto' }}
                    values={["Upcoming", "Past"]}
                    selectedIndex={this.state.selectedIndex}
                    onTabPress={this.handleIndexChange}
                    activeTabStyle={{ backgroundColor: '#775DA3', borderColor: '#775DA3' }}
                    tabStyle={{ borderColor: '#775DA3' }}
                />


                {data.length === 0 ?
                    <Card transparent style={{ padding: 5, borderRadius: 10, justifyContent: 'center' }}>
                        <Item>

                            {/* <Text style={{ fontFamily: 'OpenSans', fontSize: 12 }} note>If no appointment, this should be printed, karthick bro, code should be implement here</Text> */}


                        </Item>


                        <Card transparent style={{ alignItems: 'center', justifyContent: 'center', marginTop: '20%' }}>
                            <Thumbnail square source={{ uri: 'https://www.shareicon.net/data/512x512/2017/01/23/874910_document_512x512.png' }} style={{ height: 100, width: 100, marginTop: '10%' }} />

                            <Text style={{ fontFamily: 'OpenSans', fontSize: 14, marginTop: '10%' }} note>No appoinments are scheduled</Text>


                            <Item style={{ marginTop: '15%', borderBottomWidth: 0 }}>
                                <Button style={[styles.bookingButton, styles.customButton]}>
                                    <Text  >Book Now</Text>
                                </Button>

                            </Item>

                        </Card>


                    </Card> :
                    <Card style={{ padding: 5, borderRadius: 10, marginTop: 15 }}>



                        <List>
                            <FlatList
                                data={data}
                                extraData={this.state}
                                renderItem={({ item, index }) =>

                                    <ListItem avatar onPress={() => this.props.navigation.navigate('AppointmentInfo')}>
                                        <Left>
                                            <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 60, width: 60 }} />
                                        </Left>
                                        <Body>
                                            <Text style={{ fontFamily: 'OpenSans' }}>Dr. Anil Verma</Text>
                                            <Item style={{ borderBottomWidth: 0 }}>
                                                <Text style={{ fontFamily: 'OpenSans' }}>Internist</Text>
                                                <StarRating fullStarColor='#FF9500' starSize={20} containerStyle={{ width: 100, marginLeft: 60 }}
                                                    disabled={false}
                                                    maxStars={5}
                                                    rating={this.state.starCount}
                                                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                                                />
                                            </Item>
                                            <Item style={{ borderBottomWidth: 0 }}>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12 }} note>Saturday. </Text>

                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12 }} note>April-13 </Text>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12 }} note>10.00 AM</Text>
                                            </Item>
                                            <Item style={{ borderBottomWidth: 0, marginLeft: 20 }}>
                                                <Button style={styles.bookingButton}>
                                                    <Text  >Book Again</Text>
                                                </Button>
                                                <Button style={styles.shareButton}>
                                                    <Text >Share</Text>
                                                </Button>
                                            </Item>


                                        </Body>
                                    </ListItem>
                                }
                                keyExtractor={(item, index) => index.toString()} />
                        </List>
                    </Card>
                }




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
        borderRadius: 10,
        width: 'auto',
        height: 40,
        color: 'white',
        fontSize: 12,
        textAlign: 'center'
    },
    shareButton: {
        marginTop: 12,
        backgroundColor: 'gray',
        marginLeft: 15,
        borderRadius: 10,
        width: 'auto',
        height: 40,
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
        justifyContent: 'center'

    },
    customButton:
    {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        backgroundColor: '#775DA3',
        marginLeft: 15,
        borderRadius: 10,
        width: 'auto',
        height: 40,
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',

    }
});