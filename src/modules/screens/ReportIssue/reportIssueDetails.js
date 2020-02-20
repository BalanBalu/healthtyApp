import React, { Component } from 'react';
import { Container, Content, View, Text, Item, Radio, Row, Col, Form, Button, Toast, Footer, Left, Right, } from 'native-base';
import { StyleSheet, TextInput, AsyncStorage, TouchableOpacity,ScrollView } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';



class reportIssueDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        
        const data =[{date:"Today, 20/02/2020 at 01.10 PM",content:"We have no special tie-ups,relationship or consideration with doctors in this regard as we want to be an independent unbiased site for patients.",
    detail:"Through Medflic,yours chances of booking an appoinment are the same as using any other means."}]
        return (
            <Container>
                <Content style={{ padding: 20 }}>
                    <ScrollView>
                    <View>
                        {/* <FlatList
                         data={data}
                         renderItem={({ item }) => */}
                         <View>
                        <Row style={{ paddingBottom: 10, borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3 }}>
                            <Left>
                                <Text style={styles.reportText}>Reported By You</Text>
                            </Left>
                            <Right>
                                <Text style={styles.date}>Friday, 19/02/2020 at 04.23 PM</Text>
                            </Right>
                        </Row>
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.contentText}>If We book an appoinment through you (Medflic) do I stand a better chance of getting an appoinment?</Text>
                        </View>
                        </View>
                         {/* }/> */}
                         <FlatList
                         data={data}
                         renderItem={({ item }) => 
                         <View>
                        <Row style={{ paddingBottom: 10, borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3, marginTop: 30 }}>
                            <Left>
                                <Text style={styles.reportText}>Replied By Medflic</Text>
                            </Left>
                            <Right>
                        <Text style={styles.date}>{item.date}</Text>
                            </Right>
                        </Row>
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.contentText}>Hello Sir,
                           </Text>
                            <Text style={[styles.contentText,{marginTop: 20}]}>{item.content}
                            </Text>
                            <Text style={[styles.contentText,{marginTop: 10} ]}>{item.detail}
                            </Text>
                            <Text style={[styles.boldContent,{marginTop: 20 }]}>Thanks,
                            </Text>
                            <Text style={styles.boldContent}>Medflic Support Team
                           </Text>
                        </View>
                        </View>
                         }/> 
                        <View style={{ marginTop: 30 }}>
                            <Text style={styles.replyText}>Quick Reply
                            </Text>
                            <TextInput
                                onChangeText={complaint => this.setState({ complaint })}
                                multiline={true} placeholder="Type Your Reply......"

                                style={styles.textInput1} />
                            <Row>
                                <Right>
                                    <TouchableOpacity style={styles.touchButton}>
                                        <Text style={styles.touchText} >Send Reply</Text>
                                    </TouchableOpacity>
                                </Right>
                            </Row>
                        </View>

                    </View>
                    </ScrollView>
                </Content>
            </Container>


        )
    }
}

export default reportIssueDetails

const styles = StyleSheet.create({

    textInput1: {
        borderColor: '#909090',
        borderRadius: 2,
        borderWidth: 0.5,
        height: 60,
        fontSize: 10,
        fontStyle: 'italic',
        textAlignVertical: 'top',
        width: '60%',
        padding: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
        marginTop: 10,
        width: '100%'

    },
    reportText:{
        fontFamily: 'OpenSans',
         fontSize: 12,
          fontWeight: 'bold',
           color: '#775DA3'
    },
    date:{
        fontFamily: 'OpenSans',
         fontSize: 10,
          color: '#909090'
    },
    contentText:{
        fontFamily: 'OpenSans',
         fontSize: 14,
         color: '#5D5D5D',
          textAlign: 'left'
    },
    boldContent:{
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#696969',
        textAlign: 'left',
        fontWeight: 'bold'
    },
    replyText:{
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#5D5D5D',
        textAlign: 'left'
    },
    touchButton:{
        backgroundColor: '#2A9F15',
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 5,
        paddingTop: 5, 
        borderRadius: 3, 
        marginTop: 10 
    },
    touchText:{
        fontFamily: 'OpenSans', 
        fontSize: 10, 
        color: '#fff', 
        fontWeight: 'bold',
    }

})