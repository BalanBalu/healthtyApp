import React, { PureComponent } from 'react';
import { Text, Container, ListItem, List, Content, Picker, Form, Icon, Col, Row, Radio } from 'native-base';
import { connect } from 'react-redux'
import { View, FlatList, AsyncStorage, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { primaryColor } from '../../../setup/config'
const insuranceCompany = ["Choose Insurance Company", "New India Assurance Company Limited", "Oriental Insurance Company Limited", "National Insurance Company Limited"]
const ProductType = ["Choose Product Type", 'Health', 'Motor', 'Personal accident', 'term life']
const TPAorPayer = ["Choose TPA/Payer", "New India Assurance Company Limited", "Oriental Insurance Company Limited", "National Insurance Company Limited"]

class AddInsurance extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            insuranceCompany: null,
            renewal: true
        }
    }


    render() {

        return (
            <Container>
                <Content >
                    <View>
                        <ScrollView style={{ padding: 20, marginBottom: 20 }}>
                            <Form>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 16, fontWeight: '700' }}>Select Insurance Company</Text>

                                <View style={styles.formStyle6}>
                                    <Picker style={styles.userDetailLabel}
                                        mode="dropdown"
                                        placeholder='Select Blood Group'
                                        placeholderStyle={{ fontSize: 15, marginLeft: -5 }}
                                        iosIcon={<Icon name="ios-arrow-down" style={{ color: 'gray', fontSize: 20, marginLeft: 170 }} />}
                                        textStyle={{ color: "gray", left: 0, marginLeft: -5 }}
                                        note={false}
                                        itemStyle={{
                                            paddingLeft: 10,
                                            fontSize: 16,
                                        }}
                                        itemTextStyle={{ color: '#5cb85c', }}
                                        style={{ width: undefined, color: '#000' }}
                                        onValueChange={(sample) => { this.setState({ insuranceCompany: sample }) }}
                                        selectedValue={insuranceCompany}
                                        testID="editBloodGroup"
                                    >
                                        {insuranceCompany.map((value, key) => {
                                            return <Picker.Item label={String(value)} value={String(value)} key={key}
                                            />
                                        })
                                        }
                                    </Picker>
                                </View>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 16, fontWeight: '700', marginTop: 20 }}>Select Insurance Company</Text>

                                <View style={styles.formStyle6}>
                                    <Picker style={styles.userDetailLabel}
                                        mode="dropdown"
                                        placeholder='Select Blood Group'
                                        placeholderStyle={{ fontSize: 15, marginLeft: -5 }}
                                        iosIcon={<Icon name="ios-arrow-down" style={{ color: 'gray', fontSize: 20, marginLeft: 170 }} />}
                                        textStyle={{ color: "gray", left: 0, marginLeft: -5 }}
                                        note={false}
                                        itemStyle={{
                                            paddingLeft: 10,
                                            fontSize: 16,
                                        }}
                                        itemTextStyle={{ color: '#5cb85c', }}
                                        style={{ width: undefined, color: '#000' }}
                                        onValueChange={(sample) => { this.setState({ insuranceCompany: sample }) }}
                                        selectedValue={ProductType}
                                        testID="editBloodGroup"
                                    >
                                        {ProductType.map((value, key) => {
                                            return <Picker.Item label={String(value)} value={String(value)} key={key}
                                            />
                                        })
                                        }
                                    </Picker>
                                </View>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 16, fontWeight: '700', marginTop: 20 }}>Select Insurance Company</Text>

                                <View style={styles.formStyle6}>
                                    <Picker style={styles.userDetailLabel}
                                        mode="dropdown"
                                        placeholder='Select Blood Group'
                                        placeholderStyle={{ fontSize: 15, marginLeft: -5 }}
                                        iosIcon={<Icon name="ios-arrow-down" style={{ color: 'gray', fontSize: 20, marginLeft: 170 }} />}
                                        textStyle={{ color: "gray", left: 0, marginLeft: -5 }}
                                        note={false}
                                        itemStyle={{
                                            paddingLeft: 10,
                                            fontSize: 16,
                                        }}
                                        itemTextStyle={{ color: '#5cb85c', }}
                                        style={{ width: undefined, color: '#000' }}
                                        onValueChange={(sample) => { this.setState({ insuranceCompany: sample }) }}
                                        selectedValue={TPAorPayer}
                                        testID="editBloodGroup"
                                    >
                                        {TPAorPayer.map((value, key) => {
                                            return <Picker.Item label={String(value)} value={String(value)} key={key}
                                            />
                                        })
                                        }
                                    </Picker>
                                </View>
                                <Text style={styles.subHeadingText}>Enter Policy Number</Text>
                                <TextInput placeholder="Enter Policy Number" placeholderTextColor={"#909090"} style={styles.textInputStyle} placeholderStyle={{ marginTop: 2 }} />
                                <Row>
                                    <Col size={5}>
                                        <Text style={styles.subHeadingText}>Select Start Date</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <AntDesign name="calendar" style={{ fontSize: 20, position: 'absolute', left: 12, top: 15 }} />
                                            <TextInput placeholder="Enter Start Date" placeholderTextColor={"#909090"} style={[styles.textInputStyle, { paddingLeft: 30, width: 150 }]} placeholderStyle={{ padding: 8 }} />
                                        </View>

                                    </Col>
                                    <Col size={5} style={{ marginLeft: 10 }}>
                                        <Text style={styles.subHeadingText}>Select End Date</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <AntDesign name="calendar" style={{ fontSize: 20, position: 'absolute', left: 12, top: 15 }} />
                                            <TextInput placeholder="Enter End Date" placeholderTextColor={"#909090"} style={[styles.textInputStyle, { marginLeft: 5, paddingLeft: 30, paddingTop: 10, width: 150 }]} placeholderStyle={{ marginTop: 10 }} />
                                        </View>
                                    </Col>
                                </Row>
                                <Text style={styles.subHeadingText}>Would you like to set insurance renewal reminder?</Text>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={this.state.renewal}
                                        />
                                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', }}>Yes</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={!this.state.renewal}
                                        />
                                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', }}>No</Text>
                                    </View>

                                </View>
                                <Text style={styles.subHeadingText}>Would you like to renew your policy online ?</Text>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={this.state.renewal}
                                        />
                                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', }}>Yes</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={!this.state.renewal}
                                        />
                                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', }}>No</Text>
                                    </View>

                                </View>

                            </Form>
                        </ScrollView>
                    </View>
                </Content>
                <TouchableOpacity style={{
                    alignSelf: 'stretch',
                    backgroundColor: primaryColor,
                    height: 45, justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{ fontSize: 15, fontWeight: 'OpenSans', fontWeight: 'bold', color: '#fff' }}>Submit</Text>
                </TouchableOpacity>
            </Container>
        )
    }
}


export default AddInsurance

const styles = StyleSheet.create({
    formStyle6: {
        borderColor: '#909090',
        borderWidth: 0.5,
        height: 35,
        marginTop: 10,
        justifyContent: 'center',
        borderRadius: 5
    },
    subHeadingText: {
        fontSize: 16,
        fontFamily: 'OpenSans',
        marginTop: 20,
        fontWeight: '700',
    },
    textInputStyle: {
        borderColor: '#909090',
        borderWidth: 1,
        height: 35,
        marginTop: 8,
        borderRadius: 5,
    },
})