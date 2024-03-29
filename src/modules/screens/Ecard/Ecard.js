import React, {PureComponent} from 'react';
import {
  Text,
  Container,
  ListItem,
  List,
  Content,
  Row,
  Col,
  Card,
  CardItem,
  Body,
  Grid,
  Right,
  Icon,
  Left,
} from 'native-base';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
} from 'react-native';
import {
  getCorporateUserEcardDetails,
  getCorporateEmployeeDetailsById,
  getEcardLink,
  getPolicyDetailsByPolicyNo,
} from '../../providers/corporate/corporate.actions';
import {fetchUserProfile} from '../../providers/profile/profile.action';
import Spinner from '../../../components/Spinner';
import {toastMeassage,getMemberName} from '../../common';
import {connect} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {primaryColor} from '../../../setup/config';
import {translate} from '../../../setup/translator.helper';
import { formatDate } from '../../../setup/helpers';

import {CURRENT_APP_NAME} from '../../../setup/config';
class Ecard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,
      selectedIndex: -1,
    };
  }

  componentDidMount() {
    this.getEcardDetail();
  }
  async getEcardDetail() {
    await this.setState({isLoading: true});
    await this.setState({
      isLoading: false,
      data: this.props.profile.familyData || [],
    });
  }

  async open(data) {
    try {
      let policyResult = await getPolicyDetailsByPolicyNo(data.policyNo);
      if (policyResult && policyResult.TPA) {
        let requestObject = {
          payer_code: policyResult.TPA,
          policy_no: data.policyNo,
          member_id: data.memberId,
          first_name: data.familyMemberName,
        };
        let result = await getEcardLink(requestObject);
        if (result) {
          Linking.openURL(result);
        } else {
          toastMeassage('sorry unable  download', 'danger', 3000);
        }
      }
    } catch (e) {
      toastMeassage('sorry unable  download', 'danger', 3000);
    }
  }
  getInsuranceAddress(data) {
    let temp = '';
    if (data) {
      temp = `${data.address2},${data.address1}`;
    }

    return temp;
  }
  familyMemAgeCal = (value) => {
    try {
      if (value.familyMemberAge == 0 && value.familyMemberMonth <= 1)
        return value.familyMemberMonth + ' Month';
      else if (value.familyMemberAge == 0 &&value.familyMemberMonth > 1)
        return value.familyMemberMonth + ' Months';
      else if (value.familyMemberAge > 1)
        return value.familyMemberAge + ` Years `;
      else return value.familyMemberAge + ` Year`;
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  };
  toggleData(index) {
    if (this.state.selectedIndex === index) {
      this.setState({selectedIndex: -1});
    } else {
      this.setState({selectedIndex: index});
    }
  }
    employeeAndFamilyDetails(data, index) {
        
    
        const arrowIcon = this.state.selectedIndex === index ? "keyboard-arrow-up" : "keyboard-arrow-down"

        return (
            <View>
                <View>
                    <Card style={{ marginTop: 15 }}>

                        <CardItem >
                            <Body>
                                <Grid>
                                    <Col size={0.5}>
                                        <Text style={styles.mainText}>{index+1}.</Text>
                                    </Col>
                                    <Col size={4}>
                                        <Text style={styles.leftHeadingText}>{translate("Member Name")}</Text>
                                    </Col>
                                    <Col size={0.5}>
                                        <Text style={styles.leftHeadingText}>-</Text>
                                    </Col>
                                    <Col size={5}>
                                        <Text style={styles.mainText}>{getMemberName(data)}</Text>
                                    </Col>
                                </Grid>
                                <Grid style={{ marginTop: 8 }}>
                                    <Col size={0.5}>
                                    </Col>
                                    <Col size={4}>
                                        <Text style={styles.leftHeadingText}>{translate("Member Code")}</Text>
                                    </Col>
                                    <Col size={0.5}>
                                        <Text style={styles.leftHeadingText}>-</Text>
                                    </Col>
                                    <Col size={5}>
                                        <Text style={styles.mainText}>{data.memberId}</Text>
                                    </Col>
                                </Grid>
                                <Grid style={{ marginTop: 8 }}>
                                    <Col size={0.5}>
                                    </Col>
                                    <Col size={4}>
                                        <Text style={styles.leftHeadingText}>{translate("Gender")}</Text>
                                    </Col>
                                    <Col size={0.5}>
                                        <Text style={styles.leftHeadingText}>-</Text>
                                    </Col>
                                    <Col size={5}>
                                        <Text style={styles.mainText}>{data.familyMemberGender?data.familyMemberGender:'-'}</Text>
                                    </Col>
                                </Grid>
                                <Grid style={{ marginTop: 8 }}>
                                    <Col size={0.5}>
                                    </Col>
                                    <Col size={4}>
                                        <Text style={styles.leftHeadingText}>{translate("Age")}</Text>
                                    </Col>
                                    <Col size={0.5}>
                                        <Text style={styles.leftHeadingText}>-</Text>
                                    </Col>
                                    <Col size={5}>
                                        <Text style={styles.mainText}>{this.familyMemAgeCal(data)}</Text>
                                    </Col>
                                </Grid>
                                <Grid style={{ marginTop: 8 }}>
                                    <Col size={0.5}>
                                    </Col>
                                    <Col size={4}>
                                        <Text style={styles.leftHeadingText}>{translate("Relationship")}</Text>
                                    </Col>
                                    <Col size={0.5}>
                                        <Text style={styles.leftHeadingText}>-</Text>
                                    </Col>
                                    <Col size={5}>
                                        <Text style={styles.mainText}>{data.relationship?data.relationship:'-'}</Text>
                                    </Col>
                                </Grid>
                            </Body>
                        </CardItem>
                        <CardItem footer style={{ backgroundColor: primaryColor, height: 40, alignItems: 'center',
                               justifyContent: 'center', }}>
                                                       
                            <TouchableOpacity
                               onPress={() => this.open(data)}
                               style={{
                               marginTop: 10,
                               alignItems: 'center',
                               justifyContent: 'center',flexDirection:'row'
                            }}>
                             <Text style={[styles.linkHeader, { color: '#fff' }]}>Download</Text>
                             <MaterialIcons name="file-download" style={{ fontSize: 20, color: '#fff',marginBottom:5 }} />
                               </TouchableOpacity>
                           
                        </CardItem>
                    </Card>
                </View>
                
      </View>
    );
  }

  render() {
    const {data, isLoading} = this.state;
    return (
      <Container>
        <Content style={{padding: 15}}>
          {isLoading == true ? (
            <Spinner color="blue" visible={isLoading} overlayColor="none" />
          ) : !Array.isArray(data) || data.length === 0 ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 550,
              }}>
              <Text>{translate('No E-Card details found !')}</Text>
            </View>
          ) : (
            <View style={{marginBottom: 20}}>
              {/* { data && Array.isArray(data) && data.find(ele => ele.relationship === 'EMPLOYEE') !== undefined ?
                                <Text style={styles.familyHeader}>Employee Detail</Text>:null}
                                { data && Array.isArray(data) && data.find(ele => ele.relationship === 'EMPLOYEE') !== undefined ?
                                    this.employeeAndFamilyDetails(data.find(ele => ele.relationship === 'EMPLOYEE')) : null} */}
              <View>
                <Text style={styles.familyHeader}>
                  {translate('Members details')}
                </Text>
                <FlatList
                  data={this.state.data}
                  extraData={this.state}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) =>
                    this.employeeAndFamilyDetails(item, index)
                  }
                />
              </View>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

