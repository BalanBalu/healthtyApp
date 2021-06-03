import React, { PureComponent } from 'react';
import { Text, View, Item, Input, Icon } from 'native-base';
import { TouchableOpacity, FlatList, PermissionsAndroid } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import styles from '../Styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { UploadClaimSubmission } from './uploadClaimSubmission';
import { toastMeassage, acceptNumbersOnly } from '../../../common';
import { uploadImage } from '../../../providers/common/common.action';
import {
  updateClaimSubmission,
  getClaimSubmissionById,
  createClaimSubmission,
  getListByTpaCode,
} from '../../../providers/corporate/corporate.actions';
import RNFetchBlob from 'rn-fetch-blob';
import ModalPopup from '../../../../components/Shared/ModalPopup';

class AttachmentDetails extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      selectOptionPopup: false,
      uploadData: null,
      isLoadingUploadDocs: false,
      remark: '',
      fileName: '',
      claimSubmissionAttachments: [],
      refreshCount: 1,
      isModalVisible: false,
      errorMsg: '',
      updateId: this.props.updateId || null,
      isModalVisible: false,

    };
  }

  imageUpload = async (data) => {
    this.setState({ selectOptionPopup: false });
    if (data.image !== null) {
      await this.uploadImageToServer(data.image);
    }
  };

  uploadImageToServer = async (imagePath) => {
    try {

      this.setState({ isLoadingUploadDocs: true });
      let appendForm = 'action';
      let endPoint = 'images/upload?path=action';
      const response = await uploadImage(imagePath, endPoint, appendForm);
      if (response.success) {
        await this.setState({ uploadData: response.data[0] });
        toastMeassage('Image upload successfully', 'success', 1000);
      } else {
        toastMeassage(
          'Problem Uploading Picture' + response.error,
          'danger',
          3000,
        );
      }
    } catch (e) {
      toastMeassage('Problem Uploading Picture' + e, 'danger', 3000);
    } finally {
      this.setState({ isLoadingUploadDocs: false });
    }
  };

  addTable = async () => {
    const {
      remark,
      fileName,
      fileDetail,
    } = this.state;

    if (fileName === '') {
      this.setState({
        errorMsg: 'Please enter fileName',
        isModalVisible: true,
      });
      return false;
    }
    if (remark === '') {
      this.setState({
        errorMsg: 'Please enter remark',
        isModalVisible: true,
      });
      return false;
    }
    if (fileDetail && fileDetail.length == 0) {
      this.setState({
        errorMsg: 'Please choose file',
        isModalVisible: true,
      });
      return false;
    }

    let temp = [];
    temp.push({
      remark: this.state.remark,
      fileName: this.state.fileName,
      fileDetail: this.state.uploadData,
    });
    let data = [...this.state.claimSubmissionAttachments, ...temp];
    this.setState({
      claimSubmissionAttachments: data,
      refreshCount: this.state.refreshCount + 1,
      remark: '',
      fileName: '',
      uploadData: null,
    });
  };

  deleteAttachment = async (item, index) => {
    let temp = this.state.claimSubmissionAttachments;
    await temp.splice(index, 1);
    await this.setState({ claimSubmissionAttachments: temp, refreshCount: this.state.refreshCount + 1, });
  };

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
        toastMeassage('Your file has been downloaded to downloads folder!');
        console.log('The file saved to ', res.path());
      })
      .catch((e) => {
        console.log(e);
      });
  };

  downloadAttachment = async (imageURL, file_name) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to memory to download the file ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.actualDownload(imageURL, file_name);
      } else {
        Alert.alert(
          'Permission Denied!',
          'You need to give storage permission to download the file',
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { updateAttachment } = this.props
    return (
      <View>
        <View style={styles.ButtonView}>
          <Row
            size={4}
            style={{
              marginLeft: 20,
              marginRight: 20,
              marginTop: 10,
            }}>
            <Col size={1}>
              <Text style={styles.text}>
                File Name<Text style={{ color: 'red' }}>*</Text>
              </Text>

              <Item regular style={{ borderRadius: 6, height: 35 }}>
                <Input
                  placeholder="Enter File Name"
                  placeholderTextColor={'#CDD0D9'}
                  style={styles.fontColorOfInput}
                  returnKeyType={'next'}
                  value={this.state.fileName}
                  keyboardType={'default'}
                  onChangeText={(text) => this.setState({ fileName: text })}
                />
              </Item>
            </Col>
          </Row>
          <Row
            size={4}
            style={{
              marginLeft: 20,
              marginRight: 20,
              marginTop: 10,
            }}>
            <Col size={1}>
              <Text style={styles.text}>
                Remarks<Text style={{ color: 'red' }}>*</Text>
              </Text>

              <Item regular style={{ borderRadius: 6, height: 35 }}>
                <Input
                  placeholder="Enter Remarks"
                  placeholderTextColor={'#CDD0D9'}
                  style={styles.fontColorOfInput}
                  returnKeyType={'next'}
                  value={this.state.remark}
                  keyboardType={'default'}
                  onChangeText={(text) => this.setState({ remark: text })}
                />
              </Item>
            </Col>
          </Row>
          <View>
            <Text
              style={{
                marginLeft: 15,
                fontSize: 16,
                marginTop: 10,
              }}>
              Upload Files/Reports/ID Details(Scanned PDF and JPG files) (Max
              Upload Size: 7168K)
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#E5E5E5',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
            }}
            onPress={() => this.setState({ selectOptionPopup: true })}>
            <Text>Choose File</Text>
          </TouchableOpacity>
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={styles.submit_ButtonStyle}
              onPress={() => this.addTable()}>
              <Text style={{ color: '#fff' }}>Add</Text>
            </TouchableOpacity>
          </View>
          {this.state.claimSubmissionAttachments ? (
            <FlatList
              data={this.state.claimSubmissionAttachments}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    padding: 10,
                    marginTop: 10,
                    marginBottom: 20,
                    width: '90%',
                  }}>
                  <View style={styles.form_field_view}>
                    <Text style={[styles.form_field_inline_label]}>SL No</Text>
                    <Text
                      style={[
                        styles.form_field,
                        { paddingTop: 15, paddingLeft: 10 },
                      ]}>
                      {index + 1}
                    </Text>
                  </View>
                  <View style={styles.form_field_view}>
                    <Text style={[styles.form_field_inline_label]}>
                      File Name
                    </Text>
                    <Text
                      style={[
                        styles.form_field,
                        { paddingTop: 15, paddingLeft: 10 },
                      ]}>
                      {item.fileName}
                    </Text>
                  </View>
                  <View style={styles.form_field_view}>
                    <Text style={[styles.form_field_inline_label]}>
                      Remarks
                    </Text>
                    <Text
                      style={[
                        styles.form_field,
                        { paddingTop: 15, paddingLeft: 10 },
                      ]}>
                      {item.remark}
                    </Text>
                  </View>

                  <View style={styles.form_field_view}>
                    <Text style={[styles.form_field_inline_label]}>Action</Text>
                    <View
                      style={
                        (styles.form_field,
                          { flexDirection: 'row', width: '80%' })
                      }>
                      {item.fileDetail ? (
                        <TouchableOpacity
                          style={{
                            width: '40%',
                            backgroundColor: 'gray',
                            height: 45,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          onPress={() =>
                            this.downloadAttachment(
                              item.fileDetail.imageURL,
                              item.fileDetail.file_name,
                            )
                          }>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: '#fff',
                              fontSize: 10,
                            }}>
                            Download
                          </Text>
                          <AntDesign
                            name="clouddownload"
                            style={{
                              color: '#fff',
                              fontSize: 20,
                            }}
                          />
                        </TouchableOpacity>
                      ) : null}

                      <TouchableOpacity
                        style={{
                          width: '40%',
                          backgroundColor: '#c82333',
                          height: 45,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => this.deleteAttachment(item, index)}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: '#fff',
                            fontSize: 10,
                          }}>
                          Delete
                        </Text>
                        <AntDesign
                          name="delete"
                          style={{ color: '#fff', fontSize: 15 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />

          ) : null}
          <View style={{ flex: 1 }}>
            <ModalPopup
              errorMessageText={this.state.errorMsg}
              closeButtonText={'CLOSE'}
              closeButtonAction={() =>
                this.setState({ isModalVisible: !this.state.isModalVisible })
              }
              visible={this.state.isModalVisible}
            />
          </View>
          {this.state.claimSubmissionAttachments && this.state.claimSubmissionAttachments.length ?
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                style={styles.submit_ButtonStyle}
                onPress={() => updateAttachment(this.state.claimSubmissionAttachments)}
                disabled={
                  this.state.claimSubmissionAttachments.length ? false : true
                }>
                <Text style={{ color: '#fff' }}>Submit</Text>
              </TouchableOpacity>
            </View> : null}
        </View>
        {this.state.selectOptionPopup ? (
          <UploadClaimSubmission
            popupVisible={(data) => this.imageUpload(data)}
          />
        ) : null}
      </View>
    );
  }
}
export default AttachmentDetails;
