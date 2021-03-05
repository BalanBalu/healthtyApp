
import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, CardItem, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import StarRating from 'react-native-star-rating';
import { StyleSheet, TouchableOpacity, View, FlatList, Dimensions, ScrollView, Image, TextInput, Platform } from 'react-native';
import noAppointmentImage from "../../../../assets/images/noappointment.png";
import styles from './styles';
import { formatDate } from "../../../setup/helpers";
import {primaryColor} from '../../../setup/config'



const onPressPreviewImagesInZoom = (data, navigation) => {
    navigation.navigate('ZoomImageViewer', {
        images: !data.length ? '' : data.map(ele => {
            return {
                url: ele.imageURL,
                width: 400, height: 400,
            }
        }), tittle: 'Photos'
    })
}


const SingleImageViewInSquareShape = (props) => {
    const { source, style } = props;
    return (
        <Image
            source={source}
            style={style}
        />
    )
}
const RenderProposeNewPopPage = (props) => {
    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
            <View style={{
                width: '95%',
                height: '25%',
                backgroundColor: '#fff',
                borderColor: 'gray',
                borderWidth: 3,
                padding: 10,
                borderRadius: 10
            }}>
                <CardItem header style={{
                    backgroundColor: primaryColor,
                    marginBottom: -10,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    marginLeft: -10,
                    marginBottom: -10,
                    marginRight: -10,
                    height: 35,
                    marginTop: -10
                }}>
                    <Text style={{ fontSize: 13, fontFamily: 'OpenSans', fontWeight: 'bold', marginTop: -5, color: '#FFF', marginLeft: -5 }}>{'Doctor has Rescheduled the appointment !'}</Text></CardItem>
                <Row style={{ justifyContent: 'center' }}>
                    <Col style={{ width: '25%' }}>
                        <Text style={{ fontSize: 12, fontFamily: 'OpenSans', textAlign: 'center', marginTop: 10, color: 'red', textDecorationLine: 'line-through', textDecorationStyle: 'double', textDecorationColor: 'gray' }}>{props.data.previous_data ? formatDate(props.data.previous_data.appointment_date, "DD/MM/YYYY") : null}</Text>
                    </Col>
                    {/* <Col style={{ width: '75%' }}>
                                        <Text style={{ fontSize: 12, fontFamily: 'OpenSans', textAlign: 'center', marginTop: 10, color: 'red', textDecorationLine: 'line-through', textDecorationStyle: 'double', textDecorationColor: 'gray' }}>{props.data.previous_data ? formatDate(props.data.previous_data.startDateTime, "hh:mm a") + formatDate(props.data.previous_data.endDateTime, "-hh:mm a") : null}</Text>
                                    </Col> */}

                </Row>
                <Row style={{ justifyContent: 'center' }}>
                    <Col style={{ width: '30%' }}>
                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', textAlign: 'center', marginTop: 10, color: 'green' }}>{formatDate(props.data.appointment_date, "DD/MM/YYYY")}</Text>
                    </Col>
                    {/* <Col style={{ width: '70%' }}>
                                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', textAlign: 'center', marginTop: 10, color: 'green' }}>{formatDate(props.data.appointment_starttime, "hh:mm a") + formatDate(props.data.appointment_endtime, "-hh:mm a")}</Text>
                                    </Col> */}

                </Row>
                <Row style={{ marginTop: 15, justifyContent: 'flex-end', marginBottom: 15 }}>
                    <Col size={2}></Col>
                    <Col size={8} >
                        <Row>
                            <Col size={3} style={{ marginRight: 3 }}>
                                <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 5, backgroundColor: primaryColor }}
                                    onPress={() => props.skipAction()} testID='confirmButton'>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 14, textAlign: 'center', color: '#fff' }}>{'Skip'}</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={3.4} style={{ marginRight: 3 }} >
                                <TouchableOpacity style={{ backgroundColor: '#6FC41A', paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 5, }} onPress={() => props.onPressUpdateAppointmentStatus(props.data, 'APPROVED')} testID='confirmButton'>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center', color: '#fff' }}>{'ACCEPT'}</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={3.6}>
                                <TouchableOpacity danger style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 5, backgroundColor: 'red' }} onPress={() => props.onPressNavigateToCancelAppointment()} testID='cancelButton'>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center', color: '#fff' }}> {'CANCEL'}</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </View>
        </View>
    )
}
const RenderNoAppointmentsFounds = (props) => {
    return (
        <Card transparent style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: "20%"
        }}>
            <Thumbnail
                square
                source={noAppointmentImage}
                style={{ height: 100, width: 100, marginTop: "10%" }}
            />
            <Text style={{
                fontFamily: "OpenSans",
                fontSize: 15,
                marginTop: "10%"
            }}>{props.text}
            </Text>
            <Item style={{ marginTop: "15%", borderBottomWidth: 0 }}>
                <Button onPress={() => props.onPressGoToBookNow('BOOK_NOW')} style={[styles.bookingButton, styles.customButton]} testID='navigateToHome'>
                    <Text style={{ fontFamily: 'Opensans', fontSize: 15, fontWeight: 'bold' }}>Book Now</Text>
                </Button>
            </Item>
        </Card>
    )
}
const RenderAddressInfo = (props) => {
    return (
        props.addressInfo ?
            <View>
                <Text note style={{ fontFamily: 'OpenSans', marginTop: 5, fontSize: 11, color: '#4c4c4c' }}>{
                    props.addressInfo.no_and_street + ' , ' +
                    props.addressInfo.district + ' , ' +
                    props.addressInfo.city + ' , ' +
                    props.addressInfo.state}</Text>
            </View> : null
    )
}

