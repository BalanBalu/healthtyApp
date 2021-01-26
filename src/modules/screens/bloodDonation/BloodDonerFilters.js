import React, { Component } from 'react';
import { Container, Content, View, Text, Left, Item, Right, Footer, List, ListItem, Spinner, Card, Picker, Radio, Row, Col, Form, Button, Icon, Input, } from 'native-base';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import Autocomplete from '../../../components/Autocomplete'
import { bloodDonationFilter, bloodDonationList } from '../../providers/profile/profile.action'
import { object } from 'prop-types';
import { translate } from "../../../setup/translator.helper"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

class BloodDonerFilters extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bloodList: [],
      stateList: [],
      countryList: [],
      cityList: [],
      districtList: [],
      selectedOne: 'BLOODGROUP',
      isloading: false,
      bloodSelect: null,
      countrySelect: null,
      stateSelect: null,
      citySelect: null,
      districtSelect: null,
      bloodgroupbutton: false
    }
    this.filterData = [];
  }

  async componentDidMount() {
    let result = await bloodDonationFilter(this.filterData);

    if (result.success) {
      result.data.bloodGroupList.unshift("None")
      result.data.stateList.unshift("None")
      result.data.countryList.unshift("None")
      result.data.cityList.unshift("None")
      result.data.districtList.unshift("None")
      this.setState({
        bloodList: result.data.bloodGroupList,
        stateList: result.data.stateList,
        countryList: result.data.countryList,
        cityList: result.data.cityList,
        districtList: result.data.districtList
      })

    }
    await this.setState({
      isloading: true
    })
  }

  getBlooddonationfilterList = async (data) => {
    try {
      const {
        bloodSelect,
        countrySelect,
        stateSelect,
        citySelect,
        districtSelect
      } = this.state
      let result = await bloodDonationFilter(data);
      if (result.success) {
        result.data.bloodGroupList.unshift("None")
        result.data.stateList.unshift("None")
        result.data.countryList.unshift("None")
        result.data.cityList.unshift("None")
        result.data.districtList.unshift("None")
        if (bloodSelect == null) {
          this.setState({
            bloodList: result.data.bloodGroupList
          })
        }
        if (countrySelect == null) {
          await this.setState({
            countryList: result.data.countryList
          })
        }
        if (stateSelect == null) {
          await this.setState({
            stateList: result.data.stateList
          })
        }
        if (citySelect == null) {
          await this.setState({
            cityList: result.data.cityList
          })
        }
        if (districtSelect == null) {
          await this.setState({
            districtList: result.data.districtList
          })
        }

      }

      await this.setState({
        isloading: true
      })
      return true
    } catch (e) {
      console.log(e)
    }
  }

  selectedData(create) {
    this.setState({
      selectedOne: create
    })
  }

  async clickedBloodDonorAvailableList(value, type) {
    let object = {
      type: type,
      value: value
    }

    let bloodlist = this.filterData.findIndex(list => list.type === type)
    if (bloodlist != -1) {

      this.filterData.splice(bloodlist, 1)
    }
    if (value != "None") {
      this.filterData.push(object);
    }

    if (type == 'blood_group') {
      await this.setState({
        bloodSelect: value,
        countrySelect: null,
        stateSelect: null,
        districtSelect: null,
        citySelect: null
      })
      bloodlist = this.filterData.findIndex(list => list.type === type);
      if (bloodlist != -1) {
        this.filterData = [];
        this.filterData.push(object)
      }
    }
    if (type == 'address.address.country') {
      let temp = []
      await this.setState({
        countrySelect: value,
        stateSelect: null,
        districtSelect: null,
        citySelect: null
      })
      bloodlist = this.filterData.findIndex(list => list.type === 'blood_group')


      let countryIndex = this.filterData.findIndex(list => list.type === 'address.address.country')

      if (bloodlist != -1) {
        temp.push(this.filterData[bloodlist])
      }
      if (countryIndex != -1) {
        temp.push(this.filterData[countryIndex])
      }
      this.filterData = []
      this.filterData = temp
    }
    if (type == 'address.address.state') {
      await this.setState({
        stateSelect: value,
        districtSelect: null,
        citySelect: null
      })
      let temp = []

      bloodlist = this.filterData.findIndex(list => list.type === 'blood_group')

      let countryIndex = this.filterData.findIndex(list => list.type === 'address.address.country')
      let stateIndex = this.filterData.findIndex(list => list.type === 'address.address.state')
      if (bloodlist != -1) {
        temp.push(this.filterData[bloodlist])
      }
      if (countryIndex != -1) {
        temp.push(this.filterData[countryIndex])
      }
      if (stateIndex != -1) {
        temp.push(this.filterData[stateIndex])
      }
      this.filterData = []
      this.filterData = temp
    }
    if (type == 'address.address.district') {
      await this.setState({
        districtSelect: value,
        citySelect: null
      })
      let temp = []

      bloodlist = this.filterData.findIndex(list => list.type === 'blood_group')
      let countryIndex = this.filterData.findIndex(list => list.type === 'address.address.country')
      let stateIndex = this.filterData.findIndex(list => list.type === 'address.address.state')
      let districtIndex = this.filterData.findIndex(list => list.type === 'address.address.district')
      if (bloodlist != -1) {
        temp.push(this.filterData[bloodlist])
      }
      if (countryIndex != -1) {
        temp.push(this.filterData[countryIndex])
      }
      if (stateIndex != -1) {
        temp.push(this.filterData[stateIndex])
      }
      if (districtIndex != -1) {
        temp.push(this.filterData[districtIndex])
      }
      this.filterData = []
      this.filterData = temp
    }
    if (type == 'address.address.city') {
      await this.setState({
        citySelect: value
      })
      let bloodlist = this.filterData.findIndex(list => list.type === 'blood_group')

      if (bloodlist != -1) {
        this.filterData.splice(bloodlist, 1)
      }
    }

    let position = this.filterData
    position.map((t) => {
      if (t.type === "blood_group") {
        this.setState({ selectedOne: "COUNTRY" })
      }
      else if (t.type === "address.address.country") {
        this.setState({ selectedOne: "STATE" })
      }
      else if (t.type === "address.address.state") {
        this.setState({ selectedOne: "DISTRICT" })
      }
      else if (t.type === "address.address.district") {
        this.setState({ selectedOne: "CITY" })
      }

    })


    await this.getBlooddonationfilterList(position);

  }

  async filteredTotalDataList1() {
    let user = [],
      doctor = [];
    let result = await bloodDonationList(this.filterData);

    if (result.success) {
      user = result.data.userList
      doctor = result.data.doctorList
      user.concat(doctor);

      await this.setState({
        data: user
      })
    }
    this.props.navigation.navigate('Blood Donors', {
      filteredData: user, filerCount: this.filterData.length
    })
  }


  render() {
    const { selectedOne } = this.state
    return (
      <Container>
        <Content style={{ padding: 5 }}>
          <View style={{ marginBottom: 50 }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ width: '30%', }}>
              </View>
              <View style={{ width: '70%', }}>
                {this.state.selectedOne == 'BLOODGROUP' ?
                  <View>
                    <ListItem style={{ justifyContent: 'center' }}>
                      <Text style={styles.textHead}>{translate("Blood Group")}</Text>
                    </ListItem>
                    <FlatList
                      data={this.state.bloodList}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item, index }) =>
                        <ListItem>
                          <TouchableOpacity
                            onPress={() => this.clickedBloodDonorAvailableList(item, 'blood_group')}
                            style={{ flexDirection: 'row' }}>
                            <Left>
                              <Text style={styles.subText}>{item}</Text>
                            </Left>
                            <Right>
                              <Radio
                                standardStyle={true}
                                onPress={() => this.clickedBloodDonorAvailableList(item, 'blood_group')}
                                selected={this.state.bloodSelect === item ? true : false}
                              />

                            </Right>
                          </TouchableOpacity>

                        </ListItem>
                      } />
                  </View> : null}

                {this.state.selectedOne == 'COUNTRY' ?
                  <View>
                    <ListItem style={{ justifyContent: 'center' }}>
                      <Text style={styles.textHead}>{translate("Country")}</Text>
                    </ListItem>
                    <FlatList
                      data={this.state.countryList}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) =>
                        <ListItem>
                          <TouchableOpacity
                            onPress={() => this.clickedBloodDonorAvailableList(item, 'address.address.country')}
                            style={{ flexDirection: 'row' }}>
                            <Left>
                              <Text style={styles.subText}>{item}</Text>
                            </Left>
                            <Right>
                              <Radio
                                standardStyle={true}
                                onPress={() => this.clickedBloodDonorAvailableList(item, 'address.address.country')}
                                selected={this.state.countrySelect === item ? true : false}
                              />
                            </Right>
                          </TouchableOpacity>
                        </ListItem>
                      } />
                  </View> : null}

                {this.state.selectedOne == 'STATE' ?
                  <View>
                    <ListItem style={{ justifyContent: 'center' }}>
                      <Text style={styles.textHead}>{translate("State")}</Text>
                    </ListItem>
                    <FlatList
                      data={this.state.stateList}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) =>
                        <ListItem >
                          <TouchableOpacity onPress={() => this.clickedBloodDonorAvailableList(item, 'address.address.state')}
                            style={{ flexDirection: 'row' }}>
                            <Left>
                              <Text style={styles.subText}>{item}</Text>
                            </Left>
                            <Right>

                              <Radio
                                standardStyle={true}
                                onPress={() => this.clickedBloodDonorAvailableList(item, 'address.address.state')}
                                selected={this.state.stateSelect === item ? true : false}
                              />
                            </Right>
                          </TouchableOpacity>
                        </ListItem>
                      } />
                  </View> : null}

                {this.state.selectedOne == 'DISTRICT' ?
                  <View>
                    <ListItem style={{ justifyContent: 'center' }}>
                      <Text style={styles.textHead}>{translate("District")}</Text>
                    </ListItem>
                    <FlatList
                      data={this.state.districtList}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) =>
                        <ListItem >
                          <TouchableOpacity
                            onPress={() => this.clickedBloodDonorAvailableList(item, 'address.address.district')}
                            style={{ flexDirection: 'row' }}>
                            <Left>
                              <Text style={styles.subText}>{item}</Text>
                            </Left>
                            <Right>
                              <Radio
                                standardStyle={true}
                                onPress={() => this.clickedBloodDonorAvailableList(item, 'address.address.district')}
                                selected={this.state.districtSelect === item ? true : false}
                              />
                            </Right>
                          </TouchableOpacity>
                        </ListItem>
                      } />
                  </View> : null}


                {this.state.selectedOne == 'CITY' ?
                  <View>

                    <ListItem style={{ justifyContent: 'center' }}>
                      <Text style={styles.textHead}>{translate("City")}</Text>
                    </ListItem>
                    <FlatList
                      data={this.state.cityList}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) =>
                        <ListItem >
                          <TouchableOpacity
                            onPress={() => this.clickedBloodDonorAvailableList(item, 'address.address.city')}
                            style={{ flexDirection: 'row' }}
                          >
                            <Left>
                              <Text style={styles.subText}>{item}</Text>
                            </Left>
                            <Right>
                              <Radio
                                standardStyle={true}
                                onPress={() => this.clickedBloodDonorAvailableList(item, 'address.address.city')}
                                selected={this.state.citySelect === item ? true : false}
                              />
                            </Right>
                          </TouchableOpacity>
                        </ListItem>
                      } />
                  </View>
                  : null}
              </View>
            </View>
          </View>
        </Content>


        <View style={styles.ViewStyle}>
          <List style={{ marginLeft: -20 }}>
            <ListItem>
              <Text style={styles.textHead}>{translate("Categories")}</Text>
            </ListItem>

            <ListItem style={selectedOne === 'BLOODGROUP' ? { backgroundColor: '#784EBC', paddingLeft: 10 } : { paddingLeft: 10 }}>
              <TouchableOpacity onPress={() => this.selectedData('BLOODGROUP')} style={{ flexDirection: 'row' }}>
                <Left>
                  <Text style={selectedOne === 'BLOODGROUP' ? { fontFamily: 'OpenSans', fontSize: 12, color:'#fff'}:{fontFamily: 'OpenSans', fontSize: 12,}}>{translate("Blood Group")} </Text>

                </Left>
                <Right>
                  <MaterialIcons name="keyboard-arrow-right" style={selectedOne === 'BLOODGROUP' ?{ fontSize: 25,color:'#fff' }:{ fontSize: 25 }} />
                </Right>
              </TouchableOpacity>
            </ListItem>
            <ListItem style={selectedOne === 'COUNTRY' ? { backgroundColor: '#784EBC', paddingLeft: 10 } : { paddingLeft: 10 }}>
              <TouchableOpacity onPress={() => this.selectedData('COUNTRY')} style={{ flexDirection: 'row' }}>
                <Left>
                  <Text style={selectedOne === 'COUNTRY' ? { fontFamily: 'OpenSans', fontSize: 12,color:'#fff' }: { fontFamily: 'OpenSans', fontSize: 12 }}>{translate("Country")}</Text>
                </Left>
                <Right>
                  <MaterialIcons name="keyboard-arrow-right" style={selectedOne === 'COUNTRY' ? { fontSize: 25,color:'#fff' }:{ fontSize: 25 }} />
                </Right>
              </TouchableOpacity>
            </ListItem>
            <ListItem style={selectedOne === 'STATE' ? { backgroundColor: '#784EBC', paddingLeft: 10 } : { paddingLeft: 10 }}>
              <TouchableOpacity onPress={() => this.selectedData('STATE')} style={{ flexDirection: 'row' }}>
                <Left>
                  <Text style={selectedOne === 'STATE' ?{ fontFamily: 'OpenSans', fontSize: 12,color:'#fff'}:{fontFamily: 'OpenSans', fontSize: 12}}>{translate("State")}</Text>
                </Left>
                <Right>
                  <MaterialIcons name="keyboard-arrow-right" style={selectedOne === 'STATE' ?{ fontSize: 25,color:'#fff' } :{ fontSize: 25}} />
                </Right>
              </TouchableOpacity>
            </ListItem>
            <ListItem style={selectedOne === 'DISTRICT' ? { backgroundColor: '#784EBC', paddingLeft: 10 } : { paddingLeft: 10 }}>
              <TouchableOpacity onPress={() => this.selectedData('DISTRICT')} style={{ flexDirection: 'row' }}>
                <Left>
                  <Text style={selectedOne === 'DISTRICT' ?{ fontFamily: 'OpenSans', fontSize: 12,color:'#fff' }:{ fontFamily: 'OpenSans', fontSize: 12, }}>{translate("District")}</Text>
                </Left>
                <Right>
                  <MaterialIcons name="keyboard-arrow-right" style={selectedOne === 'DISTRICT' ?{ fontSize: 25,color:'#fff' }:{fontSize: 25}} />
                </Right>
              </TouchableOpacity>
            </ListItem>
            <ListItem style={selectedOne === 'CITY' ? { backgroundColor: '#784EBC', paddingLeft: 10 } : { paddingLeft: 10 }}>
              <TouchableOpacity onPress={() => this.selectedData('CITY')} style={{ flexDirection: 'row' }}>
                <Left>
                  <Text style={selectedOne === 'CITY' ?{ fontFamily: 'OpenSans', fontSize: 12,color:'#fff' }:{ fontFamily: 'OpenSans', fontSize: 12, }}>{translate("City")}</Text>
                </Left>
                <Right>
                  <MaterialIcons name="keyboard-arrow-right" style={selectedOne === 'CITY' ?{ fontSize: 25,color:'#fff' }:{ fontSize: 25 }} />
                </Right>
              </TouchableOpacity>
            </ListItem>
          </List>
        </View>
        <TouchableOpacity onPress={() => this.filteredTotalDataList1()} style={{ backgroundColor: '#7E49C3' }}>
          <Footer style={{ backgroundColor: '#7E49C3', justifyContent: 'center', alignItems: 'center' }}>

            <Text uppercase={true} style={styles.searchText}>{translate("search")}</Text>

          </Footer>
        </TouchableOpacity>
      </Container>
    )
  }
}

export default BloodDonerFilters

const styles = StyleSheet.create({
  textHead: {
    fontFamily: 'OpenSans',
    fontSize: 13.5,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  subText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
  },
  ViewStyle: {
    width: '30%',
    borderRightColor: 'gray',
    borderRightWidth: 1,
    height: 800,
    position: 'absolute'
  },
  searchText: {
    textAlign: 'center',
    fontFamily: 'OpenSans',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  }
})