import { store } from '../../../setup/store';
import {  Alert } from 'react-native';
import rootNavigation from '../../../setup/rootNavigation';

export default class CheckLocationWarning {

    static async checkLocationWarning(fn, args) {
        const { bookappointment: { isLocationSelected, locationCordinates } } = store.getState();
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
            fn.apply(this, args);
        }
    }
}

