import React, { PureComponent } from 'react';
import { Text, View, Item, Input, Icon, } from 'native-base';
import { TouchableOpacity, } from 'react-native'
import { Col, Row } from 'react-native-easy-grid';
import styles from '../Styles';
import AntDesign from 'react-native-vector-icons/AntDesign';



const AttachmentDetails = ({ }) => {

    return (
        <View>
            <View style={styles.ButtonView}>
                <View>
                    <Text style={{ marginLeft: 15, fontSize: 16, marginTop: 10 }}>Upload Files/Reports/ID Details(Scanned PDF and JPG files) (Max Upload Size: 7168K)</Text>
                </View>
                <TouchableOpacity style={{ backgroundColor: '#E5E5E5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }}><Text>Choose File</Text></TouchableOpacity>

                <Row
                    size={4}
                    style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                    <Col size={1}>
                        <Text style={styles.text}>File Name<Text style={{ color: 'red' }}>*</Text></Text>

                        <Item regular style={{ borderRadius: 6, height: 35 }}>
                            <Input
                                placeholder="Enter File Name"
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
                        <Text style={styles.text}>Remarks<Text style={{ color: 'red' }}>*</Text></Text>

                        <Item regular style={{ borderRadius: 6, height: 35 }}>
                            <Input
                                placeholder="Enter Remarks"
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
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity style={styles.submit_ButtonStyle} >
                        <Text style={{ color: "#fff" }}>Add</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 10, marginTop: 10, marginBottom: 20, width: '90%' }}>

                    <View style={styles.form_field_view}>
                        <Text style={[styles.form_field_inline_label]}>SL No</Text>
                        <Text style={[styles.form_field, { paddingTop: 15, paddingLeft: 10 }]}>1</Text>
                    </View>
                    <View style={styles.form_field_view}>
                        <Text style={[styles.form_field_inline_label]}>File Name</Text>
                        <Text style={[styles.form_field, { paddingTop: 15, paddingLeft: 10 }]}>1</Text>
                    </View>
                    <View style={styles.form_field_view}>
                        <Text style={[styles.form_field_inline_label]}>Remarks</Text>
                        <Text style={[styles.form_field, { paddingTop: 15, paddingLeft: 10 }]}>1</Text>
                    </View>



                    <View style={styles.form_field_view}>
                        <Text style={[styles.form_field_inline_label]}>Action</Text>
                        <View style={styles.form_field, { flexDirection: 'row', width: '80%' }}>
                            <TouchableOpacity style={{ width: '40%', backgroundColor: 'gray', height: 45, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 10 }}>Download</Text>
                                <AntDesign name='clouddownload' style={{ color: '#fff', fontSize: 20 }} />
                            </TouchableOpacity>

                            <TouchableOpacity style={{ width: '40%', backgroundColor: '#c82333', height: 45, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 10 }}>Delete</Text>
                                <AntDesign name='delete' style={{ color: '#fff', fontSize: 15 }} />

                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity style={styles.submit_ButtonStyle} >
                        <Text style={{ color: "#fff" }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


export default AttachmentDetails