const RenderPriceDetails = (props) => {

    return (
        <>
            <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center' }}>Package Amt</Text>
            <Row style={{ justifyContent: 'center' }}>
                <Text style={styles.finalRs}>₹ {(parseInt(props.priceInfo.branch_details.price) - ((parseInt(props.priceInfo.branch_details.offer) / 100) * parseInt(props.priceInfo.branch_details.price)))}</Text>
                {/* <Text style={styles.finalRs}>₹ {item.finalAmount || ''}</Text> */}
            </Row>
        </>
    )
}

const RenderOfferDetails = (props) => {

    return (
        <>
            <Text note style={props.isFromLabBookApp ? styles.offerText4LalBookApp : styles.offerText}>Offer</Text>
            <Text style={props.isFromLabBookApp ? styles.offer4LabBookApp : styles.offer}>{props.offerInfo ? props.offerInfo : '0'}%</Text>
        </>
    )
}

const RenderStarRatingCount = (props) => {
    return (
        <>
            <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center', }}> Rating</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <StarRating
                    fullStarColor='#FF9500'
                    starSize={12}
                    width={85}
                    containerStyle={{ marginTop: 2 }}
                    disabled={true}
                    rating={1}
                    maxStars={1}
                />
                <Text style={props.isFromLabBookApp ? styles.ratingCount4LalBookApp : styles.ratingCount}>{props.totalRatingCount}</Text>
            </View>
        </>
    )
}

const RenderFavoritesCount = (props) => {
    return (
        <>
            <Text note style={props.isFromLabBookApp ? styles.favoritesText4LalBookApp : styles.favoritesText}> Favorites</Text>
            <Text style={props.isFromLabBookApp ? styles.favoritesCount4LalBookApp : styles.favoritesCount}>{props.favoritesCount}</Text>
        </>
    )
}


const RenderFavoritesComponent = (props) => {
    return (
        <TouchableOpacity disabled={props.isButtonEnable} onPress={() => props.onPressFavoriteIcon()}>
            {props.isLoggedIn ?
                <Icon name="heart"
                    style={props.isEnabledFavorites ? props.isFromLabBookApp ? styles.isEnabledFavorite4LalBookApp : styles.isEnabledFavorite : props.isFromLabBookApp ? styles.isDisabledFavorite4LalBookApp : styles.isDisabledFavorite}>
                </Icon> : null}
        </TouchableOpacity>
    )
}
const RenderNoSlotsAvailable = (props) => {
    return (
        <Row style={{ justifyContent: 'center', marginTop: 20 }}>
            <Button disabled style={{ alignItems: 'center', borderRadius: 10, backgroundColor: primaryColor }}>
                <Text>{props.text}</Text>
            </Button>
        </Row>
    )
}

const RenderListNotFound = (props) => {
    return (
        <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, justifyContent: 'center', alignItems: 'center' }} >{props.text}</Text>
        </Item>
    )
}



