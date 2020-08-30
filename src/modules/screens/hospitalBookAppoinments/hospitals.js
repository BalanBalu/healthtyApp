import React, { PureComponent } from 'react';
import { Text, Container, Icon, Spinner, Right, Left, List, ListItem, Content, Card, Item, Input, Thumbnail, Toast } from 'native-base';
import { Row, Col, Grid } from 'react-native-easy-grid';
import { StyleSheet, View, TouchableOpacity, FlatList, Image, AsyncStorage, TextInput } from 'react-native';
import StarRating from 'react-native-star-rating';
import { connect } from 'react-redux'
import { getNearByHospitals } from '../../providers/hospitals/hospitals.action'
import { MAX_DISTANCE_TO_COVER } from '../../../setup/config'
import { getHospitalName, getKiloMeterCalculation } from '../../common'
import { RenderEditingPincode } from '../../screens/CommonAll/components';
import { addTimeUnit, formatDate } from '../../../setup/helpers';
import DateTimePicker from 'react-native-modal-datetime-picker';
class Hospitals extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            expandData: -1,
            editingPincode: false,
            hospitalData: [],
            locationCordinates: null,
            pin_code: '',
            isOnlyDateTimePickerVisible: false,
            appointmentDateTime: new Date()
        }
        this.defaultPinCode4FetchHospList = '560066'
        const threshholdTime = new Date();
        threshholdTime.setHours(threshholdTime.getHours() + 1)
        this.minimumDate = threshholdTime;
    }

    async componentDidMount() {
        this.getNearByHospitalList()
    }

    getNearByHospitalList = async () => {
        try {
            const { bookappointment: { locationCordinates } } = this.props;

            const locationData = {
                "coordinates": locationCordinates,
                maxDistance: MAX_DISTANCE_TO_COVER
            }
            // console.log(locationData)
            this.setState({ locationCordinates: locationCordinates });

            let reqData4ApiCall, type;
            if (this.defaultPinCode4FetchHospList || this.state.pin_code) {
                reqData4ApiCall = this.defaultPinCode4FetchHospList || this.state.pin_code
                type = 'pinCode'
            }
            else if (locationCordinates) {
                reqData4ApiCall = { ...locationData };
                type = 'location'
            }
            let result = await getNearByHospitals(type, reqData4ApiCall);
            // console.log(JSON.stringify(result))
            if (result.success) {
                this.setState({ hospitalData: result.data })
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    editingPincodeField = async (data) => {
        this.defaultPinCode4FetchHospList = data
        this.setState({ pin_code: this.defaultPinCode4FetchHospList })
    }
    editPinCode = async () => {
        this.editingPincodeField(this.defaultPinCode4FetchHospList)
        this.getNearByHospitalList()
        this.setState({ editingPincode: false, pin_code: null })
    }
    openDateTimePicker= (haspitalValue, index) => {
        this.selectedHospitalsForBooking = {
            haspitalValue,
            index
        };
        this.setState({ isOnlyDateTimePickerVisible: true });
    }
    
    onPressToContinue4PaymentReview = async (date) => {
        if(date < this.minimumDate) {
            Toast.show({
                text: 'Please select the time greater than ' + formatDate(this.minimumDate, 'Do MMM HH:mm A'),
                duration: 3000,
                type: 'warning'   
            });
            return false;
        }
        const { haspitalValue, index } = this.selectedHospitalsForBooking;
        this.setState({ expandData: index })
        this.props.navigation.setParams({ 'conditionFromFilterPage': false });
        let category_id = this.props.navigation.getParam('category_id') || null
        let slotData = {
            fee: 200,
            slotStartDateAndTime: date,
            category_id:category_id,
            slotEndDateAndTime: addTimeUnit(date, 30, 'minutes'),
            booked_for:'HOSPITAL',
            location:{
                location:haspitalValue.location,
                hospitalAdminId:haspitalValue.hospital_admin_id
            }
        }
        let data = haspitalValue
        data.slotData = slotData
        data.slotData.location.type = 'Hospital';

        console.log(JSON.stringify(data))
        this.props.navigation.navigate('Payment Review', { fromNavigation: 'HOSPITAL', resultconfirmSlotDetails: data })
    }
    

    render() {
        const { hospitalData, locationCordinates } = this.state
        return (
            <Container>
                <Content style={{ paddingTop: 10 }}>
                    <View style={{ marginBottom: 20 }}>
                        <View style={{ paddingBottom: 5, paddingStart: 5, paddingEnd: 5, height: 45 }}>
                            <Grid>
                                <Col size={10}>
                                    <Item style={styles.specialismInput} >
                                        <Input
                                            placeholder='Search Hospitals...'
                                            style={{ fontSize: 12, width: '100%', }}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            // onChangeText={(text) => this.navigatePress(text)}
                                            // onKeyPress={(evet) => this.navigatePress(evet)}
                                            returnKeyType={'go'}
                                            multiline={false} />
                                        <TouchableOpacity style={{ alignItems: 'flex-end' }}>
                                            <Icon name='ios-search' style={{ color: '#909090', fontSize: 20 }} />
                                        </TouchableOpacity>
                                    </Item>
                                </Col>
                            </Grid>
                        </View>
                        <View>
                                 
                                <View>
                                    <RenderEditingPincode
                                        isPincodeEditVisible={this.state.editingPincode}
                                        onChangeSelection={(value) => this.setState({   editingPincode: value })}
                                        value={this.defaultPinCode4FetchHospList || this.state.pin_code}
                                        onChangeText={text => this.editingPincodeField(text)}
                                        onPressEditButton={this.editPinCode}
                                    />
                                </View>
                            
                        </View>


                        <FlatList
                            data={hospitalData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) =>
                               
                                    <Card style={styles.doctorListStyle}>
                                        <List style={{ borderBottomWidth: 0 }}>
                                            <Grid >
                                                <Row >
                                                    <Col size={2}>
                                                        <TouchableOpacity  >
                                                            <Thumbnail circle source={require('../../../../assets/images/hospitalCommon.jpeg')} style={{ height: 60, width: 60, borderRadius: 60 / 2 }} />
                                                        </TouchableOpacity>
                                                    </Col>
                                                    <Col size={6}>
                                                        <Row >
                                                            <Text style={styles.commonStyle}>{item.name}</Text>
                                                        </Row>
                                                        <Row >
                                                            <Text note style={styles.addressTexts}>
                                                                {getHospitalName(item)}
                                                            </Text>
                                                        </Row>
                                                        <Row style={{ borderTopColor: 'gray', borderTopWidth: 0.3, marginTop: 10 }}>

                                                            <Col size={5} style={{ marginTop: 10 }}>
                                                                <Text note style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 12 }}> Rating</Text>
                                                                <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                                                                    <StarRating
                                                                        fullStarColor='#FF9500'
                                                                        starSize={12}
                                                                        width={85}
                                                                        containerStyle={{ marginTop: 2 }}
                                                                        disabled={true}
                                                                        rating={1}
                                                                        maxStars={1}
                                                                    />
                                                                    <Text style={[styles.commonStyle, { marginLeft: 5 }]}>0</Text>
                                                                </View>
                                                            </Col>
                                                            <Col size={5} style={{ marginTop: 10 }}>
                                                                <Text note style={[styles.commonStyle, { marginLeft: 5 }]}> Favourite</Text>
                                                                <Text style={[styles.commonStyle, { marginLeft: 25, fontWeight: 'bold' }]}>0</Text>
                                                            </Col>
                                                               
                                                                <TouchableOpacity onPress={() => this.openDateTimePicker(item, index)} style={{ textAlign: 'center', backgroundColor: 'green', borderColor: '#000', marginTop: 10, borderRadius: 18, height: 31, width: 66, justifyContent: 'center', paddingLeft: 1, paddingRight: 1, marginLeft: -6 }}>
                                                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 13, fontWeight: 'bold', fontFamily: 'OpenSans' }}>BOOK </Text>
                                                                </TouchableOpacity>

                                                        </Row>
                                                    </Col>
                                                    <Col size={2}>
                                                        <Row>
                                                            <Col>
                                                                <TouchableOpacity style={styles.heartIconButton} >

                                                                    <Icon name="heart"
                                                                        style={{ marginLeft: 20, color: '#000', fontSize: 20 }}>
                                                                    </Icon>
                                                                </TouchableOpacity>
                                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 10, marginLeft: 15, }}>{getKiloMeterCalculation(item.location.coordinates, locationCordinates)}</Text>
                                                            </Col>


                                                        </Row>

                                                    </Col>
                                                </Row>


                                            </Grid>

                                        </List>
                                    </Card>
                               
                            } />
                            

                    </View>

                    <DateTimePicker
                        mode={'datetime'}
                        minimumDate={this.minimumDate}
                        date={new Date()}
                        isVisible={this.state.isOnlyDateTimePickerVisible}
                        onConfirm={(date) => {
                            this.setState({ appointmentDateTime: date, isOnlyDateTimePickerVisible: false });
                            this.onPressToContinue4PaymentReview(date);   
                        }}
                        onCancel={() => this.setState({ isOnlyDateTimePickerVisible: !this.state.isOnlyDateTimePickerVisible })}
                    />
                </Content>
            </Container>
        )
    }
}
function hospitalsState(state) {

    return {
        bookappointment: state.bookappointment,
    }
}
export default connect(hospitalsState)(Hospitals)

