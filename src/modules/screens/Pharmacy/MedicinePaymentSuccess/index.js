import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image } from 'react-native';

class MedicinePaymentSuccess extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
    }
    
    render() {


        return (

            <Container style={styles.container}>

                <Content style={styles.bodyContent}>

                    <Grid style={styles.curvedGrid}>

                    </Grid>

                    <Item style={{ bottom: 100, borderBottomWidth: 0, marginTop: -80 }}>
                        <Row >
                            <Col style={{ width: '10%', marginTop: 'auto', marginBottom: 'auto', alignItems: 'center' }}>
                                <Icon name="arrow-back" style={{ color: 'white' }}></Icon>
                            </Col>
                            <Col style={{ width: '80%', marginTop: 'auto', marginBottom: 'auto', alignItems: 'center' }}>

                                <Item style={{ borderBottomWidth: 0 }}>

                                    <Text style={{ fontFamily: 'OpenSans', color: '#fff' }}>CONFIRMATION</Text>
                                </Item>

                            </Col>
                            <Col style={{ width: '10%' }}>
                            </Col>

                        </Row>

                    </Item>


                    <Card transparent style={{ padding: 10, marginTop: 60 }}>

                        <Card style={{ borderRadius: 10, padding: 10 }}>

                            <Grid style={{ padding: 5, margin: 10 }}>
                                <Col style={{ width: '25%', alignItems: 'center' }}>
                                    <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} />
                                </Col>

                                <Col style={{ width: '25%', alignItems: 'center' }}>

                                </Col>

                                <Col style={{ width: '50%', alignItems: 'center', marginTop: 10 }}>
                                    <Text style={styles.labelTop}> 9988 5643 2156</Text>
                                </Col>
                            </Grid>

                            <Grid style={{ marginTop: 10 }}>
                                <Image source={{ uri: 'https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Tick_Mark_Circle-512.png' }} style={styles.customImage} />
                            </Grid>



                            <Text style={{ marginTop: 20, fontFamily: 'OpenSans', color: 'gray', textAlign: 'center' }}> Your Confirmation Is Successful</Text>
                        </Card>

                        <Button block style={styles.loginButton}><Text>Home</Text></Button>
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
export default connect(homeState)(MedicinePaymentSuccess)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 0
    },
    customImage: {
        height: 60,
        width: 60,
        marginLeft: 'auto',
        marginRight: 'auto',

    },


    curvedGrid: {
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

    loginButton: {
        marginTop: 12,
        backgroundColor: '#775DA3',
        borderRadius: 5,
    },

    labelTop:
    {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#000',


    },

});