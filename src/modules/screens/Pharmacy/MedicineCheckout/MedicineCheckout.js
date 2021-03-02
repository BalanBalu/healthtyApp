import React, { Component } from 'react';
import { Container, Content, Text, Button, Toast, Item, List, ListItem, Card, Input, Left, Segment, CheckBox, View, Radio, Footer, FooterTab, Icon, Right } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, Platform, Modal } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NavigationEvents } from 'react-navigation';
import ImagePicker from 'react-native-image-crop-picker';
import {primaryColor} from '../../../../setup/config'

import { uploadMultiPart } from '../../../../setup/services/httpservices'
import { fetchUserProfile, getCurrentVersion } from '../../../providers/profile/profile.action';
import { userFiledsUpdate, logout } from '../../../providers/auth/auth.actions';
import Spinner from '../../../../components/Spinner';
import { getAddress } from '../../../common';
import { getMedicineNameByProductName } from '../CommomPharmacy';
import { SERVICE_TYPES, BASIC_DEFAULT, MAX_DISTANCE_TO_COVER, IS_IOS } from '../../../../setup/config'
import { hasLoggedIn } from '../../../providers/auth/auth.actions';
import { deleteCartByIds } from '../../../providers/pharmacy/pharmacy.action'
import BookAppointmentPaymentUpdate from '../../../providers/bookappointment/bookAppointment';
import AwesomeAlert from 'react-native-awesome-alerts';
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
            itemSelected: 0,
            deliveryDetails: null,
            medicineTotalAmount: 0,
            pickupOPtionEnabled: true,
            pharmacyInfo: null,
            isPrescription: false,
            prescriptionDetails: null,
            isH1Product: false,
            h1ProductData: [],
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
            let prescriptionDetails = null
            if (isPrescription === true) {
                prescriptionDetails = navigation.getParam('prescriptionDetails');
                this.setState({ medicineDetails, isPrescription, prescriptionDetails })

            } else {
                this.setState({ medicineDetails, isPrescription })
            }
            if (medicineDetails.length !== 0) {
                await this.clickedHomeDelivery()

                await this.getdeliveryWithMedicineAmountCalculation(medicineDetails, isPrescription)
                await this.getDelveryChageAmount()
            }
            if (prescriptionDetails !== null) {
                await this.clickedHomeDelivery()
                await this.getDelveryChageAmount()
            }

            this.setState({ isLoading: false })
        } catch (error) {
            console.error(error)
        }
    }

    clickedHomeDelivery = async () => {
        try {
            let patientFields = "first_name,last_name,mobile_no,email,address,delivery_address"
            let userId = await AsyncStorage.getItem('userId');
            this.setState({ isLoading: true });
            let patientResult = await fetchUserProfile(userId, patientFields);

            let deliveryAddressArray = []
            if (patientResult !== null) {
                let full_name = patientResult.first_name + " " + patientResult.last_name,
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

            await this.setState({ deliveryAddressArray })
            this.selectedItem(this.state.itemSelected)
            this.setState({ isLoading: false });
        } catch (error) {
            console.log(error);
        }
    }
    getDelveryChageAmount = async () => {
        try {


            let type = "PHARMACY_MEDICINE_DELIVERY_CHARGES"
            let deliveryCharge = await getCurrentVersion(type);

            if (deliveryCharge.success) {
                let deliveryDetails = deliveryCharge.data[0].value
                let deliveryTax = (parseInt(deliveryDetails.delivery_charges) * parseInt(deliveryDetails.Gst_tax) / 100)
                deliveryDetails.delivery_tax = deliveryTax
                this.setState({ deliveryDetails })
                this.selectedItem(this.state.itemSelected)
            }
        } catch (error) {
            console.log(error);
        }
    }

    onProceedToPayment(navigationToPayment) {

        const { medicineDetails, selectedAddress, mobile_no, full_name, medicineTotalAmountwithDeliveryChage, itemSelected, isPrescription, deliveryDetails, pharmacyInfo, h1ProductData } = this.state;
      
        let isH1Product = false

        if (medicineDetails.length === 0 && isPrescription === false) {
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
        medicineDetails.map(element => {
            if (element.item.isH1Product === true && isH1Product === false) {
                isH1Product = true

            }


        })
        if (h1ProductData.length !== 0) {
            isH1Product = false
        }
        if (isH1Product === true) {
            this.setState({ isH1Product: isH1Product })
            return false

        }

        let medicineOrderData = [];
        let amount = 0;
        if (isPrescription !== true) {
            amount = medicineDetails.map(ele => {
                medicineOrderData.push(
                    ele.item
                )
                return ele.item.totalPrice
            }).reduce(
                (total, userAddedTotalMedicineAmount) => total + userAddedTotalMedicineAmount);
               
        }
        if (!Number.isInteger(amount)) {
            amount=  Number(amount).toFixed(2)
        }

        const paymentPageRequestData = {

            service_type: SERVICE_TYPES.PHARMACY,
            amount: Number(amount),
            bookSlotDetails: {
                fee: Number(amount),
                medicineDetails: medicineOrderData,
                totalAmount: Number(amount),
                deliveryType: itemSelected,
                delivery_address: {
                    mobile_no: selectedAddress.mobile_no || mobile_no || BASIC_DEFAULT.mobile_no,
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
        if (itemSelected === 1) {

            paymentPageRequestData.bookSlotDetails.pharmacyId = pharmacyInfo.pharmacy_id || null

        }
        if (isPrescription === true) {
            paymentPageRequestData.bookSlotDetails.prescriptions = this.state.prescriptionDetails.prescriptionData
        }


        if (navigationToPayment === true) {
            paymentPageRequestData.orderOption = this.props.navigation.getParam('orderOption') || null
            this.props.navigation.navigate('paymentPage', paymentPageRequestData)
        } else {
            return paymentPageRequestData;
        }
    }

    async getdeliveryWithMedicineAmountCalculation(medicineDetails, isPrescription) {
        try {
            if (medicineDetails.length !== 0 && isPrescription === false) {
                let amount = this.state.medicineDetails.map(ele => {
                    return ele.item.totalPrice
                }).reduce(
                    (total, userAddedTotalMedicineAmount) => total + userAddedTotalMedicineAmount);

                await this.setState({
                    medicineTotalAmount: amount,

                })
            } else {
                await this.setState({
                    medicineTotalAmount: 0,
                })

            }
        } catch (e) {
            console.log(e)
        }

    }

    selectedItem(value) {

        if (value == 0) {
            let selectedAddress = null
            let medicineTotalAmountwithDeliveryChage = Number(Number(this.state.medicineTotalAmount).toFixed(2))
            if (this.state.deliveryDetails !== null) {
                let totalAmount = Number(this.state.medicineTotalAmount) + Number(this.state.deliveryDetails.delivery_tax) + Number(this.state.deliveryDetails.delivery_charges)
                medicineTotalAmountwithDeliveryChage = Number(Number(totalAmount).toFixed(2))
            }
            if (this.state.deliveryAddressArray.length !== 0) {
                selectedAddress = this.state.deliveryAddressArray[0]
            }

            this.setState({ medicineTotalAmountwithDeliveryChage, itemSelected: value, selectedAddress })
        } else {
            if (this.state.pharmacyInfo !== null) {
                this.setState({ medicineTotalAmountwithDeliveryChage: this.state.medicineTotalAmount, itemSelected: value, selectedAddress: this.state.pharmacyInfo })
            } else {
                let navigateData = []
                if (!this.state.isPrescription) {
                    navigateData = this.state.medicineDetails
                }
                this.props.navigation.navigate('ChosePharmacyList', { medicineOrderData: navigateData })
            }
        }
    }
    editProfile(screen, addressType) {
        addressType = { addressType: addressType, mobile_no: this.state.mobile_no, full_name: this.state.full_name }
        this.props.navigation.navigate(screen, { screen: screen, navigationOption: 'MedicineCheckout', addressType: addressType })
    }
    backNavigation = async (navigationData) => {
        try {
            const { navigation } = this.props;
            if (navigation.state.params) {
                if (navigation.state.params.hasReloadAddress) {
                    this.clickedHomeDelivery();  // Reload the Reported issues when they reload
                }
                if (navigation.state.params.hasChosePharmacyReload) {
                    let pharmacyInfo = navigation.getParam('pharmacyInfo')
                    pharmacyInfo.address = pharmacyInfo.location.address;
                    pharmacyInfo.full_name = pharmacyInfo.name;
                    if (this.state.isPrescription === false) {
                        const medicineDetails = navigation.getParam('medicineDetails') || [];
                        await this.setState({ medicineDetails })
                        await this.getdeliveryWithMedicineAmountCalculation(medicineDetails, this.state.isPrescription)

                    }

                    await this.setState({ pharmacyInfo: pharmacyInfo, selectedAddress: pharmacyInfo, itemSelected: 1 })
                    this.selectedItem(1)
                }
            };

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


        if (response.success) {
            if (this.props.navigation.getParam('orderOption') === 'pharmacyCart') {
                let cart = await AsyncStorage.getItem('cartItems-' + userId) || []
                if (cart.length != 0) {
                    let cartData = JSON.parse(cart)
                    let cartIds = []
                    cartData.forEach(ele => {
                        cartIds.push(ele.id)
                    })
                    deleteCartByIds(cartIds)


                }


                await AsyncStorage.removeItem('cartItems-' + userId);
            }
            this.props.navigation.navigate('OrderDetails', { serviceId: response.orderNo, prevState: "CREATE_ORDER" });
            // this.props.navigation.navigate('SuccessChat', { manualNaviagationPage: 'Home' });
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
    uploadProfilePicture(type) {
        if (type == "Camera") {
            ImagePicker.openCamera({
                cropping: true,
                width: 500,
                height: 500,
                // cropperCircleOverlay: true,
                compressImageMaxWidth: 640,
                compressImageMaxHeight: 480,
                freeStyleCropEnabled: true,
            }).then(image => {
                this.setState({ isH1Product: false });
            
                this.uploadImageToServer(image);
            }).catch(ex => {
                this.setState({ isH1Product: false });
              
            });
        } else {
            ImagePicker.openPicker({
                // multiple: true,
                width: 300,
                height: 400,
                cropping: true,
                freeStyleCropEnabled: true,
                avoidEmptySpaceAroundImage: true,
            }).then(image => {
                

                this.setState({ isH1Product: false });
                this.uploadImageToServer(image);
            }).catch(ex => {
                this.setState({ isH1Product: false });
               
            });
        }
    }

    /*Save Image to Database*/
    uploadImageToServer = async (imagePath) => {

        try {
            const userId = await AsyncStorage.getItem('userId');
            var formData = new FormData();

            if (Array.isArray(imagePath) && imagePath.length != 0) {
                imagePath.map((ele) => {
                    formData.append("prescription", {
                        uri: ele.path,
                        type: 'image/jpeg',
                        name: 'photo.jpg'
                    });
                });
            } else {
                formData.append("medicine", {
                    uri: imagePath.path,
                    type: 'image/jpeg',
                    name: 'photo.jpg'
                });
            }
            debugger
            let endPoint = `/images/upload`

            var res = await uploadMultiPart(endPoint, formData);

            const response = res.data;
            if (response.success) {
                let temp = this.state.h1ProductData;
                let data = temp.concat(response.data)


                await this.setState({ h1ProductData: data, isH1Product: false })

                Toast.show({
                    text: 'Prescription Uploaded Successfully',
                    duration: 3000,
                    type: 'success'
                });

            } else {
                Toast.show({
                    text: 'Problem Uploading Profile Picture',
                    duration: 3000,
                    type: 'danger'
                });

            }

        } catch (e) {
            Toast.show({
                text: 'Problem Uploading Profile Picture' + e,
                duration: 3000,
                type: 'danger'
            });
          
        }
    }

    delete(index) {

        let temp = this.state.h1ProductData;
        temp.splice(index, 1)
        this.setState({ h1ProductData: temp })

    }
    async changePharmacy() {
        await this.setState({ pharmacyInfo: null });
        this.selectedItem(1)


    }

    render() {
        const { itemSelected, deliveryAddressArray, isLoading, deliveryDetails, pickupOPtionEnabled, medicineTotalAmount, medicineTotalAmountwithDeliveryChage, pharmacyInfo, isPrescription, prescriptionDetails, isH1Product, h1ProductData } = this.state

        return (
            <Container style={{ flex: 1 }}>
                <Content style={{ backgroundColor: '#F5F5F5', padding: 10, flex: 1 }}>
                    <NavigationEvents
                        onWillFocus={payload => { this.backNavigation(payload) }}
                    />{isLoading === true ?
                        <Spinner color="blue"
                            visible={isLoading} /> :
                        this.state.medicineDetails.length != 0 || prescriptionDetails !== null ?
                            <View>

                                <View style={{ backgroundColor: '#fff', padding: 10 }}>
                                    <Row onPress={() => this.selectedItem(0)}>
                                        <Col size={5}>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 14, fontWeight: '500' }}>Home Delivery</Text>
                                        </Col>
                                        <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                            <Radio
                                                standardStyle={true}
                                                selected={itemSelected === 0 ? true : false}
                                                onPress={() => this.selectedItem(0)} />
                                        </Col>
                                    </Row>
                                </View>
                                {itemSelected === 0 ?
                                    <View >
                                        <Row style={{ marginTop: 10, marginBottom: 10 }}>
                                            <Col size={5}>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: primaryColor }}>Delivery Address</Text>
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
                                                            <Row style={{ borderBottomWidth: 0.3, paddingBottom: 10, marginTop: 5, marginLeft: 5, justifyContent: 'center', borderBottomColor: 'gray' }}>
                                                                <Col size={1} style={{ justifyContent: 'center' }}>
                                                                    <Radio
                                                                        standardStyle={true}
                                                                        selected={this.state.selectedAddress === item ? true : false}
                                                                        onPress={() => this.setState({ selectedAddress: item })} />
                                                                </Col>

                                                                <Col size={9} style={{ justifyContent: 'center' }}>
                                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '300', marginTop: 2, }}>{item.full_name}</Text>
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



                                <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                                    <Row onPress={() => this.selectedItem(1)}>
                                        <Col size={5}>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 14, fontWeight: '500' }}>Pick up at Store</Text>
                                        </Col>
                                        <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={itemSelected === 1 ? true : false}
                                                onPress={() => this.selectedItem(1)} />
                                        </Col>
                                    </Row>
                                </View>



                                {itemSelected === 1 && pharmacyInfo !== null ?
                                    <View style={{ padding: 10 }}>
                                        {/* <Col style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                            
                                        </Col> */}
                                        <Row >
                                            <Col size={5}>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: primaryColor }}>Store Address</Text>
                                            </Col>
                                            <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                                <TouchableOpacity onPress={() => this.changePharmacy()}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#ff4e42' }}>change Store</Text>
                                                </TouchableOpacity>
                                            </Col>
                                        </Row>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '300', marginTop: 5 }}>{pharmacyInfo.full_name}</Text>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2, color: '#6a6a6a' }}>{getAddress(pharmacyInfo.location)}</Text>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 2 }}>{'Mobile -' + (pharmacyInfo.mobile_no || 'Nil')}</Text>
                                    </View> :

                                    null}



                                <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5, marginBottom: 20 }}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: primaryColor }}>Order Details</Text>
                                    {isPrescription === false ?
                                        this.state.medicineDetails.length != 0 ?
                                            <FlatList
                                                data={this.state.medicineDetails}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({ item }) =>
                                                    <Row style={{ marginTop: 10 }}>
                                                        <Col size={8}>
                                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#6a6a6a' }}>{getMedicineNameByProductName(item) + ' -'}
                                                                {item.item.isH1Product && <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '400', color: 'red' }}>
                                                                    {'*prescription'}</Text>}
                                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#8dc63f' }}>{'(X' + item.item.quantity + ')'}</Text> </Text>
                                                            {/* </Text> */}
                                                        </Col>
                                                        <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>{'₹' + item.item.totalPrice || ''} </Text>

                                                        </Col>
                                                    </Row>
                                                } />
                                            : <Row style={{ marginTop: 10 }}>
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

                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>{prescriptionDetails !== null ? prescriptionDetails.prescription_ref_no : 'N/A'} </Text>

                                            </Col>
                                        </Row>}
                                    {deliveryDetails !== null && itemSelected === 0 ?
                                        <View >
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
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>{'₹' + (medicineTotalAmountwithDeliveryChage || 0)} </Text>
                                                : itemSelected === 0 ?
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>{(deliveryDetails != null ? 'Medicine Charges by Pharmacy + ' + (deliveryDetails.delivery_tax + deliveryDetails.delivery_charges) : ' ')} </Text>
                                                    : <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>{'Medicine Charges by Pharmacy'} </Text>
                                            }
                                        </Col>
                                    </Row>
                                </View>
                            </View> : <Text style={{ fontFamily: 'OpenSans', fontSize: 24, color: '#6a6a6a', marginTop: "40%", marginLeft: 55, alignContent: 'center' }}>No orders Available</Text>
                    }
                    {h1ProductData.length !== 0 ?
                        <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
                            <FlatList
                                data={this.state.h1ProductData}
                                extraData={this.state.h1ProductData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) =>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col size={9}>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: { uri: item.imageURL }, title: 'prescription' })}>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#6a6a6a' }}>
                                                    {item.file_name}
                                                </Text>
                                            </TouchableOpacity>
                                        </Col>

                                        <Col size={1} style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                            <Icon onPress={() => this.delete(index)} name={IS_IOS ? 'ios-close-circle' : 'md-close-circle'}
                                                style={{ color: 'red', fontSize: 20 }} />
                                        </Col>
                                    </Row>
                                } />
                            <TouchableOpacity onPress={() => this.setState({ isH1Product: true })} style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Icon name='add' style={{ color: 'gray', fontSize: 20 }} />
                                <Text uppercase={false} style={styles.customText}>Add More Prescription</Text>
                            </TouchableOpacity>
                        </View>
                        : null

                    }

                    <AwesomeAlert
                        show={false}
                        showProgress={false}
                        title={`You have chosen a prescription mandatory product.Kindly upload a prescription`}
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={true}
                        showCancelButton={true}
                        showConfirmButton={true}
                        cancelText="Reject"
                        confirmText="Accept"
                        cancelButtonColor="red"
                        confirmButtonColor="green"
                        onCancelPressed={this._onPressReject}
                        onConfirmPressed={this._onPressAccept}
                        onDismiss={this.hideInomingCallModal}
                        alertContainerStyle={{ zIndex: 1 }}
                        titleStyle={{ fontSize: 21 }}
                        cancelButtonTextStyle={{ fontSize: 18 }}
                        confirmButtonTextStyle={{ fontSize: 18 }}
                    />
                    <Modal
                        visible={isH1Product}
                        transparent={true}
                        animationType={'fade'}
                    >
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}>
                            <View style={{
                                width: '80%',
                                backgroundColor: '#fff',
                                borderColor: 'gray',
                                borderWidth: 3,
                                padding: 25,
                                borderRadius: 5
                            }}>


                                <Text style={{ fontSize: 22, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center' }}>You have chosen a prescription mandatory product.Kindly upload a prescription</Text>
                                {/* </Item> */}

                                <Button transparent style={{ paddingTop: 5, paddingBottom: 5, marginTop: 20 }} onPress={() => this.uploadProfilePicture("Camera")} testID='chooseCemara'>
                                    <Text style={{ fontSize: 18, fontFamily: 'OpenSans', marginTop: 10 }}>Take Photo</Text>
                                </Button>
                                <Button transparent style={{ paddingTop: 5, paddingBottom: 5 }} onPress={() => this.uploadProfilePicture("Library")} testID='chooselibrary'>
                                    <Text style={{ fontSize: 18, fontFamily: 'OpenSans', marginTop: 10 }}>Choose from Library</Text>
                                </Button>

                                <Row style={{ marginTop: 50, marginBottom: 20 }}>
                                    <Right style={{ marginTop: 15 }} >
                                        <Button transparent style={{ marginTop: 15, alignItems: 'flex-end' }}

                                            onPress={() => this.setState({ isH1Product: false })}
                                            testID='cancleButton'>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 18, }}> Cancel</Text>
                                        </Button>
                                    </Right>
                                </Row>
                            </View>

                        </View>
                    </Modal>

                </Content>
                {isPrescription === false && this.state.medicineDetails.length === 0 ? null :
                    <Footer style={
                        Platform.OS === "ios" ?
                            { height: 40 } : { height: 45 }}>
                        <FooterTab>
                            <Row>
                                <Col size={5} style={{ backgroundColor: '#fff' }}>
                                    <Row style={{ alignItems: 'center', justifyContent: 'center', }}>
                                        <TouchableOpacity style={styles.buttonTouch} onPress={() => this.processToPayLater()} >
                                            <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#000', fontWeight: '400' }}>{itemSelected == 0 ? 'Cash On Delivery' : 'Cash on Pickup'} </Text>
                                        </TouchableOpacity>
                                    </Row>
                                </Col>
                                {isPrescription === false && medicineTotalAmountwithDeliveryChage ?
                                    <Col size={5} style={{ backgroundColor: '#8dc63f' }}>
                                        <Row style={{ alignItems: 'center', justifyContent: 'center', }}>
                                            <TouchableOpacity style={styles.buttonTouch} onPress={() => this.onProceedToPayment(true)}>
                                                <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#fff', fontWeight: '400' }}>Proceed</Text>
                                            </TouchableOpacity>
                                        </Row>
                                    </Col> : null}
                            </Row>
                        </FooterTab>
                    </Footer>}


            </Container >
        );
    }
}

function MedicineCheckoutState(state) {
    return {
        bookappointment: state.bookappointment,
    }
}
export default connect(MedicineCheckoutState)(MedicineCheckout)

const styles = StyleSheet.create({

    container: {
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
        backgroundColor: primaryColor,
        borderRadius: 5,
    },
    normalText: {
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
    customText: {
        marginLeft: 10,
        fontFamily: 'OpenSans',
        fontSize: 13,
        marginTop: 2,
        color: 'gray'
    },
    customSubText: {
        marginLeft: 2,
        fontFamily: 'OpenSans',
        fontSize: 13,
        marginTop: 3,
        color: 'gray'
    },
    transparentLabel: {
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
    addressLabel: {
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
    buttonTouch: {
        flexDirection: 'row',
        borderRadius: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },

});



