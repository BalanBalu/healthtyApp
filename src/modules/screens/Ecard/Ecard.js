import React, { PureComponent } from 'react';
import { Text, Container, ListItem, List, Content, Row, Col, Card, } from 'native-base';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';


class Ecard extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {

        }

    }

    render() {

        return (
            <Container>
                <Content style={{ padding: 15 }}>
                    <View style={{ marginBottom: 20 }}>
                        <Row>
                            <Col size={3.3} style={styles.colStyle}>
                                <TouchableOpacity>
                                    <Text style={styles.linkHeader}>Print</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={3.3} style={styles.colStyle}>
                                <TouchableOpacity>
                                    <Text style={styles.colStyle}>Save as PDF</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={3.3} style={styles.colStyle}>
                                <TouchableOpacity>
                                    <Text style={styles.colStyle}>Email</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                        <View>
                            <Row style={{ marginTop: 10, backgroundColor: '#f2f5f4', paddingTop: 5 }}>
                                <Col size={2} style={styles.colStyle}>
                                    <Image source={require('../../../../assets/images/SmartHealthLogo.png')} style={{ height: 70, width: 70 }} />
                                </Col>
                                <Col size={8} style={styles.colStyle}>
                                    <Text style={styles.headerText}>THE NEW INDIA ASSURANCE</Text>
                                    <Text style={styles.headerText}>COMPANY LIMITED</Text>
                                    <Text style={styles.compName}>TRAVEL TROOPS GLOBAL PVT LTD</Text>
                                </Col>
                            </Row>
                            <Row style={{ backgroundColor: '#1C5BA8', padding: 5 }}>
                                <Col size={2.5}>
                                    <Text style={styles.innerText}>Policy No.</Text>
                                    <Text style={styles.innerText}>Health India ID</Text>
                                    <Text style={styles.innerText}>Member code</Text>
                                    <Text style={styles.innerText}>Member Name</Text>
                                    <Text style={styles.innerText}>Gender</Text>
                                    <Text style={styles.innerText}>Relationship</Text>
                                    <Text style={styles.innerText}>Employee code</Text>
                                    <Text style={styles.innerText}>Valid Upto</Text>
                                </Col>
                                <Col size={0.5}>
                                    <Text style={styles.innerText}>:</Text>
                                    <Text style={styles.innerText}>:</Text>
                                    <Text style={styles.innerText}>:</Text>
                                    <Text style={styles.innerText}>:</Text>
                                    <Text style={styles.innerText}>:</Text>
                                    <Text style={styles.innerText}>:</Text>
                                    <Text style={styles.innerText}>:</Text>
                                    <Text style={styles.innerText}>:</Text>

                                </Col>
                                <Col size={5.5}>
                                    <Text style={styles.innerText}>72050025552541035712</Text>
                                    <Text style={styles.innerText}>3652023</Text>
                                    <Text style={styles.innerText}>3652023E</Text>
                                    <Text style={styles.innerText}>VIJAY CHAUHAN</Text>
                                    <Text style={styles.innerText}>Male {"     "} Age : 27 Years</Text>
                                    <Text style={styles.innerText}>Employee</Text>
                                    <Text style={styles.innerText}>PYT0211</Text>
                                    <Text style={styles.innerText}>Open (Subject to policy Renewal).</Text>

                                </Col>
                                <Col size={1.8} style={{ alignItems: 'center' }}>
                                    <Card style={{ height: 80, width: '100%' }}>

                                    </Card>
                                </Col>
                            </Row>
                            <Row style={{ backgroundColor: '#5CB533', paddingBottom: 5, paddingTop: 5 }}>
                                <Col size={2} style={styles.colStyle}>
                                    <Image source={require('../../../../assets/images/healthIndia.png')} style={{ height: 60, width: 80 }} />
                                </Col>
                                <Col size={8} style={styles.colStyle}>
                                    <Text style={styles.footerText}>Health India Insurance TPA Services Pvt Ltd.</Text>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 10, textAlign: 'center', fontWeight: '700' }}>Neelkanath Corpoate Park,Office No.406 to 412, 4th Floor, Vidhar(W),Mumbai-400086</Text>
                                </Col>
                            </Row>

                        </View>

                        <View>
                            <Row style={styles.compDetails}>
                                <Col size={2} style={styles.colStyle}>
                                    <Image source={require('../../../../assets/images/healthIndia.png')} style={{ height: 60, width: 80 }} />
                                </Col>
                                <Col size={8} style={styles.colStyle}>
                                    <Text style={styles.footerText}>Health India Insurance TPA Services Pvt Ltd.</Text>
                                    <Text style={styles.footerText}>(An ISO 27001-2013 Company)</Text>
                                    <Text style={styles.footerText}>TPA Card is issued for identification Purpose.</Text>
                                </Col>
                            </Row>
                            <View style={{ backgroundColor: '#1C5BA8', padding: 5 }}>
                                <Text style={styles.innerText}>1. This card is the property of HealthIndia Insurance TPA services Pvt.Ltd. & valid for TPA network hospitals & not transferble</Text>
                                <Text style={styles.innerText}>2. This card should be used in accordance with the terms of the policy</Text>
                                <Text style={styles.innerText}>3. Non photo id  Card,Ration Card or I Card issued by employer</Text>
                                <Text style={styles.innerText}>4. TPA will pay the medical bills for treatment which is covered under policy & authorization has been already taken,in case of emergency hospitalization,the authorization letter can be issued with in 24 hrs.</Text>
                                <Text style={styles.innerText}>5. Treatment which is not covered under policy or expenses above sum insured or which has not authorized or treatment taken in non network hospital,in these cases the payment will be made by the patient only.</Text>
                                <Text style={styles.innerText}>6. For any assistance please call on numbers mentioned below.</Text>
                            </View>
                            <View style={{ backgroundColor: '#5CB533', padding: 5 }}>
                                <Text style={styles.footerDeatils}>Note : Please carry photo id proof for cashless servic,while hospitalization</Text>
                                <Text style={styles.footerDeatils}>Email : crm@healthindiaatpa.com | Website: www.healthindiatpa.com</Text>
                                <Text style={styles.footerDeatils}>Contact No : 9222276022,1800220102 / Sr.Citizens No: 1800226970</Text>

                            </View>

                        </View>
                    </View>
                </Content>
            </Container>
        )
    }
}


export default Ecard

const styles = StyleSheet.create({
    colStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    linkHeader: {
        fontFamily: 'OpenSans',
        fontSize: 15,
        textDecorationColor: '#2159d9',
        textDecorationLine: 'underline',
        color: '#2159D9'
    },
    headerText: {
        fontFamily: 'OpenSans',
        fontSize: 11,
        color: '#0C0A96',
        fontWeight: '700'
    },
    compName: {
        fontFamily: 'OpenSans',
        fontSize: 11,
        fontWeight: '700'
    },
    innerText: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        color: '#fff'
    },
    footerText: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        fontWeight: '700'
    },
    footerDeatils: {
        fontFamily: 'OpenSans',
        fontSize: 10
    },
    compDetails:{
        marginTop: 10, 
        backgroundColor: '#f2f5f4', 
        paddingBottom: 5, 
        paddingTop: 5
    }
})