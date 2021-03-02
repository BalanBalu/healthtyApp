import React, { Component } from 'react';
import { Container, Content, View, Text, Item, Input, Thumbnail, Icon, Radio, Row, Col, Form, Button, Toast, CardItem } from 'native-base';
import { StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { hasLoggedIn } from "../../../../providers/auth/auth.actions";
import {
    renderDoctorImage,
} from '../../../../common';
import {primaryColor} from '../../../../../setup/config'

import Spinner from '../../../../../components/Spinner';
import {
    fetchAvailableDoctors4Video, createVideoConsuting
} from '../../services/video-consulting-service';
import { POSSIBLE_VIDEO_CONSULTING_STATUS } from '../../constants';
import { possibleChatStatus } from '../../../../../Constants/Chat';
import { SERVICE_TYPES } from '../../../../../setup/config';
import {
    searchDoctorList
} from '../../../../providers/bookappointment/bookappointment.action';
import {
    fetchAvailableDoctors4Chat, createChat
} from '../../../../providers/chat/chat.action';
import BookAppointmentPaymentUpdate from '../../../../providers/bookappointment/bookAppointment';
import { AuthService } from '../../services'
import { CURRENT_APP_NAME, MY_SMART_HEALTH_CARE } from '../../../../../setup/config'
import moment from 'moment';
class AvailableDoctors4Video extends Component {
    constructor(props) {
        super(props)

        this.userId = null;
        this.state = {
            availableChatDoctors: [],
            availableVideoDoctors: [],
            isLoading: true,
            descriptionVisible: false,
            description: '',
            serviceType: '',
            doctorId: '',
            fees: ''
        }
        this.bookAppointmentPaymentUpdate = new BookAppointmentPaymentUpdate();
    }
    async componentDidMount() {
        const isLoggedIn = await hasLoggedIn(this.props);
        if (!isLoggedIn) {
            this.props.navigation.navigate("login");
            return;
        }
        this.userId = await AsyncStorage.getItem("userId");
        this.callVideAndChat()
    }
    async callVideAndChat(doctorIds) {
        this.setState({ isLoading: true })
        let availablityMap = new Map()
        let [availableDocsVideo, availableDocsChat] = await Promise.all([
            this.getDoctorAvailableDoctorData(doctorIds).catch(ex => { console.log(ex); return [] }),
            this.getDoctorAvailableDoctorDataChat(doctorIds).catch(ex => { console.log(ex); return [] }),
        ])

        availableDocsVideo.forEach(doc => {
            doc.availableForVideo = true;
            availablityMap.set(doc.doctor_id, doc);
        });
        availableDocsChat.forEach(docChat => {
            docChat.availableForChat = true;
            if (availablityMap.has(docChat.doctor_id)) {
                let docData = availablityMap.get(docChat.doctor_id);
                docData.availableForChat = true;
                docData.chat_service_config = docChat.chat_service_config;
                availablityMap.set(docChat.doctor_id, docData);
            } else {
                availablityMap.set(docChat.doctor_id, docChat);
            }
        })
        const sorted = Array.from(availablityMap.values()).sort((eleA, eleB) => {
            const eleAVa = this.getMinVideoChatConsultFee(eleA);
            const eleBVa = this.getMinVideoChatConsultFee(eleB);
            return eleAVa - eleBVa;
        })
        this.setState({ availableVideoDoctors: sorted, isLoading: false })
    }
    searchAvailableDoctorsByKeywords = async (searchKeyword) => {
        try {
            this.setState({ isLoading: true })
            const searchedInputValues = [
                {
                    type: 'category',
                    value: searchKeyword
                },
                {
                    type: 'service',
                    value: searchKeyword
                },
                {
                    type: 'symptoms',
                    value: [searchKeyword]
                }
            ];
            let resultData = await searchDoctorList(this.userId, searchedInputValues);
            if (resultData.success) {
                let doctorIds = resultData.data.map((element) => {
                    return element.doctor_id
                });

                this.callVideAndChat(doctorIds);// for getting multiple Doctor details,Reviews ,ReviewCount,etc....
            } else {

                this.setState({ isLoading: false, availableChatDoctors: [], availableVideoDoctors: [] })
            }
        } catch (error) {
            console.log('Error on searchAvailableDoctorsByKeywords', error)
        } finally {
            this.setState({ isLoading: false })
        }
    }


    getDoctorAvailableDoctorData = async (doctorIds) => {
        try {
            if (doctorIds) {
                doctorIds = doctorIds.join(',')
            }
            const availableDocData = await fetchAvailableDoctors4Video(doctorIds);
            if (availableDocData.success === true) {
                return availableDocData.data;
            }
        } catch (error) {

            return [];
        }
        return [];
    }
    getDoctorAvailableDoctorDataChat = async (doctorIds) => {

        try {
            let request = {};
            if (doctorIds) {
                request = {
                    doctor_ids: doctorIds
                }
            }
            const availableDocData = await fetchAvailableDoctors4Chat(request);
            if (availableDocData.success === true) {
                return availableDocData.data
            }
        } catch (error) {
            return []
        }
        return []
    }
    onBookButtonPress4PaymentChat = async (doctorId, fee) => {
        try {
            this.setState({ isLoading: true });
            const { description } = this.state
            const amount = fee;

            let freeService = false;
            if (fee == 0) {
                freeService = true;
            }
            debugger
            const createChatRequest = {
                user_id: this.userId,
                doctor_id: doctorId,
                status: possibleChatStatus.PAYMENT_IN_PROGRESS,
                fee: fee,
                status_by: 'USER',
                statusUpdateReason: 'NEW CONVERSATION',
                day: new Date().getDay(),
                description: description
            }

            const createChatResponse = await createChat(createChatRequest)
            this.setState({ isLoading: false });
            if (createChatResponse.success) {

                if (freeService === true) {
                    const bookSlotDetails = {
                        doctorId: doctorId,
                        fee: amount,
                        chatId: createChatResponse.conversation_id
                    }
                    let response = await this.bookAppointmentPaymentUpdate.updatePaymentDetails(true, {}, 'cash', bookSlotDetails, SERVICE_TYPES.CHAT, this.userId, 'cash');
                    if (response.success) {
                        this.props.navigation.navigate('SuccessChat', { manualNaviagationPage: CURRENT_APP_NAME === MY_SMART_HEALTH_CARE ? 'CorporateHome' : 'Home' });
                        Toast.show({
                            text: 'Your Chat Consultation Request Success. We will notify Doctor',
                            type: 'success',
                            duration: 3000
                        });
                        AuthService.signup(this.userId);
                    } else {
                        Toast.show({
                            text: 'We could not Process Your Video Consultation Request at this time. Please Try again later',
                            type: 'success',
                            duration: 3000
                        });
                    }
                } else {
                    this.props.navigation.navigate('paymentPage', {
                        service_type: SERVICE_TYPES.CHAT,
                        bookSlotDetails: {
                            doctorId: doctorId,
                            fee: amount,
                            chatId: createChatResponse.conversation_id
                        }, amount: amount
                    });
                }
            } else {
                Toast.show({
                    text: createChatResponse.message,
                    duration: 3000,
                    type: 'danger'
                })
            }
        } catch (error) {
            Toast.show({
                text: 'Excption Occured' + error,
                duration: 3000,
                type: 'danger'
            })
        }

    }
    onBookButtonPress4PaymentVideo = async (doctorId, fee) => {
        try {
            this.setState({ isLoading: true });
            const amount = fee;
            let freeService = false;
            if (fee == 0) {
                freeService = true;
            }
            const { description } = this.state
            const videoConsultRequest = {
                user_id: this.userId,
                doctor_id: doctorId,
                status: POSSIBLE_VIDEO_CONSULTING_STATUS.PAYMENT_IN_PROGRESS,
                fee: fee,
                status_by: 'USER',
                statusUpdateReason: 'NEW VIDEO CONSULTATION',
                // description: description,
                consultation_description: description
            }

            const createVideoConsultingResponse = await createVideoConsuting(videoConsultRequest)
            this.setState({ isLoading: false });
            if (createVideoConsultingResponse.success) {

                if (freeService === true) {
                    videoConsultRequest.status = POSSIBLE_VIDEO_CONSULTING_STATUS.PENDING;
                    const bookSlotDetails = {
                        doctorId: doctorId,
                        fee: amount,
                        consultationId: createVideoConsultingResponse.consultationId
                    }

                    let response = await this.bookAppointmentPaymentUpdate.updatePaymentDetails(true, {}, 'cash', bookSlotDetails, SERVICE_TYPES.VIDEO_CONSULTING, this.userId, 'cash');
                    if (response.success) {
                        this.props.navigation.navigate('SuccessChat', { manualNaviagationPage: CURRENT_APP_NAME === MY_SMART_HEALTH_CARE ? 'CorporateHome' : 'Home' });
                        Toast.show({
                            text: 'Your Video Consultation Request Success. We will notify the Doctor',
                            type: 'success',
                            duration: 3000
                        });
                        AuthService.signup(this.userId);
                    } else {
                        Toast.show({
                            text: 'We could not Process Your Video Consultation Request at this time. Please Try again later',
                            type: 'success',
                            duration: 3000
                        });
                    }

                } else {
                    this.setState({ isLoading: false });
                    this.props.navigation.navigate('paymentPage', {
                        service_type: SERVICE_TYPES.VIDEO_CONSULTING,
                        bookSlotDetails: {
                            doctorId: doctorId,
                            fee: amount,
                            consultationId: createVideoConsultingResponse.consultationId
                        }, amount: amount
                    }
                    );
                }
            } else {
                this.setState({ isLoading: false });
                Toast.show({
                    text: createVideoConsultingResponse.message,
                    duration: 3000,
                    type: 'danger'
                })
            }

        } catch (error) {
            Toast.show({
                text: 'Excption Occured' + error,
                duration: 3000,
                type: 'danger'
            })
        }
        finally {
            this.setState({ isLoading: false });
        }

    }
    getVideoConsultFee(item) {
        if (item && item.currentAvailabilityData) {
            return item.currentAvailabilityData.fee
        } else {
            return ''
        }
    }
    getChatFee(item) {
        if (item.chat_service_config && item.chat_service_config.chat_fee) {
            return item.chat_service_config.chat_fee;
        } else {
            return ''
        }
    }
    getMinVideoChatConsultFee(item) {
        let videoFee = null;
        let chatFee = null;

        if (item && item.availabilityData && item.availabilityData[0]) {
            videoFee = Number(item.availabilityData[0].fee);
        }
        if (item.chat_service_config) {
            if (item.chat_service_config.chat_fee !== undefined && item.chat_service_config.chat_fee !== null && item.chat_service_config.chat_fee !== '') {
                chatFee = Number(item.chat_service_config.chat_fee);
            }
        }
        if (videoFee !== null && chatFee !== null) {
            return Math.min(videoFee, chatFee)
        }
        if (videoFee !== null) {
            return videoFee;
        }
        if (chatFee !== null) {
            return chatFee;
        }
    }
    getDoctorCategory(item) {
        if (item.specialist) {
            let specialist = item.specialist.map(ele => ele.category);
            return specialist.join(', ');
        }
        return ''
    }
    checkAnySeriveFreeFor2ShowPremiumBatch(item) {
        if ((item && item.availabilityData && item.availabilityData[0] && item.availabilityData[0].fee == 0)
            || (item && item.chat_service_config && item.chat_service_config.chat_fee == 0)
        ) {
            return true;
        }
        return false;
    }

    checkBothSeriveFreeFor2ShowPremiumBatch(item) {
        if ((item && item.availabilityData && item.availabilityData[0] && item.availabilityData[0].fee == 0)
            && (item && item.chat_service_config && item.chat_service_config.chat_fee == 0)
        ) {
            return true;
        }
        return false;
    }
    getNextAvailabiltyData(item) {
        const currentDay = new Date().getDay();
        if (item.availabilityData[0]) {
            let startTime = String(item.availabilityData[0].start_time).split(':');
            const timing = new Date();
            timing.setUTCHours(startTime[0]);
            timing.setUTCMinutes(startTime[1]);
            timing.setUTCSeconds(1);
            const timeAfterFormat = moment(timing).format('HH:mm A')

            if (Number(item.availabilityData[0].day) >= currentDay) {


                return moment().startOf('w').add(Number(item.availabilityData[0].day), 'd').
                    format('MMM DD, YYYY') + ' ' + timeAfterFormat
            } else {
                return moment().startOf('w').add(1, 'week').add(Number(item.availabilityData[0].day), 'd')
                    .format('MMM DD, YYYY') + ' ' + timeAfterFormat
            }
        }

    }
    descriptionModalOpen = async (doctorId, fee, serviceType) => {
        await this.setState({ descriptionVisible: true, doctorId: doctorId, fees: fee, serviceType: serviceType })
    }

    descritionSubmission = async (serviceType) => {
        const { description, doctorId, fees } = this.state
        if (serviceType === "CHAT") {
            if (description === '') {
                Toast.show({
                    text: 'Kindly fill  the fields',
                    type: 'danger',
                    duration: 3000
                });
            }
            else {
                await this.onBookButtonPress4PaymentChat(doctorId, fees)
                await this.setState({ descriptionVisible: false, description: '' })
            }
        }

        if (serviceType === "VIDEO_CONSULTING") {
            if (description === '') {
                Toast.show({
                    text: 'Kindly fill  the fields',
                    type: 'danger',
                    duration: 3000
                });
            }
            else {
                await this.onBookButtonPress4PaymentVideo(doctorId, fees)
                await this.setState({ descriptionVisible: false, description: '' })
            }
        }
    }

    hasWhiteSpaceDescription(s) {
        let regSpace = new RegExp(/^\s/g);
        // Check for white space
        if (regSpace.test(s)) {
            //your logic
            return false;
        } else {
            this.setState({ description: s })
        }
        return true;
    }




    renderAvailableDoctors(item) {
        const isPremium = this.checkAnySeriveFreeFor2ShowPremiumBatch(item);
        const isBothPremium = this.checkBothSeriveFreeFor2ShowPremiumBatch(item);
        const isVideoFree = this.getVideoConsultFee(item) === 0;
        const isChatFree = item.chat_service_config && item.chat_service_config.chat_fee == 0; //&& Number(item.chat_service_config.chat_fee) === 0;

        return (
            <Row style={styles.RowStyle}>
                <Col style={{ width: '20%' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderDoctorImage(item), title: 'Profile photo' })} >
                        <Thumbnail source={renderDoctorImage(item)}
                            style={{ width: 60, height: 60, position: 'relative', borderRadius: 60 / 2 }}
                        />
                    </TouchableOpacity>

                    <View style={styles.circle} />
                    {isPremium === true ?
                        <Thumbnail source={require('../../../../../../assets/images/viplogo.png')}
                            style={{ width: 25, height: 25, position: 'absolute', borderRadius: 50 / 2, marginTop: 45, marginLeft: 35 }}
                        /> : null}
                </Col>

                <Col style={{ width: '80%' }}>
                    <Row>
                        <Col size={6}>
                            <Text style={styles.docname}>{item.prefix || ''} {item.first_name || ''} {item.last_name || ''}{'  '}</Text>
                        </Col>
                        <Col size={4}>
                            <Row style={{ justifyContent: 'center' }}>
                                {isPremium === true ?
                                    <Text style={{ paddingLeft: 5, paddingRight: 5, fontSize: 10, fontFamily: 'OpenSans', marginLeft: 5, backgroundColor: '#8EC63F', borderRadius: 10, color: '#fff', height: 15, marginTop: 3 }}>
                                        SPONSORED</Text> : null}
                            </Row>
                        </Col>


                    </Row>
                    <Row style={{ marginTop: 2 }}>
                        <Text style={styles.docname}>{''}
                            <Text note style={styles.status}>{this.getDoctorCategory(item)}</Text>
                        </Text>
                    </Row>

                    <Row>
                        {isBothPremium === true ?
                            <Col style={{ width: '45%' }}>
                                <Row>
                                    <Col size={1}>
                                        <Icon name="ios-checkmark" style={{
                                            fontSize: 30, color: '#8EC63F',
                                            marginTop: 6
                                        }} />
                                    </Col>
                                    <Col size={9} style={{ justifyContent: 'center' }}>
                                        <Text style={{
                                            color: '#8EC63F', fontSize: 12,
                                            fontWeight: 'bold',
                                            fontFamily: 'OpenSans',
                                            marginLeft: 2,
                                            marginTop: 6
                                        }
                                        }>Free Consultation !</Text>
                                    </Col>
                                </Row>
                            </Col>
                            : null}
                        {item.availableForChat === true ?
                            <Col style={[isBothPremium ? { width: '25%' } : { width: '35%' }, { marginRight: 5 }]}>
                                <TouchableOpacity onPress={() => this.descriptionModalOpen(item.doctor_id, item.chat_service_config.chat_fee, SERVICE_TYPES.CHAT)}
                                    style={isBothPremium ? styles.ButtonStyle : isChatFree ? styles.ButtonStyleSponsor : styles.ButtonStyle}>
                                    <Icon name="chatbox" style={!isBothPremium && isChatFree ? { color: '#FFFFFF', fontSize: 15, marginTop: 2 } : { color: '#5A89B6', fontSize: 15, marginTop: 2 }} />
                                    <Text style={isBothPremium && isChatFree ? styles.TextStyle : isChatFree ? styles.SponsorText : styles.TextStyle}>
                                        {isBothPremium ? 'Chat' : isChatFree ? 'Free Consult' : `Chat - ₹ ${item.chat_service_config.chat_fee}`}</Text>
                                </TouchableOpacity>
                            </Col>
                            : null}

                        {item.availableForVideo === true && item.hasCurrentlyAvailable === true ?
                            <Col style={isBothPremium ? { width: '25%' } : { width: '35%' }}>
                                <TouchableOpacity onPress={() => this.descriptionModalOpen(item.doctor_id, this.getVideoConsultFee(item), SERVICE_TYPES.VIDEO_CONSULTING)}
                                    style={isBothPremium ? styles.ButtonStyle : isVideoFree ? styles.ButtonStyleSponsor : styles.ButtonStyle}>
                                    <Icon name="ios-videocam" style={!isBothPremium && isVideoFree ? { color: '#FFFFFF', fontSize: 15, marginTop: 2 } : { color: '#5A89B6', fontSize: 15, marginTop: 2 }} />
                                    <Text style={isBothPremium ? styles.TextStyle : isVideoFree ? styles.SponsorText : styles.TextStyle}>
                                        {isBothPremium ? 'Video' : isVideoFree ? 'Free Consult' : `Video - ₹ ${this.getVideoConsultFee(item)}`}
                                    </Text>
                                </TouchableOpacity>
                            </Col>
                            :
                            null}


                    </Row>
                    {item.availableForVideo === true && item.hasCurrentlyAvailable === false ?
                        <Row style={{ marginTop: 5, width: '100%' }}>
                            <Button disabled style={{ height: 30, borderRadius: 10, backgroundColor: primaryColor }}>
                                <Icon name="ios-videocam" style={{ color: '#FFFFFF', fontSize: 15 }} />
                                <Text style={{ marginLeft: -20, fontSize: 10 }}>next Available on {this.getNextAvailabiltyData(item)}</Text>
                                {/*nextAvailableDate ? <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 15 }}>Next Availability On {nextAvailableDate}</Text> : <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 16 }}> No Availablity for Next 7 Days</Text>*/}
                            </Button>
                        </Row> : null}
                </Col>


                {/* <Col style={{ width: '15%' }}>
                                    <Row>
                                        <Col style={{ alignItems: 'center' }}>
                                            <Text style={styles.msgStyle}>{'\u20B9'}{this.getVideoConsultFee(item)}</Text>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ alignItems: 'center', marginTop: -25 }}>
                                            <TouchableOpacity onPress={() => this.onBookButtonPress4Payment(item.doctor_id, item.chat_service_config.chat_fee)}
                                                style={{ textAlign: 'center', backgroundColor: 'green', borderColor: '#000', marginTop: 10, borderRadius: 20, height: 25, justifyContent: 'center' }}>
                                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, padding: 3, fontWeight: 'bold', fontFamily: 'OpenSans' }}>Chat</Text>
                                            </TouchableOpacity>
                                        </Col>
                                    </Row>
                                </Col> */}
            </Row>
        )
    }
    render() {
        const { availableVideoDoctors, keyword, isLoading, description, serviceType } = this.state;
        return (
            <Container>
                <Content>
                    <Spinner
                        visible={isLoading}
                    />
                    <View style={{ backgroundColor: primaryColor }}>
                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.SubText}>Search for Doctors</Text>

                            <Row style={styles.SearchRow}>

                                <Col size={9.1} style={{ justifyContent: 'center', }}>
                                    <Input
                                        placeholder="Search for Symptoms,Categories,etc"
                                        style={styles.inputfield}
                                        onChangeText={(text) => this.setState({ keyword: text })}
                                        placeholderTextColor="gray"
                                        keyboardType={'email-address'}
                                        underlineColorAndroid="transparent"
                                        blurOnSubmit={false}
                                    />
                                </Col>
                                <Col size={0.9} style={keyword ? styles.SearchStyle : styles.dissableSearchStyle}>
                                    <TouchableOpacity onPress={() => keyword ? this.searchAvailableDoctorsByKeywords(keyword) : null}>
                                        <Icon name="ios-search" style={{ color: '#fff', fontSize: 20, padding: 2 }} />
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                        </View>
                    </View>

                    {availableVideoDoctors.length === 0 && isLoading === false ?
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 450 }}>
                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, marginTop: "10%", textAlign: 'center' }} note>
                                No Doctors Found for your Search
						</Text>
                        </View>
                        :
                        <FlatList
                            style={{ marginTop: 10 }}
                            extraData={availableVideoDoctors}
                            data={availableVideoDoctors}
                            renderItem={({ item }) =>
                                this.renderAvailableDoctors(item)
                            }
                            keyExtractor={(item, index) => index.toString()} />
                    }

                    <Modal
                        visible={this.state.descriptionVisible}
                        transparent={true}
                        animationType={'fade'}
                    >
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)',

                        }}>
                            <View style={{
                                width: '95%',
                                height: 220,
                                backgroundColor: '#fff',
                                borderColor: '#909090',
                                borderWidth: 3,
                                padding: 10,
                                borderRadius: 10,
                            }}>
                                <Row style={styles.headerStyle}>
                                    <Icon name="create" style={{ fontSize: 15, color: '#fff', marginLeft: 15 }} />
                                    <Text style={styles.reasonText}> Enter your reason for consultation?</Text>
                                </Row>
                                <View>
                                    <TextInput
                                        style={{ height: 120, borderWidth: 0.3, width: "100%", borderRadius: 5, fontSize: 14, borderColor: '#909090', padding: 2, marginTop: 10 }}
                                        returnKeyType={'next'}
                                        placeholder="Write Reason............"
                                        multiline={true}
                                        keyboardType={'default'}

                                        textAlignVertical={'top'}
                                        onChangeText={text => {
                                            this.hasWhiteSpaceDescription(text);
                                        }}
                                    />
                                </View>
                                <Row style={{ marginTop: 15, justifyContent: 'flex-end', marginBottom: 5 }}>
                                    <Col size={2}></Col>
                                    <Col size={8} >
                                        <Row>
                                            <Col size={5}>
                                                <TouchableOpacity danger style={{ paddingLeft: 10, paddingRight: 10, borderRadius: 5, backgroundColor: 'red', height: 25, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ descriptionVisible: false })} testID='cancelButton'>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 14, textAlign: 'center', color: '#fff', fontWeight: 'bold' }}> {'CANCEL'}</Text>
                                                </TouchableOpacity>
                                            </Col>
                                            <Col size={5} style={{ marginRight: 3, marginLeft: 5 }} >
                                                <TouchableOpacity style={{ backgroundColor: '#6FC41A', paddingLeft: 10, paddingRight: 10, borderRadius: 5, height: 25, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.descritionSubmission(serviceType)} testID='submitButton'>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 14, textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>{'SUBMIT'}</Text>
                                                </TouchableOpacity>
                                            </Col>
                                        </Row>


                                    </Col>

                                </Row>
                            </View>

                        </View>
                    </Modal>

                </Content>
            </Container>
        )
    }
}

