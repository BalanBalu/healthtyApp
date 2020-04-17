import React, { Component } from 'react';
import { Container, Content, Text, Button, Toast, Item, List, ListItem, Card, Input, Left, Segment, CheckBox, View, Radio, Footer, FooterTab, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TouchableOpacity, Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import { fetchUserProfile, getCurrentVersion } from '../../../providers/profile/profile.action';
import { userFiledsUpdate, logout } from '../../../providers/auth/auth.actions';
import Spinner from '../../../../components/Spinner';
import { formatDate } from '../../../../setup/helpers';
import { RadioButton, Checkbox } from 'react-native-paper';
import { getAddress } from '../../../common'
import { SERVICE_TYPES, BASIC_DEFAULT, MAX_DISTANCE_TO_COVER } from '../../../../setup/config'
import { hasLoggedIn } from '../../../providers/auth/auth.actions';
import { getPurcharseRecomentation } from '../../../providers/pharmacy/pharmacy.action'
import BookAppointmentPaymentUpdate from '../../../providers/bookappointment/bookAppointment';
import { connect } from 'react-redux'
class MedicineCheckout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            medicineDetails: [],
            deliveryAddressArray: [],
            email: '',
            mobile_no: '',
            full_name: '',
            selectedAddress: null,
            isLoading: true,
            itemSelected: 'HOME_DELIVERY',
            deliveryDetails: null,
            medicineTotalAmount: 0,
            pickupOPtionEnabled: true,
            pharmacyInfo: null,
            isPrescription: false,
            isPharmacyRecomentation: false,
            recommentationData: [],



        };
    }

    async componentDidMount() {
        try {
            const { navigation } = this.props;

            const isLoggedIn = await hasLoggedIn(this.props);
            if (!isLoggedIn) {
                navigation.navigate('login');
                return
            }
            const medicineDetails = navigation.getParam('medicineDetails') || [];
            const isPrescription = navigation.getParam('isPrescription') || false


            this.setState({ medicineDetails, isPrescription })
            if (medicineDetails.length !== 0) {
                await this.clickedHomeDelivery()

                await this.getdeliveryWithMedicineAmountCalculation(medicineDetails, isPrescription)
                await this.getDelveryChageAmount()
            }

            this.setState({ isLoading: false })
        } catch (error) {
            console.error(error)
        }
    }

    clickedHomeDelivery = async () => {
        try {
            patientFields = "first_name,last_name,mobile_no,email,address,delivery_address"
            let userId = await AsyncStorage.getItem('userId');
            this.setState({ isLoading: true });
            let patientResult = await fetchUserProfile(userId, patientFields);

            let deliveryAddressArray = []
            if (patientResult !== null) {
                this.setState({ isLoading: false });
                full_name = patientResult.first_name + " " + patientResult.last_name,
                    mobile_no = patientResult.mobile_no
                this.setState({ full_name, mobile_no })
                if (patientResult.delivery_address)
                    deliveryAddressArray = patientResult.delivery_address
            } if (patientResult.address.address) {

                let defaultAddressObject = {
                    coordinates: patientResult.address.coordinates,
                    type: patientResult.address.type,
                    email: patientResult.email,
                    full_name: patientResult.first_name + " " + patientResult.last_name,
                    mobile_no: patientResult.mobile_no,
                    address: patientResult.address.address
                }
                deliveryAddressArray.unshift(defaultAddressObject);
            }
            console.log(JSON.stringify(deliveryAddressArray))
            await this.setState({ deliveryAddressArray })
            this.selectedItem(this.state.itemSelected)

        } catch (error) {
            console.log(error);
        }
    }
    getDelveryChageAmount = async () => {
        try {


            type = "PHARMACY_MEDICINE_DELIVERY_CHARGES"
            let deliveryCharge = await getCurrentVersion(type);

            if (deliveryCharge.success) {
                deliveryDetails = deliveryCharge.data[0].value
                deliveryTax = (parseInt(deliveryDetails.delivery_charges) * parseInt(deliveryDetails.Gst_tax) / 100)
                deliveryDetails.delivery_tax = deliveryTax
                this.setState({ deliveryDetails })
                this.selectedItem(this.state.itemSelected)
            }
        } catch (error) {
            console.log(error);
        }
    }

    onProceedToPayment(navigationToPayment) {
        debugger
        const { medicineDetails, selectedAddress, mobile_no, full_name, medicineTotalAmountwithDeliveryChage, itemSelected, isPrescription, isPharmacyRecomentation, recommentationData } = this.state;
        if (medicineDetails.length === 0) {
            Toast.show({
                text: 'No Medicines Added to Checkout',
                type: 'warning',
                duration: 3000
            })
            return false
        }
        if (selectedAddress == null) {
            Toast.show({
                text: 'kindly chosse Address',
                type: 'warning',
                duration: 3000
            })
            return false;
        }
        let medicinceNames = '';
        let medicineOrderData = [];
        let amount = 0;
        if (isPrescription !== true) {
            amount = medicineDetails.map(ele => {
                if (medicinceNames.length < 100) {
                    medicinceNames = medicinceNames + ele.medicine_name + '( * ' + String(ele.userAddedMedicineQuantity) + '), '
                }
                medicineOrderData.push({
                    medicine_id: ele.medicine_id,
                    pharmacy_id: ele.pharmacy_id,
                    medicine_original_price: Number(ele.price),
                    medicine_offered_price: Number(ele.offeredAmount),
                    quantity: Number(ele.userAddedMedicineQuantity),
                    medicine_weight: ele.medicine_weight,
                    medicine_variation_id: ele.medicine_variation_id,
                    medicine_weight_unit: ele.medicine_weight_unit,
                    final_price: Number(Number(ele.userAddedTotalMedicineAmount).toFixed(2)),
                    medicine_name: ele.medicine_name,
                })
                return ele.userAddedTotalMedicineAmount
            }).reduce(
                (total, userAddedTotalMedicineAmount) => total + userAddedTotalMedicineAmount);
        }

        const paymentPageRequestData = {
            service_type: SERVICE_TYPES.PHARMACY,
            amount: medicineTotalAmountwithDeliveryChage,
            bookSlotDetails: {
                fee: amount,
                is_order_type_prescription: isPrescription,
                is_order_type_recommentation: isPharmacyRecomentation,
                diseaseDescription: medicinceNames.slice(0, -1) || 'Upload prescription',
                medicineDetails: medicineOrderData,
                delivery_option: itemSelected,
                delivery_charges: deliveryDetails.delivery_charges,
                delivery_tax: deliveryDetails.delivery_tax,
                pickup_or_delivery_address: {
                    mobile_number: selectedAddress.mobile_no || mobile_no || BASIC_DEFAULT.mobile_no,
                    full_name: selectedAddress.full_name || selectedAddress.name || full_name,
                    coordinates: selectedAddress.coordinates,
                    type: selectedAddress.type,
                    address: {
                        no_and_street: selectedAddress.address.no_and_street || ' ',
                        address_line_1: selectedAddress.address.address_line_1,
                        district: selectedAddress.address.district,
                        city: selectedAddress.address.city,
                        state: selectedAddress.address.state,
                        country: selectedAddress.address.country,
                        pin_code: selectedAddress.address.pin_code
                    }
                },
            }
        }
        if (itemSelected === 'STORE_PICKUP') {
            delete paymentPageRequestData.bookSlotDetails.delivery_charges
            delete paymentPageRequestData.bookSlotDetails.delivery_tax
        }
        if (isPrescription === true) {
            console.log(medicineDetails[0].PrescriptionId)
            paymentPageRequestData.bookSlotDetails.prescription_id = medicineDetails[0].PrescriptionId
            paymentPageRequestData.bookSlotDetails.pharmacy_id = medicineDetails[0].pharmacyInfo.pharmacy_id


        }
        if (isPharmacyRecomentation === true) {
            pharmacy_ids = []
            recommentationData.map(ele => {
                pharmacy_ids.push(ele.pharmacy_id)
            })
            if (itemSelected === 'STORE_PICKUP') {
                paymentPageRequestData.amount = recommentationData[0].medicine_total_amount
            }
            else {
                paymentPageRequestData.amount = recommentationData[0].medicine_total_amount + deliveryDetails.delivery_charges + deliveryDetails.delivery_tax

            }
            paymentPageRequestData.bookSlotDetails.fee = recommentationData[0].medicine_total_amount;
            paymentPageRequestData.bookSlotDetails.pharmacy_ids = pharmacy_ids
        }

        console.log(paymentPageRequestData)
        if (navigationToPayment === true) {
            paymentPageRequestData.orderOption = this.props.navigation.getParam('orderOption') || null
            this.props.navigation.navigate('paymentPage', paymentPageRequestData)
        } else {
            return paymentPageRequestData;
        }
    }

    async  getdeliveryWithMedicineAmountCalculation(medicineDetails, isPrescription) {
        if (medicineDetails.length !== 0 && isPrescription === false) {
            let pharmacyData = []
            let medicineOrderData = [];
            let recommentationData = [];
            let pharmacyInfo = null;
            let amount = this.state.medicineDetails.map(ele => {
                medicineOrderData.push({
                    medicine_id: ele.medicine_id,
                    quantity: Number(ele.userAddedMedicineQuantity),
                    medicine_weight: Number(ele.medicine_weight),
                    medicine_weight_unit: ele.medicine_weight_unit,

                })
                if (ele.pharmacyInfo && !pharmacyData.includes(ele.pharmacyInfo.pharmacy_id)) {
                    pharmacyData.push(ele.pharmacyInfo.pharmacy_id)
                    let temp = ele.pharmacyInfo

                    temp.full_name = ele.pharmacyInfo.name;
                    temp.coordinates = ele.pharmacyInfo.location.coordinates
                    temp.type = ele.pharmacyInfo.location.type
                    temp.address = ele.pharmacyInfo.location.address;
                    pharmacyInfo = temp;
                    //  temp.name
                }
                return ele.userAddedTotalMedicineAmount
            }).reduce(
                (total, userAddedTotalMedicineAmount) => total + userAddedTotalMedicineAmount);
            if (medicineOrderData.length !== 0) {
                const { bookappointment: { locationCordinates } } = this.props;

                purcharseProductsData = {
                    coordinates: locationCordinates,
                    type: 'Point',
                    maxDistance: 300000000000,
                    order_items: medicineOrderData,
                    medicine_total_amount: amount
                };
                recomentationResult = await getPurcharseRecomentation(purcharseProductsData)

                if (recomentationResult.success) {
                    let data = recomentationResult.data.sort(function (firstVarlue, secandValue) {
                        return firstVarlue.medicine_total_amount > secandValue.medicine_total_amount ? -1 : 0
                    })

                    recommentationData = data
                }
            }
            this.setState({
                pickupOPtionEnabled: pharmacyData.length === 1,
                pharmacyInfo: pharmacyData.length === 1 ? pharmacyInfo : null,
                medicineTotalAmount: amount,
                recommentationData: recommentationData
            })
        } else {




            let ele = this.state.medicineDetails[0].pharmacyInfo
            let temp = this.state.medicineDetails[0].pharmacyInfo

            temp.full_name = ele.name;
            temp.coordinates = ele.location.coordinates
            temp.type = ele.location.type
            temp.address = ele.location.address;
            delete temp.name

            this.setState({
                pickupOPtionEnabled: true,
                pharmacyInfo: temp,
                medicineTotalAmount: 0,
            })

        }

    }

    selectedItem(value) {
        if (value == 'HOME_DELIVERY') {
            let selectedAddress = null
            medicineTotalAmountwithDeliveryChage = this.state.medicineTotalAmount + this.state.deliveryDetails.delivery_tax + this.state.deliveryDetails.delivery_charges
            if (this.state.deliveryAddressArray.length !== 0) {
                selectedAddress = this.state.deliveryAddressArray[0]
            }

            this.setState({ medicineTotalAmountwithDeliveryChage, itemSelected: value, selectedAddress })
        } else {

            this.setState({ medicineTotalAmountwithDeliveryChage: this.state.medicineTotalAmount, itemSelected: value, selectedAddress: this.state.pharmacyInfo })
        }
    }
    editProfile(screen, addressType) {
        addressType = { addressType: addressType, mobile_no: this.state.mobile_no, full_name: this.state.full_name }
        this.props.navigation.navigate(screen, { screen: screen, navigationOption: 'MedicineCheckout', addressType: addressType })
    }
    backNavigation = async (navigationData) => {
        try {
            const { navigation } = this.props;
            // if (navigation.state.params) {
            //   if (navigation.state.params.hasReloadAddress) {
                this.clickedHomeDelivery();  // Reload the Reported issues when they reload
            //   }
            // };
            
        } catch (e) {
            console.log(e)
        }
    }
    async processToPayLater() {
        debugger
        this.setState({ isLoading: true })
        const orderRequestData = await this.onProceedToPayment(false);
        if (orderRequestData === false) {
            this.setState({ isLoading: false, spinnerText: ' ' });
            return false;
        }
        debugger
        const userId = await AsyncStorage.getItem('userId');
        this.BookAppointmentPaymentUpdate = new BookAppointmentPaymentUpdate();
        let response = await this.BookAppointmentPaymentUpdate.updatePaymentDetails(true, {}, 'cash', orderRequestData.bookSlotDetails, orderRequestData.service_type, userId, 'cash');
        console.log('Order Booking Response ');

        if (response.success) {
            if (this.props.navigation.getParam('orderOption') === 'pharmacyCart') {
                await AsyncStorage.removeItem('cartItems-' + userId);
            }
            this.props.navigation.navigate('SuccessChat', { manualNaviagationPage: 'Home' });
            Toast.show({
                text: 'your order successfully requested',
                type: 'success',
                duration: 3000
            })
        } else {
            Toast.show({
                text: response.message,
                type: 'warning',
                duration: 3000
            })
        }
        this.setState({ isLoading: false, spinnerText: ' ' });
    }
    render() {
        const { itemSelected, deliveryAddressArray, isLoading, deliveryDetails, pickupOPtionEnabled, medicineTotalAmount, medicineTotalAmountwithDeliveryChage, pharmacyInfo, isPrescription, recommentationData, isPharmacyRecomentation } = this.state


        return (
            <Container>
                <Content style={{ backgroundColor: '#F5F5F5', padding: 10 }}>
                    <NavigationEvents
                        onWillFocus={payload => { this.backNavigation(payload) }}
                    />{isLoading === true ?
                        <Spinner color="blue"
                            visible={isLoading} /> :
                        this.state.medicineDetails.length != 0 ?
                            <View>
                                <RadioButton.Group onValueChange={value => this.selectedItem(value)}
                                    value={itemSelected}  >
                                    <View style={{ backgroundColor: '#fff', padding: 10 }}>
                                        <Row>
                                            <Col size={5}>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 14, fontWeight: '500' }}>Home Delivery</Text>
                                            </Col>
                                            <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                                <RadioButton value={'HOME_DELIVERY'} />

                                            </Col>
                                        </Row>
                                    </View>
                                    {itemSelected === 'HOME_DELIVERY' ?
                                        <View >
                                            <Row style={{ marginTop: 5 }}>
                                                <Col size={5}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Delivery Address</Text>
                                                </Col>
                                                {deliveryAddressArray.length != 0 ?
                                                    <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                                        <TouchableOpacity onPress={() => this.editProfile('MapBox', 'delivery_Address')}>
                                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#ff4e42' }}>Add new address</Text>
                                                        </TouchableOpacity>
                                                    </Col> : null}
                                            </Row>
                                            {deliveryAddressArray.length != 0 ?
                                                <View>

                                                    <FlatList
                                                        data={deliveryAddressArray}
                                                        keyExtractor={(item, index) => index.toString()}
                                                        renderItem={({ item }) =>
                                                            <View style={{ backgroundColor: '#fff' }}>
                                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '300', marginTop: 2, marginLeft: 33 }}>{item.full_name}</Text>
                                                                <Row style={{ borderBottomWidth: 0.5, paddingBottom: 10 }}>
                                                                    <Col size={1}>
                                                                        <RadioButton.Group style={{ marginTop: 2 }} onValueChange={value => this.setState({ selectedAddress: value })}

                                                                            value={this.state.selectedAddress}  >
                                                                            <RadioButton value={item} />
                                                                        </RadioButton.Group>
                                                                    </Col>

                                                                    <Col size={9}>
                                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2, color: '#6a6a6a' }}>{getAddress(item)}</Text>
                                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2 }}>{'Mobile -' + (item.mobile_no || 'Nil')}</Text>

                                                                    </Col>
                                                                </Row>
                                                            </View>
                                                        } />

                                                </View> :
                                                <Button transparent onPress={() => this.editProfile('MapBox', null)}>
                                                    <Icon name='add' style={{ color: 'gray' }} />
                                                    <Text uppercase={false} style={styles.customText}>Add Address</Text>
                                                </Button>}
                                        </View> :
                                        null}


                                    {pickupOPtionEnabled == true && pharmacyInfo != null ?
                                        <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                                            <Row>
                                                <Col size={5}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 14, fontWeight: '500' }}>Pick up at Store</Text>
                                                </Col>
                                                <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                                    <RadioButton value={'STORE_PICKUP'} />
                                                </Col>
                                            </Row>
                                        </View> : null}
                                </RadioButton.Group>


                                {itemSelected === 'STORE_PICKUP' ?
                                    <View>
                                        <Row>
                                            <Col size={5}>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Store Address</Text>
                                            </Col>
                                            <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                            </Col>
                                        </Row>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '300', marginTop: 5 }}>{pharmacyInfo.full_name}</Text>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2, color: '#6a6a6a' }}>{getAddress(pharmacyInfo.location)}</Text>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2 }}>{'Mobile -' + (pharmacyInfo.mobile_no || 'Nil')}</Text>
                                    </View> :
                                    null}



                                <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Order Details</Text>
                                    {isPrescription === false ?
                                        this.state.medicineDetails.length != 0 ?
                                            <FlatList
                                                data={this.state.medicineDetails}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({ item }) =>
                                                    <Row style={{ marginTop: 10 }}>
                                                        <Col size={8}>
                                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#6a6a6a' }}>{item.medicine_name + ' -'}<Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '400' }}>
                                                                {item.pharmacy_name} <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#8dc63f' }}>{'(X' + item.userAddedMedicineQuantity + ')'}</Text> </Text></Text>
                                                        </Col>
                                                        <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>{'₹' + item.userAddedTotalMedicineAmount || ''} </Text>

                                                        </Col>
                                                    </Row>
                                                } /> : <Row style={{ marginTop: 10 }}>
                                                <Col size={8}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#6a6a6a' }}>No orders Available</Text>
                                                </Col>
                                                <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                                </Col>
                                            </Row> :
                                        <Row style={{ marginTop: 10 }}>
                                            <Col size={8}>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#6a6a6a' }}>{'Prescription reference no:'}</Text>
                                            </Col>
                                            <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>{this.state.medicineDetails[0].prescription_ref_no} </Text>

                                            </Col>
                                        </Row>}
                                    {deliveryDetails != null && itemSelected == 'HOME_DELIVERY' ?
                                        <View>
                                            <Row style={{ marginTop: 5 }}>
                                                <Col size={8}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#6a6a6a' }}>Delivery Charges</Text>
                                                </Col>

                                                <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#ff4e42', textAlign: 'right' }}>{'₹' + deliveryDetails.delivery_charges || ''} </Text>

                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: 5 }}>
                                                <Col size={8}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#6a6a6a' }}>Tax</Text>
                                                </Col>
                                                <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#ff4e42', textAlign: 'right' }}>{'₹' + deliveryDetails.delivery_tax || 0}</Text>

                                                </Col>
                                            </Row>
                                        </View> : null}
                                    <Row style={{ marginTop: 10 }}>
                                        <Col size={8}>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '500' }}>Amount to be Paid</Text>
                                        </Col>
                                        <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                            {isPrescription === false ?
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>{'₹' + (medicineTotalAmountwithDeliveryChage || ' ')} </Text>
                                                : itemSelected === 'HOME_DELIVERY' ?
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>{'your prescription amount added with ' + (deliveryDetails != null ? (deliveryDetails.delivery_tax + deliveryDetails.delivery_charges) : ' ')}} </Text>
                                                    : <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>{'your prescription amount added later'} </Text>
                                            }
                                        </Col>
                                    </Row>
                                </View>{
                                    recommentationData.length !== 0 ?
                                        <Row style={{ paddingRight: 20, marginTop: 5, alignItems: 'center', }}>

                                            <Checkbox color="green"
                                                status={isPharmacyRecomentation ? 'checked' : 'unchecked'}
                                                onPress={() => { this.setState({ isPharmacyRecomentation: !isPharmacyRecomentation }); }}
                                            />
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 13, }}>{'Above order you will get Rs' + recommentationData[0].medicine_total_amount + ' do you select'}</Text>
                                        </Row> : null
                                }
                            </View> : <Text style={{ fontFamily: 'OpenSans', fontSize: 24, color: '#6a6a6a', marginTop: "40%", marginLeft: 55, alignContent: 'center' }}>No orders Available</Text>
                    }

                </Content>
                <Footer style={
                    Platform.OS === "ios" ?
                        { height: 30 } : { height: 45 }}>
                    <FooterTab>
                        <Row>
                            <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                                <TouchableOpacity onPress={() => this.processToPayLater()} >
                                    <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#000', fontWeight: '400' }}>{itemSelected == 'HOME_DELIVERY' ? 'Cash On Delivary' : 'Cash on Pickup'} </Text>
                                </TouchableOpacity>
                            </Col>
                            {isPrescription === false ?
                                <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#8dc63f' }}>
                                    <TouchableOpacity onPress={() => this.onProceedToPayment(true)}>
                                        <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#fff', fontWeight: '400' }}>Proceed</Text>
                                    </TouchableOpacity>
                                </Col> : null}
                        </Row>
                    </FooterTab>
                </Footer>


            </Container >
        );
    }
}

