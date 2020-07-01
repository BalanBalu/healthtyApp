import React, {PureComponent} from 'react';
import { Container, Content, Text, Toast, Button,ListItem,CheckBox,Radio, Card,Thumbnail,List,Item, Input, Left, Right, Icon,Footer,FooterTab } from 'native-base';
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage,Platform, FlatList, ImageBackground, Alert, Linking } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import styles from './styles'

class HomeTestConfirmation extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            selfChecked:false
        }
    }


    render(){
        const {name,age,gender} = this.props
        const patientDetails = [{full_name:"Mukesh Kannan (Male)-Self Patient",age:"26 years"},{full_name:"Balasubramanian (Male)-Other Patient",age:"26 years"}]
        return(
            <Container>
                <Content style={{ backgroundColor: '#F5F5F5', padding: 10 }}>
                    <View style={{marginBottom:30}}>
                <View style={{ backgroundColor: '#fff', padding: 10 }}>
                <View>
                <Text style={styles.subHead}>For Whom do you need to take up the Checkup?</Text>

                <Row style={{ marginTop: 5 }}>
                  <Col size={10}>
                    <Row>
                      <Col size={3}>
                        <Row style={{ alignItems: 'center' }}>

                          <CheckBox style={{ borderRadius: 5 }}
                            checked={this.state.selfChecked}
                            onPress={async () => { await this.setState({ selfChecked: !this.state.selfChecked }) }}
                          />
                          <Text style={styles.firstCheckBox}>Self</Text>
                        </Row>
                      </Col>
                      <Col size={3}>
                        <Row style={{ alignItems: 'center' }}>
                          <CheckBox style={{ borderRadius: 5 }}

                            checked={this.state.othersChecked}
                            onPress={async () => { await this.setState({ othersChecked: !this.state.othersChecked }) }}
                          />
                          <Text style={styles.firstCheckBox}>Others</Text>
                        </Row>
                      </Col>
                      <Col size={4}>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </View>
            
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.subHead}>Add other patient's details</Text>
                  <Row style={{ marginTop: 10 }}>
                    <Col size={6}>
                      <Row>
                        <Col size={2}>
                          <Text style={styles.nameAndAge}>Name</Text>
                        </Col>
                        <Col size={8} >
                          <Input placeholder="Enter patient's name" style={styles.inputText}
                            returnKeyType={'next'}
                            keyboardType={"default"}
                            value={name}
                            onChangeText={(name) => this.setState({ name })}
                            blurOnSubmit={false}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col size={4} style={{ marginLeft: 5 }}>
                      <Row>
                        <Col size={2}>
                          <Text style={styles.nameAndAge}>Age</Text>
                        </Col>
                        <Col size={7}>
                          <Input placeholder="Enter patient's age" style={styles.inputText}
                            returnKeyType={'done'}
                            keyboardType="numeric"
                            value={age}
                            onChangeText={(age) => this.setState({ age })}
                            blurOnSubmit={false}
                          />
                        </Col>
                        <Col size={1}>
                        </Col>
                      </Row>
                    </Col>
                  </Row>


                  <View style={{ marginTop: 10, borderBottomWidth: 0, flexDirection: 'row' }}>
                    <Text style={{
                      fontFamily: 'OpenSans', fontSize: 12, marginTop: 3
                    }}>Gender</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                      <Radio 
                      radioBtnSize ={500}
                        standardStyle={true}
                        selected={gender === "M" ? true : false}
                        onPress={() => this.setState({ gender: "M" })} />
                      <Text style={styles.genderText}>Male</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                      <Radio
                        standardStyle={true}
                        selected={gender === "F" ? true : false}
                        onPress={() => this.setState({ gender: "F" })} />
                      <Text style={styles.genderText}>Female</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                      <Radio
                        standardStyle={true}
                        selected={gender === "O" ? true : false}
                        onPress={() => this.setState({ gender: "O" })} />
                      <Text style={styles.genderText}>Others</Text>
                    </View>
                  </View>


                </View> 

         
                <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                  <TouchableOpacity style={styles.touchStyle} onPress={() => this.addPatientData()}>
                    <Text style={styles.touchText}>Add patient</Text>
                  </TouchableOpacity>
                </Row> 
                </View>


              <View style={{ backgroundColor: '#fff', padding: 10 ,marginTop:10}}>
                <Text style={styles.subHead}>Patient Details</Text>
                <FlatList
                 data={patientDetails}
                 extraData={patientDetails}
                 keyExtractor={(item, index) => index.toString()}
                 renderItem={({ item, index }) =>
                    <View style={{borderBottomColor:'gray',borderBottomWidth:0.2, paddingBottom:10}}>
                      <Row style={{ marginTop: 10,}}>
                        <Col size={8}>
                          <Row>
                            <Col size={2}>
                              <Text style={styles.commonText}>Name</Text>
                            </Col>
                            <Col size={.5}>
                              <Text style={styles.commonText}>-</Text>
                            </Col>
                            <Col size={7}>
                              <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#000' }}>{item.full_name}</Text>

                            </Col>
                          </Row>
                        </Col>
                        <Col size={0.5}>
                          <TouchableOpacity onPress={() => this.removePatientData(item, index)}>
                            <Icon active name='ios-close' style={{ color: '#d00729', fontSize: 18 }} />
                          </TouchableOpacity>
                        </Col>
                      </Row>

                      <Row>
                        <Col size={10}>
                          <Row>
                            <Col size={2}>
                              <Text style={styles.commonText}>Age</Text>
                            </Col>
                            <Col size={.5}>
                              <Text style={styles.commonText}>-</Text>
                            </Col>
                            <Col size={7.5}>
                              <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#000' }}>{(item.age)}</Text>

                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </View>
                  } />
               
              </View>
              <View style={{ backgroundColor: '#fff', padding: 10,marginTop:10}}>
<Row>
    <Col size={3}>
    <Text style={styles.subHead}>Home Address</Text>
    </Col>
    <Col size={7}>
        <Row style={{justifyContent:'flex-end',marginTop:1}}>
        <TouchableOpacity  >
        <Text style={{ fontFamily: 'OpenSans', color: '#ff4e42', fontSize: 10,  }}>Change</Text>
        </TouchableOpacity>
        </Row>
      
    </Col>
</Row>
<Text note style={{ fontFamily: 'OpenSans', marginTop: 5, fontSize: 11, }}>S.Mukesh Kannan</Text>
<Text note style={{ fontFamily: 'OpenSans', marginTop: 5, fontSize: 11, }}>
 67/B 2nd Road,Ambattur,Channai,Tamil Nadu
 </Text>
 <Text note style={{ fontFamily: 'OpenSans', marginTop: 5, fontSize: 11, }}>
Mobile - 9878676565
 </Text>
</View>


<View style={{ backgroundColor: '#fff', padding: 10,marginTop:10}}>

    <Text style={styles.subHead}>Test Details</Text>
    <Row style={{marginTop:10}}>
                                    <Col size={1.5}>
                                        <TouchableOpacity >
                                            <Thumbnail circle source={require('../../../../assets/images/Female.png')} style={{ height: 40, width: 40, borderRadius: 60 / 2 }} />
                                        </TouchableOpacity>
                                    </Col>
                                    <Col size={8.5}>
                                        
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, }}>Dr.pradeep natarajan</Text>
                                     
                                            <Text note style={{ fontFamily: 'OpenSans', marginTop: 2, fontSize: 11 }}>B.D.S.B.D.S Hearing Specialist</Text>
                                       
                                    </Col>
                                   
                                </Row>
                                <Row style={{marginTop:5}}>
    <Col size={6}>
                <Text note style={{ fontFamily: 'OpenSans', fontSize: 12,  }}>Doctor Fees <Text style={{ fontFamily: 'OpenSans', fontSize: 10,color:'#8dc63f'  }}>{" "}(2 persons) </Text></Text>
    </Col>
    <Col size={4}>
        <Text  style={{ fontFamily: 'OpenSans', color: '#ff4e42', fontSize: 10,marginTop:1,textAlign:'right',color:'#8dc63f'  }}>₹1000.00</Text>
    </Col>
