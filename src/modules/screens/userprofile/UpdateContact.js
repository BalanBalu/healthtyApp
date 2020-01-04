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
            userData: '',
            errorMsg: '',
            existingSecNumber: ''

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
                primary_mobile_no: userData.mobile_no,
            })
        }
        if (userData.secondary_mobile) {
            this.setState({
                secondary_mobile_no: userData.secondary_mobile,
                existingSecNumber: userData.secondary_mobile

            })
        }

    }
    commonUpdateContactMethod = async () => {
        const { secondary_mobile_no, existingSecNumber, primary_mobile_no } = this.state
        try {
            this.setState({ isLoading: true });

            if (primary_mobile_no == '') {
                this.setState({ errorMsg: 'Kindly enter your primary contact' })
                return false;
            }
            if (secondary_mobile_no == '') {
                this.setState({ errorMsg: 'Kindly enter your secondary contact number' })
                return false;
            }
            if (primary_mobile_no == secondary_mobile_no || existingSecNumber == secondary_mobile_no) {
                this.setState({ errorMsg: 'User details already exists' })
                return false;
            }
            if (validateMobileNumber(primary_mobile_no || secondary_mobile_no) == false) {
                this.setState({ errorMsg: 'Contact field must contain number' })
                return false;
            }

            this.setState({ errorMsg: '', isLoading: true });


            let userId = await AsyncStorage.getItem('userId');
            let data = {
                mobile_no: primary_mobile_no,
                secondary_mobile: secondary_mobile_no
            };
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
                                <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{this.state.errorMsg}</Text>




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

