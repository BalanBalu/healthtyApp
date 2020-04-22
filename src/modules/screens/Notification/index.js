import React, { Component } from 'react';
import { StyleSheet, AsyncStorage, FlatList, TouchableOpacity, ScrollView } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import {
    Container, Header, Title, Left, Body, Card, View, Text, Content, Col, Row, Icon, ListItem, List, Grid
} from 'native-base';
import { connect } from 'react-redux'
import moment from 'moment';
import { fetchUserNotification, UpDateUserNotification } from '../../providers/notification/notification.actions';
import { hasLoggedIn } from "../../providers/auth/auth.actions";
import { formatDate, dateDiff } from '../../../setup/helpers';
import Spinner from "../../../components/Spinner";
import { store } from '../../../setup/store';

class Notification extends Component {
    constructor(props) {

        super(props);
        this.state = {
            data: [],
            notificationId: null,

            isLoading: false
        };

    }

    async componentDidMount() {
       
        const isLoggedIn = await hasLoggedIn(this.props);
        if (!isLoggedIn) {
            this.props.navigation.navigate("login");
            return;
        }
        await this.setState({ notificationId: this.props.notification.notificationIds });
       
        await new Promise.all([
            this.getUserNotification(),
            this.upDateNotification('mark_as_readed')
        ])    
        await this.setState({ isLoading: true })
         
    }

    backNavigation = async (navigationData) => {
        try {
            await this.setState({ isLoading: false })
            if (navigationData.action) {
                if (navigationData.action.type === 'Navigation/BACK') {
                    
                  await this.getUserNotification();
                   
                }
            }
            await this.setState({ isLoading: true })
        } catch (e) {
            console.log(e)
        }

    }
    updateNavigation = async (item) => {
        
       
        await this.setState({ notificationId: item._id })
        if(item.notification_type==='APPOINTMENT'){
        if (!item.mark_as_viewed) {
            await this.upDateNotification('mark_as_viewed')
            this.props.navigation.push("AppointmentInfo", { appointmentId: item.appointment_id,fromNotification:true })
              
        }
        else {
            this.props.navigation.push("AppointmentInfo", { appointmentId: item.appointment_id,fromNotification:true })
        }
    }
    if(item.notification_type==='PHARMACY_ORDERS'){
        if (!item.mark_as_viewed) {
            await this.upDateNotification('mark_as_viewed')
            this.props.navigation.push("OrderDetails", { serviceId: item.service_id,fromNotification:true })
              
        }
        else {
            this.props.navigation.push("OrderDetails", { serviceId: item.service_id,fromNotification:true })
        }
    }
    }
    upDateNotification = async (node) => {
        try {
           
            if (this.state.notificationId) {
               
                let result = await UpDateUserNotification(node, this.state.notificationId);
               
            }
        }
        catch (e) {
            console.log(e);
        }

    }

     getUserNotification=async()=> {
    try {

        let userId = await AsyncStorage.getItem('userId');
       
        let result = await fetchUserNotification(userId);
      
        if (result.success) {
            this.setState({data:result.data})
        }
        
        




    }
    catch (e) {
        console.log(e);
    }


}



    render() {
        const { data, isLoading } = this.state;
        

        return (
            < Container style={styles.container} >
                {/* <NavigationEvents onwillBlur={payload => { this.componentWillMount() }} /> */}
                <Content>
                    {isLoading === false ?
                        <Spinner
                            color="blue"
                            style={[styles.containers, styles.horizontal]}
                            visible={true}
                            size={"large"}
                            overlayColor="none"
                            cancelable={false}
                        /> : data === undefined ? null : data.length == 0 ?

                            <View style={{
                                flex: 1,
                                justifyContent: 'center', alignItems: 'center', marginTop: 200,
                            }}>

                                <Icon style={{ fontSize: 25 }} name='ios-notifications-off' />
                                <Text>No Notification Found</Text>

                            </View>

                            :

                            < ScrollView horizontal={false}>
                                <NavigationEvents
                                    onWillFocus={payload => { this.backNavigation(payload) }}
                                />

                                <List noBorder>
                                    <FlatList
                                        // horizontal={true}
                                        data={data}
                                        extraData={this.state}
                                        renderItem={({ item, index }) =>



                                            <Card style={{ borderRadius: 5, width: 'auto',padding:15,backgroundColor: (item.mark_as_viewed == false) ? '#f5e6ff' : null}}>
                                                {/* <View style={{ borderWidth: 1, borderColor: '#c9cdcf', marginTop: 10 }} /> */}
                                                <TouchableOpacity onPress={() => this.updateNavigation(item)} testID='notificationView'>
                                                    <View >

                                                       
                                                            {dateDiff(new Date(item.created_date), new Date(), 'days') > 30 ?

                                                                <Text style={{ fontSize: 12, fontFamily: 'OpenSans', textAlign:'right', marginTop: 5,}}>
                                                                   {formatDate(new Date(item.created_date), "DD-MM-YYYY")} 
                                                                </Text> :

                                                                <Text style={{
                                                                    fontSize: 12, fontFamily: 'OpenSans',
                                                                     marginTop: 5,textAlign:'right',
                                                                }}>
                                                                    {moment(new Date(item.created_date), "YYYYMMDD").fromNow()}
                                                                </Text>
                                                            }
                                                       

                                                        

                                                            <Text style={{
                                                                fontSize: 14, fontFamily: 'OpenSans', marginTop: 10,
                                                                color: '#000',textAlign:'auto',lineHeight:20
                                                            }}>{item.notification_message} </Text>



                                                       

                                                    </View>
                                                </TouchableOpacity>
                                            </Card>

                                        }
                                        keyExtractor={(item, index) => index.toString()} />
                                </List>
                               
                            </ ScrollView>
                           

                    }
                </Content>
            </Container >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 5

    },

    card: {
        width: 'auto',
        borderRadius: 100

    },
    title: {
        paddingLeft: 40, paddingTop: 10

    },




})
function notificationState(state) {

    return {
        notification: state.notification
    }
}
export default connect(notificationState)(Notification)
//export default Notification
