import React, { Component } from 'react';
import { Container, Content, View, Text, Item,Card, Spinner,Picker,Icon, Radio,Row,Col,Form,Button, Input } from 'native-base';
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
                         <Text style={styles.NumText}>What medicine would you like to add ?</Text>
                         <Form>
                         <TextInput style={styles.autoField} placeholder="Medicine name"/>   
                         </Form>
                 </View>
                 <View>
                   <Row>
                   <Col>
                 <Text style={styles.NumText}>From of Medicine</Text>
                 <Form style={{marginTop:5}}>
                   <Card picker style={{height:40,width:150,justifyContent:'center'}}>
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
                 </Col>
                 <Col>
                 <Text style={styles.NumText}>strength of Medicine</Text>
                 <Form style={{marginTop:5}}>
                 <Card picker style={{height:40,width:150,justifyContent:'center'}}>
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
                 </Col>
                 </Row>
                 </View>
                <View>
                <Text style={styles.NumText}>How often would you take this Medicine</Text>
                <Item style={{ marginTop: 10, borderBottomWidth: 0,  }}>
                <RadioButton.Group>
                <RadioButton.Group
              onValueChange={value => this.setState({ takemed: value }) }
               value={this.state.takemed}></RadioButton.Group>
               <View style={{flexDirection:'row'}}>
                   <RadioButton value="yes"  uncheckedColor={'#1296db'} color={'#1296db'}/>
                 <Text style={{
                        fontFamily: 'OpenSans',fontSize:13,marginTop:8
                   }}>Everyday</Text> 
                </View>
                <View style={{flexDirection:'row',marginLeft:10}}>
                  <RadioButton value="Only as needed"  uncheckedColor={'#1296db'} color={'#1296db'} style={{marginLeft:20}}/>
                 <Text style={{
                        fontFamily: 'OpenSans',fontSize:13,marginTop:8
                   }}>Only when i needed</Text>
                </View>
                </RadioButton.Group> 
                </Item>
            </View>
            <View>
            <Form style={{marginTop:5}}>
              <Row>
                <Col size={3}>
            <Text style={styles.NumText}>Select Date</Text>
            </Col>
            <Col size={7}>
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
                        <Picker.Item label="30-01-2020" value="key0" />
                        <Picker.Item label="31-01-2020" value="key1" />
                        <Picker.Item label="01-02-2020" value="key2" />
                        <Picker.Item label="02-02-2020" value="key3" />
                        <Picker.Item label="03-02-2020" value="key4" />
                        <Picker.Item label="04-02-2020" value="key4" />
                      </Picker>
                 </Card>
            </Col>
            </Row>
            </Form>
            </View>
            <View>
              <Row>
                <Col size={4}>
                <Text style={styles.NumText}>Choose your time</Text>
                </Col>
                <Col size={3.5}> 
            <Card picker style={{height:40,Width:10,justifyContent:'center'}}>
                 <Picker
                        mode="dropdown"
                        style={{ width: undefined }}
                        placeholder="Time"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.selected3}
                        onValueChange={this.onValueChange3.bind(this)}
                      >
                        <Picker.Item label="05:00" value="key0" />
                        <Picker.Item label="06:00" value="key1" />
                        <Picker.Item label="07:00" value="key2" />
                        <Picker.Item label="08:00" value="key3" />
                        <Picker.Item label="09:00" value="key4" />
                        <Picker.Item label="10:00" value="key4" />
                      </Picker>
                 </Card>
            </Col>
            <Col size={2.5}>
            <Button  style={styles.RemainderButton} >
                  <Text style={styles.RemainderButtonText}>Add</Text>
              </Button>
            </Col>
                </Row>
                </View>
                <View style={{backgroundColor:'#F1F1F1',justifyContent:'center',alignItems:'center'}}>
                  <Image source={require('../../../../assets/images/Remindericon.png')} style={{height:100,width:100}}/>


                  
                </View>





            
            




















                {/*<View>
             
             <Row>
<Col size={3.5}>
<Text style={{fontFamily:'OpenSans',fontSize:13,marginTop:15}}>Choose Your Time</Text>
</Col>
<Col size={4}>
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
</Col>
<Col size={2.5}>
<Button  style={styles.RemainderButton} >
                  <Text style={styles.RemainderButtonText}>Add</Text>
              </Button>
</Col>
               
              
             
              </Row>
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
     </View> */}
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