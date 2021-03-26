import { StyleSheet } from 'react-native'
import {primaryColor} from '../../../setup/config'

export default styles = StyleSheet.create({
    containers: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "column",
        justifyContent: "center",
        padding: 10
    },
    subHead: {
        fontFamily: 'opensans-bold',
        fontSize: 13,
        color: primaryColor,
    },

    firstCheckBox: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#000',
        marginLeft: 20
    },
    nameAndAge: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#000',
        marginTop: 5
    },
    genderText: {
        fontFamily: 'Roboto',
        fontSize: 12,
        marginLeft: 10
    },
    shareButton: {
        marginTop: 10,
        backgroundColor: "gray",
        marginRight: 1,
        borderRadius: 10,
        width: "auto",
        height: 30,
        color: "white",
        fontSize: 12,
        textAlign: "center"
    },
    commonText: {
        fontFamily: 'opensans-bold',
        fontSize: 12,
        color: '#000',
    },
    inputText: {
        backgroundColor: '#f2f2f2',
        color: '#000',
        fontSize: 12,
        height: 33,
    },
    touchStyle: {
        backgroundColor: primaryColor,
        borderRadius: 1,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 5,
        paddingTop: 5
    },
    touchText: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#fff',
        textAlign: 'center'
    },
    nameText: {
        fontFamily: "opensans-bold",
        fontSize: 15,
    },
    bodyContent: {
        padding: 5
    },

    cardItem: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',

    },
    cardItemText2: {
        fontFamily: 'Roboto',
        fontSize: 13,
        marginTop: 5,
        fontStyle: 'italic',
        width: '90%'
    },
    Textname: {
        fontSize: 14,
        fontFamily: 'opensans-bold',
    },
    specialistTextStyle: {
        fontSize: 12,
        fontFamily: 'Roboto',
        marginTop: 5

    },
    subText1: {
        fontSize: 13,
        fontFamily: 'opensans-bold',
    },
    subText2: {
        fontSize: 13,
        fontFamily: 'Roboto',
        marginLeft: 5,
        color: '#4c4c4c'
    },
    subText3: {
        fontSize: 12,
        fontFamily: 'Roboto',
        marginLeft: 5
    },
    confirmButton: {
        backgroundColor: '#6FC41A',
        height: 30,
        padding: 17,
        borderRadius: 5
    },
    ButtonText: {
        color: '#fff',
        fontSize: 10,
        fontFamily:'opensans-bold',
    },
    textApproved: {
        fontSize: 12,
        fontFamily:'opensans-bold',
    },
    postponeButton: {
        // backgroundColor:'#4765FF',
        height: 25,
        padding: 8,
        borderRadius: 5
    },
    timeText: {
        fontFamily: 'opensans-bold',
        fontSize: 15,
        color: '#FFF',
        marginLeft: -10
    },
    iconStyle: {
        fontSize: 20,
        color: '#FFF'
    },
    rowStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5
    },
    touchableStyle: {
        borderColor: '#4765FF',
        borderWidth: 2,
        borderRadius: 5,
        padding: 8
    },
    touchableText: {
        fontFamily: 'opensans-bold',
        fontSize: 15,
        color: '#4765FF',
        marginTop: 4,
        marginLeft: 5
    },
    touchableText1: {
        fontFamily: 'opensans-bold',
        fontSize: 15,
        color: '#fff',
        textAlign: 'center'
    },
    appoinmentPrepareStyle: {
        backgroundColor: '#8EC63F',
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 5
    },
    rowSubText: {
        marginLeft: 10,
        // borderBottomColor:'gray',
        // borderBottomWidth:0.5,
        marginRight: 10,
        marginTop: 10
    },
    innerSubText: {
        fontSize: 13,
        fontFamily: 'opensans-bold',
        marginBottom: 5
    },
    subTextInner1: {
        fontSize: 12,
        fontFamily: 'Roboto',
        marginBottom: 5,
        color: '#4c4c4c'
    },
    subTextInner2: {
        fontSize: 10,
        color: "red",
        fontFamily: 'Roboto',
        marginBottom: 5
    },

    downText: {
        fontSize: 12,
        fontFamily: 'Roboto',
    },
    cardItemText3: {
        fontFamily: 'opensans-bold',
        fontSize: 18,
        height: 30,
        color: '#FFF', paddingBottom: -10
    },
    card: {
        padding: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 10,
        paddingRight: 10,
        paddingLeft: 10,
        borderColor: 'gray',
        borderWidth: 0.5,
        margin: 5,
        width: '98%',
        justifyContent: 'center',
        alignItems: 'center'

    },
    innerCard: {
        marginTop: -5,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        padding: 5
    },
    diseaseText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        marginLeft: 10,
        fontStyle: 'italic',
        marginTop: -5
    },
    hospitalText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        marginLeft: 15,
        width: "80%"
    },
    hosAddressText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        marginLeft: 15,
        fontStyle: 'italic',
        width: "80%",
        marginTop: 5
    },
    cardItem2: {
        backgroundColor: primaryColor,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center',
        alignItems: "center",
        marginTop: 10
    },
    cardItem3: {
        backgroundColor: primaryColor,
        marginBottom: -10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        marginLeft: -10,
        marginBottom: -10,
        marginRight: -10,
        //  justifyContent:'center',
        //  alignItems:"center",ss
        height: 35,
        marginTop: -10
    },
    cardItemText: {
        fontFamily: 'opensans-bold',
        fontSize: 16,
        color: '#FFF'
    },
    subText: {
        fontFamily: 'opensans-bold',
        fontSize: 18,
        marginTop: 15,
        marginLeft: 5
    },
    customHead:
    {
        fontFamily: 'Roboto',
    },
    customText:
    {

        fontFamily: 'Roboto',
        color: '#000',
        fontSize: 14,

    },

    logo: {
        height: 80,
        width: 80,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },

    customCard: {
        borderRadius: 20,
        padding: 7,
        marginTop: -150,
        marginLeft: 15,
        marginRight: 15,
        fontFamily: 'Roboto',

    },
    topValue: {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'Roboto',
    },
    bottomValue:
    {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'Roboto',
        fontSize: 12
    },


    subtitlesText: {
        fontSize: 15,
        padding: 4,
        margin: 10,
        backgroundColor: '#FF9500',
        color: '#fff',
        width: 160,
        fontFamily: 'Roboto-semibold',
        textAlign: 'center',
        borderRadius: 10

    },

    customIcons:
    {
        backgroundColor: 'red',
        borderRadius: 20,
        justifyContent: 'center',
        color: '#fff',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
        // borderColor: 'red',
        // borderWidth: 2,
        fontSize: 25,
        height: 25,
        width: 25,
        fontFamily:'opensans-bold'

    },
    leftButton:
    {
        height: 45,
        width: '98%',
        backgroundColor: '#23D972',
        borderRadius: 5,
        alignItems: 'center',
        marginLeft: 2,
        marginRight: 2,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 15
    },
    rightButton: {
        height: 45,
        width: '98%',
        backgroundColor: '#745DA6',
        borderRadius: 5,
        marginLeft: 2,
        marginRight: 2,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 10
    },
    customPadge: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 10,
        padding: 5,
    },
    customTouch: {
        borderRadius: 5,
        height: 45,
        width: '30%',
        backgroundColor: primaryColor,
        textAlign: 'center',
        justifyContent: 'center',
        margin: 5
    },
    customSelectedTouch: {
        backgroundColor: '#A9A9A9',
        borderRadius: 5,
        height: 45,
        width: '30%',
        textAlign: 'center',
        justifyContent: 'center',
        margin: 5
    },
    reviewButton: {
        marginTop: 12,
        backgroundColor: primaryColor,
        borderRadius: 10,
        height: 40,
        color: 'white',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 5,
        paddingTop: 5,
        flexDirection: 'row'
    },
    rowSubText1: {
        marginLeft: 10,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 5,
        padding: 5,
        marginRight: 10,

        marginTop: 10
    },
    innerSubText1: {
        fontSize: 13,
        fontFamily: 'opensans-bold',
        color: primaryColor,
        // marginBottom: 5
    },
    bookAgain1: {
        fontSize: 13,
        fontFamily: 'opensans-bold',
    },

    appoinmentPrepareStyle2: {
        backgroundColor: primaryColor,
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 5
    },
    PatientDetailList: {
        borderColor: 'gray',
        borderWidth: 0.5,
        padding: 5,
        marginTop: 8,
        borderRadius: 2
    },
    tokenText: {
        textAlign: 'right',
        fontSize: 14,
        marginTop: -5,
        marginRight: 5
    },
    mainText: {
        fontFamily: 'Roboto',
        fontSize: 14,
    },
    subinnerText: {
        fontFamily: "Roboto",
        fontSize: 12
    },
    completedText: {
        fontFamily: 'opensans-bold',
        fontSize: 18,
        color: '#8EC63F'
    },
    HeadingCard: {
        borderRadius: 7,
        paddingTop: 5,
        paddingBottom: 5
    },
    topRatedCol: {
        flexDirection: 'row', marginLeft: 5,
    },
    TopRatedIcon: {
        color: 'gray',
        fontSize: 20,
        marginTop: 10
    },
    topRatedText: {
        fontFamily: 'Roboto',
        color: '#000',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 5
    },
    filterCol: {
        flexDirection: 'row',
        borderLeftColor: '#000',
        borderLeftWidth: 0.3
    },
    filterIcon: {
        color: 'gray',
        fontSize: 25,
        marginTop: 5
    },
    filterText: {
        fontFamily: 'Roboto',
        color: '#000',
        fontSize: 13,
        marginTop: 5,
        marginLeft: 5,
        width: '100%',
        textAlign: 'center'
    },
    specialismInput: {
        backgroundColor: '#fff',
        height: 35,
        borderRadius: 2,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1
    },
    showingDoctorText: {
        fontFamily: 'Roboto',
        color: '#000',
        fontSize: 13,
    },
    picodeText: {
        fontFamily: 'Roboto',
        color: primaryColor,
        fontSize: 13,
    },
    editPincodeButton: {
        paddingBottom: 1,
        paddingTop: 1,
        paddingLeft: 2,
        paddingRight: 2,
        borderColor: '#ff4e42',
        borderWidth: 1,
        borderRadius: 2
    },
    doctorListStyle: {
        padding: 2,
        borderRadius: 10,
        borderBottomWidth: 2,
        marginTop: 5
    },
    commonStyle: {
        fontFamily: 'opensans-bold',
        fontSize: 12,
    },
    qualificationText: {
        fontFamily: 'Roboto',
        marginTop: 2,
        fontSize: 11
    },
    addressTexts: {
        fontFamily: 'Roboto',
        marginTop: 5,
        fontSize: 11,
    },
    heartIconButton: {
        paddingBottom: 10,
        paddingTop: 10,
        paddingRight: 10,
        paddingLeft: 10
    },
    commonText: {
        fontFamily: 'Roboto',
        fontSize: 12,
    },
    bookBottomButton: {
        textAlign: 'center',
        backgroundColor: 'green',
        borderColor: '#000',
        marginTop: 10,
        borderRadius: 20,
        height: 30,
        justifyContent: 'center',
        paddingLeft: 1,
        paddingRight: 1,
    },
    bookBottomButtonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 12,
        fontFamily: 'opensans-bold'
    },
    availableText: {
        fontFamily: 'Roboto',
        marginTop: 15,
        fontSize: 12,
    },
    homeAdressTexts: {
        fontFamily: 'Roboto',
        marginTop: 5,
        fontSize: 11,
        color:'#000'
    },
    changeText: {
        fontFamily: 'Roboto',
        color: '#ff4e42',
        fontSize: 10,
    },
    nameDetails: {
        fontFamily: 'Roboto',
        fontSize: 12,
    },
    totalAmount: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    totalAmountText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        color: '#000',
    },
    proceedButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8dc63f'
    },
    proceedButtonText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        color: '#fff',
    },
    rightAmountText: {
        fontFamily: 'Roboto',
        color: '#ff4e42',
        fontSize: 10,
        marginTop: 1,
        textAlign: 'right'
    },
    doctorDegreeText: {
        fontFamily: 'Roboto',
        marginTop: 2,
        fontSize: 11
    },
    defaultBookingAvailableBtn: {
        alignItems: 'center', borderRadius: 10, backgroundColor: primaryColor
    },
    enabledBookingAvailableBtn: {
        alignItems: 'center', borderRadius: 10, backgroundColor: 'green'
    },

    subTextBilling: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#000',
        marginLeft: 5
    },
    docName: {
        fontSize: 15,
        fontFamily: 'Roboto',
        color: primaryColor
    },
    specialist: {
        fontSize: 12,
        fontFamily: 'Roboto',
        color: '#000'
    },
    rupeesText: {
        fontSize: 10,
        fontFamily: 'Roboto',
        textAlign: 'right',
        color: '#8EC63F'
    },
    redRupesText: {
        fontSize: 10,
        fontFamily: 'Roboto',
        textAlign: 'right',
        color: 'red'
    },
    textInput: {
        borderColor: '#000',
        borderRadius: 10,
        borderWidth: 0.5,
        height: 100,
        fontSize: 12,
        textAlignVertical: 'top',
        width: '100%',
        padding: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 10,
        paddingRight: 10,
        marginTop: 15
    },
    appointmentDateStyle: {
        fontSize: 12,
        fontFamily: 'Roboto',
        color: '#0054A5',
        marginLeft: 5
    },
    bookingButton: {
        marginTop: 10,
        backgroundColor: primaryColor,
        marginRight: 1,
        borderRadius: 10,
        width: "auto",
        height: 30,
        color: "white",
        fontSize: 12,
        textAlign: "center"
    },
});