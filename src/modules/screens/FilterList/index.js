import React, { Component } from 'react';
import { Container, Content, Text, Picker, CheckBox, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ScrollView, ProgressBar, Switch } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image,FlatList, TouchableOpacity, View } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';


class FilterList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            doctorData: [],
            languageData: [],
            typeLanguage: '',
            genderPreferenceCheck: [true, false, false],
            genderSelected: ['M', 'F', 'O'],
            genderSelect: '',
            categoryList: [],
            sampleServiceArray:[],
            serviceList:[],
            selectedCategory: '',
            serviceCheckBox:[false],
            selectedService:[],
            serviceValue:''

        }
    }

    async componentDidMount() {
        const { navigation } = this.props;
        const doctorData = navigation.getParam('doctorData');
        await this.setState({ doctorData: doctorData });
        console.log('doctorData' + JSON.stringify(this.state.doctorData));
        let sampleLangArray = [];
        let sampleCategoryArray = [];
        let sampleServiceArray = [];
        let conditionCategoryArry=[];
let conditionServiceArry=[];

        for (var data in this.state.doctorData) {
            if (this.state.doctorData[data].language) {
                
                Array.prototype.push.apply(sampleLangArray, this.state.doctorData[data].language)
            }
            if (this.state.doctorData[data].specialist) {
                this.state.doctorData[data].specialist.forEach(element => {

                    if (!conditionCategoryArry.includes(element.category_id)&&!conditionServiceArry.includes(element.service_id)) {
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
        await this.setState({ languageData: sampleLangArray, categoryList: sampleCategoryArray,serviceList:sampleServiceArray });
        // console.log('this.state.categoryList' +JSON.stringify(this.state.categoryList));
        // console.log('this.state.serviceList' +JSON.stringify(this.state.serviceList));
    }

    /* send multiple Filter values   */
    sendFilteredData = async () => {
        let filterData = [{
            type: 'language',
            value: [this.state.typeLanguage]
        },
        {
            type: "gender_preference",
            value: [this.state.genderSelect]
        },
        {
            type: "category",
            value: [this.state.selectedCategory]
        },
        {
            type: "service",
            value: [this.state.serviceValue]
        }
        ]
        console.log('filterData' + JSON.stringify(filterData));
        if (this.state.genderSelect == '') {
            alert("We can't Find the Empty data");
        }
        else {
            this.props.navigation.navigate('Doctor List', { resultData: filterData })
        }
    }
    /*  Auto completed language select method  */
    findLanguage(typeLanguage) {
        if (typeLanguage === '') {
            return [];
        }
        const { languageData } = this.state;
        const regex = new RegExp(`${typeLanguage.trim()}`, 'i');
        //   console.log('typeLanguage'+this.state.typeLanguage);
        return languageData.filter(languageData => languageData.search(regex) >= 0);

    }
    /*  Select multiple Or single Genders */
    clickedGenderInCheckBox = (genderIndex, genderSelect) => {
        let sampleArray = this.state.genderPreferenceCheck;
        sampleArray[genderIndex] = !this.state.genderPreferenceCheck[genderIndex];
        this.setState({ genderPreferenceCheck: sampleArray });
        this.setState({ genderSelect: genderSelect })
        // console.log('genderSelect'+this.state.genderSelect);

        if (sampleArray[genderIndex] == true) {
            this.state.genderSelected.splice(genderIndex, 0, genderSelect);
        } else {
            let deSelectedIndex = this.state.genderSelected.indexOf(genderSelect);
            this.state.genderSelected.splice(deSelectedIndex, 1);
        }
    }
    clickedServiceInCheckBox=(serviceIndex,serviceValue)=>{

let sampleArray = this.state.serviceCheckBox;
sampleArray[serviceIndex] = !this.state.serviceCheckBox[serviceIndex];
this.setState({ serviceCheckBox: sampleArray });
this.setState({ serviceValue: serviceValue })
console.log('serviceValue'+this.state.serviceValue);

if (sampleArray[serviceIndex] == true) {
    this.state.selectedService.splice(serviceIndex, 0, serviceValue);
} else {
    let deSelectedIndex = this.state.selectedService.indexOf(serviceValue);
    this.state.selectedService.splice(deSelectedIndex, 1);
}

    }
    render() {
        const { typeLanguage } = this.state;
        const languageData = this.findLanguage(typeLanguage);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        return (

            <Container style={styles.container}>
                <Content style={styles.bodyContent}>
                    <Card style={{ padding: 10, borderRadius: 10  }}>
                        <CardItem header bordered>
                            <Text style={styles.hederText}>Gender preference</Text>
                        </CardItem>

                        <Item style={{ marginTop: 10, borderBottomWidth: 0 }}>
                            <Col>
                                <Item style={{ marginTop: 10, borderBottomWidth: 0 }}>

                                <TouchableOpacity color={"#775DA3"} selectedColor={"#7459A1"} style={styles.buttonSelected}>
                                    <Text style={styles.buttonText}>Any</Text>
                                    </TouchableOpacity>
                                   
                                    {/* <CheckBox color={"#775DA3"} selectedColor={"#775DA3"} style={{ marginLeft: 11 }}
                                        checked={this.state.genderPreferenceCheck[0]} onPress={() => this.clickedGenderInCheckBox(0, "M")} /> */}
                                    {/* <Text style={{ marginLeft: 11, color: 'gray', fontFamily: 'OpenSans' }}>Male</Text> */}
                                </Item></Col>
                            <Col>
                                <Item style={{ marginTop: 10, borderBottomWidth: 0 }}>
                                    {/* <CheckBox color={"#775DA3"} selectedColor={"#775DA3"} style={{ marginLeft: 11 }}
                                        checked={this.state.genderPreferenceCheck[1]} onPress={() => this.clickedGenderInCheckBox(1, "F")} />
                                    <Text style={{ marginLeft: 11, color: 'gray', fontFamily: 'OpenSans' }}>Female</Text> */}
                                     <TouchableOpacity color={"#FF00FF"} selectedColor={"#FF00FF"} style={styles.button}>
                                    <Text style={styles.buttonText}>Male</Text>
                                    </TouchableOpacity>
                                </Item></Col>
                            <Col>
                                <Item style={{ marginTop: 10, borderBottomWidth: 0 }}>
                                    {/* <CheckBox color={"#775DA3"} selectedColor={"#775DA3"} style={{ marginLeft: 11 }}
                                        checked={this.state.genderPreferenceCheck[2]} onPress={() => this.clickedGenderInCheckBox(2, "O")} />
                                    <Text style={{ marginLeft: 11, color: 'gray', fontFamily: 'OpenSans' }}>Others</Text> */}

                            <TouchableOpacity color={"#FF00FF"} selectedColor={"#FF00FF"} style={styles.button}>
                                    <Text style={styles.buttonText}>FeMale</Text>
                                    </TouchableOpacity>
                                </Item></Col>
                        </Item>
                    </Card>

                    <Card style={{ padding: 10, borderRadius: 10 }}>
                        <CardItem header bordered>
                            <Text style={styles.hederText}>Availability Time</Text>
                        </CardItem>
                        <CardItem >
                            <Body>

                                <Grid>
                                    <Row>

                                        <Col style={{ width: '30%' ,marginTop: 10,paddingRight: 10}}>
                                        <TouchableOpacity color={"#775DA3"} selectedColor={"#7459A1"} style={styles.buttonAvTimeToday}>
                                        <Text style={styles.buttonTextTmAV}>Today</Text>
                                        </TouchableOpacity>
                                        </Col>

                                        <Col style={{ width: '75%' ,marginTop: 10,paddingRight: 20}}>
                                        <TouchableOpacity color={"#775DA3"} selectedColor={"#7459A1"} style={styles.buttonAvTime}>
                                        <Text style={styles.buttonTextTmAV}>Only doctors Available today</Text>
                                        </TouchableOpacity>
                                        </Col>
                                    </Row>


                                </Grid>
                            </Body>
                        </CardItem>

                    </Card>
                    <Card style={{ borderRadius: 10 }}>
                        <Item style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', marginTop: 10, borderRadius: 5 }}>
                            <Picker style={{ fontFamily: 'OpenSans' }}
                                mode="dropdown"
                                placeholder="Select Category"
                                iosIcon={<Icon name="arrow-down" />}
                                textStyle={{ color: "#5cb85c" }}
                                itemStyle={{
                                    backgroundColor: "gray",
                                    marginLeft: 0,
                                    paddingLeft: 10
                                }}
                                itemTextStyle={{ color: 'gray' }}
                                style={{ width: 25 }}
                                onValueChange={(category) => { this.setState({ selectedCategory: category}) }}
                                selectedValue={this.state.selectedCategory}
                            >
                                {this.state.categoryList.map((category, key) => {
                                    console.log(category);
                                    return <Picker.Item label={String(category.value)} value={String(category)} key={key}
                                    />
                                })
                                }
                            </Picker>

                        </Item>
                      


                        <FlatList
                numColumns={2}
                data={this.state.serviceList}
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
            
                         <Col style={{ width: '50%' }}>
                                                 <CheckBox color={"#775DA3"} selectedColor={"#775DA3"} style={{ marginLeft: 11 }}
                                                    checked={this.state.serviceCheckBox[index]}  onPress={() => this.clickedServiceInCheckBox(index,item.value )} />
                                                     <Text style={styles.customText}>{item.value}</Text>
                        </Col>
                } />
                       
                    </Card>
                    <Card style={{ borderRadius: 10 }}>
                        <CardItem header bordered>
                            <Text style={styles.hederText}>Languages</Text>
                        </CardItem>
                        <Autocomplete
                            autoCapitalize="none"
                            autoCorrect={false}
                            containerStyle={styles.autocompleteContainer}
                            data={languageData.length === 1 && comp(typeLanguage, languageData) ? [] : languageData}
                            defaultValue={typeLanguage}
                            onChangeText={enterText => this.setState({ typeLanguage: enterText })}
                            placeholder="Enter Your Language"
                            renderItem={({ item, i }) => (
                       
                                <CheckBox color={"#775DA3"} selectedColor={"#775DA3"} style={{ marginLeft: 11 }}
                                checked={this.state.genderPreferenceCheck[2]} onPress={() => this.clickedGenderInCheckBox(2, "O")} >
                                <Text style={styles.itemText}>
                                {item}
                            </Text>
                            </CheckBox>

                            )}
                            keyExtractor={(item, index) => index.toString()}

                            
                        />
                    </Card>
                    

                    <Card style={{ borderRadius: 10 }}>
                        <CardItem header bordered>
                            <Text style={styles.hederText}>Work Experience</Text>
                        </CardItem>
                        <CardItem style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Grid style={{ marginTop: 10 }}>
                                <Row>
                                    <Col style={{ width: '50%' }}>
                                        <ListItem noBorder>

                                            <Body>
                                                <Button style={styles.expButton}><Text style={{ fontFamily: 'opensans' }}> Any</Text></Button>
                                            </Body>

                                            
                                        </ListItem>

                                    </Col>
                                    <Col style={{ width: '50%' }}>
                                        <ListItem noBorder>
                                            <Button style={styles.expButton}><Text style={{ fontFamily: 'opensans' }}>0-5</Text></Button>
                                        </ListItem>
                                    </Col>

                                </Row>
                            </Grid>
                        </CardItem>

                    </Card>
                    <Button block success style={{ borderRadius: 17, marginLeft: 3 }} onPress={this.sendFilteredData}>
                        <Text uppercase={false} >View doctors</Text>
                    </Button>
                </Content>

            </Container>

        )
    }

}

function filterState(state) {

    return {
        user: state.user
    }
}
export default connect(filterState)(FilterList)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#8e8b87',
        flex: 12,
        padding: 1,
        marginTop: 40,
    },

    bodyContent: {
        padding: 5
    },

    customText: {
        fontFamily: 'OpenSans',
        color: 'gray',
        fontSize: 13
    },
    expButton: {
        height: 40,
        width: '100%',
        borderRadius: 15,
        backgroundColor: '#7E49C3',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'OpenSans',
    },

    autocompleteContainer: {
        backgroundColor: '#ffffff',
        borderWidth: 0,
    },
    descriptionContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    itemText: {
        fontSize: 15,
        paddingTop: 5,
        paddingBottom: 5,
        margin: 2,
    },
    infoText: {
        textAlign: 'center',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#8e8b87',
        padding: 10,
        paddingTop: 7,
        paddingBottom: 7,
        borderRadius: 1,
        opacity: 0.9,
        shadowColor: '#C8C7CC',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        height: 40,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      buttonSelected: {
        backgroundColor: '#7E49C3',
        padding: 10,
        paddingTop: 7,
        paddingBottom: 7,
        borderRadius: 1,
        opacity: 0.9,
        shadowColor: '#C8C7CC',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        height: 40,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      buttonText: {
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'OpenSans',
        marginLeft: 'auto',
        marginRight: 'auto',
        fontSize: 20,
      },
      buttonTextTmAV: {
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'OpenSans',
        marginLeft: 'auto',
        marginRight: 'auto',
        fontSize: 15,
      },
      hederText: {
        color: 'gray',
        justifyContent: 'center',
        fontFamily: 'OpenSans',
        fontSize: 12,
      },

      buttonAvTime: {
        borderColor: '#d6d7da',
        backgroundColor: '#8e8b87',
        padding: 10,
        paddingTop: 7,
        paddingBottom: 7,
        borderRadius: 10,
        opacity: 0.9,
        shadowColor: '#C8C7CC',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        height: 40,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      buttonAvTimeToday: {
        borderColor: '#d6d7da',
        backgroundColor: '#8e8b87',
        padding: 10,
        paddingTop: 7,
        paddingBottom: 7,
        borderRadius: 10,
        opacity: 0.9,
        shadowColor: '#C8C7CC',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        height: 40,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      },

      submit:{
        marginRight:40,
        marginTop:2,
        paddingTop:2,
        paddingBottom:5,
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#68a0cf'
      },
      submitText:{
          color:'#68a0cf',
          textAlign:'center',
          
      },



      
});