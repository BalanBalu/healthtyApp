import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, CheckBox, Left, Right, Picker, Body, Icon, Card, Input, Toast } from 'native-base';
import { userFiledsUpdate} from '../../providers/auth/auth.actions';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux'
import styles from './style.js';
import Spinner from '../../../components/Spinner';



class UpdateContact extends Component {
 numberCategory=['Home','Emergency']

    constructor(props) {
        super(props)
        this.state={
            type:'Home',
            mobile_no:'',
            active:true,
            primary_mobile_no:'',
            isLoading:false,
            numberType:''
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
                           
            })
            if(userData.secondary_mobiles) {
                this.setState ({
                    type:userData.secondary_mobiles[0].type,
                    mobile_no:userData.secondary_mobiles[0].number, 
                    active:userData.secondary_mobiles[0].active    
                })
            }

         }
    }

    handleContactUpdate = async () => {

        try {
            this.setState({isLoading:true})
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                secondary_mobiles: [
                    {
                    type: this.state.type,
                    number:this.state.mobile_no,                    
                    active:true
                    }]
                    
            };
            let response= await userFiledsUpdate(userId,data);
            if (response.success) {
                Toast.show({
                    text:'Contact updated Successfully',
                    type: "success",
                    duration: 3000,

                })
                this.props.navigation.navigate('Profile');
                this.setState({isLoading:false});
            } else {
                Toast.show({
                    text: 'Contact not updated',
                    type: "danger",
                    duration: 3000
                })
                this.setState({isLoading:false});


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
                    textContent={'Loading...'}
                        />

               
       
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
                    
                    <H3 style={{ fontFamily: 'OpenSans' }}>Edit Secondary Mobile_No</H3>
                    <Text style={{ color: 'gray', fontSize: 13, fontFamily: 'OpenSans' }}>Update your secondary mobile_no</Text>
                    <Card style={{ padding: 10, borderRadius: 10 }}>

                   <Item style={{ borderBottomWidth: 0}}>
                  <Picker style={{ fontFamily: 'OpenSans' }}
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    textStyle={{ color: "#5cb85c" }}
                    itemStyle={{
                      backgroundColor: "gray",
                      marginLeft: 0,
                      paddingLeft: 10
                    }}
                    itemTextStyle={{ color: '#788ad2' }}
                    style={{ width: 25 }}
                    onValueChange={val => this.setState({ type:val})}
                    selectedValue={String(this.state.type)}
                  >
                     {this.numberCategory.map((type, key) => {
                         return <Picker.Item label={String(type)} value={String(type)} key={key}
                         testID='pickType' />
                    })}
                     
                  </Picker>
                  </Item>
                

                    <Item style={{ borderBottomWidth: 0 }}>
                            <Icon name='mail' style={styles.centeredIcons}></Icon>
                            <Input placeholder="Edit Your Number" style={styles.transparentLabel} keyboardType="email-address"
                                onChangeText={(mobile_no) => this.setState({mobile_no})}
                                value={String(this.state.mobile_no)}
                                testID='updateContact' />
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

