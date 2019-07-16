import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Footer, Icon, DatePicker,
    FooterTab, H3, Toast, ListItem, Radio, Picker
} from 'native-base';
import { userFiledsUpdate, logout } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { Image, BackHandler, AsyncStorage, TouchableHighlight } from 'react-native';
import styles from './style.js';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from '../../../components/Spinner';
class UserDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            no_and_street: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            pin_code: '',
            isLoading: false,
            isFocused: false,
            pinCodeIsFocused: false,
            userData: [],
            loderContent:''

        }
    }
    componentDidMount() {

        this.bindValues();

    }
    async bindValues() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
    
        console.log(userData);
        if (userData) {
            await this.setState({
                no_and_street: userData.address.address.no_and_street,
                address_line_1: userData.address.address.address_line_1,
                address_line_2: userData.address.address.address_line_2,
                city: userData.address.address.city,
                pin_code: userData.address.address.pin_code,
                userData:userData
            })
        }
    }



    userUpdate = async () => {
            
        try {
            const { userData, no_and_street, address_line_1, address_line_2, city, pin_code } = this.state

            
            if (no_and_street != userData.address.address.no_and_street ||address_line_1 != userData.address.address.address_line_1 ||
                address_line_2 != userData.address.address.address_line_2 ||city != userData.address.address.city ||
                pin_code != userData.address.address.pin_code) {
                this.setState({ isLoading: true });
                await this.setState({ loderContent: 'Please wait updatting' })
                let requestData = {
                    address: {
                        address: {
                            no_and_street: this.state.no_and_street,
                            address_line_1: this.state.address_line_1,
                            address_line_2: this.state.address_line_2,
                            city: this.state.city,
                            pin_code: this.state.pin_code
                        }
                    }
                };
                const userId = await AsyncStorage.getItem('userId')
                let response = await userFiledsUpdate(userId, requestData);
               
                
                if (response.success) {
                    Toast.show({
                        text: 'Your Profile has been Updated',
                        type: "success",
                        duration: 3000
                    });
                    this.props.navigation.navigate('Profile');
                }
                else {
                    Toast.show({
                        text: response.message,
                        type: "danger",
                        duration: 3000
                    });
                }
               
            
            } else {
                this.setState({ isLoading: true });
                this.props.navigation.navigate('Profile');
            
            }
        }

        catch (e) {
            Toast.show({
                text: 'Exception Occured' + e,
                duration: 3000
            });


            console.log(e);
        }
    }





    render() {
        const { navigation, user: { isLoading } } = this.props;


        return (

            <Container style={styles.Container}>

                {this.state.isLoading == false ?
                <Content style={styles.bodyContent} contentContainerStyle={{ flex: 1, height: '75%' }}>
                  
                    <H3 style={{ fontSize: 20, fontFamily: 'opensans-semibold', marginTop: 40, marginLeft: '5%', fontWeight: 'bold', }}>Update User Details</H3>
                  
                     <Form>
                        <ScrollView scrollEventThrottle={16} >

                            {/* <View style={styles.errorMsg}>
                            <Text style={{ textAlign: 'center', color: '#775DA3' }}> Invalid Credencials</Text>
                        </View> */}

                            <Item style={{ borderBottomWidth: 0 }}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 18, marginTop: 30 }}>Door_no</Text>
                            </Item>
                            <Item style={{ borderBottomWidth: 0 }}>
                                <Input
                                    // placeholder="First Name"

                                    style={styles.transparentLabel}
                                    value={this.state.no_and_street}

                                    keyboardType={'default'}
                                    returnKeyType={'next'}
                                    onChangeText={no_and_street => this.setState({ no_and_street })}
                                    autoCapitalize='none'
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.no_and_street._root.focus(); }}

                                />
                            </Item>

                            <Item style={{ borderBottomWidth: 0 }}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 18, }}>AddressLine1</Text>
                            </Item>
                            <Item style={{ borderBottomWidth: 0 }}>
                                <Input
                                    // placeholder="Last Name"
                                    style={styles.transparentLabel}
                                    ref={(input) => { this.no_and_street = input; }}
                                    value={this.state.address_line_1}
                                    keyboardType={'default'}
                                    returnKeyType={'next'}
                                    onChangeText={address_line_1 => this.setState({ address_line_1 })}
                                    autoCapitalize='none'
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.address_line_1._root.focus(); }}
                                />
                            </Item>
                            <Item style={{ borderBottomWidth: 0 }}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 18, }}>AddressLine2</Text>
                            </Item>
                            <Item style={{ borderBottomWidth: 0 }}>
                                <Input
                                    // placeholder="Last Name"
                                    style={styles.transparentLabel}
                                    ref={(input) => { this.address_line_1 = input; }}
                                    value={this.state.address_line_2}
                                    keyboardType={'default'}
                                    returnKeyType={'next'}
                                    onChangeText={address_line_2 => this.setState({ address_line_2 })}
                                    autoCapitalize='none'
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.address_line_2._root.focus(this.setState({ isFocused: true })); }}


                                />
                            </Item>


                            <Item style={{ borderBottomWidth: 0 }}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 18, }}>city</Text>
                            </Item>
                            <Item style={{ borderBottomWidth: 0 }}>
                                <Input
                                    // placeholder="Last Name"
                                    style={styles.transparentLabel}
                                    autoFocus={this.state.isFocused}
                                    ref={(input) => { this.address_line_2 = input; }}
                                    value={this.state.city}
                                    keyboardType={'default'}
                                    returnKeyType={'next'}
                                    onChangeText={city => this.setState({ city })}
                                    autoCapitalize='none'
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.city._root.focus(this.setState({ pinCodeIsFocused: true })); }}
                                />
                            </Item>

                            <Item style={{ borderBottomWidth: 0 }}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 18, }}>pincode</Text>
                            </Item>
                            <Item style={{ borderBottomWidth: 0 }}>
                                <Input
                                    // placeholder="Last Name"
                                    style={styles.transparentLabel}
                                    value={this.state.pin_code}
                                    autoFocus={this.state.pinCodeIsFocused}
                                    ref={(input) => { this.city = input; }}

                                    keyboardType={'default'}
                                    returnKeyType={'next'}
                                    onChangeText={pin_code => this.setState({ pin_code })}
                                    autoCapitalize='none'
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.userUpdate(); }}
                                />
                            </Item>






                            <Button style={styles.loginButton} ref={(input) => { this.pin_code = input; }} block primary onPress={() => this.userUpdate()}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 18, }}>Submit</Text>
                            </Button>
                        </ScrollView>

                    </Form> 
                     {/* <Spinner 
                        visible={this.state.isLoading}
                        overlayColor="none"
                    /> */}

                    </Content> :
                    <Spinner color='blue'
                        visible={this.state.isLoading}
                        textContent={this.state.loderContent}
                        overlayColor="none"
                        cancelable={false}
                    />}

            </Container>

        )
    }

}



function userDetailsState(state) {
    return {
        user: state.user
    }
}

export default connect(userDetailsState)(UserDetails)