const styles = StyleSheet.create({
    kmText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        textAlign: 'right',
        color: '#4c4c4c'
    },
    hospnames: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        fontWeight: "700",
        color: '#775DA3'
    },
    location: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#626262'

    },
    specialismInput: {
        backgroundColor: '#fff',
        height: 35,
        borderRadius: 2,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1
    },
    showingDoctorText: {
        fontFamily: 'OpenSans',
        color: '#000',
        fontSize: 13,
    },
    picodeText: {
        fontFamily: 'OpenSans',
        color: '#7F49C3',
        fontSize: 13,
    },
    editPincodeButton: {
        paddingBottom: 1,
        paddingTop: 1,
        paddingLeft: 2,
        paddingRight: 2,
        borderColor: '#ff4e42',
        borderWidth: 1,
        borderRadius: 2
    },
    doctorListStyle: {
        padding: 10,
        borderRadius: 10,
        borderBottomWidth: 2,
        marginTop: 5
    },
    commonStyle: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        fontWeight: 'bold'
    },
    qualificationText: {
        fontFamily: 'OpenSans',
        marginTop: 2,
        fontSize: 11
    },
    addressTexts: {
        fontFamily: 'OpenSans',
        marginTop: 5,
        fontSize: 11,
    },
    heartIconButton: {
        paddingBottom: 10,
        paddingRight: 10,
        paddingLeft: 10,
        justifyContent: 'center'
    },
    commonText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
    },
})

