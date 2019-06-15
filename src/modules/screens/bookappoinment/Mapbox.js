import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Container, Content, Card, Text } from 'native-base';
import { StyleSheet, View, Image, PermissionsAndroid } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
// import MapboxClient from 'mapbox';
let token = 'sk.eyJ1IjoidmFpcmFpc2F0aGlzaCIsImEiOiJjand4NWV2djQwZGFkNDNtejhkYXVwbW0zIn0.SxLkBv_NwpDKUIl-e499rg';

//let token = 'pk.eyJ1IjoiYnJpdmluc3JlZSIsImEiOiJjanc2Y3hkZHcxOGhvNDVwOXRhMWo2aDR1In0.EV8iYtfMxEcRcn8HcZ0ZPA';
MapboxGL.setAccessToken(token);

const featureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: '9d10456e-bdda-4aa9-9269-04c1667d4552',
      properties: {
        icon: 'example',
      },
      geometry: {
        type: 'Point',
        coordinates: [-117.20611157485, 52.180961084261],
      },
    },
    {
      type: 'Feature',
      id: '9d10456e-bdda-4aa9-9269-04c1667d4552',
      properties: {
        icon: 'airport-15',
      },
      geometry: {
        type: 'Point',
        coordinates: [-117.205908, 52.180843],
      },
    },
    {
      type: 'Feature',
      id: '9d10456e-bdda-4aa9-9269-04c1667d4552',
      properties: {
        icon: 'pin',
      },
      geometry: {
        type: 'Point',
        coordinates: [-117.206562, 52.180797],
      },
    },
  ],
};

const SF_ZOO_COORDINATE = [-122.505412, 37.737463];
const DEFAULT_CENTER_COORDINATE = [-77.036086, 38.910233];
const SF_OFFICE_COORDINATE = [-122.400021, 37.789085];
const styles = StyleSheet.create({
  buttonCnt: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  button: {
    borderRadius: 3,
    backgroundColor: 'blue',
  },
});

const layerStyles = {
  origin: {
    circleRadius: 5,
    circleColor: 'white',
  },
  destination: {
    circleRadius: 5,
    circleColor: 'white',
  },
  route: {
    lineColor: 'white',
    lineCap: MapboxGL.LineJoin.Round,
    lineWidth: 3,
    lineOpacity: 0.84,
  },
  progress: {
    lineColor: '#314ccd',
    lineWidth: 3,
  },
};


// const styles = MapboxGL.StyleSheet.create({
//   directionsLine: {
//     lineWidth: 3,
//     lineCap: MapboxGL.LineCap.Round,
//     lineJoin: MapboxGL.LineJoin.Round,
//   },
// });
class Mapbox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      zoom: 12,
      coordinates : [ 77.5946, 12.9716 ],
      center:[ 77.5946, 12.9716 ],
      currentLocation: null,
      mapboxClient:null,
      directions: {}
    }
  }

  async componentDidMount() {
    //console.log(this.props.navigation);
    const { navigation } = this.props;
    const data = navigation.getParam('coordinates');
    data.location.location.coordinates = [13.0694, 80.1948]; //chennai location
    hospitaldestination = {
      lat: data.location.location.coordinates[1],
      lon: data.location.location.coordinates[0]
    }
    //this.fetchDirections([77.5946, 12.9716], [80.2707, 13.0827])
   // await this.getUserLocation();
        // await this.requestLocationPermission();

    /*fetch directions*/
    // this.setState({ mapboxClient: new MapboxClient(token) }, () => {
    //   this.fetchDirections(this.state.currentLocation,this.props.coordinates);
    // });
    // console.log(this.state.mapboxClient);


    /*zoom*/
    // const zoomMap = await this._map.getZoom();
    // this.setState({currentZoom:zoomMap})
    // console.log(JSON.stringify(this.state.currentZoom)+'hai');



  }

  async fetchDirections (origin, dest) {
    const originLatLng = {
      latitude: origin[1],
      longitude: origin[0],
    };
    
    const destLatLng = {
      latitude: dest[1],
      longitude: dest[0],
    };
  
    const requestOptions = {
      profile: 'mapbox/driving',
      geometry: 'polyline',
    };
  
    let res = null;
    // try {
    //   res = await mapboxClient.getDirections([
    //     originLatLng,
    //     destLatLng,
    //   ], requestOptions);
    //   console.log(res);
    // } catch (e) {
    //   console.log(e);
    // }

     res = {"routes":[{"geometry":"_qdnA}erxMym@so@jeAymO{gAcq@d`B_aBus@}v@hYaqDkaDyeIxtBwsF_qAksGjjAeeE}`BsaCriBcaFimBsfGn}@ioJfuDm|FnsAt[th@wsCejActDhc@_sDgoAk{Abk@krAdtDbT_MafHh|GmuFnmBkjHtVajKrgEgoEj|A}zHjqD__Fq`@qfFfkHcFhbAbpA|oEqzIscJwjJs_QqyEq@ihIylCuqFsvOapLlz@wiGhqBgqCyyA{|@bP{uCo_BshC~kAsy@dGwqE_wB{tCtz@qrCap@c~HozByiCgQny@iqAqCc~O_mVrl@qgCduDq}AggCowFlLa}CxaB^liBsxDoPyiLddC_eKnbBkEiTikKt{A_}DafAg|MzqBwj@ebCyoMgcDs[ulF_cJmlJccDli@ewAwqBooF`gEk|O}uCgbMjfA_w@{UitEvaEevI{bB}xLnnAkkC","legs":[{"summary":"","weight":132858.1,"duration":101246.3,"steps":[],"distance":412192.5}],"weight_name":"cyclability","weight":132858.1,"duration":101246.3,"distance":412192.5}],"waypoints":[{"distance":28.81826822414868,"name":"Vittal Mallya Road","location":[77.594708,12.971838]},{"distance":20.687105589137264,"name":"","location":[80.270699,13.082513]}],"code":"Ok","uuid":"cjwxb3paq003742s1vidk4ppf"}
    
    if (res !== null) {
      const directions = res.entity.routes[0];
      this.setState({ directions: directions });
    }
  }
  

  async onDidFinishLoadingMap() {
    const zoom = await this._map.getZoom();
    console.log('the zoom is ' + zoom)
    this.setState( { zoom : 14});
  }
  getUserLocation(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // const zoomMap = this._map.getZoom();
        const origin_coordinates = [position.coords.longitude, position.coords.latitude];

        console.log(JSON.stringify(position) + 'position origin_coordinates');
        this.setState({
       //   currentLocation: MapboxGL.geoUtils.makePoint(origin_coordinates),
        })
      },

      (error) => alert(JSON.stringify(error)),
      { enableHighAccuracy: true }
    )
  }

  


  
