import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Footer, Icon, DatePicker, View, Picker, Card, Row, CheckBox,
    FooterTab, H3, Toast
} from 'native-base';
import { connect } from 'react-redux'
import { Image, BackHandler, AsyncStorage, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { userFiledsUpdate, logout } from '../../providers/auth/auth.actions';
import styles from '../../screens/auth/styles';
import Spinner from '../../../components/Spinner';
import { subTimeUnit, formatDate } from "../../../setup/helpers";
import { bloodGroupList } from "../../common";

class UserDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            firstName: '',
            lastName: '',
            dob: '',
            errorMsg: '',
            checked: false,
            selectedBloodGroup: null,
            isBloodDonor: false,
            isLoading: false,

        };
        this.dobIsEditable = false
    }

    componentDidMount() {
        let corporateData = this.props.navigation.getParam('corporateData') || null;

        if (corporateData !== null) {
            this.setState({
                firstName: corporateData.firstName,
                lastName: corporateData.lastName,
                dob: new Date(new Date(corporateData.dob).getFullYear(), new Date(corporateData.dob).getMonth(), new Date(corporateData.dob).getDate())
            })
            if (corporateData.dob) {
                this.dobIsEditable = true
            }

        }

    }

    validateFirstNameLastName = async (text, type) => {
        const regex = new RegExp('^[\ba-zA-Z ]+$')  //Support letter with space
        if (type === "firstName") {
            this.setState({ firstName: text });
        } else {
            this.setState({ lastName: text });
        }
        if (regex.test(text) === false) {
            this.setState({ errorMsg: "* Name can contain only alphabets" });
        } else {
            this.setState({ errorMsg: '' })
        }
    }

    updateUserDetails = async () => {
        const { firstName, lastName, dob, selectedBloodGroup, isBloodDonor, errorMsg } = this.state;
        const userId = await AsyncStorage.getItem('userId')
        try {
            if (!firstName) {
                this.setState({ errorMsg: 'Please enter your First Name ' });
                return false;
            }
            if (!lastName) {
                this.setState({ errorMsg: 'Please enter your Last Name ' });
                return false;
            }
            if (!dob) {
                this.setState({ errorMsg: 'Kindly choose your DOB' });
                return false
            }
            if (!selectedBloodGroup || selectedBloodGroup === 'Select Blood Group') {
                this.setState({ errorMsg: 'Kindly select your Blood group' });
                return false
            }
            this.setState({ errorMsg: '' });
            let requestData = {
                first_name: firstName,
                last_name: lastName,
                dob: dob,
                blood_group: selectedBloodGroup,
                is_blood_donor: isBloodDonor
            };
            let updateResponse = await userFiledsUpdate(userId, requestData);
            if (updateResponse.success) {
                Toast.show({
                    text: 'Your Profile has been completed',
                    type: "success",
                    duration: 3000
                });
                if (isBloodDonor == true) {
                    this.props.navigation.navigate('MapBox')
                }
                else {
                    logout();
                    this.props.navigation.navigate('login');
                }
            }
            else {
                this.setState({ errorMsg: updateResponse.message });
            }
        } catch (e) {
            Toast.show({
                text: 'Exception Occurred' + e,
                duration: 3000
            });
        }
    }

    render() {
        const { navigation, user: { isLoading } } = this.props;
        const { firstName, lastName, dob, selectedBloodGroup, isBloodDonor, errorMsg } = this.state;

        return (
            <Container style={styles.container}>
                <ImageBackground source={require('../../../../assets/images/MainBg.jpg')} style={{ width: '100%', height: '100%', flex: 1 }}>

                    <Content contentContainerStyle={styles.authBodyContent}>
                        <ScrollView>
                            <View >
                                <Text style={[styles.welcome, { color: '#fff' }]}>User Details</Text>
                                <Card style={{ borderRadius: 10, padding: 5, marginTop: 20 }}>
                                    <View style={{ marginLeft: 10, marginRight: 10 }}>
                                        <Form>
                                            <Item style={{ borderBottomWidth: 0, marginLeft: 'auto', marginRight: 'auto', }}>
                                                <Input placeholder="First Name" style={styles.authTransparentLabel}
                                                    value={firstName}
                                                    autoFocus={true}
                                                    keyboardType={'default'}
                                                    returnKeyType={'next'}
                                                    onChangeText={text => this.validateFirstNameLastName(text, "firstName")}
                                                    autoCapitalize='none'
                                                    blurOnSubmit={false}
                                                    onSubmitEditing={() => { this.firstName._root.focus(); }} />
                                            </Item>

                                            <Item style={{ borderBottomWidth: 0, marginLeft: 'auto', marginRight: 'auto', }} >
                                                <Input placeholder="Last Name" style={styles.authTransparentLabel}
                                                    ref={(input) => { this.firstName = input; }}
                                                    value={lastName}
                                                    keyboardType={'default'}
                                                    returnKeyType={'next'}
                                                    onChangeText={text => this.validateFirstNameLastName(text, "lastName")}
                                                    autoCapitalize='none'
                                                // blurOnSubmit={false}
                                                // onSubmitEditing={() => { this.lastName.focus(); }}
                                                />
                                            </Item>

                                            <Row style={styles.authTransparentLabel}>
                                                <Icon name='calendar' style={{ color: '#775DA3', marginTop: 8 }} />
                                                <DatePicker style={styles.userDetailLabel}
                                                    defaultDate={dob}
                                                    timeZoneOffsetInMinutes={undefined}
                                                    modalTransparent={false}
                                                    minimumDate={new Date(1940, 0, 1)}
                                                    maximumDate={subTimeUnit(new Date(), 1, 'year')}
                                                    animationType={"fade"}
                                                    androidMode={"default"}
                                                    placeHolderText={dob === '' ? "Date Of Birth" : formatDate(dob, 'DD-MM-YYYY')}
                                                    textStyle={{ color: "#5A5A5A" }}
                                                    value={dob}
                                                    placeHolderTextStyle={{ color: "#5A5A5A" }}
                                                    onDateChange={dob => { console.log(dob); this.setState({ dob }) }}
                                                    disabled={this.dobIsEditable}
                                                />
                                            </Row>
                                            <View style={{ marginLeft: 2 }}>
                                                <Item last style={[styles.userDetailLabel, { borderBottomWidth: 0, paddingLeft: 0, marginLeft: 0 }]}>
                                                    <Picker style={styles.userDetailLabel}
                                                        mode="dropdown"
                                                        placeholder='Select Blood Group'
                                                        placeholderStyle={{ fontSize: 15, marginLeft: -5 }}
                                                        iosIcon={<Icon name="ios-arrow-down" style={{ color: 'gray', fontSize: 20 }} />}
                                                        textStyle={{ color: "gray", left: 0, marginLeft: -5 }}
                                                        note={false}
                                                        itemStyle={{
                                                            paddingLeft: 10,
                                                            fontSize: 16,
                                                        }}
                                                        itemTextStyle={{ color: '#5cb85c', }}
                                                        style={{ width: undefined }}
                                                        onValueChange={(sample) => { this.setState({ selectedBloodGroup: sample }) }}
                                                        selectedValue={selectedBloodGroup}
                                                        testID="editBloodGroup"
                                                    >
                                                        {bloodGroupList.map((value, key) => {
                                                            return <Picker.Item label={String(value)} value={String(value)} key={key}
                                                            />
                                                        })
                                                        }
                                                    </Picker>

                                                </Item>
                                            </View>
                                            <Row style={{ marginTop: 5, marginLeft: -5, alignItems: 'center' }}>
                                                <CheckBox style={{ borderRadius: 5 }}
                                                    status={this.state.isBloodDonor ? true : false}
                                                    checked={this.state.isBloodDonor}
                                                    onPress={() => this.setState({ isBloodDonor: !this.state.isBloodDonor })} testID='privateCheckbox'
                                                />

                                                <Text style={{ marginLeft: 20, color: '#775DA3', fontFamily: 'OpenSans', fontSize: 14, fontWeight: 'bold' }}>Are you blood donor</Text>
                                            </Row>

                                            <View>
                                                <Text style={{ marginTop: 7, marginLeft: 30, fontSize: 15, fontFamily: 'OpenSans', color: 'red' }}> {errorMsg}</Text>
                                                <Spinner color='blue'
                                                    visible={isLoading}
                                                />
                                            </View>

                                            <View style={{ marginTop: 5, alignItems: 'center', justifyContent: 'center' }}>
                                                <TouchableOpacity style={styles.UserButton1} onPress={() => this.updateUserDetails()}>
                                                    <Text style={styles.ButtonText}>Submit</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </Form>
                                    </View>
                                    <Item style={{ marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0, marginBottom: 10, marginTop: 10 }}>
                                        <Text uppercase={false} style={{ color: '#000', fontSize: 14, fontFamily: 'OpenSans', color: '#775DA3' }}>Already Have An Account ?</Text>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('login')} style={styles.smallSignUpButton}>
                                            <Text uppercase={true} style={{ color: '#000', fontSize: 10, fontFamily: 'OpenSans', fontWeight: 'bold', color: '#fff' }}> Sign In</Text>
                                        </TouchableOpacity>
                                    </Item>
                                </Card>
                            </View>
                        </ScrollView>
                    </Content>
                </ImageBackground>
            </Container>
        )
    }
}

function userDetailsState(state) {
    return {
        user: state.user
    }
}
export default connect(userDetailsState)(UserDetails)

