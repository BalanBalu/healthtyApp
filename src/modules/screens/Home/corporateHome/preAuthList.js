import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Left, Right, Thumbnail, Body, Icon, locations, Input } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, View, FlatList, AsyncStorage } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {getPreAuthListByEmpCodeAndPolicyNo} from '../../../providers/corporate/corporate.actions'
import { RenderFooterLoader } from '../../../common';
import { formatDate } from '../../../../setup/helpers';
import Spinner from "../../../../components/Spinner";

class preAuthList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      categoriesMain: [],
      isLoading : false ,
    }
  }
  async componentDidMount() {
    this.setState({ isLoading: false })
    await this.getPreAuthList()
    this.setState({ isLoading: true })
  }
  async getPreAuthList() {
    let employee_code = await AsyncStorage.getItem("employeeCode");
    let policyNo = await AsyncStorage.getItem("memberPolicyNo");
    
    if (employee_code && policyNo) {
      let result = await getPreAuthListByEmpCodeAndPolicyNo(employee_code, policyNo, this.page, 10)
      if (result && result.docs && result.docs[0]) {
        let temp = this.state.data
        temp.concat(result.docs) 
        if (temp.length === result.total) {
          this.isAllLoaded = true;
      }
      
        this.setState({data:result.docs})
      }
     
    }
  }
  handleLoadMore = async () => {
    if (this.isAllLoaded === false) {
        this.onEndReachedCalledDuringMomentum = true;
       this.page=this.page+1;
        this.setState({ footerLoading: true });
        await this.getPreAuthList()
    }
  }
  renderFooter() {
    return (
        <RenderFooterLoader footerLoading={this.state.footerLoading} />
    );
}
  render() {
const {data,isLoading}=this.state
    // const data = [{ InsuranceCompanyName: 'New India Assurance Company Limited', hospitalName: 'Fortis Malar Hospital', policyStatus: 'Paid', address: 'Adyar, Chennai,Tamil Nadu', claimStatus: 'Self' }, { InsuranceCompanyName: 'Oriental Insurance Company Limited', policyStatus: 'Unpaid', hospitalName: 'Apollo Hospital', address: 'Greams Lane, Off, Greams Road, Thousand Lights, Chennai', claimStatus: 'Family' },]

    return (
      <Container style={styles.container}>
        
        {/* <View style={{ marginTop: 15, marginLeft: 15, marginRight: 15, marginBottom: 0 }}>
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
        </View> */}
        <Content >
          
          {isLoading === false ?
            <Spinner
              color="blue"
              style={[styles.containers, styles.horizontal]}
              visible={true}
              size={"large"}
              overlayColor="none"
              cancelable={false}
            /> : data === undefined ? null : data.length == 0 ?

              <View style={{
                flex: 1,
                justifyContent: 'center', alignItems: 'center',
              }}>

           
                <Text>No pre Auth Found</Text>

              </View> :
              <View style={{ marginLeft: 15, marginRight: 15, marginBottom: 15 }}>
                <FlatList
                  data={data}
                  onEndReached={() => this.handleLoadMore()}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={this.renderFooter.bind(this)}
                  renderItem={({ item, index }) =>
                    <Card style={{ padding: 10, borderRadius: 5 }}>
                      <Row>

                        <Col size={8}>
                          <Text style={{ fontFamily: 'OpenSans', fontSize: 16, lineHeight: 25, fontWeight: '700', color: '#7F49C3' }}>{item.InsuranceCompanyName}</Text>

                        </Col>
                        <Col size={2} >
                          <TouchableOpacity style={item.policyStatus === 'Paid' ? { backgroundColor: 'green', borderRadius: 5, padding: 2, marginTop: 2 } : { backgroundColor: '#FECE83', borderRadius: 5, padding: 2, marginTop: 2 }}>
                            <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontWeight: '600', textAlign: 'center', fontSize: 14 }}>{item.policyStatus}</Text>
                          </TouchableOpacity>
                        </Col>
                      </Row>
                      <Row style={{ borderBottomColor: 'gray', borderBottomWidth: 0.3, paddingBottom: 10 }}>
                  
                        <Col size={9}>
                          <Row style={{ marginTop: 5, }}>
                            <Col size={4}>
                              <Text style={styles.commonBoldText}>insurer name</Text>
                            </Col>
                            <Col size={0.5}>
                              <Text>:</Text>
                            </Col>
                            <Col size={5.5}>
                              <Text style={styles.commonText}>{item.patientName}</Text>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: 5, }}>
                            <Col size={4}>
                              <Text style={styles.commonBoldText}>reference Number</Text>
                            </Col>
                            <Col size={0.5}>
                              <Text>:</Text>
                            </Col>
                            <Col size={5.5}>
                              <Text style={styles.commonText}>{item.referenceNumbe || 'N/A'}</Text>
                            </Col>
                          </Row>
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
                              <Text style={styles.commonText}>{item.hospitalLocation}</Text>
                            </Col>
                          </Row>
                  

                        </Col>
                        <Col size={1}>

                        </Col>
                      </Row>
                      <Row style={{ marginTop: 5 }}>
                        <Left>
                          <Text style={styles.commonBoldText}>Date</Text>
                          <Text style={styles.boldText}>{formatDate(item.createdDate, 'DD/MM/YYYY')}</Text>

                        </Left>
                        {/* <Right>
                      <Text style={styles.commonBoldText}>Amount</Text>
                      <Text style={styles.boldText}>50000</Text>
                    </Right> */}
                      </Row>
                    </Card>
                  } />
          
              </View>}
        </Content>
      </Container>

    )
  }

}

export default preAuthList


const styles = StyleSheet.create({
  usedAmount: {
    fontFamily: 'OpenSans',
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: 5

  },
  totalAmount: {
    fontFamily: 'OpenSans',
    fontSize: 13,
    color: '#909090',
    textAlign: 'center'
  },
  nameText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#7F49C3'
  },
  policyText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    color: '#909090',
    marginTop: 5,
    textAlign: 'center'
  },
  commonText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    color: '#000'
  },
  commonBoldText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    color: '#909090'
  },
  boldText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    color: '#7F49C3',
    marginTop: 2,
    fontWeight: 'bold'
  }

});