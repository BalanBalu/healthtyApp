
import React, { Component } from 'react';
import { Container, Content, View, Text, Item,  Radio,Row,Col,Form,Button,Toast,Footer } from 'native-base';
import {StyleSheet,TextInput,AsyncStorage} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import Spinner from "../../../components/Spinner";
 import { RadioButton } from 'react-native-paper';

import {appointmentIssue, pharmacyIssue, chatIssue,onlySpaceNotAllowed  } from '../../common';

import{ insertReportIssue } from '../../providers/reportIssue/reportIssue.action';


class ReportIssue extends Component {
    constructor(props) {
        super(props)
        this.state = {
          issue:[],
          quesNo:0, 
          issueFor:this.props.navigation.getParam('issueFor'),
          complaint:null,
          isLoading:false
        }
    }
    componentDidMount(){
      const{issueFor}=this.state
      if(issueFor=='Appointment'){
        this.setState({issue:appointmentIssue})
        
      }
      else if(issueFor=='chat'){
        this.setState({issue:chatIssue})

      }
      else if(issueFor=='Pharmacy'){
        this.setState({issue:pharmacyIssue})

      }

    }
    insertReportIssueData = async () => {
      try {
        this.setState({ isLoading: true });
        const {quesNo,complaint,issueFor,issue}=this.state;
        if(onlySpaceNotAllowed(complaint)==true) {
          
        let userId = await AsyncStorage.getItem('userId');
        let data={
          service_type:issueFor.toUpperCase( ),
          sender_id:userId,
          report_by:'USER',
          issue_type:issue[quesNo].value,
          complaint:complaint,
           report_status:'OPEN'
         

        }
        if(issueFor=='Appointment'){
            data.appointment_id = this.props.navigation.getParam('reportedId')
        }
        else if (issueFor == 'chat'){
          data.chat_id=this.props.navigation.getParam('reportedId')
        }
        else if(issueFor=='Pharmacy'){
          data.pharmacy_id= this.props.navigation.getParam('reportedId')
        }
          let response = await insertReportIssue(userId, data);
        
          if(response.success){
      
            Toast.show({
              text:response.message,
               type: 'success',
              duration: 3000,
            })
            const { navigation } = this.props;
            const { routeName, key } = navigation.getParam('prevState');
            navigation.navigate({ routeName, key, params: { hasReloadReportIssue: true } });
          
          }
          else{
            Toast.show({
              text:response.message,
               type: 'dangers',
              duration: 3000,
            })

          }
        
        } 
        else{
          Toast.show({
            text:'kindly give report ',
             type: 'dangers',
            duration: 3000,
          })

        }
        this.setState({ isLoading: false });
      } catch (e) {
        
        console.log(e);
      } finally {
        this.setState({ isLoading: false });
      }
    }
  

    render() {
      const{isLoading,issue }=this.state
        return (
            <Container>
            <Content style={{padding:30}}>
            {isLoading == true ? <Spinner
							    color={'blue'}
							    style={[styles.containers, styles.horizontal]}
							    visible={true}
							    size={"large"}
							    overlayColor="none"
							    cancelable={false}
						     /> : null }
                <View style={{marginBottom:40,}}>
                <Text style={{fontFamily:'OpenSans',fontSize:20,textAlign:'center',fontWeight:'bold'}}>{this.state.issueFor + ' Issue'}</Text>
 
                     <Form>
                       <View >
                         <FlatList data={issue}
                            keyExtractor={(item, index) => index.toString()}
                         renderItem={({item})=>
                         <View>
                         <Row style={{marginTop:10}}>
                         
                          <RadioButton.Group 
                                onValueChange={value => { 
                                  this.setState({ quesNo: value  })}}
                                value={this.state.quesNo}> 
                                <RadioButton value={item.id} style={{marginTop:-5}}/>
                              </RadioButton.Group>
                   
                            <Text style={{fontFamily:'OpenSans',fontSize:16,lineHeight:20,marginLeft:10,marginTop:8,width:'80%'}}>{item.value}</Text>
                            </Row>
                            {this.state.quesNo==item.id?
                             <Row style={{marginTop:10,marginBottom:10}}>
                             <Col size={1.5}>
                             </Col>
                             <Col size={8.5}>
                             <TextInput 
                                 onChangeText={complaint => this.setState({ complaint })}
                                 multiline={true} placeholder="Reason......" 
                                 style={styles.textInput1} />
                             </Col>
                           </Row>:null}
                          </View>
                          
                         
                         }/>
                         
                         
                 </View>
                  
             
               
          </Form>
      </View>
    </Content>
    <Footer style={{backgroundColor:'white'}}>
    <Row style={{justifyContent:'center',marginTop:-10}}>
                <Button  style={styles.ReportButton}  onPress={()=>this.props.navigation.pop()}>
                    <Text style={styles.ReportButtonText}>CANCEL</Text>
                </Button>
                 <Button  style={styles.ReportButton1}  onPress={()=>this.insertReportIssueData()}>
                       <Text style={styles.ReportButtonText}>REPORT</Text>
                 </Button>
             </Row>
    </Footer>
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




















