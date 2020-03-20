import React, { Component } from 'react';
import { Container, Content, Text, Radio, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, View, Segment, Col, Row, } from 'native-base';
import { Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getSelectedMedicineDetails, getMedicineReviews, getAllMedicineReviews, getMedicineReviewsCount } from '../../../providers/pharmacy/pharmacy.action'
import { relativeTimeView } from '../CommomPharmacy';
import Spinner from '../../../../components/Spinner';


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
    getAllMedicineReviewDetails = async () => {
        try {
            this.setState({ isLoading: true });
            let medicineId = this.props.navigation.getParam('medicineId');
            let result = await getAllMedicineReviews(medicineId);
            console.log("result", result)
            if (result.success) {
                this.setState({ viewAllReviewData: result.data })
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
                <Content style={styles.bodyContent}>
                    {this.state.isLoading ? <Spinner color='blue' /> :
                        this.state.viewAllReviewData !== null ?
                            <FlatList
                                data={this.state.viewAllReviewData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) =>
                                    <View style={styles.borderView}>
                                        <Row>
                                            <Col size={5} style={{ flexDirection: 'row' }}>
                                                <Text style={styles.desText}>{item.is_anonymous ? 'Medflic User' : item.userInfo.first_name + '' + item.userInfo.last_name}</Text>
                                                <View style={styles.viewRating}>
                                                    <Icon name="ios-star" style={{ color: '#fff', fontSize: 10 }} />
                                                    <Text style={styles.ratingText}>{item.rating}</Text>

                                                </View>
                                            </Col>
                                            <Col size={5}>
                                                <Text style={styles.dateText}>{relativeTimeView(item.review_date)}</Text>
                                            </Col>
                                        </Row>
                                        <Text style={styles.contentText}>{item.comments}</Text>
                                    </View>
                                } />
                            : <Text style={{ fontSize: 10, justifyContent: 'center', alignItems: 'center' }}>No Reviews Were found</Text>}


                    }
                </Content>
            </Container>
        )
    }
}

export default ViewAllReviews

const styles = StyleSheet.create({
    container: {
        padding: 5
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
    }
}
)

