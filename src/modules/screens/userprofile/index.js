import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Card, List, ListItem,View, Left, Right,Toast,Thumbnail, Body, Icon, locations, ScrollView, ProgressBar ,Item,Radio} from 'native-base';
import { fetchUserProfile } from '../../providers/profile/profile.action';
import { getPatientWishList } from '../../providers/bookappointment/bookappointment.action';
import { hasLoggedIn,userFiledsUpdate } from '../../providers/auth/auth.actions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { dateDiff } from '../../../setup/helpers';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, AsyncStorage,TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import { FlatList } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import { Loader } from '../../../components/ContentLoader'

class Profile extends Component {
    
     navigation = this.props.navigation;
    constructor(props) {
    
        super(props);
        this.state = {
           data:{},
           gender:'',
           starCount: 3.5,
           userId:'',
            modalVisible: false,
            isLoading:false
           
        //    favouriteList: []
        }; 
        
      }
    async componentDidMount() {
       
        const isLoggedIn = await hasLoggedIn(this.props);
        if(!isLoggedIn) {
            this.props.navigation.navigate('login');
            return
        }
          
        
        this.getUserProfile(); 
        this.getfavouritesList() 

    }  
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    /*Get userProfile*/
      getUserProfile= async () => {
          try { 
              this.setState({ isLoading: true });
         let fields = "first_name,last_name,gender,dob,mobile_no,secondary_mobiles,email,secondary_emails,insurance,address,is_blood_donor,is_available_blood_donate,blood_group,profile_image"         
         let userId= await AsyncStorage.getItem('userId');
         let result = await fetchUserProfile(userId,fields);    
         console.log(this.props.profile.success);      
         if(this.props.profile.success) {
            this.setState({ data: result, gender:result.gender});
              }   
              
        } 
        catch (e) {
          console.log(e);
          }  
          finally {
              this.setState({ isLoading: false });
          }
      }

      getfavouritesList = async () => {
        try {
           this.setState({isLoading: true});
           debugger 
           let userId = await AsyncStorage.getItem('userId');
           let result = await getPatientWishList(userId);
           console.log(result);
        //    if (result.success) {
        //         this.setState({ favouriteList: result.data });
        //     }
        }
        catch (e) {
            console.log(e)
        } finally {
            this.setState({isLoading: false});
        }
    }

        /*Update Gender*/
        updateGender = async () => {
          try {
          const userId = await AsyncStorage.getItem('userId')
          let requestData={
              gender:this.state.gender
          }
           let response= await userFiledsUpdate(userId,requestData);
           console.log(response);
            if (response.success) {
                await Toast.show({
                    text: 'Gender updated successfuly',
                    type: "success",
                    duration: 3000
                });
            }
            else {
               await Toast.show({
                    text:response.message,
                    type: "danger",
                    duration: 3000
                });
            }
            this.setState({modalVisible:!this.state.modalVisible});
        
    }catch (e) {
        console.log(e);
    }
}

    /*Open the Modal box*/
    modalBoxOpen(){
        this.setState({modalVisible:!this.state.modalVisible});
      }

    
    /*Press Radio button*/
    onPressRadio(value){
            this.setState({gender:value})
    }

    editProfile(screen) {
       console.log(screen);
       this.props.navigation.navigate(screen, {screen:screen,fromProfile:true, updatedata: this.state.data||'' })
    }

