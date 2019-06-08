import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Footer, Icon, DatePicker,
    FooterTab, H3, Toast
} from 'native-base';
import { userFiledsUpdate, logout } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { Image, BackHandler } from 'react-native';
import styles from '../../screens/auth/styles';
import Spinner from '../../../components/Spinner';
class UserDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            firstName: '',
            lastName: '',
            dob: '',
            ErrorMsg: ''
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        Toast.show({
            text: 'Please Complete your Profile',
            duration: 3000
        });
        return true;
    }

    userUpdate = async () => {
        try {
            let requestData = {
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                dob: this.state.dob,
            };
            await userFiledsUpdate(requestData, this.props.user.userId);
            if (this.props.user.success) {
                Toast.show({
                    text: 'Your Profile has been Completed',
                    duration: 3000
                });
                logout();
                this.props.navigation.navigate('login')
            }
            else {
                Toast.show({
                    text: this.props.user.message,
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
        const { user: { isLoading } } = this.props;
        return (

            <Container style={styles.container}>
                {/* <Header>

                </Header> */}
                <Content style={styles.bodyContent}>

                    <Spinner color='blue'
                        visible={isLoading}
                        textContent={'Loading...'}
                    />

                    <H3 style={styles.welcome}>User Details</H3>
                    <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.logo} />
                    <Form>
                        {/* <View style={styles.errorMsg}>
                            <Text style={{ textAlign: 'center', color: '#775DA3' }}> Invalid Credencials</Text>
                        </View> */}

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
                                defaultDate={new Date()}
                                //ref={(datepicker) => { this.DatePicker = datepicker;}}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"default"}
                                placeHolderText="Date Of Birth"
                                textStyle={{ color: "#5A5A5A" }}
                                value={this.state.dob}
                                placeHolderTextStyle={{ color: "#5A5A5A" }}
                                onDateChange={dob => this.setState({ dob })}
                                disabled={false}                           
                            /></Item>

                        <Button style={styles.loginButton} block primary onPress={() => this.userUpdate()}>
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
