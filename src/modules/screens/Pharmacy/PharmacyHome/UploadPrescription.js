import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, View, Footer, FooterTab, Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, AsyncStorage, TextInput } from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import { uploadMultiPart } from '../../../../setup/services/httpservices'
import Autocomplete from '../../../../components/Autocomplete'
import { Loader } from '../../../../components/ContentLoader'
import { searchPharmacyByName } from '../../../providers/pharmacy/pharmacy.action'


class UploadPrescription extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageSource: null,
            keyword: '',
            pharmacyList:[],
            uploadButton: true,
            isLoading: true,
            isImageNotLoaded: true,
        }
    }

    async componentWillMount() {
        this.getPharmacyData();
    }

    /*Search Pharmacy */
    getPharmacyData = async () => {
        let pharmacyData = [{
            type: 'name',
            value: [this.state.keyword]
        }]
        console.log(pharmacyData);
        let result = await searchPharmacyByName(pharmacyData);
        console.log(result);
        this.setState({ pharmacyList: result.data, isLoading: false });
    }

    autoCompletePharmacyName(keyword) {
        if (keyword === '' || keyword === undefined || keyword === null) {
            return [];
        }
        const { pharmacyList } = this.state;

        if(pharmacyList!=undefined){
        const regex = new RegExp(`${keyword.trim()}`, 'i');
        console.log(regex);        
        selectedPharmacy = pharmacyList.filter(value => value.name.search(regex) >= 0);
        }
        if(selectedPharmacy.length==0){
            let defaultValue={name:'Pharmacy not found'}
           selectedPharmacy.push(defaultValue);
        }
        return selectedPharmacy;
       
    }

    /*Upload profile pic*/
    attachPrescription() {
        console.log("attach")
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log("showImagePicker");
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                console.log("response is running")
                let source = { uri: response.uri };
                this.setState({
                    imageSource: source.uri,
                    uploadButton: !this.state.uploadButton
                });

            }
        });
    }

    /*Save Image to Database*/
    uploadImageToServer = async (imagePath, selectedPharmacy) => {
        try {
            console.log("Image uploading");
            console.log(imagePath);
            console.log(selectedPharmacy);
            if (selectedPharmacy.length != 0) {
                const userId = await AsyncStorage.getItem('userId');
                const pharmacyId = selectedPharmacy[0]._id;
                var formData = new FormData();
                formData.append('prescription', {
                    uri: imagePath,
                    type: 'image/jpeg',
                    name: 'photo.jpg'
                });
                debugger
                let endPoint = `description/${userId}/${pharmacyId}`
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
                    this.setState({
                        imageSource: imagePath,
                        isImageNotLoaded: false
                    });
                    console.log('this.state.imageSource' + JSON.stringify(this.state.imageSource));
                    this.props.navigation.navigate('Pharmacy')
                } else {
                    Toast.show({
                        text: 'Problem Uploading Profile Picture',
                        duration: 3000,
                        type: 'danger'
                    });

                }
            } else {
                Toast.show({
                    text: 'Kindly select a pharmacy',
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
        var selectedPharmacy = [];
        if (this.state.isImageNotLoaded === true) {
            selectedPharmacy = this.autoCompletePharmacyName(this.state.keyword);
        }
        const { imageSource, isLoading } = this.state;
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        return (
            <Container style={styles.container}>
                {isLoading == true ? <Loader style={'appointment'} /> :
                    <Content >
                        <ScrollView>
                            <View style={{ marginTop: 25 }}>
                                <Autocomplete style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', borderRadius: 5, padding: 5, width: '76%', marginLeft: 48 }} 
                                data={this.state.pharmacyList!==undefined?(selectedPharmacy.length === 1 && comp(this.state.keyword, selectedPharmacy[0].name) ? [] : selectedPharmacy):selectedPharmacy}
                                    defaultValue={this.state.keyword}
                                    onChangeText={text => this.setState({ keyword: text })}
                                    placeholder='Select Pharmacy'
                                    listStyle={{ position: 'relative', marginLeft: 45, width: '70%', marginTop: -3.5 }}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => this.setState({ keyword:selectedPharmacy[0].name==='Pharmacy not found'?null:item.name })}>
                                            <Text style={{ fontFamily: 'OpenSans', borderBottomWidth: 0.3, color: 'gray', marginTop: 2, fontSize: 14 }}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item, index) => index.toString()} />

                            </View>
                            <View style={{marginTop:5}}>
                               <Text style={{marginLeft:10,fontFamily:'OpenSans',color:'red'}}>{this.state.noKeywords}</Text>
                            </View>


                            <View >
                                <TouchableOpacity onPress={() => { this.attachPrescription() }}>
                                    {imageSource === null ?
                                        <Thumbnail square style={styles.profileImage} source={require('../../../../../assets/images/prescription_upload.png')} />
                                        : <Thumbnail square style={styles.profileImage} source={{ uri: imageSource }} />}
                                </TouchableOpacity>
                                <Row style={{ width: '92%', }}>
                                    <Right>
                                        {imageSource != null ? <Icon name='ios-close' style={styles.customIcons} onPress={() => { this.setState({ imageSource: null, uploadButton: true }) }} /> : null}

                                    </Right>
                                </Row>
                            </View>

                            <View style={{ padding: 10, marginTop: 20 }}>
                                <Text style={{ marginLeft: 38, fontFamily: 'OpenSans', fontSize: 15 }}>Comments(optional)</Text>
                                <TextInput style={{ borderWidth: 0.5, textAlignVertical: 'top', borderRadius: 5, height: 100, width: '80%', marginLeft: 'auto', marginRight: 'auto',marginTop:10 }}
                                    placeholder=" Type your comments here"
                                    placeholderTextColor={'gray'}
                                    multiline={true} />



                            </View>

                            <Row style={{ alignSelf: 'center', justifyContent: 'center', marginTop: 10, paddingLeft: 50,paddingRight:50, alignItems: 'center' }}>
                                <Col style={{ width: '60%', alignItems: 'center',marginLeft:60 }}>
                                    <Button disabled={this.state.uploadButton} style={{ borderRadius: 5, height: 35, padding: 35, color: 'gray' }} onPress={() => { this.uploadImageToServer(this.state.imageSource, selectedPharmacy) }}>
                                        <Text style={{ fontSize: 12 }}>UPLOAD</Text>
                                    </Button>
                                </Col>
                                <Col style={{ width: '40%', alignItems: 'center',marginRight:10 }}>
                                    <Button style={{ borderRadius: 5, height: 35, padding: 15 }} onPress={() => this.props.navigation.navigate('Pharmacy')}>
                                        <Text style={{ fontSize: 12 }} >CANCEL</Text>
                                    </Button>
                                </Col>

                            </Row>
                        </ScrollView>
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
        marginTop: 20,
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
    marginLeft:150,
    textAlign: 'center',
    marginTop:-270,
    fontSize: 25,
    height: 25,
    width: 25,
    fontWeight: 'bold'
  }
})





