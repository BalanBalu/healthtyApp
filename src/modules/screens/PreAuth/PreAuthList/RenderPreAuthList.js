import React, {Component} from 'react';
import {Text, Card, Left, Right} from 'native-base';
import {TouchableOpacity, View} from 'react-native';
import {Col, Row} from 'react-native-easy-grid';
import Styles from '../styles';
import {formatDate} from '../../../../setup/helpers';
import {primaryColor} from '../../../../setup/config';
import {translate} from '../../../../setup/translator.helper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class RenderNetworkHospitalInfo extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      item,
      navigation,
      onPressToggleButton,
      index,
      showCard,
      show,
    } = this.props;
    return (
      <View>
        {showCard === index && !show ? (
          <View>
            <Card style={styles.cardStyles}>
              <Row style={styles.gradientStyle}>
                <Col size={9}>
                  <Text style={{fontSize: 16, color: '#fff'}}>
                    {' '}
                    {item.tpaCompany ? item.tpaCompany : 'UnKnown'}
                  </Text>
                </Col>
                <Col size={0.8}>
                  <TouchableOpacity onPress={() => onPressToggleButton(index)}>
                    <MaterialIcons
                      name={
                        showCard === index && !show
                          ? 'keyboard-arrow-up'
                          : 'keyboard-arrow-down'
                      }
                      style={{fontSize: 25, color: '#fff'}}
                    />
                  </TouchableOpacity>
                </Col>
              </Row>
              <View style={styles.mainView}>
                <Row style={{marginTop: 5}}>
                  <Col size={4}>
                    <Text style={styles.subHeadingStyle}>
                      {translate('Patient name')}
                    </Text>
                  </Col>
                  <Col size={0.5}>
                    <Text style={{marginTop: 2}}>:</Text>
                  </Col>
                  <Col size={6.5}>
                    <Text style={styles.subHeadingData}>
                      {item.patientName || null}
                    </Text>
                  </Col>
                </Row>
                <Row style={{marginTop: 5}}>
                  <Col size={4}>
                    <Text style={styles.subHeadingStyle}>
                      {translate('Patient relationship')}
                    </Text>
                  </Col>
                  <Col size={0.5}>
                    <Text style={{marginTop: 2}}>:</Text>
                  </Col>
                  <Col size={6.5}>
                    <Text style={styles.subHeadingData}>
                      {item.patientRelationship || "N/A"}
                    </Text>
                  </Col>
                </Row>
                <Row style={{marginTop: 5}}>
                  <Col size={4}>
                    <Text style={styles.subHeadingStyle}>
                      {translate('Hospital')}
                    </Text>
                  </Col>
                  <Col size={0.5}>
                    <Text style={{marginTop: 2}}>:</Text>
                  </Col>
                  <Col size={6.5}>
                    <Text style={styles.subHeadingData}>
                      {item.hospitalName || null}
                    </Text>
                  </Col>
                </Row>
                <Row style={{marginTop: 5}}>
                  <Col size={4}>
                    <Text style={styles.subHeadingStyle}>{translate('Status')}</Text>
                  </Col>
                  <Col size={0.5}>
                    <Text style={{marginTop: 2}}>:</Text>
                  </Col>
                  <Col size={6.5}>
                    <Text style={styles.subHeadingData}>
                      {item.status || null}
                    </Text>
                  </Col>
                </Row>

                <Row
                  style={{
                    marginTop: 5,
                    paddingTop: 10,
                    borderTopColor: '#909090',
                    borderTopWidth: 0.5,
                  }}>
                  <Left>
                    <Text style={Styles.commonBoldText}>
                      {translate('Request sent date')}
                    </Text>
                    <Text style={Styles.boldText}>
                      {item.createdDate
                        ? formatDate(item.createdDate, 'DD/MM/YYYY')
                        : null}
                    </Text>
                  </Left>
                  <Right style={{justifyContent: 'center'}}>
                    <TouchableOpacity
                      style={Styles.ecardButton}
                      onPress={() =>
                        navigation.navigate('DocumentList', {
                          uploadData: item.patientProof,
                          data: item,
                          preAuthData: true,
                        })
                      }>
                      <Text style={Styles.linkHeader}>
                        {translate('View Document')}
                      </Text>
                    </TouchableOpacity>
                  </Right>
                </Row>
              </View>
            </Card>
          </View>
        ) : (
          <View>
            <TouchableOpacity onPress={() => onPressToggleButton(index)}>
              <Card style={styles.cardStyle}>
                <Row>
                  <Col size={9}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'opensans-bold',
                        color: primaryColor,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {' '}
                      {item.tpaCompany ? item.tpaCompany : 'UnKnown'}
                    </Text>
                    <Row>
                      <Col size={3}>
                        <Text
                          style={{
                            fontFamily: 'Roboto',
                            fontSize: 16,
                            color: '#909090',
                            marginTop: 5,
                            marginLeft: 5,
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {translate('Status')}
                        </Text>
                      </Col>
                      <Col size={0.5}>
                        <Text style={{marginTop: 5}}>:</Text>
                      </Col>
                      <Col size={6.5}>
                        <Text
                          style={styles.subHeadingData}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {' '}
                          {item.status || null}
                        </Text>
                      </Col>
                    </Row>
                  </Col>
                  <Col size={0.8} style={{justifyContent: 'center'}}>
                    <TouchableOpacity
                      onPress={() => onPressToggleButton(index)}>
                      <MaterialIcons
                        name={
                          showCard === index && !show
                            ? 'keyboard-arrow-up'
                            : 'keyboard-arrow-down'
                        }
                        style={{fontSize: 25, color: '#000'}}
                      />
                    </TouchableOpacity>
                  </Col>
                </Row>
              </Card>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}
