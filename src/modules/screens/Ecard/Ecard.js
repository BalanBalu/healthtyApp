import React, { PureComponent } from 'react';
import { Text, Container, ListItem, List, Content, Row, Col, Card, } from 'native-base';
import { View, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';


class Ecard extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {

        }

    }


employeeAndFamilyDetails(data){
    return(
    <View>
    <View style={{ marginTop: 10, backgroundColor: '#f2f5f4', paddingTop: 8 ,justifyContent:'center',alignItems:'center',paddingBottom:8}}>
      
       
            <Text style={styles.headerText}>THE NEW INDIA ASSURANCE</Text>
            <Text style={styles.headerText}>COMPANY LIMITED</Text>
            <Text style={styles.compName}>TRAVEL TROOPS GLOBAL PVT LTD</Text>
       
    </View>
    <Row style={{ backgroundColor: '#1C5BA8', padding: 5 ,paddingBottom:25}}>
        <Col size={2.5}>
            <Text style={styles.innerText}>Policy No.</Text>
            <Text style={styles.innerText}>Health India ID</Text>
            <Text style={styles.innerText}>Member code</Text>
            <Text style={styles.innerText}>Member Name</Text>
            <Text style={styles.innerText}>Gender</Text>
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

        </Col>
        <Col size={5.5}>
          <Text style={styles.innerText}>{data.Policy_No}</Text>
            <Text style={styles.innerText}>{data.health_india_Id}</Text>
            <Text style={styles.innerText}>{data.member_code}</Text>
            <Text style={styles.innerText}>{data.member_name}</Text>
            <Text style={styles.innerText}>{data.gender} {"     "} Age : {data.age} Years</Text>
            <Text style={styles.innerText}>{data.Relationship}</Text>
            <Text style={styles.innerText}>{data.Emp_code}</Text>
            <Text style={styles.innerText}>{data.Valid_upto}</Text>
        </Col>
        <Col size={1.8} style={{ alignItems: 'center' }}>
           
        </Col>
    </Row>
    <Row style={{ backgroundColor: '#5CB533', paddingBottom: 5, paddingTop: 5 }}>
        <Col size={2} style={styles.colStyle}>
            <Image source={require('../../../../assets/images/healthIndia.png')} style={{ height: 60, width: 80 }} />
        </Col>
        <Col size={8} style={styles.colStyle}>
            <Text style={styles.footerText}>Health India Insurance TPA Services Pvt Ltd.</Text>
            <Text style={styles.addressText}>Neelkanath Corpoate Park,Office No.406 to 412, 4th Floor, Vidhar(W),Mumbai-400086</Text>
        </Col>
    </Row>

<TouchableOpacity style={{marginTop:10,alignItems:'flex-end',justifyContent:'flex-end'}}>
          <Text style={styles.linkHeader}>Download</Text>
</TouchableOpacity>


</View>
    )
}


    render() {
    const Empdatas = {Policy_No:'72050025552541035712',health_india_Id:'3652023',member_code:'3652023E',member_name:'VIJAY ',gender:"Male",age:27,Relationship:'Employee',Emp_code:'PYT0211',Valid_upto:'Open (Subject to policy Renewal).',
                      FamilyData:[{Policy_No:'72050025552541035712',health_india_Id:'3652023',member_code:'3652023E',member_name:'Shankar',gender:"Male",age:27,Relationship:'Employee',Emp_code:'PYT0211',Valid_upto:'Open (Subject to policy Renewal).'},
                      {Policy_No:'72050025552541035712',health_india_Id:'3652023',member_code:'3652023E',member_name:'Thirumaran',gender:"Male",age:27,Relationship:'Employee',Emp_code:'PYT0211',Valid_upto:'Open (Subject to policy Renewal).'}, ]}
        return (
            <Container>
                <Content style={{ padding: 15 }}>
                    <View style={{ marginBottom: 20 }}>
                   {this.employeeAndFamilyDetails(Empdatas)}
                   <View style={styles.borderStyle}/>
                     <View>
                         <Text style={styles.familyHeader}>Family Members</Text>
                     <FlatList
                            data={Empdatas.FamilyData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) =>
                            this.employeeAndFamilyDetails(item)
                            }/>
                     </View>
                        
                    </View>
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
    compDetails:{
        marginTop: 10, 
        backgroundColor: '#f2f5f4', 
        paddingBottom: 5, 
        paddingTop: 5
    },
    borderStyle:{
        borderBottomColor:'gray',
        borderBottomWidth:0.5,
        paddingTop:5,
        paddingBottom:10
    },
    familyHeader:{
        fontFamily:'OpenSans',
        fontSize:18,
        fontWeight:'700',
        marginTop:10,
        textAlign:'center',
        paddingBottom:10
    },
    addressText:{
        fontFamily: 'OpenSans', 
        fontSize: 10, 
        textAlign: 'center', 
        fontWeight: '700'
    }
})