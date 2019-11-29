import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Footer, Icon, DatePicker, View, Picker,
    FooterTab, H3, Toast
} from 'native-base';
import { connect } from 'react-redux'
import { Image, BackHandler, AsyncStorage, ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { userFiledsUpdate, logout } from '../../providers/auth/auth.actions';
import styles from '../../screens/auth/styles';
import Spinner from '../../../components/Spinner';
import { subTimeUnit } from "../../../setup/helpers";
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
            isLoading: false
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
            if (errorMsg === '') {
                let requestData = {
                    first_name: firstName,
                    last_name: lastName,
                    dob: dob,
                    blood_group: selectedBloodGroup,
                    is_blood_donor: isBloodDonor
                };
                // this.setState({ isLoading: false })
                let updateResponse = await userFiledsUpdate(userId, requestData);
                if (updateResponse.success) {
                    if (isBloodDonor == true) this.props.navigation.navigate('MapBox')
                    else
                        Toast.show({
                            text: 'Your Profile has been completed, Please Login to Continue',
                            type: "success",
                            duration: 3000
                        });
                    logout();
                    this.props.navigation.navigate('login');
                }
                else {
                    this.setState({ errorMsg: updateResponse.message });
                }
            } else {
                this.setState({ errorMsg: "Entered Data is not Valid. Kindly review them." });
            }
            // this.setState({ isLoading: false })
            setTimeout(async () => {   // set Time out for Disable the Error Messages
                await this.setState({ errorMsg: '' });
            }, 3000);
        } catch (e) {
            Toast.show({
                text: 'Exception Occurred' + e,
                duration: 3000
            });
            console.log(e);
        }
    }

    render() {
        const { navigation, user: { isLoading } } = this.props;
        const { firstName, lastName, dob, selectedBloodGroup, isBloodDonor, errorMsg } = this.state;

        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.bodyContent}>
                    <ScrollView>
                        <View >
                            <H3 style={styles.welcome}>User Details</H3>
                            <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.logo} />
                            <Form>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Input placeholder="First Name" style={styles.transparentLabel}
                                        value={firstName}
                                        autoFocus={true}
                                        keyboardType={'default'}
                                        returnKeyType={'next'}
                                        onChangeText={text => this.validateFirstNameLastName(text, "firstName")}
                                        autoCapitalize='none'
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.firstName._root.focus(); }}
                                    />
                                </Item>

                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Input placeholder="Last Name" style={styles.transparentLabel}
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

                                <Item style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', marginTop: 10, borderRadius: 5 }}>
                                    <Icon name='calendar' style={{ paddingLeft: 20, color: '#775DA3' }} />
                                    <DatePicker style={styles.transparentLabel}
                                        defaultDate={dob}
                                        timeZoneOffsetInMinutes={undefined}
                                        modalTransparent={false}
                                        minimumDate={new Date(1940, 0, 1)}
                                        maximumDate={subTimeUnit(new Date(), 1, 'year')}
                                        animationType={"fade"}
                                        androidMode={"default"}
                                        placeHolderText="Date Of Birth"
                                        textStyle={{ color: "#5A5A5A" }}
                                        value={dob}
                                        placeHolderTextStyle={{ color: "#5A5A5A" }}
                                        onDateChange={dob => { console.log(dob); this.setState({ dob }) }}

                                        disabled={false}
                                    /></Item>
                                <Item style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', marginTop: 10, borderRadius: 5 }}>
                                    <Picker style={styles.transparentLabel}
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down" />}
                                        textStyle={{ color: "#5cb85c", marginLeft: 35 }}
                                        note={false}
                                        itemStyle={{
                                            backgroundColor: "gray",
                                            paddingLeft: 10,
                                            fontSize: 10,
                                        }}
                                        itemTextStyle={{ color: '#5cb85c', marginLeft: 35 }}
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
                                <Item style={{ borderBottomWidth: 0, marginTop: 5, marginLeft: 20 }}>
                                    <Checkbox status={isBloodDonor ? 'checked' : 'unchecked'} color="green" onPress={() => this.setState({ isBloodDonor: !isBloodDonor })} testID='privateCheckbox'></Checkbox>
                                    <Text style={{ marginLeft: 5, color: 'gray', fontFamily: 'OpenSans', fontSize: 13, }}>Are you blood donor</Text>
                                </Item>
                                <Text style={{ paddingLeft: 20, fontSize: 15, fontFamily: 'OpenSans', marginBottom: 20, color: 'red' }}> {errorMsg}</Text>

                                <Spinner color='blue'
                                    visible={isLoading}
                                    textContent={'Loading...'}
                                />
                                <Button style={styles.detailsButton} block primary onPress={() => this.updateUserDetails()}>
                                    <Text style={styles.ButtonText}>Submit</Text>
                                </Button>

                            </Form>
                        </View>
                    </ScrollView>
                </Content>
                <Footer >
                    <FooterTab style={{ backgroundColor: '#F2F2F2', }}>
                        <Button full onPress={() => this.props.navigation.navigate('login')}>
                            <Text uppercase={false} style={{ color: '#000', fontSize: 15, fontFamily: 'OpenSans' }}>Already Have An Account ? SignIn</Text>
                        </Button>
                    </FooterTab>
                </Footer>
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

