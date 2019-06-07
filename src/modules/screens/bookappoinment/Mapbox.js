import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Container, Content,Card,Text } from 'native-base';
import {  View,Image } from 'react-native';

import MapboxGL from '@react-native-mapbox-gl/maps';
let token = 'pk.eyJ1IjoiYnJpdmluc3JlZSIsImEiOiJjanc2Y3hkZHcxOGhvNDVwOXRhMWo2aDR1In0.EV8iYtfMxEcRcn8HcZ0ZPA';
MapboxGL.setAccessToken(token);
class Mapbox extends Component {
    constructor(props) {
      super(props)
    }

    
render() {
  const { navigation } = this.props;
  const data = navigation.getParam('coordinates');   
  console.log(data);
  return(
    <Container>
      <Content contentContainerStyle={{flex:1}}>
        <View style={{ flex: 1 }}>
            <MapboxGL.MapView
              ref={c => (this._map = c)}
              zoomLevel={25}
              zoomEnabled={true}
              showUserLocation={false}
              centerCoordinate={data.location.location.coordinates}
              style={{ flex: 1 }}
              styleURL={MapboxGL.StyleURL.Light}>
              <MapboxGL.PointAnnotation
                id='Pin'
                coordinate={data.location.location.coordinates}>
                <Image
                  style={{
                    flex: 1,
                    resizeMode: 'contain',
                    width: 25,
                    height: 25
                  }} />
              </MapboxGL.PointAnnotation>
            </MapboxGL.MapView>
          </View>
          <Card>
          <Text style={{ borderRadius:10,color:'gray',paddingTop:15}}>Location details</Text>

          </Card>

 



      </Content>
    </Container>

  )
}
}









function loginState(state) {

    return {
      user: state.user
    }
  }
  export default connect(loginState)(Mapbox)
  