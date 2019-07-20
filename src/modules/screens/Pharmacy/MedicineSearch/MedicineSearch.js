import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, View, Footer, FooterTab } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';

class MedicineSearch extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
        this.state={
            keyword:null
        }
    }
    navigetToCategories() {
        console.log(this.props.navigation.navigate('categories'));
        //this.props.navigation.navigate('categories');
    }
    searchMedicines=async()=>{
if(this.state.keyword !=null){
    this.props.navigation.navigate('medicineSearchList',{key:this.state.keyword})
}
else{
    alert('We can not find the Empty Values')
}
    }
    render() {
        const medicine = [{ med1: 'abc' }, { med2: 'def' }, { med3: 'ghi' }, { med4: "jkl" }, { med5: "mno" }]
        const { navigation } = this.props

        return (
           <Container style={styles.container}>
                <Content >
                    <Grid style={styles.curvedGrid}>
                    </Grid>
                    <Grid style={{ marginTop: -100, height: 100 }}>
                        <Row>
                            <Col style={{ width: '10%' }}>
                            </Col>
                            <Col style={{ width: '80%' }}>
                                <Item style={styles.searchBox}  >

                                    <Input placeholder="Search For Any Medicine" 
                                    style={{ color: 'gray', fontFamily: 'OpenSans', fontSize: 12 }}
                                     placeholderTextColor="gray" 
                                     value={this.state.keyword}
                                     onChangeText={keyword => this.setState({ keyword })}
                                     />
                                    <Button style={{ backgroundColor: '#000', borderRadius: 10, height: 40, marginTop: -20, marginRight: -20, borderBottomLeftRadius: 0, borderTopLeftRadius: 0, }}>
                                        <Icon name="ios-search" style={{ color: 'white' }}
                                         onPress={() => { this.searchMedicines() }}
                                    />
                                    </Button>
                                </Item>
                            </Col>
                            <Col style={{ width: '10%' }}>
                            </Col>
                        </Row>
                    </Grid>
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 20 }}>
                        <Button style={{ justifyContent: "center", backgroundColor: '#745DA6', borderRadius: 5 }}>
                            <Icon style={{ fontSize: 30 }} name='ios-cloud-upload'>
                                <Text style={{ padding: 2, color: '#fff', }}>Upload your prescription
                                </Text>
                            </Icon>
                        </Button>
                    </View>
                    <Card transparent >

                        <Grid style={{ marginTop: 25, padding: 10, width: 'auto' }}>
                            <FlatList data={medicine}
                                renderItem={
                                   ({ item }) =>
                                        <Row style={{ justifyContent: 'center' }}>
                                            <View style={styles.customColumn}>
                                                <TouchableOpacity>
                                                    <View style={{ width: 'auto', flex: 1, flexDirection: 'row' }}>

                                                        <Text style={{ marginTop: -30, fontFamily: 'OpenSans', fontSize: 13, color: '#ffa723', }}> Get 50% Off
                                         {/* <Icon style={{ fontSize: 13, marginLeft: 15, color: '#e25657' }} name='ios-star' /> */}
                                                        </Text>


                                                        <Right>
                                                            <Icon name="checkmark-circle" style={{ color: '#5cb75d', marginTop: -30, }}></Icon>
                                                        </Right>

                                                    </View>

                                                    <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />


                                                    <Text style={styles.pageText}>{item.med1}</Text>
                                                    <View style={{ flex: 1, flexDirection: 'row' }}>

                                                        <Text style={{
                                                            textDecorationLine: 'line-through', textDecorationStyle: 'solid',
                                                            fontFamily: 'OpenSans',
                                                            fontSize: 12,
                                                            color: 'black',

                                                            fontWeight: "bold"
                                                        }}>MRP: Rs 100</Text><Text style={{
                                                            fontFamily: 'OpenSans',
                                                            fontSize: 12,
                                                            color: '#000',
                                                            marginLeft: 10,
                                                            fontWeight: "bold"
                                                        }} > Rs.50</Text>
                                                    </View>


                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.customColumn}>
                                                <TouchableOpacity>
                                                    <View style={{ width: 'auto' }}>

                                                        <Text style={{ marginTop: -30, fontFamily: 'OpenSans', fontSize: 13, color: '#ffa723', }}> Get 50% Off
                                         {/* <Icon style={{ fontSize: 13, marginLeft: 15, color: '#e25657' }} name='ios-star' /> */}
                                                        </Text>


                                                    </View>
                                                    <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />

                                                    <Text style={styles.pageText}>Rx Ready</Text>
                                                    <View style={{ flex: 1, flexDirection: 'row' }}>

                                                        <Text style={{
                                                            textDecorationLine: 'line-through', textDecorationStyle: 'solid',
                                                            textDecorationColor: 'green',
                                                            fontFamily: 'OpenSans',
                                                            fontSize: 12,
                                                            color: 'black',

                                                            fontWeight: "bold"
                                                        }}>MRP: Rs 100</Text><Text style={{
                                                            fontFamily: 'OpenSans',
                                                            fontSize: 12,
                                                            color: '#000',
                                                            marginLeft: 10,
                                                            fontWeight: "bold"
                                                        }} > Rs.50</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </Row>
                                }
                            />
                        </Grid>
                    </Card>
                </Content>
                <Footer style={{ backgroundColor: '#7E49C3', }}>
                    <Row>
                        <Col style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                            <TouchableOpacity>
                                <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: 'black', width: 40, height: 35, backgroundColor: 'white' }}>
                                    <Text style={{ fontSize: 40, textAlign: 'center', marginTop: -5, color: 'black' }}>-</Text>
                                </View>
                            </TouchableOpacity>
                            <View>
                                <Text style={{ marginLeft: 5, color: 'white', fontSize: 20 }}>8</Text>
                            </View>
                            <TouchableOpacity>
                                <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: 'black', width: 40, height: 35, marginLeft: 5, backgroundColor: 'white' }}>
                                    <Text style={{
                                        fontSize: 20, textAlign: 'center', marginTop: -5,
                                        color: 'black'
                                    }}>+</Text>
                                </View>
                            </TouchableOpacity>
                        </Col>

                        <Col style={{ marginRight: 40 }} >
                            <Button success style={{ borderRadius: 10, marginTop: 10, marginLeft: 45, height: 40, justifyContent: 'center' }}>


                                <Row style={{ justifyContent: 'center', }}>

                                    <Icon name='ios-cart' />

                                    <Text style={{ marginLeft: -25, marginTop: 2, }}>VIEW CART</Text>
                                    <View>
                                        <Text style={{ position: 'absolute', height: 20, width: 20, fontSize: 13, backgroundColor: '#ffa723', top: 0, marginLeft: -105, borderRadius: 20, marginTop: -10 }}>
                                            20
                                        </Text>
                                    </View>
                                </Row>
                            </Button>
                        </Col>

                    </Row>


                </Footer>

            </Container>

        )
    }

}

export default MedicineSearch


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 5
    },
    customImage: {
        height: 70,
        width: 70,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
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
    searchBox:
    {
        width: '100%',
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 35,
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
        padding: 20
    },
    customColumn:
    {
        padding: 10,
        paddingTop: 30,
        paddingBottom: 30,
        borderRadius: 10,
        borderColor: '#D92B4B',
        borderWidth: 1,
        margin: 5,
        width: '45%',
        marginRight: 10

    },
    pageText: {
        fontFamily: 'OpenSans',
        fontSize: 14,


        fontWeight: "bold"
    }


});