// Imports
import { StyleSheet } from 'react-native'
import {primaryColor, secondaryColor} from '../../../setup/config'


// Styles
export default StyleSheet.create({
    container:
    {
        backgroundColor: '#fff',
    },

    bodyContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 30,
        paddingRight: 30

    },
    authBodyContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20

    },
    welcome:
    {
        fontSize: 25,
        textAlign: 'center',
        marginTop: 30,
        fontFamily: 'opensans-bold',

    },
    signUpHead:
    {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 30,
        fontFamily: 'opensans-bold',

    },

    cardHead:
    {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'opensans-bold',
    },
    transparentLabel: {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'Roboto',
        fontSize: 15
    },
    userDetailLabel: {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        fontFamily: 'Roboto',
        fontSize: 15,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 8
    },
    authTransparentLabel: {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 15,
        fontFamily: 'Roboto',
        fontSize: 15,

    },
    transparentLabel1: {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 20,
        borderRadius: 5,

        fontFamily: 'Roboto',
        fontSize: 15
    },
    authTransparentLabel1: {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 20,
        borderRadius: 5,
        // borderColor:primaryColor,
        fontFamily: 'Roboto',
        fontSize: 15
    },
    transparentLabel2: {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,

        borderRadius: 5,

        fontFamily: 'Roboto',
        fontSize: 15
    },
    ButtonText: {
        fontSize: 15,
        fontFamily: 'opensans-bold',
        color: '#fff'
    },
    loginButton: {
        marginTop: 20,
        backgroundColor: primaryColor,
        marginLeft: 15,
        borderRadius: 5,
    },
    loginButtonDisable: {
        marginTop: 20,
        backgroundColor: primaryColor,
        marginLeft: 15,
        borderRadius: 5,
    },
    forgotButtonDisable: {
        marginTop: 20,
        backgroundColor: primaryColor,
        borderRadius: 5,
    },
    forgotButton: {
        marginTop: 20,
        backgroundColor: primaryColor,
        borderRadius: 5,
    },
    smallSignInButton: {
        backgroundColor: primaryColor,
        marginLeft: 15,
        borderRadius: 20,
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 10,
        paddingTop: 10
    },
    smallSignUpButton: {
        backgroundColor: primaryColor,
        marginLeft: 10,
        borderRadius: 20,
        paddingRight: 15,
        paddingLeft: 10,
        paddingBottom: 5,
        paddingTop: 5
    },
    loginButton1: {
        marginTop: 20,
        // backgroundColor: 'rgba(18, 130, 131, 1)',
        backgroundColor: primaryColor,
        borderRadius: 20,
        justifyContent: 'center',
        paddingRight: 35,
        paddingLeft: 35,
        paddingBottom: 8,
        paddingTop: 8
    },
    loginButton1Disable: {
        marginTop: 20,
        backgroundColor: secondaryColor,
        // backgroundColor: 'rgba(18, 130, 131, 0.7)',
        
        borderRadius: 20,
        justifyContent: 'center',
        paddingRight: 35,
        paddingLeft: 35,
        paddingBottom: 8,
        paddingTop: 8
    },
    UserButton1: {
        backgroundColor: primaryColor,
        borderRadius: 20,
        justifyContent: 'center',
        paddingRight: 35,
        paddingLeft: 35,
        paddingBottom: 8,
        paddingTop: 8
    },
    detailsButton: {
        backgroundColor: primaryColor,
        marginLeft: 15,
        borderRadius: 5,
        marginTop: -20,
    },
    customText:
    {
        color: 'gray',
        fontFamily: 'Roboto',
        fontSize: 13,
        color: primaryColor,


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
        color: primaryColor,
        height: 45,
        padding: 10,
        fontFamily: 'Roboto',


    },
    customPadge: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 15,
        padding: 5,

    },
    multiSelectStyleCorporate: {
        justifyContent: 'center',
        backgroundColor: '#F1F1F1',
        height: 40,
        marginLeft: 5,
        borderColor: 'gray',
        borderWidth: 0.3,
        borderRadius: 2,
        paddingTop: 10,
    },
    authTransparentLabel5: {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        borderRadius: 5,
        paddingLeft: 15,
        fontFamily: 'Roboto',
        fontSize: 15,

    },
    firstCheckBox: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: '#000',
        marginLeft: 5
    },
    switchToCorporate:{
        marginTop: 10, 
        justifyContent: 'flex-end', 
        alignContent: 'flex-end', 
        alignSelf: 'flex-end' ,
        borderColor:'#fff',
        borderWidth:1,
        paddingLeft:10,
        paddingRight:10,
        paddingTop:2,
        paddingBottom:2,
        borderRadius:5,
        flexDirection:'row'
    },
    imageContainer: {display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginTop: 30, marginLeft: 30, alignSelf: 'baseline'},
    textBold: { fontFamily:'opensans-bold', color: '#fff' },
    inputContainer: {borderTopRightRadius: 45, borderTopLeftRadius: 45, backgroundColor: '#fff', minHeight: '100%', marginTop: -30, display: 'flex', alignItems: "flex-start"},
    welcomeText: {fontFamily: 'opensans-bold', marginLeft: 28, marginTop: 55, fontSize: 20, color: '#333333'},
    signinButton: { elevation: 2,
        backgroundColor: "#fff",
        borderColor: '#48b4a5',
        borderWidth: 2,
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 102},
        singinText: {  fontSize: 18,
            color: "#48b4a5",
            fontFamily: 'opensans-bold',
            alignSelf: "center",
        },
        signinButtonDisabled: {
            backgroundColor: "#fff",
            borderColor: 'rgba(72,180,165,0.5)',
            borderWidth: 2,
            borderRadius: 30,
            paddingVertical: 15,
            paddingHorizontal: 102,
           
        },
        createAccount: {display: 'flex', alignSelf: 'center', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 30, elevation: 8,
        backgroundColor: "#48b4a5",
        borderColor: '#48b4a5',
        borderWidth: 0,
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 67},
        createAccountText: {  fontSize: 18,
            color: "#fff",
            fontFamily: 'opensans-bold',
            alignSelf: "center",
        },
        signinText: {  fontSize: 18,
            color: "#48b4a5",
            fontFamily: 'opensans-bold',
            alignSelf: "center",
        },
        signinTextDisabled: {
            color: "rgba(72,180,165,0.5)",
            fontFamily: 'opensans-bold',
            alignSelf: "center",
        },
        
})



