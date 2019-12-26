import React, { Component } from 'react';
import { Container, Content, View, Text, Item, Spinner,Card,Picker, Radio,Row,Col,Form,Button,Icon,Input,Footer } from 'native-base';
import {StyleSheet,TextInput,TouchableOpacity,Image} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { FlatList } from 'react-native-gesture-handler';
import {bloodDonationList }from '../../providers/profile/profile.action';
class BloodDonersList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      isloading: false
    }
  }
  
  componentDidMount() {
    this.getBlooddonationDetail();
  }
  getBlooddonationDetail = async () => {
    try {
      this.setState({
        isloading: true
      })
      let data = []
      let result = await bloodDonationList(data);
      if (result.success) {
        console.log(result)
        let user = result.data.userList
        let doctor = result.data.doctorList
        user.concat(doctor);
        await this.setState({ data: user })
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.setState({ isloading: false })
    }
  }
  getAddress(address) {
    if (address != undefined) {
      return `${address.address.district || ''}`
    } else {
      return null
    }
  }
  getName(name) {
    if (name.first_name != undefined || name.last_name != undefined) {
      return `${name.first_name || ''} ${name.last_name || ''}`
    } else {
      return 'unKnown'
    }
  }
  getPhone(mobile_no) {
    if(mobile_no!= undefined){
    let totalNum = mobile_no.slice(0,7)
      return totalNum 
  }
      else {
        return 'No Number'
      }
    }

  getBloodGrp(blood_group) {
    if (blood_group != undefined) {
      return blood_group
    } else {
      return 'N/A'
    }
  }

  bindbloodListValues() {
    const {
      navigation
    } = this.props;
    let filterData = navigation.getParam('data');
    this.setState({
      data: filterData
    })
  }
  backNavigation = async (navigationData) => {
    try {
      if (navigationData.action) {
        // if (navigationData.action.type === 'Navigation/BACK') {

        await this.bindbloodListValues();

        // }
      }
      await this.getBlooddonationDetail();
    } catch (e) {
      console.log(e)
    }

  }
    render() {
      const { isloading, data} = this.state;
        return (
            <Container>
           
             
            <Content style={{padding:8}}>
            {isloading == true ? 
              <Spinner 
                color="blue"
                visible={true}
                size={"large"}
                overlayColor="none"
                cancelable={false}/> : null } 
           
             { data.length == 0 ?
                <View style={{alignItems:'center',justifyContent:'center',height:550}}>
                  <Text> No Blood Donors</Text>
                </View>
              :
                <View style={{marginBottom:50}}>
                   <NavigationEvents
                      onWillFocus={payload => { this.backNavigation(payload)}}/>
                  
                  <FlatList
                  data={this.state.data}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item})=>
                        <Card style={{padding:2,marginTop:5}}>      
                            <Row style={{borderBottomWidth:0,marginTop:5}}>
                              <Col size={2} style={{justifyContent:'center'}}>
                                 <Image source={require("../../../../assets/images/BloodDrop.png")} style={{height:95,width:95,position:'relative'}}/>
                                 <Text style={{fontFamily:'OpenSans',fontSize:15,position:'absolute',fontWeight:'bold',paddingTop:20,color:'#fff',width:'100%',textAlign:'center',marginLeft:10}}>{this.getBloodGrp(item.blood_group)}</Text>
                              </Col>
                              <Col size={7} style={{marginTop:25,marginLeft:10}}>
                                  <Text style={{fontFamily:'OpenSans',fontSize:15}}>{this.getName(item)}</Text>
                              <Row>
                                  <Col size={3}style={{flexDirection:'row'}}>
                                  <Icon name="ios-pin" style={{color:'#1D96F2',fontSize:15,marginTop:10}}/>
                                   <Text style={{color:'gray',fontSize:13,fontFamily:'OpenSans',marginTop:10,marginLeft:2}}> {this.getAddress(item.address)}</Text>
                                   <View size={1}style={{borderLeftColor:'gray',borderLeftWidth:1,marginTop:10,marginBottom:15,marginLeft:10}}/>
                                   <Icon name="ios-call" style={{color:'#1D96F2',fontSize:15,marginTop:12,marginLeft:10}}/>
                                   <Text   style={{color:'gray',fontSize:13,fontFamily:'OpenSans',marginTop:10,marginLeft:2}}> {this.getPhone(item.mobile_no)}...</Text>
                                  </Col> 
                              </Row>
                             </Col>
                             <Col size={1} style={{justifyContent:'center',}}>
                                <Icon name="logo-whatsapp" style={{color:'#08BF01',fontSize:35}}/>
                             </Col>
                            </Row>
                          </Card>   
                  }/>  
               </View>
            }
              </Content> 
              <Footer style={styles.footerStyle}> 
                <Row style={{alignItems:'center',justifyContent:'center',marginLeft:20,
    marginRight:20}}> 
                   <Col style={{width:'70%'}}>
                   <Text style={{fontFamily:'OpenSans',fontSize:15,color:'#fff'}}>Interested in Blood Donation?</Text>
                  </Col> 
                  <Col>
                  <TouchableOpacity style={{paddingTop:5,paddingBottom:5,paddingLeft:10,paddingRight:10,backgroundColor:'#08BF01',borderRadius:5}}><Text style={{fontFamily:'OpenSans',fontSize:12,color:'#fff',textAlign:'center'}}>Register Now</Text></TouchableOpacity>
                  </Col>
                    </Row>
                    </Footer>
          </Container>
        )
    }
}

export default BloodDonersList

const styles = StyleSheet.create({
   nameTxt:{
    fontFamily:'OpenSans',
    fontSize:16,
    textAlign:'auto',
    fontWeight:'bold'
   },
  mobTxt:{
    fontFamily:'OpenSans',
    fontSize:16,
    marginTop:2
  },
  cityTxt:{
    fontFamily:'OpenSans',
    fontSize:16,
    marginTop:2,
    marginLeft:5 ,
  },
  statButton:{
    backgroundColor:'green',
    borderRadius:5,
    textAlign:'center',
    width:'70%',
    height:25,
    color:'#fff',
    fontSize:14,
    fontWeight:'bold',
   paddingTop:2
  },
  statText:{
    fontFamily:'OpenSans',
    fontSize:16,
    color:'green'
  },
  circleView:{
    backgroundColor:'red',
    borderRadius:30,
    height:40,
    width:40,
    justifyContent:'center'
  },
  circleText:{
    fontFamily:'OpenSans',
    fontSize:18,
    textAlign:'center',
    fontWeight:'bold',
    color:'#fff'
  },
  footerStyle:{
    backgroundColor: '#7E49C3',
    justifyContent:'center' ,
    
},
})