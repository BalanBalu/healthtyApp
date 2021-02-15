import React, { PureComponent } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Form, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox, Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, View, BackHandler, TextInput, AsyncStorage, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import styles from './styles'
import { forumInsertAnswer, getForumQuestionAndAnswerDetails } from '../../providers/forum/forum.action'
import { formatDate } from "../../../setup/helpers";
import { Loader } from '../../../components/ContentLoader';

import { renderForumImage } from '../../common';

class PublicForumDetail extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            answer_text: '',
            questionId: props.navigation.getParam('QuestionId'),
            getsData: [],
            isLoading: true,
        }
    }

    componentDidMount() {
        this.getAllForumDetails();
    }

    insertForumAnswers = async () => {
        try {
            if ((this.state.answer_text === '')) {
                Toast.show({
                    text: 'Kindly fill  the field',
                    type: 'danger',
                    duration: 3000
                });
            }
            else {
                let type = ''
                let userId = await AsyncStorage.getItem('userId');
                if (userId != null) {
                    type = 'user'
                } else {
                    type = 'unknown'
                }
                const { answer_text, questionId } = this.state
                let data = {
                    type: type,
                    answer_name: answer_text.toString(),
                    question_id: questionId,
                    answer_provider_id: "",
                    active: true
                }
                if (userId != null) {
                    data.answer_provider_id = userId
                } else {
                    delete data.answer_provider_id
                }
                this.setState({ isLoading: true })
                let result = await forumInsertAnswer(data)
                if (result.success) {
                    this.props.navigation.setParams({ 'refreshPage': true });
                    Toast.show({
                        text: "Your answer posted successfully",
                        type: "success",
                        duration: 3000,
                    })
                    this.setState({ answer_text: null })
                    await this.getAllForumDetails()
                }
                else {
                    Toast.show({
                        text: result.message,
                        type: "danger",
                        duration: 5000
                    })
                }
            }
        }
        catch (e) {
            console.log(e.message)
        }
        finally {
            this.setState({ isLoading: false })
        }
    }
    getAllForumDetails = async () => {
        try {
            this.setState({ isLoading: true })
            const { answer_text, questionId } = this.state
            let result = await getForumQuestionAndAnswerDetails(questionId)

            if (result.success) {
                let forumFetced = result.data
                this.setState({ getsData: forumFetced })
            }
        } catch (e) {
            console.log(e)
        }
        finally {
            this.setState({ isLoading: false })
        }

    }
    questionerName(item) {
        let name = "Guest User"
        if (item && item.questionerInfo) {
            if (item.questionerInfo.first_name) {
                name = item.questionerInfo.first_name + " " + item.questionerInfo.last_name
            }
        }
        return name
    }
    hasWhiteSpaceAnswerText(s) {
        let regSpace = new RegExp(/^\s/g);
        // Check for white space
        if (regSpace.test(s)) {
            return false;
        } else {
            this.setState({ answer_text: s })
        }
        return true;
    }

    answerGivenName(item) {
        let name = "Guest User"
        if (item && item.is_logged_in == true) {
            if (item.answererInfo.first_name) {
                name = item.answererInfo.first_name + " " + item.answererInfo.last_name
            }
        }
        return name
    }
    render() {

        const { answer_text, getsData, isLoading } = this.state
        return (
            <Container style={styles.container}>

                <Content style={styles.bodyContent}>
                    <FlatList
                        data={getsData}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) =>
                            <View style={{ marginBottom: 10 }}>
                                <Row>
                                    <Col size={1.5}>
                                        <Image source={renderForumImage(item, 'questionerInfo')} style={{ height: 50, width: 50 }} />
                                    </Col>
                                    <Col size={8.5} style={{ marginTop: 5, marginLeft: 5 }}>
                                        <Text style={styles.symptomsText}>{item.question_name}</Text>
                                        <Text note style={styles.dateText}>Raised by  {this.questionerName(item)}</Text>
                                    </Col>
                                </Row>
                                <Text style={[styles.symptomsText, { marginTop: 10 }]} >{item.description}</Text>

                                <Text style={[styles.postText, { marginTop: 15 }]} >Leave Your Answer</Text>
                                <View style={{ marginTop: 10 }}>
                                    <TextInput
                                        multiline={true}
                                        placeholder="Type your answer"
                                        placeholderTextColor="#696969"
                                        keyboardType={'default'}
                                        returnKeyType={'go'}
                                        value={answer_text}
                                        onChangeText={text => {
                                            this.hasWhiteSpaceAnswerText(text);
                                        }}
                                        style={styles.textInput4} />
                                </View>
                                <TouchableOpacity style={styles.postAnswerButton} onPress={this.insertForumAnswers}>
                                    <Text style={styles.postAnswerText}>Post Your Answer</Text>
                                </TouchableOpacity>
                                <View style={styles.borderView}>
                                    {isLoading ? <ActivityIndicator /> :
                                        <View>
                                            <Text style={{ color: '#128283', fontSize: 14, fontFamily: 'OpenSans', }}>{item.answersData.length} answers</Text>
                                            <FlatList
                                                data={item.answersData}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({ item, index }) =>
                                                    <View style={{ borderTopColor: 'gray', borderTopWidth: 0.3, paddingTop: 10, marginTop: 10 }}>
                                                        <Row>
                                                            <Col size={1}>
                                                                <Image source={renderForumImage(item, 'answererInfo')} style={{ height: 30, width: 30 }} />
                                                            </Col>
                                                            <Col size={9}>
                                                                <Row>
                                                                    <Col size={7}>
                                                                        <Text style={styles.symptomsText}>{this.answerGivenName(item)}</Text>
                                                                    </Col>
                                                                    <Col size={3}>
                                                                        <Text style={styles.answerText}>{formatDate(item.created_date, 'MMMM DD,YYYY')}</Text>
                                                                    </Col>
                                                                </Row>
                                                                {/* <Text note style={styles.dateText}>{item.date}</Text> */}
                                                            </Col>
                                                        </Row>
                                                        <Text style={styles.descriptionText}>{item.answer_name}</Text>
                                                    </View>
                                                } />
                                        </View>
                                    }

                                </View>
                            </View>
                        } />
                </Content>


            </Container>

        )
    }

}


export default PublicForumDetail

