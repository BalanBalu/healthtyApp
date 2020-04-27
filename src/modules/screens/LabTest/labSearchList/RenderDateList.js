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

export default class RenderDates extends React.Component {
    constructor(props) {
        super(props)
        debugger
    }
    shouldComponentUpdate(nextProps, nextState) {
        debugger
        return nextProps.selectedDate !== this.props.selectedDate
    }
    render() {
        debugger
        const { labTestAvailabilitySlotsDatesArry, onDateChanged, selectedDate, availableSlotsData, labId } = this.props;
        debugger
        if (!Object.keys(availableSlotsData)) {
            return null;
        }
        // if (!availableSlotsData) return null;
        debugger
        // alert('exe renderDatesOnFlatList======>', JSON.stringify(availableSlotsData))

        const reducer = (accumulator, currentValue, currentIndex, souceArray) => {
            if (!currentValue.isSlotBooked)
                return 1 + accumulator;
            else if (souceArray.length - 1 === currentIndex) {
                return accumulator == 0 ? 'No' : accumulator;
            }
            else {
                return accumulator
            }
        }
        debugger
        return <View>
            <FlatList
                horizontal={true}
                data={labTestAvailabilitySlotsDatesArry}
                //extraData={[this.labTestSelectedDates[labId]]}
                onEndReachedThreshold={1}
                onEndReached={({ distanceFromEnd }) => {
                    // let endIndex = this.labTestAvailabilitySlotsDatesArry.length
                    // let lastProcessedDate = this.labTestAvailabilitySlotsDatesArry[endIndex - 1];
                    // let startMoment = getMoment(lastProcessedDate).add(1, 'day');
                    // let endDateMoment = addMoment(lastProcessedDate, 7, 'days')
                    // // if (this.state.isAvailabilityLoading === false) {
                    //     this.callGetAvailabilitySlot(this.state.getSearchedDoctorIds, startMoment, endDateMoment);
                    // }
                }}
                renderItem={({ item }) => {
                    return (
                        <View>
                            <Col style={{ justifyContent: 'center' }}>
                                <TouchableOpacity style={[styles.availabilityBG, selectedDate === item ? { backgroundColor: '#775DA3', alignItems: 'center' } : { backgroundColor: '#ced6e0', alignItems: 'center' }]}
                                    onPress={() => onDateChanged(item, labId)}>
                                    <Text style={[{ fontSize: 12, fontFamily: 'OpenSans' }, selectedDate === item ? { color: '#fff' } : { color: '#000' }]}>{formatDate(moment(item), 'ddd, DD MMM')}</Text>
                                    <Text style={[{ fontSize: 10, fontFamily: 'OpenSans' }, selectedDate === item ? { color: '#fff' } : { color: '#000' }]}>{availableSlotsData[item] ? availableSlotsData[item].reduce(reducer, 0) + ' Slots Available' : 'No Slots Available'}</Text>
                                </TouchableOpacity>
                            </Col>
                        </View>
                    )
                }

                } keyExtractor={(item, index) => index.toString()} />

        </View>
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