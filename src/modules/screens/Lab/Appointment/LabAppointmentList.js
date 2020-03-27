import React, { Component } from 'react';
import {
    Container, Content, Text, Button, Item, Card, List, ListItem, Left, Right,
    Thumbnail, Body, Icon, Toast, View, CardItem
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, AsyncStorage, TouchableOpacity, Modal } from 'react-native';
import StarRating from 'react-native-star-rating';
import { FlatList } from 'react-native-gesture-handler';
import SegmentedControlTab from "react-native-segmented-control-tab";

class LabAppointmentList extends Component {
    constructor(props) {
        super(props)
        this.state = {



        }
    }
    render() {
        const patientList = [
            { name: 'Medlife  International Bloratory', checkup: "Full body check up test", date: 'friday,March 13-2020 07:10 am', status: 'Appointment Ongoing' },
            { name: 'Medlife  International Bloratory', checkup: "Full body check up test", date: 'friday,March 13-2020 07:10 am', status: 'Appointment Ongoing' },
            { name: 'Medlife  International Bloratory', checkup: "Full body check up test", date: 'friday,March 13-2020 07:10 am', status: 'Appointment Ongoing' },
            { name: 'Medlife  International Bloratory', checkup: "Full body check up test", date: 'friday,March 13-2020 07:10 am', status: 'Appointment Ongoing' },
            { name: 'Medlife  International Bloratory', checkup: "Full body check up test", date: 'friday,March 13-2020 07:10 am', status: 'Appointment Ongoing' }
        ]
        return (
            <Container style={styles.container}>
                <Content style={styles.bodyContent}>
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
                            data={patientList}
                            renderItem={({ item }) =>
                                <Card transparent style={styles.cardStyle}>
                                    <TouchableOpacity>
                                        <Text style={styles.refText}>{"Ref no : 12133123"}</Text>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col size={2}>
                                                <Thumbnail circular source={require('../../../../../assets/images/profile_male.png')} style={{ height: 60, width: 60 }} />
                                            </Col>
                                            <Col size={8}>
                                                <Row style={{ borderBottomWidth: 0 }}>
                                                    <Text style={styles.nameText}>
                                                        {item.name}
                                                    </Text>

                                                </Row>
                                                <Row style={{ borderBottomWidth: 0, marginTop: 5 }}>
                                                    <Text
                                                        style={styles.subText}
                                                    >
                                                        {item.checkup}
                                                    </Text>
                                                    <StarRating
                                                        fullStarColor="#FF9500"
                                                        starSize={15}
                                                        containerStyle={{
                                                            width: 80,
                                                            marginLeft: "auto",
                                                            marginTop: 3
                                                        }}
                                                        disabled={false}
                                                        maxStars={5}
                                                    />
                                                </Row>

                                                <Row style={{ borderBottomWidth: 0 }}>
                                                    <Text style={styles.statusText} note>{item.status}</Text>
                                                </Row>

                                                <Text style={{ fontFamily: "OpenSans", fontSize: 11 }} note>
                                                    {item.date} </Text>

                                                <Row style={{ borderBottomWidth: 0, marginTop: 5 }}>
                                                    <Right style={(styles.marginRight = -2)}>
                                                        <Button
                                                            style={styles.shareButton}
                                                            onPress={() => this.navigateAddReview(item, index)}

                                                            testID='navigateInsertReview'
                                                        >
                                                            <Text style={styles.bookAgain1}>

                                                                Add Review
																</Text>
                                                        </Button></Right>

                                                    <Right style={(styles.marginRight = 5)}>

                                                        <Button style={styles.bookingButton} onPress={() => this.navigateToBookAppointmentPage(item)}>
                                                            <Text style={styles.bookAgain1} testID='navigateBookAppointment'>
                                                                Book Again
																</Text>
                                                        </Button>
                                                    </Right>
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

export default LabAppointmentList


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 10

    },
    bookingButton: {
        marginTop: 10,
        backgroundColor: "#775DA3",
        marginRight: 1,
        borderRadius: 10,
        width: "auto",
        height: 30,
        color: "white",
        fontSize: 12,
        textAlign: "center"
    },
    bookAgain1: {
        fontSize: 13,
        fontFamily: 'OpenSans',
        fontWeight: 'bold'
    },
    shareButton: {
        marginTop: 10,
        backgroundColor: "gray",
        marginRight: 1,
        borderRadius: 10,
        width: "auto",
        height: 30,
        color: "white",
        fontSize: 12,
        textAlign: "center"
    },
    cardStyle: {
        borderBottomWidth: 0.3,
        paddingBottom: 10,
        marginTop: 10
    },
    refText: {
        textAlign: 'right',
        fontSize: 14,
        marginTop: -5
    },
    nameText: {
        fontFamily: "OpenSans",
        fontSize: 15,
        fontWeight: 'bold'
    },
    subText: {
        fontFamily: "OpenSans",
        fontSize: 14,
        width: '60%'
    },
    statusText: {
        fontFamily: "OpenSans",
        fontSize: 13,
        color: 'green',
        fontWeight: 'bold'
    }

})

