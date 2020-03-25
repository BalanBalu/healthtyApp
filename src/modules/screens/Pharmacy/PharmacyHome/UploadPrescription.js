import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, View, Footer, FooterTab, Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, AsyncStorage, TextInput, Modal, FlatList, Image, Dimensions, Platform } from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { uploadMultiPart } from '../../../../setup/services/httpservices'
import Autocomplete from '../../../../components/Autocomplete'
import { Loader } from '../../../../components/ContentLoader'
import { getUploadPrescription, removePrescriptionImage } from '../../../providers/pharmacy/pharmacy.action'
const device_width = Dimensions.get("window").width

class UploadPrescription extends Component {
    scrollRef = React.createRef()
    constructor(props) {
        super(props)
        this.state = {
            imageSource: null,
            pharmacyList: [],
            uploadButton: true,
            isLoading: true,
            isImageNotLoaded: true,
            selectOptionPoopup: false,
            prescriptionData: [],
            selectIndex: 0,
        }
    }
    componentDidMount() {
        this.getUploadPrescription()
        // setInterval(() => {
        //     this.setState(prev =>({selectIndex:this.state.selectedIndex === this.state.prescriptionData.length - 1 ? 0 : this.state.selectedIndex + 1}),
        //         () => {
        //             this.scrollRef = this.scrollRef.current.scrollTo({
        //                 animated: true,
        //                 y: 0,
        //                 x: device_width * this.state.selectIndex
        //             })
        //         })


        // }, 3000);



    }
    async  getUploadPrescription() {
        userId = await AsyncStorage.getItem('userId');
        result = await getUploadPrescription(userId)
        console.log(JSON.stringify(result))
        if (result.success) {
            this.setState({ prescriptionData: result.data[0].prescriptionData, prescriptionId: result.data[0]._id })

        }
    }

    uploadProfilePicture(type) {
        if (type == "Camera") {
            ImagePicker.openCamera({
                cropping: true,
                width: 500,
                height: 500,
                // cropperCircleOverlay: true,
                compressImageMaxWidth: 640,
                compressImageMaxHeight: 480,
                freeStyleCropEnabled: true,
            }).then(image => {
                this.setState({ selectOptionPoopup: false });
                console.log(image);
                this.uploadImageToServer(image);
            }).catch(ex => {
                this.setState({ selectOptionPoopup: false });
                console.log(ex);
            });
        } else {
            ImagePicker.openPicker({
                // multiple: true,
                width: 300,
                height: 400,
                cropping: true,
                // cropperCircleOverlay: true,
                freeStyleCropEnabled: true,
                avoidEmptySpaceAroundImage: true,
            }).then(image => {
                console.log(image);

                this.setState({ selectOptionPoopup: false });
                this.uploadImageToServer(image);
            }).catch(ex => {
                this.setState({ selectOptionPoopup: false });
                console.log(ex);
            });
        }
    }

    /*Save Image to Database*/
    uploadImageToServer = async (imagePath) => {

        try {
            const userId = await AsyncStorage.getItem('userId');
            var formData = new FormData();
            console.log(imagePath)
            if (Array.isArray(imagePath) && imagePath.length != 0) {
                imagePath.map((ele) => {
                    formData.append("prescription", {
                        uri: ele.path,
                        type: 'image/jpeg',
                        name: 'photo.jpg'
                    });
                });
            } else {
                formData.append("prescription", {
                    uri: imagePath.path,
                    type: 'image/jpeg',
                    name: 'photo.jpg'
                });
            }
            debugger
            let endPoint = `/medicine_orders/prescription/user/${userId}`
            console.log(endPoint + 'endpoint');
            var res = await uploadMultiPart(endPoint, formData);


            const response = res.data;
            if (response.success) {
                console.log("succcss")
                this.getUploadPrescription()
                Toast.show({
                    text: 'Prescription Uploaded Successfully',
                    duration: 3000,
                    type: 'success'
                });



            } else {
                Toast.show({
                    text: 'Problem Uploading Profile Picture',
                    duration: 3000,
                    type: 'danger'
                });

            }


        } catch (e) {
            Toast.show({
                text: 'Problem Uploading Profile Picture' + e,
                duration: 3000,
                type: 'danger'
            });
            console.log(e);
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
            const { prescriptionData, selectIndex } = this.state

            const userId = await AsyncStorage.getItem('userId');
            result = await removePrescriptionImage(prescriptionData[selectIndex], userId)
            if (result.success) {
                let temp = prescriptionData
                temp.splice(selectIndex, 1)
                this.setState({ prescriptionData: temp ,isLoading: true })
            }


        }
        catch (e) {
            console.log(e)
        }
        finally {
            this.setState({ isLoading: true })
        }
    }

