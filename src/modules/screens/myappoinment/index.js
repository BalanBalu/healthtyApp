import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ScrollView, ProgressBar, Tab, Tabs } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import StarRating from 'react-native-star-rating';
import TabOne from "./tabOne";
import TabTwo from "./tabTwo";

class Reviews extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userEntry: '',
      password: '',
      loginErrorMsg: ''
    }
    this.state = {
      starCount: 3.5
    };
  }
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  render() {
    const { user: { isLoading } } = this.props;
    const { loginErrorMsg } = this.state;
    return (

      <Container style={styles.container}>
        <Header style={{ backgroundColor: '#775DA3' }}>
          <Left><Icon name='medkit' style={{ color: 'white' }}></Icon></Left>
          <Body ><Title style={{ textAlign: 'center', marginLeft: -30, fontFamily: 'opensans-semibold' }}>My Appoinments</Title></Body>
          <Right>
            <Button transparent onPress={() => this.props.navigation.navigate('profile')}>
              <Thumbnail style={{ height: 40, width: 40, borderColor: '#f5f5f5', borderWidth: 2, borderRadius: 50 }} source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} />
            </Button>
          </Right>
        </Header>
        <Tabs tabBarUnderlineStyle={{ height: 0 }} tabContainerStyle={{ backgroundColor: 'white'}}>
          <Tab heading="Current" tabStyle={{ backgroundColor: "white" }} activeTabStyle={{ backgroundColor: "#F58949", borderRadius: 30, borderColor: '#fff', borderWidth: 2, fontFamily: 'opensans-regular', }} >
            <TabOne/>
          </Tab>
          <Tab heading="Upcoming" tabStyle={{ backgroundColor: "white" }} activeTabStyle={{ backgroundColor: "#F58949", borderRadius: 30, borderColor: '#fff', borderWidth: 2, fontFamily: 'opensans-regular', }}>
            <TabTwo />
          </Tab>

        </Tabs>

      </Container>
    )
  }

}

function loginState(state) {

  return {
    user: state.user
  }
}
export default connect(loginState, { login, messageShow, messageHide })(Reviews)


const styles = StyleSheet.create({

  container:
  {
    backgroundColor: '#ffffff',
  },

  bodyContent: {
    margin: 0

  },


});