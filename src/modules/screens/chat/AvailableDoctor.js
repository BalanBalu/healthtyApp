import React, { Component } from 'react';
import { Container, Content, View, Text, Item, Spinner,Thumbnail, Radio,Row,Col,Form,Button } from 'native-base';
import {StyleSheet,TextInput} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';


class AvailableDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
    }


    render() {
        let Details = [{Drname:'Dr.Mukesh Kannan',status:'Get well soon',msg:'Message',Rs:20},
        {Drname:'Dr.Pradeep Nataraj',status:'Be healthy',msg:'Message',Rs:20},
        {Drname:'Dr.Bhuvaneswari',status:'Have a nice day',msg:'Message',Rs:20},
        {Drname:'Dr.Bala Subramanian',status:'Be happy',msg:'Message',Rs:20},
        {Drname:'Dr.Ajay kumar',status:'Hello',msg:'Message',Rs:20}]
        return (
            <Container>
            <Content >
            <FlatList 
data={Details}
renderItem={({item})=>
            <Row style={{borderBottomColor:'gray',borderBottomWidth:0.5,marginLeft:10,marginRight:10,paddingTop:10,paddingBottom:10}}>
                  <Col style={{width:'15%'}}>
                     <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{width:50,height:50,position:'relative'}}/>
                     <View style={styles.circle} />
                      </Col>
                      <Col style={{width:'85%',marginTop:5,marginLeft:15}}>
                   <Row>
                   <Col style={{width:'75%'}}>
                        <Text style={styles.docname}>{item.Drname} </Text>
                        </Col>
                        <Col style={{width:'25%',alignItems:'center'}}>
                        <Text style={styles.msgStyle}>{'\u20B9'}{item.Rs}</Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{width:'75%',}}>
                        <Text style={styles.status}>{item.status} </Text>
                        </Col>
                        <Col style={{width:'25%',alignItems:'center'}}>
                        <Text style={styles.msgStyle}>{item.msg}</Text>
                        </Col>
                    
                 
                    </Row>
                      </Col>
                      
                   </Row>
}/>
            </Content>
            </Container>
        )
    }
}

export default AvailableDoctor

const styles = StyleSheet.create({

    docname:{
        fontFamily:'OpenSans',
        fontSize:14,
        fontWeight:'bold'
    },
    date:{
        fontFamily:'OpenSans',
        fontSize:12,
        color:'gray',
        marginLeft:15,
        marginTop:3
    },
    status:{
        fontFamily:'OpenSans',
        fontSize:14,
        color:'gray'
    },
    msg:{
        fontFamily:'OpenSans',
        fontSize:14,
        color:'#fff',
        borderRadius:50,
        backgroundColor:'blue',
        width:'35%',
        textAlign:'center'
    },
    msgStyle:{
        fontFamily:'OpenSans',
        fontSize:12,
        color:'blue',
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: 10/2,
        backgroundColor: 'green',
        position:'absolute',
        marginLeft:40,
        marginTop:5
    }

})