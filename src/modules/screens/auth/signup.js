import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Header, Footer,
    FooterTab, Icon, Right, Body, Left, CheckBox, Radio, H3, H2, H1, Toast, Spinner
} from 'native-base';
import { login, signUp } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { StyleSheet, Image, View } from 'react-native';
import styles from '../../screens/auth/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { RadioButton,Checkbox } from 'react-native-paper';

class Signup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userEmail: '',  //Enter both Email Or Mobile Number
            password: '',
            gender: 'M',
            radioStatus: [true, false, false],
            errorMsg: '',
            checked: false,
            showPassword: true
        }
    }
    toggleRadio = (radioSelect, genderSelect) => {
        let tempArray = [false, false, false];
        tempArray[radioSelect] = true;
        this.setState({ radioStatus: tempArray });
        this.setState({ gender: genderSelect });
    }
    doSignUp = async () => {
        try {
            if (this.state.checked === true) {
                let requestData = {
                    email: this.state.userEmail,
                    password: this.state.password,
                    gender: this.state.gender,
                    type: 'user'
                };
                let loginData = {
                    userEntry: this.state.userEmail,
                    password: this.state.password,
                    type: 'user'
                }

                await signUp(requestData);
                console.log(this.props.user);
                if (this.props.user.success) {
                    Toast.show({
                        text: this.props.user.message,
                        duration: 3000
                    });
                    await login(loginData);
                    if (this.props.user.isAuthenticated) {
                        this.props.navigation.navigate('userdetails')
                    } else {
                        Toast.show({
                            text: this.props.user.message,
                            duration: 3000
                        });
                    }
                } else {
                    Toast.show({
                        text: this.props.user.message,
                        duration: 3000
                    });
                    return
                }
            } else {
                this.setState({ conditionCheckErrorMsg: 'Kindly agree to the terms and conditions' });
            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const { user: { isLoading } } = this.props;
        const { userEmail, password,showPassword, checked, errorMsg } = this.state;
        return (

            <Container style={styles.container}>
                <Content contentContainerStyle={styles.bodyContent}>
                    <ScrollView>
                    <View >
                        <H3 style={styles.welcome}>List Your Practice to Reach millions of Peoples</H3>
                        <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.logo} />
                        <Form style={{ marginBottom: 50 }}>
                            
                            <Item style={{ borderBottomWidth: 0, marginTop: 20 }}>
                                <Input placeholder="Enter your Email " style={styles.transparentLabel}
                                    returnKeyType={'next'}
                                    keyboardType={'email-address'}
                                    value={userEmail}
                                    onChangeText={userEmail => this.setState({ userEmail })}
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.userEmail._root.focus(); }}
                                />
                            </Item>

                            <Item success style={styles.transparentLabel1}>
                                <Input placeholder="Password" style={{ fontSize: 15,paddingLeft: 20, }}
                                    ref={(input) => { this.userEmail = input; }}
                                    returnKeyType={'done'}
                                    value={password}
                                    secureTextEntry={showPassword}
                                    keyboardType={'default'}
                                    onChangeText={password => this.setState({ password })}
                                    // blurOnSubmit={false}
                                    maxLength={16}
                                     />
                                <Icon active name='eye' style={{ fontSize: 20 }} onPress={() => this.setState({ showPassword: !this.state.showPassword })} />
                            </Item>
                            <Item style={{ marginTop: 20, borderBottomWidth: 0, marginLeft: 20 }}>
                            <RadioButton.Group
                               onValueChange={value => this.setState({ gender: value }) }
                                value={this.state.gender}>
                                  <RadioButton value="M" />
                                  <Text style={{
                                        marginLeft: 10, fontFamily: 'OpenSans',fontSize:15
                                    }}>Male</Text>  
                                  <RadioButton value="F" />
                                  <Text style={{
                                        marginLeft: 10, fontFamily: 'OpenSans',fontSize:15
                                    }}>Female</Text>  
                                  <RadioButton value="O" />
                                  <Text style={{
                                        marginLeft: 10, fontFamily: 'OpenSans',fontSize:15
                                    }}>Others</Text>  
                                      
                             </RadioButton.Group>       
                            </Item>
                            <Item style={{ borderBottomWidth: 0, marginTop: 5, marginLeft: 20 }}>
                                <Checkbox  color="green" 
                                 status={checked ? 'checked' : 'unchecked'}
                                 onPress={() => { this.setState({ checked: !checked }); }}
                                  />
                                <Text style={{ marginLeft:5, color: 'gray', fontFamily: 'OpenSans', fontSize: 13, }}>I Accept the Medflic Terms And Conditions</Text>
                            </Item>
                            {isLoading ? <Spinner color='blue' /> : null}
                                <Button
                                    style={(userEmail && password) == '' ? styles.loginButtonDisable : styles.loginButton}
                                    block success disabled={(userEmail && password) == ''} onPress={() => this.doSignUp()}>
                                    <Text style={styles.ButtonText}>Sign Up</Text>
                                </Button>
                                <Text style={{ color: 'red', marginLeft: 15, marginTop: 10 }}>{errorMsg}</Text>
                        </Form>
                        </View>
                    </ScrollView>
                </Content>
                <Footer >
                    <FooterTab style={{ backgroundColor: '#F2F2F2', }}>
                        <Button full onPress={() => this.props.navigation.navigate('login')}>
                            <Text uppercase={false} style={{ color: '#000', fontSize: 15, fontFamily: 'OpenSans' }}>Already Have An Account ? SignIn</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>

        )




    }

}



function signUpState(state) {
    return {
        user: state.user
    }
}
export default connect(signUpState)(Signup)

