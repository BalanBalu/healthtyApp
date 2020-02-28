import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, Col, CheckBox, Left, Right, Thumbnail, Body, Icon, Card, Input, Toast, View, Row } from 'native-base';
import { userEmailUpdate } from '../../providers/auth/auth.actions';
import { AsyncStorage, ScrollView } from 'react-native';
import { connect } from 'react-redux'
import styles from './style.js';
import Spinner from '../../../components/Spinner';
import { validateEmailAddress } from '../../common';




class UpdateEmail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: null,
            isLoading: false,
            errorMsg: '',

        }
    }

    componentDidMount() {
        this.bindEmailValues();
    }

    bindEmailValues() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        if (userData.email) {
            this.setState({
                email: userData.email,
            })
        }

    }

    handleEmailUpdate = async () => {
        try {
            if (validateEmailAddress(this.state.email) == false) {
                this.setState({ errorMsg: 'Kindly enter valid mail id' })
                return false;
            }
            this.setState({ errorMsg: '', isLoading: true });
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                email: this.state.email
            };

            let response = await userEmailUpdate(userId, data);
            if (response.success) {
                Toast.show({
                    text: 'Your email id is updated successfully',
                    type: "success",
                    duration: 3000,

                })
                let loginData = {
                    userEntry: this.state.email,
                    type: 'user'
                }
                this.props.navigation.navigate('renderOtpInput', { loginData: loginData, fromProfile: true });
            } else {
                Toast.show({
                    text: response.message,
                    type: "danger",
                    duration: 3000
                })

            }

        } catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }



    render() {
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.bodyContent}>
                    <ScrollView>

                        <View style={{ marginTop: 30 }}>
                            <Text style={styles.headerText}>Email</Text>

                            <Card style={styles.cardEmail}>

                                <Item style={{ borderBottomWidth: 0, marginTop: 12, marginLeft: 4 }}>
                                    <Text style={{ color: 'gray', fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, marginLeft: 7 }}>Update your email</Text>
                                </Item>

                                <Item style={{ borderBottomWidth: 0, }}>
                                    <Icon name='mail' style={styles.centeredIcons}></Icon>
                                    <Input placeholder="Edit Your Email" style={styles.transparentLabel} keyboardType="email-address"
                                        onChangeText={(email) => this.setState({ email })}
                                        value={this.state.email}
                                        testID='updateEmail' />
                                </Item>

                                <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{this.state.errorMsg}</Text>

                                {this.state.isLoading ? <Spinner color='blue'
                                    visible={this.state.isLoading}
                                    textContent={'Please wait Loading'}
                                /> : null}

                                <Item style={{ borderBottomWidth: 0, justifyContent: 'center', marginTop: 35 }}>
                                    <Row style={{ width: '100%' }}>
                                        <Right>
                                            <Button success style={styles.button2} onPress={() => this.handleEmailUpdate()} testID='clickUpdateEmail' >
                                                <Text style={styles.buttonText}>Update</Text>
                                            </Button>
                                        </Right>
                                    </Row>
                                </Item>
                            </Card>
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
export default connect(profileState)(UpdateEmail)

