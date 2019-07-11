import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, View, Button, H3, Item, List, ListItem, Card, 
    Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Badge } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, AsyncStorage, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getSearchedMedicines } from '../../../providers/pharmacy/pharmacy.action';

class MedicineSearchList extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
        this.state={
            value:[]
        }
    }
componentDidMount(){
    
    const keyword=this.props.navigation.getParam('key');
    this.searchedMedicines(keyword);
};

    searchedMedicines = async (keyword) => {
        try {
            let requestData = {
                value: keyword           
            };
            //let userId = await AsyncStorage.getItem('userId');
            let result = await getSearchedMedicines(requestData);
            this.setState({ value: result.data, isLoading: true })
              console.log('result'+JSON.stringify(result)); 
            }
        catch (e) {
            console.log(e);
        }
    }
    noMedicines() {
        return (
            <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, justifyContent: 'center', alignItems: 'center' }} > No Medicines available! </Text>
            </Item>
        )
    }
    render() {
        const {value} =this.state;
        return (
            <Container style={styles.container}>
                <Content>
                    <Grid style={styles.curvedGrid}>
                    </Grid>
                    <Grid style={{ marginTop: -100, height: 100 }}>
                        <Row>
                            <Col style={{ width: '100%', marginTop: 'auto', marginBottom: 'auto', alignItems: 'center' }}>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={{ fontFamily: 'OpenSans', color: '#fff' }}>SEARCH RESULTS</Text>
                                </Item>
                            </Col>
                            <Col style={{ width: '10%' }}>
                            </Col>
                        </Row>
                    </Grid>
                    <Card transparent style={{ padding: 10, marginTop: 20 }} onTouchStart={() => this.props.navigation.navigate('MedicineCheckout')} >
                       

{this.state.value==null?this.noMedicines():
                    <FlatList
                data={value}
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => 
                        <Card style={{ padding: 10 }}>
                            <Grid>
                                <Col style={{ width: '25%' }}>
                                    <View>
                                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE-GVencCM4e7LuKxP2SaFTbONdLA1BiOGz96ICf1fkBixV-Tv' }} style={styles.customImage} />
                                        <View style={{
                                            position: 'absolute', width: 30, height: 30, borderRadius: 20, marginLeft: 5,
                                            backgroundColor: 'green', right: 0, top: 0, justifyContent: 'center', alignItems: 'center',
                                            borderColor: 'green', borderWidth: 1
                                        }}>
                                            <Text style={{ padding: 5, backgroundColor: 'transparent', color: 'white', fontSize: 13 }}>20%</Text>
                                        </View>
                                    </View>
                                </Col>
                                <Col style={{ marginLeft: 20, width: '70%', alignItems: 'flex-start', justifyContent: 'center', marginTop: 10 }}>
                                    <Text style={styles.normalText}> {item.medicine_name} </Text>
                                    <Row>
                                        <Text style={styles.subText}>{'\u20B9'}80</Text>
                                        <Text style={{ marginLeft: 10, marginTop: 2, color: 'gray', fontSize: 15, textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'gray' }}>
                                            {'\u20B9'}100</Text>
                                    </Row>
                                    <Text style={{ color: 'gray', fontSize: 16 }}>White Pigeon Pharmacy</Text>
                                </Col>
                            </Grid>
                        </Card>
                }/>
            }
                        {/* <Card style={{ padding: 10 }}>
                            <Grid>
                                <Col style={{ width: '25%' }}>
                                    <View>
                                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmQtUYMSYsZlwJM46ZccW_Ev3KULxQA-o2yFEygywoQBs0KBnlJg' }} style={styles.customImage} />
                                        <View style={{
                                            position: 'absolute', width: 30, height: 30, borderRadius: 20, marginLeft: 5,
                                            backgroundColor: 'green', right: 0, top: 0, justifyContent: 'center', alignItems: 'center',
                                            borderColor: 'green', borderWidth: 1
                                        }}>
                                            <Text style={{ padding: 5, backgroundColor: 'transparent', color: 'white', fontSize: 13 }}>50%</Text>
                                        </View>
                                    </View>
                                </Col>
                                <Col style={{ marginLeft: 20, width: '70%', alignItems: 'flex-start', justifyContent: 'center', marginTop: 10 }}>
                                    <Text style={styles.normalText}>Gemtuzumab ozogamicin</Text>
                                    <Row>
                                        <Text style={styles.subText}>{'\u20B9'}50</Text>
                                        <Text style={{ marginLeft: 10, marginTop: 2, color: 'gray', fontSize: 15, textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'gray' }}>
                                            {'\u20B9'}100</Text>
                                    </Row>
                                    <Text style={{ color: 'gray', fontSize: 16 }}>Wellness Craft Pharmacy</Text>
                                </Col>
                            </Grid>
                        </Card>
                        <Card style={{ padding: 10 }}>
                            <Grid>
                                <Col style={{ width: '25%' }}>
                                    <View>
                                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTSgZ9jiVeVoxjDCuYlwzlbUop6Y_EQOtMj-2DoLZQ1he-azufKg' }} style={styles.customImage} />
                                        <View style={{
                                            position: 'absolute', width: 30, height: 30, borderRadius: 20, marginLeft: 5,
                                            backgroundColor: 'green', right: 0, top: 0, justifyContent: 'center', alignItems: 'center',
                                            borderColor: 'green', borderWidth: 1
                                        }}>
                                            <Text style={{ padding: 5, backgroundColor: 'transparent', color: 'white', fontSize: 13 }}>25%</Text>
                                        </View>
                                    </View>
                                </Col>
                                <Col style={{ marginLeft: 20, width: '70%', alignItems: 'flex-start', justifyContent: 'center', marginTop: 10 }}>
                                    <Text style={styles.normalText}>Hydroxyurea for sickle cell disease</Text>
                                    <Row>
                                        <Text style={styles.subText}>{'\u20B9'}75</Text>
                                        <Text style={{ marginLeft: 10, marginTop: 2, color: 'gray', fontSize: 15, textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'gray' }}>
                                            {'\u20B9'}100</Text>
                                    </Row>
                                    <Text style={{ color: 'gray', fontSize: 16 }}>Shoprite Pharmacy</Text>
                                </Col>
                            </Grid>
                        </Card>
                        <Card style={{ padding: 10 }}>
                            <Grid>
                                <Col style={{ width: '25%' }}>
                                    <View>
                                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE-GVencCM4e7LuKxP2SaFTbONdLA1BiOGz96ICf1fkBixV-Tv' }} style={styles.customImage} />
                                        <View style={{
                                            position: 'absolute', width: 30, height: 30, borderRadius: 20, marginLeft: 5,
                                            backgroundColor: 'green', right: 0, top: 0, justifyContent: 'center', alignItems: 'center',
                                            borderColor: 'green', borderWidth: 1
                                        }}>
                                            <Text style={{ padding: 5, backgroundColor: 'transparent', color: 'white', fontSize: 13 }}>20%</Text>
                                        </View>
                                    </View>
                                </Col>
                                <Col style={{ marginLeft: 20, width: '70%', alignItems: 'flex-start', justifyContent: 'center', marginTop: 10 }}>
                                    <Text style={styles.normalText}>Aminocaproic Acid</Text>
                                    <Row>
                                        <Text style={styles.subText}>{'\u20B9'}80</Text>
                                        <Text style={{ marginLeft: 10, marginTop: 2, color: 'gray', fontSize: 15, textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'gray' }}>
                                            {'\u20B9'}100</Text>
                                    </Row>
                                    <Text style={{ color: 'gray', fontSize: 16 }}>White Pigeon Pharmacy</Text>
                                </Col>
                            </Grid>
                        </Card> */}
                    </Card>
                </Content>
            </Container>
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
        color: 'black',
        //marginLeft: 5
    }
});