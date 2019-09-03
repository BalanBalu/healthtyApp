import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Body, Picker, Button, Card, Text, Item, Row, View, Col, Content, Icon, Header, Left, Title, ListItem } from 'native-base';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { NavigationEvents } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';

let filterData = {};  //for send only selected Filtered Values and Store the Previous selected filter values 
export default class Filters extends Component {

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
            selectExperinceIndex: '',
            selectedServices:[],
            viewDoctors_button: true
        }
    }

    async componentDidMount() {

        const { navigation } = this.props;
        const doctorData = navigation.getParam('doctorData');
        // const selectedServicesList = navigation.getParam('selectedServicesList');
        const filterData = navigation.getParam('filterData');
        const filterBySelectedAvailabilityDateCount = navigation.getParam('filterBySelectedAvailabilityDateCount')
       // console.log( 'Filter Data from Search List: ' + JSON.stringify(filterData));
        //console.log(' filterBySelectedAvailabilityDateCount' + filterBySelectedAvailabilityDateCount);
        if(filterBySelectedAvailabilityDateCount !== 0 && filterBySelectedAvailabilityDateCount !== undefined) {
            this.clickFilterByAvailabilityDates(filterBySelectedAvailabilityDateCount, false);
        }
        if(filterData) {
            if(filterData.gender_preference) {
                if(filterData.gender_preference === 'M') {
                    this.clickGenderInButton(1, 'M', false)
                } else if(filterData.gender_preference === 'F') {
                    this.clickGenderInButton(2, 'F', false)
                } else if(filterData.gender_preference === 'O') {
                    this.clickGenderInButton(3, 'O', false)
                }
            }
            if(filterData.experience) {
                this.clickFilterByExperince(filterData.experience, false );
            }
            if(filterData.language) {
                this.onSelectedLanguagesChange(filterData.language);
            }
            if(filterData.category) {
                this.onSelectedCategoryChange(filterData.category);
            }
            if(filterData.service) {
                this.onSelectedServiceChange(filterData.service)         }
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
        let defaultPlaceHolderValue = { id: '0101', value: "Select Your Category" }
        sampleCategoryArray.unshift(defaultPlaceHolderValue)
        let setUniqueLanguages = new Set(sampleLangArray)
        setUniqueLanguages.forEach(element => {
            let sample = { value: element };
            multipleLanguages.push(sample);
        })
        await this.setState({ languageData: multipleLanguages, categoryList: sampleCategoryArray, serviceList: sampleServiceArray });
        console.log('this.state.serviceList' + JSON.stringify(this.state.serviceList));
    }

    /* Go and select the Services from Service List page  */
    goServiceListPage = async () => {
        this.props.navigation.navigate('Services', { serviceList: this.state.serviceList })
    }
    /* Send multiple Selected Filtered values  */
    sendFilteredData = async () => {
        this.props.navigation.navigate('Doctor List', { 
                filterData: filterData, 
                filterBySelectedAvailabilityDateCount: this.state.selectAvailabilityIndex, ConditionFromFilter: true })
        }
    /*  Select GenderPreference */
    clickGenderInButton = async (genderIndex, genderSelected, bySelect) => {
        if(genderIndex === this.state.genderIndex && bySelect) {
            genderIndex = 0,
            genderSelected = ''
        }
        this.setState({ genderIndex: genderIndex });
        this.setState({ genderSelected: genderSelected, viewDoctors_button: false })
        filterData.gender_preference = genderSelected;
    }
    /* Get the selected Availability Date  */
    clickFilterByAvailabilityDates = (index, bySelect) => {
        if(index === this.state.selectAvailabilityIndex && bySelect) {
            index = 0
        }
        this.setState({ selectAvailabilityIndex: index, viewDoctors_button: false })
    }

    clickFilterByExperince = async (index, bySelect) => {
        if(index === this.state.selectExperinceIndex && bySelect) {
            index = 0
        }
        this.setState({ selectExperinceIndex: index, viewDoctors_button: false })
        filterData.experience = index;
        console.log('filterData'+JSON.stringify(filterData))
    }

    onSelectedLanguagesChange = async (language) => {
        this.setState({ language, viewDoctors_button: false });
        filterData.language = language;
    };
    onSelectedServiceChange=async(selectedServices)=>{
       await this.setState({selectedServices,viewDoctors_button: false })
       filterData.service = selectedServices;

        console.log('selectedServices'+console.log(this.state.selectedServices))
    }
    onSelectedCategoryChange = async (selectedCategory) => {
        if(selectedCategory == 'Select Your Category') {
            selectedCategory = null;
        }
        this.setState({ selectedCategory, viewDoctors_button: false });
        filterData.category = selectedCategory;
    }

    render() {
        const { genderIndex, selectAvailabilityIndex, selectExperinceIndex } = this.state;
        return (
            <Container style={styles.container}>
                <Content style={{ padding: 5 }}>
                    <ScrollView>
                        <NavigationEvents
                            onWillFocus={payload => { this.componentDidMount() }}
                        />
                        {/* first card */}

                        <Card style={{ padding: 10, borderRadius: 10, width: 'auto' }}>
                            <Text style={{ backgroundColor: 'whitesmoke', borderBottomColor: '#c9cdcf', borderBottomWidth: 2, }}>Gender Preference</Text>
                            <Row style={{ justifyContent: 'center', marginTop: 10 }}>
                                <Col>
                                    <Button bordered
                                        style={genderIndex === 1 ? styles.selectedGenderColor : styles.defaultGenderColor}
                                        onPress={() => this.clickGenderInButton(1, "M", true)}
                                    >
                                        <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                            <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto' }} name='male' />
                                            <Text style={{ textAlign: 'center', fontSize: 12 }}>Male</Text>
                                        </View>

                                    </Button>
                                </Col>
                                <Col>
                                    <Button bordered style={styles.defaultColor}
                                        style={genderIndex === 2 ? styles.selectedGenderColor : styles.defaultColor}
                                        onPress={() => this.clickGenderInButton(2, "F", true)}
                                    >
                                        <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                            <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />
                                            <Text style={{ textAlign: 'center', fontSize: 12, }}>Female</Text>
                                        </View>

                                    </Button>
                                </Col>
                                <Col>
                                    <Button bordered style={styles.defaultColor}
                                        style={genderIndex === 3 ? styles.selectedGenderColor : styles.defaultGenderColor}

                                        onPress={() => this.clickGenderInButton(3, "O", true )} >
                                        <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                            <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />

                                            <Text style={{ textAlign: 'center', fontSize: 12, }}>Others</Text>
                                        </View>
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                        {/* second card */}

                        <Card style={{ width: 'auto', padding: 10, borderRadius: 10, width: 'auto' }}>
                            <Text style={{
                                backgroundColor: 'whitesmoke', borderBottomColor: '#c9cdcf', borderBottomWidth: 2,
                                fontFamily: 'OpenSans',
                            }}>Availability Time</Text>
                            <Row style={{ marginTop: 10 }}>
                                <Col>
                                    <Button bordered style={styles.defaultColor}
                                        onPress={() => this.clickFilterByAvailabilityDates(1, true)}
                                        style={selectAvailabilityIndex === 1 ? styles.selectedGenderColor : styles.defaultColor}
                                    >
                                        <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                            <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />
                                            <Text style={{ textAlign: 'center', fontSize: 12, }}>Today</Text>

                                        </View>

                                    </Button>
                                </Col>
                                <Col>
                                    <Button bordered style={styles.defaultColor}
                                        onPress={() => this.clickFilterByAvailabilityDates(3, true)}
                                        style={selectAvailabilityIndex === 3 ? styles.selectedGenderColor : styles.defaultColor}

                                    >
                                        <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                            <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto' }} name='female' />


                                            <Text style={{ textAlign: 'center', fontSize: 12 }}>Next 3 Days</Text>

                                        </View>

                                    </Button>
                                </Col>
                                <Col>
                                    <Button bordered style={styles.defaultColor}
                                        style={selectAvailabilityIndex === 7 ? styles.selectedGenderColor : styles.defaultColor}
                                        onPress={() => this.clickFilterByAvailabilityDates(7, true)}
                                    >
                                        <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                            <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />
                                            <Text style={{ textAlign: 'center', fontSize: 12, }}>Next 7 Days</Text>
                                        </View>
                                    </Button>

                                </Col>
                            </Row>
                        </Card>
                        {/* third card */}

                        <Card style={{ width: 'auto', padding: 10, borderRadius: 10, }}>
                            <View>
                                <Text style={{ backgroundColor: 'whitesmoke', borderBottomColor: '#c9cdcf', borderBottomWidth: 1, fontFamily: 'OpenSans', }}>Work Experience
                  </Text>
                            </View>
                            <Row style={{ marginTop: 10 }}>
                                <Col>
                                    <Button bordered
                                        style={selectExperinceIndex === 10 ? styles.selectedExpColor : styles.defaultExpColor}
                                        onPress={() => this.clickFilterByExperince(10, true)}
                                    >
                                        <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                            <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />
                                            <Text style={{ textAlign: 'center', fontSize: 12, }}>0-10 years</Text>
                                        </View>
                                    </Button>
                                </Col>
                                <Col>
                                    <Button bordered

                                        style={selectExperinceIndex === 20 ? styles.selectedExpColor : styles.defaultExpColor}
                                        onPress={() => this.clickFilterByExperince(20, true)}

                                    >
                                        <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                            <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto' }} name='female' />
                                            <Text style={{ textAlign: 'center', fontSize: 12 }}>10-20 years</Text>

                                        </View>

                                    </Button>
                                </Col>
                                <Col>
                                    <Button bordered

                                        style={selectExperinceIndex === 30 ? styles.selectedExpColor : styles.defaultExpColor}
                                        onPress={() => this.clickFilterByExperince(30, true)}
                                    >
                                        <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                            <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />
                                            <Text style={{ textAlign: 'center', fontSize: 12, }}>20-30 years</Text>

                                        </View>

                                    </Button>
                                </Col>
                                <Col>
                                    <Button bordered
                                        style={selectExperinceIndex === 40 ? styles.selectedExpColor : styles.defaultExpColor}
                                        onPress={() => this.clickFilterByExperince(40, true )}

                                    >
                                        <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                            <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />
                                            <Text style={{ textAlign: 'center', fontSize: 12, }}>Above 30 </Text>
                                        </View>
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                        <View>
                            <Card style={{ backgroundColor: '#fff', borderRadius: 10, height: 50 }}>
                                <View style={{ justifyContent: 'center' }}>

                                    <SectionedMultiSelect style={{ height: 100 }}
                                        items={this.state.languageData}
                                        uniqueKey='value'
                                        displayKey='value'
                                        selectText='Choose Languages You know'
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
                                </View>
                            </Card>
                        </View>

                        <Item style={{ borderBottomWidth: 0, height: 40, backgroundColor: '#fff', borderRadius: 10 }}>
                            <Picker style={{ fontFamily: 'OpenSans' }}
                                mode="dropdown"
                                placeholder="Select Category"
                                iosIcon={<Icon name="arrow-down" style={{ fontSize: 10 }}
                                />}
                                textStyle={{ color: "#5cb85c" }}
                                itemStyle={{
                                    backgroundColor: "white",
                                    marginLeft: 0,
                                    paddingLeft: 10
                                }}
                                itemTextStyle={{ color: 'gray' }}
                                style={{ width: 25 }}
                                onValueChange={this.onSelectedCategoryChange}
                                selectedValue={this.state.selectedCategory}
                            >
                                {this.state.categoryList.map((category, key) => {
                                    return <Picker.Item label={String(category.value)} value={String(category.value)} key={key}
                                    />
                                })
                                }
                            </Picker>

                        </Item>


                        <View>
                            <Card style={{ backgroundColor: '#fff', borderRadius: 10, height: 50 }}>
                                <View style={{ justifyContent: 'center' }}>

                                    <SectionedMultiSelect style={{ height: 100 }}
                                        items={this.state.serviceList}
                                        uniqueKey='value'
                                        displayKey='value'
                                        selectText='Choose your Services  '
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
                                        testID='servicesSelected'
                                    />
                                </View>
                            </Card>
                        </View>

                        <View style={{ paddingTop: 5 }}>

                            <Button block success disabled={this.state.viewDoctors_button} style={this.state.viewDoctors_button === true ? styles.viewDocButtonBgGray : styles.viewDocButtonBgGreeen}
                                onPress={this.sendFilteredData}>
                                <Text style={{ fontFamily: 'OpenSans', }}>View Doctors</Text>
                            </Button>
                        </View>
                    </ScrollView>
                </Content>
            </Container >

        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#c9cdcf',
        padding: 5
    },

    defaultExpColor: {
        borderRadius: 10,
        padding: 20,
        height: 80,
        width: '90%',
        borderWidth: 10,
        height: 80,
    },
    selectedExpColor: {
        borderRadius: 10,
        padding: 20,
        height: 80,
        width: '90%',
        borderWidth: 10,
        height: 80,
        backgroundColor: 'green',

    },
    defaultGenderColor: {
        borderRadius: 10,
        padding: 30,
        width: '90%',
        marginLeft: 10,
        borderWidth: 50,
        height: 75,
    },
    selectedGenderColor: {
        borderRadius: 10,
        padding: 30,
        width: '90%',
        marginLeft: 10,
        borderWidth: 50,
        height: 75,
        backgroundColor: 'green',
    },
    defaultColor: {
        borderRadius: 10,
        padding: 30,
        width: '90%',
        marginLeft: 10,
        borderWidth: 50,
        height: 75,
    },
    viewDocButtonBgGreeen: {
        borderRadius: 10,
        backgroundColor: '#69f025',
        height: 48
    },
    viewDocButtonBgGray: {
        borderRadius: 10,
        backgroundColor: '#698d52',
        height: 48
    }

})