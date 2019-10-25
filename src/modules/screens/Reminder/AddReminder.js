import React, { Component } from 'react';
import { Container, Content, View, Text, Item,Card, Spinner,Picker,Icon, Radio,Row,Col,Form,Button } from 'native-base';
import {StyleSheet,TextInput,TouchableOpacity} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import Autocomplete from '../../../components/Autocomplete'
import { RadioButton } from 'react-native-paper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {formatDate} from "../../../setup/helpers";

class Reminder extends Component {
    constructor(props) {
        super(props)
        this.state = {
          selected2: undefined,
         selected3:undefined,
          takemed:'Yes',
          selectedDate:new Date() ,
          minimumDate:new Date(),
        }
        this.pastSelectedDate=new Date(),
	   this.upcommingSelectedDate=new Date()
    }
    onValueChange2(value) {
      this.setState({
        selected2: value
      });
    }
    onValueChange3(value) {
      this.setState({
        selected3: value
      });
    }
   
    showDateTimePicker = () => {
      this.setState({ isDateTimePickerVisible: true });
    };
    
    hideDateTimePicker = () => {
      this.setState({ isDateTimePickerVisible: false });
    };
    
    handleDatePicked =async(time) => {
    
      this.setState({ selectedDate: new Date(time) });

    /*	let filterData=	this.state.activeTab=='UPCOMING'? 
        this.state.upcommingAppointmentData:this.state.pastAppointmentData
       if(this.state.activeTab=='UPCOMING'){
         this.upcommingSelectedDate=new Date(date)
       }
       else {
         this.pastSelectedDate=new Date(date)
       } */
       this.hideDateTimePicker();
    };
    render() {
      const Slots= [{time:'10:00',timeperiod:'Am'},{time:'11:00',timeperiod:'Am'},{time:'12:00',timeperiod:'Am'},
   {time:'10:00',timeperiod:'Am'},{time:'11:00',timeperiod:'Am'},{time:'12:00',timeperiod:'Am'}
  ]
      const { isDateTimePickerVisible,selectedDate } = this.state;
        return (
            <Container>
            <Content style={{padding:30}}>
                <View style={{marginBottom:30}}>
                     
                       <View >
                         <Text style={styles.NumText}>What medicine would you like to add ?</Text>
                         <Form>
                         <Autocomplete style={styles.autoField}/>   
                         </Form>
                 </View>
                 <View>
                 <Text style={styles.NumText}>What form is the medicine ?</Text>
                 <Form style={{marginTop:5}}>
                   <Card picker style={{height:40,justifyContent:'center'}}>
                     <Picker
                       mode="dropdown"
                       style={{ width: undefined }}
                       placeholder="Select your SIM"
                       placeholderStyle={{ color: "#bfc6ea" }}
                       placeholderIconColor="#007aff"
                       selectedValue={this.state.selected2}
                       onValueChange={this.onValueChange2.bind(this)}
                     >
                       <Picker.Item label="Pill" value="key0" />
                       <Picker.Item label="Solution" value="key1" />
                       <Picker.Item label="Injection" value="key2" />
                       <Picker.Item label="Powder" value="key3" />
                       <Picker.Item label="Drops" value="key4" />
                       <Picker.Item label="Inhales" value="key4" />
                       <Picker.Item label="Other" value="key4" />
                     </Picker>
                   </Card>
                 </Form>
                 </View>
                 <View>
                 <Text style={styles.NumText}>What strength is the medicine ?</Text>
                 <Form style={{marginTop:5}}>
                    <Card picker style={{height:40,justifyContent:'center'}}>
                      <Picker
                        mode="dropdown"
                        style={{ width: undefined }}
                        placeholder="Select your SIM"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.selected3}
                        onValueChange={this.onValueChange3.bind(this)}
                      >
                        <Picker.Item label="g" value="key0" />
                        <Picker.Item label="IU" value="key1" />
                        <Picker.Item label="mcg" value="key2" />
                        <Picker.Item label="mEq" value="key3" />
                        <Picker.Item label="mg" value="key4" />
                      </Picker>
                    </Card>
                 </Form>
                <View>
                <Text style={styles.NumText}>Do you need to take this medicine every day ?</Text>
                <Item style={{ marginTop: 10, borderBottomWidth: 0,  }}>
              <RadioButton.Group
              onValueChange={value => this.setState({ takemed: value }) }
               value={this.state.takemed}>
                <View style={{flexDirection:'row'}}>
                   <RadioButton value="yes" />
                 <Text style={{
                        fontFamily: 'OpenSans',fontSize:15,marginTop:8
                   }}>yes</Text> 
                </View>
                <View style={{flexDirection:'row',marginLeft:10}}>
                  <RadioButton value="Only as needed" style={{marginLeft:20}}/>
                 <Text style={{
                        fontFamily: 'OpenSans',fontSize:15,marginTop:8
                   }}>Only as needed</Text>
                </View>
            </RadioButton.Group>   
           </Item>
           </View>
          <View>
             <Text style={styles.NumText}>How often do you take it ?</Text>
             <View style={{flexDirection:'row'}}>
               <Text style={{fontFamily:'OpenSans',fontSize:13,marginTop:15}}>Choose Your Time</Text>
               <View style={{alignItems:'flex-start',marginTop:10,marginLeft:10}}>
                 <TouchableOpacity onPress={this.showDateTimePicker} style={styles.toucableOpacity}>
                   <Icon name='md-clock' style={styles.tocuhIcon} />
                   <Text style={styles.tochText}>{formatDate(selectedDate, 'HH:MM a')}</Text>
                   <DateTimePicker
                    mode='time'
				   				  minimumDate={new Date()}
				   				  date={selectedDate}
                    isVisible={isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
								    onCancel={this.hideDateTimePicker}
									  datePickerModeAndroid='default'
								   />
                </TouchableOpacity>
              </View>
              <Button  style={styles.RemainderButton} >
                  <Text style={styles.RemainderButtonText}>Add</Text>
              </Button>
              </View>
           <Row style={{marginTop:10, borderColor:'gray',borderWidth:1,borderRadius:5,padding:10,justifyContent:"center"}}>
            <FlatList
             data={Slots}
            numColumns={3}
            renderItem={
            ({ item }) =>
             <Col style={{width:'25%',alignItems:'center',marginTop:10,marginLeft:20}}>
              <TouchableOpacity style={styles.touchbutton}>
             <Row>
             <Text style={styles.timeText}>{item.time}</Text>
             <Text style={styles.periodText}>{item.timeperiod}</Text>
            </Row> 
  
           </TouchableOpacity>
              
            </Col>
           }/>
        </Row>
        <Button block style={styles.buttonStyle}><Text style={styles.customizedText}> Submit </Text></Button>
        </View>
     </View>
    </View>
    </Content>
</Container>
        )
    }
}

