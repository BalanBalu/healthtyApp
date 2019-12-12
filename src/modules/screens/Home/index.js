import React, { Component } from 'react';
import { Container, Content, Text,Toast, Title, Header, Button, H3, Item, List, ListItem, Spinner, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab } from 'native-base';
import { login, logout } from '../../providers/auth/auth.actions';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage, ScrollView, FlatList, NativeModules } from 'react-native';

import { SET_PATIENT_LOCATION_DATA  } from '../../providers/bookappointment/bookappointment.action';
import { catagries, getSpecialistDataSuggestions } from '../../providers/catagries/catagries.actions';
import { MAP_BOX_PUBLIC_TOKEN , IS_ANDROID } from '../../../setup/config';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { store } from '../../../setup/store';
import { getAllChats, SET_LAST_MESSAGES_DATA } from '../../providers/chat/chat.action'
import CurrentLocation from './CurrentLocation';
const bloodImg = require('../../../../assets/images/blood.jpeg');
const chatImg = require('../../../../assets/images/Chat.jpg');
const pharmacyImg = require('../../../../assets/images/pharmacy.jpg');

MapboxGL.setAccessToken(MAP_BOX_PUBLIC_TOKEN);
const MAX_DISTANCE_TO_COVER = 30000; // in meters

const debounce = (fun, delay) => {
    let timer = null;
    return function (...args) {
        const context = this;
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fun.apply(context, args);
        }, delay);
    };
}

class Home extends Component {
    locationUpdatedCount = 0;
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false,
            catagary: [],
            searchValue: null,
            totalSpecialistDataArry: [],
            visibleClearIcon: '',
        };
        this.callSuggestionService = debounce(this.callSuggestionService, 500); 
    }
    navigetToCategories() {
        this.props.navigation.navigate('Categories', { data: this.state.data })
    }

    doLogout() {
        logout();
        this.props.navigation.navigate('login');
    }
    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
     }
    async componentDidMount() {
        this.getCatagries();
        let userId = await AsyncStorage.getItem("userId");
        if(userId) {
            this.getAllChatsByUserId(userId);
        }
        CurrentLocation.getCurrentPosition();
    }
    
    getCatagries = async () => {
        try {
            const searchQueris = 'services=0&skip=0&limit=9';
            let result = await catagries(searchQueris);
            if (result.success) { 
                console.log(result.data);
                this.setState({ catagary: result.data })
            }
        } catch (e) {
            console.log(e);
        } finally {
            this.setState( { isLoading : false });
        }
    }

    getAllChatsByUserId = async(userId) => {
        try {
            console.log('Calling getAllChatsByUserId' );
          const chatList = await getAllChats(userId);
          console.log('Got the data', chatList);
          if(chatList.success === true) {
              store.dispatch({
                  type: SET_LAST_MESSAGES_DATA,
                  data: chatList.data
              })
              console.log(chatList.data);
          } 
        } catch (error) {
              Toast.show({
                  text: 'Something went wrong' +error, 
                  duration: 3000,
                  type: 'danger'
              })
        }
      }
      
    
    navigateToCategorySearch(categoryName) {
        const { bookappointment: { locationCordinates } } = this.props;
       
        let serachInputvalues = [{
            type: 'category',
            value: categoryName
        },
        {
            type: 'geo',
            value: {
                coordinates : locationCordinates,
                maxDistance: MAX_DISTANCE_TO_COVER
            }
        }]
        this.props.navigation.navigate('Doctor List', { resultData: serachInputvalues })
    }
