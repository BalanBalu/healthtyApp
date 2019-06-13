import React, { Component } from 'react';
import { Container, Content, Text, Picker, CheckBox, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ScrollView, ProgressBar, Switch } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
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
            selectedCategory: ''
        }
    }

    async componentDidMount() {
        const { navigation } = this.props;
        const doctorData = navigation.getParam('doctorData');
        await this.setState({ doctorData: doctorData });
        console.log('doctorData' + JSON.stringify(this.state.doctorData));
        let sampleLangArray = [];
        let sampleCategoryArray = [];

        for (var data in this.state.doctorData) {
            if (this.state.doctorData[data].language) {
                Array.prototype.push.apply(sampleLangArray, this.state.doctorData[data].language)
            }
            if (this.state.doctorData[data].specialist) {
                this.state.doctorData[data].specialist.forEach(element => {

                    if (!sampleCategoryArray.includes(element.category)) {
                        let sampleObject = { id: element.category_id, value: element.category };
                        sampleCategoryArray.push(sampleObject)
                    }
                })
            }
        }
        await this.setState({ languageData: sampleLangArray, categoryList: sampleCategoryArray });
        // console.log('this.state.categoryList' + this.state.categoryList);
        // console.log('this.state.languageData' + this.state.languageData);


    }

    /* send multiple Filter values   */
    sendFilterData = async () => {
        let filterData = [{
            type: 'language',
            value: [this.state.typeLanguage]
        },
        {
            type: "gender_preference",
            value: [this.state.genderSelect]
        }
        ]
        console.log('filterData' + JSON.stringify(filterData));
        if (this.state.typeLanguage == '') {
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
    clickedCheckBox = (genderIndex, genderSelect) => {
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

    render() {
        const { typeLanguage } = this.state;
        const languageData = this.findLanguage(typeLanguage);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        return (

            <Container style={styles.container}>
                <Content style={styles.bodyContent}>

                    <Card style={{ padding: 5 }}>
                        <CardItem header bordered>
                            <Text>Availability Time</Text>
                        </CardItem>
                        <CardItem >
                            <Body>
                                <Grid style={{ marginTop: 10 }}>
                                    <Row>
                                        <Col style={{ width: '60%' }}>
                                            <Text style={styles.customText}>Availability Today</Text>

                                        </Col>
                                        <Col style={{ width: '20%' }}>
                                            <Text style={styles.customText}>45 mins</Text>
                                        </Col>
                                        <Col style={{ width: '20%' }}>
                                            <Switch></Switch>
                                        </Col>
                                    </Row>
                                </Grid>
                                <Grid style={{ marginTop: 10 }}>
                                    <Row>
                                        <Col style={{ width: '60%' }}>
                                            <Text style={styles.customText}>Next 3 Days</Text>

                                        </Col>
                                        <Col style={{ width: '20%' }}>
                                            {/* <Text style={styles.customText}>45 mins</Text> */}
                                        </Col>
                                        <Col style={{ width: '20%' }}>
                                            <Switch></Switch>
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
                                placeholder="Select Degree"
                                iosIcon={<Icon name="arrow-down" />}
                                textStyle={{ color: "#5cb85c" }}
                                itemStyle={{
                                    backgroundColor: "gray",
                                    marginLeft: 0,
                                    paddingLeft: 10
                                }}
                                itemTextStyle={{ color: 'gray' }}
                                style={{ width: 25 }}
                                onValueChange={(category) => { console.log(category); this.setState({ selectedCategory: category }) }}
                                selectedValue={this.state.selectedCategory}
                            >
                                {this.state.categoryList.map((category, key) => {
                                    return <Picker.Item label={String(category)} value={String(category)} key={key}
                                    />
                                })
                                }
                            </Picker>

                        </Item>
                        <CardItem style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <Grid style={{ marginTop: 10 }}>
                                <Row>
                                    <Col style={{ width: '50%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />
                                            <Body>
                                                <Text style={styles.customText}>Dental consultation</Text>
                                            </Body>
                                        </ListItem>

                                    </Col>
                                    <Col style={{ width: '50%' }}>
                                        <ListItem noBorder>
                                            <CheckBox checked={true} />
                                            <Body>
                                                <Text style={styles.customText}>Dental consultation</Text>
                                            </Body>
                                        </ListItem>
                                    </Col>

                                </Row>

                            </Grid>

                        </CardItem>

                    </Card>
                    <Card style={{ borderRadius: 10 }}>
                        <CardItem header bordered>
                            <Text>Languages</Text>
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
                                <TouchableOpacity onPress={() => this.setState({ typeLanguage: item })}>
                                    <Text style={styles.itemText}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </Card>
                    <Card style={{ borderRadius: 10 }}>
                        <CardItem header bordered>
                            <Text>Gender</Text>
                        </CardItem>

                        <Item style={{ marginTop: 10, borderBottomWidth: 0 }}>
                            <Col>
                                <Item style={{ marginTop: 10, borderBottomWidth: 0 }}>
                                    <CheckBox color={"#775DA3"} selectedColor={"#775DA3"} style={{ marginLeft: 11 }}
                                        checked={this.state.genderPreferenceCheck[0]} onPress={() => this.clickedCheckBox(0, "M")} />
                                    <Text style={{ marginLeft: 11, color: 'gray', fontFamily: 'OpenSans' }}>Male</Text>
                                </Item></Col>
                            <Col>
                                <Item style={{ marginTop: 10, borderBottomWidth: 0 }}>
                                    <CheckBox color={"#775DA3"} selectedColor={"#775DA3"} style={{ marginLeft: 11 }}
                                        checked={this.state.genderPreferenceCheck[1]} onPress={() => this.clickedCheckBox(1, "F")} />
                                    <Text style={{ marginLeft: 11, color: 'gray', fontFamily: 'OpenSans' }}>Female</Text>
                                </Item></Col>
                            <Col>
                                <Item style={{ marginTop: 10, borderBottomWidth: 0 }}>
                                    <CheckBox color={"#775DA3"} selectedColor={"#775DA3"} style={{ marginLeft: 11 }}
                                        checked={this.state.genderPreferenceCheck[2]} onPress={() => this.clickedCheckBox(2, "O")} />
                                    <Text style={{ marginLeft: 11, color: 'gray', fontFamily: 'OpenSans' }}>Others</Text>
                                </Item></Col>
                        </Item>
                    </Card>

                    <Card style={{ borderRadius: 10 }}>
                        <CardItem header bordered>
                            <Text>Work Experience</Text>
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
                    <Button block success style={{ borderRadius: 17, marginLeft: 3 }} onPress={this.sendFilterData}>
                        <Text uppercase={false} >Submit</Text>
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
        backgroundColor: '#ffffff',
        flex: 1,
        padding: 16,
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

});