</Row>
<Row>
    <Col size={6}>
                <Text note  style={{ fontFamily: 'OpenSans', fontSize: 12,  }}>Charges</Text>
    </Col>
    <Col size={4}>
        <Text style={{ fontFamily: 'OpenSans', color: '#ff4e42', fontSize: 10,marginTop:1,textAlign:'right'  }}>₹150.00</Text>
    </Col>
</Row>
<Row>
    <Col size={6}>
                <Text style={{ fontFamily: 'OpenSans', fontSize: 12,fontWeight:'500' }}>Amount to be Paid </Text>
    </Col>
    <Col size={4}>
        <Text style={{ fontFamily: 'OpenSans', color: '#ff4e42', fontSize: 10,marginTop:1,textAlign:'right',color:'#8dc63f'  }}>₹1150.00</Text>
    </Col>
</Row>
    </View>
    </View>
                </Content>
                <Footer style={
                    Platform.OS === "ios" ?
                        { height: 30 } : { height: 45 }}>
                    <FooterTab>
                        <Row>
                            <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                                <TouchableOpacity >
                                    <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#000', fontWeight: '400' }}>Total - ₹1150</Text>
                                </TouchableOpacity>
                            </Col>
                         
                                <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#8dc63f' }}>
                                    <TouchableOpacity >
                                        <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#fff', fontWeight: '400' }}>Proceed</Text>
                                    </TouchableOpacity>
                                </Col> 
                        </Row>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

export default HomeTestConfirmation