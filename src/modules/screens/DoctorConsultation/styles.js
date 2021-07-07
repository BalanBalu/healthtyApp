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
    marginTop: heightPercentageToDP('-3%'),
    borderTopEndRadius: heightPercentageToDP('5%'),
    borderTopStartRadius: heightPercentageToDP('5%'),
  },
  picCircle: {
      borderRadius: heightPercentageToDP('10%'),
      backgroundColor: '#ffffff',
      minHeight: widthPercentageToDP('24%'),
      maxWidth:  widthPercentageToDP('25%'),
      marginTop: widthPercentageToDP('-10%'),
      borderColor: '#333',
      borderWidth: 3,
  },
  topCurve: {
    minHeight: heightPercentageToDP('25%'),
    backgroundColor: '#43b4a5',
  },
});

export {styles};
