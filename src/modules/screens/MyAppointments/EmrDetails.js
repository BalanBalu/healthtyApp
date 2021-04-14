import React, { Component } from 'react';
import { Container, Content, View, Card, Grid, Text, Switch, Row, Col, Toast, Item } from 'native-base';
import { StyleSheet, Image, Dimensions } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';

import { fetchEmrData } from '../../providers/bookappointment/bookappointment.action';
import { formatDate } from "../../../setup/helpers";

import { NavigationEvents } from 'react-navigation';

import SpinnerOverlay from '../../../components/Spinner';
import { getName } from '../../common';

import { connect } from 'react-redux'
var { width, height } = Dimensions.get('window');

class EmrDetails extends Component {
  scrollRef = React.createRef()
  constructor(props) {
    super(props)
    this.reminderData = [];
    this.state = {
      data: [],
      isLoading: false,

    }
  }


  async componentDidMount() {

    this.getEmrData(this.props.navigation.getParam('appointmentId'))


  }

  getEmrData = async (appointmentId) => {
    try {
      this.setState({
        isLoading: true
      })

      let result = await fetchEmrData(appointmentId);

      if (result.success) {

        this.setState({ data: result.data[0] })
      }

    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
  }









  setStatus = async (data1, value) => {
    data1.active = value;
    let userId = data1.user_id;
    const reqObj = {
      ...data1,
      active: value,
      reminder_id: data1._id
    }
    delete reqObj.user_id;
    delete reqObj._id;
    let result = await addReminderdata(userId, reqObj);

    var temp = [...this.state.data]
    temp.map((t) => {
      if (t._id == data1._id) {
        t.is_reminder_enabled = value
      }
    })
    this.setState({ data: temp });
  }
  setSelectedIndex = event => {
    try {


      const viewSize = event.nativeEvent.layoutMeasurement.width;
      const contentOffset = event.nativeEvent.contentOffset.x;
      const selectIndex = Math.round(contentOffset / viewSize)
      this.setState({ selectIndex })


    } catch (e) {
      console.log(e)
    }
  }
  //   backNavigation  = async (navigationData) => {
  //     try {
  //       if (navigationData.action) {
  //         const { reminder: { reminderResponse: { data }  } } = this.props;
  //         this.setState({ data: data });
  //       }
  //     } catch (e) {
  //       console.log(e)
  //     }

  //   }


  render() {
    const { index, isLoading, data, selectIndex } = this.state;
    const renderTimeList = (timeList) => {
      return timeList.map((item) => {
        return (
          <Text style={{ marginLeft: 15, color: '#000' }}>{formatDate(item, 'hh:mm A')}</Text>
        )
      })
    }
    return (
      <Container>
        <Content style={{ backgroundColor: '#F1F1F1' }}>


          <View>

            {/* <NavigationEvents
                  onWillFocus={payload => { this.backNavigation(payload) }} /> */}


            {isLoading == true ?
              <SpinnerOverlay color='blue'
                visible={isLoading}
              /> :

              data.length == 0 ?
                <View style={{ backgroundColor: '#F1F1F1', marginTop: height / 4, justifyContent: 'center', alignItems: 'center' }}>

                  {/* <Image source={require('../../../../assets/images/Remindericon.png')} style={{ justifyContent: 'center', height: 150, width: 150 }} /> */}
                  <Text style={{ color: '#d83939' }}>No EMR  avaialble now!</Text>
                </View>
                : <View style={{ paddingRight: 10, paddingLeft: 10 }}>
                  <Text style={styles.Title}>Prescription For Patient</Text>
                  <View style={{ paddingRight: 10, paddingLeft: 10, backgroundColor: '#fff', marginTop: 15, borderRadius: 5, borderWidth: 1 }}>
                    <Row style={{ margin: 5 }}>
                      <Col size={5}>
                        <Text style={styles.name}>Patient name</Text>
                      </Col>
                      <Col size={1}>
                        <Text style={styles.name}>:</Text>
                      </Col>
                      <Col size={4.5}>
                        <Text style={styles.name2}>{getName(data.doctorInfo)}</Text>
                      </Col>
                    </Row>

                    <Row style={{ margin: 5 }}>
                      <Col size={5}>
                        <Text style={styles.name}>Prescription Reason</Text>
                      </Col>
                      <Col size={1}>
                        <Text style={styles.name}>:</Text>
                      </Col>
                      <Col size={4.5}>
                        <Text style={styles.name2}>{data.appointmentInfo.disease_description||' '}</Text>
                      </Col>
                    </Row>
                  </View>

                  <Text style={styles.Title}> Prescription Details</Text>
                  {data.emr_type === 'PRESCRIPTION' ?
                    <View style={{ paddingRight: 10, paddingLeft: 10 }}>
                      <FlatList data={data.emr_medicine_data}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={[data]}
                        renderItem={({ item, index }) => (
                          <Card style={{ borderRadius: 5, marginTop: 10 }}>
                            <Grid>
                              <Row style={{ marginTop: 5 }}>
                                <Col style={styles.col1}>
                                  <View style={{ marginLeft: 15 }}>
                                    <Text style={styles.mednamestyle}>{item.medicine_name}</Text>
                                    <Text style={styles.innerText}>{item.medicine_form}</Text>
                                    <Text style={styles.innerText}>{item.medicine_strength}</Text>
                                    <Text style={styles.innerText}>{item.right_way_to_medicine_take}</Text>
                                  </View>
                                </Col>
                                <Col style={styles.col2}>
                                  <Row>

                                    <Col size={8}>
                                      {renderTimeList(item.medicine_take_times)}
                                    </Col>

                                    <Col size={2}>


                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Grid>
                            <View style={{ marginTop: 5, borderTopColor: 'gray', borderTopWidth: 1, }}>
                              <Text style={styles.remText}>Medicine take upto {formatDate(item.medicine_take_start_date, 'DD/MM/YYYY')} - {formatDate(item.medicine_take_end_date, 'DD/MM/YYYY')}</Text>
                            </View>
                          </Card>
                        )} />
                    </View> :
                    <View>
                      <FlatList horizontal pagingEnabled
                        data={data.emr_image_data}
                        extraData={selectIndex}
                        onMomentumScrollEnd={this.setSelectedIndex}
                        ref={this.scrollRef}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) =>
                          <View>
                            <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                              <Image
                                source={{ uri: item.emr_path }}
                                style={styles.profileImage}
                              />
                            </Item>


                            <View style={styles.circleDev}>
                              <View key={item} style={[styles.whiteCircle, { opacity: index === selectIndex ? 0.5 : 1 }]} />
                            </View>

                          </View>

                        } />

                    </View>
                  }

                </View>
            }
          </View>

        </Content>
      </Container>
    )
  }
}

function homeState(state) {

  return {
    reminder: state.reminder
  }
}
export default connect(homeState)(EmrDetails)

const styles = StyleSheet.create({

  col1: {
    borderRightColor: 'gray',
    borderRightWidth: 1,
    width: '50%',
  },
  col2: {
    width: '50%',
    justifyContent: 'center',
  },
  mednamestyle: {
    fontFamily: 'opensans-bold',
    fontSize: 15,
  },
  innerText: {
    fontFamily: 'Roboto',
    fontSize: 13,
    color: '#7d7d7d'
  },
  timestyle: {
    fontFamily: 'opensans-bold',
    fontSize: 15,
    marginLeft: 10,
  },
  remText: {
    textAlign: 'center',
    paddingBottom: 5,
    paddingTop: 5,
    fontFamily: 'Roboto',
    fontSize: 14, color: '#128283'
  },
  profileImage: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: Dimensions.get('window').width - 10,
    height: Dimensions.get('window').height - 200,
    justifyContent: 'center',
    borderColor: '#f5f5f5',
    alignItems: 'center',

  },
})