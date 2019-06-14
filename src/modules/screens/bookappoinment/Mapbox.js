import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Container, Content, Card, Text } from 'native-base';
import { StyleSheet, View, Image, PermissionsAndroid } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
// import { Directions } from 'react-native-gesture-handler';

let token = 'pk.eyJ1IjoiYnJpdmluc3JlZSIsImEiOiJjanc2Y3hkZHcxOGhvNDVwOXRhMWo2aDR1In0.EV8iYtfMxEcRcn8HcZ0ZPA';

MapboxGL.setAccessToken(token);
class Mapbox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentLocation: null,

    }

  }

  async componentDidMount() {
    console.log("Component")
    await this.requestLocationPermission();
    // data.location.location.coordinates = [13.0694, 80.1948];
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const origin_coordinates = [position.coords.longitude, position.coords.latitude];

        console.log(JSON.stringify(position) + 'position origin_coordinates');
        this.setState({
          currentLocation: MapboxGL.geoUtils.makePoint(origin_coordinates),
        })
      },

      (error) => alert(JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 3600000 }

    )


  }
  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {

          'title': 'Location Permission',
          'message': 'This App needs access to your location ' +
            'so we can know where you are.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("In mobile.Please enable the location ")
      } else {
        console.log("Location permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }


  render() {
    const { navigation } = this.props;
    const data = navigation.getParam('coordinates');
    data.location.location.coordinates = [13.0694, 80.1948]; //chennai location
    var hospitaldestination = {
      lat: data.location.location.coordinates[1],
      lon: data.location.location.coordinates[0]
    }


    return (
      <Container>
        <Content contentContainerStyle={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <MapboxGL.MapView
              ref={c => (this._map = c)}
              zoomLevel={25}
              zoomEnabled={true}
              showUserLocation={true}
              centerCoordinate={[hospitaldestination.lat, hospitaldestination.lon]}
              style={{ flex: 1 }}
              styleURL={MapboxGL.StyleURL.Light}
            >

              <MapboxGL.PointAnnotation
                id='Pin'
                coordinate={[hospitaldestination.lat, hospitaldestination.lon]}>
                <Image
                  style={{
                    flex: 1,
                    resizeMode: 'contain',
                    width: 25,
                    height: 25
                  }} />
              </MapboxGL.PointAnnotation>

              <MapboxGL.ShapeSource id='store-locator-current-location-source' shape={this.state.currentLocation}>
                <MapboxGL.CircleLayer
                  id='store-locator-current-location-outer-circle'
                />
                <MapboxGL.CircleLayer
                  id='store-locator-current-location-inner-circle'
                  aboveLayerID='store-locator-current-location-outer-circle'
                />
              </MapboxGL.ShapeSource>

            </MapboxGL.MapView>
          </View>

          <Card>
            <Text style={{ borderRadius: 10, color: 'gray', paddingTop: 15 }}>Location details</Text>

          </Card>





        </Content>
      </Container>

    )
  }
}
const styles = StyleSheet.create({


});








function loginState(state) {

  return {
    user: state.user
  }
}
export default connect(loginState)(Mapbox)
