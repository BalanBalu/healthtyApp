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
            userId: null,
                }
    }
    componentDidMount() {
        this.getUserReview();
    }
   getUserReview = async () => {
        try {
            const {navigation} = this.props;
            const doctorId= navigation.getParam('reviewDoctorId');
            let userId = await AsyncStorage.getItem('userId');
            let result = await userReviews(doctorId, 'doctor');
            await this.setState({ isLoading: false, userId: userId });
            if (result.success) {
                 this.setState({ getReviewsData: result.data });
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
             let reactionData = {
                reviewerType: 'USER',
                reactionType: 'LIKE',
                active: true
            }
            let result = await insertLikesDataForReviews(reviewId, reviewerId, reactionData)
           this.setState({ isLoading: false });
            if (result.success) {
            await this.setState({ reviewLikeColor: true });
            this.getUserReview();
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
           let count = 0;
            if (data.reactionData) {
                const countLength= data.reactionData.filter(element=> 
                    (element.reaction_type === "LIKE" && element.active === true))
                count = countLength.length;
            }
            if(count != 0){                
                return count;
            }else {
                return null; 
            }
        } catch (e) {
            console.log(e)
        }
    }

    changeLikesColor=(item)=>{
        console.log('item'+JSON.stringify(item.reactionData))
        let reactionReviewerId=null;

    if(item.reactionData!=undefined){
          item.reactionData.forEach((reactionElement)=>{
            if(reactionElement.reviewer_id == this.state.userId){
               reactionReviewerId = reactionElement.reviewer_id;
            }
        })
    }
 if( item.reactionData !== undefined && reactionReviewerId == this.state.userId){
    return (
         { color: '#FF9500', fontSize: 12,  }
    )
 }else{
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
                                    <Thumbnail style={{ marginLeft: -10, height: 50, width: 50 }} square source={renderProfileImage(item.userInfo)} />

                                    <Col style={{marginLeft:15,width:'52.5%'}} >
                                    <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 5, }}>{item.is_anonymous == true ? 'Medflic User' : item.userInfo.first_name + ' ' + item.userInfo.last_name} </Text>
                                    {/* <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 5, }}>{item.is_anonymous == true ? 'Medflic User' : item.userInfo.first_name + ' ' + item.userInfo.last_name} </Text> */}
                                    </Col>
                                    <Col style={{width:'47.5%'}}>
                                        <Text style={{ fontSize: 12, marginLeft: 60, }}>  {this.relativeTimeView(item.review_date)} </Text>
                                    </Col>
                                </Row>

                                <Row
                                    style={{marginTop:-20 }}>
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
                                    <TouchableOpacity testID ="postLikeButton" onPress={() => this.insertUserLikes(item, index)}>
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