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
import { getRandomInt, arrangeFullName,familyMemAgeCal } from '../../common';
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
            gender: 'M',
            currentIndex: null,
            full_name: '',
            age: '',
            refreshCount: 0,
        };

        this.defaultPatDetails = {};
    }

    async componentDidMount() {
    }


    // addPatientList = async () => {
    //     const { name, age, gender } = this.state;

    //     if (!name || !age || !gender) {
    //         this.setState({ errMsg: '* Kindly fill all the fields' });
    //     } else {
    //         let familyData=[];
    //         const othersDetailsObj = {
    //             type: 'others',
    //             fullName: name,
    //             age: parseInt(age),
    //             gender,
    //             uniqueId: 'others-' + getRandomInt(1000),
    //         };
    //         familyData.push(othersDetailsObj);
    //        await this.setState({ othersDetails: familyData });
    //         // if (this.props.singlePatientSelect === true) {
    //         //     let familyData = [];
    //         //     familyData.push(othersDetailsObj);
    //         //     this.setState({ onlyFamilyWithPayDetailsData: familyData });
    //         //     this.props.addPatientDetails(familyData);
    //         // } else {
    //         //     let familyData = this.props.familyDetailsData;
    //         //     familyData.push(othersDetailsObj);
    //         //     onlyFamilyWithPayDetailsData.push(othersDetailsObj);
    //         //     this.setState({
    //         //         onlyFamilyWithPayDetailsData: onlyFamilyWithPayDetailsData,
    //         //     });
    //         //     this.props.addPatientDetails(familyData);
    //         // }
    //         this.renderOthersDetails(this.state.othersDetails)
    //     }
    // };
    
   

   


    renderSelfDetails(data) {
        // console.log("data",data)
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
                            {data&&data.first_name?(arrangeFullName(data.first_name,data.last_name)):''}
                        </Text>
                    </Col>
                    <Col size={5}>
                        <Text style={styles.ageText}>{data&&data.dob?(parseInt(dateDiff(data.dob, new Date(), 'years')))+' Years':''}</Text>
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
                                    {data&&data.gender ?data.gender : 'N/A'}
                                </Text>
                            </Col>
                        </Row>
                    </Col>
                    <Col size={4}>
                        {data&&data.mobileNo != undefined ? (
                            <Row>
                                <Col size={3}>
                                    <Text style={styles.commonText}>Mobile</Text>
                                </Col>
                                <Col size={2}>
                                    <Text style={styles.commonText}>-</Text>
                                </Col>
                                <Col size={5} style={{ alignItems: 'flex-end' }}>
                                    <Text style={[styles.commonText, { color: '#909498' }]}>
                                        {data&&data.mobileNo?data.mobileNo:'N/A'}
                                    </Text>
                                </Col>
                            </Row>
                        ) : null}
                    </Col>
                   
                </Row>
              
            </View>
        );
    }

//     renderOthersDetails(data) {
//         console.log("data",data)
//         return (
           
//                     <View>
//                             {data.length !== 0 ? (
//                                 <Text
//                                     style={{ fontSize: 12, fontFamily: 'Roboto', marginTop: 10 }}>
//                                     {translate('Patient Details')}
//                                 </Text>
//                             ) : null}
//                      <FlatList
//                                 data={data}
//                                 keyExtractor={(item, index) => index.toString()}
//                                 renderItem={({ item, index }) =>
//                                     <View
//                 style={{
//                     borderColor: 'gray',
//                     borderWidth: 0.3,
//                     padding: 10,
//                     borderRadius: 5,
//                     marginTop: 10,
//                 }}>
//                 {/* <Row>
//                     {data.type === 'others' ? (
//                         <Right style={{ marginTop: -10 }}>
//                             <TouchableOpacity
//                                 onPress={() => this.onRemovePatientClicked(index)}>
//                                 <Icon
//                                     active
//                                     name="ios-close"
//                                     style={{ color: '#d00729', fontSize: 25 }}
//                                 />
//                             </TouchableOpacity>
//                         </Right>
//                     ) : null}
//                 </Row> */}
                
//                 <Row>
//                     <Col size={5}>
//                         <Text style={styles.NameText}>
//                             {data&&data.fullName?data.fullName:''}
//                         </Text>
//                     </Col>
//                     <Col size={5}>
//                         <Text style={styles.ageText}>{data&&data.age?data.age:''}</Text>
//                     </Col>
//                 </Row>
//                 <Row style={{ marginTop: 10 }}>
//                     <Col size={4}>
//                         <Row>
//                             <Col size={3}>
//                                 <Text style={styles.commonText}>Gender</Text>
//                             </Col>
//                             <Col size={2}>
//                                 <Text style={styles.commonText}>-</Text>
//                             </Col>
//                             <Col size={5}>
//                                 <Text style={[styles.commonText, { color: '#909498' }]}>
//                                     {data&&data.gender ?data.gender : 'N/A'}
//                                 </Text>
//                             </Col>
//                         </Row>
//                     </Col>
//                     {/* <Col size={4}>
//                         {data&&data.uniqueId != undefined ? (
//                             <Row>
//                                 <Col size={3}>
//                                     <Text style={styles.commonText}>UniqueId</Text>
//                                 </Col>
//                                 <Col size={2}>
//                                     <Text style={styles.commonText}>-</Text>
//                                 </Col>
//                                 <Col size={5} style={{ alignItems: 'flex-end' }}>
//                                     <Text style={[styles.commonText, { color: '#909498' }]}>
//                                         {data&&data.uniqueId?data.uniqueId:'N/A'}
//                                     </Text>
//                                 </Col>
//                             </Row>
//                         ) : null}
//                     </Col> */}
                   
