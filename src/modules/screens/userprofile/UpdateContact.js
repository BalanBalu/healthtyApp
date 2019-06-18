import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, CheckBox, Left, Right, Thumbnail, Body, Icon, Card, Input, Toast } from 'native-base';
import { userFiledsUpdate} from '../../providers/auth/auth.actions';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux'
import styles from './style.js';



class UpdateContact extends Component {
    constructor(props) {
        super(props)
        this.state={
            type:'',
            mobile_no:'',
            active:true,
            primary_mobile_no:'',
        }      
    }
    
    componentDidMount() {
         this.bindContactValues();
    }
    
    bindContactValues() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        const fromProfile = navigation.getParam('fromProfile') || false
        
        if(fromProfile){
             this.setState({
             fromProfile:true,
            primary_mobile_no:userData.mobile_no,
            /*Secondary mobile_no Home */
            // type:userData.secondary_mobiles[0].type,
            // mobile_no:userData.secondary_mobiles[0].number,
            // active:userData.secondary_mobiles[0].active,
            // /*Secondary mobile_no Emergency*/
            // type:userData.secondary_mobiles[1].type,
            // mobile_no:userData.secondary_mobiles[1].number,
            // active:userData.secondary_mobiles[0].active,

             })
         }
    }

    handleContactUpdate = async () => {

        try {
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                secondary_mobiles: [
                    {
                    type: this.state.type,
                    number:this.state.number,                    
                    active:this.state.active
                    },
                    {
                    type: this.state.type,
                    number:this.state.number,                    
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

        return (
            <Container style={styles.container}>
               
       
                <Content style={styles.bodyContent} contentContainerStyle={{ justifyContent: 'center', flex: 1, height: '100%' }}>
                <H3 style={{ fontFamily: 'OpenSans' }}>Primary Mobile_no</H3>
                 <Card style={{ padding: 10, borderRadius: 10 }}>
                 <Item style={{ borderBottomWidth: 0 }}>
                    <Icon name='mail' style={styles.centeredIcons}></Icon>
                        <Body>
                        <Text style={styles.customText}>{this.state.primary_mobile_no}</Text>
                        </Body>
                  </Item>
                  </Card>   
                    <H3 style={{ fontFamily: 'OpenSans' }}>Edit Secondary Email</H3>
                    <Text style={{ color: 'gray', fontSize: 13, fontFamily: 'OpenSans' }}>Update your secondary mobile_no</Text>
                    <Card style={{ padding: 10, borderRadius: 10 }}>

                    <Item style={{ borderBottomWidth: 0, marginTop: 12, marginLeft: 4 }}>
                            <Text style={{ marginLeft: 15, color: 'gray', fontFamily: 'OpenSans' }}>Hi</Text>
                    </Item>


                    <Item style={{ borderBottomWidth: 0 }}>
                            <Icon name='mail' style={styles.centeredIcons}></Icon>
                            <Input placeholder="Edit Your Email" style={styles.transparentLabel} keyboardType="email-address"
                                onChangeText={(number) => this.setState({ number })}
                                value={this.state.number}
                                testID='updateHomeContact' />
                    </Item>

                    <Item style={{ borderBottomWidth: 0, marginTop: 12, marginLeft: 4 }}>
                            <CheckBox checked={this.state.active} color="green" onPress={() => this.setState({ active: !this.state.active })} testID='privateCheckbox'></CheckBox>
                            <Text style={{ marginLeft: 15, color: 'gray', fontFamily: 'OpenSans' }}>Active</Text>
                    </Item>


                    <Item style={{ borderBottomWidth: 0, marginTop: 12, marginLeft: 4 }}>
                            <Text style={{ marginLeft: 15, color: 'gray', fontFamily: 'OpenSans' }}>{this.state.type}</Text>
                    </Item>
                    <Item style={{ borderBottomWidth: 0 }}>
                            <Icon name='mail' style={styles.centeredIcons}></Icon>
                            <Input placeholder="Edit Your Email" style={styles.transparentLabel} keyboardType="email-address"
                                onChangeText={(number) => this.setState({ number })}
                                value={this.state.number}
                                testID='updateEmergencyContact' />

            
                    </Item>
                    <Item style={{ borderBottomWidth: 0, marginTop: 12, marginLeft: 4 }}>
                            <CheckBox checked={this.state.active} color="green" onPress={() => this.setState({ active: !this.state.active })} testID='privateCheckbox'></CheckBox>
                            <Text style={{ marginLeft: 15, color: 'gray', fontFamily: 'OpenSans' }}>Active</Text>
                        </Item>



                        <Item style={{ borderBottomWidth: 0 }}>
                            <Right>
                                <Button style={styles.updateButton} onPress={() => this.handleContactUpdate()} testID='clickUpdateContact'>
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
export default connect(profileState)(UpdateContact)

