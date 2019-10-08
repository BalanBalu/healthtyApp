import React, { Component } from 'react';
import { Text, Right, Container, Content, Icon , Spinner } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet,  View, TouchableOpacity, FlatList, ScrollView } from 'react-native';

import { store } from '../../../setup/store';
import { SET_PATIENT_LOCATION_DATA , getLocations } from '../../providers/bookappointment/bookappointment.action';
import CurrentLocation from './CurrentLocation';
class Locations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            locations: [],
            isLoading: false
        }
    }
    async componentDidMount() {
        this.setState({ isLoading : true })
        const result = await getLocations();
        console.log(result)
        this.setState({ isLoading : false })
        if(result.success) {
            this.setState( { locations: result.data });
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
    render() {
        const { locations, isLoading } = this.state
        return (
        <Container>
          <Content>
            {isLoading ?  <Spinner color='blue' /> : null }   
            <View style={styles.container}>
                  <TouchableOpacity style={styles.fab} onPress={() =>{
                        CurrentLocation.getCurrentPosition();
                        this.props.navigation.navigate("Home")
                   }}>
                  <Icon name="locate" style={styles.text}></Icon>
                  </TouchableOpacity>
                </View>
        
            <FlatList
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
                    this.props.navigation.navigate("Home")} } >
                    <Text style={{ padding: 10, fontFamily: 'OpenSans', fontSize: 13 }}>{item.location}</Text>
                </Row>
                )}
                enableEmptySections={true}
                style={{ marginTop: 10 }}
                keyExtractor={(item, index) => index.toString()}
            />
           
                
             </Content>
               
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    fab:{
      height: 50,
      width: 50,
      borderRadius: 200,
      position: 'absolute',
      bottom: 40,
      right: 30,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'#686cc3',
    },
    text:{
      fontSize:30,
      color:'white'
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

