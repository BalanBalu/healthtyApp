import React, { Component } from 'react';
import { Container, Content, View, Text, Item, Spinner, Radio, Row, Col, Form, Button } from 'native-base';
import { StyleSheet, TextInput, Image } from 'react-native'


class SuccessChatPaymentPage extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        const { navigation } = this.props;
        const manualNaviagationPage = navigation.getParam('manualNaviagationPage') || 'My Chats';

        setTimeout(() => {
           
            this.props.navigation.navigate(manualNaviagationPage, { fromSuccessPage: true });
        }, 1500);
    }

    render() {
        return (
            <Container>
                <Content>

                    <View style={{ height: 400, }}>

                        <Image
                            source={require('../../../../assets/animation/success1.gif')}
                            style={{ width: '100%', height: '100%', }} />
                    </View>
                </Content>
            </Container>
        )
    }
}

export default SuccessChatPaymentPage

const styles = StyleSheet.create({



})