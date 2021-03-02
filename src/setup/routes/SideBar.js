import React from "react";
import { AppRegistry, Image, StatusBar, TouchableOpacity, FlatList, AsyncStorage } from "react-native";
import { Container, Content, Text, List, ListItem, View, Row, Col, Right, Footer, FooterTab, Icon, Button, Body } from "native-base";
import { DragwerLogos } from './appRouterHome';
import { logout } from '../../modules/providers/auth/auth.actions';
import FastImage from 'react-native-fast-image'
import { CURRENT_PRODUCT_ANDROID_VERSION_CODE, CURRENT_PRODUCT_IOS_VERSION_CODE, IS_ANDROID, CURRENT_APP_NAME, MY_SMART_HEALTH_CARE } from '../config'
import { translate } from "../../setup/translator.helper"
import { corporateUserSideBarMenuList } from "./appRouterHome";
import { primaryColor, secondaryColor, secondaryColorTouch } from '../../setup/config';
import { getFullName } from '../../modules/common';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
class SideBar extends React.Component {
  activeUserData = {};
  constructor(props) {
    super(props)
    this.state = {
      hasLoggedIn: false,
      is_corporate_user: false,
      showAppointments: null,
      colorChange: false,
      colorChanges: false,
      selectedIndex: -1,
    };
    this.arrayData = []

  }
  async componentDidMount() {
    const token = await AsyncStorage.getItem('token')
    const userId = await AsyncStorage.getItem('userId')
    if (token === undefined || userId === undefined || token === null || userId === null) { }
    else {
      this.setState({ hasLoggedIn: true })
    }
    const is_corporate_user = await AsyncStorage.getItem('is_corporate_user')

    if (!!is_corporate_user) {
      this.setState({ is_corporate_user: true })
    }
  }
  signInOrSignup(hasLoggedIn) {
    if (hasLoggedIn) {
      logout();
      this.props.navigation.navigate('login')
    } else {
      this.props.navigation.navigate('login');
    }
  }
  renderProfileImageOrLogo() {
    data = this.activeUserData;
    let source = null;
    if (!data || this.state.hasLoggedIn === false)
      return require('../../../assets/images/Logo.png');

    if (data.profile_image) {
      if (data.profile_image)
        source = { uri: data.profile_image.imageURL }
      else
        source = require('../../../assets/images/Logo.png')
    } else {
      source = require('../../../assets/images/Logo.png')
    }
    return (source)
  }

  async getBasicData() {
    const basicProfileData = await AsyncStorage.getItem('basicProfileData');
    const basicData = JSON.parse(basicProfileData);
    this.activeUserData = basicData;
  }
  openAppointmentData(value) {
    if (value === true) {
      this.setState({
        showAppointments: false,
        colorChange: true
      });
    }
    else {
      this.setState({
        showAppointments: true,
        colorChange: true
      });
    }
  }
  subItemPress(item, index) {
    if (this.state.selectedIndex === index) {
      this.setState({ selectedIndex: -1 })
    } else {
      this.setState({ selectedIndex: index })
    }
    if (item.routeName.length === 0) {
      this.openAppointmentData(this.state.showAppointments)
    }
    if (item.params) {
      this.props.navigation.navigate(item.routeName, { ...item.params })
    } else {
      this.props.navigation.navigate(item.routeName)
    }
  }

  render() {

    const { items, menuSubMenus, } = this.props;
    const { hasLoggedIn, is_corporate_user } = this.state;
    this.getBasicData();
    return (
      <Container>

        <Content style={{ backgroundColor: '#DCEAE9' }}>
          <View style={{ height: 120, backgroundColor: '#128283', }}>

            <FastImage square source={require('../../../assets/images/Logo.png')} style={{ flex: 1, width: undefined, height: undefined, opacity: 0.1, transform: [{ rotate: '-2deg' }] }} />

            <Row style={{ alignItems: 'center', marginLeft: 15, position: 'absolute', marginTop: 30, }}>
              <Col style={{ width: '30%' }}>
                <FastImage square source={this.renderProfileImageOrLogo()}
                  style={{ height: 60, width: 60, borderColor: '#fff', borderWidth: 2, borderRadius: 30 }}
                />
              </Col>
              <Col style={{ width: '70%' }}>
                {hasLoggedIn ?
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontFamily: 'OpenSans', fontSize: 16, fontWeight: 'bold', color: '#fff' }}>{getFullName(this.activeUserData)}</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')} style={{ paddingRight: 10, paddingTop: 2, width: '100%' }}>
                      <Text style={{ fontFamily: 'OpenSans', fontSize: 13, color: '#fff' }}>{translate("View Profile")}</Text>
                    </TouchableOpacity>



                  </View>
                  :
                  <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={{ borderColor: '#fff', borderWidth: 2, borderRadius: 5, padding: 5, alignItems: 'center', paddingRight: 15, paddingLeft: 15 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon name='log-in' style={{ color: '#FFF', fontSize: 25 }} />
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 15, fontWeight: 'bold', color: '#FFF', marginTop: 4, marginLeft: 5 }}>{CURRENT_APP_NAME}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>}
              </Col>
            </Row>
          </View>

