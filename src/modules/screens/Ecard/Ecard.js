import React, { PureComponent } from 'react';
import { Text, Container, ListItem, List, Content, Row, Col, Card, CardItem, Body, Grid, Right, Icon, Left } from 'native-base';
import { View, FlatList, TouchableOpacity, Image, StyleSheet, Linking } from 'react-native';
import { getCorporateUserEcardDetails, getCorporateEmployeeDetailsById, getEcardLink,getPolicyDetailsByPolicyNo } from '../../providers/corporate/corporate.actions';
import { fetchUserProfile } from '../../providers/profile/profile.action';
import Spinner from '../../../components/Spinner'
import { toastMeassage } from '../../common'
import { connect } from 'react-redux'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {primaryColor} from '../../../setup/config'
import { translate } from "../../../setup/translator.helper"

import { CURRENT_APP_NAME } from "../../../setup/config";
class Ecard extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false,
            selectedIndex: -1,
            

        }

    }

    componentDidMount() {
        this.getEcardDetail()
    }
    async getEcardDetail() {
        await this.setState({ isLoading: true })
        await this.setState({ isLoading: false, data: this.props.profile.corporateData || [] })
console.log("data",this.state.data)
    }

    async open(data) {
        try {
           
            let policyResult = await getPolicyDetailsByPolicyNo(data.policyNo)
         
            if (policyResult && policyResult.TPA) {

                let requestObject = {
                    payer_code: policyResult.TPA,
                    member_id: data.memberId,
                    policy_no: data.policyNo,
                    first_name: data.firstName
                }

                let result = await getEcardLink(requestObject)

                if (result) {
                  
                    Linking.openURL(result)
                } else {

                    toastMeassage('sorry unable  download', 'danger', 3000)
                }
            }
           
        } catch (e) {
            
            toastMeassage('sorry unable  download', 'danger', 3000) 
        } 

    }
    getInsuranceAddress(data) {
        let temp = ''
        if (data) {
            temp = `${data.address2},${data.address1}`
        }


        return temp
    }
    getMemberName(data) {
        let temp = ''
        if (data) {
            temp = `${data.firstName || ' '} ${data.middleName || ''} ${data.lastName || ''}`
        }


        return temp

    }
    toggleData(index) {
        if (this.state.selectedIndex === index) {
            this.setState({selectedIndex:-1})
        } else {
            this.setState({selectedIndex:index})      
}
      
    }

    employeeAndFamilyDetails(data, index) {
        
    
        const arrowIcon = this.state.selectedIndex === index ? "keyboard-arrow-up" : "keyboard-arrow-down"

        return (
            <View>
                <View>
                    <Card style={{ marginTop: 15 }}>

                        <CardItem >
                            <Body>
                                <Grid>
                                    <Col size={0.5}>
                                        <Text style={styles.mainText}>{index+1}.</Text>
                                    </Col>
                                    <Col size={4}>
                                        <Text style={styles.leftHeadingText}>{translate("Member Name")}</Text>
                                    </Col>
                                    <Col size={0.5}>
                                        <Text style={styles.leftHeadingText}>-</Text>
                                    </Col>
                                    <Col size={5}>
                                        <Text style={styles.mainText}>{this.getMemberName(data)}</Text>
                                    </Col>
                                </Grid>
                                <Grid style={{ marginTop: 8 }}>
                                    <Col size={0.5}>
                                    </Col>
                                    <Col size={4}>
                                        <Text style={styles.leftHeadingText}>{translate("Member Code")}</Text>
                                    </Col>
                                    <Col size={0.5}>
                                        <Text style={styles.leftHeadingText}>-</Text>
                                    </Col>
                                    <Col size={5}>
                                        <Text style={styles.mainText}>{data.memberId}</Text>
                                    </Col>
                                </Grid>
                                <Grid style={{ marginTop: 8 }}>
                                    <Col size={0.5}>
                                    </Col>
                                    <Col size={4}>
                                        <Text style={styles.leftHeadingText}>{translate("Gender")}</Text>
                                    </Col>
                                    <Col size={0.5}>
                                        <Text style={styles.leftHeadingText}>-</Text>
                                    </Col>
                                    <Col size={5}>
                                        <Text style={styles.mainText}>{data.gender}</Text>
                                    </Col>
                                </Grid>
                                <Grid style={{ marginTop: 8 }}>
                                    <Col size={0.5}>
                                    </Col>
                                    <Col size={4}>
                                        <Text style={styles.leftHeadingText}>{translate("Age")}</Text>
                                    </Col>
                                    <Col size={0.5}>
                                        <Text style={styles.leftHeadingText}>-</Text>
                                    </Col>
                                    <Col size={5}>
                                        <Text style={styles.mainText}>{data.age} Years</Text>
                                    </Col>
                                </Grid>
                                <Grid style={{ marginTop: 8 }}>
                                    <Col size={0.5}>
                                    </Col>
                                    <Col size={4}>
                                        <Text style={styles.leftHeadingText}>{translate("Relationship")}</Text>
                                    </Col>
                                    <Col size={0.5}>
                                        <Text style={styles.leftHeadingText}>-</Text>
                                    </Col>
                                    <Col size={5}>
                                        <Text style={styles.mainText}>{data.relationship}</Text>
                                    </Col>
                                </Grid>
                            </Body>
                        </CardItem>
                        <CardItem footer button onPress={() => this.toggleData(index)} style={{ backgroundColor: primaryColor, height: 40 }}>
                            <Left style={{ marginLeft: 5 }}>
                                <Text style={[styles.leftHeadingText, { color: '#fff' }]}>{this.state.selectedIndex === index  ?"Hide Ecard" : "Show Ecard"}</Text>
                            </Left>
                            <Right>
                                <MaterialIcons name={arrowIcon} style={{ fontSize: 25, color: '#fff' }} />
                            </Right>
                        </CardItem>
                    </Card>
                </View>
                {this.state.selectedIndex === index  ?
                    <View>
                        <View style={{ backgroundColor: '#f2f5f4', paddingTop: 10, justifyContent: 'center', alignItems: 'center', paddingBottom: 8, marginTop: 5 }}>

                            <Text style={styles.headerText}>{data.insuranceCompany ? data.insuranceCompany.toUpperCase() : CURRENT_APP_NAME + ' INSURANCE'}</Text>
                            {/* <Text style={styles.headerText}>COMPANY LIMITED</Text> */}
                            <Text style={styles.compName}>{data.address1 || ' '}</Text>

                        </View>
                        <Row style={{ backgroundColor: '#1C5BA8', padding: 5, paddingBottom: 25 }}>
                            <Col size={3.5}>
                                <Text style={styles.innerText}>Policy No.</Text>
                                <Text style={styles.innerText}>Health India ID</Text>
                                <Text style={styles.innerText}>Member code</Text>
                                <Text style={styles.innerText}>Member Name</Text>
                                <Text style={styles.innerText}>Gender</Text>
                                <Text style={styles.innerText}>Age</Text>
                                <Text style={styles.innerText}>Relationship</Text>
                                <Text style={styles.innerText}>Employee code</Text>
                                <Text style={styles.innerText}>Valid Upto</Text>
                            </Col>
                            <Col size={0.5}>
                                <Text style={styles.innerText}>:</Text>
                                <Text style={styles.innerText}>:</Text>
                                <Text style={styles.innerText}>:</Text>
                                <Text style={styles.innerText}>:</Text>
                                <Text style={styles.innerText}>:</Text>
                                <Text style={styles.innerText}>:</Text>
                                <Text style={styles.innerText}>:</Text>
                                <Text style={styles.innerText}>:</Text>
                                <Text style={styles.innerText}>:</Text>


                            </Col>
                            <Col size={6}>
                                <Text style={styles.innerText}>{data.policyNo}</Text>
                                <Text style={styles.innerText}>{data.health_india_Id || ' '}</Text>
                                <Text style={styles.innerText}>{data.memberId}</Text>
                                <Text style={styles.innerText}>{this.getMemberName(data)}</Text>
                                <Text style={styles.innerText}>{data.gender}</Text>
                                <Text style={styles.innerText}>{data.age} Years</Text>
                                <Text style={styles.innerText}>{data.relationship}</Text>
                                <Text style={styles.innerText}>{data.employeeId}</Text>
                                <Text style={styles.innerText}>{data.PolicyEndDate || ' '}</Text>
                            </Col>
                            {/* <Col size={1.8} style={{ alignItems: 'center' }}>

                            </Col> */}
                        </Row>
                        <Row style={{ backgroundColor: '#5CB533', paddingBottom: 5, paddingTop: 5 }}>
                            <Col size={2.6} style={styles.colStyle}>
                                <Image source={require('../../../../assets/images/healthIndia.png')} style={{ height: 60, width: 80 }} />
                            </Col>
                            <Col size={7.4} style={styles.colStyle}>
                                <Text style={styles.footerText}>{data.GroupName}</Text>
                                <Text style={styles.addressText}>{this.getInsuranceAddress(data.Address)}</Text>
                            </Col>
                        </Row>

                        <TouchableOpacity onPress={() => this.open(data)} style={{ marginTop: 10, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            <Text style={styles.linkHeader}>Download</Text>
                        </TouchableOpacity>

                    </View>
                    : null}
            </View>
        )
    }


    render() {
        const { data, isLoading } = this.state
console.log("data",data)
        return (
            <Container>
                <Content style={{ padding: 15 }}>
                    {isLoading == true ?
                        <Spinner color='blue'
                            visible={isLoading}
                            overlayColor="none"
                        /> :  !Array.isArray(data) || data.length === 0 ?
                            <View style={{ alignItems: 'center', justifyContent: 'center', height: 550 }}>
                                <Text>{translate("No E-Card details found !")}</Text>
                            </View>
                            :
                            <View style={{ marginBottom: 20 }}>
                                {/* { data && Array.isArray(data) && data.find(ele => ele.relationship === 'EMPLOYEE') !== undefined ?
                                <Text style={styles.familyHeader}>Employee Detail</Text>:null}
                                { data && Array.isArray(data) && data.find(ele => ele.relationship === 'EMPLOYEE') !== undefined ?
                                    this.employeeAndFamilyDetails(data.find(ele => ele.relationship === 'EMPLOYEE')) : null} */}
                                <View>
                                    <Text style={styles.familyHeader}>{translate("Members details")}</Text>
                                    <FlatList
                                        data={this.state.data}
                                        extraData={this.state}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) =>
                                            item.relationship !== 'EMPLOYEE' &&
                                            this.employeeAndFamilyDetails(item, index)}

                                    />
                                </View>

                            </View>
                    }

                </Content>
            </Container>
        )
    }
}



