
import React, { Component } from 'react';
import { StyleSheet, AsyncStorage, FlatList, TouchableOpacity} from 'react-native';
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

    // backNavigation = async (navigationData) => {
    //     if (navigationData.action) {
    //         if (navigationData.action.type === 'Navigation/BACK') {
//   
    //         }
    //     }
    //     // console.log(navigationData);
    // }
    updateNavigation=async (item)=> {
     await   this.setState({notificationId:item._id})
        if (!item.mark_as_readed) {
            
          await  this.upDateNotification()
        }
        
    }
    upDateNotification = async() => {
        try {
            console.log('updatenotification.......' + this.state.notificationId)
         let  result=  await UpDateUserNotification('mark_as_viewed', this.state.notificationId);
            console.log(result);
        }
        catch (e) {
            console.log(e);
        }
       
    }

    //
    getUserNotification = async () => {
        try {
            
            let userId = await AsyncStorage.getItem('userId');
           
            let result = await fetchUserNotification(userId);
            // let notificationId = result.data.map(_id => {
            //     return _id._id
            // }).join(',');
            // this.setState({ notificationId: notificationId })
          
            if (result.success) {
                await this.setState({ data: result.data, isLoading: true  })   
            }
            console.log(this.state.data)
           

        }
        catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: true });
        }
    }


    render() {
        const { data ,isLoading} = this.state
        return (
            < Container style={styles.container} >
                {/* <NavigationEvents onwillBlur={payload => { this.componentWillMount() }} /> */}
                <Content>
                     {isLoading == true ? 
                    
                        < ScrollView horizontal={false}>
                            
                            <List noBorder>
                                <FlatList
                                    // horizontal={true}
                                    data={data}
                                    extraData={this.state}
                                    renderItem={({ item, index }) =>

                                
                                       
                                            <Card style={{ borderRadius: 5, width: 'auto', }}>
                                                {/* <View style={{ borderWidth: 1, borderColor: '#c9cdcf', marginTop: 10 }} /> */}
                                            <TouchableOpacity onPress={() => this.updateNavigation(item)}>
                                                <View style={{ backgroundColor: (item.mark_as_viewed== false) ? '#f5e6ff' : null }}>
                                               
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
                                            </TouchableOpacity>
                                            </Card>
                                       
                                    }
                                    keyExtractor={(item, index) => index.toString()} />
                                </List>
                                
                    </ ScrollView>:
                         
                        <Spinner
                            color="blue"
                            style={[styles.containers, styles.horizontal]}
                            visible={true}
                            size={"large"}
                            overlayColor="none"
                            cancelable={false}
                        />
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
export default Notification



