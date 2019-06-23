import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Container } from 'native-base';
import { View, } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {IS_ANDROID } from '../../../setup/config';
import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';
let token = 'sk.eyJ1IjoidmFpcmFpc2F0aGlzaCIsImEiOiJjand4NWV2djQwZGFkNDNtejhkYXVwbW0zIn0.SxLkBv_NwpDKUIl-e499rg';
const directionsClient = MapboxDirectionsFactory({accessToken : token});
MapboxGL.setAccessToken(token);
import {lineString as makeLineString} from '@turf/helpers';

const layerStyles = {
  origin: {
    circleRadius: 5,
    circleColor: 'green',
  },
  destination: {
    circleRadius: 5,
    circleColor: 'green',
  },
  route: {
    lineColor: 'green',
    lineCap: MapboxGL.LineJoin.Round,
    lineWidth: 3,
    lineOpacity: 0.84,
  },
  progress: {
    lineColor: '#314ccd',
    lineWidth: 3,
  },
};
class Mapbox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      zoom: 12,
      route: null,
      coordinates : [ 77.5946, 12.9716 ],
      center: null,
      currentLocation: null,
      hospitaldestination: null,
      directions: {}
    }
  }

  async componentDidMount() {
    debugger
    let isGranted = true;
    if (IS_ANDROID) {
      isGranted = await MapboxGL.requestAndroidLocationPermissions();
      this.setState({
        isAndroidPermissionGranted: isGranted,
        isFetchingAndroidPermission: false,
      });
    }
   if(isGranted) {
      await this.getUserLocation();
   }
  }

  async fetchDirections () {
    
    console.log(this.state.currentLocation);
    console.log(this.state.hospitaldestination)
    const reqOptions = {
      waypoints: [
        {coordinates: this.state.currentLocation },
        {coordinates: this.state.hospitaldestination}
      ],
      profile: 'driving',
      geometries: 'geojson',
    };
    
    const res = await directionsClient.getDirections(reqOptions).send();
    if (res !== null) {
      if(res.body) { 
      const centerCoodinateIntex  = parseInt(res.body.routes[0].geometry.coordinates.length / 2);
      const centerCoordinates = res.body.routes[0].geometry.coordinates[centerCoodinateIntex];
        
      this.setState({
        route: makeLineString(res.body.routes[0].geometry.coordinates),
        center : centerCoordinates
      });
      console.log(res.body.routes[0]);
    }
  }
  }
  

  async onDidFinishLoadingMap() {
    const zoom = await this._map.getZoom();
    console.log('the zoom is ' + zoom)
    this.setState( { zoom : 14});
  }
  async getUserLocation() {
    //const { navigation, hospitalLocation } = this.props;
    const { hospitalLocation } = this.props
    const data = hospitalLocation // navigation.getParam('coordinates');
    //data.location.location.coordinates = [13.0694, 80.1948]; //chennai location
    hospitaldestination = [
      data.location.location.coordinates[1],
      data.location.location.coordinates[0]
    ]
    await this.setState({hospitaldestination : hospitaldestination })

    navigator.geolocation.getCurrentPosition(this.success,  
      (error) => alert(JSON.stringify(error)),
      { enableHighAccuracy: true }
    )
  }
    success = async (position) => {
      const origin_coordinates = [position.coords.longitude, position.coords.latitude];
      this.setState({
        currentLocation: origin_coordinates,
      })
      await this.fetchDirections();
    }  
  
renderOrigin(coordinates) {
  let backgroundColor = '#808080';

  if (this.state.currentPoint) {
    backgroundColor = '#314ccd';
  }

  const style = [layerStyles.origin, {circleColor: backgroundColor}];

  return (
    <MapboxGL.ShapeSource
      id="origin"
      shape={MapboxGL.geoUtils.makePoint(coordinates)}>
      <MapboxGL.Animated.CircleLayer id="originInnerCircle" style={style} />
    </MapboxGL.ShapeSource>
  );
}

  renderDestination(destinationCoordinates) {
    let backgroundColor = '#808080';
    if (this.state.currentPoint) {
      backgroundColor = '#314ccd';
    }
  
    const style = [layerStyles.origin, {circleColor: backgroundColor}];
    return (
      <MapboxGL.ShapeSource
        id="destination"
        shape={MapboxGL.geoUtils.makePoint(destinationCoordinates)}>
        <MapboxGL.Animated.CircleLayer id="destinationInnerCircle" style={style} />
      </MapboxGL.ShapeSource>
    );
  }

  renderRoute() {
    if (!this.state.route) {
      return null;
    }

    return (
      <MapboxGL.ShapeSource id="routeSource" shape={this.state.route}>
        <MapboxGL.LineLayer
          id="routeFill"
          style={layerStyles.route}
          belowLayerID="originInnerCircle"
        />
      </MapboxGL.ShapeSource>
    );
   }
   

  render() {
   
    return (
      
      <Container>
       
       <View style={{ flex: 1 }}>
        <MapboxGL.MapView
          ref={c => (this._map = c)}
          styleURL={MapboxGL.StyleURL.TrafficDay}
          style={{flex: 1}}
        >
        {this.state.center !== null ?  
          <MapboxGL.Camera
            zoomLevel={12}
            centerCoordinate={this.state.center}
          />: null }
          {this.state.currentLocation !== null ? 
              this.renderOrigin(this.state.currentLocation)
          : null } 
          {this.state.hospitaldestination !== null ? 
             this.renderDestination(this.state.hospitaldestination)
          : null } 
          {this.renderRoute()}
        </MapboxGL.MapView>
      </View>
    </Container>

    )
  }
}

export default Mapbox
