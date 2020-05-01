import React, { PureComponent } from 'react';

import {
    Container, Content, Text, View, Badge, Spinner, Toast, Radio, Form, CheckBox, Item, Picker, Icon
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity, Share, Platform } from 'react-native';
import { Button } from 'react-native-paper';
export const bloodGroupList = ['Select number', 'A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-']

class PrepareAppointmentWizard extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            firstQuestion: 0,
            radioButton: false,
            checkBoxClick: false

        }
    }

    render() {
        const disease = [{ disease: 'AIDS/HIV' }, { disease: 'Alcoholic' }, { disease: 'Allergies' }, { disease: 'Anemia' }, { disease: 'Anxiety' }, { disease: 'Arthritis' },
        { disease: 'Asthma' }, { disease: 'Back Problems/Pain' }, { disease: 'Bleeding Disorder' }, { disease: 'Blood Disease' }, { disease: 'Bone/Joint Disease' }, { disease: 'Cancer' },
        { disease: 'Depression' }, { disease: 'Diabetes' }, { disease: 'Ear Problem' }, { disease: 'Eating Disorder' }, { disease: 'Alcoholic' }]
        const allergic = [{ disease: 'Adhesive Tape' }, { disease: 'Antibiotics' }, { disease: 'Aspirin' }, { disease: 'Barbituates' }, { disease: 'Codeine' }, { disease: 'Lodine' }, { disease: 'Latex' }, { disease: 'Local Anesthetics' }, { disease: 'Sulfa' }, { disease: 'Non of the above' }, { disease: 'Not sure' }]
        const hospitalizedFor = [{ condition: 'Blood Transfusion' }, { condition: 'None of the above' }, { condition: 'Not sure' }]
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                    {
                        this.state.firstQuestion == 0 ?
                            <View style={styles.mainView}>
                                <View>
                                    <View style={styles.centerContent}>
                                        <Image source={require('../../../../assets/images/formpaper.png')} style={{ height: 200, width: 200, }} />

                                    </View>
                                    <Text style={styles.textContent}>No more paper forms!</Text>
                                    <Text style={styles.subText1}>Check in online and your information will be send directly to the Medflic</Text>
                                </View>
                                <View style={[styles.centerContent, { marginTop: 50 }]}>
                                    <TouchableOpacity style={styles.touchStyle} onPress={() => this.setState({ firstQuestion: 1 })}>
                                        <Text style={styles.touchText}>I Agree,Start check-in</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : null}

                    {
                        this.state.firstQuestion == 1 ?

                            <View style={{ flex: 1 }}>

                                <Text style={styles.subHead}>Have you ever visited Dr.Balasubramanian before?</Text>
                                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                                    <Radio
                                        standardStyle={true}
                                        selected={this.state.radioButton}
                                        onPress={() => this.setState({ radioButton: true })} />
                                    <Text style={styles.innersubTexts}>Yes,I've seen this doctor before</Text>
                                </View>
                                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15 }}>
                                    <Radio
                                        standardStyle={true}
                                        selected={this.state.radioButton}
                                        onPress={() => this.setState({ radioButton: true })} />
                                    <Text style={styles.innersubTexts}>No.I'm a new patient</Text>
                                </View>


                                <View style={{ flexDirection: 'row', marginTop: 200, height: 38 }}>
                                    <View style={{ width: '40%', }}>
                                        <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
                                            <Text style={styles.touchText}>Skip</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: '60%', marginLeft: 5 }}>
                                        <TouchableOpacity style={styles.saveButton} onPress={() => this.setState({ firstQuestion: 2 })}>
                                            <Text style={styles.touchText}>Save and continue</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>


                            </View>
                            :
                            null

                    }


                    {
                        this.state.firstQuestion == 2 ?
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.subHead, { textAlign: 'center' }]}>Reason for vist</Text>
                                <View style={{ marginTop: 20 }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Why are you booking this appointment ?</Text>
                                    <Form style={styles.formText}>
                                        <TextInput
                                            placeholder="Enter reason"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />
                                    </Form>
                                </View>
                                <View style={{ marginTop: 20 }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15 }}>Do you have any other concerns you would like to address ?</Text>
                                    <Form style={{
                                        borderColor: '#909090',
                                        borderWidth: 0.5, height: 80, borderRadius: 5, marginTop: 10,
                                    }}>
                                        <TextInput
                                            placeholder="Enter reason"
                                            style={Platform == "ios" ? styles.bigTextInput : styles.textInputAndroid}

                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />
                                    </Form>
                                </View>
                                <View style={{ marginTop: 20 }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15 }}>How is your general health?</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                        <Col size={5} style={{ flexDirection: 'row' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={this.state.radioButton}
                                                onPress={() => this.setState({ radioButton: true })} />
                                            <Text style={[styles.innersubTexts, { color: '#909090' }]}>Excellent</Text>
                                        </Col>
                                        <Col size={5} style={{ flexDirection: 'row' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={this.state.radioButton}
                                                onPress={() => this.setState({ radioButton: true })} />
                                            <Text style={[styles.innersubTexts, { color: '#909090' }]}>Good</Text>
                                        </Col>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                        <Col size={5} style={{ flexDirection: 'row' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={this.state.radioButton}
                                                onPress={() => this.setState({ radioButton: true })} />
                                            <Text style={[styles.innersubTexts, { color: '#909090' }]}>Fair</Text>
                                        </Col>
                                        <Col size={5} style={{ flexDirection: 'row' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={this.state.radioButton}
                                                onPress={() => this.setState({ radioButton: true })} />
                                            <Text style={[styles.innersubTexts, { color: '#909090' }]}>Poor</Text>
                                        </Col>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 200, height: 38 }}>
                                    <View style={{ width: '40%', }}>
                                        <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
                                            <Text style={styles.touchText}>Skip</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: '60%', marginLeft: 5 }}>
                                        <TouchableOpacity style={styles.saveButton} onPress={() => this.setState({ firstQuestion: 3 })}>
                                            <Text style={styles.touchText}>Save and continue</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            : null}

                    {
                        this.state.firstQuestion == 3 ?
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.subHead, { textAlign: 'center' }]}>Primary care physician information</Text>

                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Name</Text>
                                    <Form style={styles.formStyle2}>
                                        <TextInput
                                            placeholder="Enter physician name"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />
                                    </Form>
                                </View>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Hospital name</Text>
                                    <Form style={styles.formStyle2}>
                                        <TextInput
                                            placeholder="Enter hospital name"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />
                                    </Form>
                                </View>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Contact number</Text>
                                    <Form style={styles.formStyle2}>
                                        <TextInput
                                            placeholder="Enter contact number"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />
                                    </Form>
                                </View>




                                <View style={{ flexDirection: 'row', marginTop: 200, height: 38 }}>
                                    <View style={{ width: '40%', }}>
                                        <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
                                            <Text style={styles.touchText}>Skip</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: '60%', marginLeft: 5 }}>
                                        <TouchableOpacity style={styles.saveButton} onPress={() => this.setState({ firstQuestion: 4 })}>
                                            <Text style={styles.touchText}>Save and continue</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            :
                            null}

                    {
                        this.state.firstQuestion == 4 ?
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.subHead, { textAlign: 'center' }]}>Past Conditions</Text>
                                <Text style={{ fontFamily: "OpenSans", fontSize: 15, marginTop: 10 }}>Have you ever had any of these conditions?</Text>
                                <FlatList
                                    data={disease}
                                    renderItem={({ item, index }) => (
                                        <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15 }}>
                                            <CheckBox style={{ borderRadius: 5, marginLeft: -10 }}

                                                checked={this.state.checkBoxClick}


                                                onPress={() => { this.setState({ checkBoxClick: true }); }}

                                            />
                                            <Text style={styles.flatlistText}>{item.disease}</Text>
                                        </View>
                                    )} />
                                <View style={{ flexDirection: 'row', height: 38, marginTop: 20 }}>
                                    <View style={{ width: '40%', }}>
                                        <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
                                            <Text style={styles.touchText}>Skip</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: '60%', marginLeft: 5 }}>
                                        <TouchableOpacity style={styles.saveButton} onPress={() => this.setState({ firstQuestion: 5 })}>
                                            <Text style={styles.touchText}>Save and continue</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            : null
                    }


                    {
                        this.state.firstQuestion == 5 ?
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.subHead, { textAlign: 'center' }]}>Personal Information</Text>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Name</Text>
                                    <Form style={styles.formStyle5}>
                                        <TextInput
                                            placeholder="Enter your name"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />
                                    </Form>
                                </View>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Date of birth</Text>
                                    <Form style={styles.formStyle2}>
                                        <TextInput
                                            placeholder="Enter your date of birth"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />
                                    </Form>
                                </View>

                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Sex</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                        <Col style={{ flexDirection: 'row' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={this.state.radioButton}
                                                onPress={() => this.setState({ radioButton: true })} />
                                            <Text style={[styles.innersubTexts, { color: '#909090' }]}>Male</Text>
                                        </Col>
                                        <Col style={{ flexDirection: 'row' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={this.state.radioButton}
                                                onPress={() => this.setState({ radioButton: true })} />
                                            <Text style={[styles.innersubTexts, { color: '#909090' }]}>Female</Text>
                                        </Col>
                                        <Col style={{ flexDirection: 'row' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={this.state.radioButton}
                                                onPress={() => this.setState({ radioButton: true })} />
                                            <Text style={[styles.innersubTexts, { color: '#909090' }]}>Other</Text>
                                        </Col>
                                    </View>
                                </View>

                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Martial status</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                        <Col style={{ flexDirection: 'row' }} size={6}>
                                            <Col style={{ flexDirection: 'row' }}>
                                                <Radio
                                                    standardStyle={true}
                                                    selected={this.state.radioButton}
                                                    onPress={() => this.setState({ radioButton: true })} />
                                                <Text style={[styles.innersubTexts, { color: '#909090' }]}>Married</Text>
                                            </Col>
                                            <Col style={{ flexDirection: 'row' }}>
                                                <Radio
                                                    standardStyle={true}
                                                    selected={this.state.radioButton}
                                                    onPress={() => this.setState({ radioButton: true })} />
                                                <Text style={[styles.innersubTexts, { color: '#909090' }]}>Unmarried</Text>
                                            </Col>
                                        </Col>
                                        <Col size={4}>
                                        </Col>
                                    </View>
                                </View>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Blood group</Text>


                                    <Form style={styles.formStyle6}>
                                        <Picker style={styles.userDetailLabel}
                                            mode="dropdown"
                                            placeholder='Select your blood group'
                                            placeholderStyle={{ fontSize: 12, marginLeft: -5 }}
                                            iosIcon={<Icon name="ios-arrow-down" style={{ color: 'gray', fontSize: 20, marginLeft: 170 }} />}
                                            textStyle={{ color: "gray", left: 0, fontSize: 12, marginLeft: -5 }}
                                            note={false}
                                            itemStyle={{
                                                paddingLeft: 10,
                                                fontSize: 16,
                                                fontSize: 12,
                                            }}
                                            itemTextStyle={{ color: '#5cb85c', fontSize: 12, }}
                                            style={{ width: undefined }}
                                        // onValueChange={(sample) => { this.setState({ selectedBloodGroup: sample }) }}
                                        // selectedValue={selectedBloodGroup}
                                        // testID="editBloodGroup"
                                        >
                                            {bloodGroupList.map((value, key) => {
                                                return <Picker.Item label={String(value)} value={String(value)} key={key}
                                                />
                                            })
                                            }
                                        </Picker>

                                    </Form>







                                </View>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Mobile number</Text>
                                    <Form style={styles.formStyle5}>
                                        <TextInput
                                            placeholder="Enter your mobile number"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />
                                    </Form>
                                </View>
                                <View style={{ flexDirection: 'row', height: 38, marginTop: 20 }}>
                                    <View style={{ width: '40%', }}>
                                        <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
                                            <Text style={styles.touchText}>Skip</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: '60%', marginLeft: 5 }}>
                                        <TouchableOpacity style={styles.saveButton} onPress={() => this.setState({ firstQuestion: 6 })}>
                                            <Text style={styles.touchText}>Save and continue</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                            : null
                    }


                    {
                        this.state.firstQuestion == 6 ?
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.subHead, { textAlign: 'center' }]}>Allergies and Medications</Text>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Do you have any allergies?</Text>
                                    <Row style={{ marginTop: 15 }}>
                                        <Col size={5}>
                                            <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Name</Text>

                                        </Col>
                                        <Col size={5}>
                                            <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Reaction</Text>

                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 5 }}>
                                        <Col size={5} style={{
                                        }}>
                                            <Form style={styles.formStyle7}>
                                                <TextInput
                                                    placeholder="Enter  name"
                                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />

                                            </Form>
                                        </Col>
                                        <Col size={5} style={{
                                        }}>
                                            <Form style={styles.formStyle8}>
                                                <TextInput
                                                    placeholder="Enter reaction"
                                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row style={{}}>
                                        <Col size={5} style={{}}>

                                            <Form style={styles.formStyle4}>
                                                <TextInput
                                                    placeholder="Enter  name"
                                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />

                                            </Form>
                                        </Col>
                                        <Col size={5} style={{}}>
                                            <Form style={[styles.formStyle3, { justifyContent: 'center' }]}>
                                                <TextInput
                                                    placeholder="Enter reaction"
                                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />
                                            </Form>
                                        </Col>
                                    </Row>

                                </View>


                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>What medicines are you currently taking ?</Text>
                                    <Row style={{ marginTop: 15 }}>
                                        <Col size={5}>
                                            <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Name</Text>

                                        </Col>
                                        <Col size={5}>
                                            <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Dosage</Text>

                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 5 }}>
                                        <Col size={5} style={{
                                        }}>
                                            <Form style={styles.formStyle7}>
                                                <TextInput
                                                    placeholder="Enter medicine name"
                                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />

                                            </Form>
                                        </Col>
                                        <Col size={5} style={{
                                        }}>
                                            <Form style={styles.formStyle8}>
                                                <TextInput
                                                    placeholder="Enter dosage"
                                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row style={{}}>
                                        <Col size={5} style={{}}>

                                            <Form style={styles.formStyle4}>
                                                <TextInput
                                                    placeholder="Enter medicine name"
                                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />

                                            </Form>
                                        </Col>
                                        <Col size={5} style={{}}>
                                            <Form style={[styles.formStyle3, { justifyContent: 'center' }]}>
                                                <TextInput
                                                    placeholder="Enter dosage"
                                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />
                                            </Form>
                                        </Col>
                                    </Row>

                                </View>

                                <View style={{ flexDirection: 'row', height: 38, marginTop: 50 }}>
                                    <View style={{ width: '40%', }}>
                                        <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
                                            <Text style={styles.touchText}>Skip</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: '60%', marginLeft: 5 }}>
                                        <TouchableOpacity style={styles.saveButton} onPress={() => this.setState({ firstQuestion: 7 })}>
                                            <Text style={styles.touchText}>Save and continue</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>


                            </View>
                            :
                            null}

                    {
                        this.state.firstQuestion == 7 ?
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.subHead, { textAlign: 'center' }]}>Family conditions</Text>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Please list any medical conditions in your family</Text>
                                    <Row style={{ marginTop: 15 }}>
                                        <Col size={5}>
                                            <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Name</Text>

                                        </Col>
                                        <Col size={5}>
                                            <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Who?</Text>

                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 5 }}>
                                        <Col size={5} style={{
                                        }}>
                                            <Form style={styles.formStyle7}>
                                                <TextInput
                                                    placeholder="Enter  name"
                                                    style={Platform === "ios" ? { fontSize: 12, borderRadius: 5, paddingLeft: 2, paddingTop: 10, } : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />

                                            </Form>
                                        </Col>
                                        <Col size={5} style={{
                                        }}>
                                            <Form style={styles.formStyle8}>
                                                <TextInput
                                                    placeholder="Enter who?"
                                                    style={Platform === "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row style={{}}>
                                        <Col size={5} style={{}}>

                                            <Form style={styles.formStyle4}>
                                                <TextInput
                                                    placeholder="Enter  name"
                                                    style={Platform === "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />

                                            </Form>
                                        </Col>
                                        <Col size={5} style={{}}>
                                            <Form style={styles.formStyle8}>
                                                <TextInput
                                                    placeholder="Enter who?"
                                                    style={Platform === "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row style={{}}>
                                        <Col size={5} style={{}}>

                                            <Form style={styles.formStyle4}>
                                                <TextInput
                                                    placeholder="Enter  name"
                                                    style={Platform === "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />

                                            </Form>
                                        </Col>
                                        <Col size={5} style={{}}>
                                            <Form style={styles.formStyle8}>
                                                <TextInput
                                                    placeholder="Enter who?"
                                                    style={Platform === "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row style={{}}>
                                        <Col size={5} style={{}}>

                                            <Form style={styles.formStyle4}>
                                                <TextInput
                                                    placeholder="Enter  name"
                                                    style={Platform === "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />

                                            </Form>
                                        </Col>
                                        <Col size={5} style={{}}>
                                            <Form style={styles.formStyle8}>
                                                <TextInput
                                                    placeholder="Enter who?"
                                                    style={Platform === "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />
                                            </Form>
                                        </Col>
                                    </Row>
                                </View>
                                <View style={{ flexDirection: 'row', height: 38, marginTop: 100 }}>
                                    <View style={{ width: '40%', }}>
                                        <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
                                            <Text style={styles.touchText}>Skip</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: '60%', marginLeft: 5 }}>
                                        <TouchableOpacity style={styles.saveButton} onPress={() => this.setState({ firstQuestion: 8 })}>
                                            <Text style={styles.touchText}>Save and continue</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                            : null}



                    {
                        this.state.firstQuestion == 8 ?
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.subHead, { textAlign: 'center' }]}>Allergies and Medications</Text>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Are you allergic to any of the following?</Text>
                                    <FlatList
                                        data={allergic}
                                        renderItem={({ item, index }) => (
                                            <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15 }}>
                                                <CheckBox style={{ borderRadius: 5, marginLeft: -10 }}

                                                    checked={this.state.checkBoxClick}


                                                    onPress={() => { this.setState({ checkBoxClick: true }); }}

                                                />
                                                <Text style={styles.flatlistText}>{item.disease}</Text>
                                            </View>
                                        )} />
                                </View>
                                <View style={{ flexDirection: 'row', height: 38, marginTop: 20 }}>
                                    <View style={{ width: '40%', }}>
                                        <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
                                            <Text style={styles.touchText}>Skip</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: '60%', marginLeft: 5 }}>
                                        <TouchableOpacity style={styles.saveButton} onPress={() => this.setState({ firstQuestion: 9 })}>
                                            <Text style={styles.touchText}>Save and continue</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            : null
                    }


                    {
                        this.state.firstQuestion == 9 ?
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.subHead, { textAlign: 'center' }]}>hospitalization and Surgeries</Text>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Have you ever had any of the folloing procedures?</Text>
                                    <FlatList
                                        data={hospitalizedFor}
                                        renderItem={({ item, index }) => (
                                            <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15 }}>
                                                <CheckBox style={{ borderRadius: 5, marginLeft: -10 }}

                                                    checked={this.state.checkBoxClick}


                                                    onPress={() => { this.setState({ checkBoxClick: true }); }}

                                                />
                                                <Text style={styles.flatlistText}>{item.condition}</Text>
                                            </View>
                                        )} />
                                </View>

                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Have you ever been hospitalized ?</Text>
                                    <Row style={{ marginTop: 15 }}>
                                        <Col size={5}>
                                            <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Reason</Text>

                                        </Col>
                                        <Col size={5}>
                                            <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Date</Text>

                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 5 }}>
                                        <Col size={5} style={{
                                        }}>
                                            <Form style={styles.formStyle7}>
                                                <TextInput
                                                    placeholder="Enter reason"
                                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />

                                            </Form>
                                        </Col>
                                        <Col size={5} style={{
                                        }}>
                                            <Form style={styles.formStyle8}>
                                                <TextInput
                                                    placeholder="Enter date"
                                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row style={{}}>
                                        <Col size={5} style={{}}>

                                            <Form style={styles.formStyle4}>
                                                <TextInput
                                                    placeholder="Enter reason"
                                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />

                                            </Form>
                                        </Col>
                                        <Col size={5} style={{}}>
                                            <Form style={[styles.formStyle3, { justifyContent: 'center' }]}>
                                                <TextInput
                                                    placeholder="Enter date"
                                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                    placeholderTextColor="#C1C1C1"
                                                    keyboardType={'default'}
                                                    returnKeyType={'go'}
                                                />
                                            </Form>
                                        </Col>
                                    </Row>

                                </View>

                                <View style={{ flexDirection: 'row', height: 38, marginTop: 50 }}>
                                    <View style={{ width: '40%', }}>
                                        <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
                                            <Text style={styles.touchText}>Skip</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: '60%', marginLeft: 5 }}>
                                        <TouchableOpacity style={styles.saveButton} onPress={() => this.setState({ firstQuestion: 10 })}>
                                            <Text style={styles.touchText}>Save and continue</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>



                            </View>
                            : null
                    }


                    {
                        this.state.firstQuestion == 10 ?
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.subHead, { textAlign: 'center' }]}>Social history</Text>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Are you sexually active?</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                        <Col style={{ flexDirection: 'row' }} size={5}>
                                            <Col style={{ flexDirection: 'row' }}>
                                                <Radio
                                                    standardStyle={true}
                                                    selected={this.state.radioButton}
                                                    onPress={() => this.setState({ radioButton: true })} />
                                                <Text style={styles.radioText1}>Yes</Text>
                                            </Col>
                                            <Col style={{ flexDirection: 'row' }}>
                                                <Radio
                                                    standardStyle={true}
                                                    selected={this.state.radioButton}
                                                    onPress={() => this.setState({ radioButton: true })} />
                                                <Text style={styles.radioText1}>No</Text>
                                            </Col>
                                        </Col>
                                        <Col size={5}>
                                        </Col>
                                    </View>

                                </View>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Do you drink alcohol?</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                        <Col style={{ flexDirection: 'row' }} size={5}>
                                            <Col style={{ flexDirection: 'row' }}>
                                                <Radio
                                                    standardStyle={true}
                                                    selected={this.state.radioButton}
                                                    onPress={() => this.setState({ radioButton: true })} />
                                                <Text style={styles.radioText1}>Yes</Text>
                                            </Col>
                                            <Col style={{ flexDirection: 'row' }}>
                                                <Radio
                                                    standardStyle={true}
                                                    selected={this.state.radioButton}
                                                    onPress={() => this.setState({ radioButton: true })} />
                                                <Text style={styles.radioText1}>No</Text>
                                            </Col>
                                        </Col>
                                        <Col size={5}>
                                        </Col>
                                    </View>

                                </View>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Do you smoke ?</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                        <Col style={{ flexDirection: 'row' }} size={5}>
                                            <Col style={{ flexDirection: 'row' }}>
                                                <Radio
                                                    standardStyle={true}
                                                    selected={this.state.radioButton}
                                                    onPress={() => this.setState({ radioButton: true })} />
                                                <Text style={styles.radioText1}>Yes</Text>
                                            </Col>
                                            <Col style={{ flexDirection: 'row' }}>
                                                <Radio
                                                    standardStyle={true}
                                                    selected={this.state.radioButton}
                                                    onPress={() => this.setState({ radioButton: true })} />
                                                <Text style={styles.radioText1}>No</Text>
                                            </Col>
                                        </Col>
                                        <Col size={5}>
                                        </Col>
                                    </View>

                                </View>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Do you use recreational drugs?</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                        <Col style={{ flexDirection: 'row' }} size={5}>
                                            <Col style={{ flexDirection: 'row' }}>
                                                <Radio
                                                    standardStyle={true}
                                                    selected={this.state.radioButton}
                                                    onPress={() => this.setState({ radioButton: true })} />
                                                <Text style={styles.radioText1}>Yes</Text>
                                            </Col>
                                            <Col style={{ flexDirection: 'row' }}>
                                                <Radio
                                                    standardStyle={true}
                                                    selected={this.state.radioButton}
                                                    onPress={() => this.setState({ radioButton: true })} />
                                                <Text style={styles.radioText1}>No</Text>
                                            </Col>
                                        </Col>
                                        <Col size={5}>
                                        </Col>
                                    </View>

                                </View>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>How many caffinated drinks do you have per day?</Text>
                                    <Form style={styles.formStyle6}>
                                        <Picker style={styles.userDetailLabel}
                                            mode="dropdown"
                                            placeholder='Select number'
                                            placeholderStyle={{ fontSize: 12, marginLeft: -5 }}
                                            iosIcon={<Icon name="ios-arrow-down" style={{ color: 'gray', fontSize: 20, marginLeft: 170 }} />}
                                            textStyle={{ color: "gray", left: 0, fontSize: 12, marginLeft: -5 }}
                                            note={false}
                                            itemStyle={{
                                                paddingLeft: 10,
                                                fontSize: 16,
                                                fontSize: 12,
                                            }}
                                            itemTextStyle={{ color: '#5cb85c', fontSize: 12, }}
                                            style={{ width: undefined }}
                                        // onValueChange={(sample) => { this.setState({ selectedBloodGroup: sample }) }}
                                        // selectedValue={selectedBloodGroup}
                                        // testID="editBloodGroup"
                                        >
                                            {bloodGroupList.map((value, key) => {
                                                return <Picker.Item label={String(value)} value={String(value)} key={key}
                                                />
                                            })
                                            }
                                        </Picker>

                                    </Form>
                                </View>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Have anyone in your home ever physically or verbally hurt you?</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                        <Col style={{ flexDirection: 'row' }} size={5}>
                                            <Col style={{ flexDirection: 'row' }}>
                                                <Radio
                                                    standardStyle={true}
                                                    selected={this.state.radioButton}
                                                    onPress={() => this.setState({ radioButton: true })} />
                                                <Text style={styles.radioText1}>Yes</Text>
                                            </Col>
                                            <Col style={{ flexDirection: 'row' }}>
                                                <Radio
                                                    standardStyle={true}
                                                    selected={this.state.radioButton}
                                                    onPress={() => this.setState({ radioButton: true })} />
                                                <Text style={styles.radioText1}>No</Text>
                                            </Col>
                                        </Col>
                                        <Col size={5}>
                                        </Col>
                                    </View>

                                </View>
                                <View style={{ marginTop: 20, width: '100%', }}>

                                    <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Do you exercise ?</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                        <Col style={{ flexDirection: 'row' }} size={5}>
                                            <Col style={{ flexDirection: 'row' }}>
                                                <Radio
                                                    standardStyle={true}
                                                    selected={this.state.radioButton}
                                                    onPress={() => this.setState({ radioButton: true })} />
                                                <Text style={styles.radioText1}>Yes</Text>
                                            </Col>
                                            <Col style={{ flexDirection: 'row' }}>
                                                <Radio
                                                    standardStyle={true}
                                                    selected={this.state.radioButton}
                                                    onPress={() => this.setState({ radioButton: true })} />
                                                <Text style={styles.radioText1}>No</Text>
                                            </Col>
                                        </Col>
                                        <Col size={5}>
                                        </Col>
                                    </View>

                                </View>
                                <View style={{ flexDirection: 'row', height: 38, marginTop: 15 }}>
                                    <View style={{ width: '40%', }}>
                                        <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
                                            <Text style={styles.touchText}>Skip</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: '60%', marginLeft: 5 }}>
                                        <TouchableOpacity style={styles.saveButton} onPress={() => this.setState({ firstQuestion: 11 })}>
                                            <Text style={styles.touchText}>Save and continue</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            : null
                    }
                    {
                        this.state.firstQuestion == 11 ?
                            <View style={styles.mainView}>
                                <View>
                                    <View style={styles.centerContent}>
                                        <Image source={require('../../../../assets/images/FormComplete.png')} style={{ height: 200, width: 200, }} />

                                    </View>
                                    <Text style={styles.textContent}>Last Step!</Text>
                                    <Text style={[styles.subText1, { lineHeight: 22 }]}>Confirm your information below,and then we'll send all your forms to your doctor</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
                                    <CheckBox style={{ borderRadius: 5, marginLeft: -10, }}

                                        checked={this.state.checkBoxClick}


                                        onPress={() => { this.setState({ checkBoxClick: true }); }}

                                    />
                                    <Text style={[styles.flatlistText, { color: '#4c4c4c', lineHeight: 20 }]}>I verify that the information presented here is accurate,and i autorize Medflic to sen this
                                            information to my healthcare provider.</Text>
                                </View>

                                <View style={[styles.centerContent, { marginTop: 50 }]}>
                                    <TouchableOpacity style={styles.touchStyle} onPress={() => this.setState({ firstQuestion: 1 })}>
                                        <Text style={styles.touchText}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : null}
                </Content>
            </Container>
        )
    }
}


