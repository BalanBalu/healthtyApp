import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Header, Footer,
    FooterTab, Right, Body, Left, CheckBox, Radio, H3, H2, H1
} from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { StyleSheet, Image,View } from 'react-native';
import styles from '../../screens/auth/styles'
class Signup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userEntry: '',
            password: ''
        }
    }

    doLogin(){

    }


    render() {
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
                            <Input placeholder="Email Or Phone" style={styles.transparentLabel} />
                        </Item>


                        <Item style={{ borderBottomWidth: 0 }}>
                            <Input placeholder="Password" style={styles.transparentLabel} />

                        </Item>



                        <Item style={{ marginTop: 12, borderBottomWidth: 0 }}>

                            <Radio selected={true} color={"#775DA3"}
                                selectedColor={"#775DA3"} />
                            <Text style={{ marginLeft: 10 ,fontFamily:'opensans-regular'}}>Male</Text>


                            <Radio selected={true} style={{ marginLeft: 20 }} color={"#775DA3"}
                                selectedColor={"#775DA3"} />
                            <Text style={{ marginLeft: 10 ,fontFamily:'opensans-regular'}}>Female</Text>


                        </Item>


                        <Item style={{ borderBottomWidth: 0, marginTop: 12, marginLeft: 4 }}>
                            <CheckBox checked={true} color="green" ></CheckBox>
                            <Text style={{ marginLeft: 15, color: 'gray' ,fontFamily:'opensans-regular'}}>I Accepted Medflic Terms And Conditions</Text>
                        </Item>


                        <Button style={styles.loginButton} block primary onPress={() => this.doLogin()}>
                            <Text style={{fontFamily:'opensans-regular'}}>Sign Up</Text>
                        </Button>

                    </Form>

                </Content>
                <Footer >
                    <FooterTab style={{ backgroundColor: '#F2F2F2', }}>
                        <Button full onPress={() => this.props.navigation.navigate('login')}>
                            <Text uppercase={false} style={{ color: '#000', fontSize: 15,fontFamily:'opensans-regular' }}>Already Have An Account ? SignIn</Text>
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
export default connect(loginState, { login })(Signup)
