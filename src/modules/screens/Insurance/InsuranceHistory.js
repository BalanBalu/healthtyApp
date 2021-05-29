import React, {Component} from 'react';
import {Container, Content, Toast, Text, Item, Card} from 'native-base';
import {Col, Row} from 'react-native-easy-grid';
import {View, FlatList, ActivityIndicator, StyleSheet} from 'react-native';
import {primaryColor} from '../../../setup/config';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {color} from 'react-native-reanimated';

export default class InsuranceHistory extends Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: 0,
    };
  }
  handleIndexChange = (index) => {
    this.setState({
      selectedIndex: index,
    });
  };

  render() {
    const {selectedIndex} = this.state;
    return (
      <Container>
        <Content>
          <View>
            <Card transparent>
              <SegmentedControlTab
                tabsContainerStyle={{
                  width: 250,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: 'auto',
                  fontFamily: 'Roboto'
                }}
                values={['Insurance Renewal', 'Buy Insurance']}
                selectedIndex={selectedIndex}
                onTabPress={this.handleIndexChange}
                activeTabStyle={{
                  backgroundColor: primaryColor,
                  borderColor: primaryColor,
                  fontFamily: 'Roboto'
                }}
                tabStyle={{borderColor: primaryColor,fontFamily: 'Roboto'}}
              />
            </Card>
            {selectedIndex === 0 ? (
              <View>
                <Card style={styles.cardStyle}>
                  <Col>
                    <Row>
                      <Text
                        style={{
                          fontFamily: 'opensans-bold',
                          fontSize: 14,
                          color: 'primaryColor',
                          marginLeft: 5,
                        }}>
                        Renewal Date
                      </Text>
                      <Text style={{marginLeft: 30}}>:</Text>
                    </Row>
                  </Col>

                  <Col>
                    <Row>
                      <Text style={{fontSize: 15, marginLeft: 5,fontFamily: 'Roboto'}}>
                        PolicyType
                      </Text>
                      <Text style={{marginLeft: 50}}>:</Text>
                    </Row>
                  </Col>

                  <Col>
                    <Row>
                      <Text style={{fontSize: 15, marginLeft: 5,fontFamily: 'Roboto'}}>
                        TransactionType
                      </Text>
                      <Text style={{marginLeft: 11}}>:</Text>
                    </Row>
                  </Col>
                </Card>
              </View>
            ) : selectedIndex === 1 ? (
              <Card style={styles.cardStyle}>
                <Col>
                  <Row>
                    <Text
                      style={{
                        fontSize: 14,
                        color: 'primaryColor',
                        marginLeft: 5,
                        fontFamily: 'opensans-bold'
                      }}>
                      Request Date
                    </Text>
                    <Text style={{marginLeft: 32}}>:</Text>
                  </Row>
                </Col>

                <Col>
                  <Row>
                    <Text style={{fontSize: 15, marginLeft: 5,fontFamily: 'Roboto'}}>
                      PolicyType
                    </Text>
                    <Text style={{marginLeft: 50}}>:</Text>
                  </Row>
                </Col>

                <Col>
                  <Row>
                    <Text style={{fontSize: 15, marginLeft: 5,fontFamily: 'Roboto'}}>
                      TransactionType
                    </Text>
                    <Text style={{marginLeft: 11}}>:</Text>
                  </Row>
                </Col>
              </Card>
            ) : null}
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    marginRight: 15,
    marginLeft: 15,
    padding: 5,
    marginTop: 10,
  },
});
