import React, { Component } from 'react';
import { Text, View, Card } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Styles from '../styles';

export default class RenderNetworkHospitalInfo extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { item, showFullInfoCard, onPressArrowIconSelectedIndex, onPressUpOrDownArrowToViewFullInfo, navigation } = this.props;
    const address = item.location && item.location.address;
    return (
      <View>
        {showFullInfoCard === onPressArrowIconSelectedIndex ?
          <View>
            <LinearGradient
              colors={['#F6F4FC', '#F1ECFB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={Styles.gradientStyle}>
              <Row>
                <Col size={9}>
                  <Text style={{ fontSize: 18 }}>{item.name ? item.name : 'Un known Hospital'}</Text>
                </Col>
                <Col size={0.8} >
                  <TouchableOpacity onPress={() => onPressUpOrDownArrowToViewFullInfo(onPressArrowIconSelectedIndex, 'UP')}>
                    <MaterialIcons name={showFullInfoCard === onPressArrowIconSelectedIndex ? "keyboard-arrow-up" : "keyboard-arrow-down"} style={{ fontSize: 25, color: '#000' }} />
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row style={{ marginTop: 5 }}>
                <Col size={2}><Text style={Styles.subHeadingStyle}>Address</Text></Col>
                <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                <Col size={7}>
                  <Text style={Styles.subHeadingData}> {address && Object.keys(address).length ?
                    `${address.no_and_street}, ${address.district}, ${address.city}, ${address.state}`
                    : null}</Text>
                </Col>
                <Col size={0.8}></Col>
              </Row>
              <Row style={{ marginTop: 5 }}>
                <Col size={2}><Text style={Styles.subHeadingStyle}>Pincode</Text></Col>
                <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                <Col size={7}>
                  <Text style={Styles.subHeadingData}>{address && Object.keys(address).length && address.pin_code ? address.pin_code : null}</Text>
                </Col>
                <Col size={0.8}></Col>
              </Row>
              <Row style={{ marginTop: 5 }}>
                <Col size={2}><Text style={Styles.subHeadingStyle}>Phone</Text></Col>
                <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                <Col size={7}>
                  <Text style={Styles.subHeadingData}>{item.mobile_no ? item.mobile_no : 'N/A'}</Text>
                </Col>
                <Col size={0.8}></Col>
              </Row>
              <Row style={{ marginTop: 5 }}>
                <Col size={2}><Text style={Styles.subHeadingStyle}>Email</Text></Col>
                <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                <Col size={7}>
                  <Text style={Styles.subHeadingData}>{item.email ? item.email : 'N/A'}</Text>
                </Col>
                <Col size={0.8}></Col>
              </Row>
            </LinearGradient>
          </View>
          :
          <Card style={Styles.cardStyle}>
            <Row>
              <Col size={9}>
                <Text style={{ fontSize: 16, fontFamily: 'OpenSans' }}
                  numberOfLines={1}
                  ellipsizeMode="tail">{item.name ? item.name : 'Un known Hospital'}</Text>
                <Text style={Styles.subHeadingData}
                  numberOfLines={1}
                  ellipsizeMode="tail"> {address && Object.keys(address).length ?
                    `${address.no_and_street}, ${address.district}, ${address.city}, ${address.state}`
                    : null}</Text>
              </Col>

              <Col size={0.8} style={{ justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => onPressUpOrDownArrowToViewFullInfo(onPressArrowIconSelectedIndex, 'DOWN')}>
                  <MaterialIcons name={showFullInfoCard === onPressArrowIconSelectedIndex ? "keyboard-arrow-up" : "keyboard-arrow-down"} style={{ fontSize: 25, color: '#000' }} />
                </TouchableOpacity>
              </Col>
            </Row>
          </Card>}
      </View>
    )
  }
}
