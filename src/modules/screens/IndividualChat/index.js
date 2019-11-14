import React, { Component } from 'react';
import { Container, Content, View, Text,Right, Item,Input,Card,Grid,Left,Icon,Thumbnail, Spinner,Footer, Radio,Row,Col,Form,Button, } from 'native-base';
import {StyleSheet,TextInput,Image} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';


class IndividualChat extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
    }


    render() {
        return (
            <Container>
            <Content>
                <View>
                {/* <View style={{height:600,position:'relative'}}>
            <Image source={require('../../../../assets/images/mobile.jpg')} style={{flex:1, width: null, height: null,}}/>
            </View> */}
           
            <Item style={styles.mainItem}>
                       <Right>
                     <Item style={{borderBottomWidth:0}}>
                         <View style={styles.viewStyle}>
                           <Text style={{fontFamily:'OpenSans',fontSize:8,color:'gray'}}>12.32 PM</Text>
                           </View>
                           <View style={styles.viewStyle}>
                           <Card style={{borderRadius:10,backgroundColor:'#7E49C3',}}>
                           <Text style={styles.textstyle}>Hello,can i talk to Dr.Mukesh
                           </Text>
                           </Card>
                           </View>
                          
                           <View style={styles.viewStyle}>
                           <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{width:40,height:40,}}/>
                           </View>
                           </Item> 
                       </Right>
                       </Item> 


                       <Item style={styles.mainItem}>
               <Left>
                     <Item style={{borderBottomWidth:0}}>  
                     <View style={styles.viewStyle}>
                          <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{width:40,height:40,}}/>
                      </View>
                         
                      <View style={styles.viewStyle}>
                          <Card style={{borderRadius:10,backgroundColor:'#fff',}}>
                          <Text style={styles.textstyle2}>He has gone out on business Can I help You?</Text>
                          </Card>
                         </View>
                         <View style={styles.viewStyle}>
                          <Text style={{fontFamily:'OpenSans',fontSize:8,color:'gray'}}>12.32 PM</Text>
                       </View>
                       </Item>
                       </Left>   
                        </Item>


                        <Item style={styles.mainItem}>
                       <Right >
                     <Item style={{borderBottomWidth:0}}>
                         <View style={styles.viewStyle}>
                           <Text style={{fontFamily:'OpenSans',fontSize:8,color:'gray'}}>12.32 PM</Text>
                           </View>
                           <View style={{justifyContent:'center',padding:2,width:'60%'}}>
                           <Card style={{borderRadius:10,backgroundColor:'#7E49C3'}}>
                           <Text style={styles.textstyle}>I am Balan... All the goods supplied by your firm
                           were delivered.However,some flower vases were broken.Please ask him if they will be replaced.Also tell him that
                           I'll make the payment in two days time.
                           </Text>
                           </Card>
                           </View>
                          
                           <View style={styles.viewStyle}>
                           <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{width:40,height:40,}}/>
                           </View>
                           </Item> 
                       </Right>
                       </Item> 
                       <Item style={styles.mainItem}>
               <Left>
                     <Item style={{borderBottomWidth:0}}>  
                     <View style={styles.viewStyle}>
                          <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{width:40,height:40,}}/>
                      </View>
                         
                      <View style={{justifyContent:'center',padding:2,width:'60%'}}>
                          <Card style={{borderRadius:10,backgroundColor:'#fff',}}>
                          <Text style={styles.textstyle2}>I will inform him when he comes back and will ask himto get back to you. </Text>
                          </Card>
                         </View>
                         <View style={styles.viewStyle}>
                          <Text style={{fontFamily:'OpenSans',fontSize:8,color:'gray'}}>12.32 PM</Text>
                       </View>
                       </Item>
                       </Left>   
                      
                  
              </Item>

              <Item style={styles.mainItem}>
                       <Right>
                     <Item style={{borderBottomWidth:0}}>
                         <View style={styles.viewStyle}>
                           <Text style={{fontFamily:'OpenSans',fontSize:8,color:'gray'}}>12.32 PM</Text>
                           </View>
                           <View style={styles.viewStyle}>
                           <Card style={{borderRadius:10,backgroundColor:'#7E49C3',}}>
                           <Text style={styles.textstyle}>Thank you
                           </Text>
                           </Card>
                           </View>
                          
                           <View style={styles.viewStyle}>
                           <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{width:40,height:40,}}/>
                           </View>
                           </Item> 
                       </Right>
                       </Item> 

               <Item style={styles.mainItem}>
               <Left>
                     <Item style={{borderBottomWidth:0}}>  
                     <View style={styles.viewStyle}>
                          <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{width:40,height:40,}}/>
                      </View>
                         
                      <View style={styles.viewStyle}>
                          <Card style={{borderRadius:10,backgroundColor:'#fff',}}>
                          <Text style={styles.textstyle2}>Hello,is this Bala?</Text>
                          </Card>
                         </View>
                         <View style={styles.viewStyle}>
                          <Text style={{fontFamily:'OpenSans',fontSize:8,color:'gray'}}>12.32 PM</Text>
                       </View>
                       </Item>
                       </Left>   
                      
                  
              </Item>

              <Item style={styles.mainItem}>
                       <Right>
                     <Item style={{borderBottomWidth:0}}>
                         <View style={styles.viewStyle}>
                           <Text style={{fontFamily:'OpenSans',fontSize:8,color:'gray'}}>12.32 PM</Text>
                           </View>
                           <View style={styles.viewStyle}>
                           <Card style={{borderRadius:10,backgroundColor:'#7E49C3',}}>
                           <Text style={styles.textstyle}>Yes
                           </Text>
                           </Card>
                           </View>
                          
                           <View style={styles.viewStyle}>
                           <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{width:40,height:40,}}/>
                           </View>
                           </Item> 
                       </Right>
                       </Item> 
                    </View>    
            </Content>
             <Footer style={styles.footerStyle}>
                <Row style={{alignItems:'center',justifyContent:'center'}}>
                    <Col style={styles.col1}>
                    <View style={styles.circle}>
                    <Icon name="ios-camera" style={{ color: '#7E49C3', fontSize:25,padding:2}} />

                    </View>
                    </Col>
                    <Col style={styles.col2}>
                    <Row style={styles.SearchRow}>
                    
                    <Col size={9} style={{justifyContent:'center',}}> 
                      <Input 
                          placeholder="Start conversation..."
                          style={styles.inputfield}
                          placeholderTextColor="gray"
                          keyboardType={'email-address'}
                          underlineColorAndroid="transparent"
                          blurOnSubmit={false}
                        
                      />
                      </Col>
                      <Col size={1} style={{justifyContent:'center',borderRightRadius:10}}> 
                      
                      <Icon name="ios-mic" style={{ color: '#7E49C3', fontSize:20,padding:2}} />

                      
                  </Col>
                      </Row>
                    </Col>
                    <Col style={styles.col1}>
                    <View style={styles.circle}>
                    <Icon name="ios-send" style={{ color: '#7E49C3', fontSize:30,padding:2,transform: [{ rotate: '45deg'}]}} />

                    </View>
                    </Col>
                </Row>
            </Footer>
           </Container>
        )
    }
}

