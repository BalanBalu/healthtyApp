import React, { Component } from 'react';
import { Container, Content, Text, Button, Toast, Item, List, ListItem, Card, Input, Left, Segment, CheckBox, View, Radio, Footer, FooterTab, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import { getAddress } from '../../common';
import {primaryColor} from '../../../setup/config'

// import { fetchUserProfile } from '../../../providers/profile/profile.action';
// import { dateDiff, formatDate, subTimeUnit } from '../../../../setup/helpers';
// import { hasLoggedIn } from '../../../providers/auth/auth.actions';
// import { insertAppointment, updateLapAppointment, validateAppointment } from '../../../providers/lab/lab.action';
// import { getUserGenderAndAge } from '../../CommonAll/functions'
// import { SERVICE_TYPES } from '../../../../setup/config'
// import BookAppointmentPaymentUpdate from '../../../providers/bookappointment/bookAppointment';
// import LabHeader from './Header';
// import { PayBySelection, POSSIBLE_PAY_METHODS } from '../../PaymentReview/PayBySelection';
// import { POSSIBLE_FAMILY_MEMBERS, TestDetails } from '../../PaymentReview/testDeatils';

const PatientAddress = (props) => {
    const { patientAddress, onPressAddNewAddress, selectedAddress, onChangeAddress } = props;
    return (
        <View >
            {patientAddress.length != 0 ?
                <Row style={{ marginTop: 8,marginBottom:8 }}>
                    <Col size={5}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: primaryColor,marginLeft:10 }}>Saved Address</Text>
                    </Col>
                    <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        <TouchableOpacity onPress={() => onPressAddNewAddress()}>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#ff4e42' }}>Add new Address</Text>
                        </TouchableOpacity>
                    </Col>
                </Row> 
            : null}
            {patientAddress.length != 0 ?
              <FlatList
                data={patientAddress}
                extraData={patientAddress}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                    <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                        <Row style={{ borderBottomColor: '#909090', borderBottomWidth: 0.3, paddingBottom: 15 }}>

                            <Col size={10}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2, color: '#6a6a6a' }}>{getAddress(item)}</Text>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2 }}>{'Mobile -' + (item.mobile_no || 'Nil')}</Text>
                            </Col>
                            <Col size={1} style={{ justifyContent: 'center' }}>
                                <Radio
                                    standardStyle={true}
                                    selected={selectedAddress === item ? true : false}
                                    onPress={() => onChangeAddress(item)} />
                            </Col>
                        </Row>
                    </View>
                } /> : 
                <Button transparent onPress={() => onPressAddNewAddress()}>
                    <Icon name='add' style={{ color: 'gray' }} />
                    <Text uppercase={false} style={styles.customText}>Add Address</Text>
                </Button>
            }
        </View>
    )
}
const styles= StyleSheet.create({
    customText: {
        marginLeft: 10,
        fontFamily: 'OpenSans',
        fontSize: 13,
        marginTop: 3,
        color: 'gray'
    }
})
export default PatientAddress;