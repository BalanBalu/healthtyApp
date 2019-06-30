import React, { Component } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Container, Card, Text, Content, ListItem, CheckBox, Body, Header, Left, Title, Icon } from 'native-base';

class Services extends Component {
    render() {
        return (
            < Container style={styles.container} >
                <Content>
                    <Header style={{ backgroundColor: '#7f49c3' }}>
                        <Left>
                            <Icon size={30} color={'#fff'} name={'arrow-back'} />
                        </Left>
                        <Body>
                            <Title style={{ fontFamily: 'OpenSans', }} >Services</Title>
                        </Body>
                    </Header>
                    <Card style={{ borderRadius: 5, padding: 10 }}>
                        <ListItem>
                            <CheckBox checked={true} color="green" />
                            <Body>
                                <Text>infectious diseases</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <CheckBox checked={false} color="green" />
                            <Body>
                                <Text>deficiency diseases</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <CheckBox checked={false} color="green" />
                            <Body>
                                <Text>hereditary diseases </Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <CheckBox checked={false} color="green" />
                            <Body>
                                <Text> physiological diseases</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <CheckBox checked={false} color="green" />
                            <Body>
                                <Text>Idiopathic disease</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <CheckBox checked={false} color="green" />
                            <Body>
                                <Text> physiological diseases</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <CheckBox checked={false} color="green" />
                            <Body>
                                <Text>Idiopathic disease</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <CheckBox checked={false} color="green" />
                            <Body>
                                <Text> physiological diseases</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <CheckBox checked={false} color="green" />
                            <Body>
                                <Text>Idiopathic disease</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <CheckBox checked={false} color="green" />
                            <Body>
                                <Text> physiological diseases</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <CheckBox checked={false} color="green" />
                            <Body>
                                <Text>Idiopathic disease</Text>
                            </Body>
                        </ListItem>

                    </Card>
                </Content>
            </Container >
        );
    }
}
export default Services


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'gray',
        padding: 5

    },

    card: {
        width: 'auto',
        borderRadius: 100

    },

})



