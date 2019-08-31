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
            numberType: '',
            userData: []
        }
    }

    componentDidMount() {
        this.bindContactValues();

    }

    bindContactValues() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        this.setState({ userData })

        this.setState({
            primary_mobile_no: userData.mobile_no,

        })
        if (userData.secondary_mobiles) {
            this.setState({
                type: userData.secondary_mobiles[0].type,
                mobile_no: userData.secondary_mobiles[0].number,
                active: userData.secondary_mobiles[0].active
            })
        }

    }
    // }

    handleContactUpdate = async () => {
        const { mobile_no, type, userData } = this.state

        try {
            this.setState({ isLoading: true })
            let userId = await AsyncStorage.getItem('userId');
            if (type != userData.secondary_mobiles[0].type || mobile_no != userData.secondary_mobiles[0].number) {

                let data = {
                    secondary_mobiles: [
                        {
                            type: type,
                            number: mobile_no,
                            active: true
                        }]

                };
                let response = await userFiledsUpdate(userId, data);
                if (response.success) {
                    Toast.show({
                        text: 'Contact updated Successfully',
                        type: "success",
                        duration: 3000,

                    })
                    this.setState({ isloading: false })
                    this.props.navigation.navigate('Profile');

                } else {
                    Toast.show({
                        text: 'Contact not updated',
                        type: "danger",
                        duration: 3000
                    })



                }
            }
            else {
                this.setState({ isloading: false })
                this.props.navigation.navigate('Profile');

            }


        } catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isloading: false })
        }
    }



    render() {


        return (
            <Container style={styles.container}>
                <Spinner color='blue'
                    visible={this.state.isLoading}
                    textContent={'Loading...'}
                />



                <Content contentContainerStyle={styles.bodyContent}>
                    <ScrollView>
                        
                        {this.state.primary_mobile_no != null ?
                            <Text style={styles.headerText}>Primary Mobile_no</Text> : null}
                        {this.state.primary_mobile_no != null ?
                            <Card style={styles.cardEmail}>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Icon name="call" style={styles.centeredIcons}></Icon>

                                    <Text style={styles.customText}>{this.state.primary_mobile_no}</Text>
                                    <Right>
                                        <Icon style={{ color: 'gray', fontSize: 25 }} name='ios-lock' />
                                    </Right>
                                </Item>
                            </Card> : null}
                            <View style={{ marginTop: 30 }}>
                        <Text style={styles.headerText}>Edit Secondary Mobile_No</Text>
                       
                        <Card style={styles.cardEmail}>

                            <Item style={{ borderBottomWidth: 0 }}>
                                <Picker style={{ fontFamily: 'OpenSans'}}
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    textStyle={{ color: "#775DA3",backgroundColor: "gray", }}
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
                                <Input placeholder="Edit Your Number" style={styles.transparentLabel} keyboardType="email-address"
                                    onChangeText={(mobile_no) => this.setState({ mobile_no })}
                                    value={String(this.state.mobile_no)}
                                    testID='updateContact' />
                            </Item>




                            <Item style={{ borderBottomWidth: 0,marginTop: 35}}>
                                <Right>
                                    <Button success style={styles.button2} onPress={() => this.handleContactUpdate()} testID='clickUpdateContact'>
                                        <Text uppercase={false} note style={styles.buttonText}>Update</Text>
                                    </Button>
                                </Right>
                            </Item>


                        </Card>

                      </View>



                        
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

