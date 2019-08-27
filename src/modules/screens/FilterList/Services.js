import React, { Component } from 'react';
import { StyleSheet, TextInput, FlatList } from 'react-native';
import { Container, Card, Text, Content, ListItem, CheckBox, Body, View, Button, Item, Left, Title, Icon, List } from 'native-base';
import { Row, Col } from 'react-native-easy-grid';

class Services extends Component {

    constructor(props) {
        super(props)

        this.state = {
            serviceList: [],
            serviceCheckBox: [false],
            selectedService: [],
            submit_Button: true
        }
    }

    async componentDidMount() {
        const { navigation } = this.props;
        const serviceList = navigation.getParam('serviceList');
        await this.setState({ serviceList: serviceList });
        // console.log('serviceList'+JSON.stringify(this.state.serviceList));
    }

    sendServicesData = async () => {
        await this.props.navigation.navigate('Filters', { selectedServicesList: this.state.selectedService })
    }

    selectServicesInCheckBox = async (serviceIndex, serviceValue) => {

        let sampleArray = this.state.serviceCheckBox;
        sampleArray[serviceIndex] = !this.state.serviceCheckBox[serviceIndex];
        this.setState({ serviceCheckBox: sampleArray });

        if (sampleArray[serviceIndex] == true) {
            this.state.selectedService.splice(serviceIndex, 0, serviceValue);

        } else {
            let deSelectedIndex = this.state.selectedService.indexOf(serviceValue);
            this.state.selectedService.splice(deSelectedIndex, 1);
        }
        this.state.selectedService.length != 0 ? this.setState({ submit_Button: false }) : this.setState({ submit_Button: true })

        console.log('this.state.selectedService' + JSON.stringify(this.state.selectedService))
    }
    render() {
        return (

            < Container style={styles.container} >
                <Content>
                    <FlatList
                        data={this.state.serviceList}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) =>
                            <Card style={{ borderRadius: 5, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                                <Row>
                                    <Col style={{ width: "10%" }}>
                                        <CheckBox
                                            checked={this.state.serviceCheckBox[index]} onPress={() => this.selectServicesInCheckBox(index, item.value)} color="green"
                                        />
                                    </Col>
                                    <Col style={{ width: "90%" }}>
                                        <Body>
                                            <Text>{item.value}</Text>
                                        </Body>
                                    </Col>
                                </Row>

                            </Card>
                        } />

                    <View style={{ paddingTop: 5 }}>
                        <Button block success disabled={this.state.submit_Button} style={this.state.submit_Button === true ? styles.submitButtonBgGray : styles.submitButtonBgGreeen}
                            onPress={this.sendServicesData}>
                            <Text style={{ fontFamily: 'OpenSans', }}>SUBMIT</Text>
                        </Button>
                    </View>

                </Content>
            </Container>

        )
    }
}
export default Services

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 5
    },
    submitButtonBgGray: {
        borderRadius: 10,
        backgroundColor: '#698d52',
        height: 48
    },
    submitButtonBgGreeen: {
        borderRadius: 10,
        backgroundColor: '#5cb75d',
        height: 48
    }
})



