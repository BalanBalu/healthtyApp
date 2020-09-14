import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, FlatList } from 'react-native';
import { CorporateProfileCard } from './profileCard'
import { ProfileFamilyCard } from './profilefamilyCard'
import { SearchAndAppointmentCard } from './searchAndAppointmentcard'
import { TransactionHistoryCard } from './transactionHistoryCard'

export const CorporateHome = (props) => {
    const { corporateData, navigation} = props;
  
    return (
        <View style={{ padding: 10 }}>
            <CorporateProfileCard
             data={corporateData
                &&corporateData.find(ele => ele.relationship === 'EMPLOYEE')||null 
            }
             />
            <ProfileFamilyCard 
            navigation={navigation}
            />
            <SearchAndAppointmentCard
                navigation={navigation}
            />
            <TransactionHistoryCard
                navigation={navigation} />

        </View>
    );
}

