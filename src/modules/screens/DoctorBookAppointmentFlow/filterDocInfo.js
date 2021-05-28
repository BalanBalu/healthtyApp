import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Body, Picker, Button, Card, Text, Item, Row, View, Col,Icon, Content, Header, Left, Radio, Title, ListItem } from 'native-base';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { SET_PREVIOUS_DOC_LIST_WHEN_CLEAR_FILTER } from '../../providers/BookAppointmentFlow/action';
import { connect } from 'react-redux';
import { store } from '../../../setup/store';
import {primaryColor} from '../../../setup/config';
import IconName from 'react-native-vector-icons/MaterialIcons';
import { translate} from '../../../setup/translator.helper'

let filterDataObject = {};  //for send only selected Filtered Values and Store the Previous selected filter values 
let selectedCount = 0
class FilterDocInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            languageList: [],
            genderSelected: '',
            specialistInfoList: [],
            hospitalInfoList: [],
            selectedSpecialist: [],
            languages: [],
            genderIndex: 0,
            selectAvailabilityIndex: 0,
            selectExperinceIndex: 0,
            selectedHospitalNames: [],
        }
    }

    async componentDidMount() {
        const { bookAppointmentData: { baCupOfDoctorInfoListAndSlotsData4Filter }, navigation } = this.props;

        const filterData = navigation.getParam('filterData');
        if (Object.keys(filterDataObject).length) { // condition for when click the Clear button and then press the back button and come back again Filter page (The previous selected filtered values from Doctor Search list page are Showing again)
            if (filterData) {
                if (filterData.gender) {
                    if (filterData.gender === 'M') {
                        this.clickGenderInButton(1, 'M', false, true)
                    } else if (filterData.gender === 'F') {
                        this.clickGenderInButton(2, 'F', false, true)
                    } else if (filterData.gender === 'O') {
                        this.clickGenderInButton(3, 'O', false, true)
                    }
                }
                if (filterData.experience) {
                    this.clickFilterByExperince(filterData.experience, false, true);
                }
                if (filterData.languages) {
                    this.onSelectedLanguagesChange(filterData.languages, true);
                }
                if (filterData.specialist) {
                    this.onSelectedSpecialistChange([filterData.specialist], true);
                }
                if (filterData.hospitalName) {
                    this.onSelectedHospitalChange([filterData.hospitalName], true)
                }
                if (filterData.availabilityDatesCount) {
                    this.clickFilterByAvailabilityDates(filterData.availabilityDatesCount, false, true);

                }
            }
            else {
                this.clearSelectedData()
            }
        }
        const languageListFromData = [];
        const removeDupCategoriesFromList = [];
        const specialistInfoList = [];
        const hospitalInfoList = [];
        const removeDupHospitalsFromList = [];
        baCupOfDoctorInfoListAndSlotsData4Filter.map(doctorItem => {
            if (doctorItem.language && doctorItem.language.length) {
                Array.prototype.push.apply(languageListFromData, doctorItem.language)  // Push multiple language array's
            }
            if (doctorItem.specialist && doctorItem.specialist.length) {
                doctorItem.specialist.map(specialistItem => {
                    if (!removeDupCategoriesFromList.includes(specialistItem.category_id)) {
                        removeDupCategoriesFromList.push(specialistItem.category_id);
                        const specialistObj = { id: specialistItem._id, value: specialistItem.category };
                        specialistInfoList.push(specialistObj);  // Store Unique Specialists
                    }
                })
            }
            if (doctorItem.hospitalInfo && doctorItem.hospitalInfo.hospital) {
                if (!removeDupHospitalsFromList.includes(doctorItem.hospitalInfo.hospital.name)) {
                    removeDupHospitalsFromList.push(doctorItem.hospitalInfo.hospital.name);
                    const hospitalObj = {
                        value: doctorItem.hospitalInfo.hospital.name,
                        profile_image: doctorItem.hospitalInfo.profile_image,
                    }
                    hospitalInfoList.push(hospitalObj)   // Store Unique hospitals
                }
            }
        })
        const removeDupValuesInArray = [];
        const languageList = [];
        languageListFromData.map(language => {
            if (!removeDupValuesInArray.includes(language.toLowerCase())) {
                removeDupValuesInArray.push(language.toLowerCase());
                languageList.push({ value: language })
            }
        })
        this.setState({ languageList, specialistInfoList, hospitalInfoList });
    }



    /* Send multiple Selected Filtered values  */
    sendFilteredData = async () => {
        await store.dispatch(
            {
                type: SET_PREVIOUS_DOC_LIST_WHEN_CLEAR_FILTER,
                data: false
            },
        );
      
        this.props.navigation.navigate('Doctor Search List', {
            filterData: filterDataObject,
            conditionFromFilterPage: true
        })
    }
    /*  Select GenderPreference */
    clickGenderInButton = async (genderIndex, genderSelected, bySelect, isFilteredData) => {
        if (genderIndex === this.state.genderIndex && bySelect) {
            genderIndex = 0,
                genderSelected = '',
                selectedCount--
        }
        else {
            if (!this.state.genderSelected) {
                if (!isFilteredData) {
                    selectedCount++
                }
            }
        }
        this.setState({ genderIndex, genderSelected });
        filterDataObject.gender = genderSelected;
    }
    /* Get the selected Availability Date  */
    clickFilterByAvailabilityDates = (index, bySelect, isFilteredData) => {
        if (index === this.state.selectAvailabilityIndex && bySelect) {
            index = 0,
                selectedCount--
        }
        else {
            if (this.state.selectAvailabilityIndex === 0) {
                if (!isFilteredData) {
                    selectedCount++
                }
            }
        }
        this.setState({ selectAvailabilityIndex: index });
        filterDataObject.availabilityDatesCount = index;
    }

    clickFilterByExperince = async (index, bySelect, isFilteredData) => {
        if (index === this.state.selectExperinceIndex && bySelect) {
            index = 0,
                selectedCount--
        }
        else {
            if (this.state.selectExperinceIndex === 0) {
                if (!isFilteredData) {
                    selectedCount++
                }
            }
        }
        this.setState({ selectExperinceIndex: index })
        filterDataObject.experience = index;
    }

    onSelectedLanguagesChange = async (languages, isFilteredData) => {
        if (this.state.languages.length < languages.length) {
            if (!isFilteredData) {
                selectedCount++;
            }
        }
        else {
            selectedCount--;
        }
        this.setState({ languages });
        filterDataObject.languages = languages;
    };
    onSelectedHospitalChange = async (selectedHospitalNames, isFilteredData) => {
        const checkHospitalName = String(selectedHospitalNames);
        if (this.state.selectedHospitalNames.includes(checkHospitalName)) {
            selectedHospitalNames = [];
            selectedCount--
        }
        else {
            if (!isFilteredData) {
                if (this.state.selectedHospitalNames.length === 0) {
                    selectedCount++
                }
            }
        }
        let hospitalItem = String(selectedHospitalNames);
        this.setState({ selectedHospitalNames });
        if (hospitalItem) filterDataObject.hospitalName = hospitalItem;
        else delete filterDataObject.hospitalName
    }
    onSelectedSpecialistChange = async (selectedSpecialist, isFilteredData) => {
        const checkSpecialist = String(selectedSpecialist);
        if (this.state.selectedSpecialist.includes(checkSpecialist)) {
            selectedSpecialist = [];
            selectedCount--
        }
        else {
            if (!isFilteredData) {
                if (this.state.selectedSpecialist.length === 0) {
                    selectedCount++
                }
            }
        }
        const selectedSpecialistItem = String(selectedSpecialist);
        await this.setState({ selectedSpecialist });
        if (selectedSpecialistItem) filterDataObject.specialist = selectedSpecialistItem;
        else delete filterDataObject.specialist;
    }

    clearSelectedData = async () => {  // Clear All selected Data when clicked the Clear filter option
        this.setState({
            genderSelected: '',
            selectedSpecialist: [],
            languages: [],
            genderIndex: 0,
            selectAvailabilityIndex: 0,
            selectExperinceIndex: 0,
            selectedHospitalNames: [],
        });
        selectedCount = 0;
        filterDataObject = {};
        await store.dispatch(
            {
                type: SET_PREVIOUS_DOC_LIST_WHEN_CLEAR_FILTER,
                data: true
            },
        );
    }

    render() {
        const { genderIndex, selectAvailabilityIndex, languages, genderSelected, selectedSpecialist,
            selectedHospitalNames, selectExperinceIndex, languageList, specialistInfoList, hospitalInfoList } = this.state;
        return (
            <Container style={styles.container}>
                <Content>
                    <View style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.5, paddingBottom: 10, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                        <Text style={styles.headingLabelStyle}>{translate("Gender")} </Text>
                        <Row style={{ marginTop: 10, borderBottomWidth: 0, }}>

                            <Col size={3.33} >
                                <TouchableOpacity
                                    onPress={() => this.clickGenderInButton(1, "M", true)}
                                    style={styles.genderTouchableStyles}>
                                    <Radio
                                      color={primaryColor}
                                        standardStyle={true}
                                        selected={genderIndex === 1 ? true : false}
                                        onPress={() => this.clickGenderInButton(1, "M", true)} />

                                    <Icon name="ios-man" style={{ fontSize: 20, marginLeft: 10, }} />
                                    <Text style={styles.genderTextStyles}>{translate("Male")}</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={3.33} >
                                <TouchableOpacity
                                    onPress={() => this.clickGenderInButton(2, "F", true)}
                                    style={styles.genderTouchableStyles}>
                                    <Radio
                                      color={primaryColor}
                                        standardStyle={true}
                                        selected={genderIndex === 2 ? true : false}
                                        onPress={() => this.clickGenderInButton(2, "F", true)} />
                                    <Icon name="ios-woman" style={{ fontSize: 20, marginLeft: 10, }} />
                                    <Text style={styles.genderTextStyles}>{translate("Female")}</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={3.33} >
                                <TouchableOpacity
                                    onPress={() => this.clickGenderInButton(3, "O", true)}
                                    style={styles.genderTouchableStyles}>
                                    <Radio
                                      color={primaryColor}
                                        standardStyle={true}
                                        selected={genderIndex === 3 ? true : false}
                                        onPress={() => this.clickGenderInButton(3, "O", true)} />
                                    <Text style={styles.genderTextStyles}>{translate("Others")}</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </View>

                    <View style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.5, paddingBottom: 20, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                        <Text style={styles.headingLabelStyle}>{translate("Availability Date & Time")} </Text>
                        <Row style={{ marginTop: 10, borderBottomWidth: 0 }}>
                            <Col size={3}>
                                <TouchableOpacity
                                    onPress={() => this.clickFilterByAvailabilityDates(1, true)}
                                    style={selectAvailabilityIndex === 1 ? styles.selectedDaysColor : styles.defaultDaysColor}
                                >
                                    <Text style={selectAvailabilityIndex === 1 ? styles.selectedDaysTextColor : styles.defaultDaysTextColor}
                                    >Today</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={3} style={{ marginLeft: 10 }}>
                                <TouchableOpacity
                                    onPress={() => this.clickFilterByAvailabilityDates(3, true)}
                                    style={selectAvailabilityIndex === 3 ? styles.selectedDaysColor : styles.defaultDaysColor}
                                >
                                    <Text style={selectAvailabilityIndex === 3 ? styles.selectedDaysTextColor : styles.defaultDaysTextColor}>Next 3 days</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={3} style={{ marginLeft: 10 }}>
                                <TouchableOpacity
                                    style={selectAvailabilityIndex === 7 ? styles.selectedDaysColor : styles.defaultDaysColor}
                                    onPress={() => this.clickFilterByAvailabilityDates(7, true)}
                                >
                                    <Text style={selectAvailabilityIndex === 7 ? styles.selectedDaysTextColor : styles.defaultDaysTextColor}>Next 7 days</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </View>

                    <View style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.5, paddingBottom: 20, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                        <Text style={styles.headingLabelStyle}>{translate("Work Experience")}</Text>
                        <Row style={{ marginTop: 10, borderBottomWidth: 0 }}>
                            <Col size={2.5}>
                                <TouchableOpacity
                                    style={selectExperinceIndex === 10 ? styles.selectedExpColor : styles.defaultExpColor}
                                    onPress={() => this.clickFilterByExperince(10, true)}
                                >
                                    <Text style={selectExperinceIndex === 10 ? styles.selectedExpTextColor : styles.defaultExpTextColor}>0-10 yrs</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={2.5} style={{ marginLeft: 10 }}>
                                <TouchableOpacity
                                    style={selectExperinceIndex === 20 ? styles.selectedExpColor : styles.defaultExpColor}
                                    onPress={() => this.clickFilterByExperince(20, true)}
                                >
                                    <Text style={selectExperinceIndex === 20 ? styles.selectedExpTextColor : styles.defaultExpTextColor}>10-20 yrs</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={2.5} style={{ marginLeft: 10 }}>
                                <TouchableOpacity
                                    style={selectExperinceIndex === 30 ? styles.selectedExpColor : styles.defaultExpColor}
                                    onPress={() => this.clickFilterByExperince(30, true)}
                                >
                                    <Text style={selectExperinceIndex === 30 ? styles.selectedExpTextColor : styles.defaultExpTextColor}>20-30 yrs</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={2.5} style={{ marginLeft: 10 }}>
                                <TouchableOpacity
                                    style={selectExperinceIndex === 40 ? styles.selectedExpColor : styles.defaultExpColor}
                                    onPress={() => this.clickFilterByExperince(40, true)}
                                >
                                    <Text style={selectExperinceIndex === 40 ? styles.selectedExpTextColor : styles.defaultExpTextColor}>Above 30</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </View>

                    <View style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.5, paddingBottom: 10, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                        <Text style={styles.headingLabelStyle}>{translate("Choose languages you know")}</Text>
                        <TouchableOpacity style={{ height: 60, marginTop: -15, marginLeft: -9.5 }}>
                            <SectionedMultiSelect
                                styles={{
                                    selectToggleText: {
                                        color: '#333333',
                                        fontSize: 13
                                    },

                                }}
                                IconRenderer={IconName}
                                items={languageList}
                                uniqueKey='value'
                                displayKey='value'
                                selectText={translate("Choose languages you know")}
                                searchPlaceholderText={translate('Search Your Languages')}
                                modalWithTouchable={true}
                                showDropDowns={true}
                                hideSearch={false}
                                showRemoveAll={true}
                                showChips={false}
                                readOnlyHeadings={false}
                                onSelectedItemsChange={this.onSelectedLanguagesChange}
                                selectedItems={languages}
                                colors={{ primary: '#18c971' }}
                                confirmText={translate("Confirm")}
                                showCancelButton={true}
                                animateDropDowns={true}
                                testID='languageSelected'
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.5, paddingBottom: 10, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                        <Text style={styles.headingLabelStyle}>{translate("Select your specialist")}</Text>
                        <TouchableOpacity style={{ height: 60, marginTop: -15, marginLeft: -9.5 }}>
                            <SectionedMultiSelect
                                styles={{
                                    selectToggleText: {
                                        color: '#333333',
                                        fontSize: 13
                                    },

                                }}
                                IconRenderer={IconName}
                                items={specialistInfoList}
                                uniqueKey='value'
                                displayKey='value'
                                selectText={translate("Choose your specialist")}
                                searchPlaceholderText={translate("Search your specialist")}
                                modalWithTouchable={true}
                                showDropDowns={true}
                                hideSearch={false}
                                showRemoveAll={true}
                                showChips={false}
                                single={true}
                                readOnlyHeadings={false}
                                onSelectedItemsChange={this.onSelectedSpecialistChange}
                                selectedItems={selectedSpecialist}
                                colors={{ primary: '#18c971' }}
                                confirmText={translate("Confirm")}
                                showCancelButton={true}
                                animateDropDowns={true}
                                testID='languagesSelected'
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.5, paddingBottom: 10, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                        <Text style={styles.headingLabelStyle}>{translate("Select Hospital name")}</Text>
                        <TouchableOpacity style={{ height: 60, marginTop: -15, marginLeft: -9.5 }}>
                            <SectionedMultiSelect
                                styles={{
                                    selectToggleText: {
                                        color: '#333333',
                                        fontSize: 13
                                    },

                                }}
                                IconRenderer={IconName}
                                items={hospitalInfoList}
                                uniqueKey='value'
                                displayKey='value'
                                selectText={translate('Choose your hospitals')}
                                selectToggleText={{ fontSize: 13 }}
                                searchPlaceholderText={translate('Search Your hospitals')}
                                modalWithTouchable={true}
                                single={true}
                                showDropDowns={true}
                                hideSearch={false}
                                showRemoveAll={true}
                                showChips={false}
                                readOnlyHeadings={false}
                                onSelectedItemsChange={this.onSelectedHospitalChange}
                                selectedItems={selectedHospitalNames}
                                colors={{ primary: '#18c971' }}
                                confirmText={translate("Confirm")}
                                showCancelButton={true}
                                bu
                                animateDropDowns={true}
                                testID='languageSelected'
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Row style={{ marginTop: 30, borderBottomWidth: 0, marginLeft: 10, marginRight: 10 }}>
                            <Col size={5} >
                                <TouchableOpacity
                                    onPress={this.clearSelectedData}
                                    style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15, borderRadius: 30, borderColor: primaryColor, borderWidth: 0.5 }}>

                                    <Text style={{ color: primaryColor, fontFamily: 'opensans-bold', fontSize: 13, textAlign: 'center',  }}>{translate("Clear Filters")}</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={5} style={{ marginLeft: 20 }}>
                                <TouchableOpacity
                                    block success
                                    disabled={languages.length != 0 || genderSelected || selectedSpecialist.length != 0 || selectedHospitalNames.length != 0 || selectAvailabilityIndex != 0 || selectExperinceIndex != 0 ? false : true}
                                    style={languages.length != 0 || genderSelected || selectedSpecialist.length != 0 || selectedHospitalNames.length != 0 || selectAvailabilityIndex != 0 || selectExperinceIndex != 0 ? styles.viewDocButtonBgGreeen : styles.viewDocButtonBgGray}
                                    onPress={this.sendFilteredData}
                                >
                                    <Text style={languages.length != 0 || genderSelected || selectedSpecialist.length != 0 || selectedHospitalNames.length != 0 || selectAvailabilityIndex != 0 || selectExperinceIndex != 0 ? styles.enabledApplyTextColor : styles.defaultApplyTextColor}>{translate("Apply")}</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                        {languages.length != 0 || genderSelected || selectedSpecialist.length != 0 || selectedHospitalNames.length != 0 || selectAvailabilityIndex != 0 || selectExperinceIndex != 0 ? <Text style={{ color: '#ffffff', fontFamily: 'opensans-bold', fontSize: 12,  position: "absolute", backgroundColor: primaryColor, height: 25, width: 25, borderRadius: 25 / 2, textAlign: 'center', marginLeft: 25, marginTop: 35, paddingTop: 2 }}>{selectedCount}</Text> : null}
                    </View>
                </Content>
            </Container >
        );
    }
}

