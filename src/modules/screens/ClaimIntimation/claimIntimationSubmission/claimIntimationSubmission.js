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


 export default class ClaimInitiationSubmission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      chosenDate: new Date(),
      isLoading: false,
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
    if (this.state.isLoading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color="#7E49C3"
            style={{marginTop: 100}}
          />
        </View>
      );
    }
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
                placeholder="Enter your member Id"
                placeholderTextColor={'#CDD0D9'}
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
                placeholder="Enter Hospital Name"
                placeholderTextColor={'#CDD0D9'}
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
              <DatePicker
                style={{ height: 45, width: 395 }}             
                defaultDate={new Date(2018, 4, 4)}
                minimumDate={new Date(2018, 1, 1)}
                maximumDate={new Date(2018, 12, 31)}
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
              />   
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

