
import React from 'react';
import { View, Text } from "react-native";
import { Icon} from 'native-base';
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
             : null }
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