export default IndividualChat

const styles = StyleSheet.create({

  circle: {
        width: 35,
        height: 35,
        borderRadius: 35/2,
        backgroundColor: '#fff',
        alignItems:'center',
        justifyContent:'center'
    },
    SearchRow:{
        backgroundColor: 'white', 
        borderColor: '#000', 
        borderRadius: 20,
        height:35,
    },
    inputfield:{
        color: 'gray', 
        fontFamily: 'OpenSans', 
        fontSize: 10, 
        padding:5,
        paddingLeft:10
    },
    viewStyle:{
        justifyContent:'center',
        padding:2
    },
    mainItem:{
        marginLeft:10,
        marginRight:10,
        marginTop:10,
        borderBottomWidth:0,
          
       
    },
    textstyle:{
        fontFamily:'OpenSans',
        fontSize:10,
        color:'#fff',
        padding:10
    },
    textstyle2:{
        fontFamily:'OpenSans',
        fontSize:10,
        color:'#000',
        padding:10
    },
    footerStyle:{
        backgroundColor: '#7E49C3',
        justifyContent:'center' 
    },
    col1:{
        width:'15%',
        justifyContent:'center',
        alignItems:'center'
    },
    col2:{
        width:'70%',
        justifyContent:'center',
        alignItems:'center' 
    }

})