import React, { Component } from 'react';
import {
    Container, Content, View, Text, Title, Header, H3, Button, Item, CardItem, Row, Col,
    List, ListItem, Left, Right, Card, Thumbnail, Body, Icon, ScrollView, Spinner,Grid
} from 'native-base';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StarRating from 'react-native-star-rating';

import { userReviews, insertLikesDataForReviews } from '../../providers/profile/profile.action';
import { formatDate, dateDiff } from '../../../setup/helpers';
import { renderProfileImage } from '../../common';
import { RenderReviewData } from './ReviewCard';

class Reviews extends Component {
    constructor(props) {
        super(props)
        this.state = {
            getReviewsData: null,
            isLoading: true,
            userId: null,
            refreshCount : 0
        }
    }
    componentDidMount() {
        this.getUserReview();
    }
   getUserReview = async () => {
        try {
            const {navigation} = this.props;
            if(navigation)
               doctorId= navigation.getParam('reviewDoctorId');
             else 
               doctorId= this.props.doctorId; 
            let userId = await AsyncStorage.getItem('userId');
            let result = await userReviews(doctorId, 'doctor');
            await this.setState({ isLoading: false, userId: userId });
            if (result.success) {
                 this.setState({ getReviewsData: result.data });
            }
        }
        catch (e) {
            console.log(e)
        }
    }
  
    
    renderNoReviews() {
        return (
            <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }}>No reviews yet</Text>
            </Item>
        )
    }

    
    render() {
        
        return (
            <Container style={styles.container}>
                <Content style={styles.bodyContent}>
                {this.state.isLoading ? <Spinner color='blue' /> :    
                  this.state.getReviewsData === null ? this.renderNoReviews() : 
                  <FlatList
                    data={this.state.getReviewsData}
                    extraData={this.state.refreshCount}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item})=>
                        <RenderReviewData 
                            navigation={this.props.navigation}
                            item={item}
                            userId={this.state.userId}
                            refreshCount={()=> this.setState({ refreshCount : this.state.refreshCount + 1}) }
                        />
                    }/>
                }
                   
                </Content>
            </Container>
        )
    }
}


const styles = StyleSheet.create({
    bodyContent: {
       
    },

    button1: {
        borderRadius: 25,
        marginLeft: 10,
        marginTop: 10,
        marginTop: 5
    },
    card: {
        width: 'auto',
        borderWidth: 5,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'black',
    },
    button2: {
        marginLeft: 'auto',
        marginRight: 10,
        height: 25,
        borderRadius: 10,
        width: 80,
        marginBottom: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        marginBottom: 5
    },
    name:{
        fontFamily:'OpenSans',
        fontSize:12,
        fontWeight:'bold',
         width:'80%'
    },
    date:{
        fontFamily:'OpenSans',
        fontSize:12,
    },
    ratingText:{
        fontFamily:'OpenSans',
        fontSize:12,
        fontWeight:'bold',
        marginTop:10
    },
    textContent:{
        fontFamily:'OpenSans',
        fontSize:12,
        marginLeft:3
    }
}
)

export default Reviews