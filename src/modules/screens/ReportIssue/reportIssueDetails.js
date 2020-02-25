import React, { Component } from 'react';
import { Container, Content, View, Text, Item, Radio, Row, Col, Form, Button, Footer, Left, Right,Toast } from 'native-base';
import { StyleSheet, TextInput, AsyncStorage, TouchableOpacity,ScrollView } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import { formatDate } from '../../../setup/helpers';
import Spinner from "../../../components/Spinner";
import{ upDateReportIssue } from '../../providers/reportIssue/reportIssue.action';
import {onlySpaceNotAllowed} from '../../common'

class reportIssueDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:this.props.navigation.getParam('reportData'),
            comments:null,
            replyData:[],
            isLoading:false

        }
    }
    componentDidMount(){
       
        replyData=this.state.data[0].reply_data||[];
        this.setState({replyData})

    }
    upDateReportIssueData = async () => {
        try {
          this.setState({ isLoading: true });
          reportedId=this.props.navigation.getParam('reportedId')
          const {comments}=this.state;
          if(onlySpaceNotAllowed(comments)==true) {   
          let userId = await AsyncStorage.getItem('userId');
          let data={
            reply_provider_type: 'USER',
            reply_comment: comments,
            active: true,
          }
            let response = await upDateReportIssue('appointment',reportedId,userId, data);
          alert(JSON.stringify(response))

            if(response.success){
                data.created_date=new Date()
        let temp=this.state.replyData
              temp.push(data)
              this.setState({replyData:temp})
              Toast.show({
                text:response.message,
                 type: 'success',
                duration: 3000,
              })        
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
              text:'kindly give your replies ',
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
        const {isLoading,data,replyData}=this.state
    
    //     const data =[{date:"Today, 20/02/2020 at 01.10 PM",content:"We have no special tie-ups,relationship or consideration with doctors in this regard as we want to be an independent unbiased site for patients.",
    // detail:"Through Medflic,yours chances of booking an appoinment are the same as using any other means."}]
        return (
            <Container>
                <Content style={{ padding: 20 }}>
                <Spinner
							    color={'blue'}
							    style={[styles.containers, styles.horizontal]}
							    visible={isLoading}
							    size={"large"}
							    overlayColor="none"
							    cancelable={false}
						     />
                   
                    <View>
                      
                         <View>
                        <Row style={{ paddingBottom: 10, borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3 }}>
                            <Left>
                                <Text style={styles.reportText}>{data[0].report_by=='USER'?'Reported By You':'Reported By Doctor'}</Text>
                            </Left>
                            <Right>
                        <Text style={styles.date}>{formatDate(data[0].created_date,'dddd,DD/MM/YYYY at hh:mm a')}</Text>
                            </Right>
                        </Row>
                        <View style={{ marginTop: 10 }}>
                        <Text style={styles.contentText}>{data[0].complaint||' '}</Text>
                        </View>
                        </View>
                         {replyData.length!=0&&
                         <FlatList
                         data={replyData}
                         renderItem={({ item }) => 
                         <View>
                        <Row style={{ paddingBottom: 10, borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3, marginTop: 30 }}>
                            <Left>
                                <Text style={styles.reportText}>{item.reply_provider_type=='USER'?'Replied By You':item.reply_provider_type=='DOCTOR'?'Replied By Doctor':'Replied By Medflic'}</Text>
                            </Left>
                            <Right>
                        <Text style={styles.date}>{formatDate(item.created_date,'dddd,DD/MM/YYYY at hh:mm a')}</Text>
                            </Right>
                        </Row>
                        <View style={{ marginTop: 10 }}>
                            {item.reply_provider_type=='ADMIN'&&
                            <Text style={styles.contentText}>Hello Sir,
                           </Text>}
                            <Text style={[styles.contentText,{marginTop: 20}]}>{item.reply_comment}
                            </Text>
                            <Text style={[styles.contentText,{marginTop: 10} ]}>{item.detail}
                            </Text>
                            {item.reply_provider_type=='ADMIN'&&
                            <View>
                            <Text style={[styles.boldContent,{marginTop: 20 }]}>Thanks,
                            </Text>
                            <Text style={styles.boldContent}>Medflic Support Team
                           </Text>
                           </View>
                         }
                        </View>
                        </View>
                         }/> 
                        }
                        <View style={{ marginTop: 30 }}>
                            <Text style={styles.replyText}>Quick Reply
                            </Text>
                            <TextInput
                                onChangeText={comments => this.setState({ comments })}
                                multiline={true} placeholder="Type Your Reply......"
                              
                                style={styles.textInput1} />
                            <Row>
                                <Right>
                                    <TouchableOpacity style={styles.touchButton} onPress={()=>{this.upDateReportIssueData()}}>
                                        <Text style={styles.touchText} >Send Reply</Text>
                                    </TouchableOpacity>
                                </Right>
                            </Row>
                        </View>
    
                    </View>

                    
                </Content>
            </Container>


        )
    }
}

export default reportIssueDetails

const styles = StyleSheet.create({

    textInput1: {
        borderColor: '#909090',
        borderRadius: 2,
        borderWidth: 0.5,
        height: 60,
        fontSize: 10,
        fontStyle: 'italic',
        textAlignVertical: 'top',
        width: '60%',
        padding: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
        marginTop: 10,
        width: '100%'

    },
    reportText:{
        fontFamily: 'OpenSans',
         fontSize: 12,
          fontWeight: 'bold',
           color: '#775DA3'
    },
    date:{
        fontFamily: 'OpenSans',
         fontSize: 10,
          color: '#909090'
    },
    contentText:{
        fontFamily: 'OpenSans',
         fontSize: 14,
         color: '#5D5D5D',
          textAlign: 'left'
    },
    boldContent:{
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#696969',
        textAlign: 'left',
        fontWeight: 'bold'
    },
    replyText:{
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#5D5D5D',
        textAlign: 'left'
    },
    touchButton:{
        backgroundColor: '#2A9F15',
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 5,
        paddingTop: 5, 
        borderRadius: 3, 
        marginTop: 10 
    },
    touchText:{
        fontFamily: 'OpenSans', 
        fontSize: 10, 
        color: '#fff', 
        fontWeight: 'bold',
    }

})