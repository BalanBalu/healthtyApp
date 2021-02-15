import { StyleSheet } from 'react-native'
import {primaryColor} from '../../../setup/config'

export default styles = StyleSheet.create({
    kmText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        textAlign: 'right',
        color: '#4c4c4c'
    },
    hospnames: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        fontWeight: "700",
        color: primaryColor
    },
    location: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#626262'

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
        fontFamily: 'OpenSans',
        color: '#000',
        fontSize: 13,
    },
    picodeText: {
        fontFamily: 'OpenSans',
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
        padding: 10,
        borderRadius: 10,
        borderBottomWidth: 2,
        marginTop: 5
    },
    commonStyle: {
        fontFamily: 'OpenSans',
        fontSize: 13,
        fontWeight: 'bold'
    },
    qualificationText: {
        fontFamily: 'OpenSans',
        marginTop: 2,
        fontSize: 11
    },
    addressTexts: {
        fontFamily: 'OpenSans',
        marginTop: 5,
        fontSize: 12,
    },
    heartIconButton: {
        paddingBottom: 10,
        paddingRight: 10,
        paddingLeft: 10,
        justifyContent: 'center'
    },
    commonText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
    },
    enableSearchIcon4Hospital: {
        backgroundColor: primaryColor,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disableSearchIcon4Hospital: {
        backgroundColor: 'gray',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});