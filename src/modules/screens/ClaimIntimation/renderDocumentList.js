import React, { Component } from 'react';
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
export default class RenderDocumentList extends Component {
    constructor(props) {
      super(props)
    }
    render() {
      const {item,showCard, show, selectOptionPoopup, docsUpload, uploadData, isLoading ,deleteSelectedDocs,downloadFile,familyDocs} = this.props;
  
    return (
        
         
                <View>
                  <Card style={styles.cardStyles}>
                    <Row>
                      <Col style={{ width: '10%' }}>
                        <Image source={RenderDocumentUpload(item)} style={{ width: 25, height: 25 }} />
                      </Col>
                      <Col style={{ width: '70%' }}>
                        <Text style={styles.innerCardText}>{item.original_file_name}</Text>
                      </Col>
                      {!docsUpload?
                        <Col style={{ width: '10%' }}>
                          <TouchableOpacity onPress={() => downloadFile(item.original_imageURL,item.original_file_name)} style={{ alignItems: 'center', marginTop: 5 }}>
                            <MaterialIcons name="file-download" style={{ fontSize: 20, color: 'red' }} />
                          </TouchableOpacity>
                        </Col> : null}
                      {!docsUpload&&!familyDocs ?
                        <Col style={{ width: '10%' }}>
                          <TouchableOpacity onPress={(index) => deleteSelectedDocs(index)} style={{ alignItems: 'center', marginTop: 5 }}>
                            <EvilIcons name="trash" style={{ fontSize: 20, color: 'red' }} />
                          </TouchableOpacity>
                        </Col> : null}
                    </Row>
                  </Card>
                </View>
    )
  }
}
