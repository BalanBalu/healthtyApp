// Imports
import {Dimensions, StyleSheet, PixelRatio} from 'react-native';
import {primaryColor, secondaryColor} from '../../../setup/config';
import {useWindowDimensions} from 'react-native';

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

const scale = width / 375;

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
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
  flexRowAlignStart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flexRowAlignSpaceAround: {
    flexDirection: 'row',
    alignItems: 'space-around',
  },
  flexRowAlignSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'space-between',
  },
  flexRowAlignSpaceEvenly: {
    flexDirection: 'row',
    alignItems: 'space-evenly',
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
  flexAlignJustifyEnd: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  flexAlignJustifyStart: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  flexAlignJustifySpaceAround: {
    flexDirection: 'column',
    alignItems: 'space-around',
  },
  flexAlignJustifySpaceBetween: {
    flexDirection: 'column',
    alignItems: 'space-between',
  },
  flexAlignJustifySpaceEvenly: {
    flexDirection: 'column',
    alignItems: 'space-evenly',
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
});

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

export {widthPercentageToDP, heightPercentageToDP, GlobalStyles};
