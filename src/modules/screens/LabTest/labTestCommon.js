
import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image } from 'react-native';
import { getUnixTimeStamp } from '../../../setup/helpers';

const enumerateStartToEndDates = (startDateByMoment, endDateByMoment) => {
    let startDate = startDateByMoment.clone();
    const datesArry = [];
    while (startDate.isSameOrBefore(endDateByMoment)) {
        datesArry.push(startDate.format('YYYY-MM-DD'));
        startDate = startDate.add(1, 'day');
    }
    return datesArry
    // this.setState({ availabilitySlotsDatesArry: this.availabilitySlotsDatesArry });
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
    reducer
}