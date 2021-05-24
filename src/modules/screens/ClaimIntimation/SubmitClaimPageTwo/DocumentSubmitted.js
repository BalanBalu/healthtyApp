import React, {useEffect, useState} from 'react';
import { Text, View, CheckBox } from 'native-base';
import { TouchableOpacity, FlatList, } from 'react-native'
import styles from '../Styles';



// { text: 'Claim form duly signed', },
// { text: 'CT/MR/USG/HPE investigation reports' },
// { text: 'Copy of the Pre-authorization approval letter' },
// { text: 'Copy of Photo ID Card of patient Verified by hospital' },
// { text: 'Hospital Discharge summary' },
// { text: 'Operation Theatre Notes' },
// { text: 'Hospital main bill' },
// { text: 'Any other, please specify' },
// { text: 'Investigation reports' },
// { text: 'Original Pre-authorization request' },
// { text: 'Doctor’s reference slip for investigation' },
// { text: 'ECG' },
// { text: 'Pharmacy bills' },
// { text: 'MLC reports & Police FIR' },
// { text: 'Hospital break-up bill' },
const DocumentSubmitted = (props) => {
    const {ListOfData, checkBoxClick, updateClaimDetails} = props;

    const [claimFormDulySigned, setCheckBox1] = useState(false);
    const [ctInvestigationReports, setCheckBox2] = useState(false);
    const [copyOfPreAuthApprovalLetter, setCheckBox3] = useState(false);
    const [patientVerifiedByHospital, setCheckBox4] = useState(false);
    const [hospitalDischargeSummary, setCheckBox5] = useState(false);
    const [operationTheatreNotes, setCheckBox6] = useState(false);
    const [hospitalMainBill, setCheckBox7] = useState(false);
    const [anyOthers, setCheckBox8] = useState(false);
    const [investigationReports, setCheckBox9] = useState(false);
    const [originalPreAuthRequest, setCheckBox10] = useState(false);
    const [DoctorReferenceSlipForInvestigation, setCheckBox11] = useState(false);
    const [ecg, setCheckBox12] = useState(false);
    const [pharmacyBill, setCheckBox13] = useState(false);
    const [MLCReportsAndPoliceFIR, setCheckBox14] = useState(false);
    const [hospitalBreakupBill, setCheckBox15] = useState(false);
  
    return (
        <View>
                 <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{borderRadius: 5}}
          status={claimFormDulySigned ? true : false}
          checked={claimFormDulySigned==true}
          onPress={() => setCheckBox1(true)}
          testID="selectCheckBox1"
        />
        <Text style={styles.flatlistText}>Claim form duly signed</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{borderRadius: 5}}
          status={ctInvestigationReports ? true : false}
          checked={ctInvestigationReports==true}
          onPress={() => setCheckBox2(true)}
          testID="selectCheckBox2"
        />
        <Text style={styles.flatlistText}>Investigation reports</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{borderRadius: 5}}
          status={copyOfPreAuthApprovalLetter ? true : false}
          checked={copyOfPreAuthApprovalLetter==true}
          onPress={() => setCheckBox3(true)}
          testID="selectCheckBox3"
        />
        <Text style={styles.flatlistText}>Copy of the Pre-authorization approval letter</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{borderRadius: 5}}
          status={patientVerifiedByHospital ? true : false}
          checked={patientVerifiedByHospital==true}
          onPress={() => setCheckBox4(true)}
          testID="selectCheckBox4"
        />
        <Text style={styles.flatlistText}>Copy of Photo ID Card of patient Verified by hospital</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{borderRadius: 5}}
          status={hospitalDischargeSummary ? true : false}
          checked={hospitalDischargeSummary==true}
          onPress={() => setCheckBox5(true)}
          testID="selectCheckBox5"

        />
        <Text style={styles.flatlistText}>Hospital Discharge Summary</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{borderRadius: 5}}
          status={operationTheatreNotes ? true : false}
          checked={operationTheatreNotes==true}
          onPress={() => setCheckBox6(true)}
          testID="selectCheckBox6"

        />
        <Text style={styles.flatlistText}>Operation Theatre Notes</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{borderRadius: 5}}
          status={hospitalMainBill ? true : false}
          checked={hospitalMainBill==true}
          onPress={() => setCheckBox7(true)}
          testID="selectCheckBox7"
        />
        <Text style={styles.flatlistText}>Hospital main bill</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{borderRadius: 5}}
          status={anyOthers ? true : false}
          checked={anyOthers==true}
          onPress={() => setCheckBox8(true)}
          testID="selectCheckBox8"
        />
        <Text style={styles.flatlistText}>Any other, please specify</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{borderRadius: 5}}
          status={investigationReports ? true : false}
          checked={investigationReports==true}
          onPress={() => setCheckBox9(true)}
          testID="selectCheckBox9"
        />
        <Text style={styles.flatlistText}>Investigation reports including(including CT/MRI/USG/HPE)</Text>
      </View>
     
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{borderRadius: 5}}
          status={originalPreAuthRequest ? true : false}
          checked={originalPreAuthRequest==true}
          onPress={() => setCheckBox10(true)}
          testID="selectCheckBox10"
        />
        <Text style={styles.flatlistText}>Original Pre-authorization request</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{borderRadius: 5}}
          status={DoctorReferenceSlipForInvestigation ? true : false}
          checked={DoctorReferenceSlipForInvestigation==true}
          onPress={() => setCheckBox11(true)}
          testID="selectCheckBox11"
        />
        <Text style={styles.flatlistText}>Doctor’s reference slip for investigation</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{borderRadius: 5}}
          status={ecg ? true : false}
          checked={ecg==true}
          onPress={() => setCheckBox12(true)}
          testID="selectCheckBox12"
        />
        <Text style={styles.flatlistText}>ECG</Text>
      </View>
     
      
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{borderRadius: 5}}
          status={pharmacyBill ? true : false}
          checked={pharmacyBill==true}
          onPress={() => setCheckBox13(true)}
          testID="selectCheckBox13"
        />
        <Text style={styles.flatlistText}>Pharmacy Bill</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{borderRadius: 5}}
          status={MLCReportsAndPoliceFIR ? true : false}
          checked={MLCReportsAndPoliceFIR==true}
          onPress={() => setCheckBox14(true)}
          testID="selectCheckBox14"
        />
        <Text style={styles.flatlistText}>MLC reports & Police FIR</Text>
      </View>
     
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{borderRadius: 5}}
          status={hospitalBreakupBill ? true : false}
          checked={hospitalBreakupBill==true}
          onPress={() => setCheckBox15(true)}
          testID="selectCheckBox15"
        />
        <Text style={styles.flatlistText}>Hospital Break-up bill</Text>
      </View>
            <View style={styles.ButtonView}>
                <TouchableOpacity style={styles.submit_ButtonStyle} >
                    <Text style={{ color: "#fff" }}>Submit And Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


export default DocumentSubmitted