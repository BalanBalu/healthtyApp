import React, { Component } from 'react';
import {
    Container, Content, Text, View, Badge, Spinner, Toast,Radio
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity, Share  } from 'react-native';
import { hasLoggedIn } from '../../providers/auth/auth.actions';
class CoronaDisease extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeId: 1,
            showResult: false,
            itemSelected: 'NO',
            coronoDiseaseData: [
                {
                    id: 1,
                    question: '1. Do you have Cold and Cough?',
                    image: require('../../../../assets/images/corono/Cough.png')
                },
                {
                    id: 2,
                    question: '2. Do you have Sneeze frequently?',
                    image: require('../../../../assets/images/corono/sneeze.png')
                },
                {
                    id: 3,
                    question: '3. Are you Suffering from Running Nose?',
                    image: require('../../../../assets/images/corono/runningnose.png')
                },
                {
                    id: 4,
                    question: '4. Do you feel Sore Throat?',
                    image: require('../../../../assets/images/corono/sorethroat.png')
                },
                {
                    id: 5,
                    question: '5. Do you feel So tired and Week?',
                    image: require('../../../../assets/images/corono/tired.png')
                },
                {
                    id: 6,
                    question: '6. Do you Have a Moderate Fever?',
                    image: require('../../../../assets/images/corono/Moderate.png')
                },
                {
                    id: 7,
                    question: '7. Do you suffer from exacerbated Asthuma?',
                    image: require('../../../../assets/images/corono/asthuma.png')
                }
            ],
            answers: []
        }
    }
    async componentDidMount() {
        const { navigation } = this.props;
        const isLoggedIn = await hasLoggedIn(this.props);
        if (!isLoggedIn) {
            Toast.show({
                text: 'Please Login and Test Your Corona Status',
                duration: 3000,
                type: 'success'
            })
            navigation.navigate('login');
            return
        } else {
            Toast.show({
                text: 'Test Your Corona(COVID-19) Status',
                duration: 3000,
                type: 'success'
            })
        }
    }

    setActiveQuestionId() {
        const { answers , itemSelected, activeId, coronoDiseaseData } = this.state;
        AsyncStorage.setItem('coronoTested', '1');
        if(coronoDiseaseData.length >= (activeId + 1) ) {
           
            answers.push(itemSelected);
            this.setState( { activeId : activeId + 1, answers : answers })
        } else {
            if(answers.filter(ele => ele === 'YES').length >= 2) {
                this.setState( { showResult : true, coronoTestStatusPositive: true })
            } else {
                this.setState( { showResult : true, coronoTestStatusPositive: false })
            }
        }
    }
    getActiveQuestionIdAndImage() {
        const { activeId , coronoDiseaseData } = this.state;
        const activeData = coronoDiseaseData.find(ele => Number(ele.id) === Number(activeId))
        return activeData;
    }

    onShare = async () => {
        try {
            const result = await Share.share({
              message:
                'Fever?, Dry Cough? Sore Throat?, I just completed a simple corono test. try an easy corono test online using medflic. Download now on https://play.google.com/store/apps/details?id=com.medflic'
            });
        } catch (error) {
          console.log(error.message);
        }
      };

    render() {
        const { question, image, id } = this.getActiveQuestionIdAndImage();
        return (
            <Container style={styles.container}>
                <Content style={{ backgroundColor: '#F5F5F5', padding: 10 }}>
                  
                  
                    <View>
                        <Text style={styles.mainHead}>Be Aware of <Text style={{ fontFamily: 'OpenSans', fontSize: 25, fontWeight: '700', color: '#7F49C3' }}>CORONA(COVID-19)</Text> </Text>
                        <Text style={styles.secondHead}>Please take up a simple test to prevent your health and surroundings </Text>
                      
                    </View>
                    {id <= this.state.coronoDiseaseData.length && this.state.showResult === false ? 
                     <View>
                     <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <Image square source={image} style={{ height: 250, width:"100%"  }} />
                     </View>
                    <View style={{ marginLeft: 15 }}>
                        <Text style={styles.quesText}>{question}</Text>
                        <View style={styles.viewStyle}>
                        
                            
                                <Col>
                                    <Row style={{alignItems:'center'}}>
                                    <Radio 
                                    standardStyle={true}
                                    selected={this.state.itemSelected === 'YES' ? true : false} 
                                    onPress={()=>   this.setState({ itemSelected: 'YES' })}  />
                                    <Text style={styles.yesText}>Yes</Text>
                                    </Row>
                                 <Row style={{alignItems:'center'}}>
                                   
                                    <Radio 
                                    standardStyle={true}
                                    selected={this.state.itemSelected === 'NO' ? true : false} 
                                    onPress={()=>   this.setState({ itemSelected: 'NO' })}  />
                                    <Text style={styles.noText}>No</Text>
                                    </Row>
                                    </Col>
                               
                           
                          
                           

                        </View>
                    
                        <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                            <TouchableOpacity onPress={()=> this.setActiveQuestionId() } style={styles.touchStyle}>
                                <Text style={styles.touchText}>Next</Text>
                            </TouchableOpacity>
                        </Row>
                    </View>
                    </View> : 
                     <View>
                       { this.state.coronoTestStatusPositive === true ?
                      <View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <Image square source={require('../../../../assets/images/corono/Positive.png')} style={{ height: 250, width:"100%"  }} />
                        </View>
                        <View style={{ marginLeft: 15 }}>
                            <Text style={styles.resText}>{ 'It Seems to be effective. Please consult your near by Doctors Immediatly'}</Text>
                        </View>
                        
                    </View>
                     : 
                     <View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <Image square source={require('../../../../assets/images/corono/negative.png')} style={{ height: 250, width:"100%" }} />
                        </View>
                        <View style={{ marginLeft: 15 }}>
                            <Text style={styles.resText}>{'No Need to Worry'}</Text>
                            <Text style={[styles.resText, { marginTop: 0 } ]}>{'You Are Perfectly Alright!'}</Text>
                        </View>
                       
                       </View> }

                       <View style={{ alignItems:'center', justifyContent:'center', marginTop: 20 }}>
                       <TouchableOpacity onPress={() => {
                           this.setState({ showResult: false, activeId: 1, answers: [] })
                           this.props.navigation.navigate('CORONA Status');
                       }} style={[styles.touchbuttonShare, { backgroundColor: 'green'} ]}>
                            <Text style={styles.touchTextShare}>Check Again</Text>
                          </TouchableOpacity>

                          <Row>
                          <TouchableOpacity style={styles.touchbuttonShare} onPress={this.onShare}>
                            <Text style={styles.touchTextShare}>Share</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={[styles.touchbuttonShare, { marginLeft: 10 }]} onPress={() => this.props.navigation.navigate('Home')}>
                            <Text style={styles.touchTextShare}>Home</Text>
                          </TouchableOpacity>
                          </Row>
                          
                        </View>
                    </View>
                   }
                  
                </Content>
            </Container>
        )
    }
}


