
import { SET_PATIENT_LOCATION_DATA } from '../../providers/bookappointment/bookappointment.action';
import { MAP_BOX_PUBLIC_TOKEN, IS_ANDROID, MAP_BOX_TOKEN } from '../../../setup/config';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { BackHandler, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import{requestCalendarPermissions} from '../../../setup/calendarEvent';
import { store } from '../../../setup/store';
import Axios from 'axios';
import { CallKeepService } from '../VideoConsulation/services';
MapboxGL.setAccessToken(MAP_BOX_PUBLIC_TOKEN);
if(!IS_ANDROID) {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'always'
  });
}


export default class CurrentLocation {

  static async getCurrentPosition() {
  console.log('Getting to current Location')
try {
  if (IS_ANDROID) {
      setTimeout(async () => {

      
      isGranted = await MapboxGL.requestAndroidLocationPermissions();
      console.log('isGranted', isGranted);
     
      if (isGranted) {
          CallKeepService.setupCallkeep();
          console.log('You ARE RUNNING ON ANDROID')
          requestCalendarPermissions()
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
            console.log('error while Fetching the Location ', error);
            if (error.code === 1) {
              Alert.alert(
                "Alert",
                "Your GPS Location is Turned off. Please Enable your GPS Location to Continue use Medflic Services",
                [
                  { text: "OK", onPress: () => BackHandler.exitApp() }
                ]
              );
            }
          }, 
          { timeout: 500000, enableHighAccuracy: true, showLocationDialog: true, forceRequestLocation: true };
      }
      else {
        Alert.alert(
          "Alert",
          "Your location permission is denied! To continue, turn on device location,",
          [
            { text: "OK", onPress: () => BackHandler.exitApp() }

          ],

        );
      }
    });
  } else {
     setTimeout(async () => {
      Geolocation.requestAuthorization();
      CallKeepService.setupCallkeep();
      console.log('Getting Current Llocation Androud');
      Geolocation.getCurrentPosition(async (position) => {
        console.log('position '+ position);
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
        (error) => {
          console.log(error);
          if (error.code === 1) {
            Alert.alert(
              "Alert",
              "Your GPS Location is Turned off. Please Enable your GPS Location to Continue use Medflic Services",
              [
                { text: "OK", onPress: () => BackHandler.exitApp() }
              ]
            );
          }
        }, 
        { enableHighAccuracy: false, timeout: 1000 }
      });
    }
    
    } catch (error) {
        console.error('Exception on getting Location ', error); 
    }
  }
}