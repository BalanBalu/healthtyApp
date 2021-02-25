import React, { PureComponent } from 'react';
import { Text, Container, Content, Picker, Form, Icon, Col, Row, Radio, } from 'native-base';
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { primaryColor } from '../../../setup/config'
import DateTimePicker from 'react-native-modal-datetime-picker';
const insuranceCompany = ["Choose Insurance Company", "New India Assurance Company Limited", "Oriental Insurance Company Limited", "National Insurance Company Limited"]
const ProductType = ["Choose Product Type", 'Health', 'Motor', 'Personal accident', 'Term life']
const TPAorPayer = ["Choose TPA/Payer", "New India Assurance Company Limited", "Oriental Insurance Company Limited", "National Insurance Company Limited"]

class AddInsurance extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            insuranceCompanyList: null,
            ProductTypeList: null,
            renewal: true,
            isOnlyDateTimePickerVisible: false,
            dateTimePickerForEnddate: false
        }
    }
    showOnlyDateTimePicker = () => {
        this.setState({ isOnlyDateTimePickerVisible: true })
    }
    hideOnlyDateTimePicker = () => {
        this.setState({ isOnlyDateTimePickerVisible: false })
    }
    handleOnlyDateTimePicker = (date) => {
        try {
            this.setState({ isOnlyDateTimePickerVisible: false, })
        } catch (error) {
            console.error('Error on Date Picker: ', error);
        }
    }
    showOnlyDateTimePickerEnddate = () => {
        this.setState({ dateTimePickerForEnddate: true })
    }
    hideOnlyDateTimePickerEnddate = () => {
        this.setState({ dateTimePickerForEnddate: false })
    }
    handleOnlyDateTimePickerEnddate = (date) => {
        try {
            this.setState({ dateTimePickerForEnddate: false, })
        } catch (error) {
            console.error('Error on Date Picker: ', error);
        }
    }


    render() {
        const { ProductTypeList } = this.state
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

                                        placeholderStyle={{ fontSize: 16, marginLeft: -5 }}
                                        iosIcon={<Icon name="ios-arrow-down" style={{ color: 'gray', fontSize: 20, marginLeft: 170 }} />}
                                        textStyle={{ color: "gray", left: 0, marginLeft: -5 }}
                                        note={false}
                                        itemStyle={{
                                            paddingLeft: 10,
                                            fontSize: 16,
                                        }}
                                        itemTextStyle={{ color: '#5cb85c', }}
                                        style={{ width: undefined, color: '#000' }}
                                        onValueChange={(sample) => { this.setState({ insuranceCompanyList: sample }) }}
                                        selectedValue={this.state.insuranceCompanyList}
                                        testID="editBloodGroup"
                                    >
                                        {insuranceCompany.map((value, key) => {
                                            return <Picker.Item label={String(value)} value={String(value)} key={key}
                                            />
                                        })
                                        }
                                    </Picker>
                                </View>
                                <Text style={styles.subHeadingText}>Select Product Type</Text>

                                <View style={styles.formStyle6}>
                                    <Picker style={styles.userDetailLabel}
                                        mode="dropdown"

                                        placeholderStyle={{ fontSize: 16, marginLeft: -5 }}
                                        iosIcon={<Icon name="ios-arrow-down" style={{ color: 'gray', fontSize: 20, marginLeft: 170 }} />}
                                        textStyle={{ color: "gray", left: 0, marginLeft: -5 }}
                                        note={false}
                                        itemStyle={{
                                            paddingLeft: 10,
                                            fontSize: 16,
                                        }}
                                        itemTextStyle={{ color: '#5cb85c', }}
                                        style={{ width: undefined, color: '#000' }}
                                        onValueChange={(sample) => { this.setState({ ProductTypeList: sample }) }}
                                        selectedValue={this.state.ProductTypeList}
                                        testID="editBloodGroup"
                                    >
                                        {ProductType.map((value, key) => {
                                            return <Picker.Item label={String(value)} value={String(value)} key={key}
                                            />
                                        })
                                        }
                                    </Picker>
                                </View>
                                {ProductTypeList === 'Health' ?
                                    <View>
                                        <Text style={styles.subHeadingText}>Select TPA/Payer </Text>

                                        <View style={styles.formStyle6}>
                                            <Picker style={styles.userDetailLabel}
                                                mode="dropdown"

                                                placeholderStyle={{ fontSize: 16, marginLeft: -5 }}
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
                                    </View> : null}
                                {ProductTypeList === 'Motor' ?
                                    <View>
                                        <Text style={styles.subHeadingText}>Select Motor Type</Text>
                                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Radio
                                                    standardStyle={true}
                                                    selected={this.state.renewal}
                                                />
                                                <Text style={styles.radioButtonStyle}>Two Wheeler</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                                <Radio
                                                    standardStyle={true}
                                                    selected={!this.state.renewal}
                                                />
                                                <Text style={styles.radioButtonStyle}>Passenger Car</Text>
                                            </View>

                                        </View>
                                    </View> : null}
                                <Text style={styles.subHeadingText}>Enter Policy Number</Text>
                                <TextInput placeholder="Enter Policy Number" placeholderTextColor={"#909090"} style={styles.textInputStyle} placeholderStyle={{ marginTop: 2 }} />
                                <Row>
                                    <Col size={5} >
                                        <Text style={styles.subHeadingText}>Select Start Date</Text>
                                        <TouchableOpacity onPress={() => { this.setState({ isOnlyDateTimePickerVisible: !this.state.isOnlyDateTimePickerVisible }) }} >

                                            <View style={styles.searchSection}>
                                                <AntDesign name="calendar" style={{ fontSize: 20, padding: 2 }} />
                                                <DateTimePicker
                                                    mode={'date'}
                                                    minimumDate={new Date(1940, 0, 1)}
                                                    value={this.state.date_of_birth}
                                                    isVisible={this.state.isOnlyDateTimePickerVisible}
                                                    onConfirm={this.handleOnlyDateTimePicker}
                                                    onCancel={() => this.setState({ isOnlyDateTimePickerVisible: !this.state.isOnlyDateTimePickerVisible })}
                                                />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Enter Start Date"
                                                    // onChangeText={(searchString) => {this.setState({searchString})}}
                                                    underlineColorAndroid="transparent"
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col size={5} style={{ marginLeft: 10 }}>
                                        <Text style={styles.subHeadingText}>Select End Date</Text>
                                        <TouchableOpacity onPress={() => { this.setState({ dateTimePickerForEnddate: !this.state.dateTimePickerForEnddate }) }} >

                                            <View style={styles.searchSection}>
                                                <AntDesign name="calendar" style={{ fontSize: 20, padding: 2 }} />
                                                <DateTimePicker
                                                    mode={'date'}
                                                    minimumDate={new Date(1940, 0, 1)}
                                                    value={this.state.date_of_birth}
                                                    isVisible={this.state.dateTimePickerForEnddate}
                                                    onConfirm={this.handleOnlyDateTimePickerEnddate}
                                                    onCancel={() => this.setState({ dateTimePickerForEnddate: !this.state.dateTimePickerForEnddate })}
                                                />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Enter End Date"
                                                    // onChangeText={(searchString) => {this.setState({searchString})}}
                                                    underlineColorAndroid="transparent"
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </Col>
                                </Row>
                                <Text style={styles.subHeadingText}>Would you like to set insurance renewal reminder?</Text>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={this.state.renewal}
                                        />
                                        <Text style={styles.radioButtonStyle}>Yes</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={!this.state.renewal}
                                        />
                                        <Text style={styles.radioButtonStyle}>No</Text>
                                    </View>

                                </View>
                                <Text style={styles.subHeadingText}>Would you like to renew your policy online ?</Text>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={this.state.renewal}
                                        />
                                        <Text style={styles.radioButtonStyle}>Yes</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={!this.state.renewal}
                                        />
                                        <Text style={styles.radioButtonStyle}>No</Text>
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
                    <Text style={{ fontSize: 16, fontWeight: 'OpenSans', fontWeight: 'bold', color: '#fff' }}>Submit</Text>
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
        marginTop: 25,
        fontWeight: '700',
    },
    textInputStyle: {
        borderColor: '#909090',
        borderWidth: 1,
        height: 35,
        marginTop: 8,
        borderRadius: 5,
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#909090',
        borderWidth: 1,
        height: 30,
        borderRadius: 5,
        marginTop: 8,

    },
    searchIcon: {
        // padding: 1,

    },
    input: {
        flex: 1,
        paddingTop: 2,
        paddingRight: 2,
        paddingBottom: 2,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#909090',

    },
    radioButtonStyle: {
        fontSize: 14,
        fontFamily: 'OpenSans',
    }
})