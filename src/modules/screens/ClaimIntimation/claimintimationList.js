import React, {PureComponent} from 'react';
import {FlatList, StyleSheet,PermissionsAndroid,Alert} from 'react-native';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Container, Content, Text, Left, Item, View, Card} from 'native-base';
import {Col, Row} from 'react-native-easy-grid';
import RNFetchBlob from 'rn-fetch-blob';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getClaimIntimationWithPagination } from '../../providers/corporate/corporate.actions';
import { log } from 'react-native-reanimated';
import { primaryColor } from '../../../setup/config';
import { Loader } from '../../../components/ContentLoader';
import {translate} from '../../../setup/translator.helper'
import {ClaimInitiationDrawing} from '../../screens/Home/corporateHome/svgDrawings';
// import { toastMeassage } from '../../common'
// import { REIMBURSEMENT_FORMS } from '../../screens/VideoConsulation/constants';
const LIMIT = 10;

class ClaimIntimationList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCard: -1,
      show: true,
      claimList: [],
      isLoading: false
    };
    this.pagination = 1;
    this.memberTpaCode = props.profile && props.profile.memberTpaInfo && props.profile.memberTpaInfo.tpaCode || null;

  }
  componentDidMount() {
    this.getClaimIntimationDetails();
  }
  getClaimIntimationDetails = async () => {
    try {
      this.setState({ isLoading: true });
      let searchText = null;
      let memberPolicyNo = await AsyncStorage.getItem('memberPolicyNo');
      let employeeId = await AsyncStorage.getItem('employeeCode');
      let result = await getClaimIntimationWithPagination(
        searchText,
        employeeId,
        memberPolicyNo,
        this.pagination,
        LIMIT,
      );
      if (result) {
        await this.setState({ claimList: result.docs });
      }
    } catch (ex) {
      console.log(ex);
    }
    finally {
      this.setState({ isLoading: false });
    }
  };

  toggleData(index, typeOfArrowIcon) {
    const { showCard, show } = this.state;
    if (typeOfArrowIcon === 'DOWN') {
      this.setState({ showCard: index, show: !this.state.show });
    } else {
      this.setState({ showCard: -1, show: null });
    }
  }

//   async onPressDownLoadForm() {
//     try {

// //       const file ='./reimbursement-claim-form.pdf' ; // this is your file name
// // const dest = `${RNFS.DocumentDirectoryPath}/reimbursement-claim-form.pdf`;
// // RNFS.copyFileAssets(file, dest)
// // .then(() => FileViewer.open(dest))
// // .then(() => {
// //   console.log('SUCCESS')
// //   // toastMeassage('success','success',3000)
// //    // success
// // })
// // .catch(Ex => {
// //   console.log('Ex is getting on download forms===>',Ex);
// // });


//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'Storage Permission',
//           message: 'App needs access to memory to download the file ',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         // this.actualDownload(path, fileName);
//       } else {
//         Alert.alert(
//           'Permission Denied!',
//           'You need to give storage permission to download the file',
//         );
//         return 
//       }