    render() {

        const { imageSource, isLoading, prescriptionData, prescriptionId, selectIndex } = this.state;

        return (
            <Container style={styles.container}>
                {isLoading !== true ? <Loader style={'appointment'} /> :
                    <Content >
                        <View >
                            {prescriptionData.length === 0 ?
                                <TouchableOpacity onPress={() => this.setState({ selectOptionPoopup: true })}>

                                    <Thumbnail square style={styles.profileImage} source={require('../../../../../assets/images/prescription_upload.png')} />
                                </TouchableOpacity>
                                :

                                <View>
                                    <FlatList horizontal pagingEnabled
                                        data={prescriptionData}
                                        extraData={selectIndex}
                                        onMomentumScrollEnd={this.setSelectedIndex}
                                        ref={this.scrollRef}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) =>
                                            <View>
                                                <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                                    <Image
                                                        source={{ uri: item.prescription_path }}
                                                        style={styles.profileImage}
                                                    />
                                                </Item>


                                                <View style={styles.circleDev}>
                                                    <View key={item} style={[styles.whiteCircle, { opacity: index === selectIndex ? 0.5 : 1 }]} />

                                                </View>

                                            </View>

                                        } />
                                    <Row style={{ justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={() => this.removePrescriptionImage()} style={{ marginTop: 20, backgroundColor: '#f9DADB', paddingLeft: 150, paddingRight: 150, paddingTop: 5, paddingBottom: 5, borderRadius: 5 }}>
                                            <Text style={{ fontSize: 14, fontWeight: '500', color: 'red', textAlign: 'center' }}>Delete</Text>
                                        </TouchableOpacity>
                                    </Row>
                                </View>

                            }
                            <Row style={{ width: '100%', }}>
                                <Right>
                                    {imageSource != null ? <Icon name='ios-close' style={styles.customIcons} onPress={() => { this.setState({ imageSource: null, uploadButton: true }) }} /> : null}

                                </Right>
                            </Row>
                        </View>
                        {/* {prescriptionData.length !== 0 ?
                                <Row style={{ alignSelf: 'center', justifyContent: 'center', paddingLeft: 50, paddingRight: 50, alignItems: 'center' }}>
                                    <Col size={5} style={{ width: '50%', justifyContent: 'center', marginLeft: 30 }}>
                                        <Button style={{ borderRadius: 5, height: 35 }} onPress={() => this.setState({ selectOptionPoopup: true })}>
                                            <Text style={{ fontSize: 12 }}>Add more</Text>
                                        </Button>
                                    </Col>
                                    <Col size={5} style={{ width: '40%', justifyContent: 'center', marginLeft: 30, color: '#fff' }}>
                                        <Button style={{ borderRadius: 5, height: 35, color: '#fff' }} onPress={() => this.props.navigation.navigate('ChosePharmacyList', { prescriptionId: prescriptionId })}>
                                            <Text style={{ fontSize: 12 }} >Buy Now</Text>
                                        </Button>
                                    </Col>

                                </Row> : null} */}
                        {/* </ScrollView> */}
                        <Modal
                            visible={this.state.selectOptionPoopup}
                            transparent={true}
                            animationType={'fade'}
                        >
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.5)'
                            }}>
                                <View style={{
                                    width: '80%',
                                    backgroundColor: '#fff',
                                    borderColor: 'gray',
                                    borderWidth: 3,
                                    padding: 30,
                                    borderRadius: 5
                                }}>


                                    <Text style={{ fontSize: 26, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center' }}> Select a Photo  </Text>
                                    {/* </Item> */}

                                    <Button transparent style={{ paddingTop: 5, paddingBottom: 5 }} onPress={() => this.uploadProfilePicture("Camera")} testID='chooseCemara'>
                                        <Text style={{ fontSize: 20, fontFamily: 'OpenSans', marginTop: 10 }}>Take Photo</Text>
                                    </Button>
                                    <Button transparent style={{ paddingTop: 5, paddingBottom: 5 }} onPress={() => this.uploadProfilePicture("Library")} testID='chooselibrary'>
                                        <Text style={{ fontSize: 20, fontFamily: 'OpenSans', marginTop: 10 }}>Choose from Library</Text>
                                    </Button>

                                    <Row style={{ marginTop: 50, marginBottom: 10 }}>
                                        <Right style={{ marginTop: 15 }} >
                                            <Button transparent style={{ marginTop: 15, alignItems: 'flex-end' }}

                                                onPress={() => this.setState({ selectOptionPoopup: false })}
                                                testID='cancleButton'>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 20, }}> Cancel</Text>
                                            </Button>
                                        </Right>
                                    </Row>
                                </View>

                            </View>
                        </Modal>

                    </Content>
                }
                {prescriptionData.length !== 0 ?
                    <Footer style={
                        Platform.OS === "ios" ?
                            { height: 30 } : { height: 45 }}>
                        <FooterTab>
                            <Row>
                                <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                                    <TouchableOpacity onPress={() => this.setState({ selectOptionPoopup: true })} >
                                        <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#7F49C3', fontWeight: '400' }}>Add More </Text>
                                    </TouchableOpacity>
                                </Col>

                                <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#8dc63f' }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ChosePharmacyList', { prescriptionId: prescriptionId })}>
                                        <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#fff', fontWeight: '400' }}>Buy Now</Text>
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                        </FooterTab>
                    </Footer> : null}
            </Container>
        )
    }
}
export default UploadPrescription

const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',

    },

    profileImage:
    {
        marginLeft: 'auto',
        marginRight: 'auto',
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

    }
})





