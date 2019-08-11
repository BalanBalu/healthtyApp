import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Left, Right, Thumbnail, Body, Icon, locations } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, FlatList } from 'react-native';
import { catagries } from '../../providers/catagries/catagries.actions';


class Categories extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.navigation.state.params.data,
    }
  }
  componentDidMount() {
    console.log(' this.state.data' + JSON.stringify(this.state.data));
  }

  navigateToCategorySearch(categoryName) {
    console.log(categoryName);
    let serachInputvalues = [{
      type: 'category',
      value: categoryName

    }]
    this.props.navigation.navigate('Doctor List', { resultData: serachInputvalues })
  }

  render() {
    const { user: { isLoading } } = this.props;
    return (
      <Container style={styles.container}>
        <Content style={styles.bodyContent}>
          <FlatList horizontal={false} numColumns={3}
            data={this.state.data}
            extraData={this.state}
            renderItem={({ item, index }) =>
              <Grid style={{ marginTop: 10, justifyContent: 'center', padding: 5 }}>
                <Item>
                  {isLoading ? <Spinner color='blue' /> : null}
                  <TouchableOpacity onPress={() => this.navigateToCategorySearch(item.category_name)}>

                    <Col>
                      <LinearGradient
                        colors={['#7357A2', '#62BFE4']} style={{
                          flex: 1,

                          borderRadius: 10,
                          padding: 6
                        }}>
                        <Image
                          source={{ uri: item.imageBaseURL + '/' + item.category_id + '.png' }} style={styles.customImage}
                        //  source={{ uri: 'http://pluspng.com/img-png/orthopedics-png--350.png' }} style={styles.customImage}
                        />
                      </LinearGradient>

                      <Text style={styles.titleText}>{item.category_name}</Text>

                    </Col>
                  </TouchableOpacity>
                </Item>
              </Grid>
            }
            keyExtractor={(item, index) => index.toString()}
          />
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
    height: 100,
    width: 100,
    margin: 10,
    alignItems: 'center'
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