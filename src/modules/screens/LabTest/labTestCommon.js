
import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import StarRating from 'react-native-star-rating';
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image } from 'react-native';
import { getUnixTimeStamp } from '../../../setup/helpers';
import styles from './styles'



const RenderPriceDetails = (props) => {
    return (
        <Col style={{ width: "25%", marginLeft: 10 }}>
            <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center' }}>Package Amt</Text>
            <Row style={{ justifyContent: 'center' }}>
                <Text style={styles.finalRs}>₹ {props.priceInfo || ''}</Text>
                {/* <Text style={styles.finalRs}>₹ {item.finalAmount || ''}</Text> */}
            </Row>
        </Col>
    )
}

const RenderOfferDetails = (props) => {
    return (
        <Col style={{ width: "25%" }}>
            <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, }}>Offer</Text>
            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', color: 'green' }}>{props.offerInfo || ''} off</Text>
        </Col>
    )
}


const RenderStarRatingCount = (props) => {
    return (
        <Col style={{ width: "25%" }}>
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
                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', marginLeft: 2 }}>0</Text>
            </View>
        </Col>
    )
}

const RenderFavoritesCount = (props) => {
    return (
        <Col style={{ width: "25%", marginLeft: -10 }}>
            <Text note style={styles.favoritesText}> Favorites</Text>
            <Text style={styles.favoritesCount}>{props.favoritesCount || '0'}</Text>
        </Col>
    )
}


const RenderFavoritesComponent = (props) => {
    return (
        <Row>
            <TouchableOpacity>
                {props.isLoggedIn ?
                    <Icon name="heart" onPress={() => props.onPressFavoriteIcon()}
                        style={props.isEnabledFavorites ? styles.isEnabledFavorite : styles.isDisabledFavorite}>
                    </Icon> : null}
            </TouchableOpacity>
        </Row>
    )
}
const RenderNoSlotsAvailable = () => {
    return (
        <Row style={{ justifyContent: 'center', marginTop: 20 }}>
            <Button disabled style={{ alignItems: 'center', borderRadius: 10, backgroundColor: '#6e5c7b' }}>
                <Text>No Slots Available</Text>
            </Button>
        </Row>
    )
}

const RenderListNotFound = () => {
    return (
        <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, justifyContent: 'center', alignItems: 'center' }} > No Lab list found! </Text>
        </Item>
    )
}


const enumerateStartToEndDates = (startDateByMoment, endDateByMoment, datesArry) => {
    let startDate = startDateByMoment.clone();
    // const datesArry = [];
    while (startDate.isSameOrBefore(endDateByMoment)) {
        datesArry.push(startDate.format('YYYY-MM-DD'));
        startDate = startDate.add(1, 'day');
    }
    return datesArry
}

const renderLabTestImage = (data) => {
    let source = null;
    if (data.profile_image) {
        source = { uri: data.profile_image.imageURL }
    } else {
        // source = require('../../assets/images/Logo.png')
    }
    return (source)
}


const reducer = (total, currentValue, currentIndex, originalArry) => {
    if (!currentValue.isSlotBooked) {
        return 1 + total;
    }
    else if (originalArry.length - 1 === currentIndex) {
        return total == 0 ? 'No' : total;
    }
    else {
        return total
    }
}

const sortByStartTime = (a, b) => {
    let startTimeSortA = getUnixTimeStamp(a.slotStartDateAndTime);
    let startTimeSortB = getUnixTimeStamp(b.slotStartDateAndTime);
    return startTimeSortA - startTimeSortB;
}
export {
    renderLabTestImage,
    RenderNoSlotsAvailable,
    enumerateStartToEndDates,
    RenderListNotFound,
    sortByStartTime,
    reducer,
    RenderFavoritesComponent,
    RenderFavoritesCount,
    RenderStarRatingCount,
    RenderPriceDetails,
    RenderOfferDetails
}