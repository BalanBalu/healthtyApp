import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Body, Picker, Button, Card, Text, Item, Row, View, Col, Content, Icon, Header, Left, Radio, Title, ListItem } from 'native-base';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { connect } from 'react-redux'
import { translate } from "../../../setup/translator.helper"
let filterDataObject = {};  //for send only selected Filtered Values and Store the Previous selected filter values 
let globalOffilterBySelectedAvailabilityDateCount = 0;
let selectedCount = 0
class Filters extends Component {

    constructor(props) {
        super(props)
        this.state = {
            doctorData: [],
            languageData: [],
            genderSelected: '',
            categoryList: [],
            sampleServiceArray: [],
            serviceList: [],
            selectedCategory: [],
            language: [],
            genderIndex: 0,
            selectAvailabilityIndex: 0,
            selectExperinceIndex: 0,
            selectedServices: [],
        }
    }

    async componentDidMount() {
        const { bookappointment: { doctorData }, navigation } = this.props;
        const filterData = navigation.getParam('filterData');
        const filterBySelectedAvailabilityDateCount = navigation.getParam('filterBySelectedAvailabilityDateCount');
        console.log('Filter Data from Search List: ' + JSON.stringify(filterData));
        console.log(' filterBySelectedAvailabilityDateCount' + filterBySelectedAvailabilityDateCount);
        if (globalOffilterBySelectedAvailabilityDateCount != 0) {
            if (filterBySelectedAvailabilityDateCount !== 0 && filterBySelectedAvailabilityDateCount !== undefined) {
                this.clickFilterByAvailabilityDates(filterBySelectedAvailabilityDateCount, false, true);
            }
        }
        if (Object.keys(filterDataObject).length != 0) { // condition for when click the Clear button and then press the back button and come back again Filter page (The previous selected filtered values from Doctor Search list page are Showing again)
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
                if (filterData.language) {
                    this.onSelectedLanguagesChange(filterData.language, true);
                }
                if (filterData.category) {
                    this.onSelectedCategoryChange([filterData.category], true);
                }
                if (filterData.service) {
                    this.onSelectedServiceChange(filterData.service, true)
                }
            }
        }

        await this.setState({ doctorData: doctorData });
        // console.log('doctorData' + JSON.stringify(this.state.doctorData));
        let sampleLangArray = [];
        let sampleCategoryArray = [];
        let sampleServiceArray = [];
        let conditionCategoryArry = [];
        let conditionServiceArry = [];
        let multipleLanguages = [];

