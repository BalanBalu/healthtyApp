import React, { Component } from 'react';
import { Text, Container, Icon, Spinner, Right, Left, List, ListItem, Content } from 'native-base';
import { Row } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';

import { store } from '../../../setup/store';
import { SET_PATIENT_LOCATION_DATA, getLocations, getPharmacyLocations } from '../../providers/bookappointment/bookappointment.action';
import CurrentLocation from './CurrentLocation';
class Locations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            locations: [],
            isLoading: false,
            pressStatus: false,
            selectedItem: 0
        }
    }


    async componentDidMount() {
        const navigationOption = this.props.navigation.getParam('navigationOption') || null

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
    onPressList = () => {

        // this.setState({ pressStatus: true, selectedItem: index });
        this.props.navigation.navigate("LocationDetail")
    }
    render() {
        const { locations, isLoading } = this.state
        const TopCities = [{ name: 'New Delhi' }, { name: 'Gurgaon' }, { name: 'Pune', }, { name: 'Mumbai' }, { name: 'Bengaluru' }, { name: 'Kolkata' }, { name: 'Hyderabad' }
        ]
        const OtherCities = [{ name: 'Adambakkam' }, { name: 'Adyar' }, { name: 'Alandur', }, { name: 'Anna Nagar' }, { name: 'Ayanavaram' }, { name: 'Adambakkam' }, { name: 'Adyar' }, { name: 'Alandur', }, { name: 'Anna Nagar' }, { name: 'Ayanavaram' }, { name: 'Adambakkam' }, { name: 'Adyar' }, { name: 'Alandur', }, { name: 'Anna Nagar' }, { name: 'Ayanavaram' },
        { name: 'Ashok Nagar' }]
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
                                    data={TopCities}
                                    renderItem={({ item }) => (


                                        <ListItem
                                            button
                                            onPress={() => this.onPressList()}
                                            button   >
                                            <Left>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 13, }}>{item.name}</Text>
                                            </Left>
                                            <Right style={{ marginRight: 10, }}>
                                                <Icon name="ios-arrow-forward" style={{ fontSize: 20 }} />
                                            </Right>
                                        </ListItem>

                                    )} />
                            </List>
                            <List>
                                <ListItem itemDivider>
                                    <Text>Other Cities</Text>
                                </ListItem>
                                <FlatList
                                    data={OtherCities}
                                    renderItem={({ item }) => (
                                        <ListItem
                                            button
                                            onPress={() => this.onPressList()}
                                            button   >
                                            <Left>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 13, }}>{item.name}</Text>
                                            </Left>
                                            <Right style={{ marginRight: 10, }}>
                                                <Icon name="ios-arrow-forward" style={{ fontSize: 20 }} />
                                            </Right>
                                        </ListItem>


                                    )} />
                            </List>
                        </View>
                    </View>
                </Content>
                <View>
                    <TouchableOpacity style={styles.fab} onPress={() => {
                        CurrentLocation.getCurrentPosition();
                        this.props.navigation.navigate("Home")
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

