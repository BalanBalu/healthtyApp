import React, { Component } from 'react';
import {
    Container, Content, View, Text, Title, Header, H3, Button, Item, Card,
    CardItem, List, ListItem, Left, Right, Thumbnail, Segment,
    Body, Icon
} from 'native-base';
import { StyleSheet, Image, AsyncStorage, FlatList, ScrollView ,ActivityIndicator} from 'react-native';
import StarRating from 'react-native-star-rating';

import { userReviews } from '../../providers/profile/profile.action';
import { hasLoggedIn } from '../../providers/auth/auth.actions';
import { formatDate ,addTimeUnit,dateDiff,subTimeUnit} from '../../../setup/helpers';
import { Col, Row, Grid } from 'react-native-easy-grid';
import SegmentedControlTab from "react-native-segmented-control-tab";
import ContentLoader from '../../../components/ContentLoader/ContentLoader';
import { getUserAppointments,viewUserReviews } from "../../providers/bookappointment/bookappointment.action";
import noAppointmentImage from '../../../../assets/images/noappointment.png';
import Spinner from '../../../components/Spinner';
import { Loader } from '../../../components/ContentLoader';
   
class MyAppoinmentList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            data:[],
           spinnerData: [1,2,3,4],
            isLoading: false,
            selectedIndex: 0,
            upComingData: [],
            pastData: [],
            userId: null,
            reviewData:[],
            page: 0,
            loading: true
        }
    }
   
    async componentDidMount() {
        const isLoggedIn = await hasLoggedIn(this.props);
        if(!isLoggedIn) {
            this.props.navigation.navigate('login');
            return
        }
      let userId = await AsyncStorage.getItem('userId');
    this.setState({ userId});
      this.upCommingAppointment(); 
      this.pastAppointment();
    
    }
    upCommingAppointment = async () => {
        try {
       let userId = await AsyncStorage.getItem('userId');
          let filters = {
            startDate: formatDate(new Date() , "YYYY-MM-DD"),
            endDate: formatDate(addTimeUnit(new Date(), 1, "years"), "YYYY-MM-DD")
          };
         let upCommingAppointmentResult = await getUserAppointments(userId, filters)
          if (upCommingAppointmentResult.success){
            let appointmentData=[];
              upCommingAppointmentResult=upCommingAppointmentResult.data;
               
          upCommingAppointmentResult.map(appointmentResult=> {
            appointmentData.push({appointmentResult})
               
             });
            this.setState({ upComingData: appointmentData, isLoading:true,data:appointmentData});
            }
           console.log(this.state.upComingData);
        } catch (e) {
          console.log(e);
        }
      };
      pastAppointment = async () => {
        try {
         let userId = await AsyncStorage.getItem('userId');
          let  endData=  formatDate(subTimeUnit(new Date(), 1, "day"), "YYYY-MM-DD")
          let filters = {
            endDate: endData,
            startDate:"2018-01-01"
          };        
          let pastAppointmentResult = await getUserAppointments(userId, filters)
          let viewUserReviewResult = await viewUserReviews('user',userId);
          if (pastAppointmentResult.success){
          pastAppointmentResult=pastAppointmentResult.data;
          viewUserReviewResult=viewUserReviewResult.data;

              let appointmentData=[];
             
             pastAppointmentResult.map(appointmentResult=> {
                let condition=false;
             viewUserReviewResult.map(viewUserReview => {
               if(appointmentResult._id === viewUserReview .appointment_id){
                appointmentData.push({appointmentResult,ratting:viewUserReview.overall_rating});
               condition = true;              
               }  
                
             });
            
             if(condition == false){
             appointmentData.push({appointmentResult})
             condition=false;
             }
           });  
            console.log('past appointment');      
           console.log(appointmentData)
             this.setState({ pastData: appointmentData, isLoading:true});
        }
         } catch (e) {
           console.log(e);
         }
       };
      
        
       handleIndexChange =(index) => {
       

        let data=  (index === 0 ? this.state.upComingData:this.state.pastData)
        console.log(index);
        this.setState({
            ...this.state,
            selectedIndex: index,
            data,
           
        });
       
    };
    
       
    render() {
        const { data,selectedIndex,reviewData,isLoading } = this.state;
              

        return (

            <View style={styles.container}>
               <Card transparent>
               
                <SegmentedControlTab tabsContainerStyle={{ width: 250, marginLeft: 'auto', marginRight: 'auto',marginTop:'auto' }}
                    values={["Upcoming", "Past"]}
                    selectedIndex={this.state.selectedIndex}
                    onTabPress={this.handleIndexChange}
                    activeTabStyle={{ backgroundColor: '#775DA3', borderColor: '#775DA3' }}
                    tabStyle={{ borderColor: '#775DA3' }}
                />
               
               { isLoading==true?
                    data.length === 0 ?
                   
                    <Card transparent style={{ alignItems: 'center', justifyContent: 'center', marginTop: '20%' }}>
                        <Thumbnail square source={noAppointmentImage} style={{ height: 100, width: 100, marginTop: '10%' }} />

                            <Text style={{ fontFamily: 'OpenSans', fontSize: 14, marginTop: '10%' }} note>No appoinments are scheduled</Text>
                            <Item style={{ marginTop: '15%', borderBottomWidth: 0 }}>
                                <Button style={[styles.bookingButton, styles.customButton]}>
                                    <Text  >Book Now</Text>
                                </Button>
                            </Item>
                            </Card>
                     :
                    
                 <ScrollView>
                              
                <List>
              
                <FlatList
                            data={data}
                            extraData={reviewData}
                            renderItem={({ item, index }) => 
                         
                          
                          
                        <ListItem avatar onPress={() => this.props.navigation.navigate('AppointmentInfo', { data : item })}>
                           
                            <Left>
                                <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 60, width: 60 }} />
                            </Left>
                            <Body>
                                <Text style={{ fontFamily: 'OpenSans' }}>{item.appointmentResult.doctorInfo.prefix||'Dr'+'.'+item.appointmentResult.doctorInfo.first_name+' '+item.appointmentResult.doctorInfo.last_name} </Text>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={{ fontFamily: 'OpenSans' }}>Internist</Text>
                                    {selectedIndex==1&& item.ratting!=undefined&&
                                    <StarRating fullStarColor='#FF9500' starSize={20} containerStyle={{ width: 100, marginLeft: 60 }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={item.ratting}
                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    />}
                                    </Item>
                                    {selectedIndex==0&&
                                <Item style={{ borderBottomWidth: 0 }}>
                                    {item.appointmentResult.appointment_status=='PENDING'?
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12 ,color:'red' }} note>waiting for confirmation</Text>
                                    :item.appointmentResult.appointment_status=='APPROVED'?
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12 ,color:'green' }} note>Appointment conformed</Text>
                                    :  <Text style={{ fontFamily: 'OpenSans', fontSize: 12 ,color:'grey' }} note>{item.appointmentResult.appointment_status }</Text>
                                    }
                                    </Item>
                                    }
                                     {selectedIndex==1&&
                                     <Item style={{ borderBottomWidth: 0 }}>
                                    { item.appointmentResult.appointment_status=='CLOSED'?
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12 ,color:'red' }} note>Appointment cancelled.</Text>
                                    
                                    : item.appointmentResult.appointment_status=='COMPLETED'&&
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12 ,color:'green' }} note>Appointment completed</Text>
                                     }
                    
                                </Item>
                                    }
                              
                                
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12 }} note>{formatDate(item.appointmentResult.appointment_starttime,'dddd,MMMM DD-YYYY  hh:mm a') }</Text>
                                
                                
                               {selectedIndex==1&&
                              item.appointmentResult.appointment_status=='PENDING_REVIEW'?<Item style={{ borderBottomWidth: 0}}>
                                 <Button style={styles.bookingButton} onPress={() => this.props.navigation.navigate('insertReview')}>
                              <Text > feed back</Text>
                          </Button>
                          <Button style={styles.shareButton} >
                              <Text >CANCEL</Text>
                          </Button>
                         
                      </Item>: selectedIndex==1&& 
                             <Item style={{ borderBottomWidth: 0}}>
                              <Button style={styles.bookingButton}>
                                  <Text  >Book Again</Text>
                              </Button>
                              <Button style={styles.shareButton} >
                                  <Text >Share</Text>
                              </Button>
                          </Item>
                            }
                            </Body>
                            
                        </ListItem>}
                       
                         
                          
                     keyExtractor={(item, index) => index.toString()}/>  
                       
                   </List>
              
                </ScrollView>
             
           : 
           <Spinner color='blue'
           style={[styles.containers, styles.horizontal]}
            visible={true}
            size ={"large"}
            overlayColor='none'
            cancelable={ false}

            />  
           
            }
            </Card>
            </View>
        );
    }
}

export default MyAppoinmentList
const styles = StyleSheet.create({
    container:
    {
        backgroundColor: '#ffffff',
        margin: 10
    },
    bodyContent: {
        padding: 5
    },
    bookingButton: {
        marginTop: 10,
        backgroundColor: '#775DA3',
         marginLeft:35,
        borderRadius: 10,
        width: 'auto',
        height: 30,
        color: 'white',
        fontSize: 1,
        textAlign: 'center'
    },
    shareButton: {
        marginTop: 12,
        backgroundColor: 'gray',
        marginRight:10,
        marginLeft:5,
        borderRadius: 10,
        width: 'auto',
        height: 30,
        color: 'white',
        fontSize: 1,
        textAlign: 'center',
        justifyContent: 'center'

    },
    customButton:
    {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        backgroundColor: '#775DA3',
        marginLeft: 15,
        borderRadius: 10,
        width: 'auto',
        height: 40,
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',

    },
    containers: {
        flex: 1,
        justifyContent: 'center'
      },
      horizontal: {
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 10
      }
});