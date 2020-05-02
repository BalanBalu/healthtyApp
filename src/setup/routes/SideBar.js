import React from "react";
import { AppRegistry, Image, StatusBar,TouchableOpacity, AsyncStorage} from "react-native";
import { Container, Content, Text, List, ListItem,View,Row,Col,Footer,FooterTab,Icon,Button,Body } from "native-base";
import { DragwerLogos } from './appRouterHome';
import { logout } from '../../modules/providers/auth/auth.actions';
import FastImage from 'react-native-fast-image'
class SideBar extends React.Component {
  activeUserData = {};
  constructor(props) {
    super(props)
    this.state = {
       hasLoggedIn: false,
    };
    this.arrayData = []

}
  async componentDidMount() {
    const token = await AsyncStorage.getItem('token')
    const userId = await AsyncStorage.getItem('userId')
    if (token === undefined || userId === undefined || token === null || userId === null) {} 
    else {
      this.setState({ hasLoggedIn: true })  
    }
  }
  signInOrSignup(hasLoggedIn) {
      if(hasLoggedIn) {
        logout();
        this.props.navigation.navigate('login') 
      } else {
        this.props.navigation.navigate('login');
      }
  }
  renderProfileImageOrLogo() {
    data = this.activeUserData;
    let source = null;
    if(!data || this.state.hasLoggedIn === false) 
      return require('../../../assets/images/Logo.png');
    
    if (data.profile_image) {
       if(data.profile_image) 
         source = { uri: data.profile_image.imageURL } 
       else 
         source = require('../../../assets/images/Logo.png')
    } else {
        source = require('../../../assets/images/Logo.png')
    }
    return (source)
}

async getBasicData() {
  const basicProfileData = await AsyncStorage.getItem('basicProfileData');
  const basicData = JSON.parse(basicProfileData);
  this.activeUserData = basicData;
}
 
   render() {

    const { items, menuSubMenus} = this.props;
    const { hasLoggedIn } = this.state;
    this.getBasicData();
    return (
      <Container>
      
          <Content>
          <View style={{height:120,backgroundColor:'#7f49c3', }}>
            
            <FastImage square source={require('../../../assets/images/Logo.png')} style={{flex:1, width: undefined, height: undefined,opacity:0.1,transform:[{rotate:'-2deg'}]}}/>
           
             <Row style={{alignItems:'center',marginLeft:15,position:'absolute',marginTop:30,}}>
               <Col style={{width:'30%'}}>
                  <FastImage square source={this.renderProfileImageOrLogo()} 
                     style={{ height: 60, width: 60,borderColor:'#fff',borderWidth:2,borderRadius:30}}
                   />
              </Col>
               <Col style={{width:'70%'}}>
                {hasLoggedIn ?  
                   <View style={{marginLeft:10}}>
                    <Text style={{fontFamily:'OpenSans',fontSize:16,fontWeight:'bold',color:'#fff'}}>{this.activeUserData && (this.activeUserData.first_name +" "+ this.activeUserData.last_name) }</Text>
                   <TouchableOpacity onPress={()=> this.props.navigation.navigate('Profile')} style={{paddingRight:10,paddingTop:2,paddingBottom:10,width:'100%'}}>
                    <Text style={{fontFamily:'OpenSans',fontSize:13,color:'#fff'}}>View Profile</Text>
                    </TouchableOpacity>
                   </View>
                 : 
                   <View style={{alignItems:'center'}}>
                    <TouchableOpacity style={{borderColor:'#fff',borderWidth:2,borderRadius:5,padding:5,alignItems:'center',paddingRight:15,paddingLeft:15}}>
                       <View style={{flexDirection:'row'}}>
                         <Icon name='log-in' style={{color:'#FFF',fontSize:25}}/>
                         <Text style={{fontFamily:'OpenSans',fontSize:15,fontWeight:'bold',color:'#FFF',marginTop:4,marginLeft:5}}>MEDFLIC</Text>
                      </View>
                   </TouchableOpacity>
                 </View> } 
               </Col>
              </Row> 
          </View>
          
<View style={{marginTop:10}}>
          <List style={{borderBottomWidth:0,}}
            dataArray={menuSubMenus}
            renderRow={data => {
              return ( 
                <ListItem style={{borderBottomWidth:0, }}
                small>
                  <Body style={{borderBottomWidth:0,marginTop:-18}}>
                  <ListItem itemDivider style={{backgroundColor:'#e6e1ed'}}>
                  <Text style={{fontFamily:'OpenSans',fontSize:15, justifyContent: 'center',fontWeight:'600'  }}>{data.menuName}</Text> 
                                </ListItem>
                      <List style={{borderBottomWidth:0,}}
                        dataArray={data.subMenus}
                        renderRow={data => {
                        return (
                           <ListItem style={{borderBottomWidth:0,   backgroundColor: '#FFF'  }}
                            small
                            onPress={() => this.props.navigation.navigate(data.routeName)}>
                            <Image square source={data.icon} 
                              style={{ height: 20, width: 20,}}
                            />  
                             <Body style={{borderBottomWidth:0,}}>
                              <Text style={{fontFamily:'OpenSans',fontSize:15 }}>{data.name}</Text> 
                          </Body> 
                        </ListItem>
                        );
                      }}/>
                  </Body> 
            </ListItem> )
            }}/>  
          
           <ListItem avatar style={{marginTop:-15}}>
              <Icon name='ios-power' style={{fontSize:15,color:'#7D4ac1',marginLeft:22,
            }}/>
            <Body style={{borderBottomWidth:0,}}>
            <Text onPress={() => this.signInOrSignup(hasLoggedIn) } 
                style={{fontFamily:'OpenSans',fontSize:15,}}>{hasLoggedIn ? 'Sign Out' : 'Sign In' }</Text>
                </Body>
            </ListItem>
            </View>
        </Content>
          <View>
           <Footer style={{marginTop:10,backgroundColor:'#fff',}}>
              <FooterTab style={{justifyContent:'center',alignItems:'center',backgroundColor:'#7f49c3'}}>
                <Text style={{textAlign:'center',fontFamily:'OpenSans',fontWeight:'700',fontSize:20,color:'#fff'}}>MEDFLIC</Text>
              </FooterTab>
           </Footer>
         </View>
      </Container>
    );
  }
}

export default SideBar