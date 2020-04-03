import React, { Component } from 'react';
import {
  Container, Content, Text, View, Button, H3, Item, Card,
  Input, Left, Right, Icon, Footer, Badge, Form, CardItem
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, AsyncStorage, FlatList, TouchableHighlight, Modal } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
class ReminderPopup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      proposedVisible: false
    }
  }
 
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    const { value, isLoading } = this.state;
    return (
      <Container>
        <Content style={{ backgroundColor: '#EAE6E6', padding: 10 }}>
          <View>
            <Row>
              <TouchableOpacity style={{ borderColor: '#8dc63f', borderWidth: 1, marginLeft: 1, borderRadius: 2.5, height: 25, width: 65, backgroundColor: '#8dc63f' }}
                onPress={() => {
                  this.setModalVisible(true);
                }}>
                <Row style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 7, color: '#fff', marginTop: 2.5, marginLeft: 6 }}>Display popup</Text>
                </Row>
              </TouchableOpacity>
            </Row>
          </View>
          <View style={{ height: 200, justifyContent: 'center',  }}>
            <Modal
              animationType='fade'
              transparent={true}
              backdropColor="transparent"
              backgroundColor = "transparent"
              containerStyle={{ justifyContent: 'center',  }}
              visible={this.state.modalVisible}
              animationType={'slide'}
            >
              <Grid style={{
                backgroundColor: '#fff',
                position: 'absolute',
                top:200,
                justifyContent: 'center',
                marginLeft: 10, marginRight: 10, borderRadius: 5,borderColor:'gray',borderWidth:0.3
              }}>

                <View>
                  <View>
                  <Row style={{paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5,borderBottomColor:'#c3c3c3',borderBottomWidth:0.3,paddingBottom:10}}>
                  <Left>
                  <TouchableOpacity onPress={() => { this.setModalVisible(false); }}>
                          <Icon name='ios-information-circle-outline' style={{fontSize:20,color:'#7F49C3'}}/>
                      </TouchableOpacity>
                  </Left>
                  <Right>
                      <Row>
                      <TouchableOpacity onPress={() => { this.setModalVisible(false); }}>
                          <Icon name='ios-trash' style={{color:'#7F49C3',fontSize:20}}/>
                      </TouchableOpacity>
                      <TouchableOpacity style={{marginLeft:15,fontSize:25}}>
                          <Icon name="create" style={{fontSize:20,color:'#7F49C3'}}/>
                      </TouchableOpacity>
                      </Row>
                  </Right>
                </Row>
                    <View style={{ marginTop: 20,justifyContent:'center',alignItems:'center'}}>
                     <Text style={{fontFamily:'OpenSans',fontWeight:'500',fontSize:16,textAlign:'center'}}>Dollo</Text>
                    </View>
                    <View style={{ marginLeft: 20, marginTop: 10, marginRight: 20 }}>
                     <Row>
                         <Col size={1}>
                         <Icon name='ios-calculator' style={{fontSize:20,color:'#7F49C3'}}/>
                         </Col>
                         <Col size={9}>
                         <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Scheduled for 12:00 AM,today,April 3</Text> 
                         </Col>
                     </Row>
                     <Row style={{marginTop:10}}>
                         <Col size={1}>
                         <MaterialCommunityIcons name='note-outline' style={{fontSize:18,color:'#7F49C3',marginLeft:-2}}/>
                         </Col>
                         <Col size={9}>
                         <Text style={{fontFamily:'OpenSans',fontSize:14,}}>10 mg,take 1 pill(s)</Text> 
                         </Col>
                     </Row>
                    </View>
                  </View>
                  <Row style={{  marginTop: 20,marginBottom:20,borderTopColor:'#c3c3c3',borderTopWidth:0.3,paddingTop:10 }}>
                    <Col style={{ width: '33.3%',justifyContent:'center',alignItems:'center',}}>
                        
                        <TouchableOpacity style={{height:50,width:50,borderRadius:50/2,backgroundColor:'#D6C9EA',justifyContent:'center',alignItems:'center'}}>
                            <Icon name='ios-close-circle-outline'/>
                        </TouchableOpacity>
                        <Text style={{fontFamily:'OpenSans',fontSize:14,color:'#7F49C3',marginTop:5}}>SKIP</Text> 
                    </Col>
                    <Col style={{ width: '33.3%',justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity style={{height:50,width:50,borderRadius:50/2,backgroundColor:'#7F49C3',justifyContent:'center',alignItems:'center'}}>
                            <Icon name='ios-checkmark-circle-outline' style={{color:'#fff'}}/>
                        </TouchableOpacity>
                        <Text style={{fontFamily:'OpenSans',fontSize:14,color:'#7F49C3',marginTop:5}}>TAKE</Text> 
                    </Col>
                    <Col style={{ width: '33.3%',justifyContent:'center',alignItems:'center'  }}>
                    <TouchableOpacity style={{height:50,width:50,borderRadius:50/2,backgroundColor:'#D6C9EA',justifyContent:'center',alignItems:'center'}}>
                            <Icon name='ios-alarm'/>
                        </TouchableOpacity>
                        <Text style={{fontFamily:'OpenSans',fontSize:14,color:'#7F49C3',marginTop:5}}>RESCHEDULE</Text> 


                    </Col>
                  </Row>
                </View>
              </Grid>
            </Modal>
          </View>
        </Content>
      </Container>
    )
  }
}


export default ReminderPopup
const styles = StyleSheet.create({
  container:
  {
    backgroundColor: '#ffffff',
  },

  bodyContent: {
    padding: 0
  },
  customImage: {
    height: 90,
    width: 90,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    borderRadius: 50
  },

  curvedGrid:
  {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginTop: -135,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#745DA6',
    transform: [
      { scaleX: 2 }
    ],
    position: 'relative',
    overflow: 'hidden',

  },

  normalText:
  {
    fontFamily: 'OpenSans',
    fontSize: 17,
    marginTop: 10
  },
  offerText:
  {
    fontFamily: 'OpenSans',
    fontSize: 13,
    color: 'green'

  },
  subText: {
    fontFamily: 'OpenSans',
    fontSize: 17,
    color: 'black'
  },
  transparentLabel1:
  {
    backgroundColor: "#fff",
    height: 35,
    borderRadius: 5
  },

  firstTransparentLabel: {
    fontSize: 12.5,
    marginLeft: 10

  }
});