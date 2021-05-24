import React, { PureComponent } from 'react';
import { Text, View, Item, Input, Icon, Radio } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import styles from '../Styles';
import { primaryColor } from '../../../../setup/config';



const ClaimDetails = ({ isSelected, }) => {

    return (
        <View style={{ padding: 10, marginTop: 10, marginBottom: 20 }}>
            <View style={styles.form_field_view}>
                <Text style={[styles.Heading_form_field_inline_label]}>a.</Text>
                <Text style={[styles.Heading_form_field, { paddingTop: 10, paddingLeft: 10 }]}>ICD_10_CODES</Text>
                <Text style={[styles.Heading_form_field, { paddingTop: 10, paddingLeft: 10 }]}>Description</Text>

            </View>
            <View style={styles.form_field_view}>
                <View style={[styles.form_field_inline_label, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 12, textAlign: 'center' }}>i).Primary Diagnosis</Text>

                    {/* <Text style={{ fontSize: 12 }}>Diagnosis</Text> */}

                </View>
                <Input
                    placeholder="Enter ICD code "
                    placeholderTextColor={'#CDD0D9'}
                    returnKeyType={'next'}
                    //   value={employeeId}
                    style={styles.form_field}
                     keyboardType={'default'}
                //   editable={employeeId == undefined ? true : false}
                //   onChangeText={(enteredEmployeeIdText) =>
                //     this.setState({employeeId: enteredEmployeeIdText})
                //   }
                />
                <Input
                    placeholder="Enter Description"
                    placeholderTextColor={'#CDD0D9'}
                    returnKeyType={'next'}
                    //   value={employeeId}
                    style={styles.form_field}
                     keyboardType={'default'}
                //   editable={employeeId == undefined ? true : false}
                //   onChangeText={(enteredEmployeeIdText) =>
                //     this.setState({employeeId: enteredEmployeeIdText})
                //   }
                />
            </View>
            <View style={styles.form_field_view}>
                <View style={[styles.form_field_inline_label, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 12, textAlign: 'center' }}>ii).Additional Diagnosis</Text>

                    {/* <Text style={{ fontSize: 12 }}>Diagnosis</Text> */}

                </View>
                <Input
                    placeholder="Enter ICD code "
                    placeholderTextColor={'#CDD0D9'}
                    returnKeyType={'next'}
                    //   value={employeeId}
                    style={styles.form_field}
                     keyboardType={'default'}
                //   editable={employeeId == undefined ? true : false}
                //   onChangeText={(enteredEmployeeIdText) =>
                //     this.setState({employeeId: enteredEmployeeIdText})
                //   }
                />
                <Input
                    placeholder="Enter Description"
                    placeholderTextColor={'#CDD0D9'}
                    returnKeyType={'next'}
                    //   value={employeeId}
                    style={styles.form_field}
                     keyboardType={'default'}
                //   editable={employeeId == undefined ? true : false}
                //   onChangeText={(enteredEmployeeIdText) =>
                //     this.setState({employeeId: enteredEmployeeIdText})
                //   }
                />
            </View>
            <View style={styles.form_field_view}>
                <View style={[styles.form_field_inline_label, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 12, textAlign: 'center' }}>iii).Co-morbidities</Text>

                    {/* <Text style={{ fontSize: 12 }}>Diagnosis</Text> */}

                </View>
                <Input
                    placeholder="Enter ICD code "
                    placeholderTextColor={'#CDD0D9'}
                    returnKeyType={'next'}
                    //   value={employeeId}
                    style={styles.form_field}
                     keyboardType={'default'}
                //   editable={employeeId == undefined ? true : false}
                //   onChangeText={(enteredEmployeeIdText) =>
                //     this.setState({employeeId: enteredEmployeeIdText})
                //   }
                />
                <Input
                    placeholder="Enter Description"
                    placeholderTextColor={'#CDD0D9'}
                    returnKeyType={'next'}
                    //   value={employeeId}
                    style={styles.form_field}
                     keyboardType={'default'}
                //   editable={employeeId == undefined ? true : false}
                //   onChangeText={(enteredEmployeeIdText) =>
                //     this.setState({employeeId: enteredEmployeeIdText})
                //   }
                />
            </View>
            <View style={styles.form_field_view}>
                <View style={[styles.form_field_inline_label, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 12, textAlign: 'center' }}>iv).Co-morbidities</Text>

                    {/* <Text style={{ fontSize: 12 }}>Diagnosis</Text> */}

                </View>
                <Input
                    placeholder="Enter ICD code "
                    placeholderTextColor={'#CDD0D9'}
                    returnKeyType={'next'}
                    //   value={employeeId}
                    style={styles.form_field}
                     keyboardType={'default'}
                //   editable={employeeId == undefined ? true : false}
                //   onChangeText={(enteredEmployeeIdText) =>
                //     this.setState({employeeId: enteredEmployeeIdText})
                //   }
                />
                <Input
                    placeholder="Enter Description"
                    placeholderTextColor={'#CDD0D9'}
                    returnKeyType={'next'}
                    //   value={employeeId}
                    style={styles.form_field}
                     keyboardType={'default'}
                //   editable={employeeId == undefined ? true : false}
                //   onChangeText={(enteredEmployeeIdText) =>
                //     this.setState({employeeId: enteredEmployeeIdText})
                //   }
                />
            </View>

            <View style={{ marginTop: 15 }}>
                <View style={styles.form_field_view}>
                    <Text style={[styles.Heading_form_field_inline_label]}>b.</Text>
                    <Text style={[styles.Heading_form_field, { paddingTop: 10, paddingLeft: 10 }]}>ICD_10_CODES</Text>
                    <Text style={[styles.Heading_form_field, { paddingTop: 10, paddingLeft: 10 }]}>Description</Text>

                </View>
                <View style={styles.form_field_view}>
                    <View style={[styles.form_field_inline_label, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ fontSize: 12, textAlign: 'center' }}>i).Procedure 1</Text>

                        {/* <Text style={{ fontSize: 12 }}>Diagnosis</Text> */}

                    </View>
                    <Input
                        placeholder="Enter ICD code "
                        placeholderTextColor={'#CDD0D9'}
                        returnKeyType={'next'}
                        //   value={employeeId}
                        style={styles.form_field}
                         keyboardType={'default'}
                    //   editable={employeeId == undefined ? true : false}
                    //   onChangeText={(enteredEmployeeIdText) =>
                    //     this.setState({employeeId: enteredEmployeeIdText})
                    //   }
                    />
                    <Input
                        placeholder="Enter Description"
                        placeholderTextColor={'#CDD0D9'}
                        returnKeyType={'next'}
                        //   value={employeeId}
                        style={styles.form_field}
                         keyboardType={'default'}
                    //   editable={employeeId == undefined ? true : false}
                    //   onChangeText={(enteredEmployeeIdText) =>
                    //     this.setState({employeeId: enteredEmployeeIdText})
                    //   }
                    />
                </View>
                <View style={styles.form_field_view}>
                    <View style={[styles.form_field_inline_label, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ fontSize: 12, textAlign: 'center' }}>ii).Procedure 2</Text>

                        {/* <Text style={{ fontSize: 12 }}>Diagnosis</Text> */}

                    </View>
                    <Input
                        placeholder="Enter ICD code "
                        placeholderTextColor={'#CDD0D9'}
                        returnKeyType={'next'}
                        //   value={employeeId}
                        style={styles.form_field}
                         keyboardType={'default'}
                    //   editable={employeeId == undefined ? true : false}
                    //   onChangeText={(enteredEmployeeIdText) =>
                    //     this.setState({employeeId: enteredEmployeeIdText})
                    //   }
                    />
                    <Input
                        placeholder="Enter Description"
                        placeholderTextColor={'#CDD0D9'}
                        returnKeyType={'next'}
                        //   value={employeeId}
                        style={styles.form_field}
                         keyboardType={'default'}
                    //   editable={employeeId == undefined ? true : false}
                    //   onChangeText={(enteredEmployeeIdText) =>
                    //     this.setState({employeeId: enteredEmployeeIdText})
                    //   }
                    />
                </View>
                <View style={styles.form_field_view}>
                    <View style={[styles.form_field_inline_label, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ fontSize: 12, textAlign: 'center' }}>iii)..Procedure 3</Text>

                        {/* <Text style={{ fontSize: 12 }}>Diagnosis</Text> */}

                    </View>
                    <Input
                        placeholder="Enter ICD code "
                        placeholderTextColor={'#CDD0D9'}
                        returnKeyType={'next'}
                        //   value={employeeId}
                        style={styles.form_field}
                         keyboardType={'default'}
                    //   editable={employeeId == undefined ? true : false}
                    //   onChangeText={(enteredEmployeeIdText) =>
                    //     this.setState({employeeId: enteredEmployeeIdText})
                    //   }
                    />
                    <Input
                        placeholder="Enter Description"
                        placeholderTextColor={'#CDD0D9'}
                        returnKeyType={'next'}
                        //   value={employeeId}
                        style={styles.form_field}
                         keyboardType={'default'}
                    //   editable={employeeId == undefined ? true : false}
                    //   onChangeText={(enteredEmployeeIdText) =>
                    //     this.setState({employeeId: enteredEmployeeIdText})
                    //   }
                    />
                </View>
                <View style={styles.form_field_view}>
                    <View style={[styles.form_field_inline_label, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ fontSize: 12, textAlign: 'center' }}>iv).Details of procedure</Text>

                        {/* <Text style={{ fontSize: 12 }}>Diagnosis</Text> */}

                    </View>
                    <Input
                        placeholder="Enter ICD code "
                        placeholderTextColor={'#CDD0D9'}
                        returnKeyType={'next'}
                        //   value={employeeId}
                        style={styles.form_field}
                         keyboardType={'default'}
                    //   editable={employeeId == undefined ? true : false}
                    //   onChangeText={(enteredEmployeeIdText) =>
                    //     this.setState({employeeId: enteredEmployeeIdText})
                    //   }
                    />
                    <Input
                        placeholder="Enter Description"
                        placeholderTextColor={'#CDD0D9'}
                        returnKeyType={'next'}
                        //   value={employeeId}
                        style={styles.form_field}
                         keyboardType={'default'}
                    //   editable={employeeId == undefined ? true : false}
                    //   onChangeText={(enteredEmployeeIdText) =>
                    //     this.setState({employeeId: enteredEmployeeIdText})
                    //   }
                    />
                </View>
            </View>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Pre-authorization optained<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
                        <Radio
                            color={primaryColor}
                            selectedColor={primaryColor}
                            standardStyle={true}
                            selected={isSelected === true}
                            onPress={() => this.setState({ isSelected: true })}
                        />
                        <Text style={styles.text}>Yes</Text>

                        <View style={styles.radioButtonStyle}>
                            <Radio
                                color={primaryColor}
                                selectedColor={primaryColor}
                                standardStyle={true}
                                selected={isSelected === false}
                                onPress={() => this.setState({ isSelected: false })}
                            />
                            <Text style={styles.text}>No</Text>

                        </View>
                    </Item>
                </Col>
            </Row>

            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Pre-authorization Number<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Pre-authorization Number"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                            //   value={employeeId}
                             keyboardType={'default'}
                        //   editable={employeeId == undefined ? true : false}
                        //   onChangeText={(enteredEmployeeIdText) =>
                        //     this.setState({employeeId: enteredEmployeeIdText})
                        //   }
                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>If authorization by network hospital not optained, give reason <Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Reason"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                            //   value={employeeId}
                             keyboardType={'default'}
                        //   editable={employeeId == undefined ? true : false}
                        //   onChangeText={(enteredEmployeeIdText) =>
                        //     this.setState({employeeId: enteredEmployeeIdText})
                        //   }
                        />
                    </Item>
                </Col>
            </Row>

            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Hospitalization due to injury<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
                        <Radio
                            color={primaryColor}
                            selectedColor={primaryColor}
                            standardStyle={true}
                            selected={isSelected === true}
                            onPress={() => this.setState({ isSelected: true })}
                        />
                        <Text style={styles.text}>Yes</Text>

                        <View style={styles.radioButtonStyle}>
                            <Radio
                                color={primaryColor}
                                selectedColor={primaryColor}
                                standardStyle={true}
                                selected={isSelected === false}
                                onPress={() => this.setState({ isSelected: false })}
                            />
                            <Text style={styles.text}>No</Text>

                        </View>
                    </Item>
                </Col>
            </Row>

            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>If yes,give cause<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
                        <Radio
                            color={primaryColor}
                            selectedColor={primaryColor}
                            standardStyle={true}
                            selected={isSelected === true}
                            onPress={() => this.setState({ isSelected: true })}
                        />
                        <Text style={styles.text}>self-inflited</Text>

                    </Item>
                    <Item style={{ borderRadius: 6, borderBottomWidth: 0, }}>

                        <Radio
                            color={primaryColor}
                            selectedColor={primaryColor}
                            standardStyle={true}
                            selected={isSelected === false}
                            onPress={() => this.setState({ isSelected: false })}
                        />
                        <Text style={styles.text}>Road Traffic accident</Text>


                    </Item>
                    <Item style={{ borderRadius: 6, borderBottomWidth: 0 }}>


                        <Radio
                            color={primaryColor}
                            selectedColor={primaryColor}
                            standardStyle={true}
                            selected={isSelected === false}
                            onPress={() => this.setState({ isSelected: false })}
                        />
                        <Text style={styles.text}>substance abuse / alcoholic consumption</Text>

                    </Item>
                </Col>
            </Row>


            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>If injury due to substance abuse / alcohol consumption, Test conducted to establish this <Text style={{ color: 'red' }}>*</Text></Text>

                    <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
                        <Radio
                            color={primaryColor}
                            selectedColor={primaryColor}
                            standardStyle={true}
                            selected={isSelected === true}
                            onPress={() => this.setState({ isSelected: true })}
                        />
                        <Text style={styles.text}>Yes</Text>

                        <View style={styles.radioButtonStyle}>
                            <Radio
                                color={primaryColor}
                                selectedColor={primaryColor}
                                standardStyle={true}
                                selected={isSelected === false}
                                onPress={() => this.setState({ isSelected: false })}
                            />
                            <Text style={styles.text}>No <Text style={{ fontSize: 12 }}>(If Yes, attach reports)</Text>  </Text>

                        </View>
                    </Item>
                </Col>
            </Row>

            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>If Medico legal<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
                        <Radio
                            color={primaryColor}
                            selectedColor={primaryColor}
                            standardStyle={true}
                            selected={isSelected === true}
                            onPress={() => this.setState({ isSelected: true })}
                        />
                        <Text style={styles.text}>Yes</Text>

                        <View style={styles.radioButtonStyle}>
                            <Radio
                                color={primaryColor}
                                selectedColor={primaryColor}
                                standardStyle={true}
                                selected={isSelected === false}
                                onPress={() => this.setState({ isSelected: false })}
                            />
                            <Text style={styles.text}>No</Text>

                        </View>
                    </Item>
                </Col>
            </Row>

            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Reported to Police<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
                        <Radio
                            color={primaryColor}
                            selectedColor={primaryColor}
                            standardStyle={true}
                            selected={isSelected === true}
                            onPress={() => this.setState({ isSelected: true })}
                        />
                        <Text style={styles.text}>Yes</Text>

                        <View style={styles.radioButtonStyle}>
                            <Radio
                                color={primaryColor}
                                selectedColor={primaryColor}
                                standardStyle={true}
                                selected={isSelected === false}
                                onPress={() => this.setState({ isSelected: false })}
                            />
                            <Text style={styles.text}>No</Text>

                        </View>
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>FIR No<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter FIR No"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                            //   value={employeeId}
                             keyboardType={'default'}
                        //   editable={employeeId == undefined ? true : false}
                        //   onChangeText={(enteredEmployeeIdText) =>
                        //     this.setState({employeeId: enteredEmployeeIdText})
                        //   }
                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>If not reported to police give reason<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Reason"
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                            //   value={employeeId}
                             keyboardType={'default'}
                        //   editable={employeeId == undefined ? true : false}
                        //   onChangeText={(enteredEmployeeIdText) =>
                        //     this.setState({employeeId: enteredEmployeeIdText})
                        //   }
                        />
                    </Item>
                </Col>
            </Row>
            {/*        
        <TouchableOpacity 
            style={{ position: 'absolute', right: 0, bottom: -18, backgroundColor: '#128283', borderRadius: 10 / 2, paddingLeft: 2, paddingRight: 2, paddingTop: 5, paddingBottom: 5, flexDirection: 'row', alignItems: 'center', marginRight: 10 ,}}>
            <Icon name="md-add" style={{ fontSize: 15, color: '#fff' }} />
             <Text style={{ fontSize: 10, fontFamily: 'opensans-bold', color: '#fff', }}>Add Next Table</Text>
        </TouchableOpacity> */}
        </View>
    );
}


export default ClaimDetails