import { StyleSheet } from 'react-native'

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
        fontFamily: 'OpenSans',
        textAlign: 'center'
    },
    slotBookedBgColor: {
        backgroundColor: '#A9A9A9', //'#775DA3',
        borderColor: '#000',
        marginTop: 10, height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        marginLeft: 5
    },
    slotSelectedBgColor: {

        backgroundColor: '#775DA3',
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
        fontFamily: 'OpenSans',
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
        fontWeight: '200',
        color: '#ff4e42',
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        textDecorationColor: '#ff4e42'
    },
    finalRs: {
        fontSize: 10,
        textAlign: 'center',
        fontWeight: '200',
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
        fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold'
    },
    favoritesText: {
        fontFamily: 'OpenSans', fontSize: 12
    },
    favoritesCount4LalBookApp: {
        fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', textAlign: 'center'
    },
    favoritesText4LalBookApp: {
        fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center'
    },
    commentText:
    {
        fontFamily: 'OpenSans',
        color: '#000',
        fontSize: 12,
        marginTop: 5
    },
    reviewText:
    {
        fontFamily: 'OpenSans',
        color: '#000',
        fontSize: 12,
        marginTop: 5,
        marginLeft: -20
    },
    descriptionText: {
        fontFamily: 'OpenSans',
        color: '#000',
        fontSize: 14,
        marginTop: 5
    },
    viewMoreAndHideText: { fontFamily: 'OpenSans', color: 'blue', fontSize: 14 },
    descriptionLabelName: { fontFamily: 'OpenSans', fontSize: 12, },
    isEnabledFavorite4LalBookApp: {
        marginTop: 10, color: '#B22222', fontSize: 20
    },
    isDisabledFavorite4LalBookApp: {
        marginTop: 10, borderColor: '#fff', fontSize: 20
    },
    ratingCount: {
        fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', marginLeft: 2
    },
    ratingCount4LalBookApp: {
        fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', textAlign: 'center'
    },
    offerText: {
        fontFamily: 'OpenSans', fontSize: 12,
    },
    offerText4LalBookApp: {
        fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center'
    },
    offer: {
        fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', color: 'green'
    },
    offer4LabBookApp: {
        fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', textAlign: 'center', color: 'green'
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
        fontWeight: '200',
        marginTop: 5,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 1,
        color: '#7F49C3'
    },

    homeTextButton: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
        paddingBottom: 2,
        borderColor: '#7F49C3',
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
        fontFamily: 'OpenSans',
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
            fontFamily: 'OpenSans',
            fontSize: 13,
            textAlign: 'center',
            fontWeight: '700'
    },

    defaultdoneButton: {
        color: '#775DA3',
        fontFamily: 'OpenSans',
        fontSize: 13,
        textAlign: 'center',
        fontWeight: '500'
    },

    viewButtonBgGreeen: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 15,
        backgroundColor: '#775DA3'
    },
    viewButtonBgGray: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 15,
        borderColor: '#775DA3',
        borderWidth: 0.5
    },

    customText:
    {
        fontFamily: 'OpenSans',
        color: '#000',
        fontSize: 14,
        marginTop: 5
    },

})





