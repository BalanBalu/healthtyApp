import React, { Component } from 'react';
import { Container, Content, View, Text, Item, Card, Spinner, Picker, Icon, Radio, Row, Col, Form, Button, Input, Grid, Toast, Switch } from 'native-base';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, AsyncStorage, Right, Dimensions } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import DateTimePicker from 'react-native-modal-datetime-picker';
import { formatDate } from "../../../setup/helpers";
import moment from 'moment';
import { addReminderdata, getAllMedicineDataBySuggestion, addReminderOnProp, sheudleNotificationForAddReminders, getReminderData } from '../../providers/reminder/reminder.action.js';
import { IS_ANDROID, IS_IOS } from '../../../setup/config';
const POSSIBLE_PAGE_CONTENT = {
  MEDICINE_CONTENT: 'MEDCINE_CONTENT',
  DATE_CONTENT: 'DATE_CONTENT',
  TIME_CONTENT: 'TIME_CONTENT'
}
const debounce = (fun, delay) => {
  let timer = null;
  return function (...args) {
    const context = this;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fun.apply(context, args);
    }, delay);
  };
}

class AddReminder extends Component {
  constructor(props) {
    super(props)
    debugger
    this.medicineTakeTimes = [];
    this.state = {
      medicine_name: null,
      medicine_form: null,
      medicine_strength: null,
      reminder_type: null,
      is_reminder_enabled: true,
      active: true,
      medicine_take_times: moment().startOf('day').toDate(),
      medicine_take_one_date: moment().startOf('day').toDate(),
      medicine_take_start_date: moment().startOf('day').toDate(),
      medicine_take_end_date: moment().startOf('day').toDate(),
      medicinePeriod: "onlyonce",
      minimumDate: new Date(),
      pageContent: true,
      isDateTimePickerVisible: false,
      isEndDateTimePickerVisible: false,
      isOnlyDateTimePickerVisible: false,
      isTimePickerVisible: false,
      startDatePlaceholder: false,
      enddatePlaceholder: false,
      Timeplaceholder: false,
      previewdisplay: false,
      medicineSugesstionArray: null,
      setShowSuggestions: false,
      refreshCount: 1,
      currentDate:  moment().startOf('day').toDate()
    }
    debugger
    this.callmedicinesearchService = debounce(this.callmedicinesearchService, 500);
  }
  componentDidMount() {
    debugger
    const { reminder: { reminderResponse: { data, } } } = this.props;
    // console.log('data props from compom did mount', JSON.stringify(data));

    debugger
  }
  SearchKeyWordFunction = async (enteredText) => {
    if (enteredText == '') {
      this.setState({ medicineSugesstionArray: null, medicine_name: enteredText })
    } else {
      this.setState({ medicine_name: enteredText })
      this.callmedicinesearchService(enteredText);
    }
  }
  callmedicinesearchService = async (enteredText) => {
    let medicineResultData = await getAllMedicineDataBySuggestion(enteredText);
    // console.log('medicinedone+++++++++++++++++' + JSON.stringify(medicineResultData))
    if (medicineResultData.success) {
      this.setState({
        medicineSugesstionArray: medicineResultData.data,
        searchValue: enteredText,
        setShowSuggestions: true
      });
    } else {
      this.setState({
        medicineSugesstionArray: [],
        searchValue: enteredText,
        setShowSuggestions: false
      });
    }
  }
  showTimePicker = () => {
    this.setState({ isTimePickerVisible: true })
  }
  hideTimePicker = () => {
    this.setState({ isTimePickerVisible: false })
  }
  handleTimePicker = async (date) => {
    try {
      let temp = this.medicineTakeTimes || []
      await this.setState({ timePlaceholder: true, isTimePickerVisible: false })
      if (!temp.some(ele => formatDate(ele.medicine_take_time, 'hh:mm a') === formatDate(date, 'hh:mm a'))) {
        temp.push({
          id: this.medicineTakeTimes.length + 1,
          medicine_take_time: date
        })
        this.medicineTakeTimes = temp
        await this.setState({ isTimePickerVisible: false })
      } else {
        this.setState({ isTimePickerVisible: true })
        Toast.show({
          text: 'Time already exists',
          type: 'dangers',
          duration: 3000,
        })
        return false;
      }

      const lastIndexOfitem = this.medicineTakeTimes.slice(-1)[0]
      const RecentylyPickedTime = lastIndexOfitem.medicine_take_time

      this.setState({ RecentylyPickedTime });

      this.insertReminderData();


      debugger
    } catch (error) {
      console.log(error);
    }
  }
  showOnlyDateTimePicker = () => {
    this.setState({ isOnlyDateTimePickerVisible: true })
  }
  hideOnlyDateTimePicker = () => {
    this.setState({ isOnlyDateTimePickerVisible: false })
  }
  handleOnlyDateTimePicker = (date) => {
    try {
      this.setState({ isOnlyDateTimePickerVisible: false, medicine_take_one_date: date })
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  }


  showendDateTimePicker = () => {
    this.setState({ isEndDateTimePickerVisible: true })
  }

  hideendDateTimePicker = () => {
    this.setState({ isEndDateTimePickerVisible: false })
  }

  handleEndDatePicked = date => {
    this.setState({ endDatePlaceholder: true, isEndDateTimePickerVisible: false, medicine_take_end_date: date });
    console.log('picked date', date);

    console.log('this.state.medicine_take_start_date', this.state.medicine_take_start_date);

    console.log('this.state.medicine_take_end_date', this.state.medicine_take_end_date);


    if (date < this.state.medicine_take_start_date) {
      Toast.show({
        text: 'End date must be Greater than Start date',
        type: 'danger',
        duration: 5000
      });




    }

  }
  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState({ isDateTimePickerVisible: false, medicine_take_start_date: date, startDatePlaceholder: true });
  }

