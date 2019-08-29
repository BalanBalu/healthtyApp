import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, View, CheckBox, Left, Right, Thumbnail, Body, Icon, Card, Input, Toast, Row } from 'native-base';
import { AsyncStorage } from 'react-native';
import { updateNewPassword } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import styles from './style.js'
import Spinner from '../../../components/Spinner';
import { Col } from 'react-native-easy-grid';



class UpdatePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            oldPassword: '',
            newPassword: '',
            showOldPassword: true,
            showNewPassword: true,
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

                <Content style={styles.bodyContent} contentContainerStyle={{ justifyContent: 'center', }}>
                    <ScrollView>
                        <Spinner color='blue'
                            visible={this.state.isLoading}
                            textContent={'Please wait updating...'}
                        />


                        <Text style={{ fontFamily: 'OpenSans', marginLeft: 7, marginTop: 100, fontWeight: 'bold', fontSize: 22 }}>Update Your Password</Text>
                        {/* <Text style={{ color: 'gray', fontSize: 13, fontFamily: 'OpenSans', marginTop: 10, marginLeft: 7 }}>Update your Password</Text> */}
                        <Card style={{ padding: 10, borderRadius: 10, marginTop: 20 }}>

                            <Item style={{ borderBottomWidth: 0 }}>
                                <Col style={{ width: '20%' }}>
                                    <Icon name="briefcase" style={styles.centeredIcons}></Icon>
                                </Col>
                                <Col style={{ width: '80%' }}>

                                    <Input placeholder="Enter old password"
                                        secureTextEntry={true} style={styles.transparentLabel}
                                        keyboardType="default"
                                        value={this.state.oldPassword}
                                        secureTextEntry={this.state.showOldPassword}
                                        onChangeText={(oldPassword) => this.setState({ oldPassword })}
                                        testID='enterOldPassword' />
                                </Col>
                                <Right>
                                    <Icon active name="eye" style={{ position: 'absolute', marginTop: -10, fontSize: 20, }} onPress={() => this.setState({ showOldPassword: !this.state.showOldPassword })} />
                                </Right>

                            </Item>



                            <Item style={{ borderBottomWidth: 0 }}>
                                <Col style={{ width: '20%' }}>
                                    <Icon name="briefcase" style={styles.centeredIcons}></Icon>
                                </Col>
                                <Col style={{ width: '80%' }}>
                                    <Input placeholder="Enter new password" secureTextEntry={true}
                                        style={styles.transparentLabel}
                                        keyboardType="default"
                                        value={this.state.newPassword}
                                        secureTextEntry={this.state.showNewPassword}
                                        onChangeText={(newPassword) => this.setState({ newPassword })}
                                        testID='enterNewPassword' />

                                </Col>
                                <Right>
                                    <Icon active name="eye" style={{ position: 'absolute', marginTop: -10, fontSize: 20, }} onPress={() => this.setState({ showNewPassword: !this.state.showNewPassword })} />

                                </Right>

                            </Item>


                            <Item style={{ borderBottomWidth: 0 }}>
                                <Right>
                                    <Button success style={styles.updateButton} onPress={() => this.handlePasswordUpdate()} testID='clickUpdatePassword'>
                                        <Text uppercase={false} note style={{ color: '#fff', fontFamily: 'OpenSans' }}>Update</Text>
                                    </Button>
                                </Right>
                            </Item>


                        </Card>

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


