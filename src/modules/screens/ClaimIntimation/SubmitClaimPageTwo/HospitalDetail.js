import React, { useEffect, useState, useRef } from 'react';
import { Text, View, Item, Input,Button } from 'native-base';
import { TouchableOpacity, } from 'react-native'
import { Col, Row } from 'react-native-easy-grid';
import styles from '../Styles';
import { toastMeassage } from '../../../common';
import ModalPopup from '../../../../components/Shared/ModalPopup';
import { acceptNumbersOnly } from '../../../common';

const HospitalDetail = (props) => {
    const { updateHospitalDetail } = props;
    const [hospitalName, sethospitalName] = useState('')
    const [hospitalId, sethospitalId] = useState('')
    const [hospitalType, sethospitalType] = useState('')
    const [doctorFirstName, setdoctorFirstName] = useState('')
    const [doctorMiddleName, setdoctorMiddleName] = useState('')
    const [doctorLastName, setdoctorLastName] = useState('')
    const [qualification, setqualification] = useState('')
    const [streetNumber, setstreetNumber] = useState('')
    const [phoneNumber, setphoneNumber] = useState('')
    const [errorMsg, seterrorMsg] = useState('')
    const [isModalVisible, setisModalVisible] = useState(false)
    const inputEl1 = useRef(null);
    const inputEl2 = useRef(null);
    const inputEl3 = useRef(null);
    const inputEl4 = useRef(null);
    const inputEl5 = useRef(null);
    const inputEl6 = useRef(null);
    const inputEl7 = useRef(null);
    const inputEl8 = useRef(null);

    const submmitData = () => {
        if (hospitalName != '' && doctorFirstName != ''  && qualification != '') {
            updateHospitalDetail({
                hospitalName: hospitalName,
                hospitalId: hospitalId,
                hospitalType: hospitalType,
                treatingDoctorName: doctorFirstName,
                treatingDoctorMiddleName: doctorMiddleName,
                treatingDoctorLastName: doctorLastName,
                qualification: qualification,
                registrationStateCode  : streetNumber,
                hospitalPhoneNumber: phoneNumber,
            })
            sethospitalName('')
            sethospitalId('')
            sethospitalType('')
            setdoctorFirstName('')
            setdoctorMiddleName('')
            setdoctorLastName('')
            setqualification('')
            setstreetNumber('')
            setphoneNumber('')
        } 
        else {
            if (hospitalName === '') {
                seterrorMsg('Please enter hospital name')
                setisModalVisible(true)
                return false
            }
            
            if (doctorFirstName === '') {
                seterrorMsg('Please enter doctor first name')
                setisModalVisible(true)
                return false
            }
           
            if (qualification === '') {
                seterrorMsg('Please enter hospital Name')
                setisModalVisible(true)
                return false
            }
            
        }
    }
    return (
        <View>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Name of Hospital.<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Hospital Name"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                            value={hospitalName}
                            keyboardType={'default'}
                            onChangeText={(Name) => sethospitalName(Name)}
                            onSubmitEditing={() => inputEl1.current._root.focus()}
                            testID="editHospitalName"

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Hospital Id</Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Hospital Id."
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                            value={hospitalId}
                            ref={inputEl1}
                            keyboardType={'default'}
                            onChangeText={(text) => sethospitalId(text)}
                            onSubmitEditing={() => inputEl2.current._root.focus()}
                            testID="editHospitalID"
                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Type of hospital</Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Type of hospital"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                            keyboardType={'default'}
                            ref={inputEl2}
                            value={hospitalType}
                            keyboardType={'default'}
                            onChangeText={(text) => sethospitalType(text)}
                            onSubmitEditing={() => inputEl3.current._root.focus()}
                            testID="editHospitalType"
                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Treating doctor first name.<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Treating doctor first name"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                            value={doctorFirstName}
                            ref={inputEl3}
                            keyboardType={'default'}
                            onChangeText={(text) => setdoctorFirstName(text)}
                            onSubmitEditing={() => inputEl4.current._root.focus()}
                            testID="editDoctorFirstName"
                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Treating doctor middle name</Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Treating doctor middle name"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                            value={doctorMiddleName}
                            ref={inputEl4}
                            keyboardType={'default'}
                            onChangeText={(text) => setdoctorMiddleName(text)}
                            onSubmitEditing={() => inputEl5.current._root.focus()}
                            testID="editDoctorMiddleName"
                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Treating doctor last name</Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Last Name"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                            value={doctorLastName}
                            ref={inputEl5}
                            keyboardType={'default'}
                            onChangeText={(text) => setdoctorLastName(text)}
                            onSubmitEditing={() => inputEl6.current._root.focus()}
                            testID="editDoctorLastName"

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Qualification.<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Qualification"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                            value={qualification}
                            ref={inputEl6}
                            keyboardType={'default'}
                            onChangeText={(text) => setqualification(text)}
                            onSubmitEditing={() => inputEl7.current._root.focus()}
                            testID="editQualification"

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Registration with state code</Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Street Number"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                            value={streetNumber}
                            ref={inputEl7}
                            keyboardType={'default'}
                            onChangeText={(text) => setstreetNumber(text)}
                            onSubmitEditing={() => inputEl8.current._root.focus()}
                            testID="editStreetNumber"
                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Phone Number</Text>
                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Phone Number"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                            value={phoneNumber}
                            ref={inputEl8}
                            keyboardType={'number-pad'}
                            onChangeText={(text) => acceptNumbersOnly(text) == true || text === '' ? setphoneNumber(text) : null}
                            testID="editPhoneNumber"
                        />
                    </Item>
                </Col>
            </Row>
            <View style={styles.ButtonView}>
                <Button style={styles.submit_ButtonStyle} type="reset" onPress={() => submmitData()}>
                    <Text style={{ color: "#fff" }}>Submit And Continue</Text>
                </Button>
            </View>
            <ModalPopup
                errorMessageText={errorMsg}
                closeButtonText={'CLOSE'}
                closeButtonAction={() => setisModalVisible(false)}
                visible={isModalVisible} />
        </View>
    );
}


export default HospitalDetail