  insertReminderData = async () => {
    try {
      if ((this.state.medicine_name == null) || (this.state.medicine_form == null) || (this.state.medicine_form == "Select medicine Form") || (this.state.medicine_strength == null) || (this.state.previewdisplay == "Select medicine strength")) {
        Toast.show({
          text: 'Kindly fill all the fields to schedule your reminderTime slots',
          type: 'danger',
          duration: 3000
        });

      } else {
        debugger

        debugger
        this.setState({ previewdisplay: true });
      }
    }
    catch (e) {
      console.log(e.message)
    }
  }


  delete(index) {
    console.log('Deliting...');
    let temp = this.medicineTakeTimes;
    temp.splice(index, 1)
    this.medicineTakeTimes = temp;
    this.setState({ refreshCount: this.state.refreshCount + 1 })

  }

  AddReminderDatas = async () => {
    try {

      if ((this.state.medicine_name == null) || (this.state.medicine_form == null) || (this.state.medicine_form == "Select medicine Form") || (this.state.medicine_strength == null) || (this.state.medicine_strength == "Select medicine strength") || (this.state.previewdisplay == false)) {
        Toast.show({
          text: 'Kindly fill all the fields and  select a time to schedule your reminderTime slots',
          type: 'danger',
          duration: 3000
        });
      } else if (this.medicineTakeTimes.length === 0) {
        Toast.show({
          text: 'Add Reminder Timings at least one',
          type: 'danger',
          duration: 3000
        });
      }

      else {
        debugger
        let userId = await AsyncStorage.getItem('userId');
        //  this.medicineTakeTimes.push({
        //   id: this.medicineTakeTimes.length + 1,
        //   medicine_take_time: this.state.medicine_take_times
        // });

        let data = {
          medicine_name: this.state.medicine_name,
          medicine_form: this.state.medicine_form,
          medicine_strength: this.state.medicine_strength,
          medicine_take_times: this.medicineTakeTimes,
          reminder_type: String(this.state.medicinePeriod),
          is_reminder_enabled: this.state.is_reminder_enabled,
          active: true
        }
        debugger
        if (this.state.medicinePeriod === "everyday") {
          data.medicine_take_start_date = moment(this.state.medicine_take_start_date).toISOString(),
            data.medicine_take_end_date = moment(this.state.medicine_take_end_date).toISOString()
        }
        debugger
        if (this.state.medicinePeriod === "onlyonce") {
          data.medicine_take_start_date = moment(this.state.medicine_take_one_date).toISOString()
        }
        debugger
        let result = await addReminderdata(userId, data)

        debugger


        if (result.success) {
          debugger
          data.userId = data;
          addReminderOnProp(data);
          sheudleNotificationForAddReminders([data])
          debugger
          Toast.show({
            text: result.message,
            type: "success",
            duration: 3000,
          })
          this.props.navigation.navigate('Reminder')
        }
        else {
          Toast.show({
            text: result.message,
            type: "danger",
            duration: 5000
          })
        }
      }
    }
    catch (e) {
      console.log(e.message)
    }
  }


