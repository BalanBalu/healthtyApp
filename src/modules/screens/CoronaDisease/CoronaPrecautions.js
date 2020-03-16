import React, { Component } from 'react';
import {
    Container, Content, Text, View, Badge, Spinner, Toast
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity, Share  } from 'react-native';
import { RadioButton, } from 'react-native-paper';
import { hasLoggedIn } from '../../providers/auth/auth.actions';
class CoronaPrecautions extends Component {
    constructor(props) {
        super(props)
        this.state = {  
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <Content style={{ backgroundColor: '#F5F5F5', padding: 10 }}>
                    <View>
                        <Text style={styles.mainHead}>Make sure you follow these Precautions to say secure and safe </Text> 
                        <View style={[styles.viewStyle,{marginTop:25}]} >
                            <Row>
                                <Col size={8} style={{justifyContent:'center'}}>
                                <Text style={{fontFamily:'OpenSans',fontSize:15}}>Keep your hands cleaned with soap and water for atleast 20 seconds</Text>    
                                </Col>
                                <Col size={2}>
                                <Image square source={require('../../../../assets/images/corono/Handwash.png')} style={{ height: 70, width: 70 }} />
                                </Col>
                            </Row>
                            </View>
                            <View style={styles.viewStyle}>
                            <Row>
                             
                                <Col size={2}>
                                <Image square source={require('../../../../assets/images/corono/coverwithtissue.png')} style={{ height: 70, width: 70 }} />
                                </Col>
                                <Col size={8} style={{justifyContent:'center'}}>
                                <Text style={styles.innerText}>Use tissue regularly when coughing and sneezing</Text>    
                                </Col>
                            </Row>
                            </View> 
                            <View style={styles.viewStyle}>
                            <Row>
                                <Col size={8} style={{justifyContent:'center'}}>
                                <Text style={{fontFamily:'OpenSans',fontSize:15}}>Mostly avoid physical contact with all the persons</Text>    
                                </Col>
                                <Col size={2}>
                                <Image square source={require('../../../../assets/images/corono/avoidcontact.png')} style={{ height: 70, width: 70 }} />
                                </Col>
                            </Row>
                            </View> 
                            <View style={styles.viewStyle}>
                            <Row>
                               
                                <Col size={2}>
                                <Image square source={require('../../../../assets/images/corono/mask.png')} style={{ height: 70, width: 70 }} />
                                </Col>
                                <Col size={8} style={{justifyContent:'center'}}>
                                <Text style={styles.innerText} >Always wear face mask whenever you are stepping out</Text>    
                                </Col>
                            </Row>
                            </View> 
                            <View style={styles.viewStyle}>
                            <Row>
                                <Col size={8} style={{justifyContent:'center'}}>
                                <Text style={{fontFamily:'OpenSans',fontSize:15}}>Cook and boil all the foods and meat before eating</Text>    
                                </Col>
                                <Col size={2}>
                                <Image square source={require('../../../../assets/images/corono/cook.png')} style={{ height: 70, width: 70 }} />
                                </Col>
                            </Row>
                            </View> 
                    </View>
                </Content>
            </Container>
        )
    }
}


export default CoronaPrecautions
const styles = StyleSheet.create({
mainHead:{
    fontFamily: 'OpenSans', 
    fontSize: 18, 
    fontWeight: '500', 
    marginTop: 10, 
    textAlign: 'center',
    color:'#7F49C3',
    lineHeight:25
},
viewStyle:{
    backgroundColor:'#fff',
    padding:5,
    marginTop:10,
    marginLeft:5,
    marginRight:5
},
innerText:{
    fontFamily:'OpenSans',
    fontSize:15,
    marginLeft:10
}

});
