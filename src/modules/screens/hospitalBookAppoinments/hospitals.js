import React, { PureComponent } from 'react';
import { Text, Container, Icon, Spinner, Right, Left, List, ListItem, Content, Card, Item, Input, Thumbnail } from 'native-base';
import { Row, Col, Grid } from 'react-native-easy-grid';
import { StyleSheet, View, TouchableOpacity, FlatList, Image, } from 'react-native';
import StarRating from 'react-native-star-rating';

class Hospitals extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        const data = [{ hosname: 'Rajiv Gandhi Hospital', Specialist: 'B.D.S.B.D.S Hearing Specialist', location: 'No 3, EVR Periyar Sali, Park Town,Chennai-600003,Oppaosite Central Railway Station', km: '1.5', rating: 0, favorite: 0 },
        { hosname: 'Apollo Hospital', Specialist: 'B.D.S.B.D.S Hearing Specialist', location: 'No 3, EVR Periyar Sali, Park Town,Chennai-600003,Oppaosite Central Railway Station', km: '2.5', rating: 0, favorite: 0 },
        { hosname: 'Mount Multispeciality Hospital ', Specialist: 'B.D.S.B.D.S Hearing Specialist', location: 'No 3, EVR Periyar Sali, Park Town,Chennai-600003,Oppaosite Central Railway Station', km: '4.5', rating: 0, favorite: 0 },
        { hosname: 'prasHant hospital', Specialist: 'B.D.S.B.D.S Hearing Specialist', location: 'No 3, EVR Periyar Sali, Park Town,Chennai-600003,Oppaosite Central Railway Station', km: '6.5', rating: 0, favorite: 0 },
        { hosname: 'SriRam hospital', Specialist: 'B.D.S.B.D.S Hearing Specialist', location: 'No 3, EVR Periyar Sali, Park Town,Chennai-600003,Oppaosite Central Railway Station', km: '9.5', rating: 0, favorite: 0 },
        { hosname: 'Sri Balaji Hospital ', Specialist: 'B.D.S.B.D.S Hearing Specialist', location: 'No 3, EVR Periyar Sali, Park Town,Chennai-600003,Oppaosite Central Railway Station', km: '19.5', rating: 0, favorite: 0 }
        ]
        return (
            <Container>
                <Content style={{ paddingTop: 10 }}>
                    <View style={{ marginBottom: 20 }}>
                        <View style={{ paddingBottom: 5, paddingStart: 5, paddingEnd: 5,  height: 45 }}>
                            <Grid>
                                <Col size={10}>
                                    <Item style={styles.specialismInput} >
                                        <Input
                                            placeholder='Search Hospitals...'
                                            style={{ fontSize: 12, width: '100%', }}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            // onChangeText={(text) => this.navigatePress(text)}
                                            // onKeyPress={(evet) => this.navigatePress(evet)}
                                            returnKeyType={'go'}
                                            multiline={false} />
                                        <TouchableOpacity style={{ alignItems: 'flex-end' }}>
                                            <Icon name='ios-search' style={{ color: '#909090', fontSize: 20 }} />
                                        </TouchableOpacity>
                                    </Item>
                                </Col>
                            </Grid>
                        </View>
                        <View>
                            <Row style={{ padding: 5, }}>
                                <Col size={8}>
                                    <Text style={styles.showingDoctorText}>Showing Hospitals in the <Text style={styles.picodeText}>{" "}PinCode - 600051</Text></Text>
                                </Col>
                                <Col size={2}>
                                    <Row style={{ justifyContent: 'flex-end' }}>
                                        <TouchableOpacity style={styles.editPincodeButton}>
                                            <Text style={{ fontFamily: 'OpenSans', color: '#ff4e42', fontSize: 10, }}>Edit Pincode </Text>
                                        </TouchableOpacity>
                                    </Row>
                                </Col>
                            </Row>
                        </View>
                        
                        
                        <FlatList
                            data={data}
                            renderItem={({ item }) =>
                                <Card style={styles.doctorListStyle}>
                                    <List style={{ borderBottomWidth: 0 }}>
                                        <Grid >
                                            <Row >
                                                <Col size={2}>
                                                    <TouchableOpacity>
                                                        <Thumbnail circle source={require('../../../../assets/images/hospitalCommon.jpeg')} style={{ height: 60, width: 60, borderRadius: 60 / 2 }} />
                                                    </TouchableOpacity>
                                                </Col>
                                                <Col size={6}>
                                                    <Row >
                                                        <Text style={styles.commonStyle}>{item.hosname}</Text>
                                                    </Row>
                                                    <Row >
                                                        <Text note style={styles.addressTexts}>
                                                            {item.location}
                                                        </Text>
                                                    </Row>
                                                    <Row style={{ borderTopColor: 'gray', borderTopWidth: 0.3, marginTop: 10 }}>

                                                        <Col size={5} style={{ marginTop: 10 }}>
                                                            <Text note style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 12 }}> Rating</Text>
                                                            <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                                                                <StarRating
                                                                    fullStarColor='#FF9500'
                                                                    starSize={12}
                                                                    width={85}
                                                                    containerStyle={{ marginTop: 2 }}
                                                                    disabled={true}
                                                                    rating={1}
                                                                    maxStars={1}
                                                                />
                                                                <Text style={[styles.commonStyle, { marginLeft: 5 }]}>{item.rating}</Text>
                                                            </View>
                                                        </Col>
                                                        <Col size={5} style={{ marginTop: 10 }}>
                                                            <Text note style={[styles.commonStyle, { marginLeft: 5 }]}> Favourite</Text>
                                                            <Text style={[styles.commonStyle, { marginLeft: 25, fontWeight: 'bold' }]}>{item.favorite}</Text>
                                                        </Col>
                                                        {/* <Col style={{ width: "20%", marginTop: 10 }}>

                                                         </Col> */}

                                                    </Row>
                                                </Col>
                                                <Col size={2}>
                                                    <Row>
                                                        <Col>
                                                            <TouchableOpacity style={styles.heartIconButton} >

                                                                <Icon name="heart"
                                                                    style={{ marginLeft: 20, color: '#000', fontSize: 20 }}>
                                                                </Icon>
                                                            </TouchableOpacity>
                                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 15, }}>{item.km} Km</Text>
                                                        </Col>


                                                    </Row>

                                                </Col>
                                            </Row>


                                        </Grid>

                                    </List>
                                </Card>
                            } />

                    </View>
                </Content>
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    kmText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        textAlign: 'right',
        color: '#4c4c4c'
    },
    hospnames: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        fontWeight: "700",
        color: '#775DA3'
    },
    location: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#626262'

    },
    specialismInput: {
        backgroundColor: '#fff',
        height: 35,
        borderRadius: 2,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1
    },
    showingDoctorText: {
        fontFamily: 'OpenSans',
        color: '#000',
        fontSize: 13,
    },
    picodeText: {
        fontFamily: 'OpenSans',
        color: '#7F49C3',
        fontSize: 13,
    },
    editPincodeButton: {
        paddingBottom: 1,
        paddingTop: 1,
        paddingLeft: 2,
        paddingRight: 2,
        borderColor: '#ff4e42',
        borderWidth: 1,
        borderRadius: 2
    },
    doctorListStyle: {
        padding: 10,
        borderRadius: 10,
        borderBottomWidth: 2,
        marginTop: 5
    },
    commonStyle: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        fontWeight: 'bold'
    },
    qualificationText: {
        fontFamily: 'OpenSans',
        marginTop: 2,
        fontSize: 11
    },
    addressTexts: {
        fontFamily: 'OpenSans',
        marginTop: 5,
        fontSize: 11,
    },
    heartIconButton: {
        paddingBottom: 10,
        paddingRight: 10,
        paddingLeft: 10
    },
    commonText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
    },
})
export default Hospitals

