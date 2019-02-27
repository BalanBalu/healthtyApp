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
  marginTop:11,
  // marginLeft: blockMargin
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
  fontSize: 12,
  color: 'gray',
},
password:
{
  fontSize: 12,
  color: 'gray',
},
signuparea: {

  // justifyContent: 'center',
  flex: 5,
  flexDirection: 'column',
  justifyContent: 'center',
  // alignItems: 'stretch',
  backgroundColor: '#FFF',
  borderColor: '#EDAA3E',
  borderWidth: 2,
  borderRadius: 10,
  margin: 30,
  padding: 20,
  height:470,
},

name: {
  justifyContent: 'center',
  textAlign: 'center',
  fontSize: 16,
  color: '#429dff',
  fontWeight: 'bold',
  margin:2,
},
picker: {
  textDecorationLine: 'underline'
},
custom:
{
  marginTop:5,
  paddingTop:7,
  borderWidth:1,
  borderColor:'gray',
  textAlign: 'center',
  width:265,
  height:33,
},
errorMsg:
{
backgroundColor:'#fff6d2',
padding:10,
fontSize: 14,
color: '#429dff',
borderRadius:5,
}
})
