import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image } from 'react-native';
import StarRating from 'react-native-star-rating';
import { searchByLabDetailsService, fetchLabTestAvailabilitySlotsService } from '../../../providers/labTest/basicLabTest.action';
import { renderLabTestImage } from '../labTestCommon';
import { Loader } from '../../../../components/ContentLoader';
import { formatDate, addMoment, getMoment } from '../../../../setup/helpers';
import moment from 'moment';

export default class RenderSlots extends React.Component {
    constructor(props) {
        super(props)

    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.shouldUpdate !== this.props.shouldUpdate;
    }
    render() {
        const { slotData, selectedSlotIndex, onSlotItemPress, labId, selectedDate } = this.props;

        return <FlatList
            numColumns={4}
            data={slotData}
            // extraData={[this.labTestSelectedDates[labId]]}
            renderItem={({ item, index }) => {

                return (
                    <Col style={{ width: '25%' }}>
                        <TouchableOpacity disabled={item.isSlotBooked}
                            style={item.isSlotBooked ? styles.slotBookedBgColor : selectedSlotIndex === index ?
                                styles.slotSelectedBgColor : styles.slotDefaultBgColor}
                            onPress={() =>
                                onSlotItemPress(labId, selectedDate, item, index)
                            }>
                            <Text style={item.isSlotBooked ? styles.slotBookedTextColor : selectedSlotIndex === index ? styles.slotBookedTextColor : styles.slotDefaultTextColor}> {formatDate(item.slotStartDateAndTime, 'hh:mm A')} </Text>
                        </TouchableOpacity>
                    </Col>
                )
            }
            } keyExtractor={(item, index) => index.toString()} />

    }
}

const styles = StyleSheet.create({
    container:
    {
        backgroundColor: '#ffffff',
    },
    bodyContent: {
        padding: 5
    },
    slotDefaultBgColor: {
        backgroundColor: '#ced6e0',
        borderColor: '#000',
        marginTop: 10,
        height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        marginLeft: 5
    },
    slotDefaultTextColor: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'OpenSans',
        textAlign: 'center'
    },
    slotBookedBgColor: {
        backgroundColor: '#A9A9A9', //'#775DA3',
        borderColor: '#000',
        marginTop: 10, height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        marginLeft: 5
    },
    slotSelectedBgColor: {

        backgroundColor: '#775DA3',
        borderColor: '#000',
        marginTop: 10,
        height: 30,
        borderRadius: 6,
        justifyContent: 'center',
        marginLeft: 5
    },
    slotBookedTextColor: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'OpenSans',
        textAlign: 'center'
    },
    slotBookedBgColorFromModal: {
        backgroundColor: '#878684',
        borderRadius: 5,
        height: 30,
    },
    slotDefaultBg: {
        backgroundColor: '#2652AC',
        borderRadius: 5,
        height: 30,
    },
    slotSelectedBg: {
        backgroundColor: '#808080',
        borderRadius: 5,
        height: 30,
    },
    availabilityBG: {
        textAlign: 'center',
        borderColor: '#000',
        marginTop: 10,
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        marginRight: 5,
        paddingLeft: 5,
        paddingRight: 5
    },
    customPadge: {
        backgroundColor: 'green',
        alignItems: 'center',
        width: '30%'
    },
    rsText: {
        fontSize: 8,
        textAlign: 'center',
        fontWeight: '200',
        color: '#ff4e42',
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        textDecorationColor: '#ff4e42'
    },
    finalRs: {
        fontSize: 10,
        textAlign: 'center',
        fontWeight: '200',
        paddingTop: 1,
        marginLeft: 5,
        color: '#8dc63f'
    }
});