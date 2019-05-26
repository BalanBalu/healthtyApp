import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ScrollView, ProgressBar } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import StarRating from 'react-native-star-rating';
class AppointmentDetails extends Component {
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
               
                <Content style={styles.bodyContent}>
                <Grid style={{ backgroundColor: '#7E49C3', height: 100 }}>

          </Grid>

          <Card style={styles.customCard}>
            <List>
              <ListItem thumbnail noBorder>
                <Left>
                  <Thumbnail square source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 70, width: 70 }} />

                </Left>
                <Body>
                  <Text style={styles.customHead}>Kumar Pratik</Text>
                  <Text note style={styles.customText}>dentist </Text>
                  <StarRating fullStarColor='#FF9500' starSize={25}
                    disabled={false}
                    maxStars={5}
                    rating={this.state.starCount}
                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                  />
                </Body>

              </ListItem>

              <Grid>
                <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text style={styles.topValue}> Rs 450 </Text>
                  <Text note style={styles.bottomValue}> Hourly Rate </Text>
                </Col>

                <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text style={styles.topValue}>88 </Text>
                  <Text note style={styles.bottomValue}> Reviews </Text>
                </Col>

                <Col style={{ backgroundColor: 'transparent', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text style={styles.topValue}>824 </Text>
                  <Text note style={styles.bottomValue}> patients </Text>
                </Col>
              </Grid>


            </List>

          </Card>


<Card transparent style={{padding:5}}>

<Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>

<Grid style={{ margin: 5 }}>
  <Col style={{ width: '10%' }}>
    <Icon name="apps" style={styles.customIcon}></Icon>
  </Col>
  <Col style={{ width: '90%', alignItems: 'flex-start' }}>
    <Text style={styles.titlesText}>diseases</Text></Col>

</Grid>


<List>
  <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
    <Left >
    </Left>
    <Body>
      <Text style={styles.rowText}>
       Fever
 
</Text>
      <Text style={styles.rowText}>
       Headache
  
</Text>

      <Text style={styles.rowText}>
       cold
  
</Text>

    </Body>

  </ListItem>

</List>

</Card>


<Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10,marginTop:5 }}>

<Grid style={{ margin: 5 }}>
  <Col style={{ width: '10%' }}>
    <Icon name="apps" style={styles.customIcon}></Icon>
  </Col>
  <Col style={{ width: '90%', alignItems: 'flex-start' }}>
    <Text style={styles.titlesText}>day of the appoinments</Text></Col>

</Grid>


<List>
  <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
    <Left >
    </Left>
    <Body>
      <Text style={styles.rowText}>
      startdate
 
</Text>
      <Text style={styles.rowText}>
       enddate
  
</Text>

    

    </Body>

  </ListItem>

</List>

</Card>

</Card>
                </Content>
            </Container>

        )
    }

}

export default AppointmentDetails


const styles = StyleSheet.create({

    container:
    {
      backgroundColor: '#ffffff',
    },
  
    bodyContent: {
      margin: 0
  
    },
  
    customHead:
    {
      fontFamily: 'OpenSans',
    },
    customText:
    {
  
      fontFamily: 'OpenSans',
      color: '#000',
      fontSize: 14,
  
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
      padding: 10,
      marginTop: -100,
      marginLeft: 20,
      marginRight: 20,
      fontFamily: 'OpenSans',
  
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
        fontFamily: 'OpenSans',
        color: '#000',
        fontSize: 14,
        margin: 5
      }

});