import React, { Component } from 'react';
import { StyleSheet, FlatList, ImageBackground, } from 'react-native';
import { Container, Content, Text, Card } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import axios from 'axios';

class COVID19StateDistrictStats extends Component {
   
    constructor(props) {
        super(props)
        const { navigation } =this.props;
        const stateData = navigation.getParam('stateData') || [];
        this.state = {
            locations: [],
            isLoading: false,
            dailyStats : {},
            stateData
        }
     
    }
    async componentDidMount() {
        
    }
    render() {
        const { stateData} = this.state
        return (
            <Container style={{ flex : 1}}>
                <Content>
          
                    <Row style={{ marginTop: 10, marginBottom: 5 }}>
                        <Card style={{ borderRadius: 10, }}>
                                <Grid>
                                    <Row size={50} style={ styles.rowStyle }>
                                         <ImageBackground
                                                source={require('../../../../assets/images/corono/coronabg.png')}
                                                style={{
                                                    width: '100%', height: '100%',
                                                }}
                                          >
                                            <Text style={{  
                                                color: '#FFFFFF',
                                                fontSize: 18,
                                                fontWeight: '900',
                                                textAlign: 'left',
                                                lineHeight: 20,
                                                margin: 5
                                                }}> Corona Virus</Text>

                                                <Text style={{ 
                                                    ...styles.innerText, 
                                                    alignSelf: 'flex-start', 
                                                    marginTop: 60
                                                }}>Follow us for latest COVID-19 India Updates</Text>
                                            </ImageBackground>
                                    </Row>
                                    </Grid>
                            </Card>
                        
                        </Row>
                      
                                        <Text style={{ marginTop: 10, marginLeft: 10 } }> 
                                                COVID-19 - {stateData.stateName} 
                                        </Text>
                                       
                                         <FlatList
                                           // ListHeaderComponent={}
                                            keyExtractor={(item, index) => index.toString()}
                                            data={stateData.districtData}
                                            extraData={stateData}
                                            horizontal={false}
                                            renderItem={({ item, index }) => (
                                                this.renderStateWiseStats(item, stateData.stateCode, stateData.lastupdatedtime)
                                            )}/> 
                                          
                             
                                          </Content>   
                       
            </Container>
        )
    }
   renderStateWiseStats(dailyStats, stateCode, lastupdatedtime) {
    return (
        <Card style={{ borderRadius: 10, marginRight: 10 }}>
            <Text style={{ marginTop: 10, marginLeft: 10 } }> 
               {stateCode} - {dailyStats.districtName}
            </Text>
            <Grid style={{margin :10 }}>
                <Row size={24} style={{ height: 60, width: '100%', overflow: 'hidden', backgroundColor: "#fff", borderRadius: 10, }} >
                    <Col size={3}>
                        <Text style={styles.textHeader }> {dailyStats.active} </Text>
                        <Text style={styles.textLable }>  Active Cases </Text>
                    </Col>
                    <Col size={3}>
                        <Text style={styles.textHeader }> {dailyStats.confirmed}</Text>
                        <Text style={styles.textLable }> Total Confirmedd </Text>  
                    </Col>  
                    <Col size={3}>
                        <Text style={styles.textHeader }> {dailyStats.recovered} </Text>
                        <Text style={styles.textLable }> Total Recovered </Text>        
                    </Col>   
                    <Col size={3}>
                        <Text style={styles.textHeader }> {dailyStats.deceased}</Text>
                        <Text style={styles.textLable }> Total Deaths </Text>  
                    </Col> 
                    
                </Row>
                {dailyStats.delta ? 
                <Row size={24} style={{ height: 60, width: '100%', overflow: 'hidden', backgroundColor: "#fff", borderRadius: 10, }}>
                    <Col size={4}>
                        <Text style={styles.textHeader}> {dailyStats.delta.confirmed}</Text>
                        <Text style={ styles.textLable }> Total Confirmed Daily </Text>
                    </Col>   
                    
                    <Col size={4}>
                        <Text style={ styles.textHeader }> {dailyStats.delta.recovered}</Text>
                        <Text style={ styles.textLable }> Total Recovered Daily</Text>        
                    </Col>   
                     
                     <Col size={4}>
                        <Text style={ styles.textHeader  }> {dailyStats.delta.deceased} </Text>
                        <Text style={ styles.textLable }>  Total Deaths Daily</Text>  
                    </Col>
                </Row> : null}  
                
                <Row size={2} style={{ height: 60, width: '100%', overflow: 'hidden', backgroundColor: "#fff", borderRadius: 10, }}>
                    <Text style={styles.textLable }> Updated on {lastupdatedtime} </Text>           
                </Row> 
           </Grid>
        </Card>
        )
    }
}
const styles = StyleSheet.create({
    textHeader: { 
        marginBottom: 5,
        alignSelf: 'center', 
        marginLeft: 10, 
        lineHeight : 30 , 
        color:'#f50035' 
    },
    textLable : { 
        marginLeft: 10,
        alignSelf: 'center', 
        fontSize: 10 ,
        color:'#000000'
    },
    innerText: {
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'left',
        marginLeft: 15,
        lineHeight: 20,
        fontWeight: '500',
    },
    rowStyle: { 
        height: 120, 
        width: '100%', 
        overflow: 'hidden', 
        backgroundColor: "#fff", 
        borderRadius: 10, 
    }
});
export default COVID19StateDistrictStats

