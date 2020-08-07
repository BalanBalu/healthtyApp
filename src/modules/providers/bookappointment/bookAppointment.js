import { bookAppointment, createPaymentRazor, bookAppointment4Healthcare } from './bookappointment.action';
import { updateChat } from '../chat/chat.action'
import { createMedicineOrder, capturePayment, deletePrescriptionByUserId } from '../pharmacy/pharmacy.action'
import { SERVICE_TYPES } from '../../../setup/config'
import { possibleChatStatus } from '../../../Constants/Chat';
import { updateVideoConsuting, } from '../../screens/VideoConsulation/services/video-consulting-service'
import { POSSIBLE_VIDEO_CONSULTING_STATUS } from '../../screens/VideoConsulation/constants';
import { insertAppointment, updateLapAppointment } from '../lab/lab.action';
import { getMoment } from '../../../setup/helpers';
import { saveEvent } from '../../../setup/calendarEvent';
export default class BookAppointmentPaymentUpdate {


    async updatePaymentDetails(isSuccess, razorPayRespData, modeOfPayment, bookSlotDetails, serviceType, userId, paymentMethod) {
        debugger
        try {
            let paymentId = razorPayRespData.razorpay_payment_id ? razorPayRespData.razorpay_payment_id : modeOfPayment === 'cash' ? 'cash_' + new Date().getTime() : modeOfPayment === 'corporate' ? 'corporate_' + new Date().getTime() : modeOfPayment === 'insurance' ? 'insurance_' + new Date().getTime() : 'pay_err_' + new Date().getTime();
            let paymentData = null;
            if (serviceType === SERVICE_TYPES.APPOINTMENT) {
                paymentData = {
                    payer_id: userId,
                    payer_type: 'user',
                    payment_id: paymentId,
                    amount: bookSlotDetails.slotData.fee,
                    credit_point_discount_amount: bookSlotDetails.creditPointDiscountAmount,
                    coupon_code_discount_amount: bookSlotDetails.couponCodeDiscountAmount,
                    amount_paid: !isSuccess || modeOfPayment === 'cash' || modeOfPayment === 'corporate' || modeOfPayment === 'insurance' ? 0 : bookSlotDetails.finalAmountToPayByOnline,
                    amount_due: !isSuccess || modeOfPayment === 'cash' ? bookSlotDetails.slotData.fee : (modeOfPayment === 'corporate' || modeOfPayment === 'insurance') ? 0 : 0,
                    currency: 'INR',
                    service_type: serviceType,
                    booking_from: 'APPLICATION',
                    is_error: !isSuccess,
                    error_message: razorPayRespData.description || null,
                    payment_mode: modeOfPayment,
                    payment_method: paymentMethod
                }
                console.log(paymentData);
                let resultData = await createPaymentRazor(paymentData);
                console.log(resultData);
                if (resultData.success) {
                    if (isSuccess) {
                        let bookAppointmentResponse = await this.updateNewBookAppointment(bookSlotDetails, userId, paymentId);
                        return bookAppointmentResponse;
                    } else {
                        return {
                            message: razorPayRespData.description,
                            success: false,
                        };
                    }
                } else {
                    return {
                        message: resultData.message,
                        success: false
                    }
                }
            } else if (serviceType === SERVICE_TYPES.CHAT) {
                paymentData = {
                    payer_id: userId,
                    payer_type: 'user',
                    payment_id: paymentId,
                    amount: bookSlotDetails.fee,
                    amount_paid: !isSuccess || modeOfPayment === 'cash' ? 0 : bookSlotDetails.fee,
                    amount_due: !isSuccess || modeOfPayment === 'cash' ? bookSlotDetails.fee : 0,
                    currency: 'INR',
                    service_type: serviceType,
                    booking_from: 'APPLICATION',
                    is_error: !isSuccess,
                    error_message: razorPayRespData.description || null,
                    payment_mode: modeOfPayment,
                    payment_method: paymentMethod
                }
                let resultData = await createPaymentRazor(paymentData);
                console.log(resultData);
                if (resultData.success) {
                    const chatApprovalStatus = await this.updateChatForApproval(bookSlotDetails.chatId, userId, paymentId, bookSlotDetails)
                    return chatApprovalStatus
                } else {
                    return {
                        success: false,
                        message: resultData.message
                    }
                }
            }
            else if (serviceType === SERVICE_TYPES.PHARMACY) {
                paymentData = {
                    payer_id: userId,
                    payer_type: 'user',
                    payment_id: paymentId,
                    amount: bookSlotDetails.fee,
                    amount_paid: !isSuccess || modeOfPayment === 'cash' ? 0 : bookSlotDetails.fee,
                    amount_due: !isSuccess || modeOfPayment === 'cash' ? bookSlotDetails.fee : 0,
                    currency: 'INR',
                    service_type: serviceType,
                    booking_from: 'APPLICATION',
                    is_error: !isSuccess,
                    error_message: razorPayRespData.description || null,
                    payment_mode: modeOfPayment,
                    payment_method: paymentMethod
                }
                let resultData = await createPaymentRazor(paymentData);
                console.log(resultData);
                if (resultData.success) {
                    const orderResp = await this.createNewMedicineOrder(bookSlotDetails, userId, paymentId, isSuccess)
                    return orderResp
                } else {
                    console.log('Creating Orders Failed');
                    await this.createNewMedicineOrder(bookSlotDetails, userId, paymentId, isSuccess)
                    return {
                        success: false,
                        message: resultData.message
                    }
                }
            } else if (serviceType === SERVICE_TYPES.VIDEO_CONSULTING) {
                paymentData = {
                    payer_id: userId,
                    payer_type: 'user',
                    payment_id: paymentId,
                    amount: bookSlotDetails.fee,
                    amount_paid: !isSuccess || modeOfPayment === 'cash' ? 0 : bookSlotDetails.fee,
                    amount_due: !isSuccess || modeOfPayment === 'cash' ? bookSlotDetails.fee : 0,
                    currency: 'INR',
                    service_type: serviceType,
                    booking_from: 'APPLICATION',
                    is_error: !isSuccess,
                    error_message: razorPayRespData.description || null,
                    payment_mode: modeOfPayment,
                    payment_method: paymentMethod
                }
                let resultData = await createPaymentRazor(paymentData);
                console.log(resultData);
                if (resultData.success) {
                    const chatApprovalStatus = await this.updateVideoConsulting(bookSlotDetails.consultationId, userId, paymentId, bookSlotDetails, isSuccess)
                    return chatApprovalStatus
                } else {
                    return {
                        success: false,
                        message: resultData.message
                    }
                }
            } else if (serviceType === SERVICE_TYPES.LAB_TEST) {
                paymentData = {
                    payer_id: userId,
                    payer_type: 'user',
                    payment_id: paymentId,
                    amount: bookSlotDetails.fee,
                    amount_paid: !isSuccess || modeOfPayment === 'cash' ? 0 : bookSlotDetails.fee,
                    amount_due: !isSuccess || modeOfPayment === 'cash' ? bookSlotDetails.fee : 0,
                    currency: 'INR',
                    service_type: serviceType,
                    booking_from: 'APPLICATION',
                    is_error: !isSuccess,
                    error_message: razorPayRespData.description || null,
                    payment_mode: modeOfPayment,
                    payment_method: paymentMethod
                }
                let resultData = await createPaymentRazor(paymentData);
                console.log(resultData);
                if (resultData.success) {
                    const statusResponse = await this.updateNewBookLabTestAppointment(bookSlotDetails.labTestAppointmentId, bookSlotDetails, paymentId)
                    return statusResponse
                } else {
                    return {
                        success: false,
                        message: resultData.message
                    }
                }
            }
            else if (serviceType === SERVICE_TYPES.HOME_HEALTHCARE) {
                paymentData = {
                    payer_id: userId,
                    payer_type: 'user',
                    payment_id: paymentId,
                    amount: bookSlotDetails.slotData.fee,
                    credit_point_discount_amount: bookSlotDetails.creditPointDiscountAmount,
                    coupon_code_discount_amount: bookSlotDetails.couponCodeDiscountAmount,
                    amount_paid: !isSuccess || modeOfPayment === 'cash' ? 0 : bookSlotDetails.finalAmountToPayByOnline,
                    amount_due: !isSuccess || modeOfPayment === 'cash' ? bookSlotDetails.slotData.fee : 0,
                    currency: 'INR',
                    service_type: serviceType,
                    booking_from: 'APPLICATION',
                    is_error: !isSuccess,
                    error_message: razorPayRespData.description || null,
                    payment_mode: modeOfPayment,
                    payment_method: paymentMethod
                }
                let resultData = await createPaymentRazor(paymentData);
                if (resultData.success) {
                    if (isSuccess) {
                        let bookAppointmentResponse = await this.updateNewHomeHealthcareBookAppointment(bookSlotDetails, userId, paymentId);
                        return bookAppointmentResponse;
                    } else {
                        return {
                            message: razorPayRespData.description,
                            success: false,
                        };
                    }
                } else {
                    return {
                        message: resultData.message,
                        success: false
                    }
                }
            }

        } catch (error) {
            return {
                message: error,
                success: false
            }
        }
    }
    updateChatForApproval = async (chatId, userId, paymentId, bookSlotDetails) => {
        try {
            const request4InitiateChat = {
                user_id: userId,
                doctor_id: bookSlotDetails.doctorId,
                status: possibleChatStatus.PENDING,
                //description: Joi.string().optional(),
                status_by: 'USER',
                statusUpdateReason: 'BOOKING_HAS_DONE',
                payment_id: paymentId,
            }

            let resultData = await updateChat(chatId, request4InitiateChat);
            console.log(resultData)
            if (resultData.success) {
                return {
                    message: resultData.message,
                    success: true,
                }
            } else {
                return {
                    message: resultData.message,
                    success: false,
                }
            }
        } catch (ex) {
            return {
                message: 'Exception Occured ' + ex,
                success: false,
            }
        }
    }
    async updateNewBookAppointment(bookSlotDetails, userId, paymentId) {
        try {

            let slotStartDateAndTime = getMoment(bookSlotDetails.slotData.slotStartDateAndTime).toISOString();
            let slotEndDateAndTime = getMoment(bookSlotDetails.slotData.slotEndDateAndTime).toISOString();
            let Address = bookSlotDetails.slotData.location.city || bookSlotDetails.slotData.location.district

            let eventId = await saveEvent("Appointment booked with " + bookSlotDetails.slotData.location.name + " " + bookSlotDetails.slotData.location.type, slotStartDateAndTime, slotEndDateAndTime, Address, bookSlotDetails.diseaseDescription);

            let bookAppointmentData = {
                userId: userId,
                user_appointment_event_id: eventId,
                patient_data: bookSlotDetails.patient_data,
                description: bookSlotDetails.diseaseDescription || '',
                fee: bookSlotDetails.slotData.fee,
                startTime: bookSlotDetails.slotData.slotStartDateAndTime,
                endTime: bookSlotDetails.slotData.slotEndDateAndTime,
                status: "PENDING",
                status_by: "USER",
                statusUpdateReason: "NEW_BOOKING",
                booked_from: "Mobile",
                payment_id: paymentId
            }
            if (bookSlotDetails.doctorId) {
                bookAppointmentData.doctorId = bookSlotDetails.doctorId
                bookAppointmentData.hospital_id= bookSlotDetails.slotData.location.hospital_id
            }
            if(bookSlotDetails.slotData.category_id){
                bookAppointmentData.category_id=bookSlotDetails.slotData.category_id
            }
            if(bookSlotDetails.hospital_admin_id){
                bookAppointmentData.hospital_admin_id = bookSlotDetails.hospital_admin_id

            }
            if(bookSlotDetails.slotData.booked_for){
                bookAppointmentData.booked_for=bookSlotDetails.slotData.booked_for
            }
           
            let resultData = await bookAppointment(bookAppointmentData);
            console.log(resultData)
            if (resultData.success) {
                return {
                    message: resultData.message,
                    success: true,
                    tokenNo: resultData.tokenNo
                }
            } else {
                return {
                    message: resultData.message,
                    success: false,
                }
            }
        } catch (ex) {
            return {
                message: 'Exception Occured ' + ex,
                success: false,
            }
        }
    }
    async updateNewHomeHealthcareBookAppointment(bookSlotDetails, userId, paymentId) {
        try {
            let bookAppointmentData = {
                userId: userId,
                patient_data: bookSlotDetails.patient_data,
                doctorId: bookSlotDetails.doctorId,
                fee: bookSlotDetails.slotData.fee,
                appointment_date: bookSlotDetails.slotData.slotDate,
                status: "PENDING",
                status_by: "USER",
                statusUpdateReason: "NEW_BOOKING",
                booked_from: "Mobile",
                payment_id: paymentId
            }
            if (bookSlotDetails.diseaseDescription) bookAppointmentData.description = bookSlotDetails.diseaseDescription;
            let resultData = await bookAppointment4Healthcare(bookAppointmentData);
            if (resultData.success) {
                return {
                    message: resultData.message,
                    success: true,
                    tokenNo: resultData.tokenNo
                }
            } else {
                return {
                    message: resultData.message,
                    success: false,
                }
            }
        } catch (ex) {
            return {
                message: 'Exception Occured ' + ex,
                success: false,
            }
        }
    }
    async createNewMedicineOrder(orderData, userId, paymentId, isSuccess) {
        try {
            debugger
            let requestData = {
                userId: userId,
                totalAmount: orderData.totalAmount,
                status: isSuccess ? 'PENDING' : 'FAILED',
                paymentId: paymentId,
                items: orderData.medicineDetails || [],
                deliveryType: orderData.deliveryType,
                delivery_address: orderData.delivery_address,
            }
            if (orderData.deliveryType === 1) {
                console.log('deliveryCharges')
                // delete requestData.delivery_tax
                // delete requestData.delivery_charges
            } if (orderData.prescriptions) {
                requestData.prescriptions = orderData.prescriptions

                delete requestData.items
            }
            if (orderData.is_order_type_recommentation === false) {
                delete requestData.recommentation_pharmacy_data
            }

            if (orderData.pharmacyId) {

                requestData.pharmacyId = orderData.pharmacyId
            }
            let resultData = await createMedicineOrder(requestData);
            console.log('resultData create order result==================')
            console.log(resultData)
            if (resultData) {
                capturePayment(paymentId)
                if (orderData.prescriptions) {
                    deletePrescriptionByUserId(userId)


                }
                return {
                    message: 'order created sucessfully',
                    success: isSuccess,
                    orderNo: resultData
                }
            } else {
                return {
                    message: 'order failed try again',
                    success: false,
                }
            }
        } catch (ex) {
            return {
                message: 'Exception Occured ' + ex,
                success: false,
            }
        }
    }

