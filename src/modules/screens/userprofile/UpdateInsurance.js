import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, CheckBox, Left, Right, Thumbnail, Body, Icon, Card, Input, Toast, View } from 'native-base';
import { userFiledsUpdate } from '../../providers/auth/auth.actions';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux'
import styles from './style.js';
import Spinner from '../../../components/Spinner';




class UpdateInsurance extends Component {
    constructor(props) {
        super(props)
        this.state = {
            insurance_no: '',
            insurance_provider: '',
            active: true,
            isLoading: false

        }
    }

    componentDidMount() {
        this.bindInsuranceValues();
    }

    bindInsuranceValues() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        const fromProfile = navigation.getParam('fromProfile') || false

        if (fromProfile && userData.insurance) {
            this.setState({
                insurance_no: userData.insurance[0].insurance_no,
                insurance_provider: userData.insurance[0].insurance_provider,
                active: userData.insurance[0].active,
            })
        }

    }

    handleInsuranceUpdate = async () => {

        try {
            this.setState({ isLoading: true });
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                insurance: [{
                    insurance_no: this.state.insurance_no,
                    insurance_provider: this.state.insurance_provider,
                    active: this.state.active
                }]
            };
            let response = await userFiledsUpdate(userId, data);
            if (response.success) {
                Toast.show({
                    text: 'Inusrance updated Successfully',
                    type: "success",
                    duration: 3000,

                })
                this.props.navigation.navigate('Profile');


            } else {
                Toast.show({
                    text:response.message,
                    type: "danger",
                    duration: 3000
                })
            }
            this.setState({ isLoading:false});



        } catch (e) {
            console.log(e);
        }
    }



    render() {
        const { user: { isLoading } } = this.props;


        return (
            <Container style={styles.container}>


                <Content style={styles.bodyContent} contentContainerStyle={{ flex: 1, height: '100%' }}>

                    <Spinner color='blue'
                        visible={this.state.isLoading}
                        textContent={'Please wait updating...'}
                    />

                    <Text style={{ fontFamily: 'OpenSans', marginLeft: 7, marginTop: 60, fontWeight: 'bold', fontSize: 22 }}>Edit Insurance</Text>

                    <Text style={{ color: 'gray', fontSize: 13, fontFamily: 'OpenSans', marginTop: 10, marginLeft: 7 }}>Update your Insurance</Text>
                    <Card style={{ padding: 10, borderRadius: 10, marginTop: 20, height: 250 }}>


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




                        <Item style={{ borderBottomWidth: 0 }}>
                            <Right>
                                <Button success style={styles.updateButton} onPress={() => this.handleInsuranceUpdate()} testID='clickUpdateInsurance'>
                                    <Text uppercase={false} note style={{ color: '#fff', fontFamily: 'OpenSans' }}>Update</Text>
                                </Button>
                            </Right>
                        </Item>


                    </Card>







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