function ecardState(state) {

    return {
        profile: state.profile,
    }
}
export default connect(ecardState)(Ecard)

const styles = StyleSheet.create({
    colStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    linkHeader: {
        fontFamily: 'Roboto',
        fontSize: 16,
        textDecorationColor: '#2159d9',
        textDecorationLine: 'underline',
        color: '#2159D9'
    },
    headerText: {
        fontFamily: 'opensans-bold',
        fontSize: 11,
        color: '#0C0A96',
    },
    compName: {
        fontFamily: 'opensans-bold',
        fontSize: 11,
       
    },
    innerText: {
        fontFamily: 'Roboto',
        fontSize: 10,
        color: '#fff'
    },
    footerText: {
        fontFamily: 'opensans-bold',
        fontSize: 10,
    },
    footerDeatils: {
        fontFamily: 'Roboto',
        fontSize: 10
    },
    compDetails: {
        marginTop: 10,
        backgroundColor: '#f2f5f4',
        paddingBottom: 5,
        paddingTop: 5
    },
   
    familyHeader: {
        fontFamily: 'opensans-bold',
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
        paddingBottom: 10
    },
    addressText: {
        fontFamily: 'opensans-bold',
        fontSize: 10,
        textAlign: 'center',
    },
    mainText: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: '#000'
    },
    leftHeadingText:{
        fontFamily:'opensans-bold',
        fontSize:14,
        color:'#000'
    }
})