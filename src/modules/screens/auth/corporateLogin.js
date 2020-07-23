import React, { PureComponent } from 'react';
import {
    Container, Content, Button, Text, Item, Icon, CheckBox, Card, H3, Toast, Form, View, Radio, Input,
    Label
} from 'native-base';
import styles from '../../screens/auth/styles'
import { getAllCompanyList } from '../../providers/auth/auth.actions'
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { AsyncStorage, ScrollView, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import OTPTextInput from 'react-native-otp-textinput';
const mainBg = require('../../../../assets/images/MainBg.jpg');



class SmartHealthLogin extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            companyData: []

        }
    }
    componentDidMount() {
        this.getCompanyList();
    }
    async getCompanyList() {
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
            alert(JSON.stringify(companyData))
            this.setState({ data: result, companyData })
        }

    }

    render() {
        const { test, addedDatas, companyData } = this.state
        return (
            <Container style={styles.container}>
                <ImageBackground source={mainBg} style={{ width: '100%', height: '100%', flex: 1 }}>
                    <Content contentContainerStyle={styles.authBodyContent}>
                        <ScrollView>

                            <Text uppercase={true}
                                style={[styles.welcome, { color: '#fff' }]}>Smart Health </Text>

                            <Card style={{ borderRadius: 10, padding: 5, marginTop: 20 }}>
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
                                                                items={this.state.companyData}
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
                                                                selectedItems={this.state.companyData}
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
                                                onChangeText={userEntry => this.setState({ userEntry })}
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
                                            handleTextChange={(text)=> {
                                                this.setState({ otpInput : text})
                                             }}
                                        />                       
                                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                                            <TouchableOpacity small
                                                style={styles.loginButton1}
                                            >
                                                <Text uppercase={true} style={styles.ButtonText}>Submit </Text>
                                            </TouchableOpacity>
                                            {/* <Text style={{ color: 'red', fontSize: 15, fontFamily: 'OpenSans', marginTop: 2 }}>{loginErrorMsg}</Text> */}
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