          <FlatList
            data={CURRENT_APP_NAME === MY_SMART_HEALTH_CARE ? corporateUserSideBarMenuList : menuSubMenus}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() =>
              <View
                style={{

                  backgroundColor: '#DCEAE9'
                }}
              />
            }
            renderItem={({ item, index }) =>
              item.menuForCorporateUser === true && is_corporate_user === false ? null :
                <View>



                  <FlatList
                    data={item.subMenus}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) =>
                      <View>
                        <Row style={this.state.selectedIndex === index && item.routeName.length === 0 ? { borderBottomWidth: 0, backgroundColor: '#fff', borderBottomWidth: 0, paddingHorizontal: 10, paddingVertical: 6, } : { borderBottomWidth: 0, backgroundColor: '#DCEAE9', borderBottomWidth: 0, paddingHorizontal: 10, paddingVertical: 6, }}
                          small
                          onPress={() => {
                            this.subItemPress(item, index)
                          }
                          }>


                          <Image square source={item.icon}
                            style={item.largeIcon}
                          />
                          {item.name === "Appointments" && item.routeName.length === 0 ?
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 15, marginLeft: 16 }}>{translate(item.name)}</Text> :
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 15 }}>{translate(item.name)}</Text>}

                          {item.name === "Appointments" && item.routeName.length === 0 ?
                            <Right>
                              <TouchableOpacity onPress={() => this.setState({ showAppointments: !this.state.showAppointments })}>
                                <MaterialIcons name={this.state.selectedIndex === index ? "keyboard-arrow-up" : "keyboard-arrow-down"} style={{ fontSize: 20 }} />
                              </TouchableOpacity>
                            </Right> : null}
                        </Row>
                        {item.name === "Appointments" ?
                          <View>

                            {this.state.showAppointments && item.routeName.length === 0 &&
                              <FlatList
                                data={item.appoinmentSubMenus}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) =>
                                  <ListItem style={{ borderBottomWidth: 0, backgroundColor: '#DCEAE9', paddingLeft: 25 }}
                                    small
                                    onPress={() => {
                                      if (item.params) {
                                        this.props.navigation.navigate(item.routeName, { ...item.params })
                                      } else {
                                        this.props.navigation.navigate(item.routeName)
                                      }
                                    }
                                    }>
                                    <Image square source={item.icon}
                                      style={item.largeIcon}
                                    />
                                    <Body style={{ borderBottomWidth: 0, }}>
                                      <Text style={{ fontFamily: 'OpenSans', fontSize: 13 }}>{translate(item.name)}</Text>
                                    </Body>
                                  </ListItem>
                                } />
                            }
                          </View>
                          :
                          null
                        }
                      </View>
                    } />
                </View>
            } />

          <View style={{ marginTop: 10, marginLeft: 2 }}>
            <ListItem avatar style={{ marginTop: -15 }}>
              <Icon name='ios-power' style={{
                fontSize: 20, color: '#128283',
              }} />
              <Body style={{ borderBottomWidth: 0, }}>
                <Text onPress={() => this.signInOrSignup(hasLoggedIn)}
                  style={{ fontFamily: 'OpenSans', fontSize: 15, }}>{hasLoggedIn ? translate('Sign Out') : translate('Sign In')}</Text>
              </Body>
            </ListItem>
          </View>
        </Content>
        <View>
          <Footer style={{ marginTop: 10, backgroundColor: '#fff', }}>
            <FooterTab style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#128283' }}>
              <Text style={{ textAlign: 'center', fontFamily: 'OpenSans', fontWeight: '700', fontSize: 20, color: '#fff' }}>{CURRENT_APP_NAME}</Text>
              <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 15, color: '#000' }}>Version {IS_ANDROID ? CURRENT_PRODUCT_ANDROID_VERSION_CODE : CURRENT_PRODUCT_IOS_VERSION_CODE}</Text>
            </FooterTab>
          </Footer>
        </View>
      </Container>
    );
  }
}

export default SideBar