export default PrepareAppointmentWizard
const styles = StyleSheet.create({
    container: {

    },
    touchStyle: {
        backgroundColor: '#8EC63F',
        borderRadius: 1,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 10,
        paddingTop: 10,
        justifyContent: 'center',

    },
    touchText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    userDetailLabel: {
        // backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        fontFamily: 'OpenSans',
        fontSize: 15,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 8,

    },
    content: {
        padding: 30,
    },

    mainView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContent: {
        color: '#7F49C3',
        fontSize: 22,
        fontFamily: "OpenSans",
        fontWeight: '700',
        textAlign: 'center'
    },
    subText1: {
        fontFamily: "OpenSans",
        textAlign: 'center',
        marginTop: 10,
        fontSize: 15
    },
    subHead: {
        color: '#000',
        fontSize: 16,
        fontFamily: "OpenSans",
        fontWeight: '700',
    },
    innersubTexts: {
        fontFamily: "OpenSans",
        fontSize: 15,
        marginLeft: 10
    },
    skipButton: {
        backgroundColor: '#4E85E9',
        paddingBottom: 10,
        paddingTop: 10,
    },
    saveButton: {
        backgroundColor: '#8EC63F',
        paddingBottom: 10,
        paddingTop: 10
    },
    formText: {
        borderColor: '#909090',
        borderWidth: 0.5,
        height: 35,
        borderRadius: 5,
        marginTop: 10,
        justifyContent: 'center'
    },
    textInputStyle: {
        fontSize: 12,
        borderRadius: 5,
        paddingLeft: 2,
        marginTop: 8
    },
    textInputAndroid: {
        fontSize: 12,
        borderRadius: 5,
        paddingLeft: 2
    },
    bigTextInput: {
        fontSize: 12,
        borderRadius: 5,
        paddingLeft: 2,
        textAlignVertical: 'top',
        marginTop: 8,
    },
    formStyle2: {
        borderColor: '#909090',
        borderWidth: 0.5,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        height: 35,
        justifyContent: 'center'
    },
    flatlistText: {
        fontFamily: "OpenSans",
        fontSize: 12,
        marginLeft: 20
    },
    formStyle3: {
        width: '100%',
        height: 35,
        borderBottomColor: '#909090',
        borderBottomWidth: 0.5,
        borderRightColor: '#909090',
        borderRightWidth: 0.5
    },
    formStyle4: {
        width: '100%',
        height: 35,
        borderLeftColor: '#909090',
        borderLeftWidth: 0.5,
        borderBottomColor: '#909090',
        borderBottomWidth: 0.5,
        borderRightColor: '#909090',
        borderRightWidth: 0.5,
        justifyContent: 'center'
    },
    formStyle5: {
        borderColor: '#909090',
        borderWidth: 0.5,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        height: 35,
        justifyContent: 'center'
    },
    formStyle6: {
        borderColor: '#909090',
        borderWidth: 0.5,
        height: 35,
        marginTop: 10,
        justifyContent: 'center',
        borderRadius: 5
    },
    formStyle7: {
        width: '100%',
        height: 35,
        borderLeftColor: '#909090',
        borderLeftWidth: 0.5,
        borderTopColor: '#909090',
        borderTopWidth: 0.5,
        borderBottomColor: '#909090',
        borderBottomWidth: 0.5,
        borderRightColor: '#909090',
        borderRightWidth: 0.5,
        justifyContent: 'center'
    },
    formStyle8: {
        width: '100%',
        height: 35,
        borderTopColor: '#909090',
        borderTopWidth: 0.5,
        borderBottomColor: '#909090',
        borderBottomWidth: 0.5,
        borderRightColor: '#909090',
        borderRightWidth: 0.5,
        justifyContent: 'center'
    },
    radioText1: {
        fontFamily: "OpenSans",
        fontSize: 12,
        marginLeft: 10,
        color: '#909090'
    }
});
