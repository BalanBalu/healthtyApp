import React, { PureComponent } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Radio, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, BackHandler } from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
const POSSIBLE_PAY_METHODS = {
    SELF: 'SELF',
    CORPORATE: 'CORPORATE',
    INSURANCE: 'INSURANCE'
}

const PayBySelection = (props) => {
        const { selectedPayBy, isCorporateUser, onSelectionChange } = props
        if(!isCorporateUser) {
            return null
        }
        return (
            <View style={{ backgroundColor: '#fff', marginTop: 10, marginLeft: 8 }}>
                <Text style={styles.subHead}>Are You Paying By </Text>
                <Row style={{ marginTop: 5 }}>
                  <Col size={10}>
                    <Row>
                      <Col size={3}>
                        <Row style={{ alignItems: 'center' }}>
                          <Radio
                            standardStyle={true}
                            selected={selectedPayBy === POSSIBLE_PAY_METHODS.SELF }
                            onPress={() => onSelectionChange(POSSIBLE_PAY_METHODS.SELF)}
                          />
                          <Text style={styles.firstCheckBox}>Self</Text>
                        </Row>
                      </Col>
                      <Col size={3}>
                        <Row style={{ alignItems: 'center' }}>
                          <Radio
                            standardStyle={true}
                            selected={selectedPayBy === POSSIBLE_PAY_METHODS.CORPORATE }
                            onPress={() =>  onSelectionChange(POSSIBLE_PAY_METHODS.CORPORATE) }
                          />
                          <Text style={styles.firstCheckBox}>Corporate</Text>
                        </Row>
                      </Col>
                      <Col size={4}>
                         <Row style={{ alignItems: 'center' }}>
                            <Radio
                                standardStyle={true}
                                selected={selectedPayBy ===  POSSIBLE_PAY_METHODS.INSURANCE }
                                onPress={() => onSelectionChange(POSSIBLE_PAY_METHODS.INSURANCE) }
                            />
                            <Text style={styles.firstCheckBox}>Insurance</Text>
                         </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </View>
              


        )
    }

export {
    PayBySelection,
    POSSIBLE_PAY_METHODS
} 

const styles = StyleSheet.create({
    container: {
        height: 200
    },
    bodyContent: {
    },
    innerText: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        marginTop: 5
    },
    firstCheckBox: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#000',
        marginLeft: 10
    },
    subHead: {
      fontFamily: 'OpenSans',
      fontSize: 12,
      color: '#000',
      marginTop: 10
    },

});