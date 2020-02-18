import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, CheckBox, Row, Col, Left, Right, Picker, Body, Icon, Card, Input, Toast, View } from 'native-base';
import { updatePrimaryContact } from '../../providers/auth/auth.actions';
import { AsyncStorage, ScrollView } from 'react-native';
import { connect } from 'react-redux'
import styles from './style.js';
import Spinner from '../../../components/Spinner';
import { acceptNumbersOnly } from '../../common'


class UpdateContact extends Component {
    numberCategory = ['Home', 'Emergency']

    constructor(props) {
        super(props)
        this.state = {
            secondary_mobile_no: '',
            active: true,
            primary_mobile_no: '',
            isLoading: false,
            userData: '',
            errorMsg: '',
            primaryNoErrMsg: '',
            secNoErrMsg: '',
            existingSecNumber: '',
            OTPRequestSend: false

        }
    }

    componentDidMount() {
        this.bindContactValues();

    }

    bindContactValues() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        if (userData.mobile_no) {
            this.setState({
                primary_mobile_no: userData.mobile_no,
                existingPrimaryNo: userData.mobile_no
            })
        }
        if (userData.secondary_mobile) {
            this.setState({
                secondary_mobile_no: userData.secondary_mobile,
                existingSecNumber: userData.secondary_mobile

            })
        }

    }

    onPressMobileNumUpdate() {
        const { OTPRequestSend } = this.state;
        if(OTPRequestSend === false) {

        }
        
    }

    commonUpdateContactMethod = async () => {
        const { secondary_mobile_no, existingSecNumber, primary_mobile_no, existingPrimaryNo } = this.state
        try {
            if (primary_mobile_no == '') {
                this.setState({ primaryNoErrMsg: 'Kindly enter your primary contact' })
                return false;
            }
            if (primary_mobile_no == secondary_mobile_no || (existingPrimaryNo == primary_mobile_no && existingSecNumber == secondary_mobile_no)) {
                this.setState({ errorMsg: 'User details already exists' })
                return false;
            }

            this.setState({ errorMsg: '', primaryNoErrMsg: '', secNoErrMsg: '', isLoading: true });
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                mobile_no: primary_mobile_no,
            };
            let response = await updatePrimaryContact(userId, data);
            if (response.success) {
                Toast.show({
                    text: "Contacts has been saved",
                    type: "success",
                    duration: 3000,
                })
                this.props.navigation.navigate('Profile');
            } else {
                Toast.show({
                    text: response.message,
                    type: "danger",
                    duration: 3000
                })
            }
        }

        catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }



    render() {
        return (
            <Container style={styles.container}>
                <Spinner color='blue'
                    visible={this.state.isLoading}
                    textContent={'Please Wait Loading'}
                />

                <Content contentContainerStyle={styles.bodyContent1}>
                    <ScrollView>
                        <View style={{ marginTop: 10, padding: 10 }}>
                            <Text style={styles.headerText}>Update Mobile Number</Text>
                            <View style={styles.cardEmail}>

                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Col>
                                        <Text>Primary Mobile Number</Text>
                                        <Row>
                                            <Icon name="call" style={styles.centeredIcons}></Icon>
                                            <Input placeholder="Edit Your Number" style={styles.transparentLabel} keyboardType="numeric"
                                                onChangeText={primary_mobile_no => acceptNumbersOnly(primary_mobile_no) == true || primary_mobile_no === '' ? this.setState({ primary_mobile_no}):null}
                                                value={String(this.state.primary_mobile_no)}
                                                testID='updatePrimaryContact' />
                                        </Row>
                                    </Col>

                                </Item>
                                {this.state.primaryNoErrMsg ? <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{this.state.primaryNoErrMsg}</Text> : null}
                                {/* <Item style={{ borderBottomWidth: 0, marginTop: 10 }}>
                                    <Col>
                                        <Text>Secondary Mobile Number</Text>
                                        <Row>
                                            <Icon name='call' style={styles.centeredIcons}></Icon>
                                            <Input placeholder="Edit Your Number" style={styles.transparentLabel} keyboardType="numeric"
                                                onChangeText={secondary_mobile_no => acceptNumbersOnly(secondary_mobile_no) == true || secondary_mobile_no === '' ? this.setState({ secondary_mobile_no }) : null}
                                                value={String(this.state.secondary_mobile_no)}
                                                testID='updateContact' />
                                        </Row>
                                    </Col>
                                </Item> 
                                {this.state.secNoErrMsg ? <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{this.state.secNoErrMsg}</Text> : null} */}
                                {this.state.errorMsg ? <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{this.state.errorMsg}</Text> : null}




                                <Item style={{ borderBottomWidth: 0, marginTop: 15 }}>
                                    <Right>
                                        <Button success style={styles.button2} onPress={() => this.commonUpdateContactMethod()} testID='clickUpdateContact'>
                                            <Text uppercase={false} note style={styles.buttonText}>Update</Text>
                                        </Button>
                                    </Right>
                                </Item>
                            </View>
                        </View>
                    </ScrollView>
                </Content >

            </Container>

        )
    }

}
function profileState(state) {

    return {
        user: state.user
    }
}
export default connect(profileState)(UpdateContact)

