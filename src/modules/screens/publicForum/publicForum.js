import React, { PureComponent } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Form, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, View, BackHandler, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import styles from './styles'
import { searchSuggestionsForQuestionsAndAnswers, getAllPublicForumDetails } from '../../providers/forum/forum.action'
import { Loader } from '../../../components/ContentLoader';
import { formatDate } from "../../../setup/helpers";
import { connect } from 'react-redux'
import { renderForumImage } from '../../common';
import { NavigationEvents } from 'react-navigation';

const debounce = (fun, delay) => {
    let timer = null;
    return function (...args) {
        const context = this;
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fun.apply(context, args);
        }, delay);
    };
}
class PublicForum extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            data: [],
            querySugesstionArray: [],
            query_text: '',
            skip: 0,
            limit: 10,
            isAllItemFetched: false
        };
        this.onEndReachedCalledDuringMomentum = true;
        this.callquerysearchService = debounce(this.callquerysearchService, 500);
    }
    componentDidMount() {
        this.callquerysearchService()
        this.handleLoadMore()
    }
    SearchKeyWordFunction = async (enteredText) => {
        if (enteredText) {
            await this.setState({ query_text: enteredText, skip: 0 })
            this.callquerysearchService(enteredText, true);
        }
    }
    callquerysearchService = async (enteredText, skipConcatWithPreviousData) => {

        let result = await getAllPublicForumDetails(this.state.query_text, this.state.skip, this.state.limit)
        if (result.success) {
            let forumFetced = result.data || []
            this.setState({
                data: skipConcatWithPreviousData === true ? result.data : this.state.data.concat(forumFetced),
                searchValue: enteredText,
                isLoading: false,
                isAllItemFetched: forumFetced.length < this.state.limit
            })
            console.log("Wholedata=========<<<<<<<<<<<<< Length", result.data.length)
        } else {
            this.setState({
                searchValue: enteredText,
                setShowSuggestions: false,
                isLoading: false,
                isAllItemFetched: true
            });
        }

    }
    renderFooter() {
        return (

            this.state.isAllItemFetched === false ?
                <ActivityIndicator color="blue" style={styles.btnText} /> : null
        );
    }

    handleLoadMore = async () => {
        console.log('On Hanndle loading ' + this.onEndReachedCalledDuringMomentum);
        this.setState({
            skip: (this.state.skip + this.state.limit)
        });
        await this.callquerysearchService(this.state.query_text)
        console.log('loading>>>>>>>>.. ' + this.state.skip);
    }

    backNavigation = async (navigationData) => {
        try {
            if (navigationData.action) {
                await this.callquerysearchService(this.state.query_text, true);
            }
        } catch (e) {
            console.log(e)
        }

    }


    render() {
        const { isLoading, data, } = this.state;
        return (
            <Container style={styles.container}>
                {isLoading ? <ActivityIndicator /> : null}

                <View style={{ flex: 1, marginLeft: 5, marginRight: 5, marginBottom: 10 }}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <NavigationEvents
                        onWillFocus={payload => { this.backNavigation(payload) }} />

                    <View >
                        <View style={{ backgroundColor: '#ECDCFA', paddingTop: 8, paddingBottom: 8, paddingRight: 10, marginTop: 5, flexDirection: 'row' }}>
                            <View style={{ width: '70%' }}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 13, marginLeft: 10 }}>Ask Query To Qualified Doctors</Text>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 18, fontWeight: 'bold', marginTop: 5, marginLeft: 10 }}>To Get Your Solution</Text>
                                <Row>
                                    <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 3, paddingBottom: 3, borderColor: '#7F49C3', borderWidth: 2, marginLeft: 10, height: 30, borderRadius: 2, }}
                                        onPress={() => this.props.navigation.navigate("PostForum")} >
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 13, textAlign: 'center', color: '#7F49C3' }}>Post Your Questions</Text>
                                    </TouchableOpacity>
                                </Row>
                            </View>
                            <View size={3} style={{ justifyContent: 'center', alignItems: 'center', width: '30%' }}>
                                <Image source={require('../../../../assets/images/doctor-forum-bg.png')} style={{ width: 100, height: 100 }} />
                            </View>

                        </View>
                    </View>
                    <View style={{ backgroundColor: '#ECDCFA', paddingTop: 8, paddingBottom: 8, paddingRight: 10, marginTop: 5 }}>

                        <Form>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '90%' }}>
                                    <Item style={styles.transparentLabel1}>
                                        <Input placeholder="Type Your Query" style={styles.firstTransparentLabel}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                            multiline={false}
                                            value={this.state.query_text}
                                            autoFocus={true}
                                            onChangeText={enteredText => this.SearchKeyWordFunction(enteredText)}
                                        />
                                    </Item>
                                </View>
                                <View style={{ width: '10%' }}>
                                    <TouchableOpacity style={styles.iconStyle} >
                                        <Icon name='ios-search' style={{ fontSize: 20, color: '#fff' }} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </Form>

                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 15, marginBottom: 10 }}>Ask Query To Qualfied Doctors</Text>

                        <FlatList
                            data={data}
                            extraData={data}
                            onEndReached={() => this.handleLoadMore()}
                            onEndReachedThreshold={0.5}
                            // onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                            ListFooterComponent={this.renderFooter.bind(this)}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("PublicForumDetail", { QuestionId: item._id })}>
                                    <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.3, paddingBottom: 10, marginTop: 15 }}>
                                        <Row>
                                            <Col size={1}>
                                                <Image source={renderForumImage(item, 'questionerInfoUser')} style={{ height: 30, width: 30 }} />
                                            </Col>
                                            <Col size={9}>
                                                <Row>
                                                    <Col size={8}>
                                                        <Text style={styles.symptomsText}>{item.question_name}</Text>
                                                    </Col>
                                                    <Col size={2}>
                                                        <Text style={styles.answerText}>{item.answersData.length} Answered</Text>

                                                    </Col>
                                                </Row>
                                                <Text note style={styles.dateText}>{formatDate(item.created_date, 'MMMM DD,YYYY')}</Text>
                                            </Col>
                                        </Row>
                                        <Text style={styles.descriptionText}>{item.description}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            keyExtractor={(item, index) => index.toString()} />
                    </View>
                </View>

            </Container>

        )
    }

}



function publicForumState(state) {

    return {
        PublicForum: state.PublicForum
    }
}
export default connect(publicForumState)(PublicForum)
