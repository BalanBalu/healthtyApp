import React, { Component } from 'react';
import {
    Container, Content, View, Text, Title, Header, H3, Button, Item, Card,
    CardItem, List, ListItem, Left, Right, Thumbnail,
    Body, Icon, ScrollView, Spinner } from 'native-base';
import { StyleSheet, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';
import { getPatientWishList } from '../../providers/bookappointment/bookappointment.action';
import { Loader } from '../../../components/ContentLoader';


class WishList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            favouriteList:[],
            isLoading: false,
        }
    }

    componentDidMount() {
         this.getfavouritesList();
    }

    getfavouritesList = async () => {
        try {
           this.setState({isLoading:true});
           debugger 
           let userId = await AsyncStorage.getItem('userId');
           let result = await getPatientWishList(userId);
           if (result.success) {
                this.setState({isLoading:false});
                this.setState({ favouriteList: result.status });
            }
        }
        catch (e) {
            console.log(e)
        } finally {
            this.setState({isLoading:false});
        }
    }
  



    // noFavouriteList() {
    //     alert('no doctors');
    //     return (
    //         <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', height: 300 }}>
    //             <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }} > There is no Doctors </Text>
    //         </Item>
    //     )
    // }

    render() {
        const { isLoading, favouriteList } = this.state;
        return (
            <Container style={styles.container}>

                <Content style={styles.bodyContent}>
                {isLoading ?
                    <Loader style='list' />
                    : null}

            <FlatList
                data={this.state.favouriteList}
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                // {item == null ? this.noFavouriteList() :
              
                    <Card style={{ padding: 5, borderRadius: 10 }}>
                        <List>
                            <ListItem avatar noBorder>
                            <Left>
                                                {
                                                    item.doctorInfo.profile_image != undefined
                                                        ? <Thumbnail square source={item.doctorInfo.profile_image.imageURL} style={{ height: 60, width: 60 }} />
                                                        : <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 60, width: 60 }} />
                                                }
                                            </Left>

                                <Body>
                                    <Text style={{ fontFamily: 'OpenSans' }}> 
                                    { item.doctorInfo.first_name + ' ' + item.doctorInfo.last_name}
                                     </Text>
                                </Body>
                            </ListItem>
                        </List>
                    </Card>
                // }
                } />
            
                                </Content>
                            </Container>
        )
    }

}

const styles = StyleSheet.create({
    container:
    {
        backgroundColor: '#ffffff',
    },
    bodyContent: {
        padding: 5
    },
});

export default WishList