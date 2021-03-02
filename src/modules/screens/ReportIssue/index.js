
import React, { Component } from 'react';
import { Container, Content, View, Text, Item, Radio, Row, Col, Form, Button, Toast, Footer } from 'native-base';
import { StyleSheet, TextInput } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Spinner from "../../../components/Spinner";
import { getCurrentVersion } from '../../providers/profile/profile.action';
import { onlySpaceNotAllowed, chatIssue, pharmacyIssue } from '../../common';
// import { statusValue } from '../../../setup/helpers';

import { insertReportIssue } from '../../providers/reportIssue/reportIssue.action';


class ReportIssue extends Component {
  constructor(props) {
    super(props)
    this.state = {
      issueList: [],
      quesNo: 1,
      issueType: null,
      issueFor: this.props.navigation.getParam('issueFor'),
      complaint: null,
      isLoading: false
    }
  }
  async componentDidMount() {
    this.getIssueList()
    

  }
  getIssueList = async () => {
    try{
      this.setState({ isLoading: true });
     const { issueFor } = this.state
    let type ,  issueList =[]
    if (issueFor) {
   
        if (issueFor.status) {
          type ='REPORT_ISSUE_'+issueFor.serviceType +'_'+issueFor.status
        }
      let reportIssueList = await getCurrentVersion(type)
      
      if (reportIssueList.success) {
         issueList = reportIssueList.data[0].value
        
      }
    }
   
      let obj={ 
        issue_no:issueList.length+1 ,
        issue : "Others" }
        issueList.push(obj)
        
      this.setState({ issueList:issueList })
       
    
    this.setState({ isLoading: false });
  }
  catch(e){
    console.log(e)
  }
  finally{
    this.setState({ isLoading: false });
  }
  }
  insertReportIssueData = async () => {
    try {
      this.setState({ isLoading: true });
      const { complaint, issueFor, issueType } = this.state;

      if (onlySpaceNotAllowed(complaint) == true) {

        let userId = await AsyncStorage.getItem('userId');
        let data = {
          service_type: issueFor.serviceType,
          sender_id: userId,
          report_by: 'USER',
          issue_type: issueType.issue,
          complaint: complaint,
          report_status: 'OPEN'


        }
        if (issueFor.serviceType == 'APPOINTMENT') {
          data.appointment_id = issueFor.reportedId
        }
       else{
         data.service_id=issueFor.reportedId
       }
        let response = await insertReportIssue(data);

        if (response.success) {

          Toast.show({
            text: response.message,
            type: 'success',
            duration: 3000,
          })
          const { navigation } = this.props;
          const { routeName, key } = navigation.getParam('prevState');
          navigation.navigate({ routeName, key, params: { hasReloadReportIssue: true } });

        }
        else {
          Toast.show({
            text: response.message,
            type: 'dangers',
            duration: 3000,
          })

        }

      }
      else {
        Toast.show({
          text: 'kindly give report ',
          type: 'dangers',
          duration: 3000,
        })

      }
      this.setState({ isLoading: false });
    } catch (e) {

      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
  }


  render() {
    const { isLoading, issueList } = this.state
    return (
      <Container>
        <Content style={{ padding: 30 }}>
          {isLoading == true ? <Spinner
            color={'blue'}
            style={[styles.containers, styles.horizontal]}
            visible={true}
            size={"large"}
            overlayColor="none"
            cancelable={false}
          /> : null}
          <View style={{ marginBottom: 40, }}>
            <Text style={{ fontFamily: 'OpenSans', fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>{this.state.issueFor.serviceType || ' ' + ' Issue'}</Text>

            <Form>
              <View >
                <FlatList data={issueList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) =>
                    <View>
                      <Row style={{ marginTop: 10,alignItems:'center' }}>
                        <Radio standardStyle={true}
                               selected={this.state.issueType === item ? true : false} 
                               onPress={()=>   this.setState({ issueType: item })}  />

                        <Text style={{ fontFamily: 'OpenSans', fontSize: 16, lineHeight: 20, marginLeft: 10,  width: '80%' }}>{item.issue}</Text>
                      </Row>
                      {this.state.issueType == item ?
                        <Row style={{ marginTop: 10, marginBottom: 10 }}>
                          <Col size={1.5}>
                          </Col>
                          <Col size={8.5}>
                            <TextInput
                              onChangeText={complaint => this.setState({ complaint })}
                              multiline={true} placeholder="Reason......"
                              style={styles.textInput1} />
                          </Col>
                        </Row> : null}
                    </View>


                  } />


              </View>



            </Form>
          </View>
        </Content>
        <Footer style={{ backgroundColor: 'white' }}>
          <Row style={{ justifyContent: 'center', marginTop: -10 }}>
            <Button style={styles.ReportButton} onPress={() => this.props.navigation.pop()}>
              <Text style={styles.ReportButtonText}>CANCEL</Text>
            </Button>
            <Button style={styles.ReportButton1} onPress={() => this.insertReportIssueData()}>
              <Text style={styles.ReportButtonText}>REPORT</Text>
            </Button>
          </Row>
        </Footer>
      </Container>
    )
  }
}

export default ReportIssue

const styles = StyleSheet.create({

  textInput: {
    borderColor: 'gray',
    borderRadius: 10,
    borderWidth: 0.5,
    height: 120,
    fontSize: 14,
    textAlignVertical: 'top',
    width: '100%',
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    paddingRight: 10,
    marginTop: 10
  },
  textInput1: {
    borderColor: 'gray',
    borderRadius: 10,
    borderWidth: 0.5,
    height: 80,
    fontSize: 14,
    textAlignVertical: 'top',
    width: '60%',
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    paddingRight: 10,
    marginTop: 10,
    width: '100%'

  },
  ReportButtonText: {
    fontFamily: 'OpenSans',
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  ReportButton: {
    borderRadius: 10,
    height: 40,
    marginTop: 20,
    padding: 30,
    backgroundColor: '#878787'
  },
  ReportButton1: {
    borderRadius: 10,
    height: 40,
    marginTop: 20,
    padding: 20,
    marginLeft: 20,
    backgroundColor: '#e32726'
  },

})




















