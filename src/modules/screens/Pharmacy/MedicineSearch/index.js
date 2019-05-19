import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, } from 'react-native';

class MedicineSearch extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
    }
    navigetToCategories() {
        console.log(this.props.navigation.navigate('categories'));
        //this.props.navigation.navigate('categories');
    }
   
    render() {


        return (

            <Container style={styles.container}>

                {/* <Header style={{ backgroundColor: '#745DA6' }}>
                    <Left  >
                        <Button Button transparent onPress={() => this.props.navigation.navigate('home')}>
                            <Icon name="medkit" style={{ color: '#fff', fontSize: 35 }}></Icon>

                        </Button>
                    </Left>
                    <Body>
                        <Item style={{ width: '150%', borderBottomWidth: 0, backgroundColor: '#fff', borderRadius: 10, height: 35 }} >

                            <Input placeholder="Chennai,Tamilnadu,India" style={{ color: 'gray', fontFamily: 'OpenSans', fontSize: 12 }} placeholderTextColor="gray" />
                            <Icon name="ios-search" style={{ color: 'gray' }} />
                        </Item>

                    </Body>
                    <Right >

                        <Button transparent onPress={() => this.props.navigation.navigate('Profile')}>
                            <Thumbnail style={{ height: 40, width: 40, borderColor: '#f5f5f5', borderWidth: 2, borderRadius: 50 }} source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} />
                        </Button>

                    </Right>
                </Header> */}



                <Content >

                    <Grid style={styles.curvedGrid}>

                    </Grid>

                    <Grid style={{ marginTop: -150, height: 100 }}>
                        <Row>
                            <Col style={{ width: '10%' }}>
                            </Col>
                            <Col style={{ width: '80%' }}>
                                <Item style={styles.searchBox} >

                                    <Input placeholder="Search For Any Medicine" style={{ color: 'gray', fontFamily: 'OpenSans', fontSize: 12 }} placeholderTextColor="gray" />
                                    <Button style={{ backgroundColor: '#000', borderRadius: 10, height: 40, marginTop: -20, marginRight: -20, borderBottomLeftRadius: 0, borderTopLeftRadius: 0, }}><Icon name="ios-search" style={{ color: 'white' }} /></Button>
                                </Item>
                            </Col>
                            <Col style={{ width: '10%' }}>
                            </Col>

                        </Row>

                    </Grid>
                    <Card transparent style={{ padding: 10, marginTop: 60 }}>
                        <Grid style={{ marginTop: 10, padding: 10 }}>
                            <Col style={styles.customColumn}>

                                <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />

                                <Text style={styles.pageText}>Rx Ready</Text>

                            </Col>

                            <Col style={styles.customColumn}>

                                <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />

                                <Text style={styles.pageText}>Rx Ready</Text>

                            </Col>

                        </Grid>


                        <Grid style={{ padding: 10, marginTop: -10 }}>
                            <Col style={styles.customColumn}>

                                <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />

                                <Text style={styles.pageText}>Rx Ready</Text>

                            </Col>

                            <Col style={styles.customColumn}>

                                <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />

                                <Text style={styles.pageText}>Rx Ready</Text>

                            </Col>

                        </Grid></Card>
                </Content>
                <Footer>
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
                </Footer>
            </Container>

        )
    }

}

function homeState(state) {

    return {
        user: state.user
    }
}
export default connect(homeState)(MedicineSearch)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 5
    },
    customImage: {
        height: 70,
        width: 70,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },

    curvedGrid:
    {
        borderRadius: 800,
        width: '200%',
        height: 800,
        marginLeft: -200,
        marginTop: -600,
        position: 'relative',
        bottom: 0,
        overflow: 'hidden',
        backgroundColor: '#745DA6'

    },
    searchBox:
    {
        width: '100%',
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 35,
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
        padding: 20
    },
    customColumn:
    {
        padding: 10,
        paddingTop: 30,
        paddingBottom: 30,
        borderRadius: 10,
        borderColor: '#D92B4B',
        borderWidth: 1,
        margin: 5
    },
    pageText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: 'green',
        textAlign: 'center',
        fontWeight: "bold"
    }


});