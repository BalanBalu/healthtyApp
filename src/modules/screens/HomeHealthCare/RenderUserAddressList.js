import React, { PureComponent } from 'react';
import { Text, View, Radio } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { TouchableOpacity } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { getHomeHealthCareUserAddress } from '../../common';
export default class RenderUserAddressList extends PureComponent {
    constructor(props) {
        super(props)
    }
    render() {
        const { item, extraData: { selectedAddressIndex, index, fullName, mobileNo }, onPressEnabledDeleteAddressItemPop, onPressRadioBtnToSelectAddressItem } = this.props;
        return (
            <View style={{ backgroundColor: '#fff' }}>
                <TouchableOpacity onPress={() => { onPressRadioBtnToSelectAddressItem(item, index) }}>
                    <Row style={{ borderBottomWidth: 0.3, paddingBottom: 10, marginTop: 5, marginLeft: 5, justifyContent: 'center', borderBottomColor: 'gray' }}>
                        <Col size={1} style={{ justifyContent: 'center' }}>
                            <Radio
                                standardStyle={true}
                                selected={selectedAddressIndex === index}
                                onPress={() => onPressRadioBtnToSelectAddressItem(item, index)} />
                        </Col>
                        <Col size={8} style={{ justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 13, fontWeight: '400', marginTop: 2, }}>{fullName || null}</Text>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 13, marginTop: 2, color: '#4c4c4c' }}>{getHomeHealthCareUserAddress(item.address)}</Text>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 13, marginTop: 2 }}>{'Mobile -' + (mobileNo || 'No Number')}</Text>
                        </Col>
                        <Col size={1}>
                            {item.address_type !== 'DEFAULT' ?
                                <TouchableOpacity onPress={() => { onPressEnabledDeleteAddressItemPop(item, index) }}>
                                    <EvilIcons name="trash" style={{ fontSize: 23, color: '#4A63F0', marginTop: 3 }} />
                                </TouchableOpacity>
                                : null}
                        </Col>
                    </Row>
                </TouchableOpacity>
            </View>
        )
    }
}