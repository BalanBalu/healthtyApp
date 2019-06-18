import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, CheckBox, Left, Right, Thumbnail, Body, Icon, Card, Input, Toast } from 'native-base';
import { userFiledsUpdate} from '../../providers/auth/auth.actions';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux'
import styles from './style.js';
import Spinner from '../../../components/Spinner';




class UpdateEmail extends Component {
    constructor(props) {
        super(props)
        this.state={
            email:'',
            type:'',
            active:true,
            primary_email:'',
        }      
    }
    
    componentDidMount() {
         this.bindEmailValues();
    }
    
    bindEmailValues() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        const fromProfile = navigation.getParam('fromProfile') || false
        
        if(fromProfile){
             this.setState({
             fromProfile:true,
            primary_email:userData.email,
            email:userData.secondary_emails[0].email_id,
            type:userData.secondary_emails[0].type, 
            active:userData.secondary_emails[0].active               
             })
         }
    }

    handleEmailUpdate = async () => {

        try {
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                secondary_emails: [{
                    email_id: this.state.email,
                    type: this.state.type,
                    active:this.state.active
                }]
            };
            let response= await userFiledsUpdate(userId,data);
            if (response.success) {
                Toast.show({
                    text:'Email updated Successfully',
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
    }


    
    render() {
        const { user: { isLoading } } = this.props;


        return (
            <Container style={styles.container}>      
               
       
                <Content style={styles.bodyContent} contentContainerStyle={{ justifyContent: 'center', flex: 1, height: '100%' }}>

                <Spinner color='blue'
                    visible={isLoading}
                    textContent={'Please wait updating...'}
                />
           

                <H3 style={{ fontFamily: 'OpenSans' }}>Primary Email</H3>
                 <Card style={{ padding: 10, borderRadius: 10 }}>
                 <Item style={{ borderBottomWidth: 0 }}>
                    <Icon name='mail' style={styles.centeredIcons}></Icon>
                        <Body>
                        <Text style={styles.customText}>{this.state.primary_email}</Text>
                        </Body>
                  </Item>
                  </Card>   
                    <H3 style={{ fontFamily: 'OpenSans' }}>Edit Secondary Email</H3>
                    <Text style={{ color: 'gray', fontSize: 13, fontFamily: 'OpenSans' }}>Update your secondary email</Text>
                    <Card style={{ padding: 10, borderRadius: 10 }}>

                    <Item style={{ borderBottomWidth: 0, marginTop: 12, marginLeft: 4 }}>
                            <Text style={{ marginLeft: 15, color: 'gray', fontFamily: 'OpenSans' }}>{this.state.type}</Text>
                    </Item>


                    <Item style={{ borderBottomWidth: 0 }}>
                            <Icon name='mail' style={styles.centeredIcons}></Icon>
                            <Input placeholder="Edit Your Secondary Email" style={styles.transparentLabel} keyboardType="email-address"
                                onChangeText={(email) => this.setState({ email })}
                                value={this.state.email}
                                testID='updateEmail' />
                    </Item>
                    <Item style={{ borderBottomWidth: 0, marginTop: 12, marginLeft: 4 }}>
                            <CheckBox checked={this.state.active} color="green" onPress={() => this.setState({ active: !this.state.active })} testID='privateCheckbox'></CheckBox>
                            <Text style={{ marginLeft: 15, color: 'gray', fontFamily: 'OpenSans' }}>Active</Text>
                        </Item>



                        <Item style={{ borderBottomWidth: 0 }}>
                            <Right>
                                <Button style={styles.updateButton} onPress={() => this.handleEmailUpdate()} testID='clickUpdateEmail'>
                                    <Text uppercase={false} note style={{ color: '#fff', fontFamily: 'OpenSans' }}>Update</Text>
                                </Button>
                            </Right>
                        </Item>


                    </Card>

                    

                        
                   


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

