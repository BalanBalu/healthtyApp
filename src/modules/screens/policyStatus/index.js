import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Left, Right, Thumbnail, Body, Icon, locations, Input } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, View, FlatList, AsyncStorage } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'



class PolicyStatus extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      categoriesMain: []
    }
  }



  render() {

    const data = [{ InsuranceCompanyName: 'New India Assurance Company Limited',hospitalName:'Fortis Malar Hospital',policyStatus:'Paid',address:'Adyar, Chennai,Tamil Nadu',claimStatus:'Self'}, { InsuranceCompanyName: 'Oriental Insurance Company Limited',policyStatus:'Unpaid',hospitalName:'Apollo Hospital',address:'Greams Lane, Off, Greams Road, Thousand Lights, Chennai',claimStatus:'Family' }, ]

    return (
      <Container style={styles.container}>
        <View style={{ marginTop: 15, marginLeft: 15, marginRight: 15, marginBottom: 0 }}>
          <Card style={{ justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 5 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <AnimatedCircularProgress
                size={140}
                width={10}
                fill={50}
                tintColor="#7F49C3"
                backgroundColor="#AAB3DC">
                {() => (
                  <View>
                    <Text style={styles.usedAmount}>
                      50000
                          </Text>
                    <Text style={styles.totalAmount}>{" "}/100000</Text>
                  </View>
                )}
              </AnimatedCircularProgress>

              <View style={{ marginTop: 10 }}>
                <Text style={styles.nameText}>Ramkumar S</Text>
                <Text style={styles.policyText }>Policy No : <Text style={styles.commonText}>87575ty76</Text></Text>
                <Text style={styles.policyText}>Validity period : <Text style={styles.commonText}>02/20 - 02/24</Text></Text>
              </View>

            </View>
          </Card>
        </View>
        <Content >
          <View style={{ marginLeft: 15, marginRight: 15, marginBottom: 15 }}>
<FlatList 
data={data}
renderItem={({item,index})=>
            <Card style={{ padding: 10, borderRadius: 5 }}>
              <Row>

                <Col size={8}>
                  <Text style={{ fontFamily: 'OpenSans', fontSize: 16, lineHeight: 25, fontWeight: '700', color: '#7F49C3' }}>{item.InsuranceCompanyName}</Text>

                </Col>
                <Col size={2} >
                  <TouchableOpacity style={item.policyStatus === 'Paid' ?{ backgroundColor: 'green', borderRadius: 5, padding: 2, marginTop: 2 } : {backgroundColor: '#FECE83', borderRadius: 5, padding: 2, marginTop: 2}}>
                    <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontWeight: '600', textAlign: 'center', fontSize: 14 }}>{item.policyStatus}</Text>
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row style={{ borderBottomColor: 'gray', borderBottomWidth: 0.3, paddingBottom: 10 }}>
                <Col size={9}>
                  <Row style={{ marginTop: 5, }}>
                    <Col size={4}>
                      <Text style={styles.commonBoldText}>Hospital</Text>
                    </Col>
                    <Col size={0.5}>
                      <Text>:</Text>
                    </Col>
                    <Col size={5.5}>
                      <Text style={styles.commonText}>{item.hospitalName}</Text>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 5, }}>
                    <Col size={4}>
                      <Text style={styles.commonBoldText}>Address</Text>
                    </Col>
                    <Col size={0.5}>
                      <Text>:</Text>
                    </Col>
                    <Col size={5.5}>
                      <Text style={styles.commonText}>{item.address}</Text>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 5, }}>
                    <Col size={4}>
                      <Text style={styles.commonBoldText}>Claimed By</Text>
                    </Col>
                    <Col size={0.5}>
                      <Text>:</Text>
                    </Col>
                    <Col size={5.5}>
                      <Text style={styles.commonText}>{item.claimStatus}</Text>
                    </Col>
                  </Row>

                </Col>
                <Col size={1}>

                </Col>
              </Row>
              <Row style={{ marginTop: 5 }}>
                <Left>
                  <Text style={styles.commonBoldText}>Date</Text>
                  <Text style={styles.boldText}>20/12/2020</Text>

                </Left>
                <Right>
                  <Text style={styles.commonBoldText}>Amount</Text>
                  <Text style={styles.boldText}>50000</Text>
                </Right>
              </Row>
            </Card>
}/>
            {/* <Card style={{ padding: 10, borderRadius: 5 }}>
              <Row >

                <Col size={8}>
                  <Text style={{ fontFamily: 'OpenSans', fontSize: 16, lineHeight: 25, fontWeight: '700', color: '#7F49C3' }}>Oriental Insurance Company Limited</Text>

                </Col>
                <Col size={2} >
                  <TouchableOpacity style={{ backgroundColor: '#FECE83', borderRadius: 5, padding: 2, marginTop: 2 }}>
                    <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontWeight: '600', textAlign: 'center', fontSize: 14 }}>Unpaid</Text>
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row style={{ borderBottomColor: 'gray', borderBottomWidth: 0.3, paddingBottom: 10 }}>
                <Col size={9}>
                  <Row style={{ marginTop: 5, }}>
                    <Col size={4}>
                      <Text style={styles.commonBoldText}>Hospital</Text>
                    </Col>
                    <Col size={0.5}>
                      <Text>:</Text>
                    </Col>
                    <Col size={5.5}>
                      <Text style={styles.commonText}>Apollo Hospital</Text>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 5, }}>
                    <Col size={4}>
                      <Text style={styles.commonBoldText}>Address</Text>
                    </Col>
                    <Col size={0.5}>
                      <Text>:</Text>
                    </Col>
                    <Col size={5.5}>
                      <Text style={styles.commonText}>Greams Lane, Off, Greams Road, Thousand Lights, Chennai</Text>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 5, }}>
                    <Col size={4}>
                      <Text style={styles.commonBoldText}>Claimed By</Text>
                    </Col>
                    <Col size={0.5}>
                      <Text>:</Text>
                    </Col>
                    <Col size={5.5}>
                      <Text style={styles.commonText}>Family</Text>
                    </Col>
                  </Row>
                </Col>
                <Col size={1}>
                </Col>
              </Row>
              <Row style={{ marginTop: 5 }}>
                <Left>
                  <Text style={styles.commonBoldText}>Date</Text>
                  <Text style={styles.boldText}>20/12/2020</Text>

                </Left>
                <Right>
                  <Text style={styles.commonBoldText}>Amount</Text>
                  <Text style={styles.boldText}>50000</Text>
                </Right>
              </Row>
            </Card> */}
          </View>
        </Content>
      </Container>

    )
  }

}

export default PolicyStatus


const styles = StyleSheet.create({
  usedAmount:{
    fontFamily: 'OpenSans',
     fontSize: 18, 
     color: '#000', 
     textAlign: 'center', 
     fontWeight: 'bold', 
     marginLeft: 5
    
  },
  totalAmount:{
    fontFamily: 'OpenSans', 
    fontSize: 13, 
    color: '#909090', 
    textAlign: 'center' 
  },
  nameText:{
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#7F49C3'
  },
  policyText:{
    fontFamily: 'OpenSans',
     fontSize: 16, 
     color: '#909090', 
     marginTop: 5, 
     textAlign: 'center' 
  },
  commonText:{
    fontFamily: 'OpenSans', 
    fontSize: 16, 
    color: '#000'
  },
  commonBoldText:{
    fontFamily: 'OpenSans', 
    fontSize: 16, 
    color: '#909090'
  },
  boldText:{
    fontFamily: 'OpenSans', 
    fontSize: 16, 
    color: '#7F49C3', 
    marginTop: 2, 
    fontWeight: 'bold'
  }

});