export default AvailableDoctors4Video

const styles = StyleSheet.create({

    docname: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        fontWeight: 'bold'
    },
    date: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: 'gray',
        marginLeft: 15,
        marginTop: 3
    },
    status: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: 'gray'
    },
    msg: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#fff',
        borderRadius: 50,
        backgroundColor: 'blue',
        width: '35%',
        textAlign: 'center'
    },
    msgStyle: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: 'blue',
    },
    circle: {
        width: 12,
        height: 12,
        borderRadius: 12 / 2,
        backgroundColor: 'green',
        position: 'absolute',
        marginLeft: 45,
        marginTop: 5
    },
    RowStyle: {
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 10,
        paddingBottom: 10
    },
    SubText: {
        color: '#FFF',
        fontFamily: 'OpenSans',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 20
    },
    SearchRow: {
        backgroundColor: 'white',
        borderColor: '#000',
        borderRadius: 20,
        height: 30,
        marginRight: 20,
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 20
    },
    inputfield: {
        color: 'gray',
        fontFamily: 'OpenSans',
        fontSize: 10,
        padding: 5,
        paddingLeft: 10
    },
    SearchStyle: {
        backgroundColor: primaryColor,
        width: '85%',
        alignItems: 'center',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        marginTop: 2,
        marginBottom: 2
    },
    dissableSearchStyle: {
        backgroundColor: 'gray',
        width: '85%',
        alignItems: 'center',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        marginTop: 2,
        marginBottom: 2
    },
    ButtonStyle: {
        textAlign: 'center',
        borderColor: '#5A89B6',
        borderWidth: 1,
        marginTop: 10,
        borderRadius: 20,
        height: 25,
        justifyContent: 'center',
        flexDirection: 'row',
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 2,
        paddingBottom: 2,
    },
    ButtonStyleSponsor: {
        textAlign: 'center',
        backgroundColor: '#8EC63F',
        borderColor: '#8EC63F',
        borderWidth: 1,
        marginTop: 10,
        justifyContent: 'center',
        borderRadius: 20,
        height: 25,

        flexDirection: 'row',
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 2,
        paddingBottom: 2,
    },
    SponsorText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 8,
        fontWeight: 'bold',
        fontFamily: 'OpenSans',
        marginTop: 4,
        marginLeft: 4,

    },
    TextStyle: {
        textAlign: 'center',
        color: '#5A89B6',
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'OpenSans',
        marginLeft: 4,
        marginTop: 4
    },
    reasonText: {
        fontFamily: 'Opensans',
        fontSize: 14,
        color: '#fff',
        marginLeft: 5
    },
    headerStyle: {
        backgroundColor: primaryColor,
        marginTop: -10,
        marginLeft: -10,
        marginRight: -10,
        alignItems: 'center',
        height: 30
    }

})