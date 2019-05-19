import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card,
     CardItem, List, ListItem, Left, Right, Thumbnail,
      Body, Icon, locations, ScrollView, ProgressBar } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { userReviews } from '../../providers/profile/profile.action';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Image, TouchableOpacity, View, FlatList, AsyncStorage } from 'react-native';
import StarRating from 'react-native-star-rating';


class Reviews extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data:[],            
            starCount: 3.5
                    }
                }
    
                componentDidMount(){
                 this.getUserReview();
                }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }
    getUserReview = async () => {

         //let doctorId = await AsyncStorage.getItem('doctorId');
          let doctorId = "5ce01ae8d28ab8073515a6f6";
         try{

           let result = await userReviews(doctorId,'doctor'); 
           console.log("sathish is that coming now");         
            if (result.success) {   
               await this.setState({ data: result.data })
            }
            
            console.log(this.state.data);
        }   
        catch (e) {
            console.log(e)
        }   
    }  
    
    render() {
        const { user: { isLoading } } = this.props;
        return (

            <Container style={styles.container}>
              <Content style={styles.bodyContent}>
            
                <FlatList
                 data={this.state.data}    
                 extraData={this.state}
                 keyExtractor={(item, index) => index.toString()}
                 renderItem={({ item, index }) =>
                    <Card style={{ padding: 5, borderRadius: 10 }}>
                        <List>
                            <ListItem avatar noBorder>
                                <Left>
                                    <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 60, width: 60 }} />
                                </Left>
                                <Body>
                                    <Text style={{ fontFamily: 'OpenSans' }}> {item.userInfo.first_name || 'MedFlic User'} </Text>
                                    <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 100 }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={this.state.starCount}
                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    />
                                    <Text note> {item.reviews}  </Text>
                                                                       
                                    <Grid style={{ marginTop: 5 }}>
                                        <Row>
                                            <Col style={{ width: '30%' }} >
                                                <Item style={{ borderBottomWidth: 0 }}><Icon name='heart' style={{ color: 'red', fontSize: 20 }}></Icon>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: 'gray' }}>Like</Text>
                                                </Item>
                                            </Col>
                                            <Col style={{ width: '30%' }}>
                                                <Item style={{ borderBottomWidth: 0 }}><Icon name='text' style={{ color: 'red', fontSize: 20 }}></Icon>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: 'gray' }}>
                                                {item.comments}</Text>
                                                </Item>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </Body>
                                <Right>
                                    <Text note>3hrs </Text>
                                </Right>
                            </ListItem>
                        </List>
                        </Card>  
         }/>      
                      
               
               
                </Content>
            </Container>
        )
    }
}

function loginState(state) {
    return {
        user: state.user
    }
}
export default connect(loginState, { login, messageShow, messageHide })(Reviews)
const styles = StyleSheet.create({
    container:
    {
        backgroundColor: '#ffffff',
    },
    bodyContent: {
        padding: 5
    },
});