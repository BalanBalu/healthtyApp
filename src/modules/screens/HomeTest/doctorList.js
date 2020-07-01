import React, { PureComponent } from 'react';
import { Container, Content, Text, Toast, Button, ListItem, Card, Thumbnail, List, Item, Input, Left, Right, Icon } from 'native-base';
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage, FlatList, ImageBackground, Alert, Linking } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid'
const vipLogo = require('../../../../assets/images/viplogo.png')
import StarRating from 'react-native-star-rating';
import styles from './styles'
class DoctorList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
        }
    }


    render() {
        return (
            <Container>
                <Content>
                    <Card style={styles.HeadingCard}>

                        <Row>
                            <Col size={5} style={styles.topRatedCol}>

                                <Col size={1.1} >
                                    <Icon name='ios-arrow-down' style={styles.TopRatedIcon} />
                                </Col>
                                <Col size={8.9} style={{ justifyContent: 'center' }}>
                                    <Text uppercase={false} style={styles.topRatedText}>Top Rated </Text>
                                </Col>

                            </Col>
                            <Col size={5} style={styles.filterCol} >

                                <Col size={1.1} style={{ marginLeft: 10 }}>
                                    <Icon name='ios-funnel' style={styles.filterIcon} />
                                </Col>
                                <Col size={8.9} style={{ justifyContent: 'center' }}>
                                    <Text uppercase={false} style={styles.filterText}>Filters </Text>
                                </Col>

                            </Col>
                        </Row>
                    </Card>
                    <View style={{ padding: 10, paddingBottom: 10, height: 45 }}>
                        <Grid>
                            <Col size={10}>
                                <Item style={styles.specialismInput} >
                                    <Input
                                        placeholder='Specialism and Categories...'
                                        style={{ fontSize: 12, width: '100%', }}
                                        placeholderTextColor="#C1C1C1"
                                        keyboardType={'default'}
                                        onChangeText={(text) => this.navigatePress(text)}
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
                        <Row style={{ marginTop: 5, padding: 10, }}>
                            <Col size={8}>
                                <Text style={styles.showingDoctorText}>Showing Doctors in the <Text style={styles.picodeText}>{" "}PinCode - 600051</Text></Text>
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
                    <Card style={styles.doctorListStyle}>
                        <List style={{ borderBottomWidth: 0 }}>
                            <ListItem>
                                <Grid >
                                    <Row >
                                        <Col style={{ width: '10%' }}>
                                            <TouchableOpacity>
                                                <Thumbnail circle source={require('../../../../assets/images/Female.png')} style={{ height: 60, width: 60, borderRadius: 60 / 2 }} />
                                            </TouchableOpacity>
                                        </Col>
                                        <Col style={{ width: '73%' }}>
                                            <Row style={{ marginLeft: 55, }}>
                                                <Text style={styles.commonStyle}>Dr.pradeep natarajan</Text>
                                            </Row>
                                            <Row style={{ marginLeft: 55, }}>
                                                <Text note style={styles.qualificationText}>B.D.S.B.D.S Hearing Specialist</Text>
                                            </Row>
                                            <Row style={{ marginLeft: 55, }}>
                                                <Text note style={styles.addressTexts}>
                                                    67/B 2nd Road,Ambattur,Channai,Tamil Nadu
                                            </Text>
                                            </Row>
                                        </Col>
                                        <Col style={{ width: '17%' }}>
                                            <Row>
                                                <TouchableOpacity style={styles.heartIconButton} >

                                                    <Icon name="heart"
                                                        style={{ marginLeft: 20, color: '#B22222', fontSize: 20 }}>
                                                    </Icon>
                                                </TouchableOpacity>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ width: "25%", marginTop: 10 }}>
                                            <Text note style={styles.commonText}> Experience</Text>
                                            <Text style={styles.commonStyle}>2</Text>
                                        </Col>
                                        <Col style={{ width: "25%", marginTop: 10 }}>
                                            <Text note style={[styles.commonStyle, { textAlign: 'center' }]}> Rating</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                <StarRating
                                                    fullStarColor='#FF9500'
                                                    starSize={12}
                                                    width={85}
                                                    containerStyle={{ marginTop: 2 }}
                                                    disabled={true}
                                                    rating={1}
                                                    maxStars={1}
                                                />
                                                <Text style={[styles.commonStyle, { marginLeft: 2 }]}> 0</Text>
                                            </View>
                                        </Col>
                                        <Col style={{ width: "25%", marginTop: 10 }}>
                                            <Text note style={[styles.commonStyle, { marginLeft: 5 }]}> Favourite</Text>
                                            <Text style={[styles.commonStyle, { marginLeft: 5, fontWeight: 'bold' }]}>0</Text>
                                        </Col>
                                        <Col style={{ width: "25%", marginTop: 10 }}>
                                            <Text note style={[styles.commonStyle, { textAlign: 'center' }]}> Fees</Text>
                                            <Text style={[styles.commonStyle, { textAlign: 'center', marginLeft: 10 }]}>100
                                        </Text>
                                        </Col>
                                    </Row>
                                    <Row style={{ borderTopColor: '#000', borderTopWidth: 0.4, marginTop: 5 }} >
                                        <Col size={.6}>
                                            <Icon name='ios-time' style={{ fontSize: 20, marginTop: 12 }} />
                                        </Col>
                                        <Col size={7.4}>

                                            <Text note style={styles.availableText}>Available on sunday, Monday, Tuesday, Wednesday, Thursday, Friday and Saturday</Text>
                                        </Col>
                                        <Col size={1.5}>
                                            <TouchableOpacity onPress={() => this.onBookPress(item.doctorIdHostpitalId)} style={styles.bookBottomButton}>
                                                <Text style={styles.bookBottomButtonText}>BOOK </Text>
                                            </TouchableOpacity>
                                        </Col>
                                    </Row>
                                </Grid>
                            </ListItem>
                        </List>
                    </Card>
                </Content>
            </Container>
        )
    }
}

export default DoctorList

