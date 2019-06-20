import React, { Component } from "react";
import {
	Container,
	Content,
	View,
	Text,
	Title,
	Header,
	H3,
	Button,
	List,
	ListItem,
	Left,
	Right,
	Thumbnail,
	Segment,
	Item,
	Card,
	CardItem,
	Body,
	Icon
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

import { userReviews } from "../../providers/profile/profile.action";
import { hasLoggedIn } from "../../providers/auth/auth.actions";
import {
	formatDate,
	addTimeUnit,
	dateDiff,
	subTimeUnit
} from "../../../setup/helpers";
import ContentLoader from "../../../components/ContentLoader/ContentLoader";
import {
	getUserAppointments,
	viewUserReviews,
	getMultipleDoctorDetails
} from "../../providers/bookappointment/bookappointment.action";
import noAppointmentImage from "../../../../assets/images/noappointment.png";
import Spinner from "../../../components/Spinner";
import { Loader } from "../../../components/ContentLoader";

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
			reviewData: [],
			upcommingSpecialist: [],
			pastSpecialist: [],
			speciallist: [],
			loading: true
		};
	}

	async componentDidMount() {
		const isLoggedIn = await hasLoggedIn(this.props);
		if (!isLoggedIn) {
			this.props.navigation.navigate("login");
			return;
		}
		let userId = await AsyncStorage.getItem("userId");
		this.setState({ userId });
		this.upCommingAppointment();
		this.pastAppointment();
	}

	upCommingAppointment = async () => {
		try {
			let userId = await AsyncStorage.getItem("userId");
			let filters = {
				startDate: formatDate(new Date(), "YYYY-MM-DD"),
				endDate: formatDate(addTimeUnit(new Date(), 1, "years"), "YYYY-MM-DD")
			};
			let upCommingAppointmentResult = await getUserAppointments(
				userId,
				filters
			);
			if (upCommingAppointmentResult.success) {
				let appointmentData = [];
				upCommingAppointmentResult = upCommingAppointmentResult.data;

				let doctorIds = upCommingAppointmentResult
					.map((appointmentResult, index) => {
						appointmentData.push({ appointmentResult });
						return appointmentResult.doctor_id;
					})
					.join(",");

				let speciallistResult = await getMultipleDoctorDetails(
					doctorIds,
					"specialist,education"
				);

				let upcommingSpecialist = [];
				speciallistResult.data.map((doctorInfo, index) => {
					let speaciallistDetails = null;

					speaciallistDetails = doctorInfo.specialist
						.map(categories => {
							return categories.category;
						})
						.join(",");
					let educationDetails = null;
					educationDetails = doctorInfo.education
						.map(education => {
							return education.degree;
						})
						.join(",");

					upcommingSpecialist.push({
						data: appointmentData[index],
						specialist: speaciallistDetails,
						degree: educationDetails
					});
				});
				this.setState({
					upComingData: upcommingSpecialist,
					isLoading: true,
					data: upcommingSpecialist,
					specialist: upcommingSpecialist
				});
			}
		} catch (e) {
			console.log(e);
		}
	};
	pastAppointment = async () => {
		try {
			let userId = await AsyncStorage.getItem("userId");
			let endData = formatDate(subTimeUnit(new Date(), 1, "day"), "YYYY-MM-DD");
			let filters = {
				endDate: endData,
				startDate: "2018-01-01"
			};
			let pastAppointmentResult = await getUserAppointments(userId, filters);
			let viewUserReviewResult = await viewUserReviews("user", userId);

			if (pastAppointmentResult.success) {
				pastAppointmentResult = pastAppointmentResult.data;
				viewUserReviewResult = viewUserReviewResult.data;

				let appointmentData = [];

				let doctorIds = pastAppointmentResult
					.map(appointmentResult => {
						if (appointmentResult.appointment_status == "COMPLETED") {
							viewUserReviewResult.map(viewUserReview => {
								if (appointmentResult._id === viewUserReview.appointment_id) {
									appointmentData.push({
										appointmentResult,
										ratting: viewUserReview.overall_rating
									});
								}
							});
						} else {
							appointmentData.push({ appointmentResult });
							condition = false;
						}

						return appointmentResult.doctor_id;
					})
					.join(",");

				let speciallistResult = await getMultipleDoctorDetails(
					doctorIds,
					"specialist,education"
				);

				let pastDoctorDetails = [];

				speciallistResult.data.map((doctorInfo, index) => {
					let educationDetails = doctorInfo.education
						.map(education => {
							return education.degree;
						})
						.join(",");

					let speaciallistDetails = doctorInfo.specialist
						.map(categories => {
							return categories.category;
						})
						.join(",");
					pastDoctorDetails.push({
						data: appointmentData[index],
						specialist: speaciallistDetails,
						degree: educationDetails
					});
				});

				this.setState({ pastData: pastDoctorDetails, isLoading: true });
			}
		} catch (e) {
			console.log(e);
		}
	};

	handleIndexChange = index => {
		let data = index === 0 ? this.state.upComingData : this.state.pastData;

		this.setState({
			...this.state,
			selectedIndex: index,
			data
		});
	};

	render() {
		const {
			data,
			selectedIndex,
			reviewData,
			isLoading,
			speciallist
		} = this.state;

		return (
			<View style={styles.container}>
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
										fontSize: 14,
										marginTop: "10%"
									}}
									note
								>
									No appoinments are scheduled
								</Text>
								<Item style={{ marginTop: "15%", borderBottomWidth: 0 }}>
									<Button style={[styles.bookingButton, styles.customButton]}>
										<Text>Book Now</Text>
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
														data: item.data.appointmentResult
													})
												}
											>
												<Left>
													<Thumbnail
														square
														source={{
															uri:
																"https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png"
														}}
														style={{ height: 60, width: 60 }}
													/>
												</Left>
												<Body>
													<Item style={{ borderBottomWidth: 0 }}>
														<Text style={{ fontFamily: "OpenSans" }}>
															{item.data.appointmentResult.doctorInfo.prefix ||
																"Dr" +
																	"." +
																	item.data.appointmentResult.doctorInfo
																		.first_name +
																	" " +
																	item.data.appointmentResult.doctorInfo
																		.last_name}{" "}
														</Text>
														<Text
															style={{
																fontFamily: "OpenSans",
																fontSize: 10,
																marginTop: "1%"
															}}
														>
															{item.degree}
														</Text>
													</Item>
													<Item style={{ borderBottomWidth: 0 }}>
														<Text
															style={{ fontFamily: "OpenSans", fontSize: 14 }}
														>
															{item.specialist}
														</Text>
														{selectedIndex == 1 &&
															item.data.ratting != undefined && (
																<StarRating
																	fullStarColor="#FF9500"
																	starSize={20}
																	containerStyle={{
																		width: 100,
																		marginLeft: "auto"
																	}}
																	disabled={false}
																	maxStars={5}
																	rating={item.data.ratting}
																	selectedStar={rating =>
																		this.onStarRatingPress(rating)
																	}
																/>
															)}
													</Item>
													{selectedIndex == 0 && (
														<Item style={{ borderBottomWidth: 0 }}>
															{item.data.appointmentResult.appointment_status ==
															"PENDING" ? (
																<Text
																	style={{
																		fontFamily: "OpenSans",
																		fontSize: 12,
																		color: "red"
																	}}
																	note
																>
																	waiting for confirmation
																</Text>
															) : item.data.appointmentResult
																	.appointment_status == "APPROVED" ? (
																<Text
																	style={{
																		fontFamily: "OpenSans",
																		fontSize: 12,
																		color: "green"
																	}}
																	note
																>
																	Appointment confirmed
																</Text>
															) : (
																<Text
																	style={{
																		fontFamily: "OpenSans",
																		fontSize: 12,
																		color: "grey"
																	}}
																	note
																>
																	{
																		item.data.appointmentResult
																			.appointment_status
																	}
																</Text>
															)}
														</Item>
													)}
													{selectedIndex == 1 && (
														<Item style={{ borderBottomWidth: 0 }}>
															{item.data.appointmentResult.appointment_status ==
															"CLOSED" ? (
																<Text
																	style={{
																		fontFamily: "OpenSans",
																		fontSize: 12,
																		color: "red"
																	}}
																	note
																>
																	Appointment cancelled.
																</Text>
															) : (
																item.data.appointmentResult
																	.appointment_status == "COMPLETED" && (
																	<Text
																		style={{
																			fontFamily: "OpenSans",
																			fontSize: 12,
																			color: "green"
																		}}
																		note
																	>
																		Appointment completed
																	</Text>
																)
															)}
														</Item>
													)}

													<Text
														style={{ fontFamily: "OpenSans", fontSize: 12 }}
														note
													>
														{formatDate(
															item.data.appointmentResult.appointment_starttime,
															"dddd,MMMM DD-YYYY  hh:mm a"
														)}
													</Text>

													{selectedIndex == 1 &&
													item.data.appointmentResult.appointment_status ==
														"PENDING_REVIEW" ? (
														<Item style={{ borderBottomWidth: 0 }}>
															<Button
																style={styles.shareButton}
																onPress={() =>
																	this.props.navigation.navigate("InsertReview")
																}
															>
																<Text style={styles.bookAgain1}>
																	{" "}
																	Add To Review
																</Text>
															</Button>
															<Button style={styles.bookingButton}>
																<Text style={styles.bookAgain1}>
																	book Again
																</Text>
															</Button>
														</Item>
													) : (
														selectedIndex === 1 && (
															<Item style={{ borderBottomWidth: 0 }}>
																<Right style={(styles.marginRight = 5)}>
																	<Button style={styles.bookingButton}>
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
		fontSize: 12
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
