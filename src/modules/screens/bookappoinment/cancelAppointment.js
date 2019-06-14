import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Radio, Button, Card, Grid, View, Text, Content, Input, Item } from 'native-base';


class CancelAppointment extends Component {
    render() {
        return (
            <Container style={{ backgroundColor: "grey", width: 'auto', height: 'auto' }}>

                <Content>

                    <Grid style={styles.grid}>
                        <Card style={styles.card}>

                            <Text style={styles.text}>
                                we understand life can get in the way! cancelling or missing your appointment too many times will result in your account being locked!
                                  </Text>
                            <Text>  <Text style={{ fontWeight: "bold" }}>saturday,April 13 - 10:15AM</Text> with Dr,Ravi</Text>
                            <Text style={{ marginTop: 20, textAlign: "center" }}>What is the reason for Cancellation?</Text>

                            <Radio selected={true} color={"#775DA3"}
                                selectedColor={"#775DA3"} />
                            <Text style={{
                                marginLeft: 10, fontFamily: 'OpenSans',
                            }}>I am feeling better</Text>
                            <Radio selected={false} color={"#775DA3"}
                                selectedColor={"#775DA3"} />
                            <Text style={{
                                marginLeft: 10, fontFamily: 'OpenSans',
                            }}>Iam looking for sooner or faster</Text>
                            <Radio selected={false} color={"#775DA3"}
                                selectedColor={"#775DA3"} />
                            <Text style={{
                                marginLeft: 10, fontFamily: 'OpenSans',
                            }}>I will not be able to make this on the time</Text>
                            <Radio selected={false} color={"#775DA3"}
                                selectedColor={"#775DA3"} />
                            <Text style={{
                                marginLeft: 10, fontFamily: 'OpenSans',
                            }}>I want to reshedule with different type</Text>
                            <Radio selected={false} color={"#775DA3"}
                                selectedColor={"#775DA3"} />
                            <Text style={{
                                marginLeft: 10, fontFamily: 'OpenSans',
                            }}>Other</Text>

                            <Card style={styles.subcard}>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Input placeholder="Password" style={styles.transparentLabel}
                                        secureTextEntry={true}
                                        returnKeyType={'done'}
                                        //value={this.state.password}
                                        autoCapitalize='none'
                                        //onChangeText={password => this.setState({ password })}
                                        blurOnSubmit={false}
                                    //onSubmitEditing={() => { this.doLogin(); }}
                                    />
                                </Item>
                            </Card>

                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                            }}>
                                <Button style={styles.button1}><Text> cancel</Text></Button>
                                <Button style={styles.button2}><Text> Keep it </Text></Button>

                            </View>
                        </Card>



                    </Grid>

                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    header:
    {
        backgroundColor: "#7459a0",
        height: 50,
        width: 'auto'

    },
    title: {
        paddingLeft: 40, paddingTop: 10

    },
    grid: {
        backgroundColor: '#f5f5f5', marginBottom: 5, marginTop: 5, height: 'auto', width: 'auto', marginLeft: 5, marginRight: 5
    },
    card: {
        backgroundColor: '#f5f5f5', marginBottom: 10, marginTop: 10, height: 540, width: 'auto', marginLeft: 10, marginRight: 10

    },
    text: {
        backgroundColor: "grey", color: "white", fontSize: 14, paddingTop: 5, paddingBottom: 5, paddingRight: 5, paddingLeft: 5
    },

    subcard: {
        backgroundColor: 'grey', marginBottom: 10, marginTop: 10, height: 50, width: 'auto', marginLeft: 15
    },
    button1: {
        backgroundColor: "#7459a0", marginLeft: 'auto', marginRight: 'auto', borderRadius: 5, justifyContent: 'center', padding: 20

    },
    button2: {
        backgroundColor: "#7459a0", marginLeft: 'auto', marginRight: 'auto', borderRadius: 5, justifyContent: 'center', padding: 20
    }

})
export default CancelAppointment




