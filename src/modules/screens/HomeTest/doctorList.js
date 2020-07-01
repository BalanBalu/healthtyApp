import React, {PureComponent} from 'react';
import { Container, Content, Text, Toast, Button,ListItem, Card,Thumbnail,List,Item, Input, Left, Right, Icon } from 'native-base';
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage, FlatList, ImageBackground, Alert, Linking } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid'
const vipLogo = require('../../../../assets/images/viplogo.png')
import StarRating from 'react-native-star-rating';

class DoctorList extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
        }
    }


    render(){
        return(
            <Container>
                <Content>
                <Card style={{ borderRadius: 7, paddingTop: 5, paddingBottom: 5 }}>

<Row>
    <Col size={5} style={{ flexDirection: 'row', marginLeft: 5, }}>

        <Col size={1.1} >
            <Icon name='ios-arrow-down' style={{ color: 'gray', fontSize: 20, marginTop: 10 }} />
        </Col>
        <Col size={8.9} style={{ justifyContent: 'center' }}>
            <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, textAlign: 'center', marginTop: 5 }}>Top Rated </Text>
        </Col>

    </Col>
    <Col size={5} style={{ flexDirection: 'row', borderLeftColor: '#909090', borderLeftWidth: 0.3 }} >

        <Col size={1.1} style={{ marginLeft: 10 }}>
            <Icon name='ios-funnel' style={{ color: 'gray', fontSize: 25, marginTop: 5 }} />
        </Col>
        <Col size={8.9} style={{ justifyContent: 'center' }}>
            <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, marginTop: 5, marginLeft: 5, width: '100%', textAlign: 'center' }}>Filters </Text>
        </Col>

    </Col>
</Row>
</Card>
<View style={{ padding: 10, paddingBottom: 10, height: 45 }}>
                    <Grid>
                        <Col size={10}>
                            <Item  style={{ backgroundColor: '#fff', height: 35, borderRadius: 2 , borderBottomWidth: 1,borderTopWidth: 1,borderLeftWidth:1,borderRightWidth:1}} >
                                <Input
                                    placeholder='Specialism and Categories...'
                                    style={{ fontSize: 12, width: '100%',}}
                                    placeholderTextColor="#C1C1C1"
                                    keyboardType={'default'}
                                    onChangeText={(text) => this.navigatePress(text)}
                                    // onKeyPress={(evet) => this.navigatePress(evet)}
                                    returnKeyType={'go'}
                                    multiline={false} />
                                <TouchableOpacity style={{ alignItems: 'flex-end' }}>
                                    <Icon name='ios-search' style={{ color: '#909090', fontSize: 20 }} />
                                </TouchableOpacity>
                            </Item>
                        </Col>
                    </Grid>
                </View>
                <View>
                    <Row style={{marginTop:5,padding: 10,}}>
                    <Col size={8}>
        <Text style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13,  }}>Showing Doctors in the <Text style={{ fontFamily: 'OpenSans', color: '#7F49C3', fontSize: 13,  }}>{" "}PinCode - 600051</Text></Text>
                        </Col>
                        <Col size={2}>
                            <Row style={{justifyContent:'flex-end'}}>
                            <TouchableOpacity style={{paddingBottom:1,paddingTop:1,paddingLeft:2,paddingRight:2,borderColor:'#ff4e42',borderWidth:1,borderRadius:2}}>
                            <Text style={{ fontFamily: 'OpenSans', color: '#ff4e42', fontSize: 10,  }}>Edit Pincode </Text>
                            </TouchableOpacity>
                            </Row>
                        </Col>
                    </Row>
                </View>



        <Card style={{ padding: 2, borderRadius: 10, borderBottomWidth: 2,marginTop:5 }}>
                    <List style={{ borderBottomWidth: 0 }}>
                        <ListItem>
                            <Grid >
                                <Row >
                                    <Col style={{ width: '10%' }}>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderDoctorImage(item), title: 'Profile photo' })}>
                                            <Thumbnail circle source={require('../../../../assets/images/Female.png')} style={{ height: 60, width: 60, borderRadius: 60 / 2 }} />
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: '73%' }}>
                                        <Row style={{ marginLeft: 55, }}>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold' }}>Dr.pradeep natarajan</Text>
                                        </Row>
                                        <Row style={{ marginLeft: 55, }}>
                                            <Text note style={{ fontFamily: 'OpenSans', marginTop: 2, fontSize: 11 }}>B.D.S.B.D.S Hearing Specialist</Text>
                                        </Row>
                                        <Row style={{ marginLeft: 55, }}>

                                            <Text note style={{ fontFamily: 'OpenSans', marginTop: 5, fontSize: 11, }}>
                                            67/B 2nd Road,Ambattur,Channai,Tamil Nadu
                                            </Text>
                                        </Row>
                                    </Col>
                                    <Col style={{ width: '17%' }}>
                                        <Row>
                                            <TouchableOpacity style={{paddingBottom:10,paddingTop:10,paddingRight:10,paddingLeft:10}} >
                                              
                                                    <Icon name="heart" 
                                                        style={{ marginLeft: 20, color: '#B22222', fontSize: 20 }}>
                                                    </Icon>
                                            </TouchableOpacity>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col style={{ width: "25%", marginTop: 10 }}>
                                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, }}> Experience</Text>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold' }}>2</Text>
                                    </Col>
                                    <Col style={{ width: "25%", marginTop: 10 }}>
                                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center', }}> Rating</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <StarRating
                                                fullStarColor='#FF9500'
                                                starSize={12}
                                                width={85}
                                                containerStyle={{ marginTop: 2 }}
                                                disabled={true}
                                                rating={1}
                                                maxStars={1}
                                            />

                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', marginLeft: 2 }}> 0</Text>
                                        </View>

                                    </Col>
                                    <Col style={{ width: "25%", marginTop: 10 }}>
                                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 5 }}> Favourite</Text>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 5, fontWeight: 'bold' }}>0</Text>
                                    </Col>
                                    <Col style={{ width: "25%", marginTop: 10 }}>
                                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center' }}> Fees</Text>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginLeft: 10 }}>100
                                        </Text>
                                    </Col>
                                </Row>



                                <Row style={{ borderTopColor: '#000', borderTopWidth: 0.4, marginTop: 5 }} >
                                    <Col size={.6}>

                                        <Icon name='ios-time' style={{ fontSize: 20, marginTop: 12 }} />

                                    </Col>
                                    <Col size={7.4}>

                                        <Text note style={{ fontFamily: 'OpenSans', marginTop: 15, fontSize: 12,  }}>Available on sunday, Monday, Tuesday, Wednesday, Thursday, Friday and Saturday</Text>
                                    </Col>
                                    <Col size={1.5}>
                                            <TouchableOpacity onPress={() => this.onBookPress(item.doctorIdHostpitalId)} style={{ textAlign: 'center', backgroundColor: 'green', borderColor: '#000', marginTop: 10, borderRadius: 20, height: 30, justifyContent: 'center', paddingLeft: 1, paddingRight: 1, }}>
                                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: 'OpenSans' }}>BOOK </Text>
                                            </TouchableOpacity>
                                    </Col>

                                </Row>

                                
                            </Grid>

                        </ListItem>


                    </List>
                </Card>
                </Content>
            </Container>
        )
    }
}

export default DoctorList