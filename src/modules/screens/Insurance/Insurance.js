import React, {Component} from 'react';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {Container, Icon, Input, Card, View, Text} from 'native-base';
import {StyleSheet} from 'react-native';
import Main from './Main'
import SelectionListHeader from './SelectionListHeader';

class Insurance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,
      checked: false
    };
  }

  componentDidMount() {
    this.setState({isLoading: true});
  }

  render() {
    return (
      <Container>
        <Grid className='searchBar' style={styles.searchBar}
        >
          
          <Row>
            
        <Main />
        
        </Row>
        {/* <Row style={styles.SearchRow}>
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
        </Row> */}
        
        
        
       
        </Grid>
      </Container>
    );
  }
}

export default Insurance;

const styles = StyleSheet.create({
  SearchRow: {
    backgroundColor: 'white',
    borderColor: '#AFAFAF',
    borderWidth: 0.5,
    height: 50,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 5,
    borderRadius: 10,
  },
  insuranceCard: {
    backgroundColor: 'black',
    borderColor: '#AFAFAF',
  },
  searchBar: {
    marginTop: 0
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
// ***
