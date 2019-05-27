import React, { Component } from "react";
import { Content, Text, Body, Left, Right, Thumbnail, ListItem, List, Item, H5, H3, Icon, Button, Card } from "native-base";
import { StyleSheet, Image, TouchableOpacity, View, FlatList } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
export default class TabTwo extends Component {
    constructor(props) {
        super(props);

    }

    render() {


        return (


            <Content padder >
                <Card style={{ padding: 5, borderRadius: 10 }}>
                    <List>
                        <ListItem avatar noBorder>
                            <Left>
                                <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 60, width: 60 }} />
                            </Left>
                            <Body>
                                <Text style={{ fontFamily: 'opensans-regular' }}>Kumar Pratik</Text>

                                <Text style={{ fontFamily: 'opensans-regular' }} note>Dentist </Text>
                                <Text style={{ fontFamily: 'opensans-regular', fontSize: 14 }} note>23-05-2019</Text>
                                <Text style={{ fontFamily: 'opensans-regular', fontSize: 14 }} note>10.00 AM</Text>

                                {/* <Grid >
                                            <View >
                                                <FlatList numColumns={3}
                                                    data={[
                                                        {
                                                            "day": 0,
                                                            "dayName": "9.00 am",
                                                            "start_time": "09:00:00",
                                                            "end_time": "09:30:00"
                                                        },
                                                        {
                                                            "day": 0,
                                                            "dayName": "9.00 am",
                                                            "start_time": "10:00:00",
                                                            "end_time": "10:30:00"
                                                        },
                                                        {
                                                            "day": 0,
                                                            "dayName": "9.00 am",
                                                            "start_time": "12:00:00",
                                                            "end_time": "13:00:00"
                                                        },
                                                        {
                                                            "day": 0,
                                                            "dayName": "9.00 am",
                                                            "start_time": "13:00:00",
                                                            "end_time": "14:00:00"
                                                        }
                                                    ]}
                                                    renderItem={({ item }) => <Item style={{ borderBottomWidth: 0, alignItems: 'center' }}><Col style={{ width: '32%', alignItems: 'center', marginLeft: 3 }}><Button style={{ backgroundColor: '#775DA3', borderRadius: 5, width: 75, height: 35, margin: 2 }}><Text uppercase={false} style={{ fontFamily: 'opensans-regular', fontSize: 10, color: 'white' }}>{item.dayName}</Text></Button></Col></Item>}
                                                />
                                            </View>
                                        </Grid> */}
                            </Body>
                        </ListItem>
                    </List>
                </Card>

            </Content>
        );
    }
}




