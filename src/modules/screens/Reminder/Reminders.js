import React, { Component } from 'react';
import { Container, Content, View, Card, Grid, CardItem, Text, Switch, Right, Item, Radio, Icon, Row, Col, Form, Button, Left, Toast } from 'native-base';
import { StyleSheet, TextInput, AsyncStorage, Image, Dimensions, TouchableOpacity } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import CalendarStrip from 'react-native-calendar-strip';
import { getReminderData, addReminderdata } from '../../providers/reminder/reminder.action.js';
import { formatDate } from "../../../setup/helpers";
import RNCalendarEvents from 'react-native-calendar-events';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';
import { hasLoggedIn } from "../../providers/auth/auth.actions";
import SpinnerOverlay from '../../../components/Spinner';
import NotifService from '../../../setup/NotifService';
import { connect } from 'react-redux'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AwesomeAlert from 'react-native-awesome-alerts';
var { width, height } = Dimensions.get('window');
console.log('height', height);
let datesBlackList = [{
  start: moment().subtract(7, 'days').toISOString(),
  end: moment().subtract(1, 'days').toISOString()
}];
class Reminder extends Component {
  reminderItemForRemoveObj = {};
  constructor(props) {
    super(props)
    this.reminderData = [];
    this.state = {
      data: [],
      isLoading: false,
      selectedDate: formatDate(new Date(), 'YYYY-MM-DD'),
      startDate: formatDate(new Date(), 'YYYY-MM-DD'),
      endDate: formatDate(new Date(), 'YYYY-MM-DD'),
      currentDate: formatDate(new Date(), 'YYYY-MM-DD'),
      refreshCount: 1,
      isCancel: false
    }
  }


  async componentDidMount() {
    const isLoggedIn = await hasLoggedIn(this.props);
    if (!isLoggedIn) {
      this.props.navigation.navigate("login");
      return;
    }
    await this.getAllReminderdata()
    
  }

