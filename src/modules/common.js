import React,{Component} from 'react';
import { View, Text, AsyncStorage} from "react-native";
import { Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
// import { fetchUserNotification, UpDateUserNotification } from '../../src/modules/providers/notification/notification.actions'


export const RenderHospitalAddress = (props) => {
    const { headerStyle, hospotalNameTextStyle, gridStyle, renderHalfAddress } = props
    return (

        <Grid style={gridStyle}>
            <Row>
                <Col style={{ width: '8%' }}>
                    <Icon name='medkit' style={{ fontSize: 16, fontFamily: 'OpenSans', color: 'gray' }}></Icon>
                </Col>
                <Col style={{ width: '90%' }}>
                    {props.hospitalAddress.location ?
                        <Text note style={hospotalNameTextStyle || { fontFamily: 'OpenSans' }}>{props.hospitalAddress.name}</Text>
                        : null}
                </Col>
            </Row>
            <Row>
                <Col style={{ width: '8%' }}>
                    <Icon name='pin' style={{ fontSize: 18, fontFamily: 'OpenSans', color: 'gray' }}></Icon>
                </Col>
                <Col style={{ width: '90%' }}>
                    {props.hospitalAddress.location ?
                        <View>
                            <Text note style={props.textStyle}>{props.hospitalAddress.location.address.no_and_street + ', '}</Text>
                            <Text note style={props.textStyle}>{props.hospitalAddress.location.address.city}</Text>
                            {renderHalfAddress === true ? null :
                                <View>
                                    <Text note style={props.textStyle}>{props.hospitalAddress.location.address.state}</Text>
                                    <Text note style={props.textStyle}>{props.hospitalAddress.location.address.pin_code}</Text>
                                </View>
                            }
                        </View> : null}
                </Col>
            </Row>
        </Grid>

    )
}

export const RenderPatientAddress = (props) => {
    
    const { gridStyle } = props
    return (

        <Grid style={gridStyle}>
            <Row>
                <Col style={{ width: '90%' }}>
                    {props.patientAddress.address ?
                        <View>
                            <Text note style={props.textStyle}>{props.patientAddress.address.no_and_street + ' , ' +
                                props.patientAddress.address.address_line_1 + ' , ' +
                                props.patientAddress.address.address_line_2 + ' , ' +
                                props.patientAddress.address.city + ' - ' + props.patientAddress.address.pin_code}</Text>
                        </View> : null}
                </Col>
            </Row>
        </Grid>
    )
}

export function renderProfileImage(data) {
    let source = null;
    if (data.profile_image) {
        source = { uri: data.profile_image.imageURL }
    } else if (data.gender == 'M') {
        source = require('../../assets/images/profile_male.png')
    } else if (data.gender == 'F') {
        source = require('../../assets/images/profile_female.png')
    } else {
        source = require('../../assets/images/profile_common.png')
    }
    return (source)
} 

export async function addToCart(medicineData, selectItem, operation) {
    let userId = JSON.stringify(await AsyncStorage.getItem('userId'))    
    let itemQuantity;
    if(operation==="add"){           
    itemQuantity = (selectItem.selectedQuantity==undefined?0:selectItem.selectedQuantity);
    selectItem.selectedQuantity=++itemQuantity;    
    }else{
        if(selectItem.selectedQuantity>0){
        itemQuantity=selectItem.selectedQuantity;
        selectItem.selectedQuantity = --itemQuantity;
        }     
    }     
   let cart =[];
        medicineData.filter(element=>{
           if( element.selectedQuantity>=1){
               cart.push(element);
           }
       })
       await AsyncStorage.setItem('cartItems-'+userId, JSON.stringify(cart))
       return{selectemItemData: selectItem}
}

export function medicineRateAfterOffer(item) {
    return parseInt(item.price) - ((parseInt(item.offer) / 100) * parseInt(item.price));

}
// export async function getUserNotification() {
//     try {
       
//         let userId = await AsyncStorage.getItem('userId');
//     console.log(userId)
//         let result = await fetchUserNotification(userId);
//         console.log('hi notification')
//         console.log(JSON.stringify(result))
      
        
        

//     }
//     catch (e) {
//         console.log(e);
//     }
   
   
// }


// export  class Badge extends Component {
//     constructor(props) {

//         super(props);
//         this.state = {
//             data:''
//         };
//     }

    
  
//     async componentDidMount() {
//         let data = await AsyncStorage.getItem('notification');
//         this.setState({data})
//     }

//     render() {
//         const { data} = this.state;


//         return (
//             <Text style={{ position: 'absolute', backgroundColor: 'red', color: 'white', borderRadius: 20, marginLeft: 10, padding: 2, marginTop: -7 }}>{data}</Text>
//         )
//     }
// }