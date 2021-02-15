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

class FamilyMedicalConditions extends PureComponent {
    constructor(props) {
        super(props)
        const { profile: { family_conditions } } = this.props

        this.state = {
            person_name: [],
            family_person_who: [],
            isLoading: false,
            appointmentId: props.navigation.getParam('AppointmentId'),
            familyCondition: family_conditions || [{
                person_name: null,
                family_person_who: null
            }],
            refreshCount: 1,
        }
    }
    skippingButton = async (hasSkip = true) => {
        try {
            const { appointmentId } = this.state

            let data = {
                has_skip_family_conditions: hasSkip
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
    addFamilyMedicalConditions = async () => {
        try {
            const { person_name, family_person_who, appointmentId, familyCondition } = this.state

            let userId = await AsyncStorage.getItem('userId');
            let data = {
                family_conditions: familyCondition
            }
            this.setState({ isLoading: true })
            if(familyCondition[0]['person_name']==null&&familyCondition[0]['family_person_who']==null){
                Toast.show({
                 text: 'Please fill  the  field',
                 type: "danger",
                 duration: 3000,
             })  
             }
           
            let response = await userFiledsUpdate(userId, data)
           
            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })
                this.skippingButton(false);
                this.props.navigation.navigate('AllergicDisease', { AppointmentId: appointmentId });
           }
        
        }
        catch (e) {
            console.log(e)
        }
        finally {
            this.setState({ isLoading: false })
        }
    }

    onAddNewfamilyCondition = async () => {
        const { familyCondition, refreshCount } = this.state;
        const getLastItemInFamilyCondition = familyCondition.slice(-1)[0];
        if (getLastItemInFamilyCondition != undefined) {
            if (!getLastItemInFamilyCondition.person_name || !getLastItemInFamilyCondition.family_person_who) {
                debugger
                return false
            }
        }
        familyCondition.push({
            person_name: null,
            family_person_who: null
        });
        await this.setState({ familyCondition, refreshCount: refreshCount + 1 })
    }
    deleteTablefamilyCondition(index) {
        const { familyCondition } = this.state;
        familyCondition.splice(index, 1)
        this.setState({ refreshCount: this.state.refreshCount + 1 })
    }
    render() {
        const { person_name, familyCondition, family_person_who } = this.state
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                    <Spinner
                        color='blue'
                        visible={this.state.isLoading}
                    />
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

                            <View>
                                <Form>
                                    <FlatList
                                        containerstyle={{ flex: 1 }}
                                        data={familyCondition}
                                        extraData={familyCondition}
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
                                                                let familyConditionTemp = familyCondition;

                                                                familyConditionTemp[index].person_name = text;
                                                                this.setState({
                                                                    familyCondition: familyConditionTemp,
                                                                });
                                                            }}
                                                            value={item.person_name}
                                                        />
                                                    </Col>


                                                    <Col size={4.5} style={styles.formStyle7}>
                                                        <TextInput
                                                            placeholder="Enter  Who?"
                                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                                            placeholderTextColor="#C1C1C1"
                                                            keyboardType={'default'}
                                                            returnKeyType={'go'}
                                                            onChangeText={text => {
                                                                let familyConditionTemp = familyCondition;
                                                                familyConditionTemp[index].family_person_who = text;
                                                                this.setState({
                                                                    familyCondition: familyConditionTemp,
                                                                });
                                                            }}
                                                            value={item.family_person_who}
                                                        />

                                                    </Col>
                                                    <Col size={1} style={{ justifyContent: 'center' }}>
                                                        <TouchableOpacity onPress={() => this.deleteTablefamilyCondition(index)}
                                                            style={{ backgroundColor: 'red', borderRadius: 5 / 2, paddingLeft: 1, paddingRight: 1, paddingTop: 1, paddingBottom: 1, flexDirection: 'row', justifyContent: 'center', marginLeft: 10 }}>
                                                            <Icon name="md-close" style={{ fontSize: 15, color: '#fff' }} />
                                                        </TouchableOpacity>
                                                    </Col>
                                                </Row>
                                            );
                                        }}
                                    />

                                </Form>
                                <TouchableOpacity onPress={() => this.onAddNewfamilyCondition()}
                                    style={{ position: 'absolute', right: 0, bottom: -18, backgroundColor: '#128283', borderRadius: 10 / 2, paddingLeft: 2, paddingRight: 2, paddingTop: 2, paddingBottom: 2, flexDirection: 'row', alignItems: 'center', marginRight: 32 }}>
                                    <Icon name="md-add" style={{ fontSize: 15, color: '#fff' }} />
                                    <Text style={{ fontSize: 10, fontFamily: 'OpenSans', color: '#fff', fontWeight: 'bold' }}>Add</Text>
                                </TouchableOpacity>
                            </View>


                        </View>
                        <View style={{ flexDirection: 'row', height: 38, marginTop: 100 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton}
                                    onPress={() => {
                                        prepareAppointmentUpdate(this.state.appointmentId, { has_skip_family_conditions: true });
                                        this.props.navigation.navigate('AllergicDisease', { AppointmentId: this.state.appointmentId });
                                    }}>
                                    <Text style={styles.touchText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.addFamilyMedicalConditions()}>
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
export default connect(profileState)(FamilyMedicalConditions)
