import React, {Component} from 'react';
import {Text, Card, Left, Right} from 'native-base';
import {TouchableOpacity, View} from 'react-native';
import {Col, Row} from 'react-native-easy-grid';
import Styles from '../styles';
import {formatDate} from '../../../../setup/helpers';
import {primaryColor} from '../../../../setup/config';

export default class RenderNetworkHospitalInfo extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {item, navigation} = this.props;
    console.log("fdjfhsfkjshgjkhk",item)
    return (
      <View>
        <Card style={{padding: 10, borderRadius: 5, marginTop: 10}}>
          <Row>
            <Col size={7}>
              <Text
                style={{
                  fontFamily: 'OpenSans',
                  fontSize: 16,
                  lineHeight: 25,
                  fontWeight: '700',
                  color: primaryColor,
                }}>
                {item.tpaCompany ? item.tpaCompany : 'UnKnown'}
              </Text>
            </Col>
            <Col size={3}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#FECE83',
                  borderRadius: 5,
                  padding: 2,
                  marginTop: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'OpenSans',
                    fontWeight: '600',
                    textAlign: 'center',
                    fontSize: 10,
                  }}>
                  {item.status || null}
                </Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row
            style={{
              borderBottomColor: 'gray',
              borderBottomWidth: 0.3,
              paddingBottom: 10,
            }}>
            <Col size={9}>
              <Row style={{marginTop: 5}}>
                <Col size={4}>
                  <Text style={Styles.commonBoldText}>Patient name</Text>
                </Col>
                <Col size={0.5}>
                  <Text>:</Text>
                </Col>
                <Col size={5.5}>
                  <Text style={Styles.commonText}>
                    {item.patientName || null}
                  </Text>
                </Col>
              </Row>
              {/* <Row style={{marginTop: 5}}>
                <Col size={4}>
                  <Text style={Styles.commonBoldText}>reference Number</Text>
                </Col>
                <Col size={0.5}>
                  <Text>:</Text>
                </Col>
                <Col size={5.5}>
                  <Text style={Styles.commonText}>
                    {item.referenceNumber || 'N/A'}
                  </Text>
                </Col>
              </Row> */}
              <Row style={{marginTop: 5}}>
                <Col size={4}>
                  <Text style={Styles.commonBoldText}>Hospital</Text>
                </Col>
                <Col size={0.5}>
                  <Text>:</Text>
                </Col>
                <Col size={5.5}>
                  <Text style={Styles.commonText}>
                    {item.hospitalName || null}
                  </Text>
                </Col>
              </Row>
              <Row style={{marginTop: 5}}>
                <Col size={4}>
                  <Text style={Styles.commonBoldText}>Address</Text>
                </Col>
                <Col size={0.5}>
                  <Text>:</Text>
                </Col>
                <Col size={5.5}>
                  <Text style={Styles.commonText}>
                    {item.hospitalLocation || null}
                  </Text>
                </Col>
              </Row>
            </Col>
            <Col size={1} />
          </Row>
          <Row style={{marginTop: 5}}>
            <Left>
              <Text style={Styles.commonBoldText}>Request sent date</Text>
              <Text style={Styles.boldText}>
                {item.createdDate
                  ? formatDate(item.createdDate, 'DD/MM/YYYY')
                  : null}
              </Text>
            </Left>
            <Right>
              <TouchableOpacity
                style={Styles.ecardButton}
                onPress={() =>
                  navigation.navigate('DocumentList', {
                    uploadData: item.patientProof,
                    data: item,
                    preAuthData: true,
                  })
                }>
                <Text style={Styles.linkHeader}>View Document</Text>
              </TouchableOpacity>
            </Right>
          </Row>
        </Card>
      </View>
    );
  }
}
