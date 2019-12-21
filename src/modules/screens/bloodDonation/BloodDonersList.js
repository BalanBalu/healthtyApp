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
          data:[],
          isloading:false
        }
        
    }
    componentDidMount(){
      this.getBlooddonationDetail();
     
    }
   getBlooddonationDetail= async()=>{
    try {
      let data =[]
     let result = await bloodDonationList(data);
     console.log(result)
     if(result.success){
      let user = result.data.userList 
      let doctor = result.data.doctorList
        user.concat(doctor);
        console.log(user)
        await this.setState({data:user})
      }
    await this.setState({ isloading: true })
} catch (e) {
    console.log(e)
}
}
getAddress(address){
  if(address != undefined){
    return  `${address.address.city || ''} , ${address.address.district || ''}`
  }else {
    return null
  }
  }
  getName(name){
    if(name.first_name != undefined || name.last_name != undefined ){
      return  `${name.first_name || ''} ${name.last_name || ''}`
    }
    else
    {
      return 'unKnown'
    }
  }
  getPhone(mobile_no){
    if(mobile_no != undefined) {
      return mobile_no 
    } else
    {
      return 'No Number'
    }
  }
  getBloodGrp(blood_group){
    if(blood_group != undefined) {
      return blood_group 
    } else
    {
      return 'N/A'
    }
  }
  
  bindbloodListValues(){
    console.log('come bind')
    const { navigation } = this.props;
   let filterData = navigation.getParam('data');
   this.setState({data:filterData})
   console.log(filterData)
   
  }
  backNavigation = async (navigationData) => {
    
    try {
      console.log('backnavigation active')
        await this.setState({ isLoading: false })
        if (navigationData.action) {
            // if (navigationData.action.type === 'Navigation/BACK') {
                console.log('haii')
              await this.bindbloodListValues();
               
            // }
        }
        await this.setState({ isLoading: true })
    } catch (e) {
        console.log(e)
    }

}
    render() {
      const {isloading,data} = this.state;
        return (
            <Container>
            <Content style={{padding:8}}>
            {isloading == false ? 
             <Spinner 
             color="blue"
             visible={true}
             size={"large"}
             overlayColor="none"
             cancelable={false}/>: data === undefined ? null : data.length == 0 ?
              <View style={{alignItems:'center',justifyContent:'center',height:550}}>
                 <Text> No Blood Donors</Text>
              </View>
              :
                <View style={{marginBottom:50}}>
                   <NavigationEvents
                                    onWillFocus={payload => { this.backNavigation(payload) }}
                                />
                  <FlatList
                  data={this.state.data}
                  renderItem={({item})=>
                        <Card style={{padding:2,marginTop:5}}>      
                            <Row style={{borderBottomWidth:0,marginTop:5}}>
                              <Col size={1.5} style={{justifyContent:'center'}}>
                                 <Image source={require("../../../../assets/images/Blooddrop.png")} style={{height:75,width:75,position:'relative'}}/>
                                 <Text style={{fontFamily:'OpenSans',fontSize:15,position:'absolute',marginLeft:26,fontWeight:'bold',paddingTop:12,color:'#fff'}}>{this.getBloodGrp(item.blood_group)}</Text>
                              </Col>
                              <Col size={7.5} style={{marginTop:15,marginLeft:5}}>
                                  <Text style={{fontFamily:'OpenSans',fontSize:15}}>{this.getName(item)}</Text>
                              <Row>
                                   <Icon name="ios-pin" style={{color:'#1D96F2',fontSize:15,marginTop:10}}/>
                                   <Text style={{color:'gray',fontSize:13,fontFamily:'OpenSans',marginTop:10}}> {this.getAddress(item.address)}</Text>
                              </Row>
                             </Col>
                             <Col size={1} style={{borderLeftColor:'gray',borderLeftWidth:0.4,paddingLeft:10,justifyContent:'center',marginTop:8,marginBottom:8}}>
                                <Icon name="ios-call" style={{color:'#08BF01',fontSize:35}}/>
                             </Col>
                            </Row>
                          </Card>   






                  // <Card style={{padding:10}}>
                  // <Row >
                  //   <Col style={{width:'85%',paddingTop:10,}}>
                  //     <Row>
                  //     <Col style={{width:'50%'}}>
                  //     <Text style={styles.nameTxt}>{this.getName(item)}</Text>
                  //     </Col>
                  //     <Col style={{width:'50%'}}>
                  //     {item.is_available_blood_donate == true ?
                  //    <Text style={styles.statButton}>Available</Text>
                  //    :
                  //    <Text style={styles.statButton}>Not Available</Text>
                  //   }
                  //    </Col>
                  //     </Row>
                    
                  //     <Row style={{marginTop:5}}>
                  //       <Col style={{width:'50%'}}>
                  //       <Text style={styles.mobTxt}>{this.getPhone(item.mobile_no)}</Text>
                       
                  //       </Col>
                  //       <Col style={{width:'50%'}}>
                  //       <Text style={styles.cityTxt}>{this.getAddress(item.address)}</Text>
                  //   </Col>
                  //       </Row>
                  //   </Col>
                  //   <Col style={{width:'15%',paddingTop:10,justifyContent:'center'}}>
                  //     <View style={styles.circleView}>
                  //     <Text style={styles.circleText}>{this.getBloodGrp(item.blood_group)}</Text>
                  //     </View>
                
                  //   </Col>
                  // </Row>
                  // </Card>
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