//                 </Row>
//                 </View>
//                                 }
// />

//             </View>
//         );
//     }

onClickFamilyMember(index, item) {    
    this.setState({ 
        currentIndex: index,
    })
    this.props.onSelectionPatientDetails(item)
}


    render() {
       
        const {
            onSelectionChange,
            onSelectionPatientDetails,
            selectedPatientTypes,
            singlePatientSelect,
            selfData,
            familyMembers
        } = this.props;
        const { name, age, gender, onlyFamilyWithPayDetailsData, data } = this.state;
// console.log("selectedPatientTypes",selectedPatientTypes)
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
                                selectedPatientTypes.includes('self')
                                    ? true
                                    : false
                            }
                            onPress={() => {
                                this.props.onSelectionChange('self');
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
                                selectedPatientTypes.includes('family')
                                    ? true
                                    : false
                            }
                            onPress={() =>
                                onSelectionChange('family')
                            }
                        />
                        <Text style={[styles.commonText, { marginLeft: 5 }]}>
                            {translate('Family')}{' '}
                        </Text>
                    </View>

                    {/* <View
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
                            onPress={() => {
                                onSelectionChange(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITHOUT_PAY);
                                this.setState({ patientDetailsObj: {} });
                            }}
                        />

                        <Text style={[styles.commonText, { marginLeft: 5 }]}>
                            {translate('Others')}{' '}
                        </Text>
                    </View> */}
                </View>

                <View style={{ marginTop: 10 }}>
                    {selectedPatientTypes.includes('self') ? (
                        <View>
                            <Text style={{ fontSize: 12, fontFamily: 'Roboto', marginTop: 10 }}>
                                {translate('Patient Details')}
                            </Text>
                            <View>
                                {this.renderSelfDetails(selfData)}
                            </View>
                        </View>
                    ) : null}
                </View>

                <View style={{ marginTop: 10 }}>
                    {selectedPatientTypes.includes('family') ? (
                        <View>
                            {familyMembers.length !== 0 ? (
                                <Text
                                    style={{ fontSize: 12, fontFamily: 'Roboto', marginTop: 10 }}>
                                    {translate('Patient Details')}
                                </Text>
                            ) : null}
                            <FlatList
                                data={familyMembers}
                                extraData={this.state.currentIndex}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) =>
                                <TouchableOpacity
                                onPress={() => this.onClickFamilyMember(index, item)}
                                style={[this.state.currentIndex === index ? {
                                    borderColor: '#48b4a5',
                                    borderWidth: 1,
                                    padding: 10,
                                    backgroundColor: 'rgba(229,229,229,0.5)',
                                    borderRadius: 5,
                                    marginTop: 10,
                                } : {
                                    borderColor: 'gray',
                                    borderWidth: 0.3,
                                    padding: 10,
                                    borderRadius: 5,
                                    marginTop: 10,
                                }]}>
                               
                                <Row>
                                    <Col size={5}>
                                        <Text style={styles.NameText}>
                                        {item.familyMemberName?(arrangeFullName(item.familyMemberName,item.familyMemberLastName)):'N/A'}
                                        </Text>
                                    </Col>
                                    <Col size={5}>
                                        <Text style={styles.ageText}>{item.familyMemberAge?familyMemAgeCal(item):'N/A'}</Text>
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
                                                    {item.familyMemberGender ?item.familyMemberGender : 'N/A'}
                                                </Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col size={5}>
                                            <Row>
                                                <Col size={4.5}>
                                                    <Text style={styles.commonText}>Relationship</Text>
                                                </Col>
                                                <Col size={1}>
                                                    <Text style={styles.commonText}>-</Text>
                                                </Col>
                                                <Col size={4.5} style={{ alignItems: 'flex-end' }}>
                                                    <Text style={[styles.commonText, { color: '#909498' }]}>
                                                        {item.relationship?item.relationship:'N/A'}
                                                    </Text>
                                                </Col>
                                            </Row>
                                    </Col>
                                   
                                </Row>
                              
                            </TouchableOpacity>
                                }
                            />
                        </View>
                    ) : null}
                </View>


                {/* <View style={{ marginTop: 10 }}>
                    {selectedPatientTypes.includes(
                        POSSIBLE_FAMILY_MEMBERS.FAMILY_WITHOUT_PAY,
                    ) ? (
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
                </View> */}
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
