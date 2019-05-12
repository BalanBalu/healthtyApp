import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Card, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ScrollView, ProgressBar ,Item} from 'native-base';
import { userProfile} from '../../providers/profile/profile.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { dateDiff } from '../../../setup/helpers';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, AsyncStorage} from 'react-native';
import StarRating from 'react-native-star-rating';
import { FlatList } from 'react-native-gesture-handler';
import { Loader } from '../../../components/ContentLoader'

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
           data:{},
           starCount: 3.5,
           userId:'',
           bookedAppointments: [1,2,3]
        }; 
        this.getUserProfile();
      }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

      getUserProfile= async () => {
        try { 
         let fields = "first_name,last_name,gender,dob,mobile_no,secondary_mobiles,email,secondary_emails,insurance,address,is_blood_donor,is_available_blood_donate,blood_group"         
         let userId=await AsyncStorage.getItem('userId');
         console.log(this.state.userId);
         let result = await userProfile(userId,fields);          
         console.log(this.props.profile.success);      
         if(this.props.profile.success) {
            this.setState({ data: result});
         }   

        } 
        catch (e) {
          console.log(e);
        }    
      }

    render() {
        const { profile : { isLoading } } = this.props;
        const {data } = this.state;
        return (

            <Container style={styles.container}>
                {isLoading ? 
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
                                <Col style={{ width: '40%' }}>
                                    <Thumbnail style={styles.profileImage} source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} />
                                    <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontFamily: 'opensans-regular', backgroundColor: '#fff', borderRadius: 20, padding: 10, marginTop: 5 }}>{data.first_name +" "+ data.last_name}</Text>
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
                                <Text note style={styles.bottomValue}> {dateDiff(data.dob, new Date(),'years')}  </Text>
                            </Col>

                            <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={styles.topValue}>Sex </Text>
                                <Text note style={styles.bottomValue}>{data.gender} </Text>
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
                            <Body>
                                <Text style={styles.customText}>Email</Text>
                                <Text note style={styles.customText}>{data.email}</Text>
                                <Text note style={styles.customText}>{data.secondary_emails && data.secondary_emails[0].email_id}</Text>
                            </Body>
                            <Right>
                                <Icon name="create"></Icon>
                            </Right>
                        </ListItem>



                        <ListItem avatar>
                            <Left>
                                <Icon name="locate" style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                             {data.address ? 
                                  <Body>
                                    <Text style={styles.customText}>Address</Text>
                                    <Text note style={styles.customText}>{data.address && data.address.address.no_and_street}</Text>
                                    <Text note style={styles.customText}>{data.address && data.address.address.address_line_1} </Text>
                                    <Text note style={styles.customText}>{data.address && data.address.address.address_line_2}</Text>
                                    <Text note style={styles.customText}>{data.address && data.address.address.city}</Text>
                                    <Text note style={styles.customText}>{data.address && data.address.address.pin_code}</Text>
                                  </Body>  
                               :
                                <Button transparent>
                                 <Icon name='add' style={{ color: 'gray' }} />
                                  <Text uppercase={false} style={styles.customText}>Add your Address</Text>
                                </Button> }
                                {data.address ? 
                                <Right>
                                    <Icon name="create"></Icon>
                                </Right> : null }
                           
                        </ListItem>
                    
                      <ListItem avatar>
                      
                            <Left>
                                <Icon name="call" style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                            
                                <Body>
                                    <Text style={styles.customText}>Contact</Text>
                                    <Text note style={styles.customText}>{data.mobile_no}</Text>  
                                    <FlatList
                                      data={this.state.data.secondary_mobiles}
                                      renderItem={({ item })=>(  
                                      <List>                        
                                        <Text note style={styles.customText}>{item.type}</Text>                                  
                                        <Text note style={styles.customText}>{item.number}</Text> 
                                      </List>
                                     )}
                                     keyExtractor={(item, index) => index.toString()}
                                    />            
                                </Body>
                              
                             <Right>
                                <Icon name="create"></Icon>
                             </Right>
                              
                            
                        </ListItem>
                       
                        <ListItem avatar>
                            <Left>
                                <Icon name="flame" style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                            <Body>
                                <Text style={styles.customText}>Insurance</Text>
                                <Text note style={styles.customText}> {data.insurance && data.insurance[0].insurance_no} </Text>
                                <Text note style={styles.customText}> {data.insurance && data.insurance[0].insurance_provider} </Text>
                            </Body>
                            <Right>
                                <Icon name="create"></Icon>
                            </Right>
                        </ListItem>



                        <ListItem avatar>
                            <Left>
                                <Icon name="briefcase" style={{ color: '#7E49C3' }}></Icon>
                            </Left>
                            <Body>
                                <Text style={styles.customText}>Change Password</Text>
                                <Text note style={styles.customText}>Change Password</Text>

                            </Body>
                            <Right>
                                <Icon name="create"></Icon>
                            </Right>
                        </ListItem>

                    </List>


                    <List>
                        <Text style={styles.titleText}>Your Doctors</Text>


                      <FlatList
                        data={this.state.bookedAppointments}
                        renderItem={({ item }) => (
                       <ListItem avatar noBorder>
                            <Left>
                                <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 40, width: 40 }} />
                            </Left>
                            <Body>
                                <Text> {data.first_name +" "+ data.last_name} </Text>

                                <Text note>{data.address && data.address.address_line_2_}</Text>

                            </Body>
                            <Right>
                                <Button style={styles.docbutton}><Text style={{ fontFamily: 'opensans-regular', fontSize: 12 }}> Book Again</Text></Button>
                            </Right>

                        </ListItem>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        />

                       
                    </List>


                </Content> }
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
        fontFamily: 'opensans-regular',
    },
    customText:
    {

        fontFamily: 'opensans-regular',
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
        fontFamily: 'opensans-regular',

    },
    topValue: {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'opensans-regular',
    },
    bottomValue:
    {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'opensans-regular',
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
        fontFamily: 'opensans-regular',

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
    }


});

