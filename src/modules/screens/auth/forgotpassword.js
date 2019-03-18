import React, { Component } from 'react';
import { Container, Content, Button, Text, Form, Item, Input, Header, Footer, FooterTab, Right, Left, CheckBox, Radio, H3, H2, H1 } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { StyleSheet, Image } from 'react-native';
import styles from '../../screens/auth/styles'
class Forgotpassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userEntry: '',
            password: ''
        }
    }


    render() {
        return (


            <Container style={styles.container}>
                {/* <Header>

                </Header> */}
                <Content style={styles.bodyContent}>


                    <H3 style={styles.welcome}>Forgot Password</H3>
                    <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.logo} />
                    <Form>

                        <Item style={{ borderBottomWidth: 0 }}>
                            <Input placeholder="Email Or Phone" style={styles.transparentLabel} />
                        </Item>
                        <Button style={styles.loginButton} block primary onPress={() => this.doLogin()}>
                            <Text>Forgot password</Text>
                        </Button>

                    </Form>

                </Content>
                <Footer >
                    <FooterTab style={{ backgroundColor: '#F2F2F2', }}>
                        <Button full onPress={() => this.props.navigation.navigate('login')}>
                            <Text uppercase={false} style={{ color: '#000', fontSize: 15 }}>Go Back To SignIn</Text>
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
export default connect(loginState, { login })(Forgotpassword)
