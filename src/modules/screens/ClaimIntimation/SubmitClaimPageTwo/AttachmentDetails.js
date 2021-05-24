import React, {PureComponent} from 'react';
import {Text, View, Item, Input, Icon} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {Col, Row} from 'react-native-easy-grid';
import styles from '../Styles';

const AttachmentDetails = ({}) => {
    const [fileName, setFileName] = useState('');
    const [remarks, setRemarks] = useState('');

  return (
    <View>
      <View style={styles.ButtonView}>
        <View>
          <Text style={{marginLeft: 15, fontSize: 16, marginTop: 10}}>
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
          }}>
          <Text>Choose File</Text>
        </TouchableOpacity>

        <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
          <Col size={1}>
            <Text style={styles.text}>
              File Name<Text style={{color: 'red'}}>*</Text>
            </Text>

            <Item regular style={{borderRadius: 6, height: 35}}>
              <Input
                placeholder="Enter File Name"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                  value={fileName}
                keyboardType={'default'}
                //   editable={employeeId == undefined ? true : false}
                  onChangeText={(text) =>setFileName(text)}
              />
            </Item>
          </Col>
        </Row>
        <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
          <Col size={1}>
            <Text style={styles.text}>
              Remarks<Text style={{color: 'red'}}>*</Text>
            </Text>

            <Item regular style={{borderRadius: 6, height: 35}}>
              <Input
                placeholder="Enter Remarks"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                  value={remarks}
                keyboardType={'default'}
                //   editable={employeeId == undefined ? true : false}
                onChangeText={(text) =>setRemarks(text)}
                />
            </Item>
          </Col>
        </Row>

        <View style={{marginTop: 20}}>
          <TouchableOpacity style={styles.submit_ButtonStyle}>
            <Text style={{color: '#fff'}}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AttachmentDetails;
