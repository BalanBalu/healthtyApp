import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image } from 'react-native';
import StarRating from 'react-native-star-rating';
import { searchByLabDetailsService, fetchLabTestAvailabilitySlotsService } from '../../../providers/labTest/basicLabTest.action';
import { renderLabTestImage } from '../labTestCommon';
import { Loader } from '../../../../components/ContentLoader';
import { formatDate } from '../../../../setup/helpers';

class labSearchList extends Component {
    processedDoctorAvailabilityDates = [];
    constructor(props) {
        super(props)
        this.state = {
            labListData: [],
            processedDoctorAvailabilityDates: [],
            isLoading: false
        }
    }
    async componentDidMount() {
        this.searchByLabCatAndDetails()
    }
    searchByLabCatAndDetails = async () => {
        try {
            this.setState({ isLoading: true });
            const { navigation } = this.props;
            const inputDataBySearch = navigation.getParam('inputDataFromLabCat');
            console.log('inputDataBySearch====>', inputDataBySearch);
            const labListResponse = await searchByLabDetailsService(inputDataBySearch);
            console.log('labListResponse====>', JSON.stringify(labListResponse));
            if (labListResponse.success) {
                const labListData = labListResponse.data;
                await this.setState({ labListData })
            }
        } catch (ex) {
            Toast.show({
                text: 'Something Went Wrong' + ex,
                duration: 3000,
                type: "danger"
            })
        }
        finally {
            this.setState({ isLoading: false })
        }
    }
    async enumerateDates(startDate, endDate) {
        let now = startDate.clone();
        while (now.isSameOrBefore(endDate)) {
            this.processedDoctorAvailabilityDates.push(now.format('YYYY-MM-DD'));
            now = now.add(1, 'day');
        }
        this.setState({ processedDoctorAvailabilityDates: this.processedDoctorAvailabilityDates });
        console.log('Process Dates are ' + this.state.processedDoctorAvailabilityDates);
    }

    /* get Lab Test Availability Slots */
    getLabTestAvailabilitySlots = async (getSearchedLabId, startDate, endDate) => {
        const availabilityData = [];
        // this.enumerateDates(startDate, endDate)
        try {
            const totalSlotsInWeek = {
                startDate: formatDate(startDate, 'YYYY-MM-DD'),
                endDate: formatDate(endDate, 'YYYY-MM-DD')
            }
            const availabilityReqData = {
                "labIds": [getSearchedLabId]
            }
            const resultSlotsData = await fetchLabTestAvailabilitySlotsService(availabilityReqData, totalSlotsInWeek);
            console.log('resultSlotsData======>', resultSlotsData)
            if (resultSlotsData.success) {
                availabilityData = resultSlotsData.data
                return availabilityData
            }
        } catch (e) {
            console.log(e);
        }
        return availabilityData || [];
    }

