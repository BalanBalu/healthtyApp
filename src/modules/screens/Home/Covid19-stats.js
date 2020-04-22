import React, { Component } from 'react';
import { StyleSheet, FlatList, ImageBackground, } from 'react-native';
import { Container, Content, Text, Card } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import axios from 'axios';

class COVID19Stats extends Component {
   
    constructor(props) {
        super(props)
        this.state = {
            locations: [],
            isLoading: false,
            dailyStats : {},
            statwise: []
        }
    }
    async componentDidMount() {
        let fullPath = `https://api.covid19india.org/data.json`;
        let resp = await axios.get(fullPath, {
            headers: {
                'Content-Type': null,
                'x-access-token': null,
                'userId': null
            }
        });
        if(resp.data) {
            if(resp.data.cases_time_series) {
                const dailyStats = resp.data.cases_time_series[resp.data.cases_time_series.length - 1];
                this.setState({ dailyStats: dailyStats, statwise: resp.data.statewise });
            }   
        }
    }
    render() {
        const { dailyStats, statwise } = this.state
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
                                        <Text style={{ marginTop: 10, marginLeft: 10 } }> 
                                                COVID-19 - INDIA
                                        </Text>
                                            {this.renderStats(dailyStats)}
                                </Grid>
                            </Card>
                        
                        </Row>
                                                
                        <Text style={{ marginBottom: 10 } }> 
                                State Wise 
                            </Text>
                        <FlatList
                            keyExtractor={(item, index) => item.statecode }
                            data={statwise}
                            extraData={statwise}
                            horizontal={true}
                            renderItem={({ item, index }) => (
                                this.renderStateWiseStats(item)
                        )}/> 
                </Content>
            </Container>
        )
    }
    renderStats(dailyStats) {
        return (
            <Grid>
                <Row size={24} style={{ height: 60, width: '100%', overflow: 'hidden', backgroundColor: "#fff", borderRadius: 10, }} >
                    <Col size={4}>
                        <Text style={styles.textHeader }> {dailyStats.totalconfirmed} </Text>
                        <Text style={styles.textLable }>  Total Confirmed </Text>
                    </Col>   
                    
                    <Col size={4}>
                        <Text style={styles.textHeader }> {dailyStats.totalrecovered} </Text>
                        <Text style={styles.textLable }> Total Recovered </Text>        
                    </Col>   
                    <Col size={4}>
                        <Text style={styles.textHeader }> {dailyStats.totaldeceased}</Text>
                        <Text style={styles.textLable }> Total Deaths </Text>  
                    </Col>  
                </Row>
                
                <Row size={24} style={{ height: 60, width: '100%', overflow: 'hidden', backgroundColor: "#fff", borderRadius: 10, }}>
                    <Col size={4}>
                        <Text style={styles.textHeader}> {dailyStats.dailyconfirmed}</Text>
                        <Text style={ styles.textLable }> Total Confirmed Daily </Text>
                    </Col>   
                    
                    <Col size={4}>
                        <Text style={ styles.textHeader }> {dailyStats.dailyrecovered}</Text>
                        <Text style={ styles.textLable }> Total Recovered Daily</Text>        
                    </Col>   
                     
                     <Col size={4}>
                            <Text style={ styles.textHeader  }> {dailyStats.dailydeceased} </Text>
                            <Text style={ styles.textLable }>  Total Deaths Daily</Text>  
                    </Col>
                </Row>  
                
                <Row size={2} style={{ height: 60, width: '100%', overflow: 'hidden', backgroundColor: "#fff", borderRadius: 10, }}>
                    <Text style={styles.textLable }> Updated on {dailyStats.date} </Text>           
                </Row> 
            </Grid>
        )
    }
    
  renderStateWiseStats(dailyStats) {
    return (
        <Card style={{ borderRadius: 10, marginRight: 10 }}>
            <Text style={{ marginTop: 10, marginLeft: 10 } }> 
                COVID-19 - {dailyStats.state}
            </Text>
            <Grid style={{margin :10 }}>
                <Row size={24} style={{ height: 60, width: '100%', overflow: 'hidden', backgroundColor: "#fff", borderRadius: 10, }} >
                    <Col size={3}>
                        <Text style={styles.textHeader }> {dailyStats.active} </Text>
                        <Text style={styles.textLable }>  Active Cases </Text>
                    </Col>   
                    <Col size={3}>
                        <Text style={styles.textHeader }> {dailyStats.confirmed}</Text>
                        <Text style={styles.textLable }> Total Confirmed </Text>  
                    </Col>  
                    <Col size={3}>
                        <Text style={styles.textHeader }> {dailyStats.recovered} </Text>
                        <Text style={styles.textLable }> Total Recovered </Text>        
                    </Col>   
                    <Col size={3}>
                        <Text style={styles.textHeader }> {dailyStats.deaths}</Text>
                        <Text style={styles.textLable }> Total Deaths </Text>  
                    </Col> 
                    
                </Row>
                
                <Row size={24} style={{ height: 60, width: '100%', overflow: 'hidden', backgroundColor: "#fff", borderRadius: 10, }}>
                    <Col size={4}>
                        <Text style={styles.textHeader}> {dailyStats.deltaconfirmed}</Text>
                        <Text style={ styles.textLable }> Total Confirmed Daily </Text>
                    </Col>   
                    
                    <Col size={4}>
                        <Text style={ styles.textHeader }> {dailyStats.deltarecovered}</Text>
                        <Text style={ styles.textLable }> Total Recovered Daily</Text>        
                    </Col>   
                     
                     <Col size={4}>
                        <Text style={ styles.textHeader  }> {dailyStats.deltadeaths} </Text>
                        <Text style={ styles.textLable }>  Total Deaths Daily</Text>  
                    </Col>
                </Row>  
                
                <Row size={2} style={{ height: 60, width: '100%', overflow: 'hidden', backgroundColor: "#fff", borderRadius: 10, }}>
                    <Text style={styles.textLable }> Updated on {dailyStats.lastupdatedtime} </Text>           
                </Row> 
           </Grid>
        </Card>
        )
    }
}
const styles = StyleSheet.create({
    textHeader: { 
            marginTop: 10, 
            alignSelf:
            'center', 
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
export default COVID19Stats

