import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image'
import { Icon, Card } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';


export const CoverageCard = (props) => {
  const navigationTo = (data) => {
    const { navigation } = props;
    switch (data) {

      case 'PolicyStatus':
        return navigation("PolicyStatus");
      case 'Policy Cover':
        return navigation("PolicyCoverage");
      case 'Pre Auth':
        return navigation("preAuthList");
case 'Claim Intimation':
return navigation('FamilyInfoList',{navigationPage:"ClaimIntimationSubmission"})

    }
  }

  const data = [
    {

      category_name: 'Pre Authorisation',
      image: require('../../../../../assets/images/corporateHomePageIcons/Claim-status.png'),
      navigate: 'Pre Auth',

    },
    { category_name: 'Claim Status', image: require('../../../../../assets/images/corporateHomePageIcons/Claim-status.png'), navigate: 'PolicyStatus' }, { category_name: 'Policy Cover', image: require('../../../../../assets/images/corporateHomePageIcons/policy-cover.png'), navigate: 'Policy Cover' }, { category_name: 'Claim Intimation', image: require('../../../../../assets/images/corporateHomePageIcons/claim-intimation.png') , navigate: 'Claim Intimation' }, { category_name: 'Insurance Renewal', image: require('../../../../../assets/images/corporateHomePageIcons/insurance-renewal-reminder.png'), },]
  return (
    <View>
      <Card style={{ width: '100%', paddingBottom: 10 }}>
        <Text style={{ fontFamily: 'OpenSans', fontSize: 13, textAlign: 'center', padding: 5, backgroundColor: '#E4D1FE' }}>Coverage</Text>
        <FlatList horizontal={false} numColumns={4}
          data={data}
          renderItem={({ item, index }) =>
            <View style={{ width: '25%', marginTop: 15, }}>
              <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigationTo(item.navigate)} 
                  style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: 5, paddingBottom: 5, borderRadius: 10, }}>
                  <FastImage
                    source={item.image}
                    style={{
                      width: 45, height: 45, alignItems: 'center'
                    }}
                  />

                </TouchableOpacity>
               
              </Col>
              <Text style={{
                  fontSize: 12,
                  textAlign: 'center',
                  fontWeight: '700',
                  color: '#7F49C3',
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingTop: 1,
                  paddingBottom: 1,
                  height:35
                }}>{item.category_name}</Text>
            </View>
          }
          keyExtractor={(item, index) => index.toString()}
        />
      </Card>


    </View>
  );
}

const styles = StyleSheet.create({
  userName: {
    color: '#7F49C3',
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: '700'

  },
  mainCol: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 0.1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    padding: 1,
    marginTop: 15,
    marginLeft: 11,
    marginBottom: 1, width: '20%', backgroundColor: '#fafafa',
  }
});