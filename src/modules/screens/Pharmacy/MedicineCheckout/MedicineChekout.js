import React, { Component } from 'react';
import { Container, Content, Text, Item, Card, Right, Icon, View } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

class MedicineCheckout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            medicineDetails: null
        }
    }
    async componentDidMount() {
        const { navigation } = this.props;
        const medicineDetails = navigation.getParam('medicineDetails');
        await this.setState({ medicineDetails: medicineDetails })
        console.log('this.state.medicineDetails' + JSON.stringify(this.state.medicineDetails))
    }

    render() {
        const { medicineDetails } = this.state
        return (
            <Container style={styles.container}>
                <Content>
                    <Grid style={styles.curvedGrid}>
                    </Grid>
                    <Grid style={{ marginTop: -100, height: 100 }}>
                        <Row>
                            <View style={{ width: '80%', marginTop: 'auto', marginBottom: 'auto', alignItems: 'center' }}>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={{ fontFamily: 'OpenSans', color: '#fff', marginLeft: 80 }}>Delivery Addresses Info Page</Text>
                                </Item>
                            </View>
                            <Col style={{ width: '10%' }}>
                            </Col>
                        </Row>
                    </Grid>

                    <Card transparent style={{ padding: 5, marginTop: 40 }}>
                        <Text style={styles.boldText}>Delivery</Text>
                        <Grid style={{ marginTop: 5 }}>

                            <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate("OrderPaymentAddress", medicineDetails)}>
                                    <Row>
                                        <Right>
                                            <Icon name="checkmark-circle" style={{ color: '#D92B4B' }}></Icon>
                                        </Right>
                                    </Row>

                                    <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />
                                    <Text style={styles.normalText}>home delivery</Text>
                                </TouchableOpacity>
                            </Col>

                            <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }}>
                                <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />
                                <Text style={styles.normalText}>In store Pickup</Text>
                            </Col>
                        </Grid>
                        {/* <Text style={{ fontFamily: 'OpenSans', fontSize: 18, marginLeft: 15, fontWeight: "bold", marginTop: 10 }}>Notes</Text>
                        <Form style={{ padding: 5 }}>
                            <Textarea rowSpan={2} bordered placeholder="DeliveryInfo If Needed" style={{ borderRadius: 10, marginTop: 10, padding: 10, height: 80 }} />
                        </Form>
                        <Button block style={styles.CheckoutButton} onPress={() => this.props.navigation.navigate('OrderPaymentPreview')} testID='navigateToPaymentReviewPage'>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 15, fontWeight: "bold" }}> Proceed to pay </Text>
                        </Button> */}
                    </Card>
                </Content>
            </Container>
        )
    }
}

export default MedicineCheckout

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
    customText:
    {
        marginLeft: 20,
        fontFamily: 'OpenSans',
        fontSize: 13,
        marginTop: 3,
        color: '#000'
    },
    curvedGrid:
    {
        borderRadius: 800,
        width: '200%',
        height: 690,
        marginLeft: -200,
        marginTop: -600,
        position: 'relative',
        bottom: 0,
        overflow: 'hidden',
        backgroundColor: '#745DA6'
    },

    normalText:
    {
        fontFamily: 'OpenSans',
        fontSize: 16,
        color: 'green',
        fontWeight: 'bold'
    },

    boldText:
    {
        fontFamily: 'OpenSans',
        fontSize: 18,
        color: '#000',
        marginLeft: 15,
        fontWeight: "bold"
    },

    CheckoutButton: {
        marginTop: 40,
        backgroundColor: '#775DA3',
        borderRadius: 5,

    },
    transparentLabel:
    {

        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'OpenSans',
        margin: 2,
        fontSize: 13
    },

    addressLabel:
    {

        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'OpenSans',
        margin: 2,
        fontSize: 13
    }
});