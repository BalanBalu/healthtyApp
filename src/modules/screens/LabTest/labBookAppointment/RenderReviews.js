import React, { PureComponent } from 'react';
import { Container, Content, Text, Segment, Button, Card, Right, Thumbnail, Icon, Toast, Item, Footer, Spinner, List, ListItem, Left, Body } from 'native-base'; import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Image } from 'react-native';
import styles from '../styles';
import StarRating from 'react-native-star-rating';

export default class RenderReviews extends PureComponent {
    constructor(props) {
        super(props)
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return nextProps.shouldUpdate !== this.props.shouldUpdate;
    // }

    render() {
        const { } = this.props;
        return (
            // <Content>
            <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>

                <List>
                    <ListItem avatar>
                        <Left>
                            <Thumbnail circular source={require('../../../../../assets/images/profile_male.png')} style={{ height: 60, width: 60 }} />
                        </Left>
                        <Body>
                            <Text numberOfLines={1} style={{ fontFamily: 'OpenSans', fontSize: 12 }}>John Britto </Text>

                            <Text style={{ fontSize: 12, marginLeft: -5, marginTop: 5, fontFamily: 'OpenSans', fontSize: 12 }}>  4-11-19 </Text>
                            <View style={{ marginTop: 5 }}>
                                <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                                    disabled={false}
                                    maxStars={5}
                                />
                            </View>
                            <Text note style={styles.commentText}>Good</Text>
                        </Body>
                    </ListItem>
                    <ListItem avatar style={{ borderTopColor: 'gray', borderTopWidth: 0.6 }}>
                        <Left>
                            <Thumbnail circular source={require('../../../../../assets/images/profile_male.png')} style={{ height: 60, width: 60 }} />
                        </Left>
                        <Body>
                            <Text numberOfLines={1} style={{ fontFamily: 'OpenSans', fontSize: 12 }}>John Williams </Text>

                            <Text style={{ fontSize: 12, marginLeft: -5, marginTop: 5, fontFamily: 'OpenSans', fontSize: 12 }}>  8-10-19 </Text>
                            <View style={{ marginTop: 5 }}>
                                <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                                    disabled={false}
                                    maxStars={5}
                                />
                            </View>
                            <Text note style={styles.commentText}>Good</Text>
                        </Body>
                    </ListItem>
                    {/* <Text style={{ alignItems: 'center' ,fontFamily:'OpenSans',fontSize:12,marginLeft:60,fontWeight:'bold',borderTopColor:'gray',borderTopWidth:0.6}} >No Reviews Were found</Text> */}
                </List>
                <Grid>
                    <Col style={{ width: '50%' }}></Col>
                    <Col style={{ width: '50%' }}>


                        <Button iconRight transparent style={{ marginLeft: 50 }}>
                            <Icon name='add' />
                            <Text style={styles.reviewText}>More Reviews</Text>
                        </Button>
                    </Col>
                </Grid>

            </Card>
            // </Content>
        )
    }
}
