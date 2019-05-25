import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Left, Right, Thumbnail, Body, Icon, locations } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View ,FlatList} from 'react-native';

class Categories extends Component {
  constructor(props) {
    super(props)
    this.state={
      data:this.props.navigation.state.params.data,
     
    }

  }


  render() {


    return (

      <Container style={styles.container}>
       
        <Content style={styles.bodyContent}>
       

        <FlatList horizontal={false} numColumns={3}
                                        data={this.state.data}
                                        extraData={this.state}
                                        renderItem = {({item, index}) =>
          <Grid>
            
              <Item style={styles.column} onPress={()=> this.props.navigation.navigate('Doctor List') }>
              <Col>
              <LinearGradient
                  colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height:100, width:100, marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={{ uri: 'http://pluspng.com/img-png/orthopedics-png--350.png' }} style={styles.customImage} />
                </LinearGradient>

                <Text style={styles.titleText}>{item.category_name}</Text>
                </Col>
               </Item>
              

          </Grid>
                                        }/>
        </Content>
      </Container>

    )
  }

}

export default Categories


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
    fontFamily: 'OpenSans'
  },

  column:
  {
    width: '15%',
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
    fontSize: 12,
    padding: 5,
    backgroundColor: '#FF9502',
    borderRadius: 20,
    color: 'white',
    width: 110,
    textAlign: 'center',
    fontFamily: 'OpenSans',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5
  },


});