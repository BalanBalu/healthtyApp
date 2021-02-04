import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  Input,
  Item,
  DatePicker,
  Content
} from 'native-base';
import {Col, Row} from 'react-native-easy-grid';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { subTimeUnit, formatDate } from "../../../../setup/helpers";


 export default class ClaimInitiationSubmission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      chosenDate: new Date(),
      isLoading: false,
      dob: ''
    };
    this.setDate = this.setDate.bind(this);
  }
  setDate(newDate) {
    this.setState({chosenDate: newDate});
  }
  async componentDidMount() {
    this.setState({isLoading: false});
  }

  render() {
   const {policyNo,MemberId,HospitalName,admissionDate,ailment,contactNum,dob}=this.state;
    return (
      <Container>     
        <Content>   
        <Row size={4} style={{marginLeft: 20,marginRight:20,marginTop:10}}>
          <Col size={1}>
            <Text
              style={styles.text}>
              Policy Number
            </Text>
            <Item regular style={{borderRadius: 6}}>
              <Input
              
                placeholder="Enter Policy Number"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                value={policyNo}
                keyboardType={"default"}
                onChangeText={enteredPolicyText => this.setState({ policyNo:enteredPolicyText })}
                blurOnSubmit={false}
                onSubmitEditing={() => { this.policyNo._root.focus(); }}
              />
            </Item>
          </Col>
        </Row>
        <Row size={4} style={{marginLeft: 20,marginRight:20,marginTop:10}}>
          <Col size={1}>
            <Text
              style={styles.text}>
              Member Id
            </Text>

            <Item regular style={{borderRadius: 6}}>
              <Input
                 placeholder="Enter Member Id"
                 placeholderTextColor={'#CDD0D9'}
                 returnKeyType={'next'}
                 value={MemberId}
                 keyboardType={"number-pad"}
                 onChangeText={enteredMemberIdText => this.setState({MemberId: enteredMemberIdText })}
                 blurOnSubmit={false}
                 onSubmitEditing={() => { this.MemberId._root.focus(); }}
              />
            </Item>
          </Col>
        </Row>
        <Row size={4} style={{marginLeft: 20,marginRight:20,marginTop:10}}>
          <Col size={1}>
            <Text
              style={styles.text}>
              Hospital
            </Text>
            <Item regular style={{borderRadius: 6}}>
              <Input
              
                placeholder="Enter Hospital name"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                value={HospitalName}
                keyboardType={"default"}
                onChangeText={HospitalName => this.setState({HospitalName })}
                blurOnSubmit={false}
                onSubmitEditing={() => { this.HospitalName._root.focus(); }}
              />
            </Item>
          </Col>
        </Row>
        <Row size={4} style={{marginLeft: 20,marginRight:20,marginTop:10}}>
          <Col size={1}>
            <Text
              style={styles.text}>
              Date of Admission
            </Text>
            <TouchableOpacity>
            <Item regular style={{borderRadius: 6, height: 50, width: 370 }}>  

              <DatePicker style={styles.userDetailLabel}
                                                    defaultDate={dob}
                                                    timeZoneOffsetInMinutes={undefined}
                                                    modalTransparent={false}
                                                    minimumDate={new Date(1940, 0, 1)}
                                                    maximumDate={subTimeUnit(new Date(), 1, 'year')}
                                                    animationType={"fade"}
                                                    androidMode={"default"}
                                                    placeHolderText={dob === '' ? "Date Of Birth" : formatDate(dob, 'DD-MM-YYYY')}
                                                    textStyle={{ color: "#5A5A5A" }}
                                                    value={dob}
                                                    placeHolderTextStyle={{ color: "#5A5A5A" }}
                                                    onDateChange={dob => {this.setState({ dob }) }}
                                                    disabled={this.dobIsEditable}
                                                />
      
              {/* <DatePicker
                style={{ height: 45, width: 395 }}             
                defaultDate={new Date()}
                minimumDate={new Date()}
                maximumDate={new Date()}
                locale={'en'}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={'fade'}
                androidMode={'default'}
                placeHolderText="Enter date of admission"
                textStyle={{color: '#000000'}}
                placeHolderTextStyle={{color: '#d3d3d3'}}
                onDateChange={this.setDate}
                disabled={false}
              />    */}
             <AntDesign name='calendar' style={{ fontSize: 20, color: '#775DA3' }} />
            </Item>
            </TouchableOpacity>
          </Col>
        </Row>
        <Row size={4} style={{marginLeft: 20,marginRight:20,marginTop:10}}>
          <Col size={1}>
            <Text
              style={styles.text}>
              Ailment
            </Text>
            <Item regular style={{borderRadius: 6}}>
              <Input
                placeholder="Enter ailment details"
                placeholderTextColor={'#CDD0D9'}
              />
            </Item>
          </Col>
        </Row>
        <Row size={4} style={{marginLeft: 20,marginRight:20,marginTop:10}}>
          <Col size={1}>
            <Text
              style={styles.text}>
              Contact Number
            </Text>
            <Item regular style={{borderRadius: 6}}>
              <Input
                placeholder="Enter contact number"
                placeholderTextColor={'#CDD0D9'}
              />
            </Item>
          </Col>
        </Row>
        <Row size={4} style={{marginLeft: 20,marginRight:20,marginTop:20,marginBottom:20}}>
          <Col size={4}>
            <View style={{display: 'flex'}}>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <TouchableOpacity style={styles.appButtonContainer}>
                  <Text style={styles.appButtonText}>SUBMIT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Col>
        </Row>
        </Content>
      </Container>
    );
  }
}
const width_proportion = '80%';
const height_proportion = '40%';
const styles = StyleSheet.create({
  text: {
    padding: 8,
    paddingLeft: 0,
    fontWeight: 'bold',
    color: '#4B5164',
  },
  inputView: {
    padding: 20,
    display: 'flex',
  },
  appButtonContainer: {
    elevation: 8,
    width: 150,
    backgroundColor: '#7F49C3',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});

