import React, { Component } from 'react';
import { Container, Content, Text, Icon, Input, View, Item, Button } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import { TouchableOpacity, FlatList } from 'react-native';
import { smartHealthGetService } from '../../../setup/services/httpservices';
import Styles from './styles';
import RenderTpaList from './renderTpaListView';
import { Loader } from '../../../components/ContentLoader';
import CheckLocationWarning from '../Home/LocationWarning';
import { debounce } from '../../common';


export default class TpaList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tpaList: [],
      selectedTpaItem: null,
      selectedIndex: null,
      visibleClearIcon: '',
      isLoading: true
    }
    this.callGetSuggestionListService = debounce(this.callGetSuggestionListService, 300);
    this.initialTpaList = [];
  }
  async componentDidMount() {
    await this.fetchTpaListfromSMHserver();  // Get all TPA list from smart health server
  }
  fetchTpaListfromSMHserver = async () => {
    try {
      const endPoint = 'tpa-master';
      const tpaListResp = await smartHealthGetService(endPoint);
      if (tpaListResp && tpaListResp.data && tpaListResp.data.length) {
        this.setState({ tpaList: tpaListResp.data });
        this.initialTpaList = tpaListResp.data;
      }
    } catch (error) {
      console.log('Ex is getting on get All TPA list', error.message)
    }
    finally {
      this.setState({ isLoading: false })
    }
  }
  OnPressCheckLocWarningAndGoNextProcess = (selectedTpaItem, index) => {
    CheckLocationWarning.checkLocationWarning(this.onPressToggleBySelectTapItem.bind(this), [selectedTpaItem, index]);
  }
  onPressToggleBySelectTapItem = async (selectedTpaItem, index) => {
    this.setState({ selectedTpaItem, selectedIndex: index })
  }
  renderTPaListCards(item, index) {
    return (
      <RenderTpaList
        item={item}
        selectedIndex={this.state.selectedIndex}
        index={index}
        onPressToggleBySelectTapItem={(selectedTpaItem, index) => this.OnPressCheckLocWarningAndGoNextProcess(selectedTpaItem, index)}
      >
      </RenderTpaList>
    )
  }
  onPressContinueToNextProcess = () => {
    this.props.navigation.navigate("NetworkHospitals", { TpaInfoObj: this.state.selectedTpaItem })
  }
  getSuggestionListFunction = async (enteredText) => {
    await this.setState({ visibleClearIcon: enteredText });
    if (this.initialTpaList && this.initialTpaList.length) {
      this.callGetSuggestionListService(enteredText);  // Call the Suggestion API with Debounce method
    }
  }


  callGetSuggestionListService(enteredText) {
    const lowerCaseOfEnteredText = enteredText.toLowerCase();
    const resultedTpaList = [];
    this.initialTpaList && this.initialTpaList.forEach(tpaItem => {
      const lowerCaseOfTpaName = tpaItem && tpaItem.tpaName.toLowerCase();
      let findIndex = lowerCaseOfTpaName.indexOf(lowerCaseOfEnteredText);
      if (findIndex !== -1) {
        tpaItem.findIndex = findIndex === 0 ? findIndex + 1 : findIndex;
        resultedTpaList.push(tpaItem)
      }
    })
    resultedTpaList.sort((a, b) => a.findIndex - b.findIndex)  // Finally sort the suggestion list array
    this.setState({ tpaList: resultedTpaList });
  }
  clearTotalTextFromSearchBar = () => {
    this.setState({ visibleClearIcon: '', selectedTpaItem: null, selectedIndex: null, tpaList: this.initialTpaList })
  };
  render() {
    const { tpaList, selectedTpaItem, visibleClearIcon, isLoading } = this.state;
    if (isLoading) return <Loader style='list' />;
    return (
      <Container>
        <View style={{ paddingBottom: 10 }}>
          <View style={Styles.inputMainView}>
            <Grid>
              <Col size={10}>
                <Item style={Styles.inputItem}>
                  <Input
                    placeholder='Search by Insurance companies     '
                    style={{ fontSize: 14, width: '300%' }}
                    placeholderTextColor="#909894"
                    keyboardType={'default'}
                    onChangeText={enteredText => this.getSuggestionListFunction(enteredText)}
                    returnKeyType={'done'}
                    multiline={false}
                    value={visibleClearIcon}
                    underlineColorAndroid="transparent"
                  />
                  <TouchableOpacity style={{ alignItems: 'flex-end' }}>
                    {visibleClearIcon ?
                      <Button transparent onPress={() => this.clearTotalTextFromSearchBar()} style={{ justifyContent: 'flex-start', marginLeft: -10 }}>
                        <Icon name="ios-close" style={{ fontSize: 25, color: 'gray' }} />
                      </Button>
                      :
                      <Icon name='ios-search' style={{ color: '#775DA3', fontSize: 22 }} />
                    }
                  </TouchableOpacity>
                </Item>
              </Col>
            </Grid>
          </View>
        </View>
        <Content>
          {tpaList && tpaList.length ?
            <FlatList
              data={tpaList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => this.renderTPaListCards(item, index)}
            />
            :
            <Item style={{ borderBottomWidth: 0, marginTop: 100, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }} >{visibleClearIcon ? "No TPA list found!...Try again" : "No TPA list found!"}</Text>
            </Item>
          }
        </Content>
        {tpaList && tpaList.length ?
          <TouchableOpacity style={Styles.continueButton} onPress={() => selectedTpaItem && Object.keys(selectedTpaItem).length ? this.onPressContinueToNextProcess() : null} >
            <Text style={Styles.continueText}>{selectedTpaItem && Object.keys(selectedTpaItem).length ? "Continue" : "Select TPA"}</Text>
          </TouchableOpacity>
          : null}
      </Container>
    );
  }
}
