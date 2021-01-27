import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Footer, Icon, DatePicker,
    FooterTab, H3, Toast, ListItem, Radio, Picker, View, Card,
} from 'native-base';
import { userFiledsUpdate, logout } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { Row, Col } from 'react-native-easy-grid';

import { Image, BackHandler, AsyncStorage, ScrollView, Platform, FlatList, TouchableOpacity } from 'react-native';
import styles from './style.js';
import { formatDate, subTimeUnit } from "../../../setup/helpers";
import Spinner from '../../../components/Spinner';
import { relationship, getGender } from "../../common";


class UpdateFamilyMembers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            family_members: [],
            relationship: '',
            name: '',
            age: '',
            gender: '',
            fromProfile: false,
            isLoading: false,
            updateButton: true,
            errorMsg: '',

        }
    }
    componentDidMount() {
        this.getFamilyDetails();
    }

    async getFamilyDetails() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        console.log("userData", userData)
        const fromProfile = navigation.getParam('fromProfile') || false
        console.log("fromProfile", fromProfile)
        if (fromProfile) {
            await this.setState({
                name: userData.family_members[0].name,
                age: parseInt(userData.family_members[0].age),
                gender: userData.family_members[0].gender,
                relationship: userData.family_members[0].relationship,
                updateButton: true,
                fromProfile: true

            })
        }
    }

    addedFamilyMembers = async () => {
        const { name, age, gender, relationship,fromProfile } = this.state
        console.log("relationship", relationship)
        if (name == '' || age == '' || gender == '' || relationship == '' || relationship == 'Select Relationship') {
            this.setState({ errorMsg: 'Kindly fill all the fields...' })
            return false;
        }
        else {
            this.setState({ errMsg: '' })
            let temp = this.state.family_members;
            temp.push({
                name: name,
                age: Number(age),
                gender: gender,
                relationship: relationship

            });
            console.log("temp", temp)

            await this.setState({ family_members: temp, updateButton: false });
            if(fromProfile){
                this.updateFamilyMembers()
            }
            await this.setState({ name: '', age: '', gender: '', relationship: '' });

        }
    }

    updateFamilyMembers = async () => {
        try {
            this.setState({ errorMsg: '', isLoading: true, updateButton: false });
            let requestData = {
                family_members: this.state.family_members
            };
            const userId = await AsyncStorage.getItem('userId')
            console.log("requestData", requestData)

            let response = await userFiledsUpdate(userId, requestData);
            console.log("response", response)
            if (response.success) {
                Toast.show({
                    text: 'Your family member details are updated',
                    type: "success",
                    duration: 3000
                });

                this.props.navigation.navigate('Profile');

            }
            else {
                Toast.show({
                    text: response.message,
                    type: "danger",
                    duration: 3000
                });
                this.setState({ isLoading: false });
            }

        }

        catch (e) {
            Toast.show({
                text: 'Exception Occured' + e,
                duration: 3000
            });
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    removeSelected = async (index) => {
        let temp = this.state.family_members;
        temp.splice(index, 1);
        this.setState({ family_members: temp, updateButton: false });
    }

    render() {
        const { age, gender, fromProfile } = this.state;

        return (

            <Container >
                <Content contentContainerStyle={styles.bodyContent}>
                    <ScrollView>
                        {this.state.isLoading ? <Spinner color='blue'
                            visible={this.state.isLoading}
                        /> : null}

                        <Text style={styles.headerText}>Update Your Family Details</Text>
                        <Card style={styles.cardStyle}>
                            <View style={{ marginLeft: -10 }}>
                                <Form style={{ marginTop: 10 }}>

                                    <Item style={{ borderBottomWidth: 0, }}>
                                        <Input placeholder="Enter name" style={styles.transparentLabel2}
                                            returnKeyType={'next'}
                                            keyboardType={"default"}
                                            value={this.state.name}
                                            onChangeText={(name) => this.setState({ name, updateButton: false })}
                                            blurOnSubmit={false}
                                            testID="editName"
                                        />
                                    </Item>

                                    <Item style={{ borderBottomWidth: 0, }}>
                                        <Input placeholder="Enter age" style={styles.transparentLabel2}
                                            returnKeyType={'done'}
                                            keyboardType="numeric"
                                            value={String(age)}
                                            onChangeText={(value) => this.setState({ age: value, updateButton: false })}
                                            blurOnSubmit={false}
                                            testID="editAge"
                                        />
                                    </Item>

                                    <View style={{ marginTop: 5, borderBottomWidth: 0, flexDirection: 'row' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={gender === "M" ? true : false}
                                                onPress={() => this.setState({ gender: "M", updateButton: false })} />
                                            <Text style={{
                                                fontFamily: 'OpenSans', fontSize: 12, marginLeft: 10
                                            }}>Male</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={gender === "F" ? true : false}
                                                onPress={() => this.setState({ gender: "F", updateButton: false })} />
                                            <Text style={{
                                                fontFamily: 'OpenSans', fontSize: 12, marginLeft: 10
                                            }}>Female</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={gender === "O" ? true : false}
                                                onPress={() => this.setState({ gender: "O", updateButton: false })} />
                                            <Text style={{
                                                fontFamily: 'OpenSans', fontSize: 12, marginLeft: 10
                                            }}>Others</Text>
                                        </View>
                                    </View>

                                    <Item last style={{ borderBottomWidth: 0, marginRight: 10, height: 45, backgroundColor: '#F1F1F1', marginTop: 10, borderRadius: 5, marginLeft: 10 }}>
                                        <Picker style={styles.transparentLabel2}
                                            mode="dropdown"
                                            placeholderStyle={{ fontSize: 13, marginLeft: -5 }}
                                            iosIcon={<Icon name="ios-arrow-down" style={{ color: 'gray', fontSize: 20, marginLeft: 5 }} />}
                                            textStyle={{ color: "gray", left: 0, marginLeft: -5 }}
                                            note={false}
                                            itemStyle={{

                                                paddingLeft: 10,
                                                fontSize: 16,
                                            }}
                                            itemTextStyle={{ color: '#5cb85c', }}
                                            style={{ width: 320 }}
                                            onValueChange={(value) => { this.setState({ relationship: value, updateButton: false }) }}
                                            selectedValue={this.state.relationship}
                                            testID="editBloodGroup"
                                        >
                                            {relationship.map((value, key) => {

                                                return <Picker.Item label={String(value)} value={String(value)} key={key}
                                                />
                                            })
                                            }

                                        </Picker>
                                    </Item>

                                    <View>
                                        <Button primary disabled={this.state.updateButton} style={this.state.updateButton ? styles.addressButtonDisable : styles.addressButton} block onPress={() =>  this.addedFamilyMembers() } testID="addDetails">
                                            <Text style={styles.buttonText}>{fromProfile ? "UPDATE" : "ADD"}</Text>
                                        </Button>
                                    </View>

                                    {this.state.errorMsg ? <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{this.state.errorMsg}</Text> : null}
                                </Form>

                            </View>
                        </Card>
                        {this.state.family_members.length != 0 ?
                            <Card style={styles.cardStyle}>
                                <View>
                                    <Text style={styles.headText}>Added Details</Text>
                                    <View style={{ marginTop: 10 }}>
                                        <FlatList
                                            data={this.state.family_members}
                                            extraData={this.state}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) =>
                                                <View>
                                                    <Row style={{ marginTop: 10, }}>
                                                        <Col size={8}>
                                                            <Row>
                                                                <Col size={2}>
                                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', fontWeight: '500' }}>Name</Text>
                                                                </Col>
                                                                <Col size={.5}>
                                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', fontWeight: '500' }}>-</Text>
                                                                </Col>
                                                                <Col size={7}>
                                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000' }}>{item.name}</Text>

                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col size={0.5}>
                                                            <TouchableOpacity onPress={() => this.removeSelected(index)}>
                                                                <Icon active name='ios-close' style={{ color: '#d00729', fontSize: 18 }} />
                                                            </TouchableOpacity>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col size={10}>
                                                            <Row>
                                                                <Col size={2}>
                                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', fontWeight: '500' }}>Age</Text>
                                                                </Col>
                                                                <Col size={.5}>
                                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', fontWeight: '500' }}>-</Text>
                                                                </Col>
                                                                <Col size={7.5}>
                                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000' }}>{(item.age) + ' - ' + getGender(item)}</Text>

                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col size={10}>
                                                            <Row>
                                                                <Col size={2}>
                                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', fontWeight: '500' }}>Relation</Text>
                                                                </Col>
                                                                <Col size={.5}>
                                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000', fontWeight: '500' }}>-</Text>
                                                                </Col>
                                                                <Col size={7.5}>
                                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000' }}>{item.relationship}</Text>

                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </View>
                                            } />
                                    </View>
                                </View>

                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Button primary disabled={this.state.updateButton} style={this.state.updateButton ? styles.addressButtonDisable : styles.addressButton} block onPress={() => this.updateFamilyMembers()} testID="updateBasicDetails">
                                        <Text style={styles.buttonText}>UPDATE</Text>
                                    </Button>
                                </View>
                            </Card>
                            : null}
                    </ScrollView>
                </Content>


            </Container>

        )

    }
}


function userFamilyDetailsState(state) {
    return {
        user: state.user
    }
}
export default connect(userFamilyDetailsState)(UpdateFamilyMembers)
