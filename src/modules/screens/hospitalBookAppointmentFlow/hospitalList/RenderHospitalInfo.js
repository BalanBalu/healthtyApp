import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image } from 'react-native';
import StarRating from 'react-native-star-rating';
import { RenderFavoritesComponent, onPressPreviewImagesInZoom, SingleImageViewInSquareShape } from '../../../screens/CommonAll/components';
import { hospitalProfileImages, getKiloMeterCalculation } from '../../../common'
import styles from '../Styles'
import {primaryColor, secondaryColor} from '../../../../setup/config'

export default class RenderHospitalInfo extends Component {
    constructor(props) {
        super(props)
    }
    getHospitalFee(data,category_id){
        let fee =200;
       if(data.categories_data){

let find_categories_data=data.categories_data.find(ele=>{
    return ele.category_id===category_id })

if(find_categories_data){
    fee=find_categories_data.fees;
}
        }
        return fee
          }

    render() {
        const { item, index, navigation, hospitalInfo: { isLoggedIn, userLocDetails, patientFavoriteListCountOfHospitalAdminIds, hospitalFavoriteListCountOfHospitalAdminIds }, addToFavoritesList, openDateTimePicker,category_id } = this.props;
        return (
            <Card style={styles.doctorListStyle}>
                <List style={{ borderBottomWidth: 0 }}>
                    <Grid >
                        <Row >
                            <Col size={2}>
                                {item.profile_image && item.profile_image.length ?
                                    <TouchableOpacity onPress={() => onPressPreviewImagesInZoom(item.profile_image, navigation)} >
                                        <SingleImageViewInSquareShape
                                            source={hospitalProfileImages(item)}
                                            style={{ height: 60, width: 60, borderRadius: 60 / 2 }}
                                        >
                                        </SingleImageViewInSquareShape>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => navigation.navigate("ImageView", { passImage: hospitalProfileImages(item), title: 'Profile photo' })}>
                                        <SingleImageViewInSquareShape
                                            source={hospitalProfileImages(item)}
                                            style={{ height: 60, width: 60, borderRadius: 60 / 2 }}
                                        >
                                        </SingleImageViewInSquareShape>
                                    </TouchableOpacity>
                                }
                            </Col>
                            <Col size={6}>
                                <Row >
                                    <Text style={styles.commonStyle}>{item.name}</Text>
                                </Row>
                                <Row >
                                    <Text note style={styles.addressTexts}>
                                        {item.location && item.location.address ?
                                            `${item.location && item.location.address && item.location.address.no_and_street} - ${item.location && item.location.address && item.location.address.district}`
                                            : null}
                                    </Text>
                                </Row>
                                {item.mobile_no ?
                                    <Row>
                                        <Icon name="call" style={{
                                            marginTop: 5,
                                            fontFamily: 'OpenSans',
                                            fontSize: 15,
                                            color: primaryColor,
                                            fontWeight: 'bold'
                                        }}></Icon>

                                        <Text style={{
                                            marginLeft: 7,
                                            marginTop: 5,
                                            fontFamily: 'OpenSans',
                                            fontSize: 12,
                                            fontWeight: 'bold'
                                        }} note>{item.contact_name ? item.contact_name : ' N/A'}</Text>
                                    </Row>
                                    : null}
                                <Row style={{ borderTopColor: 'gray', borderTopWidth: 0.3, marginTop: 10 }}>
                                    <Col size={2} style={{ marginTop: 10 }}>
                                        <Text note style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 12 }}> Rating</Text>
                                        <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                                            <StarRating
                                                fullStarColor='#FF9500'
                                                starSize={12}
                                                width={85}
                                                containerStyle={{ marginTop: 2 }}
                                                disabled={true}
                                                rating={1}
                                                maxStars={1}
                                            />
                                            <Text style={[styles.commonStyle, { marginLeft: 5 }]}>0</Text>
                                        </View>
                                    </Col>
                                    <Col size={3} style={{ marginTop: 10 }}>
                                        <Text note style={[styles.commonStyle, { marginLeft: 5 }]}> Favourite</Text>
                                        <Text style={[styles.commonStyle, { marginLeft: 25, fontWeight: 'bold' }]}>{hospitalFavoriteListCountOfHospitalAdminIds[item.hospital_admin_id] !== undefined ? hospitalFavoriteListCountOfHospitalAdminIds[item.hospital_admin_id] : '0'}</Text>
                                    </Col>
                                     <Col size={2}  style={{ marginTop: 10 }}>
                                        <Text note style={[styles.commonStyle, { marginLeft: 5 }]}> Fee</Text>
                                        <Text style={[styles.commonStyle, { marginLeft: 5, fontWeight: 'bold' }]}>{this.getHospitalFee(item,category_id)}</Text>
                                    </Col>
                                    <Col size={2} >
                                        <TouchableOpacity onPress={() => openDateTimePicker(item, index)} style={{ textAlign: 'center', backgroundColor: 'green', borderColor: '#000', marginTop: 10, borderRadius: 18, height: 31, width: 66, justifyContent: 'center', paddingLeft: 1, paddingRight: 1, marginLeft: 20 }}>
                                            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 13, fontWeight: 'bold', fontFamily: 'OpenSans' }}>BOOK </Text>
                                        </TouchableOpacity>
                                    </Col>
                                </Row>
                            </Col>
                            <Col size={2}>
                                <Row>
                                    <Col>
                                        <TouchableOpacity style={styles.heartIconButton} >
                                            <RenderFavoritesComponent
                                                isLoggedIn={isLoggedIn}
                                                isEnabledFavorites={patientFavoriteListCountOfHospitalAdminIds.includes(item.hospital_admin_id)}
                                                onPressFavoriteIcon={() => addToFavoritesList(item.hospital_admin_id)}
                                            />
                                        </TouchableOpacity>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 11, marginLeft: 25, }}>
                                            {item.distInKiloMeter ? item.distInKiloMeter.toFixed(1) + ' Km' : '0 km '}
                                        </Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Grid>
                </List>
            </Card>
        )
    }
}
