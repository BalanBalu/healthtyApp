import React, { PureComponent } from 'react';
import { Text, View, Container, Content, Card, Item, Input } from 'native-base';
import { TouchableOpacity, FlatList } from 'react-native'
import { Col, Row } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './Styles';
import { primaryColor } from '../../../setup/config';


class SubmitClaim extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showCard: -1,
      show: true,
    }
  }

  toggleData(index, typeOfArrowIcon) {
    const { showCard, show } = this.state;
    if (typeOfArrowIcon === 'DOWN') {
      this.setState({ showCard: index, show: !this.state.show });
    } else {
      this.setState({ showCard: -1, show: null });
    }
  }


  primaryInsured(index, typeOfArrowIcon) {
    return (
      <View>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Policy No.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Policy Number"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>SI No Certificate No.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Social Insurance Number"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Company ITPA ID MA ID No.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter TPA ID"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>First Name.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter First Name"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Middle Name.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Middle Name"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Last Name.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Last Name"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Pin Code.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Pin Code"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>No and Street.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter No and Street"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Address.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Address"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>City.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter City"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>State.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter State"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Country.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Country"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Phone Number.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Phone Number"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Email ID.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Email ID"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
      </View>
    )
  }




  render() {
    const data = [
      { title: 'Details of primary insured', id: 1 },
      { title: 'Details of insurance history', id: 2 },
      { title: 'Details of insured person hospitalized', id: 3 },
      { title: 'Details of hospitalization', id: 4 },
      { title: 'Details of claim', id: 5 },
      { title: 'Details of bills enclosed', id: 6 },
      { title: 'Details of primary insured bank account', id: 7 },
      { title: 'Declaration by insured', id: 8 }]
    const { showCard, show } = this.state
    return (
      <Container>
        <Content contentContainerStyle={{ padding: 10 }}>



          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View>
                {this.state.showCard === index && !this.state.show ? (
                  <Card>
                    <TouchableOpacity style={{ justifyContent: 'center', padding: 10, backgroundColor: primaryColor }} onPress={() => { this.setState({ showCard: true }) }}>
                      <Row>
                        <Col size={9}>
                          <Text style={{ color: '#fff' }}>{item.title}</Text>
                        </Col>
                        <Col size={1}>
                          <TouchableOpacity
                            onPress={() => this.toggleData(index, 'UP')}>
                            <MaterialIcons
                              name={
                                showCard === index && !show
                                  ? 'keyboard-arrow-up'
                                  : 'keyboard-arrow-down'
                              }
                              style={{ fontSize: 25, color: '#fff' }}
                            />
                          </TouchableOpacity>
                        </Col>
                      </Row>
                    </TouchableOpacity>
                    <View style={{
                      borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomColor: '#909090',
                      borderLeftColor: '#909090', borderRightColor: '#909090', paddingBottom: 10
                    }}>
                      {item.id === 1 && this.primaryInsured(item, index)}
                      <View style={{ justifyContent: "center", alignItems: 'center', marginTop: 15, marginBottom: 5 }}>
                        <TouchableOpacity style={{ backgroundColor: primaryColor, paddingHorizontal: 30, paddingVertical: 6, borderRadius: 10 }} >
                          <Text style={{ color: "#fff" }}>Submit</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Card>) : (
                  <Card>
                    <TouchableOpacity style={{ justifyContent: 'center', padding: 10, }} onPress={() => { this.setState({ showCard: false }) }}>
                      <Row>
                        <Col size={9}>
                          <Text style={{ color: '#000' }}>{item.title}</Text>
                        </Col>
                        <Col size={1}>
                          <TouchableOpacity
                            onPress={() => this.toggleData(index, 'DOWN')}>
                            <MaterialIcons
                              name={
                                showCard === index && !show
                                  ? 'keyboard-arrow-up'
                                  : 'keyboard-arrow-down'
                              }
                              style={{ fontSize: 25, color: '#000' }}
                            />
                          </TouchableOpacity>
                        </Col>
                      </Row>
                    </TouchableOpacity>
                  </Card>
                )}

              </View>
            )}
          />
        </Content>
      </Container>
    )
  }
}


export default SubmitClaim