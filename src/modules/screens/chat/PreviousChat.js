import React, { Component } from 'react';
import { Container, Content, View, Text, Item, Spinner,Thumbnail, Radio,Row,Col,Form,Button } from 'native-base';
import {StyleSheet,TextInput} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';


class PreviousChat extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
    }


    render() {
        let Details = [{Drname:'Dr.Mukesh Kannan',date:'10m',status:'Get well soon',msg:12,},
        {Drname:'Dr.Pradeep Nataraj',date:'2h',status:'Be healthy',msg:1,},
        {Drname:'Dr.Bhuvaneswari',date:'1w',status:'Have a nice day',msg:9,},
        {Drname:'Dr.Bala Subramanian',date:'10m',status:'Be happy',msg:3,},
        {Drname:'Dr.Ajay kumar',date:'10h',status:'Hello',msg:6,}]
        return (
            <Container>
            <Content>
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
                    <Text style={styles.docname}>{item.Drname}</Text>
                    <Text style={styles.date}>{item.date}</Text>
                    </Row>
                    <Row>
                        <Col style={{width:'80%'}}>
                        <Text style={styles.status}>{item.status} </Text>
                        </Col>
                        <Col style={{width:'20%'}}>
                        <Text style={styles.msg}>{item.msg}</Text>
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

export default PreviousChat

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
    borderRadius:30,
    backgroundColor:'#7E49C3',
    width:'35%',
    textAlign:'center'
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