import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../Constants/GlobalStyles';

const styles = StyleSheet.create({
  outerContainer: {
    minHeight: heightPercentageToDP('100%'),
    backgroundColor: '#ffffff',
  },
  whiteCard: {
    minHeight: heightPercentageToDP('100%'),
    backgroundColor: '#ffffff',
    marginTop: heightPercentageToDP('-10%'),
    borderTopEndRadius: heightPercentageToDP('5%'),
    borderTopStartRadius: heightPercentageToDP('5%'),
  },
  picCircle: {
      borderRadius: heightPercentageToDP('20%'),
      backgroundColor: '#ffffff',
      minHeight: widthPercentageToDP('32%'),
      minWidth: widthPercentageToDP('32%'),
      maxWidth:  widthPercentageToDP('32%'),
      marginTop: widthPercentageToDP('-15%'),
  },
  callNowButton: {
    height: heightPercentageToDP('8%'),
    borderRadius: widthPercentageToDP('4.5%'),
    minWidth: widthPercentageToDP('80%'),
    backgroundColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom:  heightPercentageToDP('5%'),
  },
  callNowButtonText: {
    color: "#128283",
   textAlign: 'center',
   paddingTop: heightPercentageToDP('5%'),
   paddingBottom: heightPercentageToDP('5%'),
   fontSize: widthPercentageToDP('4%'),
   fontFamily: 'opensans-bold',
  },
  topCurve: {
    minHeight: heightPercentageToDP('25%'),
    backgroundColor: '#43b4a5',
  },
  bookingOpen: {
    minHeight: heightPercentageToDP('5%'),
    minWidth: widthPercentageToDP('26%'),
    maxWidth: widthPercentageToDP('26%'),
    marginRight: widthPercentageToDP('2%'),
    marginBottom: widthPercentageToDP('4%'),
    // flexDirection: 'row',
    // marginLeft: widthPercentageToDP('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: widthPercentageToDP('2.5%'),
  },
  bookingOpenText: {
    fontFamily: 'opensans-bold',
    paddingLeft: widthPercentageToDP('4%'),
    paddingRight: widthPercentageToDP('4%')
  },
  divider: {
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
    marginLeft: widthPercentageToDP('4%'),
    marginRight: widthPercentageToDP('4%'),
    marginTop: heightPercentageToDP('2.5%'),
    marginBottom: heightPercentageToDP('2.5%')
  },
  bookingDisabled: {
    
  },
  scheduleText: {
    marginLeft: widthPercentageToDP('10%'),
  
    fontWeight: 'bold',
    marginBottom: heightPercentageToDP('2%'),

  }
});

export {styles};