const bookAppointmentDataState = ({ bookAppointmentData } = state) => ({ bookAppointmentData })
export default connect(bookAppointmentDataState)(FilterDocInfo)
const styles = StyleSheet.create({
    defaultDaysColor:
    {
        paddingTop: 5, paddingBottom: 5, paddingLeft: 15, paddingRight: 15, borderWidth: 0.1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 1, borderRadius: 5

    },
    selectedDaysColor: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: primaryColor,
        borderRadius: 5
    },

    defaultExpColor:
    {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        borderWidth: 0.1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 1
    },

    selectedExpColor: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderColor: 'gray',
        backgroundColor: primaryColor,
        borderRadius: 5
    },
    defaultGenderColor: {
        borderRadius: 10,
        width: '90%',
        marginLeft: 10,
        borderWidth: 50,

    },
    viewDocButtonBgGreeen: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 30,
        backgroundColor: primaryColor
    },
    viewDocButtonBgGray: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 30,
        borderColor: primaryColor,
        borderWidth: 0.5
    },
    defaultDaysTextColor: {
        color: '#333333',
        fontFamily: 'Roboto',
        fontSize: 13,
        textAlign: 'center'
    },
    selectedDaysTextColor: {
        color: '#FFFFFF',
        fontFamily: 'Roboto',
        fontSize: 13,
        textAlign: 'center'

    },
    defaultExpTextColor: {
        color: '#333333',
        fontFamily: 'Roboto',
        fontSize: 10,
        textAlign: 'center'
    },
    selectedExpTextColor: {
        color: '#FFFFFF',
        fontFamily: 'Roboto',
        fontSize: 10,
        textAlign: 'center'
    },
    defaultApplyTextColor: {
        color: primaryColor,
        fontFamily: 'opensans-bold',
        fontSize: 13,
        textAlign: 'center',
    },
    enabledApplyTextColor: {
        color: '#FFFFFF',
        fontFamily: 'opensans-bold',
        fontSize: 13,
        textAlign: 'center',
    },
    headingLabelStyle: {
        fontFamily: 'opensans-bold',
        fontSize: 13,
    },
    genderTextStyles: {
        fontFamily: 'Roboto',
        fontSize: 13,
        marginLeft: 15,
        color: '#333333'
    },
    genderTouchableStyles: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
})