// export default MedicineCheckout;
function MedicineCheckoutState(state) {

    return {
        bookappointment: state.bookappointment,


    }
}
export default connect(MedicineCheckoutState)(MedicineCheckout)

const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 0
    },
    customImage: {
        height: 50,
        width: 90,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },


    curvedGrid: {
        width: 250,
        height: 250,
        borderRadius: 125,
        marginTop: -135,
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#745DA6',
        transform: [
            { scaleX: 2 }
        ],
        position: 'relative',
        overflow: 'hidden',
    },

    loginButton: {
        marginTop: 12,
        backgroundColor: '#775DA3',
        borderRadius: 5,
    },
    normalText:
    {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
    },
    labelTop:
    {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#000',


    },
    customText:
    {
        marginLeft: 10,
        fontFamily: 'OpenSans',
        fontSize: 13,
        marginTop: 3,
        color: 'gray'
    },
    customSubText:
    {
        marginLeft: 2,
        fontFamily: 'OpenSans',
        fontSize: 13,
        marginTop: 3,
        color: 'gray'
    },
    transparentLabel:
    {

        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'OpenSans',
        margin: 2,
        fontSize: 13
    },

    addressLabel:
    {

        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'OpenSans',
        margin: 2,
        fontSize: 13
    }
});



/*
renderSelectedComponent = () => {
    const { deliveryAddressArray, deliveryAddressData, isLoading } = this.state

    if (this.state.activePage === 1) {
        return (

            <View style={{ marginTop: 5, marginLeft: 2 }}>
                <Spinner color="blue"
                    visible={isLoading} />
                <Text style={{ fontSize: 20, fontFamily: 'OpenSans', fontWeight: 'bold' }} >Select a Delivery address</Text>

                <FlatList
                    data={deliveryAddressArray}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) =>
                        <Card style={{ padding: 10, marginTop: 20 }}>
                            <TouchableOpacity onPress={() => this.selectAddressRadioButton(index, item)}>
                                <Row>
                                    <Col style={{ width: '10%' }}>
                                        <Radio
                                            selected={this.state.selectedRadioButton[index]} color="green"
                                        />

                                    </Col>
                                    <Col style={{ width: '90%' }}>
                                        {item.fullName != undefined ? <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginLeft: 10, marginTop: 3, fontWeight: 'bold' }}>{item.fullName}</Text> :
                                            <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginLeft: 20, marginTop: 3, fontWeight: 'bold' }}>{deliveryAddressArray[0].fullName}</Text>

                                        }

                                <Text style={styles.customText}>{item.email}</Text>
                                <Text style={styles.customText}>{item.mobile_no}</Text>
                                {item.address ?
                                    <View>
                                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginLeft: 10, marginTop: 4, fontWeight: 'bold' }}>Delivery Address</Text>
                                        <Row>
                                            <Text style={styles.customText}>{item.address.no_and_street}
                                            </Text>
                                            <Text style={styles.customSubText}>{item.address.address_line_1 + ', ' + item.address.address_line_2}
                                            </Text>
                                        </Row>
                                        <Row>
                                            <Text style={styles.customText}>{item.address.city}</Text>
                                            <Text style={styles.customSubText}>Pincode:{item.address.pin_code}</Text>
                                        </Row>
                                    </View>
                                    : null}
                                    </Col>
                                </Row>
                               
                            </TouchableOpacity>
                        </Card>
                    } />
                <Button onPress={() => this.props.navigation.navigate('OrderPaymentPreview'
                    // ,{deliveryAddressData:deliveryAddressData}
                )} block style={styles.loginButton}><Text>Proceed to Pay</Text></Button>

            </View>
        )
    }
    else {
        return (
            <Card transparent>
                <Grid style={{ marginTop: 5 }}>
                    <Col>
                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginLeft: 5 }}>E-mail</Text>

                        <Input
                            placeholder="E-mail"
                            style={styles.transparentLabel}
                            value={this.state.email}
                            keyboardType={'email-address'}
                            returnKeyType={'next'}
                            onChangeText={email => this.setState({ email })}
                            autoCapitalize='none'
                            blurOnSubmit={false}
                            onSubmitEditing={() => { this.mobile_no._root.focus(); }}
                            testID="enterNo&Street"

                        />

                    </Col>
                    <Col>
                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginLeft: 5 }}>Phone</Text>
                        <Input
                            placeholder="Phone_No"
                            style={styles.transparentLabel}
                            value={this.state.mobile_no}
                            ref={(input) => { this.mobile_no = input; }}
                            keyboardType={'phone-pad'}
                            returnKeyType={'next'}
                            onChangeText={mobile_no => this.setState({ mobile_no })}
                            autoCapitalize='none'
                            blurOnSubmit={false}
                            onSubmitEditing={() => { this.no_and_street._root.focus(); }}
                            testID="enterNo&Street"

                        />
                    </Col>
                </Grid>
                <Grid style={{ marginTop: 5 }}>
                    <Col>
                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold', }}> Delivery Address</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginTop: 15 }}> Door_No and Street </Text>

                        <Input
                            placeholder="Enter Door_No ,Street"
                            style={styles.addressLabel}
                            value={this.state.no_and_street}
                            ref={(input) => { this.no_and_street = input; }}
                            keyboardType={'default'}
                            returnKeyType={'next'}
                            onChangeText={no_and_street => this.setState({ no_and_street })}
                            autoCapitalize='none'
                            blurOnSubmit={false}
                            onSubmitEditing={() => { this.address_line_1._root.focus(); }}
                            testID="enterNo&Street"

                        />
                    </Col>
                </Grid>
                <Grid style={{ marginTop: 5 }}>
                    <Col>
                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginTop: 10 }}> City Or Town </Text>
                        <Input
                            placeholder="Enter City name"
                            style={styles.addressLabel}
                            ref={(input) => { this.address_line_1 = input; }}
                            value={this.state.address_line_1}
                            keyboardType={'default'}
                            returnKeyType={'next'}
                            onChangeText={address_line_1 => this.setState({ address_line_1 })}
                            autoCapitalize='none'
                            blurOnSubmit={false}
                            onSubmitEditing={() => { this.address_line_2._root.focus(this.setState({ isFocusKeyboard: true })); }}
                            testID="enterAddressLine1"
                        />

                    </Col>
                </Grid>
                <Grid style={{ marginTop: 5 }}>
                    <Col>
                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginTop: 10 }}> State and Country </Text>
                        <Input
                            placeholder="Enter State and Country"
                            style={styles.addressLabel}
                            ref={(input) => { this.address_line_2 = input; }}
                            value={this.state.address_line_2}
                            keyboardType={'default'}
                            returnKeyType={'next'}
                            onChangeText={address_line_2 => this.setState({ address_line_2 })}
                            autoCapitalize='none'
                            blurOnSubmit={false}
                            onSubmitEditing={() => { this.pin_code._root.focus(this.setState({ isFocusKeyboard: true })); }}
                            testID="enterAddressLine2"
                        />
                    </Col>
                </Grid>
                <Grid style={{ marginTop: 5 }}>
                    <Col>
                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', marginTop: 10 }}> Pin Code </Text>
                        <Input
                            placeholder="Enter Pin code"
                            style={styles.transparentLabel}
                            value={this.state.pin_code}
                            autoFocus={this.state.isFocusKeyboard}
                            ref={(input) => { this.pin_code = input; }}
                            keyboardType="numeric"
                            returnKeyType={'next'}
                            onChangeText={pin_code => this.setState({ pin_code })}
                            autoCapitalize='none'
                            blurOnSubmit={false}
                            onSubmitEditing={() => { this.updateNewAddressMethod() }}
                            testID="enterPincode"
                        />
                    </Col>
                </Grid>
                <Button onPress={() => this.updateNewAddressMethod()} block style={styles.loginButton}><Text>Continue</Text></Button>

            </Card>
        )
    }
}*/








