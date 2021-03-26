
import {  StyleSheet } from 'react-native';
import {primaryColor} from '../../../setup/config';


export default  styles = StyleSheet.create(
  {
    usedAmount: {
      fontFamily: 'opensans-bold',
      fontSize: 18,
      color: '#000',
      textAlign: 'center',
      marginLeft: 5
  
    },
    linkHeader: {
      fontFamily: 'Roboto',
      fontSize: 15,
      textDecorationColor: primaryColor,
      textDecorationLine: 'underline',
      color: primaryColor
    },
    ecardButton: {
      marginTop: 15,
      alignItems: 'center',
      justifyContent: 'center'
    },
  
    totalAmount: {
      fontFamily: 'Roboto',
      fontSize: 13,
      color: '#909090',
      textAlign: 'center'
    },
    nameText: {
      textAlign: 'center',
      fontSize: 16,
      color: primaryColor,
      fontFamily:'opensans-bold'
    },
    policyText: {
      fontFamily: 'Roboto',
      fontSize: 16,
      color: '#909090',
      marginTop: 5,
      textAlign: 'center'
    },
    commonText: {
      fontFamily: 'Roboto',
      fontSize: 16,
      color: '#000'
    },
    commonBoldText: {
      fontFamily: 'Roboto',
      fontSize: 16,
      color: '#909090'
    },
    boldText: {
      fontFamily: 'opensans-bold',
      fontSize: 16,
      color: primaryColor,
      marginTop: 2,
    }
  
  }
    
  )