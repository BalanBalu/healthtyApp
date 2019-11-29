// Imports
import { StyleSheet } from 'react-native'



// Styles
export default StyleSheet.create({
    container:
    {
        backgroundColor: '#fff',
    },

    bodyContent: {
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
       paddingLeft:30,
       paddingRight:30 

    },
    welcome:
    {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 10,
        fontWeight:'bold',
        fontFamily: 'OpenSans',
    },
    transparentLabel: {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'OpenSans',
        fontSize: 15
    },
    transparentLabel1: {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 20,
        borderRadius: 5,
        
        fontFamily: 'OpenSans',
        fontSize: 15
    },
    transparentLabel2: {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        
        borderRadius: 5,
        
        fontFamily: 'OpenSans',
        fontSize: 15
    },
    ButtonText:{
        fontSize:15,
        fontWeight:'bold',
        fontFamily:'OpenSans'
    },
    loginButton: {
        marginTop: 20,
        backgroundColor: '#775DA3',
        marginLeft: 15,
        borderRadius: 5,
    },
    loginButtonDisable: {
        marginTop: 20,
        backgroundColor: '#9777c7',
        marginLeft: 15,
        borderRadius: 5,
    },
    detailsButton: {
        backgroundColor: '#775DA3',
        marginLeft: 15,
        borderRadius: 5,
        marginTop:-20
    },
    customText:
    {
        color: 'gray',
        fontFamily: 'OpenSans',
        fontSize:13
    },
    logo: {
        height: 86,
        width: 86,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingBottom: 20,
        marginTop: 20,
        borderRadius: 50,
        borderColor: '#f1f1f1',
        borderWidth: 5,

    },
    errorMsg:
    {
        backgroundColor: '#fff6d2',
        marginTop: 10,
        fontSize: 14,
        marginLeft: 16,
        borderRadius: 5,
        paddingLeft: 20,
        color: '#775DA3',
        height: 45,
        padding: 10,
        fontFamily: 'OpenSans',


    },
    customPadge: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'OpenSans',
        fontSize: 15,
        padding: 5,

    }
})

