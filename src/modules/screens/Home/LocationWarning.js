import { store } from '../../../setup/store';
import {  Alert } from 'react-native';
import rootNavigation from '../../../setup/rootNavigation';

export default class CheckLocationWarning {

    static async checkLocationWarning(fn, args) {
        const { bookappointment: { isLocationSelected, locationCordinates } } = store.getState();
        console.log('Getting to Location Warning', isLocationSelected);
        console.log(locationCordinates);
        if (!isLocationSelected) {
            Alert.alert(
                "Location Warning",
                "The Location is Not choose, To continue Please choose your Location",
                [
                    { text: "Cancel" },
                    {
                        text: "OK", onPress: () => rootNavigation.navigate('Locations'),
                    }
                ],
            );
            return
        } else {
            console.log(args);
            fn.apply(this, args);
        }
    }
}

