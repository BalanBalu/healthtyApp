import React, { Component } from 'react';
import { StyleSheet, TextInput, FlatList } from 'react-native';
import { Container, Card, Text, Content, ListItem, CheckBox, Body, View,Button,Item, Left, Title, Icon, List } from 'native-base';

class Services extends Component {
    
    constructor(props) {
        super(props)

        this.state={
            serviceList:[],
            serviceCheckBox:[false],
            selectedService:[],
            serviceValue:''

        }
    }

    async componentDidMount() {
             const { navigation } = this.props;
        const serviceList = navigation.getParam('serviceList');
        await this.setState({ serviceList: serviceList });
        console.log('serviceList'+JSON.stringify(this.state.serviceList));

    }

    sendServicesData = async () => {
        await this.props.navigation.navigate('Filters',{selectedServicesList:this.state.serviceValue})

    }



    selectServicesInCheckBox=(serviceIndex,serviceValue)=>{

        let sampleArray = this.state.serviceCheckBox;
        sampleArray[serviceIndex] = !this.state.serviceCheckBox[serviceIndex];
        this.setState({ serviceCheckBox: sampleArray });
        this.setState({ serviceValue: serviceValue })
        console.log('serviceValue'+this.state.serviceValue);
        
        if (sampleArray[serviceIndex] == true) {
            this.state.selectedService.splice(serviceIndex, 0, serviceValue);
        } else {
            let deSelectedIndex = this.state.selectedService.indexOf(serviceValue);
            this.state.selectedService.splice(deSelectedIndex, 1);
        }
        
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
                <Card style={{ borderRadius: 5, padding: 10 }}>
                    <CheckBox 
                    checked={this.state.serviceCheckBox[index]}  onPress={() => this.selectServicesInCheckBox(index,item.value )} color="green"
                    />
                    <Body>
                        <Text>{item.value}</Text>
                    </Body>
                    </Card>
                } />

                
<View style={{ paddingTop: 5 }}>
                        <Button block style={{ borderRadius: 10, backgroundColor: '#5cb75d', height: 48 }} onPress={this.sendServicesData}>
                            <Text style={{ fontFamily: 'OpenSans', }}>View Doctors</Text>
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

    }
})



