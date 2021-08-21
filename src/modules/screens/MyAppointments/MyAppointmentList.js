import React, { Component } from "react";
import { View, Text, Button, List, ListItem, Left, Right, Thumbnail, Item, Card, Body } from "native-base";
import { StyleSheet, Image, FlatList, ScrollView, ActivityIndicator, Modal, TouchableOpacity, TouchableHighlight } from "react-native";
import StarRating from "react-native-star-rating";
import { Col, Row, Grid } from "react-native-easy-grid";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { NavigationEvents } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { userReviews } from "../../providers/profile/profile.action";
import { hasLoggedIn } from "../../providers/auth/auth.actions";
import { formatDate, addTimeUnit, subTimeUnit, getAllId, statusValue } from "../../../setup/helpers";
import { getAppointmentByMemberId, viewUserReviews, getMultipleDoctorDetails } from "../../providers/bookappointment/bookappointment.action";
import noAppointmentImage from "../../../../assets/images/noappointment.png";
import Spinner from "../../../components/Spinner";
import { renderDoctorImage, getAllEducation, getAllSpecialist, getName, getDoctorEducation, getHospitalName, getDoctorNameOrHospitalName, toastMeassage } from '../../common'
import moment from "moment";
import InsertReview from '../Reviews/InsertReview';
import { translate } from "../../../setup/translator.helper"
import {primaryColor, secondaryColor} from '../../../setup/config'

