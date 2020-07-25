import React, { PureComponent } from 'react';
import { Container, Content, Text, Toast, Button, ListItem, Card, Thumbnail, List, Item, Input, Left, Right, Icon } from 'native-base';
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage, FlatList, ImageBackground, Alert, Linking } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid'
import SegmentedControlTab from "react-native-segmented-control-tab";
import styles from '../Styles'

class AppointmentList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: 0,
        }
    }
    render() {
        const data = [{ token_no: 1234, name: 'Nurse Hamington MBBS', date: "Sunday,June 28-2020  11:10 am" }]
        return (
            <Container>
                <Content style={{ margin: 10 }}>
                    <Card transparent>
                        <SegmentedControlTab
                            tabsContainerStyle={{
                                width: 250,
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginTop: "auto"
                            }}
                            values={["Upcoming", "Past"]}
                            selectedIndex={this.state.selectedIndex}
                            onTabPress={this.handleIndexChange}
                            activeTabStyle={{
                                backgroundColor: "#775DA3",
                                borderColor: "#775DA3"
                            }}
                            tabStyle={{ borderColor: "#775DA3" }} />
                    </Card>
                    <View style={{ marginTop: 5 }}>
                        <FlatList
                            data={data}
                            renderItem={({ item, index }) =>
                                <Card transparent style={styles.cardStyle}>
                                    <TouchableOpacity
                                        testID='navigateLabAppointmentInfo'>

                                        <Text style={styles.tokenText} >{"Ref no :" + item.token_no}</Text>

                                        <Row style={{ marginTop: 10 }}>
                                            <Col size={2}>
                                                <Thumbnail circular source={require('../../../../../assets/images/profile_male.png')} style={{ height: 60, width: 60 }} />
                                            </Col>
                                            <Col size={8}>
                                                <Text style={styles.nameText}>
                                                    {item.name}
                                                </Text>
                                                <Text style={styles.mainText}>Primary care doctor</Text>
                                                <Text style={[styles.mainText, { color: '#7F49C3' }]}>Visit home address :</Text>
                                                <Text style={styles.subinnerText} note>67/B 2nd Road,Ambattur,Channai,Tamil Nadu</Text>
                                                <Text style={[styles.mainText, { color: '#7F49C3' }]}>Visited On :</Text>
                                                <Text style={styles.subinnerText} note>
                                                    {item.date} </Text>
                                                <Row>
                                                    <Col size={4} style={{ justifyContent: 'center' }}>
                                                        <Text style={styles.completedText}>Completed</Text>
                                                    </Col>
                                                    <Col size={6}>
                                                        <Row style={{ justifyContent: 'flex-end', marginTop: 1 }}>
                                                            <Button style={[styles.bookingButton, styles.customButton]}
                                                                testID='navigateToHome'>
                                                                <Text style={{ fontFamily: 'Opensans', fontSize: 15, fontWeight: 'bold' }}>Book Now</Text>
                                                            </Button>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </TouchableOpacity>
                                </Card>
                            } />
                    </View>
                </Content>
            </Container>
        )
    }
}

export default AppointmentList

