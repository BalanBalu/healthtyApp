import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Card, List, ListItem, View, Left, Right, Toast, Thumbnail, Body, Icon, locations, ProgressBar, Item, Radio } from 'native-base';
import { fetchUserProfile, storeBasicProfile } from '../../providers/profile/profile.action';
import { getPatientWishList } from '../../providers/bookappointment/bookappointment.action';
import { hasLoggedIn, userFiledsUpdate } from '../../providers/auth/auth.actions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { dateDiff } from '../../../setup/helpers';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, AsyncStorage, TouchableOpacity, FlatList } from 'react-native';
import Modal from "react-native-modal";
import { NavigationEvents } from 'react-navigation';
import { Loader } from '../../../components/ContentLoader'
import ImagePicker from 'react-native-image-picker';
import { uploadMultiPart } from '../../../setup/services/httpservices'
import { renderDoctorImage, renderProfileImage } from '../../common';

class Profile extends Component {

    navigation = this.props.navigation;
    constructor(props) {

        super(props);
        this.state = {
            data: {},
            starCount: 3.5,
            userId: '',
            modalVisible: false,
            favouriteList: [],
            imageSource: null,
            file_name: '',
            isLoading: false,
        };

    }
    async componentDidMount() {

        const isLoggedIn = await hasLoggedIn(this.props);
        if (!isLoggedIn) {
            this.props.navigation.navigate('login');
            return
        }
        this.getUserProfile();
        this.getfavouritesList();

    }
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    /*Get userProfile*/
    getUserProfile = async () => {
        try {
            let fields = "first_name,last_name,gender,dob,mobile_no,secondary_mobile,email,secondary_email,insurance,address,is_blood_donor,is_available_blood_donate,blood_group,profile_image"

            let userId = await AsyncStorage.getItem('userId');
            let result = await fetchUserProfile(userId, fields);

            if (result) {
                this.setState({ data: result });
                storeBasicProfile(result);

                if (result.profile_image) {
                    this.setState({ imageSource: result.profile_image.imageURL });
                }
            }

        }
        catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    getfavouritesList = async () => {
        try {
            let userId = await AsyncStorage.getItem('userId');
            let result = await getPatientWishList(userId);
            if (result.success) {
                this.setState({ favouriteList: result.data });
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    editProfile(screen) {
        this.props.navigation.navigate(screen, { screen: screen, fromProfile: true, updatedata: this.state.data || '' })
    }

    editAddress(address) {
        if (address === null) {
            this.editProfile('MapBox')
        }
        else {
            let locationAndContext = location(address.address);
            let latLng = address.coordinates;
            let addrressData = {
                center: [latLng[1], latLng[0]],
                place_name: locationAndContext.placeName,
                context: locationAndContext.context
            }
            this.props.navigation.navigate('MapBox', {
                locationData: addrressData,
                fromProfile: true,
                mapEdit: true
            });

            function location(locationObj) {
                let placeName = '';
                let contextData = [];
                Object.keys(locationObj).forEach(keyEle => {
                    let obj = {
                        "text": locationObj[keyEle]
                    };
                    switch (keyEle) {
                        case 'no_and_street':
                            obj.id = 'locality.123';
                            break;
                        case 'city':
                            obj.id = 'place.123';
                            break;
                        case 'district':
                            obj.id = 'district.123';
                            break;
                        case 'state':
                            obj.id = 'region.123';
                            break;
                        case 'country':
                            obj.id = 'country.123';
                            break;
                        case 'pin_code':
                            obj.id = 'pin_code.123';
                            break;
                    }
                    contextData.push(obj);
                    placeName += locationObj[keyEle] + ', ';
                });

                return {
                    placeName: placeName.slice(0, -2),
                    context: contextData
                }

            }
        }
    }
    /*Upload profile pic*/
    selectPhotoTapped() {

        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                console.log("response is running")
                let source = { uri: response.uri };

                this.setState({
                    imageSource: source.uri,

                });
                this.uploadImageToServer(response.uri);

            }
        });
    }

    /*Store image into api folder*/
    uploadImageToServer = async (imagePath) => {
        try {
            console.log("Image uploading");
            const userId = await AsyncStorage.getItem('userId')

            var formData = new FormData();
            formData.append('profile', {
                uri: imagePath,
                type: 'image/jpeg',
                name: 'photo.jpg'
            });
            debugger
            let endPoint = `user/${userId}/upload/profile`
            var res = await uploadMultiPart(endPoint, formData);
            const response = res.data;
            if (response.success) {
                this.setState({
                    imageSource: imagePath
                });

            } else {
                Toast.show({
                    text: 'Problem Uploading Profile Picture',
                    duration: 3000,
                    type: 'danger'
                });
            }
        } catch (e) {
            Toast.show({
                text: 'Problem Uploading Profile Picture' + e,
                duration: 3000,
                type: 'danger'
            });
            console.log(e);
        }
    }
    render() {
        const { profile: { isLoading } } = this.props;
        const { data, imageSource } = this.state;
        return (

            <Container style={styles.container}>

                <NavigationEvents
                    onWillFocus={payload => { this.getUserProfile(payload) }}
                />


                {this.state.isLoading ?
                    <Loader style={'profile'} /> :

                    <Content style={styles.bodyContent}>


                        <LinearGradient colors={['#7E49C3', '#C86DD7']} style={{ height: 180 }}>
                            <Grid>
                                <Row>
                                    <Col style={{ width: '10%' }}>
                                    </Col>
                                    <Col style={styles.customCol}>
                                        <Icon name="heart" style={styles.profileIcon}></Icon>
                                    </Col>
                                    <Col style={{ width: '55%' }} >
                                        {imageSource != undefined ?
                                            <Thumbnail style={styles.profileImage} source={{ uri: imageSource }} /> :
                                            <Thumbnail style={styles.profileImage} square source={renderProfileImage(data)} />
                                        }

                                        <View style={{ marginLeft: 80, marginTop: -20, justifyContent: 'center' }}>
                                            <Icon name="camera" style={{ fontSize: 20 }} onPress={() => this.selectPhotoTapped()} testID="cameraIconTapped" />
                                        </View>

                                        <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 30 }}>
                                            <Text style={styles.nameStyle} onPress={() => this.editProfile('UpdateUserDetails')}>{data.first_name ? data.first_name + " " : ''}<Text style={styles.nameStyle}>{data.last_name ? data.last_name : ''}</Text>
                                            </Text>



                                            <Icon name="create" style={{ fontSize: 20, marginTop: 10, marginLeft: 25 }} onPress={() => this.editProfile('UpdateUserDetails')} />

                                        </View>
                                    </Col>
                                    <Col style={styles.customCol}>
                                        <Icon name="heart" style={styles.profileIcon}></Icon>
                                    </Col>
                                    <Col style={{ width: '10%' }}>
                                    </Col>
                                </Row>

                            </Grid>
                        </LinearGradient>
                        <Card>
                            <Grid style={{ padding: 10 }}>
                                <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                                    <Text style={styles.topValue}> Age </Text>
                                    <Text note style={styles.bottomValue}> {dateDiff(data.dob, new Date(), 'years')}  </Text>
                                </Col>

                                <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.topValue}>Gender </Text>

                                    </View>
                                    <Text note style={styles.bottomValue}>{data.gender === 'M' ? 'Male' : data.gender === 'F' ? 'Female' : data.gender === 'O' ? 'Others' : null} </Text>

                                </Col>

                                <Col style={{ backgroundColor: 'transparent', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                                    <Text style={styles.topValue}>Blood</Text>
                                    <Text note style={styles.bottomValue}> {data.blood_group} </Text>
                                </Col>
                            </Grid>
                        </Card>
                        <List>
                            <Text style={styles.titleText}>Personal details..</Text>

                            <ListItem avatar>

                                <Left>
                                    <Icon name="mail" style={{ color: '#7E49C3' }}></Icon>
                                </Left>


                                <Body >
                                    <TouchableOpacity onPress={() => this.editProfile('UpdateEmail')} testID="onPressEmail">
                                        <Text style={styles.customText}>Email</Text>
                                        <Text note style={styles.customText1}>{data.email}</Text>
                                        {data.secondary_email != undefined ? <Text note style={styles.customText1}>{data.secondary_email}</Text>

                                            : <Button transparent>
                                                <Icon name='add' style={{ color: 'gray' }} />
                                                <Text uppercase={false} style={styles.customText} onPress={() => this.editProfile('UpdateEmail')} testID="onPressAddSecondaryEmail">Add Secondary email</Text>
                                            </Button>}
                                    </TouchableOpacity>
                                </Body>


                                {data.secondary_email != undefined ?

                                    <Right>
                                        <Icon name="create" style={{ color: 'black' }} onPress={() => this.editProfile('UpdateEmail')} testID="iconToUpdateEmail" />
                                    </Right> : null}

                            </ListItem>


                            <ListItem avatar>

                                <Left>
                                    <Icon name="locate" style={{ color: '#7E49C3' }} />
                                </Left>

                                <Body>
                                    <TouchableOpacity onPress={() => this.editAddress(data.address)} testID="onPressAddress">
                                        <Text style={styles.customText}>Address</Text>
                                        {data.address ?
                                            <View>
                                                <Text note style={styles.customText1}>{data.address.address.no_and_street + ','}
                                                    <Text note style={styles.customText1}>{data.address.address.address_line_1 ? data.address.address.address_line_1 : " "}</Text></Text>
                                                <Text note style={styles.customText1}>{data.address.address.district + ', '
                                                    + data.address.address.city}</Text>
                                                <Text note style={styles.customText1}>{data.address.address.state + ', '
                                                    + data.address.address.country}</Text>
                                                <Text note style={styles.customText1}>{data.address.address.pin_code}</Text>
                                            </View> :
                                            <Button transparent onPress={() => this.editProfile('MapBox')}>
                                                <Icon name='add' style={{ color: 'gray' }} />
                                                <Text uppercase={false} style={styles.customText}>Add Address</Text>
                                            </Button>}
                                    </TouchableOpacity>
                                </Body>
                                {data.address ?
                                    <Right>
                                        <Icon name="create" style={{ color: 'black' }} onPress={() => this.editAddress(data.address)} testID="iconToUpdateAddress" />
                                    </Right>
                                    : null}

                            </ListItem>



                            <ListItem avatar>

                                <Left>
                                    <Icon name="call" style={{ color: '#7E49C3' }}></Icon>
                                </Left>

                                <Body>
                                    <TouchableOpacity onPress={() => this.editProfile('UpdateContact')} testID="onPressUpdateContact">
                                        <Text style={styles.customText}>Contact</Text>
                                        <Text note style={styles.customText1}>{data.mobile_no}</Text>
                                        {data.secondary_mobile !== '' ?
                                            <Col>
                                                <Text style={styles.customText}>Secondary</Text>
                                                <Text note style={styles.customText1}>{data.secondary_mobile}</Text>

                                            </Col>

                                            : <Button transparent>
                                                <Icon name='add' style={{ color: 'gray' }} />
                                                <Text uppercase={false} style={styles.customText} onPress={() => this.editProfile('UpdateContact')} testID="onPressAddContactNumber">Add Contact Number</Text>
                                            </Button>}
                                    </TouchableOpacity>
                                </Body>
                                {data.secondary_mobile != undefined ?
                                    <Right>
                                        <Icon name="create" style={{ color: 'black' }} onPress={() => this.editProfile('UpdateContact')} testID="iconToUpdateContact"></Icon>
                                    </Right> : null}


                            </ListItem>

                            <ListItem avatar>
                                <Left>
                                    <Icon name='heartbeat' type='FontAwesome' style={{ color: '#7E49C3' }}></Icon>
                                </Left>
                                <Body>
                                    <TouchableOpacity onPress={() => this.editProfile('UpdateInsurance')} testID="onPressUpdateInsurance">
                                        <Text style={styles.customText}>Insurance</Text>
                                        {data.insurance != undefined ?

                                            <FlatList
                                                data={this.state.data.insurance}
                                                renderItem={({ item }) => (
                                                    <List>
                                                        <Text note style={styles.customText1}>{item.insurance_no}</Text>
                                                        <Text note style={styles.customText1}>{item.insurance_provider}</Text>
                                                    </List>
                                                )}
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                            : <Button transparent>
                                                <Icon name='add' style={{ color: 'gray' }} />
                                                <Text uppercase={false} style={styles.customText} onPress={() => this.editProfile('UpdateInsurance')} testID="clickAddInsuranceText">Add Insurance</Text>
                                            </Button>}
                                    </TouchableOpacity>
                                </Body>

                                {data.insurance != undefined ?
                                    <Right>
                                        <Icon name="create" style={{ color: 'black' }} onPress={() => this.editProfile('UpdateInsurance')} testID="iconToEditUpdateInsurance"></Icon>
                                    </Right> : null}

                            </ListItem>



                            <ListItem avatar>
                                <Left>
                                    <Icon name="briefcase" style={{ color: '#7E49C3' }}></Icon>
                                </Left>
                                <Body>
                                    <TouchableOpacity onPress={() => this.editProfile('UpdatePassword')} testID="onPressUpdatePassword">
                                        <Text style={styles.customText}>Change Password</Text>
                                        <Text note style={styles.customText1}>*********</Text>
                                    </TouchableOpacity>
                                </Body>
                                <Right>
                                    <Icon name="create" style={{ color: 'black' }} onPress={() => this.editProfile('UpdatePassword')} testID="iconToUpdatePassword"></Icon>
                                </Right>
                            </ListItem>

                        </List>

                        {this.state.favouriteList.length === 0 ? null :
                            <Card style={{ padding: 10 }}>

                                <List>
                                    <Text style={styles.titleText}>Your Doctors</Text>


                                    <FlatList
                                        data={this.state.favouriteList}
                                        renderItem={({ item }) => (
                                            <ListItem avatar noBorder>
                                                <Left>
                                                    <Thumbnail square source={renderDoctorImage(item.doctorInfo)} style={{ height: 60, width: 60 }} />
                                                </Left>
                                                <Body>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 15, width: '100%' }}> {item.doctorInfo.prefix ? item.doctorInfo.prefix : 'Dr.'} {item.doctorInfo.first_name + " " + item.doctorInfo.last_name} </Text>
                                                </Body>
                                                <Right>
                                                    <Button style={styles.docbutton}><Text style={{ fontFamily: 'OpenSans', fontSize: 12 }} onPress={() => this.props.navigation.navigate('Book Appointment', { doctorId: item.doctorInfo.doctor_id, fetchAvailabiltySlots: true })} testID="navigateBookAppointment"> Book Again</Text></Button>
                                                </Right>

                                            </ListItem>
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </List>
                            </Card>}
                    </Content>}


            </Container>

        )
    }

}

