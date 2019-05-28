import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem,Spinner, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab } from 'native-base';
import { login ,logout } from '../../providers/auth/auth.actions';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, } from 'react-native';

import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { catagries } from '../../providers/catagries/catagries.actions';


class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:[],
            isLoading:false,
            catagary:[],
            searchValue: null           
         };
        this.getCatagries();
    }
     navigetToCategories() {
        this.props.navigation.navigate('Categories',{data:this.state.data})
    }
    
    doLogout() {
        logout();
        this.props.navigation.navigate('login');
    }
   
    getCatagries = async () => {
        try {
          let result = await catagries();
         
       
         // if(result.success) 
            // setTimeout( ()=>{
                this.setState({ data: result.data, isLoading: true })
            let limitedData=[];
          //  var limtedNumber
            for(let limtedNumber=0;limtedNumber<4;limtedNumber++){
                limitedData.push(result.data[limtedNumber]);
            }
            this.setState({catagary:limitedData });
            console.log('state output is:')
            console.log(this.state.data);
            // },3000)
        } catch (e) {
          console.log(e);
        }  
      }

      searchDoctorListModule = async () => {
        try {
            let serachInputvalues = [{
                type: 'language',
                value: [ this.state.searchValue ]
            }]
            if (this.state.searchValue == '') {
                alert("We can't Find the Empty Values");
            }
            else {
                this.props.navigation.navigate('Doctor List', { resultData: serachInputvalues })
            }
        } catch (e) {
            console.log(e);
        }
    }

      
    render() {
        
        return (
            
            <Container style={styles.container}>
       
       
     
              

                   
             
               
<Content style={styles.bodyContent}>     
<Row style={{ backgroundColor: 'white' }}>

<Col style={{width: '87%'}}>
    <Input placeholder="Search Symptoms/Services"
        style={{ color: 'gray', fontFamily: 'OpenSans', fontSize: 12 }}
        placeholderTextColor="gray"
        value={this.state.searchValue}
        keyboardType={'email-address'}
        onChangeText={searchValue => this.setState({ searchValue })}
    />

</Col>
<Col style={{width: '13%'}}>

    <Button Button transparent onPress={() => this.searchDoctorListModule()}>
        <Icon name="ios-search" style={{ color: 'gray' }} />
    </Button>

</Col>
</Row>
                    <Card style={{ padding: 10, borderRadius: 10 }}>

                        <Grid>
                            <Row>
                                <Left  >

                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 17 }}>Categories</Text>
                                </Left>
                                <Body >

                                </Body>
                                <Right>


                                    <Text style={styles.titleText} onPress={() => this.navigetToCategories()}>View All</Text>


                                </Right>



                            </Row>

                            <Row>

                                <ListItem noBorder>
                                    <ScrollView horizontal={false}>
                                    <FlatList 
                                        horizontal={true} 
                                        data={this.state.catagary}
                                        extraData={this.state}
                                        renderItem = {({item, index}) =>
                                        <Item  style={styles.column} onPress={() => this.props.navigation.navigate('Doctor List') }>
                                        <Col  >
                                            <LinearGradient 
                                                colors={['#7357A2', '#62BFE4']} style={{ borderRadius: 10, padding: 5, height:100, width: 100, marginLeft: 'auto', marginRight: 'auto' }}>
                                                <Image source={{ uri: item.imageBaseURL + '/' + item.category_id + '.png' }} style={styles.customImage} />
                                            </LinearGradient>

                                            <Text style={styles.textcenter}>{item.category_name}</Text>
                                            {/*<Text note style={{ textAlign: 'center' }}>100 Doctors</Text>*/}
                                        </Col>
                                        </Item>
                                        }
                                  
                             keyExtractor={(item, index) => index.toString()}
                                    />

                        
                            </ScrollView></ListItem>

                            </Row>

                        </Grid>

                    </Card>

                    <Card style={{ backgroundColor: '#CDEEFF', padding: 10, borderRadius: 10 }}
                    >
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 17 }}>You Can save A Life</Text>
                        <Button onPress={() => this.doLogout()} block style={{ margin: 10, borderRadius: 20, backgroundColor: '#74579E' }}>
                            <Text>REPORT ASSIDENT NOW</Text>
                        </Button>

                        <Text style={{ textAlign: 'right', fontSize: 14, fontFamily: 'OpenSans', color: '#000' }}>5002 Fast Growing Ambulance</Text>

                    </Card>


                    <LinearGradient
                        colors={['#7E49C3', '#C86DD7']}
                        style={{ borderRadius: 10, padding: 10, borderBottomWidth: 0, fontFamily: 'OpenSans', marginTop: 5 }} >
                        <Grid style={{ padding: 10 }}>
                            <Col style={{ width: '75%' }}>
                                <Text style={{ fontFamily: 'OpenSans', color: 'white', fontSize: 17 }}>Video Consultation</Text>
                                <Text note style={{ color: 'white', fontFamily: 'OpenSans', marginTop: 'auto', marginBottom: 'auto' }}>Have A Video Visit With A Certified HealthCare - Doctors</Text>

                            </Col>

                            <Col style={{ width: '25%' }}>
                                <Image source={{ uri: 'https://odoc.life/wp-content/uploads/2018/06/oDoc-Video-Call-iPhone-X.png' }} style={{ height: 150, width: 100, borderColor: '#fff', borderWidth: 2, borderRadius: 10 }} />
                            </Col>
                        </Grid>


                    </LinearGradient>


                    <LinearGradient
                        colors={['#F58949', '#E0C084']}
                        style={{ borderRadius: 10, padding: 10, borderBottomWidth: 0, fontFamily: 'OpenSans', marginTop: 10, marginBottom: 10 }} >
                        <Grid>
                            <Row>
                                <Col style={{ width: '75%' }}>
                                    <Text style={{ fontFamily: 'OpenSans', color: 'white', marginTop: 10, fontSize: 17 }}>Online Pharmacy Services</Text>
                                </Col>
                                <Col style={{ width: '25%' }}>
                                    <Text style={styles.offerText}>25% offers</Text>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Text note style={{ fontFamily: 'OpenSans', color: 'white', marginTop: 15 }}>Medflick Pharmacy Offers You Online Convenience For Ordering, Monitoring And Receiving Prescription For You And Your Family.</Text>
                                </Col>
                            </Row>
                        </Grid>

                        <Grid style={{ padding: 10 }}>
                            <Col style={{ width: '33.33%' }}>
                                <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.pharmImage} />

                                <Text style={styles.offerText}>Geriatrics</Text>

                            </Col>
                            <Col style={{ width: '33.33%' }}>
                                <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.pharmImage} />

                                <Text style={styles.offerText}>Geriatrics</Text>
                            </Col>
                            <Col style={{ width: '33.33%' }}>
                                <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.pharmImage} />

                                <Text style={styles.offerText}>Geriatrics</Text>
                            </Col>
                        </Grid>

                    </LinearGradient>


                </Content>
       
                {/* <Footer>
                    <FooterTab style={{ backgroundColor: '#7E49C3' }}>
                        <Button >
                            <Icon name="apps" />
                        </Button>
                        <Button>
                            <Icon name="chatbubbles" />
                        </Button>
                        <Button >
                            <Icon active name="notifications" />
                        </Button>
                        <Button>
                            <Icon name="person" />
                        </Button>
                    </FooterTab>
                </Footer>*/}
            </Container>

        )
    }

}

function homeState(state) {

    return {
        user: state.user
    }
}
export default connect(homeState)(Home)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 5
    },
    textcenter: {
        fontSize: 14,
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'OpenSans'
    },

    column:
    { 
        width: 'auto',
        borderRadius: 10,
        margin: 5,
        padding: 5,
        paddingBottom: 20

    },

    columns:
    {
        width: '33.33%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 10,
        margin: 5,
        padding: 5,
        paddingBottom: 25,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 5

    },

    customImage: {
        height: 70,
        width: 70,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },


    pharmImage: {
        height: 50,
        width: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        // borderColor: '#fff',
        // borderWidth: 2,
        // borderRadius: 10,
        //padding:30


    },
    titleText: {
        fontSize: 15,
        padding: 5,
        backgroundColor: '#FF9500',
        borderRadius: 20,
        color: 'white',
        width: "95%",
        textAlign: 'center',
        fontFamily: 'OpenSans',

    },

    offerText: {
        fontSize: 12,
        padding: 5,
        backgroundColor: 'gray',
        borderRadius: 20,
        color: 'white',
        width: "93%",
        textAlign: 'center',
        fontFamily: 'OpenSans',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    }

});