  setPageContent = (pageContent) => {
    this.setState({ pageContent })
  }

  callNextButtonEvent() {
    const {currentDate,medicine_take_end_date,medicine_take_start_date} = this.state
    this.setState({ pageContent: false })
    let currentDay = formatDate(currentDate, "dddd,MMMM DD-YYYY")
    let endDay = formatDate(medicine_take_end_date, "dddd,MMMM DD-YYYY")
    let startDay = formatDate(medicine_take_start_date, "dddd,MMMM DD-YYYY")


    

    if(this.state.medicinePeriod === "everyday"){
    if ( this.state.medicine_take_end_date < this.state.medicine_take_start_date ) {
      Toast.show({
        text: 'Kindly make end date greater than start date and  select a time to schedule your reminderTime slots',
        type: 'danger',
        duration: 5000
      });
      this.setState({ pageContent: true })
    }
    if(endDay === currentDay){
      Toast.show({
        text: 'Kindly   select  end day to  schedule your reminderTime slots',
        type: 'danger',
        duration: 5000
      });
      this.setState({ pageContent: true })
    }
  }
 if(this.state.medicinePeriod === "onlyonce"){
  this.setState({ pageContent: false })
 }
}
  
  



  render() {
    const { isTimePickerVisible, isDatePickerVisible, isstartDatePickerVisible, isendDatePickerVisible, selectedDate, text,
      medicine_name, active, medicine_form, medicine_strength, medicine_take_start_date, medicine_take_end_date, medicine_take_one_date, medicinePeriod, is_reminder_enabled, isDateTimePickerVisible, isEndDateTimePickerVisible, data } = this.state;
    return (
      <Container>
        <ScrollView>
          <Content style={{ padding: 20 }}>
            <View style={{ marginBottom: 30 }}>

              <View pointerEvents={this.state.pageContent ? "auto" : "none"}
                style={this.state.pageContent == true ? styles.medicineenabletext : styles.medicinedisabletext}>
                <View>
                  <Text style={styles.NumText}>What Medicine would you like to add ?</Text>
                  <Form style={{
                    borderColor: '#909090',
                    borderWidth: 0.5, height: 35, borderRadius: 5, marginTop: 5,
                  }}>
                    <TextInput
                      placeholder="Medicine name"
                      style={[{ fontSize: 12, marginLeft: 5, borderRadius: 5 }, IS_ANDROID ? {} : { marginTop: 8 }]}
                      placeholderTextColor="#696969"
                      keyboardType={'default'}
                      returnKeyType={'go'}
                      value={this.state.medicine_name}
                      autoFocus={true}
                      onChangeText={enteredText => this.SearchKeyWordFunction(enteredText)}
                      multiline={false}
                    />
                  </Form>
                </View>
                {this.state.setShowSuggestions == true ?
                  <View style={{
                    flex: 1,
                  }}>
                    <FlatList
                      data={this.state.medicineSugesstionArray}
                      ItemSeparatorComponent={this.itemSaperatedByListView}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => {
                          this.setState({ medicine_name: item.medicine_name, setShowSuggestions: false, medicine_form: item.medicine_form, medicine_strength: item.medicine_category })
                        }}>
                          <Row style={{ borderBottomWidth: 0.3, borderBottomColor: '#cacaca' }}  >
                            <Text style={{ padding: 10, fontFamily: 'OpenSans', fontSize: 13, textAlign: 'left' }}>{item.medicine_name}</Text>
                          </Row>
                        </TouchableOpacity>
                      )}
                      enableEmptySections={true}
                      style={{ marginTop: 10 }}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                  : null}
                <View>
                  <Row>
                    <Col>
                      <Text style={styles.NumText}>Form of Medicine</Text>
                      <Form style={{
                        marginTop: 5, borderColor: '#909090',
                        borderWidth: 0.5, height: 35, borderRadius: 5
                      }}>
                        <TextInput
                          placeholder="Medicine Form"
                          style={[{ fontSize: 12, marginLeft: 5, borderRadius: 5 }, IS_IOS ? { marginTop: 8 } : {}]}
                          placeholderTextColor="#696969"
                          keyboardType={'default'}
                          returnKeyType={'go'}
                          value={this.state.medicine_form}
                          autoFocus={true}
                          onChangeText={enteredText => this.setState({ medicine_form: enteredText })}
                          multiline={false}
                        />
                      </Form>
                    </Col>
                    <Col style={{ marginLeft: 5 }}>
                      <Text style={styles.NumText}>Strength of Medicine</Text>
                      <Form style={{
                        marginTop: 5, borderColor: '#909090',
                        borderWidth: 0.5, height: 35, borderRadius: 5
                      }}>
                        <TextInput
                          placeholder="Medicine Strength"
                          style={[{ fontSize: 12, marginLeft: 5, borderRadius: 5 }, IS_IOS ? { marginTop: 8 } : {}]}
                          placeholderTextColor="#696969"
                          keyboardType={'default'}
                          returnKeyType={'go'}
                          value={this.state.medicine_strength}
                          autoFocus={true}
                          onChangeText={enteredText => this.setState({ medicine_strength: enteredText })}
                          multiline={false}
                        />
                      </Form>
                    </Col>
                  </Row>
                </View>
                <View>
                  <Text style={styles.NumText}>How often would you take this Medicine</Text>
                  <Item style={{ marginTop: 10, borderBottomWidth: 0, }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Radio
                        standardStyle={true}
                        selected={this.state.medicinePeriod === "everyday" ? true : false}
                        onPress={() => this.setState({ medicinePeriod: "everyday" })} />
                      <Text style={{
                        fontFamily: 'OpenSans', fontSize: 15, marginLeft: 10
                      }}>Everyday</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                      <Radio
                        standardStyle={true}
                        selected={this.state.medicinePeriod === "onlyonce" ? true : false}
                        onPress={() => this.setState({ medicinePeriod: "onlyonce" })} />
                      <Text style={{
                        fontFamily: 'OpenSans', fontSize: 15, marginLeft: 10
                      }}>Only when I need</Text>
                    </View>

                  </Item>
                </View>
                {this.state.medicinePeriod == "everyday" ?
                  <Form style={{ marginTop: 5, marginRight: 5 }}>
                    <Row>
                      <Col size={30}>
                        <Text style={styles.NumText}>Select Date</Text>
                      </Col>
                      <Col size={35}>
                        <View style={{ marginTop: 5, }}>
                          <TouchableOpacity onPress={() => { this.setState({ isDateTimePickerVisible: !isDateTimePickerVisible }) }} style={{
                            backgroundColor: '#f1f1f1',
                            flexDirection: 'row'
                          }}>
                            <Icon name='md-calendar' style={styles.calendarstyle} />
                            {this.state.startDatePlaceholder ?
                              <Text style={styles.startenddatetext}>{formatDate(this.state.medicine_take_start_date, 'DD/MM/YYYY')}</Text> :
                              <Text style={styles.startenddatetext}>Start Date</Text>
                            }
                            <DateTimePicker
                              mode={'date'}
                              is24Hour={false}
                              minimumDate={new Date()}
                              date={this.state.medicine_take_start_date}
                              isVisible={isDateTimePickerVisible}
                              onConfirm={this.handleDatePicked}
                              onCancel={() => this.setState({ isDateTimePickerVisible: !isDateTimePickerVisible })}
                            />
                          </TouchableOpacity>
                        </View>
                      </Col>
                      <Col size={35}>
                        <View style={{ marginTop: 5 }}>
                          <TouchableOpacity onPress={() => { this.setState({ isEndDateTimePickerVisible: !isEndDateTimePickerVisible }) }} style={{ marginLeft: 10, backgroundColor: '#f1f1f1', flexDirection: 'row' }}>
                            <Icon name='md-calendar' style={styles.calendarstyle} />
                            {this.state.endDatePlaceholder ?
                              <Text style={styles.startenddatetext}>{formatDate(this.state.medicine_take_end_date, 'DD/MM/YYYY')}</Text>
                              :
                              <Text style={styles.startenddatetext}>End Date</Text>
                            }
                            <DateTimePicker
                              mode={'date'}
                              is24Hour={false}
                              minimumDate={new Date()}
                              date={this.state.medicine_take_end_date}
                              isVisible={isEndDateTimePickerVisible}
                              onConfirm={this.handleEndDatePicked}
                              onCancel={() => this.setState({ isEndDateTimePickerVisible: !isEndDateTimePickerVisible })}
                            />
                          </TouchableOpacity>
                        </View>
                      </Col>
                    </Row>
                  </Form>
                  :
                  <Form style={{ marginTop: 5, marginBottom: 5, marginRight: 5 }}>
                    <Row>
                      <Col size={30}>
                        <Text style={styles.NumText}>Select Date</Text>
                      </Col>
                      <Col size={35} style={{ mariginTop: 10 }}>
                        <View style={{ marginTop: 5, }}>
                          <TouchableOpacity onPress={() => { this.setState({ isOnlyDateTimePickerVisible: !this.state.isOnlyDateTimePickerVisible }) }} style={{
                            backgroundColor: '#f1f1f1', flexDirection: 'row'
                          }}>
                            <Icon name='md-calendar' style={{ padding: 5, fontSize: 20, marginTop: 1, color: '#1296db' }} />
                            <Text style={{ marginTop: 7, marginBottom: 7, marginLeft: 5, fontFamily: 'OpenSans', fontSize: 13, textAlign: 'center', }}>{formatDate(this.state.medicine_take_one_date, 'DD/MM/YYYY')}</Text>
                            <DateTimePicker
                              mode={'date'}
                              minimumDate={new Date()}
                              date={this.state.medicine_take_one_date}
                              isVisible={this.state.isOnlyDateTimePickerVisible}
                              onConfirm={this.handleOnlyDateTimePicker}
                              onCancel={() => this.setState({ isOnlyDateTimePickerVisible: !this.state.isOnlyDateTimePickerVisible })}
                            />
                          </TouchableOpacity>
                        </View>
                      </Col>
                      <Col size={35}>

                      </Col>

                    </Row>
                  </Form>
                }
              </View>
              <Row>
                <Col size={4} style={{ mariginTop: 10, alignItems: 'flex-end' }}>

                  {this.state.pageContent == true ?

                    <Button style={styles.NextButton}
                      onPress={() => {
                        this.callNextButtonEvent()

                      }

                      }
                    >
                      <Text style={styles.NextButtonText}>Next</Text>
                    </Button>

                    :
                    <Button style={styles.NextButton} onPress={() => this.setState({ pageContent: true })}>
                      <Text style={styles.NextButtonText}>Edit</Text>
                    </Button>

                  }

                </Col>
              </Row>


              {this.state.pageContent === false ?
                  <View
                    pointerEvents={this.state.pageContent == false ? "auto" : "none"} style={this.state.pageContent == true ? styles.datetimedisabletext : styles.datetimeenabletext}
                    style={{ marginBottom: 10, marginTop: 10 }}>
                    <Row>
                      <Col size={4} style={{ mariginTop: 5 }}>
                        <Text style={styles.NumText}>Choose times</Text>
                      </Col>
                      <Col size={3.5} style={{ mariginTop: 5 }}>
                        <View style={{ alignItems: 'flex-start', marginTop: 5, padding: 1 }}>
                          <TouchableOpacity onPress={() => { this.setState({ isTimePickerVisible: !this.state.isTimePickerVisible }) }} style={styles.toucableOpacity}>
                            <Icon name='ios-clock' style={styles.tocuhIcon} />
                            {
                              this.state.timePlaceholder ?
                                <View>
                                  <Text style={styles.startenddatetext}>{formatDate(this.state.RecentylyPickedTime, 'hh:mm a')}</Text>
                                </View> :
                                <Text style={styles.startenddatetext}>Select time </Text>
                            }
                            <DateTimePicker
                              mode={'time'}
                              date={this.state.medicine_take_times}
                              isVisible={this.state.isTimePickerVisible}
                              onConfirm={this.handleTimePicker}
                              onCancel={() => this.setState({ isTimePickerVisible: !this.state.isTimePickerVisible })}


                            />

                          </TouchableOpacity>
                        </View>
                      </Col>
                    </Row>
                  </View> : null}


              {this.state.previewdisplay == true ?

                <View style={{ backgroundColor: '#f1f1f1', marginRight: 10, paddingBottom: 10, marginTop: 10, borderRadius: 5 }}>
                  <Row>
                    <Col size={5}>
                      <Text style={{ textAlign: 'left', marginTop: 10, marginLeft: 10 }}>Preview</Text>
                    </Col>
                    <Col size={5} style={{ alignItems: 'flex-end' }}>
                      <Row>
                        <Text style={{ textAlign: 'left', marginTop: 10, marginLeft: 10 }}>Notify Me</Text>
                        <Switch style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }], backgroundColor: 'fff', alignSelf: 'center', marginTop: 2 }} trackColor={{ true: '#6FC41A', false: 'grey' }}
                          trackColor={{ true: '#7F49C3' }}
                          thumbColor={"#F2F2F2"}
                          onValueChange={(val) => this.setState({ is_reminder_enabled: val })}
                          value={is_reminder_enabled}
                        />
                      </Row>
                    </Col>
                  </Row>
                  <Card style={{ borderRadius: 5, marginTop: 10 }}>
                    <Grid>
                      <Row style={{ marginTop: 5 }}>
                        <Col style={styles.col1}>
                          <View style={{ marginLeft: 15 }}>
                            <Text style={styles.mednamestyle}>{medicine_name}</Text>
                            <Text style={styles.innerText}>{medicine_form}</Text>
                            <Text style={styles.innerText}>{medicine_strength}</Text>
                          </View>
                        </Col>
                        <Col style={styles.col2}>
                          <Row>

                            <Col size={8}>
                              <FlatList
                                data={this.medicineTakeTimes}
                                extraData={this.medicineTakeTimes}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                  <Row>
                                    <Col size={7}>
                                      <Text style={{ marginLeft: 15, color: '#000' }}>{formatDate(item.medicine_take_time, 'hh:mm a')}</Text>
                                    </Col>
                                    <Col size={3}>
                                      <Icon onPress={() => this.delete(index)} name={IS_IOS ? 'ios-close-circle' : 'md-close-circle'}
                                        style={{ color: 'red', fontSize: 15 }} />
                                    </Col>
                                  </Row>
                                )} />
                            </Col>


                          </Row>
                        </Col>
                      </Row>
                    </Grid>
                    {medicinePeriod === 'everyday' ?
                      <View style={{ marginTop: 5, borderTopColor: 'gray', borderTopWidth: 1, }}>
                        <Text style={styles.remText}>Your Reminder Time is at {formatDate(medicine_take_start_date, 'DD/MM/YYYY')} - {formatDate(medicine_take_end_date, 'DD/MM/YYYY')}</Text>
                      </View>
                      :
                      <View style={{ marginTop: 5, borderTopColor: 'gray', borderTopWidth: 1, }}>
                        <Text style={styles.remText}>Your Reminder Time is on {formatDate(medicine_take_one_date, 'DD/MM/YYYY')}</Text>
                      </View>}
                  </Card>
                </View>

                :
                <View style={{ backgroundColor: '#F1F1F1', marginTop: 10, paddingBottom: 10 }}>

                  <View>
                    <Text style={{ marginBottom: 5, marginTop: 10, textAlign: 'center' }}>Preview</Text>
                    <Image source={require('../../../../assets/images/Remindericon.png')} style={{ height: 150, width: 150, marginLeft: 90 }} />
                    <Text style={{ color: '#d83939', textAlign: 'center' }}>No Reminder is available now!</Text>
                  </View>
                </View>}

              <View style={{ marginTop: 10 }}>

                <Button style={{ marginTop: 5, backgroundColor: '#1296db', height: -40, borderRadius: 5, justifyContent: 'center' }} onPress={this.AddReminderDatas}>

                  <Text style={{ width: 475, fontWeight: 'bold', textAlign: 'center' }}>SET MEDICINE REMINDER</Text>
                </Button>

              </View>
            </View>
          </Content>
        </ScrollView>
      </Container>
    )
  }
}



