
import React from 'react';
import { View, Text } from "react-native";
import { Icon} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
export const RenderHospitalAddress = (props) => {
   const { headerStyle, hospotalNameTextStyle, gridStyle } = props    
    return (
       
       <Grid>
            <Col style={gridStyle}>
                <Icon name='pin' style={{ fontSize: 20, fontFamily: 'OpenSans', color: 'gray' }}></Icon>
             </Col>
            <Col style={{ width: '90%' }}>
            {props.hospitalAddress.location ?
                <View>
                    <Text note style={hospotalNameTextStyle || { fontFamily: 'OpenSans' }}>{props.hospitalAddress.name}</Text>
                    <Text note style={props.textStyle}>{props.hospitalAddress.location.address.no_and_street}</Text>
                    <Text note style={props.textStyle}>{props.hospitalAddress.location.address.city}</Text>
                    <Text note style={props.textStyle}>{props.hospitalAddress.location.address.state}</Text>
                    <Text note style={props.textStyle}>{props.hospitalAddress.location.address.pin_code}</Text>
                </View> : null}
            </Col>
        </Grid>
      
        )
}