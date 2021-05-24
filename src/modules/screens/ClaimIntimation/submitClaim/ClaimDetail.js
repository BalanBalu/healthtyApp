import React, {useEffect, useState} from 'react';
import { Text, View,  Item, Input, Radio, CheckBox } from 'native-base';
import { TouchableOpacity, FlatList, } from 'react-native'
import { Col, Row } from 'react-native-easy-grid';
import styles from '../Styles';
import { primaryColor } from '../../../../setup/config';
import {toastMeassage} from '../../../common';




const ClaimDetail = (props) => {
    const {isSelected, ListOfData, checkBoxClick,updateSubmissionDetails} = props;
    const [preHospitalizationExpenses, setPreHospitalizationExpenses] = useState('');
    const [hospitalizationExpenses, setHospitalizationExpenses] = useState('');
    const [postHospitalizationExpenses, setPostHospitalizationExpenses] = useState('');
    const [healthCheckupCost, setHealthCheckupCost] = useState('');
    const [ambulanceCharges, setAmbulanceCharges] = useState('');
    const [othersCode, setOthersCode] = useState('');
    const [totalClaim, setTotalClaim] = useState('');
    const [preHospitalizationPeriod, setPreHospitalizationPeriod] = useState('');
    const [postHospitalizationPeriod, setPostHospitalizationPeriod] = useState('');
    const [claimForDomiciliaryHospitalization, setClaimForDomiciliaryHospitalization] = useState('');
    const [hospitalDailyCash, setHospitalDailyCash] = useState('');
    const [surgicalCash, setSurgicalCash] = useState('');
    const [criticalIllness, setCriticalIllness] = useState('');
    const [convalescence, setConvalescence] = useState('');
    const [lumsumBenefit, setLumsumBenefit] = useState('');
    const [others, setOthers] = useState('');
    const [totalClaimValue, setTotalClaimValue] = useState('');

    return (
        <View>
            <Text style={{ marginLeft: 15, fontSize: 16, marginTop: 10 }}>Details of treatment expenses claimed</Text>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Enter Pre hospitalization Expense<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Pre hospitalization Expense"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                              value={preHospitalizationExpenses}
                            keyboardType={'default'}
                        //   editable={employeeId == undefined ? true : false}
                          onChangeText={(text) =>setPreHospitalizationExpenses(text)}
                        
                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Enter Hospitalization Expenses<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Hospitalization Expenses"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                              value={hospitalizationExpenses}
                            keyboardType={'default'}
                        //   editable={employeeId == undefined ? true : false}
                        onChangeText={(text) =>setHospitalizationExpenses(text)}

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Enter Post hospitalization Expense<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Post hospitalization Expense"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                              value={postHospitalizationExpenses}
                            keyboardType={'number-pad'}
                        //   editable={employeeId == undefined ? true : false}
                        onChangeText={(text) =>setPostHospitalizationExpenses(text)}

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Enter Health checkup costs<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Health checkup costs in Rs"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                              value={healthCheckupCost}
                            keyboardType={'number-pad'}
                        //   editable={employeeId == undefined ? true : false}
                        onChangeText={(cost) =>setHealthCheckupCost(cost)}

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Enter Ambulance charges<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Ambulance charges"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                              value={ambulanceCharges}
                            keyboardType={'number-pad'}
                        //   editable={employeeId == undefined ? true : false}
                             onChangeText={(charges) =>setAmbulanceCharges(charges)}

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Others code<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Others code"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                              value={othersCode}
                            keyboardType={'number-pad'}
                        //   editable={employeeId == undefined ? true : false}
                        onChangeText={(text) =>setOthersCode(text)}

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>TOTAL<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter TOTAL"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                              value={totalClaim}
                            keyboardType={'number-pad'}
                            onChangeText={(text) =>setTotalClaim(text)}
                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Pre Hospitalization period<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Pre Hospitalization period"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                              value={preHospitalizationPeriod}
                            keyboardType={'number-pad'}
                            onChangeText={(text) =>setPreHospitalizationPeriod(text)}

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Post Hospitalization period<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Post Hospitalization period"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                              value={postHospitalizationPeriod}
                            keyboardType={'number-pad'}
                            onChangeText={(text) =>setPostHospitalizationPeriod(text)}

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Claim for domiciliary hospitalization<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
                        <Radio
                            color={primaryColor}
                            selectedColor={primaryColor}
                            standardStyle={true}
                            selected={claimForDomiciliaryHospitalization === true}
                            onPress={() => setClaimForDomiciliaryHospitalization(true)}
                        />
                        <Text style={styles.text}>Yes</Text>

                        <View style={styles.radioButtonStyle}>
                            <Radio
                                color={primaryColor}
                                selectedColor={primaryColor}
                                standardStyle={true}
                                selected={claimForDomiciliaryHospitalization === false}
                                onPress={() => setClaimForDomiciliaryHospitalization(false)}
                                />
                            <Text style={styles.text}>No</Text>
                            <Text style={{ width: '80%', marginTop: 10 }}> If yes, provide details in annexure</Text>

                        </View>
                    </Item>
                </Col>
            </Row>
            <Text style={{ marginLeft: 15, fontSize: 16, marginTop: 10 }}>Details of lump sum cash claimed</Text>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Hospital daily cash<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter health ceckup cost in Rs"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                              value={hospitalDailyCash}
                            keyboardType={'number-pad'}
                            onChangeText={(text) =>setHospitalDailyCash(text)}

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Surgical cash<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Surgical cash"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                              value={surgicalCash}
                            keyboardType={'number-pad'}
                            onChangeText={(text) =>setSurgicalCash(text)}

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Critical illness benefit<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter in Rs"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                              value={criticalIllness}
                            keyboardType={'number-pad'}
                            onChangeText={(text) =>setCriticalIllness(text)}

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>CONVALESCENCE<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter in Rs"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                              value={convalescence}
                            keyboardType={'number-pad'}
                            onChangeText={(text) =>setConvalescence(text)}

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Pre post Lump sum benefit<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter in Rs"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                              value={lumsumBenefit}
                            keyboardType={'number-pad'}
                            onChangeText={(text) =>setLumsumBenefit(text)}

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Others<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter in Rs"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                              value={others}
                            keyboardType={'number-pad'}
                            onChangeText={(text) =>setOthers(text)}

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>TOTAL<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter in Rs"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                              value={totalClaimValue}
                            keyboardType={'number-pad'}
                            onChangeText={(text) =>setTotalClaimValue(text)}

                        />
                    </Item>
                </Col>
            </Row>


            {/* <FlatList
                data={ListOfData}
                keyExtractor={(item, index) => index.toString()}
                extraData={checkBoxClick}
                renderItem={({ item, index }) => (
                    <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15, marginLeft: 10 }}>
                        <CheckBox style={{ borderRadius: 5, }}
                            checked={checkBoxClick === item.text}
                            onPress={() => this.setState({ checkBoxClick: item.text })}

                        />
                        <Text style={styles.flatlistText}>{item.text}</Text>
                    </View>
                )} /> */}

            <View style={styles.ButtonView}>
                <TouchableOpacity style={styles.submit_ButtonStyle} >
                    <Text style={{ color: "#fff" }}>Submit And Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


export default ClaimDetail