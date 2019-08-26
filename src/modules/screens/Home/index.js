import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Spinner, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab } from 'native-base';
import { login, logout } from '../../providers/auth/auth.actions';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, View, TouchableOpacity } from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { catagries } from '../../providers/catagries/catagries.actions';


class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false,
            catagary: [],
            searchValue: null,
            totalSpecialistDataArry: [],
            visibleClearIcon: ''

        };
        this.arrayData = []
        this.getCatagries();
    }
    navigetToCategories() {
        this.props.navigation.navigate('Categories', { data: this.state.data })
    }

    doLogout() {
        logout();
        this.props.navigation.navigate('login');
    }

    getCatagries = async () => {
        try {
            let result = await catagries();


            // if(result.success) 
            // setTimeout( ()=>{
            this.setState({ data: result.data, isLoading: true })
            console.log('category Data' + JSON.stringify(this.state.data));
            let limitedData = [];

            for (let limtedNumber = 0; limtedNumber < 6; limtedNumber++) {
                if (result.data[limtedNumber] !== undefined)
                    limitedData.push(result.data[limtedNumber]);
            }
            this.setState({ catagary: limitedData });

            let totalSpecialistDataArry = [];

            this.state.data.forEach((dataElement) => {
                let categoryObject = { name: 'specialist', value: dataElement.category_name };
                totalSpecialistDataArry.push(categoryObject);

                dataElement.services.forEach((serviceEle) => {
                    let serviceObject = { name: 'service', value: serviceEle.service };
                    totalSpecialistDataArry.push(serviceObject);
                    if (serviceEle.symptoms != undefined) {
                        serviceEle.symptoms.forEach((symptomsEle) => {
                            let symptomObject = { name: 'symptoms', value: symptomsEle };
                            totalSpecialistDataArry.push(symptomObject)
                        })
                    }
                })

            })
            await this.setState({ totalSpecialistDataArry: totalSpecialistDataArry })
            console.log('this.state.totalSpecialistDataArry' + JSON.stringify(this.state.totalSpecialistDataArry));


        } catch (e) {
            console.log(e);
        }
    }

    searchDoctorListModule = async () => {
        try {
            let serachInputvalues = [{
                type: 'service',
                value: [this.state.searchValue]
            },
            {
                type: 'symptoms',
                value: [this.state.searchValue]
            }]
            if (this.state.searchValue == null) {
                alert("We can't Find the Empty Values");
            }
            else {
                this.props.navigation.navigate('Doctor List', { resultData: serachInputvalues })
            }
        } catch (e) {
            console.log(e);
        }
    }
    navigateToCategorySearch(categoryName) {
        let serachInputvalues = [{
            type: 'category',
            value: categoryName
        }]
        this.props.navigation.navigate('Doctor List', { resultData: serachInputvalues })
    }

    /* Filter the Specialist and Services on Search Box  */
    SearchFilterFunction = async (enteredText) => {
        await this.setState({ visibleClearIcon: enteredText })

        this.arrayData = this.state.totalSpecialistDataArry;
        let newData = this.arrayData.filter(function (item) {
            let itemData = item.value ? item.value.toUpperCase() : ''.toUpperCase();
            let textData = enteredText.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        this.setState({
            totalSpecialistDataArry: newData,
            searchValue: enteredText,
        });
    }

    clearTotalText = () => {
        this.setState({ searchValue: '' })
    };

    itemSaperatedByListView = () => {
        return (
            <View
                style={{
                    height: 0.3,
                    width: '90%',
                    backgroundColor: '#080808',
                }}
            />
        );
    };

    render() {
        return (

            <Container style={styles.container}>
                <Content keyboardShouldPersistTaps={'handled'} style={styles.bodyContent}>
                    <Row style={{ backgroundColor: 'white', borderColor: '#000', borderWidth: 1, borderRadius: 20, }}>

                        <Input placeholder="Search Symptoms/Services"
                            style={{ color: 'gray', fontFamily: 'OpenSans', fontSize: 12 }}
                            placeholderTextColor="gray"
                            value={this.state.searchValue}
                            keyboardType={'email-address'}
                            autoFocus={fromAppointment}
                            // onChangeText={searchValue => this.setState({ searchValue })}
                            onChangeText={enteredText => this.SearchFilterFunction(enteredText)}
                            underlineColorAndroid="transparent"
                            blurOnSubmit={false}
                            onSubmitEditing={() => { this.searchDoctorListModule(); }}
                        />
                        {this.state.visibleClearIcon != '' ? <Right style={{ marginLeft: 10 }}>
                            <Button Button transparent onPress={() => this.clearTotalText()}>
                                <Icon name="ios-close" style={{ color: 'gray' }} />
                            </Button>
                        </Right> : null
                        }
                        <Right>
                            <Button Button transparent onPress={() => this.searchDoctorListModule()}>
                                <Icon name="ios-search" style={{ color: '#000' }} />
                            </Button>
                        </Right>

                    </Row>


                    {this.state.searchValue != null ?
                        <FlatList
                            data={this.state.totalSpecialistDataArry}
                            ItemSeparatorComponent={this.itemSaperatedByListView}
                            renderItem={({ item }) => (
                                <Row>
                                    <Text style={{ padding: 10 }}>{item.value}</Text>
                                    <Text style={{ padding: 10, marginRight: 10, fontSize: 14, fontStyle: 'italic' }}>{item.name}</Text>

                                </Row>
                            )}
                            enableEmptySections={true}
                            style={{ marginTop: 10 }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        : null}

                    <Card style={{ padding: 10, borderRadius: 10 }}>

                        <Grid>
                            <Row >
                                <Left  >

                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 17 }}>Categories</Text>
                                </Left>
                                <Body >

                                </Body>
                                <Right>


                                    <Text style={styles.titleText} onPress={() => this.navigetToCategories()}>View All</Text>


                                </Right>



                            </Row>

                            <Row>

                                <ListItem noBorder>
                                    <ScrollView horizontal={false}>
                                        {/* <FlatList
                                            horizontal={true}
                                            data={this.state.catagary}
                                            extraData={this.state}
                                            renderItem={({ item, index }) =>
                                                <Grid style={{ marginTop: 10 }}>
                                                    <Item style={styles.column} onPress={() => this.navigateToCategorySearch(item.category_name)}>
                                                        <Col>
                                                            <LinearGradient
                                                                colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 5, height: 100, width: 100, marginLeft: 'auto', marginRight: 'auto' }}>
                                                                <Image
                                                                    source={{ uri: item.imageBaseURL + '/' + item.category_id + '.png' }} style={styles.customImage} />
                                                            </LinearGradient>

                                                            <Text style={styles.textcenter}>{item.category_name}</Text>
                                                            <Text note style={{ textAlign: 'center' }}>100 Doctors</Text>
                                                        </Col>
                                                    </Item>
                                                </Grid>
                                            }
                                            keyExtractor={(item, index) => index.toString()}
                                        />
  */}

                                    </ScrollView></ListItem>

                            </Row>

                        </Grid>

                    </Card>

                    <Card style={{ backgroundColor: '#ffeaa7', padding: 10, borderRadius: 10 }}
                    >
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 17 }}>You Can Save A Life</Text>
                        <Button block style={{ margin: 10, borderRadius: 20, backgroundColor: '#74579E' }}>
                            <Text>REPORT ACCIDENT NOW</Text>
                        </Button>

                        <Text style={{ textAlign: 'right', fontSize: 14, fontFamily: 'OpenSans', color: '#000' }}>5002 Fast Growing Ambulance</Text>

                    </Card>


                    <LinearGradient
                        colors={['#7E49C3', '#C86DD7']}
                        style={{ borderRadius: 10, padding: 10, borderBottomWidth: 0, fontFamily: 'OpenSans', marginTop: 5 }} >
                        <Grid style={{ padding: 10 }}>
                            <Col style={{ width: '75%' }}>
                                <Text style={{ fontFamily: 'OpenSans', color: 'white', fontSize: 17 }}>Video Consultation</Text>
                                <Text note style={{ color: 'white', fontFamily: 'OpenSans', marginTop: 'auto', marginBottom: 'auto' }}>Have A Video Visit With A Certified HealthCare - Doctors</Text>

                            </Col>

                            <Col style={{ width: '25%' }}>
                                <Image source={{ uri: 'https://odoc.life/wp-content/uploads/2018/06/oDoc-Video-Call-iPhone-X.png' }} style={{ height: 150, width: 100, borderColor: '#fff', borderWidth: 2, borderRadius: 10 }} />
                            </Col>
                        </Grid>


                    </LinearGradient>


                    <LinearGradient
                        colors={['#F58949', '#E0C084']}
                        style={{ borderRadius: 10, padding: 10, borderBottomWidth: 0, fontFamily: 'OpenSans', marginTop: 10, marginBottom: 10 }} >
                        <Grid>
                            <Row onPress={() => this.props.navigation.navigate("MedicineList")}>
                                <Col style={{ width: '75%' }}>
                                    <Text style={{ fontFamily: 'OpenSans', color: 'white', marginTop: 10, fontSize: 17 }}>Online Pharmacy Services</Text>
                                </Col>
                                <Col style={{ width: '25%' }}>
                                    <Text style={styles.offerText1}>25% offers</Text>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Text note style={{ fontFamily: 'OpenSans', color: 'white', marginTop: 15 }}>Medflic Pharmacy Offers You Online Convenience For Ordering, Monitoring And Receiving Prescription For You And Your Family.</Text>
                                </Col>
                            </Row>
                        </Grid>

                        <Grid style={{ padding: 10 }}>
                            <Col style={{ width: '33.33%' }}>
                                <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.pharmImage} />

                                <Text style={styles.offerText}>Geriatrics</Text>

                            </Col>
                            <Col style={{ width: '33.33%' }}>
                                <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.pharmImage} />

                                <Text style={styles.offerText}>Geriatrics</Text>
                            </Col>
                            <Col style={{ width: '33.33%' }}>
                                <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.pharmImage} />

                                <Text style={styles.offerText}>Geriatrics</Text>
                            </Col>
                        </Grid>

                    </LinearGradient>


                </Content>

                {/* <Footer>
                    <FooterTab style={{ backgroundColor: '#7E49C3' }}>
                        <Button >
                            <Icon name="apps" />
                        </Button>
                        <Button>
                            <Icon name="chatbubbles" />
                        </Button>
                        <Button >
                            <Icon active name="notifications" />
                        </Button>
                        <Button>
                            <Icon name="person" />
                        </Button>
                    </FooterTab>
                </Footer>*/}
            </Container>

        )
    }

}

