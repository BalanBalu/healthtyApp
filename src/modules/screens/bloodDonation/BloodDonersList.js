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
          isloading:false
         
         
        }
        
    }
    componentDidMount(){
      this.getBlooddonationDetail();
     
    }
   getBlooddonationDetail= async()=>{
    try {
     let result = await bloodDonationList();
     if(result.success){
       this.setState({data:result.data})
      }
    await this.setState({ isloading: true })
} catch (e) {
    console.log(e)
}

}

    render() {
      const {isloading,data} = this.state;
        return (
            <Container>
            <Content style={{padding:20}}>
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
                  <FlatList
                  data={this.state.data.userList }
                  renderItem={({item})=>
                  <Card style={{padding:10}}>
                  <Row >
                    <Col style={{width:'85%',paddingTop:10,}}>
                      <Row>
                      <Col style={{width:'50%'}}>
                      <Text style={styles.nameTxt}>{item.first_name +' '+item.last_name}</Text>
                      </Col>
                      <Col style={{width:'50%'}}>
                      {item.is_available_blood_donate == true ?
                     <Text style={styles.statButton}>Available</Text>
                     :null
                    }
                     
                      </Col>
                      </Row>
                    
                      <Row style={{marginTop:5}}>
                        <Col style={{width:'50%'}}>
                        <Text style={styles.mobTxt}>{item.mobile_no}</Text>
                       
                        </Col>
                        <Col style={{width:'50%'}}>
                        <Text style={styles.cityTxt}>{item.address.address.city}</Text>
                    </Col>
                        </Row>
                    </Col>
                    <Col style={{width:'15%',paddingTop:10,justifyContent:'center'}}>
                      <View style={styles.circleView}>
                      <Text style={styles.circleText}>{item.blood_group}</Text>
                      </View>
                
                    </Col>
                  </Row>
                  </Card>
                  }/>  
               </View>
            }
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
    marginLeft:5
   
  },
  statButton:{
    backgroundColor:'green',
    borderRadius:5,
    textAlign:'center',
    width:'60%',
    paddingLeft:4,
    paddingRight:4,
    height:25,
    color:'#fff'
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