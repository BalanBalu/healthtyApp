import React, { Component } from 'react';
import { Container, Content, View, Card, Grid, CardItem, Text, Switch, Right, Item, Spinner, Radio, Row, Col, Form, Button, Left } from 'native-base';
import { StyleSheet, TextInput, AsyncStorage } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import CalendarStrip from 'react-native-calendar-strip';
import { getReminderData } from '../../providers/reminder/reminder.action.js';
import { formatDate } from "../../../setup/helpers";
import RNCalendarEvents from 'react-native-calendar-events';


class Reminder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      isLoading: true

    }
  }
  componentDidMount() {
    const status = RNCalendarEvents.authorizationStatus()
   // alert(status);
    this.getAllReminderdata();
  }

  getAllReminderdata = async () => {
    try {
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


  render() {
    const { data } = this.state;
console.log(this.state.data)
    // const Reaminder = [{ medname: 'Acentaminophen', content: '10 mg   1 pill(s)', time: '7:00 AM', remtime: 'Your Remainder Time is at 7:00 AM, Oct 24,2019.' },
    // { medname: 'Acentaminophen', content: '13 mg   1 pill(s)', time: '10:00 AM', remtime: 'Your Remainder Time is at 10:00 AM, Oct 24,2019.' },
    // { medname: 'Acentaminophen', content: '15 mg   1 pill(s)', time: '11:00 AM', remtime: 'Your Remainder Time is at 1:00 PM, Oct 24,2019.' },
    // { medname: 'Acentaminophen', content: '20 mg   1 pill(s)', time: '4:00 PM', remtime: 'Your Remainder Time is at 4:00 PM, Oct 24,2019.' },
    // { medname: 'Acentaminophen', content: '10 mg   1 pill(s)', time: '9:00 PM', remtime: 'Your Remainder Time is at 9:00 PM, Oct 24,2019.' }]
    return (
      <Container>
        <Content style={{ backgroundColor: '#F1F1F1' }}>
          <View style={{ paddingBottom: 10, backgroundColor: '#FFF' }}>
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
              iconContainer={{ flex: 0.1 }}
            />
            <Text style={{ color: '#7F49C3', textAlign: 'center', marginTop: 2, fontFamily: 'OpenSans', fontWeight: "500" }}>Today</Text>
          </View>


<View style={{paddingRight:10,paddingLeft:10}}>
          <FlatList data={data}
            keyExtractor={(item, index) => index.toString()}

            renderItem={({ item }) => (
                    <Card style={{borderRadius:5,marginTop:10}}>
                     <Grid>
                      <Row style={{marginTop:5}}>
                       <Col style={styles.col1}>
                        <View style={{marginLeft:15}}>
                          <Text style={styles.mednamestyle}>{item.medicine_name}</Text>
                          <Text  style={styles.innerText}>{item.medicine_form}</Text>
                          <Text  style={styles.innerText}>{item.medicine_strength}</Text>
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
                           trackColor={{ true: '#7F49C3'}}
                          thumbColor={"#F2F2F2"}
                          onValueChange={this.toggleSwitch}
                          value={true} />
                           </Col>
                          
                           </Row>
                       </Col>
                      </Row>
                     </Grid>
                    <View style={{marginTop:5,borderTopColor:'gray',borderTopWidth:1,}}> 
                      <Text style={styles.remText}>Your Remainder Time is at {formatDate(item.medicine_take_start_date, 'DD/MM/YYYY')} - {formatDate(item.medicine_take_end_date, 'DD/MM/YYYY')}</Text>
                    </View>
                 </Card>
             )}/>
             </View>

















          {/* <FlatList data={data}
            keyExtractor={(item, index) => index.toString()}

            renderItem={({ item }) => (
              <View style={{ marginLeft: 15, marginRight: 15, }}>
                <Card style={{ marginTop: 15 }}>
                  <Grid style={{ paddingBottom: 10 }}>
                    <Row style={{ backgroundColor: '#7F49C3', paddingTop: 5, paddingBottom: 5 }}>
                      <Col>
                        <FlatList 
                        data={item.medicine_take_times}
                        extraData={item}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item }) => (
                            <Text style={{ marginLeft: 15, color: '#FFF' }}>{formatDate(item.medicine_take_times, 'HH:mm A')}</Text>

                          )} />
                      </Col>
                      <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Switch style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }], backgroundColor: 'fff' }} trackColor={{ true: '#6FC41A', false: 'grey' }}
                          thumbColor={"white"}
                          onValueChange={this.toggleSwitch}
                          value={true} />
                      </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                      <Col>
                        <Text style={{ marginLeft: 15, fontFamily: 'OpenSans', fontWeight: '500' }}>{item.medicine_name}</Text>
                      </Col>
                      <Col>
                        <Text style={{ textAlign: 'right', marginRight: 5, fontSize: 12, color: '#6c6c6c', fontWeight: "100", marginTop: 3 }}>{item.medicine_form + '  ' + item.medicine_strength} </Text>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                      
                          <Text style={{ marginLeft: 15, color: '#2fbf1c', fontSize: 12, fontFamily: 'OpenSans', fontWeight: "300" }}>Your Remainder Time is at {formatDate(item.medicine_take_start_date, 'DD/MM/YYYY')} - {formatDate(item.medicine_take_end_date, 'DD/MM/YYYY')}</Text>
                    </Row>
                  </Grid>
                </Card>
              </View>
            )} /> */}
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