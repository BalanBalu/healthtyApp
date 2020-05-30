import React, { Component } from 'react';
import { StyleSheet, TextInput, AsyncStorage, FlatList } from 'react-native';
import { Container, Radio, Button, Card, Grid, ListItem, List, View, Text, Toast, CardItem, Right, Body, Content, Input, Item, Row, Col, Form, Footer } from 'native-base';
import { appointmentStatusUpdate } from '../../providers/bookappointment/bookappointment.action';
import { getCurrentVersion } from '../../providers/profile/profile.action';
import { formatDate } from '../../../setup/helpers';
import { onlySpaceNotAllowed } from '../../common';
import { Loader } from '../../../components/ContentLoader'
import Spinner from '../../../components/Spinner';


class CancelService extends Component {
  //service is represent lab_appointment,pharmacy_order,etc
  constructor(props) {
    super(props)

    this.state = {
      selectedIndex: 0,
      cancelReasonList: [],
      reasonForCancelComment: '',
      reasonForCancel:''

    }


  }

  async componentDidMount() {
    this.getcancelList()



  }
  getcancelList = async () => {
    try {
      const { navigation } = this.props;
      const serviceType = navigation.getParam('serviceType') || null
      let type = '', cancelReasonList = []
      if (serviceType !== null) {
        type = serviceType + '_CANCEL_REASON'
      }
      console.log(type)
      let cancelList = await getCurrentVersion(type)

      if (cancelList.success) {
        cancelReasonList = cancelList.data[0].value

      }


      let obj = {
        cancel_no: cancelReasonList.length + 1,
        cancel_reason: "Others"
      }

      cancelReasonList.push(obj)

      this.setState({ cancelReasonList: cancelReasonList, type, isLoading: false,reasonForCancel:cancelReasonList[0].cancel_reason })
    }
    catch (e) {
      console.log(e)
    }
  }
  toggleRadio(data, index) {
    if (index !== -1) {
      console.log(this.state.cancelReasonList)
      this.setState({ selectedIndex: index, reasonForCancel:data.cancel_reason })
    }
  }

  /* Cancel Appoiontment Status */
  cancelService = async () => {
    try {


      if (onlySpaceNotAllowed(this.state.reasonForCancelComment) === true) {

        const { navigation } = this.props;
        const { routeName, key } = navigation.getParam('prevState');


        navigation.navigate({ routeName, key, params: { hasUpdateCancelService: true, reasonForCancelComment: this.state.reasonForCancelComment, reasonForCancel: this.state.reasonForCancel } });

      }
      else {
        Toast.show({
          text: 'Write a reason for Cancellation',
          type: "danger",
          duration: 3000
        })
      }


    }
    catch (e) {
      console.log(e);
    }
    finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { isLoading, cancelReasonList, type, selectedIndex } = this.state
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
            <Text style={{ fontFamily: 'OpenSans', fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>{type}</Text>

            <Form>
              <View >
                <FlatList data={cancelReasonList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) =>
                    <View>
                      <Row onPress={() => this.toggleRadio(item, index)} style={{ marginTop: 10 }}>
                        <Radio borderColor='black' selected={selectedIndex === index ? true : false} onPress={() => this.toggleRadio(item, index)}
                          selectedColor={"#775DA3"} testID='checkOption_1Selected' />
                        <Text style={{ marginLeft: 10, fontFamily: 'OpenSans', fontSize: 15, marginTop: 3 }}>{item.cancel_reason}</Text>
                      </Row>
                      {selectedIndex === index ?

                        <Row style={{ marginTop: 50 }}>
                          <Col size={1.5}>
                          </Col>
                          <Col size={8.5}>
                            <TextInput
                              onChangeText={reasonForCancelComment => this.setState({ reasonForCancelComment })}
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
              <Text style={styles.ReportButtonText}>BACK</Text>
            </Button>
            <Button style={styles.ReportButton1} onPress={() => this.cancelService()}>
              <Text style={styles.ReportButtonText}>CANCEL</Text>
            </Button>
          </Row>
        </Footer>
      </Container>
    )
  }
}

export default CancelService

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

