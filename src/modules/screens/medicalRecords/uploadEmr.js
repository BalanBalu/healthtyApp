import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, View, Footer, FooterTab, Form } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { StyleSheet, FlatList, Image, Dimensions, Platform, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { hasLoggedIn } from '../../providers/auth/auth.actions';
import { Loader } from '../../../components/ContentLoader'
import { ImageUpload } from '../../screens/commonScreen/imageUpload'
import { uploadImage, createEmrUpload } from '../../providers/common/common.action'
import { toastMeassage, onlySpaceNotAllowed } from '../../../modules/common';
import { RenderTextReason } from '../CommonAll/components';

const device_width = Dimensions.get("window").width

class UploadEmr extends Component {
    scrollRef = React.createRef()
    constructor(props) {
        super(props)
        this.state = {
            imageSource: null,

            uploadButton: true,
            isLoading: true,
            selectOptionPoopup: false,
            imageData: [],
            selectIndex: 0,
        }
    }
    async componentDidMount() {

        const isLoggedIn = await hasLoggedIn(this.props);
        if (!isLoggedIn) {
            this.props.navigation.navigate('login');
            return
        }



    }


    uploadImageToServer = async (imagePath) => {

        try {
            const userId = await AsyncStorage.getItem('userId');
            let appendForm = "medicine"
            let endPoint = 'images/upload'
            const response = await uploadImage(imagePath, endPoint, appendForm)

            if (response.success) {
                let data = this.state.imageData;
                let temp = data.concat(response.data)

                this.setState({ imageData: temp })
                toastMeassage('image upload successfully', 'success', 3000)

            } else {
                toastMeassage('Problem Uploading Picture', 'danger', 3000)
            }

        } catch (e) {
            toastMeassage('Problem Uploading Picture' + e, 'danger', 3000)

        }
    }

    setSelectedIndex = event => {
        try {


            const viewSize = event.nativeEvent.layoutMeasurement.width;
            const contentOffset = event.nativeEvent.contentOffset.x;
            const selectIndex = Math.round(contentOffset / viewSize)
            this.setState({ selectIndex })


        } catch (e) {
            console.log(e)
        }
    }
    removePrescriptionImage = async () => {
        try {
            this.setState({ isLoading: false })
            const { imageData, selectIndex } = this.state
            let temp = imageData
            temp.splice(selectIndex, 1)

            await this.setState({ imageData: temp, isLoading: true })



        }
        catch (e) {
            console.log(e)
        }
        finally {
            this.setState({ isLoading: true })
        }
    }
    imageUpload = async (data) => {
        this.setState({ selectOptionPoopup: false })
        if (data.image !== null) {
            await this.uploadImageToServer(data.image);

        }
    }
    async EmrUpload() {
        // discription
        if (!onlySpaceNotAllowed(this.state.discription)) {
            toastMeassage('kindly write discription', 'success', 3000)
            return
        }

        let userId = await AsyncStorage.getItem('userId');
        let reqata = {
            user_id: userId,
            emr_type: 'PRESCRIPTION_IMAGE',
            emr_discription: this.state.discription,
            emr_prescription_image: this.state.imageData,
            updated_by:'USER'
        }
        let result = await createEmrUpload(reqata)
       
        if (result.success) {
            toastMeassage('EMR upload successfully', 'success', 3000)
            this.setState({ imageData: [], discription: '' })
            const { routeName, key } = this.props.navigation.getParam('prevState');
            this.props.navigation.navigate({ routeName, key, params: { hasEmrReload: true } })
        } else {
            toastMeassage(result.measage, 'success', 3000)
        }

    }

    render() {

        const { imageSource, isLoading, imageData, prescriptionDetails, selectIndex } = this.state;

        return (
            <Container style={styles.container}>
                {isLoading !== true ? <Loader style={'appointment'} /> :
                    <Content style={{ flex: 1, }}>
                        <View >
                            {imageData.length === 0 ?
                                <TouchableOpacity onPress={() => this.setState({ selectOptionPoopup: true })}>

                                    <Thumbnail square style={styles.profileImage} source={require('../../../../assets/images/prescription_upload.png')} />
                                </TouchableOpacity>
                                :

                                <View>
                                    <FlatList horizontal pagingEnabled
                                        data={imageData}
                                        extraData={selectIndex}
                                        onMomentumScrollEnd={this.setSelectedIndex}
                                        ref={this.scrollRef}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) =>
                                            <View>
                                                <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', marginTop: 10, height: "60%" }}>
                                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: { uri: item.imageURL }, title: 'EMR' })}>
                                                        <Image
                                                            source={{ uri: item.imageURL }}
                                                            style={styles.profileImage}
                                                        />
                                                    </TouchableOpacity>
                                                </Item>


                                                <View style={styles.circleDev}>
                                                    <View key={item} style={[styles.whiteCircle, { opacity: index === selectIndex ? 0.5 : 1 }]} />

                                                </View>

                                            </View>

                                        } />
                                    <View style={{ Flex: 1, marginLeft: 20, marginRight: 20 }}>
                                        <TouchableOpacity onPress={() => this.removePrescriptionImage()} style={{ backgroundColor: '#f9DADB', alignSelf: 'stretch', paddingTop: 8, paddingBottom: 8, marginTop: 5, borderRadius: 5 }}>
                                            <Text style={{ fontSize: 14, fontWeight: '500', color: 'red', textAlign: 'center' }}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            }
                            <Row style={{ width: '100%', }}>
                                <Right>
                                    {imageSource != null ? <Icon name='ios-close' style={styles.customIcons} onPress={() => { this.setState({ imageSource: null, uploadButton: true }) }} /> : null}

                                </Right>
                            </Row>
                        </View>
                        {
                            this.state.selectOptionPoopup ?
                                <ImageUpload
                                    popupVisible={(data) => this.imageUpload(data)}
                                /> : null
                        }
                        {/* <View style={{ Flex: 1, marginLeft: 20, marginRight: 20, marginTop: -30 }}> */}

                        <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 10 }}>
                            <Row>
                                <Icon name="create" style={{ fontSize: 15, color: '#000' }} />
                                <Text style={styles.subText}>EMR discription</Text>
                            </Row>
                            <Form style={{ marginRight: 1, marginLeft: -13 }}>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <TextInput
                                        onChangeText={(discription) => this.setState({ discription })

                                        }
                                        multiline={true} placeholder={''}
                                        placeholderTextColor={"#909498"}
                                        style={{
                                            borderColor: '#909498',
                                            borderRadius: 10,
                                            borderWidth: 0.5,
                                            height: 100,
                                            fontSize: 14,
                                            textAlignVertical: 'top',
                                            width: '100%',
                                            padding: 10,
                                            paddingTop: 10,
                                            paddingBottom: 10,
                                            borderRadius: 10,
                                            paddingRight: 10,
                                            marginTop: 15
                                        }}
                                    />
                                </Item>
                            </Form>
                        </View>

                        {/* </View> */}

                    </Content>
                }
                {imageData.length !== 0 ?
                    <Footer style={
                        Platform.OS === "ios" ?
                            { height: 30 } : { height: 45 }}>
                        <FooterTab>
                            <Row>
                                <Col size={5} style={{ backgroundColor: '#fff' }}>
                                    <Row style={{ alignItems: 'center', justifyContent: 'center', }}>
                                        <TouchableOpacity onPress={() => this.setState({ selectOptionPoopup: true })} style={styles.buttonTouch}>
                                            <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#128283', fontWeight: '400' }}>Add More </Text>
                                        </TouchableOpacity>
                                    </Row>
                                </Col>

                                <Col size={5} style={{ backgroundColor: '#8dc63f' }}>
                                    <Row style={{ alignItems: 'center', justifyContent: 'center', }}>
                                        <TouchableOpacity onPress={() => this.EmrUpload()} style={styles.buttonTouch}>
                                            <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#fff', fontWeight: '400' }}>upload</Text>
                                        </TouchableOpacity>
                                    </Row>
                                </Col>
                            </Row>
                        </FooterTab>
                    </Footer> : null}
            </Container>
        )
    }
}
export default UploadEmr

const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
        flex: 1
    },

    profileImage:
    {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10,
        width: Dimensions.get('window').width - 10,
        height: Dimensions.get('window').height - 200,
        justifyContent: 'center',
        borderColor: '#f5f5f5',
        alignItems: 'center',

    },
    searchBox: {
        width: '100%',
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 35,
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
        padding: 20
    },
    customIcons:
    {
        backgroundColor: 'black',
        borderRadius: 20,
        justifyContent: 'center',
        color: '#fff',
        marginLeft: 150,
        textAlign: 'center',
        marginTop: -260,
        fontSize: 25,
        height: 25,
        width: 25,
        fontWeight: 'bold'
    },
    circleDev: {
        position: 'absolute',
        bottom: 15,
        height: 15,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center'
    },
    whiteCircle: {
        width: 6,
        height: 6,
        borderRadius: 3,
        margin: 5,
        backgroundColor: '#fff'

    },
    buttonTouch: {
        flexDirection: 'row',
        borderRadius: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },

})





