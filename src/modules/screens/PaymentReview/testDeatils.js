import React, { PureComponent } from 'react';
import {  Text,  Radio,  Icon, Input, CheckBox, Right } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, View, AsyncStorage } from 'react-native';
import {  FlatList } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import BenefeciaryDetails from './benefeciaryDetails'
import { fetchUserProfile, getCorporateUserFamilyDetails,getPolicYDetailsByid } from '../../providers/profile/profile.action';
import { hasLoggedIn } from '../../providers/auth/auth.actions';
import { dateDiff } from '../../../setup/helpers';
import { POSSIBLE_PAY_METHODS } from './PayBySelection';
import { getRandomInt } from '../../common';
const POSSIBLE_FAMILY_MEMBERS = {
    SELF: 'SELF',
    FAMILY_WITH_PAY: 'FAMILY_WITH_PAY',
    FAMILY_WITHOUT_PAY: 'FAMILY_WITHOUT_PAY'
}
class TestDetails extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            benefeciaryDeails: false,
            patientDetailsObj: {},
            data:{
                familyDataByInsurance:[] ,
                familyDataByCorporate:[]
            },
            gender: 'M',
            full_name: '',
            age: '',
            refreshCount: 0,
            familyDetailsData: [],
            onlyFamilyWithPayDetailsData : []
        }
        console.log(this.props);
        this.defaultPatDetails = {};
       
    }

    async componentDidMount() {
        await this.getPatientInfo();
    }


    getPatientInfo = async () => {
        try {
            const fields = "first_name,last_name,gender,dob,mobile_no,address,delivery_address,employee_code,corporate_user_id"
            const userId = await AsyncStorage.getItem('userId');
            const patInfoResp = await fetchUserProfile(userId, fields);
            let data=this.state.data;
            console.log('patInfoResp====>', patInfoResp.employee_code)
       
            this.defaultPatDetails = {
                type: 'self',
                full_name: patInfoResp.first_name + ' ' + patInfoResp.last_name,
                gender: patInfoResp.gender,
                age: parseInt(dateDiff(patInfoResp.dob, new Date(), 'years')),
                phone_no: patInfoResp.mobile_no
            }
            if (patInfoResp.employee_code) {
                let result = await getCorporateUserFamilyDetails(patInfoResp.employee_code)
                let benificeryDetailsResult=await getPolicYDetailsByid(patInfoResp.corporate_user_id)
               
                if(result&&result[0]){
                    let temp=[];
                    result.forEach(element => {
                        let obj= {
                            type: 'familymembers',
                            full_name: (element.firstName ? element.firstName + ' ' :'') + (element.middleName ? element.middleName + ' ' : '') + (element.lastName ? element.lastName + ' ': ''),
                            gender: element.gender,
                            age: element.ageInYrs,
                            phone_no: element.mobileNo,
                            benefeciaryUserDeails: {
                                ...element,
                                ...benificeryDetailsResult[0]
                            }
                        }
                        if(element.relationShip === 'EMPLOYEE') {
                            this.defaultPatDetails.benefeciaryUserDeails ={
                                ... element,
                                ...benificeryDetailsResult[0]
                            }
                        } else {
                            temp.push(obj)
                        }
                    });
                    data.familyDataByCorporate = temp;
                    data.familyDataByInsurance= temp;
              }
                console.log('getCorporateUserFamilyDetailsgetCorporateUserFamilyDetails',JSON.stringify(result))
            }
            this.props.addPatientDetails( [ this.defaultPatDetails ], true);
            await this.setState({ refreshCount: this.state.refreshCount + 1, data })
           
        }
        catch (Ex) {
            console.log('Ex is getting Get Patient Info in Payment preview page', Ex.message);
        }
    }

    addPatientList = async () => {
        const { name, age, gender } = this.state;

        if (!name || !age || !gender) {
            console.log('is is coming to error');
            this.setState({ errMsg: '* Kindly fill all the fields' });
        }

        else {
            const othersDetailsObj = {
                type: 'others',
                full_name: name,
                age: parseInt(age),
                gender,
                uniqueId: 'others-' + getRandomInt(1000) 
            }
            const onlyFamilyWithPayDetailsData = this.state.onlyFamilyWithPayDetailsData;
            debugger
            if(this.props.singlePatientSelect === true ) {
                let familyData = [];
                familyData.push(othersDetailsObj);
                this.setState({ onlyFamilyWithPayDetailsData: familyData })
                this.props.addPatientDetails(familyData); 
            } else {
                let familyData = this.props.familyDetailsData;
                familyData.push(othersDetailsObj);
                onlyFamilyWithPayDetailsData.push(othersDetailsObj);
                this.setState({ onlyFamilyWithPayDetailsData: onlyFamilyWithPayDetailsData });
                this.props.addPatientDetails(familyData); 
                
            }
        }
    }
    onSelfPatientClicked(hasCheckedForMultiSelect) {
        
        this.setState({ patientDetailsObj: this.defaultPatDetails });
        if (this.props.singlePatientSelect === true) {
            console.log('this.defaultPatDetail', this.defaultPatDetails);
            this.props.addPatientDetails([this.defaultPatDetails])
        } else {
            const familyDetailsData = this.props.familyDetailsData;
            const index = familyDetailsData.findIndex(ele => ele.type === 'self');
            if(hasCheckedForMultiSelect === false) {
                familyDetailsData.push(this.defaultPatDetails);
            } else {
                familyDetailsData.splice(index, 1);
            }
            console.log(familyDetailsData);
            this.setPatientType(POSSIBLE_FAMILY_MEMBERS.SELF);
            this.props.addPatientDetails(familyDetailsData); 
        }
    }
    setPatientType(changedPatientType) {
        const selectedPatientTypes = this.props.selectedPatientTypes;
        if (selectedPatientTypes.includes(changedPatientType)) {
            selectedPatientTypes.splice(selectedPatientTypes.indexOf(changedPatientType), 1);
            this.props.onSelectionChange(selectedPatientTypes);
        
        } else {
            selectedPatientTypes.push(changedPatientType);
            this.props.onSelectionChange(selectedPatientTypes);
        } 
    }

    onRemovePatientClicked(indexNo) {
        let uniqueId = null;
        const filteredData =  this.state.onlyFamilyWithPayDetailsData.filter(function(item, index) {
            if(index === indexNo) {
                uniqueId = item.uniqueId;
            }
            return index !== indexNo
        });
        console.log('uniqueId', uniqueId);
        const arr = this.props.familyDetailsData.filter(function(item, index) {
            return item.uniqueId !== uniqueId
        });

        this.props.addPatientDetails(arr);
        this.setState({ onlyFamilyWithPayDetailsData: filteredData });
    }
    removeAllWithoutPayFamilyDetails() {
         const arr = this.props.familyDetailsData.filter(function(item, index) {
             return item.type !== 'others'
         });
         this.props.addPatientDetails(arr);
    }
    addAllWithoutPayFamilyMembersToPatientDetails() {
        const existingPatDetails = this.props.familyDetailsData || [];
        this.props.addPatientDetails(existingPatDetails.concat(this.state.onlyFamilyWithPayDetailsData));
    }

    async addFamilyMembersForBooking(data, index, payBy) {
        const payByFamilyIndex = payBy + '-' + index;
        let familyMembersSelections = this.props.familyMembersSelections
    

        const beneficiaryDetailsObj = {
    
            type: 'familymembers',
            full_name: data.full_name,
            age: parseInt(data.age),
            gender: data.gender,
            uniqueIndex: payByFamilyIndex
        }
        
         if(payBy===POSSIBLE_PAY_METHODS.CORPORATE||payBy===POSSIBLE_PAY_METHODS.INSURANCE){
            beneficiaryDetailsObj.policy_no=data.benefeciaryUserDeails.policyNumber
            beneficiaryDetailsObj.benefeciaryUserDeails=data.benefeciaryUserDeails
         }
        if(this.props.singlePatientSelect === true) {
            if(this.props.familyMembersSelections.includes(payByFamilyIndex)) {
                familyMembersSelections.splice(familyMembersSelections.indexOf(payByFamilyIndex), 1);
                let familyData = this.props.familyDetailsData;
                const finalFamilyData = familyData.filter(ele => ele.uniqueIndex !== payByFamilyIndex);
                this.props.addPatientDetails(finalFamilyData);
            } else {
                let familyData = [];
                familyMembersSelections = [ payByFamilyIndex ];
                familyData.push(beneficiaryDetailsObj);
                this.props.addPatientDetails(familyData); 
            }
        } else {
            
            let familyFindIndex = this.props.familyDetailsData.findIndex(ele => ele.uniqueIndex === payByFamilyIndex);
            if(/*familyFindIndex === -1*/ this.props.familyMembersSelections.includes(payByFamilyIndex) === false) {
                let familyData = [...this.props.familyDetailsData, beneficiaryDetailsObj];
                familyMembersSelections.push(payByFamilyIndex);
                this.props.addPatientDetails(familyData); 
            } else {
                let familyData = this.props.familyDetailsData;
                familyData.splice(familyFindIndex, 1);
                familyMembersSelections.splice(familyMembersSelections.indexOf(payByFamilyIndex), 1);
                this.props.addPatientDetails(familyData); 
            }
        }

        await this.props.changeFamilyMembersSelections(familyMembersSelections);
    }
    removeAllPatientFromCorporateEmployeeDetails() {
        const updatedFamilyDetails = this.props.familyDetailsData.filter(ele => ele.type !== 'familymembers')
        this.props.addPatientDetails(updatedFamilyDetails);
        this.props.changeFamilyMembersSelections([]);
    }

    renderPatientDetails(data, index, enableSelectionBox, patientSelectionType) {
        const { isCorporateUser, payBy } = this.props;
        return (
            <View style={{ borderColor: 'gray', borderWidth: 0.3, padding: 10, borderRadius: 5, marginTop: 10 }}>
               <Row>
               {data.type === 'others' ?
               <Right style={{marginTop:-10}}>
                <TouchableOpacity onPress={() => this.onRemovePatientClicked(index)}>
                     <Icon active name='ios-close' style={{ color: '#d00729', fontSize: 25 }} />
                </TouchableOpacity>
               </Right>
                        : null}
               </Row>
               <Row>
                    <Col size={5}>
                        <Text style={styles.NameText}>{data.full_name + (data.relation ? ` (${data.relation})` : '')}</Text>
                    </Col>
                    <Col size={5}>
                        <Text style={styles.ageText}>{data.age} years</Text>
                    </Col>
                  
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Col size={3.3}>
                        <Row>
                            <Col size={3}>
                                <Text style={styles.commonText}>Gender</Text>
                            </Col>
                            <Col size={2}>
                                <Text style={styles.commonText}>-</Text>
                            </Col>
                            <Col size={5} >
                                <Text  style={[styles.commonText,{color:'#909498'}]}>{data.gender}</Text>
                            </Col>
                        </Row>
                    </Col>
                    <Col size={3.3}>
                        {data.phone_no != undefined?
                        <Row>
                            <Col size={3}>
                                <Text style={styles.commonText}>Mobile</Text>
                            </Col>
                            <Col size={2}>
                                <Text style={styles.commonText}>-</Text>
                            </Col>
                            <Col size={5} style={{alignItems:'flex-end'}}>
                                <Text  style={[styles.commonText,{color:'#909498'}]}>{data.phone_no}</Text>
                            </Col>
                        </Row>
                       :null}
                    </Col>
                    {enableSelectionBox === true ?
                        <Col size={3.3}>
                            <Row style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                <CheckBox style={{ borderRadius: 5, marginRight: 10 }}
                                    checked={this.props.familyMembersSelections.includes(payBy + '-' + index)}
                                    onPress={() => this.addFamilyMembersForBooking(data, index, payBy) }
                                />
                            </Row>
                        </Col>
                        : null}
                </Row>
                {isCorporateUser && payBy !== POSSIBLE_PAY_METHODS.SELF && data.benefeciaryUserDeails ?
                    <View>
                        <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.5, marginTop: 10 }} />
                        <TouchableOpacity style={styles.benefeciaryButton} onPress={() => {
                            let expandedListIndexPayBy = patientSelectionType + '-' + index;
                            this.setState({ expandedListIndex: this.state.expandedListIndex === expandedListIndexPayBy ? -1 : expandedListIndexPayBy })
                        }}>
                            <Text style={{ color: "#0054A5", fontSize: 12, fontFamily: 'OpenSans', }}>Show Benefeciary Details</Text>
                            <MaterialIcons name='keyboard-arrow-down' style={{ fontSize: 20, marginLeft: 5, color: "#0054A5", marginTop: 5 }} />
                        </TouchableOpacity>
                        <View>
                            <BenefeciaryDetails
                                expand={this.state.expandedListIndex === patientSelectionType + '-' + index}
                                data={data.benefeciaryUserDeails}
                                payBy={payBy}
                            />
                        </View>

                    </View>
                    : null}
            </View>
        )
    }

    getPossiblePaymentMethods(payBy) {
        if (payBy === POSSIBLE_PAY_METHODS.SELF) {
            return ['SELF', 'FAMILY_WITH_PAY']
        }
        if (payBy === POSSIBLE_PAY_METHODS.INSURANCE) {
            return ['SELF', 'FAMILY_WITHOUT_PAY']
        }
        if (payBy === POSSIBLE_PAY_METHODS.CORPORATE) {
            return ['SELF', 'FAMILY_WITHOUT_PAY']
        }
    }


    render() {
      
        // const datas = {
        //     full_name: 'S.Mukesh Kannan(self)', age: 21, gender: "male", phone_no: 8921595872,
        //     familyDataByInsurance: [{ full_name: 'S.Ramesh', relation: 'Son', age: 4, gender: "male", phone_no: 8921595872 }, { full_name: 'S.Reshma', relation: 'Daughter', age: 4, gender: "female", phone_no: 8921595872 }],
        //     familyDataByCorporate: [{ full_name: 'S.Ramesh', relation: 'Son', age: 4, gender: "male", phone_no: 8921595872 }]
        // }
        const { isCorporateUser, payBy, onSelectionChange,selectedPatientTypes, familyDetailsData,singlePatientSelect  } = this.props;

        const { name, age, gender,onlyFamilyWithPayDetailsData ,data} = this.state
        const familyData = payBy === POSSIBLE_PAY_METHODS.INSURANCE ? data.familyDataByInsurance : data.familyDataByCorporate
      
     
        return (

            <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 10 }}>
                 <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#7F49C3' }}>Whom do you need to take up the test?</Text>
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                   
                   {this.getPossiblePaymentMethods(payBy).includes(POSSIBLE_FAMILY_MEMBERS.SELF) ? 
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {singlePatientSelect ? 
                          <Radio
                            standardStyle={true}
                            selected={selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.SELF) ? true : false}
                            onPress={() => {
                                this.props.onSelectionChange(POSSIBLE_FAMILY_MEMBERS.SELF);
                                this.onSelfPatientClicked() 
                            }}/> 
                         :
                            <CheckBox style={{ borderRadius: 5, marginRight: 10 }}
                                checked={selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.SELF) ? true : false}
                                onPress={() => this.onSelfPatientClicked(selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.SELF))}
                            /> 
                        }
                         
                        <Text style={[styles.commonText, { marginLeft: 5 }]}>Self</Text>
                    </View>
                    : null }
                    
                    
                    {isCorporateUser && this.getPossiblePaymentMethods(payBy).includes(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITHOUT_PAY) === true ? 
                        <View style={{ flexDirection: 'row', marginLeft: 40, alignItems: 'center' }}>
                           {familyData.length !== 0 ?
                           <> 
                            {singlePatientSelect ?
                             
                              <Radio
                                standardStyle={true}
                                selected={selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITHOUT_PAY) ? true : false}
                                onPress={() => onSelectionChange(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITHOUT_PAY)} />
                            : 
                             <CheckBox style={{ borderRadius: 5, marginRight: 10 }}
                                checked={selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITHOUT_PAY) ? true : false}
                                onPress={() => {
                                    if(selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITHOUT_PAY)) {
                                        this.removeAllPatientFromCorporateEmployeeDetails();
                                    }
                                    this.setPatientType(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITHOUT_PAY);
                                }}
                            />
                            }
                            <Text style={[styles.commonText, { marginLeft: 5 }]}>Family </Text>
                           </>
                            : null }
                        </View> 
                    : null }

                    {this.getPossiblePaymentMethods(payBy).includes(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY) === true ? 
                     
                      <View style={{ flexDirection: 'row', marginLeft: 40, alignItems: 'center' }}>
                        {singlePatientSelect ? 
                        <Radio
                            standardStyle={true}
                            selected={selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY) ? true : false}
                            onPress={() => { 
                                onSelectionChange(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY); 
                                this.setState({  patientDetailsObj: {} });
                            }}/>
                        :    <CheckBox style={{ borderRadius: 5, marginRight: 10 }}
                                checked={selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY) ? true : false}
                                onPress={() => {
                                      if(selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY)) {
                                        this.removeAllWithoutPayFamilyDetails();
                                      } else {
                                          this.addAllWithoutPayFamilyMembersToPatientDetails()
                                      }
                                      this.setPatientType(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY); 
                                }}
                            /> }
                        <Text style={[styles.commonText, { marginLeft: 5 }]}>{ 'Family' } </Text>
                    </View> 
                    : null }
                </View>


                <View style={{ marginTop: 10 }}>
                    {selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.SELF) ?
                        <View>
                             <Text style={{ fontSize: 12, fontFamily: 'OpenSans' }}>Patient Details</Text>
                            <View>
                                {this.renderPatientDetails(this.defaultPatDetails, 0, false, POSSIBLE_FAMILY_MEMBERS.SELF)}
                            </View>
                        </View>
                        : null}
                </View>
                <View style={{ marginTop: 10 }}>
                    {selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY) ?
                        <View>
                             {onlyFamilyWithPayDetailsData.length !== 0 ?
                             <Text style={{ fontSize: 12, fontFamily: 'OpenSans' }}>Patient Details</Text>
                            :  null}
                            <FlatList
                                data={onlyFamilyWithPayDetailsData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) =>
                                    this.renderPatientDetails(item, index, false, POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY)
                                } />
                            { (selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY)  && this.props.singlePatientSelect === false )  || (selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITH_PAY) && this.props.singlePatientSelect === true && familyDetailsData.filter(ele => ele.type === 'others' ).length === 0 )  ?
                                <View style={{ marginTop: 8, }}>
                                    {familyDetailsData.length !== 0 ? <Text style={{ fontSize: 12, fontFamily: 'OpenSans', color: '#7F49C3', textAlign: 'center', }}>(OR)</Text> : null}
                                    <Text style={styles.subHead}>Add other patient's details</Text>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col size={6}>
                                            <Row>
                                                <Col size={2} style={{justifyContent:'center'}}>
                                                    <Text style={styles.nameAndAge}>Name</Text>
                                                </Col>
                                                <Col size={8} style={{justifyContent:'center'}}>
                                                    <Input placeholder="Enter name" style={styles.inputText}
                                                        returnKeyType={'next'}
                                                        keyboardType={"default"}
                                                        value={name}
                                                        onChangeText={(name) => this.setState({ name })}
                                                        blurOnSubmit={false}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col size={4} style={{ marginLeft: 5 }}>
                                            <Row>
                                                <Col size={2} style={{justifyContent:'center'}}>
                                                    <Text style={styles.nameAndAge}>Age</Text>
                                                </Col>
                                                <Col size={7} style={{justifyContent:'center'}}>
                                                    <Input placeholder="Enter age" style={styles.inputText}
                                                        returnKeyType={'done'}
                                                        keyboardType="numeric"
                                                        value={age}
                                                        onChangeText={(age) => this.setState({ age })}
                                                        blurOnSubmit={false}
                                                    />
                                                </Col>
                                                <Col size={1}>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <View style={{ marginTop: 10, borderBottomWidth: 0, flexDirection: 'row' }}>
                                        <Text style={{
                                            fontFamily: 'OpenSans', fontSize: 12, marginTop: 3
                                        }}>Gender</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={gender === "M" ? true : false}
                                                onPress={() => this.setState({ gender: "M" })} />
                                            <Text style={[styles.commonText, { marginLeft: 5 }]}>Male</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={gender === "F" ? true : false}
                                                onPress={() => this.setState({ gender: "F" })} />
                                            <Text style={[styles.commonText, { marginLeft: 5 }]}>Female</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                                            <Radio
                                                standardStyle={true}
                                                selected={gender === "O" ? true : false}
                                                onPress={() => this.setState({ gender: "O" })} />
                                            <Text style={[styles.commonText, { marginLeft: 5 }]}>Others</Text>
                                        </View>
                                    </View>
                                    <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                                        <TouchableOpacity style={styles.touchStyle} onPress={() => this.addPatientList()} >
                                            <Text style={styles.touchText}>Add patient</Text>
                                        </TouchableOpacity>
                                    </Row>
                                </View>
                                : null}
                        </View>
                        : null}

                    <View style={{ marginTop: 10 }}>
                        {selectedPatientTypes.includes(POSSIBLE_FAMILY_MEMBERS.FAMILY_WITHOUT_PAY) ?
                            
                            <View>
                                <Text style={{ fontSize: 12, fontFamily: 'OpenSans' }}>Patient Details</Text>
                                <FlatList
                                    data={payBy === POSSIBLE_PAY_METHODS.INSURANCE ? data.familyDataByInsurance : data.familyDataByCorporate}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) =>
                                        this.renderPatientDetails(item, index, true, POSSIBLE_FAMILY_MEMBERS.FAMILY_WITHOUT_PAY)
                                    } />
                            </View>

                            : null
                        }
                    </View>

                </View>


            </View>



        )
    }

}


export {
    TestDetails,
    POSSIBLE_FAMILY_MEMBERS
}


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#F5F5F5',
        marginTop: 10,

    },

    bodyContent: {

        backgroundColor: '#F5F5F5'

    },
    touchStyle: {
        backgroundColor: '#7F49C3',
        borderRadius: 3,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 5,
        paddingTop: 5
    },
    touchText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#fff',
        textAlign: 'center'
    },
    inputText: {
        backgroundColor: '#f2f2f2',
        color: '#000',
        fontSize: 12,
        height: 33,
        marginTop:8
    },
    nameAndAge: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#000',
        marginTop: 5
    },
    subHead: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#000',
        // fontWeight: 'bold'
    },
    NameText: {
        fontSize: 12,
        fontFamily: 'OpenSans',
        color: '#7F49C3'
    },
    ageText: {
        fontSize: 12,
        fontFamily: 'OpenSans',
        textAlign: 'right',
    },
    commonText: {
        fontSize: 12,
        fontFamily: 'OpenSans',
    },
    selectButton: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 2,
        paddingBottom: 2,
        backgroundColor: '#8EC63F',
        borderRadius: 2
    },
    benefeciaryButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 5
    }

});