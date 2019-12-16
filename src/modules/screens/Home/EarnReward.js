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
                    <View>
                <Text style={{textAlign:'center',fontFamily:'OpenSans',fontSize:18,color:'#7E49C3'}}>Free Rewards !</Text>
                <Text style={{textAlign:'center',fontFamily:'OpenSans',fontSize:18,color:'gray',marginTop:20,lineHeight:30}}>Invite your friends to join Medflic and get upto Rs.100 /-</Text>
                <View style={{justifyContent:'center',alignItems:'center',marginTop:20}}>
                <Image
                      source={require('../../../../assets/images/gift.png')}
                     style={{
                            width: 120,height:120,alignItems:'center'
                         }}
                     />
                     </View>
                     <View style={{marginTop:30}}>
                             <Card style={{  borderRadius: 10,marginLeft:15,marginRight:15}}>
                          <Row style={{ height: 60, width: '100%', overflow: 'hidden', backgroundColor: "#fff",borderRadius:10,}}>
                           <Col style={{width:'70%'}}>
                           <ImageBackground 
                            source={require('../../../../assets/images/bg.png')}
                              style={{
                                width: '100%',height:'100%',alignItems:'center',justifyContent:'center'
                              }}
                            >
                                <Text style={{color:'#775DA3',fontSize:14,textAlign:'left',marginLeft:15,lineHeight:20,}}>Invite 25 peoples to Get Branded Watch absolutely free!!!</Text>
                                </ImageBackground>
                           </Col> 
                           <Col style={{width:'30%',}}>
                        
                          <Image
                                  source={require('../../../../assets/images/imagebgshape.png')}
                                  style={{
                                    width: '130%',height:'130%',marginTop:-10,marginLeft:-18
                                  }}
                                />
                                  
                             
                           </Col>
                          </Row>
                          </Card>
                             </View>
                             <Text style={{textAlign:'center',fontFamily:'OpenSans',fontSize:18,color:'gray',marginTop:30,lineHeight:30}}>Your Code</Text>
                             <Text style={{textAlign:'center',fontFamily:'OpenSans',fontSize:18,color:'#7E49C3',marginTop:10}}>8GV57</Text>
<View style={{alignItems:'center',justifyContent:'center'}}>
<TouchableOpacity style={{backgroundColor:'#7E49C3',borderRadius:20,paddingLeft:40,paddingRight:40,paddingTop:8,paddingBottom:8,marginTop:20}}>
    <Text style={{textAlign:'center',fontFamily:'OpenSans',fontSize:18,color:'#fff',}}>Share</Text>
</TouchableOpacity>
</View>
                 </View>
                </Content>
            </Container>
        )
    }
}


const styles = StyleSheet.create({
   
})

export default EarnReward