function homeState(state) {

    return {
        user: state.user
    }
}
export default connect(homeState)(Home)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 5
    },
    textcenter: {
        fontSize: 14,
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'OpenSans'
    },

    column:
    {
        width: 'auto',
        borderRadius: 10,
        margin: 5,
        padding: 5,
        paddingBottom: 20,


    },

    columns:
    {
        width: '33.33%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 10,
        margin: 5,
        padding: 5,
        paddingBottom: 25,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 5

    },

    customImage: {
        height: 70,
        width: 70,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },


    pharmImage: {
        height: 50,
        width: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        // borderColor: '#fff',
        // borderWidth: 2,
        // borderRadius: 10,
        //padding:30


    },
    titleText: {
        fontSize: 15,
        padding: 5,
        backgroundColor: '#FF9500',
        borderRadius: 20,
        color: 'white',
        width: "95%",
        textAlign: 'center',
        fontFamily: 'OpenSans',

    },

    offerText: {
        fontSize: 12,
        padding: 5,
        backgroundColor: 'gray',
        borderRadius: 20,
        color: 'white',
        width: "93%",
        textAlign: 'center',
        fontFamily: 'OpenSans',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },

    offerText1: {
        fontSize: 12,
        padding: 5,
        backgroundColor: 'red',
        borderRadius: 20,
        color: 'white',
        width: "93%",
        textAlign: 'center',
        fontFamily: 'OpenSans',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    }

});