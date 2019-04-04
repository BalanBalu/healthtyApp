import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

class Home extends Component {
    constructor(props) {
        super(props)

    }


    render() {


        return (

            <Container style={styles.container}>

                <Header style={{ backgroundColor: '#7E49C3' }}>
                    <Left  >
                        <Button Button transparent onPress={() => this.props.navigation.navigate('home')}>
                            <Icon name="medkit" style={{ color: '#fff', fontSize: 35 }}></Icon>

                        </Button>
                    </Left>
                    <Body>
                        <Item style={{ width: '150%', borderBottomWidth: 0, backgroundColor: '#fff', borderRadius: 10, height: 35 }} >

                            <Input placeholder="Chennai,Tamilnadu,India" style={{ color: 'gray', fontFamily: 'opensans-regular', fontSize: 12 }} placeholderTextColor="gray" />
                            <Icon name="ios-search" style={{ color: 'gray' }} />
                        </Item>

                    </Body>
                    <Right >

                        <Button transparent onPress={() => this.props.navigation.navigate('userprofile')}>
                            <Thumbnail style={{ height: 40, width: 40, borderColor: '#f5f5f5', borderWidth: 2, borderRadius: 50 }} source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} />
                        </Button>

                    </Right>
                </Header>



                <Content style={styles.bodyContent}>
                    <Card style={{ padding: 10, borderRadius: 10 }}>

                        <Grid>
                            <Row>
                                <Left  >

                                    <Text style={{ fontFamily: 'opensans-regular', fontSize: 17 }}>Categories</Text>
                                </Left>
                                <Body >

                                </Body>
                                <Right>


                                    <Text style={styles.titleText} onPress={() => this.props.navigation.navigate('categories')}>View All</Text>


                                </Right>



                            </Row>

                            <Row>
                                <Col style={styles.column}>
                                    <LinearGradient
                                        colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                                        <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.customImage} />
                                    </LinearGradient>

                                    <Text style={styles.textcenter}>Geriatrics</Text>
                                    <Text note style={{ textAlign: 'center' }}>100 Doctors</Text>
                                </Col>

                                <Col style={styles.column}>
                                    <LinearGradient
                                        colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                                        <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.customImage} />
                                    </LinearGradient>

                                    <Text style={styles.textcenter}>Geriatrics</Text>
                                    <Text note style={{ textAlign: 'center' }}>150 Doctors</Text>
                                </Col>



                                <Col style={styles.column}>
                                    <LinearGradient
                                        colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 10, height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                                        <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.customImage} />
                                    </LinearGradient>

                                    <Text style={styles.textcenter}>Geriatrics</Text>
                                    <Text note style={{ textAlign: 'center' }}>50 Doctors</Text>
                                </Col>


                            </Row>

                        </Grid>

                    </Card>

                    <Card style={{ backgroundColor: '#CDEEFF', padding: 10, borderRadius: 10 }}
                    >
                        <Text style={{ fontFamily: 'opensans-regular', fontSize: 17 }}>You Can save A Life</Text>
                        <Button block style={{ margin: 10, borderRadius: 20, backgroundColor: '#74579E' }}>
                            <Text>REPORT ASSIDENT NOW</Text>
                        </Button>

                        <Text style={{ textAlign: 'right', fontSize: 14, fontFamily: 'opensans-regular', color: '#000' }}>5002 Fast Growing Ambulance</Text>

                    </Card>


                    <LinearGradient
                        colors={['#7E49C3', '#C86DD7']}
                        style={{ borderRadius: 10, padding: 10, borderBottomWidth: 0, fontFamily: 'opensans-regular', marginTop: 5 }} >
                        <Grid style={{ padding: 10 }}>
                            <Col style={{ width: '75%' }}>
                                <Text style={{ fontFamily: 'opensans-regular', color: 'white', fontSize: 17 }}>Video Consultation</Text>
                                <Text note style={{ color: 'white', fontFamily: 'opensans-regular', marginTop: 'auto', marginBottom: 'auto' }}>Have A Video Visit With A Certified HealthCare - Doctors</Text>

                            </Col>

                            <Col style={{ width: '25%' }}>
                                <Image source={{ uri: 'https://odoc.life/wp-content/uploads/2018/06/oDoc-Video-Call-iPhone-X.png' }} style={{ height: 150, width: 100, borderColor: '#fff', borderWidth: 2, borderRadius: 10 }} />
                            </Col>
                        </Grid>


                    </LinearGradient>


                    <LinearGradient
                        colors={['#F58949', '#E0C084']}
                        style={{ borderRadius: 10, padding: 10, borderBottomWidth: 0, fontFamily: 'opensans-regular', marginTop: 10, marginBottom: 10 }} >
                        <Grid>
                            <Row>
                                <Col style={{ width: '75%' }}>
                                    <Text style={{ fontFamily: 'opensans-regular', color: 'white', marginTop: 10, fontSize: 17 }}>Online Pharmacy Services</Text>
                                </Col>
                                <Col style={{ width: '25%' }}>
                                    <Text style={styles.offerText}>25% offers</Text>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Text note style={{ fontFamily: 'opensans-regular', color: 'white', marginTop: 15 }}>Medflick Pharmacy Offers You Online Convenience For Ordering, Monitoring And Receiving Prescription For You And Your Family.</Text>
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
            </Container>

        )
    }

}

function appoinmentsState(state) {

    return {
        user: state.user
    }
}
export default connect(appoinmentsState, { login, messageShow, messageHide })(Home)


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
        fontFamily: 'opensans-regular'
    },

    column:
    {
        width: '33.33%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 10,
        margin: 5,
        padding: 5,
        paddingBottom: 25

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
        fontFamily: 'opensans-regular',

    },

    offerText: {
        fontSize: 14,
        padding: 5,
        backgroundColor: 'gray',
        borderRadius: 20,
        color: 'white',
        width: "95%",
        textAlign: 'center',
        fontFamily: 'opensans-regular',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    }

});