export default Reminder

const styles = StyleSheet.create({

  toucableOpacity:{
    flexDirection: 'row',
    paddingLeft:15,
    paddingRight: 15,
    borderColor:'gray',
    borderWidth:1,
    justifyContent:'center',
    borderRadius:10,
    shadowOffset:{ width: 0, height: 0, },
    shadowColor: '#EBEBEB',
    shadowOpacity: 1.0,
  },
  tocuhIcon:{
    padding: 5, 
    
    fontSize:20
  },
  tochText:{
    marginTop:7 ,
    fontFamily: 'OpenSans', 
    fontSize: 13,
    fontWeight:'bold'
  },
 

  RemainderButtonText:{
    fontFamily:'OpenSans',
    fontSize:14,
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold'
  },
  RemainderButton:{
    borderRadius:10,
    height:30,
    marginTop:11,
    marginLeft:10,
    backgroundColor:'#878787'
  },
  buttonStyle:{
          marginTop: 15, 
           borderRadius: 10, 
         marginBottom: 10,
    
          backgroundColor:'#5bb85d'
  },
  customizedText: {
            fontFamily: 'OpenSans',
           fontSize: 20,
           fontWeight:'bold',
            color:'#fff'
        },
        NumText:{
          fontFamily:'OpenSans',
          fontSize:16,
          marginTop:10
        },
        autoField:{
          height: 45, 
          backgroundColor: '#F1F1F1', 
          paddingLeft: 10,
          borderRadius: 5,
          marginTop:5
        },
        touchbutton:{
          borderRadius:5,
          borderColor:'#7f49c3',
          borderWidth:2,
          backgroundColor:'#fff',
          padding:6,
          height:30,
          paddingHorizontal: 15
        },
        timeText:{
          textAlign:'center',
          fontSize:10,
          fontWeight:'bold',
          marginTop:1,
        },
        periodText:{
          textAlign:'center',
          borderBottomLeftRadius:0,
          borderTopLeftRadius:0,
          fontSize:10,
          fontWeight:'bold',
          marginLeft:3,
          paddingHorizontal: 5
        }
  

})