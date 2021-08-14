import React, { Component, PureComponent } from 'react';
import {
  StyleSheet,

  FlatList,
  TouchableOpacity,
  ScrollView,
  YellowBox,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { ScrollView } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import {
  Container,
  Header,
  Title,
  Left,
  Body,
  Card,
  View,
  Text,
  Content,
  Col,
  Row,
  Icon,
  ListItem,
  List,
  Grid,
} from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  fetchUserNotification,
  UpDateUserNotification,
} from '../../providers/notification/notification.actions';
import { hasLoggedIn } from '../../providers/auth/auth.actions';
import {
  formatDate,
  dateDiff,
  notificationNavigation,
} from '../../../setup/helpers';
import Spinner from '../../../components/Spinner';
import { store } from '../../../setup/store';
import { primaryColor, secondaryColor } from '../../../setup/config';

import { RenderFooterLoader } from '../../common';
YellowBox.ignoreWarnings(['Async']);
class Notification extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      notificationId: null,
      isLoading: false,
      page: 0,
      limit: 10
    };
    this.onEndReachedCalledDuringMomentum = false;
    this.isAllNotificationLoaded = false;
  }

  async componentDidMount() {
    const isLoggedIn = await hasLoggedIn(this.props);
    if (!isLoggedIn) {
      this.props.navigation.navigate('login');
      return;
    }
    await this.setState({
      notificationId: this.props.notification.notificationIds,
    });


    await new Promise.all([
      this.getUserNotification(),
      this.upDateNotification(this.state.notificationId),
    ]);
    await this.setState({ isLoading: true, footerLoading: false });
  }

  backNavigation = async navigationData => {
    try {
      await this.setState({ isLoading: false });
      if (navigationData.action) {
        if (
          navigationData.action.type === 'Navigation/BACK' ||
          navigationData.action.type === 'Navigation/POP'
        ) {
          // this.page = 0;
          // await this.setState({ data: [] })
          // await this.getUserNotification();
        }
      }
      await this.setState({ isLoading: true });
    } catch (e) {
      console.log(e);
    }
  };
  updateNavigation = async (item, index) => {
    await this.setState({ notificationId: item._id });
    if (item.notificationType === 'APPOINTMENT') {
      if (!item.mark_as_viewed) {
        this.upDateNotification(item._id, index);
        this.props.navigation.push('AppointmentInfo', {
          appointmentId: item.appointmentId,
          fromNotification: true,
        });
      } else {
        this.props.navigation.push('AppointmentInfo', {
          appointmentId: item.appointmentId,
          fromNotification: true,
        });
      }
    } else if (item.notificationType !== 'VIDEO_CONSULTATION') {
      if (!item.mark_as_viewed) {
        this.upDateNotification(item._id, index);
        this.props.navigation.push(
          notificationNavigation[item.notificationType].navigationOption,
          { serviceId: item.service_id, fromNotification: true },
        );
      } else {
        this.props.navigation.push(
          notificationNavigation[item.notificationType].navigationOption,
          { serviceId: item.service_id, fromNotification: true },
        );
      }
    }
  };
  upDateNotification = async (id, index) => {
    try {
      if (this.state.notificationId) {
        let data = {
          ids: [id],
          mark_as_viewed: true
        }
        UpDateUserNotification(data);
        if (id) {
          if (index !== undefined || index !== null) {
            let data = this.state.data;
            let temp = this.state.data[index];
            temp.mark_as_viewed = true;
            data.splice(index, 1, temp);
            await this.setState({ data });
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  getUserNotification = async () => {
    try {
      let memberId = await AsyncStorage.getItem('memberId') || null;
      console.log(memberId);

      let result = await fetchUserNotification(memberId, this.state.page, this.state.limit);
         console.log(result);
        if (result && result.docs && result.docs.length != 0) {
         
          let temp = this.state.data.concat(result);

          if (temp.length) {
            this.isAllNotificationLoaded = true;
          }
          this.setState({ data: temp, footerLoading: false });
        } else {
          this.setState({ footerLoading: false });
          this.onEndReachedCalledDuringMomentum = false;
        }
    } catch (e) {
      console.log(e);
    }
  };



  renderFooter = () => {
    return (
      this.state.footerLoading ?
        <RenderFooterLoader footerLoading={this.state.footerLoading} /> : null

    )
  }

  handleLoadMore = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      this.onEndReachedCalledDuringMomentum = true;
      this.setState({ footerLoading: true, page: this.state.page + 1 },
        this.getUserNotification)
    }
  }

  render() {
    const { data, isLoading } = this.state;
  

    return (
      <Container style={styles.container}>
        {/* <NavigationEvents onwillBlur={payload => { this.componentWillMount() }} /> */}

        {isLoading === false ? (
          <Spinner
            color="blue"
            style={[styles.containers, styles.horizontal]}
            visible={true}
            size={'large'}
            overlayColor="none"
            cancelable={false}
          />
        ) : data === undefined ? null : data.length == 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon style={{ fontSize: 25 }} name="ios-notifications-off" />
            <Text>No Notification Found</Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <NavigationEvents
              onWillFocus={payload => {
                this.backNavigation(payload);
              }}
            />

            <FlatList
              data={data}
              extraData={this.state}
              renderItem={({ item, index }) => (
                <View>
                   <FlatList
                    data={item.docs}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) =>(
    <Card
                  style={{
                    borderRadius: 5,
                    width: 'auto',
                    padding: 15,
                    backgroundColor:
                      item.mark_as_viewed == false ? '#ebfcf8' : null,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.updateNavigation(item, index)}
                    testID="notificationView">
                    <View>
                      {dateDiff(
                        new Date(item.createdDate),
                        new Date(),
                        'days',
                      ) > 30 ? (
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: 'Roboto',
                            textAlign: 'right',
                            marginTop: 5,
                          }}>
                          {formatDate(
                            new Date(item.createdDate),
                            'DD-MM-YYYY',
                          )}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: 'Roboto',
                            marginTop: 5,
                            textAlign: 'right',
                          }}>
                          {moment(
                            new Date(item.createdDate),
                            'YYYYMMDD',
                          ).fromNow()}
                        </Text>
                      )}
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'Roboto',
                          marginTop: 10,
                          color: '#000',
                          textAlign: 'auto',
                          lineHeight: 20,
                        }}>
                        {item.notification_message}{' '}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Card>
                    )

                    }/>
                  </View>              
             
              )}
              onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
              onEndReached={this.handleLoadMore()}
              onEndReachedThreshold={0}
              ListFooterComponent={this.renderFooter()}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 5,
    flex: 1,
  },

  card: {
    width: 'auto',
    borderRadius: 100,
  },
  title: {
    paddingLeft: 40,
    paddingTop: 10,
  },
});
function notificationState(state) {
  return {
    notification: state.notification,
  };
}
export default connect(notificationState)(Notification);
//export default Notification
