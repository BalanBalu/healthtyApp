import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List,Col, CheckBox, Left, Right, Thumbnail, Body, Icon, Card, Input, Toast, View, Row } from 'native-base';
import { userFiledsUpdate } from '../../providers/auth/auth.actions';
import { AsyncStorage, ScrollView } from 'react-native';
import { connect } from 'react-redux'
import styles from './style.js';
import Spinner from '../../../components/Spinner';
import { validateEmailAddress } from '../../common';




class UpdateEmail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            secondary_email: null,
            primary_email: null,
            isLoading: false,
            existingEmail: null,
            errorMsg: '',

        }
    }

    componentDidMount() {
        this.bindEmailValues();
    }

    bindEmailValues() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        this.setState({
            fromProfile: true,
            primary_email: userData.email,
        })
        if (userData.secondary_email) {
            this.setState({
                secondary_email: userData.secondary_email,
                existingEmail: userData.secondary_email
            })
        }

    }

    handleEmailUpdate = async () => {
        const { existingEmail, secondary_email, primary_email } = this.state
        try {
            if (validateEmailAddress(secondary_email) == false) {
                this.setState({ errorMsg: 'Kindly enter valid mail id' })
                return false;
            }
            if (existingEmail === secondary_email || primary_email === secondary_email) {
                this.setState({ errorMsg: 'Entered email id is already exist.Enter the new email id' })
                return false;
            }
            this.setState({ errorMsg: '', isLoading: true });
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                secondary_email: secondary_email
            };

            let response = await userFiledsUpdate(userId, data);
            if (response.success) {
                Toast.show({
                    text: 'Your email id is updated successfully',
                    type: "success",
                    duration: 3000,

                })
                this.props.navigation.navigate('Profile');
            } else {
                Toast.show({
                    text: 'The entered email is invalid',
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

                        <View>
                            {this.state.primary_email != null ? <Text style={styles.headerText}>Primary Email</Text> : null}
                            <Card style={styles.cardEmail}>
                                {this.state.primary_email != null ?
                                    <Row style={{ borderBottomWidth: 0 }}>
                                        <Col size={1.2}>
                                            <Icon name='mail' style={styles.centeredIcons}></Icon>
                                        </Col>
                                        <Col size={8.3}>
                                        <Text style={styles.customText}>{this.state.primary_email}</Text>
                                        </Col>
                                        <Col size={0.5}>
                                            <Icon style={{ color: 'gray', fontSize: 25 }} name='ios-lock' />
                                        </Col>
                                    </Row>
                                    : null}</Card>
                            <Text style={{ color: 'gray', fontSize: 16 }}>Primary email is not editable</Text>

                        </View>
                        <View style={{ marginTop: 30 }}>
                            <Text style={styles.headerText}>Secondary Email</Text>

                            <Card style={styles.cardEmail}>

                                <Item style={{ borderBottomWidth: 0, marginTop: 12, marginLeft: 4 }}>
                                    <Text style={{ color: 'gray', fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, marginLeft: 7 }}>Update your secondary email</Text>
                                </Item>

                                <Item style={{ borderBottomWidth: 0, }}>
                                    <Icon name='mail' style={styles.centeredIcons}></Icon>
                                    <Input placeholder="Edit Your Secondary Email" style={styles.transparentLabel} keyboardType="email-address"
                                        onChangeText={(secondary_email) => this.setState({ secondary_email })}
                                        value={this.state.secondary_email}
                                        testID='updateEmail' />
                                </Item>

                                <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{this.state.errorMsg}</Text>

                                {this.state.isLoading ? <Spinner color='blue'
                                    visible={this.state.isLoading}
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

