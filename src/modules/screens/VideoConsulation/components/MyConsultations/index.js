
import React, { Component } from 'react';
import { View, Text, Button, List, Icon, ListItem, DatePicker, Left, Segment, Content, CardItem, Right, Thumbnail, Item, Card, Body, Container, Toast } from "native-base";
import { StyleSheet, Platform, Image, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Spinner from '../../../../../components/Spinner';
import { NavigationEvents } from 'react-navigation';
import { renderDoctorImage, getName,toastMeassage } from '../../../../common'
import { hasLoggedIn } from "../../../../providers/auth/auth.actions";
import { POSSIBLE_VIDEO_CONSULTING_STATUS, STATUS_VALUE_DATA } from '../../constants';
import { getVideoConsuting, updateVideoConsuting,createEmrByVideoConsultation } from '../../services/video-consulting-service';
import { formatDate } from '../../../../../setup/helpers';
import { connect } from 'react-redux';
import {primaryColor} from '../../../../../setup/config';
import {translate} from '../../../../../setup/translator.helper'

export const IS_ANDROID = Platform.OS === 'android';
class VideoConsultaions extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			consultaionData: []
		}
		this.selectedData=null
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
			if (consultationReesponse.success === true) {
				this.setState({ consultaionData: consultationReesponse.data })
			}
		} catch (error) {
			console.error(error)
		} finally {
			this.setState({ isLoading: false })
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
				this.setState({ consultaionData: data });
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
				text: translate('Something went wrong: ') + error,
				duration: 3000
			})
		} finally {
			this.setState({ isLoading: false })
		}
	}
	callDoctor(videoConsulationData) {
		this.props.navigation.navigate('VideoScreen', {
			callToUser: true,
			videoConsulationData: videoConsulationData
		})
	}


	navigateToBookAppointmentPage(item) {

		let doctorId = item.doctorInfo.doctor_id;
		this.props.navigation.navigate('Book Appointment', {
			doctorId: doctorId,



			fetchAvailabiltySlots: true
		})
	}

	uploadRecords(item) {
		this.selectedData = item
			this.props.navigation.navigate('Health Records', { fromNavigation: 'VIDEO_CONSULTATION', prevState: this.props.navigation.state });
	}
	
	viewRecored(data) {
		
			this.props.navigation.navigate('Health Records', { fromNavigation: 'VIDEO_CONSULTATION', prevState: this.props.navigation.state });
	}

	backNavigation = async (navigationData) => {
		try {
			let data = this.props.navigation.getParam('emrData') || []
			if (data.length !== 0) {
				let temp = []
				data.forEach(ele => {
					temp.push({
						emr_id: ele,
						emr_update_type: "USER"
					})
				})
				let reqData = {
					consultation_id: this.selectedData.consultaion_id,
					emr_details: temp,

				}
				let result = await createEmrByVideoConsultation(reqData)
				if (result.success) {
					toastMeassage('emr upload successfully', 'success', 3000)
				}
			}
		} catch (e) {
			console.log(e)
		}
	}

	renderConsultaions(item, index) {
		const { chat: { loggedIntoConnectyCube } } = this.props;

		return (
			<Card style={styles.mainCard}>
				<Grid onPress={() => this.navigateToBookAppointmentPage(item)}>
					<Row>
						<Right>
							<Text style={styles.dateText}>{formatDate(item.consulting_date, 'DD, MMM YYYY hh:mm a')} </Text>
						</Right>
					</Row>
					<Row>

						<Col style={{ width: '80%' }}>
							<Row style={{ marginBottom: 15 }}>
								<Col size={3}>
									<TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderDoctorImage(item.doctorInfo), title: 'Profile photo' })} >
										<Thumbnail circular source={renderDoctorImage(item.doctorInfo)} style={{ height: 60, width: 60 }} />
									</TouchableOpacity>
								</Col>
								<Col size={7}>
									<Text style={styles.docNameText}>{getName(item.doctorInfo)} </Text>
									<Text note style={styles.docNameText}>Rs. {item.fee}</Text>
								</Col>
							</Row>
							{
								item.status === POSSIBLE_VIDEO_CONSULTING_STATUS.APPROVED && loggedIntoConnectyCube ?
									<Row style={{ marginLeft: '22%' }} >
										<Button primary iconLeft style={[styles.actionButton, { backgroundColor: '#08BF01' }]}
											onPress={() => this.callDoctor(item)}>
											<Icon style={{ marginTop: -5 }} name={IS_ANDROID ? 'md-call' : 'ios-call'} />
											<Text style={[styles.buttonText1, { marginLeft: -10 }]}>{translate("Call")}</Text>
										</Button>
									</Row>
									: 	item.status === POSSIBLE_VIDEO_CONSULTING_STATUS.PENDING&&!item.emr_details  ?
									<Row style={{ marginLeft: '22%' }} >
										<Button primary  style={[styles.actionButton, { backgroundColor: '#08BF01' }]}
												 onPress={() => this.uploadRecords(item)}
											>
											{/* <Icon style={{ marginTop: -5 }} name={IS_ANDROID ? 'md-call' : 'ios-call'} /> */}
											<Text style={[styles.buttonText1, { marginLeft: -10 }]}>{translate("Upload Records")}</Text>
										</Button>
										</Row> : item.emr_details ?
											<Row style={{ marginLeft: '22%' }} >
											<Button primary  style={[styles.actionButton, { backgroundColor: '#08BF01' }]}
													 onPress={() => this.viewRecored(item.emr_details )}
												>
												{/* <Icon style={{ marginTop: -5 }} name={IS_ANDROID ? 'md-call' : 'ios-call'} /> */}
												<Text style={[styles.buttonText1, { marginLeft: -10 }]}>{translate("View Records")}</Text>
											</Button>
											</Row>:
										null
							}
						</Col>
						<Col style={{ width: '20%', alignItems: 'center' }}>
							<Icon name={STATUS_VALUE_DATA[item.status].icon}
								style={{ color: STATUS_VALUE_DATA[item.status].color, fontSize: 35, alignItems: 'center', justifyContent: 'center' }}
							/>
							<Text style={[styles.buttonText1, { color: STATUS_VALUE_DATA[item.status].color }]}>{translate(STATUS_VALUE_DATA[item.status].statusText)}</Text>

						</Col>
					</Row>
					{item.consultation_description ? 
					 <View> 
				

					<Row style={{ alignItems: 'center', marginBottom: 5,marginTop:5 }}>
				
								<Text style={{
								color: STATUS_VALUE_DATA[item.status].color, fontFamily: 'Roboto',
								fontSize: 14
							}}>{translate("consultation description :")}</Text>
					</Row>
					<Row style={{ alignItems: 'center', marginBottom: 5,}}>
						<Text style={{
							color: 'grey', fontFamily: 'Roboto',
				fontSize: 14
			}}>{item.consultation_description}</Text>
	
	</Row>
				
					<Row style={{ alignItems: 'center', marginBottom: 5, justifyContent: 'center' }}>
						<Text style={[styles.statusText, { color: STATUS_VALUE_DATA[item.status].color }]}>{translate(STATUS_VALUE_DATA[item.status].text)}</Text>
					</Row>
					</View> :null}


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
					 <NavigationEvents
                  onWillFocus={payload => { this.backNavigation(payload) }}
                />


					{consultaionData.length === 0 && isLoading === false ?
						<View style={{ alignItems: 'center', justifyContent: 'center', height: 450 }}>
							<Text style={{ fontFamily: "Roboto", fontSize: 15, marginTop: "10%", textAlign: 'center' }} note>
								{translate("No Consultations")}
						</Text>
						</View> :
						<FlatList
							data={consultaionData}
							extraData={[consultaionData]}
							ref={(ref) => { this.flatListRef = ref; }}
							keyExtractor={(item, index) => index.toString()}
							renderItem={({ item, index }) =>
								this.renderConsultaions(item, index)
							} />
					}

				</Content>
			</Container>
		)
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	mainCard: {
		padding: 5,
		borderRadius: 10,
		marginBottom: 20,

	},
	dateText: {
		fontFamily: 'Roboto',
		fontSize: 12,
	},
	docNameText: {
		fontFamily: 'opensans-bold',
		fontSize: 16,
		width: '60%'
	},
	statusText: {
		fontFamily: 'opensans-bold',
		fontSize: 16,
		textAlign: 'center'
	},
	genderText: {
		fontFamily: 'Roboto',
		fontSize: 14,
		color: '#535353',
		fontStyle: 'italic',
		width: '60%'
	},
	diseaseText: {
		fontFamily: 'Roboto',
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
		fontFamily: 'opensans-bold',
		fontSize: 12,
		textAlign: 'center',
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
		borderBottomColor: primaryColor,
		borderBottomWidth: 1,
		paddingBottom: -10,
		paddingTop: -10,
		padding: 10

	},
	segText: {
		textAlign: 'center',
		fontFamily: 'Roboto',
		fontSize: 20,
		color: primaryColor,

	},
	toucableOpacity: {
		flexDirection: 'row',
		backgroundColor: primaryColor,
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
		fontFamily: 'opensans-bold',
		color: '#FFF',
		fontSize: 18,
	},





	buttonText: {
		fontFamily: 'opensans-bold',
		fontSize: 12,
		textAlign: 'center',
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
		fontFamily: 'Roboto',
		fontSize: 14,
		marginLeft: 15,
		width: "80%"
	},
	hosAddressText: {
		fontFamily: 'Roboto',
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
		fontFamily: 'opensans-bold',
		fontSize: 16,
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
function homeState(state) {
	return {
		chat: state.chat,
	}
}
export default connect(homeState)(VideoConsultaions)

