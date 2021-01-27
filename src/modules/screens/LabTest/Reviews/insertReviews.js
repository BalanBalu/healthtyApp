import React, { Component } from 'react';

import { StyleSheet, Image, Dimensions, AsyncStorage, Modal, TouchableOpacity, TextInput } from 'react-native';
import StarRating from 'react-native-star-rating';
import {
    Container, Header, Title, Left, Right, Body, Button, Card, Toast, CardItem, Row, Grid, View, Col,
    Text, Thumbnail, Content, CheckBox, Item, Input
} from 'native-base';
import { insertReviews } from '../../../providers/lab/lab.action'
import { formatDate } from '../../../../setup/helpers';


export class labInsertReviews extends Component {
    constructor(props) {
        super(props)
        this.state = {

            cleanness_rating: 0,
            staff_rating: 0,
            wait_time_rating: 0,
            comments: '',
            isLabRecommended: false,
            isAnonymous: false,
            isAnonymousErrorMsg: '',
            data: {},
            labId: '',
            appointmentId: '',
            isRefresh: 'false',
            ratingIndicatePopUp: false,
        }

    }

    async componentDidMount() {
        const { data } = this.props;
        let userId = data.user_id;
        let labId = data.lab_id;
        let appointmentId = data._id;
        await this.setState({ userId: userId, labId: labId, appointmentId: appointmentId, data: data });
    }


    submitReview = async (reviewCondition) => {
        try {
            const { userId, appointmentId, labId } = this.state;

            const { data, isAnonymous, wait_time_rating, staff_rating, cleanness_rating, comments, isLabRecommended } = this.state

            if (reviewCondition == 'ADD') {
                if (wait_time_rating != 0 || staff_rating != 0 || cleanness_rating != 0) {
                    const overallrating = (cleanness_rating + staff_rating + wait_time_rating) / 3;
                    const insertReviewData = {
                        user_id: userId,
                        lab_id: labId,
                        appointment_id: appointmentId,
                        is_anonymous: isAnonymous,
                        wait_time_rating: wait_time_rating,
                        staff_rating: staff_rating, // 1 to 5
                        cleanness_rating: cleanness_rating,
                        overall_rating: overallrating,
                        comments: comments,
                        is_lab_recommended: isLabRecommended,
                        is_review_added: true,
                    };
                    let result = await insertReviews(userId, insertReviewData);
                    this.props.popupVisible({
                        visible: false,
                        updatedVisible: true
                    });
                }
                else {
                    this.setState({ ratingIndicatePopUp: true })
                    return true
                }
            }
            else {
              
                this.props.popupVisible({
                    visible: false,
                    updatedVisible: false
                });
            }
        }

        catch (e) {
            console.log(e);
        }
    }

    CleanlinessStarRating(rating) {
        this.setState({
            cleanness_rating: rating
        });
    }
    staffStarRating(rating) {
        this.setState({
            staff_rating: rating
        });
    }
    waittimeStarRating(rating) {
        this.setState({
            wait_time_rating: rating
        });
    }

