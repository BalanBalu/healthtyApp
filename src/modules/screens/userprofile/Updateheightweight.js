import React, { Component } from 'react';
import { Container, Content, Text, Button, H3, Item, List, View, CheckBox, Left, Right, Thumbnail, Body, Icon, Card, Input, Toast, Row } from 'native-base';
import {  ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { userFiledsUpdate } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import styles from './style.js'
import Spinner from '../../../components/Spinner';
import { Col } from 'react-native-easy-grid';
import { validatePassword } from '../../common'



class UpdateHeightWeight extends Component {
    constructor(props) {
        super(props)
        const { navigation } = this.props;
       
        this.state = {
            setWeight: navigation.getParam('weight') || null,
            setHeight: navigation.getParam('height') || null,
            isLoading: false,
            errorMsg: '',
        }
       
    }

    componentDidMount() {
        
    }

    UpdateHeightAndWeight= async () => {    
        try {
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                height: this.state.setHeight,
                weight: this.state.setWeight,
            };
            this.setState({  isLoading: true });

            let response = await userFiledsUpdate(userId, data);
            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })
               this.props.navigation.pop();
            } 
            this.setState({ isLoading: false });

        }
        catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        } 
}
   
    render() {

        return (
            <Container style={styles.container}>

                <Content contentContainerStyle={styles.bodyContent}>
                    <ScrollView>
                        <Spinner color='blue'
                            visible={this.state.isLoading}
                        />


                        <Text style={styles.headerText}>Update</Text>
                        <View style={styles.cardEmail}>
                        <Icon name="ios-body" style={styles.centeredIcons}></Icon>
                       
                            <Item style={{ borderBottomWidth: 0 }}>
                            
                            <Text style={{ fontSize: 15, fontFamily: 'Roboto', marginTop: 5, marginRight: 10 }} >Height : </Text>

                                <Col style={styles.transparentLabel1}>
                                    
                                    <Row>
                                        <Input placeholder="Height in cm"
                                            style={{ fontSize: 13, fontFamily: 'Roboto', marginTop: -5 }}
                                            value={this.state.setHeight}
                                             onChangeText={(setHeight) => this.setState({setHeight})}
                                            /> 
                                       <Text style={{ fontSize: 13, fontFamily: 'Roboto', marginTop:10, marginRight:50 }}>cm</Text>
                                    </Row>
                                </Col>


                            </Item>
                            <Item style={{ borderBottomWidth: 0 }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Roboto', marginTop: 5, marginRight: 10 }} >Weight : </Text>
                                <Col style={styles.transparentLabel1}>
                                    <Row>
                                        <Input placeholder="Weight in kg"
                                             style={{ fontSize: 13, fontFamily: 'Roboto', marginTop: -5 }}
                                             value={this.state.setWeight}
                                             onChangeText={(setWeight) => this.setState({setWeight})}
                                             />
                                        <Text style={{ fontSize: 13, fontFamily: 'Roboto', marginTop:10, marginRight:50 }}>kg</Text>
                                    </Row>
                                </Col>

                            </Item>
                            {this.state.errorMsg ? <Text style={{ paddingLeft: 20, fontSize: 13, fontFamily: 'Roboto', color: 'red' }}>{this.state.errorMsg}</Text> : null}

                            <Item style={{ borderBottomWidth: 0, marginTop: 10 }}>
                                <Right>
                                    <Button success style={styles.button2} onPress={() => this.UpdateHeightAndWeight()} testID='clickUpdateHeightAndWidth'>
                                        <Text uppercase={false} note style={styles.buttonText}>Update</Text>
                                    </Button>
                                </Right>
                            </Item>


                        </View>

                    </ScrollView>
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
export default connect(profileState)(UpdateHeightWeight)


