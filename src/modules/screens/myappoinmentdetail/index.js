import React, { Component } from 'react';
import {
    Container, Content, View, Text, Title, Header, H3, Button, Item, Card,
    CardItem, List, ListItem, Left, Right, Thumbnail, Segment,
    Body, Icon, ScrollView
} from 'native-base';
import { StyleSheet, Image, AsyncStorage, FlatList } from 'react-native';
import StarRating from 'react-native-star-rating';

import { userReviews } from '../../providers/profile/profile.action';
import { formatDate ,addTimeUnit,dateDiff} from '../../../setup/helpers';
import { Col, Row, Grid } from 'react-native-easy-grid';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { appointment } from "../../providers/bookappointment/bookappointment.action";
;
   
class MyAppoinmentList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            isLoading: false,
            selectedIndex: 0,
            upComingData: [],
            pastData: [],
            userId: "5ce50ae57ca0ee0f10f42c34"
        }
         
    }
    componentDidMount() {
      //  this.setState({ data : this.state.upComingData});
      if(this.state.selectedIndex==0)
        this.upCommingAppointment();
        else
        this.pastAppointment();
    }
    upCommingAppointment = async () => {
        try {
          this.setState({ isLoading: true });
          // let userId = await AsyncStorage.getItem('userId');
          let filters = {
            startDate: formatDate(new Date() , "YYYY-MM-DD"),
            endDate: formatDate(addTimeUnit(new Date(), 1, "years"), "YYYY-MM-DD")
          };
          let result = await appointment(this.state.userId, filters);
          console.log("myappoinmentlist");
          console.log(result.data);
          this.setState({ isRefreshing: false, isLoading: false });
          if (result.success)
            this.setState({ upComingData: result.data, isRefreshing: false });
        } catch (e) {
          console.log(e);
        }
      };
      pastAppointment = async () => {
        try {
          this.setState({ isLoading: true });
          // let userId = await AsyncStorage.getItem('userId');
          let filters = {
            startDate:  formatDate(dateDiff(new Date(), 1, "days"), "YYYY-MM-DD"),
            endDate: formatDate(dateDiff(new Date(startDate), 1, "years"), "YYYY-MM-DD")
          };
          let result = await appointment(this.state.userId, filters);
          console.log("myappoinmentlist");
          console.log(result.data);
          this.setState({ isRefreshing: false, isLoading: false });
          if (result.success)
            this.setState({ pastData: result.data, isRefreshing: false });
        } catch (e) {
          console.log(e);
        }
      };

    handleIndexChange = (index) => {
        console.log("Display index  value : " + index);
        let data= (index === 0 ? this.state.upComingData : this.state.pastData)
        this.setState({
            ...this.state,
            selectedIndex: index,
            data
        });
        this.componentDidMount();
    };

    render() {
        const { data } = this.state;

        return (

            <View style={styles.container}>
                <SegmentedControlTab  tabsContainerStyle={{ width: 250,marginLeft:'auto',marginRight:'auto'}}
                    values={["Upcoming", "Past"]}
                    selectedIndex={this.state.selectedIndex}
                    onTabPress={this.handleIndexChange}
                    activeTabStyle={{ backgroundColor: '#775DA3', borderColor: '#775DA3' }}
                    tabStyle={{ borderColor: '#775DA3' }}
                />
   
                             
                {data.length === 0 ? 
                <Card style={{ padding: 5, borderRadius: 10, marginTop: 15 }}>
                        <Item style={{ borderBottomWidth: 0 }}>
                            
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12 }} note>If no appointment, this should be printed, karthick bro, code should be implement here</Text>

                                   
                        </Item>
                </Card> : 

                <Card style={{ padding: 5, borderRadius: 10, marginTop: 15 }}>                  
                <List>
                <FlatList
                            data={data}
                            extraData={this.state}
                            renderItem={({ item, index }) => 
                   
                        <ListItem avatar onPress={() => this.props.navigation.navigate('AppointmentInfo')}>
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
                                        rating={this.state.starCount}
                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    />
                              </Item>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12 }} note>{formatDate(item.appointment_starttime,'dddd.MMMM-YY, LT') }</Text>

                                    {/* <Text style={{ fontFamily: 'OpenSans', fontSize: 12 }} note>April-13 </Text>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12 }} note>10.00 AM</Text> */}
                                </Item>
                                <Item style={{ borderBottomWidth: 0,marginLeft:20 }}>
                                    <Button style={styles.bookingButton}>
                                        <Text  >Book Again</Text>
                                    </Button>
                                    <Button style={styles.shareButton}>
                                        <Text >Share</Text>
                                    </Button>
                                </Item>


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
        width: 120,
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
        width: 90,
        height: 40,
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
        justifyContent: 'center'
    },
});