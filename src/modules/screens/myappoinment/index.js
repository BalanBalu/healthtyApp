import React, { Component } from 'react';
import { Container, Title, Header, Button, Left, Right, Thumbnail, Body, Icon, Tab, Tabs } from 'native-base';
import { StyleSheet} from 'react-native';
import PastAppointment from "./Past";
import UpcomingAppointment from "./Upcoming";

class MyAppointments extends Component {
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
    return (

      <Container style={styles.container}>
        <Tabs tabBarUnderlineStyle={{ height: 0 }} tabContainerStyle={{ backgroundColor: 'white'}}>
          <Tab heading="Current" tabStyle={{ backgroundColor: "white" }} activeTabStyle={{ backgroundColor: "#F58949", borderRadius: 30, borderColor: '#fff', borderWidth: 2, fontFamily: 'opensans-regular', }} >
            <PastAppointment navigation={this.props.navigation}/>
          </Tab>
          <Tab heading="Upcoming" tabStyle={{ backgroundColor: "white" }} activeTabStyle={{ backgroundColor: "#F58949", borderRadius: 30, borderColor: '#fff', borderWidth: 2, fontFamily: 'opensans-regular', }}>
            <UpcomingAppointment navigation={this.props.navigation}/>
          </Tab>

        </Tabs>

      </Container>
    )
  }

}

export default MyAppointments


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  bodyContent: {
    margin: 0
  },
});