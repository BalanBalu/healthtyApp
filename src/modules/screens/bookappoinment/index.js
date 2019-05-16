import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Card, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ScrollView, Item } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import StarRating from 'react-native-star-rating';
class bookappoinment extends Component {
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
                renderItem={({ item }) => <Item style={{ borderBottomWidth: 0, alignItems: 'center' }}><Col style={{ width: '33.33%', alignItems: 'center', marginLeft: 8 }}><Button style={{ backgroundColor: '#775DA3', borderRadius: 5, width: 80, height: 30, margin: 5 }}><Text uppercase={false} style={{ fontFamily: 'opensans-regular', fontSize: 12, color: 'white' }}>{item.dayName}</Text></Button></Col></Item>}
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

          <Card transparent style={{ margin: 20 ,backgroundColor:'#ecf0f1'}}>
          <Card>
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

          </Card>
           

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



            <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>

              <Text style={styles.subtitlesText}>Professional Statement</Text>
              <List>
                <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: 10 }}>
                  <Left >

                  </Left>
                  <Body>

                    <Text style={styles.customText}>
                      The medical doctor CV example below is designed to show you how to properly format and organize your CV, as well as what information to include, such as your hobbies and interests, work history, and a professional summary. Once you’ve familiarized yourself with the structure, you can draft your own tailored CV.
                  </Text>

                  </Body>

                </ListItem>

              </List>


            </Card>



            <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>


              <Grid>
                <Col style={{ width: '10%' }}>
                  <Icon name="apps" style={styles.customIcon}></Icon>
                </Col>
                <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                  <Text style={styles.titlesText}>Service</Text></Col>

              </Grid>


              <List>
                <ListItem avatar noBorder style={{ borderRightWidth: 8, borderColor: "#8C4F2B", marginBottom: 10, marginRight: 15 }}>
                  <Left >
                  </Left>
                  <Body>
                    <Text style={styles.rowText}>
                      psychiotherephy

 </Text>
                    <Text style={styles.rowText}>
                      psychiotherephy

 </Text>

                    <Text style={styles.rowText}>
                      psychiotherephy

 </Text>

                  </Body>

                </ListItem>

              </List>

            </Card>




            <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>


              <Grid style={{ margin: 5 }}>
                <Col style={{ width: '10%' }}>
                  <Icon name="apps" style={styles.customIcon}></Icon>
                </Col>
                <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                  <Text style={styles.titlesText}>Specialization</Text></Col>

              </Grid>


              <List>
                <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
                  <Left >
                  </Left>
                  <Body>
                    <Text style={styles.rowText}>
                      psychiotherephy

 </Text>
                    <Text style={styles.rowText}>
                      psychiotherephy

 </Text>

                    <Text style={styles.rowText}>
                      psychiotherephy

 </Text>

                  </Body>

                </ListItem>

              </List>

            </Card>




            <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>


              <Grid>
                <Col style={{ width: '10%' }}>
                  <Icon name="apps" style={styles.customIcon}></Icon>
                </Col>
                <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                  <Text style={styles.titlesText}>Hospital Network</Text></Col>

              </Grid>


              <List>
                <ListItem avatar noBorder style={{ borderRightWidth: 8, borderColor: "#8C4F2B", marginBottom: 10, marginRight: 15 }}>
                  <Left >
                  </Left>
                  <Body>

                    <Grid>
                      <Col style={{ width: '40%' }}>
                        <Text style={styles.rowText}>
                          ADS Hospitals

 </Text>
                      </Col>
                      <Col style={{ width: '30%' }}>
                      </Col>
                      <Col style={{ width: '30%' }}>

                        <Text style={styles.rowText}>
                          Mon-Sat

 </Text>
                      </Col>
                    </Grid>

                    <Grid >
                      <Col style={{ width: '90%', alignItems: 'center', borderColor: 'gray', borderWidth: 1, padding: 5, borderRadius: 5 }}>
                        <Text style={styles.rowText}>
                          81/3 middle street</Text>

                        <Text style={styles.rowText}>
                          nehru street</Text>


                        <Text style={styles.rowText}>
                          Annanagar-40</Text>
                      </Col>
                      <Col style={{ width: '10%' }}></Col>
                    </Grid>

                    <Grid>
                      <Col style={{ width: '40%' }}>
                        <Text style={styles.rowText}>
                          ADS Hospitals

 </Text>
                      </Col>
                      <Col style={{ width: '30%' }}>
                      </Col>
                      <Col style={{ width: '30%' }}>

                        <Text style={styles.rowText}>
                          Mon-Sat

 </Text>
                      </Col>
                    </Grid>

                    <Grid>
                      <Col style={{ width: '90%', alignItems: 'center', borderColor: 'gray', borderWidth: 1, padding: 5, borderRadius: 5 }}>
                        <Text style={styles.rowText}>
                          81/3 middle street</Text>

                        <Text style={styles.rowText}>
                          nehru street</Text>


                        <Text style={styles.rowText}>
                          Annanagar-40</Text>
                      </Col>
                      <Col style={{ width: '10%' }}></Col>
                    </Grid>

                  </Body>

                </ListItem>

              </List>

            </Card>


            <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>

              <Grid style={{ margin: 5 }}>
                <Col style={{ width: '10%' }}>
                  <Icon name="apps" style={styles.customIcon}></Icon>
                </Col>
                <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                  <Text style={styles.titlesText}>Languages speaks By Doctor</Text></Col>

              </Grid>


              <List>
                <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
                  <Left >
                  </Left>
                  <Body>
                    <Text style={styles.rowText}>
                      Tamil
               
