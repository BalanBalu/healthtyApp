import React, { Component } from 'react';
import { Container, Content, Form,Text,View } from 'native-base'
import { TextInput, TouchableOpacity } from 'react-native';
class ContactUs extends Component {
    render() {
        return (

            <Container >
                <Content contentContainerStyle={{ padding: 15,}}>
                    <View style={{flex:1 }}>
                    <Text style={{ marginTop: 10, color: '#128283', fontWeight: 'bold', fontSize: 18 }}>Feel free to contact us if you need help. </Text>
                    <View>
                        <Form>
                            <Text style={{ fontSize: 15, fontWeight: 'OpenSans', marginTop: 20 }}>Name</Text>
                            <TextInput placeholder="Enter Name" placeholderTextColor={"#909090"} style={{ borderColor: '#909090', borderWidth: 1, height: 35, marginTop: 5,borderRadius:5 }} />
                            <Text style={{ fontSize: 15, fontWeight: 'OpenSans', marginTop: 20 }}>Email</Text>
                            <TextInput placeholder="Enter Email" placeholderTextColor={"#909090"} style={{ borderColor: '#909090', borderWidth: 1, height: 35, marginTop: 5,borderRadius:5 }} />
                            <Text style={{ fontSize: 15, fontWeight: 'OpenSans', marginTop: 20 }}>Message</Text>
                            <TextInput placeholder="Enter Message" textAlignVertical={'top'} placeholderTextColor={"#909090"} style={{ borderColor: '#909090', borderWidth: 1, height: 200, marginTop: 5,borderRadius:5 }} />

                            <TouchableOpacity style={{justifyContent:'center',alignItems:'center',paddingHorizontal:20,paddingVertical:10,backgroundColor:'#128283',marginTop:30,borderRadius:20,height:40}}>
                                <Text style={{ fontSize: 15, fontWeight: 'OpenSans',fontWeight:'bold',color:'#fff'}}>Submit</Text>
                            </TouchableOpacity>
                        </Form>
                    </View>
                    </View>
                </Content>
            </Container>


        );
    }
}

export default ContactUs;