
import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import StarRating from 'react-native-star-rating';
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image, TextInput,Platform } from 'react-native';
import styles from './styles'


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
            <Button disabled style={{ alignItems: 'center', borderRadius: 10, backgroundColor: '#6e5c7b' }}>
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
        source = require('../../../../assets/icon.png')
    }

    return (source)
}
const RenderEditingPincode = (props) => {
    const { value, onChangeSelection, isPincodeEditVisible  } = props;
    return (
        
   
      isPincodeEditVisible === false ?
        <Row style={{ padding: 5, height: 40 }}>
                <Col size={8}>
                    <Text style={styles.showingDoctorText}>Showing Hospitals in the 
                        <Text style={styles.picodeText}>{" "}PinCode - {value}</Text>
                    </Text>
                </Col>
                <Col size={2}>
                    <Row style={{ justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.editPincodeButton} onPress={() => onChangeSelection(true)} >
                            <Text style={{ fontFamily: 'OpenSans', color: '#ff4e42', fontSize: 10, }}>Edit Pincode </Text>
                        </TouchableOpacity>
                    </Row>
                </Col>
        </Row>
        
        :
        <Row style={{ padding: 5, height: 45 }}>
            <Col size={7.5} style={{ borderColor: 'gray', borderWidth: 0.5 }}>
                <TextInput
                    placeholder='Enter PinCode'
                    style={ Platform.OS === "ios" ?{ fontSize: 12, marginLeft: 5, borderRadius: 5,marginTop:9  } :
                    {fontSize: 12, marginLeft: 5, borderRadius: 5, textAlign: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}
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
            <Col size={2}>
                <TouchableOpacity style={{ paddingBottom: 10, paddingTop: 10, paddingLeft: 10, paddingRight: 10, backgroundColor: 'green', borderRadius: 3, alignItems: 'center', marginLeft: 5 }} onPress={() => props.onPressEditButton()}>
                    <Text style={{ fontFamily: 'OpenSans', color: '#fff', fontSize: 12, textAlign: 'center',fontWeight:'bold' }}>Apply</Text>
                </TouchableOpacity>
            </Col>
        </Row>
        
      
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
    RenderEditingPincode
}