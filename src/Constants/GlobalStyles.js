import {Dimensions, StyleSheet, PixelRatio} from 'react-native';


const widthPercentageToDP = (widthPercent) => {
  const screenWidth = Dimensions.get('window').width;
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};
const heightPercentageToDP = (heightPercent) => {
  const screenHeight = Dimensions.get('window').height;

  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

const GlobalStyles = StyleSheet.create({
  flexColumn: {
    flexDirection: 'column',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexRowJustifyCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  flexRowJustifyEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  flexRowJustifyStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  flexRowJustifySpaceAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  flexRowJustifySpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexRowJustifySpaceEvenly: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  flexRowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowAlignEnd: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  flexRowAlignBaseline: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  flexRowAlignStretch: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  flexColumnJustifyCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  flexColumnJustifyEnd: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  flexColumnJustifyStart: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  flexColumnJustifySpaceAround: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  flexColumnJustifySpaceBetween: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  flexColumnJustifySpaceEvenly: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },

  flexColumnAlignCenter: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  flexColumnAlignEnd: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  flexColumnAlignBaseline: {
    flexDirection: 'column',
    alignItems: 'baseline',
  },
  flexColumnAlignStretch: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },

  flexRowReverse: {
    flexDirection: 'row-reverse',
  },
  flexColumnReverse: {
    flexDirection: 'column-reverse',
  },
  flexOne: {
    flex: 1,
  },
  flexTwo: {
    flex: 2,
  },
  flexThree: {
    flex: 3,
  },
  flexFour: {
    flex: 3,
  },
  textAlignCenter: {
    textAlign: 'center'
  },
  mt1: {
    marginTop: heightPercentageToDP('1%'),
  },
  mb1: {
    marginBottom: heightPercentageToDP('1%'),
  },
  mt2: {
    marginTop: heightPercentageToDP('2%'),
  },
  mt3: {
    marginTop: heightPercentageToDP('3%'),
  },
  ml1: {
    marginLeft: heightPercentageToDP('1%'),
  },
  ml2: {
    marginLeft: heightPercentageToDP('2%'),
  },
  ml3: {
    marginLeft: heightPercentageToDP('3%'),
  },
  fontBold: {
    fontFamily: 'opensans-bold',
    fontWeight: 'bold'
  },
  fontSize3: {
    fontSize: widthPercentageToDP('3%')
  },
  fontSize4: {
    fontSize: widthPercentageToDP('4%')
  },
  fontSize5: {
    fontSize: widthPercentageToDP('5%')
  },
  fontSize6: {
    fontSize: widthPercentageToDP('6%')
  },

});

export {widthPercentageToDP, heightPercentageToDP, GlobalStyles};
