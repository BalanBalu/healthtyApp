import React, { Component } from 'react';
import {
    Container, Content, View, Text, Title, Header, H3, Button, Item, CardItem, Row, Col,
    List, ListItem, Left, Right, Card, Thumbnail, Body, Icon, ScrollView, Spinner
} from 'native-base';
import { StyleSheet, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';
import moment from 'moment';
import StarRating from 'react-native-star-rating';

import { userReviews, insertLikesDataForReviews } from '../../providers/profile/profile.action';
import { formatDate, dateDiff } from '../../../setup/helpers';
import { renderProfileImage } from '../../common';


class Reviews extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: null,
            // userId: '',
            reviewId:'',
            isLoading: true,
            reviewLikeColor: false,
            userId:null
        }


    }
    componentDidMount() {
        const { navigation } = this.props;
       // let doctorId = navigation.getParam('doctorId'); //"5ce01ae8d28ab8073515a6f6";
        this.getUserReview();
        // this.getUserLikes();
        // this.insertUserLikes(reviewId);
    }

    getUserReview = async () => {
        try {
            let doctorId="5d24389d44ba7f1d04bc3225";

            let userId = await AsyncStorage.getItem('userId');
            await this.setState({userId:userId})
            let result = await userReviews(doctorId, 'doctor');
            this.setState({ isLoading: false, userId: userId });
            if (result.success) {
                this.setState({ data: result.data });

                console.log('data'+JSON.stringify(this.state.data))
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    // getUserLikes = async () => {
    //     try {
    //         let userId = await AsyncStorage.getItem('userId');
    //         let result = await insertLikesDataForReviews(userId, 'reviewer');
    //         this.setState({ isLoading: false, reviewId: userId });
    //         if (result.success && item.reactionData.active===true) {
    //             this.setState({ data: result.data });
    //         }
    //     }
    //     catch (e) {
    //         console.log(e)
    //     }
    // }


    insertUserLikes = async (item) => {

        try {
            let reviewerId = await AsyncStorage.getItem('userId');
            let reviewId =item._id;
            console.log('item'+JSON.stringify(item))
            console.log('reviewId'+JSON.stringify(reviewId))

            let reactionData = {
                reviewerType: 'USER',
                reactionType: 'LIKE',
                active: true
            }
            //let result = await insertLikesDataForReviews(data._id, this.state.userId, reactionData);
            let result= await insertLikesDataForReviews(reviewId,reviewerId, reactionData)
            console.log('result      :   ' + JSON.stringify(result));
            this.setState({ isLoading: false });
            // if (result.success) {
            //     data.likeColor = true;
            //     this.state.data[index].likeColor = true;
            //     this.likesCount(data, index);
            // }
            if(result.success){
                this.setState({reviewLikeColor:true});
            }
           
        }
        catch (e) {
            console.log(e)
        }
    }

    relativeTimeView(review_date) {
        try {
            var postedDate = review_date;
            var currentDate = new Date();
            var relativeDate = dateDiff(postedDate, currentDate, 'days');
            console.log('difference : ' + relativeDate);
            if (relativeDate > 30) { 
                return formatDate(review_date, "DD-MM-YYYY")
            } else {
                return moment(review_date, "YYYYMMDD").fromNow();
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    likesCount(data, index) {
        try {
            if (data.reactionData) {
                let count = 0;
                data.reactionData.forEach(element => {
                    if (element.active === true) {
                        count++;
                    }
                    else if (element.reviewer_id == this.state.userId && element.active === true) {
                        this.state.data[index].likeColor = true;
                        console.log('like color     :   ' + this.state.data[index]);
                    }
                });
                return count;
            } else {
                return null;d
            }
        } catch (e) {
            console.log(e)
        }
    }


    renderNoReviews() {
        return (
            <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }}>No reviews yet</Text>
            </Item>
        )
    }

    renderReviews() {
        return (
            <FlatList
                data={this.state.data}
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                    <Card style={styles.card}>
                        <CardItem>
                            <Body>
                                <Row>                                 
                                    <Thumbnail style={{ marginLeft: -10, height: 50, width: 50 }} square source={renderProfileImage(item.userInfo)}/>
                                   
                                    <Col>
                                        <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 5, }}>{item.is_anonymous == true ? 'Medflic User' : item.userInfo.first_name + ' ' + item.userInfo.last_name} </Text>
                                    </Col>
                                    <Col>
                                        <Text style={{ fontSize: 12, marginLeft: 60, }}>  {this.relativeTimeView(item.review_date)} </Text>
                                    </Col>
                                </Row>

                                <Row
                                    style={{ marginTop: -25 }}>
                                    <Col style={{ marginLeft: 60 }}>
                                        <Text style={{ fontSize: 15 }}>Cleanliness</Text>
                                        <StarRating
                                            fullStarColor='#FF9500'
                                            starSize={15}
                                            containerStyle={{
                                                width: 80,
                                            }}
                                            disabled={false}
                                            maxStars={5}
                                            rating={item.cleanness_rating}
                                        />
                                    </Col>

                                    <Col>
                                        <Text style={{ fontSize: 15 }}>Staff</Text>
                                        <StarRating
                                            fullStarColor='#FF9500'
                                            starSize={15}
                                            containerStyle={{ width: 80 }}
                                            disabled={false}
                                            maxStars={5}
                                            rating={item.staff_rating}
                                        />
                                    </Col>

                                    <Col>
                                        <Text style={{ fontSize: 15 }}>Wait Time</Text>
                                        <StarRating
                                            fullStarColor='#FF9500'
                                            starSize={15}
                                            containerStyle={{ width: 80 }}
                                            disabled={false}
                                            maxStars={5}
                                            rating={item.overall_rating}
                                        />
                                    </Col>
                                </Row>

                                <Text style={{ fontSize: 15, marginLeft: 60, marginRight: 5, marginTop: 10 }}>
                                    {item.comments} </Text>

                                <Row style={{ marginTop: 10 }} >
                                    <Text style={{ fontSize: 12, marginLeft: 60 }}>{this.likesCount(item, index)}</Text>

                                    <TouchableOpacity onPress={() => this.insertUserLikes(item, index)}>
                                        <Text style={item.reactionData !==undefined && item.reactionData[0].reviewer_id==this.state.userId ? 
                                        { color: '#FF9500', fontSize: 12, marginLeft: 3 }
                                         : { fontSize: 12, marginLeft: 60 }}>Likes</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => this.insertUserLikes(item, index)}>
                                        <Text style={this.state.reviewLikeColor == true ? 
                                        { color: '#FF9500', fontSize: 12, marginLeft: 3 }
                                         : { fontSize: 12, marginLeft: 60 }}>Likes</Text>
                                    </TouchableOpacity>

                                    <Text style={{ fontSize: 12, marginLeft: 20 }}>Reply</Text>
                                </Row>

                                {/* <Row style={{ marginLeft: 60, marginTop: 10 }}>
    <Thumbnail style={{ height: 26, width: 26 }} square source={require("./assets/images/profileAvatar.png")}></Thumbnail>
    <Text style={{ fontSize: 12, marginRight: 54 }}> What do you think about the book? I wonder if i should read it...</Text>
    </Row>
    <Row style={{ marginLeft: 60, marginTop: 10 }}>
    <Thumbnail style={{ height: 26, width: 26 }} square source={require("./assets/images/profileAvatar.png")}></Thumbnail>
    <TextInput
    style={{ height: 20, borderRadius: 5, borderWidth: 1, width: 'auto', padding: 1, margin: 'auto', marginLeft: 10 }}
    placeholder="Write your reviews here"
    onChangeText={(text) => this.setState({ text })}
    />
    </Row>
    <Button style={styles.button2}><Text style={{ fontSize: 10, color: 'black' }}> Submit</Text>
    </Button> */}
                            </Body>
                        </CardItem>
                    </Card>
                } />
        )
    }

    render() {
        return (
            <Container style={styles.container}>
                <Content style={styles.bodyContent}>
                    {this.state.isLoading ? <Spinner color='blue' /> :
                        <Card>
                            {this.state.data == null ? this.renderNoReviews() : this.renderReviews()}
                        </Card>}
                </Content>
            </Container>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        padding: 5
    },

    button1: {
        borderRadius: 25,
        marginLeft: 10,
        marginTop: 10,
        marginTop: 5
    },
    card: {
        width: 'auto',
        borderWidth: 5,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'black',
    },
    button2: {
        marginLeft: 'auto',
        marginRight: 10,
        height: 25,
        borderRadius: 10,
        width: 80,
        marginBottom: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        marginBottom: 5
    }
}
)

export default Reviews