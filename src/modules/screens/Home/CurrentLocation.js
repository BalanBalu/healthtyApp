
import { SET_PATIENT_LOCATION_DATA  } from '../../providers/bookappointment/bookappointment.action';
import { MAP_BOX_PUBLIC_TOKEN , IS_ANDROID } from '../../../setup/config';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { store } from '../../../setup/store';
import Axios from 'axios';
MapboxGL.setAccessToken(MAP_BOX_PUBLIC_TOKEN);

export default class CurrentLocation {
    static async getCurrentPosition() {
        console.log('Getting to current Location')
        if (IS_ANDROID) {
       
            isGranted = await MapboxGL.requestAndroidLocationPermissions();
            // await this.setState({
            //    isAndroidPermissionGranted: isGranted,
            //    isFetchingAndroidPermission: false,
            //  });
             if(isGranted) {
                 
                  RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000}).then(async (data) => {
                     
                      if(data === 'enabled') {
                         await this.timeout(1000);
                      }
                      console.log('You ARE RUNNING ON ANDROID')
                   navigator.geolocation.getCurrentPosition(async (position) => {
                      const origin_coordinates = [position.coords.latitude, position.coords.longitude, ];
                      const currentLocInfoByGeoIP = await Axios.get('https://geolocation-db.com/json/');
                      let currentLocationCity = '';
                      if(currentLocInfoByGeoIP.status === 200) {
                        currentLocationCity = currentLocInfoByGeoIP.data ? currentLocInfoByGeoIP.data.city : ''
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
                  alert("Please Enable Your Location to Provide the Better Results");
               // The user has not accepted to enable the location services or something went wrong during the process
               // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
               // codes : 
               //  - ERR00 : The user has clicked on Cancel button in the popup
               //  - ERR01 : If the Settings change are unavailable
               //  - ERR02 : If the popup has failed to open
             }); 
            }
           } else { 
              navigator.geolocation.getCurrentPosition(async (position) => {
                const origin_coordinates = [position.coords.latitude, position.coords.longitude, ];
                const currentLocInfoByGeoIP = await Axios.get('https://geolocation-db.com/json/');
                let currentLocationCity = '';
                
                if(currentLocInfoByGeoIP.status === 200) {
                  currentLocationCity = currentLocInfoByGeoIP.data ? currentLocInfoByGeoIP.data.city : ''
                  console.log('Fetching the location by ip success');
                }
                store.dispatch({
                  type: SET_PATIENT_LOCATION_DATA,
                  center: origin_coordinates,
                  isSearchByCurrentLocation: true,
                  locationName: currentLocationCity
                }) 
              }),
              error =>  {
                  console.log(error); 
             }, {enableHighAccuracy: false, timeout: 50000}
          }
    }
}