</Text>
                    <Text style={styles.rowText}>
                      English
                
</Text>

                    <Text style={styles.rowText}>
                      French
                
</Text>

                  </Body>

                </ListItem>

              </List>

            </Card>


            <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>


              <Grid>
                <Col style={{ width: '10%' }}>
                  <Icon name="apps" style={styles.customIcon}></Icon>
                </Col>
                <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                  <Text style={styles.titlesText}>Awards</Text></Col>

              </Grid>


              <List>
                <ListItem avatar noBorder style={{ borderRightWidth: 8, borderColor: "#8C4F2B", marginBottom: 10, marginRight: 15 }}>
                  <Left >
                  </Left>
                  <Body>
                    <Text style={styles.rowText}>
                     Awards1
 </Text>
                    <Text style={styles.rowText}>
                    Awards2
 </Text>

                  

                  </Body>

                </ListItem>

              </List>

            </Card>


            <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>


<Grid style={{ margin: 5 }}>
  <Col style={{ width: '10%' }}>
    <Icon name="apps" style={styles.customIcon}></Icon>
  </Col>
  <Col style={{ width: '90%', alignItems: 'flex-start' }}>
    <Text style={styles.titlesText}>Board Certifications</Text></Col>

</Grid>


<List>
  <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
    <Left >
    </Left>
    <Body>
      <Text style={styles.rowText}>
      certificate1
 
</Text>
      <Text style={styles.rowText}>
     certificate2
  
</Text>

     

    </Body>

  </ListItem>

</List>

</Card>

<Button block success style={{ borderRadius: 10 }}>
                    <Text uppercase={false}>Confirm Appoinment</Text>

                  </Button>


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
export default connect(loginState, { login, messageShow, messageHide })(bookappoinment)


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
  },
  customText:
  {

    fontFamily: 'opensans-regular',
    color: '#000',
    fontSize: 14,

  },
  subtitlesText: {
    fontSize: 15,
    margin: 10,
    color: '#F2889B',
    fontFamily: 'opensans-semibold',

  },
  titlesText: {
    fontSize: 15,
    color: '#F2889B',
    fontFamily: 'opensans-semibold',

  },
  customIcon:
  {
    height: 30,
    width: 30,
    backgroundColor: 'gray',
    color: 'white',
    borderRadius: 8,
    fontSize: 19,
    paddingLeft: 8,
    paddingRight: 6,
    paddingTop: 6,
    paddingBottom: 6

  },
  rowText:
  {
    fontFamily: 'opensans-regular',
    color: '#000',
    fontSize: 14,
    margin: 5
  }

});