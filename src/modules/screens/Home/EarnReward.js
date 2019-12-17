import React, { Component } from 'react';
import {
    Container, Content, View, Text, Title, Header, H3, Button, Item, CardItem, Row, Col,
    List, ListItem, Left, Right, Card, Thumbnail, Body, Icon, ScrollView, Spinner,Grid
} from 'native-base';
import { StyleSheet, TouchableOpacity, AsyncStorage, FlatList, Image,ImageBackground} from 'react-native';


class EarnReward extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
    }
   

    render() {
       
        return (
            <Container style={styles.container}>
              <Content style={styles.bodyContent}>
                    <View style={{marginTop:25}}>
                <Text style={styles.mainHead}>Free Rewards !</Text>
                <Text style={styles.subHead}>Invite your friends to join Medflic and get upto Rs.100 /-</Text>
                <View style={{justifyContent:'center',alignItems:'center',marginTop:20}}>
                <Image
                      source={require('../../../../assets/images/gift.png')}
                     style={{
                            width: 140,height:140,alignItems:'center'
                         }}
                     />
                     </View>
                     <View style={{marginTop:30}}>
                             <Card style={styles.mainCard}>
                          <Row style={styles.MainRow}>
                           <Col style={{width:'70%'}}>
                           <ImageBackground 
                            source={require('../../../../assets/images/bg.png')}
                              style={{
                                width: '100%',height:'100%',alignItems:'center',justifyContent:'center'
                              }}
                            >
                                <Text style={styles.innerText}>Invite 25 peoples to Get Branded Watch absolutely free!!!</Text>
                                </ImageBackground>
                           </Col> 
                           <Col style={{width:'30%',}}>
                        
                          <Image
                                  source={require('../../../../assets/images/imagebgwatch.png')}
                                  style={{
                                    width: '130%',height:'130%',marginTop:-10,marginLeft:-1
                                  }}
                                />                            
                           </Col>
                          </Row>
                          </Card>
                             </View>
                             <Text style={styles.codeText}>Your Code</Text>
                             <Text style={styles.numText}>8GV57</Text>
                         <View style={{alignItems:'center',justifyContent:'center'}}>
                               <TouchableOpacity style={styles.touchbutton}>
                                   <Text style={styles.touchText}>Share</Text>
                               </TouchableOpacity>
                         </View>
                 </View>
                </Content>
            </Container>
        )
    }
}


const styles = StyleSheet.create({
   
  mainHead:{
    textAlign:'center',
    fontFamily:'OpenSans',
    fontSize:18,
    color:'#7E49C3',
    fontWeight:'700'
  },
  subHead:{
    textAlign:'center',
    fontFamily:'OpenSans',
    fontSize:18,
    color:'gray',
    marginTop:20,
    lineHeight:30
  },
  mainCard:{
    borderRadius: 10,
    marginLeft:15,
    marginRight:15
  },
  MainRow:{
    height: 60, 
    width: '100%', 
    overflow: 'hidden', 
    backgroundColor: "#fff",
    borderRadius:10,
  },
  codeText:{
    textAlign:'center',
    fontFamily:'OpenSans',
    fontSize:18,
    color:'gray',
    marginTop:30,
    lineHeight:30
  },
  numText:{
    textAlign:'center',
    fontFamily:'OpenSans',
    fontSize:18,
    color:'#7E49C3',
    marginTop:10,
    fontWeight:'700'
  },
  touchbutton:{
    backgroundColor:'#7E49C3',
    borderRadius:20,
    paddingLeft:40,
    paddingRight:40,
    paddingTop:8,
    paddingBottom:8,
    marginTop:20
  },
  touchText:{
    textAlign:'center',
    fontFamily:'OpenSans',
    fontSize:18,
    color:'#fff',
    fontWeight:'700'
  },
  innerText:{
    color:'#775DA3',
    fontSize:14,
    textAlign:'left',
    marginLeft:15,
    lineHeight:20,
    fontWeight:'500'
  }
})

export default EarnReward