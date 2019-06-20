import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Card, List, ListItem,View, Left, Right,Toast,Thumbnail, Body, Icon, locations, ScrollView, ProgressBar ,Item,Radio} from 'native-base';
import { fetchUserProfile } from '../../providers/profile/profile.action';
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
           data:{
            gender:''
           },
           starCount: 3.5,
           userId:'',
           bookedAppointments: [1,2,3],
           modalVisible:false,

        }; 
        
      }
    async componentDidMount() {
        const isLoggedIn = await hasLoggedIn(this.props);
        if(!isLoggedIn) {
            this.props.navigation.navigate('login');
            return
        }
        this.getUserProfile();  

    }  
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

      getUserProfile= async () => {
        try { 
         let fields = "first_name,last_name,gender,dob,mobile_no,secondary_mobiles,email,secondary_emails,insurance,address,is_blood_donor,is_available_blood_donate,blood_group,profile_image"         
         let userId= await AsyncStorage.getItem('userId');
         console.log(this.state.userId);
         let result = await fetchUserProfile(userId,fields);    
         console.log(result);      
         console.log(this.props.profile.success);      
         if(this.props.profile.success) {
            this.setState({ data: result});
         }   
    
        } 
        catch (e) {
          console.log(e);
        }    
      }

      modalBoxOpen(){
          this.setState({modalVisible:!this.state.modalVisible});
      }

      updateGender=()=>{

           console.log("update Gender is running");
    //       try {

    //       const userId = await AsyncStorage.getItem('userId')
    //       let requestData={
    //           gender:this.state.gender
    //       }
    //        let response= await userFiledsUpdate(userId,requestData);
    //         if (response.success) {
    //             Toast.show({
    //                 text: 'Gender updated',
    //                 type: "success",
    //                 duration: 3000
    //             });
    //         }
    //         else {
    //             Toast.show({
    //                 text:response.message,
    //                 type: "danger",
    //                 duration: 3000
    //             });
    //         }
        
    // }catch (e) {
    //     console.log(e);
    // }
}
    

    onPressRadio(value){
            this.setState(state=>(state.data.gender=value,state))
            console.log(this.state.data.gender+'gender');
        }
       editProfile(screen) {
           console.log(screen);
         this.props.navigation.navigate(screen, {screen:screen,fromProfile:true, updatedata: this.state.data })
        
      }



    render() {
        const { profile : { isLoading } } = this.props;
        const {data } = this.state;
        return (

            <Container style={styles.container}>
            
            <NavigationEvents
            onWillFocus={payload => {this.getUserProfile(payload)}}
            />


                {isLoading ? 
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
                                         <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontFamily: 'OpenSans', backgroundColor: '#fff', borderRadius: 20, padding: 10, marginTop: 5 }}>{data.first_name +" "+ data.last_name}
                                         </Text>
                                         <Col>
                                        <Icon name="create" style={{fontSize:15}} onPress={() => this.editProfile('userdetails')} />
                                        </Col>
                                   
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
                            <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={styles.topValue}>Sex </Text>
                                <Right>
                                <Icon name="create"  style={{fontSize:15}} onPress={() => this.modalBoxOpen()}/>
                                </Right>
                                                     
                                <Text note style={styles.bottomValue}>{data.gender} </Text>
                            </Col>

                    <Modal isVisible={this.state.modalVisible} >

                    <Card style={{ marginTop:5,padding:10, borderRadius: 7, height: 100,justifyContent: 'center'}}>
                        <ListItem noBorder>
                            
                            <Radio selected={this.state.data.gender==='M'} onPress={() => this.onPressRadio('M')} style={{ marginLeft: 2, }} color={"#775DA3"}
                                selectedColor={"#775DA3"} />
                            <Text style={{marginLeft: 10, fontFamily: 'OpenSans'}}>Male</Text>

                            <Radio selected={this.state.data.gender==='F'} onPress={() => this.onPressRadio('F')} style={{ marginLeft: 10 }} color={"#775DA3"}
                                selectedColor={"#775DA3"} />
                            <Text style={{marginLeft: 10, fontFamily: 'OpenSans'}}>Female</Text>

                            <Radio selected={this.state.data.gender==='O'} onPress={() => this.onPressRadio('O')}  style={{ marginLeft: 10 }} color={"#775DA3"}
                                selectedColor={"#775DA3"} />
                            <Text style={{ marginLeft: 10 }}>Other</Text>
                            
                         <Button  style={styles.updateButton} onPress={this.updateGender}>
                                      <Text uppercase={false}>Update</Text>
                        </Button>

                        </ListItem> 

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
                                <FlatList
                                      data={data.secondary_emails}
                                      renderItem={({ item })=>(  
                                      <List>                        
                                        <Text note style={styles.customText}>{item.type}</Text>                                  
                                        <Text note style={styles.customText}>{item.email_id}</Text> 
                                      </List>
                                     )}
                                     keyExtractor={(item, index) => index.toString()}
                                    />            
                               </Body>
                            <Right>
                            <Icon name="create" onPress={() => this.editProfile('UpdateEmail')} />
                            </Right>
                        </ListItem>



                        <ListItem avatar>
                            <Left>
                                <Icon name="locate" style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                             {data.address ? 
                                  <Body>
                                    <Text style={styles.customText}>Address</Text>
                                    <Text note style={styles.customText}>{data.address && data.address.address.no_and_street}</Text>
                                    <Text note style={styles.customText}>{data.address && data.address.address.address_line_1} </Text>
                                    <Text note style={styles.customText}>{data.address && data.address.address.address_line_2}</Text>
                                    <Text note style={styles.customText}>{data.address && data.address.address.city}</Text>
                                    <Text note style={styles.customText}>{data.address && data.address.address.pin_code}</Text>
                                  </Body>  
                               :
                                <Button transparent>
                                 <Icon name='add' style={{ color: 'gray' }} />
                                  <Text uppercase={false} style={styles.customText}>Add your Address</Text>
                                </Button> }
                                
                        </ListItem>
                    
                      <ListItem avatar>
                      
                            <Left>
                                <Icon name="call" style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                            
                                <Body>
                                    <Text style={styles.customText}>Contact</Text>
                                    <Text note style={styles.customText}>{data.mobile_no}</Text>  
                                    <FlatList
                                      data={this.state.data.secondary_mobiles}
                                      renderItem={({ item })=>(  
                                      <List>                        
                                        <Text note style={styles.customText}>{item.type}</Text>                                  
                                        <Text note style={styles.customText}>{item.number}</Text> 
                                      </List>
                                     )}
                                     keyExtractor={(item, index) => index.toString()}
                                    />            
                                </Body>
                              
                             <Right>
                                <Icon name="create" onPress={() => this.editProfile('UpdateContact')}></Icon>
                             </Right>
                              
                            
                        </ListItem>
                       
                        <ListItem avatar>
                            <Left>
                                <Icon name="flame" style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                            <Body>
                                <Text style={styles.customText}>Insurance</Text>
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

                            </Body>
                            <Right>
                                <Icon name="create" onPress={() => this.editProfile('UpdateInsurance')} ></Icon>
                            </Right>
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


                    <List>
                        <Text style={styles.titleText}>Your Doctors</Text>


                      <FlatList
                        data={this.state.bookedAppointments}
                        renderItem={({ item }) => (
                       <ListItem avatar noBorder>
                            <Left>
                                <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 40, width: 40 }} />
                            </Left>
                            <Body>
                                <Text> {data.first_name +" "+ data.last_name} </Text>

                                <Text note>{data.address && data.address.address_line_2_}</Text>

                            </Body>
                            <Right>
                                <Button style={styles.docbutton}><Text style={{ fontFamily: 'OpenSans', fontSize: 12 }}> Book Again</Text></Button>
                            </Right>

                        </ListItem>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        />

                       
                    </List>


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
        height: 45,
        width: 'auto',
        borderRadius: 10,
        textAlign: 'center',
        // backgroundColor: '#775DA3',
        color: 'white',
        marginTop: 20,
        fontSize: 12
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

