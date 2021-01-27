import React, { Component } from 'react';
import { Container, Content, Text, Radio, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, View, Segment, Col, Row, } from 'native-base';
import { Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getSelectedMedicineDetails, getMedicineReviews, getAllMedicineReviews, getMedicineReviewsCount } from '../../../providers/pharmacy/pharmacy.action'
import { relativeTimeView } from '../CommomPharmacy';
import Spinner from '../../../../components/Spinner';
import { dateDiff, getMoment, formatDate } from '../../../../setup/helpers'
import StarRating from 'react-native-star-rating';
import { renderProfileImage } from '../../../common';


class ViewAllReviews extends Component {
    constructor(props) {
        super(props)
        this.state = {
            viewAllReviewData: [],
            isLoading: false
        }
    }
    componentDidMount() {
        this.getAllMedicineReviewDetails();
    }
    relativeTimeView(review_date) {
        try {
            console.log(review_date)
            var postedDate = review_date;
            var currentDate = new Date();
            var relativeDate = dateDiff(postedDate, currentDate, 'days');
            if (relativeDate > 30) {
                return formatDate(review_date, "DD-MM-YYYY")
            } else {
                return getMoment(review_date, "YYYYMMDD").fromNow();
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    getAllMedicineReviewDetails = async () => {
        try {
            this.setState({ isLoading: true });
            let medicineId = this.props.navigation.getParam('medicineId');
            let result = await getAllMedicineReviews(medicineId);
            console.log("result", result)
            if (result.success) {
                this.setState({ viewAllReviewData: result.data })
                console.log("viewAllReviewData", this.state.viewAllReviewData)

            } else {
                this.setState({ isLoading: false, viewAllReviewData: '' });
            }
        }
        catch (e) {
            console.log(e)
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    render() {

        return (
            <Container style={styles.container}>
                <Content style={{ flex: 1 }}>

                    {this.state.isLoading ? <Spinner color='blue' /> :
                        this.state.viewAllReviewData !== null ?
                            <FlatList
                                data={this.state.viewAllReviewData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) =>
                                    <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>

                                        <View style={styles.borderView}>
                                            <Row>
                                                <Col size={2} style={{ flexDirection: 'row' }}>
                                                    <Thumbnail square source={renderProfileImage(item.userInfo)} style={{ width: 60, height: 60, borderRadius: 60 }} />

                                                </Col>
                                                <Col size={4}>
                                                    <Text style={styles.desText}>{item.is_anonymous ? 'Medflic User' : item.userInfo.first_name + '' + item.userInfo.last_name}</Text>
                                                    <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                                                        disabled={false}
                                                        maxStars={5}
                                                        rating={parseInt(item.rating)}

                                                    />
                                                    <Text style={styles.contentText}>{item.comments}</Text>
                                                </Col>
                                                <View style={{ marginTop: 5 }}>
                                                    <Col size={4}>
                                                        <Text style={styles.dateText}>{this.relativeTimeView(item.review_date)}</Text>
                                                    </Col>
                                                </View>
                                            </Row>
                                        </View>




                                    </Card>

                                } /> : null
                        // :  <Text style={{ alignItems: 'center' ,fontFamily:'OpenSans',fontSize:12,marginLeft:60,fontWeight:'bold',borderTopColor:'gray',borderTopWidth:0.6}} >No Reviews Were found</Text>
                    }
                </Content>
            </Container>
        )
    }
}

export default ViewAllReviews

const styles = StyleSheet.create({
    container: {
        padding: 5,
        flex: 1
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
    ratingText: {
        fontSize: 10,
        fontFamily: 'OpenSans',
        color: '#fff'
    },
    viewRating: {
        backgroundColor: '#8dc63f',
        height: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        paddingLeft: 1,
        paddingRight: 1
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
    }
}
)

