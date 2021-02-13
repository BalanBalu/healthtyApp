import React, { Component } from 'react';

import {  Modal } from 'react-native';
import {
  Container,Right, Body, Button, Row, View, Text} from 'native-base';
  import ImagePicker from 'react-native-image-crop-picker';


export class ImageUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }

    }

    async componentDidMount() {

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
             
                this.props.popupVisible({
                    success:true,
                    image:image
                  });
            
            }).catch(ex => {
                this.props.popupVisible({
                    image:null,
                    success:false,
                    error:ex
                  });
                
            });
        } else {
            ImagePicker.openPicker({
                multiple: true,
                width: 300,
                height: 400,
                // cropping: true,
                // cropperCircleOverlay: true,
                // freeStyleCropEnabled: true,
                avoidEmptySpaceAroundImage: true,
            }).then(image => {
              
                this.props.popupVisible({
                    success:true,
                    image:image
                  });
            }).catch(ex => {
                this.props.popupVisible({
                    image:null,
                    success:false,
                    error:ex
                  });
                
            });
        }
    }

    render() {
        const { data, checked, isAnonymous, isDoctorRecommended, ratingIndicatePopUp } = this.state;
        return (
            < Container style={styles.container} >
                <View style={{ height: 300, position: 'absolute', bottom: 0 }}>
                    <Modal
                        visible={true}
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
                                padding: 25,
                                borderRadius: 5
                            }}>


                                <Text style={{ fontSize: 22, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center' }}> Select a Photo  </Text>
                                {/* </Item> */}

                                <Button transparent style={{ paddingTop: 5, paddingBottom: 5, marginTop: 20 }} onPress={() => this.uploadProfilePicture("Camera")} testID='chooseCemara'>
                                    <Text style={{ fontSize: 18, fontFamily: 'OpenSans', marginTop: 10 }}>Take Photo</Text>
                                </Button>
                                <Button transparent style={{ paddingTop: 5, paddingBottom: 5 }} onPress={() => this.uploadProfilePicture("Library")} testID='chooselibrary'>
                                    <Text style={{ fontSize: 18, fontFamily: 'OpenSans', marginTop: 10 }}>Choose from Library</Text>
                                </Button>

                                <Row style={{ marginTop: 50, marginBottom: 20 }}>
                                    <Right style={{ marginTop: 15 }} >
                                        <Button transparent style={{ marginTop: 15, alignItems: 'flex-end' }}

                                            onPress={() => this.props.popupVisible({ image: null })}
                                            testID='cancleButton'>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 18, }}> Cancel</Text>
                                        </Button>
                                    </Right>
                                </Row>
                            </View>

                        </View>
                    </Modal>

                </View>
            </Container >
        );
    }
}

export default ImageUpload
