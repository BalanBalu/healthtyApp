import React, { Component } from 'react';
import { Container, Content, Text, Icon, Input, View, Item } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import { TouchableOpacity, FlatList } from 'react-native';
import { smartHealthGetService } from '../../../setup/services/httpservices';
import Styles from './styles';
import RenderTpaList from './renderTpaListView';
import { Loader } from '../../../components/ContentLoader';
import CheckLocationWarning from '../Home/LocationWarning';

export default class TpaList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tpaList: [],
      selectedTpaItem: null,
      selectedIndex: null,
      isLoading: true
    }
  }
  async componentDidMount() {
    await this.fetchTpaListfromSMHserver();  // Get all TPA list from smart health server
  }
  fetchTpaListfromSMHserver = async () => {
    try {
      const endPoint = 'tpa-master';
      const tpaListResp = await smartHealthGetService(endPoint);
      if (tpaListResp && tpaListResp.data && tpaListResp.data.length) {
        this.setState({ tpaList: tpaListResp.data })
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
  onChangeTpaText() {
  }
  render() {
    const { tpaList, selectedTpaItem, isLoading } = this.state;
    if (isLoading) return <Loader style='list' />;
    return (
      <Container>
        <View style={{ paddingBottom: 10 }}>
          <View style={Styles.inputMainView}>
            <Grid>
              <Col size={10}>
                <Item style={Styles.inputItem}>
                  <Input
                    placeholder='Search for Insurance companies     '
                    style={{ fontSize: 14, width: '300%' }}
                    placeholderTextColor="#909894"
                    keyboardType={'default'}
                    onChangeText={(text) => this.onChangeTpaText(text)}
                    returnKeyType={'done'}
                    multiline={false} />
                  <TouchableOpacity style={{ alignItems: 'flex-end' }}>
                    <Icon name='ios-search' style={{ color: '#775DA3', fontSize: 22 }} />
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
              <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }} > No TPA list found!</Text>
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
