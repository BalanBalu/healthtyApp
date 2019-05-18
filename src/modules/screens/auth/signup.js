import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Header, Footer,
    FooterTab, Icon,Right, Body, Left, CheckBox, Radio, H3, H2, H1, Toast
} from 'native-base';
import { login,signUp } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { StyleSheet, Image, View } from 'react-native';
import styles from '../../screens/auth/styles';
import Spinner from '../../../components/Spinner';


class Signup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userEmail:'',  //Enter both Email Or Mobile Number
            password: '',
            gender: 'M',
            radioStatus: [true,false,false],
            conditionCheckErrorMsg: '',
            conditionCheck: false,
        }
    }
    toggleRadio = (radioSelect,genderSelect)=>{
        let tempArray = [false,false,false];
        tempArray[radioSelect] = true; 
        this.setState({radioStatus:tempArray});
        this.setState({gender:genderSelect});               
    }
    doSignUp = async()=>{
        try {
            if(this.state.conditionCheck === true)
            {                
                let requestData = {
                email: this.state.userEmail,
                password: this.state.password,
                gender: this.state.gender,
                type: 'user'
                };    
                let loginData={
                    userEntry: this.state.userEmail,
                    password: this.state.password,
                    type: 'user'
                } 
           
               await signUp(requestData); 
               console.log(this.props.user);
               if(this.props.user.success) {                   
                   Toast.show({
                     text:this.props.user.message,
                     duration: 3000
                   }); 
                  await login(loginData); 
                  if(this.props.user.isAuthenticated) {
                      this.props.navigation.navigate('userdetails')
                  } else {
                    Toast.show({
                        text:this.props.user.message,
                        duration: 3000
                    });       
                  }               
                } else {
                    Toast.show({
                        text:this.props.user.message,
                        duration: 3000
                    });                               
                    return
                }                         
            } else {                  
                this.setState({conditionCheckErrorMsg: 'Kindly agree to the terms and conditions'});
            }                
        } catch (e) {
          console.log(e);
        }        
    }

    render() {
        const { user: { isLoading } } = this.props; 
        return (

            <Container style={styles.container}>
                {/* <Header>

                </Header> */}
                <Content style={styles.bodyContent}>


                    <H3 style={styles.welcome}>List Your Practice to Reach millions of Peoples</H3>
                    <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.logo} />
                    <Form>
                        {/* <View style={styles.errorMsg}>
                            <Text style={{ textAlign: 'center', color: '#775DA3' }}> Invalid Credencials</Text>
                        </View> */}
                       
                        <Item style={{ borderBottomWidth: 0 }}>
                            <Input  placeholder="Email Or Phone" style={styles.transparentLabel}                             
                             value={this.state.userEmail}
                             keyboardType={'email-address'}
                             onChangeText={userEmail => this.setState({ userEmail
                                 
                              })}/>                             
                        </Item>

                        <Item style={{ borderBottomWidth: 0 }}>
                            <Input placeholder="Password" style={styles.transparentLabel}                             
                            value={this.state.password}
                            secureTextEntry={this.state.showPassword}
                            keyboardType={'visible-password'}
                            onChangeText={password => this.setState({ password })}/>
                            <Icon active name='eye' onPress={()=>this.setState({showPassword: !this.state.showPassword})}/>
                        </Item>
                        <Item style={{ marginTop: 12, borderBottomWidth: 0 }}>

                            <Radio selected={this.state.radioStatus[0]} onPress={()=>this.toggleRadio("0","M")} color={"#775DA3"}
                                selectedColor={"#775DA3"} />
                            <Text style={{
                                marginLeft: 10, fontFamily: 'opensans-regular',
                            }}>Male</Text>
                    
                            <Radio selected={this.state.radioStatus[1]} onPress={()=>this.toggleRadio("1","F")} style={{ marginLeft: 20 }} color={"#775DA3"}
                                selectedColor={"#775DA3"} />
                            <Text style={{
                                marginLeft: 10, fontFamily: 'opensans-regular',
                            }}>Female</Text>

                            <Radio selected={this.state.radioStatus[2]} onPress={()=>this.toggleRadio("2","O")} style={{ marginLeft: 30 }} color={"#775DA3"}
                                selectedColor={"#775DA3"} />
                            <Text style={{ marginLeft: 10 }}>Other</Text>
                        </Item>


                        <Item style={{ borderBottomWidth: 0, marginTop: 12, marginLeft: 4 }}>
                            <CheckBox checked={this.state.conditionCheck} color="green" onPress={()=>this.setState({conditionCheck: !this.state.conditionCheck})} ></CheckBox>
                            <Text style={{ marginLeft: 15, color: 'gray', fontFamily: 'opensans-regular' }}>I Accept the Medflic Terms And Conditions</Text>
                        </Item>

                        <Spinner color='blue' 
                           visible={isLoading}
                           textContent={'Loading...'}
                        />

                        <Button style={styles.loginButton} block primary onPress={() => this.doSignUp()}>

                            <Text>Sign Up</Text>
                        </Button>
                        <Text style={{color: 'red'}}>{this.state.conditionCheckErrorMsg} </Text>                       

                    </Form>

                </Content>
                <Footer >
                    <FooterTab style={{ backgroundColor: '#F2F2F2', }}>
                        <Button full onPress={() => this.props.navigation.navigate('login')}>
                            <Text uppercase={false} style={{ color: '#000', fontSize: 15, fontFamily: 'opensans-regular' }}>Already Have An Account ? SignIn</Text>
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