count=0;
callSuggestionService=async(enteredText)=>{
 console.log('clicked :'+this.count++)
    const userId = await AsyncStorage.getItem('userId');
    const { bookappointment: { locationCordinates } } = this.props;
    locationData=  {
      "coordinates": locationCordinates,
      "maxDistance": MAX_DISTANCE_TO_COVER
    }

    let specialistResultData = await getSpecialistDataSuggestions(userId, enteredText, locationData);
// console.log('specialistResultData.data' + JSON.stringify(specialistResultData.data))
  if (specialistResultData.success) {
       this.setState({
        totalSpecialistDataArry: specialistResultData.data,
        searchValue: enteredText,
    });
  } else {
      
       this.setState({
            totalSpecialistDataArry:[],  
            searchValue: enteredText
        });
       /* Toast.show({
          text: 'No KeyWords Found By near Location',
          type: 'danger',
          duration: 3000
        }) */
    }
 }
    /* Filter the Specialist and Services on Search Box  */
    
    SearchKeyWordFunction = async (enteredText) => {
        await this.setState({ visibleClearIcon: enteredText })
        this.callSuggestionService(enteredText);  // Call the Suggestion API with Debounce method
    }

    clearTotalText = () => {
        this.setState({ visibleClearIcon: null, totalSpecialistDataArry: null, searchValue: null })
    };

    itemSaperatedByListView = () => {
        return (
            <View
                style={{
                    padding: 4,
                    borderBottomColor: 'gray',
                    borderBottomWidth: 0.5
                }}
            />
        );
    };
   /* navigationUpdated = false;
    setNavigationParams() {
        const { bookappointment: { isLocationUpdated }, navigation } = this.props;
        if(isLocationUpdated)  
        navigation.setParams({
            appBar: {
                isOnline: 'YEs',
                locationName: 'Ambathur'
            }
        });
        this.navigationUpdated = true;
    } */
    render() {
        const { fromAppointment } = this.state;
        const { bookappointment: { patientSearchLocationName, locationCordinates, isSearchByCurrentLocation, locationUpdatedCount }, navigation } = this.props;
        if(locationUpdatedCount !== this.locationUpdatedCount) {
            navigation.setParams({
                appBar: {
                    locationName: patientSearchLocationName,
                    locationCapta: isSearchByCurrentLocation ? 'You are searching Near by Hostpitals' : 'You are searching Hospitals on ' + patientSearchLocationName
                }
            });
           console.log('is it Updating here?')
           this.locationUpdatedCount = locationUpdatedCount; 
        }
        return (

        <Container style={styles.container}>
            <Content keyboardShouldPersistTaps={'handled'} style={styles.bodyContent}>
                  
                <Row style={styles.SearchRow}>
                    <Col size={0.9} style={styles.SearchStyle}> 
                        <TouchableOpacity style={{justifyContent:'center'}}>
                            <Icon name="ios-search" style={{ color: '#fff', fontSize:20,padding:2}} />
                        </TouchableOpacity>
                    </Col>
                    <Col size={8.1} style={{justifyContent:'center',}}> 
                        <Input 
                            placeholder="Search for Symptoms/Services,etc"
                            style={styles.inputfield}
                            placeholderTextColor="#e2e2e2"
                            keyboardType={'email-address'}
                            autoFocus={fromAppointment}
                            // onChangeText={searchValue => this.setState({ searchValue })}
                            onChangeText={enteredText =>this.SearchKeyWordFunction(enteredText) }
                            underlineColorAndroid="transparent"
                            blurOnSubmit={false}
                       />
                        </Col>
                        <Col size={1.0} style={{justifyContent:'center'}}>
                                {this.state.visibleClearIcon != '' ?
                                    <Button  transparent onPress={() => this.clearTotalText()} style={{justifyContent:'flex-start',marginLeft:-10}}>
                                        <Icon name="ios-close" style={{ fontSize: 25, color: 'gray' }} />
                                    </Button>
                                    : null}
                                {/* <Button Button transparent onPress={() => this.searchDoctorListModule()}>
                                    <Icon name="ios-search" style={{ color: '#000' }} />
                                </Button> */}
                        </Col>
                       
                    </Row>

                    
             


                    {this.state.searchValue != null ?
                        <FlatList
                            data={this.state.totalSpecialistDataArry ? [{ value : 'All Doctors in ' + ( isSearchByCurrentLocation === true ? 'Your Location' :  patientSearchLocationName ), type : ' ' }].concat(this.state.totalSpecialistDataArry) : [{ value : 'All Doctors in ' + ( isSearchByCurrentLocation === true ? 'Your Location' :  patientSearchLocationName ), type : ' ' }] }
                            extraData={[this.state.searchValue, this.state.totalSpecialistDataArry]}
                            ItemSeparatorComponent={this.itemSaperatedByListView}
                            renderItem={({ item, index }) => (
                                <Row
                                    onPress={() => { 
                                        let requestData = [{
                                             type: 'geo',
                                             value: {
                                                coordinates: locationCordinates,
                                                maxDistance: MAX_DISTANCE_TO_COVER
                                             }
                                        }]
                                        if(index !== 0) {
                                            requestData.push({
                                                type: item.type,
                                                value: item.type === 'symptoms' ? [item.value]: item.value
                                            })
                                        }
                                          this.props.navigation.navigate("Doctor List", { resultData: requestData }) 
                                        }}
                                    >
                                    <Text style={{marginTop:2, fontFamily: 'OpenSans', fontSize: 12,color: '#775DA3',paddingLeft: 10,  }}>{item.value}</Text> 
                                    <Right>
                                        <Text uppercase={true} style={{ color: 'gray', marginTop:2, marginRight: 10,color: '#775DA3', fontSize: 12, fontFamily: 'OpenSans-Bold',paddingLeft: 10,  }}>{item.type}</Text>
                                    </Right>
                                </Row>
                            )}
                            enableEmptySections={true}
                            style={{ marginTop: 10 }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        : null}


                    <Grid style={{flex:1,marginLeft:10,marginRight:10,marginTop:10}}>
                    <Col style={{width:'33.33%',}}>
                       <TouchableOpacity onPress={() => this.props.navigation.navigate("BloodDonersList")}>
                        <Card style={{  borderRadius: 10, overflow: 'hidden' }}>
                          <Row style={{ height: 100, width: '100%', overflow: 'hidden', backgroundColor: "#fff",justifyContent:'center',alignItems:'center'}}>
                            <Image
                            source={bloodImg}
                              style={{
                                width: '100%',height:'100%',alignItems:'center'
                              }}
                            />
                          </Row>
                     <Row style={{ padding: 10, width: '100%',borderTopColor:'#000',borderTopWidth:0.3,backgroundColor:'#fff',paddingTop:5,justifyContent:'center' }}>
                       <Col style={{width:'100%'}}>
                       <Text style={{fontSize:10,textAlign:'center',fontWeight:'bold'}}>Available Blood Donors</Text>
                       <Text style={{fontSize:10,marginTop:5,textAlign:'center',}}> donate blood </Text>
                                     
                          </Col>
                        </Row>
                      </Card>
                      </TouchableOpacity>
                      </Col>

                      <Col style={{width:'33.33%',}}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Chat Service")}>
                              <Card style={{  borderRadius: 10, overflow: 'hidden' }}>
                             <Row style={{ height: 100, width: '100%', overflow: 'hidden', backgroundColor: "#fff",justifyContent:'center',alignItems:'center'}}>
                            <Image
                            source={chatImg}
                              style={{
                                width: '100%',height:'100%',alignItems:'center'
                              }}
                            />
                          </Row>
                          <Row style={{ padding: 10, width:'100%',borderTopColor:'#000',borderTopWidth:0.3,backgroundColor:'#fff',paddingTop:5,justifyContent:'center'}}>
                          <Col style={{width:'100%',}}>
                          <Text style={{fontSize:10,textAlign:'center',fontWeight:'bold'}}> Chat</Text>
                            <Text style={{fontSize:10,marginTop:5,textAlign:'center',}}> Chat with Top doctor</Text>
                        </Col>
      
                       </Row>
                     </Card>
                             </TouchableOpacity>
                             </Col>
                             <Col style={{width:'33.33%',}}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Pharmacy")}>
                             <Card style={{  borderRadius: 10, overflow: 'hidden' }}>
                               <Row style={{ height: 100, width: '100%', overflow: 'hidden', backgroundColor: "#fff",justifyContent:'center',alignItems:'center'}}>
                                 <Image
                                 source={pharmacyImg}
                                   style={{
                                     width: '100%',height:'100%',alignItems:'center'
                                   }}
                                 />
                               </Row>
                               <Row style={{ padding: 10, width:'100%',borderTopColor:'#000',borderTopWidth:0.3,backgroundColor:'#fff',paddingTop:5,justifyContent:'center'}}>
                                <Col style={{width:'100%',}}>
                                <Text style={{fontSize:10,textAlign:'center',fontWeight:'bold'}}> Pharmacy</Text>
                                 <Text style={{fontSize:10,marginTop:5,textAlign:'center',}}> Medicine and Health</Text>
                                </Col>
                                 
                               </Row>
                             </Card>
                             </TouchableOpacity>
                           </Col>
                             </Grid>
                             <View style={{marginLeft:10,marginRight:10}}>
                             <Row style={{marginTop:5,marginBottom:5}}>
                                 <Left>
                                 <Text style={{ fontFamily: 'OpenSans', fontSize: 15 ,fontWeight:'bold'}}>Categories</Text>
                             </Left>
                             <Right>
                                <TouchableOpacity onPress={() => this.navigetToCategories()} style={{paddingLeft:20,paddingRight:20,paddingBottom:5,paddingTop:5,borderRadius:5,color:'#fff',flexDirection:'row'}}>
                                   <Text style={{ color: '#775DA3', fontSize: 13, textAlign: 'center',fontWeight:'bold'}}>View All</Text>
                                </TouchableOpacity>
                            </Right>
                             </Row>
                             
                               <View>
                             <Row style={{marginTop:5,}}>
                             <FlatList
                              numColumns={3}
                              data={this.state.catagary}
                              extraData={this.state.catagary}
                              renderItem={({ item, index }) =>
                                    <Col style={{
                                            flex:3,
                                            alignItems: "center", 
                                            justifyContent: "center", 
                                            borderColor:'gray', 
                                            borderRadius:5, 
                                            flexDirection:'row',
                                            borderWidth:0.1, 
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 0.5 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 5,  
                                            elevation: 2,
                                            padding:1,
                                            marginLeft: 8,
                                            marginRight:8,
                                            marginTop:8,
                                            marginBottom:1 }}>
                                            <Row style={{ width : '33%'}}>   
                                                <TouchableOpacity onPress={() => this.navigateToCategorySearch(item.category_name)} 
                                                                  style={{justifyContent:'center',alignItems:'center'}}>
                                        
                                                <Row style={{   
                                                        height: 50, width: 100, 
                                                        overflow: 'hidden',
                                                        justifyContent:'center', 
                                                        alignItems:'center',
                                                        flexDirection:'column'}
                                                }>
                                                <Image
                                                     source={{ uri: item.imageBaseURL + item.category_id + '.png'  }}
                                                      style={{
                                                        width: 50,height:50, alignItems:'center'
                                                      }}
                                                />
                                                </Row>
                                                <Row style={{  width: 100, height: 40, 
                                                            //backgroundColor:'#fff',
                                                            paddingTop:5,
                                                            alignContent: 'center',
                                                            justifyContent:'center'}}>
                                                    <Text style={{fontSize:12, textAlign:'center', padding: 2}}>{item.category_name}</Text>
                                                </Row>
                                                </TouchableOpacity>
                                            </Row>
                                     
                                    </Col> 
                                     }
                                     keyExtractor={(item, index) => index.toString()}
                                 /> 
                                  </Row>
                                </View>
                            </View>
{/* 
                    <Card style={{ padding: 10, borderRadius: 10 }}>

                        <Grid>
                            <Row >
                                <Left >
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 15,fontWeight:'bold' }}>Categories</Text>
                                </Left>
                                <Body >

                                </Body>
                                <Right>
                                   <Text style={styles.titleText} onPress={() => this.navigetToCategories()}>View All</Text>
                                </Right>
                            </Row>
                            <Row>
                                <ListItem style={{ borderBottomWidth: 0 }}>
                                    <ScrollView horizontal={false}>
                                        <FlatList
                                            horizontal={true}
                                            data={this.state.catagary}
                                            extraData={this.state}
                                            renderItem={({ item, index }) =>
                                                <Grid style={{ marginTop: 10 }}>
                                                    <Item style={styles.column} onPress={() => this.navigateToCategorySearch(item.category_name)}>
                                                        <Col>
                                                            <LinearGradient
                                                                colors={['#5758BB', '#9980FA']} style={{ borderRadius: 10, padding: 5, height: 100, width: 100, marginLeft: 'auto', marginRight: 'auto' }}>
                                                                <Image
                                                                    source={{ uri: item.imageBaseURL + '/' + item.category_id + '.png' }} style={styles.customImage} />
                                                            </LinearGradient> */}

                                                            {/* <Text style={styles.textcenter}>{item.category_name}</Text> */}
                                                           {/* <Text note style={{ textAlign: 'center',fontFamily:'OpenSans',fontSize:15 }}>100 Doctors</Text>
                                                        </Col>
                                                    </Item>
                                                </Grid>
                                            }
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                      </ScrollView>
                                    </ListItem>
                                 </Row>
                             </Grid>
                  </Card> */}
                  {/* <Card style={{ backgroundColor: '#ffeaa7', padding: 10, borderRadius: 10 }}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 15 }}>You Can Save A Life</Text>
                        <Button block style={{ margin: 10, borderRadius: 20, backgroundColor: '#74579E' }}>
                            <Text uppercase={true} style={{ fontFamily: 'OpenSans', fontSize: 15, fontWeight: 'bold' }}>REPORT ACCIDENT NOW</Text>
                        </Button>
                       <Text style={{ textAlign: 'right', fontSize: 15, fontFamily: 'OpenSans', color: '#000' }}>5002 Fast Growing Ambulance</Text>
                  </Card> */}

{/* 
                    <LinearGradient
                        colors={['#7E49C3', '#C86DD7']}
                        style={{ borderRadius: 10, padding: 10, borderBottomWidth: 0, fontFamily: 'OpenSans', marginTop: 5 }} >
                        <Grid style={{ padding: 10 }}>
                            <Col style={{ width: '75%' }}>
                                <Text style={{ fontFamily: 'OpenSans', color: 'white', fontSize: 15 }}>Video Consultation</Text>
                                <Text note style={{ color: 'white', fontFamily: 'OpenSans', marginTop: 'auto', marginBottom: 'auto', fontSize: 15,lineHeight:25}}>Have A Video Visit With A Certified HealthCare - Doctors</Text>

                            </Col>

                            <Col style={{ width: '25%' }}>
                                <Image source={{ uri: 'https://odoc.life/wp-content/uploads/2018/06/oDoc-Video-Call-iPhone-X.png' }} style={{ height: 150, width: 100, borderColor: '#fff', borderWidth: 2, borderRadius: 10 }} />
                            </Col>
                        </Grid>


                    </LinearGradient> */}


                    {/* <LinearGradient
                        colors={['#F58949', '#E0C084']}
                        style={{ borderRadius: 10, padding: 10, borderBottomWidth: 0, fontFamily: 'OpenSans', marginTop: 10, marginBottom: 10 }} >
                        <Grid>
                            <Row >
                                <Col style={{ width: '75%' }}>
                                    <Text style={{ fontFamily: 'OpenSans', color: 'white', marginTop: 10, fontSize: 15 }}>Online Pharmacy Services</Text>
                                </Col>
                                <Col style={{ width: '25%' }}>
                                    <Text style={styles.offerText1}>25% offers</Text>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Text note style={{ fontFamily: 'OpenSans', color: 'white', marginTop: 15,lineHeight:20 }}>Medflic Pharmacy Offers You Online Convenience For Ordering, Monitoring And Receiving Prescription For You And Your Family.</Text>
                                </Col>
                            </Row>
                        </Grid>

                        <Grid style={{ padding: 10 }}>
                            <Col style={{ width: '33.33%' }}>
                                <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.pharmImage} />

                                <Text style={styles.offerText}>Geriatrics</Text>

                            </Col>
                            <Col style={{ width: '33.33%' }}>
                                <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.pharmImage} />

                                <Text style={styles.offerText}>Geriatrics</Text>
                            </Col>
                            <Col style={{ width: '33.33%' }}>
                                <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.pharmImage} />

                                <Text style={styles.offerText}>Geriatrics</Text>
                            </Col>
                        </Grid>

                    </LinearGradient> */}


                </Content>

                {/* <Footer>
                    <FooterTab style={{ backgroundColor: '#7E49C3' }}>
                        <Button >
                            <Icon name="apps" />
                        </Button>
                        <Button>
                            <Icon name="chatbubbles" />
                        </Button>
                        <Button >
                            <Icon active name="notifications" />
                        </Button>
                        <Button>
                            <Icon name="person" />
                        </Button>
                    </FooterTab>
                </Footer>*/}
            </Container>

        )
    }

}

