import React, { PureComponent } from 'react';
import { Container, Content, Text, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, View, FlatList, Image } from 'react-native';
import styles from './styles';

export default class RenderLabCategories extends PureComponent {
    constructor(props) {
        super(props)
    }
    render() {
        const data = [{ checkup: 'full body checkup', initalprice: 2500, finalprice: 1500 },
        { checkup: 'Diabetes Test', initalprice: 2500, finalprice: 1500 },
        { checkup: 'Fever Test', initalprice: 1500, finalprice: 1000 },
        { checkup: 'Arthristis', initalprice: 500, finalprice: 400 },
        { checkup: 'Allergy profile', initalprice: 200, finalprice: 100 },
        { checkup: 'Healthy men', initalprice: 250, finalprice: 150 }]

        return (
            <View style={{ marginLeft: 5, marginRight: 5, borderTopColor: 'gray', borderTopWidth: 1, }}>
                <Row style={{ marginTop: 10 }}>
                    <Icon name='ios-medkit' style={{ fontSize: 20, color: 'gray' }} />
                    <Text style={{ fontFamily: 'OpenSans', fontSize: 13, fontWeight: 'bold', marginLeft: 10, marginTop: 1 }}>Related Categories</Text>
                </Row>
                <View style={{ marginBottom: 10, marginTop: 10 }}>
                    <FlatList
                        horizontal={true}
                        data={data}
                        renderItem={({ item, index }) =>
                            <Col style={styles.mainCol}>
                                <View style={{ height: 110, width: 100 }}>
                                    <TouchableOpacity
                                        style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: 5, paddingBottom: 5 }}>
                                        <Image
                                            source={require('../../../../assets/images/labCategories/Diabetes.png')}
                                            style={{
                                                width: 60, height: 60, alignItems: 'center'
                                            }}
                                        />
                                        <Text style={styles.mainText}>{item.checkup}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={styles.rsText}>₹ {item.initalprice}</Text>
                                            <Text style={styles.finalRs}>₹ {item.finalprice}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Col>
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
        )
    }
}
