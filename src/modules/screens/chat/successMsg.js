import React, { Component } from 'react';
import { Container, Content, View, Text, Item, Spinner, Radio,Row,Col,Form,Button } from 'native-base';
import {StyleSheet,TextInput,Image} from 'react-native'


class successMsg extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
    }

    render() {
        return (
            <Container>
            <Content>
             
             <View style={{height:400,}}>
            
<Image
source={require('../../../../assets/animation/success1.gif')}
style={{width:'100%',height:'100%',}}/>
             </View>
    </Content>
</Container>
        )
    }
}

export default successMsg

const styles = StyleSheet.create({

 

})