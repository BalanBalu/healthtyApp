import React, { Component } from 'react';
import {
    Container, Content, View, Text, Title, Header, H3, Button, Item, Card,
    CardItem, List, ListItem, Left, Right, Thumbnail,
    Body, Icon, ScrollView, Spinner } from 'native-base';
import { StyleSheet, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';
import StarRating from 'react-native-star-rating';

import { userReviews } from '../../providers/profile/profile.action';
import { formatDate } from '../../../setup/helpers';
//import Spinner from '../../../components/Spinner';


class Reviews extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: null,
            isLoading: true,
            ratingVisible: []
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        debugger
        let doctorId = navigation.getParam('doctorId'); //"5ce01ae8d28ab8073515a6f6";
        this.getUserReview(doctorId);
    }

    getUserReview = async (doctorId) => {
        try {
            this.setState({isLoading:true});
            
            let result = await userReviews(doctorId, 'doctor');
            this.setState({isLoading:false});
            if (result.success) {
                console.log(JSON.stringify(result.data))
                this.setState({ data: result.data });
                this.setState({isLoading:false});
                await this.state.data.forEach(element => {
                    this.state.ratingVisible.push(false);
                });
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    toggleRatingVisible(index) {
        let temp = this.state.ratingVisible;
        temp.splice(index, 1, !temp[index]);
        this.setState({ ratingVisible: temp })
    }

    renderAllRatings(item) {
        return (
            <Body>
                {item.cleanness_rating != undefined ?
                    <Item>
                        <Text style={{ fontFamily: 'OpenSans' }}>Cleanliness Rating</Text>
                        <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 50, alignContent: 'center' }}
                            disabled={true}
                            maxStars={5}
                            rating={item.cleanness_rating}
                        />
                    </Item> : null}
                {item.staff_rating != undefined ?
                    <Item>
                        <Text style={{ fontFamily: 'OpenSans' }}>Staff Rating</Text>
                        <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 50, alignContent: 'center' }}
                            disabled={true}
                            maxStars={5}
                            rating={item.staff_rating}
                        />
                    </Item> : null}
                {item.wait_time_rating != undefined ?
                    <Item>
                        <Text style={{ fontFamily: 'OpenSans' }}>Wait Time Rating</Text>
                        <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 50, alignContent: 'center' }}
                            disabled={true}
                            maxStars={5}
                            rating={item.wait_time_rating}
                        />
                    </Item> : null}
            </Body>
        )
    }

    renderNoReviews() {
        return (
            <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }} > No reviews yet </Text>
            </Item>
        )
    }

    renderReviews() {
        return (
            <FlatList
                data={this.state.data}F
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                    <Card style={{ padding: 5, borderRadius: 10 }}>
                        <List>
                            <ListItem avatar noBorder>
                                <Left>
                                    {
                                        (item.userInfo.profile_image == undefined || item.is_anonymous == true)
                                            ? <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }}
                                                style={{ height: 60, width: 60 }} />
                                            : <Thumbnail square source={item.userInfo.profile_image.imageURL} style={{ height: 60, width: 60 }} />
                                    }
                                </Left>

                                <Body>
                                    <Text style={{ fontFamily: 'OpenSans' }}> {item.is_anonymous == true ? 'Medflic User' :  item.userInfo.first_name + ' ' + item.userInfo.last_name} </Text>
                                    <TouchableOpacity onPress={() => { this.toggleRatingVisible(index) }}>
                                        <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 100 }}
                                            disabled={true}
                                            maxStars={5}
                                            rating={item.overall_rating}
                                        />
                                    </TouchableOpacity>
                                    {
                                        this.state.ratingVisible[index] == true
                                            ? this.renderAllRatings(item)
                                            : null
                                    }
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 18, color: 'gray' }}> {item.comments} </Text>

                                    {/* <Grid style={{ marginTop: 5 }}>
                                            <Row>
                                                <Col style={{ width: '30%' }} >
                                                    <Item style={{ borderBottomWidth: 0 }}><Icon name='heart' style={{ color: 'red', fontSize: 20 }}></Icon>
                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: 'gray' }}>Like</Text>
                                                    </Item>
                                                </Col>
                                                <Col style={{ width: '30%' }}>
                                                    <Item style={{ borderBottomWidth: 0 }}><Icon name='text' style={{ color: 'red', fontSize: 20 }}></Icon>
                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: 'gray' }}>
                                                            comments</Text>
                                                    </Item>
                                                </Col>
                                            </Row>
                                        </Grid> */}

                                </Body>
                                <Right>
                                    <Text note>{formatDate(item.review_date, "DD-MM-YYYY")}</Text>
                                </Right>
                            </ListItem>
                        </List>
                    </Card>
                } />
        )
    }

    render() {
        //  const { user: { isLoading } } = this.state.props;
        return (
            <Container style={styles.container}>
                <Content style={styles.bodyContent}>
                   {this.state.isLoading ? <Spinner color='blue' /> :
                    <View>
                        {this.state.data == null ? this.renderNoReviews() : this.renderReviews()}
                    </View>} 
                      
                    
                     {/* <View>
                        {this.state.data == null ? this.renderNoReviews() : this.renderReviews()}
                    </View> */}
                  
                </Content>
            </Container>
        )
    }
}

export default Reviews
const styles = StyleSheet.create({
    container:
    {
        backgroundColor: '#ffffff',
    },
    bodyContent: {
        padding: 5
    },
});