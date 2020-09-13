import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, FlatList } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FastImage from 'react-native-fast-image'
import { Icon, Card } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

export const ProfileFamilyCard = (props) => {
        const { navigation } = props;
        return (
                <View>

                        <Grid>
                                <TouchableOpacity style={{ width: '100%', }} onPress={() => navigation("E Card")}>
                                <Card >
                                        <Row>
                                                <Col size={7} style={{ justifyContent: 'center', padding: 10 }}>
                                                        <Text style={styles.userName}>Family</Text>
                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, }}>View E-card and family profile from here</Text>
                                                </Col>
                                                <Col size={2} style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                                                        <FastImage source={require('../../../../../assets/images/corporateHomePageIcon/family_a.png')} style={{ height: 70, width: 70 }} />
                                                </Col>
                                                <Col size={1} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#E4D1FE' }}>
                                                        <MaterialIcons name='chevron-right' style={{ fontSize: 35, color: '#000' }} />
                                                </Col>
                                        </Row>
                                </Card>
                                </TouchableOpacity>
                        </Grid>
                </View>
        );
}

const styles = StyleSheet.create({
        userName: {
                color: '#7F49C3',
                fontFamily: 'OpenSans',
                fontSize: 16,
                fontWeight: '700'

        },
        mainCol: {
                alignItems: "center",
                justifyContent: "center",
                borderColor: 'gray',
                borderRadius: 5,
                borderWidth: 0.1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 0.5 },
                shadowOpacity: 0.5,
                shadowRadius: 5,
                elevation: 10,
                padding: 1,
                marginTop: 15,
                marginLeft: 11,
                marginBottom: 1, width: '20%', backgroundColor: '#fafafa',
        }
});