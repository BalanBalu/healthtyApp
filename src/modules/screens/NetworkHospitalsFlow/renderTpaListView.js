import React, { Component } from 'react';
import {  Text,Radio } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import {  TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Styles from './styles'
export default class RenderTpaList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { item, selectedIndex, index, onPressToggleBySelectTapItem, } = this.props;
    return (
      <TouchableOpacity onPress={() => onPressToggleBySelectTapItem(item.tpaCode, index)} style={Styles.flatlistMainView}>
        { item.tpaName ?
          <LinearGradient
            colors={['#F6F4FC', '#F1ECFB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={Styles.gradientStyle}>
            <Row style={{ borderBottomWidth: 0, padding: 5 }}>
              <Col style={{ justifyContent: 'center' }} size={9}>
                <Text style={Styles.companyName}>{item.tpaName || ''}</Text>
              </Col>
              <Col style={{ justifyContent: 'center' }} size={1}>
                <Radio
                  standardStyle={true}
                  selected={selectedIndex === index}
                  onPress={() => onPressToggleBySelectTapItem(item.tpaCode, index)} />
              </Col>
            </Row>
          </LinearGradient>
          : null}
      </TouchableOpacity>
    )
  }
}
