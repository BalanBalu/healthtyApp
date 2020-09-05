import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {ListItem} from 'native-base';

class EcardDetails extends React.Component {
  render() {
    return (
      <ScrollView>
        <ListItem />
        <View style={ecardStyles.container}>
          <Text style={ecardStyles.titleText}>E-Card Details..</Text>
        </View>
        <View style={ecardStyles.headingText}>
          <Text style={ecardStyles.customText}>
            <Icon name="info-circle" size={17} color="#7E49C3" />
            {'    '}
            Policy Details
          </Text>

          <Icon name="pencil" size={20} color="black" />
        </View>
        <ListItem style={ecardStyles.Content}>
          <View style={ecardStyles.Left}>
            <Text style={ecardStyles.Names}>Policy No: </Text>
            <Text style={ecardStyles.Names}>Member Code: </Text>
            <Text style={ecardStyles.Names}>Employee Code: </Text>
          </View>
          <View style={ecardStyles.Right}>
            <Text style={ecardStyles.Names}>783959693758385838385</Text>
            <Text style={ecardStyles.Names}>47B5C4D</Text>
            <Text style={ecardStyles.Names}>3843784</Text>
          </View>
        </ListItem>

        <View style={ecardStyles.headingText}>
          <Text style={ecardStyles.customText}>
            <Icon name="child" size={17} color="#7E49C3" />
            {'    '}
            Family Members
          </Text>
          <Icon name="pencil" size={20} color="black" />
        </View>
        <ListItem style={ecardStyles.Content}>
          <View style={ecardStyles.Left}>
            <Text style={ecardStyles.Names}>Policy No: </Text>
            <Text style={ecardStyles.Names}>Member Code: </Text>
            <Text style={ecardStyles.Names}>Member Name: </Text>
          </View>
          <View style={ecardStyles.Right}>
            <Text style={ecardStyles.Names}>783559693758385838385</Text>
            <Text style={ecardStyles.Names}>37B5C4D</Text>
            <Text style={ecardStyles.Names}>Yuvraj Singh</Text>
          </View>
        </ListItem>

        <View style={ecardStyles.headingText}>
          <Text style={ecardStyles.customText}>
            <Icon name="shield" size={17} color="#7E49C3" />
            {'    '}
            Policy Coverage Details
          </Text>
          <Icon name="pencil" size={20} color="black" />
        </View>
        <ListItem style={ecardStyles.Content}>
          <View style={ecardStyles.Left}>
            <Text style={ecardStyles.Names}>UHID: </Text>
            <Text style={ecardStyles.Names}>Policy Number: </Text>
            <Text style={ecardStyles.Names}>Overall family St: </Text>
            <Text style={ecardStyles.Names}>Overall family BSI: </Text>
            <Text style={ecardStyles.Names}>Tele-Consult Utilized Count: </Text>
          </View>
          <View style={ecardStyles.Right}>
            <Text style={ecardStyles.Names}>4574873</Text>
            <Text style={ecardStyles.Names}>783559693758385838385</Text>
            <Text style={ecardStyles.Names}>2000000 Rs</Text>
            <Text style={ecardStyles.Names}>2000000 Rs</Text>
            <Text style={ecardStyles.Names}> </Text>
          </View>
        </ListItem>
      </ScrollView>
    );
  }
}

const ecardStyles = StyleSheet.create({
  Heading: {
    fontWeight: 'bold',
    fontSize: 17,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 15,
    paddingBottom: 5,
  },

  MainHeading: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10,
  },
  Content: {
    flexDirection: 'row',
    padding: 10,
  },

  Left: {
    flex: 1,
    padding: 1,
  },

  Right: {
    flex: 1,
    padding: 1,
  },

  Names: {
    padding: 3,
    color: '#A9A9A9',
    fontSize: 13,
  },

  titleText: {
    fontSize: 15,
    padding: 5,
    margin: 10,
    backgroundColor: '#FF9500',
    borderRadius: 20,
    color: 'white',
    width: 150,
    textAlign: 'center',
    fontFamily: 'OpenSans',
    marginTop: 20,
  },

  customText1: {
    fontSize: 13,
    fontFamily: 'OpenSans',
  },

  customText: {
    fontSize: 15,
    fontFamily: 'OpenSans',
  },

  headingText: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 30,
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default EcardDetails;
