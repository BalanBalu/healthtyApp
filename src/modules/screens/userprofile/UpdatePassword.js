import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, CheckBox, Left, Right, Thumbnail, Body, Icon, Card, Input, Toast } from 'native-base';
import { AsyncStorage } from 'react-native';
import { updateNewPassword} from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import styles from './style.js'
import Spinner from '../../../components/Spinner';



class UpdatePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {            
            oldPassword:'',
            newPassword:'',
            confirmPassword:'',
            isLoading:false
        }
    }

    handlePasswordUpdate = async () => {
        try {
            this.setState({isLoading:true});
            if(this.state.newPassword === this.state.confirmPassword){
            let userId = await AsyncStorage.getItem('userId');            
            console.log(userId);
            let data = {
                type:'user',
                userId:userId,
                oldPassword:this.state.oldPassword,
                newPassword:this.state.newPassword
            };
            let result = await updateNewPassword(data);
            console.log('result'+JSON.stringify(result));
            if (result.success) {
                Toast.show({
                    text:'Password is updated',
                    type: "success",
                    duration: 3000,

                })
                this.props.navigation.navigate('Profile');
                this.setState({isLoading:false});

            } else {
                Toast.show({
                    text: 'Not updated',
                    type: "danger",
                    duration: 3000
                })

            }
        }else{
            Toast.show({
                text: "Entered passwords do not match. Kindly re-enter them",
                type: "danger",
                duration: 3000
            })
        }


        } catch (e) {
            console.log(e);
        }
    }

    render() {

        return (
            <Container style={styles.container}>
                    <Spinner color='blue'
                    visible={this.state.isLoading}
                    textContent={'Please wait updating...'}
                />

       
                <Content style={styles.bodyContent} contentContainerStyle={{ justifyContent: 'center', flex: 1, height: '100%' }}>
                  
                    <H3 style={{ fontFamily: 'OpenSans' }}>Update Password</H3>
                    <Text style={{ color: 'gray', fontSize: 13, fontFamily: 'OpenSans' }}></Text>
                    <Card style={{ padding: 10, borderRadius: 10 }}>

                        <Item style={{ borderBottomWidth: 0 }}>
                            <Icon name='mail' style={styles.centeredIcons}></Icon>
                            <Input placeholder="Enter old password" style={styles.transparentLabel} keyboardType="email-address"
                                onChangeText={(oldPassword) => this.setState({ oldPassword })}
                                value={this.state.oldPassword}
                                testID='enterOldPassword' />
                        </Item>

                        <Item style={{ borderBottomWidth: 0 }}>
                            <Icon name='mail' style={styles.centeredIcons}></Icon>
                            <Input placeholder="Enter new password" style={styles.transparentLabel} keyboardType="email-address"
                                onChangeText={(newPassword) => this.setState({ newPassword })}
                                value={this.state.newPassword}
                                testID='enterNewPassword' />
                        </Item>

                        <Item style={{ borderBottomWidth: 0 }}>
                            <Icon name='mail' style={styles.centeredIcons}></Icon>
                            <Input placeholder="Confirm password" style={styles.transparentLabel} keyboardType="email-address"
                                onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                                value={this.state.confirmPassword}
                                testID='enterConfirmPassword' />
                        </Item>
                        
                        <Item style={{ borderBottomWidth: 0 }}>
                            <Right>
                                <Button style={styles.updateButton} onPress={() => this.handlePasswordUpdate()} testID='clickUpdatePassword'>
                                    <Text uppercase={false} note style={{ color: '#fff', fontFamily: 'OpenSans' }}>Update</Text>
                                </Button>
                            </Right>
                        </Item>


                    </Card>

                    

                        
                   


                </Content>

            </Container>

        )
    }

}

function profileState(state) {

    return {
        user: state.user
    }
}
export default connect(profileState)(UpdatePassword)

