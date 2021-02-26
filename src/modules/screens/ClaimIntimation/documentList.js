import React, { PureComponent } from 'react';
import { FlatList, Image, ActivityIndicator, PermissionsAndroid, ToastAndroid } from 'react-native';
import { Container, Content, Text, View, Item, Footer, Button } from 'native-base';
import { Col, Row, } from 'react-native-easy-grid';
import styles from './Styles'
import RNFetchBlob from 'rn-fetch-blob';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ImageUpload } from '../../screens/commonScreen/imageUpload'
import { toastMeassage } from '../../common'
import { uploadImage } from '../../providers/common/common.action'
import { serviceOfClaimIntimation, serviceOfUpdateClaimIntimation, serviceOfUpdatePreAuthDocs, serviceOfSubmitPreAuthReq } from '../../providers/corporate/corporate.actions'
import ConfirmPopup from '../../shared/confirmPopup'
import RenderDocumentList from './renderDocumentList'
class DocumentList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectOptionPoopup: false,
      docsUpload: false,
      data: {},
      isLoading: false,
      uploadData: [],
      isLoadingUploadDocs: false,
      deletePopupVisible: false,
    }
    this.preAuthReqData = props.navigation.getParam('preAuthReqData') || null;
    this.isFromPreAuthReq = this.props.navigation.getParam('isFromPreAuthReq') || false;


  }

  componentDidMount() {
    let docsUpload = this.props.navigation.getParam('docsUpload') || false;
    let familyDocs = this.props.navigation.getParam('familyDocs') || false;
    let data = this.props.navigation.getParam('data') || null;
    let uploadData = this.props.navigation.getParam('uploadData') || [];
    this.setState({ docsUpload, data, uploadData,familyDocs })
  }

  imageUpload = async (data) => {
    this.setState({ selectOptionPoopup: false })
    if (data.image !== null) {
      await this.uploadImageToServer(data.image);
    }
  }

  uploadImageToServer = async (imagePath) => {
    try {
      this.setState({ isLoadingUploadDocs: true })
      let appendForm, endPoint;
      if (this.isFromPreAuthReq) {
        appendForm = "preAuth"
        endPoint = 'images/upload?path=preAuth'

      } else {
        appendForm = "claimIntimation"
        endPoint = 'images/upload?path=claimIntimation'
      }
      const response = await uploadImage(imagePath, endPoint, appendForm)
      if (response.success) {
        this.uploadedData = [...this.state.uploadData, ...response.data]
        await this.setState({ uploadData: this.uploadedData })
        toastMeassage('Image upload successfully', 'success', 1000)
      } else {
        toastMeassage('Problem Uploading Picture' + response.error, 'danger', 3000)
      }
    } catch (e) {
      toastMeassage('Problem Uploading Picture' + e, 'danger', 3000)
    }
    finally {
      this.setState({ isLoadingUploadDocs: false })
    }
  }

  onPressSubmitClaimData = async () => {
    try {
      this.setState({ isLoading: true })
      let claimIntimationReqData = {
        claimIntimationDocuments: this.state.uploadData,
        ...this.state.data
      }
      const claimUpdateResp = await serviceOfClaimIntimation(claimIntimationReqData);
      if (claimUpdateResp && claimUpdateResp.referenceNumber) {
        this.props.navigation.navigate('ClaimIntimationSuccess', { referenceNumber: claimUpdateResp.referenceNumber, successMsg: 'Your Claim Intimation request is being processed, will be notified on successful completion, your app reference id is' });
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


  onPressSubmitPreAuthData = async () => {
    try {
      this.setState({ isLoading: true })
      const preAuthReqData = this.preAuthReqData;
      if (this.state.uploadData && this.state.uploadData.length && preAuthReqData) {
        preAuthReqData.patientProof = this.state.uploadData;
      }
      const preAuthUpdateResp = await serviceOfSubmitPreAuthReq(preAuthReqData);
      if (preAuthUpdateResp && preAuthUpdateResp.referenceNumber) {
        this.props.navigation.navigate('ClaimIntimationSuccess', { successMsg: `Your pre-auth request is successfully sent to the hospital. Kindly contact hospital for further process.` });
      }
      else if (preAuthUpdateResp && preAuthUpdateResp.success === false) {
        toastMeassage('Unable to Submit PreAuth Request')
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
      let reqData;
      temp.splice(this.state.selectedDocsIndex4Delete, 1);
      await this.setState({ uploadData: this.state.uploadData });
      if (this.state.data._id) {
        if (this.isFromPreAuthReq) {
          reqData = {
            patientProof: this.state.uploadData,
            _id: this.state.data._id
          }
          let re = await serviceOfUpdatePreAuthDocs(reqData);
        } else {
          reqData = {
            claimIntimationDocuments: this.state.uploadData,
            _id: this.state.data._id
          }
          await serviceOfUpdateClaimIntimation(reqData);
        }
        toastMeassage('Image deleted successfully', 'success', 3000)
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
  actualDownload = (imageUrl, fileName) => {

    const { dirs } = RNFetchBlob.fs;
    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: fileName,
        path: `${dirs.DownloadDir}` + `/` + fileName,
      },
    })
      .fetch('GET', imageUrl, {})
      .then((res) => {
        toastMeassage('Your file has been downloaded to downloads folder!')
        console.log('The file saved to ', res.path());
      })
      .catch((e) => {
        console.log(e)
      });
  };

  async downloadFile(imageUrl, fileName) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to memory to download the file ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.actualDownload(imageUrl, fileName);
      } else {
        Alert.alert(
          'Permission Denied!',
          'You need to give storage permission to download the file',
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  renderDocumentList(item, index) {
    const { docsUpload,familyDocs } = this.state;
    return (
      <RenderDocumentList
        item={item}
        docsUpload={docsUpload}
        familyDocs={familyDocs}
        deleteSelectedDocs={(index) => this.deleteSelectedDocs(index)}
        downloadFile={(imageUrl, fileName) => this.downloadFile(imageUrl, fileName)}
      >
      </RenderDocumentList>
    )
  }


  onPressSubmitOrUpload = async () => {
    const { uploadData } = this.state;
    if (uploadData && uploadData.length) {
      this.isFromPreAuthReq ? this.onPressSubmitPreAuthData() : this.onPressSubmitClaimData();
    }
    else {
      this.setState({ selectOptionPoopup: true })
    }
  }
  render() {
    const { showCard, show, selectOptionPoopup, docsUpload, uploadData, isLoading, isLoadingUploadDocs } = this.state

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

          {isLoadingUploadDocs ?
            <View >
              <ActivityIndicator
                style={{ marginTop: 50 }}
                animating={isLoadingUploadDocs}
                size="large"
                color='#128283'
              />
            </View>
            :
            uploadData && uploadData.length != 0 ?
              <FlatList
                data={uploadData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>

                  this.renderDocumentList(item, index)
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

        </Content>
        {isLoading ?
          <View style={{ marginBottom: 20 }}>
            <ActivityIndicator
              animating={isLoading}
              size="large"
              color='#128283'
            />
          </View>
          :
          docsUpload ?
            <Footer style={{ backgroundColor: '#fff' }}>
              <Row >
                <Col style={{ marginRight: 40 }} >
                  <Button success style={{ backgroundColor: '#128283', borderColor: '#128283', borderRadius: 10, marginLeft: 45, height: 45, justifyContent: 'center' }}
                    onPress={() => this.onPressSubmitOrUpload()}
                    testID='clickButtonToPaymentReviewPage'>
                    <Row style={{ justifyContent: 'center' }}>
                      <Text style={styles.appButtonText}>{uploadData && uploadData.length ? 'SUBMIT' : 'Upload Document'}</Text>
                    </Row>
                  </Button>
                </Col>
              </Row>
            </Footer>
            : null}
      </Container>
    )
  }
}

export default DocumentList

