import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, CheckBox, Left, Right, Thumbnail, Body, Icon, Card, Input, Toast, View } from 'native-base';
import { userFiledsUpdate } from '../../providers/auth/auth.actions';
import { AsyncStorage, ScrollView } from 'react-native';
import { connect } from 'react-redux'
import styles from './style.js';
import Spinner from '../../../components/Spinner';




class UpdateInsurance extends Component {
    constructor(props) {
        super(props)
        this.state = {
            insurance_no: '',
            insurance_provider: '',
            isLoading: false,
            userData: ''

        }
    }

    componentDidMount() {
        this.bindInsuranceValues();
    }

    bindInsuranceValues() {
        console.log("nind values")
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        console.log(userData);


        if (userData.insurance) {
            this.setState({
                insurance_no: userData.insurance[0].insurance_no,
                insurance_provider: userData.insurance[0].insurance_provider,
                userData
            })
        }

    }

    commonUpdateInsuranceMethod = async () => {
        console.log("console");
        let userId = await AsyncStorage.getItem('userId');
        console.log(userId)
        let data = {
            insurance: [{
                insurance_no: this.state.insurance_no,
                insurance_provider: this.state.insurance_provider,
                active: true
            }]
        };
        console.log(data);
        let response = await userFiledsUpdate(userId, data);
        console.log('response' + JSON.stringify(response));
        if (response.success) {
            Toast.show({
                text: 'Inusrance updated Successfully',
                type: "success",
                duration: 3000,
            })
            this.props.navigation.navigate('Profile');

        } else {
            Toast.show({
                text: 'Fields should not be empty',
                type: "danger",
                duration: 3000
            })
        }
        this.setState({ isLoading: false });
    }

    handleInsuranceUpdate = async () => {
        console.log("pdate")
        const { userData, insurance_no, insurance_provider } = this.state
        console.log(userData.insurance);
        try {
            console.log("try");
            this.setState({ isLoading: true });
            if (userData.insurance !== undefined) {
                if (insurance_no != userData.insurance[0].insurance_no ||
                    insurance_provider != userData.insurance[0].insurance_provider) {
                    this.commonUpdateInsuranceMethod();
                } else {
                    this.props.navigation.navigate('Profile');

                }

            } else {
                this.commonUpdateInsuranceMethod();
            }
        } catch (e) {
            console.log("catch")
            console.log(e);
        }

    }



    render() {
        const { user: { isLoading } } = this.props;


        return (
            <Container style={styles.container}>


<Content contentContainerStyle={styles.bodyContent}>

                    <ScrollView>
                        <Spinner color='blue'
                            visible={this.state.isLoading}
                            textContent={'Loading...'}
                        />

                        <Text style={styles.headerText}>Edit Insurance</Text>

                        <Card style={{ padding: 10, borderRadius: 10, marginTop: 20, height: 250, marginBottom: 20 }}>


                            <Item style={{ borderBottomWidth: 0, marginTop: 25 }}>
                                <Icon name='heartbeat' type='FontAwesome' style={styles.centeredIcons}></Icon>
                                <Input placeholder="Edit insurance number" style={styles.transparentLabel} keyboardType="email-address"
                                    onChangeText={(insurance_no) => this.setState({ insurance_no })}
                                    value={this.state.insurance_no}
                                    testID='updateInsuranceNo' />
                            </Item>

                            <Item style={{ borderBottomWidth: 0, marginTop: 25 }}>
                                <Icon name='heartbeat' type='FontAwesome' style={styles.centeredIcons}></Icon>
                                <Input placeholder="Edit insurance provider" style={styles.transparentLabel} keyboardType="email-address"
                                    onChangeText={(insurance_provider) => this.setState({ insurance_provider })}
                                    value={this.state.insurance_provider}
                                    testID='updateInsuranceProvider' />
                            </Item>




                            <Item style={{ borderBottomWidth: 0, marginTop: 10}}>
                                <Right>
                                    <Button success style={styles.button2} onPress={() => this.handleInsuranceUpdate()} testID='clickUpdateInsurance'>
                                        <Text uppercase={false} note style={styles.buttonText}>Update</Text>
                                    </Button>
                                </Right>
                            </Item>


                        </Card>





                    </ScrollView>

                </Content >

            </Container >

        )
    }

}
function profileState(state) {

    return {
        user: state.user
    }
}
export default connect(profileState)(UpdateInsurance)

