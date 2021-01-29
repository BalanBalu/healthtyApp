import React from 'react';
import {Container, Text, View} from 'native-base';
import {TextInput, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
// import styles from '../styles'

class PreAuth extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  HospitalDetails = () => {
    return (
      <Container style={styles.body}>
        <Text style={styles.formHeader}>
          Request For cashless hospitalisation for health insurance policy part
          c (revised)
        </Text>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.headerText}>enter hospital details</Text>
          <Text style={styles.inputLabel}>Name of the hospital</Text>
          <TextInput
            placeholder={'Enter name of the hospital'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>Hospital Location</Text>
          <TextInput
            placeholder={'Enter hospital location'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>Hospital ID</Text>
          <TextInput
            placeholder={'Enter hospital ID'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>Hospital Email ID</Text>
          <TextInput placeholder={'Enter Email ID'} style={styles.inputText} />
     <Text style={styles.inputLabel}>Rohini ID</Text>
          <TextInput placeholder={'Enter Rohini ID'} style={styles.inputText} />
          <TouchableOpacity style={styles.buttonStyle}>
            <Text
              style={{
                fontFamily: 'OpenSans',
                color: '#fff',
                fontSize: 16,
                textAlign: 'center',
                marginTop: 7,
                textTransform: 'uppercase',
              }}>
              proceed to next step
            </Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  };
  render() {
    return <this.HospitalDetails />;
  }
}

const styles = StyleSheet.create({
  /* Hospital Details styling Start */
  body: {
    backgroundColor: '#EFF3F5',
    fontFamily: 'OpenSans, sans-serif',
    display: 'flex',
  },
  buttonStyle: {
    borderColor: '#7F49C3',

    marginLeft: 40,

    marginTop: 20,
    marginBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: 41,
    width: 330,
    borderRadius: 4,
    backgroundColor: '#7F49C3',
    color: '#ffffff',
  },
  headerText: {
    textTransform: 'uppercase',
    fontWeight: '700',
    marginLeft: 40,
    color: '#3E4459',
    fontFamily: 'OpenSans, sans-serif',
    marginRight: 40,
    marginTop: 20,
  },
  formHeader: {
    color: '#7F49C3',
    fontWeight: 'bold',
    lineHeight: 30,
    fontSize: 17,
    fontFamily: 'OpenSans, sans-serif',
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: 20,
  },
  inputText: {
    height: 50,
    borderRadius: 6,
    borderColor: '#E0E1E4',
    borderWidth: 2,
    marginLeft: 40,
    backgroundColor: '#fff',
    marginRight: 40,
    paddingLeft: 18,
  },
  inputLabel: {
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 9,
    fontWeight: 'bold',
    color: '#3E4459',
    marginTop: 20,
    fontFamily: 'OpenSans, sans-serif',
  },
  /* Hospital Details End */
});
function profileState(state) {
  return {
    profile: state.profile,
  };
}
export default connect(profileState)(PreAuth);
