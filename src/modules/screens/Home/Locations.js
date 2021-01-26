import React, { PureComponent } from 'react';
import { Text, Container, Icon, Spinner, Right, Left, List, ListItem, Content } from 'native-base';
import { Row } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, View, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';

import { store } from '../../../setup/store';
import { SET_PATIENT_LOCATION_DATA, getLocations, getPharmacyLocations } from '../../providers/bookappointment/bookappointment.action';
import CurrentLocation from './CurrentLocation';
import { getPopularCities } from '../../providers/locations/location.action';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

class Locations extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            locations: [],
            popularLocations: [],
            isLoading: false,
            pressStatus: false,
            selectedItem: 0,
            CorporateUser: false
        }
    }


    async componentDidMount() {
        const navigationOption = this.props.navigation.getParam('navigationOption') || null
        const popularCitiesResp = this.getPopularCities()
        this.setState({ isLoading: true })
        if (navigationOption != null) {
            const pharmacyResult = await getPharmacyLocations();

            this.setState({ isLoading: false })
            if (pharmacyResult.success) {
                this.setState({ locations: pharmacyResult.data });
            }
        } else {
            const result = await getLocations();
            this.setState({ isLoading: false })
            if (result.success) {
                this.setState({ locations: result.data });
            }
        }
    }
    getPopularCities = async () => {
        const result = await getPopularCities();

        if (result.success) {
            this.setState({ popularLocations: result.data });
        }
    }
    itemSaperatedByListView = () => {
        return (
            <View
                style={{
                    padding: 4,
                    borderBottomColor: 'gray',
                    borderBottomWidth: 0.5
                }}
            />
        );
    };
    onPressList = (cityInfo) => {
        let value = this.props.navigation.getParam('navigationOption') || null
        this.props.navigation.navigate("LocationDetail", { cityData: cityInfo, navigationOption: value })
    }
    render() {
        const { locations, isLoading, popularLocations } = this.state

        return (
            <Container>

                {isLoading ? <Spinner color='blue' /> : null}
                <Content>
                    <View style={{ flex: 1 }}>
                        {/* <FlatList
                        data={locations}
                        ItemSeparatorComponent={this.itemSaperatedByListView}
                        renderItem={({ item }) => (
                            <Row onPress={() => {
                                store.dispatch({
                                    type: SET_PATIENT_LOCATION_DATA,
                                    center: item.coordinates,
                                    locationName: item.location,
                                    isSearchByCurrentLocation: false
                                })
                                this.props.navigation.pop()
                            }} >
                                <Left>
                                    <Text style={{ padding: 10, fontFamily: 'OpenSans', fontSize: 13 }}>{item.location}</Text>
                                </Left>
                               
                            </Row>
                        )}
                        enableEmptySections={true}
                        style={{ marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                    /> */}
                        <View>
                            <List>
                                <ListItem itemDivider>
                                    <Text> Popular Cities</Text>
                                </ListItem>
                                <FlatList
                                    data={popularLocations}
                                    extraData={popularLocations}

                                    renderItem={({ item }) => (
                                        <ListItem
                                            button
                                            onPress={() => this.onPressList(item)}
                                            button>
                                            <Left>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 13, }}>{item.city_name}</Text>
                                            </Left>
                                            <Right style={{ marginRight: 10, }}>
                                                <MaterialIcons name="keyboard-arrow-right" style={{ fontSize: 20 }} />
                                            </Right>
                                        </ListItem>

                                    )}
                                    keyExtractor={(item, index) => index.toString()} />
                            </List>
                            <List>
                                <ListItem itemDivider>
                                    <Text>Other Cities</Text>
                                </ListItem>
                                <FlatList
                                    data={locations}
                                    renderItem={({ item }) => (
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
                                                store.dispatch(data)
                                                AsyncStorage.setItem('manuallyEnabledLocation', JSON.stringify(data))

                                                this.props.navigation.pop()
                                            }}
                                            button>

                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 13, }}>{item.location}</Text>

                                        </ListItem>


                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </List>
                        </View>
                    </View>
                </Content>
                <View>
                    <TouchableOpacity style={styles.fab} onPress={async () => {
                        await AsyncStorage.removeItem('manuallyEnabledLocation');
                        CurrentLocation.getCurrentPosition();
                        const isCorporateUser = await AsyncStorage.getItem('is_corporate_user') === 'true';
                       
                        this.setState({ CorporateUser: isCorporateUser })
                        const { CorporateUser } = this.state
                        if (CorporateUser === true) {
                            this.props.navigation.navigate('CorporateHome');
                        } else {
                            this.props.navigation.navigate('Home');
                        }
                    }}>
                        <Icon name="locate" style={styles.text}></Icon>
                    </TouchableOpacity>
                </View>


            </Container>
        )
    }
}
const styles = StyleSheet.create({
    fab: {
        height: 50,
        width: 50,
        borderRadius: 200,
        position: 'absolute',
        bottom: 40,
        right: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#686cc3',
    },
    text: {
        fontSize: 30,
        color: 'white'
    },
    container: {
        ...StyleSheet.absoluteFillObject,
        alignSelf: 'flex-end',
        marginTop: 20,
        position: 'absolute',
    },
});
function LocationState(state) {

    return {
        bookappointment: state.bookappointment
    }
}
export default connect(LocationState)(Locations)

