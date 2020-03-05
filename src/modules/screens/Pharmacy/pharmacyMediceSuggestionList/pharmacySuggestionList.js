
import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Item, Text, Icon, Header, Left, Row, Grid, Col, Input, Container, Content, Right } from 'native-base';
import { getSuggestionMedicines } from '../../../providers/pharmacy/pharmacy.action';
import { MAP_BOX_PUBLIC_TOKEN, IS_ANDROID, MAX_DISTANCE_TO_COVER, CURRENT_PRODUCT_VERSION_CODE } from '../../../../setup/config';
import { connect } from 'react-redux'
const debounce = (fun, delay) => {
    let timer = null;
    return function (...args) {
        const context = this;
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fun.apply(context, args);
        }, delay);
    };
}

class PharmacySuggestionList extends Component {


    constructor(props) {
        super(props);
        this.state = {
            data: [],
            medicineSugesstionArray: []

        }
        this.callSuggestionService = debounce(this.callSuggestionService, 500);
    }
    componentDidMount() {
        // let object=this.props.getParams('coordinates')
        // data=this.state.data;
        // data.push(object)
        let data = []
        this.setState({ data })

    }
    SearchKeyWordFunction = async (enteredText) => {
        await this.setState({ visibleClearIcon: enteredText })
        this.callSuggestionService(enteredText);  // Call the Suggestion API with Debounce method
    }
    callSuggestionService = async (enteredText) => {
        console.log('clicked :' + this.count++)
        const userId = await AsyncStorage.getItem('userId');
        const { bookappointment: { locationCordinates } } = this.props;
        // locationData = {
        //     "coordinates":
        //         [
        //             8.1703556,
        //             77.386093
        //         ]
        //     ,
        //     "maxDistance": MAX_DISTANCE_TO_COVER
        // // }
       
        let medicineResultData = await getSuggestionMedicines(enteredText, locationCordinates);

        if (medicineResultData.success) {
            this.setState({
                medicineSugesstionArray: medicineResultData.data,
                searchValue: enteredText,
            });
        } else {

            this.setState({
                medicineSugesstionArray: [],
                searchValue: enteredText
            });
        }
    }

    render() {

        return (
            <Container>
                <Content style={{ backgroundColor: '#F5F5F5', padding: 20 }}>
                    <View style={{ flex: 1, }}>
                        <Item style={{ borderBottomWidth: 0, backgroundColor: '#fff', height: 30, borderRadius: 2, }}>
                            <Input
                                placeholder='Search for Medicines and Health Products...     '
                                style={{ fontSize: 12, width: '300%' }}
                                placeholderTextColor="#C1C1C1"
                                keyboardType={'default'}
                                returnKeyType={'go'}
                                value={this.state.visibleClearIcon}
                                onChangeText={enteredText => this.SearchKeyWordFunction(enteredText)}
                                multiline={false} />
                            <TouchableOpacity style={{ alignItems: 'flex-end' }} >
                                <Icon name='ios-search' style={{ color: '#775DA3', fontSize: 20 }} />
                            </TouchableOpacity>
                        </Item>
                    </View>

                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={this.state.medicineSugesstionArray}
                            ItemSeparatorComponent={this.itemSaperatedByListView}
                            renderItem={({ item }) => (
                                <Row style={{ borderBottomWidth: 0.1, borderBottomColor: 'gray' }} onPress={() => {

                                    this.props.navigation.navigate("medicineSearchList", { medicineName: item.value })
                                }} >
                                    <Text style={{ padding: 10, fontFamily: 'OpenSans', fontSize: 13 }}>{item.value || ''}</Text>
                                    <Right>
                                        <Text style={{ padding: 10, fontFamily: 'OpenSans', fontSize: 13 }}>{item.type || ''}</Text>
                                    </Right>
                                </Row>
                            )}
                            enableEmptySections={true}
                            style={{ marginTop: 10 }}
                            keyExtractor={(item, index) => index.toString()}
                        />

                    </View>
                </Content>
            </Container>





        );
    }



}
function PharmacySuggestionListState(state) {

    return {
        bookappointment: state.bookappointment,


    }
}
export default connect(PharmacySuggestionListState)(PharmacySuggestionList)


// export default mapRoutes = createStackNavigator(routes, {
//     initialRouteName: 'HospitalLocation',
//     headerMode: 'none',
//     navigationOptions: { headerVisible: false }
// })


const style = StyleSheet.create({


    welcome:
    {
        fontSize: 22,
        textAlign: 'center',
        marginTop: -10,
        fontFamily: 'opensans-semibold',

    },
    slide: {
        borderBottomWidth: 0,
        justifyContent: 'center',
        marginTop: '30%',
        paddingLeft: 30,
        paddingRight: 40,
        fontFamily: 'OpenSans',
    },

});
