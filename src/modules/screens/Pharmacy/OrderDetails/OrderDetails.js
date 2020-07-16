import React, { Component } from 'react';
import {
    Container, Content, Text, Item, View, Icon, Toast
} from 'native-base';
import StarRating from 'react-native-star-rating';
import { Col, Row } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import { formatDate } from '../../../../setup/helpers';
import { getMedicineOrderDetails, upDateOrderData, getOrderTracking, getMedicineOrderDetailsByOrderId } from '../../../providers/pharmacy/pharmacy.action';
import { statusBar, renderPrescriptionImageAnimation, renderMedicineImage, getName, renderMedicineImageByimageUrl } from '../CommomPharmacy';
import { NavigationEvents } from 'react-navigation';
import { getPaymentInfomation } from '../../../providers/bookappointment/bookappointment.action'
import Spinner from '../../../../components/Spinner';
import { getUserRepportDetails } from '../../../providers/reportIssue/reportIssue.action';
import { OrderInsertReview } from '../MedicineInfo/medInsertReview'
import SwiperFlatList from 'react-native-swiper-flatlist';
import ImageZoom from 'react-native-image-pan-zoom';


/*
  TODO: 
    1. Need to make the Arriving on Draw Line Dynamically

*/

class OrderDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orderId: null,
            reportData: null,
            orderDetails: {},
            orderList: [],
            paymentDetails: {},
            isLoading: true,
            modalVisible: false,

            statusSlap: []
        }
    }
    async componentDidMount() {
        const { navigation } = this.props;
        const prevState = navigation.getParam('prevState') || null;


        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);


        let orderNumber = this.props.navigation.getParam('serviceId') || null

        let getOderSlap = true

        this.medicineOrderDetails(orderNumber, getOderSlap);


    }
    removeBackHandlerListerner() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }
    onBackPress = () => {
        try {
            const { dispatch, navigation } = this.props;

            const prevState = navigation.getParam('prevState') || null;

            if (prevState === 'CREATE_ORDER') {
                navigation.navigate('Home');
                return true;

            } else {
                navigation.pop();
                return true;
            }
        }
        catch (e) {
            console.log(e)
        }

    };


    async medicineOrderDetails(orderNumber, getOderSlap) {
        try {
            this.setState({ isLoading: true });
            let result = null;
            let userId = await AsyncStorage.getItem('userId')
            const fromNotification = this.props.navigation.getParam('fromNotification') || false
            if (fromNotification) {
                result = await getMedicineOrderDetailsByOrderId(orderNumber);
            } else {
                result = await getMedicineOrderDetails(orderNumber);
            }
           

            if (result !== null) {

                await this.setState({ orderDetails: result });
                this.getUserReport()
                if (getOderSlap) {

                    let statusSlap = await getOrderTracking(result.orderNumber)

                    if (statusSlap) {
                        this.setState({ statusSlap })
                    }
                }

                if (result.status === 'DELIVERED' && (result.isReviewSkipped === null)) {
                    await this.setState({ modalVisible: true })
                }
                this.getPaymentInfo(result.paymentId)
            }
            this.setState({ isLoading: false });
        }
        catch (e) {
            console.log(e);
        } finally {
            this.setState({ isLoading: false });
        }
    }
    getUserReport = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            let orderId = this.state.orderDetails.id || null
            let resultReport = await getUserRepportDetails('MEDICINE_ORDER', userId, orderId);


            if (resultReport.success) {

                this.setState({ reportData: resultReport.data });
            }
        }

        catch (e) {
            console.error(e);
        }

    }



    getAddress(address) {
        if (address.delivery_address) {
            let temp = address.delivery_address.address;
            if (temp) {
                return `${temp.no_and_street || ''},${temp.address_line_1 || ''},${temp.district || ''},${temp.city || ''},${temp.state || ''},${temp.country || ''},${temp.pin_code || ''}`
            } else {
                return null
            }
        } else {
            return null
        }
    }
    getName(name) {
        if (name.delivery_address) {
            let temp = name.delivery_address;
            return `${temp.full_name || ''}`
        } else {
            return null
        }
    }
    getMobile(number) {
        if (number.delivery_address) {
            let temp = number.delivery_address;
            return `${temp.mobile_no || ''}`
        } else {
            return null
        }
    }

    // getFinalPriceOfOrder(orderItems) {
    //     let finalPriceForOrder = 0;
    //     if (orderItems.length !== null) {
    //         if (this.state.orderDetails.is_order_type_recommentation === true) {
    //             orderItems.forEach(element => {
    //                 finalPriceForOrder += Number(element.medicine_recommentation_max_price);
    //             });

    //         } else {
    //             orderItems.forEach(element => {
    //                 finalPriceForOrder += Number(element.final_price);
    //             });
    //         }
    //     }
    //     return finalPriceForOrder;
    // }
    getGrandTotal(orderInfo) {
        const itemTotal = this.getFinalPriceOfOrder(orderInfo || null);
        const deliveryCharge = orderInfo.delivery_charges;
        const deliveryTax = orderInfo.delivery_tax
        let totalAmount = Number(Number(itemTotal) + Number(deliveryCharge || 0) + Number(deliveryTax || 0)).toFixed(2)
        if (itemTotal === 0) {
            return totalAmount + ' + Medicine Charges By Pharmacy'
        }
        return `${totalAmount || ''}`
    }
    getPaymentInfo = async (paymentId) => {
        try {
            let result = await getPaymentInfomation(paymentId);

            if (result.success) {
                this.setState({ paymentDetails: result.data[0] })
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    async cancelOreder(reasonForCancelComment, reasonForCancel) {

        const { orderDetails } = this.state

        let userId = await AsyncStorage.getItem('userId');
        let reqData = {

            orderNumber: orderDetails.orderNumber,
            reasonForCancel: reasonForCancel,
            reasonForCancelComment: reasonForCancelComment,
            userId: userId
        }


        let result = await upDateOrderData(reqData)

        if (result) {
            let getOrderSlap = true;
            await AsyncStorage.setItem('hasReload', 'true');
            this.medicineOrderDetails(orderDetails.orderNumber, getOrderSlap)
        } else {
            Toast.show({
                text: 'order not canceled',
                duration: 3000,
                type: 'warning'
            })
        }


    }

    async backNavigation() {
        const { navigation } = this.props;
        if (navigation.state.params) {
            if (navigation.state.params.hasReloadReportIssue) {
                this.getUserReport();  // Reload the Reported issues when they reload
            }
            if (navigation.state.params.hasUpdateCancelService) {
                this.cancelOreder(navigation.state.params.reasonForCancelComment, navigation.state.params.reasonForCancel)
            }
        };
    }


    async getvisble(val) {
        try {

            await this.setState({ isLoading: true, modalVisible: false })
            if (val.reviewUpdated === true) {
                let getOderSlap = false;
                this.medicineOrderDetails(this.state.orderDetails.orderNumber, getOderSlap)
            }
        } catch (e) {
            console.log(e)
        }
        finally {
            await this.setState({ isLoading: false })
        }
    }
    navigateAddReview() {
        this.setState({
            modalVisible: true
        });

    }
    render() {
        const { navigation } = this.props;
        const { isLoading, orderDetails, paymentDetails, reportData, isCancel } = this.state;

        return (
            <Container style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => { this.backNavigation(payload) }}



                />
                <Content style={{ backgroundColor: '#F5F5F5', padding: 10, flex: 1 }}>


                    <Spinner
                        visible={isLoading}
                    />

                    <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
                        <Row>
                            <Col size={5}>
                                <Text style={styles.orderIdText}>Order Id</Text>
                            </Col>
                            <Col size={5}>
                                <Text style={{ fontSize: 12, textAlign: 'right', marginTop: 13, fontFamily: 'OpenSans' }}>{orderDetails.orderNumber || ''}</Text>
                            </Col>
                        </Row>
                    </View>
                    <View style={{ backgroundColor: '#fff', padding: 10, }}>
                        {/* <Text style={styles.arrHeadText}>Arriving On Today</Text> */}
                        {this.state.statusSlap.length !== 0 ?
                            <FlatList
                                style={{ marginTop: 10 }}
                                data={this.state.statusSlap}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) =>
                                    <Row style={{}}>
                                        <Col size={0.7}>
                                            {statusBar[item.status].checked === true ?
                                                <TouchableOpacity style={styles.lengthTouch}>
                                                </TouchableOpacity> : null}

                                            {statusBar[item.status].checked === false ?
                                                <TouchableOpacity style={styles.bottomText}>
                                                </TouchableOpacity> :
                                                null}

                                            {statusBar[item.status].checked === true && this.state.statusSlap.length !== (Number(index) + 1) ?
                                                <TouchableOpacity style={styles.TouchLegth}>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity style={{
                                                    height: 60,
                                                    padding: 1,
                                                    width: 4,
                                                    marginLeft: 4
                                                }}>
                                                </TouchableOpacity>}
                                        </Col>
                                        <Col size={9.3}>
                                            <View style={{ marginTop: -3 }}>
                                                <Text style={styles.trackingText}>{statusBar[item.status].status}</Text>
                                                <Text style={{ fontSize: 12, fontFamily: 'OpenSans', color: '#909090' }}>{formatDate(item.updatedDate, ' Do MMMM YYYY ') + ' at ' + formatDate(item.updatedDate, 'h:mm:ss a')}</Text>
                                            </View>

                                        </Col>
                                    </Row>
                                } />

                            : null}
                        <Text style={{ fontSize: 14, fontWeight: '500', fontFamily: 'OpenSans', color: '#7F49C3', marginTop: 10 }}>Ordered Medicines</Text>
                        {orderDetails.prescriptions !== null && orderDetails.prescriptions !== undefined && orderDetails.prescriptions.length !== 0 ?

                            <View style={{ flex: 1, marginLeft: 10, marginRight: 10, marginTop: 10, justifyContent: 'center', alignItems: 'center', }}>
                                <ImageZoom cropWidth={200}
                                    cropHeight={200}
                                    imageWidth={200}
                                    minScale={0.6}
                                    panToMove={false}
                                    pinchToZoom={false}
                                    enableDoubleClickZoom={false}

                                    imageHeight={200}>
                                    <SwiperFlatList
                                        autoplay
                                        autoplayDelay={3}
                                        index={orderDetails.prescriptions.length - 1}
                                        contentContainerStyle={{ flexGrow: 1, }}
                                        autoplayLoop
                                        data={orderDetails.prescriptions}
                                        renderItem={({ item }) =>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: { uri: item.prescription_path }, title: 'prescription' })}>
                                                <Image
                                                    source={renderPrescriptionImageAnimation(item)}
                                                    style={{
                                                        width: 200, height: 200,
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        }
                                        showPagination
                                    />
                                </ImageZoom>
                            </View> : null}
                        {orderDetails.items !== undefined && orderDetails.items !== null && orderDetails.items.length !== 0 ?
                            <FlatList
                                data={orderDetails.items}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={orderDetails.items}
                                renderItem={({ item }) =>
                                    <Row style={styles.rowStyle}>
                                        <Col size={2}>
                                            <Image
                                                source={renderMedicineImageByimageUrl(item)}
                                                style={{
                                                    width: 60, height: 60, alignItems: 'center'
                                                }}
                                            />
                                        </Col>
                                        <Col size={8} style={[styles.nameText, { marginTop: 5 }]}>
                                            <Text style={styles.nameText}>{item.productName}</Text>


                                        </Col>
                                        <Col size={2} style={[styles.nameText, { alignSelf: 'flex-end' }]}>

                                            <Text style={styles.amountText}>₹{item.totalPrice}</Text>

                                        </Col>
                                    </Row>
                                } /> : null}


                        <Row style={{ marginTop: 10 }}>
                            <Col size={5}>
                                <Text style={styles.ItemText}>Medicine total amount</Text>

                            </Col>
                            <Col size={5}>
                                <Text style={styles.rsText}>₹ {orderDetails.prescriptions === null ? orderDetails.totalAmount : ' Medicine Charges By Pharmacy'}</Text>
                            </Col>
                        </Row>


                        <View>
                            <Row style={{ marginTop: 10 }}>
                                <Col size={5}>
                                    <Text style={styles.mainText}>Delivery Charges</Text>

                                </Col>
                                <Col size={5}>
                                    <Text style={styles.rsText}>₹ {orderDetails.deliveryType === 0 ? (orderDetails.delivery_charges || 0) : '--'}</Text>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col size={5}>
                                    <Text style={styles.mainText}>Tax</Text>

                                </Col>
                                <Col size={5}>
                                    <Text style={styles.rsText}>₹ {orderDetails.deliveryType === 0 ? orderDetails.delivery_tax || 0 : '--'}</Text>
                                </Col>
                            </Row>
                        </View>

                        <Row style={{ marginTop: 10 }}>
                            <Col size={5}>
                                <Text style={styles.grandTotalText}>Grand Total</Text>

                            </Col>
                            <Col size={5}>
                                <Text style={styles.totalsText}>₹ {orderDetails.prescriptions === null ? orderDetails.totalAmount : ' Medicine Charges By Pharmacy'}</Text>
                            </Col>
                        </Row>
                    </View>
                    {orderDetails.status === "PENDING" ?
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 10 }}>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('CancelService', { serviceType: 'MEDICINE_ORDER', prevState: this.props.navigation.state, tittle: 'Cancel Order' })}
                                block danger
                                style={styles.reviewButton1
                                }>
                                <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}>
                                    CANCEL ORDER
                        </Text>
                            </TouchableOpacity>
                        </View> : orderDetails.status === "CANCELLED" ?
                            <View style={{ borderRadius: 5, borderColor: 'grey', borderWidth: 0.5, padding: 5 }} >

                                <Text note style={[styles.subTextInner2, { marginLeft: 10 }]}>{orderDetails.reasonForCancel}</Text>
                                <Row>
                                    <Col size={9}>
                                        <Text note style={[styles.subTextInner1, { marginLeft: 10 }]}>{orderDetails.commentForCancel || ' '}</Text>

                                    </Col>
                                    <Col size={1}>

                                    </Col>
                                </Row>

                            </View> : null}
                    <Text style={{ fontSize: 14, fontWeight: '500', fontFamily: 'OpenSans', color: '#7F49C3', marginTop: 10 }}>Medicine order Report</Text>

                    {reportData != null ?
                        <View style={{ borderRadius: 5, borderColor: 'grey', borderWidth: 0.5, padding: 5 }} >
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('ReportDetails', { reportedId: orderDetails.id, serviceType: 'MEDICINE_ORDER' }) }}>
                                <Text note style={[styles.subTextInner2, { marginLeft: 10 }]}>"You have raised Report for this medicine orders"</Text>
                                <Row>
                                    <Col size={9}>
                                        <Text note style={[styles.subTextInner1, { marginLeft: 10 }]}>{reportData.issue_type || ' '}</Text>

                                    </Col>
                                    <Col size={1}>
                                        <Icon name='ios-arrow-forward' style={{ fontSize: 20, color: 'grey' }} />
                                    </Col>
                                </Row>
                            </TouchableOpacity>
                        </View> :

                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 10 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('ReportIssue', {
                                        issueFor: { serviceType: 'MEDICINE_ORDER', reportedId: orderDetails.id, status: orderDetails.status },
                                        prevState: this.props.navigation.state
                                    })
                                }}
                                block success
                                style={styles.reviewButton
                                }>
                                <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}>
                                    Report Issue
                        </Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {orderDetails.status === 'DELIVERED' && orderDetails.rating !== null && orderDetails.rating !== 0 ?
                        <View>
                            <Text style={{ fontSize: 14, fontWeight: '500', fontFamily: 'OpenSans', color: '#7F49C3', marginTop: 10 }}>Review</Text>

                            <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                                disabled={false}
                                maxStars={5}
                                rating={orderDetails.rating}
                            />
                            <Text note style={styles.subTextInner1}>{orderDetails.reviewComment || ''}</Text>
                        </View>
                        :
                        (orderDetails.status === 'DELIVERED' && orderDetails.rating === null) ?
                            <View>
                                <Text style={{ fontSize: 14, fontWeight: '500', fontFamily: 'OpenSans', color: '#7F49C3', marginTop: 10 }}>Add Review</Text>


                                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 10 }}>
                                    <TouchableOpacity block success style={styles.reviewButton} onPress={() => this.navigateAddReview()} testID='addFeedBack'>

                                        <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}> ADD FEEDBACK </Text>
                                        <Icon name="create" style={{ fontSize: 20, marginTop: 3, marginLeft: 5, color: '#fff' }}></Icon>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            : null
                    }


                    {orderDetails.status === 'DELIVERED' &&orderDetails.prescriptions === null?
                        <View>
 


                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 10 }}>
                                <TouchableOpacity block success style={styles.reviewButton} onPress={() => this.props.navigation.navigate('PharmacyCart',{reOrderData:orderDetails.items,isReOrder:true})} testID='addFeedBack'>

                                    <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}>RE ORDER</Text>
                                    <Icon name="create" style={{ fontSize: 20, marginTop: 3, marginLeft: 5, color: '#fff' }}></Icon>
                                </TouchableOpacity>
                            </View>
                        </View>

                        : null
                    }

                    <View style={styles.mainView}>
                        <Text style={styles.orderText}>Order Details</Text>
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.innerText}>Payment</Text>
                            <Text style={styles.rightText}>{paymentDetails.payment_method || 0}</Text>
                        </View>


                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.innerText}>Delivery mode</Text>
                            <Text style={styles.rightText}>{orderDetails.deliveryType === 0 ? 'Home delivery' : 'store pickup'}</Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.innerText}>Ordered On</Text>
                            <Text style={styles.rightText}>{formatDate(orderDetails.created_date, 'Do MMM,YYYY')}</Text>
                        </View>
                        <View style={{ marginTop: 10, paddingBottom: 10 }}>
                            <Text style={styles.innerText}>Delivery Details</Text>
                            <Text style={styles.nameTextss}>{this.getName(orderDetails)}</Text>
                            <Text style={styles.addressText}>{this.getAddress(orderDetails)}</Text>
                            <Text style={styles.addressText}>Mobile - {this.getMobile(orderDetails)}</Text>

                        </View>
                        {
                            orderDetails.deliveryType === 0 && orderDetails.delivery_boy_details !== undefined ?
                                <View style={{ marginTop: 10, paddingBottom: 10 }}>
                                    <Text style={styles.innerText}>delivey boy Details</Text>
                                    <Text style={styles.addressText}> ref_no -{orderDetails.delivery_boy_details.delivery_boy_ref_no}</Text>
                                    <Text style={styles.nameTextss}>Name-{orderDetails.delivery_boy_details.full_name}</Text>
                                    <Text style={styles.addressText}>Mobile - {this.getMobile(orderDetails.delivery_boy_details)}</Text>

                                </View> : null
                        }
                        {this.state.modalVisible == true ?
                            <OrderInsertReview
                                data={this.state.orderDetails}
                                popupVisible={(data) => this.getvisble(data)}

                            />
                            : null}
                    </View>
                </Content>
            </Container>
        )
    }
}


