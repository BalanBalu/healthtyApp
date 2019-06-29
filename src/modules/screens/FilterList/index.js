import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Body, Button, Card, Text, Row, View, Col, Content, Icon, Header, Left, Title } from 'native-base';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

class Filters extends Component {
    languages = [{ name: "Tamil" }, { name: "English" }, { name: "Hindi" }, { name: "Telugu" }, { name: "Malayalam" }, { name: "Kannada" }];

    constructor() {
        super();
        this.state = {
            language: []
        }
    }


    render() {
        return (
            <Container style={styles.container}>
                <Content>

                    {/* first card */}

                    <Card style={{ padding: 10, borderRadius: 10, width: 'auto' }}>
                        <Text style={{ backgroundColor: 'whitesmoke', borderBottomColor: '#c9cdcf', borderBottomWidth: 2, }}>Gender Preference</Text>
                        <Row style={{ justifyContent: 'center', marginTop: 10 }}>
                            <Col>
                                <Button disabled bordered style={styles.exampleCard}>
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                        <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', color: 'blue' }} name='male' />


                                        <Text style={{ textAlign: 'center', fontSize: 12, color: 'blue' }}>Male</Text>

                                    </View>

                                </Button>
                            </Col>
                            <Col>
                                <Button disabled bordered style={styles.exampleCard2}>
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                        <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />


                                        <Text style={{ textAlign: 'center', fontSize: 12, }}>Female</Text>

                                    </View>

                                </Button>
                            </Col>
                            <Col>
                                <Button disabled bordered style={styles.exampleCard2}>
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                        <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />


                                        <Text style={{ textAlign: 'center', fontSize: 12, }}>Other</Text>

                                    </View>

                                </Button>
                            </Col>
                        </Row>
                    </Card>
                    {/* second card */}

                    <Card style={{ width: 'auto', padding: 10, borderRadius: 10, width: 'auto' }}>
                        <Text style={{
                            backgroundColor: 'whitesmoke', borderBottomColor: '#c9cdcf', borderBottomWidth: 2,
                            fontFamily: 'OpenSans',
                        }}>Availability Time</Text>
                        <Row style={{ marginTop: 10 }}>
                            <Col>
                                <Button disabled bordered style={styles.exampleCard2}>
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                        <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />


                                        <Text style={{ textAlign: 'center', fontSize: 12, }}>Today</Text>

                                    </View>

                                </Button>
                            </Col>
                            <Col>
                                <Button disabled bordered style={styles.exampleCard}>
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                        <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', color: 'blue' }} name='female' />


                                        <Text style={{ textAlign: 'center', fontSize: 12, color: 'blue' }}>After 3 Day</Text>

                                    </View>

                                </Button>
                            </Col>
                            <Col>
                                <Button disabled bordered style={styles.exampleCard2}>
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                        <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />


                                        <Text style={{ textAlign: 'center', fontSize: 12, }}>After a week</Text>

                                    </View>

                                </Button>

                            </Col>
                        </Row>
                    </Card>


                    {/* third card */}



                    <Card style={{ width: 'auto', padding: 10, borderRadius: 10, }}>
                        <View>
                            <Text style={{ backgroundColor: 'whitesmoke', borderBottomColor: '#c9cdcf', borderBottomWidth: 1, fontFamily: 'OpenSans', }}>Work Experience
                  </Text>
                        </View>
                        <Row style={{ marginTop: 10 }}>
                            <Col>
                                <Button disabled bordered style={styles.card3}>
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                        <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />


                                        <Text style={{ textAlign: 'center', fontSize: 12, }}>0-10 years</Text>

                                    </View>

                                </Button>
                            </Col>
                            <Col>
                                <Button disabled bordered style={styles.card3}>
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                        <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', color: 'blue' }} name='female' />


                                        <Text style={{ textAlign: 'center', fontSize: 12, color: 'blue' }}>10-20 years</Text>

                                    </View>

                                </Button>
                            </Col>
                            <Col>
                                <Button disabled bordered style={styles.cardExample}>
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                        <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />


                                        <Text style={{ textAlign: 'center', fontSize: 12, }}>20-30 years</Text>

                                    </View>

                                </Button>
                            </Col>
                            <Col>
                                <Button disabled bordered style={styles.card3}>
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                        <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />


                                        <Text style={{ textAlign: 'center', fontSize: 12, }}>Above 30 </Text>

                                    </View>

                                </Button>
                            </Col>
                        </Row>
                    </Card>
                    <View>
                        <Card block style={{ backgroundColor: '#fff', borderRadius: 10, height: 50 }}>
                            <View style={{ justifyContent: 'center' }}>

                                <SectionedMultiSelect
                                    items={this.languages}
                                    uniqueKey='name'
                                    displayKey='name'
                                    selectText='Choose Languages You know'
                                    showDropDowns={true}
                                    hideSearch={true}
                                    showRemoveAll={true}
                                    showChips={false}
                                    readOnlyHeadings={false}
                                    onSelectedItemsChange={(language) => this.setState({ language })}
                                    selectedItems={this.state.language}
                                    colors={{ primary: '#775DA3' }}
                                    testID='languageSelected'
                                />

                            </View>
                        </Card>
                    </View>
                    <View style={{ paddingTop: 5 }}>
                        <Card block style={{ backgroundColor: '#fff', padding: 5, borderRadius: 10, }}>
                            <Row>
                                <Col style={{ width: '95%' }}>
                                    <Text style={{ color: 'black', fontSize: 15, width: 'auto', fontFamily: 'OpenSans', }}>Select Services</Text>
                                </Col>
                                <Col style={{ width: '95%' }}>
                                    <Icon name='ios-arrow-forward' style={{ fontSize: 30, color: 'black', width: 'auto' }} />
                                </Col>
                            </Row>
                        </Card>
                    </View>
                    <View style={{ paddingTop: 5 }}>
                        <Button block style={{ borderRadius: 10, backgroundColor: '#5cb75d', height: 48 }}>
                            <Text style={{ fontFamily: 'OpenSans', }}>View Doctors</Text>
                        </Button>
                    </View>



                </Content>
            </Container >

        );
    }
}

export default Filters
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#c9cdcf',
        padding: 5
    },

    card3: {
        borderRadius: 10,
        padding: 20,
        height: 80,
        width: '90%',
        borderColor: 'black',
        borderWidth: 10,
        height: 80,


    },
    exampleCard2: {
        borderRadius: 10,
        padding: 30,
        width: '90%',
        marginLeft: 10,
        borderWidth: 50,
        height: 75,


    },
    exampleCard: {
        borderRadius: 10,
        padding: 30,
        width: '90%',
        marginLeft: 10,
        borderWidth: 50,
        height: 75,
        borderColor: 'blue'

    },
    cardExample: {
        borderRadius: 10,
        padding: 20,
        height: 80,
        width: '90%',
        borderColor: 'black',
        borderWidth: 10,
        height: 80,
        borderColor: 'blue'

    },


})