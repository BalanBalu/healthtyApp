import React, {Component} from 'react';
import {Row, Grid, Col} from 'react-native-easy-grid';
import {Container, View, Text, Button, Icon, Input,Card, Content,CheckBox} from 'native-base';
import { getInsuranceData, sendInsuranceInterests  } from '../../providers/insurance/insurance.action';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { toastMeassage } from '../../common';

class Insurance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    this.getInsuranceData()
  }


  getInsuranceData = async () => {
    try {
      this.setState({
        isLoading: true
      })
      let result = await getInsuranceData();
      if (result) {
      
        this.setState({
          isLoading:false,
          dataSource: result
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  insuranceDetailsUpdated = async () => {
    const { dataSource } = this.state; 
    let corporateData = this.props.profile.corporateData;
    const loggedInEmployeeData = corporateData.find(ele => ele.relationship === 'EMPLOYEE')
    let atLeastSelectedOne = false;
    dataSource.forEach(async (insuranceData) => {
        if (insuranceData.isSelect) {
            atLeastSelectedOne = true;
            const data = {
              "contactNo": loggedInEmployeeData.mobile,
              "firstName": loggedInEmployeeData.firstName,
              "lastName": loggedInEmployeeData.lastName,
              "email": loggedInEmployeeData.emailId,
              "status": insuranceData.status,
              "createdBy": loggedInEmployeeData.firstName,
              "updatedBy": loggedInEmployeeData.firstName,
              "detail": insuranceData.title
            }
           const result = await sendInsuranceInterests(data);
        }
    });
    toastMeassage(atLeastSelectedOne ? 'Your Request has sent Successfully, our Support team would touch with you shortly' : 'Please select at least one to continue',atLeastSelectedOne ? 'success' : 'warning', 3000)
  }
  FlatListItemSeparator = () => <View style={styles.line} />;
  
  renderItem = data => (
    <TouchableOpacity
      onPress={() => this.selectItem(data)}>
        <Card style={[styles.list, data.item.selectedClass]}>
          <Row>
            <Col size={9}>
            <Text style={styles.cardText1}>{data.item.title}</Text>
            <Text style={styles.cardText2}>{data.item.description}</Text>
            </Col>
            <Col size={1}>
            <CheckBox style={{ borderRadius: 5 }}
                checked={data.item.isSelect}
                onPress={() => this.selectItem(data)}
              />
            </Col>
          </Row>
          {/* <Text style={styles.cardText3}>KNOW MORE</Text> */}
      </Card>
    </TouchableOpacity>
  );

  selectItem = data => {

    data.item.isSelect = !data.item.isSelect;
    data.item.selectedClass = data.item.isSelect
      ? styles.selected 
      : styles.list;
      
      const index = this.state.dataSource.findIndex(
        item => data.item._id === item._id,
      );
      this.state.dataSource[index] = data.item;
      this.setState({
        dataSource: this.state.dataSource
      });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color="#7E49C3"
            style={{marginTop: 100}}
          />
        </View>
      );
    }
    return (
      <Container >
        <View style={{flex:1}}>
        <Grid >
          <Row style={styles.SearchRow}>
            <Col size={0.5} style={styles.SearchStyle}>
              <Icon
                name="ios-search"
                style={{color: '#fff', fontSize: 20, padding: 2}}
              />
            </Col>
            <Col size={3.5} style={{justifyContent: 'center'}}>
              <Input
                onFocus={() => {
                  this.props.navigation.navigate('RenderSuggestionList');
                }}
                placeholder="Search Insurance Policies..."
                style={styles.inputfield}
                placeholderTextColor="#909090"
                editable={true}
                underlineColorAndroid="transparent"
              />
            </Col>
          </Row>
            <View style={{ marginTop: 20,}}>
              <FlatList
                style={{
                  backgroundColor: '#fff',
                }}
                padding={15}
                data={this.state.dataSource}
                ItemSeparatorComponent={this.FlatListItemSeparator}
                keyExtractor={item => item._id.toString()}
                renderItem={item => this.renderItem(item)}
              />
                </View>
                </Grid>
              <View style={{position: 'absolute',left: 0, right: 0, bottom: 25, justifyContent: 'center', alignItems: 'center'}}>
              <Button style={styles.Button} onPress={this.insuranceDetailsUpdated}>
                <Text style={styles.buttonText}>Send Interests</Text>
              </Button>
              </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    elevation: 8,
    marginTop: 4,
    height: 120,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginLeft:5,
    marginRight:5
  },
  selected: {
    elevation: 8,
    marginTop: 10,
    height: 120,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 20,
    padding: 15,
    marginLeft: 5,
    marginRight: 5,
    borderColor: '#7E49C3',
  },
  cardText1: {
    color: '#000',
    fontSize: 18,
  },
  cardText2: {
    color: 'grey',
    fontSize: 14,
    marginTop:5
  },
  cardText3: {
    color: '#7E49C3',
    fontSize: 14,
    fontWeight: 'bold',
  },
  Button: {
    marginTop: 20,
    backgroundColor: '#7E49C3',
    // marginLeft: 90,
    // marginRight: 90,
    // marginBottom: 30,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight:'bold',
    fontSize:14
  },
  line: {
    marginTop: 8,
    height: 0.5,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  SearchRow: {
    backgroundColor: 'white',
    borderColor: '#AFAFAF',
    borderWidth: 0.5,
    height: 50,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 15,
    borderRadius: 10,
  },
  insuranceCard: {
    backgroundColor: '#000',
    borderColor: '#AFAFAF',
  },
  searchBar: {
    marginTop: 0,
  },
  SearchStyle: {
    backgroundColor: '#7E49C3',
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightColor: '#000',
    borderRightWidth: 0.5,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
});

function homeState(state) {
  return {
      profile: state.profile,
  }
}
export default connect(homeState)(Insurance)

// ***
