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
            getReviewsData: null,
            reviewId: '',
            isLoading: true,
            reviewLikeColor: false,
            userId: null
        }
    }
    componentDidMount() {
        this.getUserReview();
    }

    getUserReview = async () => {
        try {
            //let doctorId = "5d24389d44ba7f1d04bc3225";
            let doctorId="5d2420ed731df239784cd222";
            let userId = await AsyncStorage.getItem('userId');
            let result = await userReviews(doctorId, 'doctor');
            await this.setState({ isLoading: false, userId: userId });
            if (result.success) {
                this.setState({ getReviewsData: result.data });
                // console.log('getReviewsData' + JSON.stringify(this.state.getReviewsData))
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    insertUserLikes = async (item) => {
        try {
            let reviewerId = await AsyncStorage.getItem('userId');
            let reviewId = item._id;
            console.log('item' + JSON.stringify(item))
            let reactionData = {
                reviewerType: 'USER',
                reactionType: 'LIKE',
                active: true
            }
            let result = await insertLikesDataForReviews(reviewId, reviewerId, reactionData)
            console.log('result      :   ' + JSON.stringify(result));
           this.setState({ isLoading: false });
            if (result.success) {
            await this.setState({ reviewLikeColor: true });
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
            // console.log('difference : ' + relativeDate);
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
            console.log('reaction:'  +  data.reactionData)
            if (data.reactionData) {
                let count = 0;
            {
              if (element.reviewer_id == this.state.userId && element.active === true)
               {
                   
               count++;
               }
            };
                return count;
            } 
            else {
                return null; 
            }
        } catch (e) {
            console.log(e)
        }
    }

    changeLikesColor=(item)=>{
        console.log('item'+JSON.stringify(item))
        let reviewIdArray=[]
        item.reactionData.forEach((reactionElement)=>{

if(reactionElement.reviewer_id == this.state.userId){
    reviewIdArray.push(reactionElement.reviewer_id)
}
})
console.log('reviewIdArray'+JSON.stringify(reviewIdArray))
//if(this.state.reviewLikeColor===true  && reviewIdArray == this.state.userId){

 if( item.reactionData !== undefined && reviewIdArray == this.state.userId){
    return (
         { color: '#FF9500', fontSize: 12,  }
    )
}
else{
   
    if(this.state.reviewLikeColor===true){
        return (
            { color: '#FF9500', fontSize: 12,  }
       )
    }
    return(
        { fontSize: 12 } 
    )
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
                data={this.state.getReviewsData}
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                    <Card style={styles.card}>
                        <CardItem>
                            <Body>
                                <Row>
                                    <Thumbnail style={{ marginLeft: -10, height: 50, width: 50 }} square source={renderProfileImage(item.userInfo.profile_image)} />

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
                                        <Text style={this.changeLikesColor(item)} >Likes</Text>
                                   </TouchableOpacity>
                                    <Text style={{ fontSize: 12, marginLeft: 20 }}>Reply</Text>
                                </Row>
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
                            {this.state.getReviewsData == null ? this.renderNoReviews() : this.renderReviews()}
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