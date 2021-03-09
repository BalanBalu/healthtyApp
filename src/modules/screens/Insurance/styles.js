import {  StyleSheet } from 'react-native';
import {primaryColor} from '../../../setup/config';

export default  styles = StyleSheet.create({
    list: {
        elevation: 8,
        marginTop: 4,
        height: 120,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginLeft: 5,
        marginRight: 5
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
        borderColor: primaryColor,
      },
      cardText1: {
        color: '#000',
        fontSize: 18,
      },
      cardText2: {
        color: 'grey',
        fontSize: 14,
        marginTop: 8
      },
      cardText3: {
        color: primaryColor,
        fontSize: 14,
        fontWeight: 'bold',
      },
      Button: {
        marginTop: 20,
        backgroundColor: primaryColor,
        // marginLeft: 90,
        // marginRight: 90,
        // marginBottom: 30,
        borderRadius: 5,
      },
      buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15
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
        backgroundColor: primaryColor,
        width: '85%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRightColor: '#000',
        borderRightWidth: 0.5,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
      },
      mainView: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
      },
      addInsuranceButton: {
        borderColor: '#128283',
        borderWidth: 1,
        flexDirection: 'row',
        borderRadius: 5,
        padding: 5
      },
      addInsuranceText: {
        fontFamily: 'OpenSans',
        fontSize: 13,
        color: '#128283',
        marginTop: 2,
        fontWeight: 'bold'
      },
      CardStyle: {
        marginTop: 10,
        padding: 10,
        borderRadius: 5
      },
      mainVieww: {
        paddingBottom: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5
      },
      commonStyleView: {
        flexDirection: 'row',
        width: '100%'
      },
      HeadingTextView: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '70%'
      },
      HeadingText: {
        fontFamily: 'OpenSans',
        fontSize: 15,
        color: '#128283',
        lineHeight: 20
      },
      rightTextView: {
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        width: '30%'
      },
      rightText: {
        fontFamily: 'OpenSans',
        fontSize: 15,
        color: '#000',
        lineHeight: 20
      },
      dividingView: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: '50%'
      },
      smallrightText: {
        fontFamily: 'OpenSans',
        fontSize: 13,
        color: '#000'
      },
      leftView: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '50%'
      },
      leftText: {
        fontFamily: 'OpenSans',
        fontSize: 15,
        color: '#000'
      },
      renewalButton: {
        flexDirection: 'row',
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#128283',
        paddingVertical: 5
      },
      renewalButtonText: {
        fontFamily: 'OpenSans',
        fontSize: 13,
        color: '#fff',
        fontWeight: 'bold'
      },
      modalFirstView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalSecondView: {
        width: '95%',
        height: 200,
        backgroundColor: '#fff',
        borderColor: '#909090',
        borderWidth: 3,
        padding: 10,
        borderRadius: 10,
      },
      modalHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000'
      },
      backToHomeButton: {
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        backgroundColor: '#128283',
        height: 35,
        alignItems: 'center',
        justifyContent: 'center'
      },
      backToHomeButtonText: {
        fontFamily: 'OpenSans',
        fontSize: 15,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold'
      },
      cardStyles: {
        marginTop: 15,
        marginRight: 15,
        marginLeft: 15,
        borderRadius: 5,
        padding: 10
      },
      backToHomeButton1: {
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        backgroundColor: '#59a7a8',
        height: 35,
        alignItems: 'center',
        justifyContent: 'center'
      },
      backToHomeButtonText1: {
        fontFamily: 'OpenSans',
        fontSize: 15,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold'
      },
      formStyle6: {
        borderColor: '#909090',
        borderWidth: 0.5,
        height: 35,
        marginTop: 10,
        justifyContent: 'center',
        borderRadius: 5,
      },
      subHeadingText: {
        fontSize: 16,
        fontFamily: 'OpenSans',
        marginTop: 25,
        fontWeight: '700',
      },
      textInputStyle: {
        borderColor: '#909090',
        borderWidth: 1,
        height: 35,
        marginTop: 8,
        borderRadius: 5,
      },
      searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#909090',
        borderWidth: 1,
        height: 30,
        borderRadius: 5,
        marginTop: 8,
      },
      searchIcon: {
        // padding: 1,
      },
      input: {
        flex: 1,
        paddingTop: 2,
        paddingRight: 2,
        paddingBottom: 2,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#909090',
      },
      radioButtonStyle: {
        fontSize: 14,
        fontFamily: 'OpenSans',
      },
      ecardButton: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
      },
      linkHeader: {
        fontFamily: 'OpenSans',
        fontSize: 15,
        textDecorationColor: primaryColor,
        textDecorationLine: 'underline',
        color: primaryColor,
      },
    
    });
    