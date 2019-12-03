import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Header, Footer,
    FooterTab, Icon, Right, Body, Left, CheckBox, Radio, H3, H2, H1, Toast,Card,Label
} from 'native-base';
import { login, signUp } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { StyleSheet, Image, View ,TouchableOpacity,ImageBackground} from 'react-native';
import styles from '../../screens/auth/styles';
import Spinner from '../../../components/Spinner';
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
            conditionCheckErrorMsg: '',
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
        const { checked } = this.state;
        return (

            <Container style={styles.container}>
             <ImageBackground source={require('../../../../assets/images/MainBg.jpg')} style={{width: '100%', height: '100%'}}>

                <Content contentContainerStyle={styles.authBodyContent}>
                   
                    <View >
                        <Text style={[styles.signUpHead,{color:'#fff'}]}>List Your Practice to Reach millions of Peoples</Text>
                        <Card style={{borderRadius:10,padding:5,marginTop:20}}>
                        <View style={{marginLeft:10,marginRight:10}}>
                          <Text uppercase="true" style={[styles.cardHead,{color:'#775DA3'}]}>Signup</Text>
                        <Form>
                        <Label style={{marginTop: 20,fontSize:15,color:'#775DA3',fontWeight:'bold'}}>Email / Phone</Label>
                            <Item style={{ borderBottomWidth: 0,marginLeft:'auto',marginRight:'auto' }}>
                                <Input placeholder="Email Or Phone" style={styles.authTransparentLabel}
                                    returnKeyType={'next'}
                                    keyboardType={'email-address'}
                                    value={this.state.userEmail}
                                    keyboardType={'email-address'}
                                    onChangeText={userEmail => this.setState({ userEmail })}
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.userEmail._root.focus(); }}
                                />
                            </Item>
                            <Label style={{fontSize:15,marginTop:10,color:'#775DA3',fontWeight:'bold'}}>Password</Label>

                            <Item  style={[styles.authTransparentLabel1,{marginTop:10,marginLeft:'auto',marginRight:'auto'}]}>
                                <Input placeholder="Password" style={{ fontSize: 15,paddingLeft: 15, }}
                                    ref={(input) => { this.userEmail = input; }}
                                    returnKeyType={'done'}
                                    value={this.state.password}
                                    secureTextEntry={this.state.showPassword}
                                    keyboardType={'default'}
                                    onChangeText={password => this.setState({ password })}
                                    blurOnSubmit={false}
                                    maxLength={16}
                                    onSubmitEditing={() => { this.doSignUp(); }} />

                                <Icon active name='eye' style={{ fontSize: 20,color:'#775DA3' }} onPress={() => this.setState({ showPassword: !this.state.showPassword })} />
                            </Item>
                            <View style={{ marginTop: 10, borderBottomWidth: 0, flexDirection:'row' }}>

                            <RadioButton.Group
                               onValueChange={value => this.setState({ gender: value }) }
                                value={this.state.gender}>
                                    <View style={{flexDirection:'row'}}>
                                  <RadioButton value="M"/>
                                  <Text style={{
                                         fontFamily: 'OpenSans',fontSize:15,marginTop:8
                                    }}>Male</Text> 
                                    </View> 
                                    <View style={{flexDirection:'row',marginLeft:20}}>
                                  <RadioButton value="F"  />
                                  <Text style={{
                                         fontFamily: 'OpenSans',fontSize:15,marginTop:8
                                    }}>Female</Text>  
                                    </View>
                                    <View style={{flexDirection:'row',marginLeft:20}}>
                                  <RadioButton value="O"  />
                                  <Text style={{
                                        fontFamily: 'OpenSans',fontSize:15,marginTop:8
                                    }}>Others</Text>  
                                      </View>
                             </RadioButton.Group>       
                                {/* <Radio selected={this.state.radioStatus[0]} onPress={() => this.toggleRadio("0", "M")} color={"#775DA3"}
                                    selectedColor={"#775DA3"} />
                                <Text style={{
                                    marginLeft: 10, fontFamily: 'OpenSans',fontSize:15
                                }}>Male</Text>

                                <Radio selected={this.state.radioStatus[1]} onPress={() => this.toggleRadio("1", "F")} style={{ marginLeft: 20 }} color={"#775DA3"}
                                    selectedColor={"#775DA3"} />
                                <Text style={{
                                    marginLeft: 40, fontFamily: 'OpenSans',fontSize:15
                                }}>Female</Text>

                                <Radio selected={this.state.radioStatus[2]} onPress={() => this.toggleRadio("2", "O")} style={{ marginLeft: 30 }} color={"#775DA3"}
                                    selectedColor={"#775DA3"} />
                                <Text style={{
                                    marginLeft: 40, fontFamily: 'OpenSans',fontSize:15
                                }}>Other</Text> */}
                            </View>


                            <Item style={{ borderBottomWidth: 0, marginTop: 5, marginLeft:'auto',marginRight:'auto'}}>
                                {/* <CheckBox checked={this.state.conditionCheck} color="green" style={{ borderRadius:5}} onPress={() => this.setState({ conditionCheck: !this.state.conditionCheck })} ></CheckBox> */}
                                <Checkbox  color="#775DA3" 
                                 status={checked ? 'checked' : 'unchecked'}
                                 onPress={() => { this.setState({ checked: !checked }); }}
                                  />
                                <Text style={{ marginLeft:2, color: 'gray', fontFamily: 'OpenSans', fontSize: 13, }}>I Accept the Medflic Terms And Conditions</Text>
                            </Item>

                            <Spinner color='blue'
                                visible={isLoading}
                                textContent={'Loading...'}
                            />
                     <View style={{alignItems:'center',justifyContent:'center',marginBottom:10}}>

                            <TouchableOpacity small style={styles.loginButton1} onPress={() => this.doSignUp()}>

                                <Text uppercase={true} style={styles.ButtonText}>Sign Up</Text>
                            </TouchableOpacity>
                            <Text style={{ color: 'red',fontSize:15,fontFamily:'OpenSans' }}>{this.state.conditionCheckErrorMsg} </Text>
                    </View>
                        </Form>
                        </View>
                 <Item style={{marginLeft:'auto',marginRight:'auto',borderBottomWidth:0,marginBottom:10}}>
              <Text uppercase={false} style={{ color: '#000', fontSize: 15, fontFamily: 'OpenSans',color:'#775DA3' }}>Already Have An Account ?</Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('login')} style={styles.smallSignUpButton}>
                            <Text uppercase={true} style={{ color: '#fff', fontSize: 10, fontFamily: 'OpenSans',fontWeight:'bold' }}>SignIn</Text>
              </TouchableOpacity>
              </Item>
                        </Card>
                        </View>
                 
                </Content>
               </ImageBackground>
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

