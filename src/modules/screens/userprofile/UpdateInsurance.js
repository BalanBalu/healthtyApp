import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, CheckBox, Left, Right, Thumbnail, Body, Icon, Card, Input, Toast, View } from 'native-base';
import { userFiledsUpdate } from '../../providers/auth/auth.actions';
import {  ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { connect } from 'react-redux'
import styles from './style.js';
import Spinner from '../../../components/Spinner';
import { validateName, validatePassword } from '../../common'



class UpdateInsurance extends Component {
    constructor(props) {
        super(props)
        this.state = {
            insurance_no: '',
            insurance_provider: '',
            isLoading: false,
            userData: '',
            errorMsg: '',
            noErrorMsg: ''

        }
    }

    componentDidMount() {
        this.bindInsuranceValues();
    }

    bindInsuranceValues() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');

        if (userData.insurance) {
            this.setState({
                insurance_no: userData.insurance[0].insurance_no,
                insurance_provider: userData.insurance[0].insurance_provider,
                userData
            })
        }

    }

    commonUpdateInsuranceMethod = async () => {
        try {
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                insurance: [{
                    insurance_no: this.state.insurance_no,
                    insurance_provider: this.state.insurance_provider,
                    active: true
                }]
            };

            this.setState({ errorMsg: '', noErrorMsg: '', isLoading: true });

            let response = await userFiledsUpdate(userId, data);
            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })
                this.props.navigation.navigate('Profile');

            } else {
                Toast.show({
                    text: "Insurance number must contain minimum 0f 5 and maximum of 15 characters",
                    type: "danger",
                    duration: 5000
                })
            }
            this.setState({ isLoading: false });

        }
        catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }
    validateProviderName = async (text) => {
        await this.setState({ insurance_provider: text });
        if (this.state.insurance_provider && validateName(this.state.insurance_provider) == false) {
            this.setState({ errorMsg: 'Insurance provider field must contain alphabets' })
            return false;
        }
        else {
            this.setState({ errorMsg: '' })
        }
    }
    validateInsuranceNo = async (text) => {
        await this.setState({ insurance_no: text });
        if (this.state.insurance_no && validatePassword(this.state.insurance_no) == false) {
            this.setState({ noErrorMsg: 'Insurance number can not be empty' })
            return false;
        }
        else {
            this.setState({ noErrorMsg: '' })
        }
    }


    handleInsuranceUpdate = async () => {
        const { userData, insurance_no, insurance_provider } = this.state
        try {
            this.setState({ isLoading: true });
            if (userData.insurance !== undefined) {
                if (insurance_no != userData.insurance[0].insurance_no ||
                    insurance_provider != userData.insurance[0].insurance_provider) {
                    this.commonUpdateInsuranceMethod();
                } else {
                    this.props.navigation.navigate('Profile');

                }

            } else {
                this.commonUpdateInsuranceMethod();
            }
        } catch (e) {
            console.log(e);
        }

    }



    render() {
        const { user: { isLoading } } = this.props;


        return (
            <Container style={styles.container}>


                <Content contentContainerStyle={styles.bodyContent}>

                    <ScrollView>
                        <Spinner color='blue'
                            visible={this.state.isLoading}
                        />

                        <Text style={styles.headerText}>Edit Insurance</Text>

                        <Card style={{ padding: 10, borderRadius: 10, marginTop: 20, marginBottom: 20 }}>


                            <Item style={{ borderBottomWidth: 0, marginTop: 25 }}>
                                <Icon name='heartbeat' type='FontAwesome' style={styles.centeredIcons}></Icon>
                                <Input placeholder="Edit insurance number" style={styles.transparentLabel} keyboardType="email-address"
                                    onChangeText={(insurance_no) => this.validateInsuranceNo(insurance_no)}
                                    value={this.state.insurance_no}
                                    testID='updateInsuranceNo' />
                            </Item>
                            {this.state.noErrorMsg ?
                                <Text style={{ paddingLeft: 20, fontSize: 15, fontFamily: 'OpenSans', color: 'red' }}>{this.state.noErrorMsg}</Text>
                                : null}
                            <Item style={{ borderBottomWidth: 0, marginTop: 25 }}>
                                <Icon name='heartbeat' type='FontAwesome' style={styles.centeredIcons}></Icon>
                                <Input placeholder="Edit insurance provider" style={styles.transparentLabel} keyboardType="email-address"
                                    onChangeText={(insurance_provider) => this.validateProviderName(insurance_provider)}
                                    value={this.state.insurance_provider}
                                    testID='updateInsuranceProvider' />
                            </Item>
                            {this.state.errorMsg ?
                                <Text style={{ paddingLeft: 20, fontSize: 15, fontFamily: 'OpenSans', color: 'red' }}>{this.state.errorMsg}</Text>
                                : null}
                            <Item style={{ borderBottomWidth: 0, marginTop: 10 }}>
                                <Right>
                                    <Button success style={styles.button2} onPress={() => this.handleInsuranceUpdate()} testID='clickUpdateInsurance'>
                                        <Text uppercase={false} note style={styles.buttonText}>Update</Text>
                                    </Button>
                                </Right>
                            </Item>


                        </Card>





                    </ScrollView>

                </Content >

            </Container >

        )
    }

}
function profileState(state) {

    return {
        user: state.user
    }
}
export default connect(profileState)(UpdateInsurance)

