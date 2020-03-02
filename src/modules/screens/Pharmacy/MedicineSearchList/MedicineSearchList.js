import React, { Component } from 'react';
import {
    Container, Content, Text, View, Button, H3, Item, Card,
    Input, Left, Right, Icon, Footer, Badge, Form
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Loader } from '../../../../components/ContentLoader'
import { addToCart, medicineRateAfterOffer } from '../../../common';
import { TextInput } from 'react-native-gesture-handler';

class MedicineSearchList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: [],
            clickCard: null,
            footerSelectedItem: '',
            cartItems: [],
            isLoading: true
        }
    }

    componentDidMount() {
        const temp = this.props.navigation.getParam('medicineList');
        this.setState({ clickCard: null, value: temp });
        this.storeMedicineToCart();
    };


    backNavigation(payload) {
        if (payload.action.type === 'Navigation/BACK') {
            const temp = this.props.navigation.getParam('medicineList');
            this.setState({ clickCard: null, value: temp });
            this.storeMedicineToCart();
        }
    }

    // searchedMedicines = async (keyword) => {
    //     try {
    //         this.setState({ isLoading: true })
    //         let requestData = {
    //             value: keyword
    //         };
    //         let result = await getSearchedMedicines(requestData);
    //         this.setState({ value: result.data, isLoading: true })
    //     }
    //     catch (e) {
    //         console.log(e);
    //     }
    //     finally {
    //         this.setState({ isLoading: false });
    //     }
    // }

    async addSubOperation(selectItem, operation) {
        let temp_userid = await AsyncStorage.getItem('userId')
        let userId = JSON.stringify(temp_userid);
        let data = await addToCart(this.state.value, selectItem, operation);
        let cartItems = await AsyncStorage.getItem('cartItems-' + userId);
        this.setState({ footerSelectedItem: data.selectemItemData, cartItems: JSON.parse(cartItems) })
    }

    onPressCard = async (item, index) => {
        this.setState({ clickCard: index })
        await this.setState({ footerSelectedItem: item });
    }

    storeMedicineToCart = async () => {
        this.setState({ isLoading: true })
        let data = await AsyncStorage.getItem('userId')
        let userId = JSON.stringify(data);

        medicineSearchMap = new Map();
        if (this.state.value != undefined) {
            this.state.value.forEach(element => {
                medicineSearchMap.set(element.medicine_id, element)
            })
        }

        const cartItems = await AsyncStorage.getItem('cartItems-' + userId);
        if (Array.isArray(JSON.parse(cartItems)) == true) {
            this.setState({ cartItems: JSON.parse(cartItems) })
            this.state.cartItems.forEach(element => {
                if (medicineSearchMap.get(element.medicine_id) != undefined) {
                    medicineSearchMap.set(element.medicine_id, element);
                }
            })
        }

        let temp = await [...medicineSearchMap.values()]
        await this.setState({ value: temp });
        this.setState({ isLoading: false })

    }

    noMedicines() {
        return (
            <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, justifyContent: 'center', alignItems: 'center' }} > No Medicines available! </Text>
            </Item>
        )
    }
    render() {
        const { value, isLoading } = this.state;
        const med = [{ medname: 'Paracetamol', content: 'By Appollo Pharmacy', count: 'MRP', price: '₹ 300.25', offer: '₹ 180.00' },
        { medname: 'Paracetamol', content: 'By Appollo Pharmacy', count: 'MRP', price: '₹ 300.25', offer: '₹ 180.00' },
        { medname: 'Paracetamol', content: 'By Appollo Pharmacy', count: 'MRP', price: '₹ 300.25', offer: '₹ 180.00' },
        { medname: 'Paracetamol', content: 'By Appollo Pharmacy', count: 'MRP', price: '₹ 300.25', offer: '₹ 180.00' },
        { medname: 'Paracetamol', content: 'By Appollo Pharmacy', count: 'MRP', price: '₹ 300.25', offer: '₹ 180.00' }]

        return (
            <Container>
                <Content style={{ backgroundColor: '#EAE6E6', padding: 10 }}>
                    <View>
                        <Item style={styles.transparentLabel1}>
                            <Input placeholder="Search medicine" style={styles.firstTransparentLabel}
                                placeholderTextColor="#C1C1C1"
                                keyboardType={'default'}
                                returnKeyType={'go'}
                                multiline={false}
                            />
                            <TouchableOpacity style={{ alignItems: 'flex-end', marginRight: 5 }} >
                                <Icon name='md-search' style={{ color: '#C1C1C1' }} />
                            </TouchableOpacity>
                        </Item>
                        <Text style={{ marginTop: 5, marginLeft: 5, fontFamily: 'OpenSans', fontSize: 12.5, color: '#7227C7' }}>Showing all results for <Text style={{ fontStyle: 'italic', fontSize: 12.5, color: '#7227C7' }}>Horlicks</Text></Text>
                        <View>
                            <FlatList
                                data={med}
                                renderItem={({ item }) =>
                                    <View style={{ backgroundColor: '#fff', marginTop: 10, borderRadius: 5 }}>
                                        <Row>
                                            <Col size={4}>
                                                <Image source={require('../../../../../assets/images/paracetamol.jpg')} style={{ height: 100, width: 70, marginLeft: 5 }} />
                                            </Col>
                                            <Col size={12.5}>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 16, marginTop: 5 }}>{item.medname}</Text>
                                                <Text style={{ color: '#A4A4A4', fontFamily: 'OpenSans', fontSize: 12.5, marginBottom: 20 }}>{item.content}</Text>
                                                <Row>
                                                    <Col size={5} style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: 8, marginBottom: -15, marginTop: 10, marginLeft: -3, color: "#B40404" }}>{item.count}</Text>
                                                        <Text style={{ fontSize: 8, marginTop: 10, marginLeft: 1.5, color: "#B40404", textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{item.price}</Text>
                                                        <Text style={{ fontSize: 13, marginTop: 6.5, marginLeft: 2.5, color: "#5FB404" }}>{item.offer}</Text>
                                                    </Col>
                                                    <Col size={3} style={{ height: 20, marginLeft: 4 }}>
                                                        <TouchableOpacity style={{ borderColor: '#0080FF', marginLeft: 1.5, borderWidth: 1, borderRadius: 2.5, marginTop: 5, height: 20, width: 65, paddingBottom: 5, paddingTop: 2 }}>
                                                            <Row style={{ alignItems: 'center' }}>
                                                                <Icon name='ios-cart' style={{ color: '#0080FF', fontSize: 11, marginLeft: 3.5, paddingTop: 2.3 }} />
                                                                <Text style={{ fontSize: 7, color: '#0080FF', marginTop: 2.5, marginLeft: 6 }}>Add to Cart</Text>
                                                            </Row>
                                                        </TouchableOpacity>
                                                    </Col>
                                                    <Col size={3.2} style={{ height: 20, marginLeft: 4, marginRight: 2.5 }}>
                                                        <TouchableOpacity style={{ borderColor: '#31B404', borderWidth: 1, marginLeft: 1, borderRadius: 2.5, marginTop: 5, height: 20, width: 65, paddingBottom: 5, paddingTop: 2, backgroundColor: '#31B404' }}>
                                                            <Row style={{ alignItems: 'center' }}>
                                                                <Icon name='ios-cart' style={{ color: '#fff', fontSize: 11, marginLeft: 5, paddingTop: 2.3 }} />
                                                                <Text style={{ fontSize: 7, color: '#fff', marginTop: 2.5, marginLeft: 6 }}>Buy Now</Text>
                                                            </Row>
                                                        </TouchableOpacity>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </View>
                                } />
                        </View>

                    </View>
                </Content>
            </Container>

















            // <Container style={styles.container}>
            //     <NavigationEvents
            //         onWillFocus={payload => { this.backNavigation(payload) }}
            //     />
            //     {isLoading == true ? <Loader style={'list'} /> :

            // <Content>
            //     <Grid style={styles.curvedGrid}>
            //     </Grid>
            //     <Grid style={{ marginTop: -100, height: 100 }}>
            //         <Row>
            //             <Col style={{ width: '100%', marginTop: 'auto', marginBottom: 'auto', alignItems: 'center' }}>
            //                 <Item style={{ borderBottomWidth: 0 }}>
            //                     <Text style={{ fontFamily: 'OpenSans', color: '#fff' }}>SEARCH RESULTS</Text>
            //                 </Item>
            //             </Col>
            //             <Col style={{ width: '10%' }}>
            //             </Col>
            //         </Row>
            //     </Grid>

            // {this.state.value == '' ? this.noMedicines() :
            // <FlatList data={value}
            //     extraData={this.state}
            //     keyExtractor={(item, index) => index.toString()}
            //     renderItem={({ item, index }) =>
            //         <TouchableOpacity onPress={() => this.onPressCard(item, index)} testID='selectMedicineToList'>

            //             <Card style={{ padding: 10, marginTop: 20, }}>
            //                 <View style={{ width: 'auto', flex: 1, flexDirection: 'row' }}>
            //                     <Right>
            //                         {this.state.clickCard !== index ? <Icon style={{ color: '#5cb75d',  }} />
            //                             : <Icon name="checkmark-circle" style={{ color: '#5cb75d', }} />}
            //                     </Right>
            //                 </View>

            //                         <Grid style={{marginTop:-35}}>
            //                             <Col style={{ width: '25%' }}>
            //                                     <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE-GVencCM4e7LuKxP2SaFTbONdLA1BiOGz96ICf1fkBixV-Tv' }} style={styles.customImage} />
            //                                     <View style={{
            //                                         position: 'absolute', width: 30, height: 30, borderRadius: 20, marginLeft: 5,
            //                                         backgroundColor: 'green', right: 0, top: 0, justifyContent: 'center', alignItems: 'center',
            //                                         borderColor: 'green', borderWidth: 1
            //                                     }}>
            //                                         <Text style={{ padding: 5, backgroundColor: 'transparent', textAlign: "center", color: 'white', fontSize: 13 }}>{item.offer}</Text>
            //                                     </View>   
            //                             </Col>
            //                             <Col style={{ marginLeft: 20, width: '70%', alignItems: 'flex-start', justifyContent: 'center', marginTop: 10 }}>
            //                                 <Text style={styles.normalText}>{item.medicine_name}</Text>
            //                                 <Row>
            //                                     <Text style={styles.subText}>{'\u20B9'}{medicineRateAfterOffer(item)}</Text>
            //                                     <Text style={{ marginLeft: 10, marginTop: 2, color: 'gray', fontSize: 15, textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'gray' }}>
            //                                         {'\u20B9'}{item.price}</Text>
            //                                 </Row>
            //                                 <Text style={{ color: 'gray', fontSize: 16 }}>White Pigeon Pharmacy</Text>
            //                             </Col>
            //                         </Grid>

            //                     </Card>
            //                 </TouchableOpacity>
            //             } />
            //     }


            // </Content>
            // }
            // {this.state.clickCard !== null ? <Footer style={{ backgroundColor: '#7E49C3', }}>

            //     <Row>
            //         <Col style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
            //             <TouchableOpacity onPress={() => this.addSubOperation(this.state.footerSelectedItem, "sub")} testID='decreaseMedicine'>
            //                 <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: 'black', width: 40, height: 35, backgroundColor: 'white' }}>
            //                     <Text style={{ fontSize: 40, textAlign: 'center', marginTop: -5, color: 'black' }}>-</Text>
            //                 </View>
            //             </TouchableOpacity>
            //             <View>
            //                 <Text style={{ marginLeft: 5, color: 'white', fontSize: 20 }}>{this.state.footerSelectedItem.selectedQuantity == undefined ? 0 : this.state.footerSelectedItem.selectedQuantity}</Text>
            //             </View>
            //             <TouchableOpacity onPress={() => this.addSubOperation(this.state.footerSelectedItem, "add")} testID='addMedicine'>
            //                 <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: 'black', width: 40, height: 35, marginLeft: 5, backgroundColor: 'white' }}>
            //                     <Text style={{
            //                         fontSize: 20, textAlign: 'center', marginTop: -5,
            //                         color: 'black'
            //                     }}>+</Text>
            //                 </View>
            //             </TouchableOpacity>
            //         </Col>

            //         <Col style={{ marginRight: 40 }} >
            //             <Button success style={{ borderRadius: 10, marginTop: 10, marginLeft: 45, height: 40, justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('PharmacyCart')} testID='viewToCartPage'>


            //                 <Row style={{ justifyContent: 'center', }}>

            //                     <Icon name='ios-cart' onPress={() => this.props.navigation.navigate('PharmacyCart')} />

            //                     <Text style={{ marginLeft: -15, marginTop: 2, }} >VIEW CART</Text>

            //                     <View>
            //                         {this.state.cartItems.length != 0 ?
            //                             <Text style={{ position: 'absolute', height: 20, width: 20, fontSize: 13, backgroundColor: '#ffa723', top: 0, marginLeft: -110, borderRadius: 20, marginTop: -13, textAlign: "center" }}>
            //                                 {this.state.cartItems.length}
            //                             </Text> : null}
            //                     </View>
            //                 </Row>
            //             </Button>
            //         </Col>

            //     </Row>

            //     </Footer> : null
            //     }

            // </Container >

        )
    }
}


export default MedicineSearchList
const styles = StyleSheet.create({
    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 0
    },
    customImage: {
        height: 90,
        width: 90,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        borderRadius: 50
    },

    curvedGrid:
    {
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

    normalText:
    {
        fontFamily: 'OpenSans',
        fontSize: 17,
        marginTop: 10
    },
    offerText:
    {
        fontFamily: 'OpenSans',
        fontSize: 13,
        color: 'green'

    },
    subText: {
        fontFamily: 'OpenSans',
        fontSize: 17,
        color: 'black'
    },
    transparentLabel1:
    {
        backgroundColor: "#fff",
        height: 35,
        borderRadius: 5
    },

    firstTransparentLabel: {
        fontSize: 12.5,
        marginLeft: 10

    }
});