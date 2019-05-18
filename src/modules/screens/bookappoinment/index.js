import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Card, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ScrollView, Item } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, FlatList } from 'react-native';
import StarRating from 'react-native-star-rating';

class BookAppoinment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userEntry: '',
      password: '',
      loginErrorMsg: '',
      starCount: 3.5
    }
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
        <Header style={{ backgroundColor: '#7E49C3' }}>
          <Left >
            <Icon name="arrow-back" style={{ color: '#fff' }}></Icon>
          </Left>
          <Body>
            <Title>Book Appoinment</Title>

          </Body>
          <Right />
        </Header>
        <Content style={styles.bodyContent}>

          <Grid style={{ backgroundColor: '#7E49C3', height: 200 }}>

          </Grid>

          <Card style={styles.customCard}>
            <List>
              <ListItem thumbnail noBorder>
                <Left>
                  <Thumbnail square source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 86, width: 86 }} />

                </Left>
                <Body>
                  <Text>Kumar Pratik</Text>
                  <Text note>Doing what you like will always ....</Text>
                  <Text note>*****</Text>
                </Body>

              </ListItem>

              <Grid>
                <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text style={styles.topValue}> Rs 45.. </Text>
                  <Text note style={styles.bottomValue}> Hourly Rate </Text>
                </Col>

                <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text style={styles.topValue}>24 </Text>
                  <Text note style={styles.bottomValue}> Reviews </Text>
                </Col>

                <Col style={{ backgroundColor: 'transparent', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text style={styles.topValue}>824 </Text>
                  <Text note style={styles.bottomValue}> patients </Text>
                </Col>
              </Grid>

              <Grid style={{ marginTop: 5 }}>

                <Col style={{ width: 270, }}>
                  <Button block success style={{ borderRadius: 10 }}>
                    <Text uppercase={false}>Book Appoinment</Text>

                  </Button>

                </Col>
                <Col style={{ marginLeft: 5, justifyContent: 'center' }} >

                  <Icon name="heart" style={{ color: 'red', fontSize: 25, borderColor: 'gray', borderWidth: 1, padding: 10, borderRadius: 10, marginLeft: 'auto', marginRight: 'auto' }} />


                </Col>
              </Grid>
            </List>

          </Card>

          <Card>
            <View >
              <FlatList numColumns={3}
                data={[
                  {
                    "day": 0,
                    "dayName": "Monday",
                    "start_time": "09:00:00",
                    "end_time": "09:30:00"
                  },
                  {
                    "day": 0,
                    "dayName": "Monday",
                    "start_time": "10:00:00",
                    "end_time": "10:30:00"
                  },
                  {
                    "day": 0,
                    "dayName": "Monday",
                    "start_time": "12:00:00",
                    "end_time": "13:00:00"
                  },
                  {
                    "day": 0,
                    "dayName": "Monday",
                    "start_time": "13:00:00",
                    "end_time": "14:00:00"
                  }
                ]}
                renderItem={({ item }) => <Item style={{ borderBottomWidth: 0, alignItems: 'center' }}><Col style={{ width: '33.33%', alignItems: 'center',marginLeft:8 }}><Button style={{ backgroundColor: '#775DA3', borderRadius: 5, width: 80, height: 30, margin: 5 }}><Text uppercase={false} style={{ fontFamily: 'OpenSans', fontSize: 12, color: 'white' }}>{item.dayName}</Text></Button></Col></Item>}
              />
            </View>
          </Card>


          <Grid>
            <Row>
              <Thumbnail square source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.logo} />
            </Row>

            <Row>

              <Grid style={{ borderBottomColor: 'gray', borderBottomWidth: 0.5, padding: 10 }}>
                <Col style={{ width: 180 }}>
                  <Row>
                    <Col>
                      <Text > Distance </Text>
                      <Text note > 10 km</Text>
                    </Col>
                    <Col>
                      <Text > Time </Text>
                      <Text note> 13.00 am</Text>
                    </Col>
                  </Row>
                </Col>

                <Col>

                </Col>

                <Col >
                  <Col style={{ marginLeft: 5, justifyContent: 'center' }} >

                    <Icon name="paper-plane" style={{ color: 'blue', fontSize: 20, marginLeft: 'auto', marginRight: 5, borderColor: 'gray', borderWidth: 1, padding: 10, borderRadius: 50, }} />


                  </Col>
                </Col>
              </Grid>
            </Row>

          </Grid>

          <Card transparent style={{ margin: 10 }}>
            <List>
              <ListItem avatar>
                <Left>
                  <Icon name="locate" style={{ color: '#7E49C3', fontSize: 25 }}></Icon>
                </Left>
                <Body>
                  <Text note>Voc Nagar</Text>
                  <Text note>Anna nagar-40 . .</Text>
                  <Text note>chennai</Text>
                </Body>

              </ListItem>
            </List>


            <Card style={{ margin: 10, padding: 10, borderRadius: 10 }}>

              <List>
                <Text style={styles.titleText}>Reviews</Text>

                <ListItem avatar>
                  <Left>
                    <Thumbnail square source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 40, width: 40 }} />
                  </Left>
                  <Body>
                    <Text>Kumar Pratik</Text>

                    <Text note>3hrs.</Text>
                    <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                      disabled={false}
                      maxStars={5}
                      rating={this.state.starCount}
                      selectedStar={(rating) => this.onStarRatingPress(rating)}

                    />
                    <Text note style={styles.customText}>this is a good clinic to check basic problems like fever,cold..etc..</Text>
                  </Body>

                </ListItem>

                <ListItem avatar>
                  <Left>
                    <Thumbnail square source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 40, width: 40 }} />
                  </Left>
                  <Body>
                    <Text>Kumar Pratik</Text>

                    <Text note>3hrs.</Text>
                    <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                      disabled={false}
                      maxStars={5}
                      rating={this.state.starCount}
                      selectedStar={(rating) => this.onStarRatingPress(rating)}

                    />
                    <Text note style={styles.customText}>this is a good clinic to check basic problems like fever,cold..etc..</Text>
                  </Body>

                </ListItem>
                <Button iconRight transparent block>
                  <Icon name='add' />
                  <Text style={styles.customText}>More Reviews</Text>
                </Button>
              </List>
            </Card>


          </Card>
        </Content>
      </Container>

    )
  }

}

function loginState(state) {

  return {
    user: state.user
  }
}
export default connect(loginState)(BookAppoinment)


const styles = StyleSheet.create({

  container:
  {
    backgroundColor: '#ffffff',
  },

  bodyContent: {
    // paddingLeft: 20,
    // paddingRight: 20,

  },


  logo: {
    height: 80,
    width: 80,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10
  },

  customCard: {
    borderRadius: 20,
    padding: 15,
    marginTop: -180,
    marginLeft: 20,
    marginRight: 20,

  },
  topValue: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  bottomValue:
  {
    marginLeft: 'auto',
    marginRight: 'auto'
  }

});