import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Footer,Icon,DatePicker,
    FooterTab, H3
} from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { StyleSheet, Image, View } from 'react-native';
import styles from '../../screens/auth/styles'
class UserDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userEntry: '',
            password: ''
        }
    }

    doLogin() {

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
                            <Input placeholder="First Name" style={styles.transparentLabel} />
                        </Item>


                        <Item style={{ borderBottomWidth: 0 }}>
                            <Input placeholder="Last Name" style={styles.transparentLabel} />

                        </Item>


                        <Item style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', marginTop: 10, borderRadius: 5 }}>
                            <Icon name='calendar' style={{ paddingLeft: 20, color: '#775DA3' }} />
                            <DatePicker style={styles.transparentLabel}
                                defaultDate={new Date(2018, 4, 4)}
                                minimumDate={new Date(2018, 1, 1)}
                                maximumDate={new Date(2018, 12, 31)}
                                locale={"en"}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"default"}
                                placeHolderText="Date Of Birth"
                                textStyle={{ color: "#5A5A5A" }}
                                placeHolderTextStyle={{ color: "#5A5A5A" }}
                                onDateChange={this.setDate}
                                disabled={false}
                            /></Item>






                        {/* <Button style={styles.loginButton} block primary onPress={() => this.doLogin()}>
                            <Text style={{fontFamily:'opensans-regular'}}>Sign Up</Text>
                        </Button> */}

                        <Button style={styles.loginButton} block primary onPress={() => this.props.navigation.navigate('home')}>
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
