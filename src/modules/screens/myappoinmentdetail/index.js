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
   
class MyAppoinmentList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            data: [],
            isLoading: false,
            selectedIndex: 0,
            upComingData: [],
            pastData: [],
            userId: null,
            reviewData:[],
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
    // user reviews
    //  getUserReview = async () => {
    //     try {
    //       this.setState({ isLoading: true });
    //       // let userId = await AsyncStorage.getItem('userId');
         
    //       let result = await viewUserReviews(this.state.userId,'user');
    //     let resultData=result.data
    //       this.setState({ isRefreshing: false, isLoading: false });
    //       console.log('userreview appointment')
    //       console.log(result.data);
    //       while(resultData.length>0){
              
    //       }
    //       if (result.success)
    //         this.setState({ reviewData: result.data, isRefreshing: false});
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   };
    // my appoinment list get function in name, specialist ,date,...
    upCommingAppointment = async () => {
        try {
          this.setState({ isLoading: true });
           let userId = await AsyncStorage.getItem('userId');
          let filters = {
            startDate: formatDate(new Date() , "YYYY-MM-DD"),
            endDate: formatDate(addTimeUnit(new Date(), 1, "years"), "YYYY-MM-DD")
          };
          let result = await getUserAppointments(this.state.userId, filters);
               result=result.data;
              
             
               let tempReview=[];
              
              let results = await viewUserReviews(this.state.userId,'user');
                  results=results.data;
                    for(let count=0;count<result.length;count++){
                        for(let counts=0;counts<result.length;counts++) {
                            if(result[count]._id==results[counts].appointment_id){
                                tempReview.push(results[counts].comments);
                                
                            }

                        }
               }
         
          this.setState({ reviewData:tempReview, isLoading: false });
          if (result.success)
            this.setState({ upComingData: result.data, isRefreshing: false,data:result.data});
        } catch (e) {
          console.log(e);
        }
      };
      pastAppointment = async () => {
        try {
          this.setState({ isLoading: true });
          let userId = await AsyncStorage.getItem('userId');
          let  endData=  formatDate(subTimeUnit(new Date(), 1, "day"), "YYYY-MM-DD")
          let filters = {
            endDate: endData,
            startDate:"2018-01-01"
          };        
          let result = await getUserAppointments(this.state.userId, filters); 

         
          this.setState({ isRefreshing: false, isLoading: false });
          if (result.success)
          
            this.setState({ pastData: result.data, isRefreshing: false,data:result.data});
        } catch (e) {
          console.log(e);
        }
      };

    handleIndexChange = (index) => {
        this.componentDidMount();
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
                                <Text style={{ fontFamily: 'OpenSans' }}>Dr.{item.doctorInfo.first_name+' '+item.doctorInfo.last_name} </Text>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={{ fontFamily: 'OpenSans' }}>Internist</Text>
                                    <StarRating fullStarColor='#FF9500' starSize={20} containerStyle={{ width: 100, marginLeft: 60 }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={5}
                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    />
                                    </Item>
                                    {selectedIndex==1&&
                                <Item style={{ borderBottomWidth: 0 }}>
                                    {item.appointment_status=='PENDING'&&
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12 ,color:'red' }} note>{item.appointment_status }</Text>
                                    }{item.appointment_status=='APPROVED'&&
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12 ,color:'green' }} note>{item.appointment_status }</Text>
                                    }

                                </Item>
                                    }
                              
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12 }} note>{formatDate(item.appointment_starttime,'dddd.MMMM-YY, LT') }</Text>

                                    {/* <Text style={{ fontFamily: 'OpenSans', fontSize: 12 }} note>April-13 </Text>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12 }} note>10.00 AM</Text> */}
                                </Item>
                               {selectedIndex==0?
                                <Item style={{ borderBottomWidth: 0,marginLeft:20 }}>
                                    <Button style={styles.bookingButton}>
                                        <Text  >Book Again</Text>
                                    </Button>
                                    <Button style={styles.shareButton}>
                                        <Text >Share</Text>
                                    </Button>
                                </Item>:null}


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