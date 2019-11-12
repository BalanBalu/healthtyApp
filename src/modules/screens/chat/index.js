import React, { Component } from 'react';
import { Container, Content, View, Text, Item,Left,Right,Input,Spinner,Segment, Radio,Row,Col,Form,Button,Icon } from 'native-base';
import {StyleSheet,TextInput} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
 import PreviousChat from './PreviousChat';
// import AvailableDoctor from './AvailableDoctor';



class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
    }


    render() {
        return (
            <Container>
            <Content>
                <View style={{backgroundColor: '#7E49C3',}}>
                    <Row style={{marginTop:10}}>
                    <Left>
                    <Text style={{color:'#FFF',fontFamily:'OpenSans',fontSize:20,fontWeight:'bold',marginLeft:20}}>Medflic</Text>
                    </Left>
                    <Right>
                    <Icon name="md-more" style={{ color: '#fff', marginRight: 15, fontFamily: 'opensans-semibold' }}></Icon>
                    </Right>
                    </Row>
                    <View style={{marginTop:20}}>
                    <Text style={{color:'#FFF',fontFamily:'OpenSans',fontSize:14,fontWeight:'bold',marginLeft:20}}>Search for Doctors</Text>

                    <Row style={{ backgroundColor: 'white', borderColor: '#000', borderRadius: 20,height:30,marginRight:20,marginLeft:20,marginTop:10 }}>
                    
                      <Col size={9.1} style={{justifyContent:'center',}}> 
                        <Input 
                            placeholder="Search for Symptoms,Categories,etc"
                            style={{ color: 'gray', fontFamily: 'OpenSans', fontSize: 10, padding:5,paddingLeft:10 }}
                            placeholderTextColor="gray"
                            keyboardType={'email-address'}
                            underlineColorAndroid="transparent"
                            blurOnSubmit={false}
                          
                        />
                        </Col>
                        <Col size={0.9} style={{justifyContent:'center',borderRightRadius:10}}> 
                        <View style={{backgroundColor:'#7E49C3',width:'85%',alignItems:'center',borderTopRightRadius:20,borderBottomRightRadius:20,marginTop: 2, marginBottom: 2,}}>
                        <Icon name="ios-search" style={{ color: '#fff', fontSize:20,padding:2}} />

                        </View>
                    </Col>
                        </Row>

                       <Row style={{marginTop:10}}>
					<Button style={styles.segButtonActive1} >
						<Text style={styles.segText}>Available Doctors</Text>
					</Button>

					<Button style={styles.segButtonActive } >
						<Text style={styles.segText}>Previous Chats</Text>
					</Button>
                    </Row>
                    <View>
                        <PreviousChat/> 
                        {/* <AvailableDoctor/> */}
                    </View>
                    </View>
                    
                </View>
            </Content>
            </Container>
        )
    }
}

export default Chat

const styles = StyleSheet.create({
    segButtonActive: {
		justifyContent: 'center',
        borderBottomColor: '#fff',
        backgroundColor:'#7E49C3',
		borderBottomWidth: 2,
		paddingBottom: -10,
		paddingTop: -10,
		padding: 30

    },
    segButtonActive1: {
		justifyContent: 'center',
        backgroundColor:'#7E49C3',
        borderBottomWidth: 2,
        borderBottomColor: '#7E49C3',
		paddingBottom: -10,
		paddingTop: -10,
		padding: 30

    },
    segText: {
		textAlign: 'center',
		fontFamily: 'OpenSans',
		fontSize: 16,
		color: '#fff',

	},

})