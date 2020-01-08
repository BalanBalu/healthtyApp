import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Left, Right, Thumbnail, Body, Icon, locations, Input } from 'native-base';
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
      data: [],
    }
  }
  componentDidMount() {
    this.getCatagries();
  }
  getCatagries = async () => {
    try {
      let result = await catagries();
      if (result.success) {
        this.setState({ data: result.data })
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
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
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 10, marginTop: 10 }}>Search Doctors by their specialism</Text>
            <Row style={styles.SearchRow}>

              <Col size={9.1} style={{ justifyContent: 'center', }}>
                <Input
                  placeholder="Specialism and Categories"
                  style={styles.inputfield}
                  placeholderTextColor="#e2e2e2"
                  keyboardType={'email-address'}

                  // onChangeText={searchValue => this.setState({ searchValue })}

                  underlineColorAndroid="transparent"
                  blurOnSubmit={false}
                />
              </Col>
              <Col size={0.9} style={styles.SearchStyle}>
                <TouchableOpacity style={{ justifyContent: 'center' }}>
                  <Icon name="ios-search" style={{ color: 'gray', fontSize: 20, padding: 2 }} />
                </TouchableOpacity>
              </Col>

            </Row>
            <View style={{ marginTop: 5, }}>
              <FlatList horizontal={false} numColumns={3}
                data={this.state.data}
                extraData={this.state}
                renderItem={({ item, index }) =>

                  <Col style={styles.mainCol}>

                    <TouchableOpacity onPress={() => this.navigateToCategorySearch(item.category_name)}
                      style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: 5, paddingBottom: 5 }}>
                      <Image
                        source={{ uri: item.imageBaseURL + item.category_id + '.png' }}
                        style={{
                          width: 60, height: 60, alignItems: 'center'
                        }}
                      />
                      <Text style={{ fontSize: 10, textAlign: 'center', fontWeight: '200', marginTop: 5, backgroundColor: '#FDFDB3', paddingLeft: 5, paddingRight: 5, paddingTop: 1, paddingBottom: 1 }}>{item.category_name}</Text>

                    </TouchableOpacity>
                  </Col>


                  //               <Grid style={{ marginTop: 10, justifyContent: 'center', padding: 5, }}>

                  //                   {isLoading ? <Spinner color='blue' /> : null}
                  //                   <TouchableOpacity onPress={() => this.navigateToCategorySearch(item.category_name)} style={{alignItems:'center',marginBottom:5}}>

                  //                     <Col style={{width:'90%',}}>
                  //                       <LinearGradient
                  //                         colors={['#7357A2', '#62BFE4']} style={{
                  //                           flex: 1,
                  //                           borderRadius: 10,


                  //                         }}>
                  //                         <Image
                  //                           source={{ uri: item.imageBaseURL + 'white/' + item.category_id + '.png' }} style={styles.customImage}
                  //                         //  source={{ uri: 'http://pluspng.com/img-png/orthopedics-png--350.png' }} style={styles.customImage}
                  //                         />
                  //                       </LinearGradient>



                  //                     </Col>
                  //                     <Col style={{ padding: 2,
                  //     backgroundColor: '#FF9502',
                  //     borderRadius: 5,marginTop:10,justifyContent:'center',width:'90%',alignItems:'center'}}>

                  // <Text style={styles.titleText}>{item.category_name}</Text>

                  //                     </Col>

                  //                   </TouchableOpacity>

                  //               </Grid>
                }
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
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
    padding: 5,
    backgroundColor: '#F4F4F4'
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
    textAlign: 'center',
    color: 'white',
    fontFamily: 'OpenSans',

  },
  SearchRow: {
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 0.5,
    height: 35,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 5, borderRadius: 5
  },
  SearchStyle: {

    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputfield: {
    color: 'gray',
    fontFamily: 'OpenSans',
    fontSize: 12,
    padding: 5,
    paddingLeft: 10
  },
  mainCol: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: 'gray',
    borderRadius: 5,
    flexDirection: 'row',
    borderWidth: 0.1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    padding: 1,
    marginTop: 15,
    marginLeft: 11,
    marginBottom: 1, width: '29.5%', flexDirection: 'row', backgroundColor: '#fafafa',
  }
});