import React, { Component } from 'react';
import { Container, Toast, Text, Item } from 'native-base';
import { TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { serviceOfGetPreAuthList } from '../../../providers/corporate/corporate.actions'
import RenderPreAuthList from './RenderPreAuthList';
import { Loader } from '../../../../components/ContentLoader';
import {primaryColor} from '../../../../setup/config'
import {translate} from '../../../../setup/translator.helper'


const PAGINATION_COUNT_FOR_GET_PRE_AUTH_LIST = 10;

export default class preAuthList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      preAuthInfoList: [],
      isLoading: true,
      isLoadingMoreHospitalList: false,
    }
    this.employeeCode = null;
    this.memberPolicyNo = null;
    this.isEnabledLoadMoreData = true;
    this.incrementPaginationCount = 1;
    this.preAuthListArray = [];
  }

  async componentDidMount() {
    try {
      this.employeeCode = await AsyncStorage.getItem("employeeCode");
      this.memberPolicyNo = await AsyncStorage.getItem("memberPolicyNo");
      await this.getPreAuthList();
    } catch (Ex) {
      Toast.show({
        text: 'Something Went Wrong' + Ex,
        duration: 3000,
        type: "danger"
      })
    }
    finally {
      this.setState({ isLoading: false });
    }
  }


  getPreAuthList = async () => {
    try {
      const { } = this.state
      const preAuthResp = await serviceOfGetPreAuthList(this.memberPolicyNo, this.employeeCode, this.incrementPaginationCount, PAGINATION_COUNT_FOR_GET_PRE_AUTH_LIST);
      const getPreAuthList = preAuthResp && preAuthResp.docs;
      if (getPreAuthList && getPreAuthList.length) {
        this.incrementPaginationCount = this.incrementPaginationCount + 1;
        this.preAuthListArray = [...this.preAuthListArray, ...getPreAuthList];
        this.setState({ preAuthInfoList: this.preAuthListArray })
      }
      else {
        if (this.preAuthListArray.length > 5) {
          Toast.show({
            text: 'No more hospitals Available!',
            duration: 3000,
            type: "success"
          })
        }
        this.isEnabledLoadMoreData = false;
      }
    } catch (Ex) {
      console.log('Ex is getting on Get Network Hospitals ==>', Ex.message)
      Toast.show({
        text: 'Something Went Wrong' + Ex.message,
        duration: 3000,
        type: "danger"
      })
    }
  }
  toggleData(data) {
    const { showCard, show } = this.state
    if(data===showCard){
         this.setState({ showCard: data, show: !this.state.show, })
    }
    else{
      this.setState({ showCard: data,show: false})
    }

  }

  renderPreAuthInformationCard(item, index) {
    return (
      <RenderPreAuthList
        item={item}
        index={index}
        showCard={this.state.showCard}
        show={this.state.show}
        onPressArrowIconSelectedIndex={index}
        navigation={this.props.navigation}
        onPressToggleButton={(data)=>this.toggleData(data)}
      >
      </RenderPreAuthList>
    )
  }
  loadMoreData = async () => {
    try {
      this.setState({ isLoadingMoreHospitalList: true });
      await this.getPreAuthList();
    } catch (error) {
      console.log("Ex is getting on load more Pre AUth list", error.message);
    }
    finally {
      this.setState({ isLoadingMoreHospitalList: false })
    }
  }
  

  render() {
    const { preAuthInfoList, isLoading, isLoadingMoreHospitalList } = this.state
    return (
      <Container>
        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 15, marginRight: '3%' }}>
          <TouchableOpacity style={{ flexDirection: 'row', borderColor: primaryColor, borderWidth: 1, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2 }} onPress={() => this.props.navigation.navigate('FamilyInfoList', { navigationPage: 'PreAuthSubmission' })}>
            <MaterialIcons name="add" style={{ color: primaryColor, fontSize: 20 }} />
            <Text style={{ fontFamily: 'Roboto', fontSize: 15, color: primaryColor }}>{translate("Add Pre Auth")}</Text>
          </TouchableOpacity>
        </View>
        {isLoading ?
          <Loader style='newList' />
          :
          preAuthInfoList.length ?
          <View style={{padding:10}}>
            <FlatList
              data={preAuthInfoList}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                if (this.isEnabledLoadMoreData) {
                  this.loadMoreData();
                }
              }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => this.renderPreAuthInformationCard(item, index)
              } />
              </View>
            : <Item style={{ borderBottomWidth: 0, marginTop: 100, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }} >{translate("No Pre Auth list found!")}</Text>
            </Item>
        }
        {isLoadingMoreHospitalList ?
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <ActivityIndicator
              style={{ marginBottom: 17 }}
              animating={isLoadingMoreHospitalList}
              size="large"
              color='blue'
            />
          </View>
          : null}
      </Container>

    )
  }
}