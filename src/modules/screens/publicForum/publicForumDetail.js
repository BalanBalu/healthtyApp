import React, { PureComponent } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Form, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox, Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, View, BackHandler, TextInput, AsyncStorage } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import styles from './styles'
import { forumInsertAnswer, getForumQuestionAndAnswerDetails } from '../../providers/forum/forum.action'
import { formatDate } from "../../../setup/helpers";
import { Loader } from '../../../components/ContentLoader';

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
        this.getAllForumDetails()
    }

    insertForumAnswers = async () => {
        try {
            if ((this.state.answer_text == '')) {
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
                    answer_name: answer_text,
                    question_id: questionId,
                    answer_provider_id: "",
                    active: true
                }
                if (userId != null) {
                    data.answer_provider_id = userId
                }
                this.setState({ isLoading: true })
                let result = await forumInsertAnswer(data)
                if (result.success) {
                    Toast.show({
                        text: result.message,
                        type: "success",
                        duration: 3000,
                    })

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
                console.log("data=========<<<<<<<<<<<<<", JSON.stringify(result.data))
            }

        } catch (e) {
            console.log(e)
        }
        finally {
            this.setState({ isLoading: false })
        }

    }
    questionerName(item) {
        let name = "unknown"
        if (item && item.questionerInfo) {
            if (item.questionerInfo.first_name) {
                name = item.questionerInfo.first_name + " " + item.questionerInfo.last_name
            }
        }
        return name
    }
    render() {

        const { answer_text, getsData, isLoading } = this.state
        return (
            <Container style={styles.container}>
                {isLoading ? <Loader style='list' /> :
                    <Content style={styles.bodyContent}>
                        <FlatList
                            data={getsData}
                            extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) =>
                                <View style={{ marginBottom: 10 }}>
                                    <Row>
                                        <Col size={1.5}>
                                            <Image source={require('../../../../assets/images/Female.png')} style={{ height: 50, width: 50 }} />
                                        </Col>
                                        <Col size={8.5} style={{ marginTop: 5, marginLeft: 5 }}>
                                            <Text style={styles.symptomsText}>{item.question_name}</Text>
                                            <Text note style={styles.dateText}>Raised by  {this.questionerName(item)}</Text>
                                        </Col>
                                    </Row>
                                    <Text style={[styles.postText], { marginTop: 10 }} >Leave Your Answer</Text>
                                    <View style={{ marginTop: 15 }}>
                                        <Text style={styles.smallHeading}>Your Answer</Text>
                                        <TextInput
                                            multiline={true}
                                            placeholder="Type your answer"
                                            placeholderTextColor="#696969"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                            autoFocus={true}
                                            value={answer_text}
                                            onChangeText={enteredText => this.setState({ answer_text: enteredText })}
                                            style={styles.textInput4} />
                                    </View>
                                    <TouchableOpacity style={styles.postAnswerButton} onPress={this.insertForumAnswers}>
                                        <Text style={styles.postAnswerText}>Post Your Answer</Text>
                                    </TouchableOpacity>
                                    <View style={styles.borderView}>

                                        <View>
                                            <Text style={{ color: '#7F49C3', fontSize: 12, fontFamily: 'OpenSans', }}>{item.answersData.length} answers</Text>
                                            <FlatList
                                                data={item.answersData}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({ item, index }) =>
                                                    <View style={{ borderTopColor: 'gray', borderTopWidth: 0.3, paddingTop: 10, marginTop: 10 }}>
                                                        <Row>
                                                            <Col size={1}>
                                                                <Image source={require('../../../../assets/images/Female.png')} style={{ height: 30, width: 30 }} />
                                                            </Col>
                                                            <Col size={9}>
                                                                <Row>
                                                                    <Col size={8}>
                                                                        <Text style={styles.symptomsText}>{item.answererInfo.first_name + ' ' + item.answererInfo.last_name}</Text>
                                                                    </Col>
                                                                    <Col size={2}>
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


                                    </View>
                                </View>
                            } />
                    </Content>
                }
                <Footer style={styles.footerStyle}>
                    <Row>
                        <Col size={1} style={styles.colstyle}>
                            <TouchableOpacity style={styles.pageCount}>
                                <Text style={styles.pageCountText}>{"<"}</Text>
                            </TouchableOpacity>
                        </Col>
                        <Col size={8} style={styles.colstyle}>
                            <TouchableOpacity style={[styles.pageCount, { alignItems: 'center', justifyContent: 'center' }]}>
                                <Text style={styles.pageCountText}>1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.pageCount, { alignItems: 'center', justifyContent: 'center' }]}>
                                <Text style={styles.pageCountText}>2</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.pageCount, { alignItems: 'center', justifyContent: 'center' }]}>
                                <Text style={styles.pageCountText}>3</Text>
                            </TouchableOpacity>
                        </Col>
                        <Col size={1} style={styles.colstyle}>
                            <TouchableOpacity style={styles.pageCount}>
                                <Text style={styles.pageCountText}>{">"}</Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                </Footer>
            </Container>

        )
    }

}


export default PublicForumDetail


