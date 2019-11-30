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
    getUserLocation() {
        console.log('getting Geo to User Locatuin')
        debugger
        
    }

    getCatagries = async () => {
        try {
            const searchQueris = 'services=0&skip=0&limit=6';
            let result = await catagries(searchQueris);
            if (result.success) { 
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

    render() {
        const { fromAppointment } = this.state;
        const { bookappointment: { patientSearchLocationName, locationCordinates, isSearchByCurrentLocation } } = this.props;
        
        return (

            <Container style={styles.container}>
                <Content keyboardShouldPersistTaps={'handled'} style={styles.bodyContent}>
                   <Row style={{marginBottom: 5}}>
                   {isSearchByCurrentLocation === true ? 
                   <Col size={10} style={{ flexDirection : 'row' }}>  
                      <Text uppercase={false} style={{ paddingLeft: 10, color: 'gray', fontSize: 10, fontFamily: 'OpenSans-SemiBold' }}>You are searching Near by Hostpitals</Text>
                    </Col> : 
                     <Col size={10} style={{ flexDirection : 'row' }}>  
                        <Text uppercase={false} style={{ paddingLeft: 10, color: 'gray', fontSize: 10, fontFamily: 'OpenSans-SemiBold' }}>You are searching Hospitals on </Text>
                        <Text uppercase={false} style={{ color: 'gray', fontSize: 10, fontFamily: 'OpenSans-Bold' }}>{patientSearchLocationName}</Text>
                    </Col>
                    } 
                    <Col size={2}>
                        <Text onPress={()=> this.props.navigation.navigate('Locations')} uppercase={true} style={{ color: 'gray', fontSize: 10, fontFamily: 'OpenSans-SemiBold' }}>Change</Text>
                    </Col>  
                   </Row>   

                    <Row style={{ backgroundColor: 'white', borderColor: '#000', borderWidth: 1, borderRadius: 20, }}>
                    <Col size={1.1}> 
                    <TouchableOpacity style={{ marginTop: 10, marginBottom: 10, marginLeft : 10}}>
                        <Icon name="ios-search" style={{ color: '#000' }} />
                     </TouchableOpacity>
                    </Col>
                      <Col size={7}> 
                        <Input 
                            placeholder="Search Symptoms/Services"
                            style={{ color: 'gray', fontFamily: 'OpenSans', fontSize: 13,  }}
                            placeholderTextColor="gray"
                            value={this.state.visibleClearIcon}
                            keyboardType={'email-address'}
                            autoFocus={fromAppointment}
                            // onChangeText={searchValue => this.setState({ searchValue })}
                            onChangeText={enteredText =>this.SearchKeyWordFunction(enteredText) }
                            underlineColorAndroid="transparent"
                            blurOnSubmit={false}
                            // onSubmitEditing={() => { this.searchDoctorListModule(); }}
                        />
                        </Col>

                        <Col size={1.3}>
                            <Row>
                                {this.state.visibleClearIcon != '' ?
                                    <Button Button transparent onPress={() => this.clearTotalText()}>
                                        <Icon name="ios-close" style={{ fontSize: 30, color: 'gray' }} />
                                    </Button>
                                    : null}
                                {/* <Button Button transparent onPress={() => this.searchDoctorListModule()}>
                                    <Icon name="ios-search" style={{ color: '#000' }} />
                                </Button> */}
                            </Row>

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
                                    <Text style={{ padding: 10, fontFamily: 'OpenSans', fontSize: 13 }}>{item.value}</Text>
                                    <Right>
                                        <Text uppercase={true} style={{ color: 'gray', padding: 10, marginRight: 10, fontSize: 13, fontFamily: 'OpenSans-Bold' }}>{item.type}</Text>
                                    </Right>
                                </Row>
                            )}
                            enableEmptySections={true}
                            style={{ marginTop: 10 }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        : null}

                    <Card style={{ padding: 10, borderRadius: 10 }}>

                        <Grid>
                            <Row >
                                <Left >
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 15 }}>Categories</Text>
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
                                                            </LinearGradient>

                                                            <Text style={styles.textcenter}>{item.category_name}</Text>
                                                           {/* <Text note style={{ textAlign: 'center',fontFamily:'OpenSans',fontSize:15 }}>100 Doctors</Text> */}
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
                  </Card>
                  <Card style={{ backgroundColor: '#ffeaa7', padding: 10, borderRadius: 10 }}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 15 }}>You Can Save A Life</Text>
                        <Button block style={{ margin: 10, borderRadius: 20, backgroundColor: '#74579E' }}>
                            <Text uppercase={true} style={{ fontFamily: 'OpenSans', fontSize: 15, fontWeight: 'bold' }}>REPORT ACCIDENT NOW</Text>
                        </Button>
                       <Text style={{ textAlign: 'right', fontSize: 15, fontFamily: 'OpenSans', color: '#000' }}>5002 Fast Growing Ambulance</Text>
                  </Card>


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


                    </LinearGradient>


                    <LinearGradient
                        colors={['#F58949', '#E0C084']}
                        style={{ borderRadius: 10, padding: 10, borderBottomWidth: 0, fontFamily: 'OpenSans', marginTop: 10, marginBottom: 10 }} >
                        <Grid>
                            <Row onPress={() => this.props.navigation.navigate("Pharmacy")}>
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

                    </LinearGradient>


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
    }

});