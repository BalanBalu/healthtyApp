import React, { Component } from 'react';
import { View, Text, AsyncStorage, Platform } from "react-native";
import { Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { store } from '../setup/store';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';


export const RenderHospitalAddress = (props) => {
    const { headerStyle, hospotalNameTextStyle, gridStyle, renderHalfAddress } = props
    return (

        <Grid style={gridStyle}>
            <Row>
                <Col style={{ width: '8%' }}>
                    <Icon name='medkit' style={{ fontSize: 16, fontFamily: 'OpenSans', color: 'gray' }}></Icon>
                </Col>
                <Col style={{ width: '90%' }}>
                    {props.hospitalAddress.location ?
                        <Text note style={hospotalNameTextStyle || { fontFamily: 'OpenSans' }}>{props.hospitalAddress.name}</Text>
                        : null}
                </Col>
            </Row>
            <Row>
                <Col style={{ width: '8%' }}>
                    <Icon name='pin' style={{ fontSize: 18, fontFamily: 'OpenSans', color: 'gray' }}></Icon>
                </Col>
                <Col style={{ width: '90%' }}>
                    {props.hospitalAddress.location ?
                        <View>
                            <Text note style={props.textStyle}>{props.hospitalAddress.location.address.no_and_street + ', '}</Text>
                            <Text note style={props.textStyle}>{props.hospitalAddress.location.address.city}</Text>

                            {renderHalfAddress === true ? null :
                                <View>
                                    <Text note style={props.textStyle}>{props.hospitalAddress.location.address.state}</Text>
                                    <Text note style={props.textStyle}>{props.hospitalAddress.location.address.pin_code}</Text>
                                </View>
                            }
                        </View> : null}
                </Col>
            </Row>
        </Grid>

    )
}

export const RenderPatientAddress = (props) => {

    const { gridStyle } = props
    return (

        <Grid style={gridStyle}>
            <Row>
                <Col style={{ width: '90%' }}>
                    {props.patientAddress.address ?
                        <View>
                            <Text note style={props.textStyle}>{props.patientAddress.address.no_and_street + ' , ' +
                                props.patientAddress.address.address_line_1 + ' , ' +
                                props.patientAddress.address.address_line_2 + ' , ' +
                                props.patientAddress.address.city + ' - ' + props.patientAddress.address.pin_code}</Text>
                        </View> : null}
                </Col>
            </Row>
        </Grid>
    )
}

export function renderProfileImage(data) {
    let source = null;
    if (data.profile_image) {
        source = { uri: data.profile_image.imageURL }
    } else if (data.gender == 'M') {
        source = require('../../assets/images/male_user.png')
    } else if (data.gender == 'F') {
        source = require('../../assets/images/Female.png')
    } else {
        source = require('../../assets/images/male_user.png')
    }
    return (source)
}
export function renderDoctorImage(data) {
    let source = null;
    if (data.profile_image) {
        source = { uri: data.profile_image.imageURL }
    } else if (data.gender == 'M') {
        source = require('../../assets/images/profile_male.png')
    } else if (data.gender == 'F') {
        source = require('../../assets/images/profile_female.png')
    } else {
        source = require('../../assets/images/profile_common.png')
    }
    return (source)
}

export async function addToCart(medicineData, selectItem, operation) {
    let userId = JSON.stringify(await AsyncStorage.getItem('userId'))
    let itemQuantity;
    if (operation === "add") {
        itemQuantity = (selectItem.selectedQuantity == undefined ? 0 : selectItem.selectedQuantity);
        selectItem.selectedQuantity = ++itemQuantity;
    } else {
        if (selectItem.selectedQuantity > 0) {
            itemQuantity = selectItem.selectedQuantity;
            selectItem.selectedQuantity = --itemQuantity;
        }
    }
    let cart = [];
    medicineData.filter(element => {
        if (element.selectedQuantity >= 1) {
            cart.push(element);
        }
    })
    await AsyncStorage.setItem('cartItems-' + userId, JSON.stringify(cart))
    return { selectemItemData: selectItem }
}

export function medicineRateAfterOffer(item) {
    return parseInt(item.price) - ((parseInt(item.offer) / 100) * parseInt(item.price));
}

export function getDoctorSpecialist(specialistData) {
    if (specialistData) {
        return specialistData[0] ? specialistData[0].category : '';
    }
    return '';
}
export function getDoctorEducation(educationData) {
    let degree = '';
    if (educationData) {
        educationData.forEach(eduData => {
            degree += eduData.degree + ','
        });
        return degree.slice(0, -1);
    }
    return '';
}
export function getDoctorExperience(calulatedExperience) {
    if (!calulatedExperience) {
        return 'N/A'
    }
    if (calulatedExperience.isPrivate === true) {
        return 'N/A'
    }
    if (calulatedExperience.year == 0) {
        month = calulatedExperience.month;
        if(month==0){
            return 'N/A'
        }
        return `${month} Month` + (month <= 1 ? '' : 's')
    } else {
        year = calulatedExperience.year;
        return `${year} Year` + (year <= 1 ? '' : 's')
    }
}

export async function getUserNotification() {
    try {
        let userId = await AsyncStorage.getItem('userId');
        fetchUserNotification(userId);
    }
    catch (e) {
        console.log(e);
    }
}
export function getName(data) {
    let name = 'unKnown'
    if (data) {
      if (data.first_name != undefined || data.last_name != undefined) {
        name = `${data.first_name || ''} ${data.last_name || ''}`
  
      }
    }
    return name
  
  }


export class Badge extends Component {
    constructor(props) {

        super(props);
        this.state = {
            data: null,
        };
    }
    async componentDidMount() {
        if (store.getState()) {
            if (store.getState().notification) {
                const data = store.getState().notification.notificationCount;
                this.setState({ data })
            }
        }
    }
    render() {
        const { data } = this.state;
        return (

            data != null &&
            <Text style={{ position: 'absolute', backgroundColor: 'red', color: 'white', borderRadius: 20/2,  marginTop: -7, width:undefined,height:undefined,padding:2,fontSize:10 }}>{data}</Text>        )
    }
}



export function getAllEducation(data) {

    let educationDetails = [];
    data.map(education => {
        if (!educationDetails.includes(education.degree)) {
            educationDetails.push(education.degree)
        }

    })
    educationDetails = educationDetails.join(",");
    return educationDetails;


}
export function getAllSpecialist(data) {
    let speaciallistDetails = [];
    if (data) {
        data.map(categories => {
            if (!speaciallistDetails.includes(categories.category)) {
                speaciallistDetails.push(categories.category);
            }
        })
        speaciallistDetails = speaciallistDetails.join(",");
        return speaciallistDetails
    } else {
        return ''
    }

}

export const bloodGroupList = ['Select Blood Group', 'A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-']
export const appointmentIssue = [
    { id: 0, value: 'If you see "Your payment was declined due to an issue with your account"' },
    { id: 1, value: 'You accidentally entered incorrect credit/debit card details like name on the card, card number, CVV, 3D secure PIN and expiry date incorrect.' },
    { id: 2, value: 'My promo code did not apply' },
    { id: 3, value: 'Money deducted but not refunded' },
    { id: 4, value: 'Faced issues during transactions?' },
    { id: 5, value: 'Others' }
]

export const pharmacyIssue = [
    { id: 0, value: 'Money deducted but not any appointment booked.' },
    { id: 1, value: 'Booking process is not familier' },
    { id: 2, value: 'Appointment booked but not yet received a confirmation message' },
    { id: 3, value: 'Money deducted but not refunded' },
    { id: 4, value: 'Faced issues during transactions?' },
    { id: 5, value: 'Others' }
]

export const chatIssue = [
    { id: 0, value: 'If you see "Your payment was declined due to an issue with your account"' },
    { id: 1, value: 'You accidentally entered incorrect credit/debit card details like name on the card, card number, CVV, 3D secure PIN and expiry date incorrect.' },
    { id: 2, value: 'My promo code did not apply' },
    { id: 3, value: 'Money deducted but not refunded' },
    { id: 4, value: 'Faced issues during transactions?' },
    { id: 5, value: 'Others' }
]
export const paymentIssue = [
    { id: 0, value: 'Money deducted but not any appointment booked.' },
    { id: 1, value: 'Booking process is not familier' },
    { id: 2, value: 'Appointment booked but not yet received a confirmation message' },
    { id: 3, value: 'Money deducted but not refunded' },
    { id: 4, value: 'Faced issues during transactions?' },
    { id: 5, value: 'Others' }
]

//Email validation
export function validateEmailAddress(text) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) return false;
    else return true;
}

