import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import { formatDate } from '../../../setup/helpers';
import { ScrollView } from 'react-native-gesture-handler';
import { RenderHospitalAddress ,renderDoctorImage,   } from '../../common'


class PaymentSuccess extends Component {
    constructor(props) {
        super(props)

        this.state = {
            successBookSlotDetails: {},
        }
    }

    async componentDidMount() {
        const { navigation } = this.props;
        const successBookSlotDetails = navigation.getParam('successBookSlotDetails');
        await this.setState({ successBookSlotDetails: successBookSlotDetails });
        console.log('successBookSlotDetails' + JSON.stringify(this.state.successBookSlotDetails))
    }
    render() {
        const { navigation } = this.props;
        const { successBookSlotDetails } = this.state;
        return (

            <Container style={styles.container}>
                <ScrollView>
                    <Content style={styles.bodyContent}>
                   <Card style={styles.mainCard}>
                       <View style={{alignItems:'center',marginTop:10}}>
                       <Icon name="checkmark-circle" style={styles.circleIcon} />
                       </View>
                       

                     
                         <Text style={styles.successHeading}>SUCCESS</Text>
                          <Text style={styles.subText}>Thank You For Choosing Our Service And Trust Our Doctor To Take Care Your Health</Text>
                         
                          <Row style={{borderTopColor:'gray',borderTopWidth:0.5,marginTop:10,marginLeft:10,padding:15,marginRight:10}}>
                                    <Col style={{width:'25%',}}>
                                        <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }}  style={{ height: 60, width: 60 }} />
                                     </Col>
                                     <Col style={{width:'75%',marginTop:10}}>
                                         <Row>
                                         <Text style={styles.docHeading}>S.Marry Jain </Text>
                                         <Text style={styles.Degree}>(M.B.B.S)</Text>
                                         </Row>
                                         <Row style={{marginTop:-12}}>
                                         <Text style={{fontFamily:'OpenSans',fontSize:14,color:'#535353',fontStyle: 'italic'}}>Heart Specialist</Text>

                                         </Row>
                                     </Col>
                             </Row>
                             <Row style={{marginTop:10,marginLeft:10,marginRight:10}}>
                                   
                                    <Text style={{textAlign:'center',fontFamily:'OpenSans',fontSize:16,}}>Date and Time</Text>
                                     
                                         <Right>
                                         <Text style={{fontFamily:'OpenSans',fontSize:16,color:'#545454'}}>02nd Sept, 2019 </Text>
                                         <Text style={{fontFamily:'OpenSans',fontSize:14,color:'#7B7B7B',fontStyle: 'italic'}}>04.03 PM</Text>
                                         </Right>
                                         
                                    

                                  

                                   
                             </Row>
                             <Row style={styles.rowDetail}>
                                  
                                    <Text style={{textAlign:'center',fontFamily:'OpenSans',fontSize:16}}>Address</Text>
                                 
                                     
                                         <Right>
                                         <Text style={{textAlign:'center',fontFamily:'OpenSans',fontSize:16,color:'#545454'}}>Apollo Hospitals </Text>
                                     <Text style={{textAlign:'center',fontFamily:'OpenSans',fontSize:14,color:'#7B7B7B',fontStyle: 'italic'}}>Jubilee Hills, Hyderabad</Text>
                                     <Text style={{textAlign:'center',fontFamily:'OpenSans',fontSize:14,color:'#7B7B7B',fontStyle: 'italic'}}>Telungana, 290000</Text>
                                         </Right>
                                     

                                    
                             </Row>
                             <Row style={styles.rowDetail}>                           
                                 
                                    <Text style={{textAlign:'center',fontFamily:'OpenSans',fontSize:16,}}>Doctor Fee</Text>
                                 
                                         <Right>
                                         <Text style={{textAlign:'center',fontFamily:'OpenSans',fontSize:16,color:'#545454'}}>Rs.150 </Text>

                                         </Right>
                                   
                             </Row>
                             <Row style={{marginTop:15,marginLeft:10,marginRight:10,marginBottom:20}}>                             
                           
                                    <Text style={{textAlign:'center',fontFamily:'OpenSans',fontSize:16,}}>Payment Method </Text>
                                     
                                         <Right>
                                         <Text style={{textAlign:'center',fontFamily:'OpenSans',fontSize:16,color:'#545454'}}>Card </Text>

                                         </Right>
                                  
                             </Row>
                          </Card>
                        <Button block style={{ marginTop: 15, borderRadius: 10, marginBottom: 10,backgroundColor:'#5bb85d' }}><Text style={styles.customizedText}> Home </Text></Button>
                        </Content>
                </ScrollView>
            </Container>

