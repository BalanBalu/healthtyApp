import React, { Component } from 'react';
import { Container, Content, Text } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, View, FlatList, Dimensions, ScrollView, Image } from 'react-native';
import { formatDate } from '../../../../setup/helpers';
import { reducer } from '../CommonLabTest';
import styles from '../styles'
import moment from 'moment';

export default class RenderDates extends Component {
    constructor(props) {
        super(props)
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.selectedDate !== this.props.selectedDate) {
            return true
        }
        else if (this.props.availabilitySlotsDatesArry.length == nextProps.availabilitySlotsDatesArry.length) {
            return true
        }
    }

    render() {
        const { availabilitySlotsDatesArry, onDateChanged, selectedDate, availableSlotsData, labId, selectedDateObj, callSlotsServiceWhenOnEndReached, } = this.props;
        console.log("availableSlotsData", availableSlotsData);
        
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
                                    <Text style={[{ fontSize: 10, fontFamily: 'OpenSans' }, selectedDate === item ? { color: '#fff' } : { color: '#000' }]}>{availableSlotsData[item] ? 'Available' : 'Not Available'}</Text>
                                </TouchableOpacity>
                            </Col>
                        </View>
                    )
                }
                } keyExtractor={(item, index) => index.toString()} />
        </View>
    }
}
