import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Left, Right, Thumbnail, Body, Icon, locations, Input } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, View, FlatList } from 'react-native';

class LabCategories extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            categoriesMain: []
        }
    }
    render() {
        const patientdetails = [{ name: 'S.Mukesh Kannan', address: 'No 67, Gandhi taurrent,OT Bus Stand,Ambattur - 600051', Mobile: '9865224832' }, { name: 'S.Mukesh Kannan', address: 'No 67, Gandhi taurrent,OT Bus Stand,Ambattur - 600051', Mobile: '9865224832' }]
        return (
            <Container style={styles.container}>
                <Content style={styles.bodyContent}>

                    <View style={{ marginBottom: 10 }}>
                        <FlatList
                            data={patientdetails}
                            renderItem={({ item }) =>
                                <Row style={{ borderBottomColor: '#909090', borderBottomWidth: 0.3, paddingBottom: 10 }}>
                                    <Col size={9}>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '300', marginTop: 5 }}>{item.name}</Text>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2, color: '#6a6a6a' }}>{item.address}</Text>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2 }}>Mobile - {item.Mobile}</Text>
                                    </Col>
                                    <Col size={1} style={{ justifyContent: 'center' }}>
                                        <RadioButton.Group
                                        >
                                            <RadioButton value={this.state.itemSelected == 'itemTwo'} />
                                        </RadioButton.Group>
                                    </Col>
                                </Row>
                            } />
                    </View>
                </Content>
            </Container>

        )
    }

}

export default LabCategories


const styles = StyleSheet.create({


});