    render() {
        // const { profile : { isLoading } } = this.props;
        const {data, gender } = this.state;
        return (

            <Container style={styles.container}>
            
            <NavigationEvents
            onWillFocus={payload => {this.getUserProfile(payload)}}
            />


                {this.state.isLoading ? 
                    <Loader style={'profile'} /> :
                
                  <Content style={styles.bodyContent}>

                    <LinearGradient colors={['#7E49C3', '#C86DD7']} style={{ height: 180 }}>
                        <Grid>
                            <Row>
                             <Col style={{ width: '10%' }}>
                              </Col>
                                <Col style={styles.customCol}>
                                <Icon name="heart" style={styles.profileIcon}></Icon>
                                </Col>
                                <Col style={{ width: '40%' }} >
                                    {data.profile_image != undefined ?
                                    <Thumbnail style={styles.profileImage} source={data.profile_image.imageURL} style={{ height: 86, width: 86 }} />:
                                    <Thumbnail style={styles.profileImage} source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} />}
                                        <View style={{flexDirection:'row'}}>
                                         <Text style={{ marginLeft: 'auto', marginRight: 'auto',padding:5, fontFamily: 'OpenSans', backgroundColor: '#fff', borderRadius: 10, marginTop: 5 }}>{data.first_name +" "+ data.last_name}
                                         </Text>
                                        <Icon name="create" style={{fontSize:17,marginTop:10}} onPress={() => this.editProfile('UpdateUserDetails')} />
                                        </View>
                                </Col>
                                <Col style={styles.customCol}>
                                    <Icon name="heart" style={styles.profileIcon}></Icon>
                                </Col>
                                <Col style={{ width: '10%' }}>
                                </Col>
                            </Row>

                        </Grid>
                    </LinearGradient>
                    <Card>
                        <Grid style={{ padding: 10 }}>
                            <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={styles.topValue}> Age </Text>
                                <Text note style={styles.bottomValue}> {dateDiff(data.dob, new Date(),'years')}  </Text>
                            </Col>
                            <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto',justifyContent:'center' }}>
                            <View style={{flexDirection:'row'}}>                 
                                <Text style={styles.topValue}>Gender </Text>
                                <Icon name="create"  style={{fontSize:15,marginLeft:-20}} onPress={() => this.modalBoxOpen()}/>
                                </View>
                                <Text note style={styles.bottomValue}>{gender} </Text>

                            </Col>

                    <Modal isVisible={this.state.modalVisible} >                                      
                    <Card style={{ padding:10, borderRadius: 7, height: 150,justifyContent: 'center'}}>
                        <H3 style={{ fontFamily: 'OpenSans',marginTop:15 }}>Update Gender</H3>
                       <ListItem noBorder>
                                           
                            <Radio selected={this.state.gender==='M'} onPress={() => this.onPressRadio('M')} style={{ marginLeft: 2, }} color={"#775DA3"}
                                selectedColor={"#775DA3"} />
                            <Text style={{marginLeft: 10, fontFamily: 'OpenSans'}}>Male</Text>

                            <Radio selected={this.state.gender==='F'} onPress={() => this.onPressRadio('F')} style={{ marginLeft: 10 }} color={"#775DA3"}
                                selectedColor={"#775DA3"} />
                            <Text style={{marginLeft: 10, fontFamily: 'OpenSans'}}>Female</Text>

                            <Radio selected={this.state.gender==='O'} onPress={() => this.onPressRadio('O')}  style={{ marginLeft: 10 }} color={"#775DA3"}
                                selectedColor={"#775DA3"} />
                            <Text style={{ marginLeft: 10 }}>Other</Text>   

                        </ListItem> 
                        
                        <Button  style={styles.updateButton} onPress={()=>this.updateGender()}
 >
                                      <Text uppercase={false}>Update</Text>
                        </Button>

                    </Card>
  
                    </Modal>

                            

                            
                            <Col style={{ backgroundColor: 'transparent', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={styles.topValue}>Blood</Text>
                                <Text note style={styles.bottomValue}> {data.blood_group} </Text>
                            </Col>
                        </Grid>
                    </Card>

                    


                    <List>
                        <Text style={styles.titleText}>Personal details..</Text>


                        <ListItem avatar>
                            <Left>
                                <Icon name="mail" style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                            <Body>
                                <Text style={styles.customText}>Email</Text>
                                <Text note style={styles.customText}>{data.email}</Text>
                                {data.secondary_emails!=undefined?
                                <FlatList
                                      data={data.secondary_emails}
                                      renderItem={({ item })=>(  
                                      <List>
                        
                                        <Text style={styles.customText}>{item.type}</Text>                                  
                                        <Text note style={styles.customText}>{item.email_id}</Text>
                                        
                                      </List>
                                     )}
                                     keyExtractor={(item, index) => index.toString()}
                                    />            
                                :<Button transparent>
                                 <Icon name='add' style={{ color: 'gray' }} />
                                  <Text uppercase={false} style={styles.customText} onPress={() => this.editProfile('UpdateEmail')} >Add Secondary email</Text>
                                </Button>}
                               </Body>
                               {data.secondary_emails!=undefined? 
                            <Right>
                            <Icon name="create" onPress={() => this.editProfile('UpdateEmail')} />
                            </Right>:null}
                        </ListItem>



                        <ListItem avatar>
                           
                                <Left>
                                    <Icon name="locate" style={{ color: '#7E49C3' }}></Icon>
                                </Left>
                                {data.address!=undefined ?

                                  <Body>

                                    <Text style={styles.customText}>Address</Text>
                                    <Text note style={styles.customText}>{data.address && data.address.address.no_and_street}</Text>
                                    <Text note style={styles.customText}>{data.address && data.address.address.address_line_1} </Text>
                                    <Text note style={styles.customText}>{data.address && data.address.address.address_line_2}</Text>
                                    <Text note style={styles.customText}>{data.address && data.address.address.city}</Text>
                                    <Text note style={styles.customText}>{data.address && data.address.address.pin_code}</Text>                                    
                                        
                                      
                                            <Right>
                                                <Icon name="create" onPress={() => this.editProfile('UpdateAddress')} />
                                            </Right>
        
                                        
                                    </Body> : null}  
                                
                        </ListItem>
                    
                      <ListItem avatar>
                      
                            <Left>
                                <Icon name="call" style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                            
                                <Body>
                                    <Text style={styles.customText}>Contact</Text>
                                    <Text note style={styles.customText}>{data.mobile_no}</Text>
                                    { data.secondary_mobiles!=undefined?  
                                    <FlatList
                                      data={this.state.data.secondary_mobiles}
                                      renderItem={({ item })=>(  
                                      <List>                        
                                        <Text style={styles.customText}>{item.type}</Text>                                  
                                        <Text note style={styles.customText}>{item.number}</Text> 
                                      </List>
                                     )}
                                     keyExtractor={(item, index) => index.toString()}
                                    />
                                 :<Button transparent>
                                 <Icon name='add' style={{ color: 'gray' }} />
                                  <Text uppercase={false} style={styles.customText} onPress={() => this.editProfile('UpdateContact')}>Add Secondary Contact</Text>
                                </Button>}
                                           
                                </Body>
                            { data.secondary_mobiles!=undefined?  
                             <Right>
                                <Icon name="create" onPress={() => this.editProfile('UpdateContact')}></Icon>
                             </Right>:null}
                              
                            
                        </ListItem>
                       
                        <ListItem avatar>
                            <Left>
                                <Icon name='heartbeat' type='FontAwesome' style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                            <Body>
                                <Text style={styles.customText}>Insurance</Text>
                            {data.insurance!=undefined? 

                                <FlatList
                                      data={this.state.data.insurance}
                                      renderItem={({ item })=>(  
                                      <List>                        
                                        <Text note style={styles.customText}>{item.insurance_no}</Text>                                  
                                        <Text note style={styles.customText}>{item.insurance_provider}</Text> 
                                      </List>
                                     )}
                                     keyExtractor={(item, index) => index.toString()}
                                    />            
                                :<Button transparent>
                                <Icon name='add' style={{ color: 'gray' }} />
                                 <Text uppercase={false} style={styles.customText} onPress={() => this.editProfile('UpdateInsurance')}>Add Insurance</Text>
                               </Button>}                                         
                            </Body>

                            {data.insurance!=undefined?
                            <Right>
                            <Icon name="create" onPress={() => this.editProfile('UpdateInsurance')} ></Icon>
                            </Right>:null}

                        </ListItem>



                        <ListItem avatar>
                            <Left>
                                <Icon name="briefcase" style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                            <Body>
                                <Text style={styles.customText}>Change Password</Text>
                                <Text note style={styles.customText}>*********</Text>

                            </Body>
                            <Right>
                                <Icon name="create" onPress={() => this.editProfile('UpdatePassword')}></Icon>
                            </Right>
                        </ListItem>

                    </List>

                  {/* {this.state.favouriteList.length === 0 ? null :                          */}
                    <List>
                        <Text style={styles.titleText}>Your Doctors</Text>


                      {/* <FlatList
                        data={this.state.favouriteList}
                        renderItem={({ item }) => (
                       <ListItem avatar noBorder>
                            <Left>
                                <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 40, width: 40 }} />
                            </Left>
                            <Body>
                                <Text> {item.doctorInfo.prefix ? item.doctorInfo.prefix : '' } {item.doctorInfo.first_name +" "+ item.doctorInfo.last_name} </Text>
                            </Body>
                            <Right>
                                <Button style={styles.docbutton}><Text style={{ fontFamily: 'OpenSans', fontSize: 12 }}> Book Again</Text></Button>
                            </Right>

                        </ListItem>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        /> */}
                        </List> 
                    {/* } */}
                </Content> }


            </Container>

        )
    }

}

function profileState(state) {

    return {
        profile: state.profile
    }
}
export default connect(profileState)(Profile)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {

    },

