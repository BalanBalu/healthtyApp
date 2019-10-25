import React, { Component } from 'react';
import { Container, Content, View,Card,Grid,CardItem, Text,Switch,Right, Item, Spinner, Radio,Row,Col,Form,Button, Left } from 'native-base';
import {StyleSheet,TextInput} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import CalendarStrip from 'react-native-calendar-strip';


class Remainders extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
    }


    render() {
const Reaminder=[{medname:'Acentaminophen',content:'10 mg',count:'1 pill(s)',time:'7:00 AM',remtime:'* Your Remainder Time is at 7:00 AM, Oct 24'},
{medname:'Acentaminophen',content:'10 mg',count:'1 pill(s)',time:'10:00 AM',remtime:'* Your Remainder Time is at 10:00 AM, Oct 24'},
{medname:'Acentaminophen',content:'10 mg',count:'1 pill(s)',time:'1:00 PM',remtime:'* Your Remainder Time is at 1:00 PM, Oct 24'},
{medname:'Acentaminophen',content:'10 mg',count:'1 pill(s)',time:'4:00 PM',remtime:'* Your Remainder Time is at 4:00 PM, Oct 24'},
{medname:'Acentaminophen',content:'10 mg',count:'1 pill(s)',time:'9:00 PM',remtime:'* Your Remainder Time is at 9:00 PM, Oct 24'}]
        return (
            <Container>
              <Content>
                <CalendarStrip
                   calendarAnimation={{ type: 'sequence', duration: 30 }}
                   selection={'border'}
                   selectionAnimation={{ duration: 300, borderWidth: 1 }}
                   style={{ paddingTop: 2, paddingBottom: 2 }}
                   calendarHeaderStyle={{ color: 'gray' }}
                   calendarColor={'#F1F1F1'}
                   highlightColor={'#2BCA2F'}
                   dateNumberStyle={{ color: 'gray' }}
                   dateNameStyle={{ color: 'gray' }}
                    highlightDateNumberStyle={{ color: 'yellow', backgroundColor: '#2BCA2F', borderRadius: 15, padding: 5, height: 30, width: 30, fontSize: 12 }}
                    highlightDateNameStyle={{ color: '#2BCA2F' }}
                    borderHighlightColor={'white'}
                    iconContainer={{ flex: 0.1 }}
                   /> 
                  <View style={{marginLeft:30,marginRight:30}}>
                    <FlatList data={Reaminder}
                    renderItem={({item})=>
                    <Card style={{borderRadius:5,marginTop:10}}>
                     <Grid>
                      <Row style={{marginTop:5}}>
                       <Col style={styles.col1}>
                        <View style={{marginLeft:15}}>
                          <Text style={styles.mednamestyle}>{item.medname}</Text>
                          <Text  style={styles.innerText}>{item.content}</Text>
                          <Text  style={styles.innerText}>{item.count}</Text>
                          </View> 
                       </Col>
                       <Col style={styles.col2}>
                         <Row>
                          <Left>
                          <Text style={styles.timestyle}>{item.time}</Text>
                            </Left> 
                           <Right>
                           <Switch value={true} />
                           </Right>
                           </Row>
                       </Col>
                      </Row>
                     </Grid>
                    <View style={{marginTop:5,borderTopColor:'gray',borderTopWidth:1,}}> 
                      <Text style={styles.remText}>{item.remtime}</Text>
                    </View>
                 </Card>
                    }/>
                </View>
              </Content>
          </Container>
        )
    }
}

export default Remainders

const styles = StyleSheet.create({

col1:{
  borderRightColor:'gray',
  borderRightWidth:1,
  width:'50%',
  
  
  

},
col2:{
  width:'50%',
  justifyContent:'center',
},
mednamestyle:{
  fontFamily:'OpenSans',
  fontSize:15,
  fontWeight:'bold',
},
innerText:{
  fontFamily:'OpenSans',
  fontSize:13,
  color:'#7d7d7d'
},
timestyle:{
  fontFamily:'OpenSans',
  fontSize:15,
  marginLeft:10,
  fontWeight:'bold'
},
remText:{
  textAlign:'center',
  paddingBottom:5,
  paddingTop:5,
  fontFamily:'OpenSans',
  fontSize:14,color:'green'
}
})