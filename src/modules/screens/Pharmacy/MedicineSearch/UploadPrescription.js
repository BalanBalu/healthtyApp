import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, View, Footer, FooterTab } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import { uploadMultiPart } from '../../../../setup/services/httpservices'
import { searchPharmacyByName } from '../../../providers/pharmacy/pharmacy.action'



class UploadPrescription extends Component {
    constructor(props) {
        super(props)
        this.state={
            imageSource:null,
            pharmacyName:'APOLLO',

            
        }
    }

    componentDidMount(){
        this.searchPharmacy()
    }

    /*Search pharmacy*/
    searchPharmacy=async()=>{
        let reqData=[{
            type:'name',
            value:[this.state.pharmacyName]

        }]
                    
        

        let result=await searchPharmacyByName(reqData);
        console.log(result.data);
        this.setState({pharmacyName:result.data})


    }


/*Upload profile pic*/
   attachPrescription(){
    const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        storageOptions: {
            skipBackup: true
        }
    };
    ImagePicker.showImagePicker(options, (response) => {
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

            });

        }
    });


}
uploadImageToServer = async (imagePath) => {
    try {
        console.log("Image uploading");
        const userId = await AsyncStorage.getItem('userId')
        var formData = new FormData();
        formData.append('prescription', {
            uri: imagePath,
            type: 'image/jpeg',
            name: 'photo.jpg'
        });
        debugger
        let endPoint = `prescription/${userId}/`
        var res = await uploadMultiPart(endPoint, formData);
        const response = res.data;
        if (response.success) {
            this.setState({
                imageSource: imagePath,
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

render() {
    const {imageSource}=this.state;

return(
    <Container style={styles.container}>
    <Content>
            <View style={{marginTop:25}}>
                        <Row>
                            <Col style={{ width: '10%' }}>
                            </Col>
                            <Col style={{ width: '80%' }}>
                                <Item style={styles.searchBox}  >

                                    <Input placeholder="Search Pharmacy" 
                                    style={{ color: 'gray', fontFamily: 'OpenSans', fontSize: 12 }}
                                     placeholderTextColor="gray" 
                                     value={this.state.pharmacyName}
                                     onChangeText={pharmacyName => this.setState({ pharmacyName })}

                                     />
                                    <Button style={{ backgroundColor: '#000', borderRadius: 10, height: 40, marginTop: -20, marginRight: -20, borderBottomLeftRadius: 0, borderTopLeftRadius: 0, }}>
                                        <Icon name="ios-search" style={{ color: 'white' }}
                                    />
                                    </Button>
                                </Item>
                            </Col>
                            <Col style={{ width: '10%' }}>
                            </Col>
                        </Row>
                        </View>

    <TouchableOpacity onPress={()=>{this.attachPrescription()}}>
    {imageSource===null?    
    <Thumbnail square style={styles.profileImage} source={require('../../../../../assets/images/prescription_upload.png')} /> 
        :<Thumbnail   square style={styles.profileImage} source={{ uri: imageSource }} />}
        </TouchableOpacity>
        <View style={{padding:10,marginTop:10}}>

        <Input placeholder="Comments" style={{borderWidth:0.5,borderRadius:5,borderColor:'#000',height:80,width:'80%',marginLeft:'auto',marginRight:'auto'}}/>        
         </View>

        
        
        <Row style={{alignSelf:'center',justifyContent:'center',marginTop:10,}}>
         <Col style={{width:'50%',alignItems:'center'}}>
         <Button style={{borderRadius:5,height:35,padding:40}} onPress={()=>{this.uploadImageToServer(this.state.imageSource)}}>
             <Text style={{fontSize:12}}>UPLOAD</Text>
             </Button>
             </Col>
             <Col style={{width:'30%',alignItems:'center'}}>
             <Button style={{borderRadius:5,height:35,padding:5}}>
             <Text style={{fontSize:12}} >CANCEL</Text>
             </Button>
             </Col>     

        </Row>

 
    </Content>
    </Container>
)}
}
export default UploadPrescription

const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

profileImage:
{
    marginLeft:'auto',
    marginRight:'auto',
    marginTop:25,
    height:200,
    width:220,
    borderColor: '#f5f5f5',
},
searchBox: {
    width: '100%',
    borderBottomWidth: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 35,
    alignItems: 'center',
    marginTop:'auto',
    marginBottom: 'auto',
    padding: 20
}

})





