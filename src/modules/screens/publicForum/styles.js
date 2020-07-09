import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container:
    {
        backgroundColor: '#ffffff',

    },
    bodyContent: {
        padding: 10
    },
    firstTransparentLabel:
    {
        color: '#000',
        fontFamily: 'OpenSans',
        fontSize: 12
    },
    transparentLabel1:
    {
        borderBottomColor: 'transparent',
        color: '#000',
        backgroundColor: '#fff',
        height: 30,
        borderRadius: 2,
        fontFamily: 'OpenSans',
        fontSize: 12
    },
    footerStyle: {
        backgroundColor: '#fff',
        justifyContent: 'center',

    },
    symptomsText: {
        fontFamily: 'OpenSans',
        fontSize: 12
    },
    answerText: {
        textAlign: 'right',
        color: '#7F49C3',
        fontSize: 10
    },
    dateText: {
        fontFamily: 'OpenSans',
        fontSize: 10
    },
    descriptionText: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        color: '#909090',
        marginTop: 5
    },
    pageCount: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 2,
        paddingBottom: 2,
        borderColor: '#7F49C3',
        borderWidth: 0.5
    },
    colstyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    iconStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#7F49C3',
        height: 30,
        borderRadius: 2,
        marginLeft: 5
    }
})