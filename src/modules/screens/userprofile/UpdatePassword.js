import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, View, CheckBox, Left, Right, Thumbnail, Body, Icon, Card, Input, Toast, Row } from 'native-base';
import {  ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { updateNewPassword, updateSmartNewPassword } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import styles from './style.js'
import Spinner from '../../../components/Spinner';
import { Col } from 'react-native-easy-grid';
import { validatePassword } from '../../common'
import {translate} from '../../../setup/translator.helper'



class UpdatePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            oldPassword: '',
            newPassword: '',
            oldPasswordVisible: true,
            newPasswordVisible: true,
            isLoading: false,
            errorMsg: '',
        }
    }

    handlePasswordUpdate = async () => {
        try {
            if (this.state.oldPassword == '') {
                this.setState({ errorMsg: translate('Kindly enter the old password') })
                return false;
            }
            if (this.state.newPassword == '') {
                this.setState({ errorMsg: translate('Kindly enter the new password') })
                return false;
            }
            if ((this.state.oldPassword && this.state.newPassword).length < 6) {
                this.setState({ errorMsg: translate("Password is required Min 6 Characters") });
                return false;
            }
            if ((this.state.oldPassword && this.state.newPassword).length > 16) {
                this.setState({ errorMsg: translate("Password Accepted Max 16 Characters only") });
                return false
            }
            if (this.state.oldPassword == this.state.newPassword) {
                this.setState({ errorMsg: translate('Cannot have the same password. Kindly enter a new Password') })
                return false;
            }
            this.setState({ errorMsg: '', isLoading: true });

            let is_corporate_user = await AsyncStorage.getItem('is_corporate_user') || null
            if (is_corporate_user) {
                let memberEmailId = await AsyncStorage.getItem('memberEmailId') || null
                let smartData = {
                    userType: 'MEMBER',
                    userId: memberEmailId,
                    isForceToChangePassword:true,
                    oldPassword: this.state.oldPassword,
                    newPassword: this.state.newPassword
                };
                console.log(JSON.stringify(smartData))
                let smartHealthResult = await updateSmartNewPassword(smartData);
                console.log(smartHealthResult)
                if (smartHealthResult && smartHealthResult.userId) {
                    await AsyncStorage.removeItem('forceToChangePassword')
                    await Toast.show({
                        text: translate('Your Password is changed Successfully'),
                        type: "success",
                        duration: 3000,

                    })
                    this.props.navigation.pop();
                } else {
                    await Toast.show({
                        text: smartHealthResult&&smartHealthResult.message==="INVALID_CREDENTIAL"? translate("Old password doesn't match"):translate('Failed to change password'),
                        type: "danger",
                        duration: 3000
                    })
                }
            } else {
                let userId = await AsyncStorage.getItem('userId');
                let data = {
                    type: 'user',
                    userId: userId,
                    oldPassword: this.state.oldPassword,
                    newPassword: this.state.newPassword
                };
                let result = await updateNewPassword(data);
                if (result.success) {
                    await Toast.show({
                        text: translate('Your Password is changed Successfully'),
                        type: "success",
                        duration: 3000,

                    })
                    this.props.navigation.navigate('Profile');

                }
                else {
                    await Toast.show({
                        text: result.message,
                        type: "danger",
                        duration: 3000
                    })
                }
            }

            this.setState({ isLoading: false });

        } catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    onPasswordTextChanged(type, value) {
        if (type === "OldPassword") {
            this.setState({ oldPassword: value.replace(/\s/g, "") });
        }
        if (type === 'NewPassword') {
            this.setState({ newPassword: value.replace(/\s/g, "") });
        }
    }
    render() {

        return (
            <Container style={styles.container}>

                <Content contentContainerStyle={styles.bodyContent}>
                    <ScrollView>
                        <Spinner color='blue'
                            visible={this.state.isLoading}
                        />


                        <Text style={styles.headerText}>{translate("Update Your Password")}</Text>
                        {/* <Text style={{ color: 'gray', fontSize: 13, fontFamily: 'Roboto', marginTop: 10, marginLeft: 7 }}>Update your Password</Text> */}
                        <View style={styles.cardEmail}>

                            <Item style={{ borderBottomWidth: 0 }}>

                                <Icon name="briefcase" style={styles.centeredIcons}></Icon>

                                <Col style={styles.transparentLabel1}>
                                    <Row>
                                        <Input placeholder={translate("Enter old password")}
                                            secureTextEntry={true} style={{ fontSize: 13, fontFamily: 'Roboto', marginTop: -5 }}
                                            keyboardType="default"
                                            value={this.state.oldPassword}
                                            secureTextEntry={this.state.oldPasswordVisible}
                                            onChangeText={(oldPassword) => this.onPasswordTextChanged("OldPassword", oldPassword)}
                                            testID='enterOldPassword' />
                                        {this.state.oldPasswordVisible == true ?
                                            <Icon active name="ios-eye-off" style={{ fontSize: 25, marginTop: 10 }} onPress={() => this.setState({ oldPasswordVisible: !this.state.oldPasswordVisible })}
                                            /> : <Icon active name="ios-eye" style={{ fontSize: 25, marginTop: 10 }} onPress={() => this.setState({ oldPasswordVisible: !this.state.oldPasswordVisible })} />}

                                    </Row>
                                </Col>


                            </Item>
                            <Item style={{ borderBottomWidth: 0 }}>
                                <Icon name="briefcase" style={styles.centeredIcons}></Icon>
                                <Col style={styles.transparentLabel1}>
                                    <Row>
                                        <Input placeholder={translate("Enter new password")}
                                            secureTextEntry={true} style={{ fontSize: 13, fontFamily: 'Roboto', marginTop: -5 }}
                                            keyboardType="default"
                                            value={this.state.newPassword}
                                            secureTextEntry={this.state.newPasswordVisible}
                                            onChangeText={(newPassword) => this.onPasswordTextChanged("NewPassword", newPassword)}
                                            testID='enterNewPassword' />
                                        {this.state.newPasswordVisible == true ?
                                            <Icon active name="ios-eye-off" style={{ fontSize: 25, marginTop: 10 }} onPress={() => this.setState({ newPasswordVisible: !this.state.newPasswordVisible })}
                                            /> : <Icon active name="ios-eye" style={{ fontSize: 25, marginTop: 10 }} onPress={() => this.setState({ newPasswordVisible: !this.state.newPasswordVisible })} />}

                                    </Row>
                                </Col>

                            </Item>
                            {this.state.errorMsg ? <Text style={{ paddingLeft: 20, fontSize: 13, fontFamily: 'Roboto', color: 'red' }}>{this.state.errorMsg}</Text> : null}

                            <Item style={{ borderBottomWidth: 0, marginTop: 10 }}>
                                <Right>
                                    <Button success style={styles.button2} onPress={() => this.handlePasswordUpdate()} testID='clickUpdatePassword'>
                                        <Text uppercase={false} note style={styles.buttonText}>{translate("Update")}</Text>
                                    </Button>
                                </Right>
                            </Item>


                        </View>

                    </ScrollView>
                </Content>

            </Container>

        )
    }

}

function profileState(state) {

    return {
        user: state.user
    }
}
export default connect(profileState)(UpdatePassword)


