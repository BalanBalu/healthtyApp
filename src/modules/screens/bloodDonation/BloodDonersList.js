import React, { Component } from 'react';
import { Container, Content, View, Text, Item, Spinner,Card,Picker, Radio,Row,Col,Form,Button,Icon,Input } from 'native-base';
import {StyleSheet,TextInput,TouchableOpacity} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import {bloodDonationList }from '../../providers/profile/profile.action';


class BloodDonersList extends Component {
    constructor(props) {
        super(props)
        this.state = {
          data:[],
         
         
        }
        
    }
    componentDidMount(){
      this.getBlooddonationDetail()
    }
   getBlooddonationDetail= async()=>{
     let result = await bloodDonationList();
     if(result.success){
       this.setState({data:result.data})
     }
     console.log(result)

     }

    render() {
      const donarDetail = [{name:'Mukesh Kannan',mobileNo:9978778865,status:'Available',bloodGrp:'A+'},
      {name:'Anusha Krishna',mobileNo:9978778845,status:'Available',bloodGrp:'A+'},{name:'Dharmalingam',mobileNo:9956757655,status:'Available',bloodGrp:'A+'},
      {name:'Mujeeb',mobileNo:9998778823,status:'Available',bloodGrp:'A+'},{name:'Rahul E',mobileNo:9999778878,status:'Available',bloodGrp:'A+'},
      {name:'Krishna Prasad',mobileNo:9999978867,status:'Available',bloodGrp:'A+'},  ]
        return (
            <Container>
            <Content style={{padding:20}}>
                <View style={{marginBottom:50}}>
                  <FlatList
                  data={this.state.data.userList}
                  renderItem={({item})=>
                  <Card style={{padding:10}}>
                  <Row >
                    <Col style={{width:'85%',paddingTop:10,}}>
                      <Text style={styles.nameTxt}>{item.first_name}</Text>
                      <Row style={{marginTop:10}}>
                        <Col style={{width:'50%'}}>
                        <Text style={styles.mobTxt}>{item.mobile_no}</Text>
                        </Col>
                        <Col style={{width:'50%'}}>
                        <Text style={styles.statButton}>Available</Text>
                        </Col>
                       
                        </Row>
                    </Col>
                    <Col style={{width:'15%',paddingTop:10,justifyContent:'center'}}>
                      <View style={styles.circleView}>
                      <Text style={styles.circleText}>A+</Text>
                      </View>
                
                    </Col>
                  </Row>
                  </Card>
                  }/>
                
               </View>
              </Content>
          </Container>
        )
    }
}

export default BloodDonersList

const styles = StyleSheet.create({
   nameTxt:{
    fontFamily:'OpenSans',
    fontSize:16,
    fontWeight:'bold'
   },
  mobTxt:{
    fontFamily:'OpenSans',
    fontSize:16,
    marginTop:2
  },
  statButton:{
    borderColor:'green',
    borderWidth:1,
    backgroundColor:'#fff',
    borderRadius:5,
    textAlign:'center',
    width:'50%',
    padding:2
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
    fontSize:20,
    textAlign:'center',
    fontWeight:'bold',
    color:'#fff'
  }
})