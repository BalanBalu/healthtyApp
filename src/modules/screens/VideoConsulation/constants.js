import {translate} from '../../../setup/translator.helper';

export const POSSIBLE_VIDEO_CONSULTING_STATUS = {
    PAYMENT_IN_PROGRESS :translate('PAYMENT_IN_PROGRESS'),
    FAILED: translate('FAILED'),
    PENDING: translate('PENDING'),
    APPROVED: translate('APPROVED'),
    CANCELED: translate('CANCELED'),
    CLOSED: translate('CLOSED')
  }

  export const STATUS_VALUE_DATA = {
    PENDING: {
      text: translate("Waiting for the Doctor's Approval"),
      statusText: translate('Pending'),
      color: 'red',
      icon: 'ios-information-circle-outline',
      type: 'DOCTOR_REPORT_ISSUE_APPOINTMENT_PENDING'
    },
    APPROVED: {
      text: translate('Video Consultation Confirmed'),
      statusText: translate('Approved'),
      color: 'green',
      icon: 'checkmark-circle',
      type: 'DOCTOR_REPORT_ISSUE_APPOINTMENT_APPROVED',
    },
    COMPLETED: {
      text: translate('Video Consultation Resolved/ Completed'),
      statusText: translate('Completed'),
      color: 'green',
      icon: 'checkmark-circle',
      type: 'DOCTOR_REPORT_ISSUE_APPOINTMENT_COMPLETED'
    },
    CLOSED: {
      text: translate('No Response'),
      statusText: translate('Closed'),
      color: '#d43640',
      icon: 'ios-close-circle',
      type: 'DOCTOR_REPORT_ISSUE_APPOINTMENT_CANCELED'
      // icon: 'closecircleo'
    },
    CANCELED: {
      text: translate('Video Consultation Cancelled'),
      statusText: translate('Canceled'),
      color: '#d43640',
      icon: 'ios-close-circle',
      type: 'DOCTOR_REPORT_ISSUE_APPOINTMENT_CANCELED'
    },
    REJECTED: {
      text: translate('Video Consultation Rejected'),
      statusText: translate('Rejected'),
      color: '#d43640',
      icon: 'ios-close-circle',
      type: 'DOCTOR_REPORT_ISSUE_APPOINTMENT_CANCELED'
    },
    PAYMENT_IN_PROGRESS: {
        text: translate('Payment is not yet completed'),
        statusText: translate('Payment In Progress'),
        color: '#d43640',
        icon: 'ios-sync',
        type: 'DOCTOR_REPORT_ISSUE_APPOINTMENT_CANCELED'
      }
  }
  