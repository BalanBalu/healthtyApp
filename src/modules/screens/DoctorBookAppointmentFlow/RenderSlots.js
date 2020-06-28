import React, { Component } from 'react';
import { Text } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { TouchableOpacity, View, FlatList, Dimensions, ScrollView, Image } from 'react-native';
import { formatDate } from '../../../setup/helpers';
import { sortByStartTime } from '../CommonAll/functions'
import styles from '../CommonAll/styles';


export default class RenderSlots extends Component {
    constructor(props) {
        super(props)
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.shouldUpdate === this.props.shouldUpdate) return false;
        return true
    }
    render() {
        console.log('Slots Rendering=======>');
        const { slotDetails: { slotData, selectedSlotIndex, doctorIdHostpitalId }, onSlotItemPress, selectedDate4DocIdHostpitalIdToStoreInObj, selectedSlotItem4DocIdHostpitalIdToStoreInObj } = this.props;
        const { width } = Dimensions.get('screen');
        const itemWidth = (width) / 4;
        return <FlatList
            numColumns={4}
            // extraData={[selectedDate4DocIdHostpitalIdToStoreInObj, selectedSlotItem4DocIdHostpitalIdToStoreInObj]}
            data={slotData.sort(sortByStartTime)}
            renderItem={({ item, index }) => {
                return (
                    <Col style={{ width: itemWidth - 10 }}>
                        <TouchableOpacity disabled={item.isSlotBooked}
                            style={item.isSlotBooked ? styles.slotBookedBgColor : selectedSlotIndex === index ?
                                styles.slotSelectedBgColor : styles.slotDefaultBgColor}
                            onPress={() => onSlotItemPress(doctorIdHostpitalId, item, index)}>
                            <Text style={item.isSlotBooked ? styles.slotBookedTextColor : selectedSlotIndex === index ? styles.slotBookedTextColor : styles.slotDefaultTextColor}> {formatDate(item.slotStartDateAndTime, 'hh:mm A')} </Text>
                        </TouchableOpacity>
                    </Col>
                )
            }
            } keyExtractor={(item, index) => index.toString()} />
    }
}
