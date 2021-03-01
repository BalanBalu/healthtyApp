import React, { Component } from 'react';
import { View, Text, AsyncStorage, Platform, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Icon, Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { store } from '../setup/store';
import { setI18nConfig } from '../setup/translator.helper';
import moment from 'moment';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';



export function truncateByString(source, size) {
    return source.length > size ? source.slice(0, size - 1) + " ...." : source;
}


export function calculateAge(date) {
    const selectedDate = new Date(date);
    const currentDate = moment();
    const dateWithFormate = moment(selectedDate, 'MM-YYYY');
    const age = moment.duration(currentDate.diff(dateWithFormate));
    const yearAndMonth = {
        years: age.years(),
        months: age.months(),
    }
    return yearAndMonth || null
}

export function getNetworkHospitalAddress(address) {
    if (!address) return ''
    if (address)
        return (address.address_line_1 ? address.address_line_1 + ', ' : " ") + (address.post_office_name ? address.post_office_name + ', ' : " ") + (address.city ? address.city + ', ' : " ") + (address.state ? address.state + ', ' : " ") + (address.pin_code ? address.pin_code : " ");
}

export function getFullName(data) {
    let name = 'unKnown'
    if (data && Object.keys(data).length) {
        name = `${data.first_name ? data.first_name + ' ' : ''}${data.middle_name ? data.middle_name + ' ' : ''}${data.last_name ? data.last_name : ''}`;
        name = name ? name : 'unKnown';
    }
    return name
}


export function hospitalProfileImages(data) {
    let source = null;
    if (data && data.profile_image) {
        source = { uri: data.profile_image[0].imageURL }
    } else {
        source = require('../../assets/images/hospitalCommon.jpeg')
    }
    return (source)
}
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
        let month = calulatedExperience.month;
        if (month == 0) {
            return 'N/A'
        }
        return `${month} Month` + (month <= 1 ? '' : 's')
    } else {
        let year = calulatedExperience.year;
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
export function getUserLocation(location) {
    if (!location.address) return ''
    if (location.address)
        return `${location.address.address.no_and_street}, ${location.address.address.city}, ${location.address.address.state}, ${location.address.address.pin_code}`;
    else
        return ''
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
            <Text style={{ position: 'absolute', backgroundColor: 'red', color: 'white', borderRadius: 20 / 2, marginTop: -7, width: undefined, height: undefined, padding: 2, fontSize: 10 }}>{data}</Text>)
    }
}

