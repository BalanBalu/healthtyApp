import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Left, Right, Thumbnail, Body, Icon, locations, Input } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux'
import { Col, Row, Grid } from 'react-native-easy-grid';
import { toDataUrl } from '../../../../setup/helpers';
import { StyleSheet, Image, TouchableOpacity, View, FlatList } from 'react-native';
import { getLabTestCateries } from '../../../providers/lab/lab.action'
import { MAX_DISTANCE_TO_COVER } from '../../../../setup/config'


class LabCategories extends Component {
  constructor(props) {
    super(props)
    this.state = {
      labData: [],
      categoriesMain: []
    }
  }
  async componentDidMount() {
    this.getLabCategories();
  }
  getLabCategories = async () => {
    try {
      const { bookappointment: { locationCordinates } } = this.props;
      console.log("locationCordinates", locationCordinates)
      locationData = {
        "coordinates": locationCordinates,
        "maxDistance": MAX_DISTANCE_TO_COVER
      }
      let result = await getLabTestCateries(JSON.stringify(locationData));
      console.log("result", result)
      if (result.success) {
        this.setState({ labData: result.data })
        for (let i = 0; i < result.data.length; i++) {
          const value = result.data[i];
          const imageURL = value.lab_test_category_info.category_image_name_url + value.lab_test_category_info.category_image_name;
          console.log("imageURL", imageURL)

          const finalImageUrl = await toDataUrl(imageURL)
          result.data[i].baseImageURL = finalImageUrl;
          this.setState({ labData: result.data })
          console.log("labData", this.state.labData)

        }
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  renderStickeyHeader() {
    return (
      <View style={{ width: '100%' }} >
        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 10, marginTop: 10 }}>Search Labs by categories</Text>
        <Row style={styles.SearchRow}>

          <Col size={9.1} style={{ justifyContent: 'center', }}>
            <Input
              placeholder="Categories"
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
    const data = [{ checkup: 'full body checkup', initalprice: 2500, finalprice: 1500 },
    { checkup: 'Diabetes Test', initalprice: 2500, finalprice: 1500 },
    { checkup: 'Fever Test', initalprice: 1500, finalprice: 1000 },
    { checkup: 'Arthristis', initalprice: 500, finalprice: 400 },
    { checkup: 'Allergy profile', initalprice: 200, finalprice: 100 },
    { checkup: 'Healthy men', initalprice: 250, finalprice: 150 }]
    return (
      <Container style={styles.container}>
        <Content style={styles.bodyContent}>

          <View style={{ marginBottom: 10 }}>
            <FlatList horizontal={false} numColumns={3}
              data={this.state.labData}
              // extraData={this.state}
              ListHeaderComponent={this.renderStickeyHeader()}
              renderItem={({ item, index }) =>
                <Col style={styles.mainCol}>
                  <TouchableOpacity
                    style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: 5, paddingBottom: 5 }}>
                   
                    <Image
                      source={{ uri: item.baseImageURL }}
                      style={{
                        width: 60, height: 60, alignItems: 'center'
                      }}
                    />
                    <Text style={styles.mainText}>{item.lab_test_category_info.category_name}</Text>
                    <Text style={styles.subText}>package starts from</Text>
                    <Row>
                      <Text style={styles.rsText}>₹ {item.minPriceWithoutOffer}</Text>
                      <Text style={styles.finalRs}>₹ {Math.round(item.minPriceWithOffer)}</Text>
                    </Row>
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
function labCategoriesState(state) {

  return {
    bookappointment: state.bookappointment,
  }
}
export default connect(labCategoriesState)(LabCategories)


const styles = StyleSheet.create({

  container:
  {
    backgroundColor: '#F4F4F4'
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
  },
  mainText: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '200',
    marginTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 1,
    color: '#7F49C3'
  },
  subText: {
    fontSize: 8,
    textAlign: 'center',
    fontWeight: '200',
    paddingTop: 1,
  },
  rsText: {
    fontSize: 8,
    textAlign: 'center',
    fontWeight: '200',
    paddingTop: 1,
    color: '#ff4e42',
    marginTop: 2,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: '#ff4e42'
  },
  finalRs: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '200',
    paddingTop: 1,
    marginLeft: 5,
    color: '#8dc63f'
  }
});