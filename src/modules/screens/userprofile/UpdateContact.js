import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, CheckBox, Left, Right, Picker, Body, Icon, Card, Input, Toast, View } from 'native-base';
import { userFiledsUpdate } from '../../providers/auth/auth.actions';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux'
import styles from './style.js';
import Spinner from '../../../components/Spinner';
import { ScrollView } from 'react-native-gesture-handler';



class UpdateContact extends Component {
    numberCategory = ['Home', 'Emergency']

    constructor(props) {
        super(props)
        this.state = {
            type: 'Home',
            mobile_no: '',
            active: true,
            primary_mobile_no: null,
            isLoading: false,
            userData:'',
            primaryMobileNoText:''
        }
    }

    componentDidMount() {
        this.bindContactValues();

    }

    bindContactValues() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        this.setState({
            primary_mobile_no: userData.mobile_no,
            primaryMobileNoText:'Primary MobileNo Is Not Editable'

        })
        if (userData.secondary_mobiles) {
            this.setState({
                type: userData.secondary_mobiles[0].type,
                mobile_no: userData.secondary_mobiles[0].number,
                active: userData.secondary_mobiles[0].active,
                userData
            })
        }

    }
    commonUpdateContactMethod=async()=>{
        let userId = await AsyncStorage.getItem('userId');
                let data = {
                    secondary_mobiles: [
                        {
                            type:this.state.type,
                            number:this.state.mobile_no,
                            active:true
                        }]

                };
                let response = await userFiledsUpdate(userId, data);
                if (response.success) {
                    Toast.show({
                        text: 'Contact updated Successfully',
                        type: "success",
                        duration: 3000,
                    })
                    this.props.navigation.navigate('Profile');               
                } else {
                    Toast.show({
                        text:'Number Is Not Allowed To Be Empty',
                        type: "danger",
                        duration: 3000
                    })           
                    this.setState({ isLoading: false })
                }
    }
    

    handleContactUpdate = async () => {
        const{mobile_no,type,userData}=this.state
        try {
            this.setState({ isLoading:true})
            if(userData.secondary_mobiles!==undefined){                
            if (type != userData.secondary_mobiles[0].type || mobile_no != userData.secondary_mobiles[0].number) {
                this.commonUpdateContactMethod();
            }else {
                this.props.navigation.navigate('Profile');
            }
        }else{
            this.commonUpdateContactMethod();
        }
        }catch (e) {
        console.log(e);
        }
    }



    render() {


        return (
            <Container style={styles.container}>
                <Spinner color='blue'
                    visible={this.state.isLoading}
                    textContent={'Please wait Loading'}
                />
                
                <Content style={styles.bodyContent} contentContainerStyle={{ justifyContent: 'center', }}>
                    <ScrollView>
                        {this.state.primary_mobile_no != null ?
                            <Text style={{ fontFamily: 'OpenSans', marginTop: 70, marginLeft: 7, fontWeight: 'bold', fontSize: 22 }}>Primary Mobile_no</Text> : null}
                        {this.state.primary_mobile_no != null ?
                            <Card style={{ padding: 10, borderRadius: 10 }}>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Icon name="call" style={styles.centeredIcons}></Icon>

                                    <Text style={styles.customText}>{this.state.primary_mobile_no}</Text>
                                    <Right>
                                        <Icon style={{ color: 'gray', fontSize: 25 }} name='ios-lock' />
                                    </Right>
                                </Item>
                            </Card> : null}
                            <Text style={{marginTop:5,marginLeft:5,fontFamily:'OpenSans',fontSize:11,color:'red'}}>{this.state.primaryMobileNoText}</Text>

                        <Text style={{ fontFamily: 'OpenSans', marginTop: 50, marginLeft: 7, fontWeight: 'bold', fontSize: 22 }}>Edit Secondary Mobile_No</Text>
                        <Text style={{ color: 'gray', fontSize: 13, fontFamily: 'OpenSans', marginLeft: 6 }}>Update your secondary mobile_no</Text>
                        <Card style={{ padding: 10, borderRadius: 10, marginBottom: 20 }}>

                            <Item style={{ borderBottomWidth: 0 }}>
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
                                    onValueChange={val => this.setState({ type: val })}
                                    selectedValue={String(this.state.type)}
                                >
                                    {this.numberCategory.map((type, key) => {
                                        return <Picker.Item label={String(type)} value={String(type)} key={key}
                                            testID='pickType' />
                                    })}

                                </Picker>
                            </Item>


                            <Item style={{ borderBottomWidth: 0 }}>
                                <Icon name='call' style={styles.centeredIcons}></Icon>
                                <Input placeholder="Edit Your Number" style={styles.transparentLabel} keyboardType="numeric"
                                    onChangeText={(mobile_no) => this.setState({ mobile_no })}
                                    value={String(this.state.mobile_no)}
                                    testID='updateContact' />
                            </Item>




                            <Item style={{ borderBottomWidth: 0 }}>
                                <Right>
                                    <Button success style={styles.updateButton} onPress={() => this.handleContactUpdate()} testID='clickUpdateContact'>
                                        <Text uppercase={false} note style={{ color: '#fff', fontFamily: 'OpenSans' }}>Update</Text>
                                    </Button>
                                </Right>
                            </Item>
                        </Card>

                    </ScrollView>
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

