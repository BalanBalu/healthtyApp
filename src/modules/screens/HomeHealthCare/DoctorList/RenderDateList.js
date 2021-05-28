import React, { Component } from 'react';
import { Text } from 'native-base';
import { Col } from 'react-native-easy-grid';
import { TouchableOpacity, View, FlatList } from 'react-native';
import { formatDate } from '../../../../setup/helpers';
import styles from '../../CommonAll/styles'
import moment from 'moment';
import {primaryColor, secondaryColor} from '../../../../setup/config'
import { translate } from '../../../../setup/translator.helper';


export default class RenderDatesList extends Component {
    constructor(props) {
        super(props)
    }
    shouldComponentUpdate(nextProps) {
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
        const { indexOfItem, weekWiseDatesList, onDateChanged, callSlotsServiceWhenOnEndReached, selectedDate, slotData, doctor_id } = this.props;
        if (slotData === undefined || !Object.keys(slotData)) {
            return null;
        }
        return <View>
            <FlatList
                horizontal={true}
                data={weekWiseDatesList}
                onEndReachedThreshold={1}
                onEndReached={({ distanceFromEnd }) => { callSlotsServiceWhenOnEndReached(doctor_id, weekWiseDatesList, indexOfItem) }}
                renderItem={({ item }) => {
                    return (
                        <View>
                            <Col style={{ justifyContent: 'center' }}>
                                <TouchableOpacity style={[styles.availabilityBG, selectedDate === item ? { backgroundColor: primaryColor, alignItems: 'center' } : { backgroundColor: '#ced6e0', alignItems: 'center' }]}
                                    onPress={() => onDateChanged(item, doctor_id, indexOfItem, slotData[item])}>
                                    <Text style={[{ fontSize: 12, fontFamily: 'Roboto' }, selectedDate === item ? { color: '#fff' } : { color: '#000' }]}>{formatDate(moment(item), 'ddd, DD MMM')}</Text>
                                    <Text style={[{ fontSize: 10, fontFamily: 'Roboto' }, selectedDate === item ? { color: '#fff' } : { color: '#000' }]}>{slotData[item] ? translate('Available') : translate('Not Available')}</Text>
                                </TouchableOpacity>
                            </Col>
                        </View>
                    )
                }
                } keyExtractor={(item, index) => index.toString()} />
        </View>
    }
}
