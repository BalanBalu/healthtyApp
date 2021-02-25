import React, { Component } from 'react';
import { Container, Content, Form,Text,View ,} from 'native-base'
import { TextInput, TouchableOpacity,Modal } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import styles from './styles'
class ContactUs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
            descriptionVisible: false,
          
        }
    }
    popUpClose(){
        this.props.navigation.navigate('CorporateHome');
        this.setState({ descriptionVisible: false })
       
    }
    render() {
        return (

            <Container >
                <Content contentContainerStyle={{ padding: 15,}}>
                    <View>
                    <View style={{flex:1 }}>
                    <Text style={styles.HeadingText}>Feel free to contact us if you need help. </Text>
                    <View>
                        <Form>
                            <Text style={styles.subHeadingText}>Name</Text>
                            <TextInput placeholder="Enter Name" placeholderTextColor={"#909090"} style={styles.textInputStyle} />
                            <Text style={styles.subHeadingText}>Email</Text>
                            <TextInput placeholder="Enter Email" placeholderTextColor={"#909090"} style={styles.textInputStyle} />
                            <Text style={styles.subHeadingText}>Message</Text>
                            <TextInput placeholder="Enter Message" textAlignVertical={'top'} placeholderTextColor={"#909090"} style={styles.messageTextInputStyle} />

                            <TouchableOpacity style={styles.submitButton} onPress={()=> this.setState({ descriptionVisible: true})}>
                                <Text style={{ fontSize: 15, fontWeight: 'OpenSans',fontWeight:'bold',color:'#fff'}}>Submit</Text>
                            </TouchableOpacity>
                        </Form>
                    </View>
                    </View>
                    <Modal
                        visible={this.state.descriptionVisible}
                        transparent={true}
                        animationType={'fade'}
                    >
                        <View style={styles.modalFirstView}>
                            <View style={styles.modalSecondView}>
                                <Row style={{justifyContent:'flex-end',alignItems:'flex-end',marginTop:-30}}>
                                    <MaterialIcons name="close" style={{fontSize:30,color:'red'}}/>
                                </Row>
                                <Row style={{justifyContent:'center',alignItems:'center'}}>
                                    <Text style={styles.modalHeading}>Thank you for updating your {'\n'} contact details</Text>
                                </Row>
                                <Row style={{justifyContent:'center',alignItems:'center',marginTop:20}}>
                                  <Col>
                                    <Text style={styles.modalSubText}>We will be back soon to your email :</Text>
                                    <Text style={styles.emailSubText}>@mysmarthealth.info@gmail.com</Text>
                                    </Col>
                                </Row>
                                

                                <Row style={{ marginTop: 15, justifyContent: 'flex-end', marginBottom: 5 }}>
                                   
                                            <Col size={10}>
                                                <TouchableOpacity danger style={styles.backToHomeButton} onPress={() => this.popUpClose()} testID='cancelButton'>
                                                    <Text style={styles.backToHomeButtonText}> {'Back to Home'}</Text>
                                                </TouchableOpacity>
                                            </Col>
                                           
                                     

                    
                                </Row>
                            </View>

                        </View>
                    </Modal>
                    </View>
                </Content>
            </Container>


        );
    }
}

export default ContactUs;