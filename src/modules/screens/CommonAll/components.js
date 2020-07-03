
import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import StarRating from 'react-native-star-rating';
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image } from 'react-native';
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
                <Text style={styles.finalRs}>₹ {props.priceInfo}</Text>
                {/* <Text style={styles.finalRs}>₹ {item.finalAmount || ''}</Text> */}
            </Row>
        </>
    )
}

const RenderOfferDetails = (props) => {
    return (
        <>
            <Text note style={props.isFromLabBookApp ? styles.offerText4LalBookApp : styles.offerText}>Offer</Text>
            <Text style={props.isFromLabBookApp ? styles.offer4LabBookApp : styles.offer}>{props.offerInfo} off</Text>
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
        <TouchableOpacity onPress={() => props.onPressFavoriteIcon()}>
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
    if(data.profile_image) {
        source = { uri: data.profile_image.imageURL }
    } else {
        source = require('../../../../assets/icon.png')
    }
    return (source)
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
    RenderAddressInfo
}