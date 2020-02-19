import React, { Component } from 'react';
import { Container, Content, View, Text, Item, Radio, Row, Col, Form, Button, Toast, Footer, Left, Right, } from 'native-base';
import { StyleSheet, TextInput, AsyncStorage, TouchableOpacity,ScrollView } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';



class reportIssueList extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {

        const data = [{ datas: "Booked an appoinment but the app...", time: "02.10 PM", details: "From Medflic : Hello Sir! We have received you...", },
        { datas: "Payment has not refunded", time: "18/02/2020", details: "From Medflic : Hello Sir! We have received you...", },
            {datas:"Appoinment Which was i booked has...",time:"17/02/2020",details:"You replied : I have not yet received my money till To...",},
            {datas:"Booked a medicine but medicine not...",time:"15/02/2020",details:"You replied : I have not yet received my money till To...",},
            {datas:"Can I able to cange my appoinment...",time:"13/02/2020",details:"You replied : I have not yet received my money till To...",}
        ]
        return (
            <Container>
                <Content >
                <ScrollView>
                    <View style={{ marginTop: 10 }}>
                        <FlatList
                            data={data}
                            renderItem={({ item }) =>
                                <View style={styles.mainText}>
                                    <Row>
                                        <Col size={8}>
                                            <Text style={styles.dataText}>{item.datas}</Text>
                                        </Col>
                                        <Col size={2}>
                                            <Text style={styles.timeText}>{item.time}</Text>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col size={9}>
                                            <Text style={styles.detailsText}>{item.details}</Text>
                                        </Col>
                                        <Col size={1} style={styles.colStyle}>
                                            <TouchableOpacity style={styles.touButton}>
                                                <Text style={styles.touchText}>New</Text>
                                            </TouchableOpacity>
                                        </Col>

                                    </Row>
                                </View>
                            } />

                    </View>
                    </ScrollView>
                </Content>
            </Container>


        )
    }
}

export default reportIssueList

const styles = StyleSheet.create({

mainText:{
    borderBottomColor: '#C1C1C1', 
    borderBottomWidth: 0.3, 
    paddingBottom: 10, 
    paddingTop: 10, 
    paddingLeft: 20, 
    paddingRight: 20
},
dataText:{
    fontFamily: 'OpenSans', 
    fontSize: 14, 
    color: '#000'
},
timeText:{
    fontFamily: 'OpenSans', 
    fontSize: 10, 
    color: '#909090', 
    textAlign: 'right'
},
detailsText:{
    fontFamily: 'OpenSans', 
    fontSize: 13, 
    color: '#909090', 
    marginTop: 5 
},
colStyle:{
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 5
},
touButton:{
    backgroundColor: '#8DC53F', 
    borderRadius: 10, 
    paddingBottom: 1, 
    paddingTop: 1, 
    paddingLeft: 8, 
    paddingRight: 8, 
    alignItems: 'center' 
},
touchText:{
    fontFamily: 'OpenSans', 
    fontSize: 8, 
    color: '#fff', 
    textAlign: 'center' 
}

})