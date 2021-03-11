import { StyleSheet } from 'react-native'
import {primaryColor} from '../../../setup/config'

export default StyleSheet.create({

    container:
    {
        marginTop: 10,
        backgroundColor: '#ffffff',

    },
    bodyContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 30,
        paddingRight: 30
    },
    bodyContent1: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 50
    },
    textStyle:
    {
        fontFamily: 'OpenSans',
        color: '#000'
    },
    centeredIcons:
    {
        padding: 5,
        color: '#fff',
        justifyContent: 'center',
        height: 40,
        width: 40,
        fontSize: 20,
        borderRadius: 25,
        backgroundColor: primaryColor,
        marginTop: 10,
        paddingLeft: 12,
        paddingTop: 10,


    },
    updateButton:
    {
        height: 45,
        width: 'auto',
        borderRadius: 10,
        textAlign: 'center',
        color: 'white',
        marginTop: 20,
        fontSize: 12
    },

    addressButton: {
        marginTop: 12,
        backgroundColor: primaryColor,
        borderRadius: 5,
        fontFamily: 'OpenSans',
        marginLeft: 15,
        marginRight: 15

    },
    addressButtonDisable: {
        marginTop: 12,
        backgroundColor: primaryColor,
        borderRadius: 5,
        fontFamily: 'OpenSans',
        marginLeft: 15,
        marginRight: 15

    },
    transparentLabel:
    {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,

        fontFamily: 'OpenSans',
        fontSize: 13

    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#909090',
        borderWidth: 1,
        height: 30,
        borderRadius: 5,
        marginTop: 8,
      },
      input: {
        flex: 1,
        paddingTop: 2,
        paddingRight: 2,
        paddingBottom: 2,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#909090',
      },
    textInputStyle: {
        borderColor: '#909090',
        borderWidth: 1,
        height: 35,
        marginTop: 8,
        borderRadius: 5,
      },
    transparentLabel2:
    {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,

        fontFamily: 'OpenSans',
        marginRight: 15,
        fontSize: 13

    },
    transparentLabel1:
    {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        fontSize: 13,
        paddingLeft: 20,
        fontFamily: 'OpenSans',
        marginRight: 15,
        fontSize: 13,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,

    },
    welcome:
    {
        fontSize: 22,
        textAlign: 'center',
        fontFamily: 'opensans-semibold',

    },
    updateProfile: {
        fontSize: 22,
        textAlign: 'center',
        marginTop: -10,
        fontFamily: 'opensans-semibold',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 30,
        paddingRight: 40,
        fontFamily: 'OpenSans',
    },
    customText: {
        fontSize: 15,
        marginLeft: 20,
        fontFamily: 'OpenSans',
    },
    customNote: {
        fontFamily: 'OpenSans',
    },
    customHead: {
        fontFamily: 'OpenSans',
    },
    header: {
        backgroundColor: '#f6f8fa',
        textAlign: 'center',
        fontFamily: 'OpenSans',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'OpenSans',
    },
    customPicker:
    {
        backgroundColor: '#F1F1F1',
        height: 55,
        marginTop: 10,
        borderRadius: 5,
        fontFamily: 'OpenSans',
        width: 300,
        borderBottomWidth: 0
    },
    multiplePicker:
    {
        borderBottomWidth: 0,
        backgroundColor: '#F1F1F1',
        marginTop: 10,
        borderRadius: 5,
        height: 45,
        paddingTop: 7
    },
    skipButton: {
        marginTop: 12,
        backgroundColor: primaryColor,
        borderRadius: 5,
        fontFamily: 'OpenSans',
    },
    button1: {
        backgroundColor: "#c9cdcf",
        borderRadius: 10,
        justifyContent: 'center',
        padding: 1,
        marginTop: 15,
        width: '30%',
        marginLeft: 5

    },
    button2: {

        borderRadius: 10,
        backgroundColor: primaryColor,
        justifyContent: 'center',
        padding: 10,
        marginTop: 10,


    },
    userbutton: {

        borderRadius: 5,
        marginLeft: 13,
        justifyContent: 'center',

        marginTop: 15,
        width: '97%',

    },
    headerText: {

        fontFamily: 'OpenSans',
        marginLeft: 7,
        fontWeight: 'bold',
        fontSize: 20
    },
    addressHeaderText: {

        fontFamily: 'OpenSans',
        marginLeft: 15,
        fontWeight: 'bold',
        fontSize: 20
    },
    cardEmail: {
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        justifyContent: 'center',
        borderColor: primaryColor,
        borderWidth: 2
    },
    buttonText: {
        fontFamily: 'OpenSans',
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',

    },
    subText: {
        fontFamily: 'OpenSans',
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 5
    },
    headText: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '500',
        fontFamily: 'OpenSans'
    },
    cardStyle: {
        borderRadius: 10,
        marginTop: 10,
        padding: 10
    },
    rowStyle: {
        marginTop: 10,
        borderColor: '#909090',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5
    },


});

