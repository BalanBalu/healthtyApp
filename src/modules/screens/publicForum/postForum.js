import React, { PureComponent } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Form, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, View, BackHandler, TextInput } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import styles from './styles'

class PostForum extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {

        return (
            <Container style={styles.container}>
                <Content style={styles.bodyContent}>
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.postText}>Enter Question Title</Text>
                        <TextInput
                            onChangeText={complaint => this.setState({ complaint })}
                            multiline={true} placeholder="Type question title"
                            style={styles.textInput1} />
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <Text style={styles.postText}>Enter Question</Text>
                        <TextInput
                            onChangeText={complaint => this.setState({ complaint })}
                            multiline={true} placeholder="Type Description"
                            style={styles.textInput2} />
                    </View>
                    <TouchableOpacity style={styles.postAnswerButton}>
                        <Text style={styles.postAnswerText}>Post Your Questions</Text>
                    </TouchableOpacity>
                </Content>
            </Container>

        )
    }

}


export default PostForum