export function stringHasOnlySpace(text) {
    let regex =/^(?!\s*$)[-a-zA-Z0-9_:,.' ']{1,100}$/;
    if (regex.test(text) === false) return false;
    else return true;
}
export const debounce = (fun, delay) => {
    let timer = null;
    return function (...args) {
        const context = this;
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fun.apply(context, args);
        }, delay);
    };
}


export function validateMobileNumber(number) {
    var regPattern = '^([0|+[0-9]{1,5})?([7-9][0-9]{9})$';
    var regPatternForMob = new RegExp(regPattern);
    if (regPatternForMob.test(number)) return true;
    else return false;
}

export function validatePincode(number) {
    const regex = new RegExp('^[0-9]+$')  //Support only numbers
    if (regex.test(number) === false) return false;
    else return true;
}

export function acceptNumbersOnly(value) {
    const regex = new RegExp(/[- #*;,.<>\{\}\[\]\\\/]/gi, '');  //did't support White spaces
    if (regex.test(value) === false) return false;
    else return true;
  }
export function validatePassword(value) {
    const regex = new RegExp('^[^\\s]+$');  //did't support White spaces
    if (regex.test(value) === false) return false;
    else return true;
}

export function getHospitalHeadeName(location) {
    if (!location) return ''
    if (location)
      return `${location.name}`;
    else
      return ''
}
export function getHospitalName(location) {
    if (!location) return ''
    if (location)
      return `${location.location.address.no_and_street}, ${location.location.address.city}, ${location.location.address.state}, ${location.location.address.pin_code}`;
    else
      return ''
}
export function validateName(text) {
    let regex = /^(?!\s*$)[-a-zA-Z_:' ']{1,100}$/;
    if (regex.test(text) === false) return false;
    else return true;
}
export function OnlyAlphaNumericAndCommaSlash(text) {
    let regex = /^(?!\s*$)[-a-zA-Z0-9:,.' ']{1,100}$/;
    if (regex.test(text) === false) return false;
    else return true;
}