import React, { Component } from 'react';
import { Container, Content, Text, Title, Header,View, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab } from 'native-base';

import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

class MedicineSearchList extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
    }
    
    render() {


        return (

            <Container style={styles.container}>


                <Content>

                    <Grid style={styles.curvedGrid}>

                    </Grid>

                    <Grid style={{ marginTop: -180, height: 150 }}>
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
                    <Card transparent style={{ padding: 10, marginTop: 40 }} onTouchStart={()=> this.props.navigation.navigate('MedicineCheckout')} >
                         <Card style={{ padding: 10 }}>
                            <Grid>
                                <Col style={{ width: '25%' }}>
                                    <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />
                                </Col>

                                <Col style={{marginLeft: 10, width: '75%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <Text style={styles.normalText}>Aminocaproic Acid</Text>
                                  <Row>
                                    <Left style={{marginLeft: 30}}>
                                   <Text style={styles.subText}>
                                    <Text style={{color: 'gray',fontSize:17, textDecorationLine: 'line-through',textDecorationStyle: 'solid',textDecorationColor:'gray'}}>
                                    {'\u20B9'}100</Text>  {'\u20B9'} 80</Text>
                                    </Left>

                                    <Right style={{marginRight: 10}}>
                                        <View style={{ backgroundColor: 'white', borderWidth: 1, borderRadius: 200, padding: 5}}>
                                    <Text style={styles.offerText}>20% </Text>
                                    </View>                           
                                   </Right>
                                    </Row>
                                   <Text style={{ color: 'gray',fontSize:15 }}>White Pigeon Pharmacy</Text>
       
                                </Col>
                            </Grid>

                        </Card>
                        <Card style={{ padding: 10 }}>
                            <Grid>
                                <Col style={{ width: '25%' }}>
                                    <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />
                                </Col>

                                <Col style={{ marginLeft: 10,width: '75%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <Text style={styles.normalText}>Gemtuzumab ozogamicin</Text>
                                  <Row>
                                    <Left style={{marginLeft: 30}}>
                                   <Text style={styles.subText}>
                                    <Text style={{color: 'gray',fontSize:17, textDecorationLine: 'line-through',textDecorationStyle: 'solid',textDecorationColor:'gray'}}>
                                    {'\u20B9'}100</Text>  {'\u20B9'} 50</Text>
                                    </Left>

                                    <Right style={{marginRight: 10}}>
                                    <View style={{ backgroundColor: 'white', borderWidth: 1, borderRadius: 200, padding: 5}}>
                                    <Text style={styles.offerText}>50% </Text>
                                    </View>                           
                                   </Right>
                                    </Row>
                                   <Text style={{ color: 'gray',fontSize:15 }}>Wellness Craft Pharmacy</Text>
       
                                </Col>
                            </Grid>

                        </Card>



                        <Card style={{ padding: 10 }}>
                            <Grid>
                                <Col style={{ width: '25%' }}>
                                    <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />
                                </Col>

                                <Col style={{ marginLeft: 10,width: '75%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <Text style={styles.normalText}>Hydroxyurea for sickle cell disease</Text>
                                  <Row>
                                    <Left style={{marginLeft: 30}}>
                                   <Text style={styles.subText}>
                                    <Text style={{color: 'gray',fontSize:17, textDecorationLine: 'line-through',textDecorationStyle: 'solid',textDecorationColor:'gray'}}>
                                    {'\u20B9'}100</Text>  {'\u20B9'} 75</Text>
                                    </Left>
                                    <Right style={{marginRight: 10}}>
                                    <View style={{ backgroundColor: 'white', borderWidth: 1, borderRadius: 200, padding: 5}}>
                                    <Text style={styles.offerText}>25% </Text>
                                    </View>                           
                                   </Right>
                                    </Row>
                                       <Text style={{ color: 'gray',fontSize:15 }}>Shoprite Pharmacy</Text>
                                </Col>
                            </Grid>

                        </Card>

                    </Card>
                </Content>
                <Footer>
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
                </Footer>
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
        marginBottom: 'auto'
    },

    curvedGrid:
    {
        borderRadius: 800,
        width: '200%',
        height: 800,
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
        // color: 'gblackray',
        marginTop: 10
    },
    offerText:
    {
        fontFamily: 'OpenSans',
        fontSize: 13,
        color: 'red'
     
    },
    subText:{
        fontFamily: 'OpenSans',
        fontSize: 17,
        color: 'black'
    }

});