export function getGender(data) {

    let genderAndAge = '';
    if (data) {
        if (data.gender) {
            if (data.gender === 'M') {
                genderAndAge = '(Male)'
            }
            else if (data.gender === 'F') {
                genderAndAge = '(Female)'
            }
            else if (data.gender === 'O') {
                genderAndAge = '(Others)'
            }
        }
    }
    return genderAndAge;
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
export const relationship = [
    { code: "1", value: "AUNTY", checkedData: false, },
    { code: "2", value: "BROTHER", checkedData: false, },
    { code: "3", value: "COUSIN", checkedData: false, },
    { code: "4", value: "COUSIN FEMALE", checkedData: false, },
    { code: "5", value: "COUSIN MALE", checkedData: false, },
    { code: "6", value: "DAUGHTER", checkedData: false, },
    { code: "7", value: "DAUGHTER IN LAW", checkedData: false, },
    { code: "8", value: "DEPENDENT", checkedData: false, },
    { code: "9", value: "FATHER", checkedData: false, },
    { code: "10", value: "FATHER IN LAW", checkedData: false, },
    { code: "11", value: "GRAND DAUGHTER", checkedData: false, },
    { code: "12", value: "GRAND FATHER", checkedData: false, },
    { code: "13", value: "GRAND FATHER IN LAW", checkedData: false, },
    { code: "14", value: "GRAND MOTHER", checkedData: false, },
    { code: "15", value: "GRAND SON", checkedData: false, },
    { code: "16", value: "JOINT ACCOUNT FEMALE", checkedData: false, },
    { code: "17", value: "JOINT ACCOUNT MALE", checkedData: false, },
    { code: "18", value: "LIVE IN FEMALE", checkedData: false, },
    { code: "19", value: "LIVE IN MALE", checkedData: false, },
    { code: "20", value: "MATERNAL AUNT", checkedData: false, },
    { code: "21", value: "MATERNAL UNCLE", checkedData: false, },
    { code: "22", value: "MOTHER", checkedData: false, },
    { code: "23", value: "MOTHER IN LAW", checkedData: false, },
    { code: "24", value: "NEPHEW", checkedData: false, },
    { code: "25", value: "NIECE", checkedData: false, },
    { code: "26", value: "OTHERS FEMALE", checkedData: false, },
    { code: "27", value: "OTHERS MALE", checkedData: false, },
    { code: "28", value: "PARENT", checkedData: false, },
    { code: "29", value: "PATERNAL AUNT", checkedData: false, },
    { code: "30", value: "PATERNAL UNCLE", checkedData: false, },
    { code: "31", value: "SISTER", checkedData: false, },
    { code: "32", value: "SISTER IN LAW", checkedData: false, },
    { code: "33", value: "SON", checkedData: false, },
    { code: "34", value: "SON IN LAW", checkedData: false, },
    { code: "35", value: "UNCLE", checkedData: false, },
    { code: "36", value: "WIFE", checkedData: false, },
]
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
    let regex = /^(?!\s*$)[-a-zA-Z0-9_:,.' ']{1,100}$/;
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
    const regex = new RegExp('^[0-9]+$');
    const result = regex.test(value);
    return result
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
export function getAddress(location) {
    if (!location) return ''
    if (location)
        return `${location.address.no_and_street},${location.address.address_line_1 || ''} ${location.address.city}, ${location.address.state}, ${location.address.pin_code}`;
    else
        return ''
}

export function getHomeHealthCareUserAddress(address) {
    if (!address) return ''
    if (address)
        return (address.no_and_street ? address.no_and_street + ', ' : " ") + (address.address_line_1 ? address.address_line_1 + ', ' : " ") + (address.post_office_name ? address.post_office_name + ', ' : " ") + (address.city ? address.city + ', ' : " ") + (address.state ? address.state + ', ' : " ") + (address.pin_code ? address.pin_code : " ");
}

export function validateName(text) {
    let regex = /^(?!\s*$)[-a-zA-Z_:' ']{1,100}$/;
    if (regex.test(text) === false) return false;
    else return true;
}
export function onlySpaceNotAllowed(text) {
    if (text) {
        if (text.trim()) return true
        else return false;
    }
    else {
        return false
    }

}




export const reportStatusValue = {

    "OPEN":
    {
        color: '#f1994d',
    },
    "INPROGRASS": {

        color: ' #5593fb',
    },
    "RESOLVED": {
        color: '#6ec41b',
    },
    "CLOSED": {
        color: 'red',
    },
    "undefined": {
        color: 'red',
    }
}


export async function validateFirstNameLastName(text) {
    const regex = new RegExp('^[\ba-zA-Z ]+$')  //Support letter with space

    if (regex.test(text) === false) {
        return false
    } else {
        return true
    }
}

export const RenderFooterLoader = (props) => {
    return (
        //Footer View with Load More button
        <View style={styles.footer}>
            <TouchableOpacity
                activeOpacity={0.9}
                // onPress={this.loadMoreData}

                style={styles.loadMoreBtn}>
                {props.footerLoading ?

                    <ActivityIndicator color="blue" style={styles.btnText} /> : null}

            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({

    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    btnText: {
        color: 'blue',
        fontSize: 15,
        textAlign: 'center',
    }
});

export function getUserGenderAndAge(data) {
    let genderAndAge = '';
    if (data) {
        if (data.gender) {
            if (data.gender === 'M') {
                genderAndAge = '(Male)'
            }
            else if (data.gender === 'F') {
                genderAndAge = '(Female)'
            }
            else if (data.gender === 'O') {
                genderAndAge = '(Others)'
            }
        }
    }
    return genderAndAge;
}
export const onPopupEvent = (eventName, index, navigation) => {
    if (eventName !== 'itemSelected') return
    if (index === 0) {
        setI18nConfig('en')
    }
    else if (index === 1) {
        setI18nConfig('ta')
    }
    else if (index === 2) {
        setI18nConfig('ma')
    }
}

export function renderForumImage(data, infoNode) {
    let source = null;
    if (data[infoNode] && data[infoNode].profile_image) {
        source = { uri: data[infoNode].profile_image.imageURL }
    } else if (data.gender == 'M') {
        source = require('../../assets/images/profile_male.png')
    } else if (data.gender == 'F') {
        source = require('../../assets/images/profile_female.png')
    } else {
        source = require('../../assets/images/common_avatar.png')
    }
    return (source)

}

export function toastMeassage(text, type, duration) {

    return (Toast.show({
        text: text,
        type: type,
        duration: duration
    }))


}
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
}
function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
export function getKiloMeterCalculation(gpsLocation, pharmacyLocation) {

    if (!!gpsLocation && !!pharmacyLocation) {
        let result = getDistanceFromLatLonInKm(gpsLocation[0], gpsLocation[1], pharmacyLocation[0], pharmacyLocation[1])

        return result.toFixed(1) + ' Km'


    }
    else {
        return '0 km '
    }
}
export const getRandomInt = (max = 1000) => {
    return Math.floor(Math.random() * Math.floor(max));
}

export function getDoctorNameOrHospitalName(data) {
    let name = 'unKnown'
    if (data) {
        if (data.doctorInfo) {
            if (data.doctorInfo.first_name != undefined || data.doctorInfo.last_name != undefined) {
                name = `${(data && data.prefix != undefined ? data.prefix + ' ' : '')}${data.doctorInfo.first_name || ''} ${data.doctorInfo.last_name || ''}`

            }
        } else {
            if (data.booked_for === 'HOSPITAL') {
                name = getHospitalHeadeName(data.location[0])
            }
        }
    }
    return name

}

export function RenderDocumentUpload(data) {

    let source = null;
    if (data.type === 'image / jpg') {
        source = require('../../assets/images/Image.png')
    } else if (data.type === 'application/pdf') {
        source = require('../../assets/images/pdf.png')
    } else if (data.type === 'text/plain') {
        source = require('../../assets/images/Word-icon.png')
    } else {
        source = require('../../assets/images/Image.png')
    }
    return (source)
}

