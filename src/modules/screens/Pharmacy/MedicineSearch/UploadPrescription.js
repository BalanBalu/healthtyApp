import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, View, Footer, FooterTab } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet} from 'react-native';

import ImagePicker from 'react-native-image-picker';
class UploadPrescription extends Component {
    constructor(props) {
        super(props)
        this.state={
            imageSource:null
        }
        this.uploadPrescription();


    }


    uploadPrescription(){
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
            // this.uploadImageToServer(response.uri);

        }
    });


}
render() {
    const {imageSource}=this.state;

return(
    <Container style={styles.container}>
    <Content>
        <Thumbnail   square style={styles.profileImage} source={{ uri: imageSource }} />
        <View style={{padding:10,marginTop:10}}>
        <Input placeholder="Comments" style={{borderWidth:0.5,borderRadius:5,borderColor:'#000',height:80,width:'90%',marginLeft:'auto',marginRight:'auto'}}/>        
         </View>

        
        
        <Row style={{alignSelf:'center',justifyContent:'center',marginTop:15,}}>
         <Col style={{width:'50%',alignItems:'center'}}>
         <Button style={{borderRadius:5,height:35,padding:40}}>
             <Text style={{fontSize:12}}  >SAVE</Text>
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
    marginTop:30,
    height:250,
    width:250,
    borderColor: '#f5f5f5',
},
})





