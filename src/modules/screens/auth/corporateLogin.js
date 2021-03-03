import React, { PureComponent } from 'react';
import {
    Container, Content, Button, Text, Item, Icon, CheckBox, Card, H3, Toast, Form, View, Radio, Input,
    Label
} from 'native-base';
import styles from '../../screens/auth/styles'
import { getAllCompanyList, verifyEmployeeDetails } from '../../providers/auth/auth.actions'
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { ScrollView, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import OTPTextInput from 'react-native-otp-textinput';
import Spinner from '../../../components/Spinner';
const mainBg = require('../../../../assets/images/MainBg.jpg');
import { onlySpaceNotAllowed } from '../../common';
import ModalPopup from '../../../components/Shared/ModalPopup';
import {primaryColor} from '../../../setup/config'



class SmartHealthLogin extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            companyData: [],
            data: [],
            authorizerCode: '',
            employeeCode: '',
            loginErrorMsg: '',
            isLoading: false



        }
    }
   
   
    async onSubmmit() {
        try {
            const { authorizerCode, employeeCode } = this.state;

            await this.setState({ loginErrorMsg: '', isLoading: true })




           if (onlySpaceNotAllowed(employeeCode) === false) {
                await this.setState({ loginErrorMsg: 'Please enter employee  code' });
                return false;
            }
            else if (onlySpaceNotAllowed(authorizerCode) === false) {

                await this.setState({ loginErrorMsg: 'Please enter authorizer code' });
                return false;
            }
            let verifyResult = await verifyEmployeeDetails(employeeCode, authorizerCode)
            if (verifyResult) {
                if (Array.isArray(verifyResult) && verifyResult.length !== 0) {
                    let obj = {
                        employeeCode: employeeCode,
                        authorizerCode: authorizerCode,
                        ...verifyResult[0]
                    }
                    Toast.show({
                        text: 'Verified Successfully, Please Complete your Registration',
                        type: 'success',
                        duration: 3000
                    })
                    this.props.navigation.navigate('signup', { corporateData: obj })
                } else {
                    this.setState({ errorMsg: 'Invalid  Credential', isModalVisible: true })
                }
            }
            this.setState({ isLoading: false })
        } catch (e) {
            console.log(e)
        } finally {
            this.setState({ isLoading: false })
        }
    }

    render() {
        const { test, addedDatas, companyData, loginErrorMsg, isLoading, errorMsg, isModalVisible } = this.state
        return (
            <Container style={styles.container}>
                <ImageBackground source={mainBg} style={{ width: '100%', height: '100%', flex: 1 }}>
                    <Content contentContainerStyle={styles.authBodyContent}>
                        <ModalPopup
                            errorMessageText={errorMsg}
                            closeButtonText={'CLOSE'}
                            closeButtonAction={() => this.setState({ isModalVisible: !isModalVisible })}
                            visible={isModalVisible} />
                        <ScrollView>

                            <Text uppercase={true}
                                style={[styles.welcome, { color: '#fff' }]}>Smart Health </Text>

                            <Card style={{ borderRadius: 10, padding: 5, marginTop: 20 }}>

                                <Spinner
                                    visible={isLoading}
                                />
                                <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 15 }}>
                                    <Text uppercase={true} style={[styles.cardHead, { color: primaryColor }]}>Login</Text>
                                    <Form>

                                        <Label style={{ marginTop: 20, fontSize: 15, color: primaryColor, fontWeight: 'bold' }}>Employee Code</Label>
                                        <Item style={{ borderBottomWidth: 0, marginLeft: 'auto', marginRight: 'auto', marginTop: 10 }}>
                                            <Input placeholder="Enter Employee Code" style={styles.authTransparentLabel}
                                                placeholderTextColor={'#909090'}
                                                returnKeyType={'next'}
                                                keyboardType={"default"}
                                                onChangeText={employeeCode => this.setState({ employeeCode })}
                                                autoCapitalize='none'
                                                blurOnSubmit={false}
                                            />
                                        </Item>
                                        <Label style={{ marginTop: 20, fontSize: 15, color: primaryColor, fontWeight: 'bold' }}>Authorizer Code</Label>

                                        <OTPTextInput
                                            ref={e => (this.otpInput = e)}
                                            inputCount={4}
                                            tintColor={primaryColor}
                                            inputCellLength={1}
                                            handleTextChange={(text) => {
                                                this.setState({ authorizerCode: text })
                                            }}
                                        />
                                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                                            <TouchableOpacity small
                                                style={styles.loginButton1} onPress={() => this.onSubmmit()}
                                            >
                                                <Text uppercase={true} style={styles.ButtonText}>Submit </Text>
                                            </TouchableOpacity>
                                            <Text style={{ color: 'red', fontSize: 15, fontFamily: 'OpenSans', marginTop: 2 }}>{loginErrorMsg}</Text>
                                        </View>

                                    </Form>
                                </View>
                            </Card>
                        </ScrollView>
                    </Content>
                </ImageBackground>
            </Container>
        )
    }
}

export default SmartHealthLogin