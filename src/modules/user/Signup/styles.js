// Imports
import { StyleSheet } from 'react-native'

// UI Imports
import { blockMargin } from '../../../ui/common/responsive'

// Styles
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    borderRadius: 5,
    marginTop: 10,

  },
  loginButton: {
    backgroundColor: "#775DA3",

  },
  loginText: {
    color: 'white',
  },
  welcome: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#000',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10
  },
  signuparea:
  {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  logo:
  {
    width: 86,
    height: 86,
    marginTop: 20,
    borderRadius: 50,
    borderColor: '#F1F1F1',
    borderWidth: 4,
    marginLeft: 'auto',
    marginRight: 'auto',

  },
  inputBox:
  {
    backgroundColor: '#F1F1F1',
    padding: 5,
    borderRadius: 5,
  },

  date:
  {
    marginTop: 4,
    backgroundColor: '#F1F1F1',
    padding: 9,
    borderRadius: 5,
    width: 280,
    height: 38,
  },

})
