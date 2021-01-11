import React, { PureComponent } from 'react';
import { Text, Container, ListItem, List } from 'native-base';
import { connect } from 'react-redux'
import { View, FlatList, AsyncStorage } from 'react-native';
import { store } from '../../../setup/store';
import { SET_PATIENT_LOCATION_DATA, getLocations, getPharmacyLocations } from '../../providers/bookappointment/bookappointment.action';

class LocationDetail extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            pressStatus: false,
            selectedItem: 0,
            CorporateUser: false
        }
        const { navigation } = this.props;
        this.fetchPopularCityAreas(navigation.getParam('cityData'))
    }
    async fetchPopularCityAreas(cityData) {
        debugger
   
        let navigationOption = this.props.navigation.getParam('navigationOption') || null;

        let result;
        if (navigationOption !== null) {
            result = await getPharmacyLocations({
                fromPinCode: cityData.from_pincode,
                toPinCode: cityData.to_pincode
            });
            this.setState({ navigationOption: navigationOption })

        } else {
            result = await getLocations({
                fromPinCode: cityData.from_pincode,
                toPinCode: cityData.to_pincode
            });
            const isCorporateUser = await AsyncStorage.getItem('is_corporate_user') === 'true';
           
            this.setState({ CorporateUser: isCorporateUser })
            const { CorporateUser } = this.state
            if (CorporateUser === true) {
                this.setState({ navigationOption: 'CorporateHome' })
            } else {
                this.setState({ navigationOption: 'Home' })
            }
          
        }

        if (result.success) {
            const asscendingResult = this.asscendingSort(result.data)
            this.setState({ locations: asscendingResult });
        }
    }
    onPressList = (index) => {

        this.setState({ pressStatus: true, selectedItem: index });
    }
    asscendingSort(data) {
        const result = data.sort((a, b) => {
            if (a.location < b.location) {
                return -1;
            }
            if (b > a) {
                return 1;
            }
            return 0;
        })
        return result;

    }
    render() {
        const { locations, isLoading, navigationOption } = this.state
        const { navigation } = this.props;
        return (
            <Container>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={locations}
                        renderItem={({ item }) => (
                            <List>
                                <ListItem
                                    button
                                    onPress={() => {
                                        const data = {
                                            type: SET_PATIENT_LOCATION_DATA,
                                            center: item.coordinates,
                                            locationName: item.location,
                                            isSearchByCurrentLocation: false,
                                            isLocationSelected: true
                                        }
                                        store.dispatch(data);
                                        AsyncStorage.setItem('manuallyEnabledLocation', JSON.stringify(data))
                                        navigation.navigate(navigationOption)
                                    }}
                                    button >
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 13, }}>{item.location}</Text>
                                </ListItem>
                            </List>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>

            </Container>
        )
    }
}

function LocationState(state) {

    return {
        bookappointment: state.bookappointment
    }
}
export default connect(LocationState)(LocationDetail)