  getAllReminderdata = async () => {
    try {
      this.setState({
        isLoading: true
      })
      let userId = await AsyncStorage.getItem('userId');
    
      let result = await getReminderData(userId);
      
      if (result.success) {
        let reminderData = result.data;
         this.reminderData  = reminderData
       // alert(JSON.stringify(this.reminderData))
        console.log("data=========<<<<<<<<<<<<<",JSON.stringify(result.data))
        await  this.setCalenderStripDatesAndData(this.state.currentDate)
      }
      return result.data;
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  setCalenderStripDatesAndData = (data1) => {

   
    const reminderDataBySelectedDate = this.reminderData.filter(ele => {

      let date = new Date(moment(data1).startOf('d').toISOString()).getTime();
      let dateData = formatDate(data1, "dddd,MMMM DD-YYYY")
     
      let startDate = new Date(ele.medicine_take_start_date).getTime();
      let endDate;
      if (ele.reminder_type === 'onlyonce') {
        let endDateTemp = formatDate(ele.medicine_take_start_date, "dddd,MMMM DD-YYYY") ;
    
        if ((dateData == endDateTemp && ele.active == true)) {
          return true;
        }
      }
       else {
        endDate = new Date(ele.medicine_take_end_date).getTime();
        if ((date <= endDate && date >= startDate && ele.active == true)) {
          return true;
        }
      }

      // 
      // let endDate;
      // if (ele.reminder_type === 'onlyonce') {
      //   let endDateTemp = new Date(ele.medicine_take_start_date);
      //   endDateTemp.setHours(23);
      //   endDateTemp.setMinutes(59);
      //   endDate = new Date(endDateTemp).getTime();
      //   if ((date <= endDate && date >= startDate && ele.active == true)) {
      //     return true;
      //   }
      // } else {
      //   endDate = new Date(ele.medicine_take_end_date).getTime();
      //   if ((date <= endDate && date >= startDate && ele.active == true)) {
      //     return true;
      //   }
      // }
     
    });
    let selectedDate = formatDate(data1, 'YYYY-MM-DD');

    // alert(JSON.stringify(reminderDataBySelectedDate))
    this.setState({ data: reminderDataBySelectedDate, selectedDate: selectedDate });
    console.log("this.data++++++++++++", this.state.data)
  }

  onDateChanged = async (data1) => {
    if (data1) {
      this.setCalenderStripDatesAndData(data1)
    }
  }






  updateToggleFunction = async (data1, value) => {
    data1.is_reminder_enabled = value;
    let userId = data1.user_id;
    const reqObj = {
      ...data1,
      is_reminder_enabled: value,
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

  backNavigation = async (navigationData) => {
    try {
      if (navigationData.action) {
        const { reminder: { reminderResponse: { data } } } = this.props;
        this.reminderData = data;
        console.log("data=========>>>>>>>>>>>>>>",data)
        this.setCalenderStripDatesAndData(this.state.currentDate)
      }
    } catch (e) {
      console.log(e)
    }

  }
  deleteReminder = async (item) => {

    item.active = false;
    let userId = item.user_id;

    const reqObj = {
      ...item,
      active: false,
      reminder_id: item._id
    }
    delete reqObj.user_id;
    delete reqObj._id;
    let result = await addReminderdata(userId, reqObj);
    if (result.success) {
      const reminderResponse = await this.getAllReminderdata();
      this.reminderData = reminderResponse || [];
      this.setCalenderStripDatesAndData(this.state.selectedDate)
    }
    // this.setState({ isCancel: true })
  }

  _onPressReject = () => {
    this.setState({ isCancel: false })
  };
  _onPressAccept = () => {
    this.deleteReminder(this.reminderItemForRemoveObj);
    this.setState({ isCancel: false })
  };



  render() {
    const { index, isLoading, data, isCancel } = this.state;

    // console.log('data=====>', JSON.stringify(data))
    const renderTimeList = (timeList) => {
      return timeList.map((item) => {
        return (
          <Text style={{ marginLeft: 15, color: '#000' }}>{formatDate(item.medicine_take_time, 'HH:mm A')}</Text>
        )
      })
    }
    return (
      <Container>
        <AwesomeAlert
          show={isCancel}
          showProgress={false}
          title={`Are you sure to delete your Reminder `}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={true}
          showCancelButton={true}
          showConfirmButton={true}
          confirmText="Yes"
          cancelText="No"
          cancelButtonColor="red"
          confirmButtonColor="green"
          onConfirmPressed={this._onPressAccept}
          onCancelPressed={this._onPressReject}

          alertContainerStyle={{ zIndex: 1, }}
          titleStyle={{ fontSize: 21 }}
          cancelButtonTextStyle={{ fontSize: 18 }}
          confirmButtonTextStyle={{ fontSize: 18 }}
        />
        <Content style={{ backgroundColor: '#F1F1F1', flex: 1 }}>

          <View>
            <View style={{ paddingBottom: 10, backgroundColor: '#FFF' }}>
              <NavigationEvents
                onWillFocus={payload => { this.backNavigation(payload) }} />

              <CalendarStrip
                selection={'border'}
                minDate={new Date()}
                maxDate={new Date(), 1, 'year'}
                selectionAnimation={{ duration: 300, borderWidth: 1 }}
                style={{ paddingTop: 2, paddingBottom: 2 }}
                calendarHeaderStyle={{ color: 'gray' }}
                calendarColor={'#fff'}
                highlightColor={'#7F49C3'}
                dateNumberStyle={{ color: 'gray' }}
                dateNameStyle={{ color: 'gray' }}
                highlightDateNumberStyle={{ color: 'white', backgroundColor: '#7F49C3', borderRadius: 15, padding: 5, height: 30, width: 30, fontSize: 12 }}
                highlightDateNameStyle={{ color: '#7F49C3' }}
                borderHighlightColor={'white'}
                onDateSelected={(date) => this.onDateChanged(date)}
                iconContainer={{ flex: 0.1 }}
                datesBlacklist={datesBlackList}
              />
              <Text style={{ color: '#7F49C3', textAlign: 'center', marginTop: 2, fontFamily: 'OpenSans', fontWeight: "500" }}>Today</Text>
            </View>


            {isLoading == true ?
              <SpinnerOverlay color='blue'
                visible={isLoading}
              /> :

              data.length == 0 ?
                <View style={{ backgroundColor: '#F1F1F1', marginTop: height / 4, justifyContent: 'center', alignItems: 'center' }}>

                  <Image source={require('../../../../assets/images/Remindericon.png')} style={{ justifyContent: 'center', height: 150, width: 150 }} />
                  <Text style={{ color: '#d83939', }}>No Reminder is available now!</Text>
                </View>
                :

                <View style={{ paddingRight: 10, paddingLeft: 10 }}>

                  <FlatList data={data}
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
                              </View>
                            </Col>
                            <Col style={styles.col2}>
                              <Row>
                                <Col size={7} style={{ justifyContent: 'center' }}>
                                  {renderTimeList(item.medicine_take_times)}
                                </Col>
                                <Col size={3} style={{ justifyContent: 'center' }}>

                                  <Switch style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }], backgroundColor: 'fff' }} trackColor={{ true: '#6FC41A', false: 'grey' }}
                                    trackColor={{ true: '#7F49C3' }}
                                    thumbColor={"#F2F2F2"}
                                    onValueChange={(val) => this.updateToggleFunction(item, val)}
                                    value={item.is_reminder_enabled}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <TouchableOpacity style={{ fontSize: 20, color: "red", position: 'absolute', right: 0, top: 0 }} onPress={() => {
                            this.setState({ isCancel: true });
                            this.reminderItemForRemoveObj = item;
                          }
                          }>
                            <MaterialCommunityIcons name="close-box" style={{ fontSize: 25, color: "red", }} />
                          </TouchableOpacity>
                        </Grid>
                        <View style={{ marginTop: 5, borderTopColor: 'gray', borderTopWidth: 1, }}>
                          {item.reminder_type === 'everyday' ?
                            <Text style={styles.remText}>Your Reminder Time is at {formatDate(item.medicine_take_start_date, 'DD/MM/YYYY')} - {formatDate(item.medicine_take_end_date, 'DD/MM/YYYY')}</Text> :
                            <Text style={styles.remText}>Your Reminder Time is at {formatDate(item.medicine_take_start_date, 'DD/MM/YYYY')}</Text>
                          }
                        </View>
                      </Card>
                    )} />

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
export default connect(homeState)(Reminder)

const styles = StyleSheet.create({

  col1: {
    borderRightColor: 'gray',
    borderRightWidth: 1,
    width: '50%',
    marginTop: 15
  },
  col2: {
    width: '50%',
    justifyContent: 'center',
    marginTop: 15
  },
  mednamestyle: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    fontWeight: 'bold',
  },
  innerText: {
    fontFamily: 'OpenSans',
    fontSize: 13,
    color: '#7d7d7d'
  },
  timestyle: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    marginLeft: 10,
    fontWeight: 'bold'
  },
  remText: {
    textAlign: 'center',
    paddingBottom: 5,
    paddingTop: 5,
    fontFamily: 'OpenSans',
    fontSize: 14, color: '#7F49C3'
  }
})