import React, { Component } from "react";
import {
	View,
	Text,
	Button,
	List,
	ListItem,
	Left,
	Right,
	Thumbnail,
	Item,
	Card,
	Body,

} from "native-base";
import {
	StyleSheet,
	Image,
	AsyncStorage,
	FlatList,
	ScrollView,
	ActivityIndicator
} from "react-native";
import StarRating from "react-native-star-rating";
import { Col, Row, Grid } from "react-native-easy-grid";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { NavigationEvents } from 'react-navigation';

import { userReviews } from "../../providers/profile/profile.action";
import { hasLoggedIn } from "../../providers/auth/auth.actions";
import {formatDate,addTimeUnit,subMoment,addMoment,subTimeUnit ,getAllId,statusValue} from "../../../setup/helpers";
import {getUserAppointments,viewUserReviews,getMultipleDoctorDetails} from "../../providers/bookappointment/bookappointment.action";
import noAppointmentImage from "../../../../assets/images/noappointment.png";
import Spinner from "../../../components/Spinner";
import { renderProfileImage,getAllEducation,getAllSpecialist } from '../../common'
import moment from "moment";
// import moment from "moment";

class MyAppoinmentList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			isLoading: false,
			selectedIndex: 0,
			upComingData: [],
			pastData: [],
			userId: null,
			loading: true,
			isRefreshing: false,
			isNavigation: true

		};
	}

	async componentDidMount() {
		console.log('statusValue'+JSON.stringify(statusValue))
		const isLoggedIn = await hasLoggedIn(this.props);
		if (!isLoggedIn) {
			this.props.navigation.navigate("login");
			return;
		}
		let userId = await AsyncStorage.getItem("userId");
		this.setState({ userId });
		await new Promise.all([
			 this.upCommingAppointment(),
		     this.pastAppointment()
		])
		await this.setState({ isLoading: true, isNavigation: false })

	}

	backNavigation = async (navigationData) => {
		if (!this.state.isNavigation) {
			if (navigationData.action) {

				await this.setState({ isLoading: false })

				if (navigationData.action.type === 'Navigation/BACK' || navigationData.action.type === 'Navigation/NAVIGATE' || navigationData.action.type === 'Navigation/POP') {
					if (this.state.selectedIndex == 0) {


						await this.upCommingAppointment();
						await this.setState({ isLoading: true })

					} else {
						await this.pastAppointment();
						await this.setState({ isLoading: true, data: this.state.pastData })
					}

				}
			}

		}

	}

	upCommingAppointment = async () => {
		try {
			let userId = await AsyncStorage.getItem("userId");
			//upcomming filter utc format
			// let filters = {
			// 	startDate: moment().utc(),
			// 	endDate: addMoment(new Date(), 1, "years").utc()
			// };
		
			let filters = {
				startDate:new Date().toUTCString(),
				endDate: addTimeUnit(new Date(), 1, "years").toUTCString()
			};
		
			let upCommingAppointmentResult = await getUserAppointments(userId, filters);
              
			if (upCommingAppointmentResult.success) {
				let doctorInfo = new Map();
				upCommingAppointmentResult = upCommingAppointmentResult.data;
				
				let doctorIds = getAllId(upCommingAppointmentResult) 
				


				let speciallistResult = await getMultipleDoctorDetails(doctorIds, "specialist,education,prefix,profile_image,gender");

				speciallistResult.data.forEach(doctorData => {

					let educationDetails = ' ', speaciallistDetails = '';


					if (doctorData.education != undefined) {
						educationDetails =  getAllEducation(doctorData.education)
						
					} if (doctorData.specialist != undefined) {
						speaciallistDetails =   getAllSpecialist(doctorData.specialist)
						
					}



					doctorInfo.set(doctorData.doctor_id, { degree: educationDetails, specialist: speaciallistDetails, prefix: doctorData.prefix, profile_image: doctorData.profile_image, gender: doctorData.gender })


				});

				let upcommingInfo = [];
				upCommingAppointmentResult.map(doctorData => {



					let details = doctorInfo.get(doctorData.doctor_id)

					upcommingInfo.push({ appointmentResult: doctorData, specialist: details.specialist, degree: details.degree, prefix: details.prefix, profile_image: details.profile_image });



				})
				upcommingInfo.sort(function (firstVarlue, secandValue) {
					return firstVarlue.appointmentResult.appointment_starttime < secandValue.appointmentResult.appointment_starttime ? -1 : 0
				})
				this.setState({ upComingData: upcommingInfo, data: upcommingInfo });


			}
		} catch (e) {
			console.log(e);
		}
	};
	pastAppointment = async () => {
		try {
			let userId = await AsyncStorage.getItem("userId");
	 
			//utc format in filter Date result Didnot come
		//	 let filters = { startDate: moment().utc(),
			// 	endDate: subMoment(new Date(), 1, "years").utc() };
		

			let filters = { startDate:subTimeUnit(new Date(), 1, "years").toUTCString(),
				          endDate:  addTimeUnit(new Date(),10,'minutes').toUTCString() };

			let pastAppointmentResult = await getUserAppointments(userId, filters);
		    
			let viewUserReviewResult = await viewUserReviews("user", userId, '?skip=0');

			if (pastAppointmentResult.success) {
				pastAppointmentResult = pastAppointmentResult.data;

				viewUserReviewResult = viewUserReviewResult.data;

				let doctorInfo = new Map();
				let reviewRate = new Map();
				if (viewUserReviewResult != undefined) {
					viewUserReviewResult.map(review => {
						reviewRate.set(review.appointment_id, { ratting: review.overall_rating })

					})
				}
           
	let doctorIds = getAllId(pastAppointmentResult) 
				
				

				let speciallistResult = await getMultipleDoctorDetails(doctorIds, "specialist,education,prefix,profile_image,gender");

				speciallistResult.data.forEach(doctorData => {

					let educationDetails = ' ', speaciallistDetails = '';
					
					 if (doctorData.education != undefined) {
					
						educationDetails =  getAllEducation(doctorData.education)

					}

				
					if (doctorData.specialist != undefined) {
						speaciallistDetails= getAllSpecialist(doctorData.specialist)
                       
					}

					

					doctorInfo.set(doctorData.doctor_id, { degree: educationDetails, specialist: speaciallistDetails.toString(), prefix: doctorData.prefix, profile_image: doctorData.profile_image, gender: doctorData.gender })


				});

                 console.log(doctorInfo)

				let pastDoctorDetails = [];
				pastAppointmentResult.map((doctorData, index) => {

					let ratting;
					if (doctorData.is_review_added==true) {
						let rating = reviewRate.get(doctorData._id);
						ratting = rating.ratting;

					}
					let details = doctorInfo.get(doctorData.doctor_id)
					pastDoctorDetails.push({
						appointmentResult: doctorData, specialist: details.specialist, degree: details.degree, ratting: ratting, prefix: details.prefix, profile_image: details.profile_image

					});



				}

				)

				pastDoctorDetails.sort(function (firstVarlue, secandValue) {
					return firstVarlue.appointmentResult.appointment_starttime > secandValue.appointmentResult.appointment_starttime ? -1 : 0
				})

				this.setState({ pastData: pastDoctorDetails });

			}
		} catch (e) {
			console.log(e);
		}
		finally {
			this.setState({ isLoading: false })

		}
	};


	navigateAddReview(item) {
		let data = item.appointmentResult;
		data.prefix = item.prefix
		
		this.props.navigation.navigate('InsertReview', { appointmentDetail: data })

	}

	handleIndexChange = index => {

		let data = index === 0 ? this.state.upComingData : this.state.pastData;

		this.setState({
			...this.state,
			selectedIndex: index,

			data

		});
	};



	navigateToBookAppointmentPage(item) {

		let doctorId = item.appointmentResult.doctor_id;
		this.props.navigation.navigate('Book Appointment', { doctorId: doctorId, fetchAvailabiltySlots: true })
	}

	render() {
		const {
			data,
			selectedIndex,

			isLoading,

		} = this.state;

		return (
			<View style={styles.container}>
				<NavigationEvents
					onWillFocus={payload => { this.backNavigation(payload) }}
				/>
				<Card transparent>
					<SegmentedControlTab
						tabsContainerStyle={{
							width: 250,
							marginLeft: "auto",
							marginRight: "auto",
							marginTop: "auto"
						}}
						values={["Upcoming", "Past"]}
						selectedIndex={this.state.selectedIndex}
						onTabPress={this.handleIndexChange}
						activeTabStyle={{
							backgroundColor: "#775DA3",
							borderColor: "#775DA3"
						}}
						tabStyle={{ borderColor: "#775DA3" }}
					/>

					{isLoading == true ? (
						data.length === 0 ? (
							<Card
								transparent
								style={{
									alignItems: "center",
									justifyContent: "center",
									marginTop: "20%"
								}}
							>
								<Thumbnail
									square
									source={noAppointmentImage}
									style={{ height: 100, width: 100, marginTop: "10%" }}
								/>

								<Text
									style={{
										fontFamily: "OpenSans",
										fontSize: 15,
										marginTop: "10%"
									}}
									note
								>
									No appoinments are scheduled
								</Text>
								<Item style={{ marginTop: "15%", borderBottomWidth: 0 }}>
									<Button style={[styles.bookingButton, styles.customButton]}
										onPress={() =>
											this.props.navigation.navigate("Home", { fromAppointment: true })
										} testID='navigateToHome'>
										<Text style={{ fontFamily: 'Opensans', fontSize: 15, fontWeight: 'bold' }}>Book Now</Text>
									</Button>
								</Item>
							</Card>
						) : (
								<ScrollView>
									<List>
										<FlatList
											data={data}
											extraData={data}
											renderItem={({ item, index }) => (

 
												<ListItem
													avatar
													onPress={() =>
														this.props.navigation.navigate("AppointmentInfo", {
															data: item.appointmentResult,selectedIndex:selectedIndex
														})
													} testID='navigateAppointmentInfo'
												>
													<Left>
														<Thumbnail
															square
															source={renderProfileImage(item)}
															style={{ height: 60, width: 60 }}
														/>
													</Left>
													<Body>

														<Item style={{ borderBottomWidth: 0 }}>

															<Text style={{ fontFamily: "OpenSans", fontSize: 15, fontWeight: 'bold' }}>
																{(item.prefix != undefined ? item.prefix : '') + item.appointmentResult.doctorInfo.first_name + " " + item.appointmentResult.doctorInfo.last_name}{" "}
															</Text>
															<Text
																style={{
																	fontFamily: "OpenSans",
																	fontSize: 13,
																	marginTop: "1%"
																}}
															>
																{item.degree}
															</Text>
														</Item>
														<Item style={{ borderBottomWidth: 0 }}>
															<Text
																style={{ fontFamily: "OpenSans", fontSize: 14, width: '60%' }}
															>
																{item.specialist}
															</Text>

															{selectedIndex == 1 &&
																item.ratting != undefined && (
																	<StarRating
																		fullStarColor="#FF9500"
																		starSize={15}
																		containerStyle={{
																			width: 80,
																			marginLeft: "auto",
																		}}
																		disabled={false}
																		maxStars={5}
																		rating={item.ratting}

																	/>
																)}
														</Item>
											
														<Item style={{ borderBottomWidth: 0 }}>
												
														{/* {selectedIndex == 0 ?  */}
																	<Text style={{ fontFamily: "OpenSans", fontSize: 13, color:statusValue[item.appointmentResult.appointment_status].color, fontWeight: 'bold' }} note>{statusValue[item.appointmentResult.appointment_status].text}</Text>	
														     	 {/* :
															// 	(item.appointmentResult.appointment_status == "CLOSED" ?
															// 		<Text style={{ fontFamily: "OpenSans", fontSize: 13, color: "red", fontWeight: 'bold' }} note>Appointment cancelled.</Text>
															// 		:
															// 		<Text style={{ fontFamily: "OpenSans", fontSize: 13, color: "green", fontWeight: 'bold' }} note>Appointment completed</Text>
															// 	)

															// } */}

														</Item>

														<Text style={{ fontFamily: "OpenSans", fontSize: 11 }} note>
															{formatDate(item.appointmentResult.appointment_starttime, "dddd,MMMM DD-YYYY  hh:mm a")}</Text>








														{selectedIndex == 1 &&
															item.appointmentResult.appointment_status ==
															"PENDING_REVIEW" ? (
																<Item style={{ borderBottomWidth: 0 }}>
																	<Right style={(styles.marginRight = -2)}>
																		<Button
																			style={styles.shareButton}
																			onPress={() => this.navigateAddReview(item)}

																			testID='navigateInsertReview'
																		>
																			<Text style={styles.bookAgain1}>

																				Add Review
																</Text>
																		</Button></Right>

																	<Right style={(styles.marginRight = 5)}>

																		<Button style={styles.bookingButton} onPress={() => this.navigateToBookAppointmentPage(item)}>
																			<Text style={styles.bookAgain1} testID='navigateBookAppointment'>
																				Book Again
																</Text>
																		</Button>
																	</Right>
																</Item>

															) : (
																selectedIndex === 1 && (


																	<Item style={{ borderBottomWidth: 0 }}>
																		<Right style={(styles.marginRight = 10)}>
																			<Button style={styles.bookingButton} onPress={() => this.navigateToBookAppointmentPage(item)} testID='navigateBookingPage'>
																				<Text style={styles.bookAgain1}>
																					Book Again
																		</Text>
																			</Button>
																		</Right>
																	</Item>

																)
															)}
													</Body>
												</ListItem>
											)}
											keyExtractor={(item, index) => index.toString()}
										/>
									</List>
								</ScrollView>
							)
					) : (
							<Spinner
								color="blue"
								style={[styles.containers, styles.horizontal]}
								visible={true}
								size={"large"}
								overlayColor="none"
								cancelable={false}
							/>
						)}
				</Card>
			</View>
		);
	}
}

export default MyAppoinmentList;
const styles = StyleSheet.create({
	container: {
		backgroundColor: "#ffffff",
		margin: 10
	},
	bookAgain1: {
		fontSize: 13,
		fontFamily: 'OpenSans',
		fontWeight: 'bold'
	},
	bodyContent: {
		padding: 5
	},
	bookingButton: {
		marginTop: 10,
		backgroundColor: "#775DA3",
		marginRight: 1,
		borderRadius: 10,
		width: "auto",
		height: 30,
		color: "white",
		fontSize: 12,
		textAlign: "center"
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
		marginTop: 12,
		backgroundColor: "gray",
		marginRight: 5,

		borderRadius: 10,
		width: "auto",
		height: 30,
		color: "white",
		fontSize: 1,
		textAlign: "center",
		justifyContent: "center"
	},
	customButton: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: 12,
		backgroundColor: "#775DA3",
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
