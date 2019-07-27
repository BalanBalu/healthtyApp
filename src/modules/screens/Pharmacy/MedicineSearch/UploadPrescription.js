import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, View, Footer, FooterTab,Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet,AsyncStorage,TextInput} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import { uploadMultiPart } from '../../../../setup/services/httpservices'
import Autocomplete from '../../../../components/Autocomplete'
import { Loader } from '../../../../components/ContentLoader'
import { searchPharmacyByName} from '../../../providers/pharmacy/pharmacy.action'


class UploadPrescription extends Component {
    constructor(props) {
        super(props)
        this.state={
            imageSource:null,
            keyword:'',
            pharmacyList:null,
            uploadButton:true,
            isLoading: true,
            isImageNotLoaded:true
        }
        
    }

    async componentWillMount(){
        this.getPharmacyData();
    }

    /*Search Pharmacy */
    getPharmacyData=async()=>{
        let pharmacyData=[{
            type:'name',
            value:[this.state.keyword]
        }]
        let result = await searchPharmacyByName(pharmacyData);
        this.setState({pharmacyList:result.data,isLoading:false});
        // console.log('this.state.pharmacyList'+JSON.stringify(this.state.pharmacyList));
    }
    
    autoCompletePharmacyName(keyword){
        if (keyword === '' || keyword === undefined || keyword === null) {
            return [];

        }        
        const { pharmacyList } = this.state;
        const regex = new RegExp(`${keyword.trim()}`, 'i');       
         selectedPharmacy=pharmacyList.filter(value => value.name.search(regex) >= 0);
        return selectedPharmacy;            
    }



    /*Upload profile pic*/
   attachPrescription(){
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
                uploadButton:!this.state.uploadButton
            });

        }
    });
}

/*Save Image to Database*/
uploadImageToServer = async (imagePath,selectedPharmacy) => {
    try {
        console.log("Image uploading");
        console.log(imagePath);
        console.log(selectedPharmacy);
        if(selectedPharmacy.length!=0){
        const userId = await AsyncStorage.getItem('userId');
        const pharmacyId=selectedPharmacy[0]._id;
        var formData = new FormData();
        formData.append('prescription',{
            uri: imagePath,
            type: 'image/jpeg',
            name: 'photo.jpg'
        });
        debugger
        let endPoint = `prescription/${userId}/${pharmacyId}`
        console.log(endPoint+'endpoint');
        var res = await uploadMultiPart(endPoint, formData);
        const response = res.data;
        if (response.success) {
            Toast.show({
                text:'Prescription Uploaded Successfully',
                duration: 3000,
                type: 'success'
            });       
                this.setState({
                imageSource: imagePath,
                isImageNotLoaded:false
            });
            console.log('this.state.imageSource'+JSON.stringify(this.state.imageSource));
            this.props.navigation.navigate('MedicineList')
        } else {
            Toast.show({
                text: 'Problem Uploading Profile Picture',
                duration: 3000,
                type: 'danger'
            });
        
        }       
    }else{
        Toast.show({
            text: 'Kindly select a pharmacy',
            duration: 3000,
            type: 'danger'
        });
    }
        }catch (e) {
        Toast.show({
            text: 'Problem Uploading Profile Picture' + e,
            duration: 3000,
            type: 'danger'
        });
        console.log(e);
    }
}


render() {
    var selectedPharmacy=[];
    if(this.state.isImageNotLoaded===true){
        selectedPharmacy=this.autoCompletePharmacyName(this.state.keyword);
    }
    const {imageSource,isLoading}=this.state;
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
return(
    <Container style={styles.container}>
        {isLoading==true? <Loader style={'appointment'} /> : 
    <Content>
    
    <View style={{marginTop:15}}>
    <Autocomplete style={{borderBottomWidth: 0, backgroundColor: '#F1F1F1', borderRadius: 5,padding:5,width:'70%',marginLeft:48}}    data={selectedPharmacy.length===1 && comp(this.state.keyword,selectedPharmacy[0].name)?[]:selectedPharmacy}
    defaultValue={this.state.keyword}
    onChangeText={text => this.setState({ keyword:text})}
     placeholder="Select Pharmacy"
     listStyle={{ position: 'relative',marginLeft:45,width:'70%',marginTop:-3.5 }}
    renderItem={({ item}) => (
         <TouchableOpacity onPress={() => this.setState({keyword:item.name})}>
              <Text style={{ fontFamily: 'OpenSans', borderBottomWidth: 0.3, color: 'gray', marginTop: 2, fontSize: 14 }}>{item.name}</Text>
          </TouchableOpacity>
      )}
     keyExtractor={(item, index) => index.toString()} />
    
     </View>
    
    <View style={{marginTop:-15}}>
    <TouchableOpacity onPress={()=>{this.attachPrescription()}}>
    {imageSource===null?    
    <Thumbnail square style={styles.profileImage} source={require('../../../../../assets/images/prescription_upload.png')} /> 
        :<Thumbnail   square style={styles.profileImage} source={{uri:imageSource}} />} 
    </TouchableOpacity> 
    <Row style={{width:'83.5%',}}>
    <Right>
        {imageSource!=null?<Icon name="ios-close-circle-outline" style={{ color: 'red',position:'absolute',marginTop:-202}} onPress={()=>{this.setState({imageSource:null})}} />:null}
    </Right>
    </Row>
    </View>

    <View style={{padding:10,marginTop:10}}>
         <TextInput style={{borderWidth:0.5,textAlignVertical:'top',borderRadius:5,height:80,width:'80%',marginLeft:'auto',marginRight:'auto'}}
         placeholder="Comments"
         placeholderTextColor={'black'}
         multiline={true} />



    </View>

    <Row style={{alignSelf:'center',justifyContent:'center',marginTop:10,marginLeft:2}}>
         <Col style={{width:'50%',alignItems:'center'}}>
         <Button disabled={this.state.uploadButton} style={{borderRadius:5,height:35,padding:35,color:'gray'}} onPress={()=>{this.uploadImageToServer(this.state.imageSource,selectedPharmacy)}}>
             <Text style={{fontSize:12}}>UPLOAD</Text>
             </Button>
             </Col>
             <Col style={{width:'28%',alignItems:'center'}}>
             <Button style={{borderRadius:5,height:35,padding:5}} onPress={()=>this.props.navigation.navigate('MedicineList')}>
             <Text style={{fontSize:12}} >CANCEL</Text>
             </Button>
             </Col>     

    </Row> 
    </Content>        
    }</Container>
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





