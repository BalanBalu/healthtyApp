import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image } from 'react-native';
import { RenderFavoritesComponent, RenderFavoritesCount, RenderStarRatingCount } from '../../CommonAll/components';
import { renderDoctorImage, getDoctorSpecialist, getDoctorEducation, getDoctorExperience } from '../../../common';

export default class RenderDoctorInfoPreview extends Component {
    constructor(props) {
        super(props)
    }

    getDistance(distanceInMeter) {
        if (!isNaN(distanceInMeter)) {
            if (distanceInMeter > 0) {
                const distanceInMeter = Number(distanceInMeter).toFixed(3)
                const distanceInNumber = Number(distanceInMeter.split('.')[1]);
                return distanceInNumber + 'm'
            } else {
                const distanceInKm = Number(distanceInMeter).toFixed(1) + 'Km'
                return distanceInKm;
            }
        }
    }

    render() {
        debugger
        console.log('Rendering Doc Details Preview====>');
        const { doctorData, docInfoData: { isLoggedIn, fee, feeWithoutOffer, patientFavoriteListCountOfDoctorIds, docFavoriteListCountOfDoctorIDs, docReviewListCountOfDoctorIDs }, addToFavoritesList } = this.props;
        debugger
        return (
            <View>

                <Row >
                    <Col style={{ width: '5%', marginLeft: 20, marginTop: 10 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderDoctorImage(doctorData), title: 'Profile photo' })}>
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
                        <Row>
                            <RenderFavoritesComponent
                                isFromLabBookApp={true}
                                isLoggedIn={isLoggedIn}
                                isEnabledFavorites={patientFavoriteListCountOfDoctorIds.includes(doctorData.doctor_id)}
                                onPressFavoriteIcon={() => addToFavoritesList(doctorData.doctor_id)}
                            />
                        </Row>
                    </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                    <Col style={{ width: "25%", marginTop: 15, }}>
                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center' }}> Experience</Text>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}> {getDoctorExperience(doctorData.calculatedExperience)}</Text>
                    </Col>
                    <Col style={{ width: "25%", marginTop: 15, }}>

                        <RenderStarRatingCount
                            isFromLabBookApp={true}
                            totalRatingCount={docReviewListCountOfDoctorIDs[doctorData.doctor_id] ? docReviewListCountOfDoctorIDs[doctorData.doctor_id].average_rating : ' 0'}
                        />

                    </Col>
                    <Col style={{ width: "25%", marginTop: 15, }}>
                        <RenderFavoritesCount
                            isFromLabBookApp={true}
                            favoritesCount={docFavoriteListCountOfDoctorIDs[doctorData.doctor_id] !== undefined ? docFavoriteListCountOfDoctorIDs[doctorData.doctor_id] : '0'}
                        />
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

            </View>
        )
    }
}