        for (var data in this.state.doctorData) {
            if (this.state.doctorData[data].language) {
                Array.prototype.push.apply(sampleLangArray, this.state.doctorData[data].language)
            }
            if (this.state.doctorData[data].specialist) {
                this.state.doctorData[data].specialist.forEach(element => {
                    if (!conditionCategoryArry.includes(element.category_id) && !conditionServiceArry.includes(element.service_id)) {
                        conditionCategoryArry.push(element.category_id);
                        conditionServiceArry.push(element.service_id);
                        let sampleCategoryObject = { id: element.category_id, value: element.category };
                        let sampleServiceObject = { id: element.service_id, value: element.service };
                        sampleCategoryArray.push(sampleCategoryObject);
                        sampleServiceArray.push(sampleServiceObject);
                    }
                })
            }
        }
        let setUniqueLanguages = new Set(sampleLangArray)
        setUniqueLanguages.forEach(element => {
            let sample = { value: element };
            multipleLanguages.push(sample);
        })
        await this.setState({ languageData: multipleLanguages, categoryList: sampleCategoryArray, serviceList: sampleServiceArray });
    }

    /* Send multiple Selected Filtered values  */
    sendFilteredData = async () => {
        console.log('filterDataObject::', filterDataObject)
        console.log('this.state.selectAvailabilityIndex::', this.state.selectAvailabilityIndex)
        this.props.navigation.navigate('Doctor List', {
            filterData: filterDataObject,
            filterBySelectedAvailabilityDateCount: this.state.selectAvailabilityIndex, ConditionFromFilter: true
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
        globalOffilterBySelectedAvailabilityDateCount = index;
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

    onSelectedLanguagesChange = async (language, isFilteredData) => {
        if (this.state.language.length < language.length) {
            if (!isFilteredData) {
                selectedCount++;
            }
        }
        else {
            selectedCount--;
        }
        this.setState({ language });
        filterDataObject.language = language;
    };
    onSelectedServiceChange = async (selectedServices, isFilteredData) => {
        if (this.state.selectedServices.length < selectedServices.length) {
            if (!isFilteredData) {
                selectedCount++;
            }
        }
        else {
            selectedCount--;
        }
        await this.setState({ selectedServices })
        filterDataObject.service = selectedServices;
    }
    onSelectedCategoryChange = async (selectedCategory, isFilteredData) => {
        const checkCategory = String(selectedCategory);
        if (this.state.selectedCategory.includes(checkCategory)) {
            selectedCategory = [];
            selectedCount--
        }
        else {
            if (!isFilteredData) {
                if (this.state.selectedCategory.length ===0) {
                selectedCount++
                }
            }
        }
        let categoryItem = String(selectedCategory);
        this.setState({ selectedCategory });
        filterDataObject.category = categoryItem;
    }
    clearSelectedData = () => {  // Clear All selected Data when clicked the Clear filter option
        this.setState({
            genderSelected: '',
            selectedCategory: [],
            language: [],
            genderIndex: 0,
            selectAvailabilityIndex: 0,
            selectExperinceIndex: 0,
            selectedServices: [],
        });
        selectedCount = 0;
        globalOffilterBySelectedAvailabilityDateCount = 0;
        filterDataObject = {};
    }
    render() {
        const { genderIndex, selectAvailabilityIndex, language, genderSelected, selectedCategory,
            selectedServices, selectExperinceIndex, languageData, categoryList, serviceList } = this.state;
        return (
            <Container style={styles.container}>
                <Content>
                    <View style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.5, paddingBottom: 10, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                        <Text style={styles.headingLabelStyle}>{translate("Gender")}</Text>
                        <Row style={{ marginTop: 10, borderBottomWidth: 0, }}>

                            <Col size={3.33} >
                                <TouchableOpacity
                                    onPress={() => this.clickGenderInButton(1, "M", true)}
                                    style={styles.genderTouchableStyles}>
                                    <Radio 
                                     standardStyle={true}
                                    selected={genderIndex === 1 ? true : false} 
                                   onPress={()=>  this.clickGenderInButton(1, "M", true)}  />
                                  
                                    <Icon name="ios-man" style={{ fontSize: 20, marginLeft: 10, }} />
                                    <Text style={styles.genderTextStyles}>{translate("Male")} </Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={3.33} >
                                <TouchableOpacity
                                    onPress={() => this.clickGenderInButton(2, "F", true)}
                                    style={styles.genderTouchableStyles}>
                                    <Radio 
                                    standardStyle={true}
                                    selected={genderIndex === 2 ? true : false} 
                                    onPress={()=>  this.clickGenderInButton(2, "F", true)}  />
                                    <Icon name="ios-woman" style={{ fontSize: 20, marginLeft: 10, }} />
                                    <Text style={styles.genderTextStyles}>{translate("Female")}</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={3.33} >
                                <TouchableOpacity
                                    onPress={() => this.clickGenderInButton(3, "O", true)}
                                    style={styles.genderTouchableStyles}>
                                    <Radio 
                                    standardStyle={true}
                                    selected={genderIndex === 3 ? true : false} 
                              onPress={()=>  this.clickGenderInButton(3, "O", true)}  />                                  
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
                                    >{translate("Today")}</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={3} style={{ marginLeft: 10 }}>
                                <TouchableOpacity
                                    onPress={() => this.clickFilterByAvailabilityDates(3, true)}
                                    style={selectAvailabilityIndex === 3 ? styles.selectedDaysColor : styles.defaultDaysColor}
                                >
                                    <Text style={selectAvailabilityIndex === 3 ? styles.selectedDaysTextColor : styles.defaultDaysTextColor}>{translate("Next 3 days")}</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={3} style={{ marginLeft: 10 }}>
                                <TouchableOpacity
                                    style={selectAvailabilityIndex === 7 ? styles.selectedDaysColor : styles.defaultDaysColor}
                                    onPress={() => this.clickFilterByAvailabilityDates(7, true)}
                                >
                                    <Text style={selectAvailabilityIndex === 7 ? styles.selectedDaysTextColor : styles.defaultDaysTextColor}>{translate("Next 7 days")}</Text>
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
                        <Text style={styles.headingLabelStyle}>{translate("Choose Spoken Languages")}</Text>
                        <TouchableOpacity style={{ height: 60, marginTop: -15, marginLeft: -9.5 }}>
                            <SectionedMultiSelect
                                styles={{
                                    selectToggleText: {
                                        color: '#333333',
                                        fontSize: 13
                                    },

                                }}
                                items={languageData}
                                uniqueKey='value'
                                displayKey='value'
                                selectText='Choose Languages you know'
                                searchPlaceholderText='Search Your Languages'
                                modalWithTouchable={true}
                                showDropDowns={true}
                                hideSearch={false}
                                showRemoveAll={true}
                                showChips={false}
                                readOnlyHeadings={false}
                                onSelectedItemsChange={this.onSelectedLanguagesChange}
                                selectedItems={language}
                                colors={{ primary: '#18c971' }}
                                showCancelButton={true}
                                animateDropDowns={true}
                                testID='languageSelected'
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.5, paddingBottom: 10, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                        <Text style={styles.headingLabelStyle}>{translate("Select your category")}</Text>
                        <TouchableOpacity style={{ height: 60, marginTop: -15, marginLeft: -9.5 }}>
                            <SectionedMultiSelect
                                styles={{
                                    selectToggleText: {
                                        color: '#333333',
                                        fontSize: 13
                                    },

                                }}
                                items={categoryList}
                                uniqueKey='value'
                                displayKey='value'
                                selectText='Choose your Category  '
                                searchPlaceholderText='Search Your Languages'
                                modalWithTouchable={true}
                                showDropDowns={true}
                                hideSearch={false}
                                showRemoveAll={true}
                                showChips={false}
                                single={true}
                                readOnlyHeadings={false}
                                onSelectedItemsChange={this.onSelectedCategoryChange}
                                selectedItems={selectedCategory}
                                colors={{ primary: '#18c971' }}
                                showCancelButton={true}
                                animateDropDowns={true}
                                testID='languageSelected'
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.5, paddingBottom: 10, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                        <Text style={styles.headingLabelStyle}>{translate("Select service")}</Text>
                        <TouchableOpacity style={{ height: 60, marginTop: -15, marginLeft: -9.5 }}>
                            <SectionedMultiSelect
                                styles={{
                                    selectToggleText: {
                                        color: '#333333',
                                        fontSize: 13
                                    },

                                }}
                                items={serviceList}
                                uniqueKey='value'
                                displayKey='value'
                                selectText='Choose your Services  '
                                selectToggleText={{ fontSize: 13 }}
                                searchPlaceholderText='Search Your Services'
                                modalWithTouchable={true}
                                showDropDowns={true}
                                hideSearch={false}
                                showRemoveAll={true}
                                showChips={false}
                                readOnlyHeadings={false}
                                onSelectedItemsChange={this.onSelectedServiceChange}
                                selectedItems={selectedServices}
                                colors={{ primary: '#18c971' }}
                                showCancelButton={true}
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
                                    style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15, borderRadius: 30, borderColor: '#775DA3', borderWidth: 0.5 }}>

                                    <Text style={{ color: '#775DA3', fontFamily: 'OpenSans', fontSize: 13, textAlign: 'center', fontWeight: '500' }}>{translate("Clear Filters")}</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={5} style={{ marginLeft: 20 }}>
                                <TouchableOpacity
                                    block success
                                    disabled={language.length != 0 || genderSelected || selectedCategory.length != 0 || selectedServices.length != 0 || selectAvailabilityIndex != 0 || selectExperinceIndex != 0 ? false : true}
                                    style={language.length != 0 || genderSelected || selectedCategory.length != 0 || selectedServices.length != 0 || selectAvailabilityIndex != 0 || selectExperinceIndex != 0 ? styles.viewDocButtonBgGreeen : styles.viewDocButtonBgGray}
                                    onPress={this.sendFilteredData}
                                >
                                    <Text style={language.length != 0 || genderSelected || selectedCategory.length != 0 || selectedServices.length != 0 || selectAvailabilityIndex != 0 || selectExperinceIndex != 0 ? styles.enabledApplyTextColor : styles.defaultApplyTextColor}>{translate("Apply")}</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                        {language.length != 0 || genderSelected || selectedCategory.length != 0 || selectedServices.length != 0 || selectAvailabilityIndex != 0 || selectExperinceIndex != 0 ? <Text style={{ color: '#ffffff', fontFamily: 'OpenSans', fontSize: 12, fontWeight: '600', position: "absolute", backgroundColor: '#775DA3', height: 25, width: 25, borderRadius: 25/2, textAlign: 'center', marginLeft: 25, marginTop: 35, paddingTop:2 }}>{selectedCount}</Text> : null}
                    </View>
                </Content>
            </Container >
        );
    }
}
function bookApppointmentState(state) {
    return {
        bookappointment: state.bookappointment
    }
}
export default connect(bookApppointmentState)(Filters)

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
        backgroundColor: '#775DA3',
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
        backgroundColor: '#775DA3',
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
        backgroundColor: '#775DA3'
    },
    viewDocButtonBgGray: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 30,
        borderColor: '#775DA3',
        borderWidth: 0.5
    },
    defaultDaysTextColor: {
        color: '#333333', 
        fontFamily: 'OpenSans', 
        fontSize: 13, 
        textAlign: 'center'
    },
    selectedDaysTextColor: {
        color: '#FFFFFF', 
        fontFamily: 'OpenSans', 
        fontSize: 13, 
        textAlign: 'center'

    },
    defaultExpTextColor: {
        color: '#333333', 
        fontFamily: 'OpenSans', 
        fontSize: 10, 
        textAlign: 'center'
    },
    selectedExpTextColor: {
        color: '#FFFFFF', 
        fontFamily: 'OpenSans', 
        fontSize: 10, 
        textAlign: 'center'
    },
    defaultApplyTextColor: {
        color: '#775DA3', 
        fontFamily: 'OpenSans', 
        fontSize: 13, 
        textAlign: 'center', 
        fontWeight: '500'
    },
    enabledApplyTextColor: {
        color: '#FFFFFF', 
        fontFamily: 'OpenSans', 
        fontSize: 13, 
        textAlign: 'center', 
        fontWeight: '500'
    },
    headingLabelStyle: {
        fontFamily: 'OpenSans',  
        fontSize: 13,
        fontWeight:'bold'
    },
    genderTextStyles: {
        fontFamily: 'OpenSans', 
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