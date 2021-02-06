import React from 'react';
import { StyleSheet, Image, AsyncStorage } from 'react-native';
import { Container, Content,Text, View, Card, Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity, } from 'react-native-gesture-handler';
import ProgressBar from 'react-native-horizontal-progress-bar'
import { getMemberDetailsByEmail } from '../../providers/corporate/corporate.actions'; ''
import { getPolicyByPolicyNo } from '../../providers/policy/policy.action';
import { formatDate } from '../../../setup/helpers';

class PolicyCoverage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memberDetails: {},
      policyDetails: {}
    }
  }

  componentDidMount() {
    this.getMemberDetailsByEmail()
  }
  getMemberDetailsByEmail = async () => {
    try {
      let memberEmailId = await AsyncStorage.getItem('memberEmailId') || null;
      let result = await getMemberDetailsByEmail(memberEmailId);
      if (result) {
        let policyData = await getPolicyByPolicyNo(result[0].policyNo);
        await this.setState({ memberDetails: result[0], policyDetails: policyData });
        await this.termsAndConditionListDetails()
      }
    } catch (ex) {
      console.log(ex)
    }

  }
  termsAndConditionListDetails = async () => {
    try {
      const { policyDetails } = this.state
      this.termsAndConditionList = [];

      if (policyDetails && policyDetails.renewalTerms && policyDetails.renewalTerms.length > 0) {
        for (let renewalTerm of policyDetails.renewalTerms) {
          if (renewalTerm.checkedData === true) {
            let text = '';
            if (renewalTerm.key === 'FAMILY_DEFINITION') {
              let values = renewalTerm['value'];
              text = text + 'Includes ';
              for (let value of values) {
                if (value && value['employee'] && value['employee'] === true) {
                  text = text + 'Employee,'
                } else if (value && value['spouse'] && value['spouse'] === true) {
                  text = text + ' Spouse,'
                } else if (value && value['first2Children'] && value['first2Children'] === true) {
                  text = text + ' First two childrens,'
                } else if (value && value['parentsOrParentInLaws'] && value['parentsOrParentInLaws'] === true) {
                  text = text + ' Parents Or Parent In Laws,'
                }
              }
            }

            else if (renewalTerm.key === 'SUM_INSURED') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['commomForAllGrades'] && value['commomForAllGrades'] === true) {
                  text = text + 'Common for all grades,'
                } else if (value && value['gradedAsPerTheMemberData'] && value['gradedAsPerTheMemberData'] === true) {
                  text = text + ' Graded as per the member data'
                }
              }
            }

            else if (renewalTerm.key === 'MAX_AGE') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['noLimit'] && value['noLimit'] === true) {
                  text = text + 'There is no age limit.'
                } else if (value && value['limitUpTo'] && value['limitUpTo'] === true) {
                  text = text + 'Age limit is upto ' + value['limit']
                }
              }
            }

            else if (renewalTerm.key === 'PRE_EXITING') {
              let values = renewalTerm['value'];
              text = 'Pre-existing Disease';
              for (let value of values) {
                if (value && value['covered'] && value['covered'] === true) {
                  text = text + ' Covered.'
                } else if (value && value['notCovered'] && value['notCovered'] === true) {
                  text = text + ' Not Covered.';
                }
              }
            }

            else if (renewalTerm.key === 'DELETION_WAITING') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['waivedOff'] && value['waivedOff'] === true) {
                  text = text + ' Waived Off for deletion of 30 days waiting period.'
                } else if (value && value['noWaiver'] && value['noWaiver'] === true) {
                  text = text + ' No waived for deletion of 30 days waiting period.';
                }
              }
            }

            else if (renewalTerm.key === 'DELETION_EXCLUSION') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['waivedOff'] && value['waivedOff'] === true) {
                  text = text + ' Waived Off for deletion of 1/2/4 years exclusion';
                } else if (value && value['noWaiver'] && value['noWaiver'] === true) {
                  text = text + ' No waived for deletion of 1/2/4 years exclusion.';
                }
              }
            }

            else if (renewalTerm.key === 'AMBULANCE_CHARGES') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['notPayable'] && value['notPayable'] === true) {
                  text = text + ' Ambulance charges are not applicable.';
                } else if (value && value['payableUpto'] && value['payableUpto'] === true) {
                  text = text + ' Ambulance charges payable upto Rs.' + value['limit'] + ' per hospitalization.';
                }
              }
            }

            else if (renewalTerm.key === 'MATERNITY_BENEFITS') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['notCovered'] && value['notCovered'] === true) {
                  text = text + 'Maternity not covered.';
                } else if (value && value['normalDeliveryCharge'] && value['normalDeliveryCharge'] === true) {
                  text = text + 'Rs.' + value['normalDelivery'] + ' for normal delivery and Rs.' + value['cSection'] + ' for C-Section';
                }
              }
            }


            else if (renewalTerm.key === '9_MONTHS') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['waivedOff'] && value['waivedOff'] === true) {
                  text = text + ' Waived Off for 9 month waiting period.';
                } else if (value && value['noWaiver'] && value['noWaiver'] === true) {
                  text = text + ' No waived for 9 month waiting period.';
                }
              }
            }


            else if (renewalTerm.key === 'PRE_POST') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['notPayable'] && value['notPayable'] === true) {
                  text = text + 'Pre & Post Natal expenses not payable.';
                } else if (value && value['maternityLimit'] && value['maternityLimit'] === true) {
                  text = text + 'Pre & Post Natal expenses payable upto Rs.' + value['limit'] + ' within maternity limit.';
                }
              }
            }


            else if (renewalTerm.key === 'NEW_BORN') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['notCovered'] && value['notCovered'] === true) {
                  text = text + 'New Born baby not covered.';
                } else if (value && value['familySI'] && value['familySI'] === true) {
                  text = text + 'New born baby day one covered within family sum insured.';
                }
              }
            }


            else if (renewalTerm.key === 'CORPORATE_BUFFER') {
              let values = renewalTerm['value'];
              text = 'Corporate buffer ';
              for (let value of values) {
                if (value && value['notAvailable'] && value['notAvailable'] === true) {
                  text = text + 'not available.';
                } else if (value && value['availableUpto'] && value['availableUpto'] === true) {
                  text = text + 'available upto Rs.' + value['limit'];
                } else if (value && value['perEmployee'] && value['perEmployee'] === true) {
                  text = text + ' per employee';
                } else if (value && value['notLimit'] && value['notLimit'] === true) {
                  text = text + ' per family with no limit';
                }
              }
            }

            else if (renewalTerm.key === 'ROOM_RENT') {
              debugger
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value) {
                  text = text + (value['normalRoom'] ? value['normalRoom'] : '0') + ' of Sum Insured for normal room and ' + (value['icu'] ? value['icu'] : '0') + ' of Sum Insured for ICU.';
                }
              }
            }

            else if (renewalTerm.key === 'ROOM_PROPORTIONATE') {
              let values = renewalTerm['value'];
              text = 'Room rent proportionate Charges ';
              for (let value of values) {
                if (value && value['applicable'] && value['applicable'] === true) {
                  text = text + 'applicable.';
                } else if (value && value['notApplicable'] && value['notApplicable'] === true) {
                  text = text + 'not applicable.';
                }
              }
            }

            else if (renewalTerm.key === 'DECLARATION_PERIOD') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['midTermInclusion'] && value['midTermInclusion'] === true) {
                  text = text + 'Mid term Inclusion of left out members can be included.';
                } else if (value && value['inceptionOfPolicy'] && value['inceptionOfPolicy'] === true) {
                  text = text + 'Any left out members during inception can be included within 15 days from Inception of policy';
                }
              }
            }

            else if (renewalTerm.key === 'CO_PAY') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['notAvailable'] && value['notAvailable'] === true) {
                  text = text + 'Co-pay not applicable.';
                } else if (value && value['availableUpto'] && value['availableUpto'] === true) {
                  text = text + 'Co-pay available upto ' + value['limit'] + '% ';
                } else if (value && value['forAllMembers'] && value['forAllMembers'] === true) {
                  text = text + 'for all members.';
                } else if (value && value['forDependentsOnly'] && value['forDependentsOnly'] === true) {
                  text = text + 'for dependants only.';
                } else if (value && value['forParentsOnly'] && value['forParentsOnly'] === true) {
                  text = text + 'for parents only.';
                }
              }
            }

            else if (renewalTerm.key === 'PRE_HOSPITALISATION') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['days'] && value['days'] === true) {
                  text = text + 'Pre Hospitalisation period is 30 days.';
                }
              }
            }

            else if (renewalTerm.key === 'POST_HOSPITALISATION') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['days'] && value['days'] === true) {
                  text = text + 'Post hospitalisation period is 90 days.';
                }
              }
            }

            else if (renewalTerm.key === 'INTERNAL_CONGENTIAL') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['covered'] && value['covered'] === true) {
                  text = text + 'Internal Congenital is covered';
                } else if (value && value['notCovered'] && value['notCovered'] === true) {
                  text = text + 'Internal Congenital is not covered';
                }
              }
            }

            else if (renewalTerm.key === 'EXTERNAL_CONGENTIAL') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['threateningConditions'] && value['threateningConditions'] === true) {
                  text = text + 'External Congenital covered under life threatening conditions.';
                } else {
                  text = text + 'External Congenital not covered';
                }
              }
            }

            else if (renewalTerm.key === 'AILMENT_WISE') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['limit'] && value['limit'] === true) {
                  text = text + 'Ailment wise cappings has limit.';
                } else if (value && value['noLimit'] && value['noLimit'] === true) {
                  text = text + 'No limit for ailment wise cappings.';
                }
              }
            }

            else if (renewalTerm.key === 'MID_TERM') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['noMidTermInclusionAllowed'] && value['noMidTermInclusionAllowed'] === true) {
                  text = text + 'No Mid term Inclusion allowed for parents/parent in laws.';
                } else if (value && value['midtermCoverage'] && value['midtermCoverage'] === true) {
                  text = text + 'Inclusion of new employees & dependents from the date of joining provided intimation by 1st of succeeding month and premium remittan (Existing dependants of new employees must join along with them and cannot be added later)Mid term coverage/inclusion for dependents – only for new born child/newly married spouse';
                }
              }
            }

            else if (renewalTerm.key === 'MID_ADDITION') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['applicable'] && value['applicable'] === true) {
                  text = text + 'Mid term addition except parents applicable.';
                } else if (value && value['notApplicable'] && value['notApplicable'] === true) {
                  text = text + 'Mid term addition except parents not applicable.';
                }
              }
            }

            else if (renewalTerm.key === 'OMISSION_INSURANCE') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['applicable'] && value['applicable'] === true) {
                  text = text + 'Omission to Insure is applicable';
                } else if (value && value['notApplicable'] && value['notApplicable'] === true) {
                  text = text + 'Omission to Insure is not available.';
                }
              }
            }

            else if (renewalTerm.key === 'DAY_CARE') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['notCovered'] && value['notCovered'] === true) {
                  text = text + 'Day care procedures not covered';
                } else if (value && value['covered'] && value['covered'] === true) {
                  text = text + 'Day care procedures covered as per the standard list.';
                }
              }
            }

            else if (renewalTerm.key === 'LASIK_SURGEY') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['notPayable'] && value['notPayable'] === true) {
                  text = text + 'Lasik surgery not payable.';
                } else if (value && value['payable'] && value['payable'] === true) {
                  text = text + 'Lasik surgery(Medically advised) payable upto eye power above +/- ' + value['limit'];
                }
              }
            }

            else if (renewalTerm.key === 'AYURVEDIC_TREATMENT') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['notPayable'] && value['notPayable'] === true) {
                  text = text + 'Ayurvedic Treatment / Ayush is not payable.';
                } else if (value && value['payable'] && value['payable'] === true) {
                  text = text + 'Ayurvedic Treatment / Ayush payable upto ' + value['limit'] + ' of family sum insured.';
                }
              }
            }

            else if (renewalTerm.key === 'CASHLESS_FACILITY') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['covered'] && value['covered'] === true) {
                  text = text + 'Cashless Facility covered.';
                } else if (value && value['notCovered'] && value['notCovered'] === true) {
                  text = text + 'Cashless Facility not covered.';
                }
              }
            }

            else if (renewalTerm.key === 'TERRORISM') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['covered'] && value['covered'] === true) {
                  text = text + 'Terrorism covered.';
                } else if (value && value['notCovered'] && value['notCovered'] === true) {
                  text = text + 'Terrorism not covered.';
                }
              }
            }

            else if (renewalTerm.key === 'CLAIM_INTIMATION') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['notWaived'] && value['notWaived'] === true) {
                  text = text + 'Claim intimation not waived.';
                } else if (value && value['waivedOff'] && value['waivedOff'] === true) {
                  text = text + 'claim intimation is waived off.';
                }
              }
            }

            else if (renewalTerm.key === 'CLAIM_SUBMISSION') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['withinDaysFromDischargeDateFromHospital'] && value['withinDaysFromDischargeDateFromHospital'] === true) {
                  text = text + 'Claim Submission should be within ' + value['limit'] + ' days from discharge date from hospital.';
                }
              }
            }

            else if (renewalTerm.key === 'MID_INCREASE') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['applicable'] && value['applicable'] === true) {
                  text = text + 'Mid Term Increase in Sum Insured is applicable.';
                } else if (value && value['notApplicable'] && value['notApplicable'] === true) {
                  text = text + 'Mid Term Increase in Sum Insured is not applicable.';
                }
              }
            }

            else if (renewalTerm.key === 'ADD_DEL') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['onSatndardBasis'] && value['onSatndardBasis'] === true) {
                  text = text + 'Add/Deletion is on standard basis.';
                } else if (value && value['onPro-RataBasis'] && value['onPro-RataBasis'] === true) {
                  text = text + 'Add/Deletion is on pro rate basis.';
                }
              }
            }

            else if (renewalTerm.key === 'PPN_CLAUSE') {
              let values = renewalTerm['value'];
              text = '';
              for (let value of values) {
                if (value && value['applicable'] && value['applicable'] === true) {
                  text = text + 'PPN Clause is applicable.';
                } else if (value && value['notApplicable'] && value['notApplicable'] === true) {
                  text = text + 'PPN Clause is not applicable.';
                }
              }
            }


            text = text.trim();
            if (text) {
              this.termsAndConditionList.push(text);
            }
          }
        }
      }
    } catch (ex) {
      console.log(ex)
    }

  }

  render() {
    const { memberDetails, policyDetails } = this.state
    return (
      <Container>
        <Content style={{ backgroundColor: '#F3F3F4' }}>
          <View style={{ marginTop: 20, marginRight: 10, marginLeft: 10 }}>
            <Text style={styles.myInsuranceText}>My Insurance</Text>
            <Card style={styles.cardStyle}>
              <Row style={{ borderBottomColor: 'gray', borderBottomWidth: 1, paddingBottom: 10 }}>
                <Col size={2}>
                  <Image source={require('../../../../assets/images/male_user.png')} style={{ height: 45, width: 45 }} />
                </Col>
                <Col size={6}>
                  <Text style={{ fontFamily: 'OpenSans', fontSize: 16, marginTop: 10 }}>{memberDetails.firstName ? (memberDetails.firstName + ' ' + memberDetails.lastName) : '-'}</Text>
                </Col>
                <Col size={2}>
                  <TouchableOpacity style={styles.ecardButton} onPress={() => this.props.navigation.navigate('E Card')}>
                    <Text style={styles.linkHeader}>View Ecard</Text>
                  </TouchableOpacity>
                </Col>
              </Row>
              <View style={{ marginBottom: 10 }}>
                <Row style={{ paddingBottom: 10, marginTop: 10 }}>
                  <Col size={5}>
                    <Text style={styles.subHeadingStyle}>Policy Number</Text>
                    <Text style={styles.subHeadingData}>{memberDetails.policyNo ? memberDetails.policyNo : '-'}</Text>
                  </Col>
                  <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <Text style={styles.subHeadingStyle}>Validity period</Text>
                    <Text style={[styles.subHeadingData,{textAlign:'right'}]}>{formatDate(policyDetails.policyEffectiveFrom, "DD-YYYY") +" "+"to"+" " + formatDate(policyDetails.policyEffectiveTo, "DD-YYYY")}</Text>
                  </Col>
                </Row>
                <Row style={{ paddingBottom: 10, marginTop: 10 }}>
                  <Col size={5}>
                    <Text style={styles.subHeadingStyle}>Insurance company</Text>
                    <Text style={styles.subHeadingData}>{memberDetails.insuranceCompany ? memberDetails.insuranceCompany : '-'}</Text>
                  </Col>
                </Row>
                <Text style={[styles.subText, { marginTop: 5 }]}>Balance Sum Insured</Text>
                <View style={{ marginTop: 2 }}>
                  <Text style={{ fontFamily: 'OpenSans', fontSize: 18, }}>{memberDetails.balSumInsured ? memberDetails.balSumInsured : 0}<Text style={{ fontFamily: 'OpenSans', fontSize: 13, color: '#909090' }}>{" "}/{memberDetails.sumInsured ? memberDetails.sumInsured : 0}</Text></Text>
                </View>
                <ProgressBar progress={0.5} color={'#4CAF50'} style={styles.progressbarStyle} animated={true} />

                {/* <Text style={[styles.subText, { marginTop: 15 },]}>Family Sum Insured</Text>
                <View style={{ marginTop: 2 }}>
                  <Text style={{ fontFamily: 'OpenSans', fontSize: 18, }}>15000.00<Text style={{ fontFamily: 'OpenSans', fontSize: 13, color: '#909090' }}>{" "}/ 50000.00</Text></Text>
                </View>
                <ProgressBar progress={0.2} color={'#2196F3'} style={styles.progressbarStyle} animated={true} /> */}


              </View>

            </Card>
            <TouchableOpacity onPress={() => { 
              if (this.termsAndConditionList&&this.termsAndConditionList.length!=0){
              this.props.navigation.navigate("PolicyConditions", { termsAndConditionList: this.termsAndConditionList }) }
              else{
                Toast.show({
                  text: 'No Details Available',
                  type: "warning",
                  duration: 3000
                });
              }}}>
              <Card style={styles.cardStyle}>
                <Row>
                  <Col size={9} style={{ justifyContent: 'center' }}>
                    <Text style={styles.policyConitionText}>Policy Conditions</Text>
                    <Text style={styles.policyConditionSubText}>View all the policy and conditions  given to you </Text>
                  </Col>
                  <Col size={1} style={{ justifyContent: 'center' }}>
                    <MaterialIcons name="keyboard-arrow-right" style={{ fontSize: 30 }} />
                  </Col>
                </Row>
              </Card>
            </TouchableOpacity>
          </View>

        </Content>
      </Container>
    )
  }
}

export default PolicyCoverage

const styles = StyleSheet.create({
  linkHeader: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    textDecorationColor: '#7F49C3',
    textDecorationLine: 'underline',
    color: '#7F49C3'
  },
  subHeadingStyle: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: '#909090'
  },
  progressbarStyle: {
    height: 20,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5
  },
  myInsuranceText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center'
  },
  cardStyle: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 10,
    borderRadius: 5
  },
  ecardButton: {
    marginTop: 15,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  subText: {
    marginTop: 15,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  policyConitionText: {
    fontFamily: 'OpenSans',
    fontSize: 15,
  },
  subHeadingData:{
    fontFamily: 'OpenSans',
    fontSize: 14,
  },
  policyConditionSubText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: '#909090'
  }
})