function homeState(state) {

    return {
        bookappointment: state.bookappointment,
        chat: state.chat
    }
}
export default connect(homeState)(Home)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 5
    },
    textcenter: {
        fontSize: 15,
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'OpenSans'
    },

    column:
    {
        width: 'auto',
        borderRadius: 10,
        margin: 5,
        padding: 5,
        paddingBottom: 20,


    },

    columns:
    {
        width: '33.33%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 10,
        margin: 5,
        padding: 5,
        paddingBottom: 25,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 5

    },

    customImage: {
        height: 70,
        width: 70,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },


    pharmImage: {
        height: 50,
        width: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        // borderColor: '#fff',
        // borderWidth: 2,
        // borderRadius: 10,
        //padding:30


    },
    titleText: {
        fontSize: 15,
        fontWeight: 'bold',
        padding: 5,
        backgroundColor: '#775DA3',
        borderRadius: 20,
        color: 'white',
        width: "95%",
        textAlign: 'center',
        fontFamily: 'OpenSans',

    },

    offerText: {
        fontSize: 15,
        padding: 5,
        backgroundColor: 'gray',
        borderRadius: 20,
        color: 'white',
        width: "93%",
        textAlign: 'center',
        fontFamily: 'OpenSans',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10,
        fontWeight: 'bold'
    },

    offerText1: {
        fontSize: 15,
        padding: 5,
        backgroundColor: 'red',
        borderRadius: 20,
        color: 'white',
        width: "93%",
        textAlign: 'center',
        fontFamily: 'OpenSans',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 8,
        fontWeight: 'bold'
    },
    SearchRow:{
        backgroundColor: 'white', 
        borderColor: '#000',
        borderWidth:0.5, 
        height:35,
        marginRight:10,
        marginLeft:10,
        marginTop:5,borderRadius:20
    },
    SearchStyle:{
        backgroundColor:'#7E49C3',
        width:'85%',
        alignItems:'center',
        justifyContent:'center',
        borderRightColor:'#000',
        borderRightWidth:0.5,
        borderBottomLeftRadius:20,
        borderTopLeftRadius:20
    },
    inputfield:{
        color: 'gray', 
        fontFamily: 'OpenSans', 
        fontSize: 12, 
        padding:5,
        paddingLeft:10
    },
    wrapper: {
      marginTop:5,
      borderRadius:2
    },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }

});