import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image } from 'react-native';
import StarRating from 'react-native-star-rating';
import { formatDate } from '../../../../setup/helpers';
// import labSearchList from './index'
import { reducer } from '../labTestCommon';
import styles from '../styles'
import moment from 'moment';

export default class RenderDates extends Component {
    constructor(props) {
        super(props)
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.selectedDate !== this.props.selectedDate
    }

    render() {
        const { availabilitySlotsDatesArry, onDateChanged, selectedDate, availableSlotsData, labId, selectedDateObj, callSlotsServiceWhenOnEndReached, } = this.props;
        if (!Object.keys(availableSlotsData)) {
            return null;
        }
        return <View>
            <FlatList
                horizontal={true}
                data={availabilitySlotsDatesArry}
                //extraData={selectedDateObj[labId]]}
                onEndReachedThreshold={1}
                onEndReached={({ distanceFromEnd }) => { callSlotsServiceWhenOnEndReached(labId, availabilitySlotsDatesArry) }}
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
