
import React, { Component } from 'react';
import { StyleSheet, AsyncStorage, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import { Container, Header, Title, Left, Body, Card, View, Text, Content, Col, Icon, ListItem, List
} from 'native-base';
import moment from 'moment';
import { fetchUserNotification, UpDateUserNotification } from '../../providers/bookappointment/bookappointment.action';
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


        this.getUserNotification();

    }

    backNavigation = async (navigationData) => {
        if (navigationData.action) {
            if (navigationData.action.type === 'Navigation/BACK') {
                this.upDateNotification();
            }
        }
        // console.log(navigationData);
    }
    upDateNotification = async () => {
        try {
            await UpDateUserNotification('mark_as_viewed', this.state.notificationId);
        }
        catch (e) {
            console.log(e);
        }
        // finally {
        //     this.setState({ isLoading: false });
        // }
    }

    //
    getUserNotification = async () => {
        try {
             this.setState({ isLoading: true });
            let userId = await AsyncStorage.getItem('userId');
            let condition = true;
            let oldResult = await fetchUserNotification(userId, condition);
            //if my point of you mark_as_viewed=false  means new notification 
            let condition1 = false;
            let newResult = await fetchUserNotification(userId, condition1);
            let notificationId = newResult.data.map(_id => {
                return _id._id
            }).join(',');
            this.setState({ notificationId: notificationId })
            let result = [];
            result=newResult.data.concat( oldResult.data)
            if (newResult.success) {
                await this.setState({ data: result })
              
            }
            this.setState({ isLoading: false });

        }
        catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }


    render() {
        const { data ,isLoading} = this.state
        return (
            < Container style={styles.container} >
                <NavigationEvents onWillFocus={payload => { this.backNavigation(payload) }} />
                <Content>
                    {/* {isLoading == true ? */}
                    
                        < ScrollView horizontal={false}>
                            <List noBorder>
                                <FlatList
                                    // horizontal={true}
                                    data={data}
                                    extraData={this.state}
                                    renderItem={({ item, index }) =>

                                
                                        <Body>
                                            <Card style={{ borderRadius: 5, width: 'auto', }}>
                                                <View style={{ borderWidth: 1, borderColor: '#c9cdcf', marginTop: 10 }} />
                                    
                                                <View style={{ backgroundColor: (item.mark_as_viewed == false) ? '#f5e6ff' : null }}>

                                                    <Col>
                                                        {dateDiff(item.created_date, new Date(), 'days') > 30 ?
        
            
                                                            <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginLeft: 265, marginTop: 5 }}> {formatDate(item.created_date, "DD-MM-YYYY")} </Text> :
                                                            <Text style={{
                                                                fontSize: 15, fontFamily: 'OpenSans',
                                                                marginLeft: 265, marginTop: 5
                                                            }}> {moment(item.created_date, "YYYYMMDD").fromNow()}</Text>
                                                        }
                                              

                                                    </Col>

                                                    <Col>

                                                        <Text style={{
                                                            fontSize: 15, fontFamily: 'OpenSans', marginTop: 10,
                                                            color: '#000', marginLeft: 20, marginRight: 20
                                                        }}>{item.notification_message} </Text>



                                                    </Col>

                                                </View>

                                            </Card>
                                        </Body>
                                    }
                                    keyExtractor={(item, index) => index.toString()} />
                            </List>
                    </ ScrollView>
                         
                        {/*<Spinner
                            color="blue"
                            style={[styles.containers, styles.horizontal]}
                            visible={true}
                            size={"large"}
                            overlayColor="none"
                            cancelable={false}
                        />
                    } */}
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
export default Notification