                        //  <Grid style={{ alignItems: 'center' }}>
                        //     <Row>
                        //         <Col style={{ alignItems: 'center' }}>
                        //             <Icon name='ios-checkmark' style={{ color: 'green', fontSize: 50, alignItems: 'center' }}></Icon>
                        //             <H3 style={{ textAlign: 'center', fontFamily: 'OpenSans' }}> Success</H3>
                        //             <Text note style={{ textAlign: 'center', fontFamily: 'OpenSans' }}> Thank You For Choosing Our Service And Trust Our Doctors To Take Care Your Health</Text>
                        //         </Col>
                        //     </Row>
                        // </Grid>

                        // <Card style={{ padding: 15, borderRadius: 10, marginTop: 10 }}>
                         
                        //     <Grid>
                        //         <Row>
                        //             <Body>
                        //                 {
                        //                     successBookSlotDetails.profile_image != undefined
                        //                         ? <Thumbnail square source={{ uri: successBookSlotDetails.profile_image.imageURL }} style={{ height: 60, width: 60 }} />
                        //                         : <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 80, width: 80 }} />
                        //                 }
                        //             </Body>
                        //         </Row>

                        //         <Row style={{ marginTop: 20 }}>
                        //             <Col style={{ alignItems: 'center' }}>
                        //                 <Text note style={styles.customizedText}>Doctor</Text>
                        //                 <Text style={styles.customizedText}>{successBookSlotDetails.prefix ? successBookSlotDetails.prefix : 'Dr'}. {successBookSlotDetails.doctorName}</Text>

                        //             </Col>
                        //         </Row>

                        //         <Row style={{ marginTop: 20 }}>
                        //             <Col style={{ alignItems: 'center' }}>
                        //                 <Text style={styles.customizedText} note>Date And Time</Text>
                        //                 <Text style={styles.customizedText}>{successBookSlotDetails.slotData && successBookSlotDetails.slotData.slotDate}</Text>
                        //                 <Text style={styles.customizedText}>{successBookSlotDetails.slotData && formatDate(successBookSlotDetails.slotData.slotStartDateAndTime, 'hh:mm a')}</Text>
                        //             </Col>
                        //         </Row>

                        //         <Row style={{ marginTop: 20 }}>
                                 
                        //             <Text style={styles.customizedText}>Address</Text>
                        //             {successBookSlotDetails.slotData ?
                        //                 <RenderHospitalAddress gridStyle={{ padding: 10, marginLeft: 10, width: '100%' }}
                        //                     textStyle={styles.customizedText}
                        //                     hospotalNameTextStyle={{ fontFamily: 'OpenSans-SemiBold' }}
                        //                     hospitalAddress={successBookSlotDetails.slotData && successBookSlotDetails.slotData.location}
                        //                 />
                        //                 : null}

                                
                        //         </Row>

                        //     </Grid>

                        // </Card>
                        // <Button block success style={{ marginTop: 10, borderRadius: 20, marginBottom: 10 }} onPress={() => navigation.navigate('Home')}><Text style={styles.customizedText}> Home </Text></Button> 
                 
        )
    }

}

function loginState(state) {

    return {
        user: state.user
    }
}
export default connect(loginState, { login, messageShow, messageHide })(PaymentSuccess)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',

    },

    bodyContent: {
        padding: 20

    },
    customizedText: {
        fontFamily: 'OpenSans',
        fontSize: 20,
        fontWeight:'bold',
        color:'#fff'
    },
    userImage:
    {
        height: 60,
        width: 60,
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        padding: 10,
        borderRadius: 30,
        borderColor: '#f1f1f1',
        borderWidth: 5,

    },
    mainCard:{
        borderRadius:10,
        marginTop:20
    },
    circleIcon:{
        color: '#5cb75d',
        fontSize:100
    },
    successHeading:{
        textAlign:'center',
        fontFamily:'OpenSans',
        fontSize:24,
        fontWeight:'bold'
    },
    subText:{
        textAlign:'center',
        fontFamily:'OpenSans',
        fontSize:14,
        marginTop:5,
        color:'#535353',
        marginLeft:20,
        marginRight:20
    },
    docHeading:{
        fontFamily:'OpenSans',
        fontSize:20
    },
    Degree:{
        fontFamily:'OpenSans',
        fontSize:14,
        marginTop:8
    },
    rowDetail:{
        marginTop:15,
        marginLeft:10,
        marginRight:10
    }
});