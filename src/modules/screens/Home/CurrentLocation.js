
import { SET_PATIENT_LOCATION_DATA } from '../../providers/bookappointment/bookappointment.action';
import { MAP_BOX_PUBLIC_TOKEN, IS_ANDROID, MAP_BOX_TOKEN } from '../../../setup/config';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { BackHandler, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { store } from '../../../setup/store';
import Axios from 'axios';
MapboxGL.setAccessToken(MAP_BOX_PUBLIC_TOKEN);

export default class CurrentLocation {
  static async getCurrentPosition() {
    console.log('Getting to current Location')
    if (IS_ANDROID) {

      isGranted = await MapboxGL.requestAndroidLocationPermissions();
      console.log(isGranted)
      // await this.setState({
      //    isAndroidPermissionGranted: isGranted,
      //    isFetchingAndroidPermission: false,
      //  });
      if (isGranted) {

        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 }).then(async (data) => {
          if (data === 'enabled') {
            await this.timeout(1000);
          }
          console.log('You ARE RUNNING ON ANDROID')
          Geolocation.getCurrentPosition(async (position) => {
            const origin_coordinates = [position.coords.latitude, position.coords.longitude,];
            let fullPath = `https://api.mapbox.com/geocoding/v5/mapbox.places/${origin_coordinates[1]},${origin_coordinates[0]}.json?types=poi&access_token=${MAP_BOX_TOKEN}`;
            let resp = await Axios.get(fullPath, {
              headers: {
                'Content-Type': null,
                'x-access-token': null,
                'userId': null
              }
            });
            let locationData = resp.data.features[0];
            let currentLocationCity = '';
            if (locationData) {
              if (locationData.context) {
                placeData = locationData.context.find(ele => {
                  return ele.id.split('.')[0] === 'place';
                })
                currentLocationCity = placeData ? placeData.text : '';
              }
            }

            store.dispatch({
              type: SET_PATIENT_LOCATION_DATA,
              center: origin_coordinates,
              isSearchByCurrentLocation: true,
              locationName: currentLocationCity
            })
          }), error => {
            console.log(error);
            alert(JSON.stringify(error))
          }, { timeout: 500000, enableHighAccuracy: true };

        }).catch(err => {
          console.log(err);
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
          // codes : 
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
        });
      }
      else {
        // alert("Please Allow to access Your Location to be continue")
        //     BackHandler.exitApp() 

        Alert.alert(
          "Alert",
          "Your location permission is denied! To continue, turn on device location,",
          [
            { text: "OK", onPress: () => BackHandler.exitApp() }

          ],

        );
      }
    } else {
      Geolocation.getCurrentPosition(async (position) => {
        const origin_coordinates = [position.coords.latitude, position.coords.longitude,];

        let fullPath = `https://api.mapbox.com/geocoding/v5/mapbox.places/${origin_coordinates[1]},${origin_coordinates[0]}.json?types=poi&access_token=${MAP_BOX_TOKEN}`;
        //this._request(center[0].toFixed(2), center[1].toFixed(2))
        let resp = await Axios.get(fullPath, {
          headers: {
            'Content-Type': null,
            'x-access-token': null,
            'userId': null
          }
        });
        let locationData = resp.data.features[0];
        let currentLocationCity = '';
        if (locationData) {
          if (locationData.context) {
            placeData = locationData.context.find(ele => {
              return ele.id.split('.')[0] === 'place';
            })
            currentLocationCity = placeData ? placeData.text : '';
          }
        }

        store.dispatch({
          type: SET_PATIENT_LOCATION_DATA,
          center: origin_coordinates,
          isSearchByCurrentLocation: true,
          locationName: currentLocationCity
        })
      }),
        error => {
          console.log(error);
        }, { enableHighAccuracy: false, timeout: 50000 }
    }
  }
}