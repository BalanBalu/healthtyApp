import React, { Component } from 'react';
import {
    Container, Content, View, Text, Title, Header, H3, Button, Item, Card,
    CardItem, List, ListItem, Left, Right, Thumbnail, Segment,
    Body, Icon, ScrollView
} from 'native-base';
import { StyleSheet, Image, AsyncStorage, FlatList } from 'react-native';
import StarRating from 'react-native-star-rating';

import { userReviews } from '../../providers/profile/profile.action';
import { hasLoggedIn } from '../../providers/auth/auth.actions';
import { formatDate ,addTimeUnit,dateDiff,subTimeUnit} from '../../../setup/helpers';
import { Col, Row, Grid } from 'react-native-easy-grid';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { getUserAppointments,viewUserReviews } from "../../providers/bookappointment/bookappointment.action";
import noAppointmentImage from '../../../../assets/images/noappointment.png';
import { isLoop } from '@babel/types';
   
class MyAppoinmentList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            data: [],
            isLoading: false,
            selectedIndex: 0,
            upComingData: [],
            pastData: [],
            userId: '5ce50ae57ca0ee0f10f42c34',
            reviewData:[],
        }
    }
   
    async componentDidMount() {
    //     const isLoggedIn = await hasLoggedIn(this.props);
    //     if(!isLoggedIn) {
    //         this.props.navigation.navigate('login');
    //         return
    //     }
    //   let userId = await AsyncStorage.getItem('userId');
    //this.setState({ userId});
      this.upCommingAppointment(); 
      this.pastAppointment();
    
    }
    upCommingAppointment = async () => {
        try {
          this.setState({ isLoading: true });
      //  let userId = await AsyncStorage.getItem('userId');
          let filters = {
            startDate: formatDate(new Date() , "YYYY-MM-DD"),
            endDate: formatDate(addTimeUnit(new Date(), 1, "years"), "YYYY-MM-DD")
          };
         let upCommingAppointmentResult = await getUserAppointments(this.state.userId, filters)
          if (upCommingAppointmentResult.success){
            let appointmentData=[];
              upCommingAppointmentResult=upCommingAppointmentResult.data;
               
          upCommingAppointmentResult.map(AppointmentResult=> {
            appointmentData.push({AppointmentResult})
               
             });
            this.setState({ upComingData: appointmentData, isRefreshing: false,data:appointmentData});
            }
        } catch (e) {
          console.log(e);
        }
      };
      pastAppointment = async () => {
        try {
          this.setState({ isLoading: true });
        //  let userId = await AsyncStorage.getItem('userId');
          let  endData=  formatDate(subTimeUnit(new Date(), 1, "day"), "YYYY-MM-DD")
          let filters = {
            endDate: endData,
            startDate:"2018-01-01"
          };        
           let pastAppointmentResult = await getUserAppointments(this.state.userId, filters)
           let viewUserReviewResult = await viewUserReviews('user',this.state.userId);
              if (pastAppointmentResult.success){
                 pastAppointmentResult=pastAppointmentResult.data;
                 viewUserReviewResult=viewUserReviewResult.data;
                 let appointmentData=[];
                  pastAppointmentResult.map(AppointmentResult=> {
                  viewUserReviewResult.map(viewUserReview => {
                  if(AppointmentResult._id === viewUserReview .appointment_id){
                   appointmentData.push({AppointmentResult,ratting:viewUserReview .overall_rating})
                 }
                 else{
                appointmentData.push({AppointmentResult})
                 }
             }); 
           });         
             this.setState({ pastData: appointmentData, isRefreshing: false});
        }
         } catch (e) {
           console.log(e);
         }
       };
        
       handleIndexChange = (index) => {
        let data= (index === 0 ? this.state.upComingData:this.state.pastData)
        this.setState({
            ...this.state,
            selectedIndex: index,
            data
        });
       
    };

    render() {
        const { data,selectedIndex,reviewData } = this.state;
              

        return (

            <View style={styles.container}>
                <SegmentedControlTab tabsContainerStyle={{ width: 250, marginLeft: 'auto', marginRight: 'auto' }}
                    values={["Upcoming", "Past"]}
                    selectedIndex={this.state.selectedIndex}
                    onTabPress={this.handleIndexChange}
                    activeTabStyle={{ backgroundColor: '#775DA3', borderColor: '#775DA3' }}
                    tabStyle={{ borderColor: '#775DA3' }}
                />


                {data.length === 0 ?
                    <Card transparent style={{ alignItems: 'center', justifyContent: 'center', marginTop: '20%' }}>
                       
                        <Thumbnail square source={noAppointmentImage} style={{ height: 100, width: 100, marginTop: '10%' }} />

                            <Text style={{ fontFamily: 'OpenSans', fontSize: 14, marginTop: '10%' }} note>No appoinments are scheduled</Text>
                            <Item style={{ marginTop: '15%', borderBottomWidth: 0 }}>
                                <Button style={[styles.bookingButton, styles.customButton]}>
                                    <Text  >Book Now</Text>
                                </Button>
                            </Item>
                    </Card> : 

                <Card style={{ padding: 5, borderRadius: 10, marginTop: 15 }}>                  
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
                                <Text style={{ fontFamily: 'OpenSans' }}>Dr.{item.AppointmentResult.doctorInfo.first_name+' '+item.AppointmentResult.doctorInfo.last_name} </Text>
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
                                    {item.AppointmentResult.appointment_status=='PENDING'&&
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12 ,color:'red' }} note>{item.AppointmentResult.appointment_status }</Text>
                                    }{item.AppointmentResult.appointment_status=='APPROVED'&&
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12 ,color:'green' }} note>{item.AppointmentResult.appointment_status }</Text>
                                    }

                                </Item>
                                    }
                              
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12 }} note>{formatDate(item.AppointmentResult.appointment_starttime,'dddd.MMMM-YY, LT') }</Text>

                                    {/* <Text style={{ fontFamily: 'OpenSans', fontSize: 12 }} note>April-13 </Text>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12 }} note>10.00 AM</Text> */}
                                </Item>
                                
                               {selectedIndex==0?
                            //    & item.ratting>0 ?
                              null:item.ratting==undefined? <Item><Button style={styles.shareButton}>
                              <Text >leave feed back</Text>
                          </Button>
                      </Item>:  <Item style={{ borderBottomWidth: 0,marginLeft:20 }}>
                              <Button style={styles.bookingButton}>
                                  <Text  >Book Again</Text>
                              </Button>
                              <Button style={styles.shareButton}>
                                  <Text >Share</Text>
                              </Button>
                          </Item>
                            }
                            </Body>
                        </ListItem>
                     }
                     keyExtractor={(item, index) => index.toString()}/>
                   </List>
                </Card> 
             }
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
        marginTop: 12,
        backgroundColor: '#775DA3',
        marginLeft: 15,
        borderRadius: 10,
        width: 'auto',
        height: 40,
        color: 'white',
        fontSize: 12,
        textAlign: 'center'
    },
    shareButton: {
        marginTop: 12,
        backgroundColor: 'gray',
        marginLeft: 15,
        borderRadius: 10,
        width: 'auto',
        height: 40,
        color: 'white',
        fontSize: 12,
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

    }
});