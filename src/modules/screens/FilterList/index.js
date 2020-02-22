import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Body, Picker, Button, Card, Text, Item, Row, View, Col, Content, Icon, Header, Left, Radio, Title, ListItem } from 'native-base';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { NavigationEvents } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { RadioButton } from 'react-native-paper';

import { connect } from 'react-redux'
let filterData = {};  //for send only selected Filtered Values and Store the Previous selected filter values 
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
            selectedCategory: '',
            language: [],
            genderIndex: 0,
            selectAvailabilityIndex: 0,
            selectExperinceIndex: {},
            selectedServices: [],
            viewDoctors_button: true
        }
    }

    async componentDidMount() {
        debugger
        const { bookappointment: { doctorData }, navigation } = this.props;
        const filterData = navigation.getParam('filterData');
        const filterBySelectedAvailabilityDateCount = navigation.getParam('filterBySelectedAvailabilityDateCount')
        // console.log( 'Filter Data from Search List: ' + JSON.stringify(filterData));
        //console.log(' filterBySelectedAvailabilityDateCount' + filterBySelectedAvailabilityDateCount);
        if (filterBySelectedAvailabilityDateCount !== 0 && filterBySelectedAvailabilityDateCount !== undefined) {
            this.clickFilterByAvailabilityDates(filterBySelectedAvailabilityDateCount, false);
        }
        if (filterData) {
            if (filterData.gender) {
                if (filterData.gender === 'M') {
                    this.clickGenderInButton(1, 'M', false)
                } else if (filterData.gender === 'F') {
                    this.clickGenderInButton(2, 'F', false)
                } else if (filterData.gender === 'O') {
                    this.clickGenderInButton(3, 'O', false)
                }
            }
            if (filterData.experience) {
                this.clickFilterByExperince(filterData.experience, false);
            }
            if (filterData.language) {
                this.onSelectedLanguagesChange(filterData.language);
            }
            if (filterData.category) {
                this.onSelectedCategoryChange(filterData.category);
            }
            if (filterData.service) {
                this.onSelectedServiceChange(filterData.service)
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
        // let defaultPlaceHolderValue = { id: '0101', value: "Select Your Category" }
        // sampleCategoryArray.unshift(defaultPlaceHolderValue)
        let setUniqueLanguages = new Set(sampleLangArray)
        setUniqueLanguages.forEach(element => {
            let sample = { value: element };
            multipleLanguages.push(sample);
        })
        await this.setState({ languageData: multipleLanguages, categoryList: sampleCategoryArray, serviceList: sampleServiceArray });
        console.log('this.state.serviceList' + JSON.stringify(this.state.serviceList));
    }

    /* Send multiple Selected Filtered values  */
    sendFilteredData = async () => {
        console.log('filterData::', filterData)
        console.log('this.state.selectAvailabilityIndex::', this.state.selectAvailabilityIndex)

        this.props.navigation.navigate('Doctor List', {
            filterData: filterData,
            filterBySelectedAvailabilityDateCount: this.state.selectAvailabilityIndex, ConditionFromFilter: true
        })
    }
    /*  Select GenderPreference */
    clickGenderInButton = async (genderIndex, genderSelected, bySelect) => {
        if (genderIndex === this.state.genderIndex && bySelect) {
            genderIndex = 0,
                genderSelected = ''
        }
        this.setState({ genderIndex: genderIndex });
        this.setState({ genderSelected: genderSelected, viewDoctors_button: false })
        filterData.gender = genderSelected;
    }
    /* Get the selected Availability Date  */
    clickFilterByAvailabilityDates = (index, bySelect) => {
        if (index === this.state.selectAvailabilityIndex && bySelect) {
            index = 0
        }
        this.setState({ selectAvailabilityIndex: index, viewDoctors_button: false })
    }

    clickFilterByExperince = async (index, bySelect) => {
        if (index === this.state.selectExperinceIndex && bySelect) {
            index = 0
        }
        this.setState({ selectExperinceIndex: index, viewDoctors_button: false })
        filterData.experience = index;
        console.log('filterData' + JSON.stringify(filterData))
    }

    onSelectedLanguagesChange = async (language) => {
        this.setState({ language, viewDoctors_button: false });
        filterData.language = language;
    };
    onSelectedServiceChange = async (selectedServices) => {
        await this.setState({ selectedServices, viewDoctors_button: false })
        filterData.service = selectedServices;

        console.log('selectedServices' + console.log(this.state.selectedServices))
    }
    onSelectedCategoryChange = async (selectedCategory) => {
        alert('selectedCategory:::', selectedCategory)
        // if (selectedCategory == 'Select Your Category') {
        //     selectedCategory = null;
        // }
        this.setState({ selectedCategory, viewDoctors_button: false });
        filterData.category = selectedCategory;
    }

    render() {
        const { genderIndex, selectAvailabilityIndex, selectExperinceIndex } = this.state;
        return (
            <Container style={styles.container}>
                <Content>
                    <View style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.5, paddingBottom: 10, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                        <Text style={{ fontFamily: 'OpenSans', color: 'gray', fontSize: 13, }}>Gender </Text>
                        <Row style={{ marginTop: 10, borderBottomWidth: 0, }}>

                            <Col size={3.33} >
                                <TouchableOpacity
                                    onPress={() => this.clickGenderInButton(1, "M", true)}
                                    style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                    <Radio selected={genderIndex === 1 ? true : false} />
                                    <Icon name="ios-man" style={{ fontSize: 20, marginLeft: 10, }} />
                                    <Text style={{
                                        fontFamily: 'OpenSans', fontSize: 13, marginLeft: 15, color: '#333333'
                                    }}>Male</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={3.33} >
                                <TouchableOpacity
                                    onPress={() => this.clickGenderInButton(2, "F", true)}

                                    style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                    <Radio selected={genderIndex === 2 ? true : false} />
                                    <Icon name="ios-man" style={{ fontSize: 20, marginLeft: 10, }} />
                                    <Text style={{
                                        fontFamily: 'OpenSans', fontSize: 13, marginLeft: 15, color: '#333333'
                                    }}>Female</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={3.33} >
                                <TouchableOpacity
                                    onPress={() => this.clickGenderInButton(3, "O", true)}
                                    style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                    <Radio selected={genderIndex === 3 ? true : false} />
                                    <Text style={{
                                        fontFamily: 'OpenSans', fontSize: 13, marginLeft: 15, color: '#333333'
                                    }}>Others</Text>
                                </TouchableOpacity>
                            </Col>

                        </Row>
                    </View>

                    <View style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.5, paddingBottom: 20, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                        <Text style={{ fontFamily: 'OpenSans', color: 'gray', fontSize: 13, }}>Availability Date & Time </Text>
                        <Row style={{ marginTop: 10, borderBottomWidth: 0 }}>
                            <Col size={3}>
                                <TouchableOpacity

                                    onPress={() => this.clickFilterByAvailabilityDates(1, true)}
                                    style={selectAvailabilityIndex === 1 ? styles.selectedDaysColor : styles.defaultDaysColor}
                                >
                                    <Text style={{ color: '#333333', fontFamily: 'OpenSans', fontSize: 13, textAlign: 'center' }}>Tomorrow</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={3} style={{ marginLeft: 10 }}>
                                <TouchableOpacity

                                    onPress={() => this.clickFilterByAvailabilityDates(3, true)}
                                    style={selectAvailabilityIndex === 3 ? styles.selectedDaysColor : styles.defaultDaysColor}
                                >
                                    <Text style={{ color: '#333333', fontFamily: 'OpenSans', fontSize: 13, textAlign: 'center' }}>Next 3 days</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={3} style={{ marginLeft: 10 }}>
                                <TouchableOpacity

                                    style={selectAvailabilityIndex === 7 ? styles.selectedDaysColor : styles.defaultDaysColor}
                                    onPress={() => this.clickFilterByAvailabilityDates(7, true)}
                                >
                                    <Text style={{ color: '#333333', fontFamily: 'OpenSans', fontSize: 13, textAlign: 'center' }}>Next 7 days</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </View>

                    <View style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.5, paddingBottom: 20, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                        <Text style={{ fontFamily: 'OpenSans', color: 'gray', fontSize: 13, }}>Work Experience</Text>
                        <Row style={{ marginTop: 10, borderBottomWidth: 0 }}>
                            <Col size={2.5}>
                                <TouchableOpacity
                                    style={selectExperinceIndex === 10 ? styles.selectedExperienceColor : styles.defaultExperienceColor}
                                    onPress={() => this.clickFilterByExperince(10, true)}
                                >
                                    <Text style={{ color: '#333333', fontFamily: 'OpenSans', fontSize: 10, textAlign: 'center' }}>0-10 yrs</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={2.5} style={{ marginLeft: 10 }}>
                                <TouchableOpacity
                                    style={selectExperinceIndex === 20 ? styles.selectedExperienceColor : styles.defaultExperienceColor}
                                    onPress={() => this.clickFilterByExperince(20, true)}
                                >
                                    <Text style={{ color: '#333333', fontFamily: 'OpenSans', fontSize: 10, textAlign: 'center' }}>10-20 yrs</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={2.5} style={{ marginLeft: 10 }}>
                                <TouchableOpacity
                                    style={selectExperinceIndex === 30 ? styles.selectedExperienceColor : styles.defaultExperienceColor}
                                    onPress={() => this.clickFilterByExperince(30, true)}
                                >
                                    <Text style={{ color: '#333333', fontFamily: 'OpenSans', fontSize: 10, textAlign: 'center' }}>20-30 yrs</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={2.5} style={{ marginLeft: 10 }}>
                                <TouchableOpacity
                                    style={selectExperinceIndex === 40 ? styles.selectedExperienceColor : styles.defaultExperienceColor}
                                    onPress={() => this.clickFilterByExperince(40, true)}
                                >
                                    <Text style={{ color: '#333333', fontFamily: 'OpenSans', fontSize: 10, textAlign: 'center' }}>Above 30</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </View>

                    <View style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.5, paddingBottom: 10, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                        <Text style={{ fontFamily: 'OpenSans', color: 'gray', fontSize: 13, }}>Choose Spoken Languages</Text>
                        <TouchableOpacity style={{ height: 60, marginTop: -15, marginLeft: -9.5 }}>
                            <SectionedMultiSelect
                                styles={{
                                    selectToggleText: {
                                        color: '#333333',
                                        fontSize: 13
                                    },

                                }}
                                items={this.state.languageData}
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
                                selectedItems={this.state.language}
                                colors={{ primary: '#18c971' }}
                                showCancelButton={true}
                                animateDropDowns={true}
                                testID='languageSelected'
                            />
                        </TouchableOpacity>
                    </View>
                    {/* 
                        
                    <View style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.5, paddingBottom: 10, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                        <Text style={{ fontFamily: 'OpenSans', color: 'gray', fontSize: 13, }}>Selected your category</Text>
                        <TouchableOpacity style={{ height: 60, marginTop: -15, marginLeft: -9.5 }}>
                                <Picker style={{ fontFamily: 'OpenSans', }}
                                    mode="dropdown"
                                    placeholder='Select categories'
                                    placeholderStyle={{ fontSize: 15, marginLeft: -5 }}
                                    // iosIcon={<Icon name="ios-arrow-down" style={{ color: 'gray', textAlign: 'right' }} />}
                                    note={false}
                                    textStyle={{ color: "gray", left: 0, marginLeft: -5 }}
                                    itemStyle={{
                                        backgroundColor: "#fff",
                                        paddingLeft: 10,
                                        fontSize: 16,


                                    }}
                                    itemTextStyle={{ color: 'gray' }}
                                    style={{ width: '85%' }}
                                    onValueChange={this.onSelectedCategoryChange}
                                    selectedValue={this.state.selectedCategory}
                                >
                                    {this.state.categoryList.map((category, key) => {
                                        return <Picker.Item label={String(category.value)} value={String(category.value)} key={key}
                                        />
                                    })
                                    }
                                </Picker>
                                </TouchableOpacity>
                    </View> */}




                    <View style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.5, paddingBottom: 10, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                        <Text style={{ fontFamily: 'OpenSans', color: 'gray', fontSize: 13, }}>Selected your category</Text>
                        <TouchableOpacity style={{ height: 60, marginTop: -15, marginLeft: -9.5 }}>
                            <SectionedMultiSelect
                                styles={{
                                    selectToggleText: {
                                        color: '#333333',
                                        fontSize: 13
                                    },

                                }}
                                items={this.state.categoryList}
                                uniqueKey='value'
                                displayKey='value'
                                selectText='Category 1'
                                searchPlaceholderText='Search Your Languages'
                                modalWithTouchable={true}
                                showDropDowns={true}
                                hideSearch={false}
                                showRemoveAll={true}
                                showChips={false}
                                readOnlyHeadings={false}
                                onSelectedItemsChange={this.onSelectedCategoryChange}
                                selectedItems={this.state.selectedCategory}
                                colors={{ primary: '#18c971' }}
                                showCancelButton={true}
                                animateDropDowns={true}


                                testID='languageSelected'
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.5, paddingBottom: 10, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                        <Text style={{ fontFamily: 'OpenSans', color: 'gray', fontSize: 13, }}>Selected service</Text>
                        <TouchableOpacity style={{ height: 60, marginTop: -15, marginLeft: -9.5 }}>
                            <SectionedMultiSelect
                                styles={{
                                    selectToggleText: {
                                        color: '#333333',
                                        fontSize: 13
                                    },

                                }}
                                items={this.state.serviceList}
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
                                selectedItems={this.state.selectedServices}
                                colors={{ primary: '#18c971' }}
                                showCancelButton={true}
                                animateDropDowns={true}
                                testID='languageSelected'
                            />
                        </TouchableOpacity>
                    </View>
                    <Row style={{ marginTop: 30, borderBottomWidth: 0, marginLeft: 10, marginRight: 10 }}>
                        <Col size={5} >
                            <TouchableOpacity style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15, borderRadius: 30, borderColor: '#775DA3', borderWidth: 0.5 }}>
                                <Text style={{ color: '#775DA3', fontFamily: 'OpenSans', fontSize: 13, textAlign: 'center', fontWeight: '500' }}>Clear Filters</Text>
                            </TouchableOpacity>
                        </Col>
                        <Col size={5} style={{ marginLeft: 20 }}>
                            <TouchableOpacity
                                block success disabled={this.state.viewDoctors_button} style={this.state.viewDoctors_button === true ? styles.viewDocButtonBgGray : styles.viewDocButtonBgGreeen}
                                onPress={this.sendFilteredData}
                            >
                                <Text style={{ color: '#000', fontFamily: 'OpenSans', fontSize: 13, textAlign: 'center', fontWeight: '500' }}>Apply</Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
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

    defaultExperienceColor:
    {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },

    selectedExperienceColor: {
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
    selectedGenderColor: {
        borderRadius: 10,
        width: '90%',
        marginLeft: 10,
        borderWidth: 50,

        backgroundColor: 'green',
    },
    defaultColor: {
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
    }

})