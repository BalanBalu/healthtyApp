import React, { PureComponent } from 'react';
import { Text, Radio, Icon, Input, CheckBox, Right, Container, Content, Item } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, View, AsyncStorage } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux'
import RenderFamilyList from './RenderFamilyList';
class FamilyInfoList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            familyList: [],
            isShowBeneficiaryInfoCard: -1
        }
        this.navigationPage = props.navigation.getParam('navigationPage');
        this.preAuthReqData = props.navigation.getParam('preAuthReqData');

    }
    UNSAFE_componentWillMount() {
        const { profile: { corporateData } } = this.props;
        this.setState({ familyList: corporateData || [] })
    }
    onPressSelectBtnToGoNextProcess = (selectedMemObj) => {
        if (this.navigationPage === 'ClaimIntimationSubmission') {
            this.props.navigation.navigate(this.navigationPage, { memberInfo: selectedMemObj })
        }
        else if (this.navigationPage === 'PREAUTH') {
            this.props.navigation.navigate(this.navigationPage, { memberInfo: selectedMemObj })
        }
    }

    render() {
        const { familyList } = this.state;
        return (
            <Container>
                        {familyList && familyList.length ?
                         <Content style={{ padding: 10 }}>
                            <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 18, fontFamily: 'OpenSans', marginTop: 10,fontWeight:'bold' }}> {familyList && familyList.length ?'Family Information':null}</Text>
                                {familyList.map((item, index) =>
                                 <RenderFamilyList
                                    item={item}
                                    index={index}
                                    isShowBeneficiaryInfoCard={this.state.isShowBeneficiaryInfoCard}
                                    navigation={this.props.navigation}
                                    onPressIsShowBeneficiaryInfo={(isShowBeneficiaryInfoCard, typeOfArrowIcon) => this.setState({ isShowBeneficiaryInfoCard: typeOfArrowIcon === 'DOWN' ? isShowBeneficiaryInfoCard : -1 })
                                    }
                                    onPressSelectBtnToGoNextProcess={(selectedMemObj) => this.onPressSelectBtnToGoNextProcess(selectedMemObj)}
                                // shouldUpdate={``}
                                >
                                </RenderFamilyList>)
                                }
                            </View>
                             </Content>
                            :
                            <Content contentContainerStyle={{ justifyContent: 'center', alignItems: 'center',flex:1 }}>
                            <View style={{ borderBottomWidth: 0,  justifyContent: 'center', alignItems: 'center',flex:1 }}>
                                <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }} > Family List Not Found!</Text>
                            </View>
                            </Content>
                        }
            </Container>
        )
    }
}

const familyInfoListState = ({ profile } = state) => ({ profile })
export default connect(familyInfoListState)(FamilyInfoList)

