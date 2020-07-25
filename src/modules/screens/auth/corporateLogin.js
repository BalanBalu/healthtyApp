import React, { PureComponent } from 'react';
import {
    Container, Content, Button, Text, Item, Icon, CheckBox, Card, H3, Toast, Form, View, Radio, Input,
    Label
} from 'native-base';
import styles from '../../screens/auth/styles'
import { getAllCompanyList, verifyEmployeeDetails } from '../../providers/auth/auth.actions'
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { AsyncStorage, ScrollView, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import OTPTextInput from 'react-native-otp-textinput';
import Spinner from '../../../components/Spinner';
const mainBg = require('../../../../assets/images/MainBg.jpg');
import { onlySpaceNotAllowed } from '../../common';
import ModalPopup from '../../../components/Shared/ModalPopup';



class SmartHealthLogin extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            companyData: [],
            data: [],
            SelectedCompanyData: [],
            authorizerCode: '',
            employeeCode: '',
            loginErrorMsg: '',
            isLoading: false



        }
    }
    componentDidMount() {
        this.getCompanyList();
    }
    async getCompanyList() {
        try {
            this.setState({ isLoading: true })
            let result = await getAllCompanyList()

            if (result) {

                const removeDupValuesInArray = [];
                const companyData = [];
                result.map(ele => {
                    if (!removeDupValuesInArray.includes(ele.entityName.toLowerCase())) {
                        removeDupValuesInArray.push(ele.entityName.toLowerCase());
                        companyData.push({ value: ele.entityName })
                    }

                })

                this.setState({ data: result, companyData, isLoading: false })
            }
        } catch (e) {
            console.log(e)

        } finally {
            this.setState({ isLoading: false })
        }

    }
    onSelectedStatusChange = async (item) => {

        this.setState({ SelectedCompanyData: item });

    };
    async onSubmmit() {
        try {
            const { authorizerCode, employeeCode, SelectedCompanyData } = this.state;

            await this.setState({ loginErrorMsg: '', isLoading: false })




            if (SelectedCompanyData.length === 0) {
                await this.setState({ loginErrorMsg: 'Please select componey' });
                return false;
            } else if (onlySpaceNotAllowed(employeeCode) === false) {
                await this.setState({ loginErrorMsg: 'Please enter employee  code' });
                return false;
            }
            else if (onlySpaceNotAllowed(authorizerCode) === false) {

                await this.setState({ loginErrorMsg: 'Please enter authorizer code' });
                return false;
            }
            let verifyResult = await verifyEmployeeDetails(SelectedCompanyData, employeeCode, authorizerCode)
            if (verifyResult) {
                if(Array.isArray(verifyResult)&&verifyResult.length!==0){
                let obj = {
                    company: SelectedCompanyData,
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
            }else{
                this.setState({errorMsg:'Invalid  Credential',isModalVisible:true})
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
        const { test, addedDatas, companyData, SelectedCompanyData, loginErrorMsg, isLoading ,errorMsg,isModalVisible} = this.state
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
                                    <Text uppercase={true} style={[styles.cardHead, { color: '#775DA3' }]}>Login</Text>
                                    <Form>

                                        <Label style={{ marginTop: 20, fontSize: 15, color: '#775DA3', fontWeight: 'bold' }}>Company Name</Label>
                                        <Row style={{ marginTop: 10, }}>
                                            <Col size={10}>
                                                <TouchableOpacity>
                                                    <Row >

                                                        <Col size={10} style={styles.multiSelectStyleCorporate}>
                                                            <SectionedMultiSelect
                                                                styles={{
                                                                    selectToggleText: {
                                                                        color: '#909090',
                                                                        fontSize: 14,
                                                                        height: 30,
                                                                        marginTop: 10,


                                                                    },
                                                                    chipIcon: {
                                                                        color: '#909090',
                                                                    },

                                                                }}
                                                                items={companyData}
                                                                uniqueKey='value'
                                                                displayKey='value'
                                                                selectText='Select Company Name'
                                                                selectToggleText={{ fontSize: 10, }}
                                                                searchPlaceholderText='Search Your Languages'
                                                                modalWithTouchable={true}
                                                                showDropDowns={true}
                                                                hideSearch={false}
                                                                showRemoveAll={true}
                                                                showChips={false}
                                                                readOnlyHeadings={false}
                                                                onSelectedItemsChange={this.onSelectedStatusChange}
                                                                selectedItems={SelectedCompanyData}
                                                                colors={{ primary: '#18c971' }}
                                                                showCancelButton={true}
                                                                animateDropDowns={true}
                                                                selectToggleIconComponent={
                                                                    <Icon
                                                                        name="ios-arrow-down"
                                                                        style={{
                                                                            fontSize: 20,
                                                                            marginHorizontal: 6,
                                                                            color: '#909090',
                                                                            textAlign: 'center',
                                                                            marginTop: 10,
                                                                        }}
                                                                    />
                                                                }

                                                                testID='languageSelected'
                                                            />
                                                        </Col>
                                                    </Row>
                                                </TouchableOpacity>
                                            </Col>
                                        </Row>


                                        <Label style={{ marginTop: 20, fontSize: 15, color: '#775DA3', fontWeight: 'bold' }}>Employee Code</Label>
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
                                        <Label style={{ marginTop: 20, fontSize: 15, color: '#775DA3', fontWeight: 'bold' }}>Authorizer Code</Label>

                                        <OTPTextInput
                                            ref={e => (this.otpInput = e)}
                                            inputCount={4}
                                            tintColor={'#775DA3'}
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