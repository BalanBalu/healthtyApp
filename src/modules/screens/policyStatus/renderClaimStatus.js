import React, {Component} from 'react';
import {Text, Card, Left, Right} from 'native-base';
import {TouchableOpacity, View} from 'react-native';
import {Col, Row} from 'react-native-easy-grid';
import Styles from './styles';
import {primaryColor} from '../../../setup/config';
import {translate} from '../../../setup/translator.helper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class RenderClaimStatus extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      item,
      navigation,
      onPressToggleButton,
      index,
      showCard,
      show,
      memberDetails,
    } = this.props;
    return (
        <View>
        <View>
       {showCard === index && !show ?
         <View>
           <Card style={styles.cardStyles}>
             <Row style={styles.gradientStyle}>
               <Col size={9}>
                 <Text style={{ fontSize: 16, color: '#fff' }}>{item.EMPLOYEE_NAME}</Text>

               </Col>
               <Col size={0.8} >
                 <TouchableOpacity onPress={() => onPressToggleButton(index)}>
                   <MaterialIcons name={showCard === index && !show ? "keyboard-arrow-up" : "keyboard-arrow-down"} style={{ fontSize: 25, color: '#fff' }} />
                 </TouchableOpacity>
               </Col>
             </Row>
             <View style={styles.mainView}>

             <Row style={{ marginTop: 5 }}>
             <Col size={4}><Text style={styles.subHeadingStyle}>{translate("Insurance Company")} </Text></Col>
                 <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                 <Col size={6.5}>
                   <Text style={styles.subHeadingData}>{item.INSURANCE_COMPANY_NAME?item.INSURANCE_COMPANY_NAME:'-'}</Text>
                 </Col>
               </Row>
               <Row style={{ marginTop: 5 }}>
                 <Col size={4}><Text style={styles.subHeadingStyle}>{translate("Member Code")} </Text></Col>
                 <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                 <Col size={6.5}>
                   <Text style={styles.subHeadingData}>{memberDetails.memberId}</Text>
                 </Col>

               </Row>
               {/* <Row style={{ marginTop: 5 }}>
                 <Col size={4}><Text style={styles.subHeadingStyle}>MAID</Text></Col>
                 <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                 <Col size={6.5}>
                   <Text style={styles.subHeadingData}>{item.MAID}</Text>
                 </Col>

               </Row> */}
               <Row style={{ marginTop: 5 }}>
                 <Col size={4}><Text style={styles.subHeadingStyle}>{translate("Relationship")}</Text></Col>
                 <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                 <Col size={6.5}>
                   <Text style={styles.subHeadingData}>{item.PATIENT_REALTION}</Text>
                 </Col>
               </Row>
               <Row style={{ marginTop: 5 }}>
                 <Col size={4}><Text style={styles.subHeadingStyle}>{translate("Claim Status")}</Text></Col>
                 <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                 <Col size={6.5}>
                   <Text style={styles.subHeadingData}>{item.CLAIM_STATUS}</Text>
                 </Col>
               </Row>
               <Row style={{ marginTop: 5 }}>
                 <Col size={4}><Text style={styles.subHeadingStyle}>{translate("Claim Amount")}</Text></Col>
                 <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                 <Col size={6.5}>
                   <Text style={styles.subHeadingData}>{item.AMOUNT}</Text>
                 </Col>
               </Row>
               <Row style={{ marginTop: 5 }}>
                 <Col size={4}><Text style={styles.subHeadingStyle}>{translate("Claim Date")}</Text></Col>
                 <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                 <Col size={6.5}>
                   <Text style={styles.subHeadingData}>{item.CLAIM_REGISTERED_DATE}</Text>
                 </Col>
               </Row>

               <Row style={{ marginTop: 5 }}>
                 <Col size={4}><Text style={styles.subHeadingStyle}>{translate("Ailment")}</Text></Col>
                 <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                 <Col size={6.5}>
                   <Text style={styles.subHeadingData}>{item.AILMENT}</Text>
                 </Col>
               </Row>

               <Row style={{ marginTop: 5 }}>
                 <Col size={4}><Text style={styles.subHeadingStyle}>{translate("Hospital")}</Text></Col>
                 <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                 <Col size={6.5}>
                   <Text style={styles.subHeadingData}>{item.HOSPITAL_NAME}</Text>
                 </Col>
               </Row>
               {/* <Row style={{ marginTop: 5 }}>
                 <Col size={4}><Text style={styles.subHeadingStyle}>Hospital Address</Text></Col>
                 <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                 <Col size={6.5}>
                   <Text style={styles.subHeadingData}>{(item.HOSPITAL_CITY + " " + item.HOSPITAL_STATE + " " + item.PIN_CODE)}</Text>
                 </Col>
               </Row> */}
             </View>
             
           </Card>
         </View>
         :
         <View>
              <TouchableOpacity onPress={() => onPressToggleButton(index)}>
         <Card style={styles.cardStyle}>
           <Row>
             <Col size={9}>
               <Text style={{ fontSize: 16, fontFamily: 'opensans-bold', color: primaryColor,}}
                 numberOfLines={1}
                 ellipsizeMode="tail">{item.EMPLOYEE_NAME}</Text>
               <Row>
                 <Col size={3}>
                   <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: '#909090', marginTop: 5 }}
                     numberOfLines={1}
                     ellipsizeMode="tail">Member Code</Text>
                 </Col>
                 <Col size={0.5}>
                   <Text style={{ marginTop: 5 }}>:</Text>
                 </Col>
                 <Col size={6.5}>
                   <Text style={styles.subHeadingData}
                     numberOfLines={1}
                     ellipsizeMode="tail">{memberDetails.memberId}</Text>
                 </Col>
               </Row>
               {/* <Text style={styles.subHeadingData}
                     numberOfLines={1}
                     ellipsizeMode="tail">{item.address}</Text> */}


             </Col>

             <Col size={0.8} style={{ justifyContent: 'center' }}>
               <TouchableOpacity onPress={() => onPressToggleButton(index)}>
                 <MaterialIcons name={showCard === index && !show ? "keyboard-arrow-up" : "keyboard-arrow-down"} style={{ fontSize: 25, color: '#000' }} />
               </TouchableOpacity>
             </Col>
           </Row>
         </Card>
         </TouchableOpacity>
         </View>
         }
     </View>  
       </View>
    )
}
}