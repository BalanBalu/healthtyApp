import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, View, CheckBox, Left, Right, Thumbnail, Body, Icon, Card, Input, Toast, Row } from 'native-base';
import { AsyncStorage, ScrollView } from 'react-native';
import { updateNewPassword } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import styles from './style.js'
import Spinner from '../../../components/Spinner';
import { Col } from 'react-native-easy-grid';



class UpdatePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            oldPassword: '',
            newPassword: '',
            oldPasswordVisible: true,
            newPasswordVisible: true,
            isLoading: false
        }
    }

    handlePasswordUpdate = async () => {
        try {
            this.setState({ isLoading: true });
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                type: 'user',
                userId: userId,
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword
            };
            if (data.oldPassword != data.newPassword) {
                let result = await updateNewPassword(data);
                console.log('result' + JSON.stringify(result));
                if (result.success) {
                    await Toast.show({
                        text: 'Your Password is changed Successfully',
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
            else {
                await Toast.show({
                    text: 'Cannot have the same password. Kindly enter a new Password',
                    type: "danger",
                    duration: 3000
                })
            }
            this.setState({ isLoading: false });

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

                <Content contentContainerStyle={styles.bodyContent1}>
                    <ScrollView>
                        <Spinner color='blue'
                            visible={this.state.isLoading}
                            textContent={'Please wait updating...'}
                        />


                        <Text style={styles.headerText}>Update Your Password</Text>
                        {/* <Text style={{ color: 'gray', fontSize: 13, fontFamily: 'OpenSans', marginTop: 10, marginLeft: 7 }}>Update your Password</Text> */}
                        <View style={styles.cardEmail}>

                            <Item style={{ borderBottomWidth: 0 }}>

                                <Icon name="briefcase" style={styles.centeredIcons}></Icon>

                                <Col style={styles.transparentLabel1}>
                                    <Row>
                                        <Input placeholder="Enter old password"
                                            secureTextEntry={true} style={{ fontSize: 13, fontFamily: 'OpenSans', marginTop: -5 }}
                                            keyboardType="default"
                                            value={this.state.oldPassword}
                                            secureTextEntry={this.state.oldPasswordVisible}
                                            onChangeText={(oldPassword) => this.setState({ oldPassword })}
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
                                        <Input placeholder="Enter new password"
                                            secureTextEntry={true} style={{ fontSize: 13, fontFamily: 'OpenSans', marginTop: -5 }}
                                            keyboardType="default"
                                            value={this.state.newPassword}
                                            secureTextEntry={this.state.newPasswordVisible}
                                            onChangeText={(newPassword) => this.setState({ newPassword })}
                                            testID='enterNewPassword'/> 
                                        {this.state.newPasswordVisible == true ?
                                            <Icon active name="ios-eye-off" style={{ fontSize: 25, marginTop: 10 }} onPress={() => this.setState({ newPasswordVisible: !this.state.newPasswordVisible })}
                                            /> : <Icon active name="ios-eye" style={{ fontSize: 25, marginTop: 10 }} onPress={() => this.setState({ newPasswordVisible: !this.state.newPasswordVisible })} />}

                                    </Row>
                                </Col>

                            </Item>


                            <Item style={{ borderBottomWidth: 0, marginTop: 10 }}>
                                <Right>
                                    <Button success style={styles.button2} onPress={() => this.handlePasswordUpdate()} testID='clickUpdatePassword'>
                                        <Text uppercase={false} note style={styles.buttonText}>Update</Text>
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


