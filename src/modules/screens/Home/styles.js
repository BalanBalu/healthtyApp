// Imports
import { StyleSheet } from 'react-native'
import { font } from '../../../ui/common/responsive'
// Styles
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
   
  },
  bodyContainer: {
    flex: 1
  },
  textItem: {
    fontSize: font(16)
  },
  rightText: {
    flex: 1,
    flexDirection: 'row',
    fontFamily: 'Cochin',
    fontSize: 16,
    textAlign: 'right',
    padding: 10,
    justifyContent: 'flex-end',
    color: 'white'

  },
  inputText: {
    width: 300,
    padding: 5,
    marginLeft: 5,
    marginTop: 5,
    backgroundColor: 'white',

  },
  searcharea: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderColor: '#EDAA3E',
    borderWidth: 1,
    borderRadius: 10,
    margin: 20,
    padding: 10,
    height: 450,
  },
  errorMsg:
  {
    backgroundColor: '#fff6d2',
    padding: 10,
    fontSize: 14,
    color: '#429dff',
    borderRadius: 5,
    justifyContent: 'center'
  }


})
