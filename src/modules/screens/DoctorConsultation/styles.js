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
      marginTop: widthPercentageToDP('-15%')
  },
  callNowButton: {
    height: heightPercentageToDP('8%'),
    borderRadius: widthPercentageToDP('80%'),
    minWidth: widthPercentageToDP('80%'),
    backgroundColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  callNowButtonText: {
    color: "#128283",
   textAlign: 'center',
   paddingTop: heightPercentageToDP('5%'),
   paddingBottom: heightPercentageToDP('5%'),
  },
  topCurve: {
    minHeight: heightPercentageToDP('25%'),
    backgroundColor: '#43b4a5',
  },
  bookingOpen: {
    minHeight: heightPercentageToDP('5%'),
    backgroundColor: '#bbc4c7'
  },
  bookingDisabled: {
    
  }
});

export {styles};