// requestLocationPermission() {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {

//           'title': 'Location Permission',
//           'message': 'This App needs access to your location ' +
//             'so we can know where you are.'
//         }
//       )
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log("In mobile.Please enable the location ")
//       } else {
//         console.log("Location permission denied")
//       }
//     } catch (err) {
//       console.warn(err)
//     }
//   }

renderOrigin() {
  let backgroundColor = 'white';

  if (this.state.currentPoint) {
    backgroundColor = '#314ccd';
  }

  const style = [layerStyles.origin, {circleColor: backgroundColor}];

  return (
    <MapboxGL.ShapeSource
      id="origin"
      shape={MapboxGL.geoUtils.makePoint(SF_OFFICE_COORDINATE)}>
      <MapboxGL.Animated.CircleLayer id="originInnerCircle" style={style} />
    </MapboxGL.ShapeSource>
  );
}

  renderDestination() {

    let backgroundColor = 'white';

    if (this.state.currentPoint) {
      backgroundColor = '#314ccd';
    }
  
    const style = [layerStyles.origin, {circleColor: backgroundColor}];
  
    return (
      <MapboxGL.ShapeSource
        id="destination"
        shape={MapboxGL.geoUtils.makePoint(SF_ZOO_COORDINATE)}>
        <MapboxGL.Animated.CircleLayer id="destinationInnerCircle" style={style} />
      </MapboxGL.ShapeSource>
    );
  }

  render() {
    const directions = this.state.directions;
    return (
      <Container>
       
       <View style={{ flex: 1 }}>

       <MapboxGL.MapView
          ref={c => (this._map = c)}
          //onPress={this.onPress}
          styleURL={MapboxGL.StyleURL.Dark}
          style={{flex: 1}}
        >
          <MapboxGL.Camera
            zoomLevel={4}
            centerCoordinate={SF_ZOO_COORDINATE}
          />
          {this.renderOrigin()}
          {this.renderDestination()}


     
          {/* {/* <MapboxGL.ShapeSource
            id="exampleShapeSource"
            shape={featureCollection}
            //images={{example: exampleIcon, assets: ['pin']}}
          >
            <MapboxGL.SymbolLayer id="exampleIconName" style={styles.icon} />
          </MapboxGL.ShapeSource> */}
        </MapboxGL.MapView>

          {/* <MapboxGL.MapView
            ref={(c) => this._map = c}
            style={{ flex: 1 }}
            zoomLevel={this.state.zoom}
            compassEnabled={false}
            centerCoordinate={this.state.center}
            showUserLocation={false}
            
          >

            <MapboxGL.PointAnnotation
              id={'Map Center Pin'}
              title={'Chennai'}
              coordinate={this.state.center}>
              <Image
                source={require('../../../../assets/images/menu.png')}
                style={{
                  flex: 1,
                  resizeMode: 'contain',
                  width: 25,
                  height: 25
                }} />
            </MapboxGL.PointAnnotation>
          </MapboxGL.MapView> */}
        </View>
          

              {/* <MapboxGL.PointAnnotation
                id='Pin'
                coordinate={[ 77.59, 12.9716 ]}>
                <Image
                  style={{
                    flex: 1,
                    resizeMode: 'contain',
                    width: 25,
                    height: 25
                  }} />
              </MapboxGL.PointAnnotation> */}

              {/* <MapboxGL.ShapeSource id='store-locator-current-location-source' shape={this.state.currentLocation}>
                <MapboxGL.CircleLayer
                  id='store-locator-current-location-outer-circle'
                />
                <MapboxGL.CircleLayer
                  id='store-locator-current-location-inner-circle'
                  aboveLayerID='store-locator-current-location-outer-circle'
                />
              </MapboxGL.ShapeSource> */}

          
          
          {/* <Content contentContainerStyle={{ flex: 1 }}>
          <Card>
            <Text style={{ borderRadius: 10, color: 'gray', paddingTop: 15 }}>Location details</Text>

          </Card>

        </Content> */}
       
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
