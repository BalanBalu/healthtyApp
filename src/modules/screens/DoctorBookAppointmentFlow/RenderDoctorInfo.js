import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, View, FlatList,  Dimensions, ScrollView, Image } from 'react-native';
import { RenderFavoritesComponent, RenderFavoritesCount, RenderStarRatingCount } from '../../screens/CommonAll/components';
import { renderDoctorImage, getDoctorSpecialist, getDoctorEducation, getDoctorExperience } from '../../common';
import { getDistance } from '../CommonAll/functions';
import {translate} from '../../../setup/translator.helper'
const vipLogo = require('../../../../assets/images/viplogo.png')

export default class RenderDoctorInfo extends Component {
    constructor(props) {
        super(props)
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.shouldUpdate === nextProps.shouldUpdate) return false
        return true
    }

    render() {
        const { item, navigation, docInfoData: { isLoggedIn, fee, feeWithoutOffer, patientFavoriteListCountOfDoctorIds, docFavoriteListCountOfDoctorIDs, docReviewListCountOfDoctorIDs }, addToFavoritesList, onPressGoToBookAppointmentPage } = this.props;
        return (
            <View>
                <Row onPress={() => onPressGoToBookAppointmentPage(item)}>
                    <Col style={{ width: '10%' }}>
                        <TouchableOpacity onPress={() => navigation.navigate("ImageView", { passImage: renderDoctorImage(item), title: 'Profile photo' })}>
                            <Thumbnail circle source={renderDoctorImage(item)} style={{ height: 60, width: 60, borderRadius: 60 / 2 }} />
                        </TouchableOpacity>
                    </Col>
                    <Col style={{ width: '73%' }}>
                        <Row style={{ marginLeft: 55, }}>
                            <Text style={{ fontFamily: 'opensans-bold', fontSize: 12,  }}>{(item.prefix ? item.prefix + '. ' : '') + (item.firstName || '') + ' ' + (item.lastName || '')}</Text>
                        </Row>
                        <Row style={{ marginLeft: 55, }}>
                            <Text note style={{ fontFamily: 'Roboto', marginTop: 2, fontSize: 11 }}>{(getDoctorEducation(item.education)) + ' ' + getDoctorSpecialist(item.specialist)}</Text>
                        </Row>
                        <Row style={{ marginLeft: 55, }}>
                            <Text note style={{ fontFamily: 'Roboto', marginTop: 5, fontSize: 11, }}>
                                {`${item.hospitalInfo && item.hospitalInfo.hospitalName} - ${item.hospitalInfo && item.hospitalInfo.city}`}
                            </Text>
                        </Row>
                    </Col>
                    <Col style={{ width: '17%' }}>
                        <Row>
                            <RenderFavoritesComponent
                                isLoggedIn={isLoggedIn}
                                isEnabledFavorites={patientFavoriteListCountOfDoctorIds.includes(item.doctor_id)}
                                onPressFavoriteIcon={() => addToFavoritesList(item.doctor_id)}
                            />
                        </Row>
                        {item.is_doctor_sponsor == true ?
                            <Row>
                                <View style={{ marginLeft: 15, alignSelf: 'center', marginTop: 3 }}>
                                    <Image square source={vipLogo} style={{ height: 30, width: 30 }} />
                                </View>
                            </Row>
                            : null}
                        <Row>
                            <Text style={{ fontFamily: 'Roboto', marginTop: 10, fontSize: 12, marginLeft: 15 }}>{getDistance(item.hospitalInfo.distInKiloMeter)}</Text>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ width: "25%", marginTop: 20 }}>
                        <Text note style={{ fontFamily: 'Roboto', fontSize: 12, }}> {translate("Experience")}</Text>
                        <Text style={{ fontFamily: 'opensans-bold', fontSize: 12, }}>{getDoctorExperience(item.calculatedExperience) || {}}</Text>
                    </Col>
                    <Col style={{ width: "25%", marginTop: 20 }}>
                        <RenderStarRatingCount
                            totalRatingCount={docReviewListCountOfDoctorIDs[item.doctor_id] ? docReviewListCountOfDoctorIDs[item.doctor_id].average_rating : ' 0'}
                        />
                    </Col>
                    <Col style={{ width: "25%", marginTop: 20 }}>
                        <RenderFavoritesCount
                            favoritesCount={docFavoriteListCountOfDoctorIDs[item.doctor_id] !== undefined ? docFavoriteListCountOfDoctorIDs[item.doctor_id] : '0'}
                        />
                    </Col>
                    <Col style={{ width: "25%", marginTop: 20 }}>
                        {/* <Text note style={{ fontFamily: 'Roboto', fontSize: 12, textAlign: 'center' }}> {translate("Fees")}</Text>
                        <Text style={{ fontFamily: 'opensans-bold', fontSize: 12,  textAlign: 'center', marginLeft: 10 }}>{'\u20B9'}{fee} {' '}
                            {fee !== feeWithoutOffer ?
                                <Text style={{ fontFamily: 'opensans-bold',  fontSize: 12, textDecorationLine: 'line-through', textDecorationStyle: 'solid', textAlign: 'center' }}>
                                    {'\u20B9'}{feeWithoutOffer || 0}</Text> : null
                            }
                        </Text> */}
                    </Col>
                </Row>
            </View>
        )
    }
}
