import React, {  PureComponent } from 'react';
import { Text, View } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './Styles';
import { RenderBeneficiaryInfo } from '../CommonAll/components';

export default class RenderFamilyList extends PureComponent {
    constructor(props) {
        super(props)
    }
// Get Full Name
    getCorporateLoginName=(item)=> (item.familyMemberName ? item.familyMemberName + ' ' : '') + (item.familyMemberLastName ? item.familyMemberLastName + ' ' : '')
       render() {
        const { item, index, isShowBeneficiaryInfoCard,  navigation, onPressIsShowBeneficiaryInfo, onPressSelectBtnToGoNextProcess } = this.props;
item.full_name=this.getCorporateLoginName(item)
        return (
            <View style={{ borderColor: 'gray', borderWidth: 0.5, padding: 15, borderRadius: 5, marginTop: 10 }}>
                <Row>
                    <Col size={0.5}>
                        <Text style={styles.NameText}>{index + 1}.</Text>
                    </Col>
                    <Col size={6.5}>
                        <Text style={styles.NameText}>{item.full_name ? `${item.full_name}` : null} <Text style={styles.relationShipText}>{item && item.full_name&&item.relationship ? `( ${item.relationship} )` : null}
                        </Text>
                        </Text>
                    </Col>
                    <Col size={3}>
                        <Text style={styles.ageText}>{item.familyMemberAge||0} years</Text>
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Col size={0.5}></Col>
                    <Col size={4}>
                        <Row>
                            <Col size={4}>
                                <Text style={styles.commonText}>Gender</Text>
                            </Col>
                            <Col size={1}>
                                <Text style={[styles.commonText,{marginLeft:5}]}>-</Text>
                            </Col>
                            <Col size={5} >
                                <Text style={[styles.commonText, { color: '#909498' }]}>{item.familyMemberGender?item.familyMemberGender: 'N/A'}</Text>
                            </Col>
                        </Row>
                    </Col>
                    <Col size={5.5}>
                        {item.mobile ?
                            <Row>
                                <Col size={3}>
                                    <Text style={styles.commonText}>Mobile</Text>
                                </Col>
                                <Col size={1}>
                                <Text style={[styles.commonText,{marginLeft:5}]}>-</Text>
                                </Col>
                                <Col size={6} style={{ alignItems: 'flex-end' }}>
                                    <Text style={[styles.commonText, { color: '#909498' }]}>{item.mobile}</Text>
                                </Col>
                            </Row>
                            : null}
                    </Col>
                </Row>
                <View style={{ marginLeft: 15 }}>
                    <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.7, marginTop: 15 }} />
                    <Row>
                        <Col style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3,}} size={6}>
                            <TouchableOpacity style={styles.benefeciaryButton} onPress={() => onPressIsShowBeneficiaryInfo(index, isShowBeneficiaryInfoCard === index?'UP':'DOWN')}>
                                <Text style={{ color: "#0054A5", fontSize: 14, fontFamily: 'Roboto', }}>{isShowBeneficiaryInfoCard === index ?'Hide Beneficiary Details ':'Show Beneficiary Details '}</Text>
                                <MaterialIcons name={isShowBeneficiaryInfoCard === index ? "keyboard-arrow-up" : "keyboard-arrow-down"} style={{ fontSize: 20, color: "#0054A5" }} />
                            </TouchableOpacity>
                        </Col>
                        <Col style={{ alignItems: 'flex-end', marginTop: 3,justifyContent:'flex-end' }} size={4}>
                            <TouchableOpacity style={styles.selectButton} onPress={() => onPressSelectBtnToGoNextProcess(item)}>
                                <Text style={{ color: "#fff", fontSize: 14, fontFamily: 'Roboto' }}>SELECT</Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                    <RenderBeneficiaryInfo
                        isShowBeneficiaryInfoCard={isShowBeneficiaryInfoCard === index}
                        data={item}
                    />
                </View>
            </View>
        )
    }
}
