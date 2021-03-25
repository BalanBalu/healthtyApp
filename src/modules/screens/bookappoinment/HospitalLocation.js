import React, { Component } from 'react';
import { StyleSheet, Image, TouchableOpacity, View, FlatList } from 'react-native';
import Mapbox from './Mapbox';

import { Text,  Card, List, ListItem, Left,  Body, Icon } from 'native-base';
import { Row, Grid } from 'react-native-easy-grid';
import {primaryColor} from '../../../setup/config'


export default class HospitalLocation extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.number === nextProps.number) {
          return false;
        } else {
          return true;
        }
      }

    render() {
        const { hopitalLocationData } = this.props;
        const addressData = hopitalLocationData.location.address;
        return (
        <View style={{marginLeft:5,marginRight:5,borderTopColor:'gray',borderTopWidth:0.7,}}>
         
       <Row style={{marginTop:10}}>
         <Icon name='ios-home' style={{fontSize:20,color:'gray'}}/>
         <Text  style={{ fontFamily: 'Roboto-bold',fontSize:13,marginLeft:10,marginTop:1 }}>{hopitalLocationData.name}</Text>
      </Row>
         {/* <Text  style={{ fontFamily: 'Roboto',fontSize:13,marginLeft:26}}>  {addressData.no_and_street + ', ' + addressData.city + ', ' + addressData.state } </Text> */}
       <Card transparent style={{ margin: 20, backgroundColor: '#ecf0f1' }}>
         
         <Card style={ { }}>
             {/* <Mapbox hospitalLocation={hopitalLocationData}/>         */}
          <List>
          <ListItem avatar>
            <Left>
              <Icon name="locate" style={{ color: primaryColor, fontSize: 20 }}></Icon>
            </Left>
             <Body>
                <Text note style={{fontFamily:'Roboto',fontSize:16}}>{addressData.no_and_street}</Text>
                {addressData.address_line_1 ? <Text note style={{fontFamily:'Roboto',fontSize:16}}>{addressData.address_line_1}</Text> : null }
                <Text note style={{fontFamily:'Roboto',fontSize:16}}>{addressData.city}</Text>
                {addressData.district ? <Text note style={{fontFamily:'Roboto',fontSize:16}}>{addressData.district}</Text> : null }
                <Text note style={{fontFamily:'Roboto',fontSize:16}}>{addressData.state}</Text>
                {addressData.post_office_name ? <Text note style={{fontFamily:'Roboto',fontSize:16}}>{addressData.post_office_name}</Text> : null }
                <Text note style={{fontFamily:'Roboto',fontSize:16}}>{addressData.pin_code}</Text>
            </Body>
            
          </ListItem>
        </List>
      </Card>
      </Card>
   </View>
        )
      }
};