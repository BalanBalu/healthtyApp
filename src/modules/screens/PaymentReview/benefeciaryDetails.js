import React, { PureComponent } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Radio, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, BackHandler } from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { formatDate } from '../../../setup/helpers';

class BenefeciaryDetails extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            test: 'self'

        }
    }
    getCorporateBenificeryName(element) {
        return (element.firstName ? element.firstName + ' ' :'') + (element.middleName ? element.middleName + ' ' : '') + (element.lastName ? element.lastName + ' ': '');
    }



    render() {
        const { expand, data } = this.props;

        if (!expand) return null;
        return (

            <View style={{ backgroundColor: '#fff', padding: 10, }}>
                <Row>
                    <Col size={4}>
                        <Text style={styles.innerText}>Beneficiary</Text>
                        <Text style={styles.innerText}>Product Name</Text>
                        <Text style={styles.innerText}>Policy Number</Text>
                        <Text style={styles.innerText}>Policy Effective From</Text>
                        <Text style={styles.innerText}>Policy End Date</Text>
                        <Text style={styles.innerText}>Sum Insured</Text>
                        <Text style={styles.innerText}>BSI</Text>
                        <Text style={styles.innerText}>Eligible Amount</Text>
                    </Col>
                    <Col size={0.5}>
                        <Text style={styles.innerText}>:</Text>
                        <Text style={styles.innerText}>:</Text>
                        <Text style={styles.innerText}>:</Text>
                        <Text style={styles.innerText}>:</Text>
                        <Text style={styles.innerText}>:</Text>
                        <Text style={styles.innerText}>:</Text>
                        <Text style={styles.innerText}>:</Text>
                        <Text style={styles.innerText}>:</Text>

                    </Col>
                    <Col size={5.5}>
                        <Text note style={styles.innerText}>{this.getCorporateBenificeryName(data)}</Text>
                        <Text note style={styles.innerText}>Group Health Policy</Text>
                        <Text note style={styles.innerText}>{data.policyNumber}</Text>
                        <Text note style={styles.innerText}>{formatDate(data.enrollmentStartDate,'DD/MM/YYYY')}</Text>
                        <Text note style={styles.innerText}>{formatDate(data.enrollmentEndDate,'DD/MM/YYYY')}</Text>
                        <Text note style={styles.innerText}>{data.sumInsured}</Text>
                        <Text note style={styles.innerText}>2500000</Text>
                        <Text note style={styles.innerText}> ₹ 0.00</Text>
                    </Col>
                </Row>
            </View>


        )
    }

}


export default BenefeciaryDetails


const styles = StyleSheet.create({

    container:
    {
        height: 200
    },

    bodyContent: {


    },
    innerText: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        marginTop: 5

    },

});