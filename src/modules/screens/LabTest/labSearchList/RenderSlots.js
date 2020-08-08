import React, { Component } from 'react';
import { Container, Content, Text } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image } from 'react-native';
import { formatDate } from '../../../../setup/helpers';
import styles from '../../CommonAll/styles';
import { sortByStartTime } from '../../CommonAll/functions';

export default class RenderSlots extends Component {
    constructor(props) {
        super(props)
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.shouldUpdate == this.props.shouldUpdate) return false
        return true
    }

    render() {
        const { slotData, selectedSlotIndex, onSlotItemPress, labId, selectedDate } = this.props;
        console.log("slotData", slotData);

        const { width } = Dimensions.get('screen');
        const itemWidth = (width) / 4;
        return <FlatList
            numColumns={2}
            data={slotData.sort(sortByStartTime)}
            // extraData={[this.labTestSelectedDates[labId]]}
            renderItem={({ item, index }) => {
                return (
                   
                    <Col style={{ width: itemWidth - 10 }}>
                        <TouchableOpacity disabled={item.isSlotBooked}
                            style={item.isSlotBooked ? styles.slotBookedBgColor : selectedSlotIndex === index ?
                                styles.slotSelectedBgColor : styles.slotDefaultBgColor}
                            onPress={() => onSlotItemPress(labId, item, index)}>
                            <Text style={item.isSlotBooked ? styles.slotBookedTextColor : selectedSlotIndex === index ? styles.slotBookedTextColor : styles.slotDefaultTextColor}> {formatDate(item.slotStartDateAndTime, 'hh:mm A')} to {formatDate(item.slotEndDateAndTime, 'hh:mm A')} </Text>
                        </TouchableOpacity>
                    </Col>
                )
            }
            } keyExtractor={(item, index) => index.toString()} />
    }
}
