import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, View, Footer, FooterTab, Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, AsyncStorage, TextInput, Modal ,FlatList} from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { uploadMultiPart } from '../../../../setup/services/httpservices'
import Autocomplete from '../../../../components/Autocomplete'
import { Loader } from '../../../../components/ContentLoader'
import {getUploadPrescription} from '../../../providers/pharmacy/pharmacy.action'


class UploadPrescription extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageSource: null,
            pharmacyList: [],
            uploadButton: true,
            isLoading: true,
            isImageNotLoaded: true,
            selectOptionPoopup: false,
            prescriptionData:[]
        }
    }
    componentDidMount(){
        this.getUploadPrescription()
    }
   async  getUploadPrescription(){
        userId=await AsyncStorage.getItem('userId');
        result=await getUploadPrescription(userId)
          if(result.success){
              this.setState({prescriptionData:result.data})
              
          }
    }

    uploadProfilePicture(type) {
        if (type == "Camera") {
            ImagePicker.openCamera({
                cropping: true,
                width: 500,
                height: 500,
                cropperCircleOverlay: true,
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
                multiple: true,
                width: 300,
                height: 400,
                cropping: true,
                cropperCircleOverlay: true,
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
            if (Array.isArray(imagePath) && imagePath.length!=0) {
                imagePath.map((ele) => {
                    formData.append("prescription", {
                        uri: ele.path,
                        type: 'image/jpeg',
                        name: 'photo.jpg'
                    });
                });
            }else{
                formData.append("prescription", {
                    uri: imagePath.path,
                    type: 'image/jpeg',
                    name: 'photo.jpg'
                });
            }
            debugger
            let endPoint = `medicine/image/order/${userId}`
            console.log(endPoint + 'endpoint');
            var res = await uploadMultiPart(endPoint, formData);


            const response = res.data;
            if (response.success) {
                console.log("succcss")
                Toast.show({
                    text: 'Prescription Uploaded Successfully',
                    duration: 3000,
                    type: 'success'
                });
                this.props.navigation.navigate('ChosePharmacyList',{prescriptionId:response.prescriptionId})

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


    render() {
       
        const { imageSource, isLoading ,prescriptionData} = this.state;

        return (
            <Container style={styles.container}>
                {isLoading !== true ? <Loader style={'appointment'} /> :
                    <Content >
                        <ScrollView>
                            {/* <View style={{ marginTop: 10 }}>
                                <Autocomplete style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', borderRadius: 5, padding: 5, width: '85%',marginLeft: 'auto',marginRight: 'auto',}} 
                                data={this.state.pharmacyList!==undefined?(selectedPharmacy.length === 1 && comp(this.state.keyword, selectedPharmacy[0].name) ? [] : selectedPharmacy):selectedPharmacy}
                                    defaultValue={this.state.keyword}
                                    onChangeText={text => this.setState({ keyword: text })}
                                    placeholder='Select Pharmacy'
                                    listStyle={{ position: 'relative',  marginLeft: 'auto',marginRight: 'auto', width: '100%', marginTop: -3.5 }}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => this.setState({ keyword:selectedPharmacy[0].name==='Pharmacy not found'?null:item.name })}>
                                            <Text style={{ fontFamily: 'OpenSans', borderBottomWidth: 0.3, color: 'gray', marginTop: 2, fontSize: 14 }}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item, index) => index.toString()} />

                            </View>
                            <View style={{marginTop:5}}>
                               <Text style={{marginLeft:10,fontFamily:'OpenSans',color:'red'}}>{this.state.noKeywords}</Text>
                            </View> */}
                    

                            <View >
                                <TouchableOpacity onPress={() => this.setState({ selectOptionPoopup: true })}>
                                    {prescriptionData.length === 0 ?
                                        <Thumbnail square style={styles.profileImage} source={require('../../../../../assets/images/prescription_upload.png')} />
                                        :  <FlatList
                                        data={prescriptionData}
                                        extraData={this.state}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) =>
                                        <Thumbnail square style={styles.profileImage} source={{ uri: item.prescription_path }} />
                                    } />
                                    }
                                </TouchableOpacity>
                                <Row style={{ width: '92%', }}>
                                    <Right>
                                        {imageSource != null ? <Icon name='ios-close' style={styles.customIcons} onPress={() => { this.setState({ imageSource: null, uploadButton: true }) }} /> : null}

                                    </Right>
                                </Row>
                            </View>

                            <Row style={{ alignSelf: 'center', justifyContent: 'center', paddingLeft: 50, paddingRight: 50, alignItems: 'center' }}>
                                <Col style={{ width: '60%', justifyContent: 'center', marginLeft: 55 }}>
                                    <Button disabled={this.state.uploadButton} style={{ borderRadius: 5, height: 35, padding: 35, color: 'gray' }} onPress={() => { this.uploadImageToServer(this.state.imageSource, selectedPharmacy) }}>
                                        <Text style={{ fontSize: 12 }}>UPLOAD</Text>
                                    </Button>
                                </Col>
                                <Col style={{ width: '40%', justifyContent: 'center', marginLeft: 30 }}>
                                    <Button style={{ borderRadius: 5, height: 35, }} onPress={() => this.props.navigation.navigate('Pharmacy')}>
                                        <Text style={{ fontSize: 12 }} >CANCEL</Text>
                                    </Button>
                                </Col>

                            </Row>
                        </ScrollView>
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
                }</Container>
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
        height: 250,
        width: 310,
        borderColor: '#f5f5f5',

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
        marginTop: -270,
        fontSize: 25,
        height: 25,
        width: 25,
        fontWeight: 'bold'
    }
})





