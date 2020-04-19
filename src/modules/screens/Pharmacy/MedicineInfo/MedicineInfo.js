import React, { Component } from 'react';
import { Container, Content, Text, Toast, Icon, View, Col, Row, Picker } from 'native-base';
import { StyleSheet, Image, AsyncStorage, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { getSelectedMedicineDetails, getMedicineReviews, getMedicineReviewsCount } from '../../../providers/pharmacy/pharmacy.action'
import { medicineRateAfterOffer, setCartItemCountOnNavigation, renderMedicineImageAnimation, getMedicineName } from '../CommomPharmacy';
import Spinner from '../../../../components/Spinner';
import { dateDiff, getMoment, formatDate } from '../../../../setup/helpers'
import { MedInsertReview } from './medInsertReview'
import { AddToCard } from '../AddToCardBuyNow/AddToCard'
import SwiperFlatList from 'react-native-swiper-flatlist';
import ImageZoom from 'react-native-image-pan-zoom';

let medicineId, userId;
class MedicineInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            medicineData: {
                medInfo: {
                },
                pharmacyInfo: {
                },
                medPharDetailInfo: {}
            },
            pharmacyData: '',
            isLoading: false,
            reviewData: [],
            isBuyNow: false,
            isAddToCart: false,
            selectedMedcine: '',
            isReviewInsert: false,
            insertReviewData: '',
            modalVisible: false,
            reviewCount: '',
            cartItems: [],
            finalRating: '',
            enlargeContent: false
        };

    }
    relativeTimeView(review_date) {
        try {
            var postedDate = review_date;
            var currentDate = new Date();
            var relativeDate = dateDiff(postedDate, currentDate, 'days');
            if (relativeDate > 30) {
                return formatDate(review_date, "DD-MM-YYYY")
            } else {
                return getMoment(review_date, "YYYYMMDD").fromNow();
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    async componentDidMount() {
        medicineId = this.props.navigation.getParam('medicineId');
        pharmacyId = this.props.navigation.getParam('pharmacyId');
        this.setState({ isLoading: true });
        await new Promise.all([
            this.getSelectedMedicineDetails(),
            this.getMedicineReviewDetails(),
            this.getMedicineReviewCount(),
        ])
        this.setState({ isLoading: false });
        userId = await AsyncStorage.getItem('userId')
        if (userId) {
            let cart = await AsyncStorage.getItem('cartItems-' + userId) || []
            if (cart.length != 0) {
                let cartData = JSON.parse(cart)
                this.setState({ cartItems: cartData })
                setCartItemCountOnNavigation(this.props.navigation);
            }
        }

    }

    getSelectedMedicineDetails = async () => {
        try {

            medicineId = this.props.navigation.getParam('medicineId');
            pharmacyId = this.props.navigation.getParam('pharmacyId');
            let result = await getSelectedMedicineDetails(medicineId, pharmacyId);
            console.log(JSON.stringify(result))
            if (result.success) {
                if (result.data.medPharDetailInfo) {
                    if (result.data.medPharDetailInfo.variations) {

                        result.data.medPharDetailInfo.variations.sort(function (firstVarlue, secandValue) {


                            if (firstVarlue.total_quantity === 0) {
                                return 1;
                            }
                            else if (secandValue.total_quantity === 0) {
                                return -1;
                            }
                            else {
                                return firstVarlue.price - secandValue.price;
                            }
                        });

                    }
                }
                temp = result.data.medPharDetailInfo

                mergeObject = Object.assign(temp, result.data.medPharDetailInfo.variations[0])
                let tempObject = {
                    ...result.data,
                    medPharDetailInfo: mergeObject

                }
                this.setState({ medicineData: tempObject })

            }

        }
        catch (e) {
            console.log(e)
        }

    }

    getMedicineReviewDetails = async () => {
        try {

            let result = await getMedicineReviews(medicineId);
            if (result.success) {
                this.setState({ reviewData: result.data })
            } else {
                this.setState({ reviewData: [] });
            }
        }
        catch (e) {
            console.log(e)
        }

    }

    getMedicineReviewCount = async () => {
        try {

            let result = await getMedicineReviewsCount(medicineId);
            if (result.success) {
                // await this.setState({ reviewCount: result.data[0] })
                let temp = result.data[0].final_rating
                this.setState({ finalRating: temp, reviewCount: result.data[0] })
            }
            else {
                this.setState({ reviewCount: '' });

            }
        }
        catch (e) {
            console.log(e)
        }

    }
    async selectedItems(data, selected, index) {
        try {
            let temp = {
                ...data.medInfo,
                ...data.medPharDetailInfo
            }
            temp.pharmacy_name = data.pharmacyInfo.name;
            temp.pharmacy_id = data.pharmacyInfo.pharmacy_id
            temp.medicine_id = data.medInfo.medicine_id
            temp.pharmacyInfo = data.pharmacyInfo;

            temp.offeredAmount = medicineRateAfterOffer(data.medPharDetailInfo)
            temp.selectedType = selected;
            if (index !== undefined) {
                cardItems = this.state.cartItems;
                temp.userAddedMedicineQuantity = cardItems[index].userAddedMedicineQuantity
                temp.index = index
            }
            await this.setState({ selectedMedcine: temp })

        } catch (e) {
            console.log(e)
        }

    }
    getVisible = async (val) => {
        try {
            if (val.isNavigate) {
                this.setState({ isBuyNow: false })
                let temp = [];
                temp.push(val.medicineData)
                this.props.navigation.navigate("MedicineCheckout", {
                    medicineDetails: temp
                })
            }
            else if (val.isNavigateCart) {
                setCartItemCountOnNavigation(this.props.navigation);
                Toast.show({
                    text: 'Item added to card',
                    duration: 3000,

                })
                if (userId) {
                    let cart = await AsyncStorage.getItem('cartItems-' + userId) || []
                    if (cart.length != 0) {
                        let cardData = JSON.parse(cart)
                        await this.setState({ cartItems: cardData })
                    }
                }
                this.setState({ isAddToCart: false })
            }
            else {
                this.setState({ isAddToCart: false, isBuyNow: false })
            }
        } catch (e) {
            console.log(e)
        }
    }
    async insertReview() {
        let insertReviewData = this.state.medicineData.medInfo;
        insertReviewData.modalVisible = true;
        await this.setState({ insertReviewData: insertReviewData, isReviewInsert: true })

    }
    getMedicineReviewVisible = async (val) => {
        try {
            await this.setState({ isLoading: true, modalVisible: false, isReviewInsert: false })
        } catch (e) {
            console.log(e)
        }
        finally {
            this.setState({ isLoading: false })
        }
    }


    addToCart = async () => {
        let temp = await AsyncStorage.getItem('userId')
        let userId = JSON.stringify(temp);
        let cart = this.state.medicineData;
        await AsyncStorage.setItem('cartItems-' + userId, JSON.stringify(cart))
    }
    saveMoney() {
        const { medicineData } = this.state;

        let saveData = 0
        if (medicineData.medPharDetailInfo) {
            if (medicineData.medPharDetailInfo.price) {
                saveData = parseInt(medicineData.medPharDetailInfo.price) - parseInt(medicineRateAfterOffer(medicineData.medPharDetailInfo, 's'))
            }
        }
        return saveData
    }
    onValueChange2(value) {
        this.setState({
            selected2: value
        });
    }
    variationSelectedValue(value) {
        try {

            let { medicineData } = this.state
            temp = medicineData.medPharDetailInfo

            mergeObject = Object.assign(temp, value)
            let tempObject = {
                ...medicineData,
                medPharDetailInfo: mergeObject

            }
            this.setState({
                medicineData: tempObject, selected2: value
            });
        } catch (e) {
            console.log(e)
        }
    }
    render() {
        const { medicineData, reviewData, reviewCount, cartItems, finalRating } = this.state

        const prescriptionData = [{ prescription_path: require('../../../../../assets/images/images.jpeg') }, { prescription_path: require('../../../../../assets/images/images.jpeg') }, { prescription_path: require('../../../../../assets/images/images.jpeg') }, { prescription_path: require('../../../../../assets/images/images.jpeg') }, { prescription_path: require('../../../../../assets/images/images.jpeg') }]
        return (
            <Container >

                <Content style={{ padding: 10 }}>
                    {this.state.isLoading ? <Spinner color='blue'
                        visible={this.state.isLoading}
                    /> : null}
                    <View style={{ paddingBottom: 20 }}>

                        <View>
                            <Row>
                                <Col size={9}>
                                    <Text style={styles.headText}>{getMedicineName(medicineData.medInfo)}</Text>
                                </Col>
                                {reviewCount != '' ?
                                    <Col size={1}>
                                        <View style={styles.headerViewRate}>
                                            <Icon name="ios-star" style={{ color: '#fff', fontSize: 10 }} />
                                            <Text style={styles.ratingText}>{(reviewCount.average_rating).toFixed(1)}</Text>
                                        </View>
                                    </Col> : null}

                            </Row>
                            <Text style={{ fontSize: 14, fontFamily: 'OpenSans', color: '#909090' }}>By {medicineData.pharmacyInfo.name}</Text>
                            {medicineData.medInfo !== undefined && medicineData.medInfo.medicine_images !== undefined && medicineData.medInfo.medicine_images.length !== 0 ?
                                <View style={{ flex: 1, marginLeft: 10, marginRight: 10, justifyContent: 'center', alignItems: 'center', }}>
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
                                            index={medicineData.medInfo.medicine_images.length - 1}
                                            contentContainerStyle={{ flexGrow: 1, }}
                                            autoplayLoop
                                            data={medicineData.medInfo.medicine_images}
                                            renderItem={({ item }) =>
                                                <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: item.prescription_path, title: medicineData.medInfo.medicine_name })}>
                                                    <Image
                                                        source={renderMedicineImageAnimation(medicineData.medInfo.medicine_images)}
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
                            <Row>
                                <Col size={7} style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <Text style={{ fontSize: 10, fontFamily: 'OpenSans', color: '#ff4e42', marginTop: 5 }}>MRP</Text>
                                    <Text style={styles.oldRupees}>₹{medicineData.medPharDetailInfo.price}</Text>
                                    <Text style={styles.newRupees}>₹{medicineRateAfterOffer(medicineData.medPharDetailInfo, 'r')}</Text>
                                    <Text style={styles.saveText}>(Save upto ₹{this.saveMoney()})</Text>
                                </Col>
                                <Col size={3}>
                                </Col>
                            </Row >
                            {medicineData.medPharDetailInfo.variations !== undefined ?
                                <Row style={{ marginTop: 10 }}><Col size={5} style={{ height: 30, justifyContent: 'center', backgroundColor: '#fff', borderRadius: 5, borderColor: '#000', borderWidth: 0.5 }}>
                                    <Picker
                                        mode="dropdown"
                                        style={{ width: undefined }}
                                        placeholder="Select your SIM"
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        placeholderIconColor="#007aff"
                                        selectedValue={this.state.selected2}
                                        onValueChange={this.variationSelectedValue.bind(this)}
                                    >
                                        {medicineData.medPharDetailInfo.variations.map((ele, key) => {

                                            return <Picker.Item label={String(ele.medicine_weight) + String(ele.medicine_weight_unit)} value={ele} key={key} />
                                        })}
                                    </Picker>
                                </Col>
                                    <Col size={5} style={{ justifyContent: 'center', marginLeft: 5 }}>
                                        <Text style={{ fontSize: 12, fontFamily: 'OpenSans', color: '#000' }}> of {medicineData.medInfo.medicine_form}</Text>
                                    </Col>
                                </Row> : null}
                        </View>
                        <Row style={{ marginTop: 10 }}>
                            <Col size={5}>

                                {cartItems.length == 0 || cartItems.findIndex(ele => ele.medicine_id == medicineData.medPharDetailInfo.medicine_id && ele.pharmacy_id == medicineData.medPharDetailInfo.pharmacy_id) === -1 ?
                                    <Row style={{ alignItems: 'flex-end' }}>
                                        <TouchableOpacity style={styles.addCartTouch}
                                            onPress={() => { this.setState({ isAddToCart: true }), this.selectedItems(medicineData, 'Add to Card') }} >

                                            <Icon name='ios-cart' style={{ color: '#4e85e9', fontSize: 15 }} />
                                            <Text style={styles.addCartText}>Add to Cart</Text>

                                        </TouchableOpacity>
                                    </Row> :
                                    <Row style={{ alignItems: 'flex-end' }}>
                                        <TouchableOpacity style={styles.addCartTouch}
                                            onPress={() => { this.setState({ isAddToCart: true }), this.selectedItems(medicineData, 'Add to Card', cartItems.findIndex(ele => ele.medicine_id == medicineData.medPharDetailInfo.medicine_id && ele.pharmacy_id == medicineData.medPharDetailInfo.pharmacy_id)) }} >

                                            <Icon name='ios-cart' style={{ color: '#4e85e9', fontSize: 15 }} />
                                            <Text style={styles.addCartText}>{'Added ' + cartItems[cartItems.findIndex(ele => ele.medicine_id == medicineData.medPharDetailInfo.medicine_id && ele.pharmacy_id == medicineData.medPharDetailInfo.pharmacy_id)].userAddedMedicineQuantity}</Text>

                                        </TouchableOpacity>
                                    </Row>
                                }
                            </Col>
                            <Col size={5}>
                                <Row>
                                    <TouchableOpacity style={styles.buyNowTouch} onPress={() => { this.setState({ isBuyNow: true }), this.selectedItems(medicineData, 'Buy Now') }} >
                                        <Icon name="ios-cart" style={{ fontSize: 15, color: '#fff' }} />
                                        <Text style={styles.BuyNowText}>Buy Now</Text>
                                    </TouchableOpacity>
                                </Row>
                            </Col>
                        </Row>
                        {/* give this text instead of two button in case of out of stock */}
                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', color: '#ff4e42', marginTop: 5, textAlign: 'center' }}>Currently Out of stock</Text>

                        {this.state.isBuyNow == true || this.state.isAddToCart == true ?
                            <AddToCard
                                data={this.state.selectedMedcine}
                                popupVisible={(data) => this.getVisible(data)}
                            />
                            : null}
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.desText}>Product Details</Text>
                            <Text style={styles.mainText}>{medicineData.medInfo.description}</Text>
                            <TouchableOpacity onPress={() => this.setState({ enlargeContent: true })}>
                                <Text style={styles.showText}>Show more</Text>
                            </TouchableOpacity>
                            {this.state.enlargeContent == true ?
                                <View>
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={styles.desText}>Medicine Dosage</Text>
                                        <Text style={styles.mainText}>{medicineData.medInfo.medicine_unit}</Text>
                                    </View>
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={styles.desText}>Directions To Use </Text>
                                        <Text style={styles.mainText}>{medicineData.medInfo.directions_to_use}</Text>
                                    </View>
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={styles.desText}>Key Ingredients</Text>
                                        <Text style={styles.mainText}><Text style={{ fontSize: 12, marginTop: 5, }}>{'\u2B24'}</Text>   {medicineData.medInfo.ingridients}</Text>
                                    </View>
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={styles.desText}>Side effects</Text>
                                        <Text style={styles.mainText}>{medicineData.medInfo.side_effects}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => this.setState({ enlargeContent: false })}>
                                        <Text style={styles.showText}>Show less</Text>
                                    </TouchableOpacity>
                                </View> : null}

                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.desText}>Rating and Reviews</Text>
                            <Row style={styles.borderView}>
                                <Col size={3}>
                                    {reviewCount != '' ?
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon name="ios-star" style={{ color: '#8dc63f', fontSize: 25 }} />
                                            <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#8dc63f', fontWeight: '500', marginLeft: 5 }}>{(reviewCount.average_rating).toFixed(1)}</Text>
                                        </View> : null}
                                    {reviewCount != '' ?
                                        <Text style={{ fontSize: 12, fontFamily: 'OpenSans', color: '#909090' }}>{reviewCount.total_rating + ' Ratings &' + reviewCount.count + ' Reviews'}</Text> :
                                        <Text style={{ fontSize: 12, fontFamily: 'OpenSans', color: '#909090' }}>{'0 Ratings & 0 Reviews'}</Text>}

                                </Col>
                                <Col size={7} style={{ borderLeftColor: '#909090', borderLeftWidth: 0.3, paddingLeft: 10 }}>
                                    <Row style={{ marginTop: 1 }}>
                                        <Col size={1} style={{ flexDirection: 'row' }}>
                                            <Icon name="ios-star" style={{ color: '#8dc63f', fontSize: 10, marginLeft: 5, marginTop: 1 }} />
                                            <Text style={styles.ratingCountFive}>5</Text>
                                        </Col>
                                        <Col size={7.5}>
                                            <TouchableOpacity style={styles.touchRating5}>

                                            </TouchableOpacity>
                                        </Col>
                                        <Col size={1.5}>
                                            <Text style={{ fontSize: 10, fontFamily: 'OpenSans', color: '#909090', marginLeft: 5 }}>{finalRating.five_star ? Math.round(finalRating.five_star) : 0}%</Text>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 1 }}>
                                        <Col size={1} style={{ flexDirection: 'row' }}>
                                            <Icon name="ios-star" style={{ color: '#C4FB72', fontSize: 10, marginLeft: 5, marginTop: 1 }} />
                                            <Text style={styles.ratingCountfour}>4</Text>
                                        </Col>
                                        <Col size={7.5}>
                                            <TouchableOpacity style={styles.touchRating4}>

                                            </TouchableOpacity>
                                        </Col>
                                        <Col size={1.5}>
                                            <Text style={{ fontSize: 10, fontFamily: 'OpenSans', color: '#909090', marginLeft: 5 }}>{finalRating.four_star ? Math.round(finalRating.four_star) : 0}%</Text>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 1 }}>
                                        <Col size={1} style={{ flexDirection: 'row' }}>
                                            <Icon name="ios-star" style={{ color: '#F9D841', fontSize: 10, marginLeft: 5, marginTop: 1 }} />
                                            <Text style={styles.ratingCountThree}>3</Text>
                                        </Col>
                                        <Col size={7.5}>
                                            <TouchableOpacity style={styles.touchRating3}>

                                            </TouchableOpacity>
                                        </Col>
                                        <Col size={1.5}>
                                            <Text style={{ fontSize: 10, fontFamily: 'OpenSans', color: '#909090', marginLeft: 5 }}>{finalRating.three_star ? Math.round(finalRating.three_star) : 0}%</Text>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 1 }}>
                                        <Col size={1} style={{ flexDirection: 'row' }}>
                                            <Icon name="ios-star" style={{ color: '#F69603', fontSize: 10, marginLeft: 5, marginTop: 1 }} />
                                            <Text style={styles.ratingCountTwo}>2</Text>
                                        </Col>
                                        <Col size={7.5}>
                                            <TouchableOpacity style={styles.touchRating2}>

                                            </TouchableOpacity>
                                        </Col>
                                        <Col size={1.5}>
                                            <Text style={{ fontSize: 10, fontFamily: 'OpenSans', color: '#909090', marginLeft: 5 }}>{finalRating.two_star ? Math.round(finalRating.two_star) : 0}%</Text>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 1 }}>
                                        <Col size={1} style={{ flexDirection: 'row' }}>
                                            <Icon name="ios-star" style={{ color: '#F03434', fontSize: 10, marginLeft: 5, marginTop: 1 }} />
                                            <Text style={styles.ratingCountOne}>1</Text>
                                        </Col>
                                        <Col size={7.5}>
                                            <TouchableOpacity style={styles.touchRating1}>

                                            </TouchableOpacity>
                                        </Col>
                                        <Col size={1.5}>
                                            <Text style={{ fontSize: 10, fontFamily: 'OpenSans', color: '#909090', marginLeft: 5 }}>{finalRating.one_star ? Math.round(finalRating.one_star) : 0}%</Text>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </View>
                        {reviewData.length !== 0 ?
                            <FlatList
                                data={reviewData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) =>
                                    <View style={styles.borderView}>
                                        <Row>
                                            <Col size={5} style={{ flexDirection: 'row' }}>
                                                <Text style={styles.desText}>{item.is_anonymous ? 'Medflic User' : item.userInfo.first_name + '' + item.userInfo.last_name}</Text>
                                                <View style={styles.viewRating}>
                                                    <Icon name="ios-star" style={{ color: '#fff', fontSize: 10 }} />
                                                    <Text style={styles.ratingText}>{item.rating}</Text>

                                                </View>
                                            </Col>
                                            <Col size={5}>
                                                <Text style={styles.dateText}>{this.relativeTimeView(item.review_date)}</Text>
                                            </Col>
                                        </Row>
                                        <Text style={styles.contentText}>{item.comments}</Text>
                                    </View>
                                } /> :
                            <Text style={{ fontSize: 10, justifyContent: 'center', alignItems: 'center' }}>No Reviews Were found</Text>}

                        {reviewData.length !== 0 ?

                            <Row style={{ marginTop: 10 }}>
                                <Col size={6}>
                                </Col>
                                <Col size={4} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                    <Row>
                                        <TouchableOpacity style={styles.viewTouch} onPress={() => this.props.navigation.navigate('ViewAllReviews', { medicineId: medicineId })}>
                                            <Text style={styles.ViewText}>View All Reviews</Text>
                                            <Icon name="ios-arrow-round-forward" style={{ fontSize: 16, color: '#4e85e9', marginLeft: 2 }} />

                                        </TouchableOpacity>
                                    </Row>
                                </Col>
                            </Row> : null}
                        <View>
                            <Row>
                                <TouchableOpacity style={{ borderColor: '#8dc63f', borderWidth: 1, marginLeft: 1, borderRadius: 2.5, height: 25, width: 65, backgroundColor: '#8dc63f' }}
                                    onPress={() => { this.insertReview(), this.setState({ isReviewInsert: true }) }}>
                                    <Row style={{ alignItems: 'center' }}>
                                        <Text style={{ fontSize: 7, color: '#fff', marginTop: 2.5, marginLeft: 6 }}>Add Reviews</Text>
                                    </Row>
                                </TouchableOpacity>
                            </Row>
                        </View>
                        {this.state.isReviewInsert == true ?
                            <MedInsertReview
                                data={this.state.insertReviewData}
                                popupVisible={(data) => this.getMedicineReviewVisible(data)}

                            />
                            : null}
                    </View>

                </Content>
            </Container>
        );
    }
}