class MyAppoinmentList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			isLoading: false,
			selectedIndex: 0,
			upComingData: [],
			pastData: [],
			memberId: null,

			isRefreshing: false,
			isNavigation: true,
			modalVisible: false,
			reviewData: {},
			reviewIndex: -1,
			skip: 0,
			limit: 10

		};
		this.onEndReachedCalledDuringMomentum = true;
	}

	async componentDidMount() {
		await this.setState({ isLoading: true })
		const isLoggedIn = await hasLoggedIn(this.props);
		if (!isLoggedIn) {
			this.props.navigation.navigate("login");
			return;
		}
		let memberId = await AsyncStorage.getItem("memberId");
		this.setState({
			memberId
		});
		await this.upCommingAppointment(),


			await this.setState({
				isLoading: false,
				isNavigation: false
			})

	}

	backNavigation = async (navigationData) => {
		const { pastData, skip, limit } = this.state;
		if (!this.state.isNavigation) {
			if (navigationData.action) {
				await this.setState({
					isLoading: true
				})

				if (navigationData.action.type === 'Navigation/BACK' || navigationData.action.type === 'Navigation/NAVIGATE' || navigationData.action.type === 'Navigation/POP') {

					if (navigationData.lastState && navigationData.lastState.params && navigationData.lastState.params.refreshPage) {
						if (this.state.selectedIndex == 0) {
							await this.setState({ upComingData: [], skip: 0 })
							await this.upCommingAppointment();

						} else {

							await this.setState({ pastData: [], skip: 0 })
							await this.pastAppointment();

						}
					}
				}
				await this.setState({
					isLoading: false
				})
			}
		}
	}

	upCommingAppointment = async () => {
		try {
			// this.setState({ isLoading: true })
			let memberId = await AsyncStorage.getItem("memberId");
			let tempData = this.state.upComingData
			let filters = {
				startDate: new Date().toUTCString(),
				endDate: addTimeUnit(new Date(), 1, "years").toUTCString(),
				// skip: this.state.skip,
				// limit: this.state.limit,
				// sort: 1


			};
			let upCommingAppointmentResult = await getAppointmentByMemberId(memberId, filters);
			if (upCommingAppointmentResult) {
			tempData=upCommingAppointmentResult
			}

			// if (upCommingAppointmentResult.success) {
			// 	let doctorInfo = new Map();
			// 	upCommingAppointmentResult = upCommingAppointmentResult.data;

			// 	let doctorIds = getAllId(upCommingAppointmentResult)
			// 	if (doctorIds) {
			// 		let speciallistResult = await getMultipleDoctorDetails(doctorIds, "specialist,education,prefix,profile_image,gender");

			// 		speciallistResult.data.forEach(doctorData => {
			// 			let educationDetails = ' ';
			// 			let speaciallistDetails = '';

			// 			if (doctorData.education != undefined) {
			// 				educationDetails = getAllEducation(doctorData.education)
			// 			}
			// 			if (doctorData.specialist != undefined) {
			// 				speaciallistDetails = getAllSpecialist(doctorData.specialist)
			// 			}

			// 			doctorInfo.set(doctorData.doctor_id, {
			// 				degree: educationDetails,
			// 				specialist: speaciallistDetails,
			// 				prefix: doctorData.prefix,
			// 				profile_image: doctorData.profile_image,
			// 				gender: doctorData.gender
			// 			})
			// 		});
			// 	}

			// 	let upcommingInfo = [];
			// 	upCommingAppointmentResult.map(doctorData => {
			// 		let details = doctorInfo.get(doctorData.doctor_id)
			// 		if (details) {
			// 			upcommingInfo.push({
			// 				appointmentResult: doctorData,
			// 				specialist: details.specialist,
			// 				degree: details.degree,
			// 				prefix: details.prefix,
			// 				profile_image: details.profile_image
			// 			});
			// 		} else {
			// 			upcommingInfo.push({
			// 				appointmentResult: doctorData
			// 			});
			// 		}
			// 	})

			// 	tempData = this.state.upComingData.concat(upcommingInfo)

			// }
			this.setState({
				upComingData: tempData,
				data: tempData,
				isLoading: false
			});
		} catch (e) {
			console.log(e);
		} finally {
			this.setState({
				isLoading: false
			})

		}
	};
	pastAppointment = async () => {
		try {
			// this.setState({
			// 	isLoading: true
			// })
			let memberId = await AsyncStorage.getItem("memberId");
			let tempData = this.state.pastData
			let filters = {
				startDate: subTimeUnit(new Date(), 1, "years").toUTCString(),
				endDate: addTimeUnit(new Date(), 1, 'millisecond').toUTCString(),
				// skip: this.state.skip,
				// limit: this.state.limit,
				// sort: -1,
				// reviewInfo: true
			};

			let pastAppointmentResult = await getAppointmentByMemberId(memberId, filters);

			if (pastAppointmentResult) {

				// let doctorInfo = new Map();


				// let doctorIds = getAllId(pastAppointmentResult)
				// if (doctorIds) {

				// 	let speciallistResult = await getMultipleDoctorDetails(doctorIds, "specialist,education,prefix,profile_image,gender");

				// 	speciallistResult.data.forEach(doctorData => {

				// 		let educationDetails = ' ',
				// 			speaciallistDetails = '';

				// 		if (doctorData.education != undefined) {
				// 			educationDetails = getAllEducation(doctorData.education)
				// 		}
				// 		if (doctorData.specialist != undefined) {
				// 			speaciallistDetails = getAllSpecialist(doctorData.specialist)
				// 		}
				// 		doctorInfo.set(doctorData.doctor_id, {
				// 			degree: educationDetails,
				// 			specialist: speaciallistDetails.toString(),
				// 			prefix: doctorData.prefix,
				// 			profile_image: doctorData.profile_image,
				// 			gender: doctorData.gender
				// 		})
				// 	});
				// }
				// let pastDoctorDetails = [];
				// pastAppointmentResult.map((doctorData, index) => {
				// 	let details = doctorInfo.get(doctorData.doctor_id)
				// 	if (details) {
				// 		pastDoctorDetails.push({
				// 			appointmentResult: doctorData,
				// 			specialist: details.specialist,
				// 			degree: details.degree,
				// 			prefix: details.prefix,
				// 			profile_image: details.profile_image
				// 		});
				// 	} else {
				// 		pastDoctorDetails.push({
				// 			appointmentResult: doctorData,
				// 		});
				// 	}
				// }
				// )


				// tempData = this.state.pastData.concat(pastDoctorDetails)
				tempData=pastAppointmentResult


			}
			await this.setState({
				pastData: tempData, data: tempData, isLoading: false
			});
		} catch (e) {
			console.log(e);
		} finally {
			this.setState({
				isLoading: false
			})

		}
	};


	navigateAddReview(item, index) {
		this.setState({
			modalVisible: true, reviewData: item.appointmentResult, reviewIndex: index
		})
	}
	async getvisble(val) {
		const { reviewIndex, data } = this.state
		this.setState({ modalVisible: false });
		if (val.updatedVisible == true) {
			await this.setState({ skip: 0, pastData: [] })
			toastMeassage('Thank you for your valuable feedback', 'success', 3000)
			await this.pastAppointment();
		}
	}

	handleIndexChange = async (index) => {
		let data = []
		await this.setState({
			selectedIndex: index,
			skip: 0,
			isLoading: true

		});

		if (index === 0) {
			if (this.state.upComingData.length == 0) {
				await this.upCommingAppointment()
			} else {
				data = this.state.upComingData
			}

		} else {
			if (this.state.pastData.length == 0) {
				await this.pastAppointment()
				data = this.state.pastData

			}
			else {
				data = this.state.pastData
			}

		}

		await this.setState({

			data,
			isLoading: false

		});
	};



	navigateToBookAppointmentPage(item) {

		// let doctorId = item.doctorId;
		// this.props.navigation.navigate('Doctor Details Preview', {
		// 	doctorId: doctorId,
		// 	fetchAvailabiltySlots: true
		// })

		this.props.navigation.navigate('DoctorConsultation', {
			reqData4HistoryPage: item,
			fromHistoryPage: true
		  })
	}
	handleLoadMore = async () => {
		if (!this.onEndReachedCalledDuringMomentum) {

			this.onEndReachedCalledDuringMomentum = true;
			await this.setState({ skip: this.state.skip + this.state.limit, footerLoading: true });

			if (this.state.selectedIndex === 0) {

				await this.upCommingAppointment()


			} else {

				await this.pastAppointment()


			}


			this.setState({ footerLoading: false })

		}
	}
	async navigateToHomeOrCorporate() {
		let corporateUser = await AsyncStorage.getItem("is_corporate_user") || null;
		if (corporateUser) {
			this.props.navigation.navigate('CorporateHome',{fromAppointment: true});
		} else {
			this.props.navigation.navigate("Home", { fromAppointment: true })
		}
}
	renderFooter() {
		return (
			//Footer View with Load More button
			<View style={styles.footer}>
				<TouchableOpacity
					activeOpacity={0.9}
					onPress={this.loadMoreData}

					style={styles.loadMoreBtn}>
					{this.state.footerLoading ?

						<ActivityIndicator color="blue" style={styles.btnText} /> : null}

				</TouchableOpacity>
			</View>
		);
	}


	render() {
		const {
			data, selectedIndex, isLoading } = this.state;

		return (
			<View style={styles.container}>
				<NavigationEvents
					onWillFocus={payload => { this.backNavigation(payload) }}
				/>
				<Card transparent >
					<SegmentedControlTab
						tabsContainerStyle={{
							width: 250,
							marginLeft: "auto",
							marginRight: "auto",
							marginTop: "auto"
						}}
						values={[translate("Upcoming"), translate("Past")]}
						selectedIndex={this.state.selectedIndex}
						onTabPress={this.handleIndexChange}
						activeTabStyle={{
							backgroundColor: primaryColor,
							borderColor: primaryColor
						}}
						tabStyle={{ borderColor: primaryColor }} />

					{isLoading == true ?
						(
							<Spinner
								color="blue"
								style={[styles.containers, styles.horizontal]}
								visible={true}
								size={"large"}
								overlayColor="none"
								cancelable={false}
							/>
						) :
						(
							data.length === 0 ? (
								<Card transparent style={{
									alignItems: "center",
									justifyContent: "center",
									marginTop: "20%"
								}}>
									<Thumbnail
										square
										source={noAppointmentImage}
										style={{ height: 100, width: 100, marginTop: "10%" }}
									/>

									<Text
										style={{
											fontFamily: "Roboto",
											fontSize: 15,
											marginTop: "10%"
										}}
										note
									>
										{translate("No appointments scheduled !")}
								</Text>
									<Item style={{ marginTop: "15%", borderBottomWidth: 0 }}>
										<Button style={[styles.bookingButton, styles.customButton]}
											onPress={() =>
												this.navigateToHomeOrCorporate()
											} testID='navigateToHome'>
											<Text style={{ fontFamily: 'opensans-bold', fontSize: 15,  }}>{translate("Book Now")}</Text>
										</Button>
									</Item>
								</Card>
							) : (
									<FlatList
										data={data}
										// extraData={data}
										// onEndReached={() => this.handleLoadMore()}
										// onEndReachedThreshold={0.5}
										// onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
										ListFooterComponent={this.renderFooter.bind(this)}
										renderItem={({ item, index }) => (
											<Card transparent style={{ borderBottomWidth: 0.3, paddingBottom: 10, marginTop: 10 }}>

												<TouchableOpacity onPress={() =>
													this.props.navigation.navigate("AppointmentInfo", {
														data: data[index], selectedIndex: selectedIndex
													})
												} testID='navigateAppointmentInfo'>
													{item.tokenNo ?
														<Text style={{ textAlign: 'right', fontSize: 14, marginTop: -5 }} >{"Ref no :" + item.tokenNo}</Text>
														: null}
													<Row>
														<Col size={2}>
															<TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderDoctorImage(item.doctorInfo), title: 'Profile photo' })}>
																<Thumbnail
																	circular
																	source={renderDoctorImage(item.doctorInfo)}
																	style={{ height: 60, width: 60 }}
																/>
															</TouchableOpacity>
														</Col>
														<Col size={8}>

															<Row style={{ borderBottomWidth: 0 }}>
																<Col size={9}>
																	<Text style={{ fontFamily: "opensans-bold", fontSize: 15,  }}>{getDoctorNameOrHospitalName(item)}</Text>
																	<Text
																		style={{
																			fontFamily: "Roboto",
																			fontSize: 13,
																			marginTop: "1%"
																		}}
																	>{getDoctorEducation(item.doctorInfo)}</Text>
																</Col>
																<Col size={1}>
																</Col>
															</Row>
															<Row style={{ borderBottomWidth: 0 }}>
																<Text
																	style={{ fontFamily: "Roboto", fontSize: 14, width: '60%' }}
																>
																	{item.specialist ? getAllSpecialist(item.specialist) : item.bookedFor === 'HOSPITAL' ? getHospitalName(item.hospitalInfo) : ''}
																</Text>

																{/* {selectedIndex == 1 &&
																	item.appointmentResult.reviewInfo != undefined && item.appointmentResult.reviewInfo.overall_rating !== undefined && ( */}
                                									{/* StarRating Demo Count Shwoing */}
																		{/* <StarRating
																			fullStarColor="#FF9500"
																			starSize={15}
																			containerStyle={{
																				width: 80,
																				marginLeft: "auto",
																			}}
																			disabled={false}
																			maxStars={5}
																			rating={4}

																		/> */}
																	{/* )} */}
															</Row>

															<Row style={{ borderBottomWidth: 0 }}>
																{item.status == "APPROVED" ?
																	<Text style={{ fontFamily: "opensans-bold", fontSize: 13, color: 'green', }} note>{'Appointment Ongoing'}</Text>
																	:
																	<Text style={{ fontFamily: "opensans-bold", fontSize: 13, color: statusValue[item.status] ? statusValue[item.status].color : 'red',  }} note>{statusValue[item.status] ? translate(statusValue[item.status].text) : item.status}</Text>
																}


															</Row>

															<Text style={{ fontFamily: "Roboto", fontSize: 11 }} note>
																{formatDate(item.startTime, "dddd,MMMM DD-YYYY  hh:mm a")}</Text>
															{/* {selectedIndex == 1 &&
																item.status == "COMPLETED" && (item.appointmentResult.is_review_added == undefined || item.appointmentResult.is_review_added == false) ? (
																	<Row style={{ borderBottomWidth: 0 }}>
																		<Col size={1} ></Col>
																		<Col size={4} >
																			<Button
																				style={styles.shareButton}
																				onPress={() => this.navigateAddReview(item, index)}

																				testID='navigateInsertReview'
																			>
																				<Text style={styles.bookAgain1}>

																					{translate("Add Review")}
                                                                                </Text>
																			</Button>
																		</Col>


																		<Col size={4} style={{ marginLeft: 5 }}>

																			<Button style={styles.bookingButton} onPress={() => this.navigateToBookAppointmentPage(item)}>
																				<Text style={styles.bookAgain1} testID='navigateBookAppointment'>
																					{translate("Book Again")}
                                                                               </Text>
																			</Button>
																		</Col>
																	</Row>





																) : (
																	selectedIndex === 1 && (


																		<Row style={{ borderBottomWidth: 0 }}>
																			<Col size={6} style={(styles.marginRight = 10)}>

																			</Col>
																			<Col size={4} style={(styles.marginRight = 10)}>
																				<Button style={styles.bookingButton} onPress={() => this.navigateToBookAppointmentPage(item)} testID='navigateBookingPage'>
																					<Text style={styles.bookAgain1}>
																						{translate("Book Again")}
																			   </Text>
																				</Button>
																			</Col>
																		</Row>






																	)
																)} */}
																{
																	selectedIndex === 1 ? (


																		<Row style={{ borderBottomWidth: 0 }}>
																			<Col size={6} style={(styles.marginRight = 10)}>

																			</Col>
																			<Col size={4} style={(styles.marginRight = 10)}>
																				<Button style={styles.bookingButton} onPress={() => this.navigateToBookAppointmentPage(item)} testID='navigateBookingPage'>
																					<Text style={styles.bookAgain1}>
																						{translate("Book Again")}
																			   </Text>
																				</Button>
																			</Col>
																		</Row>
																	):null
																}
														</Col>
													</Row>
												</TouchableOpacity>
											</Card>
										)}
										keyExtractor={(item, index) => index.toString()}
									/>

								)
						)}
				</Card>
				{this.state.modalVisible === true ?
					<InsertReview
						props={this.props}
						data={this.state.reviewData}
						popupVisible={(data) => this.getvisble(data)}
					/>


					: null}

			</View>

		);
	}
}

