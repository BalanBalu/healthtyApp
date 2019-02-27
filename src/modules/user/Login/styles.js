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
bodyContainer: {
  flex: 1
},
buttonContainer: {
  flex: 1,
  flexDirection: 'row'
},
buttonContainerLeft: {
  flex: 1,
},
buttonContainerRight: {
  flex: 1,
  marginTop:11,
  //marginLeft: blockMargin
},
leftText: {
  flex:1,
  flexDirection:'row',
  fontFamily: 'Cochin',
  fontSize: 20,
  justifyContent:'flex-start',
  padding:8,
  margin: 0,
  color:'white'
},

rightText: {
  flex:1,
  flexDirection:'row',
  fontFamily: 'Cochin',
  fontSize: 20,
  textAlign: 'right',
  padding:8,
  justifyContent:'flex-end',
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
  marginLeft:'auto',
  marginRight:'auto',
},

email: {
  fontSize: 14,
  color: 'gray',
  marginTop:15,
  fontWeight:'bold'
},
password:
{
  fontSize: 14,
  color: 'gray',
  marginTop:15,
  fontWeight:'bold'
},
loginarea: {

  // justifyContent: 'center',
  flex: 5,
  flexDirection: 'column',
  justifyContent: 'center',
  // alignItems: 'stretch',
  backgroundColor: '#FFF',
  borderColor: '#EDAA3E',
  borderWidth: 2,
  borderRadius: 10,
  margin: 35,
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
  color:'#429dff'
},
errorMsg:
{
flex:1,
backgroundColor:'#fff6d2',
paddingLeft:90,
paddingTop:14,
fontSize: 14,
color: '#429dff',
borderRadius:5,
textAlign:'center',
height:25,
}

})
