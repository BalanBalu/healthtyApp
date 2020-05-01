
import React, { PureComponent } from 'react';
import {
    Container, Content, Text, View, Button, H3, Item, Card,
    Input, Left, Right, Icon, Footer, Badge, Form, CardItem
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, AsyncStorage, FlatList, TouchableHighlight, Modal, TextInput, Platform } from 'react-native';

class ConfirmationPopup extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            proposedVisible: false
        }
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        const { value, isLoading } = this.state;
        return (
            <Container>
                <Content style={{ backgroundColor: '#EAE6E6', padding: 10 }}>
                    <View>
                        <Row>
                            <TouchableOpacity style={{ borderColor: '#8dc63f', borderWidth: 1, marginLeft: 1, borderRadius: 2.5, height: 25, width: 65, backgroundColor: '#8dc63f' }}
                                onPress={() => {
                                    this.setModalVisible(true);
                                }}>
                                <Row style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 7, color: '#fff', marginTop: 2.5, marginLeft: 6 }}>Display popup</Text>
                                </Row>
                            </TouchableOpacity>
                        </Row>
                    </View>
                    <View style={{ height: 200, justifyContent: 'center',}}>
                        <Modal
                            animationType='fade'
                            transparent={true}
                            backdropColor="transparent"
                            backgroundColor="transparent"
                            containerStyle={{ justifyContent: 'center', }}
                            visible={this.state.modalVisible}
                            animationType={'slide'}
                        >
                            <Grid style={{
                                backgroundColor: '#fff',
                                position: 'absolute',
                                top: 200,
                                marginLeft: 10, marginRight: 10, borderRadius: 5, padding: 15, width: '95%'
                            }}>


                                <View style={{ width: '100%' }}>

                                    <View style={{ marginTop: 10, width: '100%' }}>

                                        <Text style={{ fontFamily: "OpenSans", fontSize: 15 }}>Enter the reason for Booking the Video Consultation ?</Text>
                                        <Form style={{
                                            borderColor: '#909090',
                                            borderWidth: 0.5, height: 80, borderRadius: 5, marginTop: 10,
                                        }}>
                                            <TextInput
                                                placeholder="Enter the reason"
                                                style={Platform == "ios" ? styles.bigTextInput : styles.textInputAndroid}

                                                placeholderTextColor="#C1C1C1"
                                                keyboardType={'default'}
                                                returnKeyType={'go'}
                                            />
                                        </Form>
                                    </View>

                                    <Row style={{ marginTop: 15, justifyContent: 'flex-end', marginBottom: 15 }}>
                                        <Col size={2}></Col>
                                        <Col size={8} >
                                            <Row>

                                                <Col size={3} >
                                                    <TouchableOpacity style={styles.skipButton}
                                                        onPress={() => this.SkipAction()} testID='confirmButton'>

                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, textAlign: 'center', color: '#fff' }}>{'SKIP'}</Text>
                                                    </TouchableOpacity>
                                                </Col>

                                                <Col size={3} style={{ marginLeft: 3 }} >
                                                    <TouchableOpacity danger style={styles.cancelButton} onPress={() => this.navigateCancelAppoointment()} testID='cancelButton'>
                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, textAlign: 'center', color: '#fff' }}> {'CANCEL'}</Text>
                                                    </TouchableOpacity>
                                                </Col>
                                                <Col size={3} style={{ marginLeft: 3 }} >
                                                    <TouchableOpacity style={styles.submitButton} onPress={() => this.updateAppointmentStatus(data, 'APPROVED')} testID='confirmButton'>
                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, textAlign: 'center', color: '#fff' }}>{'SUBMIT'}</Text>
                                                    </TouchableOpacity>
                                                </Col>
                                            </Row>





                                        </Col>

                                    </Row>

                                </View>

                            </Grid>
                        </Modal>
                    </View>
                </Content>
            </Container>
        )
    }
}


export default ConfirmationPopup
const styles = StyleSheet.create({
    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 0
    },
    textInputAndroid: {
        fontSize: 12,
        borderRadius: 5,
        paddingLeft: 2,
        textAlignVertical: 'top',
    },
    bigTextInput: {
        fontSize: 12,
        borderRadius: 5,
        paddingLeft: 2,
        textAlignVertical: 'top',
        marginTop: 8,
    },
    skipButton:{
        paddingLeft: 10, 
        paddingRight: 10, 
        paddingTop: 2, 
        paddingBottom: 2, 
        borderRadius: 5, 
        backgroundColor: '#775DA3'
    },
    cancelButton:{
        paddingLeft: 10, 
        paddingRight: 10, 
        paddingTop: 2, 
        paddingBottom: 2, 
        borderRadius: 5, 
        backgroundColor: 'red'
    },
    submitButton:{
        backgroundColor: '#6FC41A', 
        paddingLeft: 10, 
        paddingRight: 10, 
        paddingTop: 2, 
        paddingBottom: 2, 
        borderRadius: 5,
    }
});