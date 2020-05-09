import React, { PureComponent } from 'react';
import {
    Container, Content, Text, View, Badge, Toast, Radio, Form, CheckBox, Item, Picker, Icon
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity, Share, Platform } from 'react-native';
import Spinner from '../../../../components/Spinner';
import { userFiledsUpdate } from '../../../providers/auth/auth.actions';
import { numberList } from './constants';
import { connect } from 'react-redux';
import { prepareAppointmentUpdate, } from '../../../providers/bookappointment/bookappointment.action'
import styles from '../styles'


class SocialHistory extends PureComponent {
    constructor(props) {
        super(props)
        const { profile: { social_history } } = this.props

        this.state = {
            firstQuestion: 0,
            radioButton: false,
            checkBoxClick: false,
            sexuallyActive: social_history.sexually_active,
            drinkAlcohol: social_history.drink_alcohol,
            smoke: social_history.smoke,
            recreational_drugs: social_history.use_recreational_drugs,
            physically_or_verbally: social_history.physically_or_verbally_hurt_you,
            exercise: social_history.exercise,
            isLoading: false,
            selectnumber: social_history.use_caffeinated_drink,
            appointmentId: props.navigation.getParam('AppointmentId')




        }
    }


    skippingButton = async () => {
        try {
            const { appointmentId } = this.state

            let data = {
                has_skip_social_history: false
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


    addSocialHistory = async () => {
        try {
            const { sexuallyActive, drinkAlcohol, smoke, recreational_drugs, physically_or_verbally, selectnumber, exercise, appointmentId } = this.state
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                social_history: {
                    sexually_active: sexuallyActive,
                    drink_alcohol: drinkAlcohol,
                    smoke: smoke,
                    use_recreational_drugs: recreational_drugs,
                    use_caffeinated_drink: selectnumber,
                    physically_or_verbally_hurt_you: physically_or_verbally,
                    exercise: exercise
                }
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
                this.props.navigation.navigate('PrepareAppointmentLastStep', { AppointmentId: appointmentId });
            }
        }
        catch (e) {
            console.log(e)
        }
        finally {
            this.setState({ isLoading: false })
        }
    }
    render() {
        const { selectnumber } = this.state
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                    <Spinner
                        color='blue'
                        visible={this.state.isLoading}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.subHead, { textAlign: 'center' }]}>Social history</Text>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Are you sexually active?</Text>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <Col style={{ flexDirection: 'row' }} size={5}>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={this.state.sexuallyActive}
                                            onPress={() => this.setState({ sexuallyActive: this.state.sexuallyActive })} />
                                        <Text style={styles.radioText1}>Yes</Text>
                                    </Col>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={!this.state.sexuallyActive}
                                            onPress={() => this.setState({ sexuallyActive: !this.state.sexuallyActive })} />
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
                                            selected={this.state.drinkAlcohol}
                                            onPress={() => this.setState({ drinkAlcohol: this.state.drinkAlcohol })} />
                                        <Text style={styles.radioText1}>Yes</Text>
                                    </Col>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={!this.state.drinkAlcohol}
                                            onPress={() => this.setState({ drinkAlcohol: !this.state.drinkAlcohol })} />
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
                                            selected={this.state.smoke}
                                            onPress={() => this.setState({ smoke: this.state.smoke })} />
                                        <Text style={styles.radioText1}>Yes</Text>
                                    </Col>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={!this.state.smoke}
                                            onPress={() => this.setState({ smoke: !this.state.smoke })} />
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
                                            selected={this.state.recreational_drugs}
                                            onPress={() => this.setState({ recreational_drugs: this.state.recreational_drugs })} />
                                        <Text style={styles.radioText1}>Yes</Text>
                                    </Col>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={!this.state.recreational_drugs}
                                            onPress={() => this.setState({ recreational_drugs: !this.state.recreational_drugs })} />
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
                                    onValueChange={(sample) => { this.setState({ selectnumber: sample }) }}
                                    selectedValue={selectnumber}
                                    testID="editBloodGroup"
                                >
                                    {numberList.map((value, key) => {
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
                                            selected={this.state.physically_or_verbally}
                                            onPress={() => this.setState({ physically_or_verbally: this.state.physically_or_verbally })} />
                                        <Text style={styles.radioText1}>Yes</Text>
                                    </Col>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={!this.state.physically_or_verbally}
                                            onPress={() => this.setState({ physically_or_verbally: !this.state.physically_or_verbally })} />
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
                                            selected={this.state.exercise}
                                            onPress={() => this.setState({ exercise: this.state.exercise })} />
                                        <Text style={styles.radioText1}>Yes</Text>
                                    </Col>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={!this.state.exercise}
                                            onPress={() => this.setState({ exercise: !this.state.exercise })} />
                                        <Text style={styles.radioText1}>No</Text>
                                    </Col>
                                </Col>
                                <Col size={5}>
                                </Col>
                            </View>

                        </View>
                        <View style={{ flexDirection: 'row', height: 38, marginTop: 15 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton}
                                    onPress={() => {
                                        prepareAppointmentUpdate(this.state.appointmentId, { has_skip_social_history: true });
                                        this.props.navigation.navigate('PrepareAppointmentLastStep', { AppointmentId: this.state.appointmentId });
                                    }}>
                                    <Text style={styles.touchText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.addSocialHistory()}>
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
export default connect(profileState)(SocialHistory)