    render() {
        const { data, isAnonymous, isLabRecommended, ratingIndicatePopUp } = this.state;
        return (
            <Container style={styles.container}>
                    <Grid style={{
                        backgroundColor: '#fff',
                        position: 'absolute',
                        bottom: 5,
                        marginLeft:10,
                        marginRight:10,
                    }}>
                        <Row style={{ backgroundColor: '#7F49C3', paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                            <Left>
                                <Text style={{ color: '#fff', fontSize: 16 }}>{data.labInfo && data.labInfo.lab_name}</Text>
                            </Left>
                            <Right>
                                <Text style={{ color: '#fff', fontSize: 12 }}>{formatDate(data.appointment_starttime, "MMMM DD-YYYY  hh:mm a")}</Text>
                            </Right>
                        </Row>
                        <View>

                            <Row style={{ marginTop: 20 }}>
                                <Left style={{ marginLeft: 20 }}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 16 }}>Service quality</Text>
                                </Left>
                                <Right style={{ marginRight: 20 }}>
                                    <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 110, marginLeft: 50 }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={this.state.cleanness_rating}
                                        selectedStar={(rating) => this.CleanlinessStarRating(rating)}

                                    />
                                </Right>
                            </Row>
                            <Row style={{ marginTop: 20 }}>
                                <Left style={{ marginLeft: 20 }}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 16 }}>Staff</Text>
                                </Left>
                                <Right style={{ marginRight: 20 }}>
                                    <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 110, marginLeft: 97 }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={this.state.staff_rating}
                                        selectedStar={(rating) => this.staffStarRating(rating)}

                                    />
                                </Right>
                            </Row>
                            <Row style={{ marginTop: 20 }}>
                                <Left style={{ marginLeft: 20 }}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 16 }}>Wait Time</Text>
                                </Left>
                                <Right style={{ marginRight: 20 }}>
                                    <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 110, marginLeft: 60 }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={this.state.wait_time_rating}
                                        selectedStar={(rating) => this.waittimeStarRating(rating)}

                                    />
                                </Right>
                            </Row>
                            <Row style={{ marginTop: 20, marginLeft: 14, marginRight: 20 }}>
                                <Col style={{ flexDirection: 'row', width: '45%', alignItems: "center", justifyContent: 'flex-start' }}>
                                         <CheckBox style={{borderRadius:5}}
                                             status={isAnonymous ? true : false}
                                               checked={this.state.isAnonymous}
                                               onPress={() => { this.setState({ isAnonymous: !isAnonymous }); }}
                                               />
                                    <Text style={{ color: '#3C98EC', fontSize: 12,marginLeft:20 }}>Anonymous</Text>
                                </Col>
                                <Col style={{ flexDirection: 'row', width: '55%', alignItems: "center", justifyContent: 'flex-start' }}>

                                      <CheckBox style={{borderRadius:5}}
                                             status={isLabRecommended ? true : false}
                                               checked={this.state.isLabRecommended}
                                             onPress={() => { this.setState({ isLabRecommended: !isLabRecommended }); }}
                                             />
                                    <Text style={{ color: '#3C98EC', fontSize: 12,marginLeft:20 }}>Recommend this Lab</Text>
                                </Col>

                            </Row>
                            {ratingIndicatePopUp == true ? <Text style={{ color: 'red', fontSize: 12, marginTop: 10 }}>Add Rating to Continue</Text> : null}
                            <View style={{ marginLeft: 20, marginTop: 10, marginRight: 20 }}>
                                <TextInput
                                    style={{ height: 80, borderWidth: 1, marginTop: 10, width: "100%", borderRadius: 5, fontSize: 14 }}
                                    returnKeyType={'next'}
                                    placeholder="Write your reviews"
                                    multiline={true}
                                    keyboardType={'default'}
                                    textAlignVertical={'top'}
                                    onChangeText={(comments) => {
                                        this.setState({ comments })
                                    }
                                    } />
                            </View>
                        </View>

                        <Row style={{ marginLeft: 20, marginTop: 10, marginRight: 20, marginBottom:10 }}>

                            <Col style={{ width: '50%' }}>
                            </Col>
                            <Col style={{ width: '50%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                <TouchableOpacity style={{ backgroundColor: '#959595', paddingLeft: 20, paddingRight: 20, paddingTop: 1, paddingBottom: 3, borderRadius: 2 }}><Text uppercase={true} style={{ color: '#FFF', fontSize: 12, }} onPress={() => this.submitReview('SKIP')} >Cancel</Text></TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: '#349631', paddingLeft: 20, paddingRight: 20, paddingTop: 1, paddingBottom: 3, borderRadius: 2, marginLeft: 10 }}><Text uppercase={true} style={{ color: '#FFF', fontSize: 12 }} onPress={() => this.submitReview('ADD')}>Submit</Text></TouchableOpacity>
                            </Col>


                        </Row>
                    </Grid>
            </Container>
        );
    }
}

export default labInsertReviews


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },

    card: {
        width: 'auto',
        borderRadius: 100,

    },
    title: {
        paddingLeft: 40, paddingTop: 10

    },
    // grid: {
    //   backgroundColor: '#f5f5f5',
    //   marginBottom: 5,
    //   marginTop: 5,
    //   height: 'auto',
    //   width: 'auto',
    //   marginLeft: 5,
    //   marginRight: 5
    // },
    // card: {
    //   backgroundColor: '#f5f5f5',
    //   marginBottom: 10,
    //   marginTop: 10,
    //   height: 'auto',
    //   width: 'auto',
    //   marginLeft: 10,
    //   marginRight: 10

    // },
    text: {
        backgroundColor: "grey",
        color: "white",
        fontSize: 15
    },

    subcard: {
        backgroundColor: 'grey',
        marginBottom: 10,
        marginTop: 10,
        width: 'auto',
        marginLeft: 15
    },

    button1: {
        backgroundColor: "#7459a0",
        borderRadius: 15,
        justifyContent: 'center',
        padding: 40,
        marginTop: 20,
        fontSize: 15,
        marginBottom: 10,

    }

})

