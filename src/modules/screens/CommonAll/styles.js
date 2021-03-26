import { StyleSheet } from 'react-native'
import {primaryColor, secondaryColor} from '../../../setup/config'

export default styles = StyleSheet.create({
    container:
    {
        backgroundColor: '#ffffff',
    },
    bodyContent: {
        padding: 5
    },
    slotDefaultBgColor: {
        backgroundColor: '#ced6e0',
        borderColor: '#000',
        marginTop: 10,
        height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        marginLeft: 5
    },
    slotDefaultTextColor: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'Roboto',
        textAlign: 'center'
    },
    slotBookedBgColor: {
        backgroundColor: '#A9A9A9', //primaryColor,
        borderColor: '#000',
        marginTop: 10, height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        marginLeft: 5
    },
    slotSelectedBgColor: {

        backgroundColor: primaryColor,
        borderColor: '#000',
        marginTop: 10,
        height: 30,
        borderRadius: 6,
        justifyContent: 'center',
        marginLeft: 5
    },
    slotBookedTextColor: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Roboto',
        textAlign: 'center'
    },
    slotBookedBgColorFromModal: {
        backgroundColor: '#878684',
        borderRadius: 5,
        height: 30,
    },
    slotDefaultBg: {
        backgroundColor: '#2652AC',
        borderRadius: 5,
        height: 30,
    },
    slotSelectedBg: {
        backgroundColor: '#808080',
        borderRadius: 5,
        height: 30,
    },
    availabilityBG: {
        textAlign: 'center',
        borderColor: '#000',
        marginTop: 10,
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        marginRight: 5,
        paddingLeft: 5,
        paddingRight: 5
    },
    customPadge: {
        backgroundColor: 'green',
        alignItems: 'center',
        width: '30%'
    },
    rsText: {
        fontSize: 8,
        textAlign: 'center',
        color: '#ff4e42',
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        textDecorationColor: '#ff4e42',
        fontFamily:'Roboto'
    },
    finalRs: {
        fontSize: 10,
        textAlign: 'center',
        fontFamily:'Roboto',
        paddingTop: 1,
        marginLeft: 5,
        color: '#8dc63f'
    },

    isEnabledFavorite: {
        marginLeft: 20, color: '#B22222', fontSize: 22
    },
    isDisabledFavorite: {
        marginLeft: 20, borderColor: '#fff', fontSize: 22
    },
    favoritesCount: {
        fontFamily: 'opensans-bold', fontSize: 12, 
    },
    favoritesText: {
        fontFamily: 'Roboto', fontSize: 12
    },
    favoritesCount4LalBookApp: {
        fontFamily: 'opensans-bold', fontSize: 12,  textAlign: 'center'
    },
    favoritesText4LalBookApp: {
        fontFamily: 'Roboto', fontSize: 12, textAlign: 'center'
    },
    commentText:
    {
        fontFamily: 'Roboto',
        color: '#000',
        fontSize: 12,
        marginTop: 5
    },
    reviewText:
    {
        fontFamily: 'Roboto',
        color: '#000',
        fontSize: 12,
        marginTop: 5,
        marginLeft: -20
    },
    descriptionText: {
        fontFamily: 'Roboto',
        color: '#000',
        fontSize: 14,
        marginTop: 5
    },
    viewMoreAndHideText: { fontFamily: 'Roboto', color: 'blue', fontSize: 14 },
    descriptionLabelName: { fontFamily: 'Roboto', fontSize: 12, },
    isEnabledFavorite4LalBookApp: {
        marginTop: 10, color: '#B22222', fontSize: 20
    },
    isDisabledFavorite4LalBookApp: {
        marginTop: 10, borderColor: '#fff', fontSize: 20
    },
    ratingCount: {
        fontFamily: 'opensans-bold', fontSize: 12, marginLeft: 2
    },
    ratingCount4LalBookApp: {
        fontFamily: 'opensans-bold', fontSize: 12, textAlign: 'center'
    },
    offerText: {
        fontFamily: 'Roboto', fontSize: 12,
    },
    offerText4LalBookApp: {
        fontFamily: 'Roboto', fontSize: 12, textAlign: 'center'
    },
    offer: {
        fontFamily: 'opensans-bold', fontSize: 12,color: 'green', marginLeft: 5
    },
    offer4LabBookApp: {
        fontFamily: 'opensans-bold', fontSize: 12,  textAlign: 'center', color: 'green'
    },
    mainCol: {
        justifyContent: "center",
        borderColor: 'gray',
        borderRadius: 5,
        flexDirection: 'row',
        borderWidth: 0.1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
        marginLeft: 10,
        marginBottom: 1, backgroundColor: '#fafafa',
    },

    mainText: {
        fontSize: 10,
        textAlign: 'center',
        fontFamily:'Roboto',
        marginTop: 5,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 1,
        color: primaryColor
    },

    homeTextButton: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
        paddingBottom: 2,
        borderColor: primaryColor,
        borderWidth: 1,
        borderRadius: 5
    },
    labTextButton: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 5,
        borderColor: '#909090',
        borderWidth: 1
    },
    innerTexts: {
        fontFamily: 'Roboto',
        fontSize: 10,
        color: '#000',
        textAlign: 'center'
    },
    rowMainText: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5
    },
    multiSelectStyle: {
        justifyContent: 'center',
        backgroundColor: '#fff',
        height: 30,
        marginLeft: 5,
        borderColor: 'gray',
        borderWidth: 0.3,
        borderRadius: 2,
        paddingTop: 10,
    },
    priceDetails: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 1,
        paddingBottom: 1,
        borderColor: '#909090',
        borderWidth: 1,
        borderRadius: 5
    },
    doneButton: {
        color: '#FFFFFF',
        fontFamily: 'opensans-bold',
        fontSize: 13,
        textAlign: 'center',
    },

    defaultdoneButton: {
        color: primaryColor,
        fontFamily: 'opensans-bold',
        fontSize: 13,
        textAlign: 'center',
    },

    viewButtonBgGreeen: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 15,
        backgroundColor: primaryColor
    },
    viewButtonBgGray: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 15,
        borderColor: primaryColor,
        borderWidth: 0.5
    },

    customText:
    {
        fontFamily: 'Roboto',
        color: '#000',
        fontSize: 14,
        marginTop: 5
    },
    picodeText: {
        fontFamily: 'Roboto',
        color: primaryColor,
        fontSize: 13,
    },
    editPincodeButton: {
        marginRight: 7,
        borderColor: '#ff4e42',
        borderWidth: 1.3,
        alignItems: 'center',
        alignSelf: 'center',
        padding: 5,
        borderRadius: 5
    },
    showingDoctorText: {
        marginLeft: 5,
        fontFamily: 'Roboto',
        color: '#000',
        fontSize: 13,
        marginTop: 5

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
    customButton: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
        backgroundColor: primaryColor,
        marginLeft: 15,
        borderRadius: 10,
        width: "auto",
        height: 40,
        color: "white",
        fontSize: 12,
        textAlign: "center",
        marginLeft: "auto",
        marginRight: "auto"
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
    beneficiaryFontStyle: {
        fontFamily: 'Roboto',
        fontSize: 13,
        marginTop: 5

    },
    slotDefaultBgColorForLab: {
        backgroundColor: '#ced6e0',
        borderColor: '#000',
        marginTop: 10,
        height: 60,
        borderRadius: 5,
        justifyContent: 'center',
        // marginLeft: 5
    },
    slotSelectedBgColorForLab: {

        backgroundColor: primaryColor,
        borderColor: '#000',
        marginTop: 10,
        height: 60,
        borderRadius: 6,
        justifyContent: 'center',
        //marginLeft: 5
    },
})





