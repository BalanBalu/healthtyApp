import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, Text, View, ScrollView, FlatList, AsyncStorage } from 'react-native';
import { ListItem, Left, Body } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { toastMeassage } from '../../common';
import { getCorporateUserEcardDetails, getCorporateEmployeeDetailsById } from '../../providers/corporate/corporate.actions';
import { fetchUserProfile } from '../../providers/profile/profile.action';

class EcardDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      EcardData: [],
      isLoading: false
    }
  }
  async componentDidMount() {
    const is_corporate_user = await AsyncStorage.getItem('is_corporate_user')
    if(is_corporate_user) {
        this.getEcardDetail()
    }
  }
  async getEcardDetail() {
    await this.setState({ isLoading: true })
    const userId = await AsyncStorage.getItem('userId');
    let fields = "corporate_user_id";
    let userResult = await fetchUserProfile(userId, fields);
    if (!userResult.error) {
      let corporateResult = await getCorporateEmployeeDetailsById(userResult.corporate_user_id);

      if (!!corporateResult) {
        let data = {
          PolicyNumber: corporateResult.policyNumber,
          EmployeeNumber: corporateResult.employeeId,
        }
        let result = await getCorporateUserEcardDetails(data);
        if (!!result && result.status === "True") {
          await this.setState({ EcardData: JSON.parse(result.result) })


        } else {
          toastMeassage('employee Details not found', 'dangers', 3000)
        }


      } else {
        toastMeassage('employee Details not found', 'dangers', 3000)
      }

    } else {
      toastMeassage('employee Details not found', 'dangers', 3000)
    }
    await this.setState({ isLoading: false })

  }

  employeeAndFamilyDetails(EcardData) {
    return (
      <Row style={{ marginTop: 10 }}>
        <Col size={4}>
          <Text style={styles.innerText}>Policy No</Text>
          <Text style={styles.innerText}>Member Code</Text>
          <Text style={styles.innerText}>Employee Code</Text>
        </Col>
        <Col size={0.5}>
          <Text style={styles.innerText}>:</Text>
          <Text style={styles.innerText}>:</Text>
          <Text style={styles.innerText}>:</Text>
        </Col>
        <Col size={5}>
          <Text style={[styles.innerText, { color: '#909498' }]}>{EcardData.PolicyNumber}</Text>
          <Text style={[styles.innerText, { color: '#909498' }]}>{EcardData.MemberId}</Text>
          <Text style={[styles.innerText, { color: '#909498' }]}>{EcardData.EmployeeCode}</Text>
        </Col>
      </Row>
    )
  }
  render() {
    const { EcardData } = this.state;
    console.log(JSON.stringify(EcardData))
    return (
      <ScrollView>
        {EcardData.length !=0?
        <View>
          <Text style={styles.titleText2}>E-Card Details..</Text>
          <ListItem avatar>
            <Left>
              <Icon name="info-circle" style={{ color: '#7E49C3', fontSize: 20 }} />
            </Left>
            <Body>
              <View testID="onPressUpdateContact">
                <Text style={styles.customText}>Policy Details</Text>
                {EcardData.find(ele => ele.Relation === 'EMPLOYEE') !== undefined ?
                  this.employeeAndFamilyDetails(EcardData.find(ele => ele.Relation === 'EMPLOYEE',)) : null}
              </View>
            </Body>
          </ListItem>
          <ListItem avatar>
            <Left>
              <MaterialIcons name="people" style={{ color: '#7E49C3', fontSize: 20 }} />
            </Left>
            <Body>
              <View testID="onPressUpdateContact">
                <Text style={styles.customText}>Family Members</Text>
                <FlatList
                  data={this.state.EcardData}
                  extraData={this.state}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) =>
                    item.Relation !== 'EMPLOYEE' ?
                      <Row style={{ marginTop: 10 }}>
                        <Col size={0.5}>
                          <Text style={styles.innerText}>{index}</Text>
                        </Col>
                        <Col size={4}>
                          <Text style={styles.innerText}>Policy No</Text>
                          <Text style={styles.innerText}>Member Code</Text>
                          <Text style={styles.innerText}>Member Name</Text>
                        </Col>
                        <Col size={0.5}>
                          <Text style={styles.innerText}>:</Text>
                          <Text style={styles.innerText}>:</Text>
                          <Text style={styles.innerText}>:</Text>
                        </Col>
                        <Col size={5.5}>
                          <Text style={[styles.innerText, { color: '#909498' }]}>{item.PolicyNumber}</Text>
                          <Text style={[styles.innerText, { color: '#909498' }]}>{item.MemberId}</Text>
                          <Text style={[styles.innerText, { color: '#909498' }]}>{item.MemberName}</Text>
                        </Col>
                      </Row> :
                      null}
                />
              </View>
            </Body>
          </ListItem>
          {/* <ListItem avatar>
          <Left>
            <FontAwesome name="shield" style={{ color: '#7E49C3', fontSize: 15 }} />
          </Left>

          <Body>
            <View testID="onPressUpdateContact">
              <Text style={styles.customText}>Policy Coverage Details</Text>
              <Row style={{ marginTop: 10 }}>
                <Col size={4}>
                  <Text style={styles.innerText}>UHID</Text>
                  <Text style={styles.innerText}>Policy Number</Text>
                  <Text style={styles.innerText}>Overall family St</Text>
                  <Text style={styles.innerText}>Overall family BSI</Text>
                  <Text style={styles.innerText}>Tele-Consult Utilized Count</Text>
                </Col>
                <Col size={0.5}>
                  <Text style={styles.innerText}>:</Text>
                  <Text style={styles.innerText}>:</Text>
                  <Text style={styles.innerText}>:</Text>
                  <Text style={styles.innerText}>:</Text>
                  <Text style={styles.innerText}>:</Text>
                </Col>
                <Col size={5.5}>
                  <Text style={[styles.innerText, { color: '#909498' }]}>4574873</Text>
                  <Text style={[styles.innerText, { color: '#909498' }]}>783559693758385838385</Text>
                  <Text style={[styles.innerText, { color: '#909498' }]}>2000000 Rs</Text>
                  <Text style={[styles.innerText, { color: '#909498' }]}>2000000 Rs</Text>
                  <Text style={[styles.innerText, { color: '#909498' }]}>2000000 Rs</Text>
                </Col>
              </Row>
            </View>
          </Body>
        </ListItem> */}
        </View>
        :null}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  customText: {
    fontSize: 15,
    fontFamily: 'OpenSans',
  },

  innerText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    marginTop: 5

  },
  titleText2: {
    fontSize: 15,
    padding: 5,
    margin: 10,
    borderRadius: 20,
    color: '#000',
    fontFamily: 'OpenSans',
    marginTop: 20,
    fontWeight: 'bold'
  },
});

export default EcardDetails;
