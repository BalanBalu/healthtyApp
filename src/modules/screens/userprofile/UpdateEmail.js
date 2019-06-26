import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, CheckBox, Left, Right, Thumbnail, Body, Icon, Card, Input, Toast, View } from 'native-base';
import { userFiledsUpdate } from '../../providers/auth/auth.actions';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux'
import styles from './style.js';
import Spinner from '../../../components/Spinner';




class UpdateEmail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: null,
            type: null,
            active: true,
            primary_email: null,
            isLoading: false
        }
    }

    componentDidMount() {
        this.bindEmailValues();
    }

    bindEmailValues() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        const fromProfile = navigation.getParam('fromProfile') || false

        if (fromProfile) {
            this.setState({
                fromProfile: true,
                primary_email: userData.email,
            })
            if (userData.secondary_emails) {
                this.setState({
                    email: userData.secondary_emails[0].email_id,
                    type: userData.secondary_emails[0].type,
                    active: userData.secondary_emails[0].active
                })
            }
            console.log(this.state.email + 'email');
        }
    }

    handleEmailUpdate = async () => {
        debugger
        try {
            this.setState({ isLoading: true });
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                secondary_emails: [{
                    email_id: this.state.email,
                    type: "Secondary",
                    active: this.state.active
                }]
            };
            let response = await userFiledsUpdate(userId, data);
            if (response.success) {
                Toast.show({
                    text: 'Email updated Successfully',
                    type: "success",
                    duration: 3000,

                })
                this.props.navigation.navigate('Profile');
            } else {
                Toast.show({
                    text: 'Email not updated',
                    type: "danger",
                    duration: 3000
                })

            }


        } catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }



    render() {
        return (
            <Container style={styles.container}>
                <Content style={{ padding: 10 }} contentContainerStyle={{ flex: 1, height: '100%', }}>
                    <View style={{ marginTop: 20 }}>
                        <H3 style={{ fontFamily: 'OpenSans', }}>Primary Email</H3>
                        <Card style={{ padding: 10, borderRadius: 10, marginTop: 10 }}>
                            <Item style={{ borderBottomWidth: 0 }}>
                                <Icon name='mail' style={styles.centeredIcons}></Icon>
                                <Body>
                                    <Text style={styles.customText}>{this.state.primary_email}</Text>
                                </Body>
                            </Item>
                        </Card>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <H3 style={{ fontFamily: 'OpenSans', marginTop: 50 }}>Edit Secondary Email</H3>
                        <Text style={{ color: 'gray', fontSize: 13, fontFamily: 'OpenSans', marginTop: 15 }}>Update your secondary email</Text>
                        <Card style={{ padding: 10, borderRadius: 10, marginTop: 10, height: 250, justifyContent: 'center' }}>

                            <Item style={{ borderBottomWidth: 0, marginTop: 12, marginLeft: 4 }}>
                                <Text style={{ marginLeft: 15, color: 'gray', fontFamily: 'OpenSans' }}>{this.state.type}</Text>
                            </Item>

                            <Item style={{ borderBottomWidth: 0, }}>
                                <Icon name='mail' style={styles.centeredIcons}></Icon>
                                <Input placeholder="Edit Your Secondary Email" style={styles.transparentLabel} keyboardType="email-address"
                                    onChangeText={(email) => this.setState({ email })}
                                    value={this.state.email}
                                    testID='updateEmail' />
                            </Item>

                            <Spinner color='blue'
                                visible={this.state.isLoading}
                                textContent={'Loading...'}
                            />




                            <Item style={{ borderBottomWidth: 0 }}>
                                <Right>
                                    <Button style={styles.updateButton} onPress={() => this.handleEmailUpdate()} testID='clickUpdateEmail'>
                                        <Text uppercase={false} note style={{ color: '#fff', fontFamily: 'OpenSans' }}>Update</Text>
                                    </Button>
                                </Right>
                            </Item>


                        </Card>
                    </View>







                </Content >

            </Container>

        )
    }

}
function profileState(state) {

    return {
        user: state.user
    }
}
export default connect(profileState)(UpdateEmail)

