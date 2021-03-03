import React, { Component } from 'react';
import { Container, Content, Form, Text, View, Picker, Toast } from 'native-base'
import { TextInput, TouchableOpacity, Modal, AsyncStorage } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import styles from './styles'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getCorporateHelpLineEmail, postContactDetails } from '../../providers/corporate/corporate.actions'
import { toastMeassage } from '../../common'

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
            issueType: ''


        }
    }

    async componentDidMount() {
        await this.getBasicData()
        this.getCorporatePhoneNumber()

    }

    async getBasicData() {
        const basicProfileData = await AsyncStorage.getItem('basicProfileData');
        const basicData = JSON.parse(basicProfileData);
        const data = { basicData }
        await this.setState({
            userName: `${data.basicData.first_name + " " + data.basicData.last_name}`,
            email: data.basicData.email,

        })
    }

    insertContactInformation = async () => {
        try {
            if ((this.state.userName === '') || (this.state.email === '') || (this.state.messageText === '') || (this.state.issueType === '' || this.state.issueType === 'Choose Issue type')) {
                Toast.show({
                    text: 'Kindly fill all the fields',
                    type: 'danger',
                    duration: 3000
                });
            }
            else {
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
                    toastMeassage('Unable to Submit Helpline information', 'danger', 3000)
                }
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
                    <View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.HeadingText}>Feel free to contact us if you need help. </Text>
                            <View>
                                <Form>
                                    <Text style={styles.subHeadingText}>Name</Text>
                                    <TextInput placeholder="Enter Name"
                                        placeholderTextColor={"#909090"}
                                        onChangeText={text => this.setState({ userName: text })}
                                        value={this.state.userName}
                                        style={styles.textInputStyle} />
                                    <Text style={styles.subHeadingText}>Email</Text>
                                    <TextInput placeholder="Enter Email" placeholderTextColor={"#909090"}
                                        onChangeText={text => this.setState({ email: text })}
                                        value={this.state.email}
                                        style={styles.textInputStyle} />
                                    <Text style={styles.subHeadingText}>Selct Issue Type</Text>

                                    <View style={styles.formStyle6}>
                                        <Picker style={styles.userDetailLabel}
                                            mode="dropdown"

                                            placeholderStyle={{ fontSize: 16, marginLeft: -5 }}
                                            iosIcon={<Icon name="ios-arrow-down" style={{ color: 'gray', fontSize: 20, marginLeft: 170 }} />}
                                            textStyle={{ color: "gray", left: 0, marginLeft: -5 }}
                                            note={false}
                                            itemStyle={{
                                                paddingLeft: 10,
                                                fontSize: 16,
                                            }}
                                            itemTextStyle={{ color: '#5cb85c', }}
                                            style={{ width: undefined, color: '#000' }}
                                            onValueChange={(sample) => { this.setState({ issueType: sample }) }}
                                            selectedValue={this.state.issueType}
                                            testID="issueTypeList"
                                        >
                                            {issueTypeList.map((value, key) => {
                                                return <Picker.Item label={String(value)} value={String(value)} key={key}
                                                />
                                            })
                                            }
                                        </Picker>
                                    </View>
                                    <Text style={styles.subHeadingText}>Message</Text>
                                    <TextInput placeholder="Enter Message"
                                        textAlignVertical={'top'} placeholderTextColor={"#909090"}
                                        onChangeText={text => this.setState({ messageText: text })}
                                        value={this.state.messageText}
                                        multiline={true}
                                        style={styles.messageTextInputStyle} />

                                    <TouchableOpacity style={styles.submitButton} onPress={this.insertContactInformation}>
                                        <Text style={{ fontSize: 15, fontWeight: 'OpenSans', fontWeight: 'bold', color: '#fff' }}>Submit</Text>
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
                                    <Row style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: -30 }}>
                                        <TouchableOpacity onPress={() => this.setState({ descriptionVisible: false })}>
                                            <MaterialIcons name="close" style={{ fontSize: 30, color: 'red' }} />

                                        </TouchableOpacity>
                                    </Row>
                                    <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.modalHeading}>Thank you for updating your {'\n'} contact details</Text>
                                    </Row>
                                    <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                        <Col>
                                            <Text style={styles.modalSubText}>We will be back soon to your email :</Text>
                                            <Text style={styles.emailSubText}>{helpLineEmailData.value ? helpLineEmailData.value : ' '}</Text>
                                        </Col>
                                    </Row>


                                    <Row style={{ marginTop: 15, justifyContent: 'flex-end', marginBottom: 5 }}>

                                        <Col size={10}>
                                            <TouchableOpacity danger style={styles.backToHomeButton} onPress={() => this.popUpClose()} testID='cancelButton'>
                                                <Text style={styles.backToHomeButtonText}> {'Back to Home'}</Text>
                                            </TouchableOpacity>
                                        </Col>
                                    </Row>
                                </View>

                            </View>
                        </Modal>
                    </View>
                </Content>
            </Container>


        );
    }
}

export default ContactUs;