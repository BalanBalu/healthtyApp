import React, { Component } from 'react';
import { Text, View, Card } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Styles from '../styles';
import { getDistanceByKiloMeters } from '../../CommonAll/functions';
import { getNetworkHospitalAddress } from '../../../common';
import {translate} from '../../../../setup/translator.helper'

export default class RenderNetworkHospitalInfo extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { item, showFullInfoCard, onPressArrowIconSelectedIndex, onPressUpOrDownArrowToViewFullInfo, onPressGoPreAuthRequestForm, onPressGoPreConsultation, navigation, navigationPage } = this.props;
    const address = {
      address: item.address,
      city: item.city,
      state: item.state,
      pinCode: item.pinCode
    }
    return (
      <View>
        {showFullInfoCard === onPressArrowIconSelectedIndex ?
          <View>
            <LinearGradient
              colors={['rgba(220,234,233,0.6)', 'rgba(220,234,233,0.6)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={Styles.gradientStyle}>
              <Row>
                <Col size={9}>
                  <Text style={{ fontSize: 16 }}>{item.hospitalName ? item.hospitalName : 'Un known Hospital'}</Text>
                </Col>
                <Col size={0.8} >
                  <TouchableOpacity onPress={() => onPressUpOrDownArrowToViewFullInfo(onPressArrowIconSelectedIndex, 'UP', item)}>
                    <MaterialIcons name={showFullInfoCard === onPressArrowIconSelectedIndex ? "keyboard-arrow-up" : "keyboard-arrow-down"} style={{ fontSize: 25, color: '#000' }} />
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row style={{ marginTop: 5 }}>
                <Col size={2}><Text style={Styles.subHeadingStyle}>{translate("Address")}</Text></Col>
                <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                <Col size={7}>
                  <Text style={Styles.subHeadingData}>{address && Object.values(address).length ? getNetworkHospitalAddress(address) : null}</Text>
                </Col>
                <Col size={0.8}></Col>
              </Row>
              <Row style={{ marginTop: 5 }}>
                <Col size={2}><Text style={Styles.subHeadingStyle}>{translate("Pincode")}</Text></Col>
                <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                <Col size={7}>
                  <Text style={Styles.subHeadingData}>{address && address.pinCode ? address.pinCode : null}</Text>
                </Col>
                <Col size={0.8}></Col>
              </Row>
              <Row style={{ marginTop: 5 }}>
                <Col size={2}><Text style={Styles.subHeadingStyle}>{translate("Phone")}</Text></Col>
                <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                <Col size={7}>
                  <Text style={Styles.subHeadingData}>{item.phoneNumber ? item.phoneNumber : 'N/A'}</Text>
                </Col>
                <Col size={0.8}></Col>
              </Row>
              <Row style={{ marginTop: 5 }}>
                <Col size={2}><Text style={Styles.subHeadingStyle}>{translate("Email")}</Text></Col>
                <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                <Col size={7}>
                  <Text style={Styles.subHeadingData}>{item.email ? item.email : 'N/A'}</Text>
                </Col>
                <Col size={0.8}></Col>
              </Row>

              <Row style={{ marginTop: 5 }}>
                <Col size={2}><Text style={Styles.subHeadingStyle}>{translate("Distance")}</Text></Col>
                <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                <Col size={7}>
                  <Text style={Styles.subHeadingData}>{getDistanceByKiloMeters(item.distInKiloMeter)}</Text>
                </Col>
                <Col size={0.8}></Col>
              </Row>
              {
                navigationPage === 'PRE_AUTH' ?
                  <Row style={{ marginTop: 15 }}>
                    <Col size={4}>
                      <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#935DD7', borderRadius: 5, alignItems: 'center', }} onPress={() => onPressGoPreAuthRequestForm()}>
                        <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontSize: 15, fontWeight: 'bold' }}>{translate("Continue")}</Text>
                      </TouchableOpacity>
                    </Col>
                    <Col size={4} style={{ marginLeft: 20 }}>

                    </Col>
                    <Col size={2}>
                    </Col>
                  </Row> :
                  <Row style={{ marginTop: 15 }}>
                    <Col size={4}>
                      <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: 'rgba(18,130,131,0.9)', borderRadius: 5, alignItems: 'center', }} onPress={() => onPressGoPreAuthRequestForm()}>
                        <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontSize: 15, fontWeight: 'bold' }}>{translate("Pre Auth")}</Text>
                      </TouchableOpacity>
                    </Col>
                    <Col size={4} style={{ marginLeft: 20 }}>
                      <TouchableOpacity onPress={() => onPressGoPreConsultation()} style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: 'rgba(18,130,131,0.9)', borderRadius: 5, alignItems: 'center', }}>
                        <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontSize: 15, fontWeight: 'bold' }}>{translate("Consultation")}</Text>
                      </TouchableOpacity>
                    </Col>
                    <Col size={2}>
                    </Col>
                  </Row>
              }
            </LinearGradient>

          </View>
          :
          <TouchableOpacity onPress={() => onPressUpOrDownArrowToViewFullInfo(onPressArrowIconSelectedIndex, 'DOWN', item)}>
            <Card style={Styles.cardStyle}>
              <Row>
                <Col size={9}>
                  <Text style={{ fontSize: 16, fontFamily: 'OpenSans' }}
                    numberOfLines={1}
                    ellipsizeMode="tail">{item.hospitalName ? item.hospitalName : 'Un known Hospital'}</Text>
                  <Text style={Styles.subHeadingData}
                    numberOfLines={1}
                    ellipsizeMode="tail"> {address && Object.values(address).length ?
                      `${address.address}, ${address.city}, ${address.state}`
                      : null}</Text>
                </Col>

                <Col size={0.8} style={{ justifyContent: 'center' }}>
                  <TouchableOpacity onPress={() => onPressUpOrDownArrowToViewFullInfo(onPressArrowIconSelectedIndex, 'DOWN', item)}>
                    <MaterialIcons name={showFullInfoCard === onPressArrowIconSelectedIndex ? "keyboard-arrow-up" : "keyboard-arrow-down"} style={{ fontSize: 25, color: '#000' }} />
                  </TouchableOpacity>
                </Col>
              </Row>
            </Card>
          </TouchableOpacity>
        }
      </View>
    )
  }
}