    updateVideoConsulting = async (consultationId, userId, paymentId, bookSlotDetails, isSuccess) => {
        debugger
        try {
            const request4InitiateChat = {
                user_id: userId,
                doctor_id: bookSlotDetails.doctorId,
                status: isSuccess ? POSSIBLE_VIDEO_CONSULTING_STATUS.PENDING : POSSIBLE_VIDEO_CONSULTING_STATUS.FAILED,
                description: isSuccess ? 'Your Request will notified to Doctor. you will get a Call from Doctor within 15 minutes' : 'Payment Failed. Please try again.',
                status_by: 'USER',
                statusUpdateReason: 'Payment has been done',
                payment_id: paymentId,
            }
            let resultData = await updateVideoConsuting(consultationId, request4InitiateChat);
            console.log(resultData)
            if (resultData.success) {
                return {
                    message: resultData.message,
                    success: true,
                }
            } else {
                return {
                    message: resultData.message,
                    success: false,
                }
            }
        } catch (ex) {
            return {
                message: 'Exception Occured ' + ex,
                success: false,
            }
        }
    }

    updateNewBookLabTestAppointment = async (labTestAppointmentId, appointmentData, paymentId) => {
        debugger
        let resultData = {};
        if (labTestAppointmentId) {
            const createAppointmentData = {
                userId: appointmentData.user_id,
                labId: appointmentData.lab_id,
                status: 'PENDING',
                status_by: 'USER',
                startTime: appointmentData.startTime,
                endTime: appointmentData.endTime,
                statusUpdateReason: 'NEW BOOKING',
                payment_id: paymentId,
                booked_from: 'MOBILE',

            }
            console.log(createAppointmentData);
            resultData = await updateLapAppointment(labTestAppointmentId, createAppointmentData);

        } else {
            // Create Appointment in case of cash
            const createAppointmentData = {
                ...appointmentData,
                payment_id: paymentId
            }
            resultData = await insertAppointment(createAppointmentData);
        }
        console.log(resultData)
        if (resultData.success) {
            return {
                message: resultData.message,
                success: true,
                tokenNo: resultData.tokenNo
            }
        } else {
            return {
                message: resultData.message,
                success: false,
            }
        }

    }
}
