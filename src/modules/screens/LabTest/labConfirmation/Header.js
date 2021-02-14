import React from 'react';
import { Text,Icon  } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { Image, TouchableOpacity, StyleSheet , View, } from 'react-native';
import { getAddress } from '../../../common'
import { formatDate } from '../../../../setup/helpers';
import DateTimePicker from "react-native-modal-datetime-picker";
import { renderLabProfileImage } from '../../CommonAll/components';
const LabHeader = (props) => {
    const {packageDetails,  onDatePickerPressed, minimumDate, maximumDate, dateTime, isVisible, onTimeConfirm, onTimePickerCancel } = props;
    return (
     <View style={{ backgroundColor: '#fff', padding: 10 }}>
      <Row>
        <Col size={1.6}>
            { <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderLabProfileImage(packageDetails), title: 'Lab photo' })}>
                <Image source={renderLabProfileImage(packageDetails)} style={{ height: 50, width: 50 }} />
            </TouchableOpacity> }
        </Col>
        <Col size={8.4}>
            <Text style={styles.docName}>{props.packageDetails.lab_name }</Text>
            <Row style={{marginTop:10}}>
                <Icon name="location-sharp" style={{ fontSize: 15 }} />
                <Text note style={styles.hosAddress}>{getAddress(props.packageDetails.location)}.</Text>
            </Row>
            <Row style={{marginTop:10}}>
            <Icon type="FontAwesome" name="mobile-phone" style={{ fontSize: 15 }} />
                <Text note style={styles.hosAddress}>{'Mobile -' + (props.packageDetails.mobile_no || 'Nil')}</Text>
            </Row>
        </Col>
      </Row> 
        <Row style={{ marginTop: 10, }}>
            <Col size={4} style={{ flexDirection: 'row' }}>
                  <Icon name="md-calendar" style={{ fontSize: 15, color: '#0054A5' }} />
                  <Text style={styles.calDate}>{props.packageDetails && props.packageDetails.selectedSlotItem && formatDate(props.packageDetails.selectedSlotItem.slotStartDateAndTime, 'Do MMMM, YYYY') }</Text>
            </Col>

            <Col size={6} style={{ flexDirection: 'row' }}>
                {props.packageDetails.appointment_status !== 'PAYMENT_FAILED' && props.packageDetails.appointment_status !== 'PAYMENT_IN_PROGRESS' ?
                     <TouchableOpacity onPress={() => onDatePickerPressed()} 
                                       style={{ flex: 1, flexDirection: 'row' }}>
                                      
                    
                    {props.hideStartDatePlaceholder ?
                        <>
                          <Icon name="md-clock" style={{ fontSize: 15, color: '#8EC63F' }} />
                          <Text style={styles.clockTime}>{formatDate(dateTime, 'hh:mm a')}</Text>
                        </>
                      :
                        <>
                            <Icon name="md-clock" style={{ fontSize: 15, color: '#8EC63F' }} />
                            <Text style={styles.clockTime}>Select time </Text>
                        </> } 
                            <Text style={styles.calDate}>({props.packageDetails && props.packageDetails.selectedSlotItem && formatDate(props.packageDetails.selectedSlotItem.slotStartDateAndTime, 'hh:mm a')+' -'}</Text>
                            <Text style={styles.calDate}>{props.packageDetails && props.packageDetails.selectedSlotItem && formatDate(props.packageDetails.selectedSlotItem.slotEndDateAndTime, 'hh:mm a')})</Text>

                        <DateTimePicker
                            mode={'time'}
                            display="spinner"
                            timePickerModeAndroid={'spinner'}
                            minimumDate={minimumDate}
                            maximumDate={maximumDate}
                            date={dateTime}
                            isVisible={isVisible}
                            onConfirm={onTimeConfirm}
                            onCancel={onTimePickerCancel} />
                   </TouchableOpacity>
                : null }  
            </Col>
        </Row>


    </View>
    )
}  
const styles = StyleSheet.create({
    docName: {
        fontSize: 15,
        fontFamily: 'OpenSans',
        color: '#7F49C3',
    },
    hosAddress: {
        fontSize: 12,
        fontFamily: 'OpenSans',
        color: '#000',
        marginLeft: 10
    },
    calDate: {
        fontSize: 12,
        fontFamily: 'OpenSans',
        color: '#0054A5',
        marginLeft: 5
    },
    clockTime: {
        fontSize: 12,
        fontFamily: 'OpenSans',
        color: '#8EC63F',
        marginLeft: 5
    },
})

export default LabHeader