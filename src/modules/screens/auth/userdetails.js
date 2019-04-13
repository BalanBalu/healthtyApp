import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Footer,Icon,DatePicker,
    FooterTab, H3
} from 'native-base';
import { login,userFiledsUpdate } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { StyleSheet, Image, View } from 'react-native';
import styles from '../../screens/auth/styles'
class UserDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            firstName: '',
            lastName: '',
            dob:'',
            ErrorMsg: ''
        }
    }

    userUpdate = async()=>{
        try {
            let requestData = {
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                dob: this.state.dob,
                };                
               await userFiledsUpdate(requestData,this.props.user.userId);   
             
                          if(this.props.user.isAuthenticated){                              
                             this.props.navigation.navigate('login')
                           }
                          else{
                            this.setState({ErrorMsg: 'Error Occured'});
                          }
        }catch (e) {
          console.log(e);
        }        
    }


    render() {
        return (

            <Container style={styles.container}>
                {/* <Header>

                </Header> */}
                <Content style={styles.bodyContent}>


                    <H3 style={styles.welcome}>User Details</H3>
                    <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.logo} />
                    <Form>
                        {/* <View style={styles.errorMsg}>
                            <Text style={{ textAlign: 'center', color: '#775DA3' }}> Invalid Credencials</Text>
                        </View> */}
                      
                        <Item style={{ borderBottomWidth: 0 }}>
                            <Input  placeholder="firs tName" style={styles.transparentLabel}                             
                             value={this.state.firstName}
                             keyboardType={'default'}
                             onChangeText={firstName => this.setState({ firstName
                              })}/>                             
                        </Item>

                        <Item style={{ borderBottomWidth: 0 }}>
                            <Input  placeholder="Last Name" style={styles.transparentLabel}                             
                             value={this.state.lastName}
                             keyboardType={'default'}
                             onChangeText={lastName => this.setState({ lastName
                              })}/>                             
                        </Item>

                        <Item style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', marginTop: 10, borderRadius: 5 }}>
                            <Icon name='calendar' style={{ paddingLeft: 20, color: '#775DA3' }} />
                            <DatePicker style={styles.transparentLabel}
                                defaultDate={new Date()}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"default"}
                                placeHolderText="Date Of Birth"
                                textStyle={{ color: "#5A5A5A" }}
                                value={this.state.dob}
                                placeHolderTextStyle={{ color: "#5A5A5A" }}
                                onDateChange={dob=>this.setState({dob})}
                                disabled={false}
                            /></Item>

                        <Button style={styles.loginButton} block primary onPress={() => this.userUpdate()}>
                            <Text style={{ fontFamily: 'opensans-regular' }}>Sign Up</Text>
                        </Button>

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



function loginState(state) {
    return {
        user: state.user
    }
}
export default connect(loginState, { login })(UserDetails)
