import React, { Component } from 'react';
import { Container, Content, View, Text,Left, Item,Right,Footer,List,ListItem, Spinner,Card,Picker, Radio,Row,Col,Form,Button,Icon,Input, } from 'native-base';
import {StyleSheet,TextInput,TouchableOpacity,ScrollView} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import Autocomplete from '../../../components/Autocomplete'
import {bloodDonationFilter,bloodDonationList}from '../../providers/profile/profile.action'
import { RadioButton, } from 'react-native-paper';
import { object } from 'prop-types';
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
      districtSelect: null
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
    this.filterData.push(object);

    
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
    await this.getBlooddonationfilterList(this.filterData);

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

    this.props.navigation.navigate('Blood Doners', {
      data: user
    })



  }
     
          
  render() {
    const {selectedOne} = this.state
     return (
        <Container> 
          <Content style={{padding:5}}>
              <View style={{marginBottom:50}}>
                <View style={{flexDirection:'row',flex:1}}>
                  <View style={{width:'30%',}}>
                    </View>
                      <View style={{width:'70%',}}>
                        {this.state.selectedOne == 'BLOODGROUP' ? 
                          <View>
                            <ListItem style={{justifyContent:'center'}}>
                              <Text style={styles.textHead}>Blood Group</Text>
                            </ListItem>
                            <FlatList 
                              data={this.state.bloodList}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({item,index})=>
                            <ListItem>
                                <RadioButton.Group onValueChange={value => this.clickedBloodDonorAvailableList(value,'blood_group')}
                                      value={this.state.bloodSelect}> 
                                  
                                <TouchableOpacity
                                   onPress={()=>this.clickedBloodDonorAvailableList(item,'blood_group')}
                                  style={{flexDirection:'row'}}>
                                  <Left>
                                    <Text style={styles.subText}>{item}</Text> 
                                  </Left>
                                  <Right>
                                      <RadioButton value={item}/>
                                  </Right>
                                </TouchableOpacity>
                              </RadioButton.Group>
                               
                            </ListItem>
                          }/> 
                          </View> : null }

                        {this.state.selectedOne == 'COUNTRY' ?
                          <View>
                            <ListItem style={{justifyContent:'center'}}>
                              <Text style={styles.textHead}>Country</Text>
                            </ListItem>
                            <FlatList
                                data={this.state.countryList}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item})=>
                              <ListItem>
                                <TouchableOpacity 
                                  onPress={()=>this.clickedBloodDonorAvailableList(item,'address.address.country')}
                                  style={{flexDirection:'row'}}>
                                  <Left>
                                    <Text style={styles.subText}>{item}</Text>
                                  </Left>
                                  <Right>
                                    <RadioButton.Group onValueChange={value => this.clickedBloodDonorAvailableList(value,'address.address.country')}
                                        value={this.state.countrySelect}> 
                                        <RadioButton value={item}/>
                                    </RadioButton.Group>
                                  </Right>
                                </TouchableOpacity>
                              </ListItem>
                            }/> 
                          </View> :null }
                        
                        { this.state.selectedOne == 'STATE' ?
                          <View>
                            <ListItem style={{justifyContent:'center'}}>
                              <Text style={styles.textHead}>State</Text>
                            </ListItem>
                            <FlatList
                                data={this.state.stateList}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item})=>
                              <ListItem >
                                <TouchableOpacity onPress={() => this.clickedBloodDonorAvailableList(item,'address.address.state')}
                                  style={{flexDirection:'row'}}>
                                  <Left>
                                    <Text style={styles.subText}>{item}</Text>
                                  </Left>
                                  <Right>
                                    <RadioButton.Group onValueChange={value => this.clickedBloodDonorAvailableList(value,'address.address.state')}
                                      value={this.state.stateSelect}> 
                                        <RadioButton value={item}/>
                                    </RadioButton.Group>
                                  </Right>
                                </TouchableOpacity>
                              </ListItem>
                            }/>
                          </View> : null }
                         
                       {this.state.selectedOne == 'DISTRICT'?
                        <View>
                          <ListItem style={{justifyContent:'center'}}>
                            <Text style={styles.textHead}>District</Text>
                          </ListItem>
                          <FlatList 
                              data={this.state.districtList}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({item})=>
                            <ListItem >
                              <TouchableOpacity 
                                onPress={()=>this.clickedBloodDonorAvailableList(item,'address.address.district')}
                                style={{flexDirection:'row'}}>
                                <Left>
                                  <Text style={styles.subText}>{item}</Text>
                                </Left>
                                <Right>
                                  <RadioButton.Group onValueChange={value => this.clickedBloodDonorAvailableList(value,'address.address.district')}
                                    value={this.state.districtSelect}> 
                                    <RadioButton value={item}/>
                                  </RadioButton.Group>
                                </Right>
                              </TouchableOpacity>
                            </ListItem>
                          }/> 
                        </View> : null }


                    {this.state.selectedOne == 'CITY' ?
                    <View>

                   <ListItem style={{justifyContent:'center'}}>
                          <Text style={styles.textHead}>City</Text>
                          </ListItem>
                           <FlatList
                             data={this.state.cityList}
                             keyExtractor={(item, index) => index.toString()}
                             renderItem={({item})=>
                          <ListItem >
                             <TouchableOpacity 
                       onPress={()=>this.clickedBloodDonorAvailableList(item,'address.address.city')}
                          style={{flexDirection:'row'}}
                          >
                           <Left>
                             <Text style={styles.subText}>{item}</Text>
                           </Left>
                           <Right>
                           <RadioButton.Group   onValueChange={value => this.clickedBloodDonorAvailableList(value,'address.address.city')}
                           value={this.state.citySelect}> 
                                <RadioButton value={item}/>
                              </RadioButton.Group>
                           </Right>
                           </TouchableOpacity>
                         </ListItem>
                           }/> 
                         </View>
                         :null}
                      </View>
                   </View>
                </View>
              </Content>
              
              
              <View style={styles.ViewStyle}>
               <List style={{marginLeft:-20}}>
                <ListItem style={{justifyContent:'center'}}>
                <Text style={styles.textHead}>Categories</Text>
                  </ListItem>
                
                  <ListItem style={selectedOne === 'BLOODGROUP' ? {backgroundColor:'#784EBC',paddingLeft:10} : {paddingLeft:10}}>
                  <TouchableOpacity  onPress={()=> this.selectedData('BLOODGROUP')}  style={{flexDirection:'row'}}> 
                    <Left> 
                    <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Blood Group</Text>
                   
                    </Left>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{fontSize:25}}/>
                    </Right>
                    </TouchableOpacity>
                  </ListItem>
                  <ListItem style={selectedOne === 'COUNTRY' ? {backgroundColor:'#784EBC',paddingLeft:10} : {paddingLeft:10}}>
                  <TouchableOpacity onPress={()=>this.selectedData('COUNTRY')} style={{flexDirection:'row'}}>
                  <Left>
                    <Text style={{fontFamily:'OpenSans',fontSize:14}}>Country</Text>
                    </Left>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{fontSize:25}}/>
                    </Right>
                    </TouchableOpacity>
                  </ListItem>
                  <ListItem style={selectedOne === 'STATE' ? {backgroundColor:'#784EBC',paddingLeft:10} : {paddingLeft:10}}>
                  <TouchableOpacity onPress={()=>this.selectedData('STATE' )} style={{flexDirection:'row'}}>
                    <Left>
                    <Text style={{fontFamily:'OpenSans',fontSize:14}}>State</Text>
                    </Left>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{fontSize:25}}/>
                    </Right>
                    </TouchableOpacity>
                  </ListItem>
                  <ListItem style={selectedOne === 'DISTRICT' ? {backgroundColor:'#784EBC',paddingLeft:10} : {paddingLeft:10}}>
                  <TouchableOpacity onPress={()=>this.selectedData('DISTRICT' )} style={{flexDirection:'row'}}>
                 <Left>
                    <Text style={{fontFamily:'OpenSans',fontSize:14,}}>District</Text>
                    </Left>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{fontSize:25}}/>
                    </Right>
                    </TouchableOpacity>
                  </ListItem>
                  <ListItem style={selectedOne === 'CITY' ? {backgroundColor:'#784EBC',paddingLeft:10} : {paddingLeft:10}}>
                  <TouchableOpacity onPress={()=>this.selectedData('CITY')} style={{flexDirection:'row'}}>
                  <Left>
                    <Text style={{fontFamily:'OpenSans',fontSize:14,}}>City</Text>
                    </Left>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{fontSize:25}}/>
                    </Right>
                    </TouchableOpacity>
                  </ListItem>
                </List>
              </View>
              <TouchableOpacity onPress={()=>this.filteredTotalDataList1()} style={{ backgroundColor: '#7E49C3'}}>
              <Footer style={{ backgroundColor: '#7E49C3',justifyContent:'center',alignItems:'center' }}>
                
                <Text uppercase={true} style={styles.searchText}>search</Text>
                 
              </Footer>
              </TouchableOpacity>
          </Container>
        )
    }
}

export default BloodDonerFilters

const styles = StyleSheet.create({
  textHead:{
    fontFamily:'OpenSans',
    fontSize:16,
    fontWeight:'bold',
  },
  subText:{
    fontFamily:'OpenSans',
    fontSize:14,
  },
  ViewStyle:{
    width:'30%',
    borderRightColor:'gray',
    borderRightWidth:1,
    height:800,
    position:'absolute'
  },
  searchText:{
    textAlign:'center',
    fontFamily:'OpenSans',
    fontSize:20,
    fontWeight:'bold',
    color:'#fff'
  }
})