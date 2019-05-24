import React, { Component } from 'react';
import { Container, Content, View, Text, Title, Header, H3, Button, Item, Card,
     CardItem, List, ListItem, Left, Right, Thumbnail,
      Body, Icon, locations, ScrollView, ProgressBar } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { userReviews } from '../../providers/profile/profile.action';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Image, TouchableOpacity, FlratingatList, AsyncStorage, FlatList } from 'react-native';
import StarRating from 'react-native-star-rating';


class Reviews extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data:[],            
            starCount: ''
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

    // let doctorId = await AsyncStorage.getItem('doctorId');
             let doctorId =  "5ce38535ecb5b70f90996222";;
         try
         {
           let result = await userReviews(doctorId,'doctor');          
            if (result.success) {  
                console.log(JSON.stringify(result.data))
               await this.setState({ data: result.data })
                           }
                    }   
        catch (e) {
            console.log(e)
        }   
    }   
    
    renderNoReviews(){   
        return (  
     
          <Item style={{ borderBottomWidth: 0, justifyContent:'center',alignItems:'center', height:300 }}>
            <Text  style={{fontSize:20,justifyContent:'center',alignItems:'center'}} > No reviews yet </Text>
          </Item>   
             
      )
    }   

    renderReviews(){
        return(
            <FlatList
                 data={this.state.data}    
                 extraData={this.state}
                 keyExtractor={(item, index) => index.toString()}
                 renderItem={({ item, index }) =>
                    <Card style={{ padding: 5, borderRadius: 10 }}>
                        <List>
                            <ListItem avatar noBorder>
                                <Left>
                                   {
                                item.userInfo.profile_image!=undefined 
                                   ? <Thumbnail square source={item.userInfo.profile_image.imageURL} style={{ height: 60, width: 60 }} />
                                   : <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 60, width: 60 }} /> 
                                   }
                                </Left>
                                <Body>
                                    <Text style={{ fontFamily: 'OpenSans' }}> {item.userInfo.first_name +' '+ item.userInfo.last_name || 'MedFlic User'} </Text>
                                    <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 100 }}
                                        disabled={false}
                                        maxStars={5}
                                        // rating={this.state.starCount}
                                        rating={item.userInfo.overall_rating}
                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    />
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
             <Text note>3hrs </Text>
         </Right>
         </ListItem>
       </List>
     </Card>  
        }/>    
        )
    }
  
    render() {
        const { user: { isLoading } } = this.props;
        return (

            <Container style={styles.container}>
              <Content style={styles.bodyContent}>
                        
         <View>
         {this.state.data == 0 ?this.renderNoReviews()  : this.renderReviews()}                            
         </View>                           
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