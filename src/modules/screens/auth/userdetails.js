import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Footer, Icon, DatePicker, FooterTab, H3, Toast
} from 'native-base';
import { connect } from 'react-redux'
import { Image, BackHandler, AsyncStorage } from 'react-native';

import styles from '../../screens/auth/styles';
import Spinner from '../../../components/Spinner';
import { userFiledsUpdate, logout } from '../../providers/auth/auth.actions';

class UserDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            firstName: '',
            lastName: '',
            dob:null,
            ErrorMsg: '',
            isLoading:false,
            fromProfile: false,
            fromProfileDataLoaded: false

        }
    }
    componentDidMount() {
        this.bindValues();
    }

    async bindValues() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        console.log('userData' + JSON.stringify(userData));
        const fromProfile = navigation.getParam('fromProfile') || false
        if (fromProfile) {
            if (userData.dob) {                
               await  this.setState({ dob: new Date(userData.dob) });
                console.log('dob from previous page :'+ userData.dob);
                console.log('dob........'+this.state.dob);
            }
            await this.setState({
                fromProfile: true,
                firstName: userData.first_name,
                lastName: userData.last_name
            })
        }
    }




    userUpdate = async () => {
        try {
            this.setState({isLoading:true});
            let requestData = {
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                dob: new Date(this.state.dob),
            };
            const userId = await AsyncStorage.getItem('userId')
            let response = await userFiledsUpdate(userId, requestData);
            if (response.success) {
                Toast.show({
                    text: 'Your Profile has been completed',
                    type: "success",
                    duration: 3000
                });
                this.props.navigation.navigate('Profile');
                this.setState({isLoading:false});

            }
            else {
                Toast.show({
                    text: response.message,
                    type: "danger",
                    duration: 3000
                });
            }
        } catch (e) {
            Toast.show({
                text: 'Exception Occured' + e,
                duration: 3000
            });
            console.log(e);
        }
    }


    render() {
        const { navigation} = this.props;
        const fromProfile = navigation.getParam('fromProfile') || false
        return (

            <Container style={styles.container}>
                {/* <Header>

                </Header> */}
                <Content style={styles.bodyContent}>


                    <H3 style={styles.welcome}>{fromProfile === true ? 'Update User Details' : 'User Details'}</H3>
                    <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.logo} />
                    <Form>
                        <Item style={{ borderBottomWidth: 0 }}>
                            <Input placeholder="First Name" style={styles.transparentLabel}
                                value={this.state.firstName}
                                autoFocus={true}
                                keyboardType={'default'}
                                returnKeyType={'next'}
                                onChangeText={firstName => this.setState({ firstName })}
                                autoCapitalize='none'
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.firstName._root.focus(); }}
                            />
                        </Item>

                        <Item style={{ borderBottomWidth: 0 }}>
                            <Input placeholder="Last Name" style={styles.transparentLabel}
                                ref={(input) => { this.firstName = input; }}
                                value={this.state.lastName}
                                keyboardType={'default'}
                                returnKeyType={'next'}
                                onChangeText={lastName => this.setState({ lastName })}
                                autoCapitalize='none'
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.lastName.focus(); }}
                            />
                        </Item>

                        
                        <Item style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', marginTop: 10, borderRadius: 5 }}>
                            <Icon name='calendar' style={{ paddingLeft: 20, color: '#775DA3' }} />
                            <DatePicker style={styles.transparentLabel}
                                defaultDate={this.state.dob}
                                locale={"en"}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"default"}
                                placeHolderText="Date Of Birth"
                                textStyle={{ color: "#5A5A5A" }}
                                value={this.state.dob}
                                placeHolderTextStyle={{ color: "#5A5A5A" }}
                                onDateChange={dob => { this.setState({ dob }); console.log(this.state.dob) }}
                                disabled={false}
                            /></Item>

                        <Spinner color='blue'
                            visible={this.state.isLoading}
                            textContent={'Loading...'}
                        />



                        <Button style={styles.loginButton}  block primary onPress={() => this.userUpdate()}>
                            <Text style={{ fontFamily: 'OpenSans' }}>Submit</Text>
                        </Button>


                    </Form>

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



function userDetailsState(state) {
    return {
        user: state.user
    }
}
export default connect(userDetailsState)(UserDetails)
