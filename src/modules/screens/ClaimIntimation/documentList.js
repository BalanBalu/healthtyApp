import React, { PureComponent } from 'react';
import { FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Container, Content, Text, View, Card, Item } from 'native-base';
import { Col, Row, } from 'react-native-easy-grid';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './Styles'

import { TouchableOpacity } from 'react-native-gesture-handler';
import { ImageUpload } from '../../screens/commonScreen/imageUpload'
import { toastMeassage, RenderDocumentUpload } from '../../common'
import { uploadImage } from '../../providers/common/common.action'
import { serviceOfClaimIntimation, serviceOfUpdateClaimIntimation } from '../../providers/corporate/corporate.actions'
import ConfirmPopup from '../../shared/confirmPopup'
class DocumentList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectOptionPoopup: false,
      docsUpload: false,
      claimDetails: {},
      isLoading: false,
      uploadData: [],
      deletePopupVisible: false,
    }
  }

  componentDidMount() {
    let docsUpload = this.props.navigation.getParam('docsUpload') || false;
    let claimDetails = this.props.navigation.getParam('data') || null;
    let uploadData = this.props.navigation.getParam('uploadData') || [];
    this.setState({ docsUpload, claimDetails, uploadData })
  }

  imageUpload = async (data) => {
    this.setState({ selectOptionPoopup: false })
    if (data.image !== null) {
      await this.uploadImageToServer(data.image);
    }
  }

  uploadImageToServer = async (imagePath) => {
    try {
      let appendForm = "claimIntimation"
      let endPoint = 'images/upload?path=claimIntimation'
      const response = await uploadImage(imagePath, endPoint, appendForm)
      if (response.success) {
        this.uploadedData = [...this.state.uploadData, ...response.data]
        await this.setState({ uploadData: this.uploadedData })
        toastMeassage('image upload successfully', 'success', 3000)
      } else {
        toastMeassage('Problem Uploading Picture' + response.error, 'danger', 3000)
      }
    } catch (e) {
      toastMeassage('Problem Uploading Picture' + e, 'danger', 3000)
    }
  }

  onPressSubmitClaimData = async () => {
    try {
      this.setState({ isLoading: true })
      let claimIntimationReqData = {
        claimIntimationDocuments: this.state.uploadData,
        ...this.state.claimDetails
      }
      const claimUpdateResp = await serviceOfClaimIntimation(claimIntimationReqData);
      if (claimUpdateResp && claimUpdateResp.referenceNumber) {
        this.props.navigation.navigate('ClaimIntimationSuccess', { referenceNumber: claimUpdateResp.referenceNumber });
      }
      else if (claimUpdateResp && claimUpdateResp.success === false) {
        toastMeassage('Unable to Submit Claim Request')
      }
    } catch (error) {
      toastMeassage('Something Went Wrong' + error.message)
    }
    finally {
      this.setState({ isLoading: false })
    }
  }

  async deleteSelectedDocs(index) {
    await this.setState({ selectedDocsIndex4Delete: index, deletePopupVisible: true })
  }

  deleteDocs = async () => {
    try {
      let temp = this.state.uploadData;
      temp.splice(this.state.selectedDocsIndex4Delete, 1);
      await this.setState({ uploadData: this.state.uploadData });
      if (this.state.claimDetails._id) {
        let reqData = {
          claimIntimationDocuments: this.state.uploadData,
          _id: this.state.claimDetails._id
        }
       await serviceOfUpdateClaimIntimation(reqData);
      } else {
        toastMeassage('Something Went Wrong')
      }
    } catch (error) {
      toastMeassage('Something Went Wrong' + error.message)
    }
    finally {
      this.setState({ isLoading: false })
    }
  }
  
  render() {
    const { showCard, show, selectOptionPoopup, docsUpload, uploadData, isLoading } = this.state
    return (
      <Container>
        <Content>
          {docsUpload ?
            <Text style={styles.headerText}>Upload Your Document</Text> : null}
          {docsUpload ?
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <TouchableOpacity onPress={() => this.setState({ selectOptionPoopup: true })}>
                <Image
                  source={require('../../../../assets/images/documentCloud.png')}
                  style={{ height: 60, width: 110 }}
                />
              </TouchableOpacity>
            </View> : null}
          {
            selectOptionPoopup ?
              <ImageUpload
                popupVisible={(data) => this.imageUpload(data)}
              /> : null
          }

          {uploadData && uploadData.length != 0 ?
            <FlatList
              data={uploadData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) =>
                <View>
                  <Card style={styles.cardStyles}>
                    <Row>
                      <Col style={{ width: '10%' }}>
                        <Image source={RenderDocumentUpload(item)} style={{ width: 25, height: 25 }} />
                      </Col>
                      <Col style={{ width: '70%' }}>
                        <Text style={styles.innerCardText}>{item.original_file_name}</Text>
                      </Col>
                      {!docsUpload ?
                        <Col style={{ width: '10%' }}>
                          <TouchableOpacity style={{ alignItems: 'center', marginTop: 5 }}>
                            <MaterialIcons name="file-download" style={{ fontSize: 20, color: 'red' }} />
                          </TouchableOpacity>
                        </Col> : null}
                      {!docsUpload ?
                        <Col style={{ width: '10%' }}>
                          <TouchableOpacity onPress={() => this.deleteSelectedDocs(index)} style={{ alignItems: 'center', marginTop: 5 }}>
                            <EvilIcons name="trash" style={{ fontSize: 20, color: 'red' }} />
                          </TouchableOpacity>
                        </Col> : null}
                    </Row>
                  </Card>
                </View>
              } /> :
            !docsUpload ?
              <Item style={{ borderBottomWidth: 0, marginTop: 100, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }} > Document list not found!</Text>
              </Item> : null
          }
          <ConfirmPopup
            warningMessageText={'Are you sure you want to delete !'}
            confirmButtonText={'Confirm'}
            confirmButtonStyle={styles.confirmButton}
            cancelButtonStyle={styles.cancelButton}
            cancelButtonText={'Cancel'}
            confirmButtonAction={() => {
              this.deleteDocs();
              this.setState({ deletePopupVisible: false })
            }}
            cancelButtonAction={() => this.setState({ deletePopupVisible: !this.state.deletePopupVisible })}
            visible={this.state.deletePopupVisible} />
          {isLoading ?
            <View style={{ marginTop: 40 }}>
              <ActivityIndicator
                animating={isLoading}
                size="large"
                color='blue'
              />
            </View>
            :
            docsUpload && (uploadData && uploadData.length != 0) ?
              <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 20, marginBottom: 20 }}>
                <Col size={4}>
                  <View style={{ display: 'flex' }}>
                    <View
                      style={{
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity onPress={() => this.onPressSubmitClaimData()} style={styles.appButtonContainer}>
                        <Text style={styles.appButtonText}>CONTINUE</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Col>
              </Row> : null
          }
        </Content>
      </Container>
    )
  }
}

export default DocumentList

