import React, { PureComponent } from 'react';
import { Text, Container,  ListItem, List } from 'native-base';
import { connect } from 'react-redux'
import { View, FlatList } from 'react-native';
import { store } from '../../../setup/store';
import { SET_PATIENT_LOCATION_DATA, getLocations, getPharmacyLocations } from '../../providers/bookappointment/bookappointment.action';

class LocationDetail extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            pressStatus: false,
            selectedItem: 0
        }
        const { navigation } = this.props;
        this.fetchPopularCityAreas(navigation.getParam('cityData'))
    }
    async fetchPopularCityAreas(cityData) {
       let  navigationOption=this.props.navigation.getParam('navigationOption')||null;
       
        let result;
        if(navigationOption!==null){
            result=await getPharmacyLocations({
                fromPinCode: cityData.from_pincode, 
                toPinCode: cityData.to_pincode
             });
             this.setState({navigationOption:navigationOption}) 

        }else{
     result = await getLocations({
         fromPinCode: cityData.from_pincode, 
         toPinCode: cityData.to_pincode
      });
      this.setState({navigationOption:'Home'}) 
    }
      
      if (result.success) {
        this.setState({ locations: result.data});
    }
    }
    onPressList = (index) => {

        this.setState({ pressStatus: true, selectedItem: index });
    }
    render() {
        const { locations, isLoading,navigationOption } = this.state
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
                                        store.dispatch({
                                            type: SET_PATIENT_LOCATION_DATA,
                                            center: item.coordinates,
                                            locationName: item.location,
                                            isSearchByCurrentLocation: false
                                        });
                                        navigation.navigate(navigationOption)
                                    }}
                                    button >
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 13, }}>{item.location}</Text>
                                </ListItem>
                            </List>
                        )} />
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

