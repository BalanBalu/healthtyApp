import React, { Component } from 'react';
import { Container, Content, View, Card, Grid, CardItem, Text, Switch, Right, Item, Spinner, Radio, Row, Col, Form, Button, Left } from 'native-base';
import { StyleSheet, TextInput, AsyncStorage } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import CalendarStrip from 'react-native-calendar-strip';
import { getReminderData, addReminderdata } from '../../providers/reminder/reminder.action.js';
import { formatDate } from "../../../setup/helpers";
import RNCalendarEvents from 'react-native-calendar-events';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';



class Reminder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      isLoading: true,
      selectedDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
      startDate: formatDate(new Date(), 'YYYY-MM-DD'),
      endDate: formatDate(new Date(), 'YYYY-MM-DD') 
    }
  }


  async componentDidMount() {
    this.getAllReminderdata();
    let _id = ''
    let value = ''
    let date = ''

    this.setStatus(_id, value);
    this.onDateChanged(_id, date)
  }



  getAllReminderdata = async () => {
    try {
      this.setState({
        isLoading: true
      })
      let userId = await AsyncStorage.getItem('userId');
      let result = await getReminderData(userId);
      if (result.success) {
        await this.setState({ data: result.data })
        console.log('this.state.data=========>', this.state.data)
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  

   onDateChanged  = async (data1, date) => {
   
    alert(JSON.stringify(date))
    let selectedDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    let startDate = formatDate(new Date(), 'YYYY-MM-DD');
    let endDate = formatDate(new Date(), 'YYYY-MM-DD');
   
  
        date = this.state.selectedDate
        
alert(this.state.selectedDate)
    if(this.state.selectedDate){
     
      await this.getAllReminderdata()
      getAllReminderdata._id = medicine_take_start_date.data1 =  medicine_take_end_date.data1 
      alert(getAllReminderdata)
      if(getAllReminderdata){

        medicine_take_start_date.data1 = startDate
        medicine_take_end_date.data1 = endDate

      }
      else{
        null
      }
    }
  }






  setStatus = async (data1, value) => {
    console.log(JSON.stringify(data))
    let   obj = {
      reminder_id: data1._id,
      reminder_type: data1.reminder_type,
      medicine_name: data1.medicine_name,
      medicine_form: data1.medicine_form,
      medicine_strength: data1.medicine_strength,
      medicine_take_times: data1.medicine_take_times,
      is_reminder_enabled: data1.is_reminder_enabled,
      active: value
    }
    if (obj.reminder_type == "everyday") {
      obj.medicine_take_start_date = data1.medicine_take_start_date,
        obj.medicine_take_end_date = data1.medicine_take_end_date
    }
    else {
      obj.medicine_take_start_date = data1.medicine_take_start_date
    }
    console.log("obj.active+++++++" + obj.active)
    let userId = obj.reminder_id;
    let result = await addReminderdata(userId, obj)
    this.setState({ value: !value })
    var temp = [...this.state.data]
    temp.map((t) => {
      if (t._id == data1._id) {
        t.active = value
      }
    })
    this.setState({ data: temp })
  }

  backNavigation  = async (navigationData) => {
    try {
      if (navigationData.action) {
        await this.getAllReminderdata();
      } else {
        return null
      }
    } catch (e) {
      console.log(e)
    }

  }

   calendar

  render() {
    const { index, isLoading,} = this.state;
    return (
      <Container>
        <Content style={{ backgroundColor: '#F1F1F1' }}>
        

          <View>
          <View style={{ paddingBottom: 10, backgroundColor: '#FFF' }}>
          <NavigationEvents
                  onWillFocus={payload => { this.backNavigation(payload) }} />
            <CalendarStrip
              calendarAnimation={{ type: 'sequence', duration: 30 }}
              selection={'border'}
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
            />
            <Text style={{ color: '#7F49C3', textAlign: 'center', marginTop: 2, fontFamily: 'OpenSans', fontWeight: "500" }}>Today</Text>
          </View>


          {isLoading == true ?
            <Spinner color='blue'
              visible={isLoading}
              overlayColor="none"
            /> :

            data.length == 0 ?
              <View style={{ alignItems: 'center', justifyContent: 'center', height: 550 }}>
                <Text> No Blood Donors</Text>
              </View>

              :
          <View style={{ paddingRight: 10, paddingLeft: 10 }}>
            <FlatList data={this.state.data}
              keyExtractor={({ _id }, index) => _id.toString()}
              extraData={this.state}
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

                          <Col size={8}>
                            <FlatList
                              data={item.medicine_take_times}
                              extraData={item}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({ item }) => (
                                <Text style={{ marginLeft: 15, color: '#000' }}>{formatDate(item.medicine_take_times, 'HH:mm A')}</Text>

                              )} />
                          </Col>

                          <Col size={2}>
                            
                            <Switch style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }], backgroundColor: 'fff' }} trackColor={{ true: '#6FC41A', false: 'grey' }}
                              trackColor={{ true: '#7F49C3' }}
                              thumbColor={"#F2F2F2"}
                              onValueChange={(val) => this.setStatus(item, val)}
                              value={item.active}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Grid>
                  <View style={{ marginTop: 5, borderTopColor: 'gray', borderTopWidth: 1, }}>
                    <Text style={styles.remText}>Your Remainder Time is at {formatDate(item.medicine_take_start_date, 'DD/MM/YYYY')} - {formatDate(item.medicine_take_end_date, 'DD/MM/YYYY')}</Text>
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

export default Reminder

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