export default MedicineInfo;

const styles = StyleSheet.create({
    cardsize: {
        alignItems: 'center',
        padding: 5,
        width: '50%',
        marginTop: 40,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    customColumn: {
        padding: 10,
        paddingTop: 20,
        borderRadius: 10,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 6,
        width: '97%',
        backgroundColor: '#f5f6fa'
    },
    addCartTouch: {
        borderColor: '#4e85e9',
        borderWidth: 0.5,
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 50,
        paddingRight: 50,
        borderRadius: 2,
        alignItems: 'flex-end'
    },
    buyNowTouch: {
        backgroundColor: '#8dc63f',
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 50,
        paddingRight: 50,
        borderRadius: 2,
        marginLeft: 5
    },
    addCartText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#4e85e9',
        marginLeft: 5,

    },
    BuyNowText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#fff',
        marginLeft: 5
    },
    dateText: {
        fontSize: 12,
        fontFamily: 'OpenSans',
        color: '#909090',
        textAlign: 'right'
    },
    contentText: {
        fontSize: 12,
        fontFamily: 'OpenSans',
        color: '#4c4c4c',
        marginTop: 10
    },
    ratingText: {
        fontSize: 10,
        fontFamily: 'OpenSans',
        color: '#fff'
    },
    viewTouch: {
        borderColor: '#4e85e9',
        borderWidth: 0.5,
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 2
    },
    ViewText: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        color: '#4e85e9',
    },
    viewRating: {
        backgroundColor: '#8dc63f',
        height: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        paddingLeft: 1,
        paddingRight: 1
    },
    borderView: {
        marginTop: 10,
        borderBottomColor: '#909090',
        borderBottomWidth: 0.3,
        paddingBottom: 10
    },
    ratingCountOne: {
        fontSize: 10,
        fontFamily: 'OpenSans',
        color: '#F03434',
        fontWeight: '500',
        marginLeft: 2
    },
    ratingCountTwo: {
        fontSize: 10,
        fontFamily: 'OpenSans',
        color: '#F69603',
        fontWeight: '500',
        marginLeft: 2
    },
    ratingCountThree: {
        fontSize: 10,
        fontFamily: 'OpenSans',
        color: '#F9D841',
        fontWeight: '500',
        marginLeft: 2
    },
    ratingCountfour: {
        fontSize: 10,
        fontFamily: 'OpenSans',
        color: '#C4FB72',
        fontWeight: '500',
        marginLeft: 2
    },
    ratingCountFive: {
        fontSize: 10,
        fontFamily: 'OpenSans',
        color: '#8dc63f',
        fontWeight: '500',
        marginLeft: 2
    },
    touchRating5: {
        backgroundColor: '#8dc63f',
        padding: 2,
        borderRadius: 10,
        marginTop: 5,
        marginLeft: 5
    },
    touchRating4: {
        backgroundColor: '#C4FB72',
        padding: 2,
        borderRadius: 10,
        marginTop: 5,
        marginLeft: 5
    },
    touchRating3: {
        backgroundColor: '#F9D841',
        padding: 2,
        borderRadius: 10,
        marginTop: 5,
        marginLeft: 5
    },
    touchRating2: {
        backgroundColor: '#F69603',
        padding: 2,
        borderRadius: 10,
        marginTop: 5,
        marginLeft: 5
    },
    touchRating1: {
        backgroundColor: '#F03434',
        padding: 2,
        borderRadius: 10,
        marginTop: 5,
        marginLeft: 5
    },
    oldRupees: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        textDecorationLine: 'line-through',
        textDecorationColor: '#ff4e42',
        textDecorationStyle: 'solid',
        color: '#ff4e42',
        marginLeft: 5,
        marginTop: 5
    },
    newRupees: {
        fontSize: 15,
        fontFamily: 'OpenSans',
        color: '#000',
        fontWeight: '500',
        marginLeft: 5
    },
    saveText: {
        fontSize: 10,
        fontFamily: 'OpenSans',
        color: '#8dc63f',
        marginLeft: 5,
        marginTop: 5
    },
    headText: {
        fontSize: 15,
        fontFamily: 'OpenSans',
        fontWeight: '500'
    },
    headerViewRate: {
        backgroundColor: '#8dc63f',
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    desText: {
        fontSize: 12,
        fontFamily: 'OpenSans',
        color: '#000',
        fontWeight: '500'
    },
    mainText: {
        fontSize: 12,
        fontFamily: 'OpenSans',
        color: '#909090',
        marginTop: 5
    },
    showText: {
        fontSize: 12,
        fontFamily: 'OpenSans',
        color: '#7F49C3',
        marginTop: 10
    },
    circleDev: {
        position: 'absolute',
        bottom: 15,
        height: 15,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center'
    },
    whiteCircle: {
        width: 6,
        height: 6,
        borderRadius: 3,
        margin: 5,
        backgroundColor: '#fff'

    },
    wrapper: {
        marginTop: 5,
        borderRadius: 2
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    }

})
