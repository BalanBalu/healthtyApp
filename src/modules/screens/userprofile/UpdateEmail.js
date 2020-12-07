import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, Col, CheckBox, Left, Right, Thumbnail, Body, Icon, Card, Input, Toast, View, Row } from 'native-base';
import { userEmailUpdate } from '../../providers/auth/auth.actions';
import { AsyncStorage, ScrollView } from 'react-native';
import { connect } from 'react-redux'
import styles from './style.js';
import Spinner from '../../../components/Spinner';
import { validateEmailAddress } from '../../common';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



let loginData;
class UpdateEmail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: null,
            isLoading: false,
            errorMsg: '',
            editable: true,
            primaryEmail: null

        }
    }
    componentDidMount() {
        this.bindEmailValues();

    }

    bindEmailValues = async () => {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        await this.setState({ primaryEmail: userData.email })

        if (userData.email) {
            await this.setState({
                emailVerified: userData.is_email_verified,
                editable: false
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

            let response = await userEmailUpdate(userId, data, 'user');
            if (response.success) {
                Toast.show({
                    text: 'Your email id is updated successfully',
                    type: "success",
                    duration: 3000,

                })
                loginData = {
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
    verifyEmail() {
        this.props.navigation.navigate('renderOtpInput', { loginData: loginData, fromProfile: true });
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
                                    <Text style={{ color: 'gray', fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, marginLeft: 7 }}>Primary Email</Text>
                                </Item>

                                <Item style={{ borderBottomWidth: 0, }}>
                                    <Icon name='mail' style={styles.centeredIcons}></Icon>
                                    <Input placeholder="Edit Your Email"
                                        editable={this.state.editable}
                                        style={styles.transparentLabel} keyboardType="email-address"
                                        onChangeText={(email) => this.setState({ email })}
                                        value={this.state.primaryEmail}
                                        testID='updateEmail' />
                                </Item>
                                <View style={{position:'absolute',top:70,right:20}}>
                                <MaterialIcons name='lock' style={{fontSize:20,color:'gray'}}></MaterialIcons>
                                </View>
                                {this.state.primaryEmail !== null ?
                                    <Text style={{ marginLeft: 7, color: 'gray', fontSize: 13 }}>Primary email is not editable</Text> : null}
                                <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{this.state.errorMsg}</Text>

                                {this.state.isLoading ? <Spinner color='blue'
                                    visible={this.state.isLoading}
                                /> : null}

                                <Item style={{ borderBottomWidth: 0, justifyContent: 'center', marginTop: 35 }}>
                                    <Row style={{ width: '100%' }}>
                                        <Right>
                                            {this.state.primaryEmail != null && (this.state.emailVerified || this.state.emailVerified) ?
                                                <Button success style={styles.button2} onPress={() => this.props.navigation.navigate('Profile')} testID='clickUpdateEmail' >
                                                    <Text style={styles.buttonText}>Back</Text>
                                                </Button> :
                                                this.state.primaryEmail != null && this.state.emailVerified == undefined ?
                                                    <Button success style={styles.button2} onPress={() => this.verifyEmail()} testID='clickUpdateEmail' >
                                                        <Text style={styles.buttonText}>Verify Email</Text>
                                                    </Button> :
                                                    <Button success style={styles.button2} onPress={() => this.handleEmailUpdate()} testID='clickUpdateEmail' >
                                                        <Text style={styles.buttonText}>Update</Text>
                                                    </Button>}
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

