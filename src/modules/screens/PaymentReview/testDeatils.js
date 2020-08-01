import React, { PureComponent } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Radio, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, BackHandler, AsyncStorage } from 'react-native';
import { formatDate } from '../../../setup/helpers';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { data } from 'react-native-connectycube';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import BenefeciaryDetails from './benefeciaryDetails'
import { fetchUserProfile } from '../../providers/profile/profile.action';
import { hasLoggedIn } from '../../providers/auth/auth.actions';
import { dateDiff } from '../../../setup/helpers';

class TestDetails extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            test: 'self',
            benefeciaryDeails: false,
            addPatientDataPoPupEnable: false,
            patientDetailsObj: {},
            gender: 'M',
            full_name: '',
            age: '',
            refreshCount: 0,
            familyDetailsData: []

        }
        this.defaultPatDetails = {};
    }

    async componentDidMount() {
        await this.getPatientInfo();
    }


    getPatientInfo = async () => {
        try {
            const fields = "first_name,last_name,gender,dob,mobile_no,address,delivery_address"
            const userId = await AsyncStorage.getItem('userId');
            const patInfoResp = await fetchUserProfile(userId, fields);

            console.log('patInfoResp====>', patInfoResp)
            this.defaultPatDetails = {
                type: 'self',
                full_name: patInfoResp.first_name + ' ' + patInfoResp.last_name,
                gender: patInfoResp.gender,
                age: parseInt(dateDiff(patInfoResp.dob, new Date(), 'years')),
                phone_no:patInfoResp.mobile_no
            }
            this.setState({ refreshCount: this.state.refreshCount + 1 })

        }
        catch (Ex) {
            console.log('Ex is getting Get Patient Info in Payment preview page', Ex.message);
        }
    }

    addPatientList = async () => {
        const { name, age, gender } = this.state;
        if (!name || !age || !gender) {
            this.setState({ errMsg: '* Kindly fill all the fields' });
        }
        else {
            this.setState({ errMsg: '' })
            const othersDetailsObj = {
                type: 'others',
                full_name: name,
                age: parseInt(age),
                gender
            }
            let familyData = []
            familyData.push(othersDetailsObj)
            await this.setState({ 
                familyDetailsData: familyData, updateButton: false, addPatientDataPoPupEnable: false, refreshCount: this.state.refreshCount + 1,
                name: null, age: null, gender: null
            }); 
        }
    }
    patientDetails(data, index) {

        return (
            <View style={{ borderColor: 'gray', borderWidth: 0.3, padding: 10, borderRadius: 5, marginTop: 10 }}>
                <Row>
                    <Col>
                        <Text style={styles.NameText}>{data.full_name + (data.relation? ` (${data.relation})` : '') }</Text>
                    </Col>
                    <Col>
                        <Text style={styles.ageText}>{data.age} years</Text>
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Col size={3}>
                        <Row>
                            <Col size={5}>
                                <Text style={styles.commonText}>Gender - </Text>
                            </Col>
                            <Col size={5}>
                                <Text note style={styles.commonText}>{data.gender}</Text>
                            </Col>
                        </Row>
                    </Col>
                    <Col size={3.3}>
                        <Row>
                            <Col size={5}>
                                <Text style={styles.commonText}>Mobile - </Text>
                            </Col>
                            <Col size={5}>
                                <Text note style={styles.commonText}>{data.phone_no}</Text>
                            </Col>
                        </Row>
                    </Col>
                    <Col size={3.3}>
                        <Row style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            <TouchableOpacity style={styles.selectButton}>
                                <Text style={[styles.commonText, { color: '#fff' }]}>Select </Text>
                            </TouchableOpacity>
                        </Row>

                    </Col>
                </Row>
                {this.state.test === "family" || this.state.test === "self"?
                    <View>
                        <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.5, marginTop: 10 }} />
                        <TouchableOpacity style={styles.benefeciaryButton} onPress={() =>  this.setState({ expandedListIndex : this.state.expandedListIndex === index ? -1 : index })}>
                            <Text style={{ color: "#0054A5", fontSize: 12, fontFamily: 'OpenSans', }}>Show Benefeciary Details</Text>
                            <MaterialIcons name='keyboard-arrow-down' style={{ fontSize: 20, marginLeft: 5, color: "#0054A5", marginTop: 5 }} />
                        </TouchableOpacity>
                            <View>
                                <BenefeciaryDetails 
                                   expand={this.state.expandedListIndex === index}  
                                />
                            </View> 
                        
                    </View>
                    : null}
            </View>
        )
    }


    render() {
        const datas = {
            full_name: 'S.Mukesh Kannan(self)', age: 21, gender: "male", phone_no: 8921595872,
            familyData: [{ full_name: 'S.Ramesh', relation: 'Son', age: 4, gender: "male", phone_no: 8921595872 }, { full_name: 'S.Reshma', relation: 'Daughter', age: 4, gender: "female", phone_no: 8921595872 }]
        }
        const { addPatientDataPoPupEnable, patientDetailsObj, test, name, age, gender, familyDetailsData } = this.state
        return (


            <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 10 }}>
                <Text style={{ fontSize: 12, fontFamily: 'OpenSans', }}>For ,Whom do you need to take up the test? </Text>
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Radio
                            standardStyle={true}
                            selected={test === "self" ? true : false}
                            onPress={() => this.setState({ test: "self", patientDetailsObj: this.defaultPatDetails })} />
                        <Text style={[styles.commonText, { marginLeft: 5 }]}>Self</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 40, alignItems: 'center' }}>
                        <Radio
                            standardStyle={true}
                            selected={test === "family" ? true : false}
                            onPress={() => this.setState({ test: "family" })} />
                        <Text style={[styles.commonText, { marginLeft: 5 }]}>Family With Insurance</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 40, alignItems: 'center' }}>
                        <Radio
                            standardStyle={true}
                            selected={test === "other" ? true : false}
                            onPress={() => this.setState({ test: "other", addPatientDataPoPupEnable: true, patientDetailsObj: {} })} />
                        <Text style={[styles.commonText, { marginLeft: 5 }]}>Family W/O Insurance</Text>
                    </View>
                </View>


                <View style={{ marginTop: 10 }}>
                    {test === "self" ?
                        <View>
                            <Text style={{ fontSize: 12, fontFamily: 'OpenSans' }}>Patient Details</Text>

                            <View>
                                {this.patientDetails(this.defaultPatDetails)}

                            </View>

                        </View>
                        : null}
                </View>
                <View style={{ marginTop: 10 }}>
                    {test === "other" ?
                        <View>
                            <Text style={{ fontSize: 12, fontFamily: 'OpenSans' }}>Patient Details</Text>
                            <FlatList
                                data={familyDetailsData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) =>
                                    this.patientDetails(item)
                                } />
                            {test === 'other' ?
                                <View style={{ marginTop: 10, marginLeft: 8 }}>
                                    <Text style={{ fontSize: 12, fontFamily: 'OpenSans', color: '#7F49C3', textAlign: 'center', }}>(OR)</Text>
                                    <Text style={styles.subHead}>Add other patient's details</Text>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col size={6}>
                                            <Row>
                                                <Col size={2}>
                                                    <Text style={styles.nameAndAge}>Name</Text>
                                                </Col>
                                                <Col size={8} >
                                                    <Input placeholder="Enter patient's name" style={styles.inputText}
                                                        returnKeyType={'next'}
                                                        keyboardType={"default"}
                                                        value={name}
                                                        onChangeText={(name) => this.setState({ name })}
                                                        blurOnSubmit={false}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col size={4} style={{ marginLeft: 5 }}>
                                            <Row>
                                                <Col size={2}>
                                                    <Text style={styles.nameAndAge}>Age</Text>
                                                </Col>
                                                <Col size={7}>
                                                    <Input placeholder="Enter patient's age" style={styles.inputText}
                                                        returnKeyType={'done'}
                                                        keyboardType="numeric"
                                                        value={age}
                                                        onChangeText={(age) => this.setState({ age })}
                                                        blurOnSubmit={false}
                                                    />
                                                </Col>
                                                <Col size={1}>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <View style={{ marginTop: 10, borderBottomWidth: 0, flexDirection: 'row' }}>
                                        <Text style={{
                                            fontFamily: 'OpenSans', fontSize: 12, marginTop: 3
                                        }}>Gender</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={gender === "M" ? true : false}
                                                onPress={() => this.setState({ gender: "M" })} />
                                            <Text style={[styles.commonText, { marginLeft: 5 }]}>Male</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={gender === "F" ? true : false}
                                                onPress={() => this.setState({ gender: "F" })} />
                                            <Text style={[styles.commonText, { marginLeft: 5 }]}>Female</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={gender === "O" ? true : false}
                                                onPress={() => this.setState({ gender: "O" })} />
                                            <Text style={[styles.commonText, { marginLeft: 5 }]}>Others</Text>
                                        </View>
                                    </View>
                                    <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                                        <TouchableOpacity style={styles.touchStyle} onPress={() => this.addPatientList()} >
                                            <Text style={styles.touchText}>Add patient</Text>
                                        </TouchableOpacity>
                                    </Row>
                                </View>
                                : null}
                        </View>
                        : null}

                    <View style={{ marginTop: 10 }}>
                        {test === "family" ?
                            <View>
                                <Text style={{ fontSize: 12, fontFamily: 'OpenSans' }}>Patient Details</Text>
                                <FlatList
                                    data={datas.familyData}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item , index }) =>
                                        this.patientDetails(item, index)
                                    } />
                            </View>
                            : null
                        }
                    </View>

                </View>


            </View>



        )
    }

}


export default TestDetails


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#F5F5F5',
        marginTop: 10,

    },

    bodyContent: {

        backgroundColor: '#F5F5F5'

    },
    touchStyle: {
        backgroundColor: '#7F49C3',
        borderRadius: 3,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 5,
        paddingTop: 5
    },
    touchText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#fff',
        textAlign: 'center'
    },
    inputText: {
        backgroundColor: '#f2f2f2',
        color: '#000',
        fontSize: 10,
        height: 33,
    },
    nameAndAge: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        color: '#000',
        marginTop: 5
    },
    subHead: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#000',
        marginTop: 10
        // fontWeight: 'bold'
    },
    NameText: {
        fontSize: 10,
        fontFamily: 'OpenSans',
        color: '#7F49C3'
    },
    ageText: {
        fontSize: 10,
        fontFamily: 'OpenSans',
        textAlign: 'right'
    },
    commonText: {
        fontSize: 10,
        fontFamily: 'OpenSans'
    },
    selectButton: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 2,
        paddingBottom: 2,
        backgroundColor: '#8EC63F',
        borderRadius: 2
    },
    benefeciaryButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 5
    }

});