
import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Item, Text, Icon, Header, Left, Row, Grid, Col, Input, Container, Content, Right, Card } from 'native-base';
import { getSuggestionMedicines } from '../../../providers/pharmacy/pharmacy.action';
import { MAX_DISTANCE_TO_COVER } from '../../../../setup/config';
import { setCartItemCountOnNavigation } from '../CommomPharmacy'
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

class MedicineSuggestionList extends Component {


    constructor(props) {
        super(props);
        let medicineName = this.props.navigation.getParam('medicineName') || null
        this.state = {
            data: [],
            medicineName: medicineName,
            medicineSugesstionArray: null
        }
        this.callSuggestionService = debounce(this.callSuggestionService, 500);



    }
    componentDidMount() {
        const { medicineName } = this.state;
        if (medicineName !== null) {
            this.SearchKeyWordFunction(medicineName);
        }
        const { navigation } = this.props
        setCartItemCountOnNavigation(navigation);
    }
    SearchKeyWordFunction = async (enteredText) => {

        if (enteredText == '') {
            await this.setState({ medicineSugesstionArray: null, medicineName: enteredText })
        } else {
            await this.setState({ medicineName: enteredText })
            this.callSuggestionService(enteredText);
        }
    }
    callSuggestionService = async (enteredText) => {
        const userId = await AsyncStorage.getItem('userId');
        const { bookappointment: { locationCordinates } } = this.props;
        locationData = {
            "coordinates": locationCordinates,
            "maxDistance": MAX_DISTANCE_TO_COVER
        }
        let medicineResultData = await getSuggestionMedicines(enteredText, locationData);

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
        const { medicineSugesstionArray } = this.state
        return (
            <Container>
                <Content style={{ backgroundColor: '#F5F5F5', padding: 20 }}>


                    <View style={{ flex: 1, }}>
                        <Item style={{ borderBottomWidth: 0, backgroundColor: '#fff', height: 30, borderRadius: 2, borderWidth: 1, borderColor: 'gray' }}>
                            <Input
                                placeholder='Search for Medicines and Health Products...     '
                                style={{ fontSize: 12, width: '300%' }}
                                placeholderTextColor="#C1C1C1"
                                keyboardType={'default'}
                                returnKeyType={'go'}
                                value={this.state.medicineName}
                                autoFocus={true}
                                onChangeText={enteredText => this.SearchKeyWordFunction(enteredText)}
                                multiline={false} />
                            <TouchableOpacity style={{ alignItems: 'flex-end' }} >
                                <Icon name='ios-search' style={{ color: '#775DA3', fontSize: 20 }} />
                            </TouchableOpacity>
                        </Item>
                    </View>
                    {medicineSugesstionArray == null ?
                        null :
                        medicineSugesstionArray.length == 0 ?
                            <Card transparent style={{
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "20%"

                            }}>


                                <Text
                                    style={{
                                        fontFamily: "OpenSans",
                                        fontSize: 15,
                                        marginTop: "40%"

                                    }}
                                    note
                                >
                                    No medicine found
                        </Text>

                            </Card> :



                            <View style={{ flex: 1 }}>
                                <FlatList
                                    data={this.state.medicineSugesstionArray}
                                    ItemSeparatorComponent={this.itemSaperatedByListView}
                                    renderItem={({ item }) => (
                                        <Row style={{ borderBottomWidth: 0.3, borderBottomColor: '#cacaca' }} onPress={() => {

                                            this.props.navigation.navigate("medicineSearchList", { medicineName: item.value })
                                        }} >
                                            <Text style={{ padding: 10, fontFamily: 'OpenSans', fontSize: 13 }}>{item.value || ''}</Text>
                                            <Right>
                                                <Text style={{ padding: 10, fontFamily: 'OpenSans', fontSize: 13, color: '#7F49C3' }}>{item.type || ''}</Text>
                                            </Right>
                                        </Row>
                                    )}
                                    enableEmptySections={true}
                                    style={{ marginTop: 10 }}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                    }
                </Content>
            </Container>





        );
    }



}
function MedicineSuggestionListState(state) {

    return {
        bookappointment: state.bookappointment,


    }
}
export default connect(MedicineSuggestionListState)(MedicineSuggestionList)


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
