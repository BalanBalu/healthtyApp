
import {  StyleSheet } from 'react-native';
import {primaryColor} from '../../../setup/config';


export default  styles = StyleSheet.create({
    inputMainView: {
      backgroundColor: '#fff',
      padding: 5,
      paddingBottom: 10,
      height: 40,
      borderWidth: 1,
      borderColor: 'gray',
      marginRight: 15,
      marginLeft: 15,
      marginTop: 20,
      borderRadius: 5
    },
    inputItem: {
      borderBottomWidth: 0,
      backgroundColor: '#fff',
      height: 30,
      borderRadius: 5,
    },
    flatlistMainView: {
     
   
    },
    gradientStyle: {
      height: 65,
      marginTop: 10,
      borderRadius: 10,
      justifyContent: 'center'
    },
    companyName: {
      fontFamily: 'OpenSans',
      fontSize: 15
    },
    continueButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: primaryColor,
      padding: 9,
      borderRadius: 20,
      marginTop: 20,
      marginRight: 10,
      marginLeft: 10,
      marginBottom: 10,
    },
    continueButtonWithGrayClr: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#787878',
      padding: 9,
      borderRadius: 20,
      marginTop: 20,
      marginRight: 10,
      marginLeft: 10,
      marginBottom: 10,
    },
    continueText: {
      fontFamily: 'OpenSans',
      fontSize: 15,
      fontWeight: '700',
      color: '#fff'
    },
    gradientStyle: {
      marginTop: 10,
      borderRadius: 10,
      justifyContent: 'center',
      marginRight: 15,
      marginLeft: 15,
      padding: 10
    },
    subHeadingStyle: {
      fontSize: 13,
      marginTop: 5,
      fontFamily: 'OpenSans'
    },
    subHeadingData: {
      fontSize: 12,
      color: 'gray',
      marginTop: 5,
      fontFamily: 'OpenSans'
    },
    cardStyle: {
      marginTop: 15,
      padding: 10,
      marginRight: 15,
      marginLeft: 15,
      borderRadius: 5
    },
    enableSearchIcon4Hospital: {
      backgroundColor: '#7E49C3',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomRightRadius:5,
      borderTopRightRadius:5
  },
  disableSearchIcon4Hospital: {
      backgroundColor: 'gray',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomRightRadius:5,
      borderTopRightRadius:5
  }
  })