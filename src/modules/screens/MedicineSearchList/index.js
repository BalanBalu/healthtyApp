import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab } from 'native-base';
import { login, logout } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

class MedicineSearchList extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
    }
    navigetToCategories() {
        console.log(this.props.navigation.navigate('categories'));
        //this.props.navigation.navigate('categories');
    }
    doLogout() {
        logout();
        this.props.navigation.navigate('login');
    }
    render() {


        return (

            <Container style={styles.container}>


                <Content>

                    <Grid style={styles.curvedGrid}>

                    </Grid>

                    <Grid style={{ marginTop: -180, height: 150 }}>
                        <Row>
                            <Col style={{ width: '10%', marginTop: 'auto', marginBottom: 'auto', alignItems: 'center' }}>
                                <Icon name="arrow-back" style={{ color: 'white' }}></Icon>
                            </Col>
                            <Col style={{ width: '80%', marginTop: 'auto', marginBottom: 'auto', alignItems: 'center' }}>

                                <Item style={{ borderBottomWidth: 0 }}>

                                    <Text style={{ fontFamily: 'opensans-regular', color: '#fff' }}>SEARCH RESULTS</Text>
                                </Item>

                            </Col>
                            <Col style={{ width: '10%' }}>
                            </Col>

                        </Row>

                    </Grid>
                    <Card transparent style={{ padding: 10, marginTop: 40 }}>
                        <Card style={{ padding: 10 }}>
                            <Grid>
                                <Col style={{ width: '25%' }}>
                                    <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />
                                </Col>

                                <Col style={{ width: '75%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={styles.normalText}>Allow the emergency to get offer</Text>

                                    <Text style={styles.offerText}>get 20% Offer</Text>


                                </Col>
                            </Grid>

                        </Card>

                        <Card style={{ padding: 10 }}>
                            <Grid>
                                <Col style={{ width: '25%' }}>
                                    <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />
                                </Col>

                                <Col style={{ width: '75%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={styles.normalText}>Allow the emergency to get offer</Text>

                                    <Text style={styles.offerText}>get 20% Offer</Text>


                                </Col>
                            </Grid>

                        </Card>


                        <Card style={{ padding: 10 }}>
                            <Grid>
                                <Col style={{ width: '25%' }}>
                                    <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />
                                </Col>

                                <Col style={{ width: '75%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={styles.normalText}>Allow the emergency to get offer</Text>

                                    <Text style={styles.offerText}>get 20% Offer</Text>


                                </Col>
                            </Grid>

                        </Card>

                    </Card>
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
export default connect(homeState)(MedicineSearchList)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 0
    },
    customImage: {
        height: 90,
        width: 90,
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

    normalText:
    {
        fontFamily: 'opensans-regular',
        fontSize: 14,
        color: 'gray'
    },
    offerText:
    {
        fontFamily: 'opensans-regular',
        fontSize: 20,
        color: 'red'
    }

});