    onBookPress = async (getSearchedLabId) => {
        alert(`book event pressed:::${getSearchedLabId}`);
        const availabilityData = await this.getLabTestAvailabilitySlots(getSearchedLabId);
        console.log('availabilityData=====>', availabilityData)
    }
    render() {
        const { labListData, isLoading } = this.state;
        return (
            <Container style={styles.container}>
                {isLoading ? <Loader style='list' /> :
                    <Content>
                        <View>
                            <Card style={{ borderRadius: 7, paddingTop: 5, paddingBottom: 5 }}>
                                <Row>
                                    <Col style={{ width: '55%', flexDirection: 'row', marginLeft: 5, }} >
                                        <Row>
                                            <Col style={{ width: '15%' }}>
                                                <Icon name='ios-arrow-down' style={{ color: '#000', fontSize: 20, marginTop: 5 }} />
                                            </Col>
                                            <Col style={{ width: '85%' }}>
                                                <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, textAlign: 'center', marginTop: 5 }}>Top Rated </Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col style={{ width: '45%', alignItems: 'flex-start', flexDirection: 'row', borderLeftColor: 'gray', borderLeftWidth: 1 }}>
                                        <Row>
                                            <Col style={{ width: '35%', marginLeft: 10 }}>
                                                <Icon name='ios-funnel' style={{ color: 'gray' }} />
                                            </Col>
                                            <Col style={{ width: '65%' }}>
                                                <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, marginTop: 5, marginLeft: 5, width: '100%' }}>Filters </Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                            <View>
                                {labListData.length === 0 ?
                                    <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 18, justifyContent: 'center', alignItems: 'center' }} > No Lab list found! </Text>
                                    </Item>
                                    :
                                    <View>
                                        <FlatList
                                            data={labListData}
                                            renderItem={({ item, index }) =>
                                                <Card style={{ padding: 2, borderRadius: 10, borderBottomWidth: 2 }}>
                                                    <List style={{ borderBottomWidth: 0 }}>
                                                        <ListItem style={{ borderBottomWidth: 0 }}>
                                                            <Grid>
                                                                <Row>
                                                                    <Col style={{ width: '5%' }}>
                                                                        <Thumbnail source={renderLabTestImage(item.labInfo)} style={{ height: 60, width: 60 }} />
                                                                    </Col>
                                                                    <Col style={{ width: '80%' }}>
                                                                        <Row style={{ marginLeft: 55, }}>
                                                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold' }}>{item.labInfo.lab_name}</Text>
                                                                        </Row>
                                                                        <Row style={{ marginLeft: 55, }}>
                                                                            <Text note style={{ fontFamily: 'OpenSans', marginTop: 2, fontSize: 11 }}>{item.labCatInfo.category_name}</Text>
                                                                        </Row>
                                                                        <Row style={{ marginLeft: 55, }}>
                                                                            {item.labInfo.location.address ?
                                                                                <View>
                                                                                    <Text note style={{ fontFamily: 'OpenSans', marginTop: 5, fontSize: 11, color: '#4c4c4c' }}>{item.labInfo.location.address.no_and_street + ' , ' +
                                                                                        item.labInfo.location.address.district + ' , ' +
                                                                                        item.labInfo.location.address.city + ' , ' +
                                                                                        item.labInfo.location.address.state}</Text>
                                                                                </View> : null}
                                                                        </Row>
                                                                    </Col>
                                                                    <Col style={{ width: '15%' }}>
                                                                        <Row>
                                                                            <TouchableOpacity>
                                                                                <Icon name="heart"
                                                                                    style={{ marginLeft: 20, color: '#000', fontSize: 20 }}>
                                                                                </Icon>
                                                                            </TouchableOpacity>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                                <Row style={{ marginTop: 10 }}>
                                                                    <Col style={{ width: "25%", marginLeft: -10 }}>
                                                                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, }}> Favourites</Text>
                                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold' }}>{item.Favorites || ''}</Text>
                                                                    </Col>
                                                                    <Col style={{ width: "25%" }}>
                                                                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center', }}> Rating</Text>
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                                            <StarRating
                                                                                fullStarColor='#FF9500'
                                                                                starSize={12}
                                                                                width={85}
                                                                                containerStyle={{ marginTop: 2 }}
                                                                                disabled={true}
                                                                                rating={1}
                                                                                maxStars={1}
                                                                            />
                                                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', marginLeft: 2 }}>0</Text>
                                                                        </View>
                                                                    </Col>
                                                                    <Col style={{ width: "25%" }}>
                                                                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, }}>Offer</Text>
                                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', color: 'green' }}>{item.labInfo.labPriceInfo[0].offer || ''} off</Text>
                                                                    </Col>
                                                                    <Col style={{ width: "25%", marginLeft: 10 }}>
                                                                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center' }}>Package Amt</Text>
                                                                        <Row style={{ justifyContent: 'center' }}>
                                                                            <Text style={styles.finalRs}>₹ {item.labInfo.labPriceInfo[0].price || ''}</Text>
                                                                            {/* <Text style={styles.finalRs}>₹ {item.finalAmount || ''}</Text> */}
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                                <View>
                                                                    <View style={{ borderTopColor: '#090909', borderTopWidth: 0.2, marginTop: 10 }}>
                                                                        <Row  >
                                                                            <Col style={{ width: "5%" }}>
                                                                                <Icon name='ios-time' style={{ fontSize: 20, marginTop: 12 }} />
                                                                            </Col>
                                                                            <Col style={{ width: "80%" }}>
                                                                                <Text note style={{ fontFamily: 'OpenSans', marginTop: 15, fontSize: 12, marginRight: 50, fontWeight: 'bold' }}>Available On Thu,23 Jan 20 </Text>
                                                                            </Col>
                                                                            <Col style={{ width: "15%" }}>
                                                                                <TouchableOpacity onPress={() => this.onBookPress(item.labInfo.lab_id)} style={{ textAlign: 'center', backgroundColor: 'green', borderColor: '#000', marginTop: 10, borderRadius: 20, height: 30, justifyContent: 'center', paddingLeft: 1, paddingRight: 1, }}>
                                                                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: 'OpenSans' }}>BOOK </Text>
                                                                                </TouchableOpacity>
                                                                            </Col>
                                                                        </Row>
                                                                    </View>
                                                                </View>
                                                            </Grid>
                                                        </ListItem>
                                                    </List>
                                                </Card>
                                            }
                                            keyExtractor={(item, index) => index.toString()} />
                                    </View>
                                }
                            </View>
                        </View>
                    </Content>
                }
            </Container >
        )
    }
}

export default labSearchList

const styles = StyleSheet.create({
    container:
    {
        backgroundColor: '#ffffff',
    },
    bodyContent: {
        padding: 5
    },
    slotDefaultBgColor: {
        backgroundColor: '#ced6e0',
        borderColor: '#000',
        marginTop: 10,
        height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        marginLeft: 5
    },
    slotDefaultTextColor: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'OpenSans',
        textAlign: 'center'
    },
    slotBookedBgColor: {
        backgroundColor: '#A9A9A9', //'#775DA3',
        borderColor: '#000',
        marginTop: 10, height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        marginLeft: 5
    },
    slotSelectedBgColor: {

        backgroundColor: '#775DA3',
        borderColor: '#000',
        marginTop: 10,
        height: 30,
        borderRadius: 6,
        justifyContent: 'center',
        marginLeft: 5
    },
    slotBookedTextColor: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'OpenSans',
        textAlign: 'center'
    },
    slotBookedBgColorFromModal: {
        backgroundColor: '#878684',
        borderRadius: 5,
        height: 30,
    },
    slotDefaultBg: {
        backgroundColor: '#2652AC',
        borderRadius: 5,
        height: 30,
    },
    slotSelectedBg: {
        backgroundColor: '#808080',
        borderRadius: 5,
        height: 30,
    },
    availabilityBG: {
        textAlign: 'center',
        borderColor: '#000',
        marginTop: 10,
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        marginRight: 5,
        paddingLeft: 5,
        paddingRight: 5
    },
    customPadge: {
        backgroundColor: 'green',
        alignItems: 'center',
        width: '30%'
    },
    rsText: {
        fontSize: 8,
        textAlign: 'center',
        fontWeight: '200',
        color: '#ff4e42',
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        textDecorationColor: '#ff4e42'
    },
    finalRs: {
        fontSize: 10,
        textAlign: 'center',
        fontWeight: '200',
        paddingTop: 1,
        marginLeft: 5,
        color: '#8dc63f'
    }
});