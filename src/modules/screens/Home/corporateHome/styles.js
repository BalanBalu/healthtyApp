import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import {primaryColor, secondaryColor} from '../../../../setup/config'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  rectBox: {
    width: 100,
    display: 'flex',
    height: 98,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 22,
    /*  Box Shadow */
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    elevation: 5,
  },
  
  rectBoxNone: {
    width: 100,
    display: 'flex',
    height: 0.01,
    backgroundColor: '#FAFBFF',
  },
  headingText: {
    color: 'rgba(0, 0, 0, 0.62)',
    fontSize: 18,
    marginHorizontal: 12,
    marginVertical: 12,
    fontFamily: 'opensans-bold',

  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 1,
  },
  boxText: {
    fontSize: 14,
    marginTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    color: primaryColor,
    fontFamily: 'opensans-bold',

    textAlign:'center'
  },

  inititationText1: {
    fontSize: 14,
    marginTop: 2,
    color: primaryColor,
    fontFamily: 'opensans-bold',
    textAlign: 'center',
  },
  initiationText2: {
    fontSize: 15,
    marginTop: 0,
    color: primaryColor,
    fontFamily: 'opensans-bold',
    textAlign: 'center',
  },
  insuranceRenewalText: {
    fontSize: 15,
    marginTop: 2,
    color: primaryColor,
    textAlign: 'center',
    fontFamily: 'opensans-bold',

  },

  shadowEffect: {
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: 'rgba(112,144,176,0.16)',
    shadowOffset: {width: 0, height: 8},
    elevation: 72,
    shadowOpacity: 1,
    shadowRadius: 24,
    width: 200,
    height: 150,
  },
  usedAmount: {
    fontFamily: 'opensans-bold',
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginLeft: 5

  },
  totalAmount: {
    fontFamily: 'Roboto',
    fontSize: 13,
    color: '#909090',
    textAlign: 'center'
  },
});

export default styles;
