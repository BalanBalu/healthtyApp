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
            type: 'Home',
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
        try {
            this.setState({ isLoading: true })
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                mobile_no: this.state.primary_mobile_no,
                secondary_mobiles: [
                    {
                        type: this.state.type,
                        number: this.state.mobile_no,
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
            }}
        catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
        }


    handleContactUpdate = async () => {
            const { mobile_no, type, userData, primary_mobile_no } = this.state
            try {
                this.setState({ isLoading: true })
                if (primary_mobile_no !== undefined && userData.secondary_mobiles !== undefined && this.validateMobile_No() === true) {
                    if (primary_mobile_no != userData.mobile_no || type != userData.secondary_mobiles[0].type || mobile_no != userData.secondary_mobiles[0].number) {
                        this.commonUpdateContactMethod();
                    } else {
                        this.props.navigation.navigate('Profile');
                    }
                } else if (this.validateMobile_No() === true) {
                    this.commonUpdateContactMethod();
                }
            } catch (e) {
                console.log(e);
            }
            finally {
                this.setState({ isLoading: false })

            }
        }

        validateMobile_No() {
            const regex = new RegExp('^[0-9]+$')  //Support only numbers
            if (regex.test(this.state.mobile_no) === false || regex.test(this.state.primary_mobile_no) === false) {
                //this.setState({ updateButton: true });

                if (this.state.mobile_no != '' || this.state.primary_mobile_no) {
                    Toast.show({
                        text: 'The entered number is invalid',
                        type: "danger",
                        duration: 3000
                    });
                }
                return false;
            } else {
                return true;
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
                                                    onChangeText={(primary_mobile_no) => this.setState({ primary_mobile_no })}
                                                    value={String(this.state.primary_mobile_no)}
                                                    testID='updatePrimaryContact' />
                                            </Row>
                                        </Col>

                                    </Item>
                                    <Item style={{ borderBottomWidth: 0 }}>

                                        <Picker style={{ fontFamily: 'OpenSans' }}
                                            mode="dropdown"
                                            iosIcon={<Icon name="arrow-down" />}
                                            textStyle={{ color: "#775DA3", backgroundColor: "gray", }}
                                            itemStyle={{
                                                backgroundColor: "gray",
                                                marginLeft: 0,
                                                paddingLeft: 10
                                            }}
                                            itemTextStyle={{ color: '#788ad2' }}
                                            style={{ width: 25 }}
                                            onValueChange={val => this.setState({ type: val })}
                                            selectedValue={String(this.state.type)}
                                        >
                                            {this.numberCategory.map((type, key) => {
                                                return <Picker.Item label={String(type)} value={String(type)} key={key}
                                                    testID='pickType' />
                                            })}

                                        </Picker>
                                    </Item>


                                    <Item style={{ borderBottomWidth: 0 }}>
                                        <Icon name='call' style={styles.centeredIcons}></Icon>
                                        <Input placeholder="Edit Your Number" style={styles.transparentLabel} keyboardType="numeric"
                                            onChangeText={(mobile_no) => this.setState({ mobile_no })}
                                            value={String(this.state.mobile_no)}
                                            testID='updateContact' />
                                    </Item>




                                    <Item style={{ borderBottomWidth: 0, marginTop: 15 }}>
                                        <Right>
                                            <Button success style={styles.button2} onPress={() => this.handleContactUpdate()} testID='clickUpdateContact'>
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

