
import React, { Component } from 'react';
import { View, Text, Button, List, Icon, ListItem, DatePicker, Left, Segment, Content, CardItem, Right, Thumbnail, Item, Card, Body, Container, Toast } from "native-base";
import { StyleSheet, Platform, Image, AsyncStorage, FlatList,TouchableOpacity, ScrollView } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import Spinner from '../../../../../components/Spinner';
import { renderDoctorImage, getName } from '../../../../common'
import { hasLoggedIn } from "../../../../providers/auth/auth.actions";
import {POSSIBLE_VIDEO_CONSULTING_STATUS, STATUS_VALUE_DATA } from '../../constants';
import { getVideoConsuting, updateVideoConsuting } from '../../services/video-consulting-service';
export const IS_ANDROID = Platform.OS === 'android';
class VideoConsultaions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            consultaionData: []
        }
    }
    async componentDidMount() {
        try {
			const isLoggedIn = await hasLoggedIn(this.props);
    		 if (!isLoggedIn) {
        		this.props.navigation.navigate("login");
        	    return;
    		}
            const userId = await AsyncStorage.getItem('userId');
            const consultationReesponse = await getVideoConsuting(userId)
            if(consultationReesponse.success === true) {
                this.setState({consultaionData : consultationReesponse.data})
            }
        } catch (error) {
            console.error(error)    
        } finally {
            this.setState({ isLoading : false })
        }
       
    }
    async doAccept(item, updatedStatus, index, updatedStatusReason) {
        try {
              
            this.setState({ isLoading: true });
            let requestData = {
				doctor_id: item.doctorInfo.doctor_id,
				user_id: item.userInfo.user_id,
				status: updatedStatus,
				statusUpdateReason: updatedStatusReason || ' ',
				status_by: 'USER',
			};
			let resp = await updateVideoConsuting(item.consultaion_id, requestData);
		
			if (resp.success) {
				this.setState({ isLoading: false });
                let data = this.state.consultaionData;
                data[index].status = updatedStatus
                this.setState({ consultaionData: data});
				Toast.show({
					text: resp.message,
					duration: 3000
				})
			} else {
				Toast.show({
					text: resp.message,
					duration: 3000
				})
            }
        } catch (error) {
            Toast.show({
                text:'Something went wrong: ' + error,
                duration: 3000
            })
        } finally {
            this.setState({ isLoading: false })
        }		
    }
    
    renderConsultaions(item, index) {
        return (
            <Card style={styles.mainCard}>
                <Grid>
                    <Row>
                  <Col style={{ width: '80%' }}>  
					<Row style={{ marginBottom : 15 }}>
                        <Col size={3}>
						    <Thumbnail circular source={renderDoctorImage(item.doctorInfo)} style={{ height: 60, width: 60 }} />
						</Col>
                        <Col size={7}>
                            <Text style={styles.docNameText}>{getName(item.userInfo)} </Text>
                            <Text note style={styles.docNameText}>Rs. {item.fee}</Text>
                        </Col>
                    </Row>
                        {/* {item.status === POSSIBLE_VIDEO_CONSULTING_STATUS.PENDING ?
                            <Row style={{ marginLeft: '22%' }} >
                           
                                <Button iconLeft style={[styles.actionButton, { backgroundColor: '#08BF01'  }]} 
                                     onPress={() => this.doAccept(item, POSSIBLE_VIDEO_CONSULTING_STATUS.APPROVED, index)}>
								     <Icon style={{ marginTop: -5 }} name={IS_ANDROID ? 'md-checkmark-circle' : 'ios-checkmark-circle' }  />
                                    <Text style={[styles.buttonText1, {  marginLeft: -10 }]}>Approve</Text>
							    </Button>
                                <Button style={[styles.actionButtonCancel, { marginLeft: 20 }]} 
                                     onPress={() => this.doAccept(item, POSSIBLE_VIDEO_CONSULTING_STATUS.REJECTED, index)}>
                                          <Icon style={{ marginTop: -5 }} name={IS_ANDROID ? 'md-close-circle' : 'ios-close-circle' }  />
								    <Text style={[styles.buttonText1,  { marginLeft: -25 }]}>Reject</Text>
							    </Button>
						    </Row>
                        : 
                        item.status === POSSIBLE_VIDEO_CONSULTING_STATUS.APPROVED ? 
                            <Row style={{ marginLeft: '22%' }} >
                                <Button primary iconLeft style={[styles.actionButton, { backgroundColor: '#08BF01'  }]} 
                                     onPress={() => this.callUser(item)}>
								    <Icon style={{ marginTop: -5}} name={IS_ANDROID ? 'md-call' : 'ios-call' }  />
                                    <Text style={[styles.buttonText1, {  marginLeft: -10  }]}>Call</Text>
							    </Button>
                                <Button primary iconLeft style={[styles.actionButton, { marginLeft: 20 }]} 
                                     onPress={() => this.doAccept(item, POSSIBLE_VIDEO_CONSULTING_STATUS.COMPLETED, index)}>
								    <Icon style={{ marginTop: -5, fontWeight: 'bold' }} name={IS_ANDROID ? 'md-cloud-done' : 'ios-cloud-done' }  />
                                    <Text style={[styles.buttonText1,{ marginLeft: -12 } ] }>Complete</Text>
							    </Button>
                            </Row>
                        : null    
                        }  */}
                    </Col>
                    <Col style={{ width: '20%', alignItems: 'center' }}>
                        <Icon name={STATUS_VALUE_DATA[item.status].icon} 
                              style={{ color: STATUS_VALUE_DATA[item.status].color, fontSize: 35, alignItems: 'center', justifyContent: 'center' }} 
                        />
                        <Text style={[styles.buttonText1, { color: STATUS_VALUE_DATA[item.status].color }]}>{STATUS_VALUE_DATA[item.status].statusText}</Text>
                    
                    </Col>
                    </Row>
                    <Row style={{alignItems:'center',marginBottom:5,justifyContent:'center'}}>
                        <Text style={[styles.statusText, {color: STATUS_VALUE_DATA[item.status].color }]}>{STATUS_VALUE_DATA[item.status].text}</Text> 
                    </Row>
                    
                </Grid>
            </Card>
        )
    }
    render() {
        const { isLoading, consultaionData } = this.state; 
        return (
            <Container style={styles.container}>
                <Content style={{ padding: 10 }}>
                <Spinner
					visible={isLoading} 
                />

                {consultaionData.length === 0 && isLoading === false ?
					<View style={{ alignItems: 'center', justifyContent: 'center', height: 450 }}>
						<Text style={{ fontFamily: "OpenSans", fontSize: 15, marginTop: "10%", textAlign: 'center' }} note>
							No Consultations
						</Text>
                    </View> : 
                	<FlatList
                        data={consultaionData}
                        extraData={[consultaionData]}
                        ref={(ref) => { this.flatListRef = ref; }}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) =>
                            this.renderConsultaions(item, index)
                    }/>
                }

                </Content>
            </Container>
        )
    }
} 
const styles = StyleSheet.create({
    container: {
        flex:1
    },
    mainCard: {
        padding: 5,
		borderRadius: 10,
		marginBottom: 20,
		
    },
    docNameText: {
		fontFamily: 'OpenSans',
		fontSize: 16,
		fontWeight: 'bold',
		width: '60%'
    },
    statusText: {
		fontFamily: 'OpenSans',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign:'center'
	},
	genderText: {
		fontFamily: 'OpenSans',
		fontSize: 14,
		color: '#535353',
		fontStyle: 'italic',
		width: '60%'
	},
    diseaseText: {
		fontFamily: 'OpenSans',
		fontSize: 14,
		marginLeft: 10,
		fontStyle: 'italic',
		marginTop: -5
    },
    actionButton: {
       borderRadius: 3,
        height: 30,
		backgroundColor: '#08BF01',
		justifyContent: 'center'
    },
    actionButtonCancel: {
        borderRadius: 3,
         height: 30,
         backgroundColor: '#ff0000',
         justifyContent: 'center'
     },
    buttonText1: {
		fontFamily: 'OpenSans',
		fontSize: 12,
		textAlign: 'center',
		fontWeight: 'bold',
		color: '#fff',
		
    },





    segButton: {
		justifyContent: 'center',
		paddingBottom: -10,
		paddingTop: -10,
		padding: 10
	},
	segButtonActive: {
		justifyContent: 'center',
		borderBottomColor: '#784EBC',
		borderBottomWidth: 1,
		paddingBottom: -10,
		paddingTop: -10,
		padding: 10

	},
	segText: {
		textAlign: 'center',
		fontFamily: 'OpenSans',
		fontSize: 20,
		color: '#784EBC',

	},
	toucableOpacity: {
		flexDirection: 'row',
		backgroundColor: '#784EBC',
		paddingLeft: 15,
		paddingRight: 15,
		justifyContent: 'center',
		borderRadius: 10,
		shadowOffset: { width: 0, height: 0, },
		shadowColor: '#EBEBEB',
		shadowOpacity: 1.0,
	},
	tocuhIcon: {
		padding: 5,
		color: '#FFF'
	},
	tochText: {
		marginTop: 7,
		fontFamily: 'OpenSans',
		color: '#FFF',
		fontSize: 18,
		fontWeight: 'bold'
	},
	
	
	

	
	buttonText: {
		fontFamily: 'OpenSans',
		fontSize: 12,
		textAlign: 'center',
		fontWeight: 'bold',
		color: '#fff',
		marginLeft: -25
	},
	buttonIcon: {
		fontSize: 35,
		marginTop: -4,
	},
	buttonIcon1: {
		fontSize: 20,

	},
	hospitalText: {
		fontFamily: 'OpenSans',
		fontSize: 14,
		marginLeft: 15,
		width: "80%"
	},
	hosAddressText: {
		fontFamily: 'OpenSans',
		fontSize: 14,
		marginLeft: 15,
		fontStyle: 'italic',
		width: "80%"
	},
	cardItem: {
		backgroundColor: '#03BF01',
		marginLeft: -9,
		marginBottom: -10,
		marginRight: -9,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		justifyContent: 'center',
		height: 40,
		marginTop: 10
	},
	pastCardItem: {
		backgroundColor: '#DA0000',
		marginLeft: -9,
		marginBottom: -10,
		marginRight: -9,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		justifyContent: 'center',
		height: 40,
		marginTop: 10
	},

	cardItemText: {
		fontFamily: 'OpenSans',
		fontSize: 16,
		fontWeight: 'bold',
		color: '#FFF'
	},
	containers: {
		flex: 1,
		justifyContent: "center"
	},
	horizontal: {
		flexDirection: "column",
		justifyContent: "center",
		padding: 10
	},
	
})
  
export default VideoConsultaions;