    customHead:
    {
        fontFamily: 'OpenSans',
    },
    customText:
    {

        fontFamily: 'OpenSans',
    },
    logo: {
        height: 80,
        width: 80,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },

    customCard: {
        borderRadius: 20,
        padding: 10,
        marginTop: -100,
        marginLeft: 20,
        marginRight: 20,
        fontFamily: 'OpenSans',

    },
    topValue: {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'OpenSans',
    },
    bottomValue:
    {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'OpenSans',
    },
    updateButton:
    {
        height: 30,
        width: 'auto',
        borderRadius: 10,
        textAlign: 'center',
        color: 'white',
        marginTop: 10,
        marginBottom:10,
        fontSize: 12,
        marginLeft:80
        
        },

    titleText: {
        fontSize: 15,
        padding: 5,
        margin: 10,
        backgroundColor: '#FF9500',
        borderRadius: 20,
        color: 'white',
        width: 150,
        textAlign: 'center',
        fontFamily: 'OpenSans',

    },
    docbutton: {
        height: 35,
        width: "auto",
        borderRadius: 20,
        backgroundColor: '#7357A2',
        marginTop: 5

    },
    profileIcon:
    {
        color: '#fff',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        fontSize: 35,

    },
    profileImage:
    {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 25,
        height: 80,
        width: 80,
        borderColor: '#f5f5f5',
        borderWidth: 2,
        borderRadius: 50
    }, customCol:
    {
        width: '20%',

        borderRadius: 25,
        borderColor: '#fff',
        height: 50, width: 50,
        backgroundColor: '#C86DD7',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    }


});