export default MyAppoinmentList;
const styles = StyleSheet.create({
	container: {
		// backgroundColor: "#ffffff",
		margin: 10
	},
	bookAgain1: {
		fontSize: 13,
		fontFamily: 'opensans-bold',
		textAlign: 'center'
	},
	bodyContent: {
		padding: 5
	},
	bookingButton: {
		marginTop: 10,
		backgroundColor: primaryColor,
		marginRight: 1,
		borderRadius: 10,
		width: "auto",
		height: 30,
		color: "white",
		fontSize: 12,
		justifyContent: 'center'
	},
	bookingAgainButton: {
		marginTop: 12,
		backgroundColor: "gray",

		marginLeft: 115,
		borderRadius: 10,
		width: "auto",
		height: 30,
		color: "white",
		fontSize: 12,
		textAlign: "center",
		justifyContent: "center"
	},
	shareButton: {
		marginTop: 10,
		backgroundColor: "gray",
		marginRight: 1,
		borderRadius: 10,
		width: "auto",
		height: 30,
		color: "white",
		fontSize: 12,
		justifyContent: 'center'

	},
	customButton: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: 12,
		backgroundColor: primaryColor,
		marginLeft: 15,
		borderRadius: 10,
		width: "auto",
		height: 40,
		color: "white",
		fontSize: 12,
		textAlign: "center",
		marginLeft: "auto",
		marginRight: "auto"
	},
	containers: {
		flex: 1,
		justifyContent: "center"
	},
	horizontal: {
		flexDirection: "column",
		justifyContent: "center",
		padding: 10
	}
});
