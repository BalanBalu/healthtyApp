import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image'
import { Icon, Card } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { NavigationActions } from 'react-navigation';


export const SearchAndAppointmentCard = (props) => {
  const navigationTo = (data) => {
    const { navigation } = props;
    switch (data) {
      case 'Doctor List':
        return navigation("Categories");
      case 'Home Health Care':
        return navigation("Home Healthcare Address List", { fromNavigation: "HOME_HEALTH_CARE" });
      case 'HospitalList':
        return navigation("Categories", { fromNavigation: "HOSPITAl" });
      case 'Lab Test':
        return navigation("Lab Test");
      case 'Video and Chat Service':
        return navigation("Video and Chat Service");
      case 'Reminder':
        return navigation("Reminder");
    }
  }
  const data = [{ category_name: 'Consultation', image: require('../../../../../assets/images/corporateHomePageIcons/consultation.png'), navigate: 'Doctor List' }, { category_name: 'Home test', image: require('../../../../../assets/images/corporateHomePageIcons/home-test.png'), navigate: 'Home Health Care' }, { category_name: 'Hospital', image: require('../../../../../assets/images/corporateHomePageIcons/hospital_a.png'), navigate: 'HospitalList' }, { category_name: 'Lab test', image: require('../../../../../assets/images/corporateHomePageIcons/Lab-test.png'), navigate: 'Lab Test' },
 { category_name: 'My Chats', image: require('../../../../../assets/images/corporateHomePageIcons/chat.png'), navigate: 'Video and Chat Service' }, { category_name: 'Video Consult', image: require('../../../../../assets/images/corporateHomePageIcons/video-consultation.png'), navigate: 'Video and Chat Service' },]
  return (
    <View>
      <Card style={{ width: '100%', paddingBottom: 10 }}>
        <Text style={{ fontFamily: 'OpenSans', fontSize: 13, textAlign: 'center', padding: 5, backgroundColor: '#E4D1FE' }}>Search & Book Appoinment </Text>

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
                <Text style={{
                  fontSize: 12,
                  textAlign: 'center',
                  fontWeight: '700',
                  color: '#7F49C3',
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingTop: 1,
                  paddingBottom: 1
                }}>{item.category_name}</Text>
              </Col>

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