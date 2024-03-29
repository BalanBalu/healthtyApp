import React, { Component } from 'react';
import { Container, Content, View, Text, Item, Radio, Row, Col, Form, Button, Footer, Left, Right, Toast } from 'native-base';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { formatDate } from '../../../setup/helpers';

import Spinner from "../../../components/Spinner";
import { upDateReportIssue, getUserRepportDetails } from '../../providers/reportIssue/reportIssue.action';


import { onlySpaceNotAllowed, reportStatusValue } from '../../common'
import { CURRENT_APP_NAME } from "../../../setup/config";
class reportIssueDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      reportedId: this.props.navigation.getParam('reportedId'),
      comments: '',
      replyData: [],
      isLoading: false

    }
  }
  componentDidMount() {
    this.getUserReport()
  }
  getUserReport = async () => {
    try {
      this.setState({ isLoading: true });
      const userId = await AsyncStorage.getItem('userId');
      let serviceType = this.props.navigation.getParam('serviceType')
      let resultReport = await getUserRepportDetails(serviceType, userId, this.state.reportedId, true);
      if (resultReport.success) {

        this.setState({ data: resultReport.data, replyData: resultReport.data.reply_data || [] });

      }
      this.setState({ isLoading: false });
    }
    catch (e) {
      console.error(e);
    }
    finally {
      this.setState({ isLoading: false });
    }
  }

  upDateReportIssueData = async () => {
    try {
      this.setState({ isLoading: true });

      const { comments, data, replyData } = this.state;
      if (onlySpaceNotAllowed(comments) == true) {
        let userId = await AsyncStorage.getItem('userId');
        let reqData = {
          reply_provider_type: 'USER',
          reply_comment: comments,
          active: true,
        }

        let response = await upDateReportIssue(data._id, userId, reqData);
        if (response.success) {
          let temp = replyData || []

          temp.push(response.reportedData)
          this.setState({ replyData: temp, comments: '' })
          Toast.show({
            text: response.message,
            type: 'success',
            duration: 3000,
          })
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
          text: 'kindly give your replies ',
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
    const { isLoading, data, replyData, comments } = this.state

    //     const data =[{date:"Today, 20/02/2020 at 01.10 PM",content:"We have no special tie-ups,relationship or consideration with doctors in this regard as we want to be an independent unbiased site for patients.",
    // detail:"Through Medflic,yours chances of booking an appoinment are the same as using any other means."}]
    return (
      <Container style={{ padding: 10 }}>
        <Content>
          <ScrollView >
            <Spinner
              color={'blue'}
              style={[styles.containers, styles.horizontal]}
              visible={isLoading}
              size={"large"}
              overlayColor="none"
              cancelable={false}
            />
            {data != null ?
              <View>

                <View>
                  <Row style={{ paddingBottom: 10, borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3 }}>
                    <Left>
                      <Text style={styles.reportText}>{data.report_by == 'USER' ? 'Reported By You' : 'Reported By Doctor'}</Text>
                    </Left>
                    <Right>
                      <Text style={[styles.date1, { color: reportStatusValue[data.report_status].color }]}>{data.report_status || ''}</Text>
                    </Right>
                  </Row>
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.contentText}>{data.issue_type}</Text>
                    <Text note style={styles.contentText}>{data.complaint} <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#4c4c4c' }}>{' Reported on ' + formatDate(data.created_date, 'DD/MM/YYYY ')}</Text> </Text>
                  </View>
                </View>
                {replyData.length != 0 &&
                  <FlatList
                    data={replyData}
                    extraData={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) =>
                      <View>
                        <Row style={{ paddingBottom: 10, borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3, marginTop: 30 }}>
                          <Left>
                            <Text style={styles.reportText}>{item.reply_provider_type == 'USER' ? 'Replied By You' : item.reply_provider_type == 'DOCTOR' ? 'Replied By Doctor' : 'Replied By ' + CURRENT_APP_NAME}</Text>
                          </Left>
                          <Right>
                            <Text style={styles.date}>{formatDate(item.created_date, 'dddd,DD/MM/YYYY') + ' at ' + formatDate(item.created_date, 'hh:mm a')}</Text>
                          </Right>
                        </Row>
                        <View style={{ marginTop: 10 }}>
                          {item.reply_provider_type == 'ADMIN' &&
                            <Text style={styles.contentText}>Hello Sir,
                           </Text>}
                          <Text style={[styles.contentText, { marginTop: 20 }]}>{item.reply_comment}
                          </Text>
                          <Text style={[styles.contentText, { marginTop: 10 }]}>{item.detail}
                          </Text>
                          {item.reply_provider_type == 'ADMIN' &&
                            <View>
                              <Text style={[styles.boldContent, { marginTop: 20 }]}>Thanks,
                            </Text>
                              <Text style={styles.boldContent}>{`${CURRENT_APP_NAME} Support Team`}
                              </Text>
                            </View>
                          }
                        </View>
                      </View>
                    } />
                }
                <View style={{ marginTop: 30 }}>
                  <Text style={styles.replyText}>Quick Reply
                            </Text>
                  <TextInput
                    value={comments}
                    onChangeText={comments => this.setState({ comments })}
                    multiline={true} placeholder="Type Your Reply......"

                    style={styles.textInput1} />
                  <Row>
                    <Right>
                      <TouchableOpacity style={styles.touchButton} onPress={() => { this.upDateReportIssueData() }}>
                        <Text style={styles.touchText} >Send Reply</Text>
                      </TouchableOpacity>
                    </Right>
                  </Row>
                </View>

              </View> : null}

          </ScrollView>
        </Content>
      </Container>


    )
  }
}

export default reportIssueDetails

const styles = StyleSheet.create({

  textInput1: {
    borderColor: '#909090',
    borderRadius: 2,
    borderWidth: 0.5,
    height: 60,
    fontSize: 10,
    fontStyle: 'italic',
    textAlignVertical: 'top',
    width: '60%',
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    marginTop: 10,
    width: '100%'

  },
  reportText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#128283'
  },
  date: {
    fontFamily: 'OpenSans',
    fontSize: 10,
    color: '#909090'
  },
  contentText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: '#5D5D5D',
    textAlign: 'left'
  },
  boldContent: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: '#696969',
    textAlign: 'left',
    fontWeight: 'bold'
  },
  replyText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: '#5D5D5D',
    textAlign: 'left'
  },
  touchButton: {
    backgroundColor: '#2A9F15',
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 3,
    marginTop: 10
  },
  touchText: {
    fontFamily: 'OpenSans',
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  date1: {
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: '#909090'
  },

})