export default OrderDetails
const styles = StyleSheet.create({
    container:
    {
        backgroundColor: '#ffffff',
        flex: 1
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
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold'
    },
    customText:
    {
        fontFamily: 'OpenSans',
        fontSize: 16,
        color: '#2F3940',
        fontWeight: 'bold'
    },
    labelTop:
    {
        fontFamily: 'OpenSans',
        fontSize: 18,
        fontWeight: 'bold'
    },

    textDesc:
    {
        fontFamily: 'OpenSans',
        fontSize: 14,
        width: '80%'
    },
    medName:
    {
        fontFamily: 'OpenSans',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5
    },
    medPhar:
    {
        fontFamily: 'OpenSans',
        fontSize: 12,
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
    },
    badgeText:
    {
        height: 30,
        width: 30,
        backgroundColor: 'red',
        borderRadius: 15,
        color: '#fff',
        paddingLeft: 10,
        paddingTop: 5
    },
    button1: {
        backgroundColor: "#5cb75d",
        marginLeft: 20,
        marginTop: -10,
        borderRadius: 10,
        justifyContent: 'center',
        padding: 5,
    },
    button2: {
        marginLeft: 70,
        marginTop: -5,
        borderRadius: 10,
        justifyContent: 'center',
        padding: 5,
        height: 35,
        backgroundColor: 'gray',
    },
    curvedGrid: {
        borderRadius: 800,
        width: '200%',
        height: 690,
        marginLeft: -200,
        marginTop: -600,
        position: 'relative',
        bottom: 0,
        overflow: 'hidden',
        backgroundColor: '#745DA6'
    },

    subText: {
        fontFamily: 'OpenSans',
        fontSize: 17,
        color: '#c26c57',
        marginLeft: 10,
        fontWeight: "bold"
    },
    delHeadText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        fontWeight: '500',
        color: '#ff4e42'
    },
    arrHeadText: {
        fontFamily: 'OpenSans',
        fontSize: 17,
        fontWeight: '500',
        color: '#8dc63f'
    },
    rowStyle: {
        marginTop: 15,
        paddingBottom: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.3
    },
    nameText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 14,
        fontWeight: '500',
        color: '#4c4c4c'
    },
    pharText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#909090',
        marginTop: 3
    },
    amountText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#8dc63f',
        textAlign: 'right'
    },
    ItemText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        fontWeight: '500',
        color: '#7F49C3'
    },
    rsText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#4c4c4c',
        textAlign: 'right'
    },
    mainText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#909090'
    },
    grandTotalText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        fontWeight: '500',
        color: '#7F49C3'
    },
    totalsText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#8dc63f',
        textAlign: 'right'
    },
    mainView: {
        backgroundColor: '#fff',
        padding: 10,
        marginTop: 5,
    },
    orderText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        fontWeight: '500',
        color: '#4c4c4c'
    },
    innerText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        fontWeight: '500',
        color: '#7F49C3'
    },
    rightText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#4c4c4c'

    },
    addressText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#4c4c4c',
        marginTop: 5
    },
    nameTextss: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#4c4c4c',
        fontWeight: '500',
        marginTop: 5
    },
    lengthTouch: {
        height: 12,
        width: 12,
        borderRadius: 12 / 2,
        backgroundColor: '#7F49C3'
    },
    TouchLegth: {
        height: 60,
        backgroundColor: '#7F49C3',
        padding: 1,
        width: 4,
        marginLeft: 4
    },
    bottomText: {
        height: 12,
        width: 12,
        borderRadius: 12 / 2,
        borderColor: 'gray',
        borderWidth: 0.3
    },
    trackingText: {
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'OpenSans',
        color: '#4c4c4c'
    },
    orderIdText: {
        fontSize: 17,
        fontWeight: '500',
        fontFamily: 'OpenSans',
        color: '#7F49C3', marginTop: 8
    },
    reviewButton: {
        marginTop: 12,
        backgroundColor: '#775DA3',
        borderRadius: 10,
        height: 40,
        color: 'white',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 5,
        paddingTop: 5,
        flexDirection: 'row'
    },
    reviewButton1: {
        marginTop: 12,
        backgroundColor: 'red',
        borderRadius: 10,
        height: 40,
        color: 'white',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 5,
        paddingTop: 5,
        flexDirection: 'row'
    },
    subTextInner2: {
        fontSize: 10,
        color: "red",
        fontFamily: 'OpenSans',
        marginBottom: 5
    },
    subTextInner1: {
        fontSize: 12,
        fontFamily: 'OpenSans',
        marginBottom: 5
    },
});
