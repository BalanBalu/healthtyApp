import React, { PureComponent } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Radio, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, BackHandler, Dimensions } from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';

class MedicineRecords extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {


        }
    }


    render() {
        const images = [{ image: require('../../../../assets/images/uploadedPrescription.jpg'), description: 'MRI Scan' },
        { image: require('../../../../assets/images/uploadedPrescription.jpg'), description: 'CT Scan' }, { image: require('../../../../assets/images/uploadedPrescription.jpg'), description: 'ECG Scan' },
        { image: require('../../../../assets/images/uploadedPrescription.jpg'), description: 'X ray Scan' }, { image: require('../../../../assets/images/uploadedPrescription.jpg'), description: 'MRI Scan' }, { image: require('../../../../assets/images/uploadedPrescription.jpg'), description: 'ECG Scan' },
        { image: require('../../../../assets/images/uploadedPrescription.jpg'), description: 'CT Scan' },]
        return (
            <Container style={styles.container}>
                <Content>
                    <View style={{ padding: 10, }}>
                        <Row style={styles.SearchRow}>

                            <Col size={9.1} style={{ justifyContent: 'center', }}>
                                <Input
                                    placeholder="Search for Your EMR details"
                                    style={styles.inputfield}
                                    placeholderTextColor="#909498"
                                    keyboardType={'email-address'}
                                    underlineColorAndroid="transparent"
                                    blurOnSubmit={false}
                                />
                            </Col>
                            <Col size={0.9} style={styles.SearchStyle}>
                                <TouchableOpacity style={{ justifyContent: 'center' }}>
                                    <Icon name="ios-search" style={{ color: 'gray', fontSize: 20, padding: 2 }} />
                                </TouchableOpacity>
                            </Col>

                        </Row>
                        <Row style={{ marginTop: 15 }}>
                            <Right>
                                <TouchableOpacity style={{ backgroundColor: '#7E49C3', paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5, borderRadius: 5 }}>
                                    <Text style={{ color: '#fff', fontSize: 15 }} >Upload</Text>
                                </TouchableOpacity>
                            </Right>
                        </Row>
                        <View style={{ marginTop: 10 }}>
                            <FlatList horizontal={false} numColumns={2}
                                data={images}
                                renderItem={({ item, index }) =>
                                    <View style={{ width: '50%', borderRadius: 5 }}>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: item.image, title: 'Profile photo' })}>
                                            <Card style={{ borderRadius: 5, overflow: 'hidden' }}>
                                                <Row style={styles.rowStyle}>
                                                    <Image
                                                        source={item.image}
                                                        style={{
                                                            width: '100%', height: '100%', alignItems: 'center'
                                                        }}
                                                    />
                                                </Row>
                                                <Row style={styles.secondRow}>
                                                    <Col style={{ width: '100%', }}>
                                                        <Text style={styles.mainText}>{item.description}</Text>
                                                    </Col>

                                                </Row>
                                            </Card>
                                        </TouchableOpacity>
                                    </View>

                                } />

                        </View>
                    </View>
                </Content>
            </Container>




        )
    }

}


export default MedicineRecords


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#D6C9EA'
    },

    bodyContent: {


    },
    innerText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        marginTop: 5

    },

    rowStyle: {
        height: 125,
        width: '100%',
        overflow: 'hidden',
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center'
    },
    secondRow: {
        paddingTop: 2,
        paddingBottom: 2,
        width: '100%',
        paddingTop: 5,
        borderTopColor: '#909498',
        borderTopWidth: 0.3,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 5,
    },
    SearchRow: {
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 0.5,
        height: 35,
        marginTop: 10, borderRadius: 5
    },
    inputfield: {
        color: 'gray',
        fontFamily: 'OpenSans',
        fontSize: 12,
        padding: 5,
        paddingLeft: 10
    },
    SearchStyle: {

        width: '85%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 5
    },
});