import React from "react";
import { AppRegistry, Image, StatusBar,TouchableOpacity} from "react-native";
import { Container, Content, Text, List, ListItem,View,Row,Col,Footer,FooterTab,Icon,Button } from "native-base";

const routes = ["Home", "Profile","Pharmacy","Orders","MyAppoinmentList"];
class SideBar extends React.Component {
  render() {
    return (
      <Container>
      
          <Content>
          <View style={{height:120,backgroundColor:'#7f49c3',}}>
            
            <Image square source={require('../../../assets/images/Logo.png')} style={{flex:1, width: undefined, height: undefined,opacity:0.1,transform:[{rotate:'-2deg'}]}}/>
           
             <Row style={{alignItems:'center',marginLeft:15,position:'absolute',marginTop:30}}>
               <Col style={{width:'25%'}}>
                  <Image square source={require('../../../assets/images/Female.png')} 
                     style={{ height: 60, width: 60,borderColor:'#fff',borderWidth:2,borderRadius:30}}
                   />
              </Col>
               <Col style={{width:'75%',marginLeft:10,}}>
                 <Text style={{fontFamily:'OpenSans',fontSize:18,fontWeight:'bold',color:'#fff'}}>Dr.S.Reshma Guptha</Text>
                 <Text style={{fontFamily:'OpenSans',fontSize:13,color:'#fff'}}>View Profile</Text>
                  {/* <View style={{alignItems:'center',marginLeft:-95}}>
                    <TouchableOpacity style={{borderColor:'#fff',borderWidth:2,borderRadius:5,padding:5,alignItems:'center',paddingRight:15,paddingLeft:15}}>
                       <View style={{flexDirection:'row'}}>
                         <Icon name='log-in' style={{color:'#FFF',fontSize:25}}/>
                         <Text style={{fontFamily:'OpenSans',fontSize:15,fontWeight:'bold',color:'#FFF',marginTop:4,marginLeft:5}}>SIGN IN</Text>
                      </View>
                   </TouchableOpacity>
                 </View> */}
               </Col>
              </Row> 
             

          </View>
          <List style={{borderBottomWidth:0}}
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem style={{borderBottomWidth:0}}
                  button
                  onPress={() => this.props.navigation.navigate(data)}>
                      <View>
                      <Row>
                          <Col style={{width:'15%'}}>
                          <Image square source={require('../../../assets/images/Home.png')} 
                          style={{ height: 20, width: 20,}}
                            />
                          </Col>
                          <Col style={{width:'85%',alignItems:'flex-start'}}>
                          <Text style={{fontFamily:'OpenSans',fontSize:15,}}>{data}</Text>
                          </Col>
                      </Row>
                      </View>
                </ListItem>
              );
            }}
          />
        
          </Content>
          <View>
           <Row style={{marginLeft:20,marginTop:-120}}>
              <Col style={{width:'13%'}}>
                 <Icon name='ios-power' style={{fontSize:20}}/>
              </Col>
              <Col style={{width:'87%'}}>
                <Text  style={{fontFamily:'OpenSans',fontSize:15,}}>Sign Out</Text>
              </Col>
           </Row>   
           <Footer style={{marginTop:10,backgroundColor:'#fff'}}>
              <FooterTab style={{justifyContent:'center',alignItems:'center',backgroundColor:'#7f49c3'}}>
                <Text style={{textAlign:'center',fontFamily:'OpenSans',fontWeight:'700',fontSize:25,color:'#fff'}}>MEDFLIC</Text>
              </FooterTab>
           </Footer>
         </View>
      </Container>
    );
  }
}

export default SideBar