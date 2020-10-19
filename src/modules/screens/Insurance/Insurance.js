import React, {Component} from 'react';
import {Row, Grid, Col} from 'react-native-easy-grid';
import {Container, View, Text, Button, Icon, Input} from 'native-base';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';

class Insurance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({loading: true});
    fetch('https://sh-qa-api.aopks.com/enquiry-list')
      .then(response => response.json())
      .then(responseJson => {
        responseJson = responseJson.map(item => {
          item.isSelect = false;
          item.selectedClass = styles.list;
          return item;
        });
        this.setState({
          loading: false,
          dataSource: responseJson,
        });
      })
      .catch(error => {
        this.setState({loading: false});
      });
  };

  FlatListItemSeparator = () => <View style={styles.line} />;

  renderItem = data => (
    <TouchableOpacity
      style={[styles.list, data.item.selectedClass]}
      onPress={() => this.selectItem(data)}>
      <Text style={styles.cardText1}> {data.item.title}</Text>
      <Text style={styles.cardText2}> {data.item.description}</Text>
      <Text style={styles.cardText3}>KNOW MORE</Text>
    </TouchableOpacity>
  );

  selectItem = data => {
    data.item.isSelect = !data.item.isSelect;
    data.item.selectedClass = data.item.isSelect
      ? styles.selected
      : styles.list;

    const index = this.state.dataSource.findIndex(
      item => data.item.id === item.id,
    );

    this.state.dataSource[index] = data.item;

    this.setState({
      dataSource: this.state.dataSource,
    });
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color="#0c9"
            style={{marginTop: 100}}
          />
        </View>
      );
    }

    return (
      <Container>
        <Grid>
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
                placeholderTextColor="#e2e2e2"
                editable={true}
                underlineColorAndroid="transparent"
              />
            </Col>
          </Row>
          <Row>
            <View>
              <FlatList
                style={{
                  backgroundColor: '#fff',
                  marginTop: 20,

                  height: 600,
                  elevation: 4,
                  borderRadius: 8,
                }}
                padding={15}
                data={this.state.dataSource}
                ItemSeparatorComponent={this.FlatListItemSeparator}
                keyExtractor={item => item._id.toString()}
                renderItem={item => this.renderItem(item)}
              />
              <Button style={styles.Button}>
                <Text style={styles.buttonText}>Send Interests</Text>
              </Button>
            </View>
          </Row>
        </Grid>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    elevation: 8,
    marginTop: 4,
    height: 200,
    marginBottom: 10,
    width: 360,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginLeft: 15,
    marginRight: 15,
  },

  selected: {
    elevation: 8,
    marginTop: 10,
    height: 200,
    marginBottom: 10,
    width: 360,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    padding: 15,
    marginLeft: 15,
    marginRight: 15,
    borderColor: '#775DA3',
  },
  cardText1: {
    color: 'black',
    fontSize: 20,
  },
  cardText2: {
    color: 'grey',
    fontSize: 14,
  },
  cardText3: {
    color: '#775DA3',
    marginTop: 105,
    fontSize: 14,
    fontWeight: 'bold',
  },
  Button: {
    marginTop: 20,
    backgroundColor: '#775DA3',
    marginLeft: 90,
    marginRight: 90,
    marginBottom: 30,
    borderRadius: 5,
  },
  buttonText: {textAlign: 'center', marginLeft: 40},
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
    backgroundColor: 'black',
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
export default Insurance;

// ***
