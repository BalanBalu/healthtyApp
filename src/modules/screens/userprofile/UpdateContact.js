import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, CheckBox, Row, Col, Left, Right, Picker, Body, Icon, Card, Input, Toast, View } from 'native-base';
import { userFiledsUpdate } from '../../providers/auth/auth.actions';
import { AsyncStorage, ScrollView } from 'react-native';
import { connect } from 'react-redux'
import styles from './style.js';
import Spinner from '../../../components/Spinner';
import { validateMobileNumber } from '../../common'


class UpdateContact extends Component {
    numberCategory = ['Home', 'Emergency']

    constructor(props) {
        super(props)
        this.state = {
            secondary_mobile_no: '',
            active: true,
            primary_mobile_no: '',
            isLoading: false,
            userData: ''
        }
    }

    componentDidMount() {
        this.bindContactValues();

    }

    bindContactValues() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        if (userData.mobile_no) {
            this.setState({
                primary_mobile_no: userData.mobile_no
            })
        }
        if (userData.secondary_mobile) {
            this.setState({
                secondary_mobile_no: userData.secondary_mobile
            })
        }

    }
    commonUpdateContactMethod = async () => {
        const { secondary_mobile_no, userData, primary_mobile_no } = this.state
        try {
            this.setState({ isLoading: true })
            if (primary_mobile_no != '') {
                if (secondary_mobile_no != '') {

                    if (primary_mobile_no != secondary_mobile_no) {

                        let userId = await AsyncStorage.getItem('userId');
                        let data = {
                            mobile_no: primary_mobile_no,
                            secondary_mobile: secondary_mobile_no
                        };
                        if (validateMobileNumber(primary_mobile_no || secondary_mobile_no) == true) {

                            let response = await userFiledsUpdate(userId, data);
                            if (response.success) {
                                Toast.show({
                                    text: "Contacts has been saved",
                                    type: "success",
                                    duration: 3000,
                                })
                                this.props.navigation.navigate('Profile');
                            } else {
                                Toast.show({
                                    text: response.message,
                                    type: "danger",
                                    duration: 3000
                                })
                            }
                        } else {
                            Toast.show({
                                text: 'Contact field must contain number',
                                type: "danger",
                                duration: 3000
                            })
                        }
                    } else {
                        Toast.show({
                            text: 'User details already exists',
                            type: "danger",
                            duration: 3000
                        })
                    }
                }
                else {
                    Toast.show({
                        text: 'Kindly enter your secondary contact number',
                        type: "danger",
                        duration: 3000
                    })
                }
            } else {
                Toast.show({
                    text: 'Kindly enter your primary contact',
                    type: "danger",
                    duration: 3000
                })
            }
        }

        catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }



    render() {
        return (
            <Container style={styles.container}>
                <Spinner color='blue'
                    visible={this.state.isLoading}
                    textContent={'Please Wait Loading'}
                />

                <Content contentContainerStyle={styles.bodyContent1}>
                    <ScrollView>
                        <View style={{ marginTop: 10, padding: 10 }}>
                            <Text style={styles.headerText}>Update Mobile Number</Text>
                            <View style={styles.cardEmail}>

                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Col>
                                        <Text>Primary Mobile Number</Text>
                                        <Row>
                                            <Icon name="call" style={styles.centeredIcons}></Icon>
                                            <Input placeholder="Edit Your Number" style={styles.transparentLabel} keyboardType="numeric"
                                                onChangeText={number => this.setState({ primary_mobile_no: number })}
                                                value={String(this.state.primary_mobile_no)}
                                                testID='updatePrimaryContact' />
                                        </Row>
                                    </Col>

                                </Item>

                                <Item style={{ borderBottomWidth: 0, marginTop: 10 }}>
                                    <Col>
                                        <Text>Secondary Mobile Number</Text>
                                        <Row>
                                            <Icon name='call' style={styles.centeredIcons}></Icon>
                                            <Input placeholder="Edit Your Number" style={styles.transparentLabel} keyboardType="numeric"
                                                onChangeText={number => this.setState({ secondary_mobile_no: number })}
                                                value={String(this.state.secondary_mobile_no)}
                                                testID='updateContact' />
                                        </Row>
                                    </Col>
                                </Item>




                                <Item style={{ borderBottomWidth: 0, marginTop: 15 }}>
                                    <Right>
                                        <Button success style={styles.button2} onPress={() => this.commonUpdateContactMethod()} testID='clickUpdateContact'>
                                            <Text uppercase={false} note style={styles.buttonText}>Update</Text>
                                        </Button>
                                    </Right>
                                </Item>
                            </View>
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
export default connect(profileState)(UpdateContact)

