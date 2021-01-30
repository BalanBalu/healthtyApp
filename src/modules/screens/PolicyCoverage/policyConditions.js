import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image'
import { Icon, Card } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export const PolicyConditions = (props) => {

    const { navigation } = props;
    let termsAndConditionList = navigation.getParam('termsAndConditionList');

    return (
        <View style={{ marginRight: 15, marginLeft: 15, marginTop: 5 }}>
            <FlatList
                data={termsAndConditionList}
                renderItem={({ item, index }) =>
                    <Row style={{ marginTop: 20 }}>
                        <Col size={1} >
                            <MaterialIcons name="check" style={{ fontSize: 22, color: 'green' }} />
                        </Col>
                        <Col size={9} >
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 15, lineHeight: 25 }}>{item}</Text>
                        </Col>
                    </Row>
                } />


        </View>
    );
}

const styles = StyleSheet.create({

});