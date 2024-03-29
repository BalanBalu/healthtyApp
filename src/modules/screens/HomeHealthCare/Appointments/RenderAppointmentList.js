


import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon, Right } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import StarRating from "react-native-star-rating";
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { renderDoctorImage, getName, getHomeHealthCareUserAddress } from '../../../common';
import { formatDate, statusValue } from "../../../../setup/helpers";
import styles from '../Styles';
import {primaryColor} from '../../../../setup/config';
import {translate} from '../../../../setup/translator.helper';

export default class RenderAppointmentList extends Component {
    constructor(props) {
        super(props)
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.props.shouldUpdate === nextProps.shouldUpdate) return false
    //     return true
    // }

    render() {
        const { appointmentData: { item, selectedIndex, index, navigation }, onPressNavigateToInsertReviewPage, onPressGoToBookAppointmentPage } = this.props;
        return (
            <Card transparent style={{ borderBottomWidth: 0.3, paddingBottom: 10, marginTop: 10 }}>
                <TouchableOpacity onPress={() =>
                    navigation.navigate("HomeHealthcareAppointmentDetail", {
                        data: item.appointmentResult, selectedIndex
                    })}
                    testID='navigateLabAppointmentInfo'>
                    <Text style={styles.tokenText} >{"Ref no :" + item.appointmentResult.token_no}</Text>
                    <Row style={{ marginTop: 10 }}>
                        <Col size={2}>
                            <TouchableOpacity onPress={() => navigation.navigate("ImageView", { passImage: renderDoctorImage(item), title: 'Profile photo' })}>
                                <Thumbnail
                                    circular
                                    source={renderDoctorImage(item)}
                                    style={{ height: 60, width: 60 }}
                                />
                            </TouchableOpacity>
                        </Col>
                        <Col size={8}>
                            <Row style={{ borderBottomWidth: 0 }}>
                                <Col size={9}>
                                    <Text style={styles.nameText}>{(item.prefix != undefined ? item.prefix + ' ' : '') + getName(item.appointmentResult.doctorInfo)}</Text>
                                </Col>
                            </Row>
                            <Row style={{ borderBottomWidth: 0 }}>
                                <Text
                                    style={{ fontFamily: "Roboto", fontSize: 14, width: '60%' }}
                                >
                                    {item.specialist}
                                </Text>

                                {selectedIndex == 1 && item.appointmentResult.reviewInfo != undefined && item.appointmentResult.reviewInfo.overall_rating !== undefined && (
                                    <StarRating
                                        fullStarColor="#FF9500"
                                        starSize={15}
                                        containerStyle={{
                                            width: 80,
                                            marginLeft: "auto",
                                        }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={item.appointmentResult.reviewInfo.overall_rating}

                                    />
                                )}
                            </Row>
                            <Text style={styles.mainText}>{item.degree}</Text>
                            {item.appointmentResult && item.appointmentResult.patient_location && item.appointmentResult.patient_location.address ?
                                <View>
                                    <Text style={[styles.mainText, { color: primaryColor }]}>{translate("Visit home address :")}</Text>
                                    <Text style={styles.subinnerText} note>{getHomeHealthCareUserAddress(item.appointmentResult.patient_location.address)}
                                    </Text>
                                </View>
                                : null}
                            <Text style={[styles.mainText, { color: primaryColor }]}>{translate("Visited On :")}</Text>
                            <Text style={styles.subinnerText} note>
                                {formatDate(item.appointmentResult.appointment_date, "dddd,MMMM DD-YYYY")} </Text>
                            <Row>
                                <Col size={4} style={{ justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: "opensans-bold", fontSize: 13, color: statusValue[item.appointmentResult.appointment_status].color,  }} note>{translate(statusValue[item.appointmentResult.appointment_status].text)}</Text>
                                </Col>

                            </Row>
                            {selectedIndex == 1 &&
                                item.appointmentResult.appointment_status == "COMPLETED" && (item.appointmentResult.is_review_added == undefined || item.appointmentResult.is_review_added == false) ? (
                                    <Row style={{ borderBottomWidth: 0 }}>
                                        <Right style={(styles.marginRight = -2)}>
                                            <Button style={styles.shareButton}
                                                onPress={() => onPressNavigateToInsertReviewPage(item, index)}
                                                testID='navigateInsertReview'>
                                                <Text style={styles.bookAgain1}>{translate("Add Review")}</Text>
                                            </Button>
                                        </Right>

                                        <Right style={(styles.marginRight = 5)}>
                                            <Button style={styles.bookingButton} onPress={() => onPressGoToBookAppointmentPage(item)}>
                                                <Text style={styles.bookAgain1} testID='navigateBookAppointment'>{translate("Book Again")}</Text>
                                            </Button>
                                        </Right>
                                    </Row>

                                ) : (
                                    selectedIndex === 1 && (
                                        <Row style={{ borderBottomWidth: 0 }}>
                                            <Right style={(styles.marginRight = 10)}>
                                                <Button style={styles.bookingButton} onPress={() => onPressGoToBookAppointmentPage(item)} testID='navigateBookingPage'>
                                                    <Text style={styles.bookAgain1}>
                                                        {translate("Book Again")}
											       </Text>
                                                </Button>
                                            </Right>
                                        </Row>
                                    )
                                )}
                        </Col>
                    </Row>
                </TouchableOpacity>
            </Card>
        )
    }
}


