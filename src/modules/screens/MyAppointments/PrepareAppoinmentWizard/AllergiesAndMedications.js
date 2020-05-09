import React, { PureComponent } from 'react';
import {
    Container, Content, Text, View, Badge, Toast, Radio, Form, CheckBox, Item, Picker, Icon
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity, Share, Platform } from 'react-native';
import Spinner from '../../../../components/Spinner';
import { userFiledsUpdate } from '../../../providers/auth/auth.actions';
import { connect } from 'react-redux';
import { prepareAppointmentUpdate, } from '../../../providers/bookappointment/bookappointment.action'
import styles from '../styles'

class AllergiesAndMedications extends PureComponent {
    constructor(props) {
        super(props)
        const { profile: { having_any_allergies, taking_medications } } = this.props

        this.state = {
            radioButton: false,
            checkBoxClick: false,
            isLoading: false,
            allergy_name: [],
            allergy_reaction: [],
            medicine_name: [],
            medicine_dosage: [],
            allergy_as_string: '',
            allergy_reaction_string: '',
            refreshCount: 1,
            appointmentId: props.navigation.getParam('AppointmentId'),
            alergicDetails: having_any_allergies,
            medicineTakingDetails: taking_medications

        }
    }
    skippingButton = async () => {
        try {
            const { appointmentId } = this.state

            let data = {
                has_skip_allergies_and_Medications: false
            }
            let result = await prepareAppointmentUpdate(appointmentId, data);
            if (result.success) {
                Toast.show({
                    text: result.message,
                    type: "success",
                    duration: 3000,
                })
            }

        }
        catch (e) {
            console.error(e);
        }
    }
    addAllergiesAndMedications = async () => {
        try {
            const { appointmentId, alergicDetails, medicineTakingDetails } = this.state
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                having_any_allergies: alergicDetails,
                taking_medications: medicineTakingDetails
            }

            this.setState({ isLoading: true })
            let response = await userFiledsUpdate(userId, data)

            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })
                this.skippingButton();
                this.props.navigation.navigate('FamilyMedicalConditions', { AppointmentId: appointmentId });
            }
        }
        catch (e) {
            console.log(e)
        }
        finally {
            this.setState({ isLoading: false })
        }
    }
    onAddNewAlergics = async () => {
        const { alergicDetails, refreshCount } = this.state;

        alergicDetails.push({
            allergy_name: null,
            allergy_reaction: null
        });
        await this.setState({ alergicDetails, refreshCount: refreshCount + 1 })

    }
    deleteTable(index) {
        const { alergicDetails } = this.state;
        alergicDetails.splice(index, 1)
        this.setState({ alergicDetails, refreshCount: this.state.refreshCount + 1 })


    }
    onAddNewMedicineInfo = async () => {
        const { medicineTakingDetails, refreshCount } = this.state;

        medicineTakingDetails.push({
            medicine_name: null,
            medicine_dosage: null
        });
        await this.setState({ medicineTakingDetails, refreshCount: refreshCount + 1 })
    }
    deleteTableMedicineInfo(index) {
        const { medicineTakingDetails } = this.state;
        medicineTakingDetails.splice(index, 1)
        this.setState({ refreshCount: this.state.refreshCount + 1 })
    }
    render() {
        const { alergicDetails, medicineTakingDetails } = this.state

        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                    <Spinner
                        color='blue'
                        visible={this.state.isLoading}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.subHead, { textAlign: 'center' }]}>Allergies and Medications</Text>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Do you have any allergies?</Text>
                            <Row style={{ marginTop: 15, paddingBottom: 10 }}>
                                <Col size={5}>
                                    <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Name</Text>

                                </Col>
                                <Col size={5}>
                                    <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Reaction</Text>

                                </Col>
                            </Row>
                            <View>
                                <Form>
                                    <FlatList
                                        style={{ flex: 1 }}
                                        data={alergicDetails}
                                        extraData={alergicDetails}
                                        renderItem={({ item, index }) => {
                                            return (

                                                <Row >
                                                    <Col size={4.5} style={styles.formStyle7} >
                                                        <TextInput
                                                            placeholder="Enter  name"
                                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                            placeholderTextColor="#C1C1C1"
                                                            keyboardType={'default'}
                                                            returnKeyType={'go'}
                                                            onChangeText={text => {
                                                                let alergicDetailsTemp = alergicDetails;

                                                                alergicDetailsTemp[index].allergy_name = text;
                                                                this.setState({
                                                                    alergicDetails: alergicDetailsTemp,
                                                                });
                                                            }}
                                                            value={item.allergy_name}
                                                        />
                                                    </Col>


                                                    <Col size={4.5} style={styles.formStyle7}>
                                                        <TextInput
                                                            placeholder="Enter  allergy_reaction"
                                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                            placeholderTextColor="#C1C1C1"
                                                            keyboardType={'default'}
                                                            returnKeyType={'go'}
                                                            onChangeText={text => {
                                                                let alergicDetailsTemp = alergicDetails;
                                                                alergicDetailsTemp[index].allergy_reaction = text;
                                                                this.setState({
                                                                    alergicDetails: alergicDetailsTemp,
                                                                });
                                                            }}
                                                            value={item.allergy_reaction}
                                                        />

                                                    </Col>
                                                    <Col size={1} style={{ justifyContent: 'center' }}>
                                                        <TouchableOpacity onPress={() => this.deleteTable(index)}
                                                            style={{ backgroundColor: 'red', borderRadius: 5 / 2, paddingLeft: 1, paddingRight: 1, paddingTop: 1, paddingBottom: 1, flexDirection: 'row', justifyContent: 'center', marginLeft: 5 }}>
                                                            <Icon name="md-close" style={{ fontSize: 15, color: '#fff' }} />
                                                        </TouchableOpacity>
                                                    </Col>
                                                </Row>
                                            );
                                        }}
                                    />

                                </Form>

                            </View>
                            <TouchableOpacity onPress={() => this.onAddNewAlergics()}
                                style={{ position: 'absolute', right: 0, bottom: -18, backgroundColor: '#7F49C3', borderRadius: 10 / 2, paddingLeft: 2, paddingRight: 2, paddingTop: 2, paddingBottom: 2, flexDirection: 'row', alignItems: 'center', marginRight: 28 }}>
                                <Icon name="md-add" style={{ fontSize: 15, color: '#fff' }} />
                                <Text style={{ fontSize: 10, fontFamily: 'OpenSans', color: '#fff', fontWeight: 'bold' }}>Add</Text>
                            </TouchableOpacity>

                        </View>

                        <View>
                            <View style={{ marginTop: 20, width: '100%', }}>

                                <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>What medicines are you currently taking ?</Text>
                                <Row style={{ marginTop: 15, paddingBottom: 10 }}>
                                    <Col size={5}>
                                        <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Name</Text>
                                    </Col>
                                    <Col size={5}>
                                        <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Dosage</Text>
                                    </Col>
                                </Row>
                                <View>
                                    <Form>
                                        <FlatList
                                            style={{ flex: 1 }}
                                            data={medicineTakingDetails}
                                            extraData={medicineTakingDetails}
                                            renderItem={({ item, index }) => {
                                                return (

                                                    <Row >
                                                        <Col size={4.5} style={styles.formStyle7} >
                                                            <TextInput
                                                                placeholder="Enter  name"
                                                                style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                                placeholderTextColor="#C1C1C1"
                                                                keyboardType={'default'}
                                                                returnKeyType={'go'}
                                                                onChangeText={text => {
                                                                    let medicineTakingTemp = medicineTakingDetails;

                                                                    medicineTakingTemp[index].medicine_name = text;
                                                                    this.setState({
                                                                        medicineTakingDetails: medicineTakingTemp,
                                                                    });
                                                                }}
                                                                value={item.medicine_name}
                                                            />
                                                        </Col>

                                                        <Col size={4.5} style={styles.formStyle7}>
                                                            <TextInput
                                                                placeholder="Enter  medicine_dosage"
                                                                style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                                placeholderTextColor="#C1C1C1"
                                                                keyboardType={'default'}
                                                                returnKeyType={'go'}
                                                                onChangeText={text => {
                                                                    let medicineTakingTemp = medicineTakingDetails;
                                                                    medicineTakingTemp[index].medicine_dosage = text;
                                                                    this.setState({
                                                                        medicineTakingDetails: medicineTakingTemp,
                                                                    });
                                                                }}
                                                                value={item.medicine_dosage}
                                                            />

                                                        </Col>
                                                        <Col size={1} style={{ justifyContent: 'center' }}>
                                                            <TouchableOpacity onPress={() => this.deleteTableMedicineInfo(index)}
                                                                style={{ backgroundColor: 'red', borderRadius: 5 / 2, paddingLeft: 1, paddingRight: 1, paddingTop: 1, paddingBottom: 1, flexDirection: 'row', justifyContent: 'center', marginLeft: 5 }}>
                                                                <Icon name="md-close" style={{ fontSize: 15, color: '#fff' }} />
                                                            </TouchableOpacity>
                                                        </Col>
                                                    </Row>
                                                );
                                            }}
                                        />

                                    </Form>
                                    <TouchableOpacity onPress={() => this.onAddNewMedicineInfo()}
                                        style={{ position: 'absolute', right: 0, bottom: -18, backgroundColor: '#7F49C3', borderRadius: 10 / 2, paddingLeft: 2, paddingRight: 2, paddingTop: 2, paddingBottom: 2, flexDirection: 'row', alignItems: 'center', marginRight: 28 }}>
                                        <Icon name="md-add" style={{ fontSize: 15, color: '#fff' }} />
                                        <Text style={{ fontSize: 10, fontFamily: 'OpenSans', color: '#fff', fontWeight: 'bold' }}>Add</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', height: 38, marginTop: 50 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton}
                                    onPress={() => {
                                        prepareAppointmentUpdate(this.state.appointmentId, { has_skip_allergies_and_Medications: true });
                                        this.props.navigation.navigate('FamilyMedicalConditions', { AppointmentId: this.state.appointmentId });

                                    }}>
                                    <Text style={styles.touchText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.addAllergiesAndMedications()}>
                                    <Text style={styles.touchText}>Save and continue</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Content>
            </Container>

        )
    }
}

function profileState(state) {
    return {
        profile: state.profile
    }
}
export default connect(profileState)(AllergiesAndMedications)