//       const fileName=" Claim_Submission_Form.pdf";
//       const forms = REIMBURSEMENT_FORMS.filter(form => form.tpaCode === this.memberTpaCode);
//       if (forms && forms.length > 0) {
//         var path=forms[0].path;
//       } else {
//         toastMeassage('Form not available to download. Please contact your HR.', 'danger', 2000);
//         return 
//       }
//   //  await   this.actualDownload()
//     } catch (err) {
//       console.log(err);
//     }
//   }
  // actualDownload = (path, fileName) => {

  //   const { dirs } = RNFetchBlob.fs;
  //   RNFetchBlob.config({
  //     fileCache: true,
  //     addAndroidDownloads: {
  //       useDownloadManager: true,
  //       notification: true,
  //       mediaScannable: true,
  //       title: fileName,
  //       path: '../../../../assets/forms/re-imbursment/mediassist/reimbursement-claim-form.pdf',
  //     },
  //   })
  //     .fetch('GET', '../../../../assets/forms/re-imbursment/mediassist/reimbursement-claim-form.pdf', {})
  //     .then((res) => {
  //       toastMeassage('Your file has been downloaded to downloads folder!', 'success', 1000)
  //       console.log('The file saved to ', res.path());
  //     })
  //     .catch((e) => {
  //       console.log(e)
  //     });
  // };

  render() {
    const { showCard, show, claimList, isLoading } = this.state;

    return (
      <Container>
        <Content>
        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 15, marginRight: '5%' }}>
          <TouchableOpacity style={{ flexDirection: 'row', borderColor: primaryColor, borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 3 }} onPress={() => this.props.navigation.navigate('FamilyInfoList', { navigationPage: 'ClaimIntimationSubmission' })}>
            <MaterialIcons name="add" style={{ color: primaryColor, fontSize: 20 }} />
            <Text style={{ fontFamily: 'Roboto', fontSize: 15, color: primaryColor }}>{translate("Add New")}</Text>
          </TouchableOpacity>
        </View>
          {/* <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 15,
            }}>
              <Row style={{padding: 3}}>
              <Col size={5} style={{ flexDirection: 'row' ,marginLeft:15}}>
            <Card style={{borderRadius: 20}}>
              <TouchableOpacity
                style={{
                  height:31,
                  backgroundColor: primaryColor,
                  flexDirection: 'row',
                  paddingHorizontal: 30,
                  borderRadius: 10,
                  paddingVertical: 3,
                }}
                onPress={() => {
                  this.props.navigation.navigate('FamilyInfoList', {
                    navigationPage: 'ClaimIntimationSubmission',
                  });
                }}>
                <MaterialIcons
                  name="add"
                  style={{fontSize: 20, color: "#FFFFFF"}}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'opensans-bold',
                    color: "#FFFFFF",
                  }}>
                  {translate("Add New")}
                </Text>
              </TouchableOpacity>
            </Card>
            </Col>
            <Col size={5} style={{ flexDirection: 'row' ,marginLeft:30}}>
            <Card style={{borderRadius: 20}}>
              <TouchableOpacity
                style={{
                  height:31,
                  backgroundColor: primaryColor,
                  flexDirection: 'row',
                  paddingHorizontal: 30,
                  borderRadius: 10,
                  // borderColor: "#FFFFFF",
                  // borderWidth: 1,
                  paddingVertical: 3,
                }}
                onPress={() => this.onPressDownLoadForm()}>
            <MaterialIcons
                  name="file-download"
                  style={{fontSize: 20, color: "#FFFFFF"}}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'opensans-bold',
                    color: "#FFFFFF",
                  }}>
                 {"Download"}
                </Text>
              </TouchableOpacity>
            </Card>
            </Col>
            </Row>
          </View> */}
          {isLoading ? (
            <Loader style="newList" />
          ) : claimList&&claimList.length ? (
            <FlatList
              data={claimList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View>
                  {this.state.showCard === index && !this.state.show ? (
                    <View>
                      <Card style={styles.cardStyles}>
                        <Row style={styles.gradientStyle}>
                          <Col size={9}>
                            <Text style={{ fontSize: 18, color: '#fff' }}>
                              {item.employeeName}
                            </Text>
                          </Col>
                          <Col size={0.8}>
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
                        <View style={styles.mainView}>
                          <Row style={{ marginTop: 5 }}>
                            <Col size={4}>
                              <Text style={styles.subHeadingStyle}>
                                {translate("Member Code")}
                              </Text>
                            </Col>
                            <Col size={0.5}>
                              <Text style={{ marginTop: 2 }}>:</Text>
                            </Col>
                            <Col size={6.5}>
                              <Text style={styles.subHeadingData}>
                                {item.memberId}
                              </Text>
                            </Col>
                          </Row>
                          {/* <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>MAID</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.MAID}</Text>
                          </Col>

                        </Row> */}
                          <Row style={{ marginTop: 5 }}>
                            <Col size={4}>
                              <Text style={styles.subHeadingStyle}>
                                {translate("Claim By")}
                              </Text>
                            </Col>
                            <Col size={0.5}>
                              <Text style={{ marginTop: 2 }}>:</Text>
                            </Col>
                            <Col size={6.5}>
                              <Text style={styles.subHeadingData}>
                                {item.relationship ? item.relationship : `-`}
                              </Text>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: 5 }}>
                            <Col size={4}>
                              <Text style={styles.subHeadingStyle}>{translate("Status")}</Text>
                            </Col>
                            <Col size={0.5}>
                              <Text style={{ marginTop: 2 }}>:</Text>
                            </Col>
                            <Col size={6.5}>
                              <Text style={styles.subHeadingData}>
                                {item.status}
                              </Text>
                            </Col>
                          </Row>
                          {/* <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Claim Amount</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.ClaimAmount}</Text>
                          </Col>
                        </Row> */}
                          <Row style={{ marginTop: 5 }}>
                            <Col size={4}>
                              <Text style={styles.subHeadingStyle}>
                                {translate("Hospital")}
                              </Text>
                            </Col>
                            <Col size={0.5}>
                              <Text style={{ marginTop: 2 }}>:</Text>
                            </Col>
                            <Col size={6.5}>
                              <Text style={styles.subHeadingData}>
                                {item.hospitalName}
                              </Text>
                            </Col>
                          </Row>
                          <View style={{ justifyContent: "flex-end", alignItems: 'flex-end', marginTop: 10, marginBottom: 5 }}>
                            <TouchableOpacity style={{ backgroundColor: primaryColor, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }} onPress={() => { this.props.navigation.navigate('SubmitClaim',{claimListData:item}) }}>
                              <Text style={{ color: "#fff" }}>Create Claim</Text>
                            </TouchableOpacity>
                          </View>
                          {/* <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Hospital Address</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.address}</Text>
                          </Col>
                        </Row> */}
                        </View>
                        {/* <View style={styles.subView}>
                          <Row
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Left>
                              <TouchableOpacity
                                style={styles.ecardButton}
                                onPress={() =>
                                  this.props.navigation.navigate(
                                    'DocumentList',
                                    {
                                      uploadData: item.claimIntimationDocuments,
                                      data: item,
                                    },
                                  )
                                }>
                                <Text style={styles.linkHeader}>
                                  {translate("View Document")}
                                </Text>
                              </TouchableOpacity>
                            </Left> */}
                        {/* <Right>
                            <TouchableOpacity style={styles.ecardButton} onPress={() => this.props.navigation.navigate("DocumentList", { docsUpload: true,data: item })}>
                              <Text style={styles.linkHeader}>Upload Document</Text>
                            </TouchableOpacity>
                          </Right> */}
                        {/* </Row>
                        </View> */}
                      </Card>
                    </View>
                  ) : (
                    <View>
                      <TouchableOpacity
                        onPress={() => this.toggleData(index, 'DOWN')}>
                        <Card style={styles.cardStyle}>
                          <Row>
                            <Col size={9}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontFamily: 'opensans-bold',
                                  color: primaryColor,
                                }}
                                numberOfLines={1}
                                ellipsizeMode="tail">
                                {item.employeeName}
                              </Text>
                              <Row>
                                <Col size={3.5}>
                                  <Text
                                    style={{
                                      fontFamily: 'Roboto',
                                      fontSize: 16,
                                      color: '#909090',
                                      marginTop: 5,
                                    }}
                                    ellipsizeMode="tail">
                                    {translate("Member Code")}
                                  </Text>
                                </Col>
                                <Col size={0.5}>
                                  <Text style={{ marginTop: 5 }}>:</Text>
                                </Col>
                                <Col size={6}>
                                  <Text
                                    style={styles.subHeadingData}
                                    numberOfLines={1}
                                    ellipsizeMode="tail">
                                    {item.memberId}
                                  </Text>
                                </Col>
                              </Row>
                              {/* <Text style={styles.subHeadingData}
                              numberOfLines={1}
                              ellipsizeMode="tail">{item.address}</Text> */}
                            </Col>

                            <Col size={0.8} style={{ justifyContent: 'center' }}>
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
                        </Card>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            />
          ) : (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 250
              }}>
              <ClaimInitiationDrawing />
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: 15,
                  marginTop: "10%",
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}>
               {translate('No claim intimation list found!')} 
              </Text>
              <View style={{ borderTopWidth: 3, width: 55, transform: [{ rotate: '120 deg' }], position: 'absolute', borderTopColor: primaryColor, bottom: 85 }} />
            </View>
          )}
        </Content>
      </Container>
    );
  }
}




const ClaimIntimationListState = ({  profile } = state) => ({ profile })
export default connect(ClaimIntimationListState)(ClaimIntimationList)



const styles = StyleSheet.create({
  gradientStyle: {
    justifyContent: 'center',
    backgroundColor: primaryColor,
    padding: 8,
  },
  cardStyle: {
    marginRight: 15,
    marginLeft: 15,
    padding: 10,
    marginTop: 10,
  },
  subHeadingStyle: {
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'Roboto',
    color: '#909090',
  },
  subHeadingData: {
    fontSize: 15,
    color: '#000',
    marginTop: 5,
    fontFamily: 'Roboto',
  },
  cardStyles: {
    marginTop: 15,
    marginRight: 15,
    marginLeft: 15,
    borderRadius: 5,
  },
  ecardButton: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkHeader: {
    fontFamily: 'Roboto',
    fontSize: 15,
    textDecorationColor: primaryColor,
    textDecorationLine: 'underline',
    color: primaryColor,
  },
  mainView: {
    marginLeft: 10,
    marginRight: 10,
    borderBottomColor: '#909090',
    borderBottomWidth: 0.5,
    paddingBottom: 5,
  },
  subView: {
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
  },
});
