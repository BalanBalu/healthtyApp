import React, { Component } from 'react';
import { Container, Content, View, Text, Item,Card, Spinner,Picker,Icon, Radio,Row,Col,Form,Button, Input,Grid } from 'native-base';
import {StyleSheet,TextInput,TouchableOpacity,ScrollView,Image} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import Autocomplete from '../../../components/Autocomplete'
import { RadioButton } from 'react-native-paper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {formatDate} from "../../../setup/helpers";

class AddReminder extends Component {
    constructor(props) {
        super(props)
        this.state = {
          selected2: undefined,
         selected3:undefined,
          takemed:null,
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
    onValueChange4(value) {
      this.setState({
        selected4: value
      });
    }
    onValueChange5(value) {
      this.setState({
        selected5: value
      });
    }
    onValueChange6(value) {
      this.setState({
        selected6: value
      });
    }
    onValueChange7(value) {
      this.setState({
        selected7: value
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
      const Slots= [{time:'10:00',timeperiod:'am'},{time:'11:00',timeperiod:'am'},{time:'12:00',timeperiod:'am'},
   {time:'10:00',timeperiod:'am'},{time:'11:00',timeperiod:'am'},{time:'12:00',timeperiod:'am'}
  ]
      const { isDateTimePickerVisible,selectedDate } = this.state;
        return (
            <Container>
              <ScrollView>
            <Content style={{padding:20}}>
                <View style={{marginBottom:30}}>
                     
                        <View >
                         <Text style={styles.NumText}>What Medicine would you like to add ?</Text>
                         <Form>
                         <TextInput style={styles.autoField} placeholder="Medicine name"/>   
                         </Form>
                 </View>
                 <View>
                   <Row>
                   <Col>
                 <Text style={styles.NumText}>From of Medicine</Text>
                 <Form style={{marginTop:5}}>

                   <View picker style={{height:40,width:150,justifyContent:'center',backgroundColor:'#F1F1F1',borderRadius:5}}>
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
                   </View>
                 </Form>
                 </Col>
                 <Col>
                 <Text style={styles.NumText}>Strength of Medicine</Text>
                 <Form style={{marginTop:5}}>
                 <View picker style={{height:40,width:150,justifyContent:'center',backgroundColor:'#F1F1F1',borderRadius:5}}>
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
                 </View>
                 </Form>
                 </Col>
                 </Row>
                 </View>
                <View>
                <Text style={styles.NumText}>How often would you take this Medicine</Text>
                <Item style={{ marginTop: 10, borderBottomWidth: 0,  }}>
                
                <RadioButton.Group
              onValueChange={value => this.setState({ takemed: value }) }
               value={this.state.takemed}>
                <View style={{flexDirection:'row'}}>
                   <RadioButton value="yes" color={'#1296db'} uncheckedColor={'#1296db'} />
                 <Text style={{
                        fontFamily: 'OpenSans',fontSize:15,marginTop:8
                   }}>Everyday</Text> 
                </View>
                <View style={{flexDirection:'row',marginLeft:10}}>
                  <RadioButton value="Only as needed" style={{marginLeft:20}} color={'#1296db'} uncheckedColor={'#1296db'}/>
                 <Text style={{
                        fontFamily: 'OpenSans',fontSize:15,marginTop:8
                   }}>Only when I need</Text>
                </View>
            </RadioButton.Group>

              
                </Item>
            </View>



{/*           
            <View>
            <Form style={{marginTop:5}}>
              <Row>
                <Col size={3}>
            <Text style={styles.NumText}>Select Date</Text>
            </Col>
            <Col size={7} style={{width:150}}>
            <View style={{marginBottom:15}}>
              <Row>
                <Col size={3.5}  style={{mariginTop:10}}> 
                <View style={{alignItems:'flex-start',marginTop:5,marginRight:40}}>
                 <TouchableOpacity onPress={this.showDateTimePicker} style={{width:225,backgroundColor:'#f1f1f1',flexDirection:'row'}}>
                 <Icon name='md-calendar' style={{padding: 5,marginLeft:50,fontSize:20,marginTop:1,color:'#1296db'}} />
                   <Text style={{marginTop:7, marginBottom:7,marginLeft:5,fontFamily: 'OpenSans',fontSize:13,textAlign:'center',}}>{formatDate(selectedDate, 'DD/MM/YYYY')}</Text>
                   <DateTimePicker
                    mode='date'
				   				  minimumDate={new Date()}
				   				  date={selectedDate}
                    isVisible={isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
								    onCancel={this.hideDateTimePicker}
									  datePickerModeAndroid='default'
								   />
                </TouchableOpacity>
              </View>
              </Col>
              </Row>
              </View>

            </Col>
            </Row>
            </Form>
            </View>     */}





  <View>
            <Form style={{marginTop:5}}>
              <Row>
                <Col size={3}>
            <Text style={styles.NumText}>Select Date</Text>
            </Col>
            <Col size={7} style={{width:150}}>
            <View style={{marginBottom:10}}>
              <Row>
                <Col size={3.5}  style={{mariginTop:10}}> 
                <View style={{marginTop:5,}}>
                 <TouchableOpacity onPress={this.showDateTimePicker} style={{width:110,backgroundColor:'#f1f1f1',flexDirection:'row'}}>
                 <Icon name='md-calendar' style={{padding:4,fontSize:20,color:'#1296db',marginTop:1}} />
                   <Text style={{marginTop:7,marginBottom:7,fontFamily: 'OpenSans',fontSize: 13,textAlign:'center',marginLeft:5}}>{formatDate(selectedDate, 'DD/MM/YYYY')}</Text>
                   <DateTimePicker
                    mode='date'
				   				  minimumDate={new Date()}
				   				  date={selectedDate}
                    isVisible={isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
								    onCancel={this.hideDateTimePicker}
									  datePickerModeAndroid='default'
								   />
                </TouchableOpacity>
              </View>
              </Col>
              <Col size={3.5}  style={{mariginTop:10,marginLeft:-10}}> 
                <View style={{marginTop:5,}}>
                 <TouchableOpacity onPress={this.showDateTimePicker} style={{marginLeft:10,width:110,backgroundColor:'#f1f1f1',flexDirection:'row'}}>
                 <Icon name='md-calendar' style={{padding: 4,fontSize:20,color:'#1296db',marginTop:1}} />
                   <Text style={{marginTop:7,marginBottom:7,fontFamily: 'OpenSans',fontSize: 13,textAlign:'center',marginLeft:5}}>{formatDate(selectedDate, 'DD/MM/YYYY')}</Text>
                   <DateTimePicker
                    mode='date'
				   				  minimumDate={new Date()}
				   				  date={selectedDate}
                    isVisible={isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
								    onCancel={this.hideDateTimePicker}
									  datePickerModeAndroid='default'
								   />
                </TouchableOpacity>
              </View>
              </Col>
              </Row>
              </View>
              </Col>
            </Row>
            </Form>
            </View>   

           

            
            
            <View style={{marginBottom:10}}>
              <Row>
                <Col size={4}  style={{mariginTop:5}}>
                <Text style={styles.NumText}>Choose your time</Text>
                </Col>
                <Col size={3.5}  style={{mariginTop:5,}}> 
                <View style={{alignItems:'flex-start',marginTop:5,padding:1}}>
                 <TouchableOpacity onPress={this.showDateTimePicker} style={styles.toucableOpacity}>
                 <Icon name='ios-clock' style={styles.tocuhIcon} />
                   <Text style={{marginTop:7,marginBottom:7,fontFamily: 'OpenSans',fontSize: 13,textAlign:'center',marginLeft:5}}>{formatDate(selectedDate, 'HH:MM A')}</Text>
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
            </Col>
            <Col size={2.5}  style={{mariginTop:10}}>
            <Button  style={styles.RemainderButton} >
                  <Text style={styles.RemainderButtonText}>Add</Text>
              </Button>
            </Col>
                </Row>
                </View>
                <View style={{backgroundColor:'#F1F1F1',marginTop:10,paddingBottom:10}}> 
                  <View>
                <Text style={{marginBottom:5,marginTop:10,textAlign:'center'}}>Preview</Text> 
                  <Image source={require('../../../../assets/images/Remindericon.png')} style={{height:150,width:150,marginLeft:90}}/>
                  <Text style={{color:'#d83939',textAlign:'center'}}>No Reminder is avaialble now!</Text>  
                  </View>
                  </View> 

                


              {/* <Grid style={{backgroundColor:'#f1f1f1',marginLeft:10,marginRight:10,paddingBottom:10,marginTop:10,borderRadius:5}}>
                <Text style={{textAlign:'center',marginTop:10}}>Preview</Text>
              <Row style={{backgroundColor:'#FFF',marginTop:10,marginLeft:10,marginRight:10,borderRadius:5}}>
<Col size={8.5}>
  <Row style={{marginTop:5}}>
  <Col size={5}>
  <Text style={{marginLeft:10}}>Meclizine</Text>
  </Col>
  <Col size={5}>
  <Text style={{marginLeft:-35,fontSize:10,marginTop:5,color:'#6f6f6f'}}>(Pill, 10 mg)</Text>
  </Col>
  </Row>
  <Row style={{marginBottom:5}}>
  <Col size={5}>
  <Text style={{marginLeft:10,color:'#43be39'}}>10.00 AM</Text>
  </Col>
  <Col size={5}>
  <Text style={{fontSize:10,marginTop:5,color:'#6f6f6f',marginLeft:-35}}>(From 28/01/2020 - 10/02/2020)</Text>
  </Col>
  </Row>
  </Col>
  <Col size={1.5} style={{justifyContent:'center',alignItem:'center'}}>
  <Icon  style={{fontSize:20,color:'#bd0f10',alignItems:'flex-end',justifyContent:'flex-end',marginRight:15}} name="ios-close-circle"/>
  </Col>
</Row>
<Row style={{backgroundColor:'#FFF',marginTop:10,marginLeft:10,marginRight:10,marginBottom:20,borderRadius:5}}>
<Col size={8.5}>
  <Row style={{marginTop:5}}>
  <Col size={5}>
  <Text style={{marginLeft:10}}>Empagliflozin</Text>
  </Col>
  <Col size={5}>
  <Text style={{fontSize:10,marginTop:5,color:'#6f6f6f',marginLeft:-5}}>(Pill, 10 mg)</Text>

  </Col>
  </Row>
  <Row style={{marginBottom:5}}>
  <Col size={5}>
  <Text style={{marginLeft:10,color:'#43be39'}}>05.00 PM</Text>
  </Col>
  <Col size={5}>
  <Text style={{fontSize:10,marginTop:5,color:'#6f6f6f',marginLeft:-35}}>(15/02/2020)</Text>
  </Col>
  </Row>
  </Col>
  <Col size={1.5} style={{justifyContent:'center',alignItem:'center'}}>
  <Icon  style={{fontSize:20,color:'#bd0f10',alignItems:'flex-end',justifyContent:'flex-end',marginRight:15}} name="ios-close-circle"/>
  </Col>
</Row>
              </Grid>
               */}
                 <View style={{marginTop:10}}>
                 <Button  style={{marginTop:5,width:320,paddingLeft:100,backgroundColor:'#1296db',height:-40,borderRadius:5}} > 
                  <Text style={{width:475,fontWeight:'bold'}}>SET REMINDER</Text>
              </Button>
              </View>
    </View>
    </Content>
    </ScrollView>
</Container>
        )
    }
}

export default AddReminder

const styles = StyleSheet.create({

  toucableOpacity:{
    flexDirection: 'row',
    paddingLeft:5,
    paddingRight: 5,
   backgroundColor:'#f1f1f1',
    justifyContent:'center',
  },

  tocuhIcon:{
    padding: 5, 
    fontSize:20,
    marginTop:1,
    color:'#1296db'
  },
  
  tochText:{
    marginTop:7 ,
    marginBottom:7,
    fontFamily: 'OpenSans', 
    fontSize: 16,
    textAlign:'center',
    
  },
 

  RemainderButtonText:{
    fontFamily:'OpenSans',
    fontSize:14,
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold'
  },
  RemainderButton:{
    borderRadius:5,
    height:40,
    marginTop:5,
    marginLeft:10,
    padding:5,
    backgroundColor:'#1296db'
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
          marginTop:10,
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
          padding:4,
          height:30,
          
        },
        timeText:{
          textAlign:'center',
          fontSize:12,
          fontWeight:'bold',
          marginTop:1,
        },
        periodText:{
          textAlign:'center',
          borderBottomLeftRadius:0,
          borderTopLeftRadius:0,
          fontSize:12,
          fontWeight:'bold',
          marginLeft:3,
          paddingHorizontal: 5
        }
  

})