const renderLabProfileImage = (data) => {

    let source = null;
    if (!data) {
        return (source)
    }
    if (data.profile_image) {
        source = { uri: data.profile_image.imageURL }
    } else {
        console.log("data>>>>>>>>>>>>>>....",data)
        source = require('../../../../assets/images/Lab-tests.png')
    }

    return (source)
}
const RenderEditingPincode = (props) => {
    const { value, onChangeSelection, isPincodeEditVisible, showPinCodeResultByType = "Hospitals" } = props;
    return (


        isPincodeEditVisible === false ?
            <Row style={{ padding: 5, height: 40 }}>
                <Col size={8}>
                    <Text style={styles.showingDoctorText}>{"Showing " + showPinCodeResultByType + " in the"}
                        <Text style={styles.picodeText}>{" "}PinCode - {value}</Text>
                    </Text>
                </Col>
                <Col size={2}>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.editPincodeButton} onPress={() => onChangeSelection(true)} >
                            <Text style={{ fontFamily: 'OpenSans', color: 'gray', fontSize: 10, }}>Edit Pincode </Text>
                        </TouchableOpacity>
                    </Row>
                </Col>
            </Row>

            :
            <Row style={{ padding: 5, height: 45 }}>
                <Col size={7.5} style={{ borderColor: 'gray', borderWidth: 0.7 }}>
                    <TextInput
                        placeholder='Enter PinCode'
                        style={Platform.OS === "ios" ? { fontSize: 12, marginLeft: 5, borderRadius: 5, marginTop: 9 } :
                            { fontSize: 12, marginLeft: 5, borderRadius: 5, textAlign: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}
                        keyboardType="numeric"
                        maxLength={7}
                        placeholderTextColor="#C1C1C1"
                        returnKeyType={'go'}
                        autoFocus={true}
                        value={props.value}
                        onChangeText={props.onChangeText}
                        multiline={false}
                    />
                </Col>
                <Col size={2.5}>
                    <TouchableOpacity style={{ paddingBottom: 10, paddingTop: 9, paddingLeft: 10, paddingRight: 10, backgroundColor: 'green', borderRadius: 3, alignItems: 'center', marginLeft: 5 }} onPress={() => props.onPressEditButton()}>
                        <Text style={{ fontFamily: 'OpenSans', color: '#fff', fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>Apply</Text>
                    </TouchableOpacity>
                </Col>
            </Row>


    )
}
/*  Render Corporate Beneficiary Information */
const RenderBeneficiaryInfo = (props) => {
    const { data,isShowBeneficiaryInfoCard } = props;
    if (!isShowBeneficiaryInfoCard) return null;
  return (
    <View style={{ backgroundColor: '#fff',marginTop:5}}>
    <Row>
        <Col size={4}>
            <Text style={styles.beneficiaryFontStyle}>Beneficiary</Text>
            <Text style={styles.beneficiaryFontStyle}>Policy Number</Text>
            <Text style={styles.beneficiaryFontStyle}>Policy Effective From</Text>
            <Text style={styles.beneficiaryFontStyle}>Policy End Date</Text>
            <Text style={styles.beneficiaryFontStyle}>Sum Insured</Text>
            <Text style={styles.beneficiaryFontStyle}>BSI</Text>
            {/* <Text style={styles.beneficiaryFontStyle}>Eligible Amount</Text> */}
        </Col>
        <Col size={0.5}>
            <Text style={styles.beneficiaryFontStyle}>:</Text>
            <Text style={styles.beneficiaryFontStyle}>:</Text>
            <Text style={styles.beneficiaryFontStyle}>:</Text>
            <Text style={styles.beneficiaryFontStyle}>:</Text>
            <Text style={styles.beneficiaryFontStyle}>:</Text>
            <Text style={styles.beneficiaryFontStyle}>:</Text>
            {/* <Text style={styles.beneficiaryFontStyle}>:</Text> */}
        </Col>
        <Col size={5.5}>
            <Text style={[styles.beneficiaryFontStyle, { color: '#909498' }]}>{data.full_name?data.full_name:null}</Text>
                <Text style={[styles.beneficiaryFontStyle, { color: '#909498' }]}>{data.policyNo||null}</Text>
            <Text style={[styles.beneficiaryFontStyle, { color: '#909498' }]}>{data.policyEffectiveFrom?formatDate(data.policyEffectiveFrom, 'DD/MM/YYYY'):null}</Text>
            <Text style={[styles.beneficiaryFontStyle, { color: '#909498' }]}>{data.policyEffectiveTo?formatDate(data.policyEffectiveTo, 'DD/MM/YYYY'):null}</Text>
            <Text style={[styles.beneficiaryFontStyle, { color: '#909498' }]}>{data.sumInsured?data.sumInsured:0}</Text>
            <Text style={[styles.beneficiaryFontStyle, { color: '#909498' }]}>{data.balSumInsured?data.balSumInsured:0}</Text>
            {/* <Text style={[styles.beneficiaryFontStyle, { color: '#909498' }]}> ₹ 0.00</Text> */}
        </Col>
    </Row>
</View>
  )
}

export {
    renderLabProfileImage,
    RenderNoSlotsAvailable,
    RenderListNotFound,
    RenderFavoritesComponent,
    RenderFavoritesCount,
    RenderStarRatingCount,
    RenderPriceDetails,
    RenderOfferDetails,
    RenderAddressInfo,
    RenderEditingPincode,
    RenderNoAppointmentsFounds,
    RenderProposeNewPopPage,
    onPressPreviewImagesInZoom,
    SingleImageViewInSquareShape,
    RenderBeneficiaryInfo
}