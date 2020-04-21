import React, { Component } from 'react';
import { Text, Container, Icon, Spinner, ListItem, List } from 'native-base';
import { Row } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';


class LocationDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pressStatus: false,
            selectedItem: 0
        }
    }
    onPressList = (index) => {

        this.setState({ pressStatus: true, selectedItem: index });
    }
    render() {
        const { locations, isLoading } = this.state
        const location = [{ name: 'Adambakkam' }, { name: 'Adyar' }, { name: 'Alandur', }, { name: 'Anna Nagar' }, { name: 'Ayanavaram' }, { name: 'Adambakkam' }, { name: 'Adyar' }, { name: 'Alandur', }, { name: 'Anna Nagar' }, { name: 'Ayanavaram' }, { name: 'Adambakkam' }, { name: 'Adyar' }, { name: 'Alandur', }, { name: 'Anna Nagar' }, { name: 'Ayanavaram' },
        { name: 'Ashok Nagar' }]
        return (
            <Container>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={location}
                        renderItem={({ item }) => (
                            <List>
                                <ListItem
                                    button
                                    onPress={() => this.onPressList(index)}
                                    button >
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 13, }}>{item.name}</Text>
                                </ListItem>
                            </List>
                        )} />
                </View>

            </Container>
        )
    }
}
const styles = StyleSheet.create({

});

export default LocationDetail

