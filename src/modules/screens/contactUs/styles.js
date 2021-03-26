import {  StyleSheet } from 'react-native';

export default  styles = StyleSheet.create({
HeadingText:{
    marginTop: 10, 
    color: '#128283', 
    fontSize: 16,
    fontFamily:'opensans-bold'
},
subHeadingText:{
    fontSize: 15, 
    fontFamily: 'Roboto', 
    marginTop: 20
},
textInputStyle:{
    borderColor: '#909090', 
    borderWidth: 1, 
    height: 35, 
    marginTop: 5,
    borderRadius:5,
    fontSize:14
},
messageTextInputStyle:{
    borderColor: '#909090', 
    borderWidth: 1, 
    height: 200, 
    marginTop: 5,
    borderRadius:5  
},
submitButton:{
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:20,
    paddingVertical:10,
    backgroundColor:'#128283',
    marginTop:30,
    borderRadius:20,
    height:40
},
modalFirstView:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
},
modalSecondView:{
    width: '95%',
    height: 280,
    backgroundColor: '#128283',
    borderColor: '#909090',
    borderWidth: 3,
    padding: 10,
    borderRadius: 10,
},
modalHeading:{
    fontSize:20,
    fontFamily:'opensans-bold',
    textAlign:'center',
    color:'#fff'
},
modalSubText:{
    fontSize:14,
    textAlign:'center',
    color:'#fff'
},
emailSubText:{
    fontSize:15,
    textAlign:'center',
    marginTop:2,
    color:'#fff'
},
backToHomeButton:{
    paddingLeft: 10, 
    paddingRight: 10, 
    borderRadius: 30, 
    backgroundColor: '#fff', 
    height: 35, 
    alignItems: 'center', 
    justifyContent: 'center' 
},
backToHomeButtonText:{
    fontFamily: 'opensans-bold', 
    fontSize: 15, 
    textAlign: 'center', 
    color: '#128283', 
},
formStyle6: {
    borderColor: '#909090',
    borderWidth: 0.5,
    height: 35,
    marginTop: 10,
    justifyContent: 'center',
    borderRadius: 5
},
textInputWithBorderStyle:{
    borderColor: 'red', 
    borderWidth: 1, 
    height: 35, 
    marginTop: 5,
    borderRadius:5,
    fontSize:14
},
messageTextErrorInputStyle:{
    borderColor: 'red', 
    borderWidth: 1, 
    height: 200, 
    marginTop: 5,
    borderRadius:5  
},
formStyle6ErrorMsg: {
    borderColor: 'red',
    borderWidth: 0.5,
    height: 35,
    marginTop: 10,
    justifyContent: 'center',
    borderRadius: 5
},
})