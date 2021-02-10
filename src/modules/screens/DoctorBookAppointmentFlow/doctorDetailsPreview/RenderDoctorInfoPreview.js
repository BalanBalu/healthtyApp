import React, { Component } from 'react';
import {
    Container, Content, Text, Segment, Button, Card, Right, Thumbnail, Icon, Toast, Item, Footer, Spinner
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Image } from 'react-native';
import StarRating from 'react-native-star-rating';
import { renderDoctorImage, getDoctorSpecialist, getDoctorEducation, getDoctorExperience } from '../../../common';
import {primaryColor} from '../../../../setup/config'

export default class RenderDoctorInfoPreview extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { doctorData, navigation, shareDocInfo, docInfoData: { isLoggedIn, fee, feeWithoutOffer, isVideoAvailability, isChatAvailability, patientFavoriteListCountOfDoctorIds, docFavoriteListCountOfDoctorIDs, docReviewListCountOfDoctorIDs }, addToFavoritesList } = this.props;
        return (
            <View>

                <Row >
                    <Col style={{ width: '5%', marginLeft: 20, marginTop: 10 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderDoctorImage(doctorData), title: 'Profile photo' })} style={{ paddingRight: 60, paddingBottom: 5 }}>
                            <Thumbnail square source={renderDoctorImage(doctorData)} style={{ height: 60, width: 60, borderRadius: 60 / 2 }} />
                        </TouchableOpacity>
                    </Col>
                    <Col style={{ width: '78%' }}>
                        <Row style={{ marginLeft: 55, marginTop: 10 }}>
                            <Col size={9}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold' }}>{(doctorData.prefix ? doctorData.prefix + '. ' : '') + (doctorData.first_name || '') + ' ' + (doctorData.last_name || '')}</Text>
                                <Text note style={{ fontFamily: 'OpenSans', fontSize: 11, marginTop: 5 }}>{(getDoctorEducation(doctorData.education)) + ' ' + getDoctorSpecialist(doctorData.specialist)}</Text>
                            </Col>
                            <Col size={1}>
                            </Col>
                        </Row>
                    </Col>
                    <Col style={{ width: '17%' }}>
                        {isLoggedIn ?
                            <TouchableOpacity style={{ paddingBottom: 10, paddingTop: 10, paddingRight: 10, paddingLeft: 10, marginLeft: -20 }} onPress={() => addToFavoritesList(doctorData.doctor_id)}>
                                <Icon name="heart"
                                    style={patientFavoriteListCountOfDoctorIds.includes(doctorData.doctor_id) ? { color: '#B22222', fontSize: 23, marginTop: 10 } : { color: '#000000', fontSize: 23, marginTop: 10 }}>
                                </Icon>
                            </TouchableOpacity> : null}
                    </Col>
                </Row>
                <Row style={{ borderBottomWidth: 0.3, borderBottomColor: 'gray', paddingBottom: 10, marginLeft: 10, marginRight: 10 }}>
                    <Col style={{ width: "25%", marginTop: 15, }}>
                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center' }}> Experience</Text>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}> {getDoctorExperience(doctorData.calculatedExperience || doctorData.calulatedExperience)}</Text>
                    </Col>
                    <Col style={{ width: "25%", marginTop: 15, }}>
                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center' }}> Rating</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <StarRating
                                fullStarColor='#FF9500'
                                starSize={12} width={85}
                                containerStyle={{ marginTop: 2 }}
                                disabled={true}
                                rating={1}
                                maxStars={1} />
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>{docReviewListCountOfDoctorIDs[doctorData.doctor_id] ? ' ' + docReviewListCountOfDoctorIDs[doctorData.doctor_id].average_rating : ' 0'}</Text>
                        </View>
                    </Col>
                    <Col style={{ width: "25%", marginTop: 15, }}>

                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center' }}> Favourite</Text>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}> {docFavoriteListCountOfDoctorIDs[doctorData.doctor_id] ? docFavoriteListCountOfDoctorIDs[doctorData.doctor_id] : 0}</Text>
                    </Col>
                    <Col style={{ width: "25%", marginTop: 15, }}>
                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center' }}> Fees</Text>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginLeft: 10 }}>{'\u20B9'}{fee}{' '}

                            {fee !== feeWithoutOffer ?
                                <Text style={{ fontWeight: 'normal', fontFamily: 'OpenSans', fontSize: 12, textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginLeft: 8, textAlign: 'center' }}>
                                    {'\u20B9'}{feeWithoutOffer}</Text> : null
                            }
                        </Text>

                    </Col>
                </Row>
                <Row style={{ marginLeft: 10, marginRight: 10, justifyContent: 'center', alignItems: "center", marginTop: 10, marginBottom: 5 }}>
                    {isVideoAvailability === true ?
                        <Col size={3.3} style={{ justifyContent: 'center', alignItems: "center" }}>
                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.navigate("Video and Chat Service")}>
                                <Icon name="ios-videocam" style={{ fontSize: 25, color: primaryColor }} />
                                <Text style={{ marginLeft: 5, fontFamily: 'OpenSans', fontSize: 13, color: primaryColor, marginTop: 3 }}>Video</Text>
                            </TouchableOpacity>
                        </Col>
                        : null}
                    {isChatAvailability === true ?
                        <Col size={3.3} style={{ justifyContent: 'center', alignItems: "center" }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center" }} onPress={() => navigation.navigate("Video and Chat Service")}>
                                <Icon name="chatbox" style={{ fontSize: 20, color: primaryColor,marginTop:2 }} />
                                <Text style={{ marginLeft: 5, fontFamily: 'OpenSans', fontSize: 13, color: primaryColor,  }}>Chat</Text>
                            </TouchableOpacity>
                        </Col>
                        : null}
                    <Col size={3.3} style={{ justifyContent: 'center', alignItems: "center" }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center" }} onPress={() => shareDocInfo(doctorData)}>
                            <Icon name="share-social" style={{ fontSize: 20, color: primaryColor }} />
                            <Text style={{ marginLeft: 5, fontFamily: 'OpenSans', fontSize: 13, color: primaryColor, }}>Share</Text>
                        </TouchableOpacity>
                    </Col>
                </Row>
            </View>
        )
    }
}

