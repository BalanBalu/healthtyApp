import React, { PureComponent } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import StarRating from 'react-native-star-rating';
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image } from 'react-native';
import { renderDoctorImage, getDoctorSpecialist, getDoctorEducation, getDoctorExperience } from '../../common';
const vipLogo = require('../../../../assets/images/viplogo.png')

export default class RenderSponsorList extends PureComponent {
    constructor(props) {
        super(props)
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     // if (nextProps !== this.props) {
    //     //     return true
    //     // }
    // }

    render() {
        const { item, docInfoData: { fee, feeWithoutOffer, docReviewListCountOfDoctorIDs }, onPressGoToBookAppointmentPage } = this.props;
        return (
            <View>
                <Card style={{ padding: 10, borderRadius: 10, borderBottomWidth: 2, marginLeft: 10 }}>
                    <Grid onPress={() => onPressGoToBookAppointmentPage(item)}>
                        <Row>
                            <Col size={2}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderDoctorImage(item), title: 'Profile photo' })}>
                                    <Thumbnail source={renderDoctorImage(item)} style={{ height: 50, width: 50, borderRadius: 50 / 2 }} />
                                </TouchableOpacity>
                                <View style={{ position: 'absolute', marginTop: 35, alignSelf: 'flex-end' }}>
                                    <Image square source={vipLogo} style={{ height: 20, width: 20 }} />
                                </View>
                            </Col>
                            <Col size={8} style={{ marginLeft: 10 }}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold' }}>{(item.prefix ? item.prefix + '. ' : '') + (item.first_name || '') + ' ' + (item.last_name || '')}</Text>

                                <Text style={{ fontFamily: 'OpenSans', marginTop: 2, fontSize: 10, marginTop: 5, fontWeight: 'bold' }}>{(getDoctorEducation(item.education)) + ' ' + getDoctorSpecialist(item.specialist)}</Text>

                                <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', marginTop: 5, fontSize: 11, color: '#808080' }}>
                                    {item.hospitalInfo && item.hospitalInfo.hospital.name + ' - ' + item.hospitalInfo && item.hospitalInfo.hospital.location && item.hospitalInfo.hospital.location.address.city}
                                </Text>
                                <Text style={{ fontFamily: 'OpenSans', marginTop: 2, fontSize: 10, marginTop: 5, fontWeight: 'bold', color: '#808080' }}>Experience: {getDoctorExperience(item.calculatedExperience)} </Text>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Text note style={{ fontFamily: 'OpenSans', fontSize: 10, textAlign: 'center', marginTop: 2 }}> Rating -</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 5 }}>
                                <StarRating
                                    fullStarColor='#FF9500'
                                    starSize={12}
                                    width={85}
                                    containerStyle={{ marginTop: 2 }}
                                    disabled={true}
                                    rating={1}
                                    maxStars={1}
                                />
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', marginLeft: 2 }}> {docReviewListCountOfDoctorIDs[item.doctor_id] !== undefined ? docReviewListCountOfDoctorIDs[item.doctor_id].average_rating : ' 0'}</Text>
                            </View>
                            <Text note style={{ fontFamily: 'OpenSans', fontSize: 10, textAlign: 'center', marginLeft: 10, marginTop: 2 }}> Fees -</Text>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginLeft: 10 }}>{'\u20B9'}{fee} {' '}
                                {fee !== feeWithoutOffer ?
                                    <Text style={{ fontFamily: 'OpenSans', fontWeight: 'normal', fontSize: 12, textDecorationLine: 'line-through', textDecorationStyle: 'solid', textAlign: 'center' }}>
                                        {'\u20B9'}{feeWithoutOffer}</Text> : null
                                }
                            </Text>
                            <TouchableOpacity onPress={() => onPressGoToBookAppointmentPage(item)} style={{ backgroundColor: '#7F49C3', borderRadius: 10, marginLeft: 10, paddingLeft: 15, paddingRight: 15, paddingTop: 2, paddingBottom: 2, justifyContent: 'center', }}>
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 10, fontWeight: 'bold', fontFamily: 'OpenSans' }}>BOOK </Text>
                            </TouchableOpacity>
                        </Row>
                    </Grid>
                </Card>
            </View>
        )
    }
}
