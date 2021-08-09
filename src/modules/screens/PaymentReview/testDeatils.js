import React, { PureComponent } from 'react';
import { Text, Radio, Icon, Input, CheckBox, Right } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BenefeciaryDetails from './benefeciaryDetails';
import {
    fetchUserProfile,
    getCorporateUserFamilyDetails,
    getPolicYDetailsByid,
} from '../../providers/profile/profile.action';
import { hasLoggedIn } from '../../providers/auth/auth.actions';
import { dateDiff } from '../../../setup/helpers';
import { primaryColor } from '../../../setup/config';
import { translate } from '../../../setup/translator.helper';
import {
    getMemberDetailsByEmail,
    getFamilyMemDetails,
    deleteFamilyMembersDetails,
  } from '../../providers/corporate/corporate.actions';
  
import { POSSIBLE_PAY_METHODS } from './PayBySelection';
import { getRandomInt, arrangeFullName } from '../../common';
const POSSIBLE_FAMILY_MEMBERS = {
    SELF: 'SELF',
    FAMILY_WITH_PAY: 'FAMILY_WITH_PAY',
    FAMILY_WITHOUT_PAY: 'FAMILY_WITHOUT_PAY',
};
class TestDetails extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            benefeciaryDeails: false,
            patientDetailsObj: {},
            data: {
                familyDataByInsurance: [],
                familyDataByCorporate: [],
            },
            gender: 'M',
            full_name: '',
            age: '',
            refreshCount: 0,
            familyDetailsData: [],
            onlyFamilyWithPayDetailsData: [],
        };

        this.defaultPatDetails = {};
    }

    async componentDidMount() {
        await this.getPatientInfo();
    }

    getPatientInfo = async () => {
        try {
            this.setState({isLoading: true});
            let memberPolicyNo = await AsyncStorage.getItem('memberPolicyNo');
            let employeeCode = await AsyncStorage.getItem('employeeCode');
            let result = await getFamilyMemDetails(memberPolicyNo, employeeCode);
            console.log('result', result);
            if (result) {
              this.setState({familyMembers: result, isLoading: false});
            }
          }catch (Ex) {
            console.log(
                'Ex is getting Get Patient Info in Payment preview page',
                Ex.message,
            );
        }
    };

    addPatientList = async () => {
        const { name, age, gender } = this.state;

        if (!name || !age || !gender) {
            this.setState({ errMsg: '* Kindly fill all the fields' });
        } else {
            const othersDetailsObj = {
                type: 'others',
                full_name: name,
                age: parseInt(age),
                gender,
                uniqueId: 'others-' + getRandomInt(1000),
            };
            const onlyFamilyWithPayDetailsData = this.state
                .onlyFamilyWithPayDetailsData;
            debugger;
            if (this.props.singlePatientSelect === true) {
                let familyData = [];
                familyData.push(othersDetailsObj);
                this.setState({ onlyFamilyWithPayDetailsData: familyData });
                this.props.addPatientDetails(familyData);
            } else {
                let familyData = this.props.familyDetailsData;
                familyData.push(othersDetailsObj);
                onlyFamilyWithPayDetailsData.push(othersDetailsObj);
                this.setState({
                    onlyFamilyWithPayDetailsData: onlyFamilyWithPayDetailsData,
                });
                this.props.addPatientDetails(familyData);
            }
        }
    };
    onSelfPatientClicked(hasCheckedForMultiSelect) {
        this.setState({ patientDetailsObj: this.defaultPatDetails });
        if (this.props.singlePatientSelect === true) {
            this.props.addPatientDetails([this.defaultPatDetails]);
        } else {
            const familyDetailsData = this.props.familyDetailsData;
            const index = familyDetailsData.findIndex((ele) => ele.type === 'self');
            if (hasCheckedForMultiSelect === false) {
                familyDetailsData.push(this.defaultPatDetails);
            } else {
                familyDetailsData.splice(index, 1);
            }

            this.setPatientType(POSSIBLE_FAMILY_MEMBERS.SELF);
            this.props.addPatientDetails(familyDetailsData);
        }
    }
    setPatientType(changedPatientType) {
        const selectedPatientTypes = this.props.selectedPatientTypes;
        if (selectedPatientTypes.includes(changedPatientType)) {
            selectedPatientTypes.splice(
                selectedPatientTypes.indexOf(changedPatientType),
                1,
            );
            this.props.onSelectionChange(selectedPatientTypes);
        } else {
            selectedPatientTypes.push(changedPatientType);
            this.props.onSelectionChange(selectedPatientTypes);
        }
    }

    onRemovePatientClicked(indexNo) {
        let uniqueId = null;
        const filteredData = this.state.onlyFamilyWithPayDetailsData.filter(
            function (item, index) {
                if (index === indexNo) {
                    uniqueId = item.uniqueId;
                }
                return index !== indexNo;
            },
        );

        const arr = this.props.familyDetailsData.filter(function (item, index) {
            return item.uniqueId !== uniqueId;
        });

        this.props.addPatientDetails(arr);
        this.setState({ onlyFamilyWithPayDetailsData: filteredData });
    }
    removeAllWithoutPayFamilyDetails() {
        const arr = this.props.familyDetailsData.filter(function (item, index) {
            return item.type !== 'others';
        });
        this.props.addPatientDetails(arr);
    }
    addAllWithoutPayFamilyMembersToPatientDetails() {
        const existingPatDetails = this.props.familyDetailsData || [];
        this.props.addPatientDetails(
            existingPatDetails.concat(this.state.onlyFamilyWithPayDetailsData),
        );
    }

    async addFamilyMembersForBooking(data, index, payBy) {
        const payByFamilyIndex = payBy + '-' + index;
        let familyMembersSelections = this.props.familyMembersSelections;

        const beneficiaryDetailsObj = {
            type: 'familymembers',
            full_name: data.full_name,
            age: parseInt(data.age),
            gender: data.gender,
            uniqueIndex: payByFamilyIndex,
        };

        if (
            payBy === POSSIBLE_PAY_METHODS.CORPORATE ||
            payBy === POSSIBLE_PAY_METHODS.INSURANCE
        ) {
            beneficiaryDetailsObj.policy_no = data.benefeciaryUserDeails.policyNumber;
            beneficiaryDetailsObj.benefeciaryUserDeails = data.benefeciaryUserDeails;
        }
        if (this.props.singlePatientSelect === true) {
            if (this.props.familyMembersSelections.includes(payByFamilyIndex)) {
                familyMembersSelections.splice(
                    familyMembersSelections.indexOf(payByFamilyIndex),
                    1,
                );
                let familyData = this.props.familyDetailsData;
                const finalFamilyData = familyData.filter(
                    (ele) => ele.uniqueIndex !== payByFamilyIndex,
                );
                this.props.addPatientDetails(finalFamilyData);
            } else {
                let familyData = [];
                familyMembersSelections = [payByFamilyIndex];
                familyData.push(beneficiaryDetailsObj);
                this.props.addPatientDetails(familyData);
            }
        } else {
            let familyFindIndex = this.props.familyDetailsData.findIndex(
                (ele) => ele.uniqueIndex === payByFamilyIndex,
            );
            if (
        /*familyFindIndex === -1*/ this.props.familyMembersSelections.includes(
                payByFamilyIndex,
            ) === false
            ) {
                let familyData = [
                    ...this.props.familyDetailsData,
                    beneficiaryDetailsObj,
                ];
                familyMembersSelections.push(payByFamilyIndex);
                this.props.addPatientDetails(familyData);
            } else {
                let familyData = this.props.familyDetailsData;
                familyData.splice(familyFindIndex, 1);
                familyMembersSelections.splice(
                    familyMembersSelections.indexOf(payByFamilyIndex),
                    1,
                );
                this.props.addPatientDetails(familyData);
            }
        }

        await this.props.changeFamilyMembersSelections(familyMembersSelections);
    }
    removeAllPatientFromCorporateEmployeeDetails() {
        const updatedFamilyDetails = this.props.familyDetailsData.filter(
            (ele) => ele.type !== 'familymembers',
        );
        this.props.addPatientDetails(updatedFamilyDetails);
        this.props.changeFamilyMembersSelections([]);
    }

    renderSelfDetails(data, index, enableSelectionBox, patientSelectionType) {
        console.log("data",data)
        const { isCorporateUser, payBy } = this.props;
        return (
            <View
                style={{
                    borderColor: 'gray',
                    borderWidth: 0.3,
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 10,
                }}>
                {/* <Row>
                    {data.type === 'others' ? (
                        <Right style={{ marginTop: -10 }}>
                            <TouchableOpacity
                                onPress={() => this.onRemovePatientClicked(index)}>
                                <Icon
                                    active
                                    name="ios-close"
                                    style={{ color: '#d00729', fontSize: 25 }}
                                />
                            </TouchableOpacity>
                        </Right>
                    ) : null}
                </Row> */}
                <Row>
                    <Col size={5}>
                        <Text style={styles.NameText}>
                            {arrangeFullName(data.first_name,data.last_name)}
                        </Text>
                    </Col>
                    <Col size={5}>
                        <Text style={styles.ageText}>{parseInt(dateDiff(data.dob, new Date(), 'years'))}</Text>
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Col size={4}>
                        <Row>
                            <Col size={3}>
                                <Text style={styles.commonText}>Gender</Text>
                            </Col>
                            <Col size={2}>
                                <Text style={styles.commonText}>-</Text>
                            </Col>
                            <Col size={5}>
                                <Text style={[styles.commonText, { color: '#909498' }]}>
                                    {data.gender ?data.gender : 'N/A'}
                                </Text>
                            </Col>
                        </Row>
                    </Col>
                    <Col size={4}>
                        {data.mobileNo != undefined ? (
                            <Row>
                                <Col size={3}>
                                    <Text style={styles.commonText}>Mobile</Text>
                                </Col>
                                <Col size={2}>
                                    <Text style={styles.commonText}>-</Text>
                                </Col>
                                <Col size={5} style={{ alignItems: 'flex-end' }}>
                                    <Text style={[styles.commonText, { color: '#909498' }]}>
                                        {data.mobileNo}
                                    </Text>
                                </Col>
                            </Row>
                        ) : null}
                    </Col>
                   
                </Row>
              
            </View>
        );
    }
    renderFamilyDetails(data, index, enableSelectionBox, patientSelectionType) {
        console.log("data",data)
        const { isCorporateUser, payBy } = this.props;
        return (
            <View
                style={{
                    borderColor: 'gray',
                    borderWidth: 0.3,
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 10,
                }}>
                {/* <Row>
                    {data.type === 'others' ? (
                        <Right style={{ marginTop: -10 }}>
                            <TouchableOpacity
                                onPress={() => this.onRemovePatientClicked(index)}>
                                <Icon
                                    active
                                    name="ios-close"
                                    style={{ color: '#d00729', fontSize: 25 }}
                                />
                            </TouchableOpacity>
                        </Right>
                    ) : null}
                </Row> */}
                <Row>
                    <Col size={5}>
                        <Text style={styles.NameText}>
                        {arrangeFullName(data.familyMemberName,data.familyMemberLastName)}
                        </Text>
                    </Col>
                    <Col size={5}>
                        <Text style={styles.ageText}>{data.familyMemberAge} years</Text>
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Col size={4}>
                        <Row>
                            <Col size={3}>
                                <Text style={styles.commonText}>Gender</Text>
                            </Col>
                            <Col size={2}>
                                <Text style={styles.commonText}>-</Text>
                            </Col>
                            <Col size={5}>
                                <Text style={[styles.commonText, { color: '#909498' }]}>
                                    {data.familyMemberGender ?data.familyMemberGender : 'N/A'}
                                </Text>
                            </Col>
                        </Row>
                    </Col>
                    <Col size={4}>
                        {data.relationship != undefined ? (
                            <Row>
                                <Col size={3}>
                                    <Text style={styles.commonText}>Relationship</Text>
                                </Col>
                                <Col size={2}>
                                    <Text style={styles.commonText}>-</Text>
                                </Col>
                                <Col size={5} style={{ alignItems: 'flex-end' }}>
                                    <Text style={[styles.commonText, { color: '#909498' }]}>
                                        {data.relationship}
                                    </Text>
                                </Col>
                            </Row>
                        ) : null}
                    </Col>
                   
                </Row>
              
            </View>
        );
    }


    getPossiblePaymentMethods(payBy) {
        if (payBy === POSSIBLE_PAY_METHODS.SELF) {
            return ['SELF', 'FAMILY_WITH_PAY'];
        }
        if (payBy === POSSIBLE_PAY_METHODS.INSURANCE) {
            return ['SELF', 'FAMILY_WITHOUT_PAY'];
        }
        if (payBy === POSSIBLE_PAY_METHODS.CORPORATE) {
            return ['SELF', 'FAMILY_WITHOUT_PAY'];
        }
    }

    render() {
       
        const {
            isCorporateUser,
            payBy,
            onSelectionChange,
            selectedPatientTypes,
            familyDetailsData,
            singlePatientSelect,
            selfData,
        } = this.props;
        console.log("selfData,",selfData)
        const { name, age, gender, onlyFamilyWithPayDetailsData, data } = this.state;
        // const familyData = payBy === POSSIBLE_PAY_METHODS.INSURANCE ? data.familyDataByInsurance : data.familyDataByCorporate

        return (
            <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 10 }}>
                <Text style={{ fontFamily: 'Roboto', fontSize: 14, color: primaryColor }}>
                    {translate('Appointment for?')}
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Radio
                            color={primaryColor}
                            standardStyle={true}
                            selected={
                                selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.SELF)
                                    ? true
                                    : false
                            }
                            onPress={() => {
                                this.props.onSelectionChange(POSSIBLE_FAMILY_MEMBERS.SELF);
                                this.onSelfPatientClicked();
                            }}
                        />

                        <Text style={[styles.commonText, { marginLeft: 5 }]}>
                            {translate('Self')}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 40,
                            alignItems: 'center',
                        }}>
                        <Radio
                            color={primaryColor}
                            standardStyle={true}
                            selected={
                                selectedPatientTypes.includes(
                                    POSSIBLE_FAMILY_MEMBERS.FAMILY_WITHOUT_PAY,
                                )
                                    ? true
                                    : false
                            }
                            onPress={() =>
                                onSelectionChange(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITHOUT_PAY)
                            }
                        />
                        <Text style={[styles.commonText, { marginLeft: 5 }]}>
                            {translate('Family')}{' '}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 40,
                            alignItems: 'center',
                        }}>
                        <Radio
                            color={primaryColor}
                            standardStyle={true}
                            selected={
                                selectedPatientTypes.includes(
                                    POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY,
                                )
                                    ? true
                                    : false
                            }
                            onPress={() => {
                                onSelectionChange(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY);
                                this.setState({ patientDetailsObj: {} });
                            }}
                        />

                        <Text style={[styles.commonText, { marginLeft: 5 }]}>
                            {translate('Others')}{' '}
                        </Text>
                    </View>
                </View>

                <View style={{ marginTop: 10 }}>
                    {selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.SELF) ? (
                        <View>
                            <Text style={{ fontSize: 12, fontFamily: 'Roboto', marginTop: 10 }}>
                                {translate('Patient Details')}
                            </Text>
                            <View>
                                {this.renderSelfDetails(
                                    selfData,
                                    0,
                                    false,
                                    POSSIBLE_FAMILY_MEMBERS.SELF,
                                )}
                            </View>
                        </View>
                    ) : null}
                </View>
                <View style={{ marginTop: 10 }}>
                    {selectedPatientTypes.includes(
                        POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY,
                    ) ? (
                        <View>
                            {onlyFamilyWithPayDetailsData.length !== 0 ? (
                                <Text
                                    style={{ fontSize: 12, fontFamily: 'Roboto', marginTop: 10 }}>
                                    {translate('Patient Details')}
                                </Text>
                            ) : null}
                            <FlatList
                                data={onlyFamilyWithPayDetailsData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) =>
                                    this.renderFamilyDetails(
                                        item,
                                        index,
                                        false,
                                        POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY,
                                    )
                                }
                            />
                            {(selectedPatientTypes.includes(
                                POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY,
                            ) &&
                                this.props.singlePatientSelect === false) ||
                                (selectedPatientTypes.includes(
                                    POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY,
                                ) &&
                                    this.props.singlePatientSelect === true &&
                                    familyDetailsData.filter((ele) => ele.type === 'others')
                                        .length === 0) ? (
                                <View style={{ marginTop: 8 }}>
                                    {familyDetailsData.length !== 0 ? (
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontFamily: 'Roboto',
                                                color: primaryColor,
                                                textAlign: 'center',
                                            }}>
                                            (OR)
                                        </Text>
                                    ) : null}
                                    <Text style={styles.subHead}>
                                        {translate("Add other patient's details")}
                                    </Text>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col size={6}>
                                            <Row>
                                                <Col size={2} style={{ justifyContent: 'center' }}>
                                                    <Text style={styles.nameAndAge}>Name</Text>
                                                </Col>
                                                <Col size={8} style={{ justifyContent: 'center' }}>
                                                    <Input
                                                        placeholder="Enter name"
                                                        style={styles.inputText}
                                                        returnKeyType={'next'}
                                                        keyboardType={'default'}
                                                        value={name}
                                                        onChangeText={(name) => this.setState({ name })}
                                                        blurOnSubmit={false}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col size={4} style={{ marginLeft: 5 }}>
                                            <Row>
                                                <Col size={2} style={{ justifyContent: 'center' }}>
                                                    <Text style={styles.nameAndAge}>Age</Text>
                                                </Col>
                                                <Col size={7} style={{ justifyContent: 'center' }}>
                                                    <Input
                                                        placeholder="Enter age"
                                                        style={styles.inputText}
                                                        returnKeyType={'done'}
                                                        keyboardType="numeric"
                                                        value={age}
                                                        onChangeText={(age) => this.setState({ age })}
                                                        blurOnSubmit={false}
                                                    />
                                                </Col>
                                                <Col size={1}></Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <View
                                        style={{
                                            marginTop: 10,
                                            borderBottomWidth: 0,
                                            flexDirection: 'row',
                                        }}>
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
                                                fontSize: 12,
                                                marginTop: 3,
                                            }}>
                                            Gender
                                        </Text>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginLeft: 10,
                                            }}>
                                            <Radio
                                                color={primaryColor}
                                                standardStyle={true}
                                                selected={gender === 'M' ? true : false}
                                                onPress={() => this.setState({ gender: 'M' })}
                                            />
                                            <Text style={[styles.commonText, { marginLeft: 5 }]}>
                                                Male
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginLeft: 20,
                                                alignItems: 'center',
                                            }}>
                                            <Radio
                                                color={primaryColor}
                                                standardStyle={true}
                                                selected={gender === 'F' ? true : false}
                                                onPress={() => this.setState({ gender: 'F' })}
                                            />
                                            <Text style={[styles.commonText, { marginLeft: 5 }]}>
                                                Female
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginLeft: 20,
                                                alignItems: 'center',
                                            }}>
                                            <Radio
                                                color={primaryColor}
                                                standardStyle={true}
                                                selected={gender === 'O' ? true : false}
                                                onPress={() => this.setState({ gender: 'O' })}
                                            />
                                            <Text style={[styles.commonText, { marginLeft: 5 }]}>
                                                Others
                                            </Text>
                                        </View>
                                    </View>
                                    <Row
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 15,
                                        }}>
                                        <TouchableOpacity
                                            style={styles.touchStyle}
                                            onPress={() => this.addPatientList()}>
                                            <Text style={styles.touchText}>
                                                {translate('Add patient')}
                                            </Text>
                                        </TouchableOpacity>
                                    </Row>
                                </View>
                            ) : null}
                        </View>
                    ) : null}

                    <View style={{ marginTop: 10 }}>
                        {selectedPatientTypes.includes(
                            POSSIBLE_FAMILY_MEMBERS.FAMILY_WITHOUT_PAY,
                        ) ? (
                            <View>
                                <Text style={{ fontSize: 12, fontFamily: 'Roboto' }}>
                                    {translate('Patient Details')}
                                </Text>
                                <FlatList
                                    data={
                                        payBy === POSSIBLE_PAY_METHODS.INSURANCE
                                            ? data.familyDataByInsurance
                                            : data.familyDataByCorporate
                                    }
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) =>
                                        this.renderPatientDetails(
                                            item,
                                            index,
                                            true,
                                            POSSIBLE_FAMILY_MEMBERS.FAMILY_WITHOUT_PAY,
                                        )
                                    }
                                />
                            </View>
                        ) : null}
                    </View>
                </View>
            </View>
        );
    }
}

export { TestDetails, POSSIBLE_FAMILY_MEMBERS };

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5F5',
        marginTop: 10,
    },

    bodyContent: {
        backgroundColor: '#F5F5F5',
    },
    touchStyle: {
        backgroundColor: primaryColor,
        borderRadius: 3,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 5,
        paddingTop: 5,
    },
    touchText: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
    },
    inputText: {
        backgroundColor: '#f2f2f2',
        color: '#000',
        fontSize: 12,
        height: 33,
        marginTop: 8,
    },
    nameAndAge: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#000',
        marginTop: 5,
    },
    subHead: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#000',
        // fontWeight: 'bold'
    },
    NameText: {
        fontSize: 12,
        fontFamily: 'Roboto',
        color: primaryColor,
    },
    ageText: {
        fontSize: 12,
        fontFamily: 'Roboto',
        textAlign: 'right',
    },
    commonText: {
        fontSize: 12,
        fontFamily: 'Roboto',
    },
    selectButton: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 2,
        paddingBottom: 2,
        backgroundColor: '#8EC63F',
        borderRadius: 2,
    },
    benefeciaryButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 5,
    },
});