export default CoronaDisease
const styles = StyleSheet.create({
mainHead:{
    fontFamily: 'OpenSans', 
    fontSize: 20, 
    fontWeight: '700', 
    marginTop: 10, 
    textAlign: 'center'
},
secondHead:{
    fontFamily: 'OpenSans', 
    fontSize: 18, 
    marginTop: 20, 
    textAlign: 'center', 
    color: '#909009'
},
quesText:{
    fontFamily: 'OpenSans', 
    fontSize: 16, 
    color: '#7F49C3',
},
resText:{
    marginTop: 20,
    fontFamily: 'OpenSans', 
    fontSize: 16,
    alignSelf: 'center',
    alignContent: 'center',
    color: '#7F49C3',
},
viewStyle:{
    flexDirection: 'row', 
    marginTop: 5, 
    marginLeft: -5
},
yesText:{
    fontFamily: 'OpenSans', 
    fontSize: 15, 
    color: '#ff4e42', 
    marginLeft: 10, 
},
noText:{
    fontFamily: 'OpenSans',
    fontSize: 15,
     color: '#909090', 
     marginLeft: 10, 
},
touchStyle:{
    backgroundColor: '#4E85E9', 
    borderRadius: 1, 
    paddingLeft: 50, 
    paddingRight: 50, 
    paddingBottom: 5,
     paddingTop: 5
},
touchText:{
    fontFamily: 'OpenSans', 
    fontSize: 12, 
    color: '#fff', 
    textAlign: 'center'
},
touchbuttonShare:{
    backgroundColor:'#7E49C3',
    borderRadius:20,
    paddingLeft:40,
    paddingRight:40,
    paddingTop:8,
    paddingBottom:8,
    marginTop:20
  },
  touchTextShare:{
    textAlign:'center',
    fontFamily:'OpenSans',
    fontSize:18,
    color:'#fff',
    fontWeight:'700'
  },
});
