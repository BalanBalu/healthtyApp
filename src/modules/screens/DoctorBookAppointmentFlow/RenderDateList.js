import React, { Component } from 'react';
import { Container, Content, Text } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, View, FlatList, Dimensions, Image } from 'react-native';
import { formatDate } from '../../../setup/helpers';
import { reducer } from '../CommonAll/functions';
import styles from '../CommonAll/styles'
import moment from 'moment';
import {primaryColor} from '../../../setup/config'

export default class RenderDatesList extends Component {
    constructor(props) {
        super(props)
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.shouldUpdate !== this.props.shouldUpdate) {
            return true
        }
        if (nextProps.onEndReachedIsTriggedFromRenderDateList == true) {
            return true
        }
        if (nextProps.shouldUpdate == this.props.shouldUpdate) {
            return false
        }
        return false
    }
    render() {
        const { indexOfItem, weekWiseDatesList, selectedDate4DocIdHostpitalIdToStoreInObj, onDateChanged, callSlotsServiceWhenOnEndReached, selectedSlotItem4DocIdHostpitalIdToStoreInObj, selectedDate, slotData, doctorIdHostpitalId } = this.props;
        if (slotData === undefined || !Object.keys(slotData)) {
            return null;
        }
        return <View>
            <FlatList
                horizontal={true}
                data={weekWiseDatesList}
                extraData={[selectedDate4DocIdHostpitalIdToStoreInObj, selectedSlotItem4DocIdHostpitalIdToStoreInObj]}
                onEndReachedThreshold={1}
                onEndReached={({ distanceFromEnd }) => { callSlotsServiceWhenOnEndReached(doctorIdHostpitalId, weekWiseDatesList, indexOfItem) }}
                renderItem={({ item }) => {
                    return (
                        <View>
                            <Col style={{ justifyContent: 'center' }}>
                                <TouchableOpacity style={[styles.availabilityBG, selectedDate === item ? { backgroundColor: primaryColor, alignItems: 'center' } : { backgroundColor: '#ced6e0', alignItems: 'center' }]}
                                    onPress={() => onDateChanged(item, doctorIdHostpitalId, indexOfItem)}>
                                    <Text style={[{ fontSize: 12, fontFamily: 'OpenSans' }, selectedDate === item ? { color: '#fff' } : { color: '#000' }]}>{formatDate(moment(item), 'ddd, DD MMM')}</Text>
                                    <Text style={[{ fontSize: 10, fontFamily: 'OpenSans' }, selectedDate === item ? { color: '#fff' } : { color: '#000' }]}>{slotData[item] ? slotData[item].reduce(reducer, 0) + ' Slots Available' : 'No Slots Available'}</Text>
                                </TouchableOpacity>
                            </Col>
                        </View>
                    )
                }
                } keyExtractor={(item, index) => index.toString()} />
        </View>
    }
}
