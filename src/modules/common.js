import React from 'react';
import { View, Text } from "react-native";
import { Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

export const RenderHospitalAddress = (props) => {
    const { headerStyle, hospotalNameTextStyle, gridStyle, renderHalfAddress } = props
    return (

        <Grid style={gridStyle}>
            <Row>
                <Col style={{ width: '8%' }}>
                    <Icon name='medkit' style={{ fontSize: 16, fontFamily: 'OpenSans', color: 'gray' }}></Icon>
                </Col>
                <Col style={{ width: '90%' }}>
                    {props.hospitalAddress.location ?
                        <Text note style={hospotalNameTextStyle || { fontFamily: 'OpenSans' }}>{props.hospitalAddress.name}</Text>
                        : null}
                </Col>
            </Row>
            <Row>
                <Col style={{ width: '8%' }}>
                    <Icon name='pin' style={{ fontSize: 18, fontFamily: 'OpenSans', color: 'gray' }}></Icon>
                </Col>
                <Col style={{ width: '90%' }}>
                    {props.hospitalAddress.location ?
                        <View>
                            <Text note style={props.textStyle}>{props.hospitalAddress.location.address.no_and_street + ', '}</Text>
                            <Text note style={props.textStyle}>{props.hospitalAddress.location.address.city}</Text>
                            {renderHalfAddress === true ? null :
                                <View>
                                    <Text note style={props.textStyle}>{props.hospitalAddress.location.address.state}</Text>
                                    <Text note style={props.textStyle}>{props.hospitalAddress.location.address.pin_code}</Text>
                                </View>
                            }
                        </View> : null}
                </Col>
            </Row>
        </Grid>

    )
}

export const RenderPatientAddress = (props) => {
    const { gridStyle } = props
    return (

        <Grid style={gridStyle}>
            <Row>
                <Col style={{ width: '90%' }}>
                    {props.patientAddress.address ?
                        <View>
                            <Text note style={props.textStyle}>{props.patientAddress.address.no_and_street + ' , ' +
                                props.patientAddress.address.address_line_1 + ' , ' +
                                props.patientAddress.address.address_line_2 + ' , ' +
                                props.patientAddress.address.city + ' - ' + props.patientAddress.address.pin_code}</Text>
                        </View> : null}
                </Col>
            </Row>
        </Grid>
    )
}

export function renderProfileImage(data) {
    let source = null;
    if (data.profile_image) {
        source = { uri: data.profile_image.imageURL }
    } else if (data.gender == 'M') {
        source = require('../../../assets/images/profile_male.jpeg')
    } else if (data.gender == 'F') {
        source = require('../../../assets/images/profile_female.jpeg')
    } else {
        source = require('../../../assets/images/profile_common.png')
    }
    return (source)
} 