import React, { PureComponent } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Container, Content, Text, Left, Right, View, Card, } from 'native-base';
import { Col, Row, } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';


class ClaimIntimationList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showCard: 0,
      show: true,
    }

  }


  toggleData(data) {
    const { showCard, show } = this.state
    this.setState({ showCard: data, show: !this.state.show, })
  }
  render() {
    let data = [{ PatientName: 'Hrithikesh', address: 'NorthPark Street,Ambattur,Chennai,Tamil Nadu ', policyNo: 892158775654646464567, MAID: '7853657346', claimBy: 'self', claimStatus: 'Paid', ClaimAmount: '12,555', hospital: 'Apollo Hospital' }, { PatientName: 'HariKrishnan', address: 'NorthPark Street ,Ambattur,Chennai,Tamil Nadu', policyNo: 463636894667575824475, MAID: '7853657346', claimBy: 'Family', claimStatus: 'Paid', ClaimAmount: '10,355', hospital: 'Fortis Malar Hospital' },]
    const { showCard, show, } = this.state

    return (
      <Container>
        <Content>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) =>
              <View>
                {this.state.showCard === index && !this.state.show ?
                  <View>
                    <Card style={styles.cardStyles}>
                      <Row style={styles.gradientStyle}>
                        <Col size={9}>
                          <Text style={{ fontSize: 18, color: '#fff' }}>{item.PatientName}</Text>

                        </Col>
                        <Col size={0.8} >
                          <TouchableOpacity onPress={() => this.toggleData(index)}>
                            <MaterialIcons name={showCard === index && !show ? "keyboard-arrow-up" : "keyboard-arrow-down"} style={{ fontSize: 25, color: '#fff' }} />
                          </TouchableOpacity>
                        </Col>
                      </Row>
                      <View style={styles.mainView}>
                        <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Policy No</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.policyNo}</Text>
                          </Col>

                        </Row>
                        <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>MAID</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.MAID}</Text>
                          </Col>

                        </Row>
                        <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Claim By</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.claimBy}</Text>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Claim Status</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.claimStatus}</Text>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Claim Amount</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.ClaimAmount}</Text>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Hospital</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.hospital}</Text>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Hospital Address</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.address}</Text>
                          </Col>
                        </Row>
                      </View>
                      <View style={styles.subView}>
                        <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                          <Left>
                            <TouchableOpacity style={styles.ecardButton} onPress={() => this.props.navigation.navigate("DocumentList")}>
                              <Text style={styles.linkHeader}>View Document</Text>
                            </TouchableOpacity>
                          </Left>
                          <Right>
                            <TouchableOpacity style={styles.ecardButton} >
                              <Text style={styles.linkHeader}>Upload Document</Text>
                            </TouchableOpacity>
                          </Right>
                        </Row>
                      </View>
                    </Card>
                  </View>
                  :
                  <Card style={styles.cardStyle}>
                    <Row>
                      <Col size={9}>
                        <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#7F49C3', fontWeight: '700' }}
                          numberOfLines={1}
                          ellipsizeMode="tail">{item.PatientName}</Text>
                        <Row>
                          <Col size={3}>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 16, color: '#909090', marginTop: 5 }}
                              numberOfLines={1}
                              ellipsizeMode="tail">Policy No</Text>
                          </Col>
                          <Col size={0.5}>
                            <Text style={{ marginTop: 5 }}>:</Text>
                          </Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}
                              numberOfLines={1}
                              ellipsizeMode="tail">{item.policyNo}</Text>
                          </Col>
                        </Row>
                        {/* <Text style={styles.subHeadingData}
                              numberOfLines={1}
                              ellipsizeMode="tail">{item.address}</Text> */}


                      </Col>

                      <Col size={0.8} style={{ justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => this.toggleData(index)}>
                          <MaterialIcons name={showCard === index && !show ? "keyboard-arrow-up" : "keyboard-arrow-down"} style={{ fontSize: 25, color: '#000' }} />
                        </TouchableOpacity>
                      </Col>
                    </Row>
                  </Card>}
              </View>
            } />
        </Content>
      </Container>
    )
  }
}

export default ClaimIntimationList

const styles = StyleSheet.create({
  gradientStyle: {
    justifyContent: 'center',
    backgroundColor: '#7F49C3',
    padding: 8
  },
  cardStyle: {
    marginRight: 15,
    marginLeft: 15,
    padding: 10,
    marginTop: 10
  },
  subHeadingStyle: {
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'OpenSans',
    color: '#909090'
  },
  subHeadingData: {
    fontSize: 15,
    color: '#000',
    marginTop: 5,
    fontFamily: 'OpenSans'
  },
  cardStyles: {
    marginTop: 15,
    marginRight: 15,
    marginLeft: 15,
    borderRadius: 5
  },
  ecardButton: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  linkHeader: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    textDecorationColor: '#7F49C3',
    textDecorationLine: 'underline',
    color: '#7F49C3'
  },
  mainView: {
    marginLeft: 10,
    marginRight: 10,
    borderBottomColor: '#909090',
    borderBottomWidth: 0.5,
    paddingBottom: 5
  },
  subView: {
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15
  }
})
