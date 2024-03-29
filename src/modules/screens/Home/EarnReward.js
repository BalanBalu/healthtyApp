import React, { Component } from 'react';
import {
  Container, Content, View, Text, Title, Header, H3, Button, Item, CardItem, Row, Col,
  List, ListItem, Left, Right, Card, Thumbnail, Body, Icon, ScrollView, Grid,Toast
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, TouchableOpacity, FlatList, Image, ImageBackground, Share } from 'react-native';
import { fetchUserProfile } from '../../providers/profile/profile.action';
import { hasLoggedIn } from "../../providers/auth/auth.actions";
import Spinner from "../../../components/Spinner";
import { SHARE_URL, CURRENT_APP_NAME,API_URL } from '../../../setup/config'
import { connect } from 'react-redux';
import {primaryColor} from '../../../setup/config'

class EarnReward extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  async componentDidMount() {
    const isLoggedIn = await hasLoggedIn(this.props);
    if (!isLoggedIn) {
      this.props.navigation.navigate("login");
      return;
    }
  }

  onShare = async () => {
    try {
      const { profile: { refer_code } } = this.props;
      let inviteId = '';
      let referal_meassage='';
      
      if (refer_code) {
        inviteId = `${API_URL}medflicinvite/${refer_code}`;
        referal_meassage = `referal code is ${refer_code}`
      
      
        const result = await Share.share({
          message:
            `Join me on ${CURRENT_APP_NAME} a doctor  appointment booking app' ${inviteId} ${referal_meassage}`
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        }
        // else if (result.action === Share.dismissedAction) {
        //   // dismissed
        // }
      } else {
        Toast.show({
          type:'danger',
          text:'network error',
          duration: 3000
      })
      }
    } catch (error) {
      console.log(error.message);
    }
  };



  render() {
    const { profile: { availableCreditPoints, refer_code } } = this.props;
    return (
      <Container style={styles.container}>
        <Content style={styles.bodyContent}>
          <View style={{ marginTop: 25 }}>
            <Text style={styles.mainHead}>Free Rewards !</Text>
            <Text style={[styles.mainHead, { marginTop: 10, color: 'grey' }]}>Your Reward Points</Text>

            <Text style={[styles.mainHead, { marginTop: 10, fontWeight: 'bold', borderColor: primaryColor, borderWidth: 2, borderRadius: 25, padding: 10, alignSelf: 'center' }]}>{availableCreditPoints}</Text>

            <Text style={styles.codeText}>Your Code</Text>
            <Text style={styles.numText}>{refer_code || ''}</Text>

            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
              <Image
                source={require('../../../../assets/images/gift.png')}
                style={{
                  width: 140, height: 140, alignItems: 'center'
                }}
              />
            </View>
            <View style={{ marginTop: 10, paddingBottom: 15 }}>
              <Card style={styles.mainCard}>
                <Row style={styles.MainRow}>
                  <Col style={{ width: '70%' }}>
                    <ImageBackground
                      source={require('../../../../assets/images/bg.png')}
                      style={{
                        width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <Text style={styles.innerText}>Invite 25 people to get a branded watch for absolutely free !!</Text>
                    </ImageBackground>
                  </Col>
                  <Col style={{ width: '30%', }}>

                    <Image
                      source={require('../../../../assets/images/imagebgwatch.png')}
                      style={{
                        width: '130%', height: '130%', marginTop: -10, marginLeft: -1
                      }}
                    />
                  </Col>
                </Row>
              </Card>
              <View style={{ marginTop: 10, alignItems: 'center', justifyContent: 'center', }}>
                <Row style={{ justifyContent: 'center', alignItems: 'center', height: 250, width: 250 }}>
                  <Image
                    source={require('../../../../assets/images/Qrcode.jpeg')}
                    style={{
                      width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'
                    }}
                  />
                </Row>


              </View>

              <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                <TouchableOpacity style={styles.touchbutton} onPress={this.onShare}>
                  <Text style={styles.touchText}>Share</Text>
                </TouchableOpacity>
              </View>

            </View>

          </View>
        </Content>
      </Container>
    )
  }
}


const styles = StyleSheet.create({

  container: {
    // flex:1
  },
  bodyContent: {
    // flex:1
  },
  mainHead: {
    textAlign: 'center',
    fontFamily: 'OpenSans',
    fontSize: 18,
    color: primaryColor,
    fontWeight: '700'
  },
  subHead: {
    textAlign: 'center',
    fontFamily: 'OpenSans',
    fontSize: 18,
    color: 'gray',
    marginTop: 20,
    lineHeight: 30
  },
  mainCard: {
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 15
  },
  MainRow: {
    height: 60,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  codeText: {
    textAlign: 'center',
    fontFamily: 'OpenSans',
    fontSize: 18,
    color: 'gray',
    marginTop: 10,
    lineHeight: 30
  },
  numText: {
    textAlign: 'center',
    fontFamily: 'OpenSans',
    fontSize: 18,
    color: primaryColor,
    marginTop: 10,
    fontWeight: '700'
  },
  touchbutton: {
    backgroundColor: primaryColor,
    borderRadius: 20,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 20
  },
  touchText: {
    textAlign: 'center',
    fontFamily: 'OpenSans',
    fontSize: 18,
    color: '#fff',
    fontWeight: '700'
  },
  innerText: {
    color: primaryColor,
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 15,
    lineHeight: 20,
    fontWeight: '500'
  }
})
function propState(state) {
  return {
    profile: state.profile
  }
}
export default connect(propState)(EarnReward)