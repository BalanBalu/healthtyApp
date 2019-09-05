
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


class Notification extends Component {
    constructor(props) {

        super(props);
        this.state = {
            data: [],
            notificationId: [],

            isLoading: false
        };

    }

    async componentDidMount() {
       
        const isLoggedIn = await hasLoggedIn(this.props);
        if (!isLoggedIn) {
            this.props.navigation.navigate("login");
            return;
        }
         await this.getUserNotification();
    }

    backNavigation = async (navigationData) => {
        try {
            await this.setState({ isLoading: false })
            if (navigationData.action) {
                console.log(navigationData.action.type)
                if (navigationData.action.type === 'Navigation/BACK') {
                   this.getUserNotification();
                    await this.setState({ isLoading: false })
                }
            }
        } catch (e) {
            console.log(e)
        }

    }
    updateNavigation = async (item) => {

        await this.setState({ notificationId: item._id })
        if (!item.mark_as_readed) {
            await this.upDateNotification('mark_as_readed')
            this.props.navigation.push("AppointmentInfo", { appointmentId: item.appointment_id })

        }
        else {
            this.props.navigation.push("AppointmentInfo", { appointmentId: item.appointment_id })
        }
    }
    upDateNotification = async (node) => {
        try {

            let result = await UpDateUserNotification(node, this.state.notificationId);

        }
        catch (e) {
            console.log(e);
        }

    }

     getUserNotification=async()=> {
    try {

        let userId = await AsyncStorage.getItem('userId');
        console.log(userId)
        let result = await fetchUserNotification(userId);
        if (result.success) {
            this.setState({data:result.data})
        }
        
        console.log(JSON.stringify(result))




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
                    {isLoading === true ?
                        <Spinner
                            color="blue"
                            style={[styles.containers, styles.horizontal]}
                            visible={true}
                            size={"large"}
                            overlayColor="none"
                            cancelable={false}
                        /> : data === undefined ? null : data.length == undefined ?

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



                                            <Card style={{ borderRadius: 5, width: 'auto', }}>
                                                {/* <View style={{ borderWidth: 1, borderColor: '#c9cdcf', marginTop: 10 }} /> */}
                                                <TouchableOpacity onPress={() => this.updateNavigation(item)}>
                                                    <View style={{ backgroundColor: (item.mark_as_viewed == false) ? '#f5e6ff' : null }}>

                                                        <Col>
                                                            {dateDiff(new Date(item.created_date), new Date(), 'days') > 30 ?

                                                                <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginLeft: 265, marginTop: 5 }}>
                                                                    {formatDate(new Date(item.created_date), "DD-MM-YYYY")}
                                                                </Text> :

                                                                <Text style={{
                                                                    fontSize: 15, fontFamily: 'OpenSans',
                                                                    marginLeft: 265, marginTop: 5
                                                                }}>
                                                                    {moment(new Date(item.created_date), "YYYYMMDD").fromNow()}
                                                                </Text>
                                                            }
                                                        </Col>

                                                        <Col>

                                                            <Text style={{
                                                                fontSize: 15, fontFamily: 'OpenSans', marginTop: 10,
                                                                color: '#000', marginLeft: 20, marginRight: 20
                                                            }}>{item.notification_message} </Text>



                                                        </Col>

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



