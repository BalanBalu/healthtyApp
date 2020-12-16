
import React, { Component } from 'react';
import {
    Text, Row, Col, Thumbnail, Icon, Grid
} from 'native-base';
import { StyleSheet, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';
import StarRating from 'react-native-star-rating';
import { renderProfileImage } from '../../common';
import { formatDate, dateDiff, getMoment, subString } from '../../../setup/helpers';
import { userReviews, insertLikesDataForReviews } from '../../providers/profile/profile.action';
import { CURRENT_APP_NAME } from "../../../setup/config";
currentLikedRewiedIds = {};
function relativeTimeView(review_date) {
    try {
        var postedDate = review_date;
        var currentDate = new Date();
        var relativeDate = dateDiff(postedDate, currentDate, 'days');
        if (relativeDate > 30) {
            return formatDate(review_date, "DD-MM-YYYY")
        } else {
            return getMoment(review_date, "YYYYMMDD").fromNow();
        }
    }
    catch (e) {
        console.log(e)
    }
}
function getCommentsToRender(comments) {
    if (comments) {
        if (comments.length < 200) {
            return subString(comments, 50) + '...'
        } else {
            return comments
        }
    } else {
        return ''
    }
}
function getReactionColor(item, reactionerId) {
    let reviewId = item._id;
    if (currentLikedRewiedIds[reviewId] !== undefined) {
        return currentLikedRewiedIds[reviewId]
    }

    if (item.reactionData != undefined) {
        let reactionerLiked = false;
        item.reactionData.some(reactionElement => {
            if (reactionElement.reviewer_id == reactionerId && reactionElement.active === true) {
                reactionerLiked = true;
                return
            }
        })
        return reactionerLiked;
    } else {
        return false
    }
}
async function insertUserLikes(item, reviewerId, props) {
    try {
        debugger
        if (reviewerId) {
            isAlreadyLiked = getReactionColor(item, reviewerId);
          

            let reviewId = item._id;
            let reactionData = {
                reviewerType: 'USER',
                reactionType: 'LIKE',
                active: !isAlreadyLiked
            }
            insertLikesDataForReviews(reviewId, reviewerId, reactionData)
            currentLikedRewiedIds[reviewId] = reactionData.active;
            props.refreshCount();
        }
    }
    catch (e) {
        console.log(e)
    }
}
function getLikesCount(item) {
    let likesCount = 0
    let reviewId = item._id;
    if (item.reactionData) {
        likesCountData = item.reactionData.filter(element =>
            (element.reaction_type === "LIKE" && element.active === true))

        likesCount = likesCountData.length
    }
    return currentLikedRewiedIds[reviewId] === true ? (likesCount + 1) : likesCount;
}




export const RenderReviewData = (props) => {
    const { item, userId, navigation } = props;
  

    return (
        <Grid>
            <Row style={{ marginTop: 20, borderTopColor: 'gray', borderTopWidth: 0.5, paddingTop: 20 }}>
                <Col size={2}>
                    <TouchableOpacity onPress={() => navigation.navigate("ImageView", { passImage: renderProfileImage(item.userInfo), title: 'Profile photo' })}>
                        <Thumbnail source={renderProfileImage(item.userInfo)} style={{ width: 60, height: 60, borderRadius: 60 / 2 }} />
                    </TouchableOpacity>
                </Col>
                <Col style={{ marginTop: 5, }} size={5}>
                    <Text style={styles.name}>{item.is_anonymous == true ? CURRENT_APP_NAME + ' User' : item.userInfo.first_name + ' ' + item.userInfo.last_name}</Text>
                </Col>
                <Col style={{  marginTop: 8 }} size={3}>
                    <Text style={styles.date}> {relativeTimeView(item.review_date)}</Text>
                </Col>
            </Row>
            <Row style={{ marginLeft: 60, marginTop: -20 }}>
                <Col style={{ alignItems: 'center', borderRightColor: 'gray', borderRightWidth: 0.5 }}>
                    <StarRating
                        fullStarColor='#FF9500'
                        starSize={15}
                        containerStyle={{ width: 80, marginLeft: 5 }}
                        disabled={true}
                        maxStars={5}
                        rating={item.cleanness_rating}
                    />
                    <Text style={styles.ratingText}>Service quality</Text>
                </Col>
                <Col style={{ alignItems: 'center', borderRightColor: 'gray', borderRightWidth: 0.5 }}>
                    <StarRating
                        fullStarColor='#FF9500'
                        starSize={15}
                        containerStyle={{ width: 80, marginLeft: 5 }}
                        disabled={true}
                        maxStars={5}
                        rating={item.staff_rating}
                    />
                    <Text style={styles.ratingText}>Staff</Text>
                </Col>
                <Col style={{ alignItems: 'center' }}>
                    <StarRating
                        fullStarColor='#FF9500'
                        starSize={15}
                        containerStyle={{ width: 80, marginLeft: 5 }}
                        disabled={true}
                        maxStars={5}
                        rating={item.overall_rating}
                    />
                    <Text style={styles.ratingText}>Wait Time</Text>
                </Col>
            </Row>
            <Row style={{ marginLeft: 70, marginTop: 10, }}>
                <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, width: '100%' }}>{item.comments || ''}
                    {/* <Text style={{fontFamily:'OpenSans',fontSize:12,}}>Read more</Text> */}
                </Text>

            </Row>
            <Row style={{ marginLeft: 70, marginTop: 10 }}>
                <Col>
                    <Row>
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => insertUserLikes(item, userId, props)}>

                            {userId ? <Icon name="heart" style={getReactionColor(item, userId) ? { fontSize: 20, color: 'red' } : { fontSize: 20 }} />
                                : null}

                        </TouchableOpacity>
                        <Text style={styles.textContent}>{getLikesCount(item)}{' '}Likes</Text>
                        {/* <Icon name="ios-undo" style={{fontSize:20,color:'green',marginLeft:20}}/>
                        <Text style={styles.textContent}>Reply</Text> */}
                    </Row>
                </Col>
            </Row>
        </Grid>
    )
}

const styles = StyleSheet.create({
    name: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        fontWeight: 'bold'
    },
    date: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        textAlign:'right'
    },
    ratingText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 10
    },
    textContent: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        marginLeft: 3
    }
}
)