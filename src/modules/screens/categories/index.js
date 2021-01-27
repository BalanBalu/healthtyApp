import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Left, Right, Thumbnail, Body, Icon, locations, Input } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, FlatList, AsyncStorage } from 'react-native';
import { catagries } from '../../providers/catagries/catagries.actions';
import { toDataUrl } from '../../../setup/helpers';
import { MAX_DISTANCE_TO_COVER, SERVICE_TYPES } from '../../../setup/config';
import FastImage from 'react-native-fast-image'
import CheckLocationWarning from '../Home/LocationWarning';


class Categories extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      categoriesMain: []
    }
  }

  componentDidMount() {
    this.getCatagries();
  }
  getCatagries = async () => {
    try {
      let result = await catagries('services=0');
      if (result.success) {
        this.setState({ data: result.data, categoriesMain: result.data })
        for (let i = 0; i < result.data.length; i++) {
          const item = result.data[i];
          imageURL = item.imageBaseURL + item.category_id + '.png';
          base64ImageDataRes = await toDataUrl(imageURL)
          result.data[i].base64ImageData = base64ImageDataRes;
          this.setState({ categoriesMain: result.data })
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
  }
  navigate = (categoryName, category_id) => {
    CheckLocationWarning.checkLocationWarning(this.navigateToCategorySearch.bind(this), [categoryName, category_id]);
  }

  navigateToCategorySearch(categoryName, category_id) {
    

  
    const { bookappointment: { locationCordinates } } = this.props;

    let fromNavigation = this.props.navigation.getParam('fromNavigation') || null


    if (fromNavigation === "HOSPITAl") {

      this.props.navigation.navigate("HospitalList", {   // New Enhancement Router path
        category_id: category_id
      })
    }
    else if (fromNavigation === SERVICE_TYPES.HOME_HEALTHCARE) {
      let userAddressInfo = this.props.navigation.getParam('userAddressInfo') || null;
      const pinCode = userAddressInfo && userAddressInfo.address && userAddressInfo.address.pin_code;
      const reqParamDataObj = {
        categoryName,
        categoryId: category_id
      }
      if (pinCode) {
        reqParamDataObj.userAddressInfo = userAddressInfo;
        reqParamDataObj.pinCode = pinCode
      }
      this.props.navigation.navigate("Home Health Care", reqParamDataObj);
    } else {
      this.props.navigation.navigate("Doctor Search List", {   // New Enhancement Router path
        inputKeywordFromSearch: categoryName,
        locationDataFromSearch: {
          type: 'geo',
          "coordinates": locationCordinates,
          maxDistance: MAX_DISTANCE_TO_COVER
        }
      })
    }
    // let serachInputvalues = [{
    //   type: 'category',
    //   value: categoryName
    // },
    // {
    //   type: 'geo',
    //   value: {
    //       coordinates: locationCordinates,
    //       maxDistance: MAX_DISTANCE_TO_COVER
    //   }
    // }]
    // this.props.navigation.navigate('Doctor List', { resultData: serachInputvalues })
  }

  filterCategories(searchValue) {
   
    const { categoriesMain } = this.state;
    if (!searchValue) {
      this.setState({ searchValue, data: categoriesMain });
    } else {
      const filteredCategories = categoriesMain.filter(ele =>
        ele.category_name.toLowerCase().search(searchValue.toLowerCase()) !== -1
      );
      this.setState({ searchValue, data: filteredCategories })
    }
  }


  renderStickeyHeader() {
    return (
      <View style={{ width: '100%' }} >
        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 10, marginTop: 10 }}>Search Doctors by their specialism</Text>
        <Row style={styles.SearchRow}>

          <Col size={9.1} style={{ justifyContent: 'center', }}>
            <Input
              placeholder="Specialism and Categories"
              style={styles.inputfield}
              placeholderTextColor="#e2e2e2"
              keyboardType={'email-address'}
              onChangeText={searchValue => this.filterCategories(searchValue)}
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
      </View>
    )
  }
  render() {
    const { user: { isLoading } } = this.props;
    const { data } = this.state;


    return (
      <Container style={styles.container}>
        <Content style={styles.bodyContent}>
          <View style={{ marginBottom: 10 }}>
            <FlatList horizontal={false} numColumns={3}
              data={this.state.data}
              extraData={this.state}
              ListHeaderComponent={this.renderStickeyHeader()}
              renderItem={({ item, index }) =>
                <Col style={styles.mainCol}>
                  <TouchableOpacity onPress={() => this.navigate(item.category_name, item.category_id)}
                    style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: 5, paddingBottom: 5 }}>
                    <FastImage
                      source={{ uri: item.imageBaseURL + item.category_id + '.png' }}
                      style={{
                        width: 60, height: 60, alignItems: 'center'
                      }}
                    />
                    <Text style={{
                      fontSize: 12,
                      textAlign: 'center',
                      fontWeight: '200',
                      marginTop: 5,

                      paddingLeft: 5,
                      paddingRight: 5,
                      paddingTop: 1,
                      paddingBottom: 1
                    }}>{item.category_name}</Text>
                  </TouchableOpacity>
                </Col>
              }
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </Content>
      </Container>

    )
  }

}

function appoinmentsState(state) {

  return {
    user: state.user,
    bookappointment: state.bookappointment
  }
}
export default connect(appoinmentsState)(Categories)


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