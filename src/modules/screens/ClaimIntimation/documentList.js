import React, { PureComponent } from 'react';
import { FlatList, StyleSheet, Image, ActivityIndicator,PermissionsAndroid,ToastAndroid } from 'react-native';
import { Container, Content, Text, View, Card, Item } from 'native-base';
import { Col, Row, } from 'react-native-easy-grid';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './Styles'
import RNFetchBlob from 'rn-fetch-blob';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ImageUpload } from '../../screens/commonScreen/imageUpload'
import { toastMeassage, RenderDocumentUpload } from '../../common'
import { uploadImage } from '../../providers/common/common.action'
import { serviceOfClaimIntimation, serviceOfUpdateClaimIntimation,serviceOfUpdatePreAuthDocs } from '../../providers/corporate/corporate.actions'
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
      deletePopupVisible: false,
    }
  }

  componentDidMount() {
    let docsUpload = this.props.navigation.getParam('docsUpload') || false;
    let preAuthData = this.props.navigation.getParam('preAuthData') || false;
    let data = this.props.navigation.getParam('data') || null;
    let uploadData = this.props.navigation.getParam('uploadData') || [];
    this.setState({ docsUpload, data, uploadData,preAuthData })
  }

  imageUpload = async (data) => {
    this.setState({ selectOptionPoopup: false })
    if (data.image !== null) {
      await this.uploadImageToServer(data.image);
    }
  }

  uploadImageToServer = async (imagePath) => {
    try {
      this.setState({ isLoading: true })
      let appendForm,endPoint;
      if(this.state.preAuthData){
        appendForm = "preAuth"
        endPoint = 'images/upload?path=preAuth'
  
      }else{
      appendForm = "claimIntimation"
      endPoint = 'images/upload?path=claimIntimation'
      }
      const response = await uploadImage(imagePath, endPoint, appendForm)
      if (response.success) {
        this.uploadedData = [...this.state.uploadData, ...response.data]
        await this.setState({ uploadData: this.uploadedData })
        toastMeassage('Image upload successfully', 'success', 3000)
      } else {
        toastMeassage('Problem Uploading Picture' + response.error, 'danger', 3000)
      }
    } catch (e) {
      toastMeassage('Problem Uploading Picture' + e, 'danger', 3000)
    }
    finally {
      this.setState({ isLoading: false })
    }
  }
  onPressSubmitPreAuthData= async () => {
    this.props.navigation.navigate('PreAuth', { currentForm: 3,uploadDocs:this.state.uploadData });

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
      let reqData;
      temp.splice(this.state.selectedDocsIndex4Delete, 1);
      await this.setState({ uploadData: this.state.uploadData });
      if (this.state.data._id) {
        if(this.state.preAuthData){
          reqData = {
            patientProof: this.state.uploadData,
            _id: this.state.data._id
          }
        let re= await serviceOfUpdatePreAuthDocs(reqData);
        }else{
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
  actualDownload = (imageUrl,fileName) => {
  
  const { dirs } = RNFetchBlob.fs;
  RNFetchBlob.config({
    fileCache: true,
    addAndroidDownloads: {
    useDownloadManager: true,
    notification: true,
    mediaScannable: true,
    title: fileName,
    path: `${dirs.DownloadDir}`+`/`+fileName,
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

  async downloadFile(imageUrl,fileName) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to memory to download the file ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.actualDownload(imageUrl,fileName);
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
  renderDocumentList(item,index){
    const { docsUpload } = this.state;
        return (
            <RenderDocumentList
                item={item}
                docsUpload={docsUpload}
                deleteSelectedDocs={(index) => this.deleteSelectedDocs(index)}
                downloadFile={(imageUrl,fileName)=>this.downloadFile(imageUrl,fileName)}
            >
            </RenderDocumentList>
        )
  }
  render() {
    const { showCard, show, selectOptionPoopup, docsUpload, uploadData, isLoading,preAuthData } = this.state

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
          {isLoading ?
            <View style={{ marginTop: 40 }}>
              <ActivityIndicator
                animating={isLoading}
                size="large"
                color='blue'
              />
            </View>
            :null}
            {docsUpload && (uploadData && uploadData.length != 0)&&!preAuthData ?
              <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 20, marginBottom: 20 }}>
                <Col size={4}>
                  <View style={{ display: 'flex' }}>
                    <View
                      style={{
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity onPress={() => this.onPressSubmitClaimData()} style={styles.appButtonContainer}>
                        <Text style={styles.appButtonText}>SUBMIT</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Col>
              </Row> :docsUpload && (uploadData && uploadData.length != 0) && preAuthData?<Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 20, marginBottom: 20 }}>
                <Col size={4}>
                  <View style={{ display: 'flex' }}>
                    <View
                      style={{
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity onPress={() => this.onPressSubmitPreAuthData()} style={styles.appButtonContainer}>
                        <Text style={styles.appButtonText}>Next</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Col>
              </Row>:null
          }
        </Content>
      </Container>
    )
  }
}

export default DocumentList

