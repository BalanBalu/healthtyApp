import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Body, Picker, Button, Card, Text, Item, Row, View, Col, Content, Icon, Header, Left, Title, ListItem } from 'native-base';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { NavigationEvents } from 'react-navigation';

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
            selectedService: [],
            language: '',
            genderIndex: 0,
            selectAvailabilityIndex: 0,
            selectedServicesList: '',
        }
    }

    async componentDidMount() {

        const { navigation } = this.props;
        const doctorData = navigation.getParam('doctorData');
        const selectedServicesList = navigation.getParam('selectedServicesList');

        await this.setState({ doctorData: doctorData, selectedServicesList: selectedServicesList });
        // console.log('selectedServicesList' + JSON.stringify(this.state.selectedServicesList));
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

        let setUniqueLanguages =new Set(sampleLangArray)
        setUniqueLanguages.forEach(element => {
            let sample = { value: element };
            multipleLanguages.push(sample);
        })
        await this.setState({ languageData: multipleLanguages, categoryList: sampleCategoryArray, serviceList: sampleServiceArray });
        // console.log('this.state.languageData' + JSON.stringify(this.state.languageData));
    }

    /* Go and select the Services from Service List page  */
    goServiceListPage = async () => {
        await this.props.navigation.navigate('Services', { serviceList: this.state.serviceList })
    }
    /* Send multiple Selected Filtered values  */
    sendFilteredData = async () => {
        let filterData = [
            {
            type: 'language',
            value: this.state.language
        },
        {
            type: "gender_preference",
            value: this.state.genderSelected
        },
        {
            type: "category",
            value: this.state.selectedCategory
        },
        {
            type: "service",
            value: this.state.selectedServicesList
        }
        ]  

        let finalFilArray=[];

        filterData.forEach((filElement)=>{
          if (filElement.value!==''){
            finalFilArray.push(filElement)
          }
        })
        console.log('finalFilArray' + JSON.stringify(finalFilArray));
            this.props.navigation.navigate('Doctor List', { filterData: finalFilArray, filterBySelectedAvailabilityDateCount: this.state.selectAvailabilityIndex, ConditionFromFilter: true })
    }
    /*  Select GenderPreference */
    clickGenderInButton = (genderIndex, genderSelected) => {
        this.setState({ genderIndex: genderIndex });
        this.setState({ genderSelected: genderSelected })   
    }
    /* Get the selected Availability Date  */
    clickFilterByAvailabilityDates = (index) => {
        this.setState({ selectAvailabilityIndex: index })
    }

    render() {
        const { genderIndex, selectAvailabilityIndex } = this.state;

        return (
            <Container style={styles.container}>
                <Content style={{ padding: 5 }}>
                <NavigationEvents
      onWillFocus={payload => {this.componentDidMount() }}
      />
                    {/* first card */}

                    <Card style={{ padding: 10, borderRadius: 10, width: 'auto' }}>
                        <Text style={{ backgroundColor: 'whitesmoke', borderBottomColor: '#c9cdcf', borderBottomWidth: 2, }}>Gender Preference</Text>
                        <Row style={{ justifyContent: 'center', marginTop: 10 }}>
                            <Col>
                                <Button bordered
                                    style={genderIndex === 1 ? styles.selectedGenderColor : styles.defaultGenderColor}
                                    onPress={() => this.clickGenderInButton(1, "M")}
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
                                    onPress={() => this.clickGenderInButton(2, "F")}
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

                                    onPress={() => this.clickGenderInButton(3, "O")} >
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                        <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />

                                        <Text style={{ textAlign: 'center', fontSize: 12, }}>Any</Text>
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
                                    onPress={() => this.clickFilterByAvailabilityDates(1)}
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
                                    onPress={() => this.clickFilterByAvailabilityDates(3)}
                                    style={selectAvailabilityIndex === 3 ? styles.selectedGenderColor : styles.defaultColor}

                                >
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                        <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto' }} name='female' />


                                        <Text style={{ textAlign: 'center', fontSize: 12 }}>After 3 Day</Text>

                                    </View>

                                </Button>
                            </Col>
                            <Col>
                                <Button bordered style={styles.defaultColor}
                                    style={selectAvailabilityIndex === 7 ? styles.selectedGenderColor : styles.defaultColor}
                                    onPress={() => this.clickFilterByAvailabilityDates(7)}
                                >
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                        <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />
                                        <Text style={{ textAlign: 'center', fontSize: 12, }}>After a week</Text>
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
                                <Button disabled bordered style={styles.card3}>
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                        <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />
                                        <Text style={{ textAlign: 'center', fontSize: 12, }}>0-10 years</Text>
                                    </View>
                                </Button>
                            </Col>
                            <Col>
                                <Button disabled bordered style={styles.card3}>
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                        <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', color: 'blue' }} name='female' />
                                        <Text style={{ textAlign: 'center', fontSize: 12, color: 'blue' }}>10-20 years</Text>

                                    </View>

                                </Button>
                            </Col>
                            <Col>
                                <Button disabled bordered style={styles.card3}>
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                                        <Icon style={{ fontSize: 30, marginLeft: 'auto', marginRight: 'auto', }} name='female' />
                                        <Text style={{ textAlign: 'center', fontSize: 12, }}>20-30 years</Text>

                                    </View>

                                </Button>
                            </Col>
                            <Col>
                                <Button disabled bordered style={styles.card3}>
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
                                    //   itemFontFamily={'Avenir'}
                                    modalWithTouchable={true}
                                    showDropDowns={true}
                                    hideSearch={true}
                                    showRemoveAll={true}
                                    showChips={false}
                                    readOnlyHeadings={false}
                                    onSelectedItemsChange={(language) => this.setState({ language })}
                                    selectedItems={this.state.language}
                                    colors={{ primary: '#18c971' }}
                                    showCancelButton={true}
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
                            onValueChange={(y) => { this.setState({ selectedCategory: y }) }}
                            selectedValue={this.state.selectedCategory}
                        >
                            {this.state.categoryList.map((category, key) => {
                                return <Picker.Item label={String(category.value)} value={String(category.value)} key={key}
                                />
                            })
                            }
                        </Picker>

                    </Item>

                    <View style={{ paddingTop: 5 }}>
                        <Card block style={{ backgroundColor: '#fff', padding: 5, borderRadius: 10, }}>
                            <Row>
                                <Col style={{ width: '95%' }}>
                                    <Text style={{ color: 'black', fontSize: 15, width: 'auto', fontFamily: 'OpenSans', }}>Select Services</Text>
                                </Col>
                                <Col style={{ width: '95%' }}>
                                    <Icon name='ios-arrow-forward' style={{ fontSize: 30, color: 'black', width: 'auto' }}
                                        onPress={() => { this.goServiceListPage() }} />
                                </Col>
                            </Row>
                        </Card>
                    </View>

                    <View style={{ paddingTop: 5 }}>
                        <Button block style={{ borderRadius: 10, backgroundColor: '#5cb75d', height: 48 }} onPress={this.sendFilteredData}>
                            <Text style={{ fontFamily: 'OpenSans', }}>View Doctors</Text>
                        </Button>
                    </View>
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
    card3: {
        borderRadius: 10,
        padding: 20,
        height: 80,
        width: '90%',
        borderColor: 'black',
        borderWidth: 10,
        height: 80,
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
    }
})