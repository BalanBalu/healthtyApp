import React, { Component } from "react";
import { Content, Text, Body, Left, Right, Thumbnail, ListItem, List, Item, H5, H3, Icon, Button ,Card} from "native-base";
import { StyleSheet, Image, TouchableOpacity, View, FlatList } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
export default class PastAppointment extends Component {
    constructor(props) {
        super(props);

    }



    render() {


        return (


            <Content padder >
                <Card style={{ padding: 5, borderRadius: 10 }}>
                    <List>
                        <ListItem avatar noBorder onPress={()=> this.props.navigation.navigate('AppointmentInfo')}> 
                            <Left>
                                <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 60, width: 60 }} />
                            </Left>
                            <Body>
                                <Text style={{ fontFamily: 'OpenSans' }}>Kumar Pratik</Text>

                                <Text note>I was facing baldness because of which I looked older than my age.....  </Text>
                                <Text style={{ fontFamily: 'opensans-regular', fontSize: 14 }} note>23-05-2019</Text>
                                <Text style={{ fontFamily: 'opensans-regular', fontSize: 14 }} note>10.00 AM</Text>
                               
                            </Body>
                        </ListItem>
                    </List>
                </Card>

            </Content>
        );
    }
}




