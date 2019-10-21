import React, { Component } from 'react';
import { Container, Content, View, Text, Item, Spinner, Radio,Row,Col,Form,Button } from 'native-base';
import {StyleSheet,TextInput} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';


class ReportIssue extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
    }


    render() {
const Issue=[{ques:' What is bjsjhkkdjhjsfjh ?'},{ques:' What is bjsjhkkdjhjsfjh ?'},{ques:' What is bjsjhkkdjhjsfjh ?'},{ques:' What is bjsjhkkdjhjsfjh ?'}]
        return (
            <Container>
            <Content style={{padding:30}}>
                <View style={{marginBottom:50}}>
                     <Text style={{fontFamily:'OpenSans',fontSize:20,textAlign:'center',fontWeight:'bold'}}>Payment Issue</Text>
                     <Form>
                       <View >
                         <FlatList data={Issue}
                         renderItem={({item})=>
                         <Row style={{marginTop:20}}>
                          <Col style={{width:'7%'}}>
                            <Radio
                              selectedColor={"#007bff"}
                              selected={true}
                            />
                          </Col>
                          <Col style={{width:'93%'}}>
                            <Text style={{fontFamily:'OpenSans',fontSize:16,}}>{item.ques}</Text>
                          </Col>
                         </Row>
                         }/>
                         <Item style={{borderBottomWidth:0,marginLeft:30,marginRight:40}}>
                           <TextInput 
                                 multiline={true} placeholder="Reason......" 
                                 style={styles.textInput1} />
                         </Item>
                 </View>
                     <Text style={{fontFamily:'OpenSans',fontSize:20,textAlign:'center',marginTop:20,fontWeight:'bold'}}>Others</Text>
                 <View>
                    <Item style={{borderBottomWidth:0,marginTop:10}}>
                      <TextInput 
                        
                      multiline={true} placeholder="Describe your isuues...." 
                      style={styles.textInput} />
                    </Item>
                 </View>
             
                <Row style={{justifyContent:'center',}}>
                <Button  style={styles.ReportButton} >
                    <Text style={styles.ReportButtonText}>CANCEL</Text>
                </Button>
                 <Button  style={styles.ReportButton1} >
                       <Text style={styles.ReportButtonText}>REPORT</Text>
                 </Button>
             </Row>
          </Form>
      </View>
    </Content>
</Container>
        )
    }
}

export default ReportIssue

const styles = StyleSheet.create({

 textInput:{
    borderColor:'gray',
    borderRadius:10,
    borderWidth:0.5,
    height:120,
    fontSize:14,
    textAlignVertical: 'top',
    width:'100%',
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    paddingRight: 10,
    marginTop:10
  },
  textInput1:{
    borderColor:'gray',
    borderRadius:10,
    borderWidth:0.5,
    height:80,
    fontSize:14,
    textAlignVertical: 'top',
    width:'60%',
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    paddingRight: 10,
    marginTop:10,
    width:'100%'
   
  },
  ReportButtonText:{
    fontFamily:'OpenSans',
    fontSize:18,
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold'
  },
  ReportButton:{
    borderRadius:10,
    height:40,
    marginTop:20,
    padding:30,
    backgroundColor:'#878787'
  },
  ReportButton1:{
    borderRadius:10,
    height:40,
    marginTop:20,
    padding:20,
    marginLeft:20,
    backgroundColor:'#e32726'
  },

})