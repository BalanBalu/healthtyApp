import React, { PureComponent } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Radio, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox, FooterTab, } from 'native-base';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { NavigationEvents } from 'react-navigation';
import { StyleSheet, Image, TouchableOpacity, View, BackHandler, Dimensions, AsyncStorage } from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import ImageViewer from 'react-native-image-zoom-viewer';
import ZoomImageViewer from '../../elements/ImageViewer/ZoomImageViewer';
import { getMedicalRecords } from '../../providers/profile/profile.action';
import { RenderListNotFound } from '../CommonAll/components'
import Spinner from "../../../components/Spinner";
import { RenderFooterLoader } from '../../common';
class MedicineRecords extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            imageZoomViewer: false,
            isLoading: false,
            data: [],
            fromNavigation: null,
            selectedEmrData: [],
            selectedIndex: -1


        }
        this.skip = 0
        this.limit = 10
        this.onEndReachedCalledDuringMomentum = true;
    }
    componentDidMount() {
        let fromNavigation = this.props.navigation.getParam('fromNavigation') || null
        this.setState({ fromNavigation })
        this.getMedicalRecords()
    }
    async getMedicalRecords() {
        this.setState({ isLoading: true })
        let userId = await AsyncStorage.getItem('userId');
        let data = this.state.data
        let result = await getMedicalRecords(userId, this.skip, this.limit)

        if (result.success) {
            
     
            data = this.state.data.concat(result.data)

        }

        this.setState({ data: data, isLoading: false })
    }
    headerComponent() {
        const { data } = this.state
        return (
            <View style={{ padding: 10, }}>
                <Row style={styles.SearchRow}>

                    <Col size={9.1} style={{ justifyContent: 'center', }}>
                        <Input
                            placeholder="Search for Your EMR details"
                            style={styles.inputfield}
                            placeholderTextColor="#909498"
                            keyboardType={'email-address'}
                            underlineColorAndroid="transparent"
                            blurOnSubmit={false}
                        />
                    </Col>
                    <Col size={0.9} style={styles.SearchStyle}>
                        <TouchableOpacity style={{ justifyContent: 'center' }}>
                            <Icon name="ios-search" style={{ color: 'gray', fontSize: 20, padding: 2 }} />
                        </TouchableOpacity>
                    </Col>

                </Row>
                {data.length === 0 ?

                    <RenderListNotFound
                        text={'No medical Records found'}
                    />
                    : null}
                <Row style={{ marginTop: 15 }}>
                    <Right>
                        <TouchableOpacity style={{ backgroundColor: '#7E49C3', paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5, borderRadius: 5 }} onPress={() => {
                            this.props.navigation.navigate('UploadEmr', { prevState: this.props.navigation.state })
                        }}>
                            <Text style={{ color: '#fff', fontSize: 15 }} >Upload</Text>
                        </TouchableOpacity>
                    </Right>
                </Row>
            </View>
        )
    }

    async SelectedItem(index, item) {

        let temp = this.state.selectedEmrData
        if (!temp.includes(item._id)) {
            temp.push(item._id)
        } else {
            let index = temp.findIndex(ele => { return ele == item._id })

            temp.splice(index, 1)

        }

        await this.setState({ selectedEmrData: temp, selectedIndex: index })

    }
    async proceed() {
        this.props.navigation.navigate('EmrInfo', { emrData: this.state.selectedEmrData })
    }
    pageRefresh = async (navigationData) => {

        //    if(navigationData.params.hasEmrReload){
        this.skip = 0
        this.limit = 10
        this.setState({ data: [] })
        this.getMedicalRecords()

        //    }


    }
    handleLoadMore = async () => {

        if (!this.onEndReachedCalledDuringMomentum) {
            console.log('On Hanndle loading ' + this.state.skip);

            this.onEndReachedCalledDuringMomentum = true;
            this.skip = this.skip + this.limit
            await this.setState({ footerLoading: true });

            await this.getMedicalRecords()


            this.setState({ footerLoading: false })

        }
    }


    render() {
        const { imageZoomViewer, data, fromNavigation, selectedEmrData, selectedIndex, isLoading } = this.state;
        const images = [{ image: require('../../../../assets/images/uploadedPrescription.jpg'), description: 'MRI Scan' },
        { image: require('../../../../assets/images/uploadedPrescription.jpg'), description: 'CT Scan' }, { image: require('../../../../assets/images/uploadedPrescription.jpg'), description: 'ECG Scan' },
        { image: require('../../../../assets/images/uploadedPrescription.jpg'), description: 'X ray Scan' }, { image: require('../../../../assets/images/uploadedPrescription.jpg'), description: 'MRI Scan' }, { image: require('../../../../assets/images/uploadedPrescription.jpg'), description: 'ECG Scan' },
        { image: require('../../../../assets/images/uploadedPrescription.jpg'), description: 'CT Scan' },]
        return (
            <Container style={styles.container}>
                {/* <Content> */}
                <NavigationEvents
                    onWillFocus={payload => { this.pageRefresh(payload) }}
                />

                <Spinner
                    color="blue"
                    style={[styles.containers, styles.horizontal]}
                    visible={isLoading}
                    size={"large"}
                    overlayColor="none"
                    cancelable={false}
                />

                <View style={{ flex: 1 }}>

                    <FlatList horizontal={false} numColumns={2}
                        data={data}
                        extraData={this.state}
                        ListHeaderComponent={() => this.headerComponent()}
                        onEndReached={() => this.handleLoadMore()}
                        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                        onEndReachedThreshold={0.5}
                        scrollEventThrottle={16}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) =>

                            //  <TouchableOpacity onPress={() => {
                            //     this.props.navigation.navigate('ZoomImageViewer', { images: images.map(ele => {
                            //         return {
                            //             url: '',
                            //             props: {
                            //                 source: ele.image
                            //             }     
                            //          }
                            //     })  })
                            //    // this.setState({ imageZoomViewer : true })
                            // }}>
                            item.emr_prescription_image ?
                                <Card style={{ borderRadius: 5, overflow: 'hidden' }}>
                                    <Row style={styles.rowStyle}>
                                        <Image
                                            source={{ uri: item.emr_prescription_image.imageURL }}
                                            style={{
                                                width: '100%', height: '100%', alignItems: 'center'
                                            }}
                                        />
                                    </Row>
                                    <Row style={styles.secondRow}>
                                        <Col style={{ width: '80%' }}>
                                            <Text style={styles.mainText}>{item.emr_discription}</Text>
                                        </Col>
                                        {fromNavigation === 'APPOINTMENT_PREPARE' ?
                                            <Col style={{ width: '20%' }}>
                                                <View style={{ marginTop: 10, alignItems: 'flex-end', marginRight: 20 }}>
                                                    <CheckBox style={{ borderRadius: 5 }}
                                                        checked={selectedEmrData.includes(item._id) === true}
                                                        onPress={() => this.SelectedItem(index, item)}
                                                    />
                                                </View>
                                            </Col> : null}

                                    </Row>

                                </Card> : null


                            // </TouchableOpacity>


                        } />
                    {fromNavigation === 'APPOINTMENT_PREPARE' ? <Footer style={
                        Platform.OS === "ios" ?
                            { height: 40 } : { height: 45 }}>
                        <FooterTab>
                            <Row>
                                <Col size={5} style={{ backgroundColor: '#4E85E9' }}>
                                    <Row style={{ alignItems: 'center', justifyContent: 'center', }}>
                                        <TouchableOpacity style={styles.buttonTouch} onPress={() => this.proceed()} >
                                            <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#000', fontWeight: '400' }}>back</Text>
                                        </TouchableOpacity>
                                    </Row>
                                </Col>
                                <Col size={5} style={{ backgroundColor: '#8dc63f' }}>
                                    <Row style={{ alignItems: 'center', justifyContent: 'center', }}>
                                        <TouchableOpacity style={styles.buttonTouch} onPress={() => this.proceed()} >
                                            <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#fff', fontWeight: '400' }}> continue</Text>
                                        </TouchableOpacity>
                                    </Row>
                                </Col>
                            </Row>
                        </FooterTab>

                    </Footer>
                        : null}
                    <RenderFooterLoader footerLoading={this.state.footerLoading} />

                </View>

                {/* </Content> */}
            </Container>




        )
    }

}


export default MedicineRecords


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#D6C9EA'
    },

    bodyContent: {


    },
    innerText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        marginTop: 5

    },

    rowStyle: {
        height: 125,
        width: '100%',
        overflow: 'hidden',
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center'
    },
    secondRow: {
        paddingTop: 2,
        paddingBottom: 2,
        width: '100%',
        paddingTop: 5,
        borderTopColor: '#909498',
        borderTopWidth: 0.3,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 5,
    },
    SearchRow: {
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 0.5,
        height: 35,
        marginTop: 10, borderRadius: 5
    },
    inputfield: {
        color: 'gray',
        fontFamily: 'OpenSans',
        fontSize: 12,
        padding: 5,
        paddingLeft: 10
    },
    SearchStyle: {

        width: '85%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 5
    },
    buttonTouch: {
        flexDirection: 'row',
        borderRadius: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    touchText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    },
});