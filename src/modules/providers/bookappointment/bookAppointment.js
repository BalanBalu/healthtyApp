import { bookAppointment, createPaymentRazor } from './bookappointment.action';
import { updateChat } from '../chat/chat.action'
import { SERVICE_TYPES } from '../../../setup/config'
import { possibleChatStatus } from '../../../Constants/Chat'
export default class BookAppointmentPaymentUpdate {

  
  async updatePaymentDetails(isSuccess, razorPayRespData, modeOfPayment, bookSlotDetails, serviceType, userId, paymentMethod) {
    try {
        let paymentId = razorPayRespData.razorpay_payment_id ? razorPayRespData.razorpay_payment_id : modeOfPayment === 'cash' ? 'cash_' + new Date().getTime() : 'pay_err_' + new Date().getTime();
        let paymentData = null;
        if(serviceType === SERVICE_TYPES.APPOINTMENT) {
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
            console.log(resultData);
            if (resultData.success) {
                if (isSuccess) {
                    let bookAppointmentResponse = await this.updateNewBookAppointment(bookSlotDetails,  userId, paymentId);
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
        } else if(serviceType === SERVICE_TYPES.CHAT) {
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
        
    } catch (error) {
       return {
            message: error,
            success: false
        } 
    }
  }
 updateChatForApproval = async(chatId,  userId, paymentId, bookSlotDetails ) => {
   try {
    const request4InitiateChat = {
      user_id: userId,
      doctor_id: bookSlotDetails.doctorId,
      status: possibleChatStatus.PENDING,
    //description: Joi.string().optional(),
      status_by: 'USER',
      statusUpdateReason: 'BOOKING_HAS_DONE',
      payment_id: paymentId
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
        let bookAppointmentData = {
            userId: userId,
            doctorId: bookSlotDetails.doctorId,
            description: bookSlotDetails.diseaseDescription || '',
            fee: bookSlotDetails.slotData.fee,
            startTime: bookSlotDetails.slotData.slotStartDateAndTime,
            endTime: bookSlotDetails.slotData.slotEndDateAndTime,
            status: "PENDING",
            status_by: "USER",
            statusUpdateReason: "NEW_BOOKING",
            hospital_id: bookSlotDetails.slotData.location.hospital_id,
            booked_from: "Mobile",
            payment_id: paymentId
        }
        let resultData = await bookAppointment(bookAppointmentData);
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
}