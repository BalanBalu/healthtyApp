import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Left, Right, Thumbnail, Body, Icon, locations } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';

class Categories extends Component {
  constructor(props) {
    super(props)

  }


  render() {


    return (

      <Container style={styles.container}>
        <Header style={{ backgroundColor: '#7E49C3' }}>
          <Left  >
            <Button Button transparent onPress={() => this.props.navigation.navigate('home')}>
              <Icon name="arrow-back" style={{ color: '#fff' }}></Icon>
            </Button>

          </Left>
          <Body>
            <Title style={{ fontFamily: 'opensans-semibold' }}>Categories</Title>

          </Body>
          <Right >

            <Button transparent onPress={() => this.props.navigation.navigate('profile')}>
              <Thumbnail style={{ height: 40, width: 40, borderColor: '#f5f5f5', borderWidth: 2, borderRadius: 50 }} source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} />
            </Button>

          </Right>
        </Header>

        <Content style={styles.bodyContent}>


          <Grid>
            <Row>
              <Col style={styles.column}>
                <LinearGradient
                  colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={{ uri: 'https://static1.squarespace.com/static/586ef2c6bf629a58a3512dfa/t/5879369c5016e1f60c105f77/1484358104031/crown-bridge-icon.png' }} style={styles.customImage} />
                </LinearGradient>

                <Text style={styles.titleText}>Dental</Text>
              </Col>

              <Col style={styles.column}>
                <LinearGradient
                  colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={{ uri: 'http://pluspng.com/img-png/orthopedics-png--350.png' }} style={styles.customImage} />
                </LinearGradient>

                <Text style={styles.titleText}>Orthology</Text>
              </Col>



              <Col style={styles.column}>
                <LinearGradient
                  colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={{ uri: 'https://omionline.in/omi_app/images/images/Neurologist.png' }} style={styles.customImage} />
                </LinearGradient>

                <Text style={styles.titleText}>Neurology</Text>
              </Col>


            </Row>

          </Grid>


          <Grid style={{marginTop:10}}>
            <Row>
              <Col style={styles.column}>
                <LinearGradient
                  colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={{ uri: 'https://static1.squarespace.com/static/586ef2c6bf629a58a3512dfa/t/5879369c5016e1f60c105f77/1484358104031/crown-bridge-icon.png' }} style={styles.customImage} />
                </LinearGradient>

                <Text style={styles.titleText}>Dental</Text>
              </Col>

              <Col style={styles.column}>
                <LinearGradient
                  colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={{ uri: 'http://pluspng.com/img-png/orthopedics-png--350.png' }} style={styles.customImage} />
                </LinearGradient>

                <Text style={styles.titleText}>Orthology</Text>
              </Col>



              <Col style={styles.column}>
                <LinearGradient
                  colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={{ uri: 'https://omionline.in/omi_app/images/images/Neurologist.png' }} style={styles.customImage} />
                </LinearGradient>

                <Text style={styles.titleText}>Neurology</Text>
              </Col>


            </Row>

          </Grid>



          <Grid style={{marginTop:10}}>
            <Row>
              <Col style={styles.column}>
                <LinearGradient
                  colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={{ uri: 'https://static1.squarespace.com/static/586ef2c6bf629a58a3512dfa/t/5879369c5016e1f60c105f77/1484358104031/crown-bridge-icon.png' }} style={styles.customImage} />
                </LinearGradient>

                <Text style={styles.titleText}>Dental</Text>
              </Col>

              <Col style={styles.column}>
                <LinearGradient
                  colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={{ uri: 'http://pluspng.com/img-png/orthopedics-png--350.png' }} style={styles.customImage} />
                </LinearGradient>

                <Text style={styles.titleText}>Orthology</Text>
              </Col>



              <Col style={styles.column}>
                <LinearGradient
                  colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={{ uri: 'https://omionline.in/omi_app/images/images/Neurologist.png' }} style={styles.customImage} />
                </LinearGradient>

                <Text style={styles.titleText}>Neurology</Text>
              </Col>


            </Row>

          </Grid>




          <Grid style={{marginTop:10}}>
            <Row>
              <Col style={styles.column}>
                <LinearGradient
                  colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={{ uri: 'https://static1.squarespace.com/static/586ef2c6bf629a58a3512dfa/t/5879369c5016e1f60c105f77/1484358104031/crown-bridge-icon.png' }} style={styles.customImage} />
                </LinearGradient>

                <Text style={styles.titleText}>Dental</Text>
              </Col>

              <Col style={styles.column}>
                <LinearGradient
                  colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={{ uri: 'http://pluspng.com/img-png/orthopedics-png--350.png' }} style={styles.customImage} />
                </LinearGradient>

                <Text style={styles.titleText}>Orthology</Text>
              </Col>



              <Col style={styles.column}>
                <LinearGradient
                  colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={{ uri: 'https://omionline.in/omi_app/images/images/Neurologist.png' }} style={styles.customImage} />
                </LinearGradient>

                <Text style={styles.titleText}>Neurology</Text>
              </Col>


            </Row>

          </Grid>
          <Grid style={{marginTop:10}}>
            <Row>
              <Col style={styles.column}>
                <LinearGradient
                  colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={{ uri: 'https://static1.squarespace.com/static/586ef2c6bf629a58a3512dfa/t/5879369c5016e1f60c105f77/1484358104031/crown-bridge-icon.png' }} style={styles.customImage} />
                </LinearGradient>

                <Text style={styles.titleText}>Dental</Text>
              </Col>

              <Col style={styles.column}>
                <LinearGradient
                  colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={{ uri: 'http://pluspng.com/img-png/orthopedics-png--350.png' }} style={styles.customImage} />
                </LinearGradient>

                <Text style={styles.titleText}>Orthology</Text>
              </Col>



              <Col style={styles.column}>
                <LinearGradient
                  colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={{ uri: 'https://omionline.in/omi_app/images/images/Neurologist.png' }} style={styles.customImage} />
                </LinearGradient>

                <Text style={styles.titleText}>Neurology</Text>
              </Col>


            </Row>

          </Grid>

        </Content>
      </Container>

    )
  }

}

function appoinmentsState(state) {

  return {
    user: state.user
  }
}
export default connect(appoinmentsState, { login, messageShow, messageHide })(Categories)


const styles = StyleSheet.create({

  container:
  {
    backgroundColor: '#ffffff',
  },

  bodyContent: {
    padding: 5
  },
  textcenter: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'opensans-regular'
  },

  column:
  {
    width: '33.33%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 10,
    margin: 10,
    padding: 6
  },


  customImage: {
    height: 70,
    width: 70,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto'
  },

  titleText: {
    fontSize: 14,
    padding: 5,
    backgroundColor: '#FF9502',
    borderRadius: 20,
    color: 'white',
    width: '95%',
    textAlign: 'center',
    fontFamily: 'opensans-regular',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5
  },


});