function ecardState(state) {
  return {
    profile: state.profile,
  };
}
export default connect(ecardState)(Ecard);

const styles = StyleSheet.create({
    colStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    linkHeader: {
        fontFamily: 'Roboto',
        fontSize: 16,
        textDecorationColor: '#2159d9',
        textDecorationLine: 'underline',
        color: '#000',
        marginBottom:10
    },
    headerText: {
        fontFamily: 'opensans-bold',
        fontSize: 11,
        color: '#0C0A96',
    },
    compName: {
        fontFamily: 'opensans-bold',
        fontSize: 11,
       
    },
    innerText: {
        fontFamily: 'Roboto',
        fontSize: 10,
        color: '#fff'
    },
    footerText: {
        fontFamily: 'opensans-bold',
        fontSize: 10,
    },
    footerDeatils: {
        fontFamily: 'Roboto',
        fontSize: 10
    },
    compDetails: {
        marginTop: 10,
        backgroundColor: '#f2f5f4',
        paddingBottom: 5,
        paddingTop: 5
    },
   
    familyHeader: {
        fontFamily: 'opensans-bold',
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
        paddingBottom: 10
    },
    addressText: {
        fontFamily: 'opensans-bold',
        fontSize: 10,
        textAlign: 'center',
    },
    mainText: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: '#000'
    },
    leftHeadingText:{
        fontFamily:'opensans-bold',
        fontSize:14,
        color:'#000'
    }
})
