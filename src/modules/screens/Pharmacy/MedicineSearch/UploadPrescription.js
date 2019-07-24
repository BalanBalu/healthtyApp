import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, View, Footer, FooterTab,Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet,AsyncStorage} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import { uploadMultiPart } from '../../../../setup/services/httpservices'
import Autocomplete from '../../../../components/Autocomplete'
import { searchPharmacyByName } from '../../../providers/pharmacy/pharmacy.action'



class UploadPrescription extends Component {
    constructor(props) {
        var wait;
        super(props)
        this.state={
            imageSource:null,
            keyword:'',
            pharmacyData:[],
            waitValue:''



            
        }
        this.searchPharmacy();
    }

    /*Search Pharmacy */

    searchPharmacy=async()=>{
        let postValues=[{
            type:'name',
            value:[this.state.keyword]

        }]
        let result = await searchPharmacyByName(postValues);
        console.log(result);
        await this.setState({pharmacyData:result.data});
        console.log('this.state.pharmacyData'+JSON.stringify(this.state.pharmacyData));
    }
    autoCompletePharmacyName(keyword){
        console.log(keyword+'keyword');
        console.log("autocomplete");
        if (keyword === '' || keyword === undefined || keyword === null) {
            console.log("empty");
            return [];
        }
        const { pharmacyData } = this.state;
        
        const regex = new RegExp(`${keyword.trim()}`, 'i');
        console.log(JSON.stringify(regex)+'regex');
        wait=pharmacyData.filter(value => value.name.search(regex) >= 0);
        console.log(JSON.stringify(wait)+'wait');
        return wait;

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
uploadImageToServer = async (imagePath,number) => {
    try {
        console.log("Image uploading");
        console.log("number"+JSON.stringify(number));
        const userId = await AsyncStorage.getItem('userId')
        const pharmacyId=number[0]._id;
        console.log(pharmacyId+'pharmacy')
        var formData = new FormData();
        formData.append('prescription', {
            uri: imagePath,
            type: 'image/jpeg',
            name: 'photo.jpg'
        });
        debugger
        let endPoint = `prescription/${userId}/${pharmacyId}`
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
    const pharmacyData=this.autoCompletePharmacyName(this.state.keyword);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();



return(
    <Container style={styles.container}>
    <Content>
    <Item style={{ borderBottomWidth: 0,marginTop:10 }}>
     <Autocomplete style={{ borderBottomWidth: 0,height: 45, backgroundColor: '#F1F1F1', borderRadius: 5,width:'75%',marginLeft:35}}
    data={pharmacyData.length===1 && comp(this.state.keyword,pharmacyData[0].name)?[]:pharmacyData}
    defaultValue={this.state.keyword}
    onChangeText={text => this.setState({keyword:text })}
     placeholder="Select Pharmacy"
     listStyle={{ position: 'relative' }}
    renderItem={({ item}) => (
         <TouchableOpacity onPress={() => this.setState({keyword:item.name},console.log('keee'+this.state.keyword))}>
              <Text>{item.name}</Text>
          </TouchableOpacity>
      )}
     keyExtractor={(item, index) => index.toString()} />
     </Item>
 
                                  
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
         <Button style={{borderRadius:5,height:35,padding:40}} onPress={()=>{this.uploadImageToServer(this.state.imageSource,wait)}}>
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