function profileState(state) {

    return {
        profile: state.profile
    }
}
export default connect(profileState)(Profile)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {

    },

    customHead:
    {
        fontFamily: 'OpenSans',
    },
    customText:
    {
        fontSize: 15,
        fontFamily: 'OpenSans',
    },
    customText1:
    {
        fontSize: 13,
        fontFamily: 'OpenSans',
    },
    logo: {
        height: 80,
        width: 80,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },

    customCard: {
        borderRadius: 20,
        padding: 10,
        marginTop: -100,
        marginLeft: 20,
        marginRight: 20,
        fontFamily: 'OpenSans',

    },
    topValue: {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'OpenSans',
        fontSize: 15
    },
    bottomValue:
    {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'OpenSans',
        fontSize: 13
    },
    updateButton:
    {
        height: 30,
        width: 'auto',
        borderRadius: 10,
        textAlign: 'center',
        color: 'white',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 12,
        marginLeft: 80

    },

    titleText: {
        fontSize: 15,
        padding: 5,
        margin: 10,
        backgroundColor: '#FF9500',
        borderRadius: 20,
        color: 'white',
        width: 150,
        textAlign: 'center',
        fontFamily: 'OpenSans',

    },
    docbutton: {
        height: 35,
        width: "auto",
        borderRadius: 20,
        backgroundColor: '#7357A2',
        marginTop: 5

    },
    profileIcon:
    {
        color: '#fff',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        fontSize: 35,

    },
    profileImage:
    {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 25,
        height: 80,
        width: 80,
        borderColor: '#f5f5f5',
        borderWidth: 2,
        borderRadius: 50
    }, customCol:
    {
        width: '20%',

        borderRadius: 25,
        borderColor: '#fff',
        height: 50, width: 50,
        backgroundColor: '#C86DD7',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    ImageContainer: {
        borderRadius: 10,
        width: 250,
        height: 250,
        borderColor: '#9B9B9B',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CDDC39',

    },
    nameStyle: {
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 5,
        fontFamily: 'OpenSans',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 5,
        width: '100%',
        textAlign: 'center',
        fontSize: 15
    }

});


