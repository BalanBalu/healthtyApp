
import {  StyleSheet } from 'react-native';
import {primaryColor} from '../../../setup/config'


export default  styles = StyleSheet.create({
  
    container:
    {
        backgroundColor: '#F5F5F5',
        marginTop: 10,

    },

    bodyContent: {

        backgroundColor: '#F5F5F5'

    },
    touchStyle: {
        backgroundColor: primaryColor,
        borderRadius: 3,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 5,
        paddingTop: 5
    },
    touchText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#fff',
        textAlign: 'center'
    },
    inputText: {
        backgroundColor: '#f2f2f2',
        color: '#000',
        fontSize: 14,
        height: 33,
        marginTop: 8
    },
    nameAndAge: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#000',
        marginTop: 5
    },
    subHead: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#000',
        // fontWeight: 'bold'
    },
    NameText: {
        fontSize: 14,
        fontFamily: 'OpenSans',
        color: 'black'
    },
    relationShipText: {
        fontSize: 12,
        fontFamily: 'OpenSans',
        color: primaryColor
    },
    ageText: {
        fontSize: 14,
        fontFamily: 'OpenSans',
        textAlign: 'right',
    },
    commonText: {
        fontSize: 14,
        fontFamily: 'OpenSans',
    },
    selectButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 5,
        borderRadius:5,
        backgroundColor:primaryColor,
        paddingHorizontal:10,
        paddingVertical:5
    },
    benefeciaryButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 5,
        
    },
    text: {
        padding: 8,
        paddingLeft: 0,
        fontWeight: 'bold',
        color: '#4B5164',
      },
      inputView: {
        padding: 20,
        display: 'flex',
      },
      appButtonContainer: {
        elevation: 8,
        width: 150,
        backgroundColor: primaryColor,
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 12,
      },
      appButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        alignSelf: 'center',
        textTransform: 'uppercase',
      },

      customizedText: {
        fontFamily: 'OpenSans',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
 
    mainCard: {
        borderRadius: 10,
    },
    circleIcon: {
        color: '#5cb75d',
        fontSize: 60
    },
    successHeading: {
        textAlign: 'center',
        fontFamily: 'OpenSans',
        fontSize: 18,
        fontWeight: 'bold'
    },
    subText: {
        textAlign: 'center',
        fontFamily: 'OpenSans',
        fontSize: 17,
        marginTop: 5,
        color: '#535353',
        marginLeft: 20,
        marginRight: 20
    },
    headerText: {
    textTransform: 'uppercase',
    fontWeight: '700',
    marginLeft: 40,
    color: '#3E4459',
    lineHeight: 26,
    fontFamily: 'OpenSans, sans-serif',
    marginRight: 40,
    marginTop: 20,
  },
  cardStyles: {
    marginTop: 15,
    marginRight: 15,
    marginLeft: 15,
    borderRadius: 5,
    padding: 10
  },
  innerCardText: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    color: '#4765FF'
  },

  })