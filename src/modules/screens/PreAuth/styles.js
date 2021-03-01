
import {  StyleSheet } from 'react-native';
import {primaryColor} from '../../../setup/config';


export default  styles = StyleSheet.create(
  {
    usedAmount: {
      fontFamily: 'OpenSans',
      fontSize: 18,
      color: '#000',
      textAlign: 'center',
      fontWeight: 'bold',
      marginLeft: 5
  
    },
    linkHeader: {
      fontFamily: 'OpenSans',
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
      fontFamily: 'OpenSans',
      fontSize: 13,
      color: '#909090',
      textAlign: 'center'
    },
    nameText: {
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '700',
      color: primaryColor
    },
    policyText: {
      fontFamily: 'OpenSans',
      fontSize: 16,
      color: '#909090',
      marginTop: 5,
      textAlign: 'center'
    },
    commonText: {
      fontFamily: 'OpenSans',
      fontSize: 16,
      color: '#000'
    },
    commonBoldText: {
      fontFamily: 'OpenSans',
      fontSize: 16,
      color: '#909090'
    },
    boldText: {
      fontFamily: 'OpenSans',
      fontSize: 16,
      color: primaryColor,
      marginTop: 2,
      fontWeight: 'bold'
    }
  
  }
    
  )