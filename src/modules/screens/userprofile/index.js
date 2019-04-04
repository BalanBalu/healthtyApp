import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Card, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ScrollView, ProgressBar } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';


class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userEntry: '',
            password: '',
            loginErrorMsg: ''
        }
        this.state = {
            starCount: 3.5
        };
    }
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    render() {
        const { user: { isLoading } } = this.props;
        const { loginErrorMsg } = this.state;
        return (

            <Container style={styles.container}>
                <Header style={{ backgroundColor: '#7E49C3', fontFamily: 'opensans-semibold' }}>
                    <Left  >
                        <Button Button transparent onPress={() => this.props.navigation.navigate('home')}>
                            <Icon name="arrow-back" style={{ color: '#fff' }}></Icon>
                        </Button>

                    </Left>
                    <Body>
                        <Title style={{ fontFamily: 'opensans-semibold' }}>View Profile</Title>

                    </Body>
                    <Right />
                </Header>
                <Content style={styles.bodyContent}>





                    <LinearGradient colors={['#7E49C3', '#C86DD7']} style={{ height: 180 }}>

                        <Grid>
                            <Row>
                                <Col style={{ width: '10%' }}>
                                </Col>
                                <Col style={styles.customCol}>
                                    <Icon name="call" style={styles.profileIcon}></Icon>
                                </Col>
                                <Col style={{ width: '40%' }}>
                                    <Thumbnail style={styles.profileImage} source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} />
                                    <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontFamily: 'opensans-regular', backgroundColor: '#fff', borderRadius: 20, padding: 10, marginTop: 5 }}>Kumar Pratik</Text>

                                </Col>
                                <Col style={styles.customCol}>
                                    <Icon name="chatbubbles" style={styles.profileIcon}></Icon>
                                </Col>
                                <Col style={{ width: '10%' }}>
                                </Col>
                            </Row>

                        </Grid>







                    </LinearGradient>
                    <Card>
                        <Grid style={{padding:10}}>
                            <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={styles.topValue}> Rs 450 </Text>
                                <Text note style={styles.bottomValue}> Hourly Rate </Text>
                            </Col>

                            <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={styles.topValue}>88 </Text>
                                <Text note style={styles.bottomValue}> Reviews </Text>
                            </Col>

                            <Col style={{ backgroundColor: 'transparent', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={styles.topValue}>824 </Text>
                                <Text note style={styles.bottomValue}> patients </Text>
                            </Col>
                        </Grid>

                    </Card>



                    <List>
                        <Text style={styles.titleText}>Personal details..</Text>


                        <ListItem avatar>
                            <Left>
                                <Icon name="mail" style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                            <Body>
                                <Text style={styles.customText}>Email</Text>
                                <Text note style={styles.customText}>theivamagan2gmail.com. .</Text>
                            </Body>
                            <Right>
                                <Icon name="create"></Icon>
                            </Right>
                        </ListItem>



                        <ListItem avatar>
                            <Left>
                                <Icon name="locate" style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                            <Body>
                                <Text style={styles.customText}>Address</Text>
                                <Text note style={styles.customText}>31/b jawaharlal nehru street</Text>
                                <Text note style={styles.customText}>Anna nagar-40 </Text>
                                <Text note style={styles.customText}>chennai..</Text>
                            </Body>
                            <Right>
                                <Icon name="create"></Icon>
                            </Right>
                        </ListItem>



                        <ListItem avatar>
                            <Left>
                                <Icon name="call" style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                            <Body>
                                <Text style={styles.customText}>Contact</Text>
                                <Text note style={styles.customText}>8098879167</Text>

                            </Body>
                            <Right>
                                <Icon name="create"></Icon>
                            </Right>
                        </ListItem>

                        <ListItem avatar>
                            <Left>
                                <Icon name="flame" style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                            <Body>
                                <Text style={styles.customText}>Insurance</Text>
                                <Text note style={styles.customText}>Insurance</Text>

                            </Body>
                            <Right>
                                <Icon name="create"></Icon>
                            </Right>
                        </ListItem>
                        <ListItem avatar>
                            <Left>
                                <Icon name="male" style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                            <Body>
                                <Text style={styles.customText}>Sex</Text>
                                <Text note style={styles.customText}>Sex</Text>

                            </Body>
                            <Right>
                                <Icon name="create"></Icon>
                            </Right>
                        </ListItem>


                        <ListItem avatar>
                            <Left>
                                <Icon name="briefcase" style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                            <Body>
                                <Text style={styles.customText}>Change Password</Text>
                                <Text note style={styles.customText}>Change Password</Text>

                            </Body>
                            <Right>
                                <Icon name="create"></Icon>
                            </Right>
                        </ListItem>

                    </List>


                    <List>
                        <Text style={styles.titleText}>Your Doctors</Text>



                        <ListItem avatar noBorder>
                            <Left>
                                <Thumbnail square source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 40, width: 40 }} />
                            </Left>
                            <Body>
                                <Text>Kumar Pratik</Text>

                                <Text note>Annanagar-chennai-40</Text>

                            </Body>
                            <Right>
                                <Button style={styles.docbutton}><Text style={{ fontFamily: 'opensans-regular', fontSize: 12 }}> Book Again</Text></Button>
                            </Right>

                        </ListItem>


                        <ListItem avatar noBorder>
                            <Left>
                                <Thumbnail square source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 40, width: 40 }} />
                            </Left>
                            <Body>
                                <Text>Kumar Pratik</Text>

                                <Text note>Annanagar-chennai-40</Text>

                            </Body>
                            <Right>
                                <Button style={styles.docbutton}><Text style={{ fontFamily: 'opensans-regular', fontSize: 12 }}> Book Again</Text></Button>
                            </Right>

                        </ListItem>
                    </List>


                </Content>
            </Container>

        )
    }

}

function loginState(state) {

    return {
        user: state.user
    }
}
export default connect(loginState, { login, messageShow, messageHide })(Profile)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {

    },

    customHead:
    {
        fontFamily: 'opensans-regular',
    },
    customText:
    {

        fontFamily: 'opensans-regular',
    },
    logo: {
        height: 80,
        width: 80,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },

    customCard: {
        borderRadius: 20,
        padding: 10,
        marginTop: -100,
        marginLeft: 20,
        marginRight: 20,
        fontFamily: 'opensans-regular',

    },
    topValue: {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'opensans-regular',
    },
    bottomValue:
    {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'opensans-regular',
    },
    titleText: {
        fontSize: 15,
        padding: 5,
        margin: 10,
        backgroundColor: '#FF9500',
        borderRadius: 20,
        color: 'white',
        width: 150,
        textAlign: 'center',
        fontFamily: 'opensans-regular',

    },
    docbutton: {
        height: 35,
        width: "auto",
        borderRadius: 20,
        backgroundColor: '#7357A2',
        marginTop: 5

    },
    profileIcon:
    {
        color: '#fff',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        fontSize: 35,

    },
    profileImage:
    {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 25,
        height: 80,
        width: 80,
        borderColor: '#f5f5f5',
        borderWidth: 2,
        borderRadius: 50
    }, customCol:
    {
        width: '20%',

        borderRadius: 25,
        borderColor: '#fff',
        height: 50, width: 50,
        backgroundColor: '#C86DD7',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    }


});