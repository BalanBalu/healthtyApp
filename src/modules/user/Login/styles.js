// Imports
import { StyleSheet } from 'react-native'

// UI Imports
import { blockMargin } from '../../../ui/common/responsive'

// Styles
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#9056ED',
   
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  buttonContainerLeft: {
    flex: 1
  },
  buttonContainerRight: {
    flex: 1,
    marginLeft: blockMargin
  },
  leftText: {
    fontFamily: 'Cochin',
    fontSize: 20,
    textAlign: 'left',
    padding:6,
    margin: 0,
    color:'white'
  },

  rightText: {
    fontFamily: 'Cochin',
    fontSize: 20,
    textAlign: 'right',
    padding:6,
    marginTop: -30,
    color:'white'

  },
  logo:
  {
    width: 100,
    height: 100,
    marginTop: -60,
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 5,
    marginLeft: 85,
  },

  email: {
    fontSize: 12,
    color: 'gray',
  },
  password:
  {
    fontSize: 12,
    color: 'gray',
  },
  loginarea: {

    // justifyContent: 'center',
    flex: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'stretch',
    backgroundColor: '#fff',
    borderColor: '#A56AAD',
    borderWidth: 4,
    borderRadius: 10,
    margin: 30,
    padding: 20,
    height:400,
  },
  
  name: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    margin:5,
  }

})
