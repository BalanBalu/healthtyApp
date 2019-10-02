import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, CheckBox, Row, Col, Left, Right, Picker, Body, Icon, Card, Input, Toast, View } from 'native-base';
import { userFiledsUpdate } from '../../providers/auth/auth.actions';
import { AsyncStorage, ScrollView } from 'react-native';
import { connect } from 'react-redux'
import styles from './style.js';
import Spinner from '../../../components/Spinner';



class UpdateContact extends Component {
    numberCategory = ['Home', 'Emergency']

    constructor(props) {
        super(props)
        this.state = {
            type: null,
            mobile_no: '',
            active: true,
            primary_mobile_no: '',
            isLoading: false,
            userData: '',
            primaryMobileNoText: ''
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
        if (userData.secondary_mobiles) {
            this.setState({
                type: userData.secondary_mobiles[0].type,
                mobile_no: userData.secondary_mobiles[0].number,
                active: userData.secondary_mobiles[0].active,
                userData
            })
        }

    }
    commonUpdateContactMethod = async () => {
        const { mobile_no, userData, primary_mobile_no } = this.state
        try {
            this.setState({ isLoading: true })
            let userId = await AsyncStorage.getItem('userId');
            if (primary_mobile_no != userData.mobile_no || mobile_no != userData.secondary_mobiles[0].number) {
            let data = {
                mobile_no: primary_mobile_no,
                secondary_mobiles: [
                    {
                        type: "Secondary",
                        number: mobile_no,
                        active: true
                    }]
            };
            if (data.mobile_no != data.secondary_mobiles[0].number) {
                let response = await userFiledsUpdate(userId, data);

                if (response.success) {
                    Toast.show({
                        text: response.message,
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
                this.setState({ isLoading: false })
            } else {
                Toast.show({
                    text: 'Cannot have the same mobile_no. Kindly enter a new number',
                    type: "danger",
                    duration: 3000
                })
            }
        }
            else {
                this.props.navigation.navigate('Profile');
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    validateMobile_No(number, type) {
        const regex = new RegExp('^[0-9]+$')  //Support only numbers
        if (type === 'Primary') {
            this.setState({ primary_mobile_no: number })
        }
        else {
            this.setState({ mobile_no: number })
        }
        if (regex.test(number) === false) {
            if (number != '') {
                Toast.show({
                    text: 'The entered number is invalid',
                    type: "danger",
                    duration: 3000
                });
            }
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
                                        <Text>Primary Mobile_no</Text>
                                        <Row>
                                            <Icon name="call" style={styles.centeredIcons}></Icon>
                                            <Input placeholder="Edit Your Number" style={styles.transparentLabel} keyboardType="numeric"
                                                onChangeText={number => this.validateMobile_No(number, 'Primary')}
                                                value={String(this.state.primary_mobile_no)}
                                                testID='updatePrimaryContact' />
                                        </Row>
                                    </Col>

                                </Item>

                                <Item style={{ borderBottomWidth: 0, marginTop: 10 }}>
                                    <Col>
                                        <Text>Secondary Mobile_no</Text>
                                        <Row>
                                            <Icon name='call' style={styles.centeredIcons}></Icon>
                                            <Input placeholder="Edit Your Number" style={styles.transparentLabel} keyboardType="numeric"
                                                onChangeText={number => this.validateMobile_No(number, 'Secondary')}
                                                value={String(this.state.mobile_no)}
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

