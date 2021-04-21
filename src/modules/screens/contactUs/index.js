import React, { Component } from 'react';
import { Container, Content, Form, Text, View, Picker, Toast,Input } from 'native-base'
import { TextInput, TouchableOpacity, Modal, AsyncStorage, ScrollView } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import styles from './styles'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getCorporateHelpLineEmail, postContactDetails } from '../../providers/corporate/corporate.actions'
import { toastMeassage,validateEmailAddress } from '../../common'
import {translate} from '../../../setup/translator.helper'
const issueTypeList = ["Choose Issue type", "payment", "consultation", "insurance", "others"]

class ContactUs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            descriptionVisible: false,
            helpLineEmailData: [],
            userName: '',
            email: '',
            messageText: '',
            isloading: false,
            issueType: '',
            userNameError: '',
            emailErrorMsg: '',
            messageErrorMsg: '',
            issueTypeErrorMsg: null


        }
    }

     componentDidMount() {
        this.getBasicData()
        this.getCorporatePhoneNumber()

    }

    async getBasicData() {
        const basicProfileData = await AsyncStorage.getItem('basicProfileData');
        const basicData = JSON.parse(basicProfileData);
        const data = { basicData }
        await this.setState({
            userName: `${data.basicData.first_name + " " + data.basicData.last_name}`,
            email: data.basicData.email,
            userNameError: null,
            emailErrorMsg: null,
            messageErrorMsg: null,
            issueTypeErrorMsg: null

        })
    }

    insertContactInformation = async () => {
        try {
            // if ((this.state.userName === '') || (this.state.email === '') || (this.state.messageText === '') || (this.state.issueType === '' || this.state.issueType === 'Choose Issue type')) {
            //     Toast.show({
            //         text: 'Kindly fill all the fields',
            //         type: 'danger',
            //         duration: 3000
            //     });
            // }
            if (this.state.userName === '') {
                this.setState({ userNameError: translate('Kindly enter your name') });
                this.scrollViewRef.scrollTo({
                    y: this.userNameText.y,
                    animated: true
                });
                return false;
            }
            if (this.state.email==='') {   
                this.setState({ emailErrorMsg: translate('Kindly enter your email') });
                this.scrollViewRef.scrollTo({
                    y: this.emailText.y,
                    animated: true
                });
                return false;
            }
            if (validateEmailAddress(this.state.email)===false) {   
                this.setState({ emailErrorMsg: translate('Please enter a valid email address') });
                this.scrollViewRef.scrollTo({
                    y: this.emailText.y,
                    animated: true
                });
                return false;
            }

            if (this.state.issueType === '' || this.state.issueType === 'Choose Issue type') {
                this.setState({ issueTypeErrorMsg: translate('Kindly select issue type') });
                this.scrollViewRef.scrollTo({
                    y: this.issueType.y,
                    animated: true
                });
                return false;
            }
            if (this.state.messageText === '') {
                this.setState({ messageErrorMsg: translate('Kindly enter message') });
                this.scrollViewRef.scrollTo({
                    y: this.messageText.y,
                    animated: true
                });
                return false;
            }

            const { userName, email, messageText, issueType } = this.state
            let data = {
                userName: userName,
                email: email,
                comment: messageText,
                status: "DRAFT",
                issueType: issueType
            }
            let result = await postContactDetails(data)
            if (result) {
                this.setState({ descriptionVisible: true, messageText: null })
            }
            else {
                toastMeassage(translate('Unable to Submit Helpline information'), 'danger', 3000)
            }
        } catch (ex) {
            console.log(ex)
        }
    }

    getCorporatePhoneNumber = async () => {
        try {
            let result = await getCorporateHelpLineEmail();
            await this.setState({ helpLineEmailData: result[0] })
        }
        catch (ex) {
            console.log(ex)
        }
    }
    popUpClose() {
        this.props.navigation.navigate('CorporateHome');
        this.setState({ descriptionVisible: false })

    }
    render() {
        const { helpLineEmailData } = this.state
        return (

            <Container >
                <Content contentContainerStyle={{ padding: 15, }}>
                    <ScrollView style={styles.body} ref={ref => (this.scrollViewRef = ref)}>
                        <View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.HeadingText}>{translate("Feel free to contact us if you need help")}</Text>
                                <View>
                                    <Form>
                                        <Text style={styles.subHeadingText}
                                            onLayout={event =>
                                                (this.userNameText = event.nativeEvent.layout)
                                            }>{translate("Name")}</Text>
                                        <TextInput placeholder={translate("Enter Name")}
                                            placeholderTextColor={"#909090"}
                                            onChangeText={text => this.setState({ userName: text, userNameError: null })}
                                            value={this.state.userName}
                                            style={this.state.userNameError !== null ? styles.textInputWithBorderStyle : styles.textInputStyle} />
                                        {this.state.userNameError !== null ?
                                            <Text style={{ color: 'red', marginRight: 0, marginTop: 10, textAlign: 'right', position: 'absolute', right: 0, top: 70 }}>{this.state.userNameError}</Text>
                                            : null}
                                        <Text style={styles.subHeadingText}
                                            onLayout={event =>
                                                (this.emailText = event.nativeEvent.layout)
                                            }>{translate("Email")}</Text>
        
                                             <Input
                                                  placeholder={translate("Enter Email")}
                                                  style={this.state.emailErrorMsg !== null ? styles.textInputWithBorderStyle : styles.textInputStyle} 
                                                  placeholderTextColor={"#909090"}
                                                  keyboardType={'email-address'}
                                                  onChangeText={text => this.setState({ email: text, emailErrorMsg: null })}
                                                  underlineColorAndroid="transparent"
                                                  blurOnSubmit={false}
                                                  value={this.state.email}
                                              />
                                        {this.state.emailErrorMsg !== null ?
                                            <Text style={{ color: 'red', marginRight: 0, marginTop: 10, textAlign: 'right', position: 'absolute', right: 0, top: 150 }}>{this.state.emailErrorMsg}</Text>
                                            : null}
                                        <Text style={styles.subHeadingText}
                                            onLayout={event =>
                                                (this.IssueTypeText = event.nativeEvent.layout)
                                            }>{translate("Select Issue Type")}</Text>

                                        <View style={this.state.issueTypeErrorMsg !== null ? styles.formStyle6ErrorMsg : styles.formStyle6}>
                                            <Picker style={styles.userDetailLabel}
                                                mode="dropdown"

                                                placeholderStyle={{ fontSize: 16, marginLeft: -5 }}
                                                // iosIcon={<Icon name="ios-arrow-down" style={{ color: 'gray', fontSize: 20, marginLeft: 170 }} />}
                                                textStyle={{ color: "gray", left: 0, marginLeft: -5 }}
                                                note={false}
                                                itemStyle={{
                                                    paddingLeft: 10,
                                                    fontSize: 16,
                                                }}
                                                itemTextStyle={{ color: '#5cb85c', }}
                                                style={{ width: undefined, color: '#000' }}
                                                onValueChange={(sample) => { this.setState({ issueType: sample, issueTypeErrorMsg: null }) }}
                                                selectedValue={this.state.issueType}
                                                testID="issueTypeList"
                                            >
                                                {issueTypeList.map((value, key) => {
                                                    return <Picker.Item label={String(value)} value={String(value)} key={key}
                                                    />
                                                })
                                                }
                                            </Picker>
                                            {this.state.issueTypeErrorMsg !== null ?
                                                <Text style={{ color: 'red', marginRight: 0, marginTop: 10, textAlign: 'right', position: 'absolute', right: 0, top: 25 }}>{this.state.issueTypeErrorMsg}</Text>
                                                : null}
                                        </View>
                                        <Text style={styles.subHeadingText}
                                            onLayout={event =>
                                                (this.messageText = event.nativeEvent.layout)
                                            }>{translate("Message")}</Text>
                                        <TextInput placeholder={translate("Enter Message")}
                                            textAlignVertical={'top'} placeholderTextColor={"#909090"}
                                            onChangeText={text => this.setState({ messageText: text, messageErrorMsg: null })}
                                            value={this.state.messageText}
                                            multiline={true}
                                            style={this.state.messageErrorMsg !== null ? styles.messageTextErrorInputStyle : styles.messageTextInputStyle} />
                                        {this.state.messageErrorMsg !== null ?
                                            <Text style={{ color: 'red', marginRight: 0, marginTop: 10, textAlign: 'right', position: 'absolute', right: 0, top: 485 }}>{this.state.messageErrorMsg}</Text>
                                            : null}
                                        <TouchableOpacity style={styles.submitButton} onPress={this.insertContactInformation}>
                                            <Text style={{ fontSize: 15, fontWeight: 'opensans-bold', color: '#fff' }}>{translate("Submit")}</Text>
                                        </TouchableOpacity>
                                    </Form>
                                </View>
                            </View>
                            <Modal
                                visible={this.state.descriptionVisible}
                                transparent={true}
                                animationType={'fade'}
                            >
                                <View style={styles.modalFirstView}>
                                    <View style={styles.modalSecondView}>

                                        <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={styles.modalHeading}>{translate("Thank for contacting")} {'\n'}{translate("with us!")} </Text>
                                        </Row>
                                        <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                            <Col>
                                                <Text style={styles.modalSubText}>{translate("We will be back soon to your email")} :</Text>
                                                <Text style={styles.emailSubText}>{helpLineEmailData.value ? helpLineEmailData.value : ' '}</Text>
                                            </Col>
                                        </Row>


                                        <Row style={{ marginTop: 15, justifyContent: 'flex-end', marginBottom: 5 }}>

                                            <Col size={10}>
                                                <TouchableOpacity danger style={styles.backToHomeButton} onPress={() => this.popUpClose()} testID='cancelButton'>
                                                    <Text style={styles.backToHomeButtonText}> {translate('Back to Home')}</Text>
                                                </TouchableOpacity>
                                            </Col>
                                        </Row>
                                    </View>

                                </View>
                            </Modal>
                        </View>
                    </ScrollView>
                </Content>
            </Container>


        );
    }
}

export default ContactUs;