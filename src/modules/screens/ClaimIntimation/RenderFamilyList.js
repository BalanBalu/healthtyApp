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
    getCorporateLoginName=(item)=> (item.firstName ? item.firstName + ' ' : '') + (item.middleName ? item.middleName + ' ' : '') + (item.lastName ? item.lastName + ' ' : '')
       render() {
        const { item, index, isShowBeneficiaryInfoCard,  navigation, onPressIsShowBeneficiaryInfo, onPressSelectBtnToGoNextProcess } = this.props;
item.full_name=this.getCorporateLoginName(item)
        return (
            <View style={{ borderColor: 'gray', borderWidth: 0.5, padding: 15, borderRadius: 5, marginTop: 10 }}>
                <Row>
                    <Col size={0.5}>
                        <Text style={styles.NameText}>{index + 1}.</Text>
                    </Col>
                    <Col size={5}>
                        <Text style={styles.NameText}>{item.full_name ? `${item.full_name}` : null} <Text style={styles.relationShipText}>{item && item.full_name&&item.relationship ? `( ${item.relationship} )` : null}
                        </Text>
                        </Text>
                    </Col>
                    <Col size={5}>
                        <Text style={styles.ageText}>{item.age||0} years</Text>
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Col size={0.5}></Col>
                    <Col size={4}>
                        <Row>
                            <Col size={3}>
                                <Text style={styles.commonText}>Gender</Text>
                            </Col>
                            <Col size={2}>
                                <Text style={styles.commonText}>-</Text>
                            </Col>
                            <Col size={5} >
                                <Text style={[styles.commonText, { color: '#909498' }]}>{item.gender?item.gender: 'N/A'}</Text>
                            </Col>
                        </Row>
                    </Col>
                    <Col size={4}>
                        {item.mobile ?
                            <Row>
                                <Col size={3}>
                                    <Text style={styles.commonText}>Mobile</Text>
                                </Col>
                                <Col size={2}>
                                    <Text style={styles.commonText}>-</Text>
                                </Col>
                                <Col size={5} style={{ alignItems: 'flex-end' }}>
                                    <Text style={[styles.commonText, { color: '#909498' }]}>{item.mobile}</Text>
                                </Col>
                            </Row>
                            : null}
                    </Col>
                </Row>
                <View style={{ marginLeft: 10 }}>
                    <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.7, marginTop: 15 }} />
                    <Row>
                        <Col style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }} size={8}>
                            <TouchableOpacity style={styles.benefeciaryButton} onPress={() => onPressIsShowBeneficiaryInfo(index, isShowBeneficiaryInfoCard === index?'UP':'DOWN')}>
                                <Text style={{ color: "#0054A5", fontSize: 14, fontFamily: 'OpenSans', }}>Show Benefeciary Details </Text>
                                <MaterialIcons name={isShowBeneficiaryInfoCard === index ? "keyboard-arrow-up" : "keyboard-arrow-down"} style={{ fontSize: 20, color: "#0054A5" }} />
                            </TouchableOpacity>
                        </Col>
                        <Col style={{ alignItems: 'center', marginTop: 3 }} size={2}>
                            <TouchableOpacity style={styles.selectButton} onPress={() => onPressSelectBtnToGoNextProcess(item)}>
                                <Text style={{ color: "#fff", fontSize: 14, fontFamily: 'OpenSans' }}>SELECT</Text>
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
