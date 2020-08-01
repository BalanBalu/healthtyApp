import React, { PureComponent } from 'react';
import { Text, Container, ListItem, List, Content, Row, Col, Card, } from 'native-base';
import { View, FlatList, TouchableOpacity, Image, StyleSheet, Linking, AsyncStorage } from 'react-native';
import { getCorporateUserEcardDetails, getCorporateEmployeeDetailsById, getEcardLink } from '../../providers/corporate/corporate.actions';
import { fetchUserProfile } from '../../providers/profile/profile.action';
import Spinner from '../../../components/Spinner'
import { toastMeassage } from '../../common'


class Ecard extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false

        }

    }

    componentDidMount() {
        this.getEcardDetail()
    }
    async getEcardDetail() {
        await this.setState({ isLoading: true })
        const userId = await AsyncStorage.getItem('userId');
        let fields = "corporate_user_id";
        let userResult= await fetchUserProfile(userId, fields);

        if (!userResult.error) {
            let corporateResult = await getCorporateEmployeeDetailsById(userResult.corporate_user_id);

            if (!!corporateResult) {
                let data = {
                    PolicyNumber: corporateResult.policyNumber,
                    EmployeeNumber: corporateResult.employeeId,
                }
                let result = await getCorporateUserEcardDetails(data);
               
                if (!!result && result.status === "True") {
                    await this.setState({ data: JSON.parse(result.result) })


                } else {
                    toastMeassage('employee Details not found', 'dangers', 3000)
                }


            } else {
                toastMeassage('employee Details not found', 'dangers', 3000)
            }

        } else {
            toastMeassage('employee Details not found', 'dangers', 3000)
        }
        await this.setState({ isLoading: false })

    }
  
    async open(data) {
        let requestObject = {
            MemberID: data.MemberId,
            TPAId:data.MemberId,
            EmployeeNumber: data.EmployeeCode,
            PolicyNumber: data.PolicyNumber
        }
        let result = await getEcardLink(requestObject)

        if (!!result && result.status === 'True') {
            let temp = JSON.parse(result.result)
            Linking.openURL(temp[0].ECardUrl)
        } else {
            toastMeassage('sorry unable  download', 'danger', 3000)
        }

    }
    getInsuranceAddress(data) {
        let temp = []
        data.split(',').map((ele, index) => {
            if (index !== 0) {
                temp.push(ele)
            }

        })

        return temp
    }

    employeeAndFamilyDetails(data) {
        return (
            <View>
                <View style={{ marginTop: 10, backgroundColor: '#f2f5f4', paddingTop: 8, justifyContent: 'center', alignItems: 'center', paddingBottom: 8 }}>


                    <Text style={styles.headerText}>{data.InsuranceCompany.toUpperCase()}</Text>
                    {/* <Text style={styles.headerText}>COMPANY LIMITED</Text> */}
                    <Text style={styles.compName}>{data.address1 || ' '}</Text>

                </View>
                <Row style={{ backgroundColor: '#1C5BA8', padding: 5, paddingBottom: 25 }}>
                    <Col size={2.5}>
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
                    <Col size={5.5}>
                        <Text style={styles.innerText}>{data.PolicyNumber}</Text>
                        <Text style={styles.innerText}>{data.health_india_Id || ' '}</Text>
                        <Text style={styles.innerText}>{data.MemberId}</Text>
                        <Text style={styles.innerText}>{data.MemberName}</Text>
                        <Text style={styles.innerText}>{data.Gender}</Text>
                        <Text style={styles.innerText}>{data.Age} Years</Text>
                        <Text style={styles.innerText}>{data.Relation}</Text>
                        <Text style={styles.innerText}>{data.EmployeeCode}</Text>
                        <Text style={styles.innerText}>{data.PolicyEndDate || ' '}</Text>
                    </Col>
                    <Col size={1.8} style={{ alignItems: 'center' }}>

                    </Col>
                </Row>
                <Row style={{ backgroundColor: '#5CB533', paddingBottom: 5, paddingTop: 5 }}>
                    <Col size={2} style={styles.colStyle}>
                        <Image source={require('../../../../assets/images/healthIndia.png')} style={{ height: 60, width: 80 }} />
                    </Col>
                    <Col size={8} style={styles.colStyle}>
                        <Text style={styles.footerText}>{data.GroupName}</Text>
                        <Text style={styles.addressText}>{this.getInsuranceAddress(data.Address)}</Text>
                    </Col>
                </Row>

                <TouchableOpacity onPress={() => this.open(data)} style={{ marginTop: 10, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <Text style={styles.linkHeader}>Download</Text>
                </TouchableOpacity>


            </View>
        )
    }


    render() {
        const { data, isLoading } = this.state

        return (
            <Container>
                <Content style={{ padding: 15 }}>
                    {isLoading == true ?
                        <Spinner color='blue'
                            visible={isLoading}
                            overlayColor="none"
                        /> : data.length == 0 ?
                            <View style={{ alignItems: 'center', justifyContent: 'center', height: 550 }}>
                                <Text> No E-CARD DETAILS FOUND</Text>
                            </View>
                            :
                            <View style={{ marginBottom: 20 }}>
                                {data.find(ele => ele.Relation === 'EMPLOYEE') !== undefined ?
                                    this.employeeAndFamilyDetails(data.find(ele => ele.Relation === 'EMPLOYEE')) : null}
                                <View style={styles.borderStyle} />
                                <View>
                                    <Text style={styles.familyHeader}>Family Members</Text>
                                    <FlatList
                                        data={this.state.data}
                                        extraData={this.state}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => 
                                           item.Relation !== 'EMPLOYEE' &&
                                            this.employeeAndFamilyDetails(item)}
                                        
                                         />
                                </View>

                            </View>
                    }
                </Content>
            </Container>
        )
    }
}


export default Ecard

const styles = StyleSheet.create({
    colStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    linkHeader: {
        fontFamily: 'OpenSans',
        fontSize: 16,
        textDecorationColor: '#2159d9',
        textDecorationLine: 'underline',
        color: '#2159D9'
    },
    headerText: {
        fontFamily: 'OpenSans',
        fontSize: 11,
        color: '#0C0A96',
        fontWeight: '700'
    },
    compName: {
        fontFamily: 'OpenSans',
        fontSize: 11,
        fontWeight: '700'
    },
    innerText: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        color: '#fff'
    },
    footerText: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        fontWeight: '700'
    },
    footerDeatils: {
        fontFamily: 'OpenSans',
        fontSize: 10
    },
    compDetails: {
        marginTop: 10,
        backgroundColor: '#f2f5f4',
        paddingBottom: 5,
        paddingTop: 5
    },
    borderStyle: {
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        paddingTop: 5,
        paddingBottom: 10
    },
    familyHeader: {
        fontFamily: 'OpenSans',
        fontSize: 18,
        fontWeight: '700',
        marginTop: 10,
        textAlign: 'center',
        paddingBottom: 10
    },
    addressText: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        textAlign: 'center',
        fontWeight: '700'
    }
})