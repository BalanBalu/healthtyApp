
import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, AsyncStorage, FlatList, ActivityIndicator, BackHandler, Alert } from 'react-native';
import { Item, Text, Icon, Header, Left, Input, Container, Content, Right, Card, Button } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { MAX_DISTANCE_TO_COVER } from '../../../setup/config';
import { getSpecialistDataSuggestions } from '../../providers/catagries/catagries.actions';
import { debounce } from '../../common';
import LocationWarning from './LocationWarning';
class RenderSuggestionsList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            suggestionList: [],
            searchValue: null,
            visibleClearIcon: '',
            isLoading: false
        }
        this.callGetSuggestionListService = debounce(this.callGetSuggestionListService, 300);
    }
    componentWillMount() {
        LocationWarning.checkLocationWarning( this.callGetSuggestionListService.bind(this), ['Primary', true]);    
       // this.callGetSuggestionListService('Primary', true)
    }

    callGetSuggestionListService = async (enteredText, suggestionTextDisable) => {
        try {
            this.setState({ isLoading: true })
            const { bookappointment: { locationCordinates } } = this.props;
            const suggestionReqData = {
                locationData: {
                    "coordinates": locationCordinates,
                    "maxDistance": MAX_DISTANCE_TO_COVER
                },
                inputText: enteredText
            }
            let resultOfSuggestionData = await getSpecialistDataSuggestions('suggestion', suggestionReqData);
            // console.log('resultOfSuggestionData.data' + JSON.stringify(resultOfSuggestionData.data))
            if (resultOfSuggestionData.success) {
                this.setState({ suggestionList: resultOfSuggestionData.data, searchValue: suggestionTextDisable ? '' : enteredText });
            } else {
                this.setState({ suggestionList: [], searchValue: suggestionTextDisable ? '' : enteredText });
            }
        } catch (Ex) {
            console.log('Ex is getting on get Suggestions list details for Patient====>', Ex)
            return {
                success: false,
                statusCode: 500,
                error: Ex,
                message: `Exception while getting on Suggestions list details for Patient : ${Ex}`
            }
        }
        finally {
            this.setState({ isLoading: false })
        }
    }

    getSuggestionListFunction = async (enteredText) => {
        await this.setState({ visibleClearIcon: enteredText })
        this.callGetSuggestionListService(enteredText);  // Call the Suggestion API with Debounce method
    }

    clearTotalTextFromSearchBar = () => {
        this.setState({ visibleClearIcon: null, suggestionList: null, searchValue: null })
    };
    itemSeparatedByListView = () => {
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

    navigateToSearchListPage(item) {
        LocationWarning.checkLocationWarning(this.navigateDoctorSearchList.bind(this), [ item ]);
    }
    navigateDoctorSearchList = (item) => {
        console.log('Calling Navigate Doctor Search List FN', item);
        const { bookappointment: { isLocationSelected, locationCordinates } } = this.props;
        let reqData4SearchDocList = {
            locationDataFromSearch: {
                type: 'geo',
                "coordinates": locationCordinates,
                maxDistance: MAX_DISTANCE_TO_COVER
            }
        }
        if (item) {
            reqData4SearchDocList = { inputKeywordFromSearch: item.value, ...reqData4SearchDocList }
        }
        console.log('reqData4SearchDocList===>', JSON.stringify(reqData4SearchDocList));
        this.props.navigation.navigate("Doctor Search List", reqData4SearchDocList);
    }

    render() {
        const { suggestionList, searchValue, visibleClearIcon, isLoading } = this.state;
        const { bookappointment: { isLocationSelected, patientSearchLocationName, locationCordinates, isSearchByCurrentLocation } } = this.props;
        const locationText = isLocationSelected ? isSearchByCurrentLocation ? 'All Doctors in Near Current Location' : 'All Doctors in ' + patientSearchLocationName + ' City' : 'Please Choose your Location in Map';
        return (
            <Container style={{ flex: 1 }}>
                <Row style={styles.SearchRow}>
                    <Col size={0.9} style={styles.SearchStyle}>
                        <TouchableOpacity style={{ justifyContent: 'center' }}>
                            <Icon name="ios-search" style={{ color: '#fff', fontSize: 20, padding: 2 }} />
                        </TouchableOpacity>
                    </Col>
                    <Col size={8.1} style={{ justifyContent: 'center', }}>
                        <Input
                            placeholder="Search for Symptoms/Services,etc"
                            style={styles.inputfield}
                            placeholderTextColor="#929191"
                            keyboardType={'email-address'}
                            returnKeyType={'done'}
                            autoFocus={true}
                            value={visibleClearIcon}
                            onChangeText={enteredText => this.getSuggestionListFunction(enteredText)}
                            underlineColorAndroid="transparent"
                            blurOnSubmit={false}
                        />
                    </Col>
                    <Col size={1.0} style={{ justifyContent: 'center' }}>
                        {visibleClearIcon != '' ?
                            <Button transparent onPress={() => this.clearTotalTextFromSearchBar()} style={{ justifyContent: 'flex-start', marginLeft: -10 }}>
                                <Icon name="ios-close" style={{ fontSize: 25, color: 'gray' }} />
                            </Button>
                            : null}
                    </Col>

                </Row>
                <TouchableOpacity onPress={() => this.navigateToSearchListPage()} style={{ marginTop: 5, paddingLeft: 2, paddingRight: 2, marginBottom: 5 }}>
                    <Text style={styles.valueText}>{locationText}</Text>
                </TouchableOpacity>
                <Content style={{ backgroundColor: '#F5F5F5', paddingLeft: 2, paddingRight: 2, paddingBottom: 20, flex: 1 }}>
                    {searchValue != null ?
                        <FlatList
                            data={suggestionList}
                            extraData={[searchValue, suggestionList]}
                            ItemSeparatorComponent={this.itemSeparatedByListView}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity onPress={() => this.navigateToSearchListPage(item)}>
                                    <Row>
                                        <Col size={7}>
                                            <Text style={styles.valueText}>{item.value}</Text>
                                            {item.address ? <Text style={{ marginTop: 2, fontFamily: 'OpenSans', fontSize: 13, color: '#9c9b9f', paddingLeft: 10, }}>{item.address}</Text> : null}

                                        </Col>
                                        {/* <Col size={3}> */}
                                        <Col size={2.5} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            {item.profile_image ? <Image
                                                source={{ uri: item.profile_image.imageURL }}
                                                style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }} /> :
                                                <Text uppercase={true} style={styles.typeStyle} >{item.type}</Text>
                                            }
                                        </Col>
                                    </Row>
                                </TouchableOpacity>
                            )}
                            enableEmptySections={true}
                            style={{ marginTop: 10 }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        : null}
                    {isLoading == true ?
                        <View style={{ marginTop: 50 }}>
                            <ActivityIndicator
                                animating={isLoading}
                                size="large"
                                color='blue'
                            />
                        </View>
                        : null}
                </Content>
            </Container>
        );
    }
}


const RenderSuggestionsListState = (state) => ({
    bookappointment: state.bookappointment
})
export default connect(RenderSuggestionsListState)(RenderSuggestionsList)

const styles = StyleSheet.create({
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
    SearchRow: {
        backgroundColor: 'white',
        borderColor: '#000',
        borderWidth: 0.7,
        height: 42,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 15,
        marginTop: 10
    },
    SearchStyle: {
        backgroundColor: '#7E49C3',
        width: '85%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRightColor: '#000',
        borderRightWidth: 0.1,
        borderBottomLeftRadius: 15,
        borderTopLeftRadius: 15
    },
    inputfield: {
        // color: '#756c6c',
        fontFamily: 'OpenSans',
        fontSize: 16,
        padding: 5,
        paddingLeft: 10
    },
    typeStyle: {
        color: '#000',
        color: 'gray',
        marginTop: 2,
        fontSize: 13,
        fontFamily: 'OpenSans-Bold',
        paddingLeft: 13,
    },
    valueText: {
        color: '#775DA3',
        marginTop: 2,
        fontFamily: 'OpenSans',
        fontSize: 15,
        paddingLeft: 14,
    },

});
