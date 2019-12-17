import React, { Component } from 'react';
import {
    Container, Content, View, Text, Title, Header, H3, Button, Item, CardItem, Row, Col,
    List, ListItem, Left, Right, Card, Thumbnail, Body, Icon, ScrollView,Grid
} from 'native-base';
import { StyleSheet, TouchableOpacity, AsyncStorage, FlatList, Image,ImageBackground,Share} from 'react-native';
import { fetchUserProfile } from '../../providers/profile/profile.action';
import { hasLoggedIn } from "../../providers/auth/auth.actions";
import Spinner from "../../../components/Spinner";
import{ SHARE_URL} from '../../../setup/config'

class EarnReward extends Component {
    constructor(props) {
        super(props)
        this.state = {
          isLoading:false,
          data:[]
        }
    }
   async componentDidMount(){
      // const isLoggedIn = await hasLoggedIn(this.props);
      //   if (!isLoggedIn) {
      //       this.props.navigation.navigate("login");
      //       return;
      //   }
      this.getReferCode()
    }
    getReferCode = async () => {
      try {
          let fields = "refer_code"
  let result={}
          // let userId = await AsyncStorage.getItem('userId');
          // let result = await fetchUserProfile(userId, fields);
    
          if (result) {
              this.setState({ data: result ,isLoading:true});
          }
          else{
            
            result.refer_code='456789'
            this.setState({ data:result ,isLoading:true})
          }


      }
      catch (e) {
          console.log(e);
      }
      finally {
          this.setState({ isLoading: true });
      }
  }
  onShare = async () => {
    try {
 

      const result = await Share.share({
        message:
          'Join me on medflic a doctor  appointment booking app',
        url:'http://user/medflic/'
      });
alert(JSON.stringify(result))
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

   

    render() {
       
        return (
            <Container style={styles.container}>
              <Content style={styles.bodyContent}>
              {this.state.isLoading === false ?
                        <Spinner
                            color="blue"
                            style={[styles.containers, styles.horizontal]}
                            visible={true}
                            size={"large"}
                            overlayColor="none"
                            cancelable={false}
                        /> :
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
                                <Text style={styles.numText}>{this.state.data.refer_code||''}</Text>
                         <View style={{alignItems:'center',justifyContent:'center'}}>
                               <TouchableOpacity style={styles.touchbutton} onPress={this.onShare}>
                                   <Text style={styles.touchText}>Share</Text>
                               </TouchableOpacity>
                         </View>
                 </View>}
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