function homeState(state) {

  return {
    reminder: state.reminder
  }
}
export default connect(homeState)(AddReminder)

const styles = StyleSheet.create({

  toucableOpacity: {
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
  },

  tocuhIcon: {
    padding: 5,
    fontSize: 20,
    marginTop: 1,
    color: '#1296db'
  },

  tochText: {
    marginTop: 7,
    marginBottom: 7,
    fontFamily: 'OpenSans',
    fontSize: 16,
    textAlign: 'center',

  },
  NextButtonText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  // BackButtonText: {
  //   fontFamily: 'OpenSans',
  //   fontSize: 14,
  //   color: '#fff',
  //   textAlign: 'center',
  //   fontWeight: 'bold'
  // },
  RemainderButtonText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  RemainderButton: {
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    marginLeft: 10,
    padding: 5,
    backgroundColor: '#1296db'
  },
  NextButton: {
    borderRadius: 5,
    height: 40,
    padding: 5,
    justifyContent: 'center',
    backgroundColor: '#1296db'
  },
  // BackButton: {
  //     borderRadius: 5,
  //     height: 40,
  //     marginTop: 5,
  //     marginLeft: 5,
  //     padding: 0,
  //     backgroundColor: '#1296db'

  buttonStyle: {
    marginTop: 15,
    borderRadius: 10,
    marginBottom: 10,

    backgroundColor: '#5bb85d'
  },
  customizedText: {
    fontFamily: 'OpenSans',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  startenddatetext: {
    marginTop: 7,
    marginBottom: 7,
    fontFamily: 'OpenSans',
    fontSize: 13,
    textAlign: 'center',
    marginLeft: 5
  },
  NumText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    marginTop: 15,
  },
  autoField: {
    height: 45,
    backgroundColor: '#F1F1F1',
    paddingLeft: 10,
    borderRadius: 5,
    marginTop: 5,

  },
  medicineenabletext: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5
  },
  medicinedisabletext: {
    backgroundColor: '#E6E6E6',
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5
  },
  datetimedisabletext: {
    marginTop: 5,
    backgroundColor: '#E6E6E6',
    paddingLeft: 5,
    borderRadius: 5,

  },
  datetimeenabletext: {
    marginTop: 5,
    backgroundColor: '#fff',
    paddingLeft: 5,
    borderRadius: 5,

  },
  calendarstyle: {
    padding: 4,
    fontSize: 20,
    color: '#1296db',
    marginTop: 1
  },
  formstrengthtext: {
    marginLeft: 10,
    fontSize: 10,
    marginTop: 5,
    color: '#6f6f6f'
  },
  datetext: {
    fontSize: 12,
    marginTop: 5,
    color: '#6f6f6f',
    marginLeft: 10

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
  remText: {
    textAlign: 'center',
    paddingBottom: 5,
    paddingTop: 5,
    fontFamily: 'OpenSans',
    fontSize: 14, color: '#7F49C3'
  }
})