{/* <Grid style={styles.curvedGrid}>
                       march 6 changes
                    </Grid>
                    <View style={{ marginTop: -95, height: 100 }}>
                        <Row style={{paddingLeft:10,paddingRight:10 }}>
                            <Col style={{ width: '35%', alignItems: 'flex-start' }}>
                                <Text style={styles.normalText}>Date</Text>
                            </Col>
                            <Col style={{ width: '20%', alignItems: 'center' }}>
                            </Col>
                            <Col style={{ width: '45%', alignItems: 'flex-end' }}>
                                <Text style={styles.normalText}>{currentDate}</Text>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: -28,paddingLeft:10,paddingRight:10 }}>
                            <Col style={{ width: '35%', alignItems: 'flex-start', }}>
                                <Text style={styles.normalText}>TotalBill</Text>
                            </Col>
                            <Col style={{ width: '20%', alignItems: 'center' }}>
                            </Col>
                            <Col style={{ width: '45%', alignItems: 'flex-end',  }}>
                                <Text style={styles.normalText}>Rs.100</Text>
                            </Col>
                        </Row>
                    </View>

                    <Card transparent style={{ padding: 10, marginTop: 20, }}>
                        <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 18, padding: 5 }}>Address Info</Text>
                        <Segment>
                            <Button active={this.state.activePage === 1} style={{borderLeftColor:'#fff',borderLeftWidth:1}}
                                onPress={this.selectComponent(1)}><Text uppercase={false}>Default Address</Text>

                            </Button>
                            <Button active={this.state.activePage === 2}
                                onPress={this.selectComponent(2)}><Text uppercase={false}>Add New Address</Text>

                            </Button>
                        </Segment>
                        <Content padder>
                            {this.renderSelectedComponent()}

                        </Content>
                         updateNewAddressMethod = async () => {
        const userId = await AsyncStorage.getItem('userId')
        let requestData = {
            delivery_Address: [{
                email: this.state.email,
                mobile_no: this.state.mobile_no,
                address: {
                    no_and_street: this.state.no_and_street,
                    address_line_1: this.state.address_line_1,
                    address_line_2: this.state.address_line_2,
                    // city: this.state.city,
                    pin_code: this.state.pin_code
                }
            }
            ]
        };
        let response = await userFiledsUpdate(userId, requestData);
        console.log(response);

        if (response.success) {
            Toast.show({
                text: 'Your New Address has been Inserted',
                type: "success",
                duration: 3000
            });
            await this.setState({ activePage: 1 })
            this.clickedHomeDelivery();
        }
        else {
            Toast.show({
                text: response.message,
                type: "danger",
                duration: 